/* Pagamento do acesso à plataforma pelo Asaas (função do Vercel).
   - POST { acao: 'criar', ciclo, metodo, documento }   o cliente logado paga. Só acesso: o plano escolhido; consultoria: a mensalidade
       do Contrato (o ciclo é sempre mensal). Pix: uma cobrança do ciclo inteiro.
       Cartão: uma assinatura (o Asaas cobra sozinho a cada ciclo). Nos dois casos devolve a página de pagamento do Asaas
       (invoiceUrl): o cartão é digitado lá, nunca passa por aqui.
   - POST { acao: 'cancelar' }                          o cliente cancela a renovação automática do cartão (o acesso pago continua até o fim).
   - POST com o cabeçalho asaas-access-token            o aviso do Asaas. Não confia no que chega: busca a cobrança no Asaas
       e só libera o acesso se ela estiver paga, uma vez por cobrança.
   Variáveis no Vercel: ASAAS_API_KEY (a chave do ambiente de teste primeiro), ASAAS_WEBHOOK_TOKEN (uma senha longa qualquer, a
   mesma colocada no webhook do Asaas), SUPABASE_SERVICE_ROLE_KEY (já existe). Opcional: ASAAS_API_URL, SITE_URL. */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zciglalkvmnoleevnuei.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AS_KEY = process.env.ASAAS_API_KEY || '';
const AS_URL = process.env.ASAAS_API_URL || (/_hmlg_/.test(AS_KEY) ? 'https://api-sandbox.asaas.com/v3' : 'https://api.asaas.com/v3');
const SITE = process.env.SITE_URL || 'https://www.gangconsultoria.com.br';
const CICLOS = { mensal: ['Mensal', 'MONTHLY'], semestral: ['Semestral', 'SEMIANNUALLY'], anual: ['Anual', 'YEARLY'] };

const sb = (path, init = {}) => fetch(SUPABASE_URL + path, {
  ...init,
  headers: { apikey: KEY, ...(/^eyJ/.test(KEY || '') ? { Authorization: 'Bearer ' + KEY } : {}), 'Content-Type': 'application/json', ...(init.headers || {}) },
});
const as = (path, init = {}) => fetch(AS_URL + path, {
  ...init,
  headers: { access_token: AS_KEY, 'User-Agent': 'GANG-Plataforma/1.0', 'Content-Type': 'application/json', Accept: 'application/json', ...(init.headers || {}) },
});
const fail = (res, status, error) => res.status(status).json({ error });
const um = async (r) => { const j = r.ok ? await r.json() : []; return Array.isArray(j) ? j[0] : j; };
const hoje = (dias = 0) => { const d = new Date(Date.now() - 3 * 3600 * 1000 + dias * 864e5); return d.toISOString().slice(0, 10); }; // horário de Brasília
// uma cobrança por período: o pagamento do próximo período só abre nos últimos dias do que já está pago
const JANELA = 5;
const diaBR = (iso) => String(iso).slice(8, 10) + '/' + String(iso).slice(5, 7);
const menosDias = (iso, n) => { const d = new Date(String(iso).slice(0, 10) + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
const erroAsaas = (out, r) => (out && out.errors && out.errors.map((e) => e.description).join(' ')) || r.status;

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

// o cliente do Asaas da empresa: criado uma vez, com o CPF ou CNPJ de quem paga, e guardado para não duplicar
const clienteAsaas = async (empresaId, perfil, emailUser, documento) => {
  const emp = await um(await sb('/rest/v1/empresas?select=nome,asaas_cliente&id=eq.' + empresaId));
  if (emp && emp.asaas_cliente) return { id: emp.asaas_cliente, nome: emp.nome };
  const doc = String(documento || '').replace(/\D/g, '');
  if (doc.length !== 11 && doc.length !== 14) return { error: 'Informe o CPF ou o CNPJ de quem paga.', pedeDocumento: true };
  const r = await as('/customers', { method: 'POST', body: JSON.stringify({ name: (emp && emp.nome) || perfil.name || 'Cliente GANG', cpfCnpj: doc,
    email: perfil.email || emailUser, externalReference: empresaId, notificationDisabled: false }) });
  const out = await r.json().catch(() => ({}));
  if (!r.ok || !out.id) return { error: 'O Asaas não aceitou o cadastro (' + erroAsaas(out, r) + ').' };
  await sb('/rest/v1/empresas?id=eq.' + empresaId, { method: 'PATCH', body: JSON.stringify({ asaas_cliente: out.id }) });
  return { id: out.id, nome: emp && emp.nome };
};

const criar = async (req, res, body) => {
  const quem = await cliente(req); if (quem.error) return fail(res, 403, quem.error);
  const empresaId = quem.perfil.empresa_id;
  const metodo = String(body.metodo || '');
  const cfg = await um(await sb('/rest/v1/config_pagamento?select=*&id=eq.1'));
  if (!cfg) return fail(res, 500, 'Pagamento ainda não configurado. Fale com a GANG.');
  if ((metodo === 'pix' && !cfg.pix) || (metodo === 'cartao' && !cfg.cartao)) return fail(res, 400, 'Esta forma de pagamento não está disponível.');
  // consultoria: a mensalidade do Contrato, todo mês; Só acesso: o preço do ciclo escolhido em Pagamentos
  const plano = await um(await sb('/rest/v1/planos?select=tipo,mensalidade,proxima_fatura,acesso_ate,acesso_ciclo&empresa_id=eq.' + empresaId));
  const consultoria = !plano || plano.tipo !== 'acesso';
  const ciclo = consultoria ? 'mensal' : String(body.ciclo || '');
  if (!CICLOS[ciclo] || !['cartao', 'pix'].includes(metodo)) return fail(res, 400, 'Escolha o plano e a forma de pagamento.');
  const centavos = consultoria ? Math.round((Number(plano && plano.mensalidade) || 0) * 100) : Number((cfg.precos || {})[ciclo]);
  if (!(centavos > 0)) return fail(res, 500, consultoria ? 'A mensalidade ainda não foi definida. Fale com a GANG.' : 'Preço do plano não configurado. Fale com a GANG.');
  // o período atual já está pago (cancelar a renovação não reabre o mês): só abre de novo nos últimos JANELA dias.
  // Consultoria: até a próxima fatura do Contrato; Só acesso: até o fim do acesso pago (o período grátis não conta)
  const pagoAte = consultoria ? (plano && plano.proxima_fatura) : (plano && plano.acesso_ciclo && plano.acesso_ate ? menosDias(plano.acesso_ate, -1) : null);
  if (pagoAte && String(pagoAte).slice(0, 10) > hoje(JANELA)) {
    const abre = menosDias(pagoAte, JANELA);
    return res.status(409).json({ error: (consultoria ? 'A mensalidade deste mês já está paga.' : 'Seu plano já está pago.') + ' O próximo pagamento abre em ' + diaBR(abre) + '.', abreEm: abre });
  }
  // com a renovação automática ativa, o cartão já cobra sozinho: trocar de plano pede cancelar antes (evita cobrar duas vezes)
  const atual = await um(await sb('/rest/v1/empresas?select=asaas_assinatura&id=eq.' + empresaId));
  if (atual && atual.asaas_assinatura) return fail(res, 400, 'Sua assinatura no cartão já renova sozinha. Para trocar de plano, cancele a renovação em Meu plano.');
  // uma cobrança em aberto por vez: clicar de novo na mesma forma reabre a mesma página; trocar de forma (ou de plano)
  // cancela a anterior no Asaas (assinatura no cartão ou cobrança do Pix), para o cliente não acumular pendências
  const abertas = await (await sb('/rest/v1/cobrancas?select=id,metodo,ciclo,valor,link_id,link_url,criada_em&empresa_id=eq.' + empresaId + '&status=eq.aberta&order=criada_em.desc')).json().catch(() => []);
  const lista = Array.isArray(abertas) ? abertas : [];
  const igual = lista.find((v) => v.metodo === metodo && v.ciclo === ciclo && Number(v.valor) === centavos && v.link_url
    && Date.now() - new Date(v.criada_em).getTime() < 2 * 864e5);
  for (const v of lista) {
    if (igual && v.id === igual.id) continue;
    if (v.link_id && /^sub_/.test(v.link_id)) await as('/subscriptions/' + v.link_id, { method: 'DELETE' });
    else if (v.link_id && /^pay_/.test(v.link_id)) await as('/payments/' + v.link_id, { method: 'DELETE' });
    await sb('/rest/v1/cobrancas?id=eq.' + v.id, { method: 'PATCH', body: JSON.stringify({ status: 'cancelada' }) });
  }
  if (igual) return res.status(200).json({ url: igual.link_url, reaberta: true });
  const cli = await clienteAsaas(empresaId, quem.perfil, quem.user.email, body.documento);
  if (cli.error) return res.status(cli.pedeDocumento ? 400 : 502).json({ error: cli.error, pedeDocumento: !!cli.pedeDocumento });

  const c = await sb('/rest/v1/cobrancas', { method: 'POST', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ empresa_id: empresaId, ciclo, metodo, valor: centavos }) });
  const cob = await um(c); if (!cob || !cob.id) return fail(res, 500, 'Não foi possível iniciar o pagamento. Tente de novo.');
  const descricao = consultoria ? 'Consultoria de marca GANG · mensalidade' : 'Acesso à plataforma GANG · ' + CICLOS[ciclo][0];
  const callback = { successUrl: SITE + '/cliente#assinatura', autoRedirect: true };
  // a volta para o site depois de pagar exige o domínio cadastrado no Asaas (Minha conta > Informações > Site);
  // sem ele, o Asaas recusa o pedido: tenta de novo sem a volta, e o cliente paga do mesmo jeito
  const criaNoAsaas = async (caminho, dados) => {
    let r = await as(caminho, { method: 'POST', body: JSON.stringify({ ...dados, callback }) });
    let out = await r.json().catch(() => ({}));
    if (!r.ok && /dom[ií]nio|callback|site/i.test(erroAsaas(out, r))) {
      r = await as(caminho, { method: 'POST', body: JSON.stringify(dados) });
      out = await r.json().catch(() => ({}));
    }
    return { r, out };
  };
  let url = null; let ref = null; let erro = null;
  if (metodo === 'pix') {
    // Pix: uma cobrança do ciclo inteiro, vencendo amanhã
    const { r, out } = await criaNoAsaas('/payments', { customer: cli.id, billingType: 'PIX', value: centavos / 100, dueDate: hoje(1),
      description: descricao, externalReference: 'cob:' + cob.id });
    if (r.ok && out.invoiceUrl) { url = out.invoiceUrl; ref = out.id; } else erro = erroAsaas(out, r);
  } else {
    // cartão: a assinatura do ciclo; a primeira cobrança é hoje, e a página dela é onde o cliente cadastra o cartão
    const { r, out } = await criaNoAsaas('/subscriptions', { customer: cli.id, billingType: 'CREDIT_CARD', value: centavos / 100, nextDueDate: hoje(0),
      cycle: CICLOS[ciclo][1], description: descricao, externalReference: 'emp:' + empresaId + ':' + ciclo });
    if (r.ok && out.id) {
      ref = out.id;
      const l = await as('/subscriptions/' + out.id + '/payments');
      const pags = await l.json().catch(() => ({}));
      const primeira = (pags.data || []).sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))[0];
      if (primeira && primeira.invoiceUrl) url = primeira.invoiceUrl; else erro = 'a assinatura foi criada, mas a página de pagamento não veio';
    } else erro = erroAsaas(out, r);
  }
  if (!url) {
    await sb('/rest/v1/cobrancas?id=eq.' + cob.id, { method: 'PATCH', body: JSON.stringify({ status: 'falhou', link_id: ref }) });
    return fail(res, 502, 'O Asaas não aceitou o pedido (' + erro + ').');
  }
  await sb('/rest/v1/cobrancas?id=eq.' + cob.id, { method: 'PATCH', body: JSON.stringify({ link_id: ref, link_url: url }) });
  return res.status(200).json({ url });
};

// o aviso do Asaas: autenticado pelo cabeçalho; só a cobrança conferida no Asaas libera o acesso
const aviso = async (req, res, body) => {
  const senha = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!senha || String(req.headers['asaas-access-token'] || '') !== senha) return fail(res, 401, 'Aviso não autorizado.');
  const evento = String(body.event || ''); const payId = body.payment && body.payment.id;
  if (!/^PAYMENT_(RECEIVED|CONFIRMED)$/.test(evento) || !payId) return res.status(200).json({ ok: true, ignorado: evento });
  const r = await as('/payments/' + payId);
  if (!r.ok) return fail(res, 502, 'Não foi possível conferir a cobrança no Asaas.'); // o Asaas tenta de novo
  const pay = await r.json();
  // Pix de conta no CPF pode ficar "CONFIRMED" em análise por até 72 horas: só libera quando o dinheiro é recebido (RECEIVED).
  // No cartão, CONFIRMED já é a aprovação
  const pago = pay.status === 'RECEIVED' || pay.status === 'RECEIVED_IN_CASH' || (pay.status === 'CONFIRMED' && pay.billingType === 'CREDIT_CARD');
  if (!pago) return res.status(200).json({ ok: true, aguardando: pay.status });
  let empresa = null; let ciclo = null; let cobId = null;
  const ext = String(pay.externalReference || '');
  if (ext.startsWith('cob:')) {
    cobId = ext.slice(4);
    const cob = await um(await sb('/rest/v1/cobrancas?select=empresa_id,ciclo&id=eq.' + cobId));
    if (cob) { empresa = cob.empresa_id; ciclo = cob.ciclo; }
  }
  if (!empresa && pay.subscription) {
    const s = await as('/subscriptions/' + pay.subscription);
    const sub = s.ok ? await s.json() : {};
    const m = String(sub.externalReference || ext).match(/^emp:([0-9a-f-]{36}):(mensal|semestral|anual)$/i);
    if (m) { empresa = m[1]; ciclo = m[2]; }
  }
  if (!empresa || !CICLOS[ciclo]) return res.status(200).json({ ok: true, semEmpresa: true });
  // consultoria: a mensalidade paga avança a próxima fatura; Só acesso: o pagamento estende o acesso
  const pl = await um(await sb('/rest/v1/planos?select=tipo&empresa_id=eq.' + empresa));
  const lib = pl && pl.tipo === 'acesso'
    ? await sb('/rest/v1/rpc/liberar_pagamento_pagarme', { method: 'POST', body: JSON.stringify({ p_empresa: empresa, p_ciclo: ciclo, p_valor: Number(pay.value) || 0, p_ref: pay.id }) })
    : await sb('/rest/v1/rpc/liberar_mensalidade', { method: 'POST', body: JSON.stringify({ p_empresa: empresa, p_valor: Number(pay.value) || 0, p_ref: pay.id }) });
  if (!lib.ok) return fail(res, 500, 'Não foi possível registrar o pagamento.'); // o Asaas tenta de novo
  // o que o cliente vê na aba Assinatura: a forma de pagamento e o comprovante do Asaas
  await sb('/rest/v1/pagamentos?ref_pagarme=eq.' + encodeURIComponent(pay.id), { method: 'PATCH',
    body: JSON.stringify({ metodo: pay.billingType === 'PIX' ? 'pix' : pay.billingType === 'CREDIT_CARD' ? 'cartao' : null,
      comprovante_url: pay.transactionReceiptUrl || pay.invoiceUrl || null }) });
  // pago no cartão: a assinatura fica guardada (renovação automática ativa), para o cliente poder cancelar
  if (pay.subscription && pay.billingType === 'CREDIT_CARD') {
    await sb('/rest/v1/empresas?id=eq.' + empresa, { method: 'PATCH', body: JSON.stringify({ asaas_assinatura: pay.subscription, assinatura_ciclo: ciclo }) });
  }
  // a cobrança da plataforma: a do Pix pelo código; a da assinatura, a aberta mais recente desta empresa no mesmo ciclo
  const alvo = cobId ? 'id=eq.' + cobId : 'empresa_id=eq.' + empresa + '&ciclo=eq.' + ciclo + '&status=eq.aberta';
  await sb('/rest/v1/cobrancas?' + alvo, { method: 'PATCH', body: JSON.stringify({ status: 'paga', paga_em: new Date().toISOString() }) });
  return res.status(200).json({ ok: true, liberado: ciclo });
};

// cancelar a renovação automática: confere que a assinatura é desta empresa e a remove no Asaas; o acesso pago continua até o fim
const cancelar = async (req, res) => {
  const quem = await cliente(req); if (quem.error) return fail(res, 403, quem.error);
  const empresaId = quem.perfil.empresa_id;
  const emp = await um(await sb('/rest/v1/empresas?select=asaas_cliente,asaas_assinatura&id=eq.' + empresaId));
  if (!emp || !emp.asaas_assinatura) return fail(res, 400, 'Não há renovação automática ativa.');
  const s = await as('/subscriptions/' + emp.asaas_assinatura);
  const sub = await s.json().catch(() => ({}));
  if (s.ok && sub.customer && sub.customer !== emp.asaas_cliente) return fail(res, 403, 'Esta assinatura não é da sua empresa.');
  if (s.ok && !sub.deleted) {
    const d = await as('/subscriptions/' + emp.asaas_assinatura, { method: 'DELETE' });
    if (!d.ok) return fail(res, 502, 'O Asaas não cancelou agora. Tente de novo em instantes.');
  }
  await sb('/rest/v1/empresas?id=eq.' + empresaId, { method: 'PATCH', body: JSON.stringify({ asaas_assinatura: null, assinatura_ciclo: null }) });
  return res.status(200).json({ ok: true });
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!KEY) return fail(res, 500, 'Falta configurar a SUPABASE_SERVICE_ROLE_KEY no Vercel.');
  if (!AS_KEY) return fail(res, 500, 'Falta configurar a ASAAS_API_KEY no Vercel.');
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return fail(res, 400, 'Pedido inválido.'); } }
  if (req.headers['asaas-access-token'] !== undefined || body.event) return aviso(req, res, body);
  if (body.acao === 'criar') return criar(req, res, body);
  if (body.acao === 'cancelar') return cancelar(req, res);
  return fail(res, 400, 'Ação desconhecida.');
};
