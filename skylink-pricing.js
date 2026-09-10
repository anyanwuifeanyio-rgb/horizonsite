// netlify/functions/skylink-pricing.js
//
// Proxies POST /api/skylink/pricing  ->  SkyLink POST /flights/pricing
//
// IMPORTANT: always call this immediately before reserve, and always use
// the booking_token THIS response returns (not the one from /search) on
// the subsequent /reserve call. The frontend is responsible for storing
// and forwarding the freshest token — this function just proxies through.

const { skylinkFetch } = require('./_skylink-auth');

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

  if (!body.booking_token || !body.passengers) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: 'Missing required field(s): booking_token, passengers',
      }),
    };
  }

  try {
    const res = await skylinkFetch('/flights/pricing', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await res.json();

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
        message: 'Failed to reach SkyLink pricing endpoint.',
        error: err.message,
      }),
    };
  }
};
