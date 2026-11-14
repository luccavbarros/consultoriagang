/* Painel GANG: a página de um cliente — plano e acessos (as outras abas chegam nas próximas fases) */
(async () => {
  const { sb, guard, signOut, notConfigured, adminApi, randomPass } = window.GangAuth;
  const U = window.GangUI;
  const { $, el, say, mesDoPlano } = U;
  if (!sb) return notConfigured($('app'));
  const me = await guard('admin');
  if (!me) return;

  // listas de respostas prontas (app/presets.js) no lugar dos campos abertos
  const P = window.GangPresets || {};
  document.querySelectorAll('[data-combo]').forEach((m) => {
    const idc = m.dataset.id;
    const onPick = {
      'x-titulo': (it) => preencherPelaAcao(it),
      'm-nome': (it) => { if (it.nivel) $('m-nivel').value = it.nivel; if (it.frequencia) $('m-freq').value = it.frequencia; },
    }[idc];
    // o menu da ação agrupa por tipo de atividade (tema), não por autor
    const ordemTema = Object.keys(P.temas || {});
    const lista = idc === 'x-titulo' && P.temas
      ? (P.acoes || []).map((x) => ({ ...x, grupo: P.temas[x.tema] || x.grupo })).sort((a, b) => ordemTema.indexOf(a.tema) - ordemTema.indexOf(b.tema))
      : P[m.dataset.combo];
    m.replaceWith(U.combo(idc, lista, '', { onPick, vazio: m.dataset.vazio, semGrupos: m.hasAttribute('data-semgrupos') || !(idc === 'x-titulo' || m.hasAttribute('data-grupos')), max: m.dataset.max ? Number(m.dataset.max) : undefined })); // fonte e autor ficam só por trás; o consultor vê as opções sem rótulo de autor
  });
  document.querySelectorAll('[data-multi]').forEach((m) => m.replaceWith(U.multi(m.dataset.id, P[m.dataset.multi], [])));
  document.querySelectorAll('[data-dias]').forEach((i) => U.diasSemana(i)); // dias da semana: o consultor marca, não digita
  const ehCombo = (fid) => { const n = $(fid); return !!(n && n.parentElement && n.parentElement.classList.contains('combo')); };
  const setv = (fid, v) => { if (ehCombo(fid)) U.comboSet(fid, v || ''); else if ($(fid).hasAttribute('data-moeda')) U.moedaSet($(fid), v); else $(fid).value = v ?? ''; };

  $('who').textContent = me.name || me.email;
  U.avatar($('me-dot'), me.name || me.email, me.foto_url);
  $('sign-out').addEventListener('click', signOut);

  // menu lateral: no celular vira um bloco no topo, aberto pelo botão "Menu"
  const side = document.querySelector('.side');
  $('menu-btn').addEventListener('click', () => {
    const open = side.classList.toggle('is-open');
    $('menu-btn').setAttribute('aria-expanded', String(open));
  });

  const id = new URLSearchParams(location.search).get('id');
  const emp = id && (await sb.from('empresas').select('*').eq('id', id).maybeSingle()).data;
  if (!emp) {
    $('name').textContent = 'Cliente não encontrado'; $('side-nav').querySelectorAll('ul, .side__group').forEach((n) => { n.hidden = true; });
    $('pane-title').textContent = 'Cliente não encontrado';
    return;
  }
  $('name').textContent = emp.nome;
  document.title = emp.nome + ' — Painel GANG';
  const mostraLogo = () => {
    [$('company-logo'), $('p-logo-view')].forEach((n) => U.avatar(n, emp.nome, emp.logo_url));
    $('p-logo-rm-wrap').hidden = !emp.logo_url;
  };
  mostraLogo();
  if ($('p-setor')) { U.setorOpcoes($('p-setor')); $('p-setor').value = emp.setor || ''; } // um campo só: o setor define o plano modelo

  // trocar de cliente pelo topo do menu (seletor com busca, como nas referências)
  (async () => {
    const id0 = document.querySelector('.side__id'); if (!id0) return;
    const todas = (await sb.from('empresas').select('id, nome, logo_url').order('nome')).data || [];
    const pls = (await sb.from('planos').select('empresa_id, inicio, duracao_meses, tipo, status')).data || [];
    const rotPlano = (eid) => { const pl = pls.find((x) => x.empresa_id === eid); return !pl || !pl.inicio ? 'sem plano' : pl.tipo === 'acesso' ? 'acesso' : 'mês ' + U.mesDoPlano(pl); };
    const btn = el('button', { class: 'side__id side__switch', type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', title: 'Trocar de cliente' });
    btn.append(...id0.childNodes, el('span', { class: 'side__chev', 'aria-hidden': 'true' }));
    id0.replaceWith(btn);
    const busca = el('input', { class: 'switch__q', type: 'search', placeholder: 'Buscar cliente…', 'aria-label': 'Buscar cliente' });
    const lista = el('ul', { class: 'switch__list', role: 'listbox' });
    const lblN = el('p', 'switch__lbl', 'Seus clientes');
    const pop = el('div', { class: 'switch', hidden: true }, lblN, el('div', 'switch__search', busca), lista,
      el('a', { class: 'switch__all', href: 'admin.html' }, el('span', null, 'Todos os clientes'), el('span', { class: 'switch__arrow', 'aria-hidden': 'true' })));
    btn.after(pop);
    const desenha = () => {
      const q = busca.value.trim().toLowerCase();
      const f = todas.filter((e) => !q || e.nome.toLowerCase().includes(q));
      lista.replaceChildren(...(f.length ? f.map((e) => {
        const lg = el('span', 'cli-logo cli-logo--sm'); U.avatar(lg, e.nome, e.logo_url);
        return el('li', null, el('a', { class: 'switch__item' + (e.id === id ? ' is-on' : ''), href: 'admin-cliente.html?id=' + e.id + location.hash, role: 'option', 'aria-selected': String(e.id === id) }, lg, el('span', null, e.nome), el('span', 'switch__n', rotPlano(e.id))));
      }) : [el('li', 'vazio vazio--sm', el('span', 'vazio__ico'), el('p', 'vazio__t', 'Nada encontrado'), el('p', 'vazio__d', 'Tente outro nome.'))]));
      lblN.textContent = q ? f.length + (f.length === 1 ? ' resultado' : ' resultados') : 'Seus clientes';
    };
    const abre = (on) => { pop.hidden = !on; btn.setAttribute('aria-expanded', String(on)); if (on) { busca.value = ''; desenha(); busca.focus(); } };
    btn.addEventListener('click', (e) => { e.stopPropagation(); abre(pop.hidden); });
    busca.addEventListener('input', desenha);
    pop.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => abre(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { abre(false); btn.focus(); } });
  })();
  $('p-logo').addEventListener('change', () => {
    const f = $('p-logo').files[0];
    if (f) { const v = $('p-logo-view'); v.textContent = ''; v.style.backgroundImage = 'url("' + URL.createObjectURL(f) + '")'; }
  });

  // ===== seções pelo menu lateral (lembradas no endereço: #plano, #acessos…) =====
  const links = [...document.querySelectorAll('[data-tab]')];
  const show = (focus) => {
    let name = location.hash.slice(1);
    if (!links.some((t) => t.dataset.tab === name)) name = 'fechamento';
    links.forEach((t) => {
      const on = t.dataset.tab === name;
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
      $('pane-' + t.dataset.tab).hidden = !on;
      if (on) {
        const rotulo = t.querySelector('span').textContent;
        $('pane-title').textContent = rotulo;
        $('crumb').textContent = $('name').textContent + ' / ' + rotulo;
      }
    });
    $('raiox').classList.toggle('is-off', ['diagnostico', 'estrategia', 'plataforma', 'identidade', 'acessos', 'plano', 'mensagens', 'foco'].includes(name));
    side.classList.remove('is-open'); $('menu-btn').setAttribute('aria-expanded', 'false');
    if (focus) { window.scrollTo(0, 0); $('app').focus({ preventScroll: true }); }
  };
  window.addEventListener('hashchange', () => show(true));
  show(false);
  // as abas da marca (app/admin-marca.js) montam a partir daqui
  window.dispatchEvent(new CustomEvent('gang:cliente', { detail: { sb, id, me } }));


  // ===== fechamento do mês: os 6 passos do ciclo, calculados a partir dos dados =====
  const G = window.GangSaude;
  const desenhaFechamento = async () => {
    const B = G && await G.carregar(sb, id);
    if (!B) return;
    if (!B.plano || !B.plano.inicio) {
      $('fech-count').textContent = '';
      $('fech-lista').replaceChildren(el('li', 'fech__item', el('div', 'fech__txt', el('p', 'fech__t', 'Cadastre o plano primeiro'), el('p', 'fech__d', 'Com o início e a duração, o fechamento do mês passa a funcionar.')), el('a', { class: 'btn btn--ghost btn--sm', href: '#plano' }, 'Ir para o plano')));
      $('fech-sinais').replaceChildren(); $('fech-etapas').replaceChildren(); return;
    }
    const passos = G.fechamento(B); const feitos = passos.filter((x) => x.ok).length;
    desenhaRaiox(B, feitos);
    // as 6 etapas em sequência, como pílulas ligadas por setas
    const CURTO = ['Números', 'Veredito', 'Próximo mês', 'Encontro', 'Peças', 'Resultados'];
    $('fech-etapas').replaceChildren(
      el('span', 'etapas__pct' + (feitos === 6 ? ' is-ok' : ''), feitos + ' de 6 · ' + Math.round(feitos / 6 * 100) + '%'),
      ...passos.flatMap((x, i) => [i ? el('span', { class: 'etapas__sep', 'aria-hidden': 'true' }) : null,
        el('a', { class: 'etapa ' + (x.ok ? 'is-ok' : 'is-todo'), href: '#fech-' + i, title: x.titulo }, CURTO[i] || x.titulo)]).filter(Boolean));
    $('fech-count').textContent = feitos < 6 ? String(6 - feitos) : ''; $('fech-count').className = 'side__ind' + (feitos < 6 ? ' is-hot' : '');
    $('fech-lista').replaceChildren(...passos.map((x, i) => el('li', { class: 'fech__item' + (x.ok ? ' is-ok' : ''), id: 'fech-' + i },
      el('span', { class: 'fech__ico', 'aria-hidden': 'true' }, x.ok ? '✓' : String(i + 1)),
      el('div', 'fech__txt', el('p', 'fech__t', x.titulo, el('span', 'sr-only', x.ok ? ' (feito)' : ' (pendente)')), el('p', 'fech__d', x.detalhe)),
      x.ok ? (x.desfazer ? el('button', { class: 'link', type: 'button', onclick: () => semNumeros(false) }, 'Voltar a cobrar') : null)
        : el('div', 'fech__btns', el('a', { class: 'btn btn--ghost btn--sm', href: '#' + x.aba }, x.acao),
          x.chave === 'numeros' ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => semNumeros(true) }, 'Marcar como OK sem envio') : null))));
    // outros sinais que não estão nos 6 passos
    const extra = G.sinais(B).filter((x) => /essencia|atividade|Pesquisa|travada/.test(x.texto));
    // "Abrir" leva à seção exata e contorna ela por um instante, para o consultor ver onde está
    const alvoDoSinal = (x) => (/pesquisa/i.test(x.texto) ? 'res-pesq' : /números/i.test(x.texto) ? 'res-num' : /veredito/i.test(x.texto) ? 'pane-foco' : 'pane-' + x.aba);
    // em lista, como os passos acima: sinal colorido, o que é e um botão para resolver (nada solto no canto da tela)
    const textoSinal = (t) => t.replace(/^Pesquisa com 0 respostas.*$/, 'A pesquisa ainda não recebeu respostas');
    const ICO_S = { alto: '!', medio: '!', baixo: 'i' };
    $('fech-sinais').replaceChildren(...(extra.length ? [el('section', { class: 'atencao', 'aria-labelledby': 'aten-t' },
      el('div', 'atencao__head', el('h2', { class: 'title-sm', id: 'aten-t' }, 'Também precisa de atenção'), el('span', 'atencao__n', String(extra.length))),
      el('ul', 'atencao__lista', extra.map((x) => el('li', 'atencao__i is-' + x.nivel,
        el('span', { class: 'atencao__q', 'aria-hidden': 'true' }, ICO_S[x.nivel] || 'i'),
        el('p', 'atencao__t', textoSinal(x.texto)),
        el('a', { class: 'btn btn--ghost btn--sm', href: '#' + x.aba, onclick: () => destacaAlvo(alvoDoSinal(x)) }, 'Abrir')))))] : []));
  };
  // resumo do cliente no topo: mês do plano, fechamento, promessa e próximo encontro
  // placar do compromisso da semana que o cliente assume no portal (some se ele ainda não usou)
  const placarComp = (B) => {
    return null; // o compromisso da semana saiu do portal; o placar não aparece mais
    const cp = G.compromissos ? G.compromissos(B) : null; if (!cp || !cp.com) return null; // eslint-disable-line no-unreachable
    const ROT = { ok: 'cumprido', nao: 'não cumprido', sem: 'sem resposta', vazio: 'sem compromisso' };
    return el('span', 'ktile__sub comp__placar', el('span', { class: 'comp__sem', role: 'img', 'aria-label': cp.feitas + ' de ' + cp.com + ' compromissos cumpridos' },
      cp.semanas.map((x) => el('span', { class: 'comp__d comp__d--' + x.estado, title: 'Semana de ' + U.dia(x.semana) + ': ' + ROT[x.estado] }))),
      el('span', 'comp__n', 'Compromissos ' + cp.feitas + ' de ' + cp.com));
  };
  const desenhaRaiox = (B, feitos) => {
    const p = B.plano; const dur = p.duracao_meses || 18; const m = U.mesDoPlano(p);
    const barra = (pct, cls) => el('span', 'kbar' + (cls ? ' ' + cls : ''), el('span', { style: 'width:' + Math.max(3, Math.min(100, pct)) + '%' }));
    const pr = G.promessa(B);
    const delta = (rot, v) => el('span', 'kdelta' + (v == null ? ' is-nd' : v >= 0 ? ' is-up' : ' is-down'),
      el('b', null, v == null ? '—' : (v > 0 ? '+' : '') + String(v).replace('.', ',') + '%'), ' ' + rot);
    const prox = B.encontros.find((e) => e.inicio > new Date().toISOString() && e.status === 'agendado');
    $('raiox').replaceChildren(
      el('a', { class: 'ktile ktile--a', href: '#plano' }, el('span', 'ktile__lbl', 'Mês do plano'), el('span', 'ktile__num', String(m), el('small', null, ' de ' + dur)), barra(m / dur * 100), placarComp(B)),
      el('a', { class: 'ktile ktile--b', href: '#fechamento' }, el('span', 'ktile__lbl', 'Fechamento do mês'), el('span', 'ktile__num', String(feitos), el('small', null, ' de 6')), barra(feitos / 6 * 100, feitos === 6 ? 'is-ok' : '')),
      el('a', { class: 'ktile ktile--c', href: '#resultados' }, el('span', 'ktile__lbl', 'Promessa desde o início'), el('span', 'ktile__deltas', delta('vendas', pr.vendas), delta('pessoas', pr.pessoas), delta('valor', pr.valor))),
      el('a', { class: 'ktile ktile--d', href: '#encontros' }, el('span', 'ktile__lbl', 'Próximo encontro'), el('span', 'ktile__num ktile__num--txt', prox ? U.quando(prox.inicio) : 'Nenhum marcado'), el('span', 'ktile__sub', prox ? ({ mensal: 'Revisão mensal', semestral: 'Revisão semestral', anual: 'Revisão anual', entrega: 'Entrega' }[prox.tipo] || 'Encontro') + ' · ' + prox.duracao_min + ' min' : 'Marque em Encontros')));
  };
  // cliente que não vai mandar números: para de cobrar (pode voltar quando quiser)
  const semNumeros = async (on) => {
    if (on && !confirm('Marcar que este cliente não envia os números do mês? O painel e o portal param de cobrar e de avisar. Dá para desfazer em Plano.')) return;
    const r = await sb.from('planos').update({ sem_numeros: on }).eq('empresa_id', id);
    if (r.error) return alert('Não foi possível salvar.');
    $('p-semnum').checked = on; desenhaFechamento();
  };
  desenhaFechamento();
  window.addEventListener('hashchange', () => { if (location.hash === '#fechamento') desenhaFechamento(); });

  // pauta do encontro sugerida a partir dos dados (o consultor tira ou ajusta o que quiser)
  $('e-sugerir').addEventListener('click', async () => {
    const B = G && await G.carregar(sb, id); if (!B) return;
    const itens = G.pautaSugerida(B);
    const txt = $('e-pauta-outro'); const atuais = txt.value.split('\n').map((x) => x.trim()).filter(Boolean);
    const novos = itens.filter((x) => !atuais.includes(x));
    txt.value = [...atuais, ...novos].join('\n');
    say($('e-sug-msg'), novos.length ? novos.length + (novos.length === 1 ? ' item sugerido' : ' itens sugeridos') + ' a partir das ações, dos números e das peças. Ajuste o que quiser.' : 'A pauta já tem tudo o que os dados sugerem.', 'ok');
  });

  // estado vazio compacto (no lugar de faixas largas e vazias): prévia em esqueleto, título, texto e uma ação opcional
  const vazioC = (tipo, titulo, texto, acao) => el('div', 'vz vz--' + tipo,
    el('div', { class: 'vz__prev', 'aria-hidden': 'true' }, tipo === 'chat'
      ? [el('span', 'vz__b vz__b--l'), el('span', 'vz__b vz__b--r'), el('span', 'vz__b vz__b--l vz__b--c')]
      : [el('span', 'vz__l vz__l--a'), el('span', 'vz__l vz__l--b'), el('span', 'vz__l vz__l--c')]),
    el('p', 'vz__t', titulo), el('p', 'vz__d', texto), acao || null);
  // rola até um bloco e desenha um contorno que some sozinho
  const destacaAlvo = (alvoId) => setTimeout(() => {
    const t = document.getElementById(alvoId); if (!t) return;
    t.scrollIntoView({ block: 'start', behavior: 'smooth' });
    t.classList.remove('is-alvo'); void t.offsetWidth; t.classList.add('is-alvo');
    setTimeout(() => t.classList.remove('is-alvo'), 2400);
  }, 120);
  // atalhos dentro de Resultados (Números, Pesquisa…): rolam até o bloco em vez de trocar o endereço (que levava ao Fechamento)
  document.querySelectorAll('.subnav a[href^="#"]').forEach((a) => a.addEventListener('click', (ev) => {
    ev.preventDefault(); destacaAlvo(a.getAttribute('href').slice(1));
  }));
  // ===== mensagens do cliente =====
  const loadMsgs = async (marcar) => {
    const { data } = await sb.from('mensagens').select('*').eq('empresa_id', id).order('criada_em');
    const rows = data || [];
    const novas = rows.filter((m) => m.de === 'cliente' && !m.lida);
    if (marcar && novas.length) await sb.from('mensagens').update({ lida: true }).eq('empresa_id', id).eq('de', 'cliente').eq('lida', false);
    const n = marcar ? 0 : novas.length;
    $('msg-count').hidden = !n; $('msg-count').textContent = n;
    const box = $('adm-chat');
    // dias separados, balões: os seus à direita, os do cliente à esquerda
    let dia = null; const itens = [];
    rows.forEach((m) => {
      const d = U.dia(m.criada_em); if (d !== dia) { dia = d; itens.push(el('p', 'conv__dia', d)); }
      itens.push(el('div', 'chat__msg chat__msg--' + (m.de === 'consultor' ? 'cliente' : 'consultor') + (m.de === 'cliente' && !m.lida && !marcar ? ' is-nova' : ''),
        el('p', 'chat__text', m.texto),
        el('p', 'chat__meta', (m.de === 'consultor' ? 'Você' : (emp.nome || 'Cliente')) + ' · ' + U.hora(m.criada_em) + (m.de === 'cliente' && !m.lida && !marcar ? ' · nova' : ''))));
    });
    box.classList.toggle('is-vazio', !rows.length);
    box.replaceChildren(...(rows.length ? itens : [vazioC('chat', 'Nenhuma mensagem ainda', 'Escreva a primeira. Ela aparece em destaque no portal do cliente até ser lida.')]));
    box.scrollTop = box.scrollHeight;
  };
  if ($('conv-nome')) { $('conv-nome').textContent = emp.nome || 'Cliente'; U.avatar($('conv-av'), emp.nome, emp.logo_url); }
  // Enter envia; Shift+Enter quebra a linha; a caixa cresce com o texto
  const caixa = $('adm-chat-txt');
  caixa.addEventListener('input', () => { caixa.style.height = 'auto'; caixa.style.height = Math.min(caixa.scrollHeight, 160) + 'px'; });
  caixa.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); $('adm-chat-form').requestSubmit(); } });
  // ===== mensagens prontas (follow-up): o consultor clica, a mensagem entra no campo já com o mês e o próximo encontro =====
  const PRONTAS = [
    ['Acompanhamento', [
      ['Como estão as ações', 'Olá! Passando para saber como estão as ações deste mês.\nAlguma travou? Me conta que a gente resolve junto.'],
      ['Números do mês', 'Olá! Os números de {mes} ainda não chegaram.\nQuando puder, envie pelo portal, em Resultados.\nLeva 2 minutos e deixa o próximo encontro muito mais produtivo.'],
      ['Depois do encontro', 'Obrigado pelo encontro de hoje!\nOs combinados já estão no portal, em Ações.\nQualquer dúvida, é só responder aqui.'],
      ['Ficamos sem conversar', 'Oi! Vi que ficamos um tempo sem conversar. Está tudo bem por aí?\nSe a rotina apertou, me diz o que dá para fazer este mês e eu ajusto o plano.'],
    ]],
    ['Lembretes', [
      ['Próximo encontro', 'Lembrete: nosso próximo encontro é {encontro}.\nSe quiser levar algum assunto para a pauta, escreva no portal, em Encontros.'],
      ['Pesquisa de marca', 'A pesquisa de marca está aberta.\nO mais importante é ouvir quem compra {categoria} e ainda não é seu cliente.\nQue tal mandar o link para grupos do bairro, parceiros e conhecidos, além da sua lista?'],
      ['Peça revisada', 'Revisei a peça e deixei os comentários no portal, em Peças.\nSe fizer sentido, é só ajustar e mandar a nova versão.'],
    ]],
    ['Conquistas', [
      ['Ação concluída', 'Parabéns por concluir mais uma ação!\nÉ a constância que faz a marca crescer.\nVamos para a próxima.'],
      ['Resultado melhorou', 'Os números do último mês mostram avanço.\nVale olhar com calma em Resultados, no portal.\nNo próximo encontro, vemos juntos o que puxou isso.'],
    ]],
  ];
  const montaProntas = async () => {
    if (!$('prontas')) return;
    const mesAnt = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleString('pt-BR', { month: 'long' });
    const { data: prox } = await sb.from('encontros').select('inicio').eq('empresa_id', id).gte('inicio', new Date().toISOString()).order('inicio').limit(1);
    const enc = prox && prox[0] ? U.quando(prox[0].inicio).replace(/^./, (c) => c.toLowerCase()) : 'em breve';
    const { data: pq } = await sb.from('pesquisas').select('categoria').eq('empresa_id', id).order('criada_em', { ascending: false }).limit(1);
    const cat = (pq && pq[0] && pq[0].categoria) || 'o que vocês vendem';
    const preenche = (s) => s.replace('{mes}', mesAnt).replace('{encontro}', enc).replace('{categoria}', cat);
    $('prontas-n').textContent = PRONTAS.reduce((n, [, l]) => n + l.length, 0);
    $('prontas').replaceChildren(...PRONTAS.map(([g, lista]) => el('div', 'prontas__grupo',
      el('p', 'prontas__g', g),
      ...lista.map(([titulo, texto]) => el('button', { type: 'button', class: 'prontas__i', onclick: () => {
        caixa.value = preenche(texto); caixa.dispatchEvent(new Event('input')); caixa.focus();
        caixa.setSelectionRange(caixa.value.length, caixa.value.length);
      } }, el('span', 'prontas__it', titulo), el('span', 'prontas__ip', preenche(texto).replace(/\n/g, ' ')))))));
  };
  montaProntas();
  const naAbaMensagens = () => location.hash === '#mensagens';
  loadMsgs(naAbaMensagens());
  window.addEventListener('hashchange', () => { if (naAbaMensagens()) loadMsgs(true); });
  $('adm-chat-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = $('adm-chat-txt').value.trim();
    if (!t) return say($('adm-chat-msg'), 'Escreva a resposta.', 'error');
    const r = await sb.from('mensagens').insert({ empresa_id: id, autor_id: me.id, de: 'consultor', texto: t });
    if (r.error) return say($('adm-chat-msg'), 'Não foi possível enviar.', 'error');
    $('adm-chat-txt').value = ''; caixa.style.height = ''; say($('adm-chat-msg'), ''); loadMsgs(true);
  });

  // ===== plano =====
  const [{ data: plano }, { data: admins }] = await Promise.all([
    sb.from('planos').select('*').eq('empresa_id', id).maybeSingle(),
    sb.from('profiles').select('id, name, email').eq('role', 'admin').eq('active', true),
  ]);
  const p = plano || { inicio: null, duracao_meses: 18, status: 'ativo', tipo: 'consultoria', acesso_gratis_meses: 1, esforco_marca_pct: U.esforcoPadrao(emp && emp.setor), // divisão marca:ativação de referência para o setor (estudos de eficácia)
    prazo_revisao_dias: 2, consultor_id: me.id };
  const SELO_P = { ativo: ['', 'Ativo'], pausado: [' is-warn', 'Pausado'], encerrado: [' is-off', 'Encerrado'] };
  const sub = () => {
    const alvo = $('sub'); alvo.textContent = '';
    if (!p.inicio) { alvo.textContent = 'Sem plano'; return; }
    const [c, t] = U.situacaoPlano(p) || SELO_P[p.status] || ['', p.status];
    alvo.append(el('span', null, p.tipo === 'acesso' ? 'Só acesso' : 'Mês ' + mesDoPlano(p) + ' de ' + p.duracao_meses), el('span', 'badge selo-plano' + c, t));
  };
  sub();

  $('p-consultor').replaceChildren(...admins.map((a) => el('option', { value: a.id }, a.name || a.email)));
  const fields = {
    'p-inicio': 'inicio', 'p-duracao': 'duracao_meses', 'p-status': 'status', 'p-tipo': 'tipo', 'p-consultor': 'consultor_id',
    'p-meta': 'meta_faturamento_pct', 'p-base': 'faturamento_base', 'p-esforco': 'esforco_marca_pct',
    'p-prazo': 'prazo_revisao_dias', 'p-gratis': 'acesso_gratis_meses', 'p-acesso-ate': 'acesso_ate', 'p-revis': 'revisoes_mes', 'p-dias': 'dias_resposta', 'p-inclui': 'plano_inclui', 'p-fatura': 'proxima_fatura', 'p-mensal': 'mensalidade',
  };
  $('p-nome').value = emp.nome;
  $('p-semnum').checked = !!p.sem_numeros;
  // sazonalidade e participação de mercado
  for (let k = 1; k <= 12; k += 1) { const mm = String(k).padStart(2, '0'); U.moedaSet($('p-fa-' + mm), (p.fat_ano_anterior || {})[mm] ?? null); }
  $('p-partmerc').value = p.participacao_mercado ?? '';
  // o cliente informou o ponto de partida pelo portal: o consultor vê de onde veio o número
  if (p.partida_cliente && p.faturamento_base != null) {
    $('p-base-d').textContent = 'Informado pelo cliente no portal. Se mudar o valor aqui, ele passa a ser seu e\u00a0o\u00a0cliente não altera mais.';
    $('p-base-d').classList.add('is-cliente');
  } else if (p.faturamento_base == null) $('p-base-d').textContent = 'Média mensal dos 12 meses antes do plano. Se ficar vazio, o cliente informa no portal.';
  Object.entries(fields).forEach(([f, k]) => {
    const n = $(f);
    if (n && n.tagName === 'SELECT' && !ehCombo(f) && p[k] != null && ![...n.options].some((o) => o.value === String(p[k]))) n.append(el('option', { value: p[k] }, String(p[k])));
    setv(f, p[k]);
  });
  // a divisão de referência para este cliente: setor + estratégia (compra recorrente, preço baixo); o consultor decide
  const refEsforco = () => {
    const r = U.esforcoReferencia(emp.setor, p.como_vencer);
    const nome = U.setorNome(emp.setor).toLowerCase() || 'média geral';
    const usar = el('button', { class: 'link', type: 'button', onclick: () => {
      const sel = $('p-esforco'); if (![...sel.options].some((o) => o.value === String(r.pct))) sel.append(el('option', { value: r.pct }, r.pct + '% marca · ' + (100 - r.pct) + '% ativação (referência deste cliente)'));
      sel.value = String(r.pct); refEsforco();
    } }, 'Usar ' + r.pct + '%');
    $('p-esforco-d').replaceChildren('Referência para este cliente: ' + r.pct + '% de marca (' + nome.toLowerCase() + ' ' + r.base + (r.partes.length ? ', ' + r.partes.join(', ') : '') + '). '
      + 'Na opção de lançamento, a divisão vira sozinha para 57% no 13º mês. Proposta, preço e atendimento ficam fora da conta. ',
      Number($('p-esforco').value) === r.pct || Number($('p-esforco').value) === 35 ? '' : usar);
  };
  refEsforco(); $('p-esforco').addEventListener('change', refEsforco);

  // ===== acesso à plataforma ("Só acesso"): período grátis, validade e pagamentos =====
  const CICLO_T = { mensal: 'mensal', semestral: 'semestral', anual: 'anual' };
  const desenhaAcesso = async () => {
    const eAcesso = $('p-tipo').value === 'acesso';
    $('fset-acesso').hidden = !eAcesso; if (!eAcesso) return;
    const pv = { ...p, tipo: 'acesso', acesso_gratis_meses: Number($('p-gratis').value || 0), acesso_ate: $('p-acesso-ate').value || p.acesso_ate || null, inicio: $('p-inicio').value || p.inicio };
    if (!$('p-acesso-ate').value) pv.acesso_ate = null;
    const vence = U.acessoVence(pv); const dias = U.acessoDiasRestantes(pv);
    const pago = !!p.acesso_ciclo && !!p.acesso_ate;
    $('acesso-sit').replaceChildren(!vence ? '' : el('p', 'acesso-sit__t' + (dias < 0 ? ' is-off' : dias <= 10 ? ' is-warn' : ''),
      dias < 0 ? 'Pagamento pendente desde ' + U.diaAno(vence) + '. O cliente vê só a identidade visual e a narrativa.'
        : (pago ? 'Pago até ' + U.diaAno(vence) + ' (' + CICLO_T[p.acesso_ciclo] + ')' : 'Grátis até ' + U.diaAno(vence)) + (dias <= 10 ? ' · termina em ' + (dias === 0 ? 'hoje' : dias + (dias === 1 ? ' dia' : ' dias')) : '') + '.'));
    const { data } = await sb.from('pagamentos').select('*').eq('empresa_id', id).order('pago_em', { ascending: false }).limit(12);
    $('pag-hist').replaceChildren(...(data || []).map((g) => el('li', null, U.dia(g.pago_em) + ' · ' + U.cap(CICLO_T[g.ciclo]) + (g.valor != null ? ' · ' + U.reais(g.valor) : '') + ' · até ' + U.diaAno(g.liberado_ate))));
  };
  ['p-tipo', 'p-gratis', 'p-acesso-ate', 'p-inicio'].forEach((f) => $(f).addEventListener('change', desenhaAcesso));
  document.querySelectorAll('#fset-acesso [data-ciclo]').forEach((b) => b.addEventListener('click', async () => {
    const ciclo = b.dataset.ciclo;
    if (!p.inicio) return say($('pag-msg'), 'Salve o plano antes de registrar um pagamento.', 'error');
    b.disabled = true;
    const { data: ate, error } = await sb.rpc('registrar_pagamento', { p_empresa: id, p_ciclo: ciclo, p_valor: U.moedaValor($('pag-valor')) });
    b.disabled = false;
    if (error) return say($('pag-msg'), error.message || 'Não foi possível registrar.', 'error');
    p.acesso_ate = ate; p.acesso_ciclo = ciclo; $('p-acesso-ate').value = ate; $('pag-valor').value = '';
    say($('pag-msg'), 'Pagamento ' + CICLO_T[ciclo] + ' registrado. Acesso liberado até ' + U.diaAno(ate) + '.', 'ok');
    sub(); desenhaAcesso();
  }));
  desenhaAcesso();

  $('plan-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const nome = $('p-nome').value.trim();
    if (!nome) return say($('plan-msg'), 'Dê um nome para a empresa.', 'error');
    if (!$('p-inicio').value) return say($('plan-msg'), 'Escolha a data de início.', 'error');
    const row = { empresa_id: id, updated_at: new Date().toISOString() };
    Object.entries(fields).forEach(([f, k]) => {
      if (ehCombo(f)) { row[k] = U.comboValue(f); return; }
      if ($(f).hasAttribute('data-moeda')) { row[k] = U.moedaValor($(f)); return; }
      const v = $(f).value.trim();
      row[k] = v === '' ? null : ($(f).type === 'number' || $(f).hasAttribute('data-num') ? Number(v) : v);
    });
    row.duracao_meses = row.duracao_meses || 18;
    row.esforco_marca_pct = row.esforco_marca_pct ?? U.esforcoPadrao(emp && emp.setor);
    row.prazo_revisao_dias = row.prazo_revisao_dias || 2;
    row.revisoes_mes = row.revisoes_mes ?? 2; row.dias_resposta = row.dias_resposta || 'terças e quintas';
    row.sem_numeros = $('p-semnum').checked;
    row.fat_ano_anterior = {};
    for (let k = 1; k <= 12; k += 1) { const mm = String(k).padStart(2, '0'); const v = U.moedaValor($('p-fa-' + mm)); if (v != null) row.fat_ano_anterior[mm] = v; }
    row.participacao_mercado = $('p-partmerc').value === '' ? null : Number($('p-partmerc').value);
    // mexeu no ponto de partida informado pelo cliente: o valor passa a ser do consultor
    if (p.partida_cliente && (Number(row.faturamento_base) !== Number(p.faturamento_base) || JSON.stringify(row.fat_ano_anterior) !== JSON.stringify(p.fat_ano_anterior || {}))) row.partida_cliente = false;
    // logo: vai para o balde público "publico" (aparece no menu do cliente)
    let logo = emp.logo_url || null;
    const lf = $('p-logo').files[0];
    if (lf) {
      if (!/^image\//.test(lf.type) || lf.size > 5 * 1024 * 1024) return say($('plan-msg'), 'O logo precisa ser uma imagem de até 5 MB.', 'error');
      const caminho = id + '/logo-' + crypto.randomUUID() + '.' + ((lf.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, ''));
      const up = await sb.storage.from('publico').upload(caminho, lf, { contentType: lf.type });
      if (up.error) return say($('plan-msg'), 'Não foi possível enviar o logo.', 'error');
      logo = sb.storage.from('publico').getPublicUrl(caminho).data.publicUrl;
    } else if ($('p-logo-rm').checked) logo = null;
    const [a, b] = await Promise.all([
      sb.from('empresas').update({ nome, logo_url: logo, setor: $('p-setor').value || null }).eq('id', id),
      sb.from('planos').upsert(row),
    ]);
    if (a.error || b.error) return say($('plan-msg'), 'Não foi possível salvar.', 'error');
    Object.assign(p, row); emp.nome = nome; emp.logo_url = logo; emp.setor = $('p-setor').value || null; $('name').textContent = nome; sub();
    $('p-logo').value = ''; $('p-logo-rm').checked = false; mostraLogo();
    document.dispatchEvent(new CustomEvent('gang:setor', { detail: emp.setor })); // a Estratégia reagrupa as abordagens pelo setor novo
    say($('plan-msg'), 'Salvo.', 'ok');
  });

  $('del-empresa').addEventListener('click', async () => {
    if (!confirm('Excluir ' + emp.nome + ' e tudo o que foi cadastrado para ela? Isso não pode ser desfeito.')) return;
    const r = await sb.from('empresas').delete().eq('id', id);
    if (r.error) return alert('Não foi possível excluir.');
    location.replace('admin.html');
  });

  // ===== utilidades das abas de conteúdo =====
  const MESES = (r) => U.cap(U.nomeMes(r)) + ' ' + r.slice(0, 4);
  const rowBtn = (label, fn, danger) => el('button', { class: 'btn btn--ghost btn--sm' + (danger ? ' btn--danger' : ''), type: 'button', onclick: fn }, label);
  const val = (fid) => { if (ehCombo(fid)) return U.comboValue(fid); const v = $(fid).value.trim(); return v === '' ? null : v; };

  // ===== a ação da biblioteca já entra com passos, tamanho, quando medir e mensagem pronta =====
  const detalheDe = (titulo) => {
    const x = ((window.GangPresets || {}).acoes || []).find((a) => a.texto === titulo);
    // sempre as mesmas colunas: numa gravação em lote, a coluna que falta numa linha vira vazio (e passos não aceita vazio)
    if (!x) return { passos: [], tamanho: null, ler_em_dias: null, modelo: null, tipo: null };
    return { passos: (x.passos || []).map((t) => ({ t, ok: false })), tamanho: x.tam || null, ler_em_dias: x.ler || null, modelo: x.modelo || null, tipo: x.tipo || null };
  };
  const TAM = (window.GangPresets && window.GangPresets.TAMANHO) || { P: ['P', '', 1], M: ['M', '', 2], G: ['G', '', 4] };
  const doSetor = (x) => !emp.setor || !x.setores || x.setores.includes(emp.setor) || x.setores.includes(U.setorBase(emp.setor));
  // carga do mês: mais de 5 ações ou mais de 8 pontos (P=1, M=2, G=4) é pesado demais para executar
  const cargaDe = (lista) => ({ n: lista.length, pts: lista.reduce((t, a) => t + ((TAM[a.tamanho || a.tam] || [, , 2])[2]), 0) });
  const pesado = (c) => c.n > 5 || c.pts > 8;
  // aprendizado: como cada ação foi em todos os clientes (o consultor vê todos)
  let historico = null;
  const carregaHistorico = async () => {
    if (historico) return historico;
    const [{ data }, emps] = await Promise.all([
      sb.from('acoes').select('titulo, resultado, esforco, empresa_id').not('resultado', 'is', null),
      sb.from('empresas').select('id, setor'),
    ]);
    const setorDe = Object.fromEntries(((emps && emps.data) || []).map((e) => [e.id, U.setorBase(e.setor)])); // aprende pelo setor-base (mais casos)
    historico = {};
    // ações de marca registram a execução (o efeito vem na pesquisa): não entram no "funcionou"
    // cada ação guarda o total e o resultado por setor (uma ação pode funcionar no varejo e não em serviços)
    (data || []).filter((a) => a.esforco !== 'marca').forEach((a) => {
      const v = a.resultado === 'sim' ? 1 : a.resultado === 'parcial' ? 0.5 : 0;
      const h = historico[a.titulo] || (historico[a.titulo] = { n: 0, pts: 0, setor: {} });
      h.n += 1; h.pts += v;
      const st = setorDe[a.empresa_id];
      if (st) { const x = h.setor[st] || (h.setor[st] = { n: 0, pts: 0 }); x.n += 1; x.pts += v; }
    });
    return historico;
  };
  // a evidência que vale para este cliente: a do setor dele, se já tiver 5 casos; senão, a de todos
  const evid = (titulo) => {
    const h = historico && historico[titulo]; if (!h) return null;
    const st = emp.setor && h.setor && h.setor[U.setorBase(emp.setor)];
    if (st && st.n >= 5) return { n: st.n, pts: st.pts, doSetor: true };
    return h.n >= 5 ? { n: h.n, pts: h.pts, doSetor: false } : null; // com menos de 5 casos é sorte, não evidência
  };
  const selo = (titulo) => {
    const h = evid(titulo); if (!h) return null;
    const taxa = h.pts / h.n;
    return el('span', { class: 'aprend ' + (taxa >= 0.66 ? 'is-ok' : taxa >= 0.34 ? 'is-mid' : 'is-no'), title: h.doSetor ? 'Resultado registrado em clientes do mesmo setor' : 'Resultado registrado em outros clientes' },
      'indicativo' + (h.doSetor ? ' no setor' : '') + ': funcionou em ' + String(Math.round(h.pts * 10) / 10).replace('.', ',') + ' de ' + h.n);
  };
  const taxaDe = (titulo) => { const h = evid(titulo); return h ? h.pts / h.n : 0.5; };

  // prazos dentro do mês: essencial primeiro, pré-requisito antes de quem depende dele, pequenas antes das grandes;
  // cada ação recebe uma sexta-feira, espalhando o esforço pelas semanas (nunca antes de 3 dias a partir de hoje)
  const distribuiPrazos = (mes, itens) => {
    const [y, m] = mes.split('-').map(Number);
    const minimo = new Date(); minimo.setHours(12, 0, 0, 0); minimo.setDate(minimo.getDate() + 3);
    const sextas = [];
    for (let d = new Date(y, m - 1, 1, 12); d.getMonth() === m - 1; d.setDate(d.getDate() + 1)) if (d.getDay() === 5 && d >= minimo) sextas.push(d.toLocaleDateString('sv-SE'));
    const ultimo = new Date(y, m, 0, 12); while (ultimo.getDay() === 0 || ultimo.getDay() === 6) ultimo.setDate(ultimo.getDate() - 1);
    const fimMes = ultimo.toLocaleDateString('sv-SE');
    if (!sextas.length || sextas[sextas.length - 1] < fimMes) sextas.push(fimMes);
    const pts = (x) => (TAM[x.tam] || [, , 2])[2];
    const titulos = itens.map((x) => x.texto);
    const minISO = (() => { const d = new Date(minimo); while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1); return d.toLocaleDateString('sv-SE'); })();
    if (fimMes < minISO) { const r = {}; itens.forEach((x) => { r[x.texto] = minISO; }); return r; }
    const ordem = [...itens].sort((a, b) => (titulos.includes(b.antes) && b.antes === a.texto ? -1 : 0) || (titulos.includes(a.antes) && a.antes === b.texto ? 1 : 0)
      || (b.essencial - a.essencial) || (pts(a) - pts(b)));
    const total = ordem.reduce((t, x) => t + pts(x), 0) || 1;
    const out = {}; let acum = 0;
    ordem.forEach((x) => { acum += pts(x); const i = Math.min(sextas.length - 1, Math.max(0, Math.ceil((acum / total) * sextas.length) - 1)); out[x.texto] = sextas[i]; });
    return out;
  };
  const prazosEscolhidos = (mes) => distribuiPrazos(mes, [...escolhidas.entries()].map(([t, ess]) => ({ ...((window.GangPresets.acoes || []).find((a) => a.texto === t) || { texto: t }), essencial: ess ? 1 : 0 })));

  // ===== planejar o mês: veredito (o que passou) → foco (o mês) → ações sugeridas para o foco =====
  const MF = (window.GangPresets && window.GangPresets.modelosFoco) || {};
  // o foco previsto de um mês: o foco da biblioteca que mais reúne as ações daquele mês (essencial conta em dobro)
  const focoPrevisto = (itens) => {
    let melhor = null; let pts = 0;
    Object.entries(MF).forEach(([f, m]) => {
      const n = itens.reduce((t, x) => t + (m.acoes.includes(x.titulo) ? (x.peso === 'essencial' ? 2 : 1) : 0), 0);
      if (n > pts) { pts = n; melhor = f; }
    });
    return melhor;
  };
  let previsto = null; // foco previsto pelo plano para o mês aberto no Planejar o mês
  const PROMN = { vendas: 'Venda mais', pessoas: 'Para mais pessoas', valor: 'Com mais valor' };
  let BP = null; // dados do cliente para os números e a sugestão de foco
  const mesSel = () => $('f-mes').value || U.ref();
  const prom = () => (BP && G ? G.promessa(BP) : {});
  const desenhaNums = () => {
    const pr = prom();
    const ult = BP ? BP.numeros.filter((n) => n.faturamento != null).slice(-1)[0] : null;
    $('pl-ver-ref').textContent = ult ? '· números até ' + U.nomeMes(ult.mes_ref) : '· ainda sem números';
    $('pl-nums').replaceChildren(...Object.keys(PROMN).map((k) => {
      const v = pr[k];
      return el('div', 'plan__num' + (v == null ? ' is-nd' : v < 0 ? ' is-down' : ' is-up'), el('span', 'plan__num-l', PROMN[k]),
        el('strong', null, v == null ? '—' : (v > 0 ? '+' : '') + String(v).replace('.', ',') + '%'));
    }));
    const caiu = Object.keys(PROMN).filter((k) => pr[k] != null && pr[k] < 0);
    $('pl-notas-sub').textContent = caiu.length ? 'caiu: ' + caiu.map((k) => PROMN[k]).join(', ') : 'nenhum número caiu';
    if (caiu.length) $('pl-notas').open = true;
  };
  // o veredito e os números que caíram apontam os focos que fazem sentido
  const sugestoes = () => {
    const pr = prom(); const ver = (val('f-veredito') || '').toLowerCase();
    const pts = Object.entries(MF).map(([f, m]) => {
      let n = 0;
      if (pr[m.promessa] != null && pr[m.promessa] < 0) n += 2;
      if (/preço|desconto|valor|ticket/.test(ver) && m.promessa === 'valor') n += 2;
      if (/alcançar|não compra|lembr|quem ainda/.test(ver) && m.promessa === 'pessoas') n += 2;
      if (/vendas subiram|números caíram|ajuste/.test(ver) && m.promessa === 'vendas') n += 1;
      if (/mensagem/.test(ver) && /mensagem|tom de voz/i.test(f)) n += 3;
      if (/atrasaram|presença contínua/.test(ver) && /presente|pausas/i.test(f)) n += 3;
      if (/sem os números/.test(ver) && /^Medir/.test(f)) n += 3;
      if (/desconto/.test(ver) && /Proteger o preço/.test(f)) n += 3;
      if (/no ritmo|subiu|cresceram/.test(ver) && /indicações|pós-venda|presente/i.test(f)) n += 1;
      // manutenção cuida de quem já é cliente: nunca é sugerida quando o objetivo é crescer
      if (m.manutencao) n = (pr.pessoas != null && pr.pessoas < 0) || (pr.vendas != null && pr.vendas < 0) || /alcançar|caíram|ajuste|não compra/.test(ver) ? 0 : Math.min(n, 1);
      return [f, n];
    });
    return pts.filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f]) => f);
  };
  const desenhaSug = () => {
    const ss = sugestoes().filter((f) => f !== previsto); const atual = val('f-titulo');
    const chip = (f) => el('button', { class: 'plan__chip' + (f === atual ? ' is-on' : ''), type: 'button', onclick: () => { setv('f-titulo', f); desenhaSug(); desenhaPlAcoes(); } }, f);
    const doPlano = previsto ? [el('span', 'plan__sug-l', 'Previsto no plano'), chip(previsto)] : [];
    $('pl-sug').replaceChildren(...doPlano, ...(ss.length
      ? [el('span', 'plan__sug-l', 'Sugeridos pelo veredito'), ...ss.map((f) => el('button', { class: 'plan__chip' + (f === atual ? ' is-on' : ''), type: 'button',
        onclick: () => { setv('f-titulo', f); desenhaSug(); desenhaPlAcoes(); } }, f))]
      : [el('span', 'plan__sug-l', 'Escolha o veredito e os focos que combinam aparecem aqui.')]));
  };
  // as ações do modelo do foco, como checklist: o consultor marca as que entram no mês
  const escolhidas = new Map(); // título → essencial?
  const desenhaPlAcoes = async () => {
    const f = val('f-titulo'); const m = MF[f]; const mes = mesSel();
    $('pl-foco-ref').textContent = '· ' + U.nomeMes(mes); $('pl-ac-ref').textContent = '· ' + U.nomeMes(mes);
    const box = $('pl-acoes');
    if (!f) { escolhidas.clear(); return box.replaceChildren(el('p', 'plan__vazio', 'Escolha o foco e as ações do modelo aparecem aqui.')); }
    if (!m) { escolhidas.clear(); return box.replaceChildren(el('p', 'plan__vazio', 'Foco escrito à mão: escolha as ações na biblioteca, em Ações.')); }
    const { data } = await sb.from('acoes').select('titulo, mes_previsto, status, peso, tamanho').eq('empresa_id', id);
    const todas = data || []; await carregaHistorico();
    const temEss = todas.some((a) => a.mes_previsto === mes && a.peso === 'essencial');
    const lib = (t) => (window.GangPresets.acoes || []).find((x) => x.texto === t) || { texto: t };
    [...escolhidas.keys()].forEach((t) => { if (!m.acoes.includes(t)) escolhidas.delete(t); });
    const sug = prazosEscolhidos(mes);
    const itens = m.acoes.map(lib).sort((a, b) => (doSetor(b) - doSetor(a)) || (taxaDe(b.texto) - taxaDe(a.texto))).map((x) => {
      const noMes = todas.some((a) => a.titulo === x.texto && a.mes_previsto === mes);
      const feita = !noMes && todas.some((a) => a.titulo === x.texto && a.status === 'feita');
      const livre = !noMes && !feita;
      const cb = el('input', { type: 'checkbox', checked: escolhidas.has(x.texto), disabled: !livre, 'aria-label': 'Incluir “' + x.texto + '”' });
      const ess = el('button', { class: 'plan__ess', type: 'button', 'aria-pressed': String(!!escolhidas.get(x.texto)), hidden: !escolhidas.has(x.texto), title: 'A essencial do mês' }, 'Essencial');
      cb.addEventListener('change', () => {
        if (cb.checked) escolhidas.set(x.texto, !temEss && ![...escolhidas.values()].some(Boolean)); else escolhidas.delete(x.texto);
        desenhaPlAcoes();
      });
      ess.addEventListener('click', () => { const on = !escolhidas.get(x.texto); [...escolhidas.keys()].forEach((t) => escolhidas.set(t, false)); escolhidas.set(x.texto, on); desenhaPlAcoes(); });
      return el('li', 'plan__ac' + (livre ? '' : ' is-off'),
        el('label', 'plan__ac-main', cb, el('span', 'plan__ac-txt', el('span', 'plan__ac-t', x.texto),
          el('span', 'plan__ac-s', [x.tam ? 'Tamanho ' + x.tam + ' (' + TAM[x.tam][1] + ')' : null, x.esforco ? 'esforço de ' + (x.esforco === 'marca' ? 'marca' : 'venda') : null, x.promessa ? PROMN[x.promessa] : null].filter(Boolean).join(' · ')),
          el('span', 'plan__ac-tags', sug[x.texto] ? el('span', 'mtag mtag--date', 'Prazo sugerido: ' + U.dia(sug[x.texto])) : null, selo(x.texto),
            x.manutencao ? el('span', { class: 'aviso-chip aviso-chip--man', title: 'Cuida de quem já é cliente. Vale, mas não faz a marca crescer.' }, 'Manutenção') : null,
            !doSetor(x) ? el('span', 'aviso-chip', 'Pouco usada em ' + (U.setorNome(emp.setor) || 'este setor').toLowerCase()) : null,
            x.antes && !todas.some((a) => a.titulo === x.antes) && !escolhidas.has(x.antes) ? el('span', 'aviso-chip', 'Antes: ' + x.antes.split(':')[0]) : null))),
        noMes ? el('span', 'chip chip--done', 'Já no mês') : feita ? el('span', 'chip chip--todo', 'Já feita antes') : ess);
    });
    const n = escolhidas.size;
    const doMes = todas.filter((a) => a.mes_previsto === mes).concat([...escolhidas.keys()].map((t) => ({ tam: (lib(t) || {}).tam })));
    const carga = cargaDe(doMes);
    box.replaceChildren(...[el('ul', 'plan__acs', itens),
      pesado(carga) ? el('p', 'insight', el('span', 'insight__lbl', 'Mês pesado'), el('span', null, carga.n + ' ações no mês (' + carga.pts + ' pontos de tamanho). Planos com tarefa demais param no segundo mês: o ideal é até 5 ações e 8 pontos (ações rápidas pesam menos).')) : null,
      el('p', 'plan__acs-foot', n ? n + (n === 1 ? ' ação entra' : ' ações entram') + ' em ' + U.nomeMes(mes) + ' com os prazos sugeridos (essencial primeiro, pequenas antes das grandes). Dá para mudar cada data em Ações.' + (temEss ? '' : ' Marque uma como essencial.') : 'Marque as ações que entram no mês. Nada é adicionado sem você marcar.')].filter(Boolean));
  };
  $('f-titulo').addEventListener('change', () => { escolhidas.clear(); desenhaSug(); desenhaPlAcoes(); });
  $('f-veredito').addEventListener('change', desenhaSug);
  $('f-veredito-outro').addEventListener('input', desenhaSug);
  $('f-mes').addEventListener('change', () => carregaMes($('f-mes').value));
  (async () => { BP = G ? await G.carregar(sb, id) : null; desenhaNums(); desenhaSug(); })();

  const loadFocos = async () => {
    const { data, error } = await sb.from('orientacoes').select('*').eq('empresa_id', id).order('mes_ref', { ascending: false }).order('publicada_em', { ascending: false });
    const list = $('focos');
    if (error) return list.replaceChildren(el('li', 'clients__empty', 'Não foi possível carregar.'));
    list.replaceChildren(...(data.length ? data.map((f) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__eyebrow', MESES(f.mes_ref) + ' · publicado em ' + U.diaAno(f.publicada_em)), el('p', 'row__title', f.titulo), f.texto ? el('p', 'row__text', f.texto) : null, f.veredito ? el('p', 'row__text', 'Veredito: ' + f.veredito) : null),
      el('div', 'row__actions',
        rowBtn('Abrir', () => { $('f-mes').value = f.mes_ref; preenche(f); $('foco-form').scrollIntoView({ block: 'start' }); }),
        rowBtn('Excluir', async () => {
          if (!confirm('Excluir o foco de ' + MESES(f.mes_ref) + '?')) return;
          await sb.from('orientacoes').delete().eq('id', f.id); loadFocos();
        }, true)),
    )) : [el('li', 'clients__empty', 'Nenhum mês publicado ainda.')]));
  };
  // um mês por vez: se o mês escolhido já foi publicado, ele abre para editar (nunca duplica)
  const preenche = (f) => {
    $('f-id').value = f ? f.id : ''; setv('f-titulo', f ? f.titulo : ''); $('f-texto').value = f ? f.texto || '' : '';
    setv('f-veredito', f ? f.veredito : ''); setv('f-nv', f ? f.nota_vendas : ''); setv('f-np', f ? f.nota_pessoas : ''); setv('f-nval', f ? f.nota_valor : '');
    $('f-save').textContent = f ? 'Salvar o mês' : 'Publicar o mês';
    $('foco-form-t').textContent = (f ? 'Editando ' : 'Novo: ') + U.nomeMes(mesSel()) + ' ' + mesSel().slice(0, 4);
    $('f-cancel').hidden = true;
    escolhidas.clear(); desenhaSug(); desenhaPlAcoes();
  };
  const carregaMes = async (mes) => {
    $('f-mes').value = mes;
    const [{ data }, { data: doMes }] = await Promise.all([
      sb.from('orientacoes').select('*').eq('empresa_id', id).eq('mes_ref', mes).order('publicada_em', { ascending: false }).limit(1),
      sb.from('acoes').select('titulo, peso').eq('empresa_id', id).eq('mes_previsto', mes)]);
    previsto = focoPrevisto(doMes || []);
    const f = (data || [])[0] || null;
    preenche(f);
    // mês ainda não publicado: o foco já vem com o previsto pelo plano (o consultor pode trocar pelo veredito)
    if (!f && previsto) { setv('f-titulo', previsto); escolhidas.clear(); desenhaSug(); desenhaPlAcoes(); }
  };
  const resetFoco = async () => {
    // abre no mês que falta planejar: o atual, ou o próximo se o atual já foi publicado
    const { data } = await sb.from('orientacoes').select('mes_ref').eq('empresa_id', id).eq('mes_ref', U.ref()).limit(1);
    await carregaMes((data || []).length ? U.addRef(U.ref(), 1) : U.ref());
  };
  resetFoco();
  $('f-cancel').addEventListener('click', () => { resetFoco(); say($('f-msg'), ''); });
  $('foco-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!$('f-mes').value || !val('f-titulo')) return say($('f-msg'), 'Escolha o mês e o foco.', 'error');
    const mes = $('f-mes').value;
    const row = { empresa_id: id, mes_ref: mes, titulo: val('f-titulo'), texto: val('f-texto'), veredito: val('f-veredito'), nota_vendas: val('f-nv'), nota_pessoas: val('f-np'), nota_valor: val('f-nval') };
    const fid = $('f-id').value;
    $('f-save').disabled = true;
    const r = fid ? await sb.from('orientacoes').update(row).eq('id', fid)
      : await sb.from('orientacoes').insert({ ...row, consultor_id: me.id, publicada_em: new Date().toISOString() });
    if (r.error) { $('f-save').disabled = false; return say($('f-msg'), 'Não foi possível salvar.', 'error'); }
    // as ações marcadas entram no plano do mês, com o que a biblioteca já sabe sobre elas
    const prazos = prazosEscolhidos(mes);
    const novas = [...escolhidas.entries()].map(([t, essencial]) => {
      const x = (window.GangPresets.acoes || []).find((a) => a.texto === t) || {};
      return { ...detalheDe(t), empresa_id: id, titulo: t, mes_previsto: mes, esforco: x.esforco || null, metrica_sucesso: x.metrica || null, porque: x.porque || null, promessa: x.promessa || null,
        peso: essencial ? 'essencial' : 'ajuda', prazo: prazos[t] || null, responsavel: 'cliente', status: 'a_fazer', atualizada_por: me.id, atualizada_em: new Date().toISOString() };
    });
    let extra = '';
    if (novas.length) {
      const ra = await sb.from('acoes').insert(novas);
      extra = ra.error ? ' As ações não entraram: tente de novo em Ações.' : ' ' + novas.length + (novas.length === 1 ? ' ação entrou' : ' ações entraram') + ' em ' + U.nomeMes(mes) + '.';
    }
    $('f-save').disabled = false;
    say($('f-msg'), (fid ? 'Mês salvo.' : 'Publicado: o cliente já vê o foco no Plano e o veredito em Resultados.') + extra, 'ok');
    carregaMes(mes); loadFocos();
    if (typeof loadAcoes === 'function') loadAcoes();
    if (typeof desenhaFechamento === 'function') desenhaFechamento();
  });
  loadFocos();

  // ===== ações =====
  const NIVEL = { negocio: 'Negócio', marca: 'Marca', comunicacao: 'Comunicação' };
  const RESP = { cliente: 'Cliente', ambos: 'Cliente e GANG', gang: 'GANG' };
  const STATUS = { a_fazer: 'A fazer', em_andamento: 'Em andamento', feita: 'Feita' };
  const hojeISO = () => new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD local
  const { data: objetivos } = await sb.from('objetivos').select('id, nivel, titulo').eq('empresa_id', id).order('ordem');
  const carregaSituacoes = async () => {
    const { data } = await sb.from('situacoes').select('id, texto').eq('empresa_id', id).order('ordem');
    $('x-sit').replaceChildren(el('option', { value: '' }, (data || []).length ? '—' : 'Cadastre as situações de compra na aba Estratégia'),
      ...(data || []).map((x) => el('option', { value: x.id }, x.texto)));
  };
  await carregaSituacoes();
  const { data: causas } = await sb.from('causas').select('id, texto').eq('empresa_id', id).order('ordem');
  $('x-causa').replaceChildren(el('option', { value: '' }, (causas || []).length ? '—' : 'Cadastre as causas no Diagnóstico'), ...(causas || []).map((c) => el('option', { value: c.id }, c.texto)));
  $('x-obj').replaceChildren(el('option', { value: '' }, (objetivos || []).length ? '—' : 'Cadastre na aba Estratégia (fase 4)'),
    ...(objetivos || []).map((o) => el('option', { value: o.id }, NIVEL[o.nivel] + ': ' + U.cap(o.titulo))));

  // escolher uma ação pronta preenche o resto do formulário; o consultor muda o que quiser antes de salvar
  const ultimoDia = (ref) => { const [y, m] = ref.split('-').map(Number); return ref + '-' + String(new Date(y, m, 0).getDate()).padStart(2, '0'); };
  let prazoAuto = false;
  function preencherPelaAcao(it) {
    const t = it.texto || '';
    const mod = Object.values(P.modelos || {}).flatMap((m) => m.acoes).find((x) => x[4] === t); // a mesma ação nos modelos de plano traz o peso
    const esforco = it.esforco || (mod && mod[3]) || '';
    const porque = it.porque || (mod && mod[5]) || '';
    const metrica = it.metrica || (mod && mod[6]) || '';
    const promessa = it.promessa || (mod && mod[2]) || U.promessaDe({ titulo: t, porque, metrica_sucesso: metrica });
    const peso = it.peso || (mod && mod[1]) || 'ajuda';
    const n = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const com = /proposta|vend|comercial|orcamento|reuniao|negocia|preco|pacote/.test(n) ? 'Vendas'
      : /brinde|presente|influenciad|cada rede|grupo de clientes/.test(n) ? 'Marketing'
      : /ligar|atendimento|entrega|base de clientes|responder|avalia|cliente oculto|contato novo/.test(n) ? 'Atendimento'
        : /site|anuncio|campanha|conteudo|redes|video|pesquisa|identidade|texto|peca|material|evento|feira|fachada|vitrine/.test(n) ? 'Marketing' : '';
    const obj = (objetivos || []).find((o) => o.nivel === (esforco === 'marca' ? 'marca' : 'negocio')) || (objetivos || [])[0];
    const preenchidos = [];
    const poe = (fid, v, how) => { if (v == null || v === '') return; how ? how(v) : ($(fid).value = v); preenchidos.push(fid); };
    poe('x-esforco', esforco); poe('x-metrica', metrica, (v) => U.comboSet('x-metrica', v)); poe('x-porque', porque);
    poe('x-promessa', promessa); poe('x-peso', peso); poe('x-com', com, (v) => setv('x-com', v));
    if (obj) poe('x-obj', obj.id);
    if (!$('x-prazo').value || prazoAuto) { poe('x-prazo', ultimoDia($('x-mes').value || U.ref())); prazoAuto = true; }
    preenchidos.forEach((fid) => { const box = $(fid).closest('.combo') || $(fid); box.classList.remove('auto-fill'); void box.offsetWidth; box.classList.add('auto-fill'); });
    say($('x-msg'), 'Preenchemos os outros campos a partir da ação. Mude o que quiser antes de salvar.', 'ok');
  }

  let acoes = [];
  const form = $('acao-form');
  // ação nova: só o campo da ação fica liberado; o resto libera quando a ação é escolhida (pronta ou escrita em "Outro…")
  const dicaTrava = el('p', { class: 'trava-dica', id: 'x-trava', role: 'status' }, 'Escolha a ação para liberar os outros campos.');
  $('x-titulo').closest('div:not(.combo)').append(dicaTrava);
  const livres = (n) => n.closest('.combo') === $('x-titulo').closest('.combo') || n.type === 'hidden' || n.id === 'x-cancel';
  const trava = (on) => {
    form.querySelectorAll('input, select, textarea, button').forEach((n) => { if (!livres(n)) n.disabled = on; });
    form.classList.toggle('is-travado', on); dicaTrava.hidden = !on;
  };
  const confereTrava = () => { if (!$('x-id').value) trava(!U.comboValue('x-titulo')); };
  $('x-titulo').addEventListener('change', confereTrava);
  $('x-titulo-outro').addEventListener('input', confereTrava);

  const abreForm = (a, sug) => {
    form.hidden = false; $('open-acao').setAttribute('aria-expanded', 'true');
    $('x-id').value = a ? a.id : ''; $('x-sug').value = sug ? sug.id : '';
    $('acao-form-t').textContent = a ? 'Editar ação' : (sug ? 'Nova ação a partir da sugestão' : 'Nova ação');
    setv('x-titulo', a ? a.titulo : (sug ? sug.texto.slice(0, 200) : ''));
    $('x-mes').value = a ? a.mes_previsto : U.ref();
    setv('x-metrica', a && a.metrica_sucesso ? U.cap(a.metrica_sucesso) : '');
    $('x-obj').value = a && a.objetivo_id ? a.objetivo_id : ''; $('x-causa').value = a && a.causa_id ? a.causa_id : '';
    $('x-resp').value = a ? a.responsavel : 'cliente'; setv('x-com', a ? a.responsavel_nome : '');
    $('x-prazo').value = a ? a.prazo || '' : ''; $('x-status').value = a ? a.status : 'a_fazer'; prazoAuto = false;
    carregaSituacoes().then(() => { $('x-sit').value = a && a.situacao_id ? a.situacao_id : ''; });
    $('x-peso').value = a ? a.peso || 'ajuda' : 'ajuda'; $('x-promessa').value = a ? a.promessa || '' : ''; $('x-porque').value = a ? a.porque || '' : ''; $('x-obs').value = a ? a.observacao || '' : '';
    $('x-esforco').value = a ? a.esforco || '' : ''; $('x-resultado').value = a ? a.resultado || '' : ''; $('x-aprendizado').value = a ? a.aprendizado || '' : '';
    say($('x-msg'), '');
    trava(!a && !U.comboValue('x-titulo')); // editar ou partir de uma sugestão: já vem liberado
    mostraResultado();
    form.scrollIntoView({ block: 'start', behavior: 'smooth' }); $('x-titulo').focus({ preventScroll: true });
  };
  // "Funcionou?" e "O que aprendemos" só fazem sentido depois que a ação foi feita
  const mostraResultado = () => { form.querySelectorAll('.so-feita').forEach((d) => { d.hidden = $('x-status').value !== 'feita'; }); };
  $('x-status').addEventListener('change', mostraResultado);
  $('x-prazo').addEventListener('input', () => { prazoAuto = false; });
  $('x-mes').addEventListener('change', () => { if (prazoAuto && $('x-mes').value) $('x-prazo').value = ultimoDia($('x-mes').value); });
  const fechaForm = () => { form.hidden = true; $('open-acao').setAttribute('aria-expanded', 'false'); };
  $('open-acao').addEventListener('click', () => (form.hidden ? abreForm(null) : fechaForm()));
  $('x-cancel').addEventListener('click', fechaForm);

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!val('x-titulo') || !$('x-mes').value) return say($('x-msg'), 'Escolha a ação e o mês.', 'error');
    const status = $('x-status').value;
    const aid = $('x-id').value;
    const antiga = aid && acoes.find((a) => a.id === aid);
    const row = {
      empresa_id: id, titulo: val('x-titulo'), mes_previsto: $('x-mes').value, serve_para: antiga ? antiga.serve_para : null, metrica_sucesso: val('x-metrica') ? U.cap(val('x-metrica')) : null,
      objetivo_id: val('x-obj'), causa_id: val('x-causa'), responsavel: $('x-resp').value, responsavel_nome: val('x-com'), prazo: val('x-prazo'), status,
      concluida_em: status === 'feita' ? ((antiga && antiga.concluida_em) || hojeISO()) : null,
      esforco: val('x-esforco'), resultado: status === 'feita' ? val('x-resultado') : null, aprendizado: status === 'feita' ? val('x-aprendizado') : null, situacao_id: val('x-sit'), peso: $('x-peso').value, porque: val('x-porque'), observacao: val('x-obs'), promessa: $('x-promessa').value || null,
      atualizada_por: me.id, atualizada_em: new Date().toISOString(),
    };
    const r = aid ? await sb.from('acoes').update(row).eq('id', aid) : await sb.from('acoes').insert({ ...detalheDe(row.titulo), ...row });
    if (r.error) return say($('x-msg'), 'Não foi possível salvar.', 'error');
    if ($('x-sug').value) await sb.from('sugestoes').update({ status: 'aceita' }).eq('id', $('x-sug').value);
    fechaForm(); say($('acoes-msg'), aid ? 'Ação atualizada.' : 'Ação criada. O cliente já vê em Ações.', 'ok');
    loadAcoes(); loadSugs();
  });

  const desenhaEquilibrio = async () => {
    const B = window.GangSaude && await window.GangSaude.carregar(sb, id);
    const box = $('equil'); if (!B || !B.acoes.length) { box.hidden = true; return; }
    const E = window.GangSaude.equilibrio(B); const PR = window.GangSaude.PROM;
    const avisos = [];
    if (E.marcaPct != null && Math.abs(E.marcaPct - E.planejado) >= 15) avisos.push(E.marcaPct < E.planejado ? 'Marca está com ' + E.marcaPct + '% das ações, abaixo dos ' + E.planejado + '% planejados. O efeito de marca demora, mas é o que sustenta o crescimento.' : 'Venda está com ' + (100 - E.marcaPct) + '% das ações, abaixo dos ' + (100 - E.planejado) + '% planejados. Falta converter quem já quer comprar.');
    Object.entries(E.porPromessa).forEach(([k, n]) => { if (!n) avisos.push('Nenhuma ação move "' + PR[k] + '". O plano não cumpre essa parte da promessa.'); });
    if (E.semMarcaTotal) avisos.push(E.semMarcaTotal + (E.semMarcaTotal === 1 ? ' mês' : ' meses') + ' pela frente sem ação de marca: ' + E.semMarca.map((r) => U.nomeMes(r)).join(', ') + (E.semMarcaTotal > E.semMarca.length ? '…' : '') + '.');
    E.causasSemAcao.forEach((c) => avisos.push('Causa do diagnóstico sem ação: "' + c.texto + '".'));
    E.objetivosSemAcao.forEach((o) => avisos.push('Objetivo sem ação ligada: "' + o.titulo + '".'));
    const tot = E.porPromessa.vendas + E.porPromessa.pessoas + E.porPromessa.valor;
    box.hidden = false;
    box.replaceChildren(
      el('div', 'equil__head', el('h2', { class: 'title-sm', id: 'equil-t' }, 'Equilíbrio do plano'), el('p', 'small', avisos.length ? avisos.length + (avisos.length === 1 ? ' ponto de atenção' : ' pontos de atenção') : 'Plano equilibrado')),
      el('div', 'equil__barras',
        E.marcaPct != null ? el('div', 'equil__barra', el('p', 'equil__lbl', 'Marca e ativação, pelo tamanho das ações'), el('div', 'equil__track', el('span', { class: 'is-marca', style: 'width:' + E.marcaPct + '%' }), el('span', { class: 'is-alvo', style: 'left:' + E.planejado + '%' })), el('p', 'equil__num', E.marcaPct + '% marca · ' + (100 - E.marcaPct) + '% ativação · planejado ' + E.planejado + '%' + (E.nBase ? ' · ' + E.nBase + (E.nBase === 1 ? ' ação de base fora da conta' : ' ações de base fora da conta') : ''))) : null,
        el('div', 'equil__barra', el('p', 'equil__lbl', 'Ações por parte da promessa'), el('div', 'equil__track equil__track--3', Object.keys(PR).map((k) => el('span', { class: 'is-' + k, style: 'width:' + (tot ? Math.round(E.porPromessa[k] / tot * 100) : 0) + '%' }))),
          el('p', 'equil__num', Object.entries(PR).map(([k, t]) => t + ' ' + E.porPromessa[k]).join(' · ')))),
      avisos.length ? el('ul', 'equil__avisos', avisos.map((t) => el('li', null, t))) : '');
  };

  // filtro das ações por andamento (menu com caixas de seleção e contadores)
  const filtroSt = new Set();
  const desenhaFiltro = () => {
    const box = $('acoes-filtro'); if (!box) return;
    const cont = (k) => (acoes || []).filter((a) => a.status === k).length;
    const btn = el('button', { class: 'btn btn--ghost btn--sm filtro__btn' + (filtroSt.size ? ' is-on' : ''), type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
      'Filtrar', filtroSt.size ? el('span', 'filtro__n', String(filtroSt.size)) : null);
    const pop = el('div', { class: 'filtro__pop', hidden: true },
      el('p', 'filtro__lbl', 'Andamento'),
      Object.entries(STATUS).map(([k, t]) => {
        const cb = el('input', { type: 'checkbox', checked: filtroSt.has(k) });
        cb.addEventListener('change', () => { if (cb.checked) filtroSt.add(k); else filtroSt.delete(k); loadAcoes(); });
        return el('label', 'filtro__opt st--' + { a_fazer: 'todo', em_andamento: 'doing', feita: 'done' }[k], el('span', 'filtro__ico'), el('span', null, t), el('span', 'filtro__count', String(cont(k))), cb);
      }),
      el('div', 'filtro__foot', el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => { filtroSt.clear(); loadAcoes(); } }, 'Limpar'),
        el('button', { class: 'btn btn--light btn--sm', type: 'button', onclick: () => { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); } }, 'Aplicar')));
    btn.addEventListener('click', (e) => { e.stopPropagation(); pop.hidden = !pop.hidden; btn.setAttribute('aria-expanded', String(!pop.hidden)); });
    pop.addEventListener('click', (e) => e.stopPropagation());
    const aberto = box.querySelector('.filtro__pop') && !box.querySelector('.filtro__pop').hidden;
    box.replaceChildren(btn, pop); if (aberto) { pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  };
  document.addEventListener('click', () => { const pp = document.querySelector('#acoes-filtro .filtro__pop'); if (pp && !pp.hidden) { pp.hidden = true; } });
  const mesesAbertos = new Set(); const mesesFechados = new Set();
  // a busca do menu encontra ações do plano, ações da biblioteca e os outros clientes
  const vaiParaAcao = async (a) => {
    mesesAbertos.add(a.mes_previsto); mesesFechados.delete(a.mes_previsto);
    if (location.hash !== '#acoes') location.hash = '#acoes';
    await loadAcoes();
    setTimeout(() => { const r = document.querySelector('#acoes-list .row[data-id="' + a.id + '"]'); if (r) { r.scrollIntoView({ block: 'center', behavior: 'smooth' }); r.classList.add('is-destaque'); setTimeout(() => r.classList.remove('is-destaque'), 2200); } }, 250);
  };
  let outrosClientes = [];
  sb.from('empresas').select('id, nome').order('nome').then(({ data }) => { outrosClientes = (data || []).filter((e) => e.id !== id); });
  U.buscaFonte(() => [
    ...(acoes || []).map((a) => ({ grupo: 'Plano de ações', titulo: a.titulo, sub: MESES(a.mes_previsto) + ' · ' + (STATUS[a.status] || ''), onclick: () => vaiParaAcao(a), extra: a.porque || '' })),
    ...((P.acoes || []).map((x) => ({ grupo: 'Biblioteca', titulo: x.texto, sub: [x.tam ? 'tamanho ' + x.tam : null, x.esforco === 'marca' ? 'marca' : 'venda'].filter(Boolean).join(' · '), extra: x.porque || '',
      onclick: () => { location.hash = '#acoes'; setTimeout(() => { $('acoes-lib').open = true; $('lib-filtro').value = ''; $('lib-tema').value = ''; desenhaLib();
        const it = [...document.querySelectorAll('#lib-list .lib__item')].find((n) => n.textContent.includes(x.texto)); if (it) { it.scrollIntoView({ block: 'center', behavior: 'smooth' }); it.classList.add('is-destaque'); setTimeout(() => it.classList.remove('is-destaque'), 2200); } }, 300); } }))),
    ...outrosClientes.map((e) => ({ grupo: 'Clientes', titulo: e.nome, href: 'admin-cliente.html?id=' + e.id })),
  ]);
  // ===== Limpar o plano: um mês ou o plano inteiro (as concluídas ficam, como histórico, a menos que o consultor escolha apagar) =====
  $('limpar-plano').addEventListener('click', async () => {
    const { data: todas } = await sb.from('acoes').select('id, mes_previsto, status').eq('empresa_id', id);
    const lista = todas || [];
    if (!lista.length) return say($('acoes-msg'), 'O plano já está vazio.', 'ok');
    const porMes = {}; lista.forEach((a) => { (porMes[a.mes_previsto] = porMes[a.mes_previsto] || []).push(a); });
    const meses = Object.keys(porMes).sort();
    const nomeM = (m) => U.cap(U.nomeMes(m)) + ' ' + m.slice(0, 4);
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const opMes = el('input', { type: 'radio', name: 'lp-alc', value: 'mes', checked: true });
    const opTudo = el('input', { type: 'radio', name: 'lp-alc', value: 'tudo' });
    const selMes = el('select', { class: 'field', id: 'lp-mes', 'aria-label': 'Mês' }, meses.map((m) => el('option', { value: m }, nomeM(m) + ' (' + porMes[m].length + ')')));
    const ref = U.ref(); const prox = meses.find((m) => m >= ref); if (prox) selMes.value = prox;
    const manter = el('input', { type: 'checkbox', id: 'lp-manter', checked: true });
    const btn = el('button', { class: 'btn btn--danger btn--sm', type: 'button' });
    const alvo = () => {
      const base = opTudo.checked ? lista : (porMes[selMes.value] || []);
      return manter.checked ? base.filter((a) => a.status !== 'feita') : base;
    };
    const atualiza = () => {
      const n = alvo().length; selMes.disabled = opTudo.checked;
      btn.textContent = n ? 'Apagar ' + n + (n === 1 ? ' ação' : ' ações') : 'Nada para apagar';
      btn.disabled = !n;
    };
    [opMes, opTudo, selMes, manter].forEach((x) => x.addEventListener('change', atualiza));
    btn.addEventListener('click', async () => {
      const ids = alvo().map((a) => a.id); if (!ids.length) return;
      if (!btn.dataset.certeza) { btn.dataset.certeza = '1'; btn.textContent = 'Confirmar: apagar ' + ids.length + (ids.length === 1 ? ' ação' : ' ações'); say(msg, 'Não dá para desfazer. Clique de novo para confirmar.', 'error'); return; }
      btn.disabled = true; say(msg, 'Apagando…');
      let erro = null;
      for (let i = 0; i < ids.length; i += 100) { const r = await sb.from('acoes').delete().in('id', ids.slice(i, i + 100)); if (r.error) { erro = r.error; break; } }
      if (erro) { say(msg, 'Não foi possível apagar.', 'error'); btn.disabled = false; return; }
      dlg.close();
      say($('acoes-msg'), ids.length + (ids.length === 1 ? ' ação apagada' : ' ações apagadas') + (opTudo.checked ? ' do plano.' : ' de ' + nomeM(selMes.value) + '.'), 'ok');
      loadAcoes();
    });
    const dlg = el('dialog', { class: 'dialog limpar', 'aria-labelledby': 'lp-t' },
      el('div', 'limpar__f',
        el('h2', { class: 'title-sm', id: 'lp-t' }, 'Limpar plano'),
        el('p', 'small', 'Apaga as ações do cliente para montar de novo. Não dá para desfazer.'),
        el('div', 'limpar__ops',
          el('label', 'limpar__op', opMes, el('div', null, el('p', 'limpar__t', 'Um mês'), el('p', 'limpar__d', 'Só as ações do mês escolhido.')), selMes),
          el('label', 'limpar__op', opTudo, el('div', null, el('p', 'limpar__t', 'O plano inteiro'), el('p', 'limpar__d', meses.length + ' meses · ' + lista.length + ' ações no total.')))),
        el('label', 'copia__op', manter, el('span', null, 'Manter as ações já concluídas (histórico e resultados do cliente)')),
        el('div', 'new-client__foot', btn, el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => dlg.close() }, 'Cancelar'), msg)));
    dlg.addEventListener('close', () => dlg.remove());
    document.body.append(dlg); atualiza(); dlg.showModal();
  });

  const loadAcoes = async () => {
    desenhaEquilibrio();
    let { data, error } = await sb.from('acoes').select('*').eq('empresa_id', id).order('mes_previsto').order('prazo', { nullsFirst: false }).order('ordem');
    if (error) return say($('acoes-msg'), 'Não foi possível carregar as ações.', 'error');
    // o cliente adiantou ações: repõe outras nos meses de onde saíram, antes de mostrar
    if (window.GangSaude && window.GangSaude.repor && data.some((a) => a.adiantada_de && !a.reposta)) {
      const n = await window.GangSaude.repor(sb, id, data, emp.setor);
      if (n) { say($('acoes-msg'), 'O cliente adiantou ' + (n === 1 ? '1 ação' : n + ' ações') + '. ' + (n === 1 ? 'Outra entrou' : 'Outras entraram') + ' no lugar, para o plano seguir completo até o fim.', 'ok'); return loadAcoes(); }
    }
    acoes = data; desenhaFiltro();
    const box = $('acoes-list');
    if (!data.length) return box.replaceChildren(el('p', 'clients__empty', 'Nenhuma ação ainda. Crie a primeira em “Nova ação”.'));
    const todas = data; data = filtroSt.size ? todas.filter((a) => filtroSt.has(a.status)) : todas;
    if (!data.length) return box.replaceChildren(el('div', 'vazio', el('span', 'vazio__ico'), el('p', 'vazio__t', 'Nada encontrado'), el('p', 'vazio__d', 'Nenhuma ação com esse andamento.'), el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => { filtroSt.clear(); loadAcoes(); } }, 'Limpar filtro')));
    const meses = [...new Set(data.map((a) => a.mes_previsto))];
    box.replaceChildren(...meses.map((m) => el('details', { class: 'month', open: mesesAbertos.has(m) || (m === U.ref() && !mesesFechados.has(m)), ontoggle: (ev) => { if (ev.currentTarget.open) { mesesAbertos.add(m); mesesFechados.delete(m); } else { mesesAbertos.delete(m); mesesFechados.add(m); } } },
      el('summary', 'month__title' + (m === U.ref() ? ' is-mes-atual' : ''), el('span', null, MESES(m) + (m === U.ref() ? ' · este mês' : '')),
        (() => { const dm = data.filter((a) => a.mes_previsto === m); const f = dm.filter((a) => a.status === 'feita').length;
          return el('span', 'month__n', dm.length + (dm.length === 1 ? ' ação' : ' ações') + (f ? ' · ' + f + (f === 1 ? ' feita' : ' feitas') : '')); })(),
        (() => { const c = cargaDe(todas.filter((a) => a.mes_previsto === m)); return pesado(c) ? el('span', 'aviso-chip', 'Mês pesado: ' + c.n + ' ações, ' + c.pts + ' pontos') : null; })()),
      el('ul', 'rows', data.filter((a) => a.mes_previsto === m).map((a) => {
        const sel = el('select', { class: 'field field--sm', 'aria-label': 'Andamento de ' + a.titulo },
          Object.entries(STATUS).map(([k, t]) => el('option', { value: k, selected: a.status === k }, t)));
        sel.addEventListener('change', async () => {
          const r = await sb.from('acoes').update({
            status: sel.value, concluida_em: sel.value === 'feita' ? (a.concluida_em || hojeISO()) : null,
            atualizada_por: me.id, atualizada_em: new Date().toISOString(),
          }).eq('id', a.id);
          say($('acoes-msg'), r.error ? 'Não foi possível salvar.' : '“' + a.titulo + '”: ' + STATUS[sel.value] + '.', r.error ? 'error' : 'ok');
          loadAcoes();

        });
        const quem = ({ essencial: 'Essencial', ajuda: 'Ajuda', reforco: 'Reforço' }[a.peso] || 'Ajuda') + (a.responsavel && a.responsavel !== 'cliente' ? ' · ' + RESP[a.responsavel] : '') + (a.responsavel_nome ? ' · com ' + a.responsavel_nome : '') + (a.executa ? ' · executa a estratégia' : ''); // "Cliente" é o padrão: só aparece quem foge dele
        const prazo = a.status === 'feita' ? (a.concluida_em ? 'Concluída em ' + U.dia(a.concluida_em) : 'Concluída') : (a.prazo ? 'Prazo ' + U.dia(a.prazo) : 'Sem prazo');
        const mudou = a.atualizada_por && a.atualizada_por !== me.id && a.atualizada_em ? ' · cliente atualizou em ' + U.dia(a.atualizada_em) : '';
        const ps = Array.isArray(a.passos) ? a.passos : [];
        const ler = a.status === 'feita' && a.concluida_em && !a.resultado ? U.addDias(a.concluida_em, a.esforco === 'marca' ? 7 : a.ler_em_dias || 30) : null;
        const MOT = { tempo: 'sem tempo', verba: 'sem verba', duvida: 'com dúvida', outro: 'outro motivo' };
        const tags = el('div', 'plan__ac-tags',
          a.travada ? el('span', 'chip chip--warn', 'Travada: ' + MOT[a.travada] + (a.travada_nota ? ' · “' + a.travada_nota + '”' : '')) : null,
          ps.length ? el('span', 'mtag', ps.filter((x) => x.ok).length + ' de ' + ps.length + ' passos') : null,
          a.tamanho ? el('span', 'mtag', 'Tamanho ' + a.tamanho) : null,
          ler ? el('span', 'mtag' + (ler <= hojeISO() ? ' is-hot' : ''), a.esforco === 'marca' ? (ler <= hojeISO() ? 'Confirmar se foi feita' : 'Confirmar em ' + U.dia(ler)) : (ler <= hojeISO() ? 'Medir agora' : 'Medir em ' + U.dia(ler))) : null);
        return el('li', { class: 'row', 'data-id': a.id },
          el('div', 'row__main', el('p', 'row__title', a.titulo), el('p', 'row__text', quem + ' · ' + prazo + mudou
            + (a.esforco ? ' · ' + (a.esforco === 'marca' ? 'marca' : 'venda') : ' · sem tipo de esforço')
            + (a.resultado ? ' · ' + (a.esforco === 'marca' ? { sim: 'feita como planejado', parcial: 'feita em parte', nao: 'não saiu como planejado' } : { sim: 'funcionou', parcial: 'funcionou em parte', nao: 'não funcionou' })[a.resultado] : '')),
            a.aprendizado ? el('p', 'row__text', '“' + a.aprendizado + '”') : null, tags.children.length ? tags : null),
          el('div', 'row__actions', a.status === 'feita' ? null : (() => {
            const d = el('input', { class: 'field field--sm field--data', type: 'date', value: a.prazo || '', 'aria-label': 'Prazo de ' + a.titulo, title: 'Prazo (dia)' });
            d.addEventListener('change', async () => {
              const v = d.value; if (!v || v === a.prazo) return;
              const r = await sb.from('acoes').update({ prazo: v, mes_previsto: v.slice(0, 7), atualizada_por: me.id, atualizada_em: new Date().toISOString() }).eq('id', a.id);
              say($('acoes-msg'), r.error ? 'Não foi possível mudar o prazo.' : '“' + a.titulo + '”: prazo ' + U.dia(v) + '.', r.error ? 'error' : 'ok');
              if (!r.error) loadAcoes();
            });
            return d;
          })(), sel,
            rowBtn('Editar', () => abreForm(a)),
            rowBtn('Excluir', async () => {
              if (!confirm('Excluir a ação “' + a.titulo + '”?')) return;
              await sb.from('acoes').delete().eq('id', a.id); loadAcoes();
            }, true)));
      })))));
  };
  loadAcoes();

  // modelo de plano por setor: o esqueleto de 18 meses, ajustado à duração e ao início do plano
  const MOD = P.modelos || {};
  $('mod-setor').replaceChildren(...Object.entries(MOD).map(([k, m]) => el('option', { value: k }, m.nome)));
  // o modelo vem do setor do cadastro (Novo cliente / Contrato): o consultor não escolhe de novo aqui
  const modeloDoSetor = () => {
    const k = MOD[emp.setor] ? emp.setor : MOD[U.setorBase(emp.setor)] ? U.setorBase(emp.setor) : '';
    $('mod-setor').value = k;
    $('mod-setor-txt').replaceChildren(...(k ? [U.setorNome(emp.setor), el('a', { class: 'link mod__setor-mudar', href: '#plano' }, 'Mudar em Contrato')]
      : [el('span', 'is-falta', 'Setor não definido. '), el('a', { class: 'link', href: '#plano' }, 'Definir em Contrato')]));
    $('mod-go').disabled = !k;
    return k;
  };
  modeloDoSetor();
  document.addEventListener('gang:setor', () => { modeloDoSetor(); if ($('acoes-modelo').open) desenhaModelo(); });
  // ===== o modelo cobre o prazo inteiro do cliente =====
  // 1. os marcos do modelo (pensado em 18 meses) caem no mês proporcional do plano: revisão semestral, anual, chegada;
  // 2. o que cairia no passado vai para o mês atual e o seguinte (nada nasce atrasado);
  // 3. todo mês que sobrar recebe ações de continuidade da biblioteca: pelo menos 2 por mês, 1 de marca (presença contínua) e 1 essencial.
  const nRef = (r) => +r.slice(0, 4) * 12 + +r.slice(5, 7);
  // a abordagem escolhida em Estratégia (só as da biblioteca têm ações ligadas; texto próprio do consultor = só o setor)
  const abordagemAtual = async () => {
    const { data } = await sb.from('planos').select('como_vencer').eq('empresa_id', id).maybeSingle();
    const t = data && data.como_vencer;
    return { texto: t || null, ab: t ? (P.abordagens || []).find((a) => a.texto === t && a.acoes) || null : null };
  };
  // a fase de cada ação, como numa consultoria: 1) a base (posicionamento, proposta, preço, venda, padrão de atendimento,
  // identidade aplicada) vem primeiro, porque todo o resto depende dela; 2) presença e prova; 3) otimização e auditoria, depois de ter o que medir
  const RECORRENTE = /(por semana|toda semana|todo mês|a cada|uma vez por ano|por ano com|Medir|Avisar o aumento|ativação com prazo|pouco movimento|lista de espera|Ouvir uma conversa|Registrar o motivo)/i;
  const BASE = /^(Lançar a pesquisa de partida|Escrever|Reescrever o modelo|Reescrever o site|Reescrever os textos|Definir|Escolher a especialidade|Escolher a palavra|Combinar|Listar as|Refazer a tabela|Revisar o caminho|Montar a proposta|Montar e ensaiar|Trocar propostas|Cobrar|Padronizar|Treinar a equipe na|Aplicar a identidade|Trocar a fachada|Atualizar redes|Fazer uma oficina|Dar um nome|Dar nome|Completar a proposta|Criar uma garantia|Criar uma versão premium|Organizar os serviços|Cortar um item|Calcular com o cliente|Explicar o tratamento|Deixar o preço|Publicar o método|Mandar o guia de tom|Responder todas as avaliações)/;
  const PROVA = /(estudo de caso|caso curto|depoimentos|avaliação)/i; // prova vem depois da base, mesmo quando começa por "Escrever"
  const OTIMIZA = /(auditoria|clube de clientes|conselho com|grupo de clientes|marcos da relação|data própria|programa próprio|uma vez por ano)/i;
  const faseDe = (t) => {
    const x = (P.acoes || []).find((a) => a.texto === t) || {};
    if (OTIMIZA.test(t) || (x.tema === 'medicao' && /^(Testar|Comparar|Revisar a cada|Acompanhar)/.test(t))) return 3;
    if (PROVA.test(t)) return 2;
    if (BASE.test(t) || (x.tema === 'posicionamento' && !RECORRENTE.test(t))) return 1;
    return 2;
  };
  const montaModelo = (m, ab) => {
    // o setor é o do modelo escolhido (não o do cadastro): cada setor tem o seu plano, inclusive nas ações que executam a estratégia.
    // Os modelos mais específicos usam também as ações do setor-base (saúde, beleza e educação = serviços; alimentação e loja online = varejo)
    const chaveM = Object.keys(MOD).find((k) => MOD[k] === m);
    const BASE_M = { saude: 'servicos', educacao: 'servicos', beleza: 'servicos', alimentacao: 'varejo', loja_online: 'varejo', tecnologia: 'b2b' };
    const doSetor = (x) => !x.setores || x.setores.includes(chaveM) || x.setores.includes(BASE_M[chaveM] || chaveM);
    const foraDaEstrategia = new Set(ab ? ab.fora || [] : []);
    const dur = p.duracao_meses || 18; const ini = U.ref(p.inicio); const fim = U.addRef(ini, dur - 1);
    const de = ini > U.ref() ? ini : U.ref();
    const meses = []; for (let r = de; nRef(r) <= nRef(fim); r = U.addRef(r, 1)) meses.push(r);
    if (!meses.length) return [];
    const doModelo = m.acoes.map(([mes, peso, promessa, esforco, titulo, porque, metrica]) => ({ mes: U.addRef(ini, Math.round((mes - 1) * (dur - 1) / 17)), peso, promessa, esforco, titulo, porque, metrica }))
      .filter((x) => doSetor((P.acoes || []).find((y) => y.texto === x.titulo) || {})); // o esqueleto também respeita o setor do modelo
    const ja = (t) => foraDaEstrategia.has(t) || acoes.some((a) => a.titulo === t) || novas.some((x) => x.titulo === t);
    const novas = [];
    // carga do mês em pontos (P=1, M=2, G=4): 7 pontos ou 5 ações. Um mês de ações rápidas recebe mais; um mês com uma ação grande, menos
    const LIM = 7; const LIM_N = 5;
    const ptsT = (t) => (TAM[(libDe(t) || {}).tam] || [, , 2])[2];
    const carga = (mm) => acoes.filter((a) => a.mes_previsto === mm).reduce((t, a) => t + (TAM[a.tamanho] || [, , 2])[2], 0) + novas.filter((x) => x.mes === mm).reduce((t, x) => t + ptsT(x.titulo), 0);
    const nMes = (mm) => acoes.filter((a) => a.mes_previsto === mm).length + novas.filter((x) => x.mes === mm).length;
    const idx = (mm) => Math.max(0, meses.indexOf(mm));
    // o primeiro mês com espaço a partir de "desde" (se nenhum tiver, o mais leve)
    // uma vaga de cada mês fica reservada para a ação de marca, até o mês ter uma: a marca não pode sumir por falta de espaço
    const temMarca = (mm) => acoes.some((a) => a.mes_previsto === mm && U.tipoEsforco(a) === 'marca') || novas.some((x) => x.mes === mm && U.tipoEsforco({ titulo: x.titulo, esforco: x.esforco }) === 'marca');
    const cabeN = (mm, t) => nMes(mm) < LIM_N - (temMarca(mm) || (t && U.tipoEsforco({ titulo: t }) === 'marca') ? 0 : 1);
    // marca nova não tem passado: ação que revisa peças, compara períodos ou ouve clientes antigos só entra quando esse passado existe
    const nova = p.esforco_marca_pct === 35 || !!(ab && ab.lancamento);
    const desdeHist = (t) => {
      if (!nova || !t) return 0;
      const k = U.mesesDeHistorico(t); if (!k) return 0;
      const i = meses.findIndex((mm) => nRef(mm) >= nRef(ini) + k);
      return i < 0 ? meses.length : i;
    };
    const vagaLivre = (desde, t) => meses.slice(Math.max(desde, desdeHist(t))).find((mm) => carga(mm) + (t ? ptsT(t) : 2) <= LIM && cabeN(mm, t)) || null;
    let semEspaco = 0; // ações que ficaram de fora porque o plano não tem espaço (plano curto ou refeito no fim)
    const vaga = (desde0, t) => { const desde = Math.min(Math.max(desde0, desdeHist(t)), meses.length - 1); return vagaDe(desde, t); };
    const vagaDe = (desde, t) => meses.slice(desde).find((mm) => carga(mm) + (t ? ptsT(t) : 2) <= LIM && cabeN(mm, t)) || meses.slice(desde).reduce((a, b) => (carga(b) < carga(a) ? b : a), meses[Math.min(desde, meses.length - 1)]);
    const libDe = (t) => (P.acoes || []).find((a) => a.texto === t) || { texto: t };
    const daLib = (t, peso) => { const x = libDe(t); return { peso, promessa: x.promessa || null, esforco: x.esforco || null, titulo: t, porque: x.porque || null, metrica: x.metrica || null }; };
    const marco = (t) => /^(Revisão|Chegada|Lançar a pesquisa de partida|Segunda rodada da pesquisa|Pesquisa de marca de)/.test(t);
    // janelas das fases nos meses que faltam: a base nos primeiros ~20%, presença e prova a partir de ~15%, otimização da metade em diante
    const nM = meses.length; const f2 = Math.max(1, Math.round(nM * 0.15)); const f3 = Math.round(nM * 0.5);
    const desdeFase = (t, prop) => { const f = faseDe(t); return Math.min(nM - 1, f === 1 ? 0 : f === 3 ? Math.max(prop, f3) : Math.max(prop, f2)); };
    // 0. a pesquisa de partida é a linha de base: se ainda não foi feita e o mês dela passou, entra já no primeiro mês
    doModelo.filter((x) => /^Lançar a pesquisa de partida/.test(x.titulo) && nRef(x.mes) < nRef(de) && !ja(x.titulo)).forEach((x) => novas.push({ ...x, peso: 'essencial', mes: meses[0] }));
    // 1. marcos no mês certo do plano
    doModelo.filter((x) => marco(x.titulo) && nRef(x.mes) >= nRef(de) && !ja(x.titulo)).forEach((x) => novas.push(x));
    // antes de encher os meses: a pesquisa de partida é a linha de base, e as rodadas seguintes vêm pelo menos 5 e 11 meses depois dela
    const partida = novas.find((x) => /^Lançar a pesquisa de partida/.test(x.titulo)) || acoes.find((a) => /^Lançar a pesquisa de partida/.test(a.titulo));
    if (partida) {
      const mP = partida.mes || partida.mes_previsto;
      [[/^Segunda rodada da pesquisa/, 5], [/^Pesquisa de marca de 12/, 11]].forEach(([re, dist]) => {
        const r = novas.find((x) => re.test(x.titulo));
        if (r && nRef(r.mes) < nRef(mP) + dist) { const alvo = U.addRef(mP, dist); r.mes = nRef(alvo) > nRef(meses[meses.length - 1]) ? meses[meses.length - 1] : alvo; }
      });
    }
    // equilíbrio marca × ativação pelo peso das ações (P=1, M=2, G=4), como nos estudos de eficácia; a base não entra na conta
    const pMeta = { ...p, esforco_marca_pct: p.esforco_marca_pct ?? U.esforcoPadrao(emp && emp.setor) };
    const alvo = U.metaMarcaPlano(pMeta) / 100; // a média do plano inteiro (no lançamento, 35% no 1º ano e 57% depois)
    const alvoDe = (mm) => (mm ? U.metaMarcaMes(pMeta, mm) / 100 : alvo); // a meta do mês: no lançamento, a virada acontece no 13º mês
    const tipoLib = (y) => y.tipo || (y.esforco === 'marca' ? 'marca' : 'ativacao');
    const pesoPlano = (t) => acoes.filter((a) => U.tipoEsforco(a) === t).reduce((s2, a) => s2 + U.pesoTamanho(a), 0)
      + novas.filter((x) => U.tipoEsforco({ titulo: x.titulo, esforco: x.esforco }) === t).reduce((s2, x) => s2 + ptsT(x.titulo), 0);
    const emFalta = (mm) => { const m = pesoPlano('marca'); const a = pesoPlano('ativacao'); return m + a === 0 || m / (m + a) < alvoDe(mm) ? 'marca' : 'ativacao'; };
    // a ordem de encaixe é a ordem de prioridade: quem entra primeiro pega os primeiros meses
    // 2. a estratégia: as ações que executam a abordagem viram essenciais nos 3 primeiros meses (até 3 por mês)
    // no máximo 8: estratégia é foco, e mais que isso não cabe nos 3 primeiros meses junto com a fundação
    if (ab) (ab.acoes || []).filter((t) => !ja(t) && (doSetor(libDe(t)) || doModelo.some((x) => x.titulo === t))).slice(0, 8).forEach((t, k) => {
      // se não couber, vai para o mês mais leve dos 3 primeiros: a estratégia nunca escorrega para depois do início
      // exceção: na marca nova, a ação que depende de histórico espera o histórico existir (ou fica de fora, se o plano acabar antes)
      const h = desdeHist(t);
      if (h >= meses.length) return;
      const alvo = vaga(Math.min(Math.floor(k / 3), meses.length - 1), t);
      const ini3 = meses.slice(Math.min(h, meses.length - 1), Math.max(Math.min(3, meses.length), h + 1));
      novas.push({ ...daLib(t, 'essencial'), executa: ab.curto, mes: ini3.includes(alvo) ? alvo : ini3.reduce((x, y) => (carga(y) < carga(x) ? y : x), ini3[0]) });
    });
    // 2b. lançamento: a virada de "experimente" para "lembre da marca" entra no 12º mês do plano (a meta de marca vira no 13º)
    if (pMeta.esforco_marca_pct === 35 || (ab && ab.lancamento)) {
      const VIRA = (P.acoes || []).find((y) => y.texto.startsWith('Virar a comunicação de "experimente"'));
      const m12 = p.inicio ? U.addRef(U.ref(p.inicio), 11) : null;
      if (VIRA && m12 && meses.includes(m12) && !ja(VIRA.texto)) novas.push({ ...daLib(VIRA.texto, 'essencial'), mes: m12 });
    }
    // 3. fundação: a identidade nos canais próprios e o caminho de compra, a partir do mês atual
    (P.FUNDACAO || []).forEach((t) => {
      if (ja(t) || acoes.some((a) => a.titulo === t) || !doSetor(libDe(t))) return;
      const doMod = doModelo.find((x) => x.titulo === t);
      const mm = vagaLivre(0, t); if (!mm) { semEspaco += 1; return; }
      novas.push({ ...(doMod || daLib(t, 'essencial')), mes: mm });
    });
    // 4. a base do esqueleto do setor (posicionamento, proposta, preço, roteiro de venda), mesmo que o esqueleto a coloque mais tarde
    const naoMarco = doModelo.filter((x) => !marco(x.titulo));
    naoMarco.filter((x) => faseDe(x.titulo) === 1).sort((a, b) => (b.peso === 'essencial') - (a.peso === 'essencial') || nRef(a.mes) - nRef(b.mes))
      .forEach((x) => {
        if (ja(x.titulo)) return;
        const mm = vagaLivre(0, x.titulo); if (!mm) { semEspaco += 1; return; }
        if (x.peso !== 'essencial' && meses.indexOf(mm) > Math.max(3, Math.round(nM / 3))) return; // base tardia de ajuda não entra: plano curto pede foco
        novas.push({ ...x, mes: mm });
      });
    // ação de ajuda do esqueleto do tipo que já passou da meta (mais de 5 pontos) não entra: o espaço fica para o tipo em falta
    const passaDaMeta = (titulo, esforco) => {
      const tp = U.tipoEsforco({ titulo, esforco }); const m = pesoPlano('marca'); const a = pesoPlano('ativacao');
      const desvio = m + a ? m / (m + a) - alvo : 0;
      return (tp === 'marca' && desvio > 0.05) || (tp === 'ativacao' && desvio < -0.05);
    };
    // 5. presença: prova e avaliações, a partir do 3º mês
    (P.PRESENCA || []).forEach((t) => {
      if (ja(t) || !doSetor(libDe(t))) return;
      const doMod = doModelo.find((x) => x.titulo === t);
      const mm = vagaLivre(Math.min(f2, meses.length - 1), t); if (!mm) { semEspaco += 1; return; }
      novas.push({ ...(doMod || daLib(t, 'ajuda')), mes: mm });
    });
    // 5b. o piso de evidência: todo plano tem alcance para quem ainda não compra (pelo menos 2 ações) e liga a marca a uma
    // situação de compra (pelo menos 1). São os pontos com mais evidência de crescimento; entram logo depois da janela da base, sem tirar o lugar dela
    const ALC = /(alcance amplo|para quem não está comprando|fatia de voz|aparecer mais que os concorrentes|anúncios no ar todos os meses|para alcance)/i;
    const CEP = /situaç/i;
    const noPlano = (re) => acoes.concat(novas.map((y) => ({ titulo: y.titulo }))).filter((y) => re.test(y.titulo)).length;
    [[ALC, 2], [CEP, 1]].forEach(([re, min]) => {
      const cand = (P.acoes || []).filter((y) => re.test(y.texto) && !ja(y.texto) && doSetor(y) && !y.manutencao && faseDe(y.texto) !== 3).sort((a, b) => ptsT(a.texto) - ptsT(b.texto));
      while (noPlano(re) < min && cand.length) {
        const y = cand.shift(); const ini = Math.min(Math.max(f2, Math.round(nM / 3)), meses.length - 1); const mm = vagaLivre(ini, y.texto) || vagaLivre(0, y.texto);
        if (mm) novas.push({ ...daLib(y.texto, 'ajuda'), mes: mm });
      }
    });
    // 6. o resto do esqueleto: o que ficou para trás entra a partir da janela da fase; o que vem pela frente, no mês proporcional (nunca antes da fase)
    naoMarco.filter((x) => faseDe(x.titulo) !== 1).sort((a, b) => (b.peso === 'essencial') - (a.peso === 'essencial') || nRef(a.mes) - nRef(b.mes))
      .forEach((x) => {
        if (ja(x.titulo)) return;
        if (x.peso !== 'essencial' && passaDaMeta(x.titulo, x.esforco)) return;
        const mm = vagaLivre(desdeFase(x.titulo, nRef(x.mes) < nRef(de) ? 0 : idx(x.mes)), x.titulo); if (!mm) { semEspaco += 1; return; }
        novas.push({ ...x, mes: mm });
      });
    // continuidade: ações da biblioteca do setor, sem manutenção, alternando marca e venda e os temas
    const pool = (P.acoes || []).filter((x) => !x.manutencao && doSetor(x) && x.tam !== 'G' || (!x.manutencao && doSetor(x) && x.esforco === 'marca'))
      .filter((x, k, arr) => arr.findIndex((y) => y.texto === x.texto) === k)
      .sort((a, b) => (faseDe(a.texto) - faseDe(b.texto)) || (taxaDe(b.texto) - taxaDe(a.texto)) || ((TAM[a.tam] || [, , 2])[2] - (TAM[b.tam] || [, , 2])[2]));
    // na continuidade, cada mês só recebe ações da fase dele: base só no primeiro terço, otimização só da metade em diante
    let kMes = 0;
    const naFase = (x) => { const f = faseDe(x.texto); return f === 1 ? kMes < Math.max(3, Math.round(nM / 3)) : f === 3 ? kMes >= f3 : true; };
    const pega = (filtro) => { const k = pool.findIndex((x) => filtro(x) && naFase(x) && !ja(x.texto)); return k < 0 ? null : pool.splice(k, 1)[0]; };
    meses.forEach((mes, km) => {
      kMes = km;
      const doMes = () => acoes.filter((a) => a.mes_previsto === mes).concat(novas.filter((x) => x.mes === mes));
      const add = (x, peso) => novas.push({ mes, peso, promessa: x.promessa || null, esforco: x.esforco || null, titulo: x.texto, porque: x.porque || null, metrica: x.metrica || null });
      // a marca aparece todo mês: sumir da comunicação derruba as vendas, e mais rápido nas marcas pequenas
      if (!doMes().some((a) => U.tipoEsforco({ titulo: a.titulo, tipo: a.tipo, esforco: a.esforco }) === 'marca')) {
        // mês cheio: a ação mais leve que não é da estratégia nem marco vai para o próximo mês com espaço, e a marca entra
        if (nMes(mes) >= LIM_N) {
          const sai = novas.filter((y) => y.mes === mes && !y.executa && !marco(y.titulo) && y.peso !== 'essencial').sort((a, b) => ptsT(a.titulo) - ptsT(b.titulo))[0];
          const prox = sai && meses.slice(km + 1).find((mm) => nMes(mm) < LIM_N - 1 && carga(mm) + ptsT(sai.titulo) <= LIM);
          if (sai && prox) sai.mes = prox;
        }
        const sobra = emFalta(mes) === 'ativacao';
        const x = (noPlano(ALC) < 2 && pega((y) => tipoLib(y) === 'marca' && ALC.test(y.texto)))
          || (noPlano(CEP) < 1 && pega((y) => tipoLib(y) === 'marca' && CEP.test(y.texto)))
          || (sobra && pega((y) => tipoLib(y) === 'marca' && y.tam === 'P'))
          || pega((y) => tipoLib(y) === 'marca');
        if (x) add(x, 'ajuda');
      }
      // o resto do mês vai para o tipo que está abaixo da meta do cliente, sem cota fixa por mês
      while (doMes().length < 2) { const t = emFalta(mes); const x = (t === 'ativacao' && pega((y) => tipoLib(y) === t && y.tam !== 'P' && (TAM[y.tam] || [, , 2])[2] <= LIM - carga(mes))) || pega((y) => tipoLib(y) === t) || pega((y) => tipoLib(y) !== 'base') || pega(() => true); if (!x) break; add(x, 'ajuda'); }
      // mês leve (só ações rápidas): completa até uns 5 pontos com ações que caibam, para o cliente não ficar parado no resto do mês
      while (carga(mes) < 5 && nMes(mes) < LIM_N) { const cabe = LIM - carga(mes); const t = emFalta(mes); const x = pega((y) => tipoLib(y) === t && (TAM[y.tam] || [, , 2])[2] <= cabe && (TAM[y.tam] || [, , 2])[2] >= 2) || pega((y) => (TAM[y.tam] || [, , 2])[2] <= cabe && (TAM[y.tam] || [, , 2])[2] >= 2) || pega((y) => (TAM[y.tam] || [, , 2])[2] <= cabe); if (!x) break; add(x, 'ajuda'); }
      // um essencial por mês: a primeira ação nova do mês vira a essencial, se ainda não houver
      if (!doMes().some((a) => a.peso === 'essencial')) { const x = novas.find((y) => y.mes === mes); if (x) x.peso = 'essencial'; }
    });
    // o que já vinha do setor e também executa a abordagem ganha o selo
    if (ab) novas.forEach((x) => { if ((ab.acoes || []).includes(x.titulo)) x.executa = ab.curto; });
    // acerto final do equilíbrio: se a marca passou da meta do setor (mais de 8 pontos), troca ações de marca de ajuda por ativação
    // no mesmo mês, das mais pesadas para as mais leves. Nunca mexe na estratégia, na base, nas essenciais, nos marcos,
    // no piso de alcance e de situação de compra, nem deixa um mês sem marca
    const ehMarca = (y) => U.tipoEsforco({ titulo: y.titulo, tipo: y.tipo, esforco: y.esforco }) === 'marca';
    const marcasNoMes = (mes) => acoes.filter((a) => a.mes_previsto === mes && ehMarca(a)).length + novas.filter((y) => y.mes === mes && ehMarca(y)).length;
    // a conta é feita por fase: no lançamento, o 1º ano contra 35% e o resto contra 57%; nos demais planos, o plano inteiro contra a meta
    const fases = (() => {
      if (pMeta.esforco_marca_pct !== 35 || !p.inicio) return [meses];
      const a1 = meses.filter((mm) => U.metaMarcaMes(pMeta, mm) === 35); const a2 = meses.filter((mm) => U.metaMarcaMes(pMeta, mm) !== 35);
      return [a1, a2].filter((f) => f.length);
    })();
    fases.forEach((fase) => {
      const naFaseM = (mm) => fase.includes(mm);
      const pesoFase = (t) => acoes.filter((a) => naFaseM(a.mes_previsto) && U.tipoEsforco(a) === t).reduce((s2, a) => s2 + U.pesoTamanho(a), 0)
        + novas.filter((x) => naFaseM(x.mes) && U.tipoEsforco({ titulo: x.titulo, tipo: x.tipo, esforco: x.esforco }) === t).reduce((s2, x) => s2 + ptsT(x.titulo), 0);
      const metaFase = alvoDe(fase[0]);
      const desvioMarca = () => { const m = pesoFase('marca'); const a = pesoFase('ativacao'); return m + a ? m / (m + a) - metaFase : 0; };
      for (let volta = 0; volta < 60 && desvioMarca() > 0.08; volta += 1) {
        const x = novas.filter((y) => naFaseM(y.mes) && ehMarca(y) && !y.executa && !marco(y.titulo) && y.peso !== 'essencial' && faseDe(y.titulo) !== 1
          && !ALC.test(y.titulo) && !CEP.test(y.titulo) && marcasNoMes(y.mes) > 1)
          .sort((a, b) => ptsT(b.titulo) - ptsT(a.titulo))[0];
        if (!x) {
          // cada mês já tem uma só ação de marca (a presença contínua): em vez de tirar marca, soma ativação no mês mais leve que ainda tem espaço
          const livre = fase.filter((mm) => nMes(mm) < LIM_N && LIM - carga(mm) >= 2).sort((m1, m2) => carga(m1) - carga(m2))[0];
          if (!livre) break;
          kMes = meses.indexOf(livre);
          const z = pega((w) => tipoLib(w) === 'ativacao' && (TAM[w.tam] || [, , 2])[2] <= LIM - carga(livre));
          if (!z) break;
          novas.push({ mes: livre, peso: 'ajuda', promessa: z.promessa || null, esforco: z.esforco || null, titulo: z.texto, porque: z.porque || null, metrica: z.metrica || null });
          continue;
        }
        kMes = Math.max(0, meses.indexOf(x.mes));
        const cabe = LIM - carga(x.mes) + ptsT(x.titulo);
        const y = pega((z) => tipoLib(z) === 'ativacao' && (TAM[z.tam] || [, , 2])[2] <= cabe);
        if (y) Object.assign(x, { promessa: y.promessa || null, esforco: y.esforco || null, tipo: y.tipo || undefined, titulo: y.texto, porque: y.porque || null, metrica: y.metrica || null });
        else if (novas.filter((z) => z.mes === x.mes).length + acoes.filter((a) => a.mes_previsto === x.mes).length > 2) novas.splice(novas.indexOf(x), 1);
        else break;
      }
    });
    // no máximo 2 essenciais por mês: o que passar disso vira ajuda (foco, não lista de urgências); as da estratégia têm a vez
    meses.forEach((mes) => {
      let n = acoes.filter((a) => a.mes_previsto === mes && a.peso === 'essencial').length;
      // as da estratégia continuam essenciais: são o motivo do plano
      novas.filter((x) => x.mes === mes && x.peso === 'essencial').sort((a, b) => !!b.executa - !!a.executa).forEach((x) => { n += 1; if (n > 2 && !x.executa && !marco(x.titulo)) x.peso = 'ajuda'; });
    });
    novas.semEspaco = semEspaco;
    return novas.sort((a, b) => nRef(a.mes) - nRef(b.mes));
  };
  // o aviso de como a estratégia entrou no modelo
  const notaEstrategia = (E, plano) => {
    if (!E.texto) return el('li', 'lib__item mod__estr is-falta', el('p', 'row__text', 'Sem estratégia: o plano segue só o setor. Escolha o desafio e a abordagem em Estratégia para ele sair alinhado.'));
    if (!E.ab) return el('li', 'lib__item mod__estr is-falta', el('p', 'row__text', 'A abordagem foi escrita à mão, então o modelo não sabe quais ações a executam: o plano segue o setor. Marque as ações da estratégia no Planejar o mês.'));
    const n = plano.filter((x) => x.executa).length;
    if (!n) return el('li', 'lib__item mod__estr is-falta', el('p', 'row__text', 'Nenhuma ação desta abordagem serve para este setor: o plano segue o setor. Confira se a abordagem combina com o tipo de negócio do cliente.'));
    const fora = (E.ab.fora || []).length;
    return el('li', 'lib__item mod__estr', el('p', 'row__text', el('strong', null, 'Alinhado à estratégia: ' + E.ab.curto + '.'), el('br'),
      n + (n === 1 ? ' ação executa' : ' ações executam') + ' a abordagem e ' + (n === 1 ? 'vem' : 'vêm') + ' primeiro.' + (fora ? ' ' + fora + (fora === 1 ? ' ação ficou' : ' ações ficaram') + ' de fora por contradizer a renúncia.' : '')));
  };
  const desenhaModelo = async () => {
    const m = MOD[$('mod-setor').value];
    if (!m) return $('mod-list').replaceChildren(el('li', 'lib__item', el('p', 'row__text', 'Defina o setor do cliente em Contrato para ver o plano modelo.')));
    if (!p.inicio) return $('mod-list').replaceChildren(el('li', 'lib__item', el('p', 'row__text', 'Cadastre o início do plano (em Plano) para ver o modelo distribuído nos meses.')));
    const E = await abordagemAtual();
    const plano = montaModelo(m, E.ab);
    // o plano já cobre todos os meses com este modelo: não há o que mostrar (e nada a montar)
    if (!plano.length) return $('mod-list').replaceChildren(el('li', 'lib__item', el('p', 'row__text', 'O plano já cobre todos os meses com este modelo. Para mudar um mês, use o Planejar o mês.')));
    const meses = [...new Set(plano.map((x) => x.mes))];
    $('mod-list').replaceChildren(...[notaEstrategia(E, plano),
      plano.semEspaco ? el('li', 'lib__item mod__estr is-falta', el('p', 'row__text', plano.semEspaco + (plano.semEspaco === 1 ? ' ação do modelo ficou' : ' ações do modelo ficaram') + ' de fora para nenhum mês passar de 5 ações. Com pouco tempo de plano, entram primeiro a estratégia, os marcos e o que tem mais evidência.')) : null,
      el('li', 'lib__item mod__resumo', el('p', 'row__text', plano.length + ' ações em ' + meses.length + ' meses, de ' + U.nomeMes(meses[0]) + ' de ' + meses[0].slice(0, 4) + ' a ' + U.nomeMes(meses[meses.length - 1]) + ' de ' + meses[meses.length - 1].slice(0, 4) + '. Nenhum mês fica vazio; ajuste mês a mês no Planejar o mês, conforme os resultados.')),
      ...meses.map((mm) => el('li', 'lib__item mod__mes',
        el('div', 'lib__main', el('p', 'row__eyebrow', U.cap(U.nomeMes(mm)) + ' ' + mm.slice(0, 4)),
          ((f) => (f ? el('p', 'mod__foco', el('span', 'mod__foco-l', 'Foco'), f) : null))(focoPrevisto(plano.filter((x) => x.mes === mm).map((x) => ({ titulo: x.titulo, peso: x.peso }))
            .concat(acoes.filter((a) => a.mes_previsto === mm).map((a) => ({ titulo: a.titulo, peso: a.peso }))))),
          el('ul', 'mod__acs', plano.filter((x) => x.mes === mm).map((x) => el('li', null,
            el('span', 'mod__peso' + (x.peso === 'essencial' ? ' is-ess' : ''), x.peso === 'essencial' ? 'Essencial' : 'Ajuda'),
            el('span', null, x.titulo.split(':')[0], x.executa ? el('span', 'mod__exec', 'Estratégia') : null), el('span', 'mod__esf', x.esforco === 'marca' ? 'marca' : 'venda')))))))].filter(Boolean));
  };
  // vindo da Estratégia: abre o modelo já com a prévia do plano alinhado; montar continua sendo um clique do consultor
  window.GangAbreModelo = () => {
    modeloDoSetor();
    location.hash = '#acoes';
    const d = $('acoes-modelo'); d.open = true; desenhaModelo();
    setTimeout(() => d.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };
  $('acoes-modelo').addEventListener('toggle', desenhaModelo);
  $('mod-go').addEventListener('click', async () => {
    if (!p.inicio) return say($('acoes-msg'), 'Cadastre o início do plano (em Plano) antes de montar as ações.', 'error');
    const m = MOD[$('mod-setor').value]; if (!m) return;
    const E = await abordagemAtual();
    const novas = montaModelo(m, E.ab);
    if (!novas.length) return say($('acoes-msg'), 'O plano já cobre todos os meses com este modelo.', 'ok');
    const nMeses = new Set(novas.map((x) => x.mes)).size;
    if (!confirm('Montar o plano “' + m.nome + '” até o fim do prazo: ' + novas.length + ' ações em ' + nMeses + ' meses. As que já existem não se repetem.')) return;
    $('mod-go').disabled = true;
    const prz = {};
    [...new Set(novas.map((x) => x.mes))].forEach((mm) => {
      const doM = novas.filter((x) => x.mes === mm).map((x) => ({ ...((P.acoes || []).find((a) => a.texto === x.titulo) || { texto: x.titulo }), essencial: x.peso === 'essencial' ? 1 : 0 }));
      Object.assign(prz, Object.fromEntries(Object.entries(distribuiPrazos(mm, doM)).map(([t, d]) => [mm + '|' + t, d])));
    });
    const r = await sb.from('acoes').insert(novas.map((x) => ({ ...detalheDe(x.titulo), prazo: prz[x.mes + '|' + x.titulo] || null, empresa_id: id, titulo: x.titulo, mes_previsto: x.mes, peso: x.peso, promessa: x.promessa, esforco: x.esforco,
      porque: x.porque, metrica_sucesso: x.metrica, ...(x.executa ? { executa: x.executa } : {}), responsavel: 'cliente', status: 'a_fazer', atualizada_por: me.id, atualizada_em: new Date().toISOString() })));
    $('mod-go').disabled = false;
    if (r.error) {
      const m = String(r.error.message || '');
      const falta = /schema cache|does not exist/i.test(m);
      return say($('acoes-msg'), falta ? 'Não foi possível montar o plano: o banco ainda não tem as novidades. Rode o supabase/portal.sql atualizado no Supabase e tente de novo. (' + m + ')' : 'Não foi possível montar o plano. (' + m + ')', 'error');
    }
    say($('acoes-msg'), 'Plano montado até o fim do prazo: ' + novas.length + ' ações em ' + nMeses + ' meses. Ajuste mês a mês no Planejar o mês, conforme os resultados.', 'ok');
    await loadAcoes();
  });

  // biblioteca de ações comprovadas: adiciona direto ao plano, com esforço e métrica de sucesso já definidos
  $('lib-mes').value = U.ref();
  const desenhaLib = () => {
    const f = $('lib-filtro').value; const tm = $('lib-tema').value;
    carregaHistorico().then(() => { if (!historico.__ok) { historico.__ok = true; desenhaLib(); } });
    $('lib-list').replaceChildren(...(P.acoes || []).filter((x) => (!f || x.esforco === f) && (!tm || x.tema === tm))
      .sort((a, b) => (doSetor(b) - doSetor(a)) || (taxaDe(b.texto) - taxaDe(a.texto))).map((x) => {
      const ja = acoes.some((a) => a.titulo === x.texto && a.mes_previsto === $('lib-mes').value);
      const b = el('button', { class: 'btn btn--sm ' + (ja ? 'btn--ghost' : 'btn--light'), type: 'button', disabled: ja }, ja ? 'No plano ✓' : 'Adicionar');
      b.addEventListener('click', async () => {
        b.disabled = true;
        const mesL = $('lib-mes').value || U.ref();
        const r = await sb.from('acoes').insert({ ...detalheDe(x.texto), prazo: distribuiPrazos(mesL, [{ ...x, essencial: 0, tam: 'G' }])[x.texto] || null, empresa_id: id, titulo: x.texto, mes_previsto: mesL, esforco: x.esforco || null,
          metrica_sucesso: x.metrica || null, porque: x.porque || null, promessa: x.promessa || null, peso: 'ajuda', responsavel: 'cliente', status: 'a_fazer', atualizada_por: me.id, atualizada_em: new Date().toISOString() });
        if (r.error) { b.disabled = false; return say($('acoes-msg'), 'Não foi possível adicionar.', 'error'); }
        say($('acoes-msg'), '“' + x.texto + '” entrou no plano de ' + U.nomeMes($('lib-mes').value) + '. Edite para definir prazo, objetivo e situação de compra.', 'ok');
        await loadAcoes(); desenhaLib();
      });
      return el('li', 'lib__item',
        el('div', 'lib__main',
          el('p', 'row__eyebrow', [(P.temas || {})[x.tema], x.tam ? 'tamanho ' + x.tam : null, x.esforco === 'marca' ? 'esforço de marca' : 'esforço de venda', x.promessa ? U.PROMESSAS[x.promessa] : null, x.ler ? 'medir em ' + x.ler + ' dias' : null].filter(Boolean).join(' · ')),
          el('p', 'row__title', x.texto),
          el('div', 'plan__ac-tags', selo(x.texto),
            x.manutencao ? el('span', { class: 'aviso-chip aviso-chip--man', title: 'Cuida de quem já é cliente. Vale, mas não faz a marca crescer.' }, 'Manutenção') : null,
            !doSetor(x) ? el('span', 'aviso-chip', 'Pouco usada em ' + (U.setorNome(emp.setor) || 'este setor').toLowerCase()) : null,
            x.antes && !acoes.some((a) => a.titulo === x.antes) ? el('span', 'aviso-chip', 'Antes: ' + x.antes.split(':')[0]) : null),
          x.porque ? el('p', 'lib__why', x.porque) : null,
          x.metrica ? el('p', 'row__text', 'Sucesso se: ' + x.metrica) : null),
        b);
    }));
  };
  $('lib-tema').append(...Object.entries(P.temas || {}).map(([k, t]) => el('option', { value: k }, t + ' (' + (P.acoes || []).filter((x) => x.tema === k).length + ')')));
  $('lib-tema').addEventListener('change', desenhaLib);
  $('lib-filtro').addEventListener('change', desenhaLib);
  $('lib-mes').addEventListener('change', desenhaLib);
  $('acoes-lib').addEventListener('toggle', desenhaLib);

  // sugestões do cliente
  const loadSugs = async () => {
    const { data: todas } = await sb.from('sugestoes').select('*').eq('empresa_id', id).eq('status', 'nova').order('criada_em');
    const data = (todas || []).filter((x) => x.tipo !== 'duvida'); // as dúvidas ficam na pauta do encontro
    const n = data.length;
    $('sug-sec').hidden = !n;
    $('sug-count').hidden = !n; $('sug-count').textContent = n; $('sug-count').className = 'side__ind';
    loadPautaCli(todas || []);
    $('sugs').replaceChildren(...(data || []).map((sg) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__eyebrow', 'Enviada em ' + U.diaAno(sg.criada_em)), el('p', 'row__title', sg.texto)),
      el('div', 'row__actions',
        rowBtn('Virar ação', () => abreForm(null, sg)),
        rowBtn('Recusar', async () => { await sb.from('sugestoes').update({ status: 'recusada' }).eq('id', sg.id); loadSugs(); }, true)))));
  };
  // para o próximo encontro: dúvidas do cliente, ações travadas e ideias (tudo vira pauta, não mensagem)
  const loadPautaCli = async (sugs) => {
    const { data: trav } = await sb.from('acoes').select('id, titulo, travada, travada_nota, mes_previsto').eq('empresa_id', id).not('travada', 'is', null).neq('status', 'feita');
    const MOT = { tempo: 'sem tempo', verba: 'sem verba', duvida: 'com dúvida', outro: 'outro motivo' };
    const duv = sugs.filter((x) => x.tipo === 'duvida'); const ide = sugs.filter((x) => x.tipo !== 'duvida');
    const itens = [
      ...duv.map((x) => el('li', 'row', el('div', 'row__main', el('p', 'row__eyebrow', 'Dúvida · ' + U.dia(x.criada_em)), el('p', 'row__title', x.texto)),
        el('div', 'row__actions', rowBtn('Tratado', async () => { await sb.from('sugestoes').update({ status: 'aceita' }).eq('id', x.id); loadSugs(); })))),
      ...(trav || []).map((a) => el('li', 'row', el('div', 'row__main', el('p', 'row__eyebrow', 'Ação travada · ' + MOT[a.travada]), el('p', 'row__title', a.titulo), a.travada_nota ? el('p', 'row__text', '“' + a.travada_nota + '”') : null),
        el('div', 'row__actions', rowBtn('Abrir a ação', () => vaiParaAcao(a))))),
      ide.length ? el('li', 'row', el('div', 'row__main', el('p', 'row__eyebrow', 'Ideias do cliente'), el('p', 'row__title', ide.length + (ide.length === 1 ? ' ideia para avaliar' : ' ideias para avaliar'))),
        el('div', 'row__actions', el('a', { class: 'btn btn--ghost btn--sm', href: '#acoes' }, 'Avaliar em Ações'))) : null,
    ].filter(Boolean);
    $('pauta-cli-sec').hidden = !itens.length;
    $('pauta-cli').replaceChildren(...itens);
  };
  loadSugs();

  // o que decidimos não fazer
  const loadDescs = async () => {
    const { data } = await sb.from('acoes_descartadas').select('*').eq('empresa_id', id).order('ordem').order('texto');
    $('descs').replaceChildren(...((data || []).length ? data.map((d) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__title', el('s', null, d.texto))),
      el('div', 'row__actions', rowBtn('Excluir', async () => { await sb.from('acoes_descartadas').delete().eq('id', d.id); loadDescs(); }, true)))) : [el('li', 'clients__empty', 'Nada descartado ainda.')]));
  };
  $('desc-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = val('d-texto'); if (!t) return;
    const { data } = await sb.from('acoes_descartadas').select('ordem').eq('empresa_id', id).order('ordem', { ascending: false }).limit(1);
    await sb.from('acoes_descartadas').insert({ empresa_id: id, texto: t, ordem: data && data[0] ? data[0].ordem + 1 : 1 });
    setv('d-texto', ''); loadDescs();
  });
  loadDescs();

  const tabela = (cols, linhas) => [el('thead', null, el('tr', null, cols.map((c) => el('th', { scope: 'col' }, c)))),
    el('tbody', null, linhas.map((l) => el('tr', null, l.map((v, i) => (i === 0 ? el('th', { scope: 'row' }, v) : el('td', null, v))))))];
  const toggle = (formEl, btn, open) => { formEl.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };

  // ===== resultados: números enviados =====
  // gráficos dos números: o que a tabela mostra, em forma de tendência
  const GR = U.graficos('#f3f3f3'); const CINZA = '#8a8a8a';
  const fmtR = (v) => (Math.abs(v) >= 1000 ? 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil' : U.reais(v));
  const fmtN = (v) => String(Math.round(v));
  const fmtP = (v) => Math.round(v) + '%';
  const cartao = (titulo, sub, legenda, chart) => el('div', 'graf-card', el('p', 'graf-card__t', titulo), sub ? el('p', 'small', sub) : null, legenda, chart);
  const desenhaGraficosNums = (rows) => {
    const box = $('nums-graf'); if (!box) return;
    const asc = [...rows].sort((a, b) => (a.mes_ref < b.mes_ref ? -1 : 1));
    if (asc.length < 2) { box.replaceChildren(el('p', 'small graf-vazio', asc.length ? 'Os gráficos aparecem a partir do 2º mês de números.' : '')); return; }
    const rot = asc.map((n) => U.cap(U.nomeMesCurto(n.mes_ref)));
    const v = (k) => asc.map((n) => (n[k] == null ? null : Number(n[k])));
    const anoAnt = (p && p.fat_ano_anterior) || {};
    const ant = asc.map((n) => { const x = anoAnt[n.mes_ref.slice(5, 7)]; return x == null ? null : Number(x); });
    const temAnt = ant.some((x) => x != null);
    const fech = asc.map((n) => (n.propostas ? Math.round((100 * (n.fechadas || 0)) / n.propostas) : null));
    const semDesc = asc.map((n) => (n.fechadas ? Math.round((100 * (n.sem_desconto || 0)) / n.fechadas) : null));
    const cards = [
      cartao('Faturamento', temAnt ? 'Comparado ao mesmo mês do ano anterior, para separar o efeito da época do ano.' : 'Mês a mês. Preencha o faturamento do ano anterior no Plano para comparar com a época do ano.',
        GR.legenda([['Este período', '#f3f3f3'], ...(temAnt ? [['Ano anterior', CINZA, 'dash']] : [])]),
        GR.linhas({ rotulos: rot, fmt: fmtR, label: 'Faturamento por mês: ' + rot.map((r, i) => r + ' ' + (asc[i].faturamento == null ? 'sem dado' : fmtR(asc[i].faturamento))).join(', '),
          series: [{ nome: 'este período', cor: '#f3f3f3', valores: v('faturamento'), pontos: true, rotuloFim: true }, ...(temAnt ? [{ nome: 'ano anterior', cor: CINZA, valores: ant, tracejado: true }] : [])] })),
    ];
    if (v('clientes_atendidos').some((x) => x != null)) cards.push(cartao('Clientes atendidos', 'Novos embaixo e os que voltaram em cima. Crescer depende sobretudo dos novos.',
      GR.legenda([['Novos', '#f3f3f3', 'sq'], ['Voltaram', '#5c5c5c', 'sq']]),
      GR.pilhas({ rotulos: rot, a: v('clientes_novos'), total: v('clientes_atendidos'), fmt: fmtN, label: 'Clientes atendidos por mês, com os novos: ' + rot.map((r, i) => r + ' ' + (asc[i].clientes_atendidos ?? 'sem dado') + ' (' + (asc[i].clientes_novos ?? '?') + ' novos)').join(', ') })));
    if (v('leads').some((x) => x != null) || v('fechadas').some((x) => x != null)) cards.push(cartao('Leads e vendas fechadas', 'Quantos contatos chegaram e quantas propostas viraram venda.',
      GR.legenda([['Leads', '#f3f3f3'], ['Fechadas', CINZA]]),
      GR.linhas({ rotulos: rot, fmt: fmtN, label: 'Leads e propostas fechadas por mês',
        series: [{ nome: 'leads', cor: '#f3f3f3', valores: v('leads'), pontos: true, rotuloFim: true }, { nome: 'fechadas', cor: CINZA, valores: v('fechadas'), pontos: true, rotuloFim: true }] })));
    if (fech.some((x) => x != null)) cards.push(cartao('Fechamento e preço', 'Das propostas, quantas fecharam; das fechadas, quantas sem desconto.',
      GR.legenda([['Fechamento', '#f3f3f3'], ['Sem desconto', CINZA]]),
      GR.linhas({ rotulos: rot, fmt: fmtP, label: 'Taxa de fechamento e vendas sem desconto por mês, em %',
        series: [{ nome: 'fechamento', cor: '#f3f3f3', valores: fech, pontos: true, rotuloFim: true }, { nome: 'sem desconto', cor: CINZA, valores: semDesc, pontos: true, rotuloFim: true }] })));
    box.replaceChildren(...cards);
  };
  const loadNums = async () => {
    const { data } = await sb.from('numeros_mensais').select('*').eq('empresa_id', id).order('mes_ref', { ascending: false });
    const rows = data || [];
    desenhaGraficosNums(rows);
    const t = $('nums');
    if (!rows.length) return t.replaceChildren(el('tbody', null, el('tr', null, el('td', 'clients__empty', 'Nenhum número enviado ainda.'))));
    t.replaceChildren(...tabela(['Mês', 'Faturamento', 'Leads', 'Atendidos', 'Novos', 'Propostas', 'Enviado', ''], rows.map((n) => [
      MESES(n.mes_ref), U.reais(n.faturamento), n.leads ?? '—', n.clientes_atendidos ?? '—', n.clientes_novos ?? '—',
      n.propostas != null ? n.propostas + ' · ' + (n.fechadas ?? 0) + ' fech. · ' + (n.sem_desconto ?? 0) + ' s/ desc.' : '—',
      U.dia(n.enviado_em) + (n.enviado_por === me.id ? ' · por você' : ''),
      rowBtn('Editar', () => {
        $('n-mes').value = n.mes_ref; U.moedaSet($('n-fat'), n.faturamento); $('n-leads').value = n.leads ?? ''; $('n-cli').value = n.clientes_novos ?? ''; $('n-tot').value = n.clientes_atendidos ?? ''; $('n-prop').value = n.propostas ?? ''; $('n-fech').value = n.fechadas ?? ''; $('n-sd').value = n.sem_desconto ?? '';
        $('n-fat').focus();
      }),
    ])));
  };
  $('n-mes').value = U.addRef(U.ref(), -1);
  $('num-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!$('n-mes').value || $('n-fat').value === '') return say($('num-msg'), 'Escolha o mês e informe o faturamento.', 'error');
    const num = (f) => ($(f).hasAttribute('data-moeda') ? U.moedaValor($(f)) : $(f).value === '' ? null : Number($(f).value));
    const r = await sb.from('numeros_mensais').upsert({
      empresa_id: id, mes_ref: $('n-mes').value, faturamento: num('n-fat'), leads: num('n-leads'), clientes_novos: num('n-cli'), clientes_atendidos: num('n-tot'), propostas: num('n-prop'), fechadas: num('n-fech'), sem_desconto: num('n-sd'),
      enviado_por: me.id, enviado_em: new Date().toISOString(),
    }, { onConflict: 'empresa_id,mes_ref' });
    say($('num-msg'), r.error ? 'Não foi possível salvar.' : 'Números de ' + U.nomeMes($('n-mes').value) + ' salvos.', r.error ? 'error' : 'ok');
    if (!r.error) { ['n-fat', 'n-leads', 'n-cli', 'n-tot', 'n-prop', 'n-fech', 'n-sd'].forEach((f) => { $(f).value = ''; }); loadNums(); }
  });
  loadNums();

  // ===== resultados: métricas =====
  const NIV_M = { negocio: 'Negócio', marketing: 'Marketing', marca: 'Marca' };
  const FREQ = { mensal: 'Todo mês', semestral: 'A cada 6 meses', anual: 'Todo ano' };
  const metForm = $('met-form');
  const abreMet = (m) => {
    toggle(metForm, $('open-met'), true);
    $('m-id').value = m ? m.id : ''; $('m-nivel').value = m ? m.nivel : 'negocio'; setv('m-nome', m ? m.nome : '');
    $('m-freq').value = m ? m.frequencia : 'mensal'; $('m-valor').value = m ? m.valor_atual || '' : ''; $('m-prox').value = m ? m.proxima_medicao || '' : '';
    say($('m-msg'), ''); $('m-nome').focus();
  };
  $('open-met').addEventListener('click', () => (metForm.hidden ? abreMet(null) : toggle(metForm, $('open-met'), false)));
  $('m-cancel').addEventListener('click', () => toggle(metForm, $('open-met'), false));
  const loadMets = async () => {
    const { data } = await sb.from('metricas').select('*').eq('empresa_id', id).order('ordem');
    $('mets').replaceChildren(...((data || []).length ? data.map((m) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__eyebrow', NIV_M[m.nivel] + ' · ' + FREQ[m.frequencia]), el('p', 'row__title', m.nome),
        el('p', 'row__text', m.valor_atual ? 'Agora: ' + m.valor_atual : (m.proxima_medicao ? '1ª medição em ' + U.mesAno(m.proxima_medicao) : 'Sem valor ainda'))),
      el('div', 'row__actions', rowBtn('Editar', () => abreMet(m)),
        rowBtn('Excluir', async () => { if (!confirm('Excluir a métrica “' + m.nome + '”?')) return; await sb.from('metricas').delete().eq('id', m.id); loadMets(); }, true)))) : [el('li', 'ed-vazio', 'Nenhuma métrica ainda. Cadastre uma por objetivo em Nova métrica.')]));
    return data || [];
  };
  metForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!val('m-nome')) return say($('m-msg'), 'Dê um nome para a métrica.', 'error');
    const row = { empresa_id: id, nivel: $('m-nivel').value, nome: val('m-nome'), frequencia: $('m-freq').value, valor_atual: val('m-valor'), proxima_medicao: val('m-prox') };
    const mid = $('m-id').value;
    if (!mid) { const atuais = await loadMets(); row.ordem = atuais.length + 1; }
    const r = mid ? await sb.from('metricas').update(row).eq('id', mid) : await sb.from('metricas').insert(row);
    if (r.error) return say($('m-msg'), 'Não foi possível salvar.', 'error');
    toggle(metForm, $('open-met'), false); loadMets();
  });
  loadMets();


  // ===== resultados: pesquisa de marca =====
  const pesqForm = $('pesq-form');
  let editPesq = null; // a rodada sendo editada (null = nova rodada)
  const travaPesq = (on) => { ['q-cat', 'q-conc', 'q-af'].forEach((k) => { $(k).disabled = on; }); };
  const editaPesq = (q, nResp) => {
    editPesq = { ...q, nResp };
    toggle(pesqForm, $('open-pesq'), true);
    $('q-titulo').value = q.titulo || ''; $('q-cat').value = q.categoria || '';
    $('q-conc').value = (q.concorrentes || []).join('\n'); $('q-af').value = (q.afirmacoes || []).join('\n');
    pesqForm.querySelector('.pq__mais').open = true;
    travaPesq(nResp > 0);
    pesqForm.querySelector('[type=submit]').textContent = 'Salvar alterações';
    say($('q-msg'), nResp > 0 ? 'Esta rodada já tem ' + nResp + (nResp === 1 ? ' resposta' : ' respostas') + ': só o nome pode mudar, para não misturar perguntas diferentes. Para mudar as perguntas, abra uma nova rodada.' : 'Sem respostas ainda: dá para mudar tudo. As situações de compra e os ativos são atualizados com o que está cadastrado hoje.', nResp > 0 ? 'error' : null);
    pesqForm.scrollIntoView({ block: 'start', behavior: 'smooth' }); $('q-titulo').focus({ preventScroll: true });
    resumoPesq();
  };
  const abrePesq = async () => {
    editPesq = null; travaPesq(false); pesqForm.querySelector('[type=submit]').textContent = 'Abrir a rodada';
    toggle(pesqForm, $('open-pesq'), true);
    const [{ data: obj }, { data: imp }, { data: q0 }] = await Promise.all([
      sb.from('objetivos').select('*').eq('empresa_id', id).eq('nivel', 'comunicacao').limit(1),
      sb.from('impressoes').select('marca_nome, eh_cliente').eq('empresa_id', id).order('ordem'),
      sb.from('pesquisas').select('categoria').eq('empresa_id', id).order('criada_em', { ascending: false }).limit(1),
    ]);
    const o = (obj || [])[0]; void o;
    $('q-titulo').value = 'Rodada de ' + U.mesAno(new Date());
    $('q-cat').value = (q0 && q0[0] && q0[0].categoria) || '';
    $('q-af').value = ''; // o que mede o crescimento é a lembrança nas situações e o reconhecimento dos ativos
    $('q-conc').value = (imp || []).filter((x) => !x.eh_cliente).map((x) => x.marca_nome).join('\n');
    pesqForm.querySelector('.pq__mais').open = false;
    say($('q-msg'), ''); $('q-cat').focus();
    resumoPesq();
  };
  // o resumo do que a rodada vai perguntar: o que já está cadastrado em Estratégia, Identidade e Diagnóstico
  const resumoPesq = async () => {
    const [{ data: sits }, { data: atv }] = await Promise.all([
      sb.from('situacoes').select('id').eq('empresa_id', id),
      sb.from('ativos').select('id').eq('empresa_id', id),
    ]);
    const conc = linhasDe($('q-conc').value).slice(0, 8); const af = linhasDe($('q-af').value);
    const cat = $('q-cat').value.trim();
    const item = (ok, texto, falta, aba) => el('li', 'pq__item' + (ok ? ' is-ok' : ' is-falta'), el('span', 'pq__ico', ok ? '✓' : '!'),
      el('span', null, texto, !ok && aba ? [' ', el('a', { class: 'link', href: '#' + aba }, falta)] : null));
    const ns = (sits || []).length, na = (atv || []).length;
    $('q-resumo').replaceChildren(...[
      item(!!cat, cat ? 'Que marcas vêm à cabeça quando pensam em ' + cat : 'Que marcas vêm à cabeça na categoria (falta escrever a categoria)'),
      item(ns > 0, ns ? 'Em quais de ' + ns + (ns === 1 ? ' situação de compra' : ' situações de compra') + ' lembram da marca' : 'Nenhuma situação de compra cadastrada:', 'cadastrar em Estratégia', 'estrategia'),
      item(na > 0, na ? 'Se reconhecem ' + na + (na === 1 ? ' ativo da marca' : ' ativos da marca') + ' sem o nome' : 'Nenhum ativo distintivo cadastrado:', 'cadastrar em Identidade', 'identidade'),
      // sem concorrentes, as perguntas de escolha e de situações viram "só a marca": a pesquisa perde o sentido
      item(conc.length >= 2, conc.length >= 2 ? 'Qual escolheriam entre a marca e ' + conc.length + ' concorrentes' : 'Faltam concorrentes (' + conc.length + ' de pelo menos 2): sem eles, a escolha e as situações só mostram a marca.', 'cadastrar em Diagnóstico', 'diagnostico'),
      af.length ? item(true, af.length + (af.length === 1 ? ' frase para dar nota' : ' frases para dar nota')) : null,
      item(true, 'Se já são clientes, para separar quem compra de quem ainda não compra')].filter(Boolean)); // replaceChildren escreveria "null"
  };
  ['q-cat', 'q-conc', 'q-af'].forEach((k) => $(k).addEventListener('input', () => { clearTimeout(resumoPesq.t); resumoPesq.t = setTimeout(resumoPesq, 250); }));
  $('open-pesq').addEventListener('click', () => (pesqForm.hidden ? abrePesq() : toggle(pesqForm, $('open-pesq'), false)));
  $('q-cancel').addEventListener('click', () => { editPesq = null; travaPesq(false); toggle(pesqForm, $('open-pesq'), false); });
  pesqForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const af = linhasDe($('q-af').value); const conc = linhasDe($('q-conc').value);
    if (!val('q-cat')) { $('q-cat').focus(); return say($('q-msg'), 'Escreva como o cliente chama o que vocês vendem.', 'error'); }
    if (!val('q-titulo')) $('q-titulo').value = 'Rodada de ' + U.mesAno(new Date());
    if (af.length > 6) return say($('q-msg'), 'Use no máximo 6 frases.', 'error');
    if (editPesq && editPesq.nResp > 0) {
      const r0 = await sb.from('pesquisas').update({ titulo: val('q-titulo') }).eq('id', editPesq.id);
      if (r0.error) return say($('q-msg'), 'Não foi possível salvar.', 'error');
      editPesq = null; travaPesq(false); toggle(pesqForm, $('open-pesq'), false); loadPesqs(); return;
    }
    const [{ data: sits }, { data: atv }] = await Promise.all([
      sb.from('situacoes').select('id, texto').eq('empresa_id', id).order('ordem'),
      sb.from('ativos').select('id, nome, tipo, texto, imagem_url').eq('empresa_id', id).order('ordem'),
    ]);
    if (!(sits || []).length && !(atv || []).length && !af.length) return say($('q-msg'), 'Cadastre as situações de compra (Estratégia) ou os ativos distintivos (Identidade) antes de abrir a rodada.', 'error');
    if (conc.length < 2) { pesqForm.querySelector('.pq__mais').open = true; $('q-conc').focus(); return say($('q-msg'), 'Coloque pelo menos 2 concorrentes (um por linha). Sem eles, a pesquisa só mostra a marca e as respostas não dizem nada.', 'error'); }
    if (editPesq) {
      const r1 = await sb.from('pesquisas').update({ titulo: val('q-titulo'), categoria: val('q-cat'), afirmacoes: af, concorrentes: conc.slice(0, 8), situacoes: sits || [], ativos: atv || [] }).eq('id', editPesq.id);
      if (r1.error) return say($('q-msg'), 'Não foi possível salvar.', 'error');
      editPesq = null; toggle(pesqForm, $('open-pesq'), false); loadPesqs(); return;
    }
    // uma rodada aberta por vez: a anterior fecha
    await sb.from('pesquisas').update({ aberta: false }).eq('empresa_id', id).eq('aberta', true);
    const r = await sb.from('pesquisas').insert({ empresa_id: id, titulo: val('q-titulo'), categoria: val('q-cat'), afirmacoes: af, concorrentes: conc.slice(0, 8), situacoes: sits || [], ativos: atv || [] });
    if (r.error) return say($('q-msg'), 'Não foi possível criar.', 'error');
    toggle(pesqForm, $('open-pesq'), false); loadPesqs();
  });
  const linhasDe = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean);
  const loadPesqs = async () => {
    const [{ data: ps }, { data: rs }] = await Promise.all([
      sb.from('pesquisas').select('*').eq('empresa_id', id).order('criada_em', { ascending: false }),
      sb.from('respostas').select('pesquisa_id, ja_cliente, recencia').eq('empresa_id', id),
    ]);
    const n = (pid) => (rs || []).filter((r) => r.pesquisa_id === pid).length;
    // o que mede crescimento: respostas de quem compra a categoria e ainda não é cliente (meta de 30 por rodada)
    const nMercado = (pid) => (rs || []).filter((r) => r.pesquisa_id === pid && r.ja_cliente === false && r.recencia && r.recencia !== 'nunca').length;
    if (p && p.inicio && window.GangSaude) {
      const dur = p.duracao_meses || 18; const ini = U.ref(p.inicio);
      const rodadas = window.GangSaude.MESES_PESQUISA(dur).map((m) => ({ m, ref: U.addRef(ini, m - 1) }));
      const feitas = (ps || []).map((q) => (q.criada_em || '').slice(0, 7));
      $('pesq-cal').replaceChildren(el('span', 'small', 'Calendário de rodadas: '), ...rodadas.map(({ m, ref }) => el('span', 'chip-cal' + (feitas.includes(ref) ? ' is-ok' : ref < U.ref() ? ' is-late' : ref === U.ref() ? ' is-now' : ''),
        (m === 1 ? 'Partida' : m === dur ? 'Chegada' : 'Mês ' + m) + ' · ' + U.cap(U.nomeMesCurto(ref)) + ' ' + ref.slice(2, 4))));
    }
    $('pesqs').replaceChildren(...((ps || []).length ? ps.map((q) => {
      const url = location.origin + '/pesquisa.html?t=' + q.token;
      return el('li', 'row',
        el('div', 'row__main', el('p', 'row__eyebrow', (q.aberta ? 'Aberta' : 'Fechada') + ' · criada em ' + U.diaAno(q.criada_em)), el('p', 'row__title', q.titulo),
          el('p', 'row__text', n(q.id) + ' respostas · ' + nMercado(q.id) + ' de 30 de quem compra a categoria e não é cliente · ' + q.categoria + ' · ' + (q.situacoes || []).length + ' situações · ' + (q.ativos || []).length + ' ativos')),
        el('div', 'row__actions',
          q.aberta ? rowBtn('Copiar link', async (e) => { try { await navigator.clipboard.writeText(url); e.target.textContent = 'Copiado'; } catch (er) { window.prompt('Link da pesquisa:', url); } }) : null,
          rowBtn('Editar', () => editaPesq(q, n(q.id))),
          rowBtn(q.aberta ? 'Fechar' : 'Reabrir', async () => { await sb.from('pesquisas').update({ aberta: !q.aberta }).eq('id', q.id); loadPesqs(); }),
          rowBtn('Excluir', async () => { if (!confirm('Excluir a rodada “' + q.titulo + '” e as respostas dela?')) return; await sb.from('pesquisas').delete().eq('id', q.id); loadPesqs(); }, true)));
    }) : [el('li', 'clients__empty', 'Nenhuma rodada ainda.')]));
  };
  loadPesqs();

  // ===== resultados: participação nas buscas =====
  $('b-mes').value = U.addRef(U.ref(), -1);
  const DISP = [['google', 'Perfil completo no Google (horário, fotos, serviços, link)'], ['mapas', 'Aparece nos mapas e marketplaces do setor'],
    ['resposta', 'Responde contatos em até 1 hora'], ['pagamento', 'Aceita Pix e cartão, com orçamento rápido'],
    ['site', 'Site ou página com contato em um clique'], ['onde_procura', 'Está onde o cliente procura (indicação, redes, feiras, lojas)']];
  $('disp-itens').replaceChildren(...DISP.map(([k, t]) => el('label', 'chk disp__item', el('input', { type: 'checkbox', id: 'disp-' + k }), t)));
  $('disp-mes').value = U.ref();
  const loadDisp = async () => {
    const { data } = await sb.from('disponibilidade').select('*').eq('empresa_id', id).order('mes_ref', { ascending: false });
    const ult = (data || [])[0];
    DISP.forEach(([k]) => { $('disp-' + k).checked = !!(ult && ult.itens[k]); });
    $('disps').replaceChildren(...(data || []).map((d) => el('li', 'row', el('div', 'row__main', el('p', 'row__title', MESES(d.mes_ref) + ': ' + d.nota + '/100'),
      el('p', 'row__text', DISP.filter(([k]) => !d.itens[k]).map(([, t]) => t.split(' (')[0]).join(' · ') || 'Todos os itens ok')),
      el('div', 'row__actions', rowBtn('Excluir', async () => { await sb.from('disponibilidade').delete().eq('empresa_id', id).eq('mes_ref', d.mes_ref); loadDisp(); }, true)))));
  };
  $('disp-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const itens = Object.fromEntries(DISP.map(([k]) => [k, $('disp-' + k).checked]));
    const nota = Math.round((Object.values(itens).filter(Boolean).length / DISP.length) * 100);
    const r = await sb.from('disponibilidade').upsert({ empresa_id: id, mes_ref: $('disp-mes').value || U.ref(), itens, nota });
    say($('disp-msg'), r.error ? 'Não foi possível salvar.' : 'Salvo: ' + nota + '/100.', r.error ? 'error' : 'ok');
    loadDisp();
  });
  loadDisp();

  const loadBuscas = async () => {
    // a comparação já montada no Google Trends: a marca e até 4 concorrentes do Diagnóstico, Brasil, últimos 12 meses
    sb.from('impressoes').select('marca_nome, eh_cliente').eq('empresa_id', id).order('ordem').then(({ data: imp }) => {
      const termos = [emp.nome].concat((imp || []).filter((x) => !x.eh_cliente).map((x) => x.marca_nome)).filter(Boolean).slice(0, 5);
      $('b-trends').href = 'https://trends.google.com/trends/explore?geo=BR&date=today%2012-m&q=' + termos.map((t) => encodeURIComponent(t)).join(',');
    });
    const { data } = await sb.from('buscas').select('*').eq('empresa_id', id).order('mes_ref', { ascending: false });
    const bs = [...(data || [])].reverse();
    const bg = $('busca-graf');
    if (bg) bg.replaceChildren(...(bs.length >= 2 ? [GR.linhas({ rotulos: bs.map((b) => U.cap(U.nomeMesCurto(b.mes_ref))), fmt: fmtP,
      label: 'Participação da marca nas buscas por mês: ' + bs.map((b) => U.nomeMesCurto(b.mes_ref) + ' ' + b.marca_pct + '%').join(', '),
      series: [{ nome: 'da marca', cor: '#f3f3f3', valores: bs.map((b) => Number(b.marca_pct)), pontos: true, rotuloFim: true }] })] : []));
    $('buscas').replaceChildren(...((data || []).length ? data.map((b) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__title', MESES(b.mes_ref) + ': ' + Number(b.marca_pct).toLocaleString('pt-BR') + '%')),
      el('div', 'row__actions', rowBtn('Excluir', async () => { await sb.from('buscas').delete().eq('empresa_id', id).eq('mes_ref', b.mes_ref); loadBuscas(); }, true)))) : [el('li', 'ed-vazio', 'Nenhum mês anotado ainda.')]));
  };
  $('busca-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const pct = Number($('b-pct').value);
    if (!$('b-mes').value || $('b-pct').value === '' || pct < 0 || pct > 100) return say($('b-msg'), 'Escolha o mês e um valor de 0 a 100.', 'error');
    const r = await sb.from('buscas').upsert({ empresa_id: id, mes_ref: $('b-mes').value, marca_pct: pct }, { onConflict: 'empresa_id,mes_ref' });
    say($('b-msg'), r.error ? 'Não foi possível salvar.' : 'Salvo.', r.error ? 'error' : 'ok');
    if (!r.error) { $('b-pct').value = ''; loadBuscas(); }
  });
  loadBuscas();

  // ===== resultados: o que os clientes disseram =====
  const loadVozes = async () => {
    const { data } = await sb.from('vozes').select('*').eq('empresa_id', id).order('criada_em', { ascending: false });
    $('vozes-adm').replaceChildren(...((data || []).length ? data.map((v) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__eyebrow', MESES(v.mes_ref)), el('p', 'row__title', v.texto)),
      el('div', 'row__actions', rowBtn('Excluir', async () => { await sb.from('vozes').delete().eq('id', v.id); loadVozes(); }, true)))) : [el('li', 'ed-vazio', 'Nada registrado ainda. As frases aparecem aqui quando o cliente escrever no portal.')]));
  };
  loadVozes();

  // ===== encontros =====
  const TIPO_E = { mensal: 'Revisão mensal', semestral: 'Revisão semestral', anual: 'Revisão anual', entrega: 'Entrega do plano' };
  const SIT_E = { agendado: 'Agendado', realizado: 'Realizado', remarcar_solicitado: 'Remarcação pedida' };
  const linhas = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean);
  const encForm = $('enc-form');
  const abreEnc = (e) => {
    toggle(encForm, $('open-enc'), true);
    $('enc-form-t').textContent = e ? 'Editar encontro' : 'Agendar encontro';
    const d = e ? new Date(e.inicio) : null;
    $('e-id').value = e ? e.id : ''; $('e-tipo').value = e ? e.tipo : 'mensal';
    $('e-data').value = d ? d.toLocaleDateString('sv-SE') : '';
    $('e-hora').value = d ? d.toTimeString().slice(0, 5) : '10:00';
    if (e && ![...$('e-dur').options].some((o) => o.value === String(e.duracao_min))) $('e-dur').append(el('option', { value: e.duracao_min }, e.duracao_min + ' min'));
    $('e-dur').value = e ? String(e.duracao_min) : '30'; $('e-local').value = e ? e.local_ou_link || '' : '';
    // quem pediu para remarcar: ao mudar a data, volta para "agendado"
    $('e-status').value = e ? (e.status === 'remarcar_solicitado' ? 'agendado' : e.status) : 'agendado';
    $('e-pauta').replaceWith(U.multi('e-pauta', P.pauta, e ? e.pauta || [] : [])); $('e-dec').value = e ? (e.decisoes || []).join('\n') : '';
    say($('e-msg'), ''); encForm.scrollIntoView({ block: 'start', behavior: 'smooth' }); $('e-data').focus({ preventScroll: true });
  };
  $('open-enc').addEventListener('click', () => (encForm.hidden ? abreEnc(null) : toggle(encForm, $('open-enc'), false)));
  $('e-cancel').addEventListener('click', () => toggle(encForm, $('open-enc'), false));
  encForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!$('e-data').value || !$('e-hora').value) return say($('e-msg'), 'Escolha data e hora.', 'error');
    const row = {
      empresa_id: id, tipo: $('e-tipo').value, inicio: new Date($('e-data').value + 'T' + $('e-hora').value).toISOString(),
      duracao_min: Number($('e-dur').value) || 30, local_ou_link: val('e-local'), status: $('e-status').value,
      pauta: U.multiValue('e-pauta'), decisoes: linhas($('e-dec').value),
    };
    if (row.status !== 'remarcar_solicitado') row.remarcar_motivo = null;
    const eid = $('e-id').value;
    const r = eid ? await sb.from('encontros').update(row).eq('id', eid) : await sb.from('encontros').insert(row);
    if (r.error) return say($('e-msg'), 'Não foi possível salvar.', 'error');
    toggle(encForm, $('open-enc'), false); say($('enc-msg'), eid ? 'Encontro atualizado.' : 'Encontro agendado. O cliente já vê em Consultoria.', 'ok');
    loadEncs();
  });
  const loadEncs = async () => {
    const { data } = await sb.from('encontros').select('*').eq('empresa_id', id).order('inicio', { ascending: false });
    const rows = data || [];
    const rem = rows.filter((e) => e.status === 'remarcar_solicitado');
    $('rem-sec').hidden = !rem.length; $('enc-count').hidden = !rem.length; $('enc-count').textContent = rem.length;
    $('rems').replaceChildren(...rem.map((e) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__title', TIPO_E[e.tipo] + ' · ' + U.quando(e.inicio)), el('p', 'row__text', e.remarcar_motivo ? '“' + e.remarcar_motivo + '”' : 'Sem sugestão de horário.')),
      el('div', 'row__actions', rowBtn('Escolher nova data', () => abreEnc(e))))));
    $('encs').replaceChildren(...(rows.length ? rows.map((e) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__eyebrow', TIPO_E[e.tipo] + ' · ' + e.duracao_min + ' min · ' + SIT_E[e.status]), el('p', 'row__title', U.quando(e.inicio)),
        el('p', 'row__text', (e.decisoes || []).length ? 'Decisões: ' + e.decisoes.join('; ') : ((e.pauta || []).length ? 'Pauta: ' + e.pauta.join('; ') : 'Sem pauta'))),
      el('div', 'row__actions', rowBtn('Editar', () => abreEnc(e)),
        rowBtn('Excluir', async () => { if (!confirm('Excluir o encontro de ' + U.quando(e.inicio) + '?')) return; await sb.from('encontros').delete().eq('id', e.id); loadEncs(); }, true)))) : [el('li', 'vz-li', vazioC('lista', 'Nenhum encontro ainda', 'Agende o primeiro no botão acima: o cliente vê a data, a pauta e pode adicionar à agenda.'))]));
  };
  loadEncs();

  // ===== peças (pedidos de revisão) =====
  const PED = { em_analise: ['is-mid', 'Em análise'], ajustar: ['is-warn', 'Ajustar'], aprovado: ['is-ok', 'Aprovado'] };
  const abreArquivo = async (caminho) => {
    const { data, error } = await sb.storage.from('portal').createSignedUrl(caminho, 600);
    if (error || !data) return alert('Não foi possível abrir o arquivo.');
    window.open(data.signedUrl, '_blank', 'noopener');
  };
  const p0 = p; // o plano (prazo de revisão em dias úteis)
  const loadPeds = async () => {
    const { data } = await sb.from('pedidos_revisao').select('*').eq('empresa_id', id).order('enviado_em', { ascending: false });
    const rows = data || [];
    const n = rows.filter((p) => p.status === 'em_analise').length;
    $('pec-count').hidden = !n; $('pec-count').textContent = n;
    $('peds').replaceChildren(...(rows.length ? rows.map((p) => {
      const sel = el('select', { class: 'field field--sm', 'aria-label': 'Situação da peça' },
        el('option', { value: 'em_analise', selected: p.status === 'em_analise' }, 'Em análise'),
        el('option', { value: 'ajustar', selected: p.status === 'ajustar' }, 'Ajustar'),
        el('option', { value: 'aprovado', selected: p.status === 'aprovado' }, 'Aprovado'));
      const resp = el('textarea', { class: 'field', rows: 3, maxlength: 2000, placeholder: 'Sua resposta para o cliente', 'aria-label': 'Resposta' });
      const prontas = el('select', { class: 'field field--sm', 'aria-label': 'Respostas prontas' }, el('option', { value: '' }, '+ Resposta pronta…'),
        (P.respostasPeca || []).map((x) => el('option', { value: x.texto }, x.texto)));
      prontas.addEventListener('change', () => {
        if (!prontas.value) return;
        resp.value = (resp.value.trim() ? resp.value.trim() + ' ' : '') + prontas.value;
        if (/^Aprovado/.test(prontas.value)) sel.value = 'aprovado';
        prontas.value = '';
      });
      // o checklist da plataforma: o cliente vê o que passou e o que precisa ajustar
      const CHK = [['cliente', 'Cliente certo'], ['mensagem', 'Mensagem central'], ['tom', 'Tom de voz'], ['identidade', 'Ativos distintivos']];
      const chks = CHK.map(([k, t]) => { const i = el('input', { type: 'checkbox' }); i.checked = !p.checklist || !!p.checklist[k]; return [k, el('label', 'chk', i, t), i]; });
      const ex = el('input', { type: 'checkbox' }); ex.checked = !!p.exemplo;
      const exLabel = el('label', 'chk', ex, 'Usar como exemplo na Plataforma de marca (só aprovadas)');
      resp.value = p.resposta || '';
      const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
      const salvar = el('button', { class: 'btn btn--light btn--sm', type: 'button' }, 'Responder');
      salvar.addEventListener('click', async () => {
        if (sel.value === 'em_analise') return say(msg, 'Escolha “Ajustar” ou “Aprovado”.', 'error');
        salvar.disabled = true;
        const checklist = Object.fromEntries(chks.map(([k, , i]) => [k, i.checked]));
        const r = await sb.from('pedidos_revisao').update({ status: sel.value, resposta: resp.value.trim() || null, respondido_em: new Date().toISOString(), visto_pelo_cliente: false,
          checklist, exemplo: sel.value === 'aprovado' && ex.checked }).eq('id', p.id);
        salvar.disabled = false;
        if (r.error) return say(msg, 'Não foi possível salvar.', 'error');
        loadPeds();
      });
      const [cls, txt] = PED[p.status] || ['', p.status];
      const uteis = (() => { let k = 0; const d = new Date(p.enviado_em); const fim = new Date(); while (d < fim) { d.setDate(d.getDate() + 1); if (d <= fim && d.getDay() % 6 !== 0) k += 1; } return k; })();
      const prazo = (p0 && p0.prazo_revisao_dias) || 2;
      const atrasada = p.status === 'em_analise' && uteis > prazo;
      return el('li', 'ped' + (atrasada ? ' is-atrasada' : ''),
        el('div', 'ped__main',
          el('p', 'row__eyebrow', p.tipo_peca + ' · enviado em ' + U.diaAno(p.enviado_em)),
          el('p', 'row__title', p.titulo || p.tipo_peca),
          p.pergunta ? el('p', 'row__text', '“' + p.pergunta + '”') : null,
          el('div', 'ped__row',
            el('span', 'badge ' + cls, txt),
            atrasada ? el('span', 'badge is-hot', 'Fora do prazo: ' + uteis + ' dias úteis (prazo ' + prazo + ')') : p.status === 'em_analise' ? el('span', 'row__text', 'Prazo: ' + prazo + (prazo === 1 ? ' dia útil' : ' dias úteis') + ' · ' + uteis + ' passado' + (uteis === 1 ? '' : 's')) : null,
            p.arquivo ? el('button', { class: 'link', type: 'button', onclick: () => abreArquivo(p.arquivo) }, 'Abrir arquivo') : null,
            p.link ? el('a', { class: 'link', href: p.link, target: '_blank', rel: 'noopener' }, 'Abrir link') : null,
            p.respondido_em ? el('span', 'row__text', 'Respondido em ' + U.dia(p.respondido_em) + (p.visto_pelo_cliente ? ' · visto' : '')) : null)),
        el('div', 'ped__answer', el('div', 'ped__checks', el('p', 'row__eyebrow', 'A peça…'), chks.map(([, l]) => l)), prontas, resp, exLabel, el('div', 'ped__row', sel, salvar, msg)));
    }) : [el('li', 'vz-li', vazioC('lista', 'Nenhuma peça para revisar', 'Quando o cliente mandar um post, uma proposta ou um anúncio para revisão, ele aparece aqui.'))]));
  };
  loadPeds();

  // ===== uso do portal (últimos 30 dias): o que o cliente abre de fato =====
  const TELAS_PORTAL = [['plano', 'Plano (tela inicial)'], ['acoes', 'Ações'], ['resultados', 'Resultados'], ['consultoria', 'Encontros e prazos'],
    ['relatorio', 'Relatório do mês'], ['diagnostico', 'Diagnóstico'], ['estrategia', 'Estratégia'], ['plataforma', 'Narrativa'], ['identidade', 'Identidade visual'], ['inicio', 'Início (só acesso)']];
  const tempo = (s) => (s < 60 ? s + ' s' : s < 3600 ? Math.round(s / 60) + ' min' : (s / 3600).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' h');
  const loadUso = async () => {
    const desde = U.addDias(new Date().toISOString().slice(0, 10), -30);
    const { data, error } = await sb.from('uso_telas').select('tela, dia, vezes, segundos, usuario_id').eq('empresa_id', id).gte('dia', desde);
    if (error) { $('uso').hidden = true; return; } // a tabela ainda não existe no banco (rode o portal.sql)
    const rows = (data || []).map((r) => ({ ...r, tela: r.tela === 'calendario' ? 'consultoria' : r.tela }));
    const dias = new Set(rows.map((r) => r.dia)); const ult = rows.map((r) => r.dia).sort().pop();
    $('uso-resumo').textContent = rows.length
      ? dias.size + (dias.size === 1 ? ' dia' : ' dias') + ' com acesso nos últimos 30 · último em ' + U.dia(ult) + '. Telas com zero visitas são candidatas a simplificar.'
      : 'Nenhum acesso registrado nos últimos 30 dias. O registro começa a contar a partir de agora.';
    const por = (t) => { const x = rows.filter((r) => r.tela === t); return { dias: new Set(x.map((r) => r.dia)).size, vezes: x.reduce((a, r) => a + r.vezes, 0), seg: x.reduce((a, r) => a + r.segundos, 0) }; };
    const linhas = TELAS_PORTAL.filter(([t]) => t !== 'inicio' || rows.some((r) => r.tela === 'inicio')).map(([t, nome]) => ({ nome, ...por(t) }))
      .sort((a, b) => b.vezes - a.vezes || b.seg - a.seg);
    $('uso-tab').replaceChildren(...tabela(['Tela', 'Dias', 'Visitas', 'Tempo'], linhas.map((l) => [
      l.vezes ? l.nome : el('span', 'uso__zero', l.nome), l.dias || '—', l.vezes || '—', l.seg ? tempo(l.seg) : '—'])));
  };
  loadUso();

  // ===== acessos =====
  const loadAcc = async () => {
    const { data, error } = await sb.from('profiles').select('id, name, email, active, empresa_id').eq('role', 'client');
    if (error) return say($('acc-msg'), 'Não foi possível carregar os acessos.', 'error');
    const mine = data.filter((c) => c.empresa_id === id);
    const loose = data.filter((c) => !c.empresa_id);

    const list = $('accs');
    list.replaceChildren();
    if (!mine.length) list.append(el('li', 'clients__empty', 'Ninguém acessa ainda. Crie o primeiro em “Novo acesso”.'));
    mine.forEach((c) => {
      const btn = (label, fn, danger) => {
        const b = el('button', { class: 'btn btn--ghost btn--sm' + (danger ? ' btn--danger' : ''), type: 'button' }, label);
        b.addEventListener('click', async () => {
          b.disabled = true;
          try { await fn(); } catch (err) { say($('acc-msg'), err.message, 'error'); }
          b.disabled = false;
        });
        return b;
      };
      list.append(el('li', 'client',
        el('div', null, el('div', 'client__name', c.name || '(sem nome)'), el('div', 'client__mail', c.email)),
        el('div'),
        el('span', 'badge' + (c.active ? '' : ' is-off'), c.active ? 'Ativo' : 'Desativado'),
        el('div', 'client__actions',
          btn('Nova senha', async () => {
            const password = prompt('Nova senha para ' + c.email + ' (mínimo 8 caracteres):', randomPass());
            if (!password) return;
            await adminApi({ action: 'set_password', id: c.id, password });
            say($('acc-msg'), 'Senha de ' + c.email + ' alterada. Envie a nova senha para o cliente.', 'ok');
          }),
          btn(c.active ? 'Desativar' : 'Ativar', async () => { await adminApi({ action: 'set_active', id: c.id, active: !c.active }); await loadAcc(); }),
          btn('Excluir', async () => {
            if (!confirm('Excluir o acesso de ' + c.email + '? Isso não pode ser desfeito.')) return;
            await adminApi({ action: 'delete', id: c.id });
            await loadAcc();
          }, true),
        ),
      ));
    });

    $('link-form').hidden = !loose.length;
    $('link-sel').replaceChildren(...loose.map((c) => el('option', { value: c.id }, (c.name ? c.name + ' · ' : '') + c.email)));
  };
  await loadAcc();

  $('link-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const r = await sb.from('profiles').update({ empresa_id: id }).eq('id', $('link-sel').value).eq('role', 'client');
    say($('acc-msg'), r.error ? 'Não foi possível vincular.' : 'Acesso vinculado.', r.error ? 'error' : 'ok');
    await loadAcc();
  });

  const card = $('acc-card');
  $('open-acc').addEventListener('click', () => {
    card.hidden = !card.hidden;
    $('open-acc').setAttribute('aria-expanded', String(!card.hidden));
    if (!card.hidden) { if (!$('a-pass').value) $('a-pass').value = randomPass(); $('a-name').focus(); }
  });
  $('a-gen').addEventListener('click', () => { $('a-pass').value = randomPass(); });
  card.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const body = { action: 'create', name: $('a-name').value.trim(), company: emp.nome, email: $('a-email').value.trim(), password: $('a-pass').value, empresa_id: id };
    if (!body.name || !body.email) return say($('a-msg'), 'Preencha nome e e-mail.', 'error');
    if (body.password.length < 8) return say($('a-msg'), 'A senha precisa ter pelo menos 8 caracteres.', 'error');
    const submit = card.querySelector('[type=submit]');
    submit.disabled = true; say($('a-msg'), 'Criando…');
    try {
      await adminApi(body);
      say($('a-msg'), 'Acesso criado. Envie para o cliente: ' + body.email + ' / ' + body.password, 'ok');
      $('a-name').value = ''; $('a-email').value = ''; $('a-pass').value = randomPass();
      await loadAcc();
    } catch (err) { say($('a-msg'), err.message, 'error'); }
    submit.disabled = false;
  });
})();
