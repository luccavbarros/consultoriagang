/* Lembretes por e-mail para os clientes (Vercel Cron, uma vez por dia; ver vercel.json).
   Avisa só o que pede uma ação do cliente e cada aviso sai uma vez só:
   - números do mês que não chegaram (dias 3 e 7);
   - encontro amanhã;
   - peça revisada pelo consultor;
   - mensagem do consultor sem ler há mais de 1 dia;
   - ação essencial com prazo em 3 dias.
   Variáveis no Vercel: SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, LEMBRETE_DE (ex.: GANG <lembretes@gangconsultoria.com.br>),
   CRON_SECRET (o Vercel manda no cabeçalho), SITE_URL (opcional), SUPABASE_URL (opcional). */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zciglalkvmnoleevnuei.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE = (process.env.SITE_URL || 'https://www.gangconsultoria.com.br').replace(/\/$/, '');
const DE = process.env.LEMBRETE_DE || 'GANG <lembretes@gangconsultoria.com.br>';

const sb = async (path, init = {}) => {
  const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, { ...init, headers: { apikey: KEY, ...(/^eyJ/.test(KEY || '') ? { Authorization: 'Bearer ' + KEY } : {}), 'Content-Type': 'application/json', ...(init.headers || {}) } });
  if (!r.ok) throw new Error('Supabase ' + r.status + ' em ' + path.split('?')[0]);
  return r.status === 204 ? null : r.json();
};
const diaSP = (d) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(d); // AAAA-MM-DD
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const nomeMes = (ref) => MESES[Number(ref.slice(5, 7)) - 1];
const addMes = (ref, n) => { const d = new Date(Number(ref.slice(0, 4)), Number(ref.slice(5, 7)) - 1 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
const hora = (iso) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)).replace(':00', 'h').replace(':', 'h');
const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// o e-mail: claro, curto, com um botão; uma linha por aviso
const email = (nome, itens) => {
  const primeiro = (nome || '').split(' ')[0];
  const linhas = itens.map((x) => '<tr><td style="padding:12px 0;border-top:1px solid #eee"><p style="margin:0;font-size:15px;font-weight:600;color:#111">' + esc(x.titulo)
    + '</p><p style="margin:4px 0 0;font-size:14px;color:#555;line-height:1.5">' + esc(x.texto) + '</p></td></tr>').join('');
  return '<!doctype html><html><body style="margin:0;background:#f4f4f4;font-family:Inter,-apple-system,Helvetica,Arial,sans-serif">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:14px;padding:28px">'
    + '<tr><td><p style="margin:0 0 18px;font-size:13px;letter-spacing:.3em;color:#111">GANG</p>'
    + '<p style="margin:0 0 6px;font-size:20px;font-weight:600;color:#111">' + (primeiro ? 'Oi, ' + esc(primeiro) + '.' : 'Oi.') + '</p>'
    + '<p style="margin:0 0 14px;font-size:14px;color:#555">' + (itens.length > 1 ? 'Algumas coisas esperam por você na plataforma:' : 'Uma coisa espera por você na plataforma:') + '</p></td></tr>'
    + linhas
    + '<tr><td style="padding-top:20px"><a href="' + SITE + '/cliente" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 20px;border-radius:10px">Abrir a plataforma</a></td></tr>'
    + '<tr><td style="padding-top:22px"><p style="margin:0;font-size:12px;color:#999;line-height:1.5">Você recebe estes avisos porque tem acesso à sua plataforma de marca da GANG. Para não receber mais, desligue em "Sua foto e avisos", clicando no seu nome no menu.</p></td></tr>'
    + '</table></td></tr></table></body></html>';
};

module.exports = async (req, res) => {
  if (process.env.CRON_SECRET && req.headers.authorization !== 'Bearer ' + process.env.CRON_SECRET) return res.status(401).json({ error: 'Sem permissão.' });
  if (!KEY || !process.env.RESEND_API_KEY) return res.status(500).json({ error: 'Faltam SUPABASE_SERVICE_ROLE_KEY ou RESEND_API_KEY no Vercel.' });
  const agora = new Date();
  const hoje = diaSP(agora); const ref = hoje.slice(0, 7); const mesPassado = addMes(ref, -1); const diaDoMes = Number(hoje.slice(8, 10));
  const em3 = diaSP(new Date(agora.getTime() + 3 * 864e5));
  const pessoas = (await sb('profiles?select=id,email,name,empresa_id,aceita_lembretes&role=eq.client&active=eq.true&empresa_id=not.is.null'))
    .filter((p) => p.email && p.aceita_lembretes !== false);
  const porEmpresa = {}; pessoas.forEach((p) => { (porEmpresa[p.empresa_id] = porEmpresa[p.empresa_id] || []).push(p); });
  const relatorio = { enviados: 0, empresas: 0, erros: [] };

  for (const [eid, gente] of Object.entries(porEmpresa)) {
    try {
      const [planos, nums, encs, peds, msgs, acs, ja] = await Promise.all([
        sb('planos?select=inicio,status,sem_numeros&empresa_id=eq.' + eid),
        sb('numeros_mensais?select=mes_ref&empresa_id=eq.' + eid + '&mes_ref=eq.' + mesPassado),
        sb('encontros?select=id,inicio,tipo&status=eq.agendado&empresa_id=eq.' + eid + '&inicio=gte.' + new Date(agora.getTime() + 12 * 36e5).toISOString() + '&inicio=lte.' + new Date(agora.getTime() + 36 * 36e5).toISOString()),
        sb('pedidos_revisao?select=id,titulo,tipo_peca,status&visto_pelo_cliente=eq.false&status=neq.em_analise&empresa_id=eq.' + eid + '&respondido_em=gte.' + new Date(agora.getTime() - 3 * 864e5).toISOString()),
        sb('mensagens?select=id&de=eq.consultor&lida=eq.false&empresa_id=eq.' + eid + '&criada_em=lte.' + new Date(agora.getTime() - 864e5).toISOString()),
        sb('acoes?select=id,titulo,prazo&peso=eq.essencial&status=neq.feita&responsavel=neq.gang&empresa_id=eq.' + eid + '&prazo=eq.' + em3),
        sb('lembretes_enviados?select=perfil_id,chave&empresa_id=eq.' + eid),
      ]);
      const plano = planos[0];
      if (!plano || plano.status !== 'ativo') continue;
      relatorio.empresas += 1;
      const itens = [];
      if ((diaDoMes === 3 || diaDoMes === 7) && !plano.sem_numeros && plano.inicio && plano.inicio.slice(0, 7) <= mesPassado && !nums.length) {
        itens.push({ chave: 'numeros-' + mesPassado + '-' + diaDoMes, titulo: 'Os números de ' + nomeMes(mesPassado) + ' ainda não chegaram',
          texto: 'Leva 2 minutos e é o que mostra se o plano está funcionando.' });
      }
      encs.forEach((e) => itens.push({ chave: 'encontro-' + e.id, titulo: 'Encontro amanhã, às ' + hora(e.inicio), texto: 'A pauta já está na plataforma. Se precisar remarcar, dá para pedir por lá.' }));
      peds.forEach((p) => itens.push({ chave: 'peca-' + p.id + '-' + p.status, titulo: (p.status === 'aprovado' ? 'Peça aprovada: ' : 'Peça com ajuste: ') + (p.titulo || p.tipo_peca),
        texto: p.status === 'aprovado' ? 'Pode publicar. O comentário do consultor está na plataforma.' : 'O consultor pediu um ajuste antes de publicar. Veja o que mudar.' }));
      if (msgs.length) itens.push({ chave: 'mensagem-' + msgs.map((m) => m.id).sort().pop(), titulo: msgs.length === 1 ? 'Uma mensagem do seu consultor' : msgs.length + ' mensagens do seu consultor', texto: 'Ainda sem ler na plataforma.' });
      acs.forEach((a) => itens.push({ chave: 'prazo-' + a.id + '-' + a.prazo, titulo: 'Prazo em 3 dias: ' + a.titulo, texto: 'É uma ação essencial do mês. Se travou, avise o consultor pela plataforma.' }));
      if (!itens.length) continue;

      for (const p of gente) {
        const novos = itens.filter((x) => !ja.some((j) => j.perfil_id === p.id && j.chave === x.chave));
        if (!novos.length) continue;
        const assunto = novos.length === 1 ? novos[0].titulo : novos[0].titulo + ' (e mais ' + (novos.length - 1) + ')';
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST', headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: DE, to: [p.email], subject: assunto, html: email(p.name, novos) }),
        });
        if (!r.ok) { relatorio.erros.push(eid + ': e-mail ' + r.status); continue; }
        await sb('lembretes_enviados', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify(novos.map((x) => ({ perfil_id: p.id, empresa_id: eid, chave: x.chave, assunto: x.titulo }))) });
        relatorio.enviados += 1;
      }
    } catch (e) { relatorio.erros.push(eid + ': ' + e.message); }
  }
  return res.status(200).json(relatorio);
};
