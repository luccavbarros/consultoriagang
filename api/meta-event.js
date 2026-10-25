/* Meta Conversions API (Vercel serverless function)
   The browser sends Lead / Contact here too, so Meta still gets them when the Pixel is blocked.
   Same event_id as the Pixel, so Meta counts each one once.
   Environment variables on Vercel: META_CAPI_TOKEN (required), META_PIXEL_ID (optional) */
const crypto = require('crypto');

const PIXEL_ID = process.env.META_PIXEL_ID || '398840463638938';
const GRAPH_VERSION = 'v23.0';
const ALLOWED = new Set(['Lead', 'Contact']);

const sha = (v) => crypto.createHash('sha256').update(v).digest('hex');
const clean = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : '');

// Brazilian numbers: keep digits and add the country code
const phone = (v) => {
  const d = String(v || '').replace(/\D/g, '');
  if (!d) return '';
  return d.length <= 11 ? '55' + d : d;
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return res.status(204).end(); // not set up yet: the Pixel keeps working alone

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return res.status(400).end(); } }
  const { event_name, event_id, event_source_url, fbp, fbc } = body;
  const user = body.user && typeof body.user === 'object' ? body.user : {};
  if (!ALLOWED.has(event_name) || typeof event_id !== 'string' || event_id.length > 100) return res.status(400).end();

  const user_data = {
    client_ip_address: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
    client_user_agent: req.headers['user-agent'],
    fbp: typeof fbp === 'string' ? fbp : undefined,
    fbc: typeof fbc === 'string' ? fbc : undefined,
    country: [sha('br')],
  };
  const email = clean(user.email);
  if (email) user_data.em = [sha(email)];
  const ph = phone(user.phone);
  if (ph) user_data.ph = [sha(ph)];
  const names = clean(user.name).split(/\s+/).filter(Boolean);
  if (names.length) user_data.fn = [sha(names[0])];
  if (names.length > 1) user_data.ln = [sha(names[names.length - 1])];

  const payload = {
    data: [{
      event_name,
      event_id,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: typeof event_source_url === 'string' ? event_source_url : undefined,
      user_data,
    }],
  };

  try {
    const r = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) console.error('Meta CAPI', r.status, await r.text());
    return res.status(r.ok ? 204 : 502).end();
  } catch (err) {
    console.error('Meta CAPI', err);
    return res.status(502).end();
  }
};
