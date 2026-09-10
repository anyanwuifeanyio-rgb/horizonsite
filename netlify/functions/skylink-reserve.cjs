// netlify/functions/skylink-reserve.js
//
// Proxies POST /api/skylink/reserve  ->  SkyLink POST /flights/reserve
//
// !! PAYMENT NOTICE (per SkyLink Terms of Service) !!
// This endpoint generates a LIVE, CONFIRMED airline PNR immediately and
// unconditionally on every valid request — there is no payment gate on
// SkyLink's side. Your own frontend/checkout flow MUST have already
// collected and confirmed full payment from the end user before this
// function is ever called. Calling this without prior payment collection
// is a breach of SkyLink's ToS and can result in suspended API access and
// recovery of costs. Make sure your checkout logic sits in front of this
// function, not after it.

const { skylinkFetch } = require('./_skylink-auth.cjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Invalid JSON body' }),
    };
  }

  const required = ['booking_token', 'travellers', 'passengers'];
  const missing = required.filter((f) => !body[f]);
  if (missing.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`,
      }),
    };
  }

  try {
    const res = await skylinkFetch('/flights/reserve', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // SkyLink returns 403 + blocked:true for PNR restrictions — pass that
    // straight through so the frontend can show data.message to the user
    // instead of a generic error.
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({
        success: false,
        message: 'Failed to reach SkyLink reserve endpoint.',
        error: err.message,
      }),
    };
  }
};
