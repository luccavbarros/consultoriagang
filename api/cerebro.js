/* O cérebro da GANG (respostas prontas e biblioteca de ações) só para consultores.
   O conteúdo fica em api/_cerebro.js, fora das páginas públicas; esta função confere que quem pede é um consultor ativo
   e só então devolve o conteúdo. Variáveis no Vercel: SUPABASE_SERVICE_ROLE_KEY (a mesma do admin-users) e SUPABASE_URL (opcional). */
const fs = require('fs');
const path = require('path');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zciglalkvmnoleevnuei.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cache = null;
const cerebro = () => (cache = cache || fs.readFileSync(path.join(__dirname, '_cerebro.js'), 'utf8'));

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') return res.status(405).end();
  if (!KEY) return res.status(500).send('// falta a SUPABASE_SERVICE_ROLE_KEY no Vercel');
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).send('// sem sessão');
  const u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
  if (!u.ok) return res.status(401).send('// sessão inválida');
  const user = await u.json();
  const p = await fetch(SUPABASE_URL + '/rest/v1/profiles?select=role,active&id=eq.' + user.id, {
    headers: { apikey: KEY, ...(/^eyJ/.test(KEY) ? { Authorization: 'Bearer ' + KEY } : {}) },
  });
  const [perfil] = p.ok ? await p.json() : [];
  if (!perfil || perfil.role !== 'admin' || !perfil.active) return res.status(403).send('// só consultores');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  return res.status(200).send(cerebro());
};
