/* Pagamento do acesso à plataforma pelo Pagar.me (função do Vercel).
   - POST { acao: 'criar', ciclo, metodo }   o cliente logado escolhe o plano: cria a cobrança e o link de pagamento do Pagar.me
                                             (página hospedada por eles: o cartão nunca passa por aqui) e devolve o endereço.
   - POST ?t=<PAGARME_WEBHOOK_TOKEN>         o aviso do Pagar.me. Não confia no que chega: busca a cobrança direto no Pagar.me
                                             e só libera o acesso se ela estiver paga, uma vez por cobrança.
   Variáveis no Vercel: PAGARME_SECRET_KEY (sk_test_… para testar, sk_… em produção), PAGARME_WEBHOOK_TOKEN (uma senha longa
   qualquer, a mesma colocada no endereço do webhook no painel do Pagar.me), SUPABASE_SERVICE_ROLE_KEY (já existe).
   Opcional: PAGARME_API_URL (se o Pagar.me indicar outro endereço para o ambiente de teste), SITE_URL. */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zciglalkvmnoleevnuei.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PM_KEY = process.env.PAGARME_SECRET_KEY || '';
const PM_URL = process.env.PAGARME_API_URL || (/^sk_test_/.test(PM_KEY) ? 'https://sdx-api.pagar.me/core/v5' : 'https://api.pagar.me/core/v5');
const SITE = process.env.SITE_URL || 'https://www.gangconsultoria.com.br';
const CICLOS = { mensal: 'Mensal', semestral: 'Semestral', anual: 'Anual' };

const sb = (path, init = {}) => fetch(SUPABASE_URL + path, {
  ...init,
  headers: { apikey: KEY, ...(/^eyJ/.test(KEY || '') ? { Authorization: 'Bearer ' + KEY } : {}), 'Content-Type': 'application/json', ...(init.headers || {}) },
});
const pm = (path, init = {}) => fetch(PM_URL + path, {
  ...init,
  headers: { Authorization: 'Basic ' + Buffer.from(PM_KEY + ':').toString('base64'), 'Content-Type': 'application/json', Accept: 'application/json', ...(init.headers || {}) },
});
const fail = (res, status, error) => res.status(status).json({ error });
const um = async (r) => { const j = r.ok ? await r.json() : []; return Array.isArray(j) ? j[0] : j; };

// quem está pagando: o cliente logado e a empresa dele
const cliente = async (req) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: 'Sessão não enviada. Saia e entre de novo.' };
  const u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
  if (!u.ok) return { error: 'Sessão expirada. Saia e entre de novo.' };
  const user = await u.json();
  const p = await um(await sb('/rest/v1/profiles?select=name,email,role,empresa_id,active&id=eq.' + user.id));
  if (!p || p.role !== 'client' || !p.empresa_id || p.active === false) return { error: 'Só o acesso de um cliente pode contratar o plano.' };
  return { user, perfil: p };
};

const criar = async (req, res, body) => {
  const quem = await cliente(req); if (quem.error) return fail(res, 403, quem.error);
  const ciclo = String(body.ciclo || ''); const metodo = String(body.metodo || '');
  if (!CICLOS[ciclo] || !['cartao', 'pix'].includes(metodo)) return fail(res, 400, 'Escolha o plano e a forma de pagamento.');
  const cfg = await um(await sb('/rest/v1/config_pagamento?select=*&id=eq.1'));
  if (!cfg) return fail(res, 500, 'Pagamento ainda não configurado. Fale com a GANG.');
  if ((metodo === 'pix' && !cfg.pix) || (metodo === 'cartao' && !cfg.cartao)) return fail(res, 400, 'Esta forma de pagamento não está disponível.');
  const valor = Number((cfg.precos || {})[ciclo]);
  if (!(valor > 0)) return fail(res, 500, 'Preço do plano não configurado. Fale com a GANG.');
  const planoPm = (cfg.planos_pagarme || {})[ciclo];
  if (metodo === 'cartao' && !planoPm) return fail(res, 500, 'A assinatura no cartão ainda não está configurada. Use o Pix ou fale com a GANG.');
  const emp = await um(await sb('/rest/v1/empresas?select=nome&id=eq.' + quem.perfil.empresa_id));

  // a cobrança antes do link: o aviso do Pagar.me encontra a empresa pelo código do cliente
  const c = await sb('/rest/v1/cobrancas', { method: 'POST', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ empresa_id: quem.perfil.empresa_id, ciclo, metodo, valor }) });
  const cob = await um(c); if (!cob || !cob.id) return fail(res, 500, 'Não foi possível iniciar o pagamento. Tente de novo.');

  const nome = 'Acesso à plataforma GANG · ' + CICLOS[ciclo];
  const cliPm = { name: quem.perfil.name || (emp && emp.nome) || 'Cliente GANG', email: quem.perfil.email || quem.user.email, code: quem.perfil.empresa_id };
  const link = metodo === 'pix' ? {
    type: 'order', name: nome.slice(0, 64), max_paid_sessions: 1, expires_in: 60 * 24, order_code: cob.id,
    payment_settings: { accepted_payment_methods: ['pix'], pix_settings: { expires_in: 60 * 60 * 24 } },
    cart_settings: { items: [{ name: nome, amount: valor, default_quantity: 1 }] },
    customer_settings: { customer: cliPm },
    flow_settings: { success_url: SITE + '/cliente#inicio' },
  } : {
    type: 'subscription', name: nome.slice(0, 64), max_paid_sessions: 1, expires_in: 60 * 24,
    payment_settings: { accepted_payment_methods: ['credit_card'], credit_card_settings: { operation_type: 'auth_and_capture', installments: [{ number: 1, total: valor }] } },
    cart_settings: { recurrences: [{ plan_id: planoPm, start_in: 1 }] },
    customer_settings: { customer: cliPm },
    flow_settings: { success_url: SITE + '/cliente#inicio' },
  };
  const r = await pm('/paymentlinks', { method: 'POST', body: JSON.stringify(link) });
  const out = await r.json().catch(() => ({}));
  if (!r.ok || !out.url) {
    await sb('/rest/v1/cobrancas?id=eq.' + cob.id, { method: 'PATCH', body: JSON.stringify({ status: 'falhou' }) });
    return fail(res, 502, 'O Pagar.me não aceitou o pedido (' + ((out && (out.message || (out.errors && JSON.stringify(out.errors)))) || r.status) + ').');
  }
  await sb('/rest/v1/cobrancas?id=eq.' + cob.id, { method: 'PATCH', body: JSON.stringify({ link_id: out.id || null, link_url: out.url }) });
  return res.status(200).json({ url: out.url });
};

// o aviso do Pagar.me: só a cobrança conferida no Pagar.me libera o acesso
const aviso = async (req, res, body) => {
  if (!process.env.PAGARME_WEBHOOK_TOKEN || String(req.query.t || '') !== process.env.PAGARME_WEBHOOK_TOKEN) return fail(res, 401, 'Aviso não autorizado.');
  const tipo = String(body.type || ''); const d = body.data || {};
  if (!/^(charge|order|invoice)\.paid$/.test(tipo)) return res.status(200).json({ ok: true, ignorado: tipo });
  const chargeId = tipo.startsWith('charge.') ? d.id : tipo.startsWith('order.') ? (d.charges && d.charges[0] && d.charges[0].id) : (d.charge && d.charge.id) || d.charge_id;
  if (!chargeId) return res.status(200).json({ ok: true, semCobranca: true });
  const r = await pm('/charges/' + chargeId);
  if (!r.ok) return fail(res, 502, 'Não foi possível conferir a cobrança no Pagar.me.'); // o Pagar.me tenta de novo
  const ch = await r.json();
  if (ch.status !== 'paid') return res.status(200).json({ ok: true, naoPaga: ch.status });
  const empresa = (ch.customer && ch.customer.code) || (ch.metadata && ch.metadata.empresa_id);
  if (!/^[0-9a-f-]{36}$/i.test(String(empresa || ''))) return res.status(200).json({ ok: true, semEmpresa: true });
  // o ciclo: pela cobrança aberta desta empresa com o mesmo valor; senão, pelo preço configurado
  const valor = Number(ch.amount || ch.paid_amount || 0);
  const abertas = await (await sb('/rest/v1/cobrancas?select=id,ciclo,valor&status=eq.aberta&empresa_id=eq.' + empresa + '&order=criada_em.desc')).json().catch(() => []);
  const cfg = await um(await sb('/rest/v1/config_pagamento?select=precos&id=eq.1'));
  const porPreco = Object.entries((cfg && cfg.precos) || {}).find(([, v]) => Number(v) === valor);
  const cob = (abertas || []).find((x) => x.valor === valor);
  const ciclo = (cob && cob.ciclo) || (porPreco && porPreco[0]);
  if (!ciclo) return res.status(200).json({ ok: true, cicloDesconhecido: valor });
  const lib = await sb('/rest/v1/rpc/liberar_pagamento_pagarme', { method: 'POST',
    body: JSON.stringify({ p_empresa: empresa, p_ciclo: ciclo, p_valor: valor / 100, p_ref: chargeId }) });
  if (!lib.ok) return fail(res, 500, 'Não foi possível liberar o acesso.'); // o Pagar.me tenta de novo
  if (cob) await sb('/rest/v1/cobrancas?id=eq.' + cob.id, { method: 'PATCH', body: JSON.stringify({ status: 'paga', paga_em: new Date().toISOString() }) });
  return res.status(200).json({ ok: true, liberado: ciclo });
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!KEY) return fail(res, 500, 'Falta configurar a SUPABASE_SERVICE_ROLE_KEY no Vercel.');
  if (!PM_KEY) return fail(res, 500, 'Falta configurar a PAGARME_SECRET_KEY no Vercel.');
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return fail(res, 400, 'Pedido inválido.'); } }
  if (req.query && req.query.t !== undefined) return aviso(req, res, body);
  if (body.acao === 'criar') return criar(req, res, body);
  return fail(res, 400, 'Ação desconhecida.');
};
