// netlify/functions/_skylink-auth.js
//
// Shared helper: logs in to SkyLink and caches the access token in memory
// for the lifetime of the function container (saves calling /login on
// every single search/pricing/reserve request, and keeps you under the
// 10/minute rate limit on /login).
//
// NOTE: Netlify Functions are stateless between cold starts, so this cache
// is best-effort, not guaranteed. If a request comes in on a fresh
// container, it will just log in again — that's fine and expected.

const SKYLINK_BASE_URL = process.env.SKYLINK_BASE_URL || 'https://247travels.cloud/api';
const SKYLINK_EMAIL = process.env.SKYLINK_EMAIL;
const SKYLINK_PASSWORD = process.env.SKYLINK_PASSWORD;

let cachedToken = null;   // { access_token, expires_at (ms epoch) }

async function login() {
  if (!SKYLINK_EMAIL || !SKYLINK_PASSWORD) {
    throw new Error(
      'Missing SKYLINK_EMAIL or SKYLINK_PASSWORD environment variables. ' +
      'Set these in Netlify: Site settings > Environment variables.'
    );
  }

  const res = await fetch(`${SKYLINK_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: SKYLINK_EMAIL,
      password: SKYLINK_PASSWORD,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    const code = data?.code || 'UNKNOWN_ERROR';
    throw new Error(`SkyLink login failed: ${code} — ${data?.message || res.statusText}`);
  }

  const { access_token, expires_in } = data.data;

  // Refresh 60 seconds before actual expiry to avoid mid-request 401s.
  const expiresAt = Date.now() + (expires_in - 60) * 1000;

  cachedToken = { access_token, expires_at: expiresAt };
  return cachedToken.access_token;
}

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }
  return login();
}

// Wrapper that calls a SkyLink endpoint with a valid bearer token, and
// retries ONCE if the token turns out to be expired/invalid (401).
async function skylinkFetch(path, options = {}) {
  let token = await getAccessToken();

  const doFetch = (bearer) =>
    fetch(`${SKYLINK_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearer}`,
        ...(options.headers || {}),
      },
    });

  let res = await doFetch(token);

  if (res.status === 401) {
    // Token expired/invalid mid-flight — force a fresh login and retry once.
    cachedToken = null;
    token = await getAccessToken();
    res = await doFetch(token);
  }

  return res;
}

module.exports = { skylinkFetch, SKYLINK_BASE_URL };
