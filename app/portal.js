/* Portal do cliente: carrega os dados da empresa de quem está logado, monta o menu com os indicadores e troca as telas.
   O banco só devolve linhas da empresa do cliente (regras em supabase/portal.sql): aqui nada é filtrado "na confiança". */
(async () => {
  const { sb: base, guard, signOut, notConfigured } = window.GangAuth;
  const U = window.GangUI;
  const { $, el } = U;
  if (!base) return notConfigured($('main'));
  // o consultor abre o plano de marca de um cliente (cliente.html?marca=<empresa>#marca-pdf): é o mesmo documento que o cliente
  // baixa, montado pelas mesmas funções. Só leitura: toda consulta vem filtrada pela empresa escolhida e nada é gravado
  const VER = new URLSearchParams(location.search).get('marca');
  const me = await guard(VER ? 'admin' : 'client');
  if (!me) return;
  const sb = VER ? (() => {
    const ok = Promise.resolve({ data: null, error: null });
    const nada = new Proxy(function () {}, { get: (t, k) => (k === 'then' ? (a, b) => ok.then(a, b) : nada), apply: () => nada });
    return {
      from: (t) => { const q = base.from(t); return { select: (...a) => q.select(...a).eq(t === 'empresas' ? 'id' : 'empresa_id', VER), insert: nada, update: nada, upsert: nada, delete: nada }; },
      rpc: () => nada,
      auth: base.auth,
      storage: { from: (b) => { const st = base.storage.from(b); return { createSignedUrl: (...a) => st.createSignedUrl(...a), getPublicUrl: (...a) => st.getPublicUrl(...a), upload: nada, remove: nada }; } },
    };
  })() : base;
  if (VER) { me.empresa_id = VER; document.documentElement.classList.add('ver-consultor'); }

  $('sign-out').addEventListener('click', signOut);
  $('me-name').textContent = me.name || me.email;
  U.avatar($('me-dot'), me.name || me.email, me.foto_url);

  // a própria foto: clicar na bolinha do nome abre a troca (vai para avatares/<seu id>/, só a pessoa escreve ali)
  {
    let foto = me.foto_url || null;
    const prev = el('span', { class: 'consultant__ini me-photo__view', 'aria-hidden': 'true' });
    const arq = el('input', { class: 'field field--file', id: 'mf-arq', type: 'file', accept: 'image/jpeg,image/png,image/webp' });
    const rm = el('button', { class: 'link', type: 'button' }, 'Remover a foto');
    const avisos = el('input', { type: 'checkbox', id: 'mf-avisos', checked: me.aceita_lembretes !== false });
    avisos.addEventListener('change', async () => {
      const { error } = await sb.rpc('portal_lembretes', { p_on: avisos.checked });
      if (error) { avisos.checked = !avisos.checked; U.say(msg, 'Não foi possível salvar.', 'error'); return; }
      me.aceita_lembretes = avisos.checked; U.say(msg, avisos.checked ? 'Lembretes ligados.' : 'Lembretes desligados.', 'ok');
    });
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const salvar = el('button', { class: 'btn btn--light btn--sm', type: 'submit' }, 'Salvar');
    const dlgF = el('dialog', { class: 'dialog', 'aria-labelledby': 'mf-t' });
    const formF = el('form', { class: 'dialog__body', method: 'dialog' },
      el('h2', { class: 'title-sm', id: 'mf-t' }, 'Sua foto e avisos'),
      el('p', 'small', 'A foto aparece ao lado do seu nome no menu. JPG ou PNG, até 5 MB.'),
      el('div', 'me-photo', prev, el('div', 'me-photo__ctl', el('label', { class: 'label', for: 'mf-arq' }, 'Escolher imagem'), arq, rm)),
      el('label', 'aviso-tg', avisos, el('span', null, el('span', 'aviso-tg__t', 'Receber lembretes por e-mail'),
        el('span', 'aviso-tg__d', ['Encontro no dia seguinte, peça revisada e mensagem', el('br'), 'do consultor. No máximo um e-mail por dia.']))),
      msg,
      el('div', 'dialog__foot', el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => dlgF.close() }, 'Cancelar'), salvar));
    dlgF.append(formF); document.body.append(dlgF);
    let remover = false;
    const mostra = (url) => { U.avatar(prev, me.name || me.email, url); rm.hidden = !url; };
    $('me-foto-btn').addEventListener('click', () => { remover = false; arq.value = ''; U.say(msg, ''); mostra(foto); dlgF.showModal(); });
    arq.addEventListener('change', () => { const f = arq.files[0]; if (f) { remover = false; prev.textContent = ''; prev.style.backgroundImage = 'url("' + URL.createObjectURL(f) + '")'; rm.hidden = false; } });
    rm.addEventListener('click', () => { remover = true; arq.value = ''; mostra(null); });
    formF.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const f = arq.files[0];
      let nova = remover ? null : foto;
      salvar.disabled = true;
      try {
        if (f) {
          if (!/^image\//.test(f.type)) throw new Error('Envie uma imagem (JPG ou PNG).');
          if (f.size > 5 * 1024 * 1024) throw new Error('A foto passa de 5 MB.');
          const caminho = me.id + '/' + crypto.randomUUID() + '.' + ((f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, ''));
          const up = await sb.storage.from('avatares').upload(caminho, f, { contentType: f.type });
          if (up.error) throw new Error('Não foi possível enviar a foto.');
          nova = sb.storage.from('avatares').getPublicUrl(caminho).data.publicUrl;
        }
        const { error } = await sb.rpc('portal_minha_foto', { p_url: nova });
        if (error) throw new Error('Não foi possível salvar.');
        foto = nova; me.foto_url = nova; U.avatar($('me-dot'), me.name || me.email, nova);
        dlgF.close(); anuncia(nova ? 'Foto atualizada.' : 'Foto removida.');
      } catch (err) { U.say(msg, err.message, 'error'); }
      salvar.disabled = false;
    });
  }

  // conta ainda sem empresa: a GANG não terminou de preparar a área
  if (!me.empresa_id) {
    document.body.replaceChildren(el('main', 'portal-empty', el('div', null,
      el('img', { src: 'assets/logo.svg', alt: 'GANG', width: 100, height: 20 }),
      el('h1', 'title-sm', 'Sua área está sendo preparada'),
      el('p', 'small', 'A GANG avisa quando estiver tudo pronto.'),
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: signOut }, 'Sair'),
    )));
    return;
  }

  // ===== dados =====
  const hoje = U.ref();
  const mesPassado = U.addRef(hoje, -1);
  const [emp, plano, cons, objs, acoes, desc, nums, encs, diag, ori, peds, mets, futs] = await Promise.all([
    sb.from('empresas').select('*').maybeSingle(), // inclui setor e "vende" (produto ou serviço), para as palavras certas na tela
    sb.from('planos').select('*').maybeSingle(),
    sb.rpc('portal_consultor'),
    sb.from('objetivos').select('*').order('ordem'),
    sb.from('acoes').select('*').order('mes_previsto').order('prazo', { nullsFirst: false }).order('ordem'),
    sb.from('acoes_descartadas').select('texto').order('ordem'),
    sb.from('numeros_mensais').select('*').order('mes_ref'),
    sb.from('encontros').select('*').order('inicio'),
    sb.from('diagnosticos').select('*').maybeSingle(),
    sb.from('orientacoes').select('*').eq('mes_ref', hoje).order('publicada_em', { ascending: false }).limit(1),
    sb.from('pedidos_revisao').select('*').order('enviado_em', { ascending: false }),
    sb.from('metricas').select('*').order('ordem'),
    Promise.resolve({ data: [] }), // o cliente não recebe nada dos meses depois do próximo: o plano parece montado com um mês de antecedência
  ]);
  const D = {
    empresa: emp.data, plano: plano.data, consultor: (cons.data || [])[0], objetivos: objs.data || [],
    acoes: acoes.data || [], descartadas: desc.data || [], numeros: nums.data || [], encontros: encs.data || [],
    diagnostico: diag.data, foco: (ori.data || [])[0], pedidos: peds.data || [], metricas: mets.data || [],
    // meses mais à frente: só a contagem (as ações em si chegam no mês anterior)
    futuras: (futs && !futs.error && futs.data) || [],
  };
  // o material entregue (somente leitura)
  const MARCA = ['escolhas', 'condicoes', 'impressoes', 'fatores', 'causas', 'mensagens_apoio', 'tom_atributos', 'tom_exemplos',
    'arquivos_marca', 'cores', 'tipografias', 'aplicacoes', 'situacoes', 'ativos', 'elementos_marca', 'identidade_central', 'pontos_contato'];
  const [plat, ident, facs, ...listas] = await Promise.all([
    sb.from('plataformas').select('*').maybeSingle(),
    sb.from('identidades').select('*').maybeSingle(),
    sb.from('facetas').select('*'),
    ...MARCA.map((t) => sb.from(t).select('*').order('ordem')),
  ]);
  D.plataforma = plat.data; D.identidade = ident.data;
  const [msgs, pesqs, resps, busc, voz, disp, comp] = await Promise.all([
    sb.from('mensagens').select('*').order('criada_em'),
    sb.from('pesquisas').select('*').order('criada_em'),
    sb.from('respostas').select('*'),
    sb.from('buscas').select('*').order('mes_ref'),
    sb.from('vozes').select('*').order('criada_em', { ascending: false }),
    sb.from('disponibilidade').select('*').order('mes_ref', { ascending: false }),
    sb.from('compromissos').select('*').order('semana', { ascending: false }).limit(12),
  ]);
  D.mensagens = msgs.data || []; D.pesquisas = pesqs.data || []; D.respostas = resps.data || [];
  D.buscas = busc.data || []; D.vozes = voz.data || []; D.disponibilidade = disp.data || [];
  D.compromissos = (comp && !comp.error && comp.data) || [];
  // histórico dos vereditos do consultor (para mostrar a evolução)
  D.vereditos = ((await sb.from('orientacoes').select('mes_ref, veredito').not('veredito', 'is', null).order('mes_ref', { ascending: false }).limit(12)).data || []).filter((v) => v.veredito);
  const condicaoQuebrada = () => (D.condicoes || []).filter((c) => c.status === 'nao_se_confirma');
  D.facetas = Object.fromEntries((facs.data || []).map((f) => [f.chave, f.texto]));
  MARCA.forEach((t, i) => { D[t] = listas[i].data || []; });

  // cor de acento = a cor mais viva da identidade do cliente (legível no fundo escuro); sem ela, o branco do site
  const ACENTO = (() => {
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const lum = (c) => c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const sat = (c) => { const mx = Math.max(...c); return mx ? (mx - Math.min(...c)) / mx : 0; };
    const fundo = lum(rgb('#1b1b1b'));
    const ok = (D.cores || []).map((x) => x.hex).filter((h) => /^#[0-9a-f]{6}$/i.test(h))
      .map((h) => ({ h, c: rgb(h) })).filter(({ c }) => sat(c) > 0.35 && (lum(c) + 0.05) / (fundo + 0.05) >= 3)
      .sort((a, b) => sat(b.c) - sat(a.c))[0];
    const cor = ok ? ok.h : '#f3f3f3';
    const L = lum(rgb(cor));
    const root = document.documentElement.style;
    root.setProperty('--accent', cor);
    root.setProperty('--on-accent', (L + 0.05) / 0.05 >= 1.05 / (L + 0.05) ? '#050505' : '#ffffff');
    return cor;
  })();
  const agoraMs = Date.now();
  // o próximo encontro: o primeiro que ainda não começou e não foi realizado
  const proximoEncontro = () => D.encontros.find((e) => new Date(e.inicio).getTime() > agoraMs && e.status !== 'realizado');
  D.proximo = proximoEncontro();
  const ajustarNaoVistos = () => D.pedidos.filter((p) => p.status === 'ajustar' && !p.visto_pelo_cliente);
  const objetivo = Object.fromEntries(D.objetivos.map((o) => [o.id, o]));
  const NIVEL = { negocio: 'Negócio', marca: 'Marca', comunicacao: 'Comunicação' };
  // os pilares sempre nesta ordem: Negócio, Comunicação (Marketing nas métricas) e Marca
  const ORDEM_NIVEL = ['negocio', 'comunicacao', 'marketing', 'marca'];
  const porNivel = (xs) => [...xs].sort((a, b) => ORDEM_NIVEL.indexOf(a.nivel) - ORDEM_NIVEL.indexOf(b.nivel));
  const TIPO_ENCONTRO = { mensal: 'Revisão mensal', semestral: 'Revisão semestral', anual: 'Revisão anual', entrega: 'Entrega do plano' };
  const STATUS = { a_fazer: 'A fazer', em_andamento: 'Em andamento', feita: 'Feita' };

  // ===== topo do menu =====
  $('company').textContent = D.empresa ? D.empresa.nome : 'Sua empresa';
  U.avatar($('company-logo'), D.empresa ? D.empresa.nome : 'Sua empresa', D.empresa && D.empresa.logo_url);
  document.title = (D.empresa ? D.empresa.nome : 'Sua marca') + ' — GANG';
  const mesN = U.mesDoPlano(D.plano);
  const dur = D.plano ? D.plano.duracao_meses : 18;
  // plano "Só acesso à marca": o cliente paga para acessar o material da marca, sem a consultoria mensal
  const soAcesso = !!D.plano && D.plano.tipo === 'acesso';
  const SO_CONSULTORIA = ['plano', 'calendario', 'acoes', 'resultados', 'pesquisa', 'consultoria', 'relatorio'];
  // a linha do plano no menu: mês do plano e o selo da situação (o mesmo do painel do consultor)
  const selo = U.situacaoPlano(D.plano); // Ativo, Pausado, Encerrado ou Pagamento pendente
  // "Só acesso" com o período vencido, ou consultoria com a mensalidade atrasada há mais de 7 dias: ficam a Identidade Visual,
  // a Narrativa e o Meu plano para pagar (o banco também só entrega essas partes)
  const consBloq = !soAcesso && U.consultoriaBloqueada(D.plano);
  const vencido = (soAcesso && U.acessoVencido(D.plano)) || consBloq;
  const ABERTAS_VENCIDO = ['inicio', 'identidade', 'plataforma', 'assinatura'];
  if (vencido) ['diagnostico', 'estrategia'].forEach((r) => { const li = document.querySelector('[data-route="' + r + '"]'); if (li) li.closest('li').hidden = true; });
  if (consBloq) {
    SO_CONSULTORIA.forEach((r) => { const li = document.querySelector('[data-route="' + r + '"]'); if (li) li.closest('li').hidden = true; });
    const g1 = document.getElementById('g1'); if (g1) g1.hidden = true;
  }
  // pagamento adiantado: o cliente de consultoria só recebe as ações dos meses pagos (o banco aplica a mesma regra: mes_liberado).
  // Nunca mais de um mês à frente; sem próxima fatura ou com "Não bloquear", o mês atual e o seguinte
  const mesLib = (() => {
    const teto = U.addRef(hoje, 1); const p = D.plano;
    if (soAcesso || !p || p.sem_bloqueio || !p.proxima_fatura) return teto;
    const m = U.addDias(p.proxima_fatura, -1).slice(0, 7); return m < teto ? m : teto;
  })();
  const mesNaoPago = (m) => m > mesLib && m <= U.addRef(hoje, 1);
  // consultoria com a mensalidade vencendo hoje ou atrasada (ainda na tolerância): aviso no alto de todas as telas
  const atraso = soAcesso ? null : U.faturaAtraso(D.plano);
  const avisoFatura = () => {
    if (atraso == null || atraso < 0 || (D.plano && D.plano.sem_bloqueio)) return null;
    const ate = U.addDias(U.bloqueioEm(D.plano), -1); const venc = String(D.plano.proxima_fatura).slice(0, 10);
    const [t, txt] = consBloq ? ['Acesso pausado por falta de pagamento', ['A mensalidade de ' + U.diaAno(venc) + ' está em aberto.', el('br'), 'Pague para liberar tudo na hora.']]
      : atraso === 0 ? ['Sua mensalidade vence hoje', ['Pague até ' + U.diaAno(ate) + ' para não pausar o acesso.']]
      : ['Mensalidade em aberto há ' + atraso + (atraso === 1 ? ' dia' : ' dias'), ['Pague até ' + U.diaAno(ate), el('br'), 'para não pausar o acesso ao plano.']];
    return el('section', { class: 'box aviso-fatura' + (consBloq || atraso > 0 ? ' is-hot' : ''), role: 'status' },
      el('div', null, el('h2', 'box__title', t), el('p', 'box__text', ...txt)),
      location.hash === '#assinatura' ? null : el('a', { class: 'btn btn--light btn--sm', href: '#assinatura' }, 'Pagar agora'));
  };
  $('plan-line').replaceChildren(el('span', 'side__plan-t', soAcesso ? 'Só acesso' : D.plano ? 'Mês ' + mesN + ' de ' + dur : 'Plano de marca'),
    selo ? el('span', 'badge selo-plano' + selo[0], selo[1]) : null);
  if (soAcesso) {
    SO_CONSULTORIA.forEach((r) => { const li = document.querySelector('[data-route="' + r + '"]'); if (li) li.closest('li').hidden = true; });
    const g1 = document.getElementById('g1'); if (g1) g1.hidden = true;
    const ini = document.querySelector('[data-route="inicio"] span'); if (ini) { ini.textContent = 'Início'; ini.closest('li').hidden = false; } // o item já vem escondido no HTML (sem piscar dois "Visão Geral")
  } else {
    // na consultoria, o Plano já é a visão geral: a tela "Visão Geral" sai do menu
    const li = document.querySelector('[data-route="inicio"]'); if (li) li.closest('li').hidden = true;
  }

  // ===== regras usadas em mais de uma tela =====
  const comCliente = (a) => a.responsavel !== 'gang';
  const pendentesDoMes = () => D.acoes.filter((a) => comCliente(a) && a.status !== 'feita' && a.mes_previsto <= hoje);
  const inicioRef = D.plano ? U.ref(D.plano.inicio) : null;
  // o cliente não passa os números da empresa: o portal nunca pede nem cobra. Se o consultor lançar algum, os gráficos aparecem
  const semNumeros = true;
  // "como foi o mês": a resposta de um clique (melhor, igual, pior) que o cliente dá no lugar dos números
  const comoFoi = (r) => { const n = D.numeros.find((x) => x.mes_ref === r); return n ? n.como_foi || null : null; };

  // ===== indicadores =====
  const ind = (k, text, hot) => { const n = document.querySelector('[data-ind="' + k + '"]'); if (!n) return; n.textContent = text || ''; n.classList.toggle('is-hot', !!hot); };
  // os avisos do menu: só o ponto colorido e o número (sem palavras); o que não pede nada fica em branco
  const indicadores = () => {
    ind('plano', ''); ind('inicio', ''); ind('diagnostico', '');
    const h0 = new Date(); h0.setHours(0, 0, 0, 0); const h7 = new Date(h0); h7.setDate(h0.getDate() + 7);
    const semana = eventos().filter((e) => !e.feita && U.day(e.dia) >= h0 && U.day(e.dia) < h7).length;
    ind('consultoria', semana ? String(semana) : '', semana > 0);
    const n = pendentesDoMes().length;
    ind('acoes', n ? String(n) : '', n > 0);
    // a Visão Geral avisa quando falta contar como foi o mês passado (a pergunta está no cartão da missão)
    const falta = !!inicioRef && mesPassado >= inicioRef && !comoFoi(mesPassado);
    ind('plano', falta ? '1' : '', falta);
  };
  indicadores();

  // o que a busca do menu encontra no portal
  U.buscaFonte(() => {
    const out = [];
    D.acoes.forEach((a) => out.push({ grupo: 'Ações', titulo: a.titulo, sub: U.cap(U.nomeMes(a.mes_previsto)) + ' · ' + (STATUS[a.status] || ''), href: '#acoes',
      onclick: () => { abreAcao = a.id; }, extra: (a.porque || '') + ' ' + (a.metrica_sucesso || '') + ' ' + (Array.isArray(a.passos) ? a.passos.map((x) => x.t).join(' ') : '') }));
    if (D.foco) out.push({ grupo: 'Seu mês', titulo: D.foco.titulo, sub: 'Foco de ' + U.nomeMes(D.foco.mes_ref), href: '#plano', extra: (D.foco.texto || '') + ' ' + (D.foco.veredito || '') });
    D.encontros.forEach((e) => out.push({ grupo: 'Encontros', titulo: (TIPO_ENCONTRO[e.tipo] || 'Encontro') + ' · ' + U.quando(e.inicio), sub: (e.pauta || []).slice(0, 2).join(' · '), href: '#consultoria', extra: (e.decisoes || []).join(' ') }));
    const P = D.plataforma;
    if (P) {
      if (P.posicionamento) out.push({ grupo: 'Sua marca', titulo: 'Posicionamento', sub: P.posicionamento.slice(0, 80) + '…', href: '#estrategia', extra: P.posicionamento });
      if (P.mensagem_central) out.push({ grupo: 'Sua marca', titulo: 'Mensagem central', sub: P.mensagem_central, href: '#plataforma' });
    }
    (D.objetivos || []).forEach((o) => o.titulo && out.push({ grupo: 'Sua marca', titulo: U.cap(o.titulo), sub: 'Objetivo · Estratégia', href: '#estrategia' }));
    (D.cores || []).forEach((c) => out.push({ grupo: 'Sua marca', titulo: 'Cor ' + c.nome, sub: (c.hex || '').toUpperCase() + ' · Identidade Visual', href: '#identidade' }));
    (D.tipografias || []).forEach((t) => out.push({ grupo: 'Sua marca', titulo: 'Fonte ' + t.nome, sub: 'Identidade Visual', href: '#identidade' }));
    (D.pedidos || []).forEach((pd) => out.push({ grupo: 'Peças', titulo: pd.titulo || pd.tipo_peca, sub: ({ em_analise: 'Em análise', ajustar: 'Ajustar', aprovado: 'Aprovada' })[pd.status] || '', href: '#acoes', extra: pd.resposta || '' }));
    (D.vozes || []).forEach((v) => out.push({ grupo: 'O que os clientes disseram', titulo: v.texto, sub: U.cap(U.nomeMes(v.mes_ref)), href: '#pesquisa' }));
    return out;
  });

  // ===== consultor =====
  const iniciais = (c) => U.iniciais(c.nome || c.email);
  const avatar = (c) => {
    const n = el('span', { class: 'consultant__ini', 'aria-hidden': 'true' });
    if (c.foto_url) n.style.backgroundImage = 'url("' + encodeURI(c.foto_url) + '")'; else n.textContent = iniciais(c);
    return n;
  };
  if (D.consultor) {
    const c = D.consultor;
    $('consultant').hidden = false;
    $('c-name').textContent = c.nome || 'Seu consultor';
    $('c-ini').replaceWith(avatar(c));
    $('c-talk').addEventListener('click', () => abrirConversa());
    if ($('c-dias')) $('c-dias').textContent = 'Responde ' + U.diasComArtigo((D.plano && D.plano.dias_resposta) || 'terças e quintas');
    if (soAcesso) { $('c-talk').firstChild.textContent = 'Falar com a GANG '; document.querySelector('.consultant__role').textContent = 'Consultoria GANG'; }
  }

  // ===== peças de interface =====
  const head = (eyebrow, title, lead, action) => el('header', 'screen__head' + (action ? ' screen__head--action' : ''),
    el('div', 'screen__head-text', eyebrow ? el('p', 'eyebrow', eyebrow) : null, el('h1', 'screen__title', title), lead ? el('p', 'screen__lead', lead) : null),
    action || null);
  // etiqueta de status: forma + texto, nunca só cor
  const chip = (kind, text) => el('span', 'chip chip--' + kind, text);
  const chipStatus = (s) => chip({ feita: 'done', em_andamento: 'doing', a_fazer: 'todo' }[s] || 'todo', STATUS[s] || s);
  const live = el('p', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  document.body.append(live);
  const anuncia = (t) => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); };

  function quem(a) {
    if (a.responsavel === 'gang') return 'GANG';
    const base = a.responsavel === 'ambos' ? 'Você e GANG' : 'Você';
    return a.responsavel_nome ? base + ' · com ' + a.responsavel_nome : base;
  }
  // "Vence em 4 dias" (destaque se ≤ 7), "30 nov", "Atrasada · 30 out", "Concluída em 12 out"
  const prazo = (a) => {
    if (a.status === 'feita') return { text: a.concluida_em ? 'Concluída em ' + U.dia(a.concluida_em) : 'Concluída', hot: false };
    if (!a.prazo) return { text: 'Sem prazo', hot: false };
    const d = U.diasAte(a.prazo);
    if (d < 0) return { text: 'Atrasada · ' + U.dia(a.prazo), hot: true };
    if (d === 0) return { text: 'Vence hoje', hot: true };
    if (d <= 7) return { text: 'Vence em ' + d + (d === 1 ? ' dia' : ' dias'), hot: true };
    return { text: U.dia(a.prazo), hot: false };
  };

  // ===== Início =====
  // ===== compromisso da semana =====
  // uma coisa só por semana, que dá para terminar até sexta e faz o plano andar; na semana seguinte, o cliente diz se cumpriu.
  // Primeiro presta contas da semana que passou, depois assume a nova; o placar das últimas semanas fica à vista.
  const segundaDe = (iso) => { const x = new Date(iso + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); return x.toISOString().slice(0, 10); };
  const semAtual = segundaDe(new Date().toISOString().slice(0, 10)); // a mesma conta do banco (current_date em UTC)
  let compTroca = false; let compAcao = null;
  const recarregaComp = async () => {
    const r = await sb.from('compromissos').select('*').order('semana', { ascending: false }).limit(12);
    if (!r.error) D.compromissos = r.data || [];
    render();
  };
  const proximoPasso = (a) => (a.passos || []).find((x) => !x.ok);

  const telaInicio = () => telaInicioAcesso(); // o Início é a tela do Só acesso; a consultoria abre na Visão Geral

  // ===== acesso ao consultor: o encontro é o lugar dele =====
  const diasResposta = () => U.diasComArtigo((D.plano && D.plano.dias_resposta) || 'terças e quintas'); // já vem com "às"/"aos"
  const quandoEncontro = () => (D.proximo ? 'no encontro de ' + U.dia(D.proximo.inicio) : 'no próximo encontro');
  const levarEncontro = async (texto, acaoId) => {
    const { error } = await sb.rpc('portal_levar_encontro', { p_texto: texto, p_acao: acaoId || null });
    if (error) { anuncia(error.message || 'Não foi possível enviar.'); return false; }
    anuncia('Anotado. Vamos ver ' + quandoEncontro() + '.'); return true;
  };

  // ===== Ações =====
  let abaAcoes = 'mes';
  let mesesProxAbertos = null; // meses abertos na aba Próximos meses
  let revAberta = false;
  let abreAcao = null; // vindo do calendário: abre esta ação já expandida
  // linha do tempo do que aconteceu no plano (como um histórico): concluídas, adiantadas, novas e peças revisadas
  const atividade = () => {
    const hojeISO = new Date().toLocaleDateString('sv-SE');
    // as ações criadas junto com o plano não contam como "incluídas": só as que entraram 2 dias ou mais depois do primeiro lote
    const datas = D.acoes.map((a) => a.criada_em).filter(Boolean).sort();
    const lote = datas.length ? U.addDias(datas[0].slice(0, 10), 2) : '9999';
    const ev = [];
    D.acoes.forEach((a) => {
      if (a.status === 'feita' && a.concluida_em) ev.push({ d: a.concluida_em, t: a.titulo, o: a.responsavel === 'gang' ? 'A GANG concluiu' : 'Concluída', k: 'ok' });
      if (a.adiantada_de && a.status !== 'feita') ev.push({ d: (a.criada_em || '').slice(0, 10) || hojeISO, t: a.titulo, o: 'Adiantada para ' + U.nomeMes(a.mes_previsto), k: 'gang' });
      if (a.criada_em && a.criada_em.slice(0, 10) > lote && !a.adiantada_de) ev.push({ d: a.criada_em.slice(0, 10), t: a.titulo, o: 'O consultor incluiu no plano', k: 'novo' });
    });
    D.pedidos.forEach((x) => { if (x.status === 'aprovado' && (x.respondido_em || x.enviado_em)) ev.push({ d: String(x.respondido_em || x.enviado_em).slice(0, 10), t: x.titulo || x.tipo_peca, o: 'Peça aprovada', k: 'ok' }); });
    const xs = ev.filter((e) => e.d && e.d <= hojeISO).sort((a, b) => b.d.localeCompare(a.d)).slice(0, 8);
    if (xs.length < 2) return null;
    return secN('atv-t', 'Atividade recente', xs.length, 'O que aconteceu no plano, do mais novo para o mais antigo.',
      el('ol', 'atv', xs.map((e) => el('li', 'atv__i',
        el('span', 'atv__d', U.dia(e.d)), el('span', 'atv__p atv__p--' + e.k),
        el('div', 'atv__m', el('p', 'atv__t', e.t), el('p', 'atv__o', e.o))))));
  };
  const telaAcoes = () => {
    const total = D.acoes.length;
    const feitas = D.acoes.filter((a) => a.status === 'feita').length;
    const sugerir = el('div', 'head-btns',
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => { revAberta = !revAberta; render(); } }, revAberta ? 'Fechar envio de peça' : 'Enviar peça para revisão'),
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: abrirSugestao }, 'Tenho uma ideia'));
    const out = [head('Plano de execução · ' + dur + ' meses', 'Ações',
      ['O que colocar em prática, mês a mês.', el('br'), 'Marque o andamento do que está com você.'], sugerir)];

    const andN = D.acoes.filter((a) => a.status === 'em_andamento').length;
    const feitasNoPrazo = D.acoes.filter((a) => a.status === 'feita' && (!a.prazo || (a.concluida_em && a.concluida_em <= a.prazo))).length;
    const adiantadas = D.acoes.filter((a) => a.adiantada_de).length;
    out.push(faixa([
      ['Concluídas', feitas + ' de ' + total, total ? Math.round((feitas / total) * 100) + '% do plano' : null],
      ['Em andamento', String(andN)],
      ['No prazo', feitas ? Math.round((feitasNoPrazo / feitas) * 100) + '%' : '—', feitas ? feitasNoPrazo + ' de ' + feitas + ' concluídas' : 'aparece com a primeira'],
      ['Adiantadas', String(adiantadas), adiantadas ? 'antes do mês previsto' : 'termine o mês e adiante uma']]));
    const grupos = {
      // o que fazer agora: as suas primeiro, da mais importante (essencial) para a menos, e pelo prazo
      mes: D.acoes.filter((a) => a.status !== 'feita' && a.mes_previsto <= hoje).sort((a, b) => (a.responsavel === 'gang') - (b.responsavel === 'gang')
        || (PESO[b.peso] || PESO.ajuda)[1] - (PESO[a.peso] || PESO.ajuda)[1] || (a.prazo || '9999').localeCompare(b.prazo || '9999'))
        // as já feitas neste mês continuam na lista, riscadas, no fim (é uma checklist)
        .concat(D.acoes.filter((a) => a.status === 'feita' && a.mes_previsto === hoje)),
      proximos: D.acoes.filter((a) => a.status !== 'feita' && a.mes_previsto > hoje),
      feitas: D.acoes.filter((a) => a.status === 'feita').reverse(),
    };
    const nomes = { mes: U.cap(U.nomeMes(hoje)), proximos: 'Próximos meses', feitas: 'Concluídas' };
    const alvo = abreAcao; abreAcao = null;
    if (alvo) {
      const k = Object.keys(grupos).find((g) => grupos[g].some((x) => x.id === alvo));
      if (k) { abaAcoes = k; abertas.clear(); abertas.add(alvo); }
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const t = document.querySelector('.task[data-id="' + alvo + '"]');
        if (t) { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); t.classList.add('is-destaque'); setTimeout(() => t.classList.remove('is-destaque'), 2200); }
      }));
    }
    const lista = el('ul', { class: 'tasks', id: 'acoes-lista', role: 'tabpanel' });
    const tabs = el('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Ações por período' }, Object.keys(grupos).map((k) =>
      el('button', { class: 'tabs__btn', role: 'tab', type: 'button', 'aria-selected': String(k === abaAcoes), 'aria-controls': 'acoes-lista',
        onclick: () => { abaAcoes = k; render(); } }, nomes[k], el('span', 'tabs__n', String(grupos[k].filter((x) => k === 'feitas' || x.status !== 'feita').length)))));
    tabs.addEventListener('keydown', (ev) => {
      const ks = Object.keys(grupos); const i = ks.indexOf(abaAcoes);
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
        abaAcoes = ks[(i + (ev.key === 'ArrowRight' ? 1 : ks.length - 1)) % ks.length]; render();
        document.querySelector('.tabs [aria-selected="true"]').focus();
      }
    });

    const doGrupo = grupos[abaAcoes];
    if (abaAcoes === 'mes' && mesNaoPago(hoje)) lista.append(el('li', 'tasks__empty', 'As ações de ' + U.nomeMes(hoje) + ' chegam com a mensalidade do mês. ', el('a', { href: '#assinatura' }, 'Ver Meu plano')));
    else if (!doGrupo.length && abaAcoes !== 'proximos') lista.append(el('li', 'tasks__empty', { mes: 'Nenhuma ação pendente neste mês.', proximos: 'Nenhuma ação prevista para os próximos meses.', feitas: 'Nenhuma ação concluída ainda.' }[abaAcoes]));
    const primeira = abaAcoes === 'mes' ? doGrupo.find((a) => a.responsavel !== 'gang') : null;
    if (abaAcoes === 'proximos') {
      // próximos meses: um bloco por mês, fechado; o próximo mês já vem aberto (sem lista gigante)
      const porMes = {}; doGrupo.forEach((a) => { (porMes[a.mes_previsto] = porMes[a.mes_previsto] || []).push(a); });
      const ms = Object.keys(porMes).sort();
      if (!mesesProxAbertos) mesesProxAbertos = new Set(ms.slice(0, 1));
      const alvoMes = alvo && (doGrupo.find((x) => x.id === alvo) || {}).mes_previsto; if (alvoMes) mesesProxAbertos = new Set([alvoMes]);
      ms.forEach((m) => {
        const acs = porMes[m].sort((a, b) => (PESO[b.peso] || PESO.ajuda)[1] - (PESO[a.peso] || PESO.ajuda)[1] || (a.prazo || '9999').localeCompare(b.prazo || '9999'));
        const ess = acs.filter((a) => a.peso === 'essencial').length;
        const det = el('details', { class: 'tasks__mes', open: mesesProxAbertos.has(m) },
          el('summary', null, el('span', 'tasks__mes-t', U.cap(U.nomeMes(m)) + ' ' + m.slice(0, 4)),
            el('span', 'tasks__mes-n', acs.length + (acs.length === 1 ? ' ação' : ' ações') + (ess ? ' · ' + ess + (ess === 1 ? ' essencial' : ' essenciais') : '')),
            acs.some(ehNova) ? el('span', 'task__novo', acs.filter(ehNova).length > 1 ? acs.filter(ehNova).length + ' novas' : 'Nova') : null),
          el('ul', 'tasks tasks--mes', acs.map((a) => cartaoAcao(a))));
        // um mês aberto por vez: abrir um fecha o outro
        det.addEventListener('toggle', () => {
          if (det.open) {
            mesesProxAbertos = new Set([m]);
            lista.querySelectorAll('.tasks__mes[open]').forEach((o) => { if (o !== det) o.open = false; });
            if (det.getBoundingClientRect().top < 70) det.scrollIntoView({ block: 'start', behavior: 'smooth' });
          } else mesesProxAbertos.delete(m);
        });
        lista.append(el('li', 'tasks__mesli', det));
      });
      // os meses seguintes do plano aparecem trancados, com "Abre em…" e sem dizer quantas ações têm. Aparecem todos,
      // e não só os já programados, para a lista não revelar o que o consultor já planejou
      if (inicioRef) {
        const fimRef = U.addRef(inicioRef, dur - 1);
        // o próximo mês ainda não pago também aparece trancado, com o caminho para pagar
        for (let m = U.addRef(hoje, 1); m <= fimRef; m = U.addRef(m, 1)) {
          if (porMes[m] || (m === U.addRef(hoje, 1) && !mesNaoPago(m))) continue;
          lista.append(el('li', 'tasks__mesli', el('div', 'tasks__mes tasks__mes--fechado',
            el('div', 'tasks__fech', el('span', 'tasks__mes-t', U.cap(U.nomeMes(m)) + ' ' + m.slice(0, 4)),
              mesNaoPago(m) ? el('a', { class: 'tasks__cad', href: '#assinatura' }, 'Abre com a mensalidade de ' + U.nomeMes(m))
                : el('span', 'tasks__cad', 'Abre em ' + U.nomeMes(U.addRef(m, -1)))))));
        }
      }
    } else doGrupo.forEach((a) => {
      const card = cartaoAcao(a);
      if (a === primeira) { card.classList.add('is-prioridade'); card.querySelector('.task__sub').prepend(el('span', 'task__flag', 'Faça agora'), ' '); }
      lista.append(card);
    });
    const pend = doGrupo.filter((x) => x.status !== 'feita').length;
    // terminou o mês? pode adiantar uma ação do próximo (o consultor repõe outra lá, e o plano não acaba antes do fim)
    const proxRef = U.addRef(hoje, 1);
    const minhasAbertas = D.acoes.filter((a) => comCliente(a) && a.status !== 'feita' && a.mes_previsto <= hoje).length;
    const podeAdiantar = abaAcoes === 'mes' && !minhasAbertas && D.acoes.some((a) => comCliente(a) && a.mes_previsto === hoje && a.status === 'feita')
      ? D.acoes.filter((a) => comCliente(a) && a.mes_previsto === proxRef && a.status === 'a_fazer')
        .sort((a, b) => (TAM_PTS[a.tamanho] || 2) - (TAM_PTS[b.tamanho] || 2)).slice(0, 3) : [];
    const adiantar = podeAdiantar.length ? el('section', { class: 'adiantar', 'aria-labelledby': 'adi-t' },
      el('div', 'adiantar__head', el('span', { class: 'adiantar__ico', 'aria-hidden': 'true' }),
        el('div', null, el('h2', { class: 'adiantar__t', id: 'adi-t' }, 'Você terminou as ações de ' + U.nomeMes(hoje) + '.'),
          el('p', 'adiantar__d', 'Quer adiantar uma de ' + U.nomeMes(proxRef) + '? O plano continua completo até o fim.'))),
      el('ul', 'adiantar__lista', podeAdiantar.map((a) => el('li', 'adiantar__item',
        el('div', 'adiantar__info', el('p', 'adiantar__nome', a.titulo), el('p', 'adiantar__meta', [a.tamanho ? TAM_TXT[a.tamanho] : null, a.peso === 'essencial' ? 'essencial' : null].filter(Boolean).join(' · '))),
        el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: async (e) => {
          e.currentTarget.disabled = true;
          const { error } = await sb.rpc('portal_adiantar_acao', { p_acao: a.id });
          if (error) { e.currentTarget.disabled = false; return anuncia(/Termine/.test(error.message || '') ? 'Termine as ações deste mês antes de adiantar.' : /mensalidade/.test(error.message || '') ? 'O próximo mês chega com a mensalidade dele.' : 'Não foi possível adiantar agora.'); }
          a.adiantada_de = a.mes_previsto; a.mes_previsto = hoje; a.atualizada_em = new Date().toISOString();
          const dias = { G: 14, M: 7 }[a.tamanho] || 3; const d = new Date(); d.setDate(d.getDate() + dias);
          const fimMes = new Date(d.getFullYear(), new Date().getMonth() + 1, 0); a.prazo = (d > fimMes ? fimMes : d).toLocaleDateString('sv-SE');
          abertas.clear(); abertas.add(a.id); render(); indicadores(); anuncia('“' + a.titulo + '” agora é deste mês.');
        } }, 'Adiantar'))))) : null;
    out.push(el('div', 'actions-wrap', tabs, el('section', { class: 'box tasks-box', 'aria-label': nomes[abaAcoes] },
      el('div', 'tasks__head', el('p', 'tasks__t', nomes[abaAcoes]), el('span', 'tasks__count', abaAcoes === 'feitas' ? doGrupo.length + (doGrupo.length === 1 ? ' concluída' : ' concluídas') : (doGrupo.length - pend) + ' de ' + doGrupo.length + ' feitas'),
        el('span', 'tasks__hint', 'Clique numa tarefa para ver o porquê')),
      lista)));
    if (adiantar) out.push(adiantar);

    if (revAberta) out.splice(1, 0, formRevisao());
    const pcs = suasPecas(); if (pcs) out.push(pcs);
    const atv = atividade(); if (atv) out.push(atv);
    const ea = esforcoEAprendizados(); if (ea) out.push(ea);
    if (D.descartadas.length) out.push(el('p', 'box__note nota-linha', 'O que decidimos não fazer está na ', el('a', { class: 'link', href: '#estrategia' }, 'Estratégia'), ', em “Deixamos de lado”.'));
    return out;
  };

  // ===== cada ação é uma tarefa de checklist: marcar, mudar o status e abrir os detalhes =====
  const abertas = new Set();
  // "Novo": ação que o consultor colocou depois da montagem inicial do plano, até o cliente abrir
  // (a primeira leva, criada de uma vez, é o plano; ações antigas sem data não contam)
  // aceita "2026-11-11T18:59:25.106133+00:00" e "2026-11-11 15:59:25.106133-03:00"
  const momento = (t) => Date.parse(String(t || '').replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1'));
  const primeiraLeva = (() => {
    if (D.acoes.some((a) => !a.criada_em)) return null;
    const ts = D.acoes.map((a) => momento(a.criada_em)).filter(Number.isFinite);
    return ts.length ? Math.min(...ts) + 3600000 : null;
  })();
  const ehNova = (a) => !!a.criada_em && !a.vista_em && !a.adiantada_de && (primeiraLeva == null || momento(a.criada_em) > primeiraLeva);
  const vistaAcao = (a) => { if (!ehNova(a)) return; a.vista_em = new Date().toISOString(); sb.rpc('portal_ver_acao', { p_acao: a.id }).then(() => {}); }; // o .then envia o pedido (sem ele, nada sai)
  const TAM_PTS = { P: 1, M: 2, G: 4 };
  const TAM_TXT = { P: 'rápida, até 1 hora', M: 'até 1 dia', G: 'uma semana ou mais' };
  let menuAberto = null;
  const fechaMenu = () => { if (menuAberto) { menuAberto.remove(); menuAberto = null; } };
  document.addEventListener('click', fechaMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechaMenu(); });
  const ST_ICO = { a_fazer: 'todo', em_andamento: 'doing', feita: 'done' };
  const MOTIVOS = { tempo: 'Sem tempo', verba: 'Sem verba', duvida: 'Com dúvida', outro: 'Outro motivo' };
  const trava = async (a, motivo) => {
    const antes = [a.travada, a.travada_nota];
    a.travada = motivo; a.travada_nota = null; render();
    const { error } = await sb.rpc('portal_trava_acao', { p_acao: a.id, p_motivo: motivo, p_nota: null });
    if (error) { [a.travada, a.travada_nota] = antes; render(); return anuncia('Não foi possível salvar. Tente de novo.'); }
    anuncia(motivo ? '“' + a.titulo + '” marcada como travada. Vai para a pauta ' + quandoEncontro() + '.' : '“' + a.titulo + '” destravada.');
  };
  const menuStatus = (a, ancora) => {
    fechaMenu();
    const motivos = el('div', { class: 'stmenu__sub', hidden: true }, el('p', 'stmenu__lbl', 'O que está travando?'),
      Object.entries(MOTIVOS).map(([k, t]) => el('button', { class: 'stmenu__item' + (a.travada === k ? ' is-on' : ''), type: 'button', role: 'menuitemradio', 'aria-checked': String(a.travada === k),
        onclick: (e) => { e.stopPropagation(); fechaMenu(); trava(a, k); } }, el('span', null, t))),
      a.travada ? el('button', { class: 'stmenu__item', type: 'button', onclick: (e) => { e.stopPropagation(); fechaMenu(); trava(a, null); } }, el('span', null, 'Destravar')) : null);
    const m = el('div', { class: 'stmenu', role: 'menu' }, Object.entries(STATUS).map(([k, t]) => el('button', {
      class: 'stmenu__item st--' + ST_ICO[k] + (a.status === k && !a.travada ? ' is-on' : ''), type: 'button', role: 'menuitemradio', 'aria-checked': String(a.status === k),
      onclick: (e) => { e.stopPropagation(); fechaMenu(); mudaStatus(a, k); } }, el('span', 'stmenu__ico'), el('span', null, t))),
      a.status !== 'feita' ? el('button', { class: 'stmenu__item st--trav' + (a.travada ? ' is-on' : ''), type: 'button', 'aria-haspopup': 'true',
        onclick: (e) => { e.stopPropagation(); motivos.hidden = !motivos.hidden; } }, el('span', 'stmenu__ico'), el('span', null, 'Travada…')) : null, motivos);
    m.addEventListener('click', (e) => e.stopPropagation());
    ancora.after(m); menuAberto = m; const b = m.querySelector('.is-on') || m.querySelector('button'); if (b) b.focus();
  };
  // o mês na linha da ação só quando informa algo: nas concluídas (meses misturados) e numa pendente de mês anterior
  const mesNaLinha = (a) => {
    if (abaAcoes === 'feitas') return U.cap(U.nomeMesCurto(a.mes_previsto));
    if (abaAcoes === 'mes' && a.mes_previsto && a.mes_previsto < U.ref(new Date()) && a.status !== 'feita') return 'de ' + U.nomeMes(a.mes_previsto);
    return null;
  };
  // ===== micro animações: só no que acabou de acontecer (não repetem a cada redesenho) =====
  let recemFeita = null;            // a ação marcada como feita neste clique: ✓ se desenha e o título é riscado
  const concluidasAgora = new Set(); // ações feitas nesta visita: a missão delas pulsa quando a Visão Geral aparecer
  let cfRecente = null;             // a resposta de "Como foi o mês?" que acabou de ser dada
  let cfMissaoNova = false;         // ...e a missão "Contar como foi" pulsa uma vez
  let misPctAntes = null; let misFeitasAntes = null; // a barra das missões cresce do valor anterior
  const guarda = { get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: sem animação */ } } };

  // tarefas de medição e de revisão (pesquisa, revisão do semestre ou do ano): medem a marca, não constroem lembrança,
  // então não levam a etiqueta de efeito de marca
  const ehMedicao = (a) => /pesquisa|revis[aã]o (semestral|anual)|plano do segundo ano/i.test(a.titulo_base || a.titulo || '');
  const cartaoAcao = (a) => {
    const o = objetivo[a.objetivo_id];
    const p = prazo(a);
    // o porquê da ação: o objetivo que ela serve, o momento de compra que ela mira e como saberemos que deu certo
    // toda ação mostra a intenção: o objetivo cadastrado ou, sem ele, o resultado do plano que ela move
    const OBJ_PROM = { vendas: 'Fazer quem já conhece a marca comprar mais e voltar', pessoas: 'Trazer mais pessoas para a marca', valor: 'Vender com mais valor, sem depender de desconto' };
    const kProm = U.promessaDe(a);
    const objTxt = U.cap(a.serve_para || (o ? o.titulo : '')) || (a.esforco === 'marca' && !a.promessa ? 'Fazer a marca ser lembrada na hora da compra' : OBJ_PROM[kProm]);
    const porque = [
      ['Objetivo', objTxt, o ? NIVEL[o.nivel] : U.PROMESSAS[kProm] || null],
      ['Estratégia', a.executa ? 'Executa a abordagem da marca: ' + a.executa.charAt(0).toLowerCase() + a.executa.slice(1) : null, null],
      ['Por que funciona', a.porque ? U.cap(a.porque) : null, null],
      ['Momento de compra', situacaoDe(a) ? 'Lembrarem da marca quando “' + situacaoDe(a) + '”' : null, null],
      ['Sucesso se', a.metrica_sucesso ? U.cap(a.metrica_sucesso) : null, null],
    ].filter(([, v]) => v);
    const editavel = comCliente(a); // inclusive as concluídas: um clique errado sempre pode ser desfeito
    const aberta = abertas.has(a.id);
    const check = el('button', { class: 'task__check st--' + ST_ICO[a.status], type: 'button', disabled: !editavel,
      'aria-label': a.status === 'feita' ? 'Marcar “' + a.titulo + '” como não feita' : 'Marcar “' + a.titulo + '” como feita',
      title: editavel ? (a.status === 'feita' ? 'Desmarcar' : 'Marcar como feita') : 'Esta ação está com a GANG',
      onclick: (e) => { e.stopPropagation(); mudaStatus(a, a.status === 'feita' ? 'a_fazer' : 'feita'); } });
    const chipK = a.travada && a.status !== 'feita' ? 'warn' : { a_fazer: 'todo', em_andamento: 'doing', feita: 'done' }[a.status];
    const chipT = a.travada && a.status !== 'feita' ? 'Travada' : STATUS[a.status];
    const status = editavel
      ? el('button', { class: 'task__status chip chip--' + chipK, type: 'button', 'aria-haspopup': 'menu',
        onclick: (e) => { e.stopPropagation(); if (menuAberto && menuAberto.previousElementSibling === e.currentTarget) fechaMenu(); else menuStatus(a, e.currentTarget); } }, chipT)
      : el('span', { class: 'task__status chip chip--' + chipK }, chipT);
    const ps = Array.isArray(a.passos) ? a.passos : [];
    const feitos = ps.filter((x) => x.ok).length;
    const marcaPasso = async (i, ok) => {
      // marcou um passo: a ação começou; desmarcou o último: volta para "a fazer" (sem passo feito não está em andamento)
      const antes = ps[i].ok; const stAntes = a.status; ps[i].ok = ok;
      if (ok && a.status === 'a_fazer') a.status = 'em_andamento';
      if (!ok && a.status === 'em_andamento' && !ps.some((x) => x.ok)) a.status = 'a_fazer';
      render();
      const { error } = await sb.rpc('portal_passo_acao', { p_acao: a.id, p_i: i, p_ok: ok });
      if (error) { ps[i].ok = antes; a.status = stAntes; render(); return anuncia('Não foi possível salvar o passo.'); }
      if (ok && ps.every((x) => x.ok) && a.status !== 'feita') anuncia('Todos os passos feitos. Marque a ação como feita quando terminar.');
    };
    // ação grande (G): cada passo ganha uma data, repartida entre o começo do mês e o prazo (progresso toda semana, sem ficar parada)
    const datasPassos = (() => {
      if (a.tamanho !== 'G' || !a.prazo || ps.length < 2 || a.status === 'feita') return [];
      const ini = new Date(a.mes_previsto + '-01T12:00:00'); const fim = new Date(a.prazo + 'T12:00:00');
      const comeco = a.adiantada_de && a.atualizada_em ? new Date(a.atualizada_em) : ini;
      const total = Math.max(1, (fim - comeco) / 86400000);
      return ps.map((_, i) => { const d = new Date(comeco); d.setDate(d.getDate() + Math.round(total * (i + 1) / ps.length)); return d.toLocaleDateString('sv-SE'); });
    })();
    const passos = ps.length ? el('div', 'passos',
      el('div', 'passos__head', el('p', 'passos__t', 'Passo a passo'), el('span', 'passos__n', feitos + ' de ' + ps.length),
        el('span', 'passos__bar', el('span', { style: 'width:' + Math.round(feitos / ps.length * 100) + '%' }))),
      el('ul', 'passos__list', ps.map((x, i) => {
        const cb = el('input', { type: 'checkbox', checked: !!x.ok, disabled: !editavel, 'aria-label': x.t });
        cb.addEventListener('change', () => marcaPasso(i, cb.checked));
        const ate = datasPassos[i];
        return el('li', x.ok ? 'is-ok' : null, el('label', null, cb, el('span', null, x.t)),
          ate && !x.ok ? el('span', 'passos__ate' + (ate < new Date().toLocaleDateString('sv-SE') ? ' is-hot' : ''), 'até ' + U.dia(ate)) : null);
      }))) : null;
    const copiaModelo = a.modelo ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: async (e) => {
      try { await navigator.clipboard.writeText(a.modelo); e.currentTarget.textContent = 'Copiada ✓'; } catch (err) { /* sem permissão: o texto está visível */ }
    } }, 'Copiar mensagem') : null;
    const modelo = a.modelo ? el('div', 'modelo', el('div', 'modelo__head', el('p', 'passos__t', 'Mensagem pronta'), copiaModelo),
      el('p', 'modelo__txt', a.modelo), el('p', 'box__note', 'Troque o que está entre colchetes antes de enviar.')) : null;
    const ajuda = editavel && a.status !== 'feita' ? (() => {
      const txt = el('textarea', { class: 'field', rows: 2, maxlength: 2000, placeholder: 'Qual é a dúvida sobre esta ação?', 'aria-label': 'Dúvida sobre ' + a.titulo });
      const caixa = el('div', { class: 'duvida__form', hidden: true }, txt,
        el('div', 'duvida__btns', el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: async (e) => {
          e.stopPropagation(); if (txt.value.trim().length < 3) return txt.focus();
          if (await levarEncontro('Sobre a ação “' + a.titulo + '”: ' + txt.value.trim(), a.id)) caixa.replaceWith(el('p', 'duvida__ok', 'Anotado para a pauta ' + quandoEncontro() + '.'));
        } }, 'Levar para o encontro')));
      return el('div', 'duvida',
        el('p', 'duvida__t', 'Ficou com dúvida?'),
        el('p', 'duvida__d', [ps.length ? 'confira os passos' : null, a.modelo ? 'use a mensagem pronta' : null, 'veja a Narrativa da marca'].filter(Boolean).join(', ').replace(/^./, (c) => c.toUpperCase()) + '. Se ainda ficar, a dúvida vai para a pauta ' + quandoEncontro() + '.'),
        el('div', 'duvida__btns', el('a', { class: 'btn btn--ghost btn--sm', href: '#plataforma' }, 'Abrir a Narrativa'),
          el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: (e) => { e.stopPropagation(); caixa.hidden = false; txt.focus(); e.currentTarget.remove(); } }, 'Levar para o encontro')),
        caixa);
    })() : null;
    const temDetalhe = porque.length || a.observacao || a.status === 'feita' || ps.length || a.modelo;
    // primeiro a intenção (objetivo, por que funciona, sucesso), depois o como (passos e mensagem pronta)
    const corpo = temDetalhe && aberta ? el('div', 'task__body',
      porque.length ? el('dl', { class: 'why', 'aria-label': 'Por que esta ação' }, porque.map(([k, v, tag]) => el('div', 'why__item',
        el('dt', null, k, tag ? el('span', 'why__tag', tag) : null), el('dd', null, v)))) : null,
      passos, modelo,
      a.observacao ? el('div', 'action__obs', D.consultor ? avatar(D.consultor) : null,
        el('div', null, el('p', 'action__obs-lbl', 'Observação ' + (D.consultor && D.consultor.nome ? 'de ' + D.consultor.nome.split(' ')[0] : 'do consultor')), el('p', 'action__obs-txt', a.observacao))) : null,
      a.status === 'feita' ? blocoResultado(a) : null, ajuda) : null;
    // uma ação aberta por vez: abrir uma fecha a outra (sem amontoado de detalhes na tela)
    const alterna = () => {
      if (!temDetalhe) return;
      const abrir = !abertas.has(a.id); abertas.clear(); if (abrir) { abertas.add(a.id); vistaAcao(a); } render();
      if (abrir) requestAnimationFrame(() => { const n = document.querySelector('.task[data-id="' + a.id + '"]'); if (n && n.getBoundingClientRect().top < 70) n.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
    };
    const linha = el('div', { class: 'task__row', role: temDetalhe ? 'button' : null, tabindex: temDetalhe ? '0' : null, 'aria-expanded': temDetalhe ? String(aberta) : null,
      onclick: alterna, onkeydown: (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); alterna(); } } },
      check,
      el('div', 'task__main',
        el('p', 'task__title', a.titulo),
        el('p', 'task__sub', ehNova(a) ? el('span', 'task__novo', 'Novo') : null, ehNova(a) ? ' ' : null, [mesNaLinha(a), ps.length ? feitos + ' de ' + ps.length + ' passos' : null, a.tamanho ? 'tamanho ' + a.tamanho : null, a.esforco === 'marca' && !ehMedicao(a) ? 'efeito em 6 a 12 meses' : null, a.observacao ? 'nota do consultor' : null,
          a.travada && a.status !== 'feita' ? 'travada: ' + MOTIVOS[a.travada].toLowerCase() : null, a.adiantada_de ? 'adiantada de ' + U.nomeMesCurto(a.adiantada_de).toLowerCase() : null].filter(Boolean).join(' · '))),
      // quem faz: só aparece quando não é só o cliente (GANG, junto com a GANG ou com outra pessoa)
      el('div', 'task__tags', p.text ? el('span', 'mtag mtag--date' + (p.hot ? ' is-hot' : ''), p.text) : null),
      el('div', 'task__st', status),
      temDetalhe ? el('span', { class: 'task__chev' + (aberta ? ' is-open' : ''), 'aria-hidden': 'true' }) : el('span', 'task__chev is-none'));
    return el('li', { class: 'task' + (a.status === 'feita' ? ' is-feita' : '') + (aberta ? ' is-aberta' : '') + (a.id === recemFeita ? ' is-recem' : ''), 'data-id': a.id }, linha, corpo);
  };

  const situacaoDe = (a) => { const x = (D.situacoes || []).find((s2) => s2.id === a.situacao_id); return x ? x.texto : null; };

  // depois de feita: funcionou? o que aprendemos? (o ciclo só fecha quando o resultado é comparado com o objetivo)
  const RES = { sim: ['done', 'Funcionou'], parcial: ['doing', 'Funcionou em parte'], nao: ['warn', 'Não funcionou'] };
  const blocoResultado = (a) => {
    if (!comCliente(a)) {
      const rt = a.esforco === 'marca' && a.resultado ? [RES[a.resultado][0], { sim: 'Feita como planejado', parcial: 'Feita em parte', nao: 'Não saiu como planejado' }[a.resultado]] : RES[a.resultado];
      return a.resultado ? el('div', 'result', chip(...rt), a.aprendizado ? el('p', 'result__learn', a.aprendizado) : null) : null;
    }
    const txt = el('textarea', { class: 'field result__input', rows: 2, maxlength: 1000, placeholder: 'O que aprendemos? (opcional)', 'aria-label': 'O que aprendemos com “' + a.titulo + '”' });
    txt.value = a.aprendizado || '';
    const msg = el('p', { class: 'msg', role: 'status' });
    const marca = a.esforco === 'marca' || ehMedicao(a); // medição também se avalia por "foi feita como planejado?"
    const salva = async (r) => {
      const { error } = await sb.rpc('portal_resultado_acao', { p_acao: a.id, p_resultado: r, p_aprendizado: txt.value });
      if (error) return U.say(msg, 'Não foi possível salvar.', 'error');
      a.resultado = r; a.aprendizado = txt.value.trim() || null; render(); anuncia('Resultado salvo.');
    };
    return el('div', 'result',
      el('p', 'result__q', marca ? 'Foi feita como planejado?' : a.metrica_sucesso ? 'Funcionou? (' + a.metrica_sucesso + ')' : 'Funcionou?'),
      marca && !ehMedicao(a) ? el('p', 'box__note', 'Ação de marca: o efeito aparece em 6 a 12 meses e é medido na pesquisa do semestre, não agora.') : null,
      el('div', { class: 'seg seg--sm', role: 'group', 'aria-label': 'Resultado de “' + a.titulo + '”' },
        Object.entries(RES).map(([k, [, t]]) => el('button', { class: 'seg__btn', type: 'button', 'aria-pressed': String(a.resultado === k), onclick: () => salva(k) }, marca ? { sim: 'Sim', parcial: 'Em parte', nao: 'Não' }[k] : t.replace('Funcionou em parte', 'Em parte').replace('Não funcionou', 'Não').replace('Funcionou', 'Sim')))),
      txt,
      el('div', 'result__foot', el('button', { class: 'link', type: 'button', onclick: () => salva(a.resultado || null) }, 'Salvar aprendizado'), msg));
  };

  // aviso com "Desfazer" depois de mudar um status (para o clique sem querer)
  const toast = el('div', { class: 'toast', role: 'status', 'aria-live': 'polite', hidden: true });
  document.body.append(toast);
  let toastTimer = null;
  const avisoDesfazer = (texto, desfazer) => {
    clearTimeout(toastTimer);
    const b = el('button', { class: 'toast__undo', type: 'button' }, 'Desfazer');
    b.addEventListener('click', () => { toast.hidden = true; desfazer(); });
    toast.replaceChildren(el('span', null, texto), b);
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 8000);
  };

  const mudaStatus = async (a, status, voltando) => {
    if (a.status === status && !a.travada) return;
    const antes = { status: a.status, concluida_em: a.concluida_em, travada: a.travada, travada_nota: a.travada_nota };
    a.travada = null; a.travada_nota = null;
    a.status = status; a.concluida_em = status === 'feita' ? new Date().toLocaleDateString('sv-SE') : null; // AAAA-MM-DD local
    if (status === 'feita' && !voltando) { recemFeita = a.id; concluidasAgora.add(a.id); } else concluidasAgora.delete(a.id);
    render(); recemFeita = null; indicadores();
    const { error } = await sb.rpc('portal_status_acao', { p_acao: a.id, p_status: status });
    if (error) {
      Object.assign(a, antes); render(); indicadores();
      return anuncia('Não foi possível salvar. Tente de novo.');
    }
    const txt = status === 'feita' ? '“' + a.titulo + '” marcada como feita.' : '“' + a.titulo + '”: ' + STATUS[status] + '.';
    if (voltando) { toast.hidden = true; return anuncia('Desfeito: “' + a.titulo + '” voltou para ' + STATUS[status] + '.'); }
    avisoDesfazer(txt, () => mudaStatus(a, antes.status, true));
  };

  // sugerir uma ação (vai para o consultor avaliar)
  const dlg = el('dialog', { class: 'dialog', 'aria-labelledby': 'sug-t' });
  const sugForm = el('form', { class: 'dialog__body', method: 'dialog' },
    el('h2', { class: 'title-sm', id: 'sug-t' }, 'Sugerir uma ação'),
    el('p', 'small', 'Conte o que você gostaria de fazer. O consultor avalia e, se fizer sentido, entra no plano.'),
    el('label', { class: 'label', for: 'sug-txt' }, 'Sua sugestão'),
    el('textarea', { class: 'field', id: 'sug-txt', rows: 5, maxlength: 2000, required: true }),
    el('p', { class: 'msg', id: 'sug-msg', role: 'status', 'aria-live': 'polite' }),
    el('div', 'dialog__foot',
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => dlg.close() }, 'Cancelar'),
      el('button', { class: 'btn btn--light btn--sm', type: 'submit', value: 'send' }, 'Enviar sugestão')));
  dlg.append(sugForm);
  document.body.append(dlg);
  function abrirSugestao() { abrirIdeia(); }
  // "Elimine as dúvidas e incertezas que dificultam suas decisões de marketing": a ideia passa pela estratégia antes
  const ideia = el('dialog', { class: 'dialog dialog--wide', 'aria-labelledby': 'ideia-t' });
  const abrirIdeia = () => {
    const prio = (D.escolhas || []).filter((x) => x.tipo === 'prioridade').map((x) => x.texto);
    const lado = [...(D.escolhas || []).filter((x) => x.tipo === 'deixa_de_lado').map((x) => x.texto), ...D.descartadas.map((x) => x.texto)];
    const objs = D.objetivos.filter((o) => o.titulo);
    const msgC = D.plataforma && D.plataforma.mensagem_central;
    const sn = (name) => el('div', 'yn', [['sim', 'Sim'], ['nao', 'Não'], ['ns', 'Não sei']].map(([v, t]) => el('label', null, el('input', { type: 'radio', name, value: v }), t)));
    const txt = el('textarea', { class: 'field', id: 'ideia-txt', rows: 3, maxlength: 2000, placeholder: 'Ex.: fazer um sorteio no Instagram, patrocinar um evento, baixar o preço…' });
    const objSel = el('select', { class: 'field', id: 'ideia-obj' }, el('option', { value: '' }, 'Nenhum deles'), objs.map((o) => el('option', { value: o.id }, U.cap(o.titulo))));
    const res = el('div', { class: 'ideia__res', role: 'status', 'aria-live': 'polite' });
    const enviar = el('button', { class: 'btn btn--light btn--sm', type: 'button', hidden: true }, 'Enviar ao consultor');
    const form = el('form', { class: 'dialog__body', novalidate: true },
      el('h2', { class: 'title-sm', id: 'ideia-t' }, 'Vale a pena fazer?'),
      el('p', 'small', 'Antes de investir tempo ou dinheiro numa ideia, confira se ela cabe na estratégia da sua marca.'),
      el('label', { class: 'label', for: 'ideia-txt' }, 'Qual é a ideia?'), txt,
      el('fieldset', 'ideia__q', el('legend', null, '1. Fala com o cliente que escolhemos atender?'), prio.length ? el('p', 'box__note', 'Nossa prioridade: ' + prio.join(' · ')) : null, sn('q1')),
      el('fieldset', 'ideia__q', el('legend', null, '2. Ajuda a alcançar qual objetivo?'), objSel),
      el('fieldset', 'ideia__q', el('legend', null, '3. Está entre o que decidimos não fazer?'), lado.length ? el('p', 'box__note', lado.join(' · ')) : null, sn('q3')),
      el('fieldset', 'ideia__q', el('legend', null, '4. Reforça a mensagem central e usa os ativos da marca?'), msgC ? el('p', 'box__note', '“' + msgC + '”') : null, sn('q4')),
      res,
      el('div', 'dialog__foot', el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => ideia.close() }, 'Fechar'),
        el('button', { class: 'btn btn--ghost btn--sm', type: 'submit' }, 'Ver a resposta'), enviar));
    let resumo = '';
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const v = (n) => { const r = form.querySelector('input[name=' + n + ']:checked'); return r ? r.value : null; };
      if (txt.value.trim().length < 3) return res.replaceChildren(el('p', 'msg is-error', 'Escreva a ideia.'));
      if (!v('q1') || !v('q3') || !v('q4')) return res.replaceChildren(el('p', 'msg is-error', 'Responda as quatro perguntas.'));
      const obj = objs.find((o) => o.id === objSel.value);
      let k; let t; let d;
      if (v('q3') === 'sim') { k = 'no'; t = 'Não faça agora'; d = 'Ela está entre o que decidimos não fazer. Se ainda achar que vale, converse com o consultor antes.'; }
      else if (!obj || v('q1') === 'nao') { k = 'mid'; t = 'Provavelmente não é prioridade'; d = obj ? 'Ela não fala com o cliente que escolhemos atender.' : 'Ela não ajuda nenhum objetivo do plano. O que não ajuda o objetivo tira energia do que ajuda.'; }
      else if (v('q4') === 'nao') { k = 'mid'; t = 'Pode fazer sentido, com ajustes'; d = 'Ajuste para reforçar a mensagem central e usar os ativos da marca; do contrário, ela não constrói a marca.'; }
      else { k = 'ok'; t = 'Faz sentido'; d = 'Ela cabe na estratégia. Mande para o consultor encaixar no plano.'; }
      resumo = txt.value.trim() + '\n\n[Vale a pena fazer? ' + t + '] Cliente certo: ' + v('q1') + ' · Objetivo: ' + (obj ? obj.titulo : 'nenhum') + ' · Está no "não fazer": ' + v('q3') + ' · Reforça a marca: ' + v('q4');
      res.replaceChildren(el('p', 'brk__verdict is-' + k, (k === 'ok' ? '✓ ' : k === 'mid' ? '~ ' : '✕ ') + t), el('p', 'box__text', d));
      enviar.hidden = false; enviar.textContent = k === 'ok' ? 'Enviar ao consultor' : 'Enviar mesmo assim para o consultor avaliar';
    });
    enviar.addEventListener('click', async () => {
      enviar.disabled = true;
      const { error } = await sb.rpc('portal_sugerir_acao', { p_texto: resumo });
      enviar.disabled = false;
      if (error) return res.append(el('p', 'msg is-error', 'Não foi possível enviar.'));
      ideia.close(); anuncia('Ideia anotada para a pauta ' + quandoEncontro() + '.');
    });
    ideia.replaceChildren(form);
    if (!ideia.isConnected) document.body.append(ideia);
    ideia.showModal(); txt.focus();
  };
  sugForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = $('sug-txt').value.trim();
    if (t.length < 3) return U.say($('sug-msg'), 'Escreva a sugestão.', 'error');
    const btn = sugForm.querySelector('[type=submit]'); btn.disabled = true;
    const { error } = await sb.rpc('portal_sugerir_acao', { p_texto: t });
    btn.disabled = false;
    if (error) return U.say($('sug-msg'), 'Não foi possível enviar. Tente de novo.', 'error');
    dlg.close(); anuncia('Sugestão anotada para a pauta ' + quandoEncontro() + '.');
    const ok = document.querySelector('.count');
    if (ok) ok.after(el('p', { class: 'msg is-ok', role: 'status' }, 'Sugestão enviada. O consultor responde no próximo encontro.'));
  });

  // ===== gráficos (SVG feito à mão: linhas e barras; nunca pizza) =====
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs, ...kids) => {
    const n = document.createElementNS(SVGNS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => { if (v != null) n.setAttribute(k, v); });
    kids.flat().forEach((k) => { if (k != null) n.append(k instanceof Node ? k : document.createTextNode(String(k))); });
    return n;
  };
  const C = { ink: '#f3f3f3', acc: ACENTO, ref: '#6b6b6b', grid: '#2e2e2e', axis: '#737373', surface: '#1c1c1c', bar: ACENTO, barHover: '#ffffff' };
  // ticks "redondos" para o eixo Y
  const ticks = (min, max, alvo = 4) => {
    const span = Math.max(max - min, 1e-9);
    const passo0 = span / alvo;
    const mag = 10 ** Math.floor(Math.log10(passo0));
    const passo = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((p) => p >= passo0) || 10 * mag;
    const lo = Math.floor(min / passo) * passo; const hi = Math.ceil(max / passo) * passo;
    const out = []; for (let v = lo; v <= hi + passo / 2; v += passo) out.push(Math.round(v * 1e6) / 1e6);
    return out;
  };
  // desenha quando já está na página e redesenha ao mudar a largura
  const grafico = (cls, label, draw) => {
    const box = el('div', { class: 'chart ' + cls, role: 'img', 'aria-label': label });
    const tip = el('div', { class: 'chart__tip', hidden: true });
    let w0 = 0;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (!w || w === w0) return; w0 = w;
      [...box.querySelectorAll('svg')].forEach((s) => s.remove());
      box.prepend(draw(w, tip, box));
    });
    box.append(tip);
    requestAnimationFrame(() => ro.observe(box));
    return box;
  };
  const dica = (tip, box, x, y, linhas) => {
    tip.replaceChildren(...linhas.map(([v, nome, cor]) => el('div', 'chart__row',
      cor ? el('span', { class: 'chart__key', style: 'background:' + cor }) : null, el('strong', null, v), nome ? el('span', null, nome) : null)));
    tip.hidden = false;
    const bw = box.clientWidth; const tw = tip.offsetWidth;
    tip.style.left = Math.min(Math.max(x - tw / 2, 0), bw - tw) + 'px';
    tip.style.top = Math.max(y - tip.offsetHeight - 12, 0) + 'px';
  };

  // linhas: rótulos no X, séries com valores (null = sem dado)
  const graficoLinhas = ({ rotulos, series, fmt, label, escala = 1 }) => grafico('chart--line', label, (W, tip, box) => {
    const H = 240; const L = 48; const R = 56; const T = 14; const B = 30;
    const vals = series.flatMap((s) => s.valores.filter((v) => v != null));
    const tk = ticks(Math.min(0, ...vals), Math.max(escala, ...vals)); // escala: o teto do eixo quando ainda não há dados
    const y = (v) => T + (H - T - B) * (1 - (v - tk[0]) / (tk[tk.length - 1] - tk[0]));
    const n = rotulos.length;
    const x = (i) => L + (n === 1 ? (W - L - R) / 2 : ((W - L - R) * i) / (n - 1));
    const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    tk.forEach((t) => svg.append(sv('line', { x1: L, x2: W - R, y1: y(t), y2: y(t), stroke: C.grid, 'stroke-width': 1, 'stroke-dasharray': t === tk[0] ? null : '3 4' }),
      sv('text', { x: L - 10, y: y(t) + 4, 'text-anchor': 'end', class: 'chart__axis' }, fmt(t))));
    const cada = Math.ceil(n / Math.max(1, Math.floor((W - L - R) / 56)));
    rotulos.forEach((r, i) => { if (i % cada === 0 || i === n - 1) svg.append(sv('text', { x: x(i), y: H - 8, 'text-anchor': 'middle', class: 'chart__axis' }, r)); });
    series.forEach((s) => {
      let d = ''; let caneta = false;
      s.valores.forEach((v, i) => { if (v == null) { caneta = false; return; } d += (caneta ? 'L' : 'M') + x(i) + ' ' + y(v) + ' '; caneta = true; });
      if (s.pontos && !s.semArea) {
        const pts = s.valores.map((v, i) => (v == null ? null : [x(i), y(v)])).filter(Boolean);
        if (pts.length > 1) {
          const gid = 'g' + Math.random().toString(36).slice(2, 8);
          const g = sv('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 });
          g.append(sv('stop', { offset: '0%', 'stop-color': s.cor, 'stop-opacity': 0.28 }), sv('stop', { offset: '100%', 'stop-color': s.cor, 'stop-opacity': 0 }));
          const defs = sv('defs', {}); defs.append(g); svg.append(defs);
          const yb = y(tk[0]);
          svg.append(sv('path', { d: 'M' + pts[0][0] + ' ' + yb + ' ' + pts.map((q) => 'L' + q[0] + ' ' + q[1]).join(' ') + ' L' + pts[pts.length - 1][0] + ' ' + yb + 'Z', fill: 'url(#' + gid + ')' }));
        }
      }
      svg.append(sv('path', { d, fill: 'none', stroke: s.cor, 'stroke-width': s.tracejado ? 1.5 : 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': s.tracejado ? '4 5' : null, pathLength: s.tracejado ? null : 1, class: s.tracejado ? null : 'chart__traco' }));
      if (s.pontos) s.valores.forEach((v, i) => { if (v != null) svg.append(sv('circle', { cx: x(i), cy: y(v), r: 4, fill: s.cor, stroke: C.surface, 'stroke-width': 2 })); });
      const last = s.valores.reduce((a, v, i) => (v != null ? i : a), -1);
      if (last >= 0 && s.rotuloFim) svg.append(sv('text', { x: x(last) + 8, y: y(s.valores[last]) - 10, class: 'chart__end' }, fmt(s.valores[last])));
    });
    const mira = sv('line', { y1: T, y2: H - B, stroke: C.axis, 'stroke-width': 1, visibility: 'hidden' });
    svg.append(mira);
    const hit = sv('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' });
    svg.append(hit);
    const mostra = (i) => {
      mira.setAttribute('x1', x(i)); mira.setAttribute('x2', x(i)); mira.setAttribute('visibility', 'visible');
      dica(tip, box, x(i), T + 10, [[rotulos[i]], ...series.map((s) => [s.valores[i] == null ? '—' : fmt(s.valores[i]), s.nome, s.cor])]);
    };
    hit.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect(); const px = e.clientX - r.left;
      mostra(Math.max(0, Math.min(n - 1, Math.round(((px - L) / Math.max(1, W - L - R)) * (n - 1)))));
    });
    hit.addEventListener('pointerleave', () => { mira.setAttribute('visibility', 'hidden'); tip.hidden = true; });
    return svg;
  });

  // barras (uma série): o rótulo de valor só no último e no maior
  const graficoBarras = ({ rotulos, valores, fmt, label }) => grafico('chart--bars', label, (W, tip, box) => {
    const H = 240; const L = 36; const R = 8; const T = 22; const B = 28;
    const max = Math.max(1, ...valores.filter((v) => v != null));
    const tk = ticks(0, max, 3);
    const top = tk[tk.length - 1];
    const y = (v) => T + (H - T - B) * (1 - v / top);
    const n = valores.length; const banda = (W - L - R) / n; const bw = Math.min(44, banda * 0.55);
    const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    tk.forEach((t) => svg.append(sv('line', { x1: L, x2: W - R, y1: y(t), y2: y(t), stroke: C.grid, 'stroke-width': 1, 'stroke-dasharray': t === tk[0] ? null : '3 4' }),
      sv('text', { x: L - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'chart__axis' }, fmt(t))));
    const cada = Math.ceil(n / Math.max(1, Math.floor((W - L - R) / 40)));
    const iMax = valores.indexOf(Math.max(...valores.filter((v) => v != null)));
    const iLast = valores.reduce((a, v, i) => (v != null ? i : a), -1);
    const comV = valores.filter((v) => v != null);
    if (comV.length >= 2) {
      const med = comV.reduce((a, v) => a + v, 0) / comV.length; const ym = y(med);
      svg.append(sv('line', { x1: L, x2: W - R, y1: ym, y2: ym, stroke: '#8a8a8a', 'stroke-width': 1, 'stroke-dasharray': '4 4' }),
        sv('text', { x: L + 4, y: ym - 6, class: 'chart__avg' }, fmt(med) + ' média'));
    }
    valores.forEach((v, i) => {
      const cx = L + banda * i + banda / 2;
      if (i % cada === 0 || i === n - 1) svg.append(sv('text', { x: cx, y: H - 8, 'text-anchor': 'middle', class: 'chart__axis' }, rotulos[i]));
      if (v == null || v <= 0) return;
      const x0 = cx - bw / 2; const y0 = y(v); const yb = y(0); const r = Math.min(7, (yb - y0) / 2, bw / 2);
      const bar = sv('path', { d: `M${x0} ${yb}V${y0 + r}Q${x0} ${y0} ${x0 + r} ${y0}H${x0 + bw - r}Q${x0 + bw} ${y0} ${x0 + bw} ${y0 + r}V${yb}Z`, fill: C.bar });
      svg.append(bar);
      if (i === iMax || i === iLast) svg.append(sv('text', { x: cx, y: y0 - 6, 'text-anchor': 'middle', class: 'chart__end' }, fmt(v)));
      const hit = sv('rect', { x: L + banda * i, y: T, width: banda, height: H - T - B, fill: 'transparent' });
      hit.addEventListener('pointerenter', () => { bar.setAttribute('fill', C.barHover); dica(tip, box, cx, y0, [[fmt(v), rotulos[i]]]); });
      hit.addEventListener('pointerleave', () => { bar.setAttribute('fill', C.bar); tip.hidden = true; });
      svg.append(hit);
    });
    return svg;
  });

  // barras empilhadas: novos (embaixo) + voltaram (em cima), com 2px de folga entre os pedaços
  C.ref2 = '#5c5c5c';
  const graficoPilhas = ({ rotulos, a, total, fmt, label }) => grafico('chart--bars', label, (W, tip, box) => {
    const H = 240; const L = 36; const R = 8; const T = 22; const B = 28;
    const max = Math.max(1, ...total.filter((v) => v != null));
    const tk = ticks(0, max, 3); const top = tk[tk.length - 1];
    const y = (v) => T + (H - T - B) * (1 - v / top);
    const n = total.length; const banda = (W - L - R) / n; const bw = Math.min(44, banda * 0.55);
    const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    tk.forEach((t) => svg.append(sv('line', { x1: L, x2: W - R, y1: y(t), y2: y(t), stroke: C.grid, 'stroke-width': 1, 'stroke-dasharray': t === tk[0] ? null : '3 4' }),
      sv('text', { x: L - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'chart__axis' }, fmt(t))));
    total.forEach((tot, i) => {
      const cx = L + banda * i + banda / 2;
      svg.append(sv('text', { x: cx, y: H - 8, 'text-anchor': 'middle', class: 'chart__axis' }, rotulos[i]));
      if (tot == null || tot <= 0) return;
      const nov = Math.min(a[i] || 0, tot); const volt = tot - nov;
      const x0 = cx - bw / 2; const yb = y(0); const yN = y(nov); const yT = y(tot);
      const rect = (y1, y2, fill, roundTop) => {
        const h = y2 - y1; if (h <= 0) return null;
        const r = roundTop ? Math.min(7, h / 2, bw / 2) : 0;
        return sv('path', { d: `M${x0} ${y2}V${y1 + r}Q${x0} ${y1} ${x0 + r} ${y1}H${x0 + bw - r}Q${x0 + bw} ${y1} ${x0 + bw} ${y1 + r}V${y2}Z`, fill });
      };
      const gap = volt > 0 && nov > 0 ? 2 : 0;
      [rect(yN, yb, C.bar, volt === 0), rect(yT, yN - gap, C.ref2, true)].forEach((p2) => p2 && svg.append(p2));
      svg.append(sv('text', { x: cx, y: yT - 6, 'text-anchor': 'middle', class: 'chart__end' }, fmt(tot)));
      const hit = sv('rect', { x: L + banda * i, y: T, width: banda, height: H - T - B, fill: 'transparent' });
      hit.addEventListener('pointerenter', () => dica(tip, box, cx, yT, [[rotulos[i]], [fmt(tot), 'atendidos'], [fmt(nov), 'novos', C.bar], [fmt(volt), 'voltaram', C.ref2]]));
      hit.addEventListener('pointerleave', () => { tip.hidden = true; });
      svg.append(hit);
    });
    return svg;
  });

  // ===== Calendário: ações com prazo e encontros, mês a mês =====
  let calMes = hoje;
  function eventos() {
    const ev = [];
    D.acoes.forEach((a) => { if (a.prazo) ev.push({ dia: a.prazo, tipo: a.responsavel === 'gang' ? 'gang' : 'acao', feita: a.status === 'feita', titulo: a.titulo, sub: STATUS[a.status], href: '#acoes', acao: a.id }); });
    D.encontros.forEach((e) => {
      const d = new Date(e.inicio);
      ev.push({ dia: d.toLocaleDateString('sv-SE'), tipo: 'encontro', feita: e.status === 'realizado', hora: U.hora(e.inicio), titulo: TIPO_ENCONTRO[e.tipo] || 'Encontro', sub: e.duracao_min + ' min' + (e.status === 'remarcar_solicitado' ? ' · remarcação pedida' : ''), href: '#consultoria', enc: e.id });
    });
    return ev.sort((a, b) => (a.dia + (a.hora || '')).localeCompare(b.dia + (b.hora || '')));
  }
  const TIPO_EV = { encontro: 'Encontro', acao: 'Ação com você', gang: 'Ação da GANG' };
  // tocar num encontro do calendário: abre a pauta e as decisões dele (ou o próximo encontro, no topo)
  let abreEnc = null;
  const cliqueEv = (e) => (ev) => {
    if (e.acao) { abreAcao = e.acao; return; }
    if (!e.enc) return;
    abreEnc = e.enc; filtroHist = 'todos';
    if (location.hash === '#consultoria') { ev.preventDefault(); render(); }
  };
  const telaCalendario = () => {
    const todos = eventos();
    const doMes = todos.filter((e) => e.dia.slice(0, 7) === calMes);
    const out = [head('Acompanhamento', 'Calendário', 'Os prazos das ações e os encontros do plano, mês a mês. Toque em um item para ver os detalhes.')];

    const ir = (n) => { calMes = n === 0 ? hoje : U.addRef(calMes, n); render(); };
    const nav = el('div', 'cal__nav',
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button', 'aria-label': 'Mês anterior', onclick: () => ir(-1) }, '‹'),
      el('h2', { class: 'cal__title', 'aria-live': 'polite' }, U.cap(U.nomeMes(calMes)) + ' ' + calMes.slice(0, 4)),
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button', 'aria-label': 'Próximo mês', onclick: () => ir(1) }, '›'),
      calMes !== hoje ? el('button', { class: 'link', type: 'button', onclick: () => ir(0) }, 'Voltar para hoje') : null,
      el('div', 'cal__legend', ['encontro', 'acao', 'gang'].map((t) => el('span', null, el('span', 'cal__key cal__key--' + t), TIPO_EV[t]))));

    // grade do mês (começa no domingo)
    const ini = U.refDate(calMes); const ini0 = new Date(ini); ini0.setDate(1 - ini.getDay());
    const hojeISO = new Date().toLocaleDateString('sv-SE');
    const dias = [];
    for (let i = 0; i < 42; i += 1) {
      const d = new Date(ini0); d.setDate(ini0.getDate() + i);
      const iso = d.toLocaleDateString('sv-SE');
      if (i >= 35 && d.getMonth() !== ini.getMonth()) break;
      const evs = todos.filter((e) => e.dia === iso);
      dias.push(el('div', { class: 'cal__day' + (d.getMonth() !== ini.getMonth() ? ' is-out' : '') + (iso === hojeISO ? ' is-today' : '') },
        el('span', 'cal__num', d.getDate()),
        evs.slice(0, 3).map((e) => el('a', { class: 'cal__ev cal__ev--' + e.tipo + (e.feita ? ' is-done' : ''), href: e.href, onclick: cliqueEv(e), tabindex: -1, title: TIPO_EV[e.tipo] + ': ' + e.titulo },
          e.hora ? el('span', 'cal__time', e.hora) : null, el('span', 'cal__evt', e.titulo))),
        evs.length > 3 ? el('span', 'cal__more', '+' + (evs.length - 3)) : null));
    }
    const grade = el('div', { class: 'cal__grid', 'aria-hidden': 'true' },
      ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => el('span', 'cal__wd', d)), dias);

    // a lista do mês: a mesma informação em texto (é o que aparece no celular)
    const lista = el('section', { class: 'box', 'aria-labelledby': 'cal-l' },
      el('h2', { class: 'box__title', id: 'cal-l' }, 'Neste mês'),
      doMes.length ? el('ul', 'todo', doMes.map((e) => el('li', null, el('a', { class: 'todo__item', href: e.href, onclick: cliqueEv(e) },
        el('span', 'cal__date', el('strong', null, U.day(e.dia).getDate()), el('span', null, U.cap(U.fmt(e.dia, { weekday: 'short' })))),
        el('span', 'todo__text', el('span', 'todo__title' + (e.feita ? ' is-struck' : ''), e.titulo), el('span', 'todo__sub', (e.hora ? e.hora + ' · ' : '') + e.sub)),
        el('span', 'chip ' + (e.tipo === 'encontro' ? 'chip--done' : e.tipo === 'acao' ? 'chip--doing' : 'chip--todo'), TIPO_EV[e.tipo])))))
        : el('p', 'box__empty', 'Nada marcado neste mês.'));

    out.push(el('section', { class: 'box cal', 'aria-label': 'Calendário de ' + U.nomeMes(calMes) }, nav, grade), lista);
    return out;
  };

  // ===== Pesquisa: como as pessoas enxergam a marca, rodada a rodada (uma a cada 6 meses). Os gráficos aparecem animados ao rolar.
  // O que era do mês (como foi o mês, veredito, relatório) foi para a Visão Geral; o esforço e os aprendizados, para Ações =====
  const telaPesquisa = () => {
    const out = [head('Uma rodada a cada 6 meses', 'Pesquisa',
      ['Como as pessoas enxergam a sua marca', el('br'), 'e o que mudou desde a rodada anterior.'])];
    const mv = marcaVista();
    const busca = mv.find((x) => x.getAttribute('aria-labelledby') === 'busca-t');
    out.push(...mv.filter((x) => x !== busca));
    // sem pesquisa ainda: explica o que vai aparecer e quando, em vez de ficar vazia
    // quadros de conteúdo estreito lado a lado (sem quadro largo com vazio à direita); no celular, um embaixo do outro
    const voz = quemCompra();
    out.push(lado(busca, voz));
    return out;
  };
  // em Ações: onde vai o esforço (marca × ativação), se a marca é fácil de achar e comprar, e o que as ações concluídas ensinaram
  const esforcoEAprendizados = () => {
    const p = D.plano; const blocos = [];
    if (p) {
      const marca = p.esforco_marca_pct != null ? U.metaMarcaMes(p) : 62; // no lançamento, a divisão do momento (35% no 1º ano, 57% depois)
      blocos.push(el('section', { class: 'box', 'aria-labelledby': 'eff-t' },
        el('h2', { class: 'box__title', id: 'eff-t' }, 'Onde vai o esforço'),
        el('div', 'esf__legend',
          el('div', 'esf__item esf__item--marca', el('span', 'esf__lbl', 'Marca'), el('strong', 'esf__v', marca + '%'), el('span', 'esf__sub', 'Ser lembrada antes da compra')),
          el('div', 'esf__item esf__item--vendas', el('span', 'esf__lbl', 'Ativação'), el('strong', 'esf__v', (100 - marca) + '%'), el('span', 'esf__sub', 'Converter quem já quer comprar'))),
        el('div', 'esf__rows', esfLinha('Planejado', marca), esforcoReal(marca))));
    }
    const dp = D.disponibilidade[0];
    if (dp) {
      const DISP = { google: 'Perfil completo no Google', mapas: 'Aparece nos mapas e marketplaces', resposta: 'Responde em até 1 hora', pagamento: 'Pix, cartão e orçamento rápido', site: 'Contato em um clique', onde_procura: 'Está onde o cliente procura' };
      blocos.push(el('section', { class: 'box disp-c', 'aria-labelledby': 'disp-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'disp-t' }, 'Fácil de encontrar e de comprar'), el('p', 'box__note', 'Verificado em ' + U.nomeMes(dp.mes_ref))),
        el('div', 'kbig', el('span', 'kbig__v', dp.nota + '/100'), el('span', 'kbig__lbl', 'Ser lembrada só vende se for fácil achar e comprar.')),
        el('ul', 'disp-c__list', Object.entries(DISP).map(([k, t]) => el('li', dp.itens[k] ? 'is-ok' : null, el('span', { class: 'rot__ico', 'aria-hidden': 'true' }), t)))));
    }
    blocos.push(...aprendizados());
    if (!blocos.length) return null;
    return el('details', 'mais mais--res', el('summary', null, el('span', null, 'Esforço e aprendizados'),
      el('span', 'mais__sub', 'Onde vai o esforço, se a marca é fácil de achar e o que as ações ensinaram')), ...blocos);
  };
  // Resultados em abas: o resumo (números, veredito) fica em cima; Negócio, Marca e Aprendizados ficam cada um na sua aba
  let abaRes = 'Marca';
  let alvoRes = null; // id de um elemento que precisa aparecer (ex.: o convite da pesquisa): abre a aba onde ele está
  const emAbas = (out) => {
    const idx = out.map((n, i) => (n && n.classList && n.classList.contains('res-part') ? i : -1)).filter((i) => i >= 0);
    if (idx.length < 2) return out;
    const topo = out.slice(0, idx[0]);
    const partes = idx.map((i, k) => ({ t: out[i].querySelector('.res-part__t').textContent, cab: out[i], corpo: out.slice(i + 1, idx[k + 1] || out.length) }));
    if (alvoRes) {
      const comAlvo = partes.find((x) => x.corpo.some((n) => n && n.querySelector && (n.id === alvoRes || n.querySelector('#' + alvoRes))));
      if (comAlvo) abaRes = comAlvo.t;
      alvoRes = null;
    }
    if (!partes.some((x) => x.t === abaRes)) abaRes = partes[0].t;
    const painel = el('div', { class: 'res-painel', id: 'res-painel', role: 'tabpanel' });
    const mostra = () => {
      const x = partes.find((y) => y.t === abaRes);
      const d = x.cab.querySelector('.res-part__d');
      painel.replaceChildren(...(d ? [el('p', 'res-painel__d', d.textContent)] : []), ...x.corpo);
    };
    const abas = el('div', { class: 'tabs res-abas', role: 'tablist', 'aria-label': 'Resultados por assunto', style: '--n:' + partes.length }, partes.map((x) =>
      el('button', { class: 'tabs__btn', role: 'tab', type: 'button', 'aria-selected': String(x.t === abaRes), 'aria-controls': 'res-painel', onclick: (ev) => {
        abaRes = x.t; abas.querySelectorAll('.tabs__btn').forEach((b) => b.setAttribute('aria-selected', 'false')); ev.currentTarget.setAttribute('aria-selected', 'true'); mostra();
      } }, x.t)));
    mostra();
    return [...topo, el('div', 'res-abas-wrap', abas, painel)];
  };

  // dois blocos lado a lado (no celular, um embaixo do outro); se só um existir, ele ocupa a linha
  const lado = (...grupos) => { const xs = grupos.flat().filter(Boolean); return xs.length > 1 ? el('div', 'pair', xs) : xs[0] || null; };
  // o veredito do mês: uma frase do consultor respondendo "estamos mais perto da meta?"
  const veredito = () => {
    if (!D.foco || !D.foco.veredito) return null;
    return el('section', { class: 'verdict', 'aria-labelledby': 'ver-t' },
      D.consultor ? avatar(D.consultor) : null,
      el('div', 'verdict__txt',
        el('p', { class: 'eyebrow', id: 'ver-t' }, 'Veredito de ' + U.nomeMes(D.foco.mes_ref) + (D.consultor && D.consultor.nome ? ' · ' + D.consultor.nome.split(' ')[0] : '')),
        el('p', 'verdict__q', D.foco.veredito),
        D.vereditos.filter((v) => v.mes_ref !== D.foco.mes_ref).length ? el('details', 'verdict__hist', el('summary', null, 'Vereditos anteriores'),
          el('ul', null, D.vereditos.filter((v) => v.mes_ref !== D.foco.mes_ref).map((v) => el('li', null, el('span', null, U.cap(U.nomeMes(v.mes_ref)) + ' ' + v.mes_ref.slice(0, 4)), v.veredito)))) : null));
  };
  // título de cada parte da tela de Resultados
  const parte = (t, d) => el('div', 'res-part', el('h2', 'res-part__t', t), d ? el('p', 'res-part__d', d) : null);

  // o esforço na prática: ações feitas ou em andamento, marcadas como marca ou venda
  // uma linha da divisão marca × vendas: barra fina em dois pedaços, com os números à direita
  const esfLinha = (rot, m, extra) => el('div', { class: 'esf__row', role: 'img', 'aria-label': rot + ': ' + m + '% marca e ' + (100 - m) + '% ativação' },
    el('span', 'esf__rot', rot),
    el('span', 'esf__bar', m ? el('span', { class: 'esf__seg esf__seg--marca', style: 'flex-grow:' + m }) : null, 100 - m ? el('span', { class: 'esf__seg esf__seg--vendas', style: 'flex-grow:' + (100 - m) }) : null),
    el('span', 'esf__num', m + ' / ' + (100 - m)), extra || null);
  const esforcoReal = (planejado) => {
    const feitas = D.acoes.filter((a) => ['marca', 'ativacao'].includes(U.tipoEsforco(a)) && a.status !== 'a_fazer');
    // alcance contínuo: cada mês do plano até agora precisa de pelo menos uma ação de marca
    const semMarca = [];
    if (inicioRef) for (let r = inicioRef; r <= hoje; r = U.addRef(r, 1)) { if (!D.acoes.some((a) => U.tipoEsforco(a) === 'marca' && a.mes_previsto === r)) semMarca.push(r); }
    const alcance = semMarca.length ? el('p', 'insight', el('span', 'insight__lbl', 'Alcance'), el('span', null, 'Nenhuma ação de marca em ' + semMarca.map((r) => U.nomeMes(r)).join(', ') + '. A marca precisa aparecer todo mês.')) : null;
    if (feitas.length < 2) return alcance;
    const pesoT = (t) => feitas.filter((a) => U.tipoEsforco(a) === t).reduce((s, a) => s + U.pesoTamanho(a), 0);
    const m = Math.round((pesoT('marca') / ((pesoT('marca') + pesoT('ativacao')) || 1)) * 100);
    const longe = Math.abs(m - planejado) >= 15;
    return [esfLinha('Na prática', m, el('span', { class: 'esf__n', title: feitas.length + ' ações feitas ou em andamento' }, feitas.length + ' ações')),
      longe ? el('p', 'insight', el('span', 'insight__lbl', 'Fora do plano'), el('span', null, m < planejado ? 'A marca está recebendo menos esforço que o planejado.' : 'A ativação está recebendo menos esforço que o planejado.')) : null,
      alcance];
  };


  // ===== missões do mês: o que o cliente faz agora, em cartões simples (ações, números e encontro) =====
  const foca = (id) => { alvoRes = id; return setTimeout(() => { const f = document.getElementById(id); if (f) { f.scrollIntoView({ block: 'center', behavior: 'smooth' }); f.focus({ preventScroll: true }); } }, 450); };
  const irParaEstrela = (t, e) => {
    if (/^Essenciais/.test(t)) {
      const alvo = e.alvo.find((a) => a.status !== 'feita' && comCliente(a)) || e.alvo[0];
      return { href: '#acoes', dica: 'abrir em Ações', onclick: () => { if (alvo) abreAcao = alvo.id; } };
    }
    if (/^Contou/.test(t)) return { href: '#plano', dica: 'responder na Visão Geral', onclick: () => foca('como-foi') };
    if (/^Presença/.test(t)) return { href: '#consultoria', dica: 'ver no Calendário', onclick: null };
    if (/^Ações avaliadas/.test(t)) {
      const alvo = e.acs.find((a) => a.status === 'feita' && !a.resultado && comCliente(a));
      return { href: '#acoes', dica: 'responder em Ações', onclick: () => { abaAcoes = 'feitas'; if (alvo) abreAcao = alvo.id; } };
    }
    return { href: '#plano', dica: 'ver na Visão Geral', onclick: () => foca('como-foi') };
  };

  // ===== missões do mês: o que o cliente faz agora, em cartões simples (ações, números e encontro) =====
  const missoes = () => {
    const doMes = D.acoes.filter((a) => comCliente(a) && (a.mes_previsto === hoje || (a.status !== 'feita' && a.mes_previsto < hoje)));
    const itens = doMes.map((a) => {
      const pz = prazo(a);
      return { feita: a.status === 'feita', ord: a.status === 'feita' ? '9' : (a.prazo || '8'), titulo: a.titulo,
        sub: a.status === 'feita' ? 'Feita' : pz.text, hot: a.status !== 'feita' && pz.hot, tipo: 'acao', href: '#acoes', onclick: () => { abreAcao = a.id; },
        botao: a.status === 'em_andamento' ? 'Continuar' : 'Começar', andamento: a.status === 'em_andamento', recem: a.status === 'feita' && concluidasAgora.has(a.id), id: a.id };
    });
    if (inicioRef && mesPassado >= inicioRef) {
      const ok = !!comoFoi(mesPassado);
      itens.push({ feita: ok, ord: ok ? '9' : '0', titulo: 'Contar como foi ' + U.nomeMes(mesPassado), sub: ok ? U.cap(COMO[comoFoi(mesPassado)][0].toLowerCase()) + ' que no ano passado' : 'Um clique', hot: false, tipo: 'num', botao: 'Responder',
        href: '#plano', comoFoi: !ok });
    }
    const enc = D.encontros.filter((x) => x.inicio.slice(0, 7) === hoje).sort((x, y) => (x.inicio < y.inicio ? -1 : 1))[0];
    if (enc) {
      const ok = enc.status === 'realizado' || new Date(enc.inicio).getTime() < agoraMs;
      itens.push({ feita: ok, ord: ok ? '9' : enc.inicio.slice(0, 10), titulo: 'Encontro ' + (D.consultor && D.consultor.nome ? 'com ' + D.consultor.nome.split(' ')[0] : 'com o consultor'),
        sub: ok ? 'Feito' : U.quando(enc.inicio), hot: false, tipo: 'enc', botao: 'Ver pauta', href: '#consultoria' });
    }
    itens.sort((a, b) => a.ord.localeCompare(b.ord));
    const feitas = itens.filter((x) => x.feita).length;
    // nome curto (a parte antes dos dois-pontos), no máximo 2 linhas; o nome completo fica no título do cartão
    const curto = (t) => (t.includes(':') && t.indexOf(':') > 12 ? t.slice(0, t.indexOf(':')) : t);
    // a missão que acabou de ser cumprida pulsa uma vez; a barra cresce a partir do valor da última vez
    itens.forEach((x) => { if (x.recem) concluidasAgora.delete(x.id); });
    if (cfMissaoNova) { const x = itens.find((y) => y.tipo === 'num' && y.feita); if (x) x.recem = true; cfMissaoNova = false; }
    const pct = itens.length ? Math.round(feitas / itens.length * 100) : 0;
    const pctDe = misPctAntes != null && misPctAntes !== pct ? misPctAntes : pct;
    const completouAgora = itens.length && feitas === itens.length && misFeitasAntes != null && misFeitasAntes < itens.length;
    misPctAntes = pct; misFeitasAntes = feitas;
    const barra = el('span', { style: 'width:' + pctDe + '%' });
    if (pctDe !== pct) requestAnimationFrame(() => requestAnimationFrame(() => { barra.style.width = pct + '%'; }));
    // "Contar como foi": melhor, igual ou pior direto no cartão, sem trocar de tela
    const cardComoFoi = (x) => el('div', { class: 'missao missao--num missao--cf', id: 'como-foi', tabindex: '-1', title: x.titulo },
      el('span', 'missao__top', el('span', { class: 'missao__ico', 'aria-hidden': 'true' }), el('span', 'missao__s', 'Comparado com o ano passado')),
      el('span', 'missao__t', curto(x.titulo)),
      el('span', { class: 'missao__cf', role: 'group', 'aria-label': x.titulo }, Object.entries(COMO).map(([k, [t, ic]]) =>
        el('button', { class: 'missao__cfb missao__cfb--' + k, type: 'button', onclick: (ev) => respondeComoFoi(k, ev.currentTarget) }, el('span', { 'aria-hidden': 'true' }, ic), t))));
    const card = (x) => (x.comoFoi ? cardComoFoi(x) : el('a', { class: 'missao missao--' + x.tipo + (x.feita ? ' is-ok' : '') + (x.andamento ? ' is-doing' : '') + (x.recem ? ' is-recem' : ''), href: x.href, onclick: x.onclick || null, title: x.titulo },
      el('span', 'missao__top', el('span', { class: 'missao__ico', 'aria-hidden': 'true' }), el('span', 'missao__s' + (x.hot ? ' is-hot' : ''), x.sub)),
      el('span', 'missao__t', curto(x.titulo)),
      el('span', 'missao__btn' + (x.feita ? ' is-ok' : ''), x.feita ? 'Feita' : x.botao)));
    return el('section', { class: 'missoes', 'aria-labelledby': 'mis-t' },
      el('div', 'missoes__head',
        el('div', null, el('h2', { class: 'missoes__t', id: 'mis-t' }, 'Missões de ' + U.nomeMes(hoje)),
          D.foco ? el('p', 'missoes__foco', 'Foco: ' + D.foco.titulo.replace(/\.$/, '')) : null),
        itens.length ? el('div', 'missoes__prog', el('span', 'missoes__n', feitas + ' de ' + itens.length),
          el('span', 'missoes__bar', barra)) : null),
      itens.length ? el('div', 'missoes__grid', itens.map(card)) : el('p', 'missoes__vazio', 'Nenhuma missão neste mês. O consultor monta as próximas com você.'),
      feitas === itens.length && itens.length ? el('p', 'missoes__ok' + (completouAgora ? ' is-recem' : ''), 'Mês completo. Missão cumprida!') : null);
  };

  // o funil da clareza (o mesmo do site): o que você enxerga, o que comunica, o que as pessoas ouvem, o que entendem
  const funilClareza = (atual) => {
    const resp = D.pedidos.filter((p) => p.status !== 'em_analise');
    const comunica = resp.length ? Math.round(resp.filter((p) => p.status === 'aprovado').length / resp.length * 100) : null;
    const ouvem = atual.ment != null ? atual.ment : atual.lemb;
    const rs = atual.q ? D.respostas.filter((r) => r.pesquisa_id === atual.q.id && r.entende != null) : [];
    const entendem = rs.length ? Math.round(rs.filter((r) => r.entende).length / rs.length * 100) : null;
    const linhas = [
      ['O que você enxerga', 100, 'Tudo, com absoluta clareza.'],
      ['O que comunica', comunica, 'Peças que saem no padrão da marca (aprovadas na revisão).'],
      ['O que as pessoas ouvem', ouvem, 'Lembram da sua marca nas situações de compra.'],
      ['O que elas entendem', entendem, 'Escolhem a sua mensagem central como a frase que descreve a marca.'],
    ];
    return el('div', 'funnel anim',
      el('p', 'eyebrow', 'Do que você quer dizer ao que entendem'),
      linhas.map(([t, v, d]) => el('div', 'funnel__row',
        el('div', 'funnel__lab', el('p', 'funnel__t', t), el('p', 'box__note', d)),
        el('div', 'funnel__track', el('span', { style: 'width:' + (v ?? 0) + '%' })),
        el('p', 'funnel__v', v == null ? 'sem dados' : v + '%'))),
      el('p', 'box__text', entendem != null && entendem < 60
        ? 'O objetivo é fechar essa distância: que as pessoas entendam o que você enxerga. Hoje ' + entendem + '% entendem; as próximas ações de marca devem repetir a mensagem central.'
        : 'Quanto mais perto as barras ficam umas das outras, mais as pessoas enxergam o mesmo que você.'));
  };

  // com que palavras descrevem a marca (antes e depois): mostra a percepção mudando
  const palavrasDe = (q) => {
    const cont = {};
    D.respostas.filter((r) => r.pesquisa_id === q.id && r.palavra).forEach((r) => { const w = r.palavra.trim().toLowerCase(); if (w) cont[w] = (cont[w] || 0) + 1; });
    return Object.entries(cont).sort((a, b) => b[1] - a[1]).slice(0, 8);
  };

  // sem respostas ainda: os mesmos gráficos da pesquisa, vazios ("—"), para já mostrar o que vai aparecer
  const SERIES_PESQ = [['Lembram na hora de comprar', C.acc], ['Lembram do nome sozinhos', C.acc === C.ink ? '#9a9a9a' : C.ink], ['Escolheriam a sua marca hoje', '#5c5c5c']];
  const pesqVazia = (box, q) => {
    const tileV = (rot) => {
      const g = sv('svg', { class: 'anel__g', viewBox: '0 0 44 44', 'aria-hidden': 'true' });
      g.append(sv('circle', { cx: 22, cy: 22, r: 18, class: 'anel__fundo' }), sv('circle', { cx: 22, cy: 22, r: 18, class: 'anel__arco', pathLength: 100, style: '--v:0' }));
      return el('div', 'stat anel is-vazio', g, el('div', 'anel__txt', el('p', 'stat__label', rot), el('p', 'stat__value', '—'), el('p', 'stat__delta', 'Aguardando respostas')));
    };
    const rot = ['Partida', 'Rodada 2', 'Rodada 3'];
    box.append(el('div', 'vista-resumo',
      el('div', 'stats vista-kpis anim', tileV('Das marcas lembradas, quantas são a sua'), tileV('Lembram da sua marca na hora de comprar'), tileV('Lembram do nome sozinhos'), tileV('Escolheriam a sua marca hoje')),
      el('div', 'evol anim', el('p', 'eyebrow', 'Rodada a rodada'),
        el('div', 'chart__legend', SERIES_PESQ.map(([nome, cor]) => el('span', null, el('span', { class: 'chart__sq', style: 'background:' + cor }), nome))),
        graficoLinhas({ rotulos: rot, fmt: (v) => Math.round(v) + '%', escala: 100, label: 'Gráfico rodada a rodada, ainda sem respostas',
          series: SERIES_PESQ.map(([nome, cor]) => ({ nome, cor, pontos: true, semArea: true, valores: rot.map(() => null) })) }))));
    // o detalhe: funil e situações de compra com as barras zeradas
    const sits = (q && q.situacoes && q.situacoes.length ? q.situacoes : D.situacoes || []).slice(0, 6);
    const af = (q && q.afirmacoes) || [];
    const colA = el('div', 'vista__col', funilClareza({ q: null, ment: null, lemb: null }));
    const colB = el('div', 'vista__col');
    if (sits.length) colB.append(el('p', 'eyebrow', 'Em cada situação de compra: quem lembra da sua marca e do concorrente mais lembrado'),
      el('div', 'chart__legend', el('span', null, el('span', { class: 'chart__sq', style: 'background:' + C.bar }), 'Sua marca'),
        el('span', null, el('span', { class: 'chart__sq', style: 'background:#8a8a8a' }), 'Concorrente mais lembrado')),
      el('div', 'hbars anim', sits.map((x) => el('div', 'hbar hbar--pair', el('p', 'hbar__label', x.texto),
        el('div', 'hbar__pair', el('div', 'hbar__track', el('span', { class: 'hbar__fill', style: 'width:0%' })), el('div', 'hbar__track', el('span', { class: 'hbar__fill hbar__fill--rival', style: 'width:0%' }))),
        el('p', 'hbar__value', '—')))));
    if (af.length) colB.append(el('p', 'eyebrow', 'Quem liga cada frase à marca (%)'),
      el('div', 'hbars anim', af.map((t) => el('div', 'hbar', el('p', 'hbar__label', t), el('div', 'hbar__track', el('span', { class: 'hbar__fill', style: 'width:0%' })), el('p', 'hbar__value', '—')))));
    if (!colB.children.length) colB.append(el('p', 'eyebrow', 'Em cada situação de compra'), el('p', 'box__note', 'As situações em que o cliente pensa na categoria entram com a pesquisa, montada pelo consultor.'));
    box.append(el('details', 'mais', el('summary', null, el('span', null, 'Ver a pesquisa em detalhe'), el('span', 'mais__sub', 'Antes e depois, funil, palavras e situações de compra')), el('div', 'vista', colA, colB)));
  };

  // pesquisa de marca + participação nas buscas
  const semAcento = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let grupoPesq = 'novos';
  const marcaVista = () => {
    const out = [];
    const pesq = D.pesquisas;
    if (pesq.length) {
      const nome = D.empresa ? D.empresa.nome : '';
      const chave = semAcento(nome).split(/\s+/).filter((w) => w.length > 2).pop() || semAcento(nome);
      const temGrupo = D.respostas.some((r) => r.ja_cliente != null);
      if (!temGrupo) grupoPesq = 'todos';
      // "ainda não compram" = quem compra a categoria e não é cliente; quem diz que nunca comprou a categoria não é o mercado
      const doMercado = (r) => r.recencia !== 'nunca';
      const doGrupo = (r) => grupoPesq === 'todos' || (grupoPesq === 'novos' ? r.ja_cliente === false && doMercado(r) : r.ja_cliente === true);
      const stats = pesq.map((q) => {
        const rs = D.respostas.filter((r) => r.pesquisa_id === q.id && doGrupo(r));
        const n = rs.length;
        const lemb = n ? Math.round((rs.filter((r) => semAcento(r.lembranca).includes(chave)).length / n) * 100) : null;
        const pref = n ? Math.round((rs.filter((r) => r.preferencia === nome).length / n) * 100) : null;
        const medias = (q.afirmacoes || []).map((_, i) => (n ? Math.round(((rs.reduce((s2, r) => s2 + Number(r.notas[i] || 0), 0) / n - 1) / 4) * 100) : null));
        // disponibilidade mental (Romaniuk): em quantas situações de compra a marca vem à cabeça
        const sits = q.situacoes || [];
        let ment = null; let rede = null; let fatia = null; let porSit = [];
        if (n && sits.length) {
          const ligacoes = rs.map((r) => sits.filter((st) => ((r.ceps || {})[st.id] || []).includes(nome)).length);
          const comAlguma = ligacoes.filter((v) => v > 0);
          ment = Math.round((comAlguma.length / n) * 100);
          rede = comAlguma.length ? Math.round((comAlguma.reduce((x, v) => x + v, 0) / comAlguma.length) * 10) / 10 : 0;
          const todas = rs.reduce((x, r) => x + sits.reduce((y, st) => y + ((r.ceps || {})[st.id] || []).length, 0), 0);
          fatia = todas ? Math.round((ligacoes.reduce((x, v) => x + v, 0) / todas) * 100) : 0;
          porSit = sits.map((st) => {
            const cont = {};
            rs.forEach((r) => ((r.ceps || {})[st.id] || []).forEach((m) => { cont[m] = (cont[m] || 0) + 1; }));
            const sua = Math.round(((cont[nome] || 0) / n) * 100);
            const [rivalNome, rivalN] = Object.entries(cont).filter(([m]) => m !== nome).sort((x, y) => y[1] - x[1])[0] || [null, 0];
            return { texto: st.texto, sua, rival: Math.round((rivalN / n) * 100), rivalNome };
          });
        }
        // de quem compraram na última vez (fato do passado): entre quem comprou a categoria e lembra de quem
        const comUlt = rs.filter((r) => r.ultima && r.ultima !== 'Não lembro');
        const ult = comUlt.length ? Math.round((comUlt.filter((r) => r.ultima === nome).length / comUlt.length) * 100) : null;
        return { q, n, lemb, pref, medias, ment, rede, fatia, porSit, ult };
      });
      // resultados: a última rodada com respostas (comparada à anterior com respostas); o link: a rodada aberta
      const comResp = stats.filter((x) => x.n > 0);
      const atual = comResp[comResp.length - 1] || stats[stats.length - 1];
      const ant = comResp.length > 1 ? comResp[comResp.length - 2] : null;
      const aberta = [...pesq].reverse().find((x) => x.aberta);
      const delta = (a, b) => (b == null || a == null ? null : a - b);
      // cada número num anel que se fecha até o valor, e o número conta de 0 até ele (ao aparecer na tela)
      const tile = (rot, v, d) => {
        const g = sv('svg', { class: 'anel__g', viewBox: '0 0 44 44', 'aria-hidden': 'true' });
        g.append(sv('circle', { cx: 22, cy: 22, r: 18, class: 'anel__fundo' }), sv('circle', { cx: 22, cy: 22, r: 18, class: 'anel__arco', pathLength: 100, style: '--v:' + (v || 0) }));
        return el('div', 'stat anel', g, el('div', 'anel__txt', el('p', 'stat__label', rot),
          el('p', { class: 'stat__value', 'data-conta': v == null ? null : v, 'data-pre': atual.n < 30 ? '≈' : '' }, v == null ? '—' : (atual.n < 30 ? '≈' : '') + v + '%'),
          d != null ? el('p', 'stat__delta' + (d > 0 ? ' is-up' : d < 0 ? ' is-down' : ''), (d > 0 ? '+' : '') + d + ' pontos desde a rodada anterior') : null));
      };
      const box = el('section', { class: 'box', 'aria-labelledby': 'pesq-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'pesq-t' }, 'Como a marca é vista'),
          atual.n && atual.n < 30
            ? el('span', { class: 'chip chip--doing', title: 'Com menos de 30 respostas, leia como tendência: uma pessoa a mais muda o resultado em vários pontos.' }, 'Amostra pequena · ' + atual.n + (atual.n === 1 ? ' resposta' : ' respostas'))
            : el('p', 'box__note', atual.q.titulo + ' · ' + atual.n + (atual.n === 1 ? ' resposta' : ' respostas'))),
        el('p', 'box__text', atual.q.titulo ? ['O que seus clientes responderam na pesquisa', el('br'), '“' + atual.q.titulo + '”.'] : 'O que seus clientes responderam na pesquisa.'));
      if (temGrupo) {
        const nG = (g) => D.respostas.filter((r) => r.pesquisa_id === atual.q.id && (g === 'todos' || (g === 'novos' ? r.ja_cliente === false && r.recencia !== 'nunca' : r.ja_cliente === true))).length;
        box.append(el('div', 'grupo',
          el('div', { class: 'tabs tabs--mini', role: 'tablist', 'aria-label': 'Quem respondeu' }, [['novos', 'Ainda não compram'], ['todos', 'Todos'], ['clientes', 'Clientes']].map(([g, t]) =>
            el('button', { class: 'tabs__btn', role: 'tab', type: 'button', 'aria-selected': String(grupoPesq === g), onclick: () => { grupoPesq = g; render(); } }, t + ' (' + nG(g) + ')'))),
          el('p', 'box__note', grupoPesq === 'novos' ? 'O número que mostra crescimento: a marca sendo lembrada por quem compra a categoria e ainda não é cliente.' : grupoPesq === 'clientes' ? 'Clientes lembram mais da marca; use para ver a experiência, não o crescimento.' : 'Clientes e não clientes juntos.')));
      }
      const resumo = el('div', 'vista-resumo'); box.append(resumo);
      const colA = el('div', 'vista__col'); const colB = el('div', 'vista__col');
      const mais = el('details', 'mais', el('summary', null, el('span', null, 'Ver a pesquisa em detalhe'), el('span', 'mais__sub', 'Antes e depois, funil, palavras e situações de compra')), el('div', 'vista', colA, colB));
      // o antes: como as pessoas viam a marca no diagnóstico, para comparar com a pesquisa de agora
      const antes = D.impressoes.find((i) => i.eh_cliente);
      if (antes && (antes.notam || antes.acreditam || antes.sentem)) colA.append(el('div', 'antes',
        el('div', 'antes__head', el('p', 'eyebrow', 'No ponto de partida' + (D.diagnostico && D.diagnostico.data ? ' · ' + U.mesAno(D.diagnostico.data) : '')),
          el('a', { class: 'link', href: '#diagnostico' }, 'Ver diagnóstico')),
        el('dl', 'antes__dl', [['Notavam', antes.notam], ['Acreditavam', antes.acreditam], ['Sentiam', antes.sentem]].filter(([, v]) => v)
          .map(([k, v]) => el('div', null, el('dt', null, k), el('dd', null, v))))));
      if (atual.n) {
        colA.append(funilClareza(atual));
        const pw = palavrasDe(atual.q); const pwAnt = ant ? palavrasDe(ant.q) : [];
        if (pw.length) colA.append(el('div', 'words',
          el('p', 'eyebrow', 'Em uma palavra, como descrevem a marca'),
          el('div', 'words__cols',
            pwAnt.length ? el('div', null, el('p', 'box__note', ant.q.titulo), el('ul', 'words__list is-before', pwAnt.map(([w, n]) => el('li', null, w, el('span', null, n))))) : null,
            el('div', null, el('p', 'box__note', atual.q.titulo), el('ul', 'words__list', pw.map(([w, n]) => el('li', null, w, el('span', null, n))))))));
        resumo.append(el('div', 'stats vista-kpis anim',
          atual.fatia != null ? tile('Das marcas lembradas, quantas são a sua', atual.fatia, delta(atual.fatia, ant && ant.fatia)) : null,
          atual.ment != null ? tile('Lembram da sua marca na hora de comprar', atual.ment, delta(atual.ment, ant && ant.ment)) : null,
          tile('Lembram do nome sozinhos', atual.lemb, delta(atual.lemb, ant && ant.lemb)),
          atual.ult != null && grupoPesq !== 'novos' ? tile('Compraram da sua marca na última vez', atual.ult, delta(atual.ult, ant && ant.ult)) : null,
          tile('Escolheriam a sua marca hoje', atual.pref, delta(atual.pref, ant && ant.pref))));
        if (comResp.length >= 2) {
          const rot = comResp.map((x) => x.q.titulo || U.mesAno(x.q.criada_em));
          const ser = [['Lembram na hora de comprar', 'ment', C.acc], ['Lembram do nome sozinhos', 'lemb', C.acc === C.ink ? '#9a9a9a' : C.ink], ['Escolheriam a sua marca hoje', 'pref', '#5c5c5c']]
            .map(([nome, k, cor]) => ({ nome, cor, pontos: true, semArea: true, rotuloFim: true, valores: comResp.map((x) => x[k]) })).filter((x) => x.valores.some((v) => v != null));
          if (ser.length) resumo.append(el('div', 'evol anim', el('p', 'eyebrow', 'Rodada a rodada'),
            el('div', 'chart__legend', ser.map((x) => el('span', null, el('span', { class: 'chart__sq', style: 'background:' + x.cor }), x.nome))),
            graficoLinhas({ rotulos: rot, fmt: (v) => Math.round(v) + '%', series: ser,
              label: ser.map((x) => x.nome + ': ' + x.valores.map((v, i) => rot[i] + ' ' + (v == null ? 'sem dado' : v + '%')).join(', ')).join('. ') })));
        }
        // fatia nas lembranças × participação de mercado: lembrada acima do tamanho tende a crescer
        if (atual.fatia != null && D.plano && D.plano.participacao_mercado != null) {
          const pm = Number(D.plano.participacao_mercado); const dif = atual.fatia - pm;
          resumo.append(el('p', 'insight insight--' + (dif >= 0 ? 'ok' : 'bad'), el('span', 'insight__lbl', dif >= 0 ? 'Lembrada acima do tamanho' : 'Lembrada abaixo do tamanho'),
            el('span', null, 'A marca tem ' + atual.fatia + '% das lembranças e cerca de ' + pm + '% do mercado. ' + (dif >= 0 ? 'Quando a lembrança passa da participação, a marca tende a crescer.' : 'Com menos lembrança que participação, a marca tende a perder espaço.'))));
        }
        if (atual.porSit.length) {
          const fraca = [...atual.porSit].sort((x, y) => (x.sua - x.rival) - (y.sua - y.rival))[0];
          resumo.append(el('p', 'insight', el('span', 'insight__lbl', 'Ponto mais fraco'),
            el('span', null, 'Quando o cliente pensa “' + fraca.texto + '”, ' + (fraca.sua === 0 ? 'ninguém lembra da sua marca' : 'só ' + fraca.sua + '% lembram da sua marca') + '. É aí que as próximas ações miram.')));
          colB.append(el('p', 'eyebrow', 'Em cada situação de compra: quem lembra da sua marca e do concorrente mais lembrado'),
            el('div', 'chart__legend', el('span', null, el('span', { class: 'chart__sq', style: 'background:' + C.bar }), 'Sua marca'),
              el('span', null, el('span', { class: 'chart__sq', style: 'background:#8a8a8a' }), 'Concorrente mais lembrado')),
            el('div', 'hbars anim', atual.porSit.map((x) => el('div', 'hbar hbar--pair',
              el('p', 'hbar__label', x.texto),
              el('div', 'hbar__pair',
                el('div', 'hbar__track', el('span', { class: 'hbar__fill', style: 'width:' + x.sua + '%' })),
                el('div', 'hbar__track', el('span', { class: 'hbar__fill hbar__fill--rival', style: 'width:' + x.rival + '%' }))),
              el('p', 'hbar__value', x.sua + '%', el('span', 'muted', x.rivalNome ? ' · ' + x.rivalNome + ' ' + x.rival + '%' : ' · nenhum concorrente'))))),
            el('p', 'box__note', 'Quem lembra da marca a liga, em média, a ' + String(atual.rede).replace('.', ',') + ' situações.'));
        }
        const af = atual.q.afirmacoes || [];
        if (af.length) {
          colB.append(el('p', 'eyebrow', 'Quem liga cada frase à marca (%)'),
            el('p', 'box__note', 'Lê com cuidado: essas ligações sobem principalmente com quem já conhece e usa a marca, e marcas maiores sempre têm mais. Para crescer, valem mais as situações de compra acima.'), el('div', 'hbars anim', af.map((t, i) => el('div', 'hbar',
            el('p', 'hbar__label', t),
            el('div', 'hbar__track', el('span', { class: 'hbar__fill', style: 'width:' + (atual.medias[i] || 0) + '%' })),
            el('p', 'hbar__value', atual.medias[i] == null ? '—' : String(atual.medias[i]),
              ant && ant.medias[i] != null ? el('span', 'muted', ' (antes ' + ant.medias[i] + ')') : null)))));
        }
      }
      if (atual.n) box.append(mais);
      else { box.querySelector('.box__text').replaceChildren('Os números aparecem com as primeiras respostas.', el('br'), 'Mande o convite para clientes e para quem ainda não comprou.'); pesqVazia(box, atual.q); }
      if (aberta) {
        const url = location.origin + '/pesquisa.html?t=' + aberta.token;
        // mensagem pronta para o cliente mandar aos clientes dele (editável), com o link dentro
        const nomeMarca = D.empresa ? D.empresa.nome : 'nossa empresa';
        const convite = el('textarea', { class: 'field share__msg', id: 'convite', rows: 5, 'aria-label': 'Mensagem de convite para a pesquisa' });
        // a mensagem não pede ajuda à marca nem diz o nome dela: quem quer agradar quem mandou responde a marca, e não o que pensa
        const sobre = (aberta.categoria || '').trim();
        convite.value = 'Oi! Estamos fazendo uma pesquisa rápida' + (sobre ? ' sobre ' + sobre : '') + ', com perguntas sobre várias marcas. '
          + 'Não existe resposta certa: vale a sua opinião sincera. Leva 2 minutos e é anônima:\n\n' + url + '\n\nMuito obrigado!';
        const texto = () => convite.value.trim();
        const copia = el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: async () => {
          try { await navigator.clipboard.writeText(texto()); copia.textContent = 'Copiada ✓'; clearTimeout(copia._t); copia._t = setTimeout(() => { copia.textContent = 'Copiar mensagem'; }, 2000); } catch (e) { convite.select(); }
        } }, 'Copiar mensagem');
        const wa = el('a', { class: 'btn btn--ghost btn--sm', target: '_blank', rel: 'noopener', href: '#' }, 'Enviar no WhatsApp');
        const mail = el('a', { class: 'btn btn--ghost btn--sm', href: '#' }, 'Enviar por e-mail');
        const atualiza = () => {
          wa.href = 'https://wa.me/?text=' + encodeURIComponent(texto());
          mail.href = 'mailto:?subject=' + encodeURIComponent('Pesquisa rápida' + (sobre ? ' sobre ' + sobre : '') + ' · 2 minutos') + '&body=' + encodeURIComponent(texto());
        };
        convite.addEventListener('input', atualiza); atualiza();
        const copiaLink = el('button', { class: 'link', type: 'button', onclick: async () => {
          try { await navigator.clipboard.writeText(url); copiaLink.textContent = 'Link copiado ✓'; clearTimeout(copiaLink._t); copiaLink._t = setTimeout(() => { copiaLink.textContent = 'Copiar só o link'; }, 2000); } catch (e) { U.avisa('Copie o link:', url); }
        } }, 'Copiar só o link');
        box.append(el('div', { class: 'share', id: 'convidar', tabindex: '-1' },
          el('div', 'share__head', el('div', null, el('p', 'share__t', 'Convide mais pessoas'),
            el('p', 'box__note', ['O ideal é passar de 30 respostas.', el('br'), 'Mande também para quem ainda não comprou.'])),
            el('div', 'share__btns', copia, wa, mail, el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => abreQR(url, nomeMarca) }, 'QR code'))),
          el('details', 'share__edit', el('summary', null, 'Ver e editar a mensagem'), convite, copiaLink)));
      }
      out.push(box);
    } else {
      out.push(el('section', { class: 'box', 'aria-labelledby': 'pesq-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'pesq-t' }, 'Como a marca é vista'), el('p', 'box__note', 'Primeira rodada em preparo')),
        el('p', 'box__text', ['Os números aparecem com as primeiras respostas.', el('br'), 'O consultor abre a pesquisa e o convite chega aqui.'])));
      pesqVazia(out[out.length - 1], null);
    }
    if (D.buscas.length < 2) {
      // ainda sem meses suficientes: o gráfico aparece vazio, com os últimos 6 meses
      const meses = [5, 4, 3, 2, 1, 0].map((k) => U.addRef(hoje, -k));
      out.push(el('section', { class: 'box', 'aria-labelledby': 'busca-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'busca-t' }, 'Buscas pelo nome da marca'), el('p', 'box__note', 'Google Trends, mês a mês')),
        el('p', 'box__text', 'De todas as buscas pela categoria e pelas marcas concorrentes, quantas são pela sua marca. Quando sobe, a marca está sendo mais lembrada.'),
        el('div', 'anim', graficoLinhas({ rotulos: meses.map((m) => U.cap(U.nomeMesCurto(m))), fmt: (v) => Math.round(v) + '%', escala: 15, label: 'Participação da marca nas buscas, ainda sem dados',
          series: [{ nome: 'Sua marca', valores: meses.map((m) => { const b = D.buscas.find((x) => x.mes_ref === m); return b ? Number(b.marca_pct) : null; }), cor: C.acc, pontos: true, rotuloFim: true }] })),
        el('p', 'box__note', 'Atualizado junto com a pesquisa.')));
    }
    if (D.buscas.length >= 2) {
      out.push(el('section', { class: 'box', 'aria-labelledby': 'busca-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'busca-t' }, 'Buscas pelo nome da marca'), el('p', 'box__note', 'Google Trends, mês a mês')),
        el('p', 'box__text', 'De todas as buscas pela categoria e pelas marcas concorrentes, quantas são pela sua marca. Quando sobe, a marca está sendo mais lembrada.'),
        el('div', 'anim', graficoLinhas({ rotulos: D.buscas.map((b) => U.cap(U.nomeMesCurto(b.mes_ref))), fmt: (v) => Math.round(v) + '%',
          label: 'Participação da marca nas buscas: ' + D.buscas.map((b) => U.nomeMesCurto(b.mes_ref) + ' ' + b.marca_pct + '%').join(', '),
          series: [{ nome: 'Sua marca', valores: D.buscas.map((b) => Number(b.marca_pct)), cor: C.acc, pontos: true, rotuloFim: true }] })),
        D.plano && D.plano.participacao_mercado != null ? (() => {
          const v = Math.round((Number(D.buscas[D.buscas.length - 1].marca_pct) - Number(D.plano.participacao_mercado)) * 10) / 10;
          return el('p', 'insight', el('span', 'insight__lbl', 'Voz ' + (v >= 0 ? 'acima' : 'abaixo') + ' do tamanho'),
            el('span', null, (v >= 0 ? '+' : '') + String(v).replace('.', ',') + ' pontos: a marca tem ' + D.buscas[D.buscas.length - 1].marca_pct + '% das buscas e cerca de ' + D.plano.participacao_mercado + '% do mercado. ' + (v >= 0 ? 'Marcas que aparecem mais que o seu tamanho tendem a crescer.' : 'Aparecer menos que o tamanho tende a encolher a marca com o tempo.')));
        })() : null));
    }
    return out;
  };

  // o que aprendemos com as ações concluídas
  const aprendizados = () => {
    const com = D.acoes.filter((a) => a.status === 'feita' && a.resultado);
    if (!com.length) return [];
    const ok = com.filter((a) => a.resultado === 'sim').length;
    return [el('section', { class: 'box', 'aria-labelledby': 'apr-t' },
      el('div', 'box__head', el('h2', { class: 'box__title', id: 'apr-t' }, 'O que aprendemos'), el('p', 'box__note', ok + ' de ' + com.length + ' ações funcionaram')),
      el('ul', 'todo', com.map((a) => el('li', 'piece', el('div', 'todo__text', el('span', 'todo__title', a.titulo),
        el('span', 'todo__sub', a.aprendizado || (a.metrica_sucesso ? 'Sucesso se: ' + U.cap(a.metrica_sucesso) : ''))), chip(...RES[a.resultado])))))];
  };

  // de quem compraram na última vez: a fatia da marca nas compras reais da categoria, ao lado da fatia nas lembranças
  // (a marca cresce ganhando compradores; lembrada mais que comprada = falta ser fácil de achar e comprar)
  const quemCompra = () => {
    const nome = D.empresa ? D.empresa.nome : '';
    const rodadas = D.pesquisas.map((q) => {
      const rs = D.respostas.filter((r) => r.pesquisa_id === q.id && r.ultima && r.ultima !== 'Não lembro');
      const cont = {}; rs.forEach((r) => { cont[r.ultima] = (cont[r.ultima] || 0) + 1; });
      // fatia nas lembranças (todas as situações de compra), para comparar com a fatia nas compras
      const sits = q.situacoes || []; let lig = 0; let todas = 0;
      D.respostas.filter((r) => r.pesquisa_id === q.id).forEach((r) => sits.forEach((st) => { const l = (r.ceps || {})[st.id] || []; todas += l.length; if (l.includes(nome)) lig++; }));
      return { q, n: rs.length, cont, lemb: todas ? Math.round((lig / todas) * 100) : null };
    }).filter((x) => x.n > 0);
    const atual = rodadas[rodadas.length - 1]; const ant = rodadas.length > 1 ? rodadas[rodadas.length - 2] : null;
    const pc = (x, m) => Math.round(((x.cont[m] || 0) / x.n) * 100);
    let linhas;
    if (atual) {
      const outras = Object.keys(atual.cont).filter((m) => m !== nome).sort((a, b) => atual.cont[b] - atual.cont[a]);
      linhas = [nome, ...outras.slice(0, 4)].map((m) => ({ m, v: pc(atual, m), sua: m === nome }));
      const resto = outras.slice(4).reduce((t, m) => t + pc(atual, m), 0);
      if (resto) linhas.push({ m: 'Outras', v: resto });
    } else linhas = [{ m: nome || 'Sua marca', v: null, sua: true }, { m: 'Concorrente', v: null }, { m: 'Concorrente', v: null }];
    const sua = atual ? pc(atual, nome) : null;
    const dif = ant ? sua - pc(ant, nome) : null;
    const gap = atual && atual.lemb != null ? atual.lemb - sua : null;
    return el('section', { class: 'box', 'aria-labelledby': 'compra-t' },
      el('div', 'box__head', el('h2', { class: 'box__title', id: 'compra-t' }, 'De quem compraram na última vez'), el('p', 'box__note', atual ? atual.n + ' compradores' : 'Pela pesquisa')),
      el('p', 'box__text', ['Entre quem compra a categoria, a fatia de cada marca', el('br'), 'nas compras de verdade. A marca cresce', el('br'), 'ganhando mais compradores.']),
      el('div', 'hbars anim', linhas.map((x) => el('div', 'hbar',
        el('p', 'hbar__label', x.sua ? el('strong', null, x.m) : x.m),
        el('div', 'hbar__track', el('span', { class: 'hbar__fill' + (x.sua ? '' : ' hbar__fill--rival'), style: 'width:' + (x.v || 0) + '%' })),
        el('p', 'hbar__value', x.v == null ? '—' : x.v + '%', x.sua && dif != null ? el('span', 'muted', ' (' + (dif > 0 ? '+' : '') + dif + ')') : null)))),
      gap == null ? el('p', 'box__note', atual ? 'Com as situações de compra na pesquisa, aparece a comparação com a lembrança.' : 'Os números aparecem com as primeiras respostas.')
        : el('p', 'insight' + (gap >= 5 ? '' : ' insight--ok'), el('span', 'insight__lbl', gap >= 5 ? 'Lembrada mais do que comprada' : gap <= -5 ? 'Comprada mais do que lembrada' : 'Lembrança e compra juntas'),
          el('span', null, 'Entre todos que responderam, a marca tem ' + atual.lemb + '% das lembranças e ' + sua + '% das compras. ' + (gap >= 5 ? 'As pessoas pensam nela, mas compram de outra: vale ver se é fácil achar e comprar.' : gap <= -5 ? 'Quem compra volta, mas a marca vem pouco à cabeça: é aí que as ações de marca entram.' : 'Para crescer, as duas precisam subir juntas.'))));
  };

  const tabela = (cols, linhas) => el('div', 'table-wrap', el('table', 'table',
    el('thead', null, el('tr', null, cols.map((c) => el('th', { scope: 'col' }, c)))),
    el('tbody', null, linhas.map((l) => el('tr', null, l.map((v, i) => (i === 0 ? el('th', { scope: 'row' }, v) : el('td', null, v))))))));

  // "Como foi o mês?": no lugar dos números da empresa, o cliente diz em um clique se o mês foi melhor, igual ou pior
  // que o mesmo mês do ano passado (comparar com o mês anterior misturaria a época do ano com o efeito do plano)
  const COMO = { melhor: ['Melhor', '↑'], igual: ['Igual', '='], pior: ['Pior', '↓'] };
  const respondeComoFoi = async (v, b) => {
    b.disabled = true;
    const { error } = await sb.rpc('portal_como_foi', { p_mes: mesPassado, p_valor: v });
    b.disabled = false;
    if (error) return anuncia('Não foi possível salvar agora.');
    const n = D.numeros.find((x) => x.mes_ref === mesPassado);
    const primeira = !n || !n.como_foi;
    if (n) n.como_foi = v; else D.numeros.push({ mes_ref: mesPassado, como_foi: v });
    cfRecente = v; if (primeira) cfMissaoNova = true;
    render(); cfRecente = null; indicadores(); anuncia(U.cap(U.nomeMes(mesPassado)) + ': ' + COMO[v][0].toLowerCase() + '. Obrigado!');
  };
  // soHistorico (Visão Geral): só a faixa dos meses, quando já há mais de um mês respondido (a pergunta fica no cartão da missão)
  const blocoComoFoi = (soHistorico) => {
    if (!inicioRef || mesPassado < inicioRef) return null;
    const atual = comoFoi(mesPassado);
    const responde = respondeComoFoi;
    // os meses do plano já encerrados (até 12), do mais antigo para o mais recente
    const meses = []; for (let r = inicioRef; r <= mesPassado; r = U.addRef(r, 1)) meses.push(r);
    const ult = meses.slice(-12);
    const respondidos = ult.filter((r) => comoFoi(r));
    const melhores = respondidos.filter((r) => comoFoi(r) === 'melhor').length;
    if (soHistorico) {
      if (respondidos.length < 2) return null;
      return el('section', { class: 'box comofoi comofoi--hist', 'aria-labelledby': 'cfh-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'cfh-t' }, 'Como foram os meses'), el('p', 'box__note', 'Comparado com o mesmo mês do ano passado')),
        el('div', 'comofoi__hist',
          el('p', 'comofoi__res', melhores + ' de ' + respondidos.length + (respondidos.length === 1 ? ' mês melhor' : ' meses melhores') + ' que no ano passado'),
          el('ol', { class: 'comofoi__meses', 'aria-label': 'Como foi cada mês' }, ult.map((r) => { const v = comoFoi(r);
            return el('li', 'comofoi__m' + (v ? ' is-' + v : '') + (cfRecente && r === mesPassado ? ' is-recem' : ''), el('span', 'comofoi__mi', v ? COMO[v][1] : '·'), el('span', 'comofoi__ml', U.nomeMesCurto(r)),
              el('span', 'sr-only', v ? COMO[v][0] : 'sem resposta')); }))));
    }
    return el('section', { class: 'box comofoi' + (respondidos.length > 1 ? ' comofoi--dois' : ''), id: 'como-foi', tabindex: '-1', 'aria-labelledby': 'cf-t' },
      el('div', 'comofoi__q', el('div', 'box__head', el('h2', { class: 'box__title', id: 'cf-t' }, 'Como foi ' + U.nomeMes(mesPassado) + '?'), atual ? (() => { const c = chip('done', 'Respondido'); if (cfRecente) c.classList.add('is-surge'); return c; })() : null),
      el('p', 'box__text', ['Comparado com ' + U.nomeMes(mesPassado) + ' do ano passado.', el('br'), 'Sem números: só você e o consultor veem.']),
      el('div', { class: 'comofoi__btns', role: 'group', 'aria-label': 'Como foi ' + U.nomeMes(mesPassado) },
        Object.entries(COMO).map(([k, [t, ic]]) => el('button', { class: 'comofoi__btn comofoi__btn--' + k + (cfRecente === k ? ' is-recem' : ''), type: 'button', 'aria-pressed': String(atual === k),
          onclick: (ev) => responde(k, ev.currentTarget) }, el('span', { class: 'comofoi__ic', 'aria-hidden': 'true' }, ic), t)))),
      respondidos.length > 1 ? el('div', 'comofoi__hist',
        el('p', 'comofoi__res', melhores + ' de ' + respondidos.length + (respondidos.length === 1 ? ' mês melhor' : ' meses melhores') + ' que no ano passado'),
        el('ol', { class: 'comofoi__meses', 'aria-label': 'Como foi cada mês' }, ult.map((r) => { const v = comoFoi(r);
          return el('li', 'comofoi__m' + (v ? ' is-' + v : '') + (cfRecente && r === mesPassado ? ' is-recem' : ''), el('span', 'comofoi__mi', v ? COMO[v][1] : '·'), el('span', 'comofoi__ml', U.nomeMesCurto(r)),
            el('span', 'sr-only', v ? COMO[v][0] : 'sem resposta')); }))) : null);
  };

  // ===== Consultoria =====
  const TIPOS_PECA = ['Post para redes', 'Anúncio', 'Proposta comercial', 'Embalagem ou material impresso', 'Outro'];
  const ehLink = (s) => /^https?:\/\//i.test(s || '');

  // arquivo .ics para a agenda do cliente
  const ics = (e) => {
    const f = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const fim = new Date(new Date(e.inicio).getTime() + e.duracao_min * 60000);
    const esc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
    const pauta = (e.pauta || []).map((p, i) => (i + 1) + '. ' + p).join('\n');
    const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GANG//Portal//PT', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:' + e.id + '@gang', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(e.inicio), 'DTEND:' + f(fim),
      'SUMMARY:' + esc((TIPO_ENCONTRO[e.tipo] || 'Encontro') + ' · GANG'),
      e.local_ou_link ? 'LOCATION:' + esc(e.local_ou_link) : null, pauta ? 'DESCRIPTION:' + esc('Pauta:\n' + pauta) : null,
      'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
    const a = el('a', { href: URL.createObjectURL(new Blob([txt], { type: 'text/calendar' })), download: 'encontro-gang-' + e.inicio.slice(0, 10) + '.ics' });
    document.body.append(a); a.click(); a.remove();
  };

  const abreArquivo = async (caminho) => {
    const { data, error } = await sb.storage.from('portal').createSignedUrl(caminho, 600);
    if (error || !data) return anuncia('Não foi possível abrir o arquivo.');
    window.open(data.signedUrl, '_blank', 'noopener');
  };

  let filtroHist = 'todos';
  const telaConsultoria = () => {
    const p = D.plano;
    const ativo = !p || p.status === 'ativo';
    const out = [head(null, 'Calendário', ['O próximo encontro, os prazos do mês', el('br'), 'e o que já conversamos em cada encontro.'],
      el('div', 'status-line', chip(ativo ? 'done' : 'todo', 'Consultoria mensal · ' + (p ? { ativo: 'ativa', pausado: 'pausada', encerrado: 'encerrada' }[p.status] : 'ativa')),
        p ? el('p', 'box__note', 'Desde ' + U.mesAno(p.inicio) + ' com a GANG') : null))];

    // próximo encontro
    const e = D.proximo;
    const meet = el('section', { class: 'box', 'aria-labelledby': 'next-t' }, el('p', { class: 'eyebrow', id: 'next-t' }, 'Próximo encontro'));
    if (e) {
      const local = e.local_ou_link ? (ehLink(e.local_ou_link) ? el('a', { class: 'link', href: e.local_ou_link, target: '_blank', rel: 'noopener' }, 'videochamada') : e.local_ou_link) : null;
      // append() nativo escreveria "null": os itens opcionais são filtrados
      meet.append(...[
        el('p', 'meet__when', U.quando(e.inicio)),
        el('p', 'box__text', (TIPO_ENCONTRO[e.tipo] || 'Encontro') + ' · ' + e.duracao_min + ' min', local ? [' · ', local] : null),
        (e.pauta || []).length || condicaoQuebrada().length ? el('div', 'agenda', el('p', 'eyebrow', 'Pauta'), el('ol', 'agenda__list', (e.pauta || []).map((x) => el('li', null, x)),
          condicaoQuebrada().map((c) => el('li', 'is-hot', 'Revisar a estratégia: “' + c.texto + '” não se confirmou')))) : null,
        e.status === 'remarcar_solicitado'
          ? el('p', 'box__note', 'Você pediu para remarcar. O consultor confirma a nova data.')
          : null,
        el('div', 'meet__btns',
          el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: () => ics(e) }, 'Adicionar à agenda'),
          e.status === 'agendado' ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => abrirRemarcar(e) }, 'Remarcar') : null)].filter(Boolean));
    } else meet.append(el('p', 'box__text', 'Nenhum encontro marcado ainda. O consultor agenda o próximo com você.'));

    // o consultor como um perfil, ao lado do próximo encontro
    const c = D.consultor;
    const perfilC = c ? el('section', { class: 'box perfil', 'aria-labelledby': 'cons-t' },
      el('div', 'perfil__topo', (() => { const a = el('span', 'perfil__logo perfil__logo--pessoa'); U.avatar(a, c.nome, c.foto_url); return a; })(),
        el('div', null, el('p', 'eyebrow', 'Seu consultor'), el('h2', { class: 'perfil__nome', id: 'cons-t' }, c.nome))),
      el('dl', 'perfil__dl',
        el('div', null, el('dt', null, 'Com vocês desde'), el('dd', null, p && p.inicio ? U.mesAno(p.inicio) : '—')),
        el('div', null, el('dt', null, 'Encontros realizados'), el('dd', null, String(D.encontros.filter((x) => x.status === 'realizado' || new Date(x.inicio).getTime() <= agoraMs).length))),
        el('div', null, el('dt', null, 'Revisão de peças'), el('dd', null, 'Resposta em até ' + ((p && p.prazo_revisao_dias) || 2) + ' dias úteis'))),
      el('div', 'meet__btns',
        el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => abrirConversa() }, 'Mandar mensagem'),
        c.whatsapp ? el('a', { class: 'btn btn--ghost btn--sm', href: 'https://wa.me/' + String(c.whatsapp).replace(/\D/g, ''), target: '_blank', rel: 'noopener' }, 'WhatsApp') : null)) : null;
    // o mês em grade logo abaixo do próximo encontro; sem consultor, a lista do mês vai ao lado do encontro
    const [calGrade, calLista] = telaCalendario().slice(1);
    if (perfilC) out.push(el('div', 'grid perfil-grid', perfilC, meet), calGrade, calLista);
    else out.push(el('div', 'grid grid--half cal-topo', meet, calLista), calGrade);

    // histórico: encontros e prazos numa linha do tempo, com filtro (as revisões de peças ficam em Ações)
    const passados = D.encontros.filter((x) => x.status === 'realizado' || new Date(x.inicio).getTime() <= agoraMs);
    const hojeD = new Date().toLocaleDateString('sv-SE');
    const itensH = [
      ...passados.map((x) => ({ k: 'encontros', d: x.inicio.slice(0, 10), t: (TIPO_ENCONTRO[x.tipo] || 'Encontro') + ' de ' + U.nomeMes(U.ref(x.inicio)), o: 'Encontro · ' + x.duracao_min + ' min', x })),
      ...D.acoes.filter((a) => comCliente(a) && a.prazo && a.prazo <= hojeD).map((a) => ({ k: 'prazos', d: a.prazo, t: a.titulo,
        o: a.status === 'feita' ? (a.concluida_em && a.concluida_em > a.prazo ? 'Prazo · feita com atraso' : 'Prazo · feita a tempo') : 'Prazo · ainda aberta', st: a.status === 'feita' ? (a.concluida_em && a.concluida_em > a.prazo ? 'warn' : 'ok') : 'bad' })),
    ].sort((a, b) => b.d.localeCompare(a.d));
    if (itensH.length) {
      const FIL = [['todos', 'Todos'], ['encontros', 'Encontros'], ['prazos', 'Prazos']];
      const corpo = el('ol', 'hist');
      const desenha = () => {
        const xs = itensH.filter((x) => filtroHist === 'todos' || x.k === filtroHist).slice(0, 30);
        corpo.replaceChildren(...(xs.length ? xs.map((x) => {
          const det = x.x ? [
            (x.x.pauta || []).length ? el('div', 'hist__bloco', el('p', 'hist__rot', 'Pauta'), el('ul', 'hist__lista', x.x.pauta.map((t) => el('li', null, t)))) : null,
            (x.x.decisoes || []).length ? el('div', 'hist__bloco', el('p', 'hist__rot', 'Decidimos'), el('ul', 'hist__lista', x.x.decisoes.map((t) => el('li', null, t)))) : null].filter(Boolean) : [];
          const linha = [el('span', 'hist__d', U.dia(x.d)), el('span', 'hist__p' + (x.st ? ' hist__p--' + x.st : x.k === 'encontros' ? ' hist__p--enc' : '')),
            el('div', 'hist__m', el('p', 'hist__t', x.t), el('p', 'hist__o', x.o))];
          return det.length ? el('li', 'hist__i', el('details', { class: 'hist__det', id: x.x ? 'enc-' + x.x.id : null, open: abreEnc ? (x.x && x.x.id === abreEnc) : x === itensH.find((y) => y.k === 'encontros') },
            el('summary', 'hist__linha', linha), el('div', 'hist__mais', det)))
            : el('li', 'hist__i', el('div', 'hist__linha', linha));
        }) : [el('li', 'hist__vazio', 'Nada por aqui ainda.')]));
      };
      const chips = el('div', { class: 'fchips', role: 'group', 'aria-label': 'Filtrar histórico' }, FIL.map(([k, t]) => {
        const n = k === 'todos' ? itensH.length : itensH.filter((x) => x.k === k).length;
        return el('button', { class: 'fchip', type: 'button', 'aria-pressed': String(filtroHist === k), onclick: (ev) => {
          filtroHist = k; chips.querySelectorAll('.fchip').forEach((b) => b.setAttribute('aria-pressed', 'false')); ev.currentTarget.setAttribute('aria-pressed', 'true'); desenha(); } },
          t, el('span', 'fchip__n', String(n)));
      }));
      desenha();
      out.push(el('section', { class: 'box', 'aria-labelledby': 'hist-t' },
        el('div', 'gh', el('h2', { class: 'box__title', id: 'hist-t' }, 'Histórico'), el('p', 'gh__nota', ['Encontros e prazos, do mais recente', el('br'), 'para o mais antigo.'])),
        chips, corpo));
    }

    // veio de um toque no calendário: rola até o encontro (o passado, aberto; ou o próximo, no topo)
    if (abreEnc) {
      const id = abreEnc; abreEnc = null;
      setTimeout(() => { const alvo = document.getElementById('enc-' + id) || document.getElementById('next-t'); if (alvo) alvo.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 450);
    }

    // rodapé: o plano de consultoria
    if (p) {
      out.push(el('section', { class: 'plan-foot', 'aria-label': 'Seu plano de consultoria' },
        el('div', null, el('p', 'box__title', 'Seu plano de consultoria'), p.plano_inclui ? el('p', 'box__text', p.plano_inclui) : null),
        p.proxima_fatura ? el('p', 'box__text', 'Próxima fatura: ' + U.dia(p.proxima_fatura)) : null));
    }
    return out;
  };

  // as peças enviadas para revisão (agora em Ações)
  const suasPecas = () => {
    if (!D.pedidos.length) return null;
    const p = D.plano;

      const PED = { em_analise: ['doing', 'Em análise'], ajustar: ['warn', 'Ajustar'], aprovado: ['done', 'Aprovado'] };
      const sec = (el('section', { class: 'box', 'aria-labelledby': 'pecas-t' },
        el('h2', { class: 'box__title', id: 'pecas-t' }, 'Suas peças'),
        el('ul', 'todo', D.pedidos.map((pd) => {
          const [k, t] = PED[pd.status] || ['todo', pd.status];
          const sub = pd.status === 'em_analise' ? 'Enviado em ' + U.dia(pd.enviado_em) + ' · resposta em até ' + ((p && p.prazo_revisao_dias) || 2) + ' dias úteis'
            : pd.resposta ? '“' + pd.resposta + '”' : 'Revisado em ' + U.dia(pd.respondido_em || pd.enviado_em);
          const abrir = pd.arquivo ? el('button', { class: 'link', type: 'button', onclick: () => abreArquivo(pd.arquivo) }, 'Abrir arquivo')
            : (pd.link ? el('a', { class: 'link', href: pd.link, target: '_blank', rel: 'noopener' }, 'Abrir link') : null);
          const CHK = [['cliente', 'Cliente certo'], ['mensagem', 'Mensagem central'], ['tom', 'Tom de voz'], ['identidade', 'Marca reconhecível']];
          const chk = pd.checklist && pd.status !== 'em_analise' ? el('ul', 'checklist', CHK.map(([kk, tt]) => el('li', pd.checklist[kk] ? 'is-ok' : 'is-no',
            el('span', { 'aria-hidden': 'true' }, pd.checklist[kk] ? '✓' : '✕'), tt + (pd.checklist[kk] ? '' : ' (ajustar)')))) : null;
          return el('li', 'piece',
            el('div', 'todo__text', el('span', 'todo__title', pd.titulo || pd.tipo_peca),
              el('span', 'todo__sub', pd.tipo_peca + ' · ' + sub), chk, abrir),
            chip(k, t));
        }))));
      // o cliente viu as respostas "ajustar": somem das pendências do Início
      ajustarNaoVistos().forEach((pd) => { pd.visto_pelo_cliente = true; sb.rpc('portal_marcar_visto', { p_pedido: pd.id }).then(() => {}); });
    return sec;
  };

  // pedir revisão de uma peça (arquivo OU link)
  const formRevisao = () => {
    const prazoDias = (D.plano && D.plano.prazo_revisao_dias) || 2;
    const lim = D.plano && D.plano.revisoes_mes != null ? D.plano.revisoes_mes : 2;
    const usadas = D.pedidos.filter((x) => (x.enviado_em || '').slice(0, 7) === hoje).length;
    if (usadas >= lim) return el('section', { class: 'box review', 'aria-labelledby': 'rev-t' },
      el('h2', { class: 'box__title', id: 'rev-t' }, 'Revisão de peças'),
      el('p', 'review__cota is-cheia', usadas + ' de ' + lim + ' revisões usadas em ' + U.nomeMes(hoje)),
      el('p', 'box__text', 'As revisões incluídas neste mês já foram usadas. Antes de publicar, confira o checklist “Antes de publicar”, na Narrativa.'),
      el('a', { class: 'btn btn--ghost btn--sm', href: '#plataforma' }, 'Abrir a Narrativa'));
    const f = el('form', { class: 'box box--line review', novalidate: true, 'aria-labelledby': 'rev-t' },
      el('h2', { class: 'box__title', id: 'rev-t' }, 'Pedir revisão de uma peça'),
      el('p', 'review__cota', usadas + ' de ' + lim + ' revisões usadas em ' + U.nomeMes(hoje)),
      el('p', 'box__text', 'Post, anúncio, proposta, embalagem: mande antes de publicar e o consultor responde em até ' + prazoDias + ' dias úteis. Antes, confira o checklist “Antes de publicar”, na Narrativa.'),
      el('div', 'review__grid',
        el('div', null, el('label', { class: 'label', for: 'r-tipo' }, 'Tipo de peça'),
          el('select', { class: 'field', id: 'r-tipo' }, TIPOS_PECA.map((t) => el('option', { value: t }, t)))),
        el('div', null, el('label', { class: 'label', for: 'r-titulo' }, 'Nome da peça'),
          el('input', { class: 'field', id: 'r-titulo', maxlength: 200, placeholder: 'Post de lançamento do método' })),
        el('div', 'full', el('label', { class: 'label', for: 'r-arq' }, 'Arquivo (até 20 MB) ou link'),
          el('div', 'review__file',
            el('input', { class: 'field field--file', id: 'r-arq', type: 'file', accept: 'image/*,application/pdf,video/*,.doc,.docx,.ppt,.pptx,.key,.zip' }),
            el('input', { class: 'field', id: 'r-link', type: 'url', inputmode: 'url', placeholder: 'ou cole um link: https://…', 'aria-label': 'Link da peça' }))),
        el('div', 'full', el('label', { class: 'label', for: 'r-perg' }, 'O que você quer saber?'),
          el('textarea', { class: 'field', id: 'r-perg', rows: 3, maxlength: 4000, placeholder: 'O texto está no tom da marca?' }))),
      el('div', 'numbers__foot',
        el('button', { class: 'btn btn--light', type: 'submit' }, 'Enviar para revisão'),
        el('p', { class: 'msg', id: 'r-msg', role: 'status', 'aria-live': 'polite' })));
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const file = $('r-arq').files[0];
      const link = $('r-link').value.trim();
      if (!file && !link) return U.say($('r-msg'), 'Envie um arquivo ou cole um link.', 'error');
      if (link && !ehLink(link)) return U.say($('r-msg'), 'O link precisa começar com http:// ou https://', 'error');
      if (file && file.size > 20 * 1024 * 1024) return U.say($('r-msg'), 'O arquivo passa de 20 MB. Envie um link (Drive, WeTransfer…).', 'error');
      const btn = f.querySelector('[type=submit]'); btn.disabled = true; U.say($('r-msg'), file ? 'Enviando o arquivo…' : 'Enviando…');
      let caminho = null;
      if (file) {
        const nome = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w.-]+/g, '-').slice(-80);
        caminho = me.empresa_id + '/pecas/' + crypto.randomUUID() + '-' + nome;
        const up = await sb.storage.from('portal').upload(caminho, file, { contentType: file.type || 'application/octet-stream' });
        if (up.error) { btn.disabled = false; return U.say($('r-msg'), 'Não foi possível enviar o arquivo. Tente de novo ou mande um link.', 'error'); }
      }
      const pedido = { p_tipo: $('r-tipo').value, p_titulo: $('r-titulo').value.trim(), p_arquivo: caminho, p_link: link || null, p_pergunta: $('r-perg').value.trim() };
      const { error } = await sb.rpc('portal_pedir_revisao', pedido);
      btn.disabled = false;
      if (error) return U.say($('r-msg'), error.message || 'Não foi possível enviar.', 'error');
      D.pedidos.unshift({ id: 'novo-' + Date.now(), tipo_peca: pedido.p_tipo, titulo: pedido.p_titulo || null, arquivo: caminho, link: pedido.p_link,
        pergunta: pedido.p_pergunta, enviado_em: new Date().toISOString(), status: 'em_analise', visto_pelo_cliente: true });
      render(); anuncia('Peça enviada para revisão.');
      const m = $('r-msg'); if (m) U.say(m, 'Enviado. O consultor responde em até ' + prazoDias + ' dias úteis.', 'ok');
    });
    return f;
  };

  // pedir para remarcar (o consultor muda a data)
  const remDlg = el('dialog', { class: 'dialog', 'aria-labelledby': 'rem-t' });
  const remForm = el('form', { class: 'dialog__body', method: 'dialog' },
    el('h2', { class: 'title-sm', id: 'rem-t' }, 'Remarcar o encontro'),
    el('p', 'small', 'A data só muda quando o consultor confirmar. Sugira dias e horários que funcionam para você.'),
    el('label', { class: 'label', for: 'rem-txt' }, 'Melhores dias e horários'),
    el('textarea', { class: 'field', id: 'rem-txt', rows: 4, maxlength: 1000, placeholder: 'Ex.: terça ou quinta, depois das 14h' }),
    el('p', { class: 'msg', id: 'rem-msg', role: 'status', 'aria-live': 'polite' }),
    el('div', 'dialog__foot',
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => remDlg.close() }, 'Cancelar'),
      el('button', { class: 'btn btn--light btn--sm', type: 'submit' }, 'Pedir remarcação')));
  remDlg.append(remForm); document.body.append(remDlg);
  let remAlvo = null;
  const abrirRemarcar = (e) => { remAlvo = e; $('rem-txt').value = ''; U.say($('rem-msg'), ''); remDlg.showModal(); $('rem-txt').focus(); };
  remForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const btn = remForm.querySelector('[type=submit]'); btn.disabled = true;
    const { error } = await sb.rpc('portal_remarcar', { p_encontro: remAlvo.id, p_motivo: $('rem-txt').value.trim() });
    btn.disabled = false;
    if (error) return U.say($('rem-msg'), 'Não foi possível enviar o pedido.', 'error');
    remAlvo.status = 'remarcar_solicitado'; remDlg.close(); render(); anuncia('Pedido de remarcação enviado ao consultor.');
  });

  const alertaEstrategia = (qs) => el('section', { class: 'alert', role: 'note' },
    el('p', 'alert__title', qs.length > 1 ? 'Algumas condições da estratégia não se confirmaram' : 'Uma condição da estratégia não se confirmou'),
    el('p', 'box__text', qs.map((c) => '“' + c.texto + '”').join(' · ') + '. Vamos revisar a estratégia no próximo encontro.'),
    el('a', { class: 'link', href: '#estrategia' }, 'Ver estratégia'));

  // ===== Sua marca (somente leitura) =====
  const baixar = (caminho, rotulo, cls) => el('button', { class: cls || 'btn btn--ghost', type: 'button', onclick: () => abreArquivo(caminho) }, rotulo);
  // estado vazio: compacto e centrado, com uma prévia em esqueleto (nada de faixa larga vazia)
  const vazio = (txt) => el('div', { class: 'vazio', role: 'status' },
    el('div', { class: 'vazio__previa', 'aria-hidden': 'true' },
      el('span', 'vazio__l vazio__l--a'), el('span', 'vazio__l vazio__l--b'), el('span', 'vazio__l vazio__l--c')),
    el('p', 'vazio__t', 'Em preparação'),
    el('p', 'vazio__d', txt || 'O consultor ainda não publicou esta parte. Ela aparece aqui assim que estiver pronta.'));
  const sec = (idt, titulo, ...kids) => el('section', { class: 'box', 'aria-labelledby': idt }, el('h2', { class: 'box__title', id: idt }, titulo), kids);
  // ----- peças das telas da marca (estilo de painel: faixa de números, listas agrupadas, ícones em quadrinho) -----
  const ICP = {
    ok: 'M20 6 9 17l-5-5', nao: 'M6 6l12 12 M18 6 6 18', meio: 'M6 12h12', alerta: 'M12 8v5 M12 16.5v.5 M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
    arquivo: 'M14 3H6v18h12V7Z M14 3v4h4', balao: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z', peca: 'M4 5h16v14H4Z M4 15l5-5 4 4 3-3 4 4',
    grafico: 'M4 20V10 M10 20V4 M16 20v-7 M3 20h18', alvo: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  };
  const icp = (nome) => { const NS = 'http://www.w3.org/2000/svg'; const sv = document.createElementNS(NS, 'svg'); sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('aria-hidden', 'true');
    ICP[nome].split(' M').forEach((d, i) => { const pa = document.createElementNS(NS, 'path'); pa.setAttribute('d', (i ? 'M' : '') + d); sv.append(pa); }); return sv; };
  const quad = (conteudo, tom) => el('span', 'gq' + (tom ? ' gq--' + tom : ''), typeof conteudo === 'string' && ICP[conteudo] ? icp(conteudo) : conteudo);
  // faixa de números no topo da tela: rótulo pequeno, valor, nota
  const faixa = (itens) => { const xs = itens.filter(Boolean); return xs.length ? el('div', { class: 'faixa', style: '--n:' + xs.length },
    xs.map(([rot, val, nota, href]) => el(href ? 'a' : 'div', href ? { class: 'faixa__c faixa__c--link', href } : 'faixa__c', el('p', 'faixa__rot', rot), el('p', 'faixa__val', val), nota ? el('p', 'faixa__nota', nota) : null))) : null; };
  // lista agrupada: [quadrinho, título, linha de apoio, à direita]
  const grupo = (linhas, cls) => el('ul', 'gl' + (cls ? ' ' + cls : ''), linhas.map(([q, t, sub, dir]) => el('li', 'gl__i',
    q, el('div', 'gl__m', el('p', 'gl__t', t), sub ? (typeof sub === 'string' ? el('p', 'gl__s', sub) : sub) : null), dir || null)));
  const secN = (idt, titulo, n, nota, ...kids) => el('section', { class: 'box', 'aria-labelledby': idt },
    el('div', 'gh', el('h2', { class: 'box__title', id: idt }, titulo), n != null ? el('span', 'gh__n', String(n)) : null, nota ? el('p', 'gh__nota', nota) : null), kids);
  const aspas = (t) => '“' + String(t || '').trim().replace(/^["“”']+|["“”']+$/g, '') + '”';
  const metaPares = (pares) => el('dl', 'gmeta', pares.filter(([, v]) => v).map(([k, v]) => el('div', null, el('dt', null, k), el('dd', null, v))));

  // Plataforma de marca
  const FACETAS = [['aparencia', 'Aparência'], ['personalidade', 'Personalidade'], ['valores', 'Valores'], ['relacao', 'Relação com o cliente'],
    ['cliente_projetado', 'Cliente que projeta'], ['autoimagem', 'Como o cliente se sente']];
  const telaPlataforma = () => {
    const P = D.plataforma;
    const out = [head(P && P.entregue_em ? 'Plataforma de marca · entregue em ' + U.mesAno(P.entregue_em) : 'Plataforma de marca', 'Narrativa',
      'Quem sua marca é e como ela fala. Consulte antes de escrever um post, uma\u00a0proposta\u00a0ou\u00a0um\u00a0anúncio.',
      P && P.pdf ? baixar(P.pdf, 'Baixar em PDF') : null)];
    if (!P) return out.concat(vazio());
    const facN = FACETAS.filter(([k]) => D.facetas[k]).length;
    const exN = D.pedidos.filter((x) => x.exemplo && x.status === 'aprovado').length;
    out.push(faixa([
      ['Mensagens de apoio', String(D.mensagens_apoio.length)],
      ['Tom de voz', String(D.tom_atributos.length), D.tom_atributos.length === 1 ? 'atributo' : 'atributos'],
      ['Quem a marca é', facN + ' de ' + FACETAS.length, 'facetas definidas'],
      ['Exemplos aprovados', String(exN), exN ? 'para usar de referência' : 'aparecem quando houver']]));

    // o posicionamento é escolha estratégica: fica na tela Estratégia

    // o que nunca muda: o filtro para decidir se uma peça, parceria ou serviço combina com a marca
    const IC = D.identidade_central || [];
    if (IC.length) out.push(secN('ic-t', 'O que nunca muda', IC.length, 'Toda peça, parceria e serviço novo precisa combinar com isto.',
      el('div', { class: 'ic', style: '--n:' + IC.length }, IC.map((x, i) => el('div', 'ic__i',
        quad(String(i + 1), 'num'), el('p', 'ic__t', x.texto), x.explicacao ? el('p', 'ic__d', x.explicacao) : null)))));

    const dizer = sec('say-t', 'O que dizer',
      P.mensagem_central ? [el('p', 'eyebrow', 'Mensagem central'), el('p', 'say__main', P.mensagem_central)] : null,
      D.mensagens_apoio.length ? [el('p', 'eyebrow', 'Mensagens de apoio'),
        grupo(D.mensagens_apoio.map((m, i) => [quad(String(i + 1), 'num'), m.texto]), 'gl--say')] : null);

    // checklist "antes de publicar": só uma ajuda visual, não salva
    const itens = ['Fala com o cliente que escolhemos atender', 'Reforça a mensagem central', 'Soa como a marca (tom de voz)', 'Usa a cor, o símbolo e a frase da marca'];
    const result = el('p', { class: 'check__result', role: 'status', 'aria-live': 'polite' });
    const boxes = itens.map((t, i) => el('label', { class: 'check', for: 'chk-' + i }, el('input', { type: 'checkbox', id: 'chk-' + i }), el('span', null, t)));
    const atualiza = () => {
      const ok = boxes.every((b) => b.querySelector('input').checked);
      result.replaceChildren(ok ? el('strong', null, 'Pode publicar.') : el('a', { class: 'link', href: '#acoes', onclick: () => { revAberta = true; } }, 'Pedir revisão ao consultor'));
    };
    boxes.forEach((b) => b.querySelector('input').addEventListener('change', atualiza));
    atualiza();
    const checklist = sec('chk-t', 'Antes de publicar', el('p', 'box__text', 'Marque as quatro. Se alguma falhar, ajuste ou mande para revisão.'), el('div', 'checks', boxes), result);
    out.push(el('div', 'grid grid--todo', dizer, checklist));

    const diz = D.tom_exemplos.filter((x) => x.tipo === 'diz');
    const nunca = D.tom_exemplos.filter((x) => x.tipo === 'nunca_diz');
    if (D.tom_atributos.length) out.push(secN('tom-t', 'Tom de voz', D.tom_atributos.length, 'Como a marca soa em qualquer texto.',
      el('div', 'tone', D.tom_atributos.map((a) => el('div', 'tone__item', el('p', 'tone__name', a.nome), a.descricao ? el('p', 'box__text', a.descricao) : null)))));
    if (diz.length || nunca.length) out.push(el('div', 'grid grid--half',
      diz.length ? secN('diz-t', 'A marca diz', diz.length, null, grupo(diz.map((x) => [quad('ok', 'ok'), aspas(x.texto)]))) : null,
      nunca.length ? secN('nunca-t', 'Nunca diz', nunca.length, null, grupo(nunca.map((x) => [quad('nao', 'bad'), aspas(x.texto)]))) : null));

    const facs = FACETAS.filter(([k]) => D.facetas[k]);
    if (facs.length) out.push(secN('who-t', 'Quem a marca é', facs.length + '/' + FACETAS.length, 'O jeito da marca, para decidir o que combina com ela.',
      el('dl', 'gdef', facs.map(([k, t]) => el('div', null, el('dt', null, t), el('dd', null, D.facetas[k]))))));
    // peças aprovadas que o consultor marcou como exemplo: o jeito certo, para copiar
    const ex = D.pedidos.filter((x) => x.exemplo && x.status === 'aprovado');
    if (ex.length) out.push(secN('ex-t', 'Exemplos aprovados', ex.length, 'Peças que seguiram a plataforma. Use como referência para as próximas.',
      grupo(ex.map((x) => [quad('peca'), x.titulo || x.tipo_peca, x.tipo_peca + (x.resposta ? ' · “' + x.resposta + '”' : ''),
        x.arquivo ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => abreArquivo(x.arquivo) }, 'Abrir')
          : (x.link ? el('a', { class: 'btn btn--ghost btn--sm', href: x.link, target: '_blank', rel: 'noopener' }, 'Abrir') : null)]))));
    return out;
  };

  // Ativos distintivos (Romaniuk): fama = quem liga o ativo à marca; exclusividade = das ligações a alguma marca, quantas são à sua
  const ativosDistintivos = () => {
    const nome = D.empresa ? D.empresa.nome : '';
    const q = [...D.pesquisas].reverse().find((x) => (x.ativos || []).length && D.respostas.some((r) => r.pesquisa_id === x.id));
    const rs = q ? D.respostas.filter((r) => r.pesquisa_id === q.id) : [];
    const medida = (a) => {
      const resp = rs.map((r) => (r.ativos || {})[a.id]).filter((v) => v != null);
      if (!resp.length) return null;
      const certos = resp.filter((v) => v === nome).length;
      const comMarca = resp.filter((v) => v && v !== 'Não sei').length;
      return { fama: Math.round((certos / resp.length) * 100), excl: comMarca ? Math.round((certos / comMarca) * 100) : 0, n: resp.length };
    };
    const QUAD = (m) => (m.fama >= 50 && m.excl >= 50 ? ['done', 'Use sempre'] : m.excl >= 50 ? ['doing', 'Invista: repita mais'] : m.fama >= 50 ? ['todo', 'Use junto com o nome'] : ['warn', 'Evite usar sozinho']);
    const itens = D.ativos.map((a) => ({ a, m: medida(a) }));
    const visual = (a) => (a.tipo === 'cor' && /^#[0-9a-f]{6}$/i.test(a.texto || '') ? el('span', { class: 'asset-mini', style: 'background:' + a.texto })
      : a.imagem_url ? el('span', 'asset-mini', el('img', { src: a.imagem_url, alt: '' })) : el('span', 'asset-mini asset-mini--txt', a.texto ? '“' + a.texto + '”' : a.nome));
    const comDado = itens.filter((x) => x.m);
    const nMax = Math.max(0, ...comDado.map((x) => x.m.n));
    const preliminar = comDado.length && nMax < 30;
    return sec('dist-t', 'O que faz reconhecerem a marca',
      el('p', 'box__text', 'Mostramos cada sinal sem o nome e perguntamos de quem é.'),
      // amostra pequena: só o selo (o mesmo de "Como a marca é lembrada"); a explicação fica ao passar o mouse
      preliminar ? el('p', 'prelim', el('span', { class: 'chip chip--doing', title: 'Com menos de 30 respostas, leia como tendência: uma pessoa a mais muda o resultado em vários pontos.' },
        'Amostra pequena · ' + nMax + (nMax === 1 ? ' resposta' : ' respostas'))) : null,
      el('div', comDado.length >= 2 ? 'dist-grid' : 'dist-solo', comDado.length >= 2 ? graficoDispersao(comDado) : null,
      el('ul', 'todo', itens.map(({ a, m }) => el('li', 'piece',
        el('div', 'asset-row', visual(a), el('div', 'todo__text', el('span', 'todo__title', a.nome),
          el('span', 'todo__sub', m ? 'Fama ' + m.fama + '% · exclusividade ' + m.excl + '%' : 'Entra na próxima rodada da pesquisa'))),
        // com amostra pequena o selo de cima já avisa; o veredito por sinal só aparece com 30 respostas ou mais
        m ? (m.n < 30 ? null : chip(...QUAD(m))) : chip('todo', 'Sem dados'))))));
  };
  // dispersão fama × exclusividade, com os quatro quadrantes
  const graficoDispersao = (itens) => grafico('chart--scatter', 'Ativos por fama e exclusividade: ' + itens.map(({ a, m }) => a.nome + ' fama ' + m.fama + '% exclusividade ' + m.excl + '%').join('; '), (W, tip, box) => {
    const H = 280; const L = 56; const R = 16; const T = 16; const B = 40;
    const x = (v) => L + ((W - L - R) * v) / 100; const y = (v) => T + ((H - T - B) * (100 - v)) / 100;
    const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    [0, 50, 100].forEach((t) => svg.append(
      sv('line', { x1: x(t), x2: x(t), y1: T, y2: H - B, stroke: t === 50 ? C.axis : C.grid, 'stroke-width': 1 }),
      sv('line', { x1: L, x2: W - R, y1: y(t), y2: y(t), stroke: t === 50 ? C.axis : C.grid, 'stroke-width': 1 }),
      sv('text', { x: x(t), y: H - B + 16, 'text-anchor': 'middle', class: 'chart__axis' }, t + '%'),
      sv('text', { x: L - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'chart__axis' }, t + '%')));
    svg.append(sv('text', { x: (L + W - R) / 2, y: H - 4, 'text-anchor': 'middle', class: 'chart__axis' }, 'Fama: quantos ligam o ativo à marca'),
      sv('text', { x: W - R - 4, y: T + 12, 'text-anchor': 'end', class: 'chart__axis' }, 'Use sempre'),
      sv('text', { x: L + 6, y: T + 12, class: 'chart__axis' }, 'Invista'),
      sv('text', { x: W - R - 4, y: H - B - 6, 'text-anchor': 'end', class: 'chart__axis' }, 'Use com o nome'),
      sv('text', { x: L + 6, y: H - B - 6, class: 'chart__axis' }, 'Evite sozinho'),
      sv('text', { x: 12, y: (T + H - B) / 2, 'text-anchor': 'middle', class: 'chart__axis', transform: `rotate(-90 12 ${(T + H - B) / 2})` }, 'Exclusividade'));
    itens.forEach(({ a, m }) => {
      const cx = x(m.fama); const cy = y(m.excl);
      svg.append(sv('circle', { cx, cy, r: 6, fill: C.ink, stroke: C.surface, 'stroke-width': 2 }),
        sv('text', { x: cx + (cx > W - 140 ? -10 : 10), y: cy - 8, 'text-anchor': cx > W - 140 ? 'end' : 'start', class: 'chart__end' }, a.nome));
      const hit = sv('circle', { cx, cy, r: 14, fill: 'transparent' });
      hit.addEventListener('pointerenter', () => dica(tip, box, cx, cy, [[a.nome], [m.fama + '%', 'fama'], [m.excl + '%', 'exclusividade']]));
      hit.addEventListener('pointerleave', () => { tip.hidden = true; });
      svg.append(hit);
    });
    return svg;
  });

  // ===== a marca para usar (inspirado em guias de marca vivos): copiar, ver e testar =====
  const copia = (txt) => {
    const b = el('button', { class: 'copy', type: 'button', title: 'Copiar ' + txt }, txt);
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(txt); b.classList.add('is-ok'); b.dataset.label = 'Copiado'; setTimeout(() => { b.classList.remove('is-ok'); }, 1400); } catch (e) { U.avisa('Copie:', txt); }
    });
    return b;
  };
  const rgbDe = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ');
  const lumDe = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const contraste = (a, b) => { const [x, y] = [lumDe(a), lumDe(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const familia = (nome) => '"' + String(nome).replace(/"/g, '') + '", ' + 'var(--font)';
  const fontesCarregadas = new Set();
  const carregaFonte = (nome) => {
    if (!nome || fontesCarregadas.has(nome)) return; fontesCarregadas.add(nome);
    document.head.append(el('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(nome).replace(/%20/g, '+') + ':wght@400;600&display=swap' }));
  };

  const testeDaMarca = () => {
    const out = [];
    const nome = D.empresa ? D.empresa.nome : 'Sua marca';
    const fonteTitulo = D.tipografias[0] ? D.tipografias[0].nome : null;
    if (fonteTitulo) carregaFonte(fonteTitulo);

    // 1. combine duas cores: contraste real e o veredito
    const pal = [...D.cores.map((c) => ({ n: c.nome, h: c.hex.toUpperCase() })), { n: 'Branco', h: '#FFFFFF' }, { n: 'Preto', h: '#000000' }]
      .filter((c, i, arr) => arr.findIndex((x) => x.h === c.h) === i);
    if (D.cores.length) {
      const opt = (sel) => pal.map((c) => el('option', { value: c.h, selected: c.h === sel }, c.n + ' · ' + c.h));
      const claro = [...pal].sort((a, b) => lumDe(b.h) - lumDe(a.h))[0].h; const escuro = [...pal].sort((a, b) => lumDe(a.h) - lumDe(b.h))[0].h;
      const sTxt = el('select', { class: 'field', id: 'cmb-txt' }, opt(escuro)); const sBg = el('select', { class: 'field', id: 'cmb-bg' }, opt(claro));
      const amostra = el('div', 'cmb__sample', el('p', 'cmb__h', nome), el('p', 'cmb__p', 'Um parágrafo de exemplo para ver se o texto corrido fica confortável de ler.'));
      const ver = el('div', { class: 'cmb__verdict', role: 'status', 'aria-live': 'polite' });
      const atualiza = () => {
        amostra.style.background = sBg.value; amostra.style.color = sTxt.value;
        if (fonteTitulo) amostra.querySelector('.cmb__h').style.fontFamily = familia(fonteTitulo);
        const r = contraste(sTxt.value, sBg.value);
        const [k, t, d] = sTxt.value === sBg.value ? ['no', 'Mesma cor', 'Texto e fundo iguais: nada aparece.']
          : r >= 7 ? ['ok', 'Ótima combinação', 'Funciona para qualquer texto, inclusive letras pequenas.']
            : r >= 4.5 ? ['ok', 'Boa para textos', 'Pode usar em parágrafos e títulos.']
              : r >= 3 ? ['mid', 'Só para títulos grandes', 'Em texto pequeno fica difícil de ler. Use em títulos e destaques.']
                : ['no', 'Evite', 'Contraste baixo: difícil de ler, principalmente no celular e ao sol.'];
        ver.replaceChildren(el('p', 'cmb__ratio', r.toFixed(1).replace('.', ',') + ':1'), el('div', null, el('p', 'brk__verdict is-' + k, (k === 'ok' ? '✓ ' : k === 'mid' ? '~ ' : '✕ ') + t), el('p', 'box__note', d)));
      };
      sTxt.addEventListener('change', atualiza); sBg.addEventListener('change', atualiza); atualiza();
      const cmb = sec('cmb-t', 'Combine duas cores',
        el('p', 'box__text', 'Escolha a cor do texto e a do fundo e veja se funcionam juntas.'),
        el('div', 'cmb__ctl', el('div', null, el('label', { class: 'label', for: 'cmb-txt' }, 'Texto'), sTxt), el('div', null, el('label', { class: 'label', for: 'cmb-bg' }, 'Fundo'), sBg)),
        amostra, ver);

      // 2. escreva um título: veja na marca e confira o tom antes de publicar
      const P = D.plataforma || {};
      const nunca = (D.tom_exemplos || []).filter((x) => x.tipo === 'nunca_diz').map((x) => x.texto.replace(/[“”"]/g, ''));
      const proibidas = ['menor preço', 'mais barato', 'barato', 'imperdível', 'promoção', 'só hoje', 'melhor do mercado', 'o melhor', 'grátis', 'aproveite', 'corra'];
      const palavras = (t) => semAcento(t).replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
      const chaves = new Set(palavras(P.mensagem_central || ''));
      const inp = el('input', { class: 'field', id: 'tt-txt', maxlength: 140, placeholder: 'Escreva um título, como num post ou anúncio', value: P.mensagem_central || '' });
      const prev = el('p', { class: 'tt__preview', style: fonteTitulo ? 'font-family:' + familia(fonteTitulo) : null });
      const lista = el('ul', { class: 'tt__checks', role: 'status', 'aria-live': 'polite' });
      const confere = () => {
        const t = inp.value.trim(); prev.textContent = t || 'Seu título aparece aqui';
        const st = semAcento(t);
        const itens = [];
        if (!t) { lista.replaceChildren(); return; }
        const usaChave = palavras(t).some((w) => chaves.has(w));
        itens.push([usaChave, usaChave ? 'Reforça a mensagem central' : 'Não conversa com a mensagem central (“' + (P.mensagem_central || '—') + '”)']);
        const ruim = [...proibidas, ...nunca.map(semAcento)].find((x) => x && st.includes(semAcento(x).toLowerCase().slice(0, 18)));
        itens.push([!ruim, ruim ? 'Soa como algo que a marca nunca diz (“' + ruim + '”)' : 'Nada que a marca evita dizer']);
        const gritos = (t.match(/!/g) || []).length > 1 || /\b[A-Z\u00C0-\u00DD]{4,}\b.*\b[A-Z\u00C0-\u00DD]{4,}\b/.test(t);
        itens.push([!gritos, gritos ? 'Gritando demais (exclamações ou CAIXA ALTA)' : 'Tom firme, sem gritar']);
        itens.push([t.length <= 70, t.length <= 70 ? 'Tamanho bom para título (' + t.length + ' caracteres)' : 'Longo para um título (' + t.length + ' caracteres): tente ficar abaixo de 70']);
        lista.replaceChildren(...itens.map(([ok, txt]) => el('li', ok ? 'is-ok' : 'is-no', el('span', { 'aria-hidden': 'true' }, ok ? '✓' : '✕'), txt)));
      };
      inp.addEventListener('input', confere); confere();
      const atributos = (D.tom_atributos || []).map((x) => x.nome).join(' · ');
      const tt = sec('tt-t', 'Escreva um título',
        el('p', 'box__text', 'Veja como fica na fonte da marca e confira se soa como ela antes de publicar.' + (atributos ? ' Tom da marca: ' + atributos + '.' : '')),
        inp, el('div', 'tt__stage', prev), lista);
      out.push(el('div', 'grid grid--half', cmb, tt));
    }
    return out;
  };

  // QR code da pesquisa: para o balcão, o recibo ou a embalagem (baixar a imagem ou imprimir um cartaz pronto)
  const libQR = () => (window.qrcode ? Promise.resolve(window.qrcode) : new Promise((ok, erro) => {
    const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';
    sc.onload = () => ok(window.qrcode); sc.onerror = erro; document.head.appendChild(sc);
  }));
  const svgQR = (qr, cor) => qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true }).replace(/fill="black"/g, 'fill="' + (cor || '#111') + '"');
  const abreQR = async (url, nomeMarca) => {
    let qr;
    try { const Q = await libQR(); qr = Q(0, 'M'); qr.addData(url); qr.make(); } catch (e) { anuncia('Não foi possível gerar o QR code agora.'); return; }
    const svg = svgQR(qr);
    const baixar = async () => {
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
      const c = document.createElement('canvas'); c.width = 1200; c.height = 1200; const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, 1200, 1200); x.drawImage(img, 0, 0, 1200, 1200);
      const a = document.createElement('a'); a.download = 'qr-pesquisa.png'; a.href = c.toDataURL('image/png'); a.click();
    };
    const cartaz = () => {
      const w = window.open('', '_blank'); if (!w) return;
      const nome = String(nomeMarca).replace(/[<>&]/g, '');
      w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Cartaz da pesquisa</title><style>'
        + '@page{size:A5;margin:0}body{margin:0;font-family:Inter,-apple-system,Helvetica,Arial,sans-serif;color:#111;background:#fff}'
        + '.c{box-sizing:border-box;width:148mm;height:210mm;padding:16mm 14mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6mm}'
        + '.e{font-size:11pt;color:#666;margin:0}.t{font-size:26pt;font-weight:600;letter-spacing:-.02em;line-height:1.1;margin:0}.d{font-size:12pt;color:#444;margin:0;max-width:100mm}'
        + '.q{width:78mm;height:78mm;padding:4mm;border:1px solid #ddd;border-radius:6mm}.q svg{width:100%;height:100%}.p{font-size:10pt;color:#666;margin:0}'
        + '</style></head><body><div class="c"><p class="e">' + nome + '</p><p class="t">Sua opinião<br>vale muito</p>'
        + '<p class="d">Aponte a câmera do celular para o código e responda uma pesquisa rápida. Leva 2 minutos e é anônima.</p>'
        + '<div class="q">' + svg + '</div><p class="p">Obrigado por ajudar a gente a melhorar.</p></div>'
        + '<scr' + 'ipt>setTimeout(function(){window.print()},300)</scr' + 'ipt></body></html>');
      w.document.close();
    };
    const dlg = el('dialog', { class: 'dialog qrdlg', 'aria-labelledby': 'qr-t' },
      el('div', 'qrdlg__f',
        el('h2', { class: 'qrdlg__t', id: 'qr-t' }, 'QR code da pesquisa'),
        el('p', 'qrdlg__d', 'Coloque no balcão, no recibo, na embalagem ou no fim da proposta. Quem apontar a câmera do celular cai direto na pesquisa.'),
        (() => { const q = el('div', { class: 'qrdlg__q', role: 'img', 'aria-label': 'QR code que abre a pesquisa' }); q.innerHTML = svg; return q; })(),
        el('div', 'qrdlg__btns',
          el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: cartaz }, 'Imprimir cartaz'),
          el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: baixar }, 'Baixar imagem (PNG)'),
          el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => dlg.close() }, 'Fechar'))));
    dlg.addEventListener('close', () => dlg.remove());
    document.body.append(dlg); dlg.showModal();
  };

  // Identidade Visual
  const imgAssinada = (caminho, alt) => {
    const img = el('img', { alt: alt || '', loading: 'lazy' });
    sb.storage.from('portal').createSignedUrl(caminho, 3600).then(({ data }) => { if (data) img.src = data.signedUrl; });
    return img;
  };
  const botoesFormato = (a) => (a.formatos || []).map((f) => (f.link
    ? el('a', { class: 'btn btn--ghost btn--sm', href: f.link, target: '_blank', rel: 'noopener' }, f.formato || 'Abrir')
    : baixar(f.caminho, f.formato || 'Baixar', 'btn btn--ghost btn--sm')));
  // no celular, telas longas viram blocos que abrem um de cada vez (o primeiro já vem aberto)
  const dobraNoCelular = (out) => {
    if (!window.matchMedia('(max-width: 700px)').matches) return out;
    const caixas = []; out.forEach((n) => { if (!n || !n.querySelectorAll) return; if (n.matches('section.box')) caixas.push(n); else caixas.push(...n.querySelectorAll('section.box')); });
    caixas.forEach((c, i) => {
      const t = c.querySelector(':scope > .box__title, :scope > .gh > .box__title, :scope > .box__head > .box__title');
      if (!t) return;
      const d = el('details', { class: 'dobra', open: i === 0 });
      const sum = el('summary', 'dobra__s', el('span', null, t.textContent));
      const cab = t.closest('.gh, .box__head'); (cab && cab.parentElement === c ? cab : t).remove();
      d.append(sum, el('div', 'dobra__c', ...c.childNodes));
      d.addEventListener('toggle', () => { if (d.open) document.querySelectorAll('details.dobra[open]').forEach((o) => { if (o !== d) o.open = false; }); });
      c.replaceChildren(d); c.classList.add('box--dobra');
    });
    return out;
  };
  const telaIdentidade = () => {
    const I = D.identidade;
    const out = [head(I ? [I.entregue_em ? 'Entregue em ' + U.mesAno(I.entregue_em) : null, I.versao ? 'versão ' + I.versao : null].filter(Boolean).join(' · ') : '', 'Identidade Visual',
      'A marca para usar, não só para ler: copie as cores certas, veja as fontes e teste logo, combinações e\u00a0títulos\u00a0antes\u00a0de\u00a0publicar.',
      I && I.zip ? baixar(I.zip, 'Baixar tudo (.zip)') : null)];
    if (!I && !D.arquivos_marca.length && !D.cores.length && !(D.elementos_marca || []).length) return out.concat(vazio());
    const nLogos = D.arquivos_marca.filter((a) => a.categoria === 'logo').length;
    const nDocs = D.arquivos_marca.length - nLogos;
    const aplicada = D.aplicacoes.filter((a) => a.status === 'aplicada').length;
    out.push(faixa([
      nLogos ? ['Logos', String(nLogos)] : null,
      D.cores.length ? ['Cores', String(D.cores.length)] : null,
      D.tipografias.length ? ['Fontes', String(D.tipografias.length)] : null,
      nDocs ? ['Modelos e manuais', String(nDocs)] : null,
      D.aplicacoes.length ? ['Marca aplicada', aplicada + ' de ' + D.aplicacoes.length, 'pontos de contato'] : null]));

    const logos = D.arquivos_marca.filter((a) => a.categoria === 'logo');
    if (logos.length) out.push(sec('logo-t', 'Logo', el('div', 'logos', logos.map((a, i) => el('figure', 'logo',
      el('div', 'logo__view' + (i === 1 ? ' logo__view--dark' : ''), a.previa ? imgAssinada(a.previa, a.nome) : el('span', 'logo__ph', a.nome)),
      el('figcaption', null, el('p', 'tone__name', a.nome), a.descricao ? el('p', 'box__note', a.descricao) : null,
        el('div', 'logo__btns', (a.formatos || []).length ? botoesFormato(a) : el('span', 'box__note', 'Arquivos em breve'))))))));

    if (D.cores.length) out.push(sec('cor-t', 'Cores', el('div', 'swatches', D.cores.map((c) => el('div', 'swatch',
      el('span', { class: 'swatch__chip', style: 'background:' + c.hex }),
      el('p', 'tone__name', c.nome),
      el('dl', 'swatch__codes',
        el('div', null, el('dt', null, 'HEX'), el('dd', null, copia(c.hex.toUpperCase()))),
        el('div', null, el('dt', null, 'RGB'), el('dd', null, copia(rgbDe(c.hex)))),
        c.cmyk ? el('div', null, el('dt', null, 'CMYK'), el('dd', null, copia(c.cmyk))) : null,
        c.pantone ? el('div', null, el('dt', null, 'Pantone'), el('dd', null, copia(c.pantone.replace(/^pantone\s*/i, '')))) : null))))));

    if (D.tipografias.length) {
      D.tipografias.forEach((t) => carregaFonte(t.nome));
      out.push(sec('tip-t', 'Tipografia', el('div', 'specimens', D.tipografias.map((t) => el('div', 'specimen',
        el('p', { class: 'specimen__aa', style: 'font-family:' + familia(t.nome) }, 'Aa'),
        el('div', 'specimen__info', el('p', 'type__name', t.nome), t.uso ? el('p', 'box__text', t.uso) : null,
          el('p', { class: 'specimen__abc', style: 'font-family:' + familia(t.nome) }, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789')))))));
    }
    // elementos que a marca tiver (degradê, textura, mascote, embalagem…): só os cadastrados
    const ELS = D.elementos_marca || [];
    if (ELS.length) {
      const TIPO_EL = { degrade: 'Degradê', textura: 'Textura', mascote: 'Mascote', personagem: 'Personagem', embalagem: 'Embalagem', simbolo: 'Símbolo',
        ilustracao: 'Ilustração', icones: 'Ícones', foto: 'Estilo de foto', forma: 'Forma do produto', fonte_propria: 'Fonte própria', som: 'Som', cheiro: 'Cheiro', outro: 'Elemento' };
      const vista = (x) => {
        const hs = x.tipo === 'degrade' && x.cores ? x.cores.split(/[\s,;]+/).filter((h) => /^#[0-9a-f]{6}$/i.test(h)) : [];
        if (hs.length > 1) return el('div', { class: 'elem__view', style: 'background:linear-gradient(120deg,' + hs.join(',') + ')' });
        if (x.imagem) return el('div', 'elem__view' + (x.tipo === 'textura' ? ' elem__view--cheia' : ''), imgAssinada(x.imagem, x.nome));
        return null;
      };
      out.push(sec('elem-t', 'Elementos da marca', el('div', 'elems', ELS.map((x) => {
        const hs = x.tipo === 'degrade' && x.cores ? x.cores.split(/[\s,;]+/).filter(Boolean) : [];
        return el('div', 'elem' + (vista(x) ? '' : ' elem--sem'),
          vista(x),
          el('div', 'elem__info',
            el('p', 'elem__tipo', TIPO_EL[x.tipo] || 'Elemento'),
            el('p', 'tone__name', x.nome),
            hs.length ? el('p', 'elem__cores', hs.map((h) => copia(h.toUpperCase()))) : null,
            x.descricao ? el('p', 'box__note', x.descricao) : null));
      }))));
    }

    out.push(...testeDaMarca());

    const docs = D.arquivos_marca.filter((a) => a.categoria !== 'logo');
    const fim = [];
    if (docs.length) fim.push(secN('doc-t', 'Modelos e manuais', docs.length, null,
      grupo(docs.map((a) => [quad('arquivo'), a.nome, a.descricao || null,
        el('div', 'logo__btns', (a.formatos || []).length ? botoesFormato(a) : el('span', 'box__note', 'Em breve'))]))));

    if ((D.ativos || []).length && !vencido) out.splice(out[1] && out[1].classList && out[1].classList.contains('faixa') ? 2 : 1, 0, ativosDistintivos());

    if (D.aplicacoes.length) {
      const AP = { aplicada: 'done', em_andamento: 'doing', prevista: 'todo' };
      const txt = (a) => (a.status === 'aplicada' ? 'Aplicada' + (a.data ? ' em ' + U.nomeMesCurto(U.ref(a.data)) : '')
        : a.status === 'em_andamento' ? 'Em andamento' + (a.data ? ' · ' + U.nomeMesCurto(U.ref(a.data)) : '')
          : 'Previsto' + (a.data ? ' para ' + U.nomeMesCurto(U.ref(a.data)) : ''));
      fim.push(sec('apl-t', 'Onde a nova marca já está', el('div', 'places', D.aplicacoes.map((a) => el('div', 'place',
        el('p', 'tone__name', a.ponto_contato), chip(AP[a.status] || 'todo', txt(a)))))));
    }
    if (fim.length) out.push(lado(fim));
    return dobraNoCelular(out);
  };

  // Estratégia
  const telaEstrategia = () => {
    const p = D.plano || {};
    const out = [head([p.estrategia_aprovada_em ? 'Aprovada em ' + U.mesAno(p.estrategia_aprovada_em) : null,
      p.proxima_revisao_estrategia ? 'próxima revisão em ' + U.mesAno(p.proxima_revisao_estrategia) : null].filter(Boolean).join(' · '),
    'Estratégia', 'O desafio da marca, como vamos vencê-lo e\u00a0as\u00a0escolhas\u00a0que\u00a0fizemos. Toda ação do plano sai daqui.',
    el('div', 'head-btns', el('a', { class: 'btn btn--light', href: '#marca-pdf' }, 'Baixar plano de marca (PDF)'),
      p.estrategia_pdf ? baixar(p.estrategia_pdf, 'Plano completo da consultoria') : null))];
    const posic = D.plataforma && D.plataforma.posicionamento;
    if (!D.objetivos.length && !D.escolhas.length && !p.como_vencer && !p.desafio && !D.condicoes.length && !posic) return out.concat(vazio());
    const conf = D.condicoes.filter((c) => c.status === 'se_confirma').length;
    out.push(faixa([
      D.objetivos.length ? ['Objetivos', String(D.objetivos.length)] : null,
      D.metricas.length ? ['Métricas acompanhadas', String(D.metricas.length)] : null,
      D.condicoes.length ? ['Condições que se confirmam', conf + ' de ' + D.condicoes.length] : null,
      p.proxima_revisao_estrategia ? ['Próxima revisão', U.mesAno(p.proxima_revisao_estrategia)] : null]));

    // o cerne: o desafio (diagnóstico) e a abordagem para vencê-lo; as ações ficam só na aba Ações
    if (p.desafio || p.como_vencer) {
      const passo = (n, rot, ...corpo) => el('div', 'cerne__p', el('div', 'cerne__h', quad(String(n), 'num'), el('p', 'cerne__rot', rot)), corpo);
      out.push(secN('cerne-t', 'O cerne da estratégia', null, 'Sem um desafio claro, estratégia vira lista de desejos. Por isso ela começa por ele.',
        el('div', 'cerne',
          passo(1, 'O desafio', p.desafio ? el('p', 'cerne__t', p.desafio) : el('p', 'cerne__vazio', 'O consultor ainda vai escrever.')),
          passo(2, 'Como vamos vencer', p.como_vencer ? el('p', 'cerne__t', p.como_vencer) : el('p', 'cerne__vazio', 'O consultor ainda vai escrever.')))));
    }
    if (posic) out.push(el('section', { class: 'focus focus--single', 'aria-labelledby': 'pos-t' },
      el('div', 'focus__text', el('p', { class: 'eyebrow', id: 'pos-t' }, 'Posicionamento'), el('p', 'focus__title focus__title--long', posic))));

    if (D.objetivos.length) {
      // cartão de objetivo (como os cartões de indicador do designer): nível com ícone, o objetivo e, no rodapé, como medimos
      const NIV_O = { negocio: ['Negócio', 'grafico', 'negocio'], marca: ['Marca', 'alvo', 'marca'], comunicacao: ['Comunicação', 'balao', 'marketing'] };
      const FREQ_O = { mensal: 'todo mês', semestral: 'a cada 6 meses', anual: 'todo ano' };
      const corpoDe = (o) => (o.nivel === 'comunicacao' && (o.notar || o.acreditar || o.sentir)
        ? el('dl', 'oc__com', [['Notar', o.notar], ['Acreditar', o.acreditar], ['Sentir', o.sentir]].filter(([, v]) => v)
          .map(([k, v]) => el('div', null, el('dt', null, k), el('dd', null, v))))
        : el('div', 'oc__corpo', o.destaque ? el('p', 'oc__num', o.destaque) : null, el('p', o.destaque ? 'oc__sub' : 'oc__t', o.titulo)));
      // um cartão por pilar: dois objetivos do mesmo pilar entram no mesmo cartão (antes viravam dois "Comunicação")
      const card = (os) => {
        const o = os[0];
        const [rot, ico, nivM] = NIV_O[o.nivel] || ['Objetivo', 'alvo', o.nivel];
        const mets = D.metricas.filter((m) => m.nivel === nivM).slice(0, 2);
        return el('article', 'oc',
          el('div', 'oc__head', quad(ico), el('p', 'oc__rot', rot)),
          os.length > 1 ? el('div', 'oc__varios', os.map(corpoDe)) : corpoDe(o),
          // sem métrica cadastrada, o rodapé não aparece (um "a definir" em cada cartão parecia coisa inacabada)
          mets.length ? el('div', 'oc__pe', el('span', 'oc__pe-rot', 'Medimos por'),
            mets.map((m) => el('span', 'oc__met', m.nome, el('span', 'oc__freq', ' · ' + (FREQ_O[m.frequencia] || m.frequencia))))) : null);
      };
      const grupos = []; porNivel(D.objetivos).forEach((o) => { const g = grupos.find((x) => x[0].nivel === o.nivel); if (g) g.push(o); else grupos.push([o]); });
      out.push(secN('obj-t', 'Objetivos', grupos.length, 'Toda ação do plano liga a um destes.', el('div', 'ocs', grupos.map(card))));
    }
    if (D.metricas.length) {
      const NIV = { negocio: 'Negócio', marketing: 'Marketing', marca: 'Marca' };
      const FREQ = { mensal: 'Todo mês', semestral: 'A cada 6 meses', anual: 'Todo ano' };
      out.push(sec('met-t', 'Como medimos cada objetivo',
        tabela(['Nível', 'Métrica', 'Medimos', 'Agora'], porNivel(D.metricas).map((m) => [el('span', 'nivel nivel--' + m.nivel, NIV[m.nivel] || m.nivel), m.nome, FREQ[m.frequencia] || m.frequencia,
          m.valor_atual || el('span', 'muted', m.proxima_medicao ? '1ª em ' + U.mesAno(m.proxima_medicao) : '—')]))));
    }

    const prio = D.escolhas.filter((x) => x.tipo === 'prioridade');
    const lado = D.escolhas.filter((x) => x.tipo === 'deixa_de_lado');
    if (prio.length || lado.length || D.descartadas.length || p.como_vencer) {
      // grupos de opções no padrão das referências: ícone em quadradinho, texto e divisórias finas, sem texto riscado
      const grupo = (idt, titulo, n, itens, tipo, extra) => el('section', { class: 'box est-grupo', 'aria-labelledby': idt },
        el('div', 'est-grupo__head', el('h2', { class: 'box__title', id: idt }, titulo), el('span', 'est-n', String(n))),
        el('ul', 'est-lista', itens.map((t) => el('li', 'est-item', el('span', { class: 'est-ico est-ico--' + tipo, 'aria-hidden': 'true' }, tipo === 'sim' ? '✓' : '–'), el('span', null, t)))),
        extra);
      out.push(el('div', 'est-dois',
        prio.length ? grupo('onde-t', 'Onde jogamos', prio.length, prio.map((x) => x.texto), 'sim') : null,
        lado.length || D.descartadas.length ? grupo('lado-t', 'O que deixamos de lado', lado.length + D.descartadas.length, lado.map((x) => x.texto), 'nao',
          D.descartadas.length ? [el('p', 'est-sub', 'Ações que decidimos não fazer'),
            el('ul', 'est-lista', D.descartadas.map((d) => el('li', 'est-item', el('span', { class: 'est-ico est-ico--nao', 'aria-hidden': 'true' }, '–'), el('span', null, d.texto)))),
            el('p', 'est-nota', el('span', { class: 'est-nota__i', 'aria-hidden': 'true' }, 'i'), 'Se surgir a vontade de fazer algo daqui, converse antes com o consultor.')] : null) : null));
    }

    if (D.condicoes.length) {
      const CON = { se_confirma: ['done', 'Se confirma'], em_observacao: ['doing', 'Em observação'], sem_dados: ['todo', 'Sem dados ainda'], nao_se_confirma: ['warn', 'Não se confirma'] };
      const quebradas = condicaoQuebrada();
      if (quebradas.length) out.splice(1, 0, alertaEstrategia(quebradas));
      // em linha do tempo, como nas referências: o ponto de status, a condição, o selo à direita e os detalhes embaixo
      const ponto = { done: 'ok', doing: 'warn', todo: 'nada', warn: 'mal' };
      out.push(el('section', { class: 'box est-cond', 'aria-labelledby': 'cond-t' },
        el('div', 'est-grupo__head', el('h2', { class: 'box__title', id: 'cond-t' }, 'O que acompanhamos'), el('span', 'est-n', String(D.condicoes.length))),
        el('p', 'box__text', 'Se uma destas condições deixar de ser verdade, revisamos\u00a0a\u00a0estratégia\u00a0com\u00a0você.'),
        el('ol', 'est-tl', D.condicoes.map((c) => {
          const [k, t] = CON[c.status] || CON.sem_dados;
          const quando = c.checar_em ? U.dia(c.checar_em) + (c.checar_em.slice(0, 4) !== hoje.slice(0, 4) ? ' ' + c.checar_em.slice(0, 4) : '') : null;
          return el('li', 'est-tl__item',
            el('span', { class: 'est-tl__ponto is-' + ponto[k], 'aria-hidden': 'true' }),
            el('div', 'est-tl__corpo',
              el('div', 'est-tl__linha', el('p', 'est-tl__t', c.texto), chip(k, t)),
              el('dl', 'est-tl__meta',
                c.como_verificar ? el('div', null, el('dt', null, 'Verificamos por'), el('dd', null, el('span', 'est-code', c.como_verificar))) : null,
                el('div', null, el('dt', null, 'Próxima checagem'), el('dd', null, quando || 'a combinar')))));
        }))));
    }
    return out;
  };

  // Diagnóstico
  const telaDiagnostico = () => {
    const G = D.diagnostico;
    const out = [head(G && G.data ? 'Diagnóstico de ' + U.mesAno(G.data) : '', 'Diagnóstico',
      'Como sua marca é vista hoje. Daqui a um ano refazemos este retrato para comparar o\u00a0antes\u00a0e\u00a0o\u00a0depois.',
      G && G.proximo ? el('p', 'box__note', 'Novo diagnóstico em ' + U.mesAno(G.proximo)) : null)];
    if (!G) return out.concat(vazio());

    const POS = { entrega: ['done', 'Entrega', 'ok', 'ok'], entrega_mal: ['doing', 'Entrega mal', 'meio', 'warn'], nao_entrega: ['warn', 'Não entrega', 'alerta', 'bad'] };
    const mot = D.fatores.filter((f) => f.tipo === 'motivador');
    const dis = D.fatores.filter((f) => f.tipo === 'discriminador');
    const entregues = (fs) => fs.filter((f) => f.posicao === 'entrega').length;
    const cli = D.impressoes.find((x) => x.eh_cliente);
    const conc = D.impressoes.filter((x) => !x.eh_cliente);
    out.push(faixa([
      conc.length ? ['Concorrentes comparados', String(conc.length)] : null,
      mot.length ? ['O que todo cliente exige', entregues(mot) + ' de ' + mot.length, 'a marca entrega'] : null,
      dis.length ? ['O que faz escolher', entregues(dis) + ' de ' + dis.length, 'a marca entrega'] : null,
      D.causas.length ? ['Causas que o plano ataca', String(D.causas.length)] : null]));

    // em grade, não em lista: à esquerda a frase e as causas; à direita o que pesa na escolha; embaixo as marcas lado a lado
    const fatores = (idt, titulo, fs) => secN(idt, titulo, entregues(fs) + '/' + fs.length, null,
      grupo(fs.map((f) => { const P = POS[f.posicao] || POS.nao_entrega; return [quad(P[2], P[3]), f.texto, null, chip(P[0], P[1])]; })));
    const esq = [
      G.resumo ? el('section', { class: 'focus focus--single', 'aria-labelledby': 'res-t' },
        el('div', 'focus__text', el('p', { class: 'eyebrow', id: 'res-t' }, 'O diagnóstico em uma frase'), el('p', 'focus__title focus__title--long', G.resumo))) : null,
      D.causas.length ? secN('cau-t', 'As causas que o plano ataca', D.causas.length, 'Cada ação do plano ataca pelo menos uma delas.',
        grupo(D.causas.map((c, i) => [quad(String(i + 1), 'num'), c.texto]))) : null].filter(Boolean);
    const dir = [mot.length ? fatores('mot-t', 'O que todo cliente exige', mot) : null,
      dis.length ? fatores('dis-t', 'O que faz escolher uma marca', dis) : null].filter(Boolean);
    if (esq.length || dir.length) out.push(el('div', 'diag-topo',
      esq.length ? el('div', 'diag-col', esq) : null, dir.length ? el('div', 'diag-col', dir) : null));

    // o que a marca mostra hoje: a leitura do consultor em cada ponto de contato (o meio entre o que o dono diz e o que as pessoas percebem)
    const pcs = D.pontos_contato || [];
    if (pcs.length) {
      const STP = { coerente: ['done', 'Coerente', 'ok', 'ok'], irregular: ['doing', 'Irregular', 'meio', 'warn'], fora: ['warn', 'Fora da marca', 'alerta', 'bad'] };
      out.push(secN('pc-t', 'O que a marca mostra hoje', pcs.filter((x) => x.status === 'coerente').length + '/' + pcs.length,
        ['A leitura do consultor em cada ponto de contato:', el('br'), 'o que a marca comunica de verdade.'],
        grupo(pcs.map((x) => { const P = STP[x.status] || STP.irregular; return [quad(P[2], P[3]), x.canal, x.nota || null, chip(P[0], P[1])]; }))));
    }

    // cada marca num cartão, com as mesmas três perguntas uma embaixo da outra: dá para comparar lendo na horizontal
    const PERG = (i) => [['Notam', i.notam], ['Acreditam', i.acreditam], ['Sentem', i.sentem]];
    const cartao = (i, sua) => {
      const a = el('span', 'mc__logo'); U.avatar(a, i.marca_nome || '?', sua && D.empresa && D.empresa.logo_url);
      return el('article', 'mc' + (sua ? ' mc--sua' : ''),
        el('div', 'mc__topo', a, el('p', 'mc__nome', i.marca_nome || 'Marca'), sua ? el('span', 'mc__selo', 'Sua marca') : null),
        el('dl', 'mc__dl', PERG(i).map(([k, v]) => el('div', null, el('dt', null, k), el('dd', v ? null : 'is-vazio', v || 'Sem resposta')))));
    };
    if (cli || conc.length) {
      const marcas = (cli ? [cartao(cli, true)] : []).concat(conc.map((c) => cartao(c, false)));
      out.push(secN('imp-t', cli ? 'Como cada marca é vista' : 'Concorrentes', marcas.length,
        cli ? 'Sua marca e os concorrentes, com as mesmas perguntas.' : 'As mesmas perguntas, para comparar.',
        el('div', { class: 'mcs', style: '--n:' + Math.min(marcas.length, 4) }, marcas)));
    }
    return out;
  };

  // ===== Falar com o consultor: a conversa fica no portal e chega ao painel da GANG =====
  const naoLidas = () => D.mensagens.filter((m) => m.de === 'consultor' && !m.lida).length;
  // marca as do consultor como lidas no banco (o rpc do Supabase só é enviado quando o resultado é esperado: por isso o await)
  const lerMensagens = async () => { if (!naoLidas()) return; D.mensagens.forEach((m) => { if (m.de === 'consultor') m.lida = true; }); marcaNaoLidas(); await sb.rpc('portal_ler_mensagens'); };
  const marcaNaoLidas = () => { const n = naoLidas(); $('c-unread').hidden = !n; $('c-unread').textContent = n; };
  const conv = el('dialog', { class: 'dialog dialog--chat', 'aria-labelledby': 'chat-t' });
  const fio = el('div', { class: 'chat', role: 'log', 'aria-live': 'polite' });
  const chatForm = el('form', { class: 'chat__form', novalidate: true },
    el('label', { class: 'sr-only', for: 'chat-txt' }, 'Sua mensagem'),
    el('textarea', { class: 'field', id: 'chat-txt', rows: 3, maxlength: 4000, placeholder: 'Escreva sua mensagem para o consultor' }),
    el('div', 'dialog__foot',
      el('p', { class: 'msg', id: 'chat-msg', role: 'status' }),
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => conv.close() }, 'Fechar'),
      el('button', { class: 'btn btn--light btn--sm', type: 'submit' }, 'Enviar')));
  conv.append(el('div', 'dialog__body',
    el('div', 'chat__head', D.consultor ? avatar(D.consultor) : null,
      el('div', null, el('h2', { class: 'title-sm', id: 'chat-t' }, 'Mensagem ao consultor'),
        el('p', 'small', (D.consultor && D.consultor.nome ? D.consultor.nome.split(' ')[0] + ' responde' : 'O consultor responde') + ' ' + diasResposta() + '. Dúvidas sobre uma ação rendem mais no encontro: abra a ação e use “Levar para o encontro”.'))),
    fio, chatForm));
  document.body.append(conv);
  const desenhaFio = () => {
    fio.replaceChildren(...(D.mensagens.length ? D.mensagens.map((m) => el('div', 'chat__msg chat__msg--' + m.de,
      el('p', 'chat__text', m.texto),
      el('p', 'chat__meta', (m.de === 'consultor' ? (D.consultor && D.consultor.nome ? D.consultor.nome.split(' ')[0] : 'Consultor') : 'Você') + ' · ' + U.dia(m.criada_em) + ' · ' + U.hora(m.criada_em),
        m.de === 'cliente' && m.id && !m.lida && m.autor_id === me.id ? [' · ', el('button', { class: 'chat__cancel', type: 'button', onclick: () => cancelaMsg(m) }, 'Cancelar')] : null,
        m.de === 'cliente' && m.lida ? ' · lida' : null)))
      : [el('p', 'chat__empty', 'Nenhuma mensagem ainda. Escreva abaixo: dúvidas, pedidos, novidades.')]));
    fio.scrollTop = fio.scrollHeight;
  };
  // cancelar uma mensagem que o consultor ainda não leu
  const recarregaMsgs = async () => { D.mensagens = (await sb.from('mensagens').select('*').order('criada_em')).data || D.mensagens; };
  const cancelaMsg = async (m) => {
    if (!(await U.confirma('Cancelar esta mensagem? O consultor não vai recebê-la.', { ok: 'Cancelar mensagem', perigo: true }))) return;
    const { error } = await sb.rpc('portal_cancelar_mensagem', { p_mensagem: m.id });
    if (error) { U.say($('chat-msg'), error.message || 'Não foi possível cancelar.', 'error'); await recarregaMsgs(); return desenhaFio(); }
    D.mensagens = D.mensagens.filter((x) => x !== m); desenhaFio(); U.say($('chat-msg'), 'Mensagem cancelada.', 'ok');
  };
  function abrirConversa() {
    desenhaFio(); U.say($('chat-msg'), ''); conv.showModal(); $('chat-txt').focus();
    lerMensagens();
  }
  chatForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = $('chat-txt').value.trim();
    if (!t) return U.say($('chat-msg'), 'Escreva a mensagem.', 'error');
    const btn = chatForm.querySelector('[type=submit]'); btn.disabled = true;
    const { error } = await sb.rpc('portal_enviar_mensagem', { p_texto: t });
    btn.disabled = false;
    if (error) return U.say($('chat-msg'), 'Não foi possível enviar. Tente de novo.', 'error');
    await lerMensagens(); // quem respondeu já viu a mensagem do consultor
    await recarregaMsgs();
    $('chat-txt').value = ''; U.say($('chat-msg'), 'Enviada. A resposta chega ' + diasResposta() + '. Enquanto o consultor não ler, você pode cancelar.', 'ok'); desenhaFio();
  });
  $('chat-txt').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) chatForm.requestSubmit(); });
  marcaNaoLidas();

  // Início do plano "Só acesso": a marca à mão + o convite para a consultoria
  // mensagem nova do consultor: aparece em destaque no topo, não só no botão da conversa
  const bannerMensagem = () => {
    const novas = D.mensagens.filter((m) => m.de === 'consultor' && !m.lida);
    if (!novas.length) return null;
    const m = novas[novas.length - 1];
    const lida = () => { lerMensagens(); render(); };
    return el('section', { class: 'cmsg', 'aria-labelledby': 'cmsg-t' },
      D.consultor ? avatar(D.consultor) : null,
      el('div', 'cmsg__txt',
        el('p', { class: 'eyebrow', id: 'cmsg-t' }, 'Mensagem ' + (D.consultor && D.consultor.nome ? 'de ' + D.consultor.nome.split(' ')[0] : 'do consultor') + ' · ' + U.dia(m.criada_em) + (novas.length > 1 ? ' · ' + novas.length + ' novas' : '')),
        el('p', 'cmsg__q', m.texto),
        el('div', 'cmsg__btns',
          el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: () => { abrirConversa(); render(); } }, 'Responder'),
          el('button', { class: 'link', type: 'button', onclick: lida }, 'Marcar como lida'))));
  };

  // CPF ou CNPJ de quem paga: a pontuação entra sozinha enquanto digita; passou de 11 números, vira CNPJ
  const formataDoc = (v) => {
    const d = String(v).replace(/\D/g, '').slice(0, 14);
    if (d.length <= 11) return d.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
    return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };
  const campoDoc = (attrs) => {
    const i = el('input', { class: 'field', inputmode: 'numeric', autocomplete: 'off', maxlength: 18, placeholder: 'CPF ou CNPJ de quem paga', 'aria-label': 'CPF ou CNPJ de quem paga', ...attrs });
    i.addEventListener('input', () => { i.value = formataDoc(i.value); });
    return i;
  };
  // escolher um plano: manda o pedido como mensagem para o consultor (o pagamento é combinado com a GANG)
  const CICLOS = [['mensal', 'Mensal', 'Renova todo mês'], ['semestral', 'Semestral', '6 meses de acesso'], ['anual', 'Anual', '12 meses de acesso']];
  // escolher o plano e pagar no Asaas: cartão vira assinatura (renova sozinho); Pix paga o ciclo inteiro de uma vez.
  // A página de pagamento é do Asaas; quando o pagamento entra, o acesso é liberado sozinho. Sem a configuração, o pedido vai à GANG.
  // O Asaas pede o CPF ou CNPJ de quem paga: o campo aparece só na primeira vez
  const escolherPlano = () => {
    // plano pago: o próximo pagamento só abre 5 dias antes do fim do período (uma cobrança por período, mesma regra do servidor)
    const Pp = D.plano;
    if (Pp && Pp.acesso_ciclo && Pp.acesso_ate) {
      const ate = U.addDias(String(Pp.acesso_ate).slice(0, 10), 1);
      if (U.diasAte(ate) > 5) return el('p', 'box__text', 'Seu plano está pago até ' + U.diaAno(Pp.acesso_ate) + '.', el('br'), 'O próximo pagamento abre aqui em ' + U.diaAno(U.addDias(ate, -5)) + '.');
    }
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const box = el('div', 'planos-ac');
    const pedeGang = async (nome, btn) => {
      btn.disabled = true;
      const { error } = await sb.rpc('portal_enviar_mensagem', { p_texto: 'Quero ativar o plano ' + nome.toLowerCase() + ' da plataforma.' });
      btn.disabled = false;
      U.say(msg, error ? 'Não foi possível enviar. Tente de novo.' : 'Pedido enviado. A GANG responde ' + diasResposta() + ' com a forma de pagamento.', error ? 'error' : 'ok');
    };
    const doc = campoDoc({ id: 'pag-doc' });
    const docBox = el('div', 'planos-ac__doc', doc, el('p', 'box__note', 'Pedido pelo Asaas, que processa o pagamento.', el('br'), 'Informado uma vez só.'));
    // já pagou antes pelo Asaas: o cadastro existe e o campo não aparece
    sb.from('empresas').select('*').maybeSingle().then(({ data }) => { docBox.hidden = !!(data && data.asaas_cliente); });
    const paga = async (ciclo, metodo, btn) => {
      const d = doc.value.replace(/\D/g, '');
      if (!docBox.hidden && d.length !== 11 && d.length !== 14) { U.say(msg, 'Informe o CPF ou o CNPJ de quem paga.', 'error'); doc.focus(); return; }
      btn.disabled = true; U.say(msg, 'Abrindo a página de pagamento…');
      try {
        const { data: { session } } = await sb.auth.getSession();
        const r = await fetch('/api/pagamento', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (session ? session.access_token : '') },
          body: JSON.stringify({ acao: 'criar', ciclo, metodo, documento: d }) });
        const out = await r.json().catch(() => ({}));
        if (out.pedeDocumento) { docBox.hidden = false; doc.focus(); }
        if (!r.ok || !out.url) throw new Error(out.error || 'Não foi possível abrir o pagamento.');
        location.href = out.url;
      } catch (err) { btn.disabled = false; U.say(msg, err.message, 'error'); }
    };
    Promise.all([sb.from('config_pagamento').select('*').maybeSingle(),
      sb.from('cobrancas').select('status, criada_em').eq('status', 'aberta').gte('criada_em', new Date(Date.now() - 2 * 3600 * 1000).toISOString())])
      .then(([{ data: cfg }, { data: abertas }]) => {
        const precos = (cfg && cfg.precos) || {};
        const mensal = Number(precos.mensal) || 0;
        const cards = CICLOS.map(([k, nome, sub]) => {
          const v = Number(precos[k]) || 0; const meses = k === 'mensal' ? 1 : k === 'semestral' ? 6 : 12;
          const eco = mensal && meses > 1 ? mensal * meses - v : 0;
          const botoes = !cfg || !v ? [(() => { const b = el('button', { class: 'btn btn--light btn--sm', type: 'button' }, 'Quero este'); b.addEventListener('click', () => pedeGang(nome, b)); return b; })()]
            : [cfg.cartao ? (() => { const b = el('button', { class: 'btn btn--light btn--sm', type: 'button' }, 'Assinar no cartão'); b.addEventListener('click', () => paga(k, 'cartao', b)); return b; })() : null,
               cfg.pix ? (() => { const b = el('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, 'Pagar com Pix'); b.addEventListener('click', () => paga(k, 'pix', b)); return b; })() : null].filter(Boolean);
          return el('div', 'planos-ac__c', el('p', 'planos-ac__t', nome),
            v ? el('p', 'planos-ac__p', U.reais(v / 100)) : null,
            el('p', 'planos-ac__s', v && meses > 1 ? U.reais(v / 100 / meses) + ' por mês' + (eco > 0 ? ' · economia de ' + U.reais(eco / 100) : '') : sub),
            el('div', 'planos-ac__b', ...botoes));
        });
        box.replaceChildren(...[cfg && Object.values(precos).some(Boolean) ? docBox : null, el('div', 'planos-ac__l', ...cards),
          (abertas || []).length ? el('p', 'box__note', 'Já pagou? Assim que o Asaas confirmar, o acesso é liberado sozinho. Recarregue a página em instantes.') : null,
          cfg && Object.values(precos).some(Boolean) ? el('p', 'box__note', 'No cartão, a assinatura renova sozinha a cada ciclo. No Pix, você paga o ciclo inteiro de uma vez.') : null, msg].filter(Boolean));
      });
    return box;
  };
  // ===== Assinatura (Só acesso) ou Contrato (consultoria): o plano, até quando vale, como paga, os pagamentos e os comprovantes =====
  const reaisC = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n) || 0);
  const CICLO_NOME = { mensal: 'Mensal', semestral: 'Semestral', anual: 'Anual' };
  const METODO_NOME = { cartao: 'Cartão', pix: 'Pix' };
  const quadro = (n, l, cls) => el('div', 'pag-res__t' + (cls ? ' ' + cls : ''), el('p', 'pag-res__n', n), el('p', 'pag-res__l', l));
  // a pendência: etiqueta e o botão de pagar, na própria linha da cobrança (que ganha um contorno para mostrar que vão juntos)
  const acoesPendente = (c) => el('div', 'row__actions', chip('todo', 'Pendente'),
    c.link_url ? el('a', { class: 'btn btn--ghost btn--sm', href: c.link_url, target: '_blank', rel: 'noopener' }, 'Pagar') : null);
  const historicoPagamentos = (lista, abertas, topo) => {
    const linhas = [];
    (abertas || []).slice(0, 1).forEach((c) => linhas.push(el('li', 'row row--pendente',
      el('div', 'row__main', el('p', 'row__eyebrow', U.diaAno(String(c.criada_em).slice(0, 10)) + ' · ' + METODO_NOME[c.metodo]),
        el('p', 'row__title', (soAcesso ? 'Plano ' + CICLO_NOME[c.ciclo].toLowerCase() : 'Mensalidade') + ' · ' + reaisC(c.valor / 100)),
        el('p', 'row__text', 'Aguardando o pagamento.')),
      topo ? null : acoesPendente(c))));
    lista.forEach((p) => linhas.push(el('li', 'row',
      el('div', 'row__main', el('p', 'row__eyebrow', U.diaAno(p.pago_em) + (p.metodo ? ' · ' + METODO_NOME[p.metodo] : p.ref_pagarme ? '' : ' · Registrado pela GANG')),
        el('p', 'row__title', (soAcesso ? 'Plano ' + (CICLO_NOME[p.ciclo] || p.ciclo).toLowerCase() : 'Mensalidade') + (p.valor != null ? ' · ' + reaisC(p.valor) : '')),
        el('p', 'row__text', soAcesso ? 'Acesso liberado até ' + U.diaAno(p.liberado_ate) + '.' : 'Referente ao mês até ' + U.diaAno(p.liberado_ate) + '.')),
      el('div', 'row__actions', chip('done', 'Pago'),
        p.comprovante_url ? el('a', { class: 'btn btn--ghost btn--sm', href: p.comprovante_url, target: '_blank', rel: 'noopener' }, 'Comprovante') : null))));
    return linhas.length ? el('ul', 'rows', ...linhas) : el('p', 'box__text', 'Nenhum pagamento ainda.');
  };
  // pagar a mensalidade da consultoria: cartão (renova todo mês) ou Pix (esta mensalidade); o valor é o do Contrato
  const pagarMensalidade = (emp, valor) => {
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const doc = campoDoc({});
    const docBox = el('div', 'planos-ac__doc', doc, el('p', 'box__note', 'Pedido pelo Asaas, que processa o pagamento.', el('br'), 'Informado uma vez só.'));
    docBox.hidden = !!(emp && emp.asaas_cliente);
    const paga = async (metodo, btn) => {
      const d = doc.value.replace(/\D/g, '');
      if (!docBox.hidden && d.length !== 11 && d.length !== 14) { U.say(msg, 'Informe o CPF ou o CNPJ de quem paga.', 'error'); doc.focus(); return; }
      btn.disabled = true; U.say(msg, 'Abrindo a página de pagamento…');
      try {
        const { data: { session } } = await sb.auth.getSession();
        const r = await fetch('/api/pagamento', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (session ? session.access_token : '') },
          body: JSON.stringify({ acao: 'criar', ciclo: 'mensal', metodo, documento: d }) });
        const out = await r.json().catch(() => ({}));
        if (out.pedeDocumento) { docBox.hidden = false; doc.focus(); }
        if (!r.ok || !out.url) throw new Error(out.error || 'Não foi possível abrir o pagamento.');
        location.href = out.url;
      } catch (err) { btn.disabled = false; U.say(msg, err.message, 'error'); }
    };
    const box = el('div', 'planos-ac', el('p', 'box__text', 'Carregando…'));
    sb.from('config_pagamento').select('*').maybeSingle().then(({ data: cfg }) => {
      const bt = (t, cls, metodo) => { const b = el('button', { class: 'btn ' + cls + ' btn--sm', type: 'button' }, t); b.addEventListener('click', () => paga(metodo, b)); return b; };
      box.replaceChildren(...[
        el('div', 'ass-mens', el('p', 'planos-ac__p', reaisC(valor)), el('p', 'planos-ac__s', 'por mês · no cartão, renova sozinha')),
        docBox,
        el('div', 'planos-ac__b', ...[cfg && cfg.cartao ? bt('Assinar no cartão', 'btn--light', 'cartao') : null, cfg && cfg.pix ? bt('Pagar com Pix', 'btn--ghost', 'pix') : null].filter(Boolean)),
        cfg ? null : el('p', 'box__note', 'O pagamento pela plataforma ainda não está ligado.'), msg].filter(Boolean));
    });
    return box;
  };
  const telaAssinatura = () => {
    const P = D.plano;
    // a situação vem do banco: Só acesso pelo acesso_ate; consultoria pela próxima fatura do Contrato.
    // A renovação automática vem da assinatura do cartão guardada na empresa (a mesma que o painel mostra)
    const vence = soAcesso ? U.acessoVence(P) : P && P.proxima_fatura ? String(P.proxima_fatura).slice(0, 10) : null;
    const dias = soAcesso ? U.acessoDiasRestantes(P) : vence ? U.diasAte(vence) : null;
    const pago = !!(P && P.acesso_ciclo && P.acesso_ate);
    // uma cobrança por período: com o período pago, o próximo pagamento só abre 5 dias antes do vencimento (mesma regra do servidor)
    const pagoAte = soAcesso ? (pago ? U.addDias(String(P.acesso_ate).slice(0, 10), 1) : null) : vence;
    const abreEm = pagoAte && U.diasAte(pagoAte) > 5 ? U.addDias(pagoAte, -5) : null;
    const fechado = (t1) => el('p', 'box__text', t1, el('br'), 'O próximo pagamento abre aqui em ' + U.diaAno(abreEm) + '.');
    // a cor da situação: verde ativo, amarelo pausado ou pendente, vermelho vencido, cinza encerrado
    const sit = soAcesso ? (vencido ? ['Vencida', 'is-hot'] : pago ? ['Ativa', 'is-ok'] : ['Período grátis', dias != null && dias <= 10 ? 'is-warn' : 'is-ok'])
      : consBloq ? ['Pausado', 'is-hot'] : [selo ? selo[1] : '—', !selo ? '' : selo[1] === 'Ativo' ? 'is-ok' : selo[0].trim()];
    const prazo = dias == null ? '' : dias < 0 ? (soAcesso ? 'Venceu há ' : 'Em aberto há ') + -dias + (dias === -1 ? ' dia' : ' dias') : dias === 0 ? 'Vence hoje' : 'Faltam ' + dias + (dias === 1 ? ' dia' : ' dias');
    const pagamento = quadro('—', 'Forma de pagamento');
    const renova = el('div', null); const planos = el('div', null); const hist = el('div', null, el('p', 'box__text', 'Carregando…'));
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const carregar = () => Promise.all([
      sb.from('empresas').select('*').maybeSingle(),
      sb.from('pagamentos').select('*').order('pago_em', { ascending: false }),
      sb.from('cobrancas').select('*').eq('status', 'aberta').gte('criada_em', new Date(Date.now() - 3 * 864e5).toISOString()).order('criada_em', { ascending: false }),
    ]).then(([{ data: emp }, { data: pags }, { data: abertas }]) => {
      const lista = pags || [];
      const assinatura = emp && emp.asaas_assinatura;
      const ultimo = lista[0];
      pagamento.replaceChildren(el('p', 'pag-res__n', assinatura ? 'Cartão' : ultimo && ultimo.metodo ? METODO_NOME[ultimo.metodo] : '—'),
        el('p', 'pag-res__l', assinatura ? 'Renova sozinho' : ultimo && ultimo.metodo ? 'Sem renovação automática' : 'Forma de pagamento'));
      // a renovação automática: quando cobra de novo e o botão de cancelar (o que já foi pago continua valendo)
      if (assinatura) {
        const ciclo = soAcesso ? (CICLO_NOME[emp.assinatura_ciclo || (P && P.acesso_ciclo)] || '').toLowerCase() : null;
        const b = el('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, 'Cancelar renovação');
        const conf = el('div', { class: 'ass-acoes', hidden: true },
          el('span', 'box__note', 'Cancelar mesmo?'),
          (() => { const s = el('button', { class: 'btn btn--light btn--sm', type: 'button' }, 'Sim, cancelar'); s.addEventListener('click', async () => {
            s.disabled = true; U.say(msg, 'Cancelando…');
            try {
              const { data: { session } } = await sb.auth.getSession();
              const r = await fetch('/api/pagamento', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (session ? session.access_token : '') }, body: JSON.stringify({ acao: 'cancelar' }) });
              const out = await r.json().catch(() => ({}));
              if (!r.ok) throw new Error(out.error || 'Não foi possível cancelar. Tente de novo.');
              U.say(msg, soAcesso ? 'Renovação cancelada. Seu acesso continua até ' + U.diaAno(vence) + '.' : (abreEm ? 'Renovação cancelada. A próxima mensalidade pode ser paga aqui a partir de ' + U.diaAno(abreEm) + '.' : 'Renovação cancelada. A próxima mensalidade pode ser paga aqui.'), 'ok'); carregar().then(() => grade.classList.toggle('is-uma', !col.querySelector('section')));
            } catch (err) { s.disabled = false; U.say(msg, err.message, 'error'); }
          }); return s; })(),
          (() => { const n = el('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, 'Não'); n.addEventListener('click', () => { conf.hidden = true; b.hidden = false; }); return n; })());
        b.addEventListener('click', () => { b.hidden = true; conf.hidden = false; });
        renova.replaceChildren(el('section', { class: 'box', 'aria-labelledby': 'renova-t' },
          el('h2', { class: 'box__title', id: 'renova-t' }, 'Renovação automática'),
          soAcesso ? el('p', 'box__text', 'Seu plano ' + ciclo + ' renova sozinho no cartão em ' + (vence ? U.diaAno(vence) : '—') + '.', el('br'), 'Se cancelar, o acesso continua até essa data.')
            : atraso > 0 ? el('p', 'box__text', 'A cobrança deste mês não passou no cartão.', el('br'), 'Cancele a renovação e pague aqui,', el('br'), 'com Pix ou com outro cartão.')
            : el('p', 'box__text', 'A mensalidade de ' + reaisC(P && P.mensalidade), el('br'), 'é cobrada no cartão todo mês.', el('br'), 'Se cancelar, as próximas são pagas aqui.'),
          el('div', 'ass-acoes', b, conf), msg));
        planos.replaceChildren();
      } else {
        renova.replaceChildren(msg.textContent ? el('section', 'box', msg) : '');
        if (soAcesso) planos.replaceChildren(el('section', { class: 'box', 'aria-labelledby': 'planos-as-t' },
          el('h2', { class: 'box__title', id: 'planos-as-t' }, pago || vencido ? 'Renovar ou trocar de plano' : 'Escolha um plano'),
          abreEm ? null : pago && !vencido ? el('p', 'box__note', 'Pagando agora, o novo período começa quando o atual termina.') : null,
          escolherPlano()));
        else planos.replaceChildren(el('section', { class: 'box', 'aria-labelledby': 'planos-as-t' },
          el('h2', { class: 'box__title', id: 'planos-as-t' }, 'Pagar a mensalidade'),
          abreEm ? fechado('A mensalidade deste mês já está paga.')
            : P && Number(P.mensalidade) > 0 ? pagarMensalidade(emp, P.mensalidade)
            : el('p', 'box__text', 'A mensalidade ainda não foi definida.', el('br'), 'Fale com o seu consultor.')));
      }
      hist.replaceChildren(historicoPagamentos(lista, abertas || []));
    });
    const ini = P && P.inicio ? String(P.inicio).slice(0, 10) : null;
    const fim = ini ? (() => { const d = new Date(ini + 'T12:00:00'); d.setMonth(d.getMonth() + dur); d.setDate(d.getDate() - 1); return d.toLocaleDateString('sv-SE'); })() : null;
    const quadros = soAcesso ? [
      quadro(sit[0], pago && P.acesso_ciclo ? 'Plano ' + CICLO_NOME[P.acesso_ciclo].toLowerCase() : 'Situação', sit[1]),
      quadro(vence ? U.diaAno(vence) : '—', prazo || 'Válido até', dias != null && dias <= 10 ? (dias < 0 ? 'is-hot' : 'is-warn') : ''),
      pagamento]
      : [quadro(sit[0], P ? 'Consultoria · mês ' + mesN + ' de ' + dur : 'Consultoria', sit[1]),
        quadro(vence ? U.diaAno(vence) : '—', vence ? 'Próxima fatura · ' + prazo.toLowerCase() : 'Próxima fatura', dias != null && dias <= 5 ? (dias < 0 ? 'is-hot' : 'is-warn') : ''),
        pagamento];
    // lado a lado: à esquerda o que fazer (renovação ou pagar), à direita o histórico; no Só acesso, os planos ficam acima, na largura toda
    const historico = el('section', { class: 'box', 'aria-labelledby': 'hist-pag-t' },
      el('h2', { class: 'box__title', id: 'hist-pag-t' }, 'Pagamentos'), hist,
      soAcesso ? null : el('p', 'box__note', 'Contrato desde ' + (ini ? U.diaAno(ini) : '—') + ',', el('br'), 'com término previsto em ' + (fim ? U.diaAno(fim) : '—') + '.'),
      el('p', 'box__note', 'O comprovante abre no Asaas.', el('br'), 'Dúvidas sobre cobrança? Fale com a GANG.'));
    const col = el('div', 'ass-col', renova, soAcesso ? null : planos);
    const grade = el('div', 'ass-grade', col, historico);
    carregar().then(() => grade.classList.toggle('is-uma', !col.querySelector('section')));
    return [head('Conta', 'Meu plano', soAcesso ? ['Seu plano, até quando vale', el('br'), 'e os comprovantes de pagamento.'] : ['Sua consultoria, a mensalidade', el('br'), 'e os comprovantes de pagamento.']),
      el('section', { class: 'pag-res', 'aria-label': 'Resumo do plano' }, ...quadros),
      soAcesso ? planos : null, grade];
  };
  // acesso vencido: a tela inicial explica o que continua aberto e como voltar a ter tudo
  const telaAcessoVencido = () => {
    const v = U.acessoVence(D.plano);
    return [head('Acesso à sua marca', 'Seu acesso gratuito terminou',
      'Terminou em ' + U.diaAno(v) + '. A identidade visual e a narrativa continuam aqui para\u00a0você. Para voltar a usar o diagnóstico, a estratégia e as ferramentas da marca, escolha um\u00a0plano.'),
      el('section', { class: 'box', 'aria-labelledby': 'planos-ac-t' }, el('h2', { class: 'box__title', id: 'planos-ac-t' }, 'Escolha um plano'), escolherPlano()),
      el('section', { class: 'brand-tiles', 'aria-label': 'O que continua aberto' },
        el('a', { class: 'brand-tile', href: '#identidade' }, el('span', 'brand-tile__n', '1'), el('span', 'brand-tile__t', 'Identidade Visual'), el('span', 'brand-tile__d', 'Logos, cores, fontes e arquivos')),
        el('a', { class: 'brand-tile', href: '#plataforma' }, el('span', 'brand-tile__n', '2'), el('span', 'brand-tile__t', 'Narrativa'), el('span', 'brand-tile__d', 'Quem a marca é e como ela fala')))];
  };
  const telaInicioAcesso = () => {
    if (vencido) return telaAcessoVencido();
    const primeiro = (me.name || '').split(' ')[0];
    const P = D.plataforma;
    const out = [head('Acesso à sua marca', 'Olá' + (primeiro ? ', ' + primeiro : '') + '.',
      'Tudo sobre a sua marca em um lugar, sempre na versão certa. Consulte antes de criar qualquer peça e compartilhe com quem trabalha com você.')];
    // faltando 10 dias ou menos para o fim do acesso: avisa e já mostra os planos
    const dias = U.acessoDiasRestantes(D.plano);
    if (dias != null && dias <= 10) out.push(el('section', { class: 'box aviso-acesso', 'aria-labelledby': 'aviso-ac-t' },
      el('h2', { class: 'box__title', id: 'aviso-ac-t' }, dias <= 0 ? 'Seu acesso gratuito termina hoje' : 'Seu acesso gratuito termina em ' + dias + (dias === 1 ? ' dia' : ' dias')),
      el('p', 'box__text', 'Depois disso, a identidade visual e a narrativa continuam aqui. O diagnóstico, a estratégia e as ferramentas voltam com um\u00a0plano.'),
      escolherPlano()));
    const bm = bannerMensagem(); if (bm) out.push(bm);
    if (P && (P.posicionamento || P.mensagem_central)) {
      out.push(el('section', { class: 'focus', 'aria-labelledby': 'pos-i' },
        el('div', 'focus__text', el('p', { class: 'eyebrow', id: 'pos-i' }, P.mensagem_central ? 'Mensagem central' : 'Posicionamento'),
          el('h2', 'focus__title', P.mensagem_central || P.posicionamento),
          P.mensagem_central && P.posicionamento ? el('p', 'focus__body', P.posicionamento) : null)));
    }
    const tile = (n, href, t, d) => el('a', { class: 'brand-tile', href }, el('span', 'brand-tile__n', n), el('span', 'brand-tile__t', t), el('span', 'brand-tile__d', d));
    out.push(el('section', { class: 'brand-tiles', 'aria-label': 'Sua marca' },
      tile('01', '#diagnostico', 'Diagnóstico', 'O retrato de hoje: como as pessoas percebem a marca.'),
      tile('02', '#estrategia', 'Estratégia', 'Aonde a marca vai e os caminhos para chegar lá.'),
      tile('03', '#plataforma', 'Narrativa', 'O que dizer e o tom de voz certo para transmitir seu valor.'),
      tile('04', '#identidade', 'Identidade Visual', 'Os elementos que tornam a marca fácil de reconhecer.')));
    out.push(el('section', { class: 'upsell', 'aria-labelledby': 'up-t' },
      el('div', null, el('p', 'eyebrow', 'Consultoria mensal GANG'), el('h2', { class: 'upsell__t', id: 'up-t' }, 'Quer colocar a marca em prática com acompanhamento?'),
        el('p', 'box__text', 'Um consultor define as ações do mês com você, acompanha os resultados, mede como a marca é lembrada e revisa suas peças antes de publicar.')),
      D.consultor ? el('button', { class: 'btn btn--light', type: 'button', onclick: () => abrirConversa() }, 'Falar com a GANG') : null));
    return out;
  };

  // ===== Caminho: o objetivo no topo e, mês a mês, as ações que levam até ele, com o porquê e o peso de cada uma =====
  const PESO = { essencial: ['Essencial', 3], ajuda: ['Ajuda', 2], reforco: ['Reforço', 1] };
  let caminhoSel = null; // o checkpoint aberto (mês); começa no mês atual
  let trilhaX = null;
  let cpTrocou = false; // o cliente clicou num checkpoint: o painel logo abaixo da trilha mostra a troca     // a rolagem da trilha, mantida enquanto se navega pelos checkpoints
  const CADEADO = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const BANDEIRA = '<svg viewBox="0 0 28 32" width="28" height="32" aria-hidden="true"><rect x="3" y="2" width="2.4" height="29" rx="1.2" fill="currentColor"/>'
    + [0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => ((r + c) % 2 ? '' : '<rect x="' + (6 + c * 4) + '" y="' + (3 + r * 4) + '" width="4" height="4" fill="currentColor"/>')).join('')).join('')
    + '<rect x="6" y="3" width="20" height="16" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
  const telaCaminho = () => {
    const primeiro = (me.name || '').split(' ')[0];
    const objNeg = D.objetivos.find((o) => o.nivel === 'negocio');
    const objMarca = D.objetivos.find((o) => o.nivel === 'marca');
    const objMeta = objNeg || objMarca; // a meta é o objetivo que o consultor escreve; sem números, costuma ser o de marca
    const destino = objMeta ? ((objMeta.destaque ? objMeta.destaque + ' de ' : '') + (objMeta.titulo || '')) : 'O objetivo do plano';
    // a meta em duas partes: o número em destaque e a frase ao lado (sem quebrar a linha de qualquer jeito)
    let numero = objMeta && objMeta.destaque ? objMeta.destaque : null;
    let frase = numero ? (objMeta.titulo || '') : destino;
    if (!numero) { const m = destino.match(/^([+\-\u2212]?\d[\d.,]*\s?%?)\s+(?:de\s+)?(.+)$/); if (m) { numero = m[1].trim(); frase = m[2]; } }
    frase = frase.replace(/^de\s+/i, '');
    const mesAgora = inicioRef ? Math.min(Math.max(mesN || 1, 1), dur) : 0;
    const fraseMeta = numero ? frase : frase.charAt(0).toUpperCase() + frase.slice(1);
    // a tela abre no que fazer agora (as missões); a meta vira o título do caminho, logo abaixo.
    // "Mês X de Y" aparece uma vez só, na linha de cima do título
    const out = [head(inicioRef ? 'Mês ' + mesAgora + ' de ' + dur + ' · ' + U.cap(U.nomeMes(hoje)) + ' ' + hoje.slice(0, 4) : 'Plano de marca', 'Visão Geral',
      ['O que fazer este mês e o caminho até a meta.', el('br'), 'Cada mês concluído deixa a marca mais perto dela.'],
      inicioRef ? el('a', { class: 'btn btn--ghost', href: '#relatorio' }, 'Relatório do mês') : null)];
    const bm = bannerMensagem(); if (bm) out.push(bm);
    if (!inicioRef) return out.concat(vazio('A trilha aparece assim que o consultor cadastrar o plano.'));

    // as missões do mês (os números entram como uma missão, sem aviso à parte)
    out.push(missoes());
    // o que o consultor diz do mês e como foram os meses (antes ficavam em Resultados)
    const vd = veredito(); if (vd) out.push(vd);
    const cfH = blocoComoFoi(true); if (cfH) out.push(cfH);

    // os primeiros meses: o que acontece agora e quando os resultados começam a aparecer
    // some no 3º mês ou antes, assim que os passos estiverem cumpridos (o 1º, conhecer a marca, já vem cumprido)
    const fezPrimeira = D.acoes.some((a) => a.status === 'feita' && a.responsavel !== 'gang');
    const comecoFeito = fezPrimeira && D.respostas.length > 0;
    if (mesN <= 2 && !comecoFeito) {
      const passo = (ok, t, d, href, lk, ir) => el('li', ok ? 'is-on' : null, el('span', { class: 'start__ico', 'aria-hidden': 'true' }, ok ? '✓' : ''),
        el('div', 'start__body', el('p', 'start__t', t), el('p', 'start__d', d)), href ? el('a', { class: 'start__lk', href, onclick: ir || null }, lk) : null);
      out.push(el('section', { class: 'start', 'aria-labelledby': 'start-t' },
        el('div', 'step-sec__head', el('h2', { class: 'step-sec__t', id: 'start-t' }, 'Como funciona o começo'),
          el('p', 'step-sec__d', 'Mês ' + mesN + ' de ' + dur)),
        el('ol', 'start__list',
          passo(true, 'Conheça a sua marca', 'A estratégia, a narrativa e a identidade já estão no menu, em “Sua marca”. Consulte antes de criar qualquer peça.', '#estrategia', 'Ver a estratégia'),
          passo(fezPrimeira, 'Faça a primeira ação', 'Em Ações, a mais importante do mês aparece primeiro.', '#acoes', 'Ver ações'),
          (() => {
            // o convite só existe quando o consultor abre a pesquisa; até lá, o passo avisa e não leva a lugar nenhum
            const abertaP = D.pesquisas.some((x) => x.aberta);
            const vaiConvite = () => { alvoRes = 'convite'; return setTimeout(() => {
              const sh = document.querySelector('.share'); if (!sh) return;
              const det = sh.querySelector('.share__edit'); if (det) det.open = true;
              sh.scrollIntoView({ block: 'center', behavior: 'smooth' });
              const t = document.getElementById('convite'); if (t) t.focus({ preventScroll: true });
            }, 450); };
            return abertaP
              ? passo(D.respostas.length > 0, 'Convide clientes para a pesquisa de partida', 'É ela que mostra como a marca é vista hoje, para comparar depois. A mensagem já vem pronta.', '#pesquisa', 'Ver o convite', vaiConvite)
              : passo(false, 'Convide clientes para a pesquisa de partida', 'É ela que mostra como a marca é vista hoje. Assim que o consultor abrir a pesquisa, o convite pronto aparece aqui.');
          })())));
    }

    const meses = []; for (let k = 0, r = inicioRef; k < dur; k += 1, r = U.addRef(r, 1)) meses.push(r);
    const fim = meses[meses.length - 1];
    const doMes = (r) => D.acoes.filter((a) => a.mes_previsto === r);
    // o estado de cada checkpoint: conquistado quando todas as essenciais (ou todas, se não houver essenciais) foram feitas
    const estado = (r) => {
      const acs = doMes(r);
      const alvo = acs.filter((a) => a.peso === 'essencial').length ? acs.filter((a) => a.peso === 'essencial') : acs;
      const feitas = alvo.filter((a) => a.status === 'feita').length;
      const fase = r < hoje ? 'passado' : r === hoje ? 'agora' : 'futuro';
      let st = fase === 'futuro' ? 'futuro' : !alvo.length ? 'vazio' : feitas === alvo.length ? 'conquistado' : fase === 'agora' ? 'agora' : 'pendente';
      if (fase === 'agora' && st === 'conquistado') st = 'conquistado';
      return { r, acs, alvo, feitas, fase, st, essenciais: acs.some((a) => a.peso === 'essencial') };
    };
    const ests = meses.map(estado);
    // as estrelas do mês: o que o cliente faz para o mês ficar completo
    // só acende o que foi feito de verdade: sem tarefa, sem encontro ou sem ação para avaliar, a estrela fica apagada
    const agoraISO = new Date().toISOString();
    const estrelas = (e) => [
      ['Essenciais feitas', !e.alvo.length ? 'Nada previsto para o mês' : 'Fazer as ' + (e.essenciais ? 'essenciais' : 'ações') + ' do mês (' + e.feitas + ' de ' + e.alvo.length + ' feitas)', e.fase !== 'futuro' && e.alvo.length > 0 && e.feitas === e.alvo.length],
      e.r === inicioRef ? ['Contou como foi o mês', 'Começo do plano: nada a contar ainda', e.fase !== 'futuro'] : ['Contou como foi o mês', 'Dizer se ' + U.nomeMes(U.addRef(e.r, -1)) + ' foi melhor, igual ou pior', !!comoFoi(U.addRef(e.r, -1))],
      (() => { const enc = D.encontros.filter((x) => x.inicio.slice(0, 7) === e.r);
        return enc.length ? ['Presença no encontro', 'Participar do encontro do mês', enc.some((x) => x.status === 'realizado' || (x.status === 'agendado' && x.inicio < agoraISO))]
          : ['Presença no encontro', 'Sem encontro marcado neste mês', false]; })(),
      (() => { const fe = e.acs.filter((a) => a.status === 'feita' && a.responsavel !== 'gang');
        return ['Ações avaliadas', fe.length ? 'Responder a pergunta de cada ação feita' : 'Nenhuma ação feita para avaliar', e.fase !== 'futuro' && fe.length > 0 && fe.every((a) => a.resultado)]; })(),
      // a 5ª estrela ainda vai ser definida: por enquanto, o mês completo tem 4
    ];
    const TOT = 4; // quantas estrelas fecham o mês
    const nEstrelas = (e) => estrelas(e).filter((x) => x[2]).length;
    const cincoEstrelas = ests.filter((e) => e.fase !== 'futuro' && nEstrelas(e) === TOT).length;
    if (!caminhoSel || !meses.includes(caminhoSel)) caminhoSel = meses.includes(hoje) ? hoje : meses[0];

    // as ações do cliente pendentes no mês (o "o que fazer agora" fica na tela Ações)
    const pend = D.acoes.filter((a) => a.status !== 'feita' && a.responsavel !== 'gang' && a.mes_previsto && a.mes_previsto <= hoje);


    // a trilha: rolagem horizontal, um checkpoint por mês, marcos nas revisões e a bandeira na chegada
    const MARCOS = { 6: 'Revisão semestral', 12: 'Revisão anual', 18: 'Chegada' };
    const logo = el('span', { class: 'trail__me', 'aria-hidden': 'true' }); U.avatar(logo, D.empresa ? D.empresa.nome : '', D.empresa && D.empresa.logo_url);
    const pctAte = Math.round(((Math.max(0, meses.indexOf(hoje)) + (meses.includes(hoje) ? 0.5 : 0)) / dur) * 100);
    const trilha = el('ol', { class: 'trail', 'aria-label': 'Trilha do plano, mês a mês', style: '--feito:' + pctAte + ';--n:' + meses.length }, ests.map((e, i) => {
      const n = i + 1; const ultimo = i === meses.length - 1;
      const marco = MARCOS[n] || (ultimo ? 'Chegada' : null);
      const rotulo = U.cap(U.nomeMesCurto(e.r)) + (e.r.slice(5) === '01' || i === 0 ? ' ' + e.r.slice(2, 4) : '');
      // um só sistema: as estrelas do mês. 5 = mês completo; menos que isso mostra quantas
      const k = e.fase === 'futuro' ? null : nEstrelas(e);
      const cls = e.fase === 'futuro' ? 'futuro' : k === TOT ? 'conquistado' : e.fase === 'agora' ? 'agora' : k ? 'parcial' : 'pendente';
      const b = el('button', { class: 'trail__node is-' + cls + (ultimo ? ' is-fim' : '') + (e.r === caminhoSel ? ' is-sel' : ''), type: 'button', 'aria-pressed': String(e.r === caminhoSel),
        'aria-label': U.cap(U.nomeMes(e.r)) + ', mês ' + n + ': ' + (k == null ? 'por vir' : k + ' de ' + TOT + ' estrelas' + (e.fase === 'agora' ? ', em andamento' : '')),
        onclick: () => { if (!ultimo && e.r > U.addRef(hoje, 1)) return; caminhoSel = e.r; cpTrocou = true; render(); } });
      // meses mais à frente ficam trancados (as ações chegam no mês anterior), como em "Próximos meses"
      const trancado = !ultimo && e.r > U.addRef(hoje, 1);
      if (trancado) {
        b.classList.add('is-trancado'); b.innerHTML = CADEADO; b.dataset.dica = U.cap(U.nomeMes(e.r)) + ' · abre em ' + U.nomeMes(U.addRef(e.r, -1));
        // trancado não abre: o clique não faz nada (a dica ao passar o mouse continua)
        b.setAttribute('aria-disabled', 'true'); b.removeAttribute('aria-pressed');
        b.setAttribute('aria-label', U.cap(U.nomeMes(e.r)) + ', mês ' + n + ': trancado, abre em ' + U.nomeMes(U.addRef(e.r, -1)));
      } else if (ultimo) { b.innerHTML = BANDEIRA; b.dataset.dica = 'Chegada · ' + U.nomeMes(e.r) + ' de ' + e.r.slice(0, 4); }
      else if (k === TOT) b.textContent = '★';
      else if (k != null && e.fase === 'passado') b.replaceChildren(String(k), el('span', 'trail__star', '★'));
      else b.textContent = String(n);
      return el('li', 'trail__step' + (e.r === hoje ? ' is-hoje' : ''),
        marco && !ultimo ? el('span', { class: 'trail__marco', tabindex: '0', role: 'img', 'aria-label': marco, 'data-dica': marco }) : el('span', 'trail__marco is-vazio'),
        e.r === hoje ? logo : null, b,
        el('span', 'trail__mes', rotulo));
    }));
    const wrap = el('div', 'trail-wrap', trilha);
    // o nome do marco aparece num balão ao passar o mouse (ou focar) na bandeirinha, como o "Copiado" do site
    const dica = el('div', { class: 'trail-dica', 'aria-hidden': 'true' });
    let dicaTimer = null;
    const mostraDica = (alvo) => {
      const box = wrap.parentNode; if (!box) return;
      clearTimeout(dicaTimer);
      dica.textContent = alvo.dataset.dica;
      const r = alvo.getBoundingClientRect(); const bx = box.getBoundingClientRect();
      const meia = dica.offsetWidth / 2; // o balão não sai da caixa da trilha
      dica.style.left = Math.round(Math.max(meia + 8, Math.min(bx.width - meia - 8, r.left + r.width / 2 - bx.left))) + 'px';
      dica.style.top = Math.round(r.top - bx.top) + 'px';
      dica.classList.add('is-in');
    };
    const escondeDica = () => { dicaTimer = setTimeout(() => dica.classList.remove('is-in'), 80); };
    trilha.addEventListener('mouseover', (ev) => { const t = ev.target.closest('[data-dica]'); if (t) mostraDica(t); });
    trilha.addEventListener('mouseout', (ev) => { if (ev.target.closest('[data-dica]')) escondeDica(); });
    trilha.addEventListener('focusin', (ev) => { const t = ev.target.closest('[data-dica]'); if (t) mostraDica(t); });
    trilha.addEventListener('focusout', escondeDica);
    wrap.addEventListener('scroll', () => dica.classList.remove('is-in'), { passive: true });
    // abre já no mês atual
    // cabe tudo? então some a rolagem e as setas; se não cabe, as bordas esmaecem em vez de cortar
    const ajusta = () => {
      const box = wrap.parentNode; if (!box) return;
      const sobra = wrap.scrollWidth - wrap.clientWidth > 2;
      box.classList.toggle('is-rola', sobra);
      box.classList.toggle('no-ini', sobra && wrap.scrollLeft > 4);
      box.classList.toggle('no-fim', sobra && wrap.scrollLeft < wrap.scrollWidth - wrap.clientWidth - 4);
    };
    wrap.addEventListener('scroll', ajusta, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(ajusta).observe(wrap);
    requestAnimationFrame(() => {
      requestAnimationFrame(ajusta);
      if (trilhaX != null) { wrap.scrollLeft = trilhaX; return; } // ao clicar num checkpoint, a trilha fica onde estava
      const atual = trilha.querySelector('.is-hoje') || trilha.querySelector('.is-sel');
      if (atual) wrap.scrollLeft = Math.max(0, atual.offsetLeft - wrap.clientWidth / 2 + atual.offsetWidth / 2);
    });
    wrap.addEventListener('scroll', () => { trilhaX = wrap.scrollLeft; }, { passive: true });
    const nav = (d) => { wrap.scrollBy({ left: d * wrap.clientWidth * 0.7, behavior: 'smooth' }); };
    out.push(el('div', 'step-sec__head caminho-head',
      el('div', null, el('p', 'eyebrow', 'O caminho até a meta'),
        el('h2', { class: 'step-sec__t caminho-head__meta' }, numero ? el('span', 'caminho-head__n', numero) : null, numero ? ' ' + frase : fraseMeta)),
      cincoEstrelas ? el('p', 'step-sec__d', cincoEstrelas + (cincoEstrelas === 1 ? ' mês ' + TOT + ' ★' : ' meses ' + TOT + ' ★')) : null));
    out.push(el('section', { class: 'trail-box', 'aria-label': 'Trilha' },
      el('div', 'trail-nav',
        el('button', { class: 'trail-nav__btn', type: 'button', 'aria-label': 'Voltar na trilha', onclick: () => nav(-1) }, '‹'),
        el('button', { class: 'trail-nav__btn', type: 'button', 'aria-label': 'Avançar na trilha', onclick: () => nav(1) }, '›')),
      wrap, dica));

    // o checkpoint aberto
    const e = ests[meses.indexOf(caminhoSel)];
    const n = meses.indexOf(caminhoSel) + 1;
    const acs = [...e.acs].sort((a, b) => (PESO[b.peso] || PESO.ajuda)[1] - (PESO[a.peso] || PESO.ajuda)[1]);
    const ultimo = caminhoSel === fim;
    const st = estrelas(e); const k = st.filter((x) => x[2]).length; const futuro = e.fase === 'futuro';
    // estrelas que acenderam desde a última vez que o cliente viu este mês (na primeira visita, nada pisca)
    const chaveEst = 'gang-estrelas-' + ((D.empresa && D.empresa.id) || '') + '-' + caminhoSel;
    const acesas = st.filter((x) => x[2]).map((x) => x[0]);
    const vistas = guarda.get(chaveEst);
    const novas = new Set(Array.isArray(vistas) && !futuro ? acesas.filter((t) => !vistas.includes(t)) : []);
    if (!futuro) guarda.set(chaveEst, acesas);
    const cpEl = el('section', { class: 'cp' + (cpTrocou ? ' cp--entra' : '') + (k === TOT ? ' is-5' : ''), 'aria-labelledby': 'cp-t', 'aria-live': 'polite' },
      el('div', 'cp__head',
        el('div', null, el('p', 'eyebrow', (ultimo ? 'Chegada · ' : 'Mês ' + n + ' · ') + U.cap(U.nomeMes(caminhoSel)) + ' ' + caminhoSel.slice(0, 4)),
          el('h2', { class: 'cp__t', id: 'cp-t' }, futuro ? (caminhoSel > U.addRef(hoje, 1) && caminhoSel !== fim ? 'Trancado: abre em ' + U.nomeMes(U.addRef(caminhoSel, -1)) : 'Este mês ainda vai começar') : k === TOT ? 'Mês ' + TOT + ' estrelas' : k + ' de ' + TOT + ' estrelas' + (e.fase === 'agora' ? ' até agora' : ''))),
        futuro ? chip('todo', 'Por vir') : e.fase === 'agora' ? chip('doing', 'Em andamento') : chip(k === TOT ? 'done' : 'todo', 'Encerrado')),
      futuro ? null : el('p', { class: 'stars__row', role: 'img', 'aria-label': k + ' de ' + TOT + ' estrelas' }, st.map((x) => el('span', x[2] ? 'is-on' + (novas.has(x[0]) ? ' is-nova' : '') : null, x[2] ? '★' : '☆'))),
      el('ul', 'stars__chips' + (futuro ? ' is-futuro' : ''), st.map(([t, d, ok]) => {
        const ir = irParaEstrela(t, e);
        return el('li', { class: ok ? 'is-on' + (novas.has(t) ? ' is-nova' : '') : null }, el('a', { href: ir.href, onclick: ir.onclick, title: ok ? 'Feito · ' + ir.dica : d + ' · ' + ir.dica },
          el('span', { class: 'stars__ico', 'aria-hidden': 'true' }, ok ? '★' : '☆'), t));
      })));
    out.push(cpEl);
    // a setinha do painel aponta para a bolinha escolhida; ao trocar de mês, o painel aparece na tela
    const aponta = () => {
      const sel = trilha.querySelector('.trail__node.is-sel'); if (!sel || !cpEl.isConnected) return;
      const x = sel.getBoundingClientRect().left + sel.offsetWidth / 2 - cpEl.getBoundingClientRect().left;
      cpEl.style.setProperty('--seta', Math.max(24, Math.min(cpEl.offsetWidth - 24, x)) + 'px');
      cpEl.classList.toggle('sem-seta', x < 8 || x > cpEl.offsetWidth - 8);
    };
    wrap.addEventListener('scroll', aponta, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(aponta).observe(cpEl);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      aponta();
      if (cpTrocou) {
        cpTrocou = false;
        const r = cpEl.getBoundingClientRect();
        if (r.top > window.innerHeight - 140) cpEl.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
      }
    }));


    return out;
  };

  // relatório: como o cliente disse que foram os últimos meses (sem números)
  // ===== documentos em slides: plano de marca e relatório do mês =====
  // cada página é um slide A4 deitado, de tamanho fixo (nada quebra no meio); lista grande continua no slide seguinte
  const txt = (v) => (v == null ? '' : String(v)).trim();
  // divide uma lista em slides por igual (8 itens com limite de 7 viram 4 + 4): nunca sobra um item sozinho num slide
  const partes = (arr, n) => {
    const k = Math.ceil(arr.length / n); if (k <= 1) return arr.length ? [arr] : [];
    const out = []; let i = 0;
    for (let j = 0; j < k; j += 1) { const tam = Math.floor(arr.length / k) + (j < arr.length % k ? 1 : 0); out.push(arr.slice(i, i + tam)); i += tam; }
    return out;
  };
  // com título no slide, o rótulo pequeno mostra só a parte do documento ("/ narrativa"), sem repetir o título
  const slide = (rot, ...corpo) => {
    const kids = corpo.flat().filter(Boolean);
    const temTitulo = kids.some((k) => k.classList && k.classList.contains('sl__h'));
    const r = rot && temTitulo && rot.includes(' · ') ? rot.split(' · ')[0] + (/ · continuação$/.test(rot) ? ' · continuação' : '') : rot;
    return el('section', 'sl', el('div', 'sl__in', r ? el('p', 'sl__rot', '/ ' + r) : null, el('div', 'sl__corpo', kids)));
  };
  // o título do slide sai do rótulo ("diagnóstico · como cada marca é vista" → "Como cada marca é vista")
  const tituloDe = (rot) => { const t = String(rot).replace(/ · continuação$/, '').split(' · ').pop(); return t.charAt(0).toUpperCase() + t.slice(1); };
  const cab = (rot) => el('h2', 'sl__h', tituloDe(rot));
  const sFrase = (rot, frase, extra, tam) => (txt(frase) ? slide(rot, el('div', 'sl__fim', el('p', 'sl__t' + (tam ? ' sl__t--' + tam : ''), txt(frase)), extra || null)) : null);
  const sCols = (rot, itens, n) => (itens.length ? partes(itens, n || 4).map((g, i) => slide(rot + (i ? ' · continuação' : ''), cab(rot),
    el('div', { class: 'sl__cols', style: '--n:' + Math.max(g.length, 2) }, g.map(([l, t, s]) => el('div', 'sl__col', l ? el('p', 'sl__l', l) : null, t ? el('p', 'sl__n', t) : null, s ? (typeof s === 'string' ? el('p', 'sl__s', s) : s) : null))))) : []);
  const sGrade = (rot, itens, n) => (itens.length ? partes(itens, n || 4).map((g, i) => slide(rot + (i ? ' · continuação' : ''), cab(rot),
    el('div', { class: 'sl__grade', style: '--n:' + (g.length > 2 ? 2 : g.length) }, g.map(([t, s], k) => el('div', 'sl__gi', el('p', 'sl__l', '/' + (itens.indexOf(g[k]) + 1)), el('p', 'sl__n', t), s ? el('p', 'sl__s', s) : null))))) : []);
  const sLinhas = (rot, itens, n, intro) => (itens.length ? partes(itens, n || 6).map((g, i) => slide(rot + (i ? ' · continuação' : ''), cab(rot), !i && intro ? el('p', 'sl__s sl__dica', intro) : null,
    el('div', 'sl__linhas', g.map(([a, b, c, tom]) => el('div', 'sl__li' + (b == null ? ' sl__li--2' : ''), el('p', 'sl__s', el('span', { style: 'color:#3b3835' }, a)), b != null ? el('p', 'sl__s', b) : null, c ? el('span', 'sl__tag' + (tom ? ' is-' + tom : ''), c) : el('span')))))) : []);
  const sNums = (rot, itens, frase) => (itens.length ? slide(rot, frase ? el('p', 'sl__t sl__t--m', frase) : cab(rot),
    el('div', { class: 'sl__nums', style: '--n:' + itens.length }, itens.map(([v, s, m]) => el('div', null, el('p', 'sl__big' + (String(v).length > 7 ? ' sl__big--m' : ''), v), el('p', 'sl__s', s), m ? el('p', 'sl__l', m) : null)))) : null);
  const capa = (titulo, sub, direita) => {
    const nome = D.empresa ? D.empresa.nome : 'Sua marca';
    const cores = (D.cores || []).map((c) => c.hex).filter(Boolean).slice(0, 4);
    // capa: o logo do cliente (o do Contrato; senão, o primeiro logo da Identidade Visual); sem logo, as cores; sem cores, as iniciais
    const logoId = (D.arquivos_marca || []).find((a) => a.categoria === 'logo' && a.previa);
    const img = D.empresa && D.empresa.logo_url ? el('div', 'sl__capa-img', el('img', { src: D.empresa.logo_url, alt: 'Logo ' + nome }))
      : logoId ? el('div', 'sl__capa-img', (() => { const i = imgAssinada(logoId.previa, 'Logo ' + nome); i.loading = 'eager'; return i; })())
      : cores.length ? el('div', 'sl__capa-img', el('div', { class: 'sl__mosaico', style: '--c:' + Math.min(cores.length, 2) }, cores.map((h) => el('span', { style: 'background:' + h }))))
        : el('div', 'sl__capa-img', el('span', 'sl__capa-ini', U.iniciais ? U.iniciais(nome) : nome.slice(0, 2)));
    return el('section', 'sl sl--capa', el('div', 'sl__in',
      el('div', 'sl__meta', el('span', null, nome), el('span'), el('span', null, 'GANG'), el('span', null, U.cap(U.nomeMes(hoje)) + ' ' + hoje.slice(0, 4))),
      el('div', 'sl__capa', el('div', null, el('h1', 'sl__capa-t', titulo), sub ? el('p', 'sl__capa-s', sub) : null), direita || img)));
  };
  const deckBarra = (voltar, ...extras) => el('div', 'deck__bar no-print', el('a', { class: 'link', href: VER ? 'admin-cliente.html?id=' + encodeURIComponent(VER) + '#estrategia' : voltar }, VER ? '← Voltar ao painel' : '← Voltar'), ...extras,
    el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: () => window.print() }, 'Imprimir ou salvar em PDF'));

  // ===== Relatório do mês: o que aconteceu, o que vem e como a marca está, para mostrar aos sócios =====
  let relModo = 'completo';
  const telaRelatorio = () => {
    const nome = D.empresa ? D.empresa.nome : 'Sua empresa';
    const r1 = hoje; const desde = U.addRef(r1, -3);
    const feitas = D.acoes.filter((a) => a.status === 'feita' && (a.mes_previsto >= desde || (a.concluida_em && a.concluida_em.slice(0, 7) >= desde)));
    const andamento = D.acoes.filter((a) => a.status !== 'feita' && a.mes_previsto <= r1);
    const essenciais = D.acoes.filter((a) => a.status !== 'feita' && a.peso === 'essencial' && a.mes_previsto <= U.addRef(r1, 1));
    const RES_TXT = { sim: ['funcionou', 'ok'], parcial: ['funcionou em parte', 'meio'], nao: ['não funcionou', 'bad'] };
    const cf = comoFoi(mesPassado);
    const concl = D.acoes.filter((a) => a.status === 'feita').length; const ate = D.acoes.filter((a) => a.mes_previsto <= r1).length;
    const nums = [[cf ? COMO[cf][1] + ' ' + COMO[cf][0] : '—', 'Como foi ' + U.nomeMes(mesPassado), cf ? 'comparado com o ano passado' : 'sem resposta ainda'],
      [concl + '/' + ate, 'Ações concluídas', 'até ' + U.nomeMes(r1)], [mesN + '/' + dur, 'Mês do plano', null]];
    // a pesquisa mais recente com respostas: quanto lembram da marca
    const q = [...D.pesquisas].reverse().find((x) => D.respostas.some((r) => r.pesquisa_id === x.id));
    let marcaVistaRel = null;
    if (q) {
      const rs = D.respostas.filter((r) => r.pesquisa_id === q.id); const sits = q.situacoes || [];
      const ment = sits.length ? Math.round(rs.filter((r) => sits.some((st) => ((r.ceps || {})[st.id] || []).includes(nome))).length / rs.length * 100) : null;
      const chave = semAcento(nome).split(/\s+/).filter((w) => w.length > 2).pop() || semAcento(nome);
      const lemb = Math.round(rs.filter((r) => semAcento(r.lembranca).includes(chave)).length / rs.length * 100);
      marcaVistaRel = sNums('como a marca é vista', [[lemb + '%', 'Lembram da marca sem ajuda', rs.length + ' respostas'], ment != null ? [ment + '%', 'Ligam a marca às situações de compra', null] : null].filter(Boolean),
        'A pesquisa “' + (q.titulo || 'de marca') + '”.');
    }
    const troca = el('div', { class: 'rel__modo', role: 'group', 'aria-label': 'Formato do relatório' },
      [['completo', 'Completo'], ['socios', '1 página para sócios']].map(([k, t]) => el('button', { class: 'fchip', type: 'button', 'aria-pressed': String(relModo === k), onclick: () => { relModo = k; render(); } }, t)));
    const barra = deckBarra('#plano', troca);
    const proximos = essenciais.slice(0, 5).map((a) => a.titulo);
    if (relModo === 'socios') {
      return [el('article', 'deck', barra, slide('resumo de ' + U.nomeMes(r1),
        el('p', 'sl__t sl__t--m', D.foco && D.foco.veredito ? D.foco.veredito : nome + ', mês ' + mesN + ' de ' + dur + ' do plano.'),
        el('div', { class: 'sl__nums', style: '--n:' + nums.length }, nums.map(([v, s, m]) => el('div', null, el('p', 'sl__big sl__big--m', v), el('p', 'sl__s', s), m ? el('p', 'sl__l', m) : null))),
        proximos.length || D.proximo ? el('div', 'sl__duas', proximos.length ? el('div', null, el('p', 'sl__l', 'Próximos passos'), el('ul', 'sl__lista', proximos.slice(0, 3).map((t) => el('li', null, t)))) : el('div'),
          D.proximo ? el('div', null, el('p', 'sl__l', 'Próximo encontro'), el('p', 'sl__n', U.quando(D.proximo.inicio))) : el('div')) : null))];
    }
    const meses = []; if (inicioRef) for (let r = inicioRef; r <= mesPassado; r = U.addRef(r, 1)) meses.push(r);
    const resp = meses.slice(-6).filter((r) => comoFoi(r));
    return [el('article', 'deck', barra,
      capa('Relatório de ' + U.nomeMes(r1), 'Mês ' + mesN + ' de ' + dur + ' do plano de marca de ' + nome + '.'),
      D.foco && D.foco.veredito ? sFrase('veredito do mês', D.foco.veredito, D.consultor ? el('p', { class: 'sl__s', style: 'margin-top:1.4cqw' }, '— ' + D.consultor.nome) : null) : null,
      sNums('relatório · o mês em números', nums),
      ...sCols('relatório · como foram os meses', resp.map((r) => [U.cap(U.nomeMes(r)), COMO[comoFoi(r)][1] + ' ' + COMO[comoFoi(r)][0], 'comparado com ' + U.nomeMes(r) + ' do ano passado']), 6),
      ...sLinhas('relatório · o que foi feito nos últimos 3 meses', feitas.map((a) => [a.titulo, txt(a.aprendizado) ? '“' + txt(a.aprendizado) + '”' : '', a.resultado ? RES_TXT[a.resultado][0] : 'feita', a.resultado ? RES_TXT[a.resultado][1] : null]), 6),
      ...sLinhas('relatório · em andamento', andamento.map((a) => [a.titulo, a.peso === 'essencial' ? 'essencial' : '', STATUS[a.status] || '', a.status === 'em_andamento' ? 'meio' : null]), 6),
      marcaVistaRel,
      slide('próximos passos', D.foco ? el('p', 'sl__t sl__t--m', D.foco.titulo) : null,
        el('div', 'sl__duas', proximos.length ? el('div', null, el('p', 'sl__l', 'Essenciais'), el('ul', 'sl__lista', proximos.map((t) => el('li', null, t)))) : el('div'),
          D.proximo ? el('div', null, el('p', 'sl__l', 'Próximo encontro'), el('p', 'sl__n', U.quando(D.proximo.inicio)), el('p', 'sl__s', (TIPO_ENCONTRO[D.proximo.tipo] || 'Encontro') + ' · ' + D.proximo.duracao_min + ' min')) : el('div'))))];
  };

  // ===== Plano de marca: Diagnóstico, Estratégia, Narrativa e Identidade Visual, em slides (sem as ações) =====
  // gerado na hora com o que está preenchido; seção vazia não entra
  const telaPlanoMarca = () => {
    const nome = D.empresa ? D.empresa.nome : 'Sua marca';
    const G = D.diagnostico || {}; const p = D.plano || {}; const P = D.plataforma || {};
    const POSD = { entrega: ['entrega', 'ok'], entrega_mal: ['entrega mal', 'meio'], nao_entrega: ['não entrega', 'bad'] };
    const STPC = { coerente: ['coerente', 'ok'], irregular: ['irregular', 'meio'], fora: ['fora da marca', 'bad'] };
    const STC = { se_confirma: ['se confirma', 'ok'], em_observacao: ['em observação', 'meio'], sem_dados: ['sem dados ainda', null], nao_se_confirma: ['não se confirma', 'bad'] };
    const NIVO = { negocio: 'Negócio', marca: 'Marca', comunicacao: 'Comunicação' };
    const fat = (tipo) => (D.fatores || []).filter((f) => f.tipo === tipo);
    const ent = (fs) => fs.filter((f) => f.posicao === 'entrega').length;
    const marcas = [(D.impressoes || []).find((x) => x.eh_cliente), ...(D.impressoes || []).filter((x) => !x.eh_cliente)].filter(Boolean);
    const pcs = D.pontos_contato || [];
    const esc = (t) => (D.escolhas || []).filter((x) => x.tipo === t).map((x) => x.texto);
    const deixa = [...esc('deixa_de_lado'), ...(D.descartadas || []).map((x) => x.texto)];
    const facs = FACETAS.filter(([k]) => D.facetas && D.facetas[k]);
    const diz = (D.tom_exemplos || []).filter((x) => x.tipo === 'diz').map((x) => x.texto);
    const nunca = (D.tom_exemplos || []).filter((x) => x.tipo === 'nunca_diz').map((x) => x.texto);
    const mot = fat('motivador'); const dis = fat('discriminador');
    const slides = [
      capa('Plano de marca', 'Diagnóstico, estratégia, narrativa e identidade visual.'),
      // diagnóstico
      sFrase('diagnóstico', G.resumo, G.data ? el('p', { class: 'sl__s', style: 'margin-top:1.4cqw' }, 'Diagnóstico de ' + U.mesAno(G.data)) : null),
      // o que pesa na escolha, dito por extenso: cada item com o que a marca entrega hoje (antes era só uma conta, 2/3, que não dizia o quê)
      ...sLinhas('diagnóstico · o que todo cliente exige', mot.map((f) => [f.texto, null, POSD[f.posicao] ? POSD[f.posicao][0] : '', POSD[f.posicao] ? POSD[f.posicao][1] : null]), 7,
        ['O básico da categoria: sem isso, a marca nem entra na disputa.', el('br'), 'Hoje a marca entrega ' + ent(mot) + ' de ' + mot.length + '.']),
      ...sLinhas('diagnóstico · o que faz escolher a marca', dis.map((f) => [f.texto, null, POSD[f.posicao] ? POSD[f.posicao][0] : '', POSD[f.posicao] ? POSD[f.posicao][1] : null]), 7,
        ['O que faz o cliente escolher uma marca e não outra.', el('br'), 'Hoje a marca entrega ' + ent(dis) + ' de ' + dis.length + '.']),
      ...sCols('diagnóstico · como cada marca é vista', marcas.map((m) => [m.eh_cliente ? 'Sua marca' : 'Concorrente', txt(m.marca_nome) || 'Marca',
        el('div', { style: 'display:grid;gap:.8cqw;margin-top:.6cqw' }, [['Notam', m.notam], ['Acreditam', m.acreditam], ['Sentem', m.sentem]].map(([k, v]) => el('div', null, el('p', 'sl__l', k), el('p', 'sl__s', txt(v) || '—'))))]), 4),
      ...sLinhas('diagnóstico · o que a marca mostra hoje', pcs.map((x) => [x.canal, txt(x.nota), (STPC[x.status] || STPC.irregular)[0], (STPC[x.status] || STPC.irregular)[1]]), 5),
      ...sGrade('diagnóstico · as causas que o plano ataca', (D.causas || []).map((c) => [c.texto, null]), 4),
      // estratégia
      txt(p.desafio) ? slide('estratégia · o desafio', el('div', 'sl__fim', el('p', 'sl__t', txt(p.desafio)),
        txt(p.como_vencer) ? el('div', { style: 'margin-top:3cqw;max-width:64%' }, el('p', 'sl__l', 'Como vamos vencer'), el('p', 'sl__s', txt(p.como_vencer))) : null)) : null,
      // o posicionamento é a escolha central da marca: slide invertido (fundo escuro), o único assim no documento
      txt(P.posicionamento) ? el('section', 'sl sl--destaque', el('div', 'sl__in', el('p', 'sl__rot', '/ estratégia'),
        el('div', 'sl__corpo', el('h2', 'sl__h', 'Posicionamento'), el('p', 'sl__s sl__dica', 'Para quem a marca é, o que só ela entrega e contra o quê compete.'),
          el('div', 'sl__fim', el('p', 'sl__t sl__t--pos', txt(P.posicionamento)))))) : null,
      // um objetivo por pilar, na ordem Negócio, Comunicação e Marca (dois do mesmo pilar ficam na mesma coluna)
      ...sCols('estratégia · objetivos', (() => {
        const gs = []; porNivel(D.objetivos || []).forEach((o) => { const g = gs.find((x) => x[0].nivel === o.nivel); if (g) g.push(o); else gs.push([o]); });
        return gs.map((os) => [NIVO[os[0].nivel] || 'Objetivo', os.map((o) => (o.destaque ? o.destaque + ' ' : '') + txt(o.titulo)).join(' · '),
          os.filter((o) => o.nivel === 'comunicacao' && (o.notar || o.acreditar || o.sentir)).map((o) => ['Notar ' + (o.notar || '—'), 'acreditar ' + (o.acreditar || '—'), 'sentir ' + (o.sentir || '—')].join(' · ')).join(' / ') || null]);
      })(), 4),
      esc('prioridade').length || deixa.length ? slide('estratégia · onde jogamos', cab('onde jogamos'), el('div', 'sl__duas',
        el('div', null, el('p', 'sl__l', 'Prioridade'), el('ul', 'sl__lista', esc('prioridade').map((t) => el('li', null, t)))),
        el('div', null, el('p', 'sl__l', 'Deixamos de lado'), el('ul', 'sl__lista', deixa.map((t) => el('li', null, t)))))) : null,
      ...sLinhas('estratégia · o que acompanhamos', (D.condicoes || []).map((c) => [c.texto, txt(c.como_verificar), (STC[c.status] || STC.sem_dados)[0], (STC[c.status] || STC.sem_dados)[1]]), 5),
      // narrativa
      sFrase('narrativa · mensagem central', P.mensagem_central, null, 'g'),
      ...sGrade('narrativa · o que nunca muda', (D.identidade_central || []).map((x) => [x.texto, txt(x.explicacao)]), 4),
      ...sGrade('narrativa · mensagens de apoio', (D.mensagens_apoio || []).map((m) => [m.texto, null]), 4),
      ...sCols('narrativa · tom de voz', (D.tom_atributos || []).map((a) => [null, a.nome, txt(a.descricao)]), 4),
      diz.length || nunca.length ? slide('narrativa · como a marca fala', cab('como a marca fala'), el('div', 'sl__duas',
        el('div', null, el('p', 'sl__l', 'Diz'), el('ul', 'sl__lista', diz.map((t) => el('li', null, t)))),
        el('div', null, el('p', 'sl__l', 'Nunca diz'), el('ul', 'sl__lista', nunca.map((t) => el('li', null, t)))))) : null,
      ...sCols('narrativa · quem a marca é', facs.map(([k, t]) => [t, null, D.facetas[k]]), 3),
      // identidade visual
      (D.cores || []).length ? partes(D.cores, 5).map((g, i) => slide('identidade visual · cores' + (i ? ' · continuação' : ''), cab('cores'), el('div', { class: 'sl__cores', style: '--n:' + Math.max(g.length, 3) },
        g.map((c) => el('div', 'sl__cor', el('span', { class: 'sl__amostra', style: 'background:' + (c.hex || '#ccc') }), el('p', 'sl__n', c.nome || ''),
          el('p', 'sl__l', [c.hex, c.cmyk ? 'CMYK ' + c.cmyk : null, c.pantone ? 'Pantone ' + c.pantone : null].filter(Boolean).join(' · '))))))) : [],
      ...sCols('identidade visual · tipografia', (D.tipografias || []).map((t) => [txt(t.uso) || 'Fonte', null,
        el('div', null, el('p', { class: 'sl__aa', style: 'font-family:"' + t.nome + '", var(--font)' }, 'Aa'), el('p', 'sl__n', t.nome))]), 3),
      ...sGrade('identidade visual · elementos da marca', (D.elementos_marca || []).map((x) => [x.nome, txt(x.descricao)]), 4),
      ...sGrade('identidade visual · ativos que tornam a marca reconhecível', (D.ativos || []).map((x) => [x.nome || x.tipo || 'Ativo', txt(x.texto)]), 4),
    ].flat().filter(Boolean);
    return [el('article', 'deck', deckBarra('#estrategia', el('span', 'small', slides.length + ' páginas')), slides)];
  };

  // ===== telas =====
  const SCREENS = {
    plano: { crumb: 'Visão Geral · ' + U.nomeMes(hoje) + ' de ' + hoje.slice(0, 4), render: telaCaminho },
    inicio: { crumb: 'Início · ' + U.nomeMes(hoje) + ' de ' + hoje.slice(0, 4), render: telaInicio },
    acoes: { crumb: 'Acompanhamento / Ações', render: telaAcoes },
    pesquisa: { crumb: 'Acompanhamento / Pesquisa', render: telaPesquisa },
    relatorio: { crumb: 'Acompanhamento / Relatório do mês', render: telaRelatorio },
    'marca-pdf': { crumb: 'Sua marca / Plano de marca', render: telaPlanoMarca },
    consultoria: { crumb: 'Acompanhamento / Calendário', render: telaConsultoria },
    plataforma: { crumb: 'Sua marca / Narrativa', render: telaPlataforma },
    identidade: { crumb: 'Sua marca / Identidade Visual', render: telaIdentidade },
    estrategia: { crumb: 'Sua marca / Estratégia', render: telaEstrategia },
    diagnostico: { crumb: 'Sua marca / Diagnóstico', render: telaDiagnostico },
    assinatura: { crumb: 'Conta / Meu plano', render: telaAssinatura },
  };

  const side = document.querySelector('.side');
  const rota = () => { if (VER) return 'marca-pdf'; const r0 = location.hash.slice(1); const r = r0 === 'calendario' ? 'consultoria' : r0 === 'resultados' ? 'pesquisa' : r0; const padrao = soAcesso ? 'inicio' : consBloq ? 'assinatura' : 'plano'; return SCREENS[r] && !(soAcesso && SO_CONSULTORIA.includes(r)) && !(!soAcesso && r === 'inicio') && !(vencido && !ABERTAS_VENCIDO.includes(r)) ? r : padrao; };
  // a animação de entrada só roda ao trocar de tela; atualizar algo na mesma tela (ex.: status de uma ação) não pisca
  let telaAtual = null;
  // uso: cada tela aberta e quanto tempo a pessoa ficou nela (só telas e tempo; o consultor vê isso para decidir o que simplificar)
  let usoTela = null; let usoDesde = 0;
  const registraUso = () => {
    if (!usoTela) return;
    const seg = Math.round((Date.now() - usoDesde) / 1000); const t = usoTela; usoTela = null;
    sb.rpc('portal_registrar_uso', { p_tela: t, p_segundos: seg }).then(() => {}); // o .then envia o pedido (o rpc só sai quando é esperado)
  };
  const comecaUso = (r) => { usoTela = r; usoDesde = Date.now(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) registraUso(); else if (telaAtual && !usoTela) comecaUso(telaAtual); });
  window.addEventListener('pagehide', registraUso);
  // o vocabulário do cliente: o que entra depois na tela (detalhes que abrem, listas que se redesenham) também é adaptado
  const VENDE = U.vendeDe(D.empresa);
  if (VENDE === 'produto' && window.MutationObserver) {
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) U.vocDOM(n, VENDE); else if (n.nodeType === 3 && n.parentElement) U.vocDOM(n.parentElement, VENDE); })))
      .observe(document.body, { childList: true, subtree: true });
  }
  // gráficos que aparecem animados: cada .anim ganha is-in quando entra na tela (barras crescem, anéis fecham, linhas se desenham)
  // e os números [data-conta] contam de 0 até o valor. Quem pediu menos movimento vê tudo pronto
  const contaNumeros = (box) => box.querySelectorAll('[data-conta]').forEach((n) => {
    const alvo = Number(n.dataset.conta); const pre = n.dataset.pre || ''; if (!Number.isFinite(alvo)) return;
    const t0 = performance.now(); const dur = 1100;
    const passo = (t) => { const k = Math.min(1, Math.max(0, (t - t0) / dur)); n.textContent = pre + Math.round(alvo * (1 - (1 - k) ** 3)) + '%'; if (k < 1) requestAnimationFrame(passo); };
    n.textContent = pre + '0%'; requestAnimationFrame(passo);
  });
  const animaTela = (root) => {
    const els = [...root.querySelectorAll('.anim')]; if (!els.length) return;
    if ((window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting) return; en.target.classList.add('is-in'); contaNumeros(en.target); io.unobserve(en.target); }), { threshold: 0.2 });
    // só depois que a página aparece (a entrada começa preta): antes disso, a animação passaria sem ninguém ver
    const html = document.documentElement;
    const comeca = () => setTimeout(() => els.forEach((e) => io.observe(e)), 250);
    if (html.classList.contains('is-ready')) comeca();
    else { const mo = new MutationObserver(() => { if (html.classList.contains('is-ready')) { mo.disconnect(); comeca(); } }); mo.observe(html, { attributes: true, attributeFilter: ['class'] }); }
  };
  function render() {
    const r = rota();
    const trocou = r !== telaAtual; telaAtual = r;
    if (trocou) { registraUso(); comecaUso(r); }
    const y = window.scrollY;
    $('crumb').textContent = SCREENS[r].crumb;
    $('screen').replaceChildren(el('div', 'screen screen--' + r + (trocou ? ' screen--entra' : ''), avisoFatura(), SCREENS[r].render()));
    U.vocDOM($('screen'), VENDE); // quem vende produto lê "produto" onde o sistema diz "serviço"
    animaTela($('screen'));
    if (!trocou) window.scrollTo(0, y);
    document.querySelectorAll('[data-route]').forEach((a) => {
      if (a.dataset.route === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  const go = (focus) => {
    render();
    side.classList.remove('is-open'); $('menu-btn').setAttribute('aria-expanded', 'false');
    if (focus) { window.scrollTo(0, 0); $('main').focus({ preventScroll: true }); }
  };
  window.addEventListener('hashchange', () => go(true));
  $('menu-btn').addEventListener('click', () => {
    const open = side.classList.toggle('is-open');
    $('menu-btn').setAttribute('aria-expanded', String(open));
  });
  go(false);
})();
