/* Painel GANG: abas da marca de um cliente — Diagnóstico, Estratégia, Plataforma e Identidade.
   Dois editores genéricos: "ficha" (um registro por empresa) e "lista" (vários itens, com ordem). Arquivos vão para o
   armazenamento privado em <empresa>/<pasta>/..., e o banco guarda só o caminho. */
window.addEventListener('gang:cliente', ({ detail: { sb, id, me } }) => {
  const U = window.GangUI;
  const { $, el, say } = U;

  const safeName = (n) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w.-]+/g, '-').slice(-80);
  const sobe = async (file, pasta) => {
    if (file.size > 50 * 1024 * 1024) throw new Error('Arquivo acima de 50 MB.');
    const caminho = id + '/' + pasta + '/' + crypto.randomUUID() + '-' + safeName(file.name);
    const r = await sb.storage.from('portal').upload(caminho, file, { contentType: file.type || 'application/octet-stream' });
    if (r.error) throw new Error('Não foi possível enviar ' + file.name + '.');
    return caminho;
  };
  const sobePublico = async (file) => {
    if (!/^image\//.test(file.type)) throw new Error('Envie uma imagem.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Imagem acima de 5 MB.');
    const caminho = id + '/' + crypto.randomUUID() + '-' + safeName(file.name);
    const r = await sb.storage.from('publico').upload(caminho, file, { contentType: file.type });
    if (r.error) throw new Error('Não foi possível enviar a imagem.');
    return sb.storage.from('publico').getPublicUrl(caminho).data.publicUrl;
  };
  const abre = async (caminho) => {
    const { data, error } = await sb.storage.from('portal').createSignedUrl(caminho, 600);
    if (error || !data) return alert('Não foi possível abrir o arquivo.');
    window.open(data.signedUrl, '_blank', 'noopener');
  };
  const nomeArquivo = (c) => (c || '').split('/').pop().replace(/^[0-9a-f-]{36}-/, '');

  // ----- campos -----
  // f: { k, label, type: text|textarea|date|select|bool|file|formats|color, options: [[v, t]], full, placeholder, folder, accept }
  // usados: o que já foi adicionado nesta lista (no campo principal), para não aparecer de novo no menu
  const campo = (f, valor, pre, usados) => {
    const idc = pre + f.k;
    let input;
    if (f.type === 'preset') {
      // lista de respostas prontas com "Outro…"; escolher pode preencher outros campos (f.fill)
      const todas = (window.GangPresets || {})[f.presets] || [];
      const ja = new Set(usados || []);
      input = U.combo(idc, ja.size ? todas.filter((i) => !ja.has(i.texto) || i.texto === valor) : todas, valor, {
        semGrupos: true, // a fonte de cada resposta pronta fica só por trás
        onPick: (item) => Object.entries(f.fill || {}).forEach(([de, para]) => {
          if (item[de] == null) return;
          const alvo = $(pre + para);
          if (!alvo) return;
          if (alvo.parentElement && alvo.parentElement.comboSet) alvo.parentElement.comboSet(item[de]); else alvo.value = item[de];
        }),
      });
    } else if (f.type === 'textarea') { input = el('textarea', { class: 'field', id: idc, rows: f.rows || 3, placeholder: f.placeholder }); input.value = valor || ''; }
    else if (f.type === 'select' || f.type === 'bool') {
      const opts = f.type === 'bool' ? [['true', 'Sim'], ['false', 'Não']] : f.options;
      input = el('select', { class: 'field', id: idc }, opts.map(([v, t]) => el('option', { value: v }, t)));
      input.value = valor == null ? (f.def != null ? String(f.def) : opts[0][0]) : String(valor);
    } else if (f.type === 'file' || f.type === 'filepub') {
      input = el('div', 'filefield',
        el('input', { class: 'field field--file', id: idc, type: 'file', accept: f.accept }),
        valor ? el('p', 'row__text', 'Atual: ', f.type === 'filepub' ? el('a', { class: 'link', href: valor, target: '_blank', rel: 'noopener' }, nomeArquivo(valor)) : el('button', { class: 'link', type: 'button', onclick: () => abre(valor) }, nomeArquivo(valor)),
          ' · ', el('label', null, el('input', { type: 'checkbox', id: idc + '-rm' }), ' remover')) : null);
    } else if (f.type === 'formats') {
      // arquivos de download: SVG, PNG, PDF/outro e um link
      const atual = valor || [];
      const um = (fmt) => atual.find((x) => x.formato === fmt && x.caminho);
      const link = atual.find((x) => x.link);
      input = el('div', 'formats',
        ['SVG', 'PNG', 'PDF', 'DOCX', 'ZIP'].map((fmt) => el('div', 'formats__item',
          el('label', { class: 'label', for: idc + '-' + fmt }, fmt + (um(fmt) ? ' · atual: ' + nomeArquivo(um(fmt).caminho) : '')),
          el('input', { class: 'field field--file', id: idc + '-' + fmt, type: 'file' }))),
        el('div', 'formats__item formats__item--link',
          el('label', { class: 'label', for: idc + '-link' }, 'Link (Canva, Google Docs…)'),
          el('div', 'new-client__pass',
            el('input', { class: 'field', id: idc + '-linkname', placeholder: 'Rótulo: Canva', value: link ? link.formato : null, 'aria-label': 'Rótulo do link' }),
            el('input', { class: 'field', id: idc + '-link', type: 'url', placeholder: 'https://…', value: link ? link.link : null }))));
      input.dataset.atual = JSON.stringify(atual);
    } else {
      input = el('input', { class: 'field', id: idc, type: f.type === 'date' ? 'date' : 'text', placeholder: f.placeholder, maxlength: f.max || 400 });
      input.value = valor || '';
    }
    const wrap = el('div', f.full || ['textarea', 'formats', 'file', 'filepub'].includes(f.type) ? 'full' : null,
      f.type === 'formats' ? el('p', 'label', f.label) : el('label', { class: 'label', for: idc }, f.label), input);
    return wrap;
  };

  const ler = async (fields, pre, pasta, antigo) => {
    const row = {};
    for (const f of fields) {
      const idc = pre + f.k;
      if (f.type === 'file' || f.type === 'filepub') {
        const file = $(idc).files[0];
        const rm = $(idc + '-rm');
        if (file && f.type === 'filepub') row[f.k] = await sobePublico(file);
        else if (file) row[f.k] = await sobe(file, pasta);
        else if (rm && rm.checked) row[f.k] = null;
        else row[f.k] = antigo ? antigo[f.k] ?? null : null;
      } else if (f.type === 'formats') {
        const atual = JSON.parse($(idc + '-SVG').closest('.formats').dataset.atual || '[]');
        const out = [];
        for (const fmt of ['SVG', 'PNG', 'PDF', 'DOCX', 'ZIP']) {
          const file = $(idc + '-' + fmt).files[0];
          if (file) out.push({ formato: fmt, caminho: await sobe(file, pasta) });
          else { const old = atual.find((x) => x.formato === fmt && x.caminho); if (old) out.push(old); }
        }
        const link = $(idc + '-link').value.trim();
        if (link) {
          if (!/^https?:\/\//i.test(link)) throw new Error('O link precisa começar com http:// ou https://');
          out.push({ formato: $(idc + '-linkname').value.trim() || 'Abrir', link });
        }
        row[f.k] = out;
      } else if (f.type === 'preset') row[f.k] = U.comboValue(idc);
      else if (f.type === 'bool') row[f.k] = $(idc).value === 'true';
      else {
        const v = $(idc).value.trim();
        if (f.type === 'color' && v && !/^#[0-9a-f]{6}$/i.test(v)) throw new Error('A cor precisa estar no formato #RRGGBB.');
        row[f.k] = v === '' ? null : v;
      }
      if (f.req && (row[f.k] == null || row[f.k] === '')) throw new Error('Preencha “' + f.label + '”.');
    }
    return row;
  };

  // ----- ficha: um registro por empresa (diagnosticos, plataformas, identidades, planos) -----
  const ficha = async (mount, cfg) => {
    const { titulo, nota, tabela, fields, pasta } = cfg;
    const pre = 'fi-' + tabela + '-';
    const { data } = await sb.from(tabela).select('*').eq('empresa_id', id).maybeSingle();
    let atual = data;
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const form = el('form', { class: 'card', novalidate: true },
      el('h3', 'title-sm', titulo), nota ? el('p', 'small', nota) : null,
      el('div', 'new-client', fields.map((f) => campo(f, atual ? atual[f.k] : null, pre))),
      el('div', 'new-client__foot', el('button', { class: 'btn btn--light', type: 'submit' }, 'Salvar'), msg));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector('[type=submit]'); btn.disabled = true; say(msg, 'Salvando…');
      try {
        const row = await ler(fields, pre, pasta, atual);
        const r = await sb.from(tabela).upsert({ empresa_id: id, ...row }).select('*').single();
        if (r.error) throw new Error('Não foi possível salvar.');
        await ficha(mount, cfg); // redesenha com os arquivos atuais
        say(mount.querySelector('.msg'), 'Salvo. O cliente já vê no portal.', 'ok');
        return;
      } catch (err) { say(msg, err.message, 'error'); }
      btn.disabled = false;
    });
    mount.replaceChildren(form);
  };

  // ----- lista: vários itens com ordem -----
  const lista = async (mount, { titulo, nota, tabela, fields, fixo = {}, resumo, pasta, vazio, ordem = true }) => {
    const pre = 'li-' + tabela + '-' + Object.values(fixo).join('-') + '-';
    let q = sb.from(tabela).select('*').eq('empresa_id', id);
    Object.entries(fixo).forEach(([k, v]) => { q = q.eq(k, v); });
    const { data } = await (ordem ? q.order('ordem') : q);
    const rows = data || [];
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    let editando = null;
    const formBox = el('div');

    const abreForm = (r) => {
      editando = r;
      const form = el('form', { class: 'card', novalidate: true },
        el('h4', 'title-sm', r ? 'Editar' : 'Adicionar'),
        el('div', 'new-client', fields.map((f) => campo(f, r ? r[f.k] : null, pre,
          // só o campo principal (o nome do item) esconde o que já foi adicionado; os de apoio podem se repetir
          f.type === 'preset' && (f.req || f.k === 'titulo') ? rows.filter((x) => x !== r).map((x) => x[f.k]).filter(Boolean) : null))),
        el('div', 'new-client__foot',
          el('button', { class: 'btn btn--light btn--sm', type: 'submit' }, 'Salvar'),
          el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => { formBox.replaceChildren(addBtn); } }, 'Cancelar'), msg));
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const btn = form.querySelector('[type=submit]'); btn.disabled = true; say(msg, 'Salvando…');
        try {
          const row = { ...(await ler(fields, pre, pasta, editando)), ...fixo, empresa_id: id };
          if (!editando && ordem) row.ordem = rows.reduce((m, x) => Math.max(m, x.ordem || 0), 0) + 1;
          const r = editando ? await sb.from(tabela).update(row).eq('id', editando.id) : await sb.from(tabela).insert(row);
          if (r.error) throw new Error('Não foi possível salvar.');
          lista(mount, cfg);
        } catch (err) { say(msg, err.message, 'error'); btn.disabled = false; }
      });
      formBox.replaceChildren(form);
      form.querySelector('input, textarea, select').focus();
    };
    const addBtn = el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => abreForm(null) }, '+ Adicionar');

    const move = async (i, d) => {
      const a = rows[i]; const b = rows[i + d];
      if (!a || !b) return;
      await Promise.all([sb.from(tabela).update({ ordem: b.ordem }).eq('id', a.id), sb.from(tabela).update({ ordem: a.ordem }).eq('id', b.id)]);
      lista(mount, cfg);
    };
    const btn = (label, fn, extra) => el('button', { class: 'btn btn--ghost btn--sm' + (extra || ''), type: 'button', onclick: fn }, label);

    mount.replaceChildren(el('div', 'editor',
      el('div', 'editor__head', el('h3', 'title-sm', titulo), nota ? el('p', 'small', nota) : null),
      el('ul', 'rows', rows.length ? rows.map((r, i) => {
        const [t, sub] = resumo(r);
        return el('li', 'row',
          el('div', 'row__main', el('p', 'row__title', t), sub ? el('p', 'row__text', sub) : null),
          el('div', 'row__actions',
            ordem && i > 0 ? btn('↑', () => move(i, -1)) : null,
            btn('Editar', () => abreForm(r)),
            btn('Excluir', async () => { if (!confirm('Excluir “' + t + '”?')) return; await sb.from(tabela).delete().eq('id', r.id); lista(mount, cfg); }, ' btn--danger')));
      }) : el('li', 'clients__empty', vazio || 'Nada cadastrado ainda.')),
      formBox));
    formBox.replaceChildren(addBtn);
    const cfg = { titulo, nota, tabela, fields, fixo, resumo, pasta, vazio, ordem };
  };

  // ----- seções de cada aba -----
  const montar = (pane, blocos) => {
    const box = $(pane);
    box.replaceChildren();
    blocos.forEach(([fn, cfg]) => { const m = el('div', 'editor-block'); box.append(m); fn(m, cfg); });
  };
  const POS = [['entrega', 'Entregava'], ['entrega_mal', 'Entregava mal'], ['nao_entrega', 'Não entregava']];
  const POS_T = Object.fromEntries(POS);

  montar('pane-diagnostico', [
    [ficha, { titulo: 'Diagnóstico', nota: 'O ponto de partida da marca, como o cliente vê em Diagnóstico.', tabela: 'diagnosticos', fields: [
      { k: 'data', label: 'Data do diagnóstico', type: 'date' }, { k: 'proximo', label: 'Próximo diagnóstico', type: 'date' },
      { k: 'resumo', label: 'Em uma frase', type: 'textarea' }] }],
    [lista, { titulo: 'Como as pessoas viam a marca', nota: 'A marca do cliente e os concorrentes.', tabela: 'impressoes', fields: [
      { k: 'marca_nome', label: 'Marca', req: true }, { k: 'eh_cliente', label: 'É a marca do cliente?', type: 'bool', def: false },
      { k: 'notam', label: 'O que notavam', type: 'preset', presets: 'notam' }, { k: 'acreditam', label: 'O que acreditavam', type: 'preset', presets: 'acreditam' },
      { k: 'sentem', label: 'O que sentiam', type: 'preset', presets: 'sentem' }],
    resumo: (r) => [r.marca_nome + (r.eh_cliente ? ' (cliente)' : ''), [r.notam, r.acreditam, r.sentem].filter(Boolean).join(' · ')] }],
    [lista, { titulo: 'O que todo cliente exige', nota: 'Motivadores: o mínimo da categoria.', tabela: 'fatores', fixo: { tipo: 'motivador' }, fields: [
      { k: 'texto', label: 'Item', req: true, type: 'preset', presets: 'motivadores' }, { k: 'posicao', label: 'A marca…', type: 'select', options: POS }],
    resumo: (r) => [r.texto, POS_T[r.posicao]] }],
    [lista, { titulo: 'O que faz escolher uma marca', nota: 'Discriminadores: o que diferencia.', tabela: 'fatores', fixo: { tipo: 'discriminador' }, fields: [
      { k: 'texto', label: 'Item', req: true, type: 'preset', presets: 'discriminadores' }, { k: 'posicao', label: 'A marca…', type: 'select', options: POS }],
    resumo: (r) => [r.texto, POS_T[r.posicao]] }],
    [lista, { titulo: 'As causas que o plano ataca', tabela: 'causas', fields: [{ k: 'texto', label: 'Causa', req: true, full: true, type: 'preset', presets: 'causas' }], resumo: (r) => [r.texto] }],
  ]);

  const NIV = [['negocio', 'Negócio'], ['marca', 'Marca'], ['comunicacao', 'Comunicação']];
  const NIV_T = Object.fromEntries(NIV);
  const CON = [['se_confirma', 'Se confirma'], ['em_observacao', 'Em observação'], ['sem_dados', 'Sem dados ainda'], ['nao_se_confirma', 'Não se confirma']];
  const CON_T = Object.fromEntries(CON);
  montar('pane-estrategia', [
    [ficha, { titulo: 'Estratégia', nota: 'Datas, a frase de como vencemos e o PDF do plano completo.', tabela: 'planos', pasta: 'estrategia', fields: [
      { k: 'estrategia_aprovada_em', label: 'Aprovada em', type: 'date' }, { k: 'proxima_revisao_estrategia', label: 'Próxima revisão', type: 'date' },
      { k: 'como_vencer', label: 'Como vencemos (uma frase)', type: 'textarea', rows: 2 },
      { k: 'estrategia_pdf', label: 'Plano completo (PDF)', type: 'file', accept: 'application/pdf' }] }],
    [lista, { titulo: 'Objetivos', nota: 'Negócio (com o número em destaque), Marca e Comunicação (notar, acreditar, sentir). As ações se ligam a eles.', tabela: 'objetivos', fields: [
      { k: 'titulo', label: 'Objetivo', full: true, type: 'preset', presets: 'objetivos', fill: { nivel: 'nivel' } },
      { k: 'nivel', label: 'Nível', type: 'select', options: NIV }, { k: 'destaque', label: 'Número em destaque (negócio)', type: 'preset', presets: 'destaques' },
      { k: 'notar', label: 'Notar (comunicação)', type: 'preset', presets: 'notar' }, { k: 'acreditar', label: 'Acreditar (comunicação)', type: 'preset', presets: 'acreditar' }, { k: 'sentir', label: 'Sentir (comunicação)', type: 'preset', presets: 'sentir' }],
    resumo: (r) => [NIV_T[r.nivel] + ': ' + (r.destaque ? r.destaque + ' ' : '') + (r.titulo || ''), r.nivel === 'comunicacao' ? ['Notar ' + (r.notar || '—'), 'acreditar ' + (r.acreditar || '—'), 'sentir ' + (r.sentir || '—')].join(' · ') : null] }],
    [lista, { titulo: 'Situações de compra', nota: 'Os momentos em que alguém pensa na categoria (How Brands Grow). Ex.: “vou reformar antes de alugar”, “apareceu uma infiltração”. Entram na pesquisa e nas ações.', tabela: 'situacoes', fields: [
      { k: 'texto', label: 'Situação', req: true, full: true, type: 'preset', presets: 'situacoes' }], resumo: (r) => [r.texto] }],
    [lista, { titulo: 'Onde atuamos: prioridade', tabela: 'escolhas', fixo: { tipo: 'prioridade' }, fields: [{ k: 'texto', label: 'Prioridade', req: true, full: true, type: 'preset', presets: 'prioridades' }], resumo: (r) => [r.texto] }],
    [lista, { titulo: 'Onde atuamos: deixamos de lado', tabela: 'escolhas', fixo: { tipo: 'deixa_de_lado' }, fields: [{ k: 'texto', label: 'Deixamos de lado', req: true, full: true, type: 'preset', presets: 'deixados' }], resumo: (r) => [r.texto] }],
    [lista, { titulo: 'O que acompanhamos', nota: 'Condições que precisam continuar verdadeiras. Quando uma vira “Não se confirma”, o cliente vê o aviso e o tema entra na pauta do próximo encontro.', tabela: 'condicoes', fields: [
      { k: 'texto', label: 'Condição', req: true, full: true, type: 'preset', presets: 'condicoes' }, { k: 'como_verificar', label: 'Como verificamos', type: 'preset', presets: 'verificacoes' }, { k: 'status', label: 'Hoje', type: 'select', options: CON, def: 'sem_dados' },
      { k: 'dono', label: 'Quem checa', type: 'preset', presets: 'donos' }, { k: 'checar_em', label: 'Próxima checagem', type: 'date' }],
    resumo: (r) => [r.texto, [r.como_verificar, CON_T[r.status], r.dono ? 'checa: ' + r.dono : null, r.checar_em ? 'próxima: ' + U.dia(r.checar_em) : null].filter(Boolean).join(' · ')] }],
  ]);

  const FAC = [['aparencia', 'Aparência'], ['personalidade', 'Personalidade'], ['valores', 'Valores'], ['relacao', 'Relação com o cliente'], ['cliente_projetado', 'Cliente que projeta'], ['autoimagem', 'Como o cliente se sente']];
  const facetas = async (mount) => {
    const { data } = await sb.from('facetas').select('*').eq('empresa_id', id);
    const v = Object.fromEntries((data || []).map((f) => [f.chave, f.texto]));
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const form = el('form', { class: 'card', novalidate: true }, el('h3', 'title-sm', 'Quem a marca é'), el('p', 'small', 'As seis facetas da identidade.'),
      el('div', 'new-client', FAC.map(([k, t]) => { const ta = el('textarea', { class: 'field', id: 'fa-' + k, rows: 2 }); ta.value = v[k] || ''; return el('div', null, el('label', { class: 'label', for: 'fa-' + k }, t), ta); })),
      el('div', 'new-client__foot', el('button', { class: 'btn btn--light', type: 'submit' }, 'Salvar facetas'), msg));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const rows = FAC.map(([k]) => ({ empresa_id: id, chave: k, texto: $('fa-' + k).value.trim() || null }));
      const r = await sb.from('facetas').upsert(rows, { onConflict: 'empresa_id,chave' });
      say(msg, r.error ? 'Não foi possível salvar.' : 'Facetas salvas.', r.error ? 'error' : 'ok');
    });
    mount.replaceChildren(form);
  };
  montar('pane-plataforma', [
    [ficha, { titulo: 'Plataforma de marca', tabela: 'plataformas', pasta: 'plataforma', fields: [
      { k: 'entregue_em', label: 'Entregue em', type: 'date' }, { k: 'pdf', label: 'Plataforma em PDF', type: 'file', accept: 'application/pdf' },
      { k: 'posicionamento', label: 'Posicionamento', type: 'textarea', rows: 3, placeholder: 'Para [quem], [marca] é [o quê] que [benefício], porque [prova], ao contrário de [alternativa].' },
      { k: 'mensagem_central', label: 'Mensagem central', full: true }] }],
    [lista, { titulo: 'Mensagens de apoio', tabela: 'mensagens_apoio', fields: [{ k: 'texto', label: 'Mensagem', req: true, full: true }], resumo: (r) => [r.texto] }],
    [lista, { titulo: 'Tom de voz: atributos', tabela: 'tom_atributos', fields: [{ k: 'nome', label: 'Atributo', req: true, type: 'preset', presets: 'tom', fill: { descricao: 'descricao' } }, { k: 'descricao', label: 'Descrição', placeholder: 'Preenchida ao escolher o atributo' }], resumo: (r) => [r.nome, r.descricao] }],
    [lista, { titulo: 'A marca diz', tabela: 'tom_exemplos', fixo: { tipo: 'diz' }, fields: [{ k: 'texto', label: 'Exemplo', req: true, full: true, type: 'preset', presets: 'tomDiz' }], resumo: (r) => [r.texto] }],
    [lista, { titulo: 'Nunca diz', tabela: 'tom_exemplos', fixo: { tipo: 'nunca_diz' }, fields: [{ k: 'texto', label: 'Exemplo', req: true, full: true, type: 'preset', presets: 'tomNuncaDiz' }], resumo: (r) => [r.texto] }],
    [facetas, {}],
  ]);

  const CAT = [['logo', 'Logo'], ['manual', 'Manual'], ['modelo', 'Modelo'], ['papelaria', 'Papelaria']];
  const AP = [['aplicada', 'Aplicada'], ['em_andamento', 'Em andamento'], ['prevista', 'Prevista']];
  const AP_T = Object.fromEntries(AP);
  montar('pane-identidade', [
    [ficha, { titulo: 'Identidade visual', tabela: 'identidades', pasta: 'identidade', fields: [
      { k: 'entregue_em', label: 'Entregue em', type: 'date' }, { k: 'versao', label: 'Versão', placeholder: '1.0' },
      { k: 'zip', label: 'Tudo em um .zip', type: 'file', accept: '.zip,application/zip' }] }],
    [lista, { titulo: 'Ativos distintivos', nota: 'O que faz reconhecer a marca sem ler o nome: cor, símbolo, frase, personagem. Na pesquisa, cada um aparece sem a marca e medimos fama e exclusividade.', tabela: 'ativos', fields: [
      { k: 'tipo', label: 'Tipo', type: 'select', options: [['cor', 'Cor'], ['simbolo', 'Símbolo'], ['frase', 'Frase'], ['personagem', 'Personagem'], ['som', 'Som'], ['outro', 'Outro']] },
      { k: 'nome', label: 'Nome (só para você)', req: true, type: 'preset', presets: 'nomesAtivo' },
      { k: 'texto', label: 'Frase sem o nome da marca, ou o HEX da cor', full: true, placeholder: '#E5482A' },
      { k: 'imagem_url', label: 'Imagem sem o nome da marca (símbolo, personagem)', type: 'filepub' }],
    resumo: (r) => [r.nome, ({ cor: 'Cor', simbolo: 'Símbolo', frase: 'Frase', personagem: 'Personagem', som: 'Som', outro: 'Outro' })[r.tipo] + (r.texto ? ' · ' + r.texto : '') + (r.imagem_url ? ' · com imagem' : '')] }],
    [lista, { titulo: 'Logos, manuais e modelos', nota: 'Logos aparecem com prévia (a 2ª fica sobre fundo escuro). Os outros viram a lista “Modelos e manuais”.', tabela: 'arquivos_marca', pasta: 'identidade', fields: [
      { k: 'categoria', label: 'Tipo', type: 'select', options: CAT }, { k: 'nome', label: 'Nome', req: true, placeholder: 'Logo principal' },
      { k: 'descricao', label: 'Descrição', full: true, placeholder: 'Sobre fundo escuro' },
      { k: 'previa', label: 'Prévia (imagem, para logos)', type: 'file', accept: 'image/*' },
      { k: 'formatos', label: 'Arquivos para baixar', type: 'formats' }],
    resumo: (r) => [r.nome, (CAT.find(([k]) => k === r.categoria) || [, ''])[1] + ' · ' + ((r.formatos || []).map((f) => f.formato).join(', ') || 'sem arquivos')] }],
    [lista, { titulo: 'Cores', tabela: 'cores', fields: [
      { k: 'nome', label: 'Nome', req: true, type: 'preset', presets: 'nomesCor' }, { k: 'hex', label: 'HEX', type: 'color', req: true, placeholder: '#111111' },
      { k: 'cmyk', label: 'CMYK', placeholder: '0 0 0 93' }, { k: 'pantone', label: 'Pantone', placeholder: 'Pantone 172 C' }],
    resumo: (r) => [el('span', null, el('span', { class: 'dot', style: 'background:' + r.hex }), r.nome), [r.hex, r.cmyk ? 'CMYK ' + r.cmyk : null, r.pantone].filter(Boolean).join(' · ')] }],
    [lista, { titulo: 'Tipografia', tabela: 'tipografias', fields: [{ k: 'nome', label: 'Fonte', req: true }, { k: 'uso', label: 'Uso', type: 'preset', presets: 'usosFonte' }], resumo: (r) => [r.nome, r.uso] }],
    [lista, { titulo: 'Onde a nova marca já está', tabela: 'aplicacoes', fields: [
      { k: 'ponto_contato', label: 'Ponto de contato', req: true, type: 'preset', presets: 'pontosContato' }, { k: 'status', label: 'Situação', type: 'select', options: AP, def: 'prevista' },
      { k: 'data', label: 'Data', type: 'date' }],
    resumo: (r) => [r.ponto_contato, AP_T[r.status] + (r.data ? ' · ' + U.dia(r.data) : '')] }],
  ]);
});
