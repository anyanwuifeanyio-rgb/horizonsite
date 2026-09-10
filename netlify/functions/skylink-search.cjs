// netlify/functions/skylink-search.js
//
// Proxies POST /api/skylink/search  ->  SkyLink POST /flights/search
//
// Frontend should call this exactly like it currently calls
// /api/skylink/search — same method, same body shape.

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

  // Basic guardrails so bad frontend state fails fast with a clear message
  // instead of a confusing 400 from SkyLink itself.
  const required = ['search_mode', 'flight_type', 'adults'];
  const missing = required.filter((f) => body[f] === undefined || body[f] === null);
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
    const res = await skylinkFetch('/flights/search', {
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
        message: 'Failed to reach SkyLink search endpoint.',
        error: err.message,
      }),
    };
  }
};
