/* Painel GANG: lista de clientes (empresas), novo cliente e o perfil do consultor */
(async () => {
  const { sb, guard, signOut, notConfigured, adminApi, randomPass } = window.GangAuth;
  const U = window.GangUI;
  const { $, el, say, mesDoPlano } = U;
  if (!sb) return notConfigured($('app'));
  const me = await guard('admin');
  if (!me) return;

  $('who').textContent = me.name || me.email;
  U.avatar($('me-dot'), me.name || me.email, me.foto_url);

  // menu lateral: no celular vira um bloco no topo, aberto pelo botão "Menu"
  const side = document.querySelector('.side');
  $('menu-btn').addEventListener('click', () => {
    const open = side.classList.toggle('is-open');
    $('menu-btn').setAttribute('aria-expanded', String(open));
  });
  side.addEventListener('click', (e) => { if (e.target.closest('a')) { side.classList.remove('is-open'); $('menu-btn').setAttribute('aria-expanded', 'false'); } });
  $('hello').textContent = 'Olá' + (me.name ? ', ' + me.name.split(' ')[0] : '');
  $('sign-out').addEventListener('click', signOut);

  // ===== clientes =====
  let clientesBusca = [];
  U.buscaFonte(() => clientesBusca.map((e) => ({ grupo: 'Clientes', titulo: e.nome, href: 'admin-cliente.html?id=' + e.id })));
  const load = async () => {
    const [emp, planos, perfis, sug, ped, enc, msg] = await Promise.all([
      sb.from('empresas').select('id, nome, created_at').order('nome'),
      sb.from('planos').select('empresa_id, inicio, duracao_meses, status, tipo'),
      sb.from('profiles').select('id, name, email, active, empresa_id').eq('role', 'client'),
      sb.from('sugestoes').select('empresa_id, texto, criada_em, tipo').eq('status', 'nova'),
      sb.from('pedidos_revisao').select('empresa_id, titulo, tipo_peca, enviado_em').eq('status', 'em_analise'),
      sb.from('encontros').select('empresa_id, inicio, remarcar_motivo').eq('status', 'remarcar_solicitado'),
      sb.from('mensagens').select('empresa_id, texto, criada_em').eq('de', 'cliente').eq('lida', false).order('criada_em', { ascending: false }),
    ]);
    const erro = [emp, planos, perfis, sug, ped, enc, msg].find((r) => r.error);
    if (erro) return say($('list-msg'), 'Não foi possível carregar os clientes. Rodou o supabase/portal.sql?', 'error');
    say($('list-msg'), '');

    const plano = Object.fromEntries(planos.data.map((p) => [p.empresa_id, p]));
    const pend = {};
    // urgente: peças no prazo de revisão, pedidos de remarcar e mensagens; ideias e dúvidas esperam o encontro
    [ped, enc, msg].forEach((r) => r.data.forEach((x) => { pend[x.empresa_id] = (pend[x.empresa_id] || 0) + 1; }));

    // tudo o que está esperando o consultor, numa lista só, cada item com o atalho para resolver
    const nome = Object.fromEntries(emp.data.map((e) => [e.id, e.nome]));
    clientesBusca = emp.data;
    const corta = (t) => (t && t.length > 160 ? t.slice(0, 160) + '…' : t || '');
    const itens = [
      ...msg.data.map((m) => ({ eid: m.empresa_id, tipo: 'Mensagem', quando: m.criada_em, texto: corta(m.texto), aba: 'mensagens', botao: 'Responder' })),
      ...ped.data.map((x) => ({ eid: x.empresa_id, tipo: 'Peça para revisar', quando: x.enviado_em, texto: x.titulo || x.tipo_peca, aba: 'pecas', botao: 'Revisar' })),
      ...enc.data.map((x) => ({ eid: x.empresa_id, tipo: 'Pedido para remarcar encontro', quando: x.inicio, texto: (x.remarcar_motivo ? '“' + corta(x.remarcar_motivo) + '” · ' : '') + 'encontro de ' + U.quando(x.inicio), aba: 'encontros', botao: 'Remarcar' })),
    ].sort((a, b) => (a.quando < b.quando ? 1 : -1));
    $('msgs-sec').hidden = !itens.length;
    // para o próximo encontro: dúvidas e ideias do cliente, agrupadas por cliente (não pedem resposta agora)
    const porCli = {};
    sug.data.forEach((x) => { const c = porCli[x.empresa_id] || (porCli[x.empresa_id] = { duvida: 0, ideia: 0 }); c[x.tipo === 'duvida' ? 'duvida' : 'ideia'] += 1; });
    const enc2 = Object.entries(porCli);
    $('encontro-sec').hidden = !enc2.length;
    $('encontro-lista').replaceChildren(...enc2.map(([eid, c]) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__title', nome[eid] || 'Cliente'),
        el('p', 'row__text', [c.duvida ? c.duvida + (c.duvida === 1 ? ' dúvida' : ' dúvidas') : null, c.ideia ? c.ideia + (c.ideia === 1 ? ' ideia' : ' ideias') : null].filter(Boolean).join(' · ') + ' para a pauta')),
      el('div', 'row__actions', el('a', { class: 'btn btn--ghost btn--sm', href: 'admin-cliente.html?id=' + eid + '#encontros' }, 'Ver na pauta')))));
    $('msgs').replaceChildren(...itens.map((x) => el('li', 'row',
      el('div', 'row__main', el('p', 'row__eyebrow', (nome[x.eid] || 'Cliente') + ' · ' + x.tipo + ' · ' + U.dia(x.quando)), el('p', 'row__title', x.texto)),
      el('div', 'row__actions', el('a', { class: 'btn btn--light btn--sm', href: 'admin-cliente.html?id=' + x.eid + '#' + x.aba }, x.botao)))));

    $('n-total').textContent = emp.data.length;
    $('n-active').textContent = planos.data.filter((p) => p.status === 'ativo').length;
    const totalPend = Object.values(pend).reduce((a, b) => a + b, 0);
    $('n-pend').textContent = totalPend;
    $('tile-pend').hidden = !totalPend;
    $('side-pend').hidden = !totalPend; $('side-pend').textContent = totalPend;

    // clientes no menu lateral: pedidos esperando em destaque, senão o mês do plano
    // logo do cliente num quadradinho (as iniciais quando não há logo)
    const logo = (e, cls) => { const n = el('span', 'cli-logo' + (cls ? ' ' + cls : '')); n.setAttribute('aria-hidden', 'true'); U.avatar(n, e.nome, e.logo_url); return n; };
    $('side-clients').replaceChildren(...(emp.data.length ? emp.data.map((e) => {
      const p = plano[e.id];
      const ind = pend[e.id] ? el('span', 'side__ind is-hot', String(pend[e.id])) : el('span', 'side__ind', '');
      return el('li', null, el('a', { class: 'side__link side__link--cli', href: 'admin-cliente.html?id=' + e.id }, logo(e, 'cli-logo--sm'), el('span', 'side__client', e.nome), ind));
    }) : [el('li', 'side__empty', 'Nenhum cliente ainda.')]));

    const list = $('clients');
    list.replaceChildren();
    if (!emp.data.length) list.append(el('li', 'clients__empty', 'Nenhum cliente ainda. Crie o primeiro em “Novo cliente”.'));
    emp.data.forEach((e) => {
      const p = plano[e.id];
      const acessos = perfis.data.filter((x) => x.empresa_id === e.id);
      const status = !p ? 'Sem plano' : p.status !== 'ativo' ? (p.status === 'pausado' ? 'Pausado' : 'Encerrado') : p.tipo === 'acesso' ? 'Só acesso à marca' : 'Mês ' + mesDoPlano(p) + ' de ' + p.duracao_meses;
      list.append(el('li', 'client client--link',
        el('a', { class: 'client__name client__name--logo', href: 'admin-cliente.html?id=' + e.id }, logo(e), el('span', null, e.nome)),
        el('div', 'client__company', status),
        el('div', 'client__mail', acessos.length ? acessos.length + (acessos.length > 1 ? ' acessos' : ' acesso') : 'Sem acesso'),
        pend[e.id] ? el('span', 'badge is-warn', pend[e.id] + (pend[e.id] > 1 ? ' pedidos' : ' pedido')) : el('span'),
      ));
    });

    // sinais de risco de cada cliente: quem precisa de atenção primeiro
    const saude = window.GangSaude && await window.GangSaude.carregar(sb);
    if (saude) {
      const G = window.GangSaude;
      const lista = emp.data.map((e) => ({ e, s: saude[e.id] ? G.sinais(saude[e.id]) : [] })).filter((x) => x.s.length)
        .sort((x, y) => G.gravidade(y.s) - G.gravidade(x.s));
      $('risco-sec').hidden = !lista.length;
      $('risco').replaceChildren(...lista.map(({ e, s: sn }) => el('li', 'risk__item' + (sn.some((x) => x.nivel === 'alto') ? ' is-alto' : ''),
        el('a', { class: 'risk__name client__name--logo', href: 'admin-cliente.html?id=' + e.id + '#fechamento' }, logo(e), el('span', null, e.nome)),
        el('ul', 'risk__sinais', sn.map((x) => el('li', null, el('a', { class: 'risk__sinal is-' + x.nivel, href: 'admin-cliente.html?id=' + e.id + '#' + x.aba }, x.texto)))))));
      // a lista de clientes mostra quantos sinais cada um tem
      list.querySelectorAll('.client--link').forEach((li) => {
        const a2 = li.querySelector('.client__name'); const eid = new URL(a2.href).searchParams.get('id');
        const sn = saude[eid] ? G.sinais(saude[eid]) : [];
        const alto = sn.filter((x) => x.nivel === 'alto').length;
        const slot = li.lastElementChild;
        if (sn.length) slot.replaceWith(el('a', { class: 'badge ' + (alto ? 'is-hot' : 'is-warn'), href: 'admin-cliente.html?id=' + eid + '#fechamento' }, sn.length + (sn.length === 1 ? ' sinal' : ' sinais')));
        else if (!pend[eid]) slot.replaceWith(el('span', 'badge is-ok', 'Em dia'));
      });
    }

    const loose = perfis.data.filter((x) => !x.empresa_id);
    $('loose-sec').hidden = !loose.length;
    $('loose').replaceChildren(...loose.map((c) => el('li', 'client',
      el('div', null, el('div', 'client__name', c.name || '(sem nome)'), el('div', 'client__mail', c.email)),
      el('div'), el('span', 'badge' + (c.active ? '' : ' is-off'), c.active ? 'Ativo' : 'Desativado'), el('div'),
    )));
  };
  await load();

  // ===== novo cliente =====
  const card = $('new-card');
  const primeiroDoMes = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-01'; };
  $('nc-gen').addEventListener('click', () => { $('nc-pass').value = randomPass(); });

  // ===== telas separadas pelo menu: visão geral, novo cliente, seu perfil =====
  const ROTULO = { geral: 'Visão geral', novo: 'Novo cliente', perfil: 'Seu perfil' };
  const mostraTela = (foco) => {
    let v = location.hash.slice(1); if (!ROTULO[v]) v = 'geral';
    document.querySelectorAll('[data-view]').forEach((n) => {
      const on = n.dataset.view === v;
      // as seções da visão geral que só aparecem com conteúdo guardam o próprio "hidden"
      if (n.dataset.view === 'geral') n.classList.toggle('is-fora', !on); else n.hidden = !on;
    });
    document.querySelectorAll('[data-view-link]').forEach((a) => { if (a.dataset.viewLink === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $('crumb').textContent = 'Painel / ' + ROTULO[v];
    if (v === 'novo') {
      if (!$('nc-pass').value) $('nc-pass').value = randomPass();
      if (!$('nc-start').value) $('nc-start').value = primeiroDoMes();
    }
    if (foco) { window.scrollTo(0, 0); if (v === 'novo') $('nc-company').focus({ preventScroll: true }); }
  };
  window.addEventListener('hashchange', () => mostraTela(true));
  mostraTela(false);

  const num = (id) => ($(id).hasAttribute('data-moeda') ? U.moedaValor($(id)) : $(id).value === '' ? null : Number($(id).value));

  card.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const empresa = $('nc-company').value.trim();
    const conta = { action: 'create', name: $('nc-name').value.trim(), company: empresa, email: $('nc-email').value.trim(), password: $('nc-pass').value };
    if (!empresa || !conta.name || !conta.email) return say($('nc-msg'), 'Preencha empresa, nome e e-mail.', 'error');
    if (conta.password.length < 8) return say($('nc-msg'), 'A senha precisa ter pelo menos 8 caracteres.', 'error');
    if (!$('nc-start').value) return say($('nc-msg'), 'Escolha a data de início do plano.', 'error');

    const submit = card.querySelector('[type=submit]');
    submit.disabled = true; say($('nc-msg'), 'Criando…');
    let empresaId = null;
    try {
      const e = await sb.from('empresas').insert({ nome: empresa }).select('id').single();
      if (e.error) throw new Error('Não foi possível criar a empresa.');
      empresaId = e.data.id;
      const p = await sb.from('planos').insert({
        empresa_id: empresaId, consultor_id: me.id, inicio: $('nc-start').value,
        duracao_meses: num('nc-months') || 18, meta_faturamento_pct: num('nc-goal'), faturamento_base: num('nc-base'), tipo: $('nc-tipo').value,
      });
      if (p.error) throw new Error('Não foi possível criar o plano.');
      await adminApi({ ...conta, empresa_id: empresaId });
      say($('nc-msg'), 'Cliente criado. Envie o acesso: ' + conta.email + ' / ' + conta.password, 'ok');
      card.querySelectorAll('input').forEach((i) => { i.value = ''; });
      $('nc-pass').value = randomPass(); $('nc-start').value = primeiroDoMes();
      await load();
    } catch (err) {
      if (empresaId) await sb.from('empresas').delete().eq('id', empresaId); // sem acesso, desfaz a empresa para não duplicar
      say($('nc-msg'), err.message, 'error');
    }
    submit.disabled = false;
  });

  // ===== perfil do consultor =====
  // a foto vai para o balde público "avatares" (aparece no menu de todos os clientes); sem foto, as iniciais do nome
  let foto = me.foto_url || null;
  const avatar = () => {
    const v = $('me-avatar');
    v.style.backgroundImage = foto ? 'url("' + encodeURI(foto) + '")' : '';
    v.textContent = foto ? '' : U.iniciais($('me-name').value || me.name || me.email);
    $('me-rm-wrap').hidden = !foto;
  };
  $('me-name').value = me.name || '';
  avatar();
  $('me-name').addEventListener('input', avatar);
  $('me-foto').addEventListener('change', () => {
    const f = $('me-foto').files[0];
    if (f) { const v = $('me-avatar'); v.textContent = ''; v.style.backgroundImage = 'url("' + URL.createObjectURL(f) + '")'; }
  });
  $('me-card').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const btn = $('me-card').querySelector('[type=submit]'); btn.disabled = true; say($('me-msg'), 'Salvando…');
    try {
      const file = $('me-foto').files[0];
      let novaFoto = foto;
      if (file) {
        if (!/^image\//.test(file.type)) throw new Error('Envie uma imagem (JPG ou PNG).');
        if (file.size > 5 * 1024 * 1024) throw new Error('A foto passa de 5 MB.');
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
        const caminho = me.id + '/' + crypto.randomUUID() + '.' + ext;
        const up = await sb.storage.from('avatares').upload(caminho, file, { contentType: file.type });
        if (up.error) throw new Error('Não foi possível enviar a foto.');
        novaFoto = sb.storage.from('avatares').getPublicUrl(caminho).data.publicUrl;
      } else if ($('me-rm').checked) novaFoto = null;
      const r = await sb.from('profiles').update({ name: $('me-name').value.trim() || null, foto_url: novaFoto, iniciais: null }).eq('id', me.id);
      if (r.error) throw new Error('Não foi possível salvar.');
      foto = novaFoto; $('me-foto').value = ''; $('me-rm').checked = false; avatar();
      $('who').textContent = $('me-name').value.trim() || me.email;
      U.avatar($('me-dot'), $('me-name').value.trim() || me.email, foto);
      say($('me-msg'), 'Perfil salvo. Seus clientes já veem a mudança.', 'ok');
    } catch (err) { say($('me-msg'), err.message, 'error'); }
    btn.disabled = false;
  });
})();
