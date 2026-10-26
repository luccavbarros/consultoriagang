/* Client accounts, admin only (Vercel serverless function)
   Creating, disabling or deleting a login needs Supabase's service_role key, which must never reach the browser,
   so the admin panel calls this function and it checks the caller is an active admin first.
   Environment variables on Vercel: SUPABASE_SERVICE_ROLE_KEY (required), SUPABASE_URL (optional) */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zciglalkvmnoleevnuei.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (path, init = {}) => fetch(SUPABASE_URL + path, {
  ...init,
  headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', ...(init.headers || {}) },
});

const fail = (res, status, error) => res.status(status).json({ error });
const isUuid = (v) => typeof v === 'string' && /^[0-9a-f-]{36}$/i.test(v);

// who is calling: their session token → their user → their profile
const caller = async (req) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
  if (!u.ok) return null;
  const user = await u.json();
  const p = await sb('/rest/v1/profiles?select=role,active&id=eq.' + user.id);
  const [profile] = p.ok ? await p.json() : [];
  return profile && profile.role === 'admin' && profile.active ? user : null;
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!KEY) return fail(res, 500, 'Falta configurar a SUPABASE_SERVICE_ROLE_KEY no Vercel.');

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return fail(res, 400, 'Pedido inválido.'); } }

  const admin = await caller(req);
  if (!admin) return fail(res, 403, 'Sem permissão.');

  const { action } = body;
  if (action !== 'create' && (!isUuid(body.id) || body.id === admin.id)) return fail(res, 400, 'Conta inválida.');

  if (action === 'create') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail(res, 400, 'E-mail inválido.');
    if (password.length < 8) return fail(res, 400, 'A senha precisa ter pelo menos 8 caracteres.');
    const r = await sb('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email, password, email_confirm: true,
        user_metadata: { name: String(body.name || '').slice(0, 120), company: String(body.company || '').slice(0, 120) },
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return fail(res, 400, /already|exists|registered/i.test(t) ? 'Já existe um acesso com este e-mail.' : 'Não foi possível criar o acesso.');
    }
    return res.status(200).json({ ok: true });
  }

  if (action === 'set_active') {
    const active = !!body.active;
    // a disabled account can't sign in (ban) and the pages also check the flag
    const a = await sb('/auth/v1/admin/users/' + body.id, { method: 'PUT', body: JSON.stringify({ ban_duration: active ? 'none' : '876000h' }) });
    const p = await sb('/rest/v1/profiles?id=eq.' + body.id, { method: 'PATCH', body: JSON.stringify({ active }) });
    if (!a.ok || !p.ok) return fail(res, 502, 'Não foi possível alterar o acesso.');
    return res.status(200).json({ ok: true });
  }

  if (action === 'set_password') {
    const password = String(body.password || '');
    if (password.length < 8) return fail(res, 400, 'A senha precisa ter pelo menos 8 caracteres.');
    const r = await sb('/auth/v1/admin/users/' + body.id, { method: 'PUT', body: JSON.stringify({ password }) });
    if (!r.ok) return fail(res, 502, 'Não foi possível alterar a senha.');
    return res.status(200).json({ ok: true });
  }

  if (action === 'delete') {
    const r = await sb('/auth/v1/admin/users/' + body.id, { method: 'DELETE' });
    if (!r.ok) return fail(res, 502, 'Não foi possível excluir o acesso.');
    return res.status(200).json({ ok: true }); // the profile goes with it (on delete cascade)
  }

  return fail(res, 400, 'Ação desconhecida.');
};
