/* Shared by login, admin and client pages: Supabase client, profile lookup and page guards */
(() => {
  const cfg = window.GANG_SUPABASE || {};
  const ready = cfg.url && cfg.anonKey && !cfg.anonKey.startsWith('COLE_AQUI');
  const sb = ready ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

  const HOME = { admin: 'admin.html', client: 'cliente.html' };

  // a saved session whose account no longer exists (deleted, or a stale login) is cleared, so pages fall back to the login form
  const getProfile = async () => {
    try {
      const { data: { session } } = await sb.auth.getSession();
      if (!session || !session.user) { if (session) await sb.auth.signOut({ scope: 'local' }); return null; }
      const { data } = await sb.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      if (!data) { await sb.auth.signOut({ scope: 'local' }); return null; }
      return data;
    } catch (e) {
      try { await sb.auth.signOut({ scope: 'local' }); } catch (e2) { /* nothing saved to clear */ }
      return null;
    }
  };

  // keeps each page to its own people: no session → login; wrong role → their own area; disabled → out
  const guard = async (role) => {
    if (!sb) return null;
    const profile = await getProfile();
    if (!profile) { location.replace('login.html'); return null; }
    if (!profile.active) { await sb.auth.signOut(); location.replace('login.html?off=1'); return null; }
    if (profile.role !== role) { location.replace(HOME[profile.role] || 'login.html'); return null; }
    document.documentElement.classList.add('is-ready');
    return profile;
  };

  const signOut = async () => { await sb.auth.signOut(); location.replace('login.html'); };

  // pages show this instead of a blank screen while the anon key is still missing
  const notConfigured = (el) => {
    el.innerHTML = '<p class="app-note">Falta colar a chave anon do Supabase em <code>app/config.js</code>.</p>';
    document.documentElement.classList.add('is-ready');
  };

  // account changes need the service key, so the panel calls our own server function, which checks you are the admin
  const adminApi = async (body) => {
    const { data: { session } } = await sb.auth.getSession();
    const r = await fetch('/api/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (session ? session.access_token : '') },
      body: JSON.stringify(body),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(out.error || 'Não deu certo. Tente de novo.');
    return out;
  };

  const randomPass = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from(crypto.getRandomValues(new Uint32Array(12)), (b) => chars[b % chars.length]).join('');
  };

  window.GangAuth = { sb, ready, HOME, getProfile, guard, signOut, notConfigured, adminApi, randomPass };
})();
