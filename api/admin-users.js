/* Client accounts, admin only (Vercel serverless function)
   Creating, disabling or deleting a login needs Supabase's service_role key, which must never reach the browser,
   so the admin panel calls this function and it checks the caller is an active admin first.
   Environment variables on Vercel: SUPABASE_SERVICE_ROLE_KEY (required), SUPABASE_URL (optional) */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zciglalkvmnoleevnuei.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (path, init = {}) => fetch(SUPABASE_URL + path, {
  ...init,
  // the new secret key (sb_secret_…) goes only in apikey; the legacy service_role key (a JWT) also goes in Authorization
  headers: { apikey: KEY, ...(/^eyJ/.test(KEY || '') ? { Authorization: 'Bearer ' + KEY } : {}), 'Content-Type': 'application/json', ...(init.headers || {}) },
});

const fail = (res, status, error) => res.status(status).json({ error });
const isUuid = (v) => typeof v === 'string' && /^[0-9a-f-]{36}$/i.test(v);

// who is calling: their session token → their user → their profile
// returns { user } or { error } with the exact reason, so a wrong key on Vercel is easy to spot
const caller = async (req) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: 'Sessão não enviada. Saia e entre de novo.' };
  const u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
  if (!u.ok) return { error: 'A chave SUPABASE_SERVICE_ROLE_KEY no Vercel não é deste projeto do Supabase (ou a sessão expirou: saia e entre de novo).' };
  const user = await u.json();
  const p = await sb('/rest/v1/profiles?select=role,active&id=eq.' + user.id);
  if (!p.ok) return { error: 'A chave SUPABASE_SERVICE_ROLE_KEY no Vercel não foi aceita. Use a Secret key do projeto.' };
  const [profile] = await p.json();
  if (!profile) return { error: 'A chave no Vercel não é a Secret key: ela não enxerga os perfis. Troque pela Secret key e faça Redeploy.' };
  if (profile.role !== 'admin') return { error: 'Sem permissão: esta conta não é de consultor.' };
  if (!profile.active) return { error: 'Sem permissão: esta conta está desativada.' };
  return { user };
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!KEY) return fail(res, 500, 'Falta configurar a SUPABASE_SERVICE_ROLE_KEY no Vercel.');

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return fail(res, 400, 'Pedido inválido.'); } }

  const quem = await caller(req);
  if (quem.error) return fail(res, 403, quem.error);
  const admin = quem.user;

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
    // the new login belongs to the company the panel just created (the caller was checked as admin above)
    if (isUuid(body.empresa_id)) {
      const user = await r.json().catch(() => ({}));
      const id = user.id || (user.user && user.user.id);
      const p = id ? await sb('/rest/v1/profiles?id=eq.' + id, { method: 'PATCH', body: JSON.stringify({ empresa_id: body.empresa_id }) }) : null;
      if (!p || !p.ok) return fail(res, 502, 'O acesso foi criado, mas não foi ligado à empresa. Use “Vincular acesso existente” na página da empresa.');
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
