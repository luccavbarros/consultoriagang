/* Shared by login, admin and client pages: Supabase client, profile lookup and page guards */
(() => {
  const cfg = window.GANG_SUPABASE || {};
  const ready = cfg.url && cfg.anonKey && !cfg.anonKey.startsWith('COLE_AQUI');
  const sb = ready ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

  const HOME = { admin: 'admin.html', client: 'cliente.html' };

  const getProfile = async () => {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return null;
    const { data } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
    return data;
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

  window.GangAuth = { sb, ready, HOME, getProfile, guard, signOut, notConfigured };
})();
