import { UserProfile } from '../types';
import { sendAccountWelcomeEmail, sendPasswordResetEmail } from './emailService';

const AUTH_STORAGE_KEY = 'horizon_client_current_user';
const USERS_STORAGE_KEY = 'horizon_registered_accounts';

interface StoredAccount {
  user: UserProfile;
  passwordHash: string; // Plain/simple hash for demonstration
}

const DEFAULT_DEMO_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      id: 'usr-demo-1',
      fullName: 'Ifeanyi Anyanwu',
      email: 'anyanwuifeanyio@gmail.com',
      phone: '+2348123458900',
      passportNumber: 'A12948201',
      nationality: 'Nigerian (NG)',
      memberTier: 'Gold VIP',
      createdAt: '2026-08-15T10:00:00.000Z'
    },
    passwordHash: 'password123'
  },
  {
    user: {
      id: 'usr-demo-2',
      fullName: 'Blessing Adeleke',
      email: 'blessing.adeleke@gmail.com',
      phone: '+2348055566778',
      passportNumber: 'B99382104',
      nationality: 'Nigerian (NG)',
      memberTier: 'Standard',
      createdAt: '2026-09-01T12:00:00.000Z'
    },
    passwordHash: 'password123'
  }
];

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_ACCOUNTS));
      return DEFAULT_DEMO_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_ACCOUNTS;
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts:', err);
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginUser(email: string, password: string): { success: boolean; user?: UserProfile; message?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const accounts = getStoredAccounts();
  const matched = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);

  if (!matched) {
    return { success: false, message: 'No account found with this email address. Please register.' };
  }

  if (matched.passwordHash !== cleanPass) {
    return { success: false, message: 'Incorrect password. Please verify your credentials or use the password reset link.' };
  }

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched.user));
    window.dispatchEvent(new CustomEvent('horizon_auth_changed', { detail: matched.user }));
  } catch (err) {
    console.error('Failed to store session:', err);
  }

  return { success: true, user: matched.user };
}

export function registerUser(params: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  passportNumber?: string;
  nationality?: string;
}): { success: boolean; user?: UserProfile; message?: string } {
  const cleanEmail = params.email.trim().toLowerCase();
  const accounts = getStoredAccounts();

  if (accounts.some(a => a.user.email.toLowerCase() === cleanEmail)) {
    return { success: false, message: 'An account with this email already exists. Please log in.' };
  }

  const newUser: UserProfile = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fullName: params.fullName.trim(),
    email: cleanEmail,
    phone: params.phone.trim(),
    passportNumber: params.passportNumber?.trim() || '',
    nationality: params.nationality?.trim() || 'Nigerian (NG)',
    memberTier: 'Standard',
    createdAt: new Date().toISOString()
  };

  const newAccount: StoredAccount = {
    user: newUser,
    passwordHash: params.password.trim()
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new CustomEvent('horizon_auth_changed', { detail: newUser }));
  } catch (err) {
    console.error('Failed to store new session:', err);
  }

  // Safely trigger account welcome email via Resend without blocking registration
  sendAccountWelcomeEmail({
    email: newUser.email,
    fullName: newUser.fullName,
    accountId: newUser.id,
    memberTier: newUser.memberTier,
    phone: newUser.phone
  }).catch((err) => {
    console.warn('Welcome email non-blocking dispatch note:', err);
  });

  return { success: true, user: newUser };
}

export function requestPasswordReset(email: string): { success: boolean; resetCode?: string; message: string } {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  const matched = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);
  if (!matched) {
    return { success: false, message: 'No registered client account found with this email address.' };
  }

  // Generate 6-digit verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const resetPayload = {
      email: cleanEmail,
      code: resetCode,
      expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
    };
    localStorage.setItem(`horizon_reset_${cleanEmail}`, JSON.stringify(resetPayload));
  } catch (err) {
    console.error('Failed to save reset payload:', err);
  }

  // Safely trigger password reset email via Resend without blocking
  sendPasswordResetEmail({
    email: cleanEmail,
    fullName: matched.user.fullName,
    resetCode,
    expiryMinutes: 30
  }).catch((err) => {
    console.warn('Password reset email non-blocking dispatch note:', err);
  });

  return { 
    success: true, 
    resetCode, 
    message: `A 6-digit password reset verification code has been dispatched to ${cleanEmail}.` 
  };
}

export function verifyAndResetPassword(email: string, code: string, newPassword: string): { success: boolean; message: string } {
  const cleanEmail = email.trim().toLowerCase();
  const raw = localStorage.getItem(`horizon_reset_${cleanEmail}`);
  if (!raw) {
    return { success: false, message: 'No active password reset request found. Please request a new code.' };
  }

  try {
    const payload = JSON.parse(raw);
    if (Date.now() > payload.expiresAt) {
      localStorage.removeItem(`horizon_reset_${cleanEmail}`);
      return { success: false, message: 'Your reset code has expired. Please request a new code.' };
    }
    if (payload.code !== code.trim()) {
      return { success: false, message: 'Invalid verification code. Please check your email and retry.' };
    }

    const accounts = getStoredAccounts();
    const idx = accounts.findIndex(a => a.user.email.toLowerCase() === cleanEmail);
    if (idx !== -1) {
      accounts[idx].passwordHash = newPassword.trim();
      saveStoredAccounts(accounts);
      localStorage.removeItem(`horizon_reset_${cleanEmail}`);
      return { success: true, message: 'Password updated successfully! You can now sign in.' };
    }
    return { success: false, message: 'Account not found.' };
  } catch {
    return { success: false, message: 'Could not process password reset.' };
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    ...updates,
    id: current.id, // Never change ID
    email: updates.email ? updates.email.trim().toLowerCase() : current.email
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    // Also update in accounts list
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex(a => a.user.id === current.id);
    if (idx !== -1) {
      accounts[idx].user = updated;
      saveStoredAccounts(accounts);
    }
    window.dispatchEvent(new CustomEvent('horizon_auth_changed', { detail: updated }));
  } catch (err) {
    console.error('Failed to update profile:', err);
  }

  return updated;
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('horizon_auth_changed', { detail: null }));
  } catch (err) {
    console.error('Logout error:', err);
  }
}
