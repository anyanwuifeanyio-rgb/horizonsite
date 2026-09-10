// netlify/functions/paystack-verify.cjs
//
// Proxies GET /api/paystack/verify/:reference -> Paystack's real verify endpoint.
// This is the ONLY trustworthy way to confirm a payment actually succeeded --
// never trust a "success" reported by the browser alone, since that can be
// faked or interrupted. This function calls Paystack directly using the
// SECRET key (which must never appear in frontend code) and returns exactly
// what Paystack says happened.

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ status: false, message: 'Method not allowed' }),
    };
  }

  if (!PAYSTACK_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: false,
        message: 'Missing PAYSTACK_SECRET_KEY environment variable. Set this in Netlify: Site settings > Environment variables.',
      }),
    };
  }

  // The reference arrives as the last part of the path, e.g.
  // /api/paystack/verify/PSTK_FLIGHT_ABC123_456789
  const pathParts = event.path.split('/').filter(Boolean);
  const reference = decodeURIComponent(pathParts[pathParts.length - 1] || '');

  if (!reference) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: false, message: 'Missing transaction reference' }),
    };
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    // Pass through exactly what Paystack says. data.data.status will be
    // 'success', 'failed', or 'abandoned' -- the frontend must check this
    // explicitly and never assume success.
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({
        status: false,
        message: 'Failed to reach Paystack verification endpoint.',
        error: err.message,
      }),
    };
  }
};
