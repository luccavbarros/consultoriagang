/* Portal do cliente: carrega os dados da empresa de quem está logado, monta o menu com os indicadores e troca as telas.
   O banco só devolve linhas da empresa do cliente (regras em supabase/portal.sql): aqui nada é filtrado "na confiança". */
(async () => {
  const { sb, guard, signOut, notConfigured } = window.GangAuth;
  const U = window.GangUI;
  const { $, el } = U;
  if (!sb) return notConfigured($('main'));
  const me = await guard('client');
  if (!me) return;

  $('sign-out').addEventListener('click', signOut);
  $('me-name').textContent = me.name || me.email;
  U.avatar($('me-dot'), me.name || me.email, me.foto_url);

  // a própria foto: clicar na bolinha do nome abre a troca (vai para avatares/<seu id>/, só a pessoa escreve ali)
  {
    let foto = me.foto_url || null;
    const prev = el('span', { class: 'consultant__ini me-photo__view', 'aria-hidden': 'true' });
    const arq = el('input', { class: 'field field--file', id: 'mf-arq', type: 'file', accept: 'image/jpeg,image/png,image/webp' });
    const rm = el('button', { class: 'link', type: 'button' }, 'Remover a foto');
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const salvar = el('button', { class: 'btn btn--light btn--sm', type: 'submit' }, 'Salvar');
    const dlgF = el('dialog', { class: 'dialog', 'aria-labelledby': 'mf-t' });
    const formF = el('form', { class: 'dialog__body', method: 'dialog' },
      el('h2', { class: 'title-sm', id: 'mf-t' }, 'Sua foto'),
      el('p', 'small', 'Aparece ao lado do seu nome no menu. JPG ou PNG, até 5 MB.'),
      el('div', 'me-photo', prev, el('div', 'me-photo__ctl', el('label', { class: 'label', for: 'mf-arq' }, 'Escolher imagem'), arq, rm)),
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
  const [emp, plano, cons, objs, acoes, desc, nums, encs, diag, ori, peds, mets] = await Promise.all([
    sb.from('empresas').select('id, nome, logo_url').maybeSingle(),
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
  ]);
  const D = {
    empresa: emp.data, plano: plano.data, consultor: (cons.data || [])[0], objetivos: objs.data || [],
    acoes: acoes.data || [], descartadas: desc.data || [], numeros: nums.data || [], encontros: encs.data || [],
    diagnostico: diag.data, foco: (ori.data || [])[0], pedidos: peds.data || [], metricas: mets.data || [],
  };
  // o material entregue (somente leitura)
  const MARCA = ['escolhas', 'condicoes', 'impressoes', 'fatores', 'causas', 'mensagens_apoio', 'tom_atributos', 'tom_exemplos',
    'arquivos_marca', 'cores', 'tipografias', 'aplicacoes', 'situacoes', 'ativos'];
  const [plat, ident, facs, ...listas] = await Promise.all([
    sb.from('plataformas').select('*').maybeSingle(),
    sb.from('identidades').select('*').maybeSingle(),
    sb.from('facetas').select('*'),
    ...MARCA.map((t) => sb.from(t).select('*').order('ordem')),
  ]);
  D.plataforma = plat.data; D.identidade = ident.data;
  const [msgs, pesqs, resps, busc, voz, disp] = await Promise.all([
    sb.from('mensagens').select('*').order('criada_em'),
    sb.from('pesquisas').select('*').order('criada_em'),
    sb.from('respostas').select('*'),
    sb.from('buscas').select('*').order('mes_ref'),
    sb.from('vozes').select('*').order('criada_em', { ascending: false }),
    sb.from('disponibilidade').select('*').order('mes_ref', { ascending: false }),
  ]);
  D.mensagens = msgs.data || []; D.pesquisas = pesqs.data || []; D.respostas = resps.data || [];
  D.buscas = busc.data || []; D.vozes = voz.data || []; D.disponibilidade = disp.data || [];
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
  const SO_CONSULTORIA = ['plano', 'calendario', 'acoes', 'resultados', 'consultoria', 'relatorio'];
  $('plan-line').textContent = soAcesso ? 'Acesso à sua marca' : D.plano ? 'Mês ' + mesN + ' de ' + dur + ' do plano' : 'Plano de marca';
  if (soAcesso) {
    SO_CONSULTORIA.forEach((r) => { const li = document.querySelector('[data-route="' + r + '"]'); if (li) li.closest('li').hidden = true; });
    const g1 = document.getElementById('g1'); if (g1) g1.hidden = true;
    const ini = document.querySelector('[data-route="inicio"] span'); if (ini) ini.textContent = 'Início';
  } else {
    // na consultoria, o Plano já é a visão geral: a tela "Visão geral" sai do menu
    const li = document.querySelector('[data-route="inicio"]'); if (li) li.closest('li').hidden = true;
  }

  // ===== regras usadas em mais de uma tela =====
  const comCliente = (a) => a.responsavel !== 'gang';
  const pendentesDoMes = () => D.acoes.filter((a) => comCliente(a) && a.status !== 'feita' && a.mes_previsto <= hoje);
  const inicioRef = D.plano ? U.ref(D.plano.inicio) : null;
  const semNumeros = !!(D.plano && D.plano.sem_numeros); // combinado com o consultor: o portal não cobra os números do mês
  const faltaNumeros = () => !semNumeros && !!inicioRef && mesPassado >= inicioRef && !D.numeros.some((n) => n.mes_ref === mesPassado);

  // ===== indicadores =====
  const ind = (k, text, hot) => { const n = document.querySelector('[data-ind="' + k + '"]'); if (!n) return; n.textContent = text || ''; n.classList.toggle('is-hot', !!hot); };
  // os avisos do menu: só o ponto colorido e o número (sem palavras); o que não pede nada fica em branco
  const indicadores = () => {
    ind('plano', ''); ind('inicio', ''); ind('diagnostico', '');
    const h0 = new Date(); h0.setHours(0, 0, 0, 0); const h7 = new Date(h0); h7.setDate(h0.getDate() + 7);
    const semana = eventos().filter((e) => !e.feita && U.day(e.dia) >= h0 && U.day(e.dia) < h7).length;
    ind('calendario', semana ? String(semana) : '', semana > 0);
    const n = pendentesDoMes().length;
    ind('acoes', n ? String(n) : '', n > 0);
    const falta = faltaNumeros();
    ind('resultados', falta ? '1' : '', falta);
    const encSemana = D.proximo && new Date(D.proximo.inicio) < h7 ? 1 : 0;
    ind('consultoria', encSemana ? '1' : '', encSemana > 0);
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
      if (P.posicionamento) out.push({ grupo: 'Sua marca', titulo: 'Posicionamento', sub: P.posicionamento.slice(0, 80) + '…', href: '#plataforma', extra: P.posicionamento });
      if (P.mensagem_central) out.push({ grupo: 'Sua marca', titulo: 'Mensagem central', sub: P.mensagem_central, href: '#plataforma' });
    }
    (D.objetivos || []).forEach((o) => o.titulo && out.push({ grupo: 'Sua marca', titulo: U.cap(o.titulo), sub: 'Objetivo · Estratégia', href: '#estrategia' }));
    (D.cores || []).forEach((c) => out.push({ grupo: 'Sua marca', titulo: 'Cor ' + c.nome, sub: (c.hex || '').toUpperCase() + ' · Identidade visual', href: '#identidade' }));
    (D.tipografias || []).forEach((t) => out.push({ grupo: 'Sua marca', titulo: 'Fonte ' + t.nome, sub: 'Identidade visual', href: '#identidade' }));
    (D.pedidos || []).forEach((pd) => out.push({ grupo: 'Peças', titulo: pd.titulo || pd.tipo_peca, sub: ({ em_analise: 'Em análise', ajustar: 'Ajustar', aprovado: 'Aprovada' })[pd.status] || '', href: '#acoes', extra: pd.resposta || '' }));
    (D.vozes || []).forEach((v) => out.push({ grupo: 'O que os clientes disseram', titulo: v.texto, sub: U.cap(U.nomeMes(v.mes_ref)), href: '#resultados' }));
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
    if ($('c-dias')) $('c-dias').textContent = 'Responde às ' + ((D.plano && D.plano.dias_resposta) || 'terças e quintas');
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
  const telaInicio = () => {
    if (soAcesso) return telaInicioAcesso();
    const primeiro = (me.name || '').split(' ')[0];
    const out = [head(D.plano ? 'Mês ' + mesN + ' de ' + dur + ' · plano em execução' : '', 'Olá' + (primeiro ? ', ' + primeiro : '') + '.',
      'A estratégia e a nova identidade estão prontas. Agora o trabalho é colocar a marca em prática, um mês de cada vez.')];

    // a faixa de indicadores: o essencial do mês em quatro números
    const comVoceN = pendentesDoMes().length;
    const pBase = baseFat(); const meta0 = D.plano && D.plano.meta_faturamento_pct != null ? Number(D.plano.meta_faturamento_pct) : null;
    const ult = [...D.numeros].reverse().find((n) => n.faturamento != null && (!inicioRef || n.mes_ref > inicioRef));
    const realK = pBase && ult ? Math.round((Number(ult.faturamento) / pBase - 1) * 1000) / 10 : null;
    const kpi = (rot, valor, sub, extra, href) => el(href ? 'a' : 'div', { class: 'kpi', href },
      el('p', 'eyebrow', rot), el('p', 'kpi__value', valor), extra || null, sub ? el('p', 'kpi__sub', sub) : null);
    out.push(el('section', { class: 'kpis', 'aria-label': 'Resumo do mês' },
      kpi('Plano', mesN + '/' + dur, 'meses de execução', el('span', { class: 'kpi__bar', role: 'img', 'aria-label': 'Mês ' + mesN + ' de ' + dur }, el('span', { style: 'width:' + Math.round((mesN / dur) * 100) + '%' }))),
      kpi('Com você', String(comVoceN), comVoceN === 1 ? 'ação pendente' : 'ações pendentes', null, '#acoes'),
      kpi('Faturamento', realK == null ? '—' : U.pct(realK, 1), meta0 != null ? 'meta ' + U.pct(meta0, 0) + ' em ' + dur + ' meses' : 'desde o início', null, '#resultados'),
      kpi('Próximo encontro', D.proximo ? U.dia(D.proximo.inicio) : '—', D.proximo ? U.cap(U.fmt(D.proximo.inicio, { weekday: 'long' })) + ' · ' + U.hora(D.proximo.inicio) : 'a marcar', null, '#consultoria')));

    // foco do mês (some se o consultor ainda não escreveu)
    if (D.foco) {
      const f = D.foco;
      out.push(el('section', { class: 'focus', 'aria-labelledby': 'focus-t' },
        el('div', 'focus__text',
          el('p', 'eyebrow', 'Foco de ' + U.nomeMes(hoje)),
          el('h2', { class: 'focus__title', id: 'focus-t' }, f.titulo),
          f.texto ? el('p', 'focus__body', f.texto) : null),
        D.consultor ? el('div', 'focus__by', avatar(D.consultor), el('div', null,
          el('p', 'consultant__name', D.consultor.nome || 'Seu consultor'),
          el('p', 'consultant__role', 'Orientação escrita em ' + U.dia(f.publicada_em)))) : null,
      ));
    }

    // para fazer este mês
    const itens = [];
    pendentesDoMes().forEach((a) => {
      const p = prazo(a);
      const quemTxt = a.responsavel_nome ? 'Com você e ' + a.responsavel_nome : 'Com você';
      itens.push({ href: '#acoes', title: a.titulo, sub: quemTxt + ' · ' + p.text[0].toLowerCase() + p.text.slice(1), hot: p.hot, chip: chipStatus(a.status) });
    });
    if (faltaNumeros()) itens.push({ href: '#resultados', title: 'Informar os números de ' + U.nomeMes(mesPassado), sub: 'Faturamento, leads e clientes novos · 2 min', hot: true, chip: chipStatus('a_fazer') });
    ajustarNaoVistos().forEach((p) => itens.push({ href: '#acoes', title: 'Ajustar: ' + (p.titulo || p.tipo_peca), sub: p.resposta || 'O consultor pediu um ajuste', hot: false, chip: chip('warn', 'Ajustar') }));

    const todo = el('section', { class: 'box', 'aria-labelledby': 'todo-t' },
      el('div', 'box__head', el('h2', { class: 'box__title', id: 'todo-t' }, 'Para fazer este mês'), el('a', { class: 'link', href: '#acoes' }, 'Todas as ações')),
      itens.length
        ? el('ul', 'todo', itens.map((i) => el('li', null, el('a', { class: 'todo__item', href: i.href },
          el('span', 'todo__text', el('span', 'todo__title', i.title), el('span', 'todo__sub' + (i.hot ? ' is-hot' : ''), i.sub)), i.chip))))
        : el('p', 'box__empty', 'Nada pendente com você este mês.'));

    out.push(el('div', 'grid grid--todo', todo, rumo()));

    // próximo encontro + atalhos
    const e = D.proximo;
    const encontro = el('section', { class: 'box box--line', 'aria-labelledby': 'meet-t' },
      el('p', { class: 'eyebrow', id: 'meet-t' }, 'Próximo encontro'),
      e ? [
        el('p', 'meet__when', U.quando(e.inicio)),
        el('p', 'box__text', (TIPO_ENCONTRO[e.tipo] || 'Encontro') + ' · ' + e.duracao_min + ' min.' + ((e.pauta || []).length ? ' Pauta: ' + e.pauta.slice(0, 3).join('; ').replace(/\?;/g, '?') + '.' : '')),
        e.status === 'remarcar_solicitado' ? el('p', 'box__note', 'Você pediu para remarcar. O consultor confirma a nova data.') : null,
      ] : el('p', 'box__text', 'Nenhum encontro marcado ainda.'),
      el('div', 'box__links box__foot', el('a', { class: 'link', href: '#consultoria' }, 'Ver pauta e encontros anteriores'), el('a', { class: 'link', href: '#calendario' }, 'Ver calendário')));
    const atalho = (href, t, s) => el('a', { class: 'shortcut', href }, el('span', 'shortcut__title', t), el('span', 'shortcut__sub', s));
    const atalhos = el('section', { class: 'box', 'aria-labelledby': 'hand-t' },
      el('h2', { class: 'box__title', id: 'hand-t' }, 'Sua marca à mão'),
      el('div', 'shortcuts',
        atalho('#plataforma', 'Mensagem e tom', 'O que dizer e como dizer'),
        atalho('#identidade', 'Logo e modelos', 'Baixar arquivos da identidade'),
        atalho('#consultoria', 'Revisar uma peça', 'Mande antes de publicar')));
    out.push(el('div', 'grid grid--meet', encontro, atalhos));
    if (condicaoQuebrada().length) out.splice(1, 0, alertaEstrategia(condicaoQuebrada()));
    return out;
  };

  // rumo ao objetivo: variação acumulada do faturamento contra a meta
  const rumo = () => {
    const box = el('section', { class: 'box', 'aria-labelledby': 'goal-t' }, el('h2', { class: 'box__title', id: 'goal-t' }, 'Rumo ao objetivo'));
    const p = D.plano;
    const meta = p && p.meta_faturamento_pct != null ? Number(p.meta_faturamento_pct) : null;
    const base = p && p.faturamento_base != null ? Number(p.faturamento_base) : (D.numeros[0] ? Number(D.numeros[0].faturamento) : null);
    const ultimo = [...D.numeros].reverse().find((n) => n.faturamento != null && (!inicioRef || n.mes_ref > inicioRef));
    if (!meta || !base || !ultimo) {
      box.append(el('p', 'goal__wait', 'Aguardando os primeiros números'),
        el('p', 'box__text', meta ? 'Meta: ' + U.pct(meta, 0) + ' de faturamento em ' + dur + ' meses.' : 'A meta aparece aqui quando o consultor cadastrar o plano.'),
        el('a', { class: 'link box__foot', href: '#resultados' }, 'Ver resultados'));
      return box;
    }
    const real = (Number(ultimo.faturamento) / base - 1) * 100;
    const k = U.mesesEntre(U.refDate(inicioRef), U.refDate(ultimo.mes_ref)); // meses desde o início
    const esperado = (meta * k) / dur;
    const noRumo = real >= esperado;
    const frac = (v) => Math.max(0, Math.min(1, v / meta)) * 100;
    box.append(
      el('p', 'goal__num', U.pct(Math.round(real * 10) / 10, 1)),
      el('p', 'box__text', 'de faturamento desde o início · meta: ' + U.pct(meta, 0) + ' em ' + dur + ' meses'),
      el('div', { class: 'goal__bar', role: 'img', 'aria-label': 'Realizado ' + U.pct(Math.round(real * 10) / 10) + '; esperado até ' + U.nomeMes(ultimo.mes_ref) + ': ' + U.pct(Math.round(esperado * 10) / 10) },
        el('span', { class: 'goal__fill', style: 'width:' + frac(real) + '%' }),
        el('span', { class: 'goal__mark', style: 'left:' + frac(esperado) + '%' })),
      el('p', 'box__note', 'A barra mostra o realizado até ' + U.nomeMes(ultimo.mes_ref) + '; a marca, onde deveríamos estar.'),
      chip(noRumo ? 'done' : 'warn', noRumo ? 'No rumo' : 'Abaixo do ritmo'),
      el('a', { class: 'link box__foot', href: '#resultados' }, 'Ver resultados'),
    );
    return box;
  };

  // ===== acesso ao consultor: o encontro é o lugar dele =====
  const diasResposta = () => (D.plano && D.plano.dias_resposta) || 'terças e quintas';
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
  const telaAcoes = () => {
    const total = D.acoes.length;
    const feitas = D.acoes.filter((a) => a.status === 'feita').length;
    const sugerir = el('div', 'head-btns',
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => { revAberta = !revAberta; render(); } }, revAberta ? 'Fechar envio de peça' : 'Enviar peça para revisão'),
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: abrirSugestao }, 'Tenho uma ideia'));
    const out = [head('Plano de execução · ' + dur + ' meses', 'Ações',
      'O que colocar em prática, mês a mês. Atualize o andamento do que está com você; o consultor ajusta o plano com você nos encontros.', sugerir)];

    out.push(el('p', 'count', el('span', 'count__num', feitas + ' / ' + total), ' ações concluídas'));
    // barra segmentada: feitas · em andamento · a fazer (no lugar de uma pizza)
    if (total) {
      const and = D.acoes.filter((a) => a.status === 'em_andamento').length;
      const faz = total - feitas - and;
      const partes = [['done', 'Feitas', feitas], ['doing', 'Em andamento', and], ['todo', 'A fazer', faz]];
      out.push(el('div', 'seg-bar',
        el('div', { class: 'seg-bar__track', role: 'img', 'aria-label': partes.map(([, t, n]) => t + ': ' + n).join(', ') },
          partes.filter(([, , n]) => n > 0).map(([k, t, n]) => el('span', { class: 'seg-bar__part seg-bar__part--' + k, style: 'flex-grow:' + n, title: t + ': ' + n }))),
        el('div', 'seg-bar__legend', partes.map(([k, t, n]) => el('span', null, el('span', 'seg-bar__key seg-bar__part--' + k), t + ' ' + n)))));
    }

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
        onclick: () => { abaAcoes = k; render(); } }, nomes[k] + ' (' + grupos[k].filter((x) => k === 'feitas' || x.status !== 'feita').length + ')')));
    tabs.addEventListener('keydown', (ev) => {
      const ks = Object.keys(grupos); const i = ks.indexOf(abaAcoes);
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
        abaAcoes = ks[(i + (ev.key === 'ArrowRight' ? 1 : ks.length - 1)) % ks.length]; render();
        document.querySelector('.tabs [aria-selected="true"]').focus();
      }
    });

    const doGrupo = grupos[abaAcoes];
    if (!doGrupo.length) lista.append(el('li', 'tasks__empty', { mes: 'Nenhuma ação pendente neste mês.', proximos: 'Nenhuma ação prevista para os próximos meses.', feitas: 'Nenhuma ação concluída ainda.' }[abaAcoes]));
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
            el('span', 'tasks__mes-n', acs.length + (acs.length === 1 ? ' ação' : ' ações') + (ess ? ' · ' + ess + (ess === 1 ? ' essencial' : ' essenciais') : ''))),
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
    } else doGrupo.forEach((a) => {
      const card = cartaoAcao(a);
      if (a === primeira) { card.classList.add('is-prioridade'); card.querySelector('.task__sub').prepend(el('span', 'task__flag', 'Faça agora'), ' '); }
      lista.append(card);
    });
    const pend = doGrupo.filter((x) => x.status !== 'feita').length;
    out.push(el('div', 'actions-wrap', tabs, el('section', { class: 'box tasks-box', 'aria-label': nomes[abaAcoes] },
      el('div', 'tasks__head', el('p', 'tasks__t', nomes[abaAcoes]), el('span', 'tasks__count', abaAcoes === 'feitas' ? doGrupo.length + (doGrupo.length === 1 ? ' concluída' : ' concluídas') : (doGrupo.length - pend) + ' de ' + doGrupo.length + ' feitas'),
        el('span', 'tasks__hint', 'Clique numa tarefa para ver o porquê')),
      lista)));

    if (revAberta) out.splice(1, 0, formRevisao());
    const pcs = suasPecas(); if (pcs) out.push(pcs);
    if (D.descartadas.length) out.push(el('p', 'box__note', 'O que decidimos não fazer está na ', el('a', { class: 'link', href: '#estrategia' }, 'Estratégia'), ', em “Deixamos de lado”.'));
    return out;
  };

  // ===== cada ação é uma tarefa de checklist: marcar, mudar o status e abrir os detalhes =====
  const abertas = new Set();
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
  const cartaoAcao = (a) => {
    const o = objetivo[a.objetivo_id];
    const p = prazo(a);
    // o porquê da ação: o objetivo que ela serve, o momento de compra que ela mira e como saberemos que deu certo
    const porque = [
      ['Objetivo', U.cap(a.serve_para || (o ? o.titulo : '')) || null, o ? NIVEL[o.nivel] : null],
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
      const antes = ps[i].ok; ps[i].ok = ok; if (ok && a.status === 'a_fazer') a.status = 'em_andamento'; render();
      const { error } = await sb.rpc('portal_passo_acao', { p_acao: a.id, p_i: i, p_ok: ok });
      if (error) { ps[i].ok = antes; render(); return anuncia('Não foi possível salvar o passo.'); }
      if (ok && ps.every((x) => x.ok) && a.status !== 'feita') anuncia('Todos os passos feitos. Marque a ação como feita quando terminar.');
    };
    const passos = ps.length ? el('div', 'passos',
      el('div', 'passos__head', el('p', 'passos__t', 'Passo a passo'), el('span', 'passos__n', feitos + ' de ' + ps.length),
        el('span', 'passos__bar', el('span', { style: 'width:' + Math.round(feitos / ps.length * 100) + '%' }))),
      el('ul', 'passos__list', ps.map((x, i) => {
        const cb = el('input', { type: 'checkbox', checked: !!x.ok, disabled: !editavel, 'aria-label': x.t });
        cb.addEventListener('change', () => marcaPasso(i, cb.checked));
        return el('li', x.ok ? 'is-ok' : null, el('label', null, cb, el('span', null, x.t)));
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
    const corpo = temDetalhe && aberta ? el('div', 'task__body', passos, modelo,
      porque.length ? el('dl', { class: 'why', 'aria-label': 'Por que esta ação' }, porque.map(([k, v, tag]) => el('div', 'why__item',
        el('dt', null, k, tag ? el('span', 'why__tag', tag) : null), el('dd', null, v)))) : null,
      a.observacao ? el('div', 'action__obs', D.consultor ? avatar(D.consultor) : null,
        el('div', null, el('p', 'action__obs-lbl', 'Observação ' + (D.consultor && D.consultor.nome ? 'de ' + D.consultor.nome.split(' ')[0] : 'do consultor')), el('p', 'action__obs-txt', a.observacao))) : null,
      a.status === 'feita' ? blocoResultado(a) : null, ajuda) : null;
    // uma ação aberta por vez: abrir uma fecha a outra (sem amontoado de detalhes na tela)
    const alterna = () => {
      if (!temDetalhe) return;
      const abrir = !abertas.has(a.id); abertas.clear(); if (abrir) abertas.add(a.id); render();
      if (abrir) requestAnimationFrame(() => { const n = document.querySelector('.task[data-id="' + a.id + '"]'); if (n && n.getBoundingClientRect().top < 70) n.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
    };
    const linha = el('div', { class: 'task__row', role: temDetalhe ? 'button' : null, tabindex: temDetalhe ? '0' : null, 'aria-expanded': temDetalhe ? String(aberta) : null,
      onclick: alterna, onkeydown: (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); alterna(); } } },
      check,
      el('div', 'task__main',
        el('p', 'task__title', a.titulo),
        el('p', 'task__sub', [U.cap(U.nomeMesCurto(a.mes_previsto)), ps.length ? feitos + ' de ' + ps.length + ' passos' : null, a.tamanho ? 'tamanho ' + a.tamanho : null, a.esforco === 'marca' ? 'efeito em 6 a 12 meses' : null, a.observacao ? 'nota do consultor' : null,
          a.travada && a.status !== 'feita' ? 'travada: ' + MOTIVOS[a.travada].toLowerCase() : null].filter(Boolean).join(' · '))),
      el('div', 'task__tags', el('span', 'mtag mtag--who', quem(a)), p.text ? el('span', 'mtag mtag--date' + (p.hot ? ' is-hot' : ''), p.text) : null),
      el('div', 'task__st', status),
      temDetalhe ? el('span', { class: 'task__chev' + (aberta ? ' is-open' : ''), 'aria-hidden': 'true' }) : el('span', 'task__chev is-none'));
    return el('li', { class: 'task' + (a.status === 'feita' ? ' is-feita' : '') + (aberta ? ' is-aberta' : ''), 'data-id': a.id }, linha, corpo);
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
    const marca = a.esforco === 'marca';
    const salva = async (r) => {
      const { error } = await sb.rpc('portal_resultado_acao', { p_acao: a.id, p_resultado: r, p_aprendizado: txt.value });
      if (error) return U.say(msg, 'Não foi possível salvar.', 'error');
      a.resultado = r; a.aprendizado = txt.value.trim() || null; render(); anuncia('Resultado salvo.');
    };
    return el('div', 'result',
      el('p', 'result__q', marca ? 'Foi feita como planejado?' : a.metrica_sucesso ? 'Funcionou? (' + a.metrica_sucesso + ')' : 'Funcionou?'),
      marca ? el('p', 'box__note', 'Ação de marca: o efeito aparece em 6 a 12 meses e é medido na pesquisa do semestre, não agora.') : null,
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
    render(); indicadores();
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
  const graficoLinhas = ({ rotulos, series, fmt, label }) => grafico('chart--line', label, (W, tip, box) => {
    const H = 240; const L = 48; const R = 56; const T = 14; const B = 30;
    const vals = series.flatMap((s) => s.valores.filter((v) => v != null));
    const tk = ticks(Math.min(0, ...vals), Math.max(1, ...vals));
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
      if (s.pontos) {
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
      svg.append(sv('path', { d, fill: 'none', stroke: s.cor, 'stroke-width': s.tracejado ? 1.5 : 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': s.tracejado ? '4 5' : null }));
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
  // How Brands Grow: a marca cresce ganhando compradores, não espremendo os mesmos
  const penetracao = (novos, totais) => {
    const meses = totais.map((t, i) => [t, novos[i]]).filter(([t, nv]) => t != null && nv != null && t > 0);
    if (!meses.length) return null;
    const [t, nv] = meses[meses.length - 1];
    const pctN = Math.round((nv / t) * 100);
    const subindo = meses.length > 1 ? meses[meses.length - 1][0] - meses[0][0] : 0;
    return el('p', 'box__text', pctN + '% dos clientes do último mês eram novos. '
      + (subindo > 0 ? 'A base de clientes atendidos está crescendo, que é como as marcas crescem: com mais compradores.' : 'Para crescer, a marca precisa chegar a mais compradores, não só vender mais para os mesmos.'));
  };

  // ===== Calendário: ações com prazo e encontros, mês a mês =====
  let calMes = hoje;
  function eventos() {
    const ev = [];
    D.acoes.forEach((a) => { if (a.prazo) ev.push({ dia: a.prazo, tipo: a.responsavel === 'gang' ? 'gang' : 'acao', feita: a.status === 'feita', titulo: a.titulo, sub: quem(a) + ' · ' + STATUS[a.status], href: '#acoes', acao: a.id }); });
    D.encontros.forEach((e) => {
      const d = new Date(e.inicio);
      ev.push({ dia: d.toLocaleDateString('sv-SE'), tipo: 'encontro', feita: e.status === 'realizado', hora: U.hora(e.inicio), titulo: TIPO_ENCONTRO[e.tipo] || 'Encontro', sub: e.duracao_min + ' min' + (e.status === 'remarcar_solicitado' ? ' · remarcação pedida' : ''), href: '#consultoria' });
    });
    return ev.sort((a, b) => (a.dia + (a.hora || '')).localeCompare(b.dia + (b.hora || '')));
  }
  const TIPO_EV = { encontro: 'Encontro', acao: 'Ação com você', gang: 'Ação da GANG' };
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
        evs.slice(0, 3).map((e) => el('a', { class: 'cal__ev cal__ev--' + e.tipo + (e.feita ? ' is-done' : ''), href: e.href, onclick: e.acao ? () => { abreAcao = e.acao; } : null, tabindex: -1, title: TIPO_EV[e.tipo] + ': ' + e.titulo },
          e.hora ? el('span', 'cal__time', e.hora) : null, el('span', 'cal__evt', e.titulo))),
        evs.length > 3 ? el('span', 'cal__more', '+' + (evs.length - 3)) : null));
    }
    const grade = el('div', { class: 'cal__grid', 'aria-hidden': 'true' },
      ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => el('span', 'cal__wd', d)), dias);

    // a lista do mês: a mesma informação em texto (é o que aparece no celular)
    const lista = el('section', { class: 'box', 'aria-labelledby': 'cal-l' },
      el('h2', { class: 'box__title', id: 'cal-l' }, 'Neste mês'),
      doMes.length ? el('ul', 'todo', doMes.map((e) => el('li', null, el('a', { class: 'todo__item', href: e.href, onclick: e.acao ? () => { abreAcao = e.acao; } : null },
        el('span', 'cal__date', el('strong', null, U.day(e.dia).getDate()), el('span', null, U.cap(U.fmt(e.dia, { weekday: 'short' })))),
        el('span', 'todo__text', el('span', 'todo__title' + (e.feita ? ' is-struck' : ''), e.titulo), el('span', 'todo__sub', (e.hora ? e.hora + ' · ' : '') + e.sub)),
        el('span', 'chip ' + (e.tipo === 'encontro' ? 'chip--done' : e.tipo === 'acao' ? 'chip--doing' : 'chip--todo'), TIPO_EV[e.tipo])))))
        : el('p', 'box__empty', 'Nada marcado neste mês.'));

    out.push(el('section', { class: 'box cal', 'aria-label': 'Calendário de ' + U.nomeMes(calMes) }, nav, grade), lista);
    return out;
  };

  // ===== Resultados =====
  const baseFat = () => {
    const p = D.plano;
    if (p && p.faturamento_base != null) return Number(p.faturamento_base);
    const n = D.numeros.find((x) => x.faturamento != null);
    return n ? Number(n.faturamento) : null;
  };
  // pode corrigir os números até o encontro seguinte ao envio começar (mesma regra do banco)
  const podeCorrigir = (n) => !D.encontros.some((e) => new Date(e.inicio) > new Date(n.enviado_em) && new Date(e.inicio).getTime() <= agoraMs);
  let corrigindo = false;

  const telaResultados = () => {
    const ultimo = [...D.numeros].reverse()[0];
    const out = [head(ultimo ? 'Último mês informado: ' + U.nomeMes(ultimo.mes_ref) : 'Estamos chegando lá?', 'Resultados',
      'Vendas mudam em semanas; a percepção da marca, em meses. Por isso medimos os dois, em ritmos diferentes.',
      el('a', { class: 'btn btn--ghost', href: '#relatorio' }, 'Relatório do mês')),
    veredito(), quando(), parte('Negócio', 'O que o plano já devolveu e o que falta para a meta.'), metaHero(), lado(planoPagou(), simulador())].filter(Boolean);

    // formulário do mês passado (ou a confirmação depois de enviar); fica ao lado do gráfico
    let numBox = null;
    if (inicioRef && mesPassado >= inicioRef) {
      const enviado = D.numeros.find((n) => n.mes_ref === mesPassado);
      if (!enviado || corrigindo) numBox = formNumeros(enviado);
      else {
        const corrige = podeCorrigir(enviado);
        numBox = (el('section', { class: 'box box--line sent', 'aria-labelledby': 'sent-t' },
          el('div', 'box__head', el('h2', { class: 'box__title', id: 'sent-t' }, 'Números de ' + U.nomeMes(mesPassado) + ' enviados'), chip('done', 'Enviado')),
          el('p', 'box__text', 'Faturamento ' + U.reais(enviado.faturamento) + ' · ' + (enviado.leads ?? '—') + ' leads · ' + (enviado.clientes_novos ?? '—') + ' clientes novos. Enviado em ' + U.dia(enviado.enviado_em) + '.'),
          corrige ? el('button', { class: 'link box__foot', type: 'button', onclick: () => { corrigindo = true; render(); $('n-fat').focus(); } }, 'Corrigir') : null));
      }
    }

    // faturamento mês a mês
    const p = D.plano;
    const meta = p && p.meta_faturamento_pct != null ? Number(p.meta_faturamento_pct) : null;
    const base = baseFat();
    if (inicioRef) {
      const linhas = [];
      for (let r = inicioRef, k = 0; r <= hoje && k < dur; r = U.addRef(r, 1), k += 1) {
        const n = D.numeros.find((x) => x.mes_ref === r);
        const rot = U.cap(U.nomeMesCurto(r)) + (r.slice(0, 4) !== hoje.slice(0, 4) ? ' ' + r.slice(0, 4) : '');
        if (k === 0) { linhas.push([rot + ' · início', 'Base', base != null ? U.reais(base) : '—', el('span', 'muted', '—')]); continue; }
        const esp = meta != null ? (meta * k) / dur : null;
        let real = null;
        if (n && n.faturamento != null && base) real = (Number(n.faturamento) / base - 1) * 100;
        const situacao = real == null ? el('span', 'muted', '—') : (esp == null ? el('span', 'muted', '—') : chip(real >= esp ? 'done' : 'warn', real >= esp ? 'No rumo' : 'Abaixo do ritmo'));
        const realTxt = real != null ? U.pct(Math.round(real * 10) / 10) : (r === mesPassado && !semNumeros ? el('span', 'is-hot', 'A informar') : (r === hoje ? el('span', 'muted', 'Mês em curso') : el('span', 'muted', 'Não informado')));
        linhas.push([rot, esp != null ? U.pct(Math.round(esp * 10) / 10) : '—', realTxt, situacao]);
      }
      // o gráfico mostra o plano inteiro: o esperado até a meta e o realizado até hoje
      const rots = []; const espS = []; const realS = [];
      for (let k = 0, r = inicioRef; k <= dur; k += 1, r = U.addRef(r, 1)) {
        rots.push(U.cap(U.nomeMesCurto(r)) + (k === 0 || r.slice(5) === '01' ? ' ' + r.slice(2, 4) : ''));
        espS.push(meta != null ? Math.round(((meta * k) / dur) * 10) / 10 : null);
        const n = D.numeros.find((x) => x.mes_ref === r);
        realS.push(k === 0 ? (base ? 0 : null) : (n && n.faturamento != null && base ? Math.round((Number(n.faturamento) / base - 1) * 1000) / 10 : null));
      }
      const temReal = realS.slice(1).some((v) => v != null);
      const pctFmt = (v) => U.pct(v, 1);
      const evol = {};
      evol.fat = () => el('section', { class: 'box', 'aria-labelledby': 'fat-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'fat-t' }, 'Faturamento mês a mês'), meta != null ? el('p', 'box__note', 'Meta: ' + U.pct(meta, 0) + ' em ' + dur + ' meses') : null),
        meta != null || temReal ? [
          el('div', 'chart__legend',
            el('span', null, el('span', { class: 'chart__line', style: 'background:' + C.acc }), 'Realizado'),
            meta != null ? el('span', null, el('span', 'chart__line chart__line--dash'), 'Esperado') : null),
          graficoLinhas({ rotulos: rots, fmt: pctFmt, label: 'Variação do faturamento desde o início, realizado e esperado, mês a mês. Os valores estão na tabela abaixo.',
            series: [
              meta != null ? { nome: 'Esperado', valores: espS, cor: C.ref, tracejado: true } : null,
              { nome: 'Realizado', valores: realS, cor: C.acc, pontos: true, rotuloFim: true },
            ].filter(Boolean) }),
        ] : null,
        tabela(['Mês', 'Esperado', 'Realizado', 'Situação'], linhas));

      // leads e clientes novos: duas medidas, dois gráficos (nunca dois eixos no mesmo)
      const comNum = D.numeros.filter((x) => x.mes_ref >= inicioRef);
      if (comNum.some((x) => x.leads != null || x.clientes_novos != null)) {
        const rm = []; const ld = []; const cn = []; const tt = [];
        for (let r = inicioRef; r <= mesPassado; r = U.addRef(r, 1)) {
          const n = D.numeros.find((x) => x.mes_ref === r);
          rm.push(U.cap(U.nomeMesCurto(r))); ld.push(n ? n.leads : null); cn.push(n ? n.clientes_novos : null); tt.push(n ? n.clientes_atendidos : null);
        }
        const int = (v) => Math.round(v).toLocaleString('pt-BR');
        const varia = (xs) => { const v = xs.filter((x) => x != null); if (v.length < 2 || !v[v.length - 2]) return null; const d = Math.round((v[v.length - 1] / v[v.length - 2] - 1) * 1000) / 10; return el('span', { class: 'delta ' + (d >= 0 ? 'is-up' : 'is-down'), title: 'Último mês contra o anterior' }, (d >= 0 ? '↑ ' : '↓ ') + String(Math.abs(d)).replace('.', ',') + '%'); };
        const ultimoV = (xs) => { const v = xs.filter((x) => x != null); return v.length ? v[v.length - 1] : null; };
        if (ld.some((v) => v != null)) evol.leads = () => el('section', { class: 'box', 'aria-labelledby': 'leads-t' }, el('div', 'box__head', el('h2', { class: 'box__title', id: 'leads-t' }, 'Leads por mês')),
          el('div', 'kbig', el('span', 'kbig__v', int(ultimoV(ld))), varia(ld), el('span', 'kbig__lbl', 'no último mês')),
          graficoBarras({ rotulos: rm, valores: ld, fmt: int, label: 'Leads recebidos por mês: ' + rm.map((m, i) => m + ' ' + (ld[i] ?? 'sem dado')).join(', ') }));
        evol.cli = () => (tt.some((v) => v != null)
            ? el('section', { class: 'box', 'aria-labelledby': 'cli-t' }, el('div', 'box__head', el('h2', { class: 'box__title', id: 'cli-t' }, 'Clientes atendidos por mês')),
              el('div', 'kbig', el('span', 'kbig__v', int(ultimoV(tt))), varia(tt), el('span', 'kbig__lbl', 'atendidos no último mês')),
              el('div', 'chart__legend', el('span', null, el('span', { class: 'chart__sq', style: 'background:' + C.bar }), 'Novos'), el('span', null, el('span', { class: 'chart__sq', style: 'background:' + C.ref2 }), 'Voltaram')),
              graficoPilhas({ rotulos: rm, a: cn, total: tt, fmt: int, label: 'Clientes atendidos por mês, novos e que voltaram: ' + rm.map((m, i) => m + ' ' + (tt[i] ?? 'sem dado') + ' (' + (cn[i] ?? '?') + ' novos)').join(', ') }),
              penetracao(cn, tt))
            : el('section', { class: 'box', 'aria-labelledby': 'cli-t' }, el('h2', { class: 'box__title', id: 'cli-t' }, 'Clientes novos por mês'),
              graficoBarras({ rotulos: rm, valores: cn, fmt: int, label: 'Clientes novos por mês: ' + rm.map((m, i) => m + ' ' + (cn[i] ?? 'sem dado')).join(', ') })));
      }
      // um gráfico por vez, escolhido nas abas (em vez de três blocos seguidos)
      const NOMES = { fat: 'Faturamento', leads: 'Leads', cli: 'Clientes' };
      const ks = Object.keys(evol); if (!ks.includes(abaEvol)) abaEvol = ks[0];
      const tabsE = el('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Evolução mês a mês' }, ks.map((k) =>
        el('button', { class: 'tabs__btn', role: 'tab', type: 'button', 'aria-selected': String(k === abaEvol), onclick: () => { abaEvol = k; render(); } }, NOMES[k])));
      tabsE.classList.add('tabs--mini');
      const secE = evol[abaEvol](); secE.classList.add('evol');
      if (ks.length > 1) {
        let head = secE.querySelector(':scope > .box__head');
        if (!head) { const t = secE.querySelector(':scope > .box__title'); head = el('div', 'box__head'); t.replaceWith(head); head.append(t); }
        head.append(tabsE);
      }
      out.push(lado([secE], [numBox]));
      numBox = null;
    }
    if (numBox) out.push(numBox);

    out.push(...marcaTrazVenda());

    // parte "Marca": onde vai o esforço e como a marca é vista
    out.push(parte('Marca', 'A marca muda em meses, não em semanas. Medimos em pesquisas e nas buscas.'));
    let esf = null;
    if (p) {
      const marca = p.esforco_marca_pct ?? 60;
      esf = (el('section', { class: 'box', 'aria-labelledby': 'eff-t' },
        el('h2', { class: 'box__title', id: 'eff-t' }, 'Onde vai o esforço'),
        el('div', 'esf__legend',
          el('div', 'esf__item esf__item--marca', el('span', 'esf__lbl', 'Marca'), el('strong', 'esf__v', marca + '%'), el('span', 'esf__sub', 'Ser lembrada antes da compra')),
          el('div', 'esf__item esf__item--vendas', el('span', 'esf__lbl', 'Vendas'), el('strong', 'esf__v', (100 - marca) + '%'), el('span', 'esf__sub', 'Converter quem já quer comprar'))),
        el('div', 'esf__rows', esfLinha('Planejado', marca), esforcoReal(marca))));
    }
    const mv = marcaVista();
    const busca = mv.find((x) => x.getAttribute('aria-labelledby') === 'busca-t');
    out.push(...mv.filter((x) => x !== busca));
    const dp = D.disponibilidade[0];
    if (dp) {
      const DISP = { google: 'Perfil completo no Google', mapas: 'Aparece nos mapas e marketplaces', resposta: 'Responde em até 1 hora', pagamento: 'Pix, cartão e orçamento rápido', site: 'Contato em um clique', onde_procura: 'Está onde o cliente procura' };
      out.push(el('section', { class: 'box disp-c', 'aria-labelledby': 'disp-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'disp-t' }, 'Fácil de encontrar e de comprar'), el('p', 'box__note', 'Verificado em ' + U.nomeMes(dp.mes_ref))),
        el('div', 'kbig', el('span', 'kbig__v', dp.nota + '/100'), el('span', 'kbig__lbl', 'Ser lembrada só vende se for fácil achar e comprar.')),
        el('ul', 'disp-c__list', Object.entries(DISP).map(([k, t]) => el('li', dp.itens[k] ? 'is-ok' : null, el('span', { class: 'rot__ico', 'aria-hidden': 'true' }), t)))));
    }
    const parEsf = lado([esf], [busca]);
    if (parEsf) out.push(el('details', 'mais mais--res', el('summary', null, el('span', null, 'Mais sobre a marca'), el('span', 'mais__sub', 'onde vai o esforço e buscas pelo nome no Google')), parEsf));
    const apr = aprendizados(); const voz = vozDoCliente();
    if (apr.length || voz) out.push(parte('Aprendizados', 'O que funcionou, o que não funcionou e o que seus clientes dizem.'), lado(apr, [voz]));
    return out;
  };

  // dois blocos lado a lado (no celular, um embaixo do outro); se só um existir, ele ocupa a linha
  const lado = (...grupos) => { const xs = grupos.flat().filter(Boolean); return xs.length > 1 ? el('div', 'pair', xs) : xs[0] || null; };
  // começo do plano, ainda sem números: o que vai aparecer aqui e quando (em vez de várias caixas vazias)
  const quando = () => {
    if (!inicioRef || D.numeros.some((x) => x.mes_ref > inicioRef)) return null;
    const prox = U.addRef(inicioRef, 1);
    const linha = (t, d) => el('li', null, el('p', 'start__t', t), el('p', 'start__d', d));
    return el('section', { class: 'box when', 'aria-labelledby': 'when-t' },
      el('h2', { class: 'box__title', id: 'when-t' }, 'O que vai aparecer aqui, e quando'),
      el('ul', 'when__list',
        linha('Faturamento, clientes e ticket', 'A partir dos números de ' + U.nomeMes(prox) + ', enviados no começo de ' + U.nomeMes(U.addRef(prox, 1)) + '.'),
        linha('O plano pagou?', 'Com 3 meses de números, em ' + U.nomeMes(U.addRef(inicioRef, 3)) + '.'),
        linha('Como a marca é vista', D.respostas.length ? 'Já com as primeiras respostas da pesquisa, logo abaixo.' : 'Assim que a pesquisa de partida receber respostas.')));
  };
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
  let abaEvol = 'fat';

  // "a marca está trazendo venda?": propostas que fecham (e sem desconto) + clientes novos depois das ações de marca
  const marcaTrazVenda = () => {
    const a = escolhemEPagam(); const b = brandingVende();
    if (!a.length && !b.length) return [];
    const corpo = (x) => (x.length ? [...x[0].childNodes].slice(1) : []); // sem o título de cada bloco antigo
    return [sec('venda-t', 'A marca está trazendo venda?',
      el('div', a.length && b.length ? 'pair-in' : 'pair-in pair-in--one',
        a.length ? el('div', 'pair-in__col', el('p', 'eyebrow', 'Escolhem a sua marca e pagam mais'), ...corpo(a)) : null,
        b.length ? el('div', 'pair-in__col', el('p', 'eyebrow', 'Clientes novos depois das ações de marca'), ...corpo(b)) : null))];
  };

  // o esforço na prática: ações feitas ou em andamento, marcadas como marca ou venda
  // uma linha da divisão marca × vendas: barra fina em dois pedaços, com os números à direita
  const esfLinha = (rot, m, extra) => el('div', { class: 'esf__row', role: 'img', 'aria-label': rot + ': ' + m + '% marca e ' + (100 - m) + '% vendas' },
    el('span', 'esf__rot', rot),
    el('span', 'esf__bar', m ? el('span', { class: 'esf__seg esf__seg--marca', style: 'flex-grow:' + m }) : null, 100 - m ? el('span', { class: 'esf__seg esf__seg--vendas', style: 'flex-grow:' + (100 - m) }) : null),
    el('span', 'esf__num', m + ' / ' + (100 - m)), extra || null);
  const esforcoReal = (planejado) => {
    const feitas = D.acoes.filter((a) => a.esforco && a.status !== 'a_fazer');
    // alcance contínuo: cada mês do plano até agora precisa de pelo menos uma ação de marca
    const semMarca = [];
    if (inicioRef) for (let r = inicioRef; r <= hoje; r = U.addRef(r, 1)) { if (!D.acoes.some((a) => a.esforco === 'marca' && a.mes_previsto === r)) semMarca.push(r); }
    const alcance = semMarca.length ? el('p', 'insight', el('span', 'insight__lbl', 'Alcance'), el('span', null, 'Nenhuma ação de marca em ' + semMarca.map((r) => U.nomeMes(r)).join(', ') + '. A marca precisa aparecer todo mês.')) : null;
    if (feitas.length < 2) return alcance;
    const m = Math.round((feitas.filter((a) => a.esforco === 'marca').length / feitas.length) * 100);
    const longe = Math.abs(m - planejado) >= 15;
    return [esfLinha('Na prática', m, el('span', { class: 'esf__n', title: feitas.length + ' ações feitas ou em andamento' }, feitas.length + ' ações')),
      longe ? el('p', 'insight', el('span', 'insight__lbl', 'Fora do plano'), el('span', null, m < planejado ? 'A marca está recebendo menos esforço que o planejado.' : 'Vendas estão recebendo menos esforço que o planejado.')) : null,
      alcance];
  };

  // ===== a promessa do site, medida: "Venda mais. Para mais pessoas. Com mais valor." =====
  const promessa = () => {
    const nums = D.numeros.filter((n) => n.faturamento != null);
    const primeiro = nums[0]; const ultimo = nums[nums.length - 1];
    const varPct = (a, b) => (a != null && b ? Math.round((a / b - 1) * 1000) / 10 : null);
    const base = baseFat();
    const vendas = ultimo && base && (!inicioRef || ultimo.mes_ref > inicioRef) ? varPct(Number(ultimo.faturamento), base) : null;
    const comCli = nums.filter((n) => n.clientes_atendidos);
    const pessoas = comCli.length > 1 ? varPct(comCli[comCli.length - 1].clientes_atendidos, comCli[0].clientes_atendidos) : null;
    const ticket = (n) => (n && n.clientes_atendidos ? Number(n.faturamento) / n.clientes_atendidos : null);
    const valor = comCli.length > 1 ? varPct(ticket(comCli[comCli.length - 1]), ticket(comCli[0])) : null;
    return [
      ['Venda mais', vendas, 'faturamento desde o início' + (vendas != null && nums.filter((n) => !inicioRef || n.mes_ref > inicioRef).length < MESES_VEREDITO ? ' · leitura inicial' : '')],
      ['Para mais pessoas', pessoas, 'clientes atendidos por mês'],
      ['Com mais valor', valor, comCli.length ? 'ticket médio: ' + U.reais(ticket(comCli[comCli.length - 1])) : 'ticket médio'],
    ];
  };
  const placarPromessa = (acoesPor) => el('section', { class: 'promise', 'aria-label': 'Venda mais, para mais pessoas, com mais valor' },
    promessa().map(([t, v, sub], i) => {
      const k = ['vendas', 'pessoas', 'valor'][i]; const n = acoesPor ? acoesPor[k] || 0 : null;
      return el('div', 'promise__item',
        el('p', 'eyebrow', t),
        el('p', 'promise__v' + (v == null ? ' is-empty' : v < 0 ? ' is-down' : ''), v == null ? 'Aguardando números' : U.pct(v, 1)),
        el('p', 'promise__sub', sub),
        v != null && v < 0 ? el('p', 'promise__why', el('span', null, 'Por quê: '), (D.foco && D.foco['nota_' + k]) || 'O consultor explica este número no próximo encontro.') : null,
        acoesPor ? el('p', 'promise__acts' + (n ? '' : ' is-zero'), n ? n + (n === 1 ? ' ação sua move isto agora' : ' ações suas movem isto agora') : 'Nenhuma ação sua sobre isto agora') : null);
    }));

  // ===== uma resposta só para "estou mais perto da meta?": quanto falta por mês e quanto do caminho já foi feito =====
  const quantoFalta = () => {
    const base = baseFat();
    const meta = D.plano && D.plano.meta_faturamento_pct != null ? Number(D.plano.meta_faturamento_pct) : null;
    const ult = [...D.numeros].reverse().find((n) => n.faturamento != null && (!inicioRef || n.mes_ref > inicioRef));
    if (!base || !meta) return null;
    const alvo = base * (1 + meta / 100);
    if (!ult) return { alvo, base, sem: true };
    const atual = Number(ult.faturamento);
    const pct = Math.max(0, Math.min(100, Math.round(((atual - base) / (alvo - base)) * 100)));
    return { alvo, base, atual, falta: Math.max(0, alvo - atual), pct, mes: ult.mes_ref };
  };
  const metaHero = () => {
    const q = quantoFalta();
    if (!q) return null;
    if (q.sem) return el('div', 'meta-q', el('p', 'meta-q__lbl', 'Quanto falta para a meta'), el('p', 'meta-q__v is-wait', 'Aparece com os primeiros números'),
      el('p', 'meta-q__sub', 'A meta é faturar ' + U.reais(q.alvo) + ' por mês.'));
    return el('div', 'meta-q',
      el('p', 'meta-q__lbl', 'Quanto falta para a meta'),
      el('p', 'meta-q__v', q.falta ? U.reais(q.falta) + ' por mês' : 'Meta alcançada'),
      el('div', { class: 'meta-q__bar', role: 'img', 'aria-label': q.pct + '% do caminho até a meta' }, el('span', { style: 'width:' + Math.max(2, q.pct) + '%' })),
      el('p', 'meta-q__sub', q.pct + '% do caminho · hoje ' + U.reais(q.atual) + ' por mês (' + U.nomeMes(q.mes) + '), meta ' + U.reais(q.alvo)));
  };
  // o mês num lugar só: como foi (veredito) e o que vem agora (foco)
  const seuMes = () => {
    const f = D.foco;
    if (!f) return null;
    return el('section', { class: 'mes-card', 'aria-labelledby': 'mes-t' },
      el('div', 'mes-card__head', D.consultor ? avatar(D.consultor) : null,
        el('div', null, el('h2', { class: 'mes-card__t', id: 'mes-t' }, 'Seu mês · ' + U.cap(U.nomeMes(f.mes_ref))),
          el('p', 'mes-card__by', D.consultor && D.consultor.nome ? 'Escrito por ' + D.consultor.nome.split(' ')[0] : 'Escrito pelo consultor'))),
      el('div', 'mes-card__cols',
        f.veredito ? el('div', 'mes-card__col', el('p', 'mes-card__lbl', 'Como foi'), el('p', 'mes-card__txt', f.veredito)) : null,
        el('div', 'mes-card__col', el('p', 'mes-card__lbl', 'O que vem agora'), el('p', 'mes-card__txt mes-card__foco', f.titulo),
          f.texto ? el('p', 'mes-card__sub', f.texto) : null,
          el('a', { class: 'link', href: '#acoes' }, 'Ver as ações do mês'))),
      D.vereditos.filter((v) => v.mes_ref !== f.mes_ref).length ? el('details', 'verdict__hist', el('summary', null, 'Meses anteriores'),
        el('ul', null, D.vereditos.filter((v) => v.mes_ref !== f.mes_ref).map((v) => el('li', null, el('span', null, U.cap(U.nomeMes(v.mes_ref)) + ' ' + v.mes_ref.slice(0, 4)), v.veredito)))) : null);
  };
  // cada estrela leva para onde o cliente resolve aquilo
  const foca = (id) => setTimeout(() => { const f = document.getElementById(id); if (f) { f.scrollIntoView({ block: 'center', behavior: 'smooth' }); f.focus({ preventScroll: true }); } }, 450);
  const irParaEstrela = (t, e) => {
    if (/^Essenciais/.test(t)) {
      const alvo = e.alvo.find((a) => a.status !== 'feita' && comCliente(a)) || e.alvo[0];
      return { href: '#acoes', dica: 'abrir em Ações', onclick: () => { if (alvo) abreAcao = alvo.id; } };
    }
    if (/^Números/.test(t)) return { href: '#resultados', dica: 'enviar em Resultados', onclick: () => foca('n-fat') };
    if (/^Presença/.test(t)) return { href: '#consultoria', dica: 'ver em Encontros e prazos', onclick: null };
    if (/^Ações avaliadas/.test(t)) {
      const alvo = e.acs.find((a) => a.status === 'feita' && !a.resultado && comCliente(a));
      return { href: '#acoes', dica: 'responder em Ações', onclick: () => { abaAcoes = 'feitas'; if (alvo) abreAcao = alvo.id; } };
    }
    return { href: '#resultados', dica: 'registrar em Resultados', onclick: () => foca('voz-txt') };
  };

  // ===== missões do mês: o que o cliente faz agora, em cartões simples (ações, números e encontro) =====
  const missoes = () => {
    const doMes = D.acoes.filter((a) => comCliente(a) && (a.mes_previsto === hoje || (a.status !== 'feita' && a.mes_previsto < hoje)));
    const itens = doMes.map((a) => {
      const pz = prazo(a);
      return { feita: a.status === 'feita', ord: a.status === 'feita' ? '9' : (a.prazo || '8'), titulo: a.titulo,
        sub: a.status === 'feita' ? 'Feita' : pz.text, hot: a.status !== 'feita' && pz.hot, tipo: 'acao', href: '#acoes', onclick: () => { abreAcao = a.id; },
        botao: a.status === 'em_andamento' ? 'Continuar' : 'Começar', andamento: a.status === 'em_andamento' };
    });
    if (!semNumeros && inicioRef && mesPassado >= inicioRef) {
      const ok = !faltaNumeros();
      itens.push({ feita: ok, ord: ok ? '9' : '0', titulo: 'Enviar os números de ' + U.nomeMes(mesPassado), sub: ok ? 'Enviados' : 'Leva 2 minutos', hot: !ok, tipo: 'num', botao: 'Enviar',
        href: '#resultados', onclick: () => { setTimeout(() => { const f = document.getElementById('n-fat'); if (f) { f.scrollIntoView({ block: 'center' }); f.focus({ preventScroll: true }); } }, 400); } });
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
    const card = (x) => el('a', { class: 'missao missao--' + x.tipo + (x.feita ? ' is-ok' : '') + (x.andamento ? ' is-doing' : ''), href: x.href, onclick: x.onclick || null, title: x.titulo },
      el('span', 'missao__top', el('span', { class: 'missao__ico', 'aria-hidden': 'true' }), el('span', 'missao__s' + (x.hot ? ' is-hot' : ''), x.sub)),
      el('span', 'missao__t', curto(x.titulo)),
      el('span', 'missao__btn' + (x.feita ? ' is-ok' : ''), x.feita ? 'Feita' : x.botao));
    return el('section', { class: 'missoes', 'aria-labelledby': 'mis-t' },
      el('div', 'missoes__head',
        el('div', null, el('h2', { class: 'missoes__t', id: 'mis-t' }, 'Missões de ' + U.nomeMes(hoje)),
          D.foco ? el('p', 'missoes__foco', 'Foco: ' + D.foco.titulo.replace(/\.$/, '')) : null),
        itens.length ? el('div', 'missoes__prog', el('span', 'missoes__n', feitas + ' de ' + itens.length),
          el('span', 'missoes__bar', el('span', { style: 'width:' + Math.round(feitas / itens.length * 100) + '%' }))) : null),
      itens.length ? el('div', 'missoes__grid', itens.map(card)) : el('p', 'missoes__vazio', 'Nenhuma missão neste mês. O consultor monta as próximas com você.'),
      feitas === itens.length && itens.length ? el('p', 'missoes__ok', 'Mês completo. Missão cumprida!') : null);
  };

  // a rotina do cliente: o que fazer toda semana, todo mês e a cada 6 meses (e o que já está feito)
  const suaRotina = () => {
    const seteDias = Date.now() - 7 * 864e5;
    const mexeu = D.acoes.some((a) => a.atualizada_em && new Date(a.atualizada_em).getTime() > seteDias && a.atualizada_por === me.id);
    const numOk = semNumeros || !faltaNumeros();
    const leu = !!D.foco;
    const seisMeses = new Date(); seisMeses.setMonth(seisMeses.getMonth() - 6);
    const pesqOk = (D.respostas || []).some((r) => new Date(r.criada_em || 0) > seisMeses);
    const item = (ok, t, href) => el('li', ok ? 'is-ok' : null, el('span', { class: 'rot__ico', 'aria-hidden': 'true' }), el('a', { href }, t));
    return el('section', { class: 'rot', 'aria-labelledby': 'rot-t' },
      el('h2', { class: 'rot__t', id: 'rot-t' }, 'Sua rotina'),
      el('div', 'rot__cols',
        el('div', 'rot__col', el('p', 'rot__lbl', 'Toda semana'), el('ul', null, item(mexeu, 'Atualizar as ações e os passos', '#acoes'))),
        el('div', 'rot__col', el('p', 'rot__lbl', 'Começo do mês'), el('ul', null,
          semNumeros ? null : item(numOk, 'Enviar os números (2 minutos)', '#resultados'),
          item(leu, 'Ler o seu mês: como foi e o que vem', '#plano'))),
        el('div', 'rot__col', el('p', 'rot__lbl', 'No encontro'), el('ul', null, item(D.encontros.some((x) => x.inicio.slice(0, 7) === hoje && x.status === 'realizado'), 'Ver os resultados com o consultor', '#resultados'))),
        el('div', 'rot__col', el('p', 'rot__lbl', 'A cada 6 meses'), el('ul', null, item(pesqOk, 'Mandar a pesquisa para os seus clientes', '#resultados')))));
  };

  // ===== O plano pagou? o faturamento real contra o que seria se nada mudasse (o ponto de partida) =====
  const contaPlano = () => {
    const base = baseFat();
    const ns = D.numeros.filter((n) => n.faturamento != null && (!inicioRef || n.mes_ref > inicioRef));
    if (!base || !ns.length) return null;
    const real = ns.reduce((a, n) => a + Number(n.faturamento), 0);
    const ant = (D.plano && D.plano.fat_ano_anterior) || {};
    const sazonal = ns.every((n) => ant[n.mes_ref.slice(5)] != null);
    // com o faturamento do ano anterior, cada mês é comparado com o mesmo mês (dezembro com dezembro); sem ele, com a média
    const semPlano = sazonal ? ns.reduce((a, n) => a + Number(ant[n.mes_ref.slice(5)]), 0) : base * ns.length;
    const extra = real - semPlano;
    const mens = D.plano && D.plano.mensalidade ? Number(D.plano.mensalidade) : null;
    const investido = mens ? mens * mesN : null;
    return { real, semPlano, extra, meses: ns.length, investido, volta: investido ? extra / investido : null, sazonal };
  };
  const MESES_VEREDITO = 3; // com menos que isso, a variação normal de um mês pesa mais que o efeito do plano
  const planoPagou = () => {
    const c = contaPlano();
    if (!c) return [];
    if (c.meses < MESES_VEREDITO) {
      return [sec('pagou-t', 'O plano pagou?',
        el('div', 'forming',
          el('div', 'forming__top', chip('doing', 'Em formação'), el('span', 'forming__count', c.meses + ' de ' + MESES_VEREDITO + ' meses de números')),
          el('div', { class: 'forming__steps', 'aria-hidden': 'true' }, Array.from({ length: MESES_VEREDITO }, (_, i) => el('span', i < c.meses ? 'is-on' : null))),
          el('div', 'forming__stat', el('span', 'forming__lbl', 'Parcial até agora'),
            el('strong', 'forming__v' + (c.extra >= 0 ? ' is-up' : ' is-down'), (c.extra >= 0 ? '+' : '−') + U.reais(Math.abs(c.extra))),
            el('span', 'forming__lbl', c.sazonal ? 'contra os mesmos meses do ano anterior' : 'contra a média de antes do plano'))),
        el('p', 'box__text', 'O veredito sai com ' + MESES_VEREDITO + ' meses: com menos, ainda não dá para separar o efeito do plano da variação normal do faturamento.'),
        el('p', 'paid__foot', c.sazonal ? 'Cada mês é comparado com o mesmo mês do ano anterior, para a época do ano não enganar.' : 'A comparação é com a média mensal de antes do plano. Com o faturamento mês a mês do ano anterior, o consultor deixa a conta mais justa.'))];
    }
    const max = Math.max(c.semPlano, c.real);
    const barra = (rot, v, cls) => el('div', 'paid__row',
      el('p', 'paid__lab', rot),
      el('div', 'paid__track', el('span', { class: cls || '', style: 'width:' + Math.round(v / max * 100) + '%' })),
      el('p', 'paid__num', U.reais(v)));
    const out = [
      // 1. a resposta
      el('div', 'paid__hero',
        el('p', 'paid__big' + (c.extra < 0 ? ' is-minus' : ''), (c.extra >= 0 ? '+' : '−') + U.reais(Math.abs(c.extra))),
        el('p', 'paid__cap', (c.extra >= 0 ? 'a mais' : 'a menos') + ' em faturamento desde o início do plano')),
      // 2. de onde vem o número
      el('div', 'paid__bars', barra(c.sazonal ? 'Mesmos meses, ano anterior' : 'Se nada mudasse', c.semPlano, 'is-base'), barra('Com o plano', c.real, 'is-plan')),
    ];
    // 3. o investimento voltou?
    if (c.investido) {
      const pct = Math.max(0, Math.min(100, Math.round(c.extra / c.investido * 100)));
      out.push(el('div', 'paid__roi',
        el('div', 'paid__roi-head', el('p', 'eyebrow', 'Retorno do investimento na consultoria'),
          el('p', 'paid__roi-v', c.volta >= 1 ? 'Pagou ' + c.volta.toFixed(1).replace('.', ',') + ' vezes' : pct + '% já voltou')),
        el('div', 'paid__track paid__track--roi', el('span', { style: 'width:' + pct + '%' })),
        el('p', 'box__note', c.volta >= 1 ? 'Cada R$ 1 investido voltou R$ ' + c.volta.toFixed(1).replace('.', ',') + ' em faturamento.'
          : U.reais(Math.max(0, c.extra)) + ' de ' + U.reais(c.investido) + ' investidos. Marca leva meses para render.')));
    }
    out.push(el('p', 'paid__foot', (c.meses === 1 ? '1 mês informado' : c.meses + ' meses informados') + (c.sazonal ? ', cada um comparado com o mesmo mês do ano anterior (a época do ano não engana). Não separa o efeito do plano do mercado.' : ', comparado ao faturamento de partida. Não separa o efeito do plano de sazonalidade ou do mercado.')));
    return [sec('pagou-t', 'O plano pagou?', out)];
  };

  // ===== Quanto custa a meta? as alavancas do site: mais pessoas (clientes) ou mais valor (ticket) =====
  const simulador = () => {
    const base = baseFat();
    const meta = D.plano && D.plano.meta_faturamento_pct != null ? Number(D.plano.meta_faturamento_pct) : null;
    const ult = [...D.numeros].reverse().find((n) => n.clientes_atendidos && n.faturamento != null);
    if (!base || !meta || !ult) return [];
    const alvo = base * (1 + meta / 100);
    const c0 = ult.clientes_atendidos; const t0 = Number(ult.faturamento) / c0;
    const cNec = Math.ceil(alvo / t0); const tNec = alvo / c0;
    const caminho = (t, v, d) => el('div', 'sim__path', el('p', 'eyebrow', t), el('p', 'sim__v', v), el('p', 'box__note', d));
    const cIn = el('input', { type: 'range', id: 'sim-c', min: Math.max(1, Math.floor(c0 * 0.5)), max: Math.ceil(Math.max(cNec, c0) * 1.6), step: 1, value: c0 });
    const tIn = el('input', { type: 'range', id: 'sim-t', min: Math.round(t0 * 0.5), max: Math.round(Math.max(tNec, t0) * 1.5), step: 50, value: Math.round(t0) });
    const cOut = el('output', { for: 'sim-c' }); const tOut = el('output', { for: 'sim-t' });
    const bar = el('span'); const res = el('p', { class: 'sim__res', role: 'status', 'aria-live': 'polite' });
    const atualiza = () => {
      const c = Number(cIn.value); const t = Number(tIn.value); const proj = c * t;
      cOut.textContent = c + ' clientes'; tOut.textContent = U.reais(t);
      bar.style.width = Math.min(100, Math.round(proj / alvo * 100)) + '%';
      res.textContent = proj >= alvo ? 'Chega na meta: ' + U.reais(proj) + ' por mês.' : 'Faltam ' + U.reais(alvo - proj) + ' por mês para a meta (' + U.reais(proj) + ' de ' + U.reais(alvo) + ').';
      res.className = 'sim__res' + (proj >= alvo ? ' is-ok' : '');
    };
    cIn.addEventListener('input', atualiza); tIn.addEventListener('input', atualiza); atualiza();
    return [sec('sim-t', 'Como chegar à meta',
      el('p', 'box__text', 'A meta é faturar ' + U.reais(alvo) + ' por mês (' + U.pct(meta, 0) + '). Hoje são ' + c0 + ' clientes por mês com ticket médio de ' + U.reais(t0) + '. Há dois caminhos, e dá para combinar:'),
      el('div', 'sim__paths',
        caminho('Para mais pessoas', cNec + ' clientes/mês', 'mantendo o ticket de hoje (+' + (cNec - c0) + ' clientes)'),
        caminho('Com mais valor', U.reais(tNec), 'de ticket médio, com os mesmos ' + c0 + ' clientes')),
      el('div', 'sim__ctl',
        el('div', null, el('label', { class: 'label', for: 'sim-c' }, 'Clientes por mês'), cIn, cOut),
        el('div', null, el('label', { class: 'label', for: 'sim-t' }, 'Ticket médio'), tIn, tOut)),
      el('div', 'sim__bar', bar), res,
      el('p', 'box__note', 'Marca forte trabalha nas duas alavancas: é lembrada por mais pessoas e faz o cliente aceitar pagar mais.'))];
  };

  // ===== Branding vende mesmo? os meses com ação de marca contra os clientes novos que vieram depois =====
  const brandingVende = () => {
    if (!inicioRef) return [];
    const rot = []; const cn = []; const marcaM = [];
    for (let r = inicioRef; r <= mesPassado; r = U.addRef(r, 1)) {
      const n = D.numeros.find((x) => x.mes_ref === r);
      rot.push(U.cap(U.nomeMesCurto(r))); cn.push(n ? n.clientes_novos : null);
      marcaM.push(D.acoes.some((a) => a.esforco === 'marca' && a.mes_previsto === r && a.status !== 'a_fazer'));
    }
    if (cn.filter((v) => v != null).length < 2) return [];
    const ch = grafico('chart--bars', 'Clientes novos por mês; meses com ação de marca marcados: ' + rot.map((m, i) => m + ' ' + (cn[i] ?? 'sem dado') + (marcaM[i] ? ' (ação de marca)' : '')).join(', '), (W, tip, box) => {
      const H = 200; const L = 36; const R = 8; const T = 20; const B = 44;
      const max = Math.max(1, ...cn.filter((v) => v != null)); const tk = ticks(0, max, 3); const top = tk[tk.length - 1];
      const y = (v) => T + (H - T - B) * (1 - v / top);
      const n = cn.length; const banda = (W - L - R) / n; const bw = Math.min(40, banda * 0.5);
      const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
      tk.forEach((t) => svg.append(sv('line', { x1: L, x2: W - R, y1: y(t), y2: y(t), stroke: C.grid, 'stroke-width': 1, 'stroke-dasharray': t === tk[0] ? null : '3 4' }), sv('text', { x: L - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'chart__axis' }, t)));
      cn.forEach((v, i) => {
        const cx = L + banda * i + banda / 2;
        svg.append(sv('text', { x: cx, y: H - 24, 'text-anchor': 'middle', class: 'chart__axis' }, rot[i]));
        if (marcaM[i]) svg.append(sv('rect', { x: cx - 5, y: H - 14, width: 10, height: 10, rx: 2, fill: C.acc }));
        if (v == null || v <= 0) return;
        const x0 = cx - bw / 2; const y0 = y(v); const yb = y(0); const r = Math.min(7, (yb - y0) / 2, bw / 2);
        svg.append(sv('path', { d: `M${x0} ${yb}V${y0 + r}Q${x0} ${y0} ${x0 + r} ${y0}H${x0 + bw - r}Q${x0 + bw} ${y0} ${x0 + bw} ${y0 + r}V${yb}Z`, fill: '#dadada' }),
          sv('text', { x: cx, y: y0 - 6, 'text-anchor': 'middle', class: 'chart__end' }, v));
      });
      return svg;
    });
    return [sec('halo-t', 'Branding vende mesmo?',
      el('p', 'box__text', 'Marca não vende na hora. O efeito costuma aparecer de 2 a 3 meses depois: mais gente lembra, procura e vira cliente. Compare os meses com ação de marca com os clientes novos que vieram depois.'),
      el('div', 'chart__legend', el('span', null, el('span', { class: 'chart__sq', style: 'background:#dadada' }), 'Clientes novos'), el('span', null, el('span', { class: 'chart__sq', style: 'background:' + C.acc }), 'Mês com ação de marca')),
      ch,
      el('p', 'box__note', 'Leitura de tendência, não de causa: outros fatores também mexem nos clientes novos. Por isso não vale cortar marca no primeiro mês sem resultado.'))];
  };

  // "escolhem sua marca e pagam mais, sem hesitar": fechamento de propostas e fechamentos sem desconto
  const escolhemEPagam = () => {
    const ns = D.numeros.filter((n) => n.propostas);
    if (!ns.length) return [];
    const u = ns[ns.length - 1]; const p0 = ns[0];
    const tx = (n) => (n.propostas ? Math.round((n.fechadas || 0) / n.propostas * 100) : null);
    const sd = (n) => (n.fechadas ? Math.round((n.sem_desconto || 0) / n.fechadas * 100) : null);
    const d = (a, b) => (ns.length > 1 && a != null && b != null ? (a - b > 0 ? '+' : '') + (a - b) + ' pontos desde o início' : null);
    return [sec('esc-t', 'Escolhem a sua marca e pagam mais',
      el('p', 'box__text', 'De cada 10 propostas, quantas fecham, e quantas fecham sem o cliente pedir desconto. É o sinal mais direto de que reconhecem o valor do que você oferece.'),
      el('div', 'stats',
        el('div', 'stat', el('p', 'stat__label', 'Propostas que fecham'), el('p', 'stat__value', tx(u) + '%'), d(tx(u), tx(p0)) ? el('p', 'stat__delta', d(tx(u), tx(p0))) : null),
        el('div', 'stat', el('p', 'stat__label', 'Fecham sem pedir desconto'), el('p', 'stat__value', (sd(u) ?? '—') + (sd(u) != null ? '%' : '')), d(sd(u), sd(p0)) ? el('p', 'stat__delta', d(sd(u), sd(p0))) : null)),
      el('p', 'box__note', 'Último mês informado: ' + U.nomeMes(u.mes_ref) + ' · ' + u.propostas + ' propostas, ' + (u.fechadas || 0) + ' fechadas, ' + (u.sem_desconto || 0) + ' sem desconto.'))];
  };

  // o funil da clareza (o mesmo do site): o que você enxerga, o que comunica, o que as pessoas ouvem, o que entendem
  const funilClareza = (atual) => {
    const resp = D.pedidos.filter((p) => p.status !== 'em_analise');
    const comunica = resp.length ? Math.round(resp.filter((p) => p.status === 'aprovado').length / resp.length * 100) : null;
    const ouvem = atual.ment != null ? atual.ment : atual.lemb;
    const rs = D.respostas.filter((r) => r.pesquisa_id === atual.q.id && r.entende != null);
    const entendem = rs.length ? Math.round(rs.filter((r) => r.entende).length / rs.length * 100) : null;
    const linhas = [
      ['O que você enxerga', 100, 'Tudo, com absoluta clareza.'],
      ['O que comunica', comunica, 'Peças que saem no padrão da marca (aprovadas na revisão).'],
      ['O que as pessoas ouvem', ouvem, 'Lembram da sua marca nas situações de compra.'],
      ['O que elas entendem', entendem, 'Escolhem a sua mensagem central como a frase que descreve a marca.'],
    ];
    return el('div', 'funnel',
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
      const doGrupo = (r) => grupoPesq === 'todos' || (grupoPesq === 'novos' ? r.ja_cliente === false : r.ja_cliente === true);
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
        return { q, n, lemb, pref, medias, ment, rede, fatia, porSit };
      });
      // resultados: a última rodada com respostas (comparada à anterior com respostas); o link: a rodada aberta
      const comResp = stats.filter((x) => x.n > 0);
      const atual = comResp[comResp.length - 1] || stats[stats.length - 1];
      const ant = comResp.length > 1 ? comResp[comResp.length - 2] : null;
      const aberta = [...pesq].reverse().find((x) => x.aberta);
      const delta = (a, b) => (b == null || a == null ? null : a - b);
      const tile = (rot, v, d) => el('div', 'stat', el('p', 'stat__label', rot), el('p', 'stat__value', v == null ? '—' : (atual.n < 30 ? '≈' : '') + v + '%'),
        d != null ? el('p', 'stat__delta', (d > 0 ? '+' : '') + d + ' pontos desde a rodada anterior') : null);
      const box = el('section', { class: 'box', 'aria-labelledby': 'pesq-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'pesq-t' }, 'Como a marca é vista'),
          atual.n && atual.n < 30
            ? el('span', { class: 'chip chip--doing', title: 'Com menos de 30 respostas, leia como tendência: uma pessoa a mais muda o resultado em vários pontos.' }, 'Amostra pequena · ' + atual.n + (atual.n === 1 ? ' resposta' : ' respostas'))
            : el('p', 'box__note', atual.q.titulo + ' · ' + atual.n + (atual.n === 1 ? ' resposta' : ' respostas'))),
        el('p', 'box__text', 'O que seus clientes responderam na pesquisa ' + (atual.q.titulo ? '“' + atual.q.titulo + '”' : '') + '.'));
      if (temGrupo) {
        const nG = (g) => D.respostas.filter((r) => r.pesquisa_id === atual.q.id && (g === 'todos' || (g === 'novos' ? r.ja_cliente === false : r.ja_cliente === true))).length;
        box.append(el('div', 'grupo',
          el('div', { class: 'tabs tabs--mini', role: 'tablist', 'aria-label': 'Quem respondeu' }, [['novos', 'Ainda não compram'], ['todos', 'Todos'], ['clientes', 'Clientes']].map(([g, t]) =>
            el('button', { class: 'tabs__btn', role: 'tab', type: 'button', 'aria-selected': String(grupoPesq === g), onclick: () => { grupoPesq = g; render(); } }, t + ' (' + nG(g) + ')'))),
          el('p', 'box__note', grupoPesq === 'novos' ? 'O número que mostra crescimento: a marca sendo lembrada por quem ainda não é cliente.' : grupoPesq === 'clientes' ? 'Clientes lembram mais da marca; use para ver a experiência, não o crescimento.' : 'Clientes e não clientes juntos.')));
      }
      const resumo = el('div', 'vista-resumo'); box.append(resumo);
      const colA = el('div', 'vista__col'); const colB = el('div', 'vista__col');
      const mais = el('details', 'mais', el('summary', null, el('span', null, 'Ver a pesquisa em detalhe'), el('span', 'mais__sub', 'antes e depois, funil, palavras e situações de compra')), el('div', 'vista', colA, colB));
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
        resumo.append(el('div', 'stats vista-kpis',
          atual.fatia != null ? tile('Das marcas lembradas, quantas são vocês', atual.fatia, delta(atual.fatia, ant && ant.fatia)) : null,
          atual.ment != null ? tile('Lembram de vocês na hora de comprar', atual.ment, delta(atual.ment, ant && ant.ment)) : null,
          tile('Lembram do nome sozinhos', atual.lemb, delta(atual.lemb, ant && ant.lemb)),
          tile('Escolheriam vocês hoje', atual.pref, delta(atual.pref, ant && ant.pref))));
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
            el('div', 'hbars', atual.porSit.map((x) => el('div', 'hbar hbar--pair',
              el('p', 'hbar__label', x.texto),
              el('div', 'hbar__pair',
                el('div', 'hbar__track', el('span', { class: 'hbar__fill', style: 'width:' + x.sua + '%' })),
                el('div', 'hbar__track', el('span', { class: 'hbar__fill hbar__fill--rival', style: 'width:' + x.rival + '%' }))),
              el('p', 'hbar__value', x.sua + '%', el('span', 'muted', x.rivalNome ? ' · ' + x.rivalNome + ' ' + x.rival + '%' : ' · nenhum concorrente'))))),
            el('p', 'box__note', 'Quem lembra da marca a liga, em média, a ' + String(atual.rede).replace('.', ',') + ' situações.'));
        }
        const af = atual.q.afirmacoes || [];
        if (af.length) {
          colB.append(el('p', 'eyebrow', 'Quanto concordam (0 a 100)'),
            el('p', 'box__note', 'Lê com cuidado: notas de frases sobem principalmente com quem já conhece e usa a marca. Para crescer, valem mais as situações de compra acima.'), el('div', 'hbars', af.map((t, i) => el('div', 'hbar',
            el('p', 'hbar__label', t),
            el('div', 'hbar__track', el('span', { class: 'hbar__fill', style: 'width:' + (atual.medias[i] || 0) + '%' })),
            el('p', 'hbar__value', atual.medias[i] == null ? '—' : String(atual.medias[i]),
              ant && ant.medias[i] != null ? el('span', 'muted', ' (antes ' + ant.medias[i] + ')') : null)))));
        }
      }
      if (atual.n) box.append(mais);
      if (aberta) {
        const url = location.origin + '/pesquisa.html?t=' + aberta.token;
        // mensagem pronta para o cliente mandar aos clientes dele (editável), com o link dentro
        const nomeMarca = D.empresa ? D.empresa.nome : 'nossa empresa';
        const convite = el('textarea', { class: 'field share__msg', id: 'convite', rows: 5, 'aria-label': 'Mensagem de convite para a pesquisa' });
        convite.value = 'Oi! Aqui é da ' + nomeMarca + '. Estamos ouvindo nossos clientes para melhorar cada vez mais o nosso trabalho, e a sua opinião é muito importante para nós. '
          + 'Você pode responder uma pesquisa rápida? Leva 2 minutos e é anônima:\n\n' + url + '\n\nMuito obrigado!';
        const texto = () => convite.value.trim();
        const copia = el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: async () => {
          try { await navigator.clipboard.writeText(texto()); copia.textContent = 'Copiada ✓'; clearTimeout(copia._t); copia._t = setTimeout(() => { copia.textContent = 'Copiar mensagem'; }, 2000); } catch (e) { convite.select(); }
        } }, 'Copiar mensagem');
        const wa = el('a', { class: 'btn btn--ghost btn--sm', target: '_blank', rel: 'noopener', href: '#' }, 'Enviar no WhatsApp');
        const mail = el('a', { class: 'btn btn--ghost btn--sm', href: '#' }, 'Enviar por e-mail');
        const atualiza = () => {
          wa.href = 'https://wa.me/?text=' + encodeURIComponent(texto());
          mail.href = 'mailto:?subject=' + encodeURIComponent('Pode nos ajudar com 2 minutos? · ' + nomeMarca) + '&body=' + encodeURIComponent(texto());
        };
        convite.addEventListener('input', atualiza); atualiza();
        const copiaLink = el('button', { class: 'link', type: 'button', onclick: async () => {
          try { await navigator.clipboard.writeText(url); copiaLink.textContent = 'Link copiado ✓'; clearTimeout(copiaLink._t); copiaLink._t = setTimeout(() => { copiaLink.textContent = 'Copiar só o link'; }, 2000); } catch (e) { window.prompt('Copie o link:', url); }
        } }, 'Copiar só o link');
        box.append(el('div', 'share',
          el('div', 'share__head', el('div', null, el('p', 'share__t', 'Convide mais pessoas'),
            el('p', 'box__note', 'Quanto mais respostas, mais confiável (o ideal é passar de 30). Vale mandar também para quem ainda não comprou.')),
            el('div', 'share__btns', copia, wa, mail)),
          el('details', 'share__edit', el('summary', null, 'Ver e editar a mensagem'), convite, copiaLink)));
      }
      out.push(box);
    }
    if (D.buscas.length >= 2) {
      out.push(el('section', { class: 'box', 'aria-labelledby': 'busca-t' },
        el('div', 'box__head', el('h2', { class: 'box__title', id: 'busca-t' }, 'Buscas pelo nome da marca'), el('p', 'box__note', 'Google Trends, mês a mês')),
        el('p', 'box__text', 'De todas as buscas pela categoria e pelas marcas concorrentes, quantas são pela sua marca. Quando sobe, a marca está sendo mais lembrada.'),
        graficoLinhas({ rotulos: D.buscas.map((b) => U.cap(U.nomeMesCurto(b.mes_ref))), fmt: (v) => Math.round(v) + '%',
          label: 'Participação da marca nas buscas: ' + D.buscas.map((b) => U.nomeMesCurto(b.mes_ref) + ' ' + b.marca_pct + '%').join(', '),
          series: [{ nome: 'Sua marca', valores: D.buscas.map((b) => Number(b.marca_pct)), cor: C.acc, pontos: true, rotuloFim: true }] }),
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

  // a voz do cliente final
  const vozDoCliente = () => {
    const txt = el('textarea', { class: 'field', id: 'voz-txt', rows: 2, maxlength: 1000, placeholder: '“Achei que vocês eram uma empresa nova, bem mais séria.”' });
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const f = el('form', { class: 'voice__form', novalidate: true },
      el('label', { class: 'label', for: 'voz-txt' }, 'Algo que um cliente disse este mês'), txt,
      el('div', 'numbers__foot', el('button', { class: 'btn btn--ghost btn--sm', type: 'submit' }, 'Registrar'), msg));
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const t = txt.value.trim(); if (!t) return U.say(msg, 'Escreva a frase.', 'error');
      const { error } = await sb.rpc('portal_registrar_voz', { p_texto: t });
      if (error) return U.say(msg, 'Não foi possível salvar.', 'error');
      D.vozes.unshift({ texto: t, mes_ref: hoje, criada_em: new Date().toISOString() }); render(); anuncia('Frase registrada.');
    });
    return el('section', { class: 'box', 'aria-labelledby': 'voz-t' },
      el('h2', { class: 'box__title', id: 'voz-t' }, 'O que seus clientes disseram'),
      el('p', 'box__text', 'Frases reais de clientes sobre a marca: elogios, dúvidas, comparações. Mostram, mês a mês, se a percepção está mudando.'),
      f,
      D.vozes.length ? el('ul', 'voices', D.vozes.slice(0, 12).map((v) => el('li', null, el('p', 'voices__text', v.texto), el('p', 'box__note', U.cap(U.nomeMes(v.mes_ref)) + ' ' + v.mes_ref.slice(0, 4))))) : null);
  };

  const tabela = (cols, linhas) => el('div', 'table-wrap', el('table', 'table',
    el('thead', null, el('tr', null, cols.map((c) => el('th', { scope: 'col' }, c)))),
    el('tbody', null, linhas.map((l) => el('tr', null, l.map((v, i) => (i === 0 ? el('th', { scope: 'row' }, v) : el('td', null, v))))))));

  const formNumeros = (atual) => {
    const prox = D.proximo;
    const f = el('form', { class: 'box numbers', novalidate: true, 'aria-labelledby': 'num-t' },
      el('div', 'box__head', el('h2', { class: 'box__title', id: 'num-t' }, 'Números de ' + U.nomeMes(mesPassado)),
        el('p', 'box__note', 'Leva 2 minutos' + (prox ? ' · usamos no encontro de ' + U.dia(prox.inicio) : ''))),
      el('div', 'numbers__grid',
        el('div', null, el('label', { class: 'label', for: 'n-fat' }, 'Faturamento do mês (R$)'),
          el('input', { class: 'field', id: 'n-fat', 'data-moeda': '', inputmode: 'numeric', autocomplete: 'off', placeholder: 'R$ 0,00', value: atual && atual.faturamento != null ? U.moedaFmt(atual.faturamento) : null })),
        el('div', null, el('label', { class: 'label', for: 'n-leads' }, 'Leads recebidos'),
          el('input', { class: 'field', id: 'n-leads', type: 'number', min: 0, step: 1, inputmode: 'numeric', value: atual ? atual.leads : null })),
        el('div', null, el('label', { class: 'label', for: 'n-tot' }, 'Clientes atendidos no mês (total)'),
          el('input', { class: 'field', id: 'n-tot', type: 'number', min: 0, step: 1, inputmode: 'numeric', value: atual ? atual.clientes_atendidos : null })),
        el('div', null, el('label', { class: 'label', for: 'n-cli' }, 'Desses, quantos eram novos'),
          el('input', { class: 'field', id: 'n-cli', type: 'number', min: 0, step: 1, inputmode: 'numeric', value: atual ? atual.clientes_novos : null })),
        el('div', null, el('label', { class: 'label', for: 'n-prop' }, 'Propostas enviadas'),
          el('input', { class: 'field', id: 'n-prop', type: 'number', min: 0, step: 1, inputmode: 'numeric', value: atual ? atual.propostas : null })),
        el('div', null, el('label', { class: 'label', for: 'n-fech' }, 'Propostas fechadas'),
          el('input', { class: 'field', id: 'n-fech', type: 'number', min: 0, step: 1, inputmode: 'numeric', value: atual ? atual.fechadas : null })),
        el('div', null, el('label', { class: 'label', for: 'n-sd' }, 'Fechadas sem pedir desconto'),
          el('input', { class: 'field', id: 'n-sd', type: 'number', min: 0, step: 1, inputmode: 'numeric', value: atual ? atual.sem_desconto : null }))),
      el('div', 'numbers__foot',
        el('button', { class: 'btn btn--light', type: 'submit' }, atual ? 'Salvar correção' : 'Enviar números'),
        atual ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => { corrigindo = false; render(); } }, 'Cancelar') : null,
        el('p', { class: 'msg', id: 'n-msg', role: 'status', 'aria-live': 'polite' })));
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      // aceita "102.000,50", "102000", "102 000"
      const fat = Number($('n-fat').value.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
      const leads = $('n-leads').value === '' ? null : parseInt($('n-leads').value, 10);
      const cli = $('n-cli').value === '' ? null : parseInt($('n-cli').value, 10);
      const tot = $('n-tot').value === '' ? null : parseInt($('n-tot').value, 10);
      const int = (id) => ($(id).value === '' ? null : parseInt($(id).value, 10));
      const prop = int('n-prop'); const fech = int('n-fech'); const sd = int('n-sd');
      if (prop != null && fech != null && fech > prop) return U.say($('n-msg'), 'As fechadas não podem passar das propostas enviadas.', 'error');
      if (fech != null && sd != null && sd > fech) return U.say($('n-msg'), 'As fechadas sem desconto não podem passar das fechadas.', 'error');
      if (tot != null && cli != null && cli > tot) return U.say($('n-msg'), 'Os clientes novos não podem passar do total atendido.', 'error');
      if (!$('n-fat').value.trim() || !Number.isFinite(fat) || fat < 0) return U.say($('n-msg'), 'Informe o faturamento do mês.', 'error');
      if ((leads != null && leads < 0) || (cli != null && cli < 0)) return U.say($('n-msg'), 'Use números positivos.', 'error');
      const btn = f.querySelector('[type=submit]'); btn.disabled = true; U.say($('n-msg'), 'Enviando…');
      const { error } = await sb.rpc('portal_enviar_numeros', { p_mes: mesPassado, p_faturamento: fat, p_leads: leads, p_clientes: cli, p_atendidos: tot, p_propostas: prop, p_fechadas: fech, p_sem_desconto: sd });
      btn.disabled = false;
      if (error) return U.say($('n-msg'), error.message || 'Não foi possível enviar.', 'error');
      const row = { mes_ref: mesPassado, faturamento: fat, leads, clientes_novos: cli, clientes_atendidos: tot, propostas: prop, fechadas: fech, sem_desconto: sd, enviado_em: new Date().toISOString() };
      const i = D.numeros.findIndex((n) => n.mes_ref === mesPassado);
      if (i >= 0) D.numeros[i] = { ...D.numeros[i], ...row }; else { D.numeros.push(row); D.numeros.sort((a, b) => (a.mes_ref < b.mes_ref ? -1 : 1)); }
      corrigindo = false; render(); indicadores();
      anuncia('Números de ' + U.nomeMes(mesPassado) + ' enviados. Obrigado!');
    });
    return f;
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

  const telaConsultoria = () => {
    const p = D.plano;
    const ativo = !p || p.status === 'ativo';
    const out = [head(null, 'Encontros e prazos', 'O próximo encontro, os prazos do mês e o que já conversamos.',
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

    out.push(meet, ...telaCalendario().slice(1));

    // encontros anteriores
    const passados = D.encontros.filter((x) => x.status === 'realizado' || new Date(x.inicio).getTime() <= agoraMs).reverse();
    if (passados.length) {
      out.push(el('section', { class: 'box box--line', 'aria-labelledby': 'past-t' },
        el('h2', { class: 'box__title', id: 'past-t' }, 'Encontros anteriores'),
        el('div', 'past', passados.map((x, i) => {
          const dec = (x.decisoes || []).length ? x.decisoes : null;
          return el('details', { class: 'past__item', open: i === 0 },
            el('summary', null, U.cap(U.nomeMes(U.ref(x.inicio))) + ' · ' + (TIPO_ENCONTRO[x.tipo] || 'encontro').toLowerCase() + ' · ' + U.dia(x.inicio)),
            dec ? [el('p', 'eyebrow', 'Decidimos'), el('ul', 'past__list', dec.map((d) => el('li', null, d)))]
              : el('p', 'box__text', (x.pauta || []).length ? 'Pauta: ' + x.pauta.join('; ') : 'Sem decisões registradas.'));
        }))));
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
      ajustarNaoVistos().forEach((pd) => { pd.visto_pelo_cliente = true; sb.rpc('portal_marcar_visto', { p_pedido: pd.id }); });
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
  const vazio = (txt) => el('div', 'soon', txt || 'O consultor ainda não publicou esta parte. Ela aparece aqui assim que estiver pronta.');
  const sec = (idt, titulo, ...kids) => el('section', { class: 'box', 'aria-labelledby': idt }, el('h2', { class: 'box__title', id: idt }, titulo), kids);

  // Plataforma de marca
  const FACETAS = [['aparencia', 'Aparência'], ['personalidade', 'Personalidade'], ['valores', 'Valores'], ['relacao', 'Relação com o cliente'],
    ['cliente_projetado', 'Cliente que projeta'], ['autoimagem', 'Como o cliente se sente']];
  const telaPlataforma = () => {
    const P = D.plataforma;
    const out = [head(P && P.entregue_em ? 'Plataforma de marca · entregue em ' + U.mesAno(P.entregue_em) : 'Plataforma de marca', 'Narrativa',
      'Quem sua marca é e como ela fala. Consulte antes de escrever um post, uma proposta ou um anúncio.',
      P && P.pdf ? baixar(P.pdf, 'Baixar em PDF') : null)];
    if (!P) return out.concat(vazio());

    if (P.posicionamento) out.push(el('section', { class: 'focus focus--single', 'aria-labelledby': 'pos-t' },
      el('div', 'focus__text', el('p', { class: 'eyebrow', id: 'pos-t' }, 'Posicionamento'), el('p', 'focus__title focus__title--long', P.posicionamento))));

    const dizer = sec('say-t', 'O que dizer',
      P.mensagem_central ? [el('p', 'eyebrow', 'Mensagem central'), el('p', 'say__main', P.mensagem_central)] : null,
      D.mensagens_apoio.length ? [el('p', 'eyebrow', 'Mensagens de apoio'),
        el('ol', 'say__list', D.mensagens_apoio.map((m) => el('li', null, m.texto)))] : null);

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
    if (D.tom_atributos.length || diz.length || nunca.length) {
      out.push(sec('tom-t', 'Tom de voz',
        D.tom_atributos.length ? el('div', 'tone', D.tom_atributos.map((a) => el('div', 'tone__item', el('p', 'tone__name', a.nome), a.descricao ? el('p', 'box__text', a.descricao) : null))) : null,
        (diz.length || nunca.length) ? el('div', 'says',
          el('div', 'says__col', el('p', 'eyebrow', 'A marca diz'), diz.map((x) => el('p', 'says__ok', x.texto))),
          el('div', 'says__col', el('p', 'eyebrow', 'Nunca diz'), nunca.map((x) => el('p', 'says__no', el('s', null, x.texto))))) : null));
    }

    const facs = FACETAS.filter(([k]) => D.facetas[k]);
    if (facs.length) out.push(sec('who-t', 'Quem a marca é', el('div', 'facets', facs.map(([k, t]) => el('div', 'facet', el('p', 'eyebrow', t), el('p', 'facet__text', D.facetas[k]))))));
    // peças aprovadas que o consultor marcou como exemplo: o jeito certo, para copiar
    const ex = D.pedidos.filter((x) => x.exemplo && x.status === 'aprovado');
    if (ex.length) out.push(sec('ex-t', 'Exemplos aprovados', el('p', 'box__text', 'Peças que seguiram a plataforma. Use como referência para as próximas.'),
      el('ul', 'todo', ex.map((x) => el('li', 'piece', el('div', 'todo__text', el('span', 'todo__title', x.titulo || x.tipo_peca),
        el('span', 'todo__sub', x.tipo_peca + (x.resposta ? ' · “' + x.resposta + '”' : ''))),
        x.arquivo ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => abreArquivo(x.arquivo) }, 'Abrir')
          : (x.link ? el('a', { class: 'btn btn--ghost btn--sm', href: x.link, target: '_blank', rel: 'noopener' }, 'Abrir') : null))))));
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
    return sec('dist-t', 'O que faz reconhecerem a marca',
      el('p', 'box__text', 'O que faz as pessoas reconhecerem a marca sem ler o nome. Na pesquisa, mostramos cada um sem a marca e perguntamos de quem é.'),
      el('div', comDado.length >= 2 ? 'dist-grid' : 'dist-solo', comDado.length >= 2 ? graficoDispersao(comDado) : null,
      el('ul', 'todo', itens.map(({ a, m }) => el('li', 'piece',
        el('div', 'asset-row', visual(a), el('div', 'todo__text', el('span', 'todo__title', a.nome),
          el('span', 'todo__sub', m ? 'Fama ' + m.fama + '% · exclusividade ' + m.excl + '% · ' + m.n + ' respostas' : 'Ainda sem medição: entra na próxima rodada da pesquisa'))),
        m ? chip(...QUAD(m)) : chip('todo', 'Sem dados'))))));
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
      try { await navigator.clipboard.writeText(txt); b.classList.add('is-ok'); b.dataset.label = 'Copiado'; setTimeout(() => { b.classList.remove('is-ok'); }, 1400); } catch (e) { window.prompt('Copie:', txt); }
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

  // Identidade visual
  const imgAssinada = (caminho, alt) => {
    const img = el('img', { alt: alt || '', loading: 'lazy' });
    sb.storage.from('portal').createSignedUrl(caminho, 3600).then(({ data }) => { if (data) img.src = data.signedUrl; });
    return img;
  };
  const botoesFormato = (a) => (a.formatos || []).map((f) => (f.link
    ? el('a', { class: 'btn btn--ghost btn--sm', href: f.link, target: '_blank', rel: 'noopener' }, f.formato || 'Abrir')
    : baixar(f.caminho, f.formato || 'Baixar', 'btn btn--ghost btn--sm')));
  const telaIdentidade = () => {
    const I = D.identidade;
    const out = [head(I ? [I.entregue_em ? 'Entregue em ' + U.mesAno(I.entregue_em) : null, I.versao ? 'versão ' + I.versao : null].filter(Boolean).join(' · ') : '', 'Identidade visual',
      'A marca para usar, não só para ler: copie as cores certas, veja as fontes e teste logo, combinações e títulos antes de publicar.',
      I && I.zip ? baixar(I.zip, 'Baixar tudo (.zip)') : null)];
    if (!I && !D.arquivos_marca.length && !D.cores.length) return out.concat(vazio());

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
    out.push(...testeDaMarca());

    const docs = D.arquivos_marca.filter((a) => a.categoria !== 'logo');
    const fim = [];
    if (docs.length) fim.push(sec('doc-t', 'Modelos e manuais', el('ul', 'todo', docs.map((a) => el('li', 'piece',
      el('div', 'todo__text', el('span', 'todo__title', a.nome), a.descricao ? el('span', 'todo__sub', a.descricao) : null),
      el('div', 'logo__btns', (a.formatos || []).length ? botoesFormato(a) : el('span', 'box__note', 'Em breve')))))));

    if ((D.ativos || []).length) out.splice(1, 0, ativosDistintivos());

    if (D.aplicacoes.length) {
      const AP = { aplicada: 'done', em_andamento: 'doing', prevista: 'todo' };
      const txt = (a) => (a.status === 'aplicada' ? 'Aplicada' + (a.data ? ' em ' + U.nomeMesCurto(U.ref(a.data)) : '')
        : a.status === 'em_andamento' ? 'Em andamento' + (a.data ? ' · ' + U.nomeMesCurto(U.ref(a.data)) : '')
          : 'Previsto' + (a.data ? ' para ' + U.nomeMesCurto(U.ref(a.data)) : ''));
      fim.push(sec('apl-t', 'Onde a nova marca já está', el('div', 'places', D.aplicacoes.map((a) => el('div', 'place',
        el('p', 'tone__name', a.ponto_contato), chip(AP[a.status] || 'todo', txt(a)))))));
    }
    if (fim.length) out.push(lado(fim));
    return out;
  };

  // Estratégia
  const telaEstrategia = () => {
    const p = D.plano || {};
    const out = [head([p.estrategia_aprovada_em ? 'Aprovada em ' + U.mesAno(p.estrategia_aprovada_em) : null,
      p.proxima_revisao_estrategia ? 'próxima revisão em ' + U.mesAno(p.proxima_revisao_estrategia) : null].filter(Boolean).join(' · '),
    'Estratégia', 'Aonde a marca vai e as escolhas que fizemos para chegar lá. Toda ação do plano liga a um destes objetivos.',
    p.estrategia_pdf ? baixar(p.estrategia_pdf, 'Baixar plano completo (PDF)') : null)];
    if (!D.objetivos.length && !D.escolhas.length && !p.como_vencer && !D.condicoes.length) return out.concat(vazio());

    if (D.objetivos.length) {
      const card = (o) => {
        if (o.nivel === 'comunicacao') {
          return el('div', 'obj', el('p', 'eyebrow', 'Comunicação'), el('dl', 'obj__com',
            [['Notar', o.notar], ['Acreditar', o.acreditar], ['Sentir', o.sentir]].filter(([, v]) => v).map(([k, v]) => [el('dt', null, k), el('dd', null, v)])),
          o.titulo && !(o.notar || o.acreditar || o.sentir) ? el('p', 'obj__title', o.titulo) : null);
        }
        return el('div', 'obj', el('p', 'eyebrow', NIVEL[o.nivel]), o.destaque ? el('p', 'obj__num', o.destaque) : null,
          el('p', o.destaque ? 'box__text' : 'obj__title', o.titulo));
      };
      out.push(sec('obj-t', 'Objetivos', el('div', 'objs', D.objetivos.map(card))));
    }
    if (D.metricas.length) {
      const NIV = { negocio: 'Negócio', marketing: 'Marketing', marca: 'Marca' };
      const FREQ = { mensal: 'Todo mês', semestral: 'A cada 6 meses', anual: 'Todo ano' };
      out.push(sec('met-t', 'Como medimos cada objetivo',
        tabela(['Nível', 'Métrica', 'Medimos', 'Agora'], D.metricas.map((m) => [NIV[m.nivel] || m.nivel, m.nome, FREQ[m.frequencia] || m.frequencia,
          m.valor_atual || el('span', 'muted', m.proxima_medicao ? '1ª em ' + U.mesAno(m.proxima_medicao) : '—')]))));
    }

    const prio = D.escolhas.filter((x) => x.tipo === 'prioridade');
    const lado = D.escolhas.filter((x) => x.tipo === 'deixa_de_lado');
    if (prio.length || lado.length || D.descartadas.length || p.como_vencer) {
      out.push(el('div', 'grid grid--todo',
        sec('onde-t', 'Onde atuamos', el('div', 'says',
          el('div', 'says__col', el('p', 'eyebrow', 'Prioridade'), prio.map((x) => el('p', 'says__ok', x.texto))),
          el('div', 'says__col', el('p', 'eyebrow', 'Deixamos de lado'), lado.map((x) => el('p', 'says__no', el('s', null, x.texto))),
            D.descartadas.length ? [el('p', 'says__sub', 'Ações que decidimos não fazer'), D.descartadas.map((d) => el('p', 'says__no', el('s', null, d.texto))),
              el('p', 'box__note', 'Se surgir a vontade, converse antes com o consultor.')] : null))),
        p.como_vencer ? sec('vencer-t', 'Como vencemos', el('p', 'say__main', p.como_vencer)) : el('div')));
    }

    if (D.condicoes.length) {
      const CON = { se_confirma: ['done', 'Se confirma'], em_observacao: ['doing', 'Em observação'], sem_dados: ['todo', 'Sem dados ainda'], nao_se_confirma: ['warn', 'Não se confirma'] };
      const quebradas = condicaoQuebrada();
      if (quebradas.length) out.splice(1, 0, alertaEstrategia(quebradas));
      out.push(sec('cond-t', 'O que acompanhamos', el('p', 'box__text', 'Se uma destas condições deixar de ser verdade, revisamos a estratégia com você.'),
        tabela(['Condição', 'Como verificamos', 'Quem checa', 'Próxima checagem', 'Hoje'], D.condicoes.map((c) => [c.texto, c.como_verificar || '—', c.dono || '—',
          c.checar_em ? U.dia(c.checar_em) + (c.checar_em.slice(0, 4) !== hoje.slice(0, 4) ? ' ' + c.checar_em.slice(0, 4) : '') : '—', chip(...(CON[c.status] || CON.sem_dados))]))));
    }
    return out;
  };

  // Diagnóstico
  const telaDiagnostico = () => {
    const G = D.diagnostico;
    const out = [head(G && G.data ? 'Ponto de partida · ' + U.mesAno(G.data) : '', 'Diagnóstico',
      'Como sua marca era vista quando começamos. Daqui a um ano refazemos este retrato para comparar o antes e o depois.',
      G && G.proximo ? el('p', 'box__note', 'Novo diagnóstico em ' + U.mesAno(G.proximo)) : null)];
    if (!G) return out.concat(vazio());

    if (G.resumo) out.push(el('section', { class: 'focus focus--single', 'aria-labelledby': 'res-t' },
      el('div', 'focus__text', el('p', { class: 'eyebrow', id: 'res-t' }, 'Em uma frase'), el('p', 'focus__title focus__title--long', G.resumo))));

    if (D.impressoes.length) out.push(sec('imp-t', 'Como as pessoas viam a marca',
      tabela(['Marca', 'O que notavam', 'O que acreditavam', 'O que sentiam'], D.impressoes.map((i) => [
        i.eh_cliente ? el('strong', null, i.marca_nome) : i.marca_nome, i.notam || '—', i.acreditam || '—', i.sentem || '—']))));

    const POS = { entrega: ['done', 'Entregava'], entrega_mal: ['doing', 'Entregava mal'], nao_entrega: ['warn', 'Não entregava'] };
    const lista = (fs) => el('ul', 'todo', fs.map((f) => el('li', 'piece', el('span', 'todo__title', f.texto), chip(...(POS[f.posicao] || POS.nao_entrega)))));
    const mot = D.fatores.filter((f) => f.tipo === 'motivador');
    const dis = D.fatores.filter((f) => f.tipo === 'discriminador');
    if (mot.length || dis.length) out.push(el('div', 'grid grid--half',
      mot.length ? sec('mot-t', 'O que todo cliente exige', lista(mot)) : el('div'),
      dis.length ? sec('dis-t', 'O que faz escolher uma marca', lista(dis)) : el('div')));

    if (D.causas.length) out.push(sec('cau-t', 'As causas que o plano ataca', el('ol', 'causes', D.causas.map((c) => el('li', null, c.texto)))));
    return out;
  };


  // ===== Falar com o consultor: a conversa fica no portal e chega ao painel da GANG =====
  const naoLidas = () => D.mensagens.filter((m) => m.de === 'consultor' && !m.lida).length;
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
        el('p', 'small', (D.consultor && D.consultor.nome ? D.consultor.nome.split(' ')[0] + ' responde' : 'O consultor responde') + ' às ' + diasResposta() + '. Dúvidas sobre uma ação rendem mais no encontro: abra a ação e use “Levar para o encontro”.'))),
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
    if (!confirm('Cancelar esta mensagem? O consultor não vai recebê-la.')) return;
    const { error } = await sb.rpc('portal_cancelar_mensagem', { p_mensagem: m.id });
    if (error) { U.say($('chat-msg'), error.message || 'Não foi possível cancelar.', 'error'); await recarregaMsgs(); return desenhaFio(); }
    D.mensagens = D.mensagens.filter((x) => x !== m); desenhaFio(); U.say($('chat-msg'), 'Mensagem cancelada.', 'ok');
  };
  function abrirConversa() {
    desenhaFio(); U.say($('chat-msg'), ''); conv.showModal(); $('chat-txt').focus();
    if (naoLidas()) { D.mensagens.forEach((m) => { if (m.de === 'consultor') m.lida = true; }); marcaNaoLidas(); sb.rpc('portal_ler_mensagens'); }
  }
  chatForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = $('chat-txt').value.trim();
    if (!t) return U.say($('chat-msg'), 'Escreva a mensagem.', 'error');
    const btn = chatForm.querySelector('[type=submit]'); btn.disabled = true;
    const { error } = await sb.rpc('portal_enviar_mensagem', { p_texto: t });
    btn.disabled = false;
    if (error) return U.say($('chat-msg'), 'Não foi possível enviar. Tente de novo.', 'error');
    await recarregaMsgs();
    $('chat-txt').value = ''; U.say($('chat-msg'), 'Enviada. A resposta chega às ' + diasResposta() + '. Enquanto o consultor não ler, você pode cancelar.', 'ok'); desenhaFio();
  });
  $('chat-txt').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) chatForm.requestSubmit(); });
  marcaNaoLidas();

  // Início do plano "Só acesso": a marca à mão + o convite para a consultoria
  // mensagem nova do consultor: aparece em destaque no topo, não só no botão da conversa
  const bannerMensagem = () => {
    const novas = D.mensagens.filter((m) => m.de === 'consultor' && !m.lida);
    if (!novas.length) return null;
    const m = novas[novas.length - 1];
    const lida = () => { D.mensagens.forEach((x) => { if (x.de === 'consultor') x.lida = true; }); marcaNaoLidas(); sb.rpc('portal_ler_mensagens'); render(); };
    return el('section', { class: 'cmsg', 'aria-labelledby': 'cmsg-t' },
      D.consultor ? avatar(D.consultor) : null,
      el('div', 'cmsg__txt',
        el('p', { class: 'eyebrow', id: 'cmsg-t' }, 'Mensagem ' + (D.consultor && D.consultor.nome ? 'de ' + D.consultor.nome.split(' ')[0] : 'do consultor') + ' · ' + U.dia(m.criada_em) + (novas.length > 1 ? ' · ' + novas.length + ' novas' : '')),
        el('p', 'cmsg__q', m.texto),
        el('div', 'cmsg__btns',
          el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: () => { abrirConversa(); render(); } }, 'Responder'),
          el('button', { class: 'link', type: 'button', onclick: lida }, 'Marcar como lida'))));
  };

  const telaInicioAcesso = () => {
    const primeiro = (me.name || '').split(' ')[0];
    const P = D.plataforma;
    const out = [head('Acesso à sua marca', 'Olá' + (primeiro ? ', ' + primeiro : '') + '.',
      'Tudo sobre a sua marca em um lugar, sempre na versão certa. Consulte antes de criar qualquer peça e compartilhe com quem trabalha com você.')];
    const bm = bannerMensagem(); if (bm) out.push(bm);
    if (P && (P.posicionamento || P.mensagem_central)) {
      out.push(el('section', { class: 'focus', 'aria-labelledby': 'pos-i' },
        el('div', 'focus__text', el('p', { class: 'eyebrow', id: 'pos-i' }, P.mensagem_central ? 'Mensagem central' : 'Posicionamento'),
          el('h2', 'focus__title', P.mensagem_central || P.posicionamento),
          P.mensagem_central && P.posicionamento ? el('p', 'focus__body', P.posicionamento) : null)));
    }
    const tile = (n, href, t, d) => el('a', { class: 'brand-tile', href }, el('span', 'brand-tile__n', n), el('span', 'brand-tile__t', t), el('span', 'brand-tile__d', d));
    out.push(el('section', { class: 'brand-tiles', 'aria-label': 'Sua marca' },
      tile('01', '#diagnostico', 'Diagnóstico', 'O ponto de partida: como as pessoas percebiam a marca.'),
      tile('02', '#estrategia', 'Estratégia', 'Aonde a marca vai e os caminhos para chegar lá.'),
      tile('03', '#plataforma', 'Narrativa', 'O que dizer e o tom de voz certo para transmitir seu valor.'),
      tile('04', '#identidade', 'Identidade visual', 'Os elementos que tornam a marca fácil de reconhecer.')));
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
  const BANDEIRA = '<svg viewBox="0 0 28 32" width="28" height="32" aria-hidden="true"><rect x="3" y="2" width="2.4" height="29" rx="1.2" fill="currentColor"/>'
    + [0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => ((r + c) % 2 ? '' : '<rect x="' + (6 + c * 4) + '" y="' + (3 + r * 4) + '" width="4" height="4" fill="currentColor"/>')).join('')).join('')
    + '<rect x="6" y="3" width="20" height="16" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
  const telaCaminho = () => {
    const primeiro = (me.name || '').split(' ')[0];
    const objNeg = D.objetivos.find((o) => o.nivel === 'negocio');
    const objMarca = D.objetivos.find((o) => o.nivel === 'marca');
    const destino = objNeg ? ((objNeg.destaque ? objNeg.destaque + ' de ' : '') + (objNeg.titulo || '')) : (D.plano && D.plano.meta_faturamento_pct ? U.pct(Number(D.plano.meta_faturamento_pct), 0) + ' de faturamento em ' + dur + ' meses' : 'O objetivo do plano');
    // a meta em duas partes: o número em destaque e a frase ao lado (sem quebrar a linha de qualquer jeito)
    let numero = objNeg && objNeg.destaque ? objNeg.destaque : null;
    let frase = numero ? (objNeg.titulo || '') : destino;
    if (!numero) { const m = destino.match(/^([+\-\u2212]?\d[\d.,]*\s?%?)\s+(?:de\s+)?(.+)$/); if (m) { numero = m[1].trim(); frase = m[2]; } }
    frase = frase.replace(/^de\s+/i, '');
    // a meta como um card de indicador (no estilo das referências): rótulo com ícone, o número, a frase e o tempo do plano em segmentos
    const fimRef = inicioRef ? U.addRef(inicioRef, dur - 1) : null;
    const mesAgora = inicioRef ? Math.min(Math.max(mesN || 1, 1), dur) : 0;
    const fraseMeta = numero ? frase : frase.charAt(0).toUpperCase() + frase.slice(1);
    const out = [el('section', { class: 'goal goal--kpi', 'aria-labelledby': 'goal-t' },
      el('div', 'goal__head',
        el('span', { class: 'goal__ico', 'aria-hidden': 'true' }),
        el('p', 'goal__lbl2', 'Meta do plano'),
        inicioRef ? el('span', 'goal__chip', 'Mês ' + mesAgora + ' de ' + dur) : null),
      el('h1', { class: 'goal__val', id: 'goal-t' },
        numero ? el('span', 'goal__n', numero) : null,
        el('span', 'goal__f' + (numero ? '' : ' is-so'), fraseMeta)),
      inicioRef ? el('div', 'goal__tempo',
        el('div', { class: 'goal__segs', role: 'img', 'aria-label': 'Mês ' + mesAgora + ' de ' + dur + ' do plano', style: '--n:' + dur },
          Array.from({ length: dur }, (_, i) => el('span', i < mesAgora - 1 ? 'is-ok' : i === mesAgora - 1 ? 'is-now' : null))),
        el('div', 'goal__ends', el('span', null, U.cap(U.nomeMesCurto(inicioRef)) + ' ' + inicioRef.slice(2, 4)), el('span', null, 'Chegada · ' + U.nomeMesCurto(fimRef) + ' ' + fimRef.slice(2, 4)))) : null)];
    const bm = bannerMensagem(); if (bm) out.push(bm);
    if (!inicioRef) return out.concat(vazio('A trilha aparece assim que o consultor cadastrar o plano.'));

    // as missões do mês (os números entram como uma missão, sem aviso à parte)
    out.push(missoes());
    if (false) {
      out.push(el('div', 'nudge',
        el('p', 'nudge__t', el('strong', null, 'Faltam os números de ' + U.nomeMes(mesPassado) + '.'), ' Leva 2 minutos e é o que mostra se o plano está funcionando.'),
        el('a', { class: 'btn btn--light btn--sm', href: '#resultados', onclick: () => { setTimeout(() => { const f = document.getElementById('n-fat'); if (f) { f.scrollIntoView({ block: 'center' }); f.focus({ preventScroll: true }); } }, 400); } }, 'Enviar agora')));
    }

    // os primeiros meses: o que acontece agora e quando os resultados começam a aparecer
    if (mesN <= 2) {
      const prox = U.addRef(inicioRef, 1); const veredito = U.addRef(inicioRef, 3);
      const passo = (ok, t, d, href, lk, ir) => el('li', ok ? 'is-on' : null, el('span', { class: 'start__ico', 'aria-hidden': 'true' }, ok ? '✓' : ''),
        el('div', 'start__body', el('p', 'start__t', t), el('p', 'start__d', d)), href ? el('a', { class: 'start__lk', href, onclick: ir || null }, lk) : null);
      out.push(el('section', { class: 'start', 'aria-labelledby': 'start-t' },
        el('div', 'step-sec__head', el('h2', { class: 'step-sec__t', id: 'start-t' }, 'Como funciona o começo'),
          el('p', 'step-sec__d', 'Mês ' + mesN + ' de ' + dur)),
        el('ol', 'start__list',
          passo(true, 'Conheça a sua marca', 'A estratégia, a narrativa e a identidade já estão no menu, em “Sua marca”. Consulte antes de criar qualquer peça.', '#estrategia', 'Ver a estratégia'),
          passo(D.acoes.some((a) => a.status === 'feita' && a.responsavel !== 'gang'), 'Faça a primeira ação', 'Em Ações, a mais importante do mês aparece primeiro.', '#acoes', 'Ver ações'),
          semNumeros ? null : passo(D.numeros.some((x) => x.mes_ref > inicioRef), 'Envie os números de ' + U.nomeMes(prox), 'No começo de ' + U.nomeMes(U.addRef(prox, 1)) + '. Leva 2 minutos.'),
          (() => {
            // o convite só existe quando o consultor abre a pesquisa; até lá, o passo avisa e não leva a lugar nenhum
            const abertaP = D.pesquisas.some((x) => x.aberta);
            const vaiConvite = () => setTimeout(() => {
              const sh = document.querySelector('.share'); if (!sh) return;
              const det = sh.querySelector('.share__edit'); if (det) det.open = true;
              sh.scrollIntoView({ block: 'center', behavior: 'smooth' });
              const t = document.getElementById('convite'); if (t) t.focus({ preventScroll: true });
            }, 450);
            return abertaP
              ? passo(D.respostas.length > 0, 'Convide clientes para a pesquisa de partida', 'É ela que mostra como a marca é vista hoje, para comparar depois. A mensagem já vem pronta.', '#resultados', 'Ver o convite', vaiConvite)
              : passo(false, 'Convide clientes para a pesquisa de partida', 'É ela que mostra como a marca é vista hoje. Assim que o consultor abrir a pesquisa, o convite pronto aparece aqui.');
          })(),
          passo(false, 'O primeiro veredito', 'Com 3 meses de números, em ' + U.nomeMes(veredito) + ', dá para dizer se o plano está pagando.'))));
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
    // as 5 estrelas do mês: o que o cliente faz para o mês ser "5 estrelas"
    // só acende o que foi feito de verdade: sem tarefa, sem encontro ou sem ação para avaliar, a estrela fica apagada
    const agoraISO = new Date().toISOString();
    const estrelas = (e) => [
      ['Essenciais feitas', !e.alvo.length ? 'Nada previsto para o mês' : 'Fazer as ' + (e.essenciais ? 'essenciais' : 'ações') + ' do mês (' + e.feitas + ' de ' + e.alvo.length + ' feitas)', e.fase !== 'futuro' && e.alvo.length > 0 && e.feitas === e.alvo.length],
      semNumeros ? ['Números do mês', 'Combinado com o consultor', e.fase !== 'futuro'] : ['Números enviados', 'Enviar faturamento e clientes do mês', D.numeros.some((x) => x.mes_ref === e.r)],
      (() => { const enc = D.encontros.filter((x) => x.inicio.slice(0, 7) === e.r);
        return enc.length ? ['Presença no encontro', 'Participar do encontro do mês', enc.some((x) => x.status === 'realizado' || (x.status === 'agendado' && x.inicio < agoraISO))]
          : ['Presença no encontro', 'Sem encontro marcado neste mês', false]; })(),
      (() => { const fe = e.acs.filter((a) => a.status === 'feita' && a.responsavel !== 'gang');
        return ['Ações avaliadas', fe.length ? 'Responder a pergunta de cada ação feita' : 'Nenhuma ação feita para avaliar', e.fase !== 'futuro' && fe.length > 0 && fe.every((a) => a.resultado)]; })(),
      ['Ouviu um cliente', 'Registrar o que um cliente disse ou receber respostas da pesquisa', (D.vozes || []).some((x) => x.mes_ref === e.r) || (D.respostas || []).some((x) => (x.criada_em || '').slice(0, 7) === e.r)],
    ];
    const nEstrelas = (e) => estrelas(e).filter((x) => x[2]).length;
    const cincoEstrelas = ests.filter((e) => e.fase !== 'futuro' && nEstrelas(e) === 5).length;
    if (!caminhoSel || !meses.includes(caminhoSel)) caminhoSel = meses.includes(hoje) ? hoje : meses[0];

    // as ações do cliente pendentes no mês (o "o que fazer agora" fica na tela Ações)
    const pend = D.acoes.filter((a) => a.status !== 'feita' && a.responsavel !== 'gang' && a.mes_previsto && a.mes_previsto <= hoje);
    const iAgora = out.length;
    if (false && D.proximo) out.push(el('p', 'now__meet plan-meet',
      el('span', 'now__lbl', 'Próximo encontro'),
      el('span', null, el('strong', null, U.quando(D.proximo.inicio)), ' · ' + (TIPO_ENCONTRO[D.proximo.tipo] || 'Encontro') + ' · ' + D.proximo.duracao_min + ' min'),
      el('a', { class: 'link', href: '#consultoria' }, (D.proximo.pauta || []).length ? 'Ver pauta' : 'Ver encontro')));

    // 2. Como está a promessa: venda mais, para mais pessoas, com mais valor — e quantas ações movem cada uma
    const acoesPor = {}; pend.forEach((a) => { const k = U.promessaDe(a); acoesPor[k] = (acoesPor[k] || 0) + 1; });
    void acoesPor;

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
      const cls = e.fase === 'futuro' ? 'futuro' : k === 5 ? 'conquistado' : e.fase === 'agora' ? 'agora' : k ? 'parcial' : 'pendente';
      const b = el('button', { class: 'trail__node is-' + cls + (ultimo ? ' is-fim' : '') + (e.r === caminhoSel ? ' is-sel' : ''), type: 'button', 'aria-pressed': String(e.r === caminhoSel),
        'aria-label': U.cap(U.nomeMes(e.r)) + ', mês ' + n + ': ' + (k == null ? 'por vir' : k + ' de 5 estrelas' + (e.fase === 'agora' ? ', em andamento' : '')),
        onclick: () => { caminhoSel = e.r; cpTrocou = true; render(); } });
      if (ultimo) { b.innerHTML = BANDEIRA; b.dataset.dica = 'Chegada · ' + U.nomeMes(e.r) + ' de ' + e.r.slice(0, 4); }
      else if (k === 5) b.textContent = '★';
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
    const iTrilha = out.length;
    out.push(el('div', 'step-sec__head', el('h2', { class: 'step-sec__t' }, 'O caminho até a meta'),
      el('p', 'step-sec__d', 'Mês ' + mesN + ' de ' + dur + (cincoEstrelas ? ' · ' + cincoEstrelas + ' ★' : ''))));
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
    const cpEl = el('section', { class: 'cp' + (cpTrocou ? ' cp--entra' : '') + (k === 5 ? ' is-5' : ''), 'aria-labelledby': 'cp-t', 'aria-live': 'polite' },
      el('div', 'cp__head',
        el('div', null, el('p', 'eyebrow', (ultimo ? 'Chegada · ' : 'Mês ' + n + ' · ') + U.cap(U.nomeMes(caminhoSel)) + ' ' + caminhoSel.slice(0, 4)),
          el('h2', { class: 'cp__t', id: 'cp-t' }, futuro ? 'Este mês ainda vai começar' : k === 5 ? 'Mês 5 estrelas' : k + ' de 5 estrelas' + (e.fase === 'agora' ? ' até agora' : ''))),
        futuro ? chip('todo', 'Por vir') : e.fase === 'agora' ? chip('doing', 'Em andamento') : chip(k === 5 ? 'done' : 'todo', 'Encerrado')),
      futuro ? null : el('p', { class: 'stars__row', role: 'img', 'aria-label': k + ' de 5 estrelas' }, st.map((x) => el('span', x[2] ? 'is-on' : null, x[2] ? '★' : '☆'))),
      el('ul', 'stars__chips' + (futuro ? ' is-futuro' : ''), st.map(([t, d, ok]) => {
        const ir = irParaEstrela(t, e);
        return el('li', { class: ok ? 'is-on' : null }, el('a', { href: ir.href, onclick: ir.onclick, title: ok ? 'Feito · ' + ir.dica : d + ' · ' + ir.dica },
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

    void iAgora; void iTrilha;


    return out;
  };

  // ===== Relatório do mês: uma página para mostrar aos sócios (imprimir ou salvar em PDF) =====
  const telaRelatorio = () => {
    const nome = D.empresa ? D.empresa.nome : 'Sua empresa';
    const r0 = mesPassado; const r1 = hoje;
    const desde = U.addRef(r1, -3); // os últimos 3 meses
    const feitas = D.acoes.filter((a) => a.status === 'feita' && (a.mes_previsto >= desde || (a.concluida_em && a.concluida_em.slice(0, 7) >= desde)));
    const andamento = D.acoes.filter((a) => a.status !== 'feita' && a.mes_previsto <= r1);
    const RES_TXT = { sim: 'funcionou', parcial: 'funcionou em parte', nao: 'não funcionou' };
    const c = contaPlano();
    // a leitura de marca mais recente (para o funil)
    const q = [...D.pesquisas].reverse().find((x) => D.respostas.some((r) => r.pesquisa_id === x.id));
    let funil = null;
    if (q) {
      const rs = D.respostas.filter((r) => r.pesquisa_id === q.id);
      const nomeM = nome; const sits = q.situacoes || [];
      const ment = sits.length ? Math.round(rs.filter((r) => sits.some((st) => ((r.ceps || {})[st.id] || []).includes(nomeM))).length / rs.length * 100) : null;
      const chave = semAcento(nomeM).split(/\s+/).filter((w) => w.length > 2).pop() || semAcento(nomeM);
      const lemb = Math.round(rs.filter((r) => semAcento(r.lembranca).includes(chave)).length / rs.length * 100);
      funil = funilClareza({ q, ment, lemb });
    }
    const bloco = (t, ...k) => el('section', 'rel__sec', el('h2', 'rel__h', t), k);
    const lista = (arr, f) => (arr.length ? el('ul', 'rel__list', arr.map(f)) : el('p', 'rel__muted', 'Nada neste período.'));
    const essenciais = D.acoes.filter((a) => a.status !== 'feita' && a.peso === 'essencial' && a.mes_previsto <= U.addRef(r1, 1));
    return [el('article', 'rel',
      el('div', 'rel__bar no-print',
        el('a', { class: 'link', href: '#resultados' }, '← Voltar'),
        el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: () => window.print() }, 'Imprimir ou salvar em PDF')),
      el('header', 'rel__head',
        el('div', null, el('p', 'rel__eyebrow', 'Relatório de ' + U.nomeMes(r1) + ' de ' + r1.slice(0, 4) + ' · mês ' + mesN + ' de ' + dur),
          el('h1', 'rel__title', nome),
          el('p', 'rel__sub', 'Venda mais. Para mais pessoas. Com mais valor.')),
        el('p', 'rel__by', 'Consultoria GANG')),
      D.foco && D.foco.veredito ? bloco('Veredito do mês', el('p', 'rel__p', D.foco.veredito),
        D.vereditos.filter((v) => v.mes_ref !== D.foco.mes_ref).length ? el('ul', 'rel__list', D.vereditos.filter((v) => v.mes_ref !== D.foco.mes_ref).slice(0, 5).map((v) => el('li', null, el('strong', null, U.cap(U.nomeMes(v.mes_ref)) + ': '), v.veredito))) : null) : null,
      bloco('Resultado do plano', el('div', 'rel__grid', promessa().map(([t, v, sub], i) => el('div', 'rel__kpi', el('p', 'rel__k', t), el('p', 'rel__v', v == null ? '—' : U.pct(v, 1)), el('p', 'rel__muted', sub),
        v != null && v < 0 && D.foco && D.foco['nota_' + ['vendas', 'pessoas', 'valor'][i]] ? el('p', 'rel__muted', 'Por quê: ' + D.foco['nota_' + ['vendas', 'pessoas', 'valor'][i]]) : null)))),
      c && c.meses < MESES_VEREDITO ? bloco('O plano pagou?', el('p', 'rel__p', 'Em formação: o veredito sai com ' + MESES_VEREDITO + ' meses de números (' + c.meses + ' de ' + MESES_VEREDITO + ' até agora).')) : null,
      c && c.meses >= MESES_VEREDITO ? bloco('O plano pagou?', el('p', 'rel__p', 'Com o plano: ' + U.reais(c.real) + ' em ' + c.meses + (c.meses === 1 ? ' mês' : ' meses') + ', contra ' + U.reais(c.semPlano) + ' se nada mudasse: ' + (c.extra >= 0 ? U.reais(c.extra) + ' a mais.' : U.reais(-c.extra) + ' a menos.')
        + (c.volta != null ? (c.volta >= 1 ? ' Cada R$ 1 investido na consultoria voltou R$ ' + c.volta.toFixed(1).replace('.', ',') + '.' : '') : ''))) : null,
      bloco('O que foi feito nos últimos 3 meses', lista(feitas, (a) => el('li', null, el('strong', null, a.titulo), (a.resultado ? ' · ' + RES_TXT[a.resultado] : ''), a.aprendizado ? el('span', 'rel__muted', ' “' + a.aprendizado + '”') : null))),
      bloco('Em andamento', lista(andamento, (a) => el('li', null, el('strong', null, a.titulo), ' · ' + STATUS[a.status] + (a.peso === 'essencial' ? ' · essencial' : '')))),
      funil ? bloco('Como a marca é vista', funil) : null,
      bloco('Próximos passos',
        D.foco ? el('p', 'rel__p', el('strong', null, 'Foco do mês: '), D.foco.titulo) : null,
        D.proximo ? el('p', 'rel__p', el('strong', null, 'Próximo encontro: '), U.quando(D.proximo.inicio)) : null,
        essenciais.length ? el('p', 'rel__p', el('strong', null, 'Essenciais: '), essenciais.map((a) => a.titulo).join(' · ')) : null),
      el('footer', 'rel__foot', 'Gerado pelo portal da marca em ' + U.diaAno(new Date()) + '.'))];
  };

  // ===== telas =====
  const SCREENS = {
    plano: { crumb: 'Plano · ' + U.nomeMes(hoje) + ' de ' + hoje.slice(0, 4), render: telaCaminho },
    inicio: { crumb: 'Início · ' + U.nomeMes(hoje) + ' de ' + hoje.slice(0, 4), render: telaInicio },
    calendario: { crumb: 'Acompanhamento / Encontros e prazos', render: telaConsultoria },
    acoes: { crumb: 'Acompanhamento / Ações', render: telaAcoes },
    resultados: { crumb: 'Acompanhamento / Resultados', render: telaResultados },
    relatorio: { crumb: 'Acompanhamento / Relatório do mês', render: telaRelatorio },
    consultoria: { crumb: 'Acompanhamento / Encontros e prazos', render: telaConsultoria },
    plataforma: { crumb: 'Sua marca / Narrativa', render: telaPlataforma },
    identidade: { crumb: 'Sua marca / Identidade visual', render: telaIdentidade },
    estrategia: { crumb: 'Sua marca / Estratégia', render: telaEstrategia },
    diagnostico: { crumb: 'Sua marca / Diagnóstico', render: telaDiagnostico },
  };

  const side = document.querySelector('.side');
  const rota = () => { const r = location.hash.slice(1); const padrao = soAcesso ? 'inicio' : 'plano'; return SCREENS[r] && !(soAcesso && SO_CONSULTORIA.includes(r)) && !(!soAcesso && r === 'inicio') ? r : padrao; };
  // a animação de entrada só roda ao trocar de tela; atualizar algo na mesma tela (ex.: status de uma ação) não pisca
  let telaAtual = null;
  function render() {
    const r = rota();
    const trocou = r !== telaAtual; telaAtual = r;
    const y = window.scrollY;
    $('crumb').textContent = SCREENS[r].crumb;
    $('screen').replaceChildren(el('div', 'screen screen--' + r + (trocou ? ' screen--entra' : ''), SCREENS[r].render()));
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
