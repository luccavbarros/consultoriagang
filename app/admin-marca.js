/* Painel GANG: abas da marca de um cliente — Diagnóstico, Estratégia, Plataforma e Identidade.
   Dois editores genéricos: "ficha" (um registro por empresa) e "lista" (vários itens, com ordem). Arquivos vão para o
   armazenamento privado em <empresa>/<pasta>/..., e o banco guarda só o caminho. */
window.addEventListener('gang:cliente', ({ detail: { sb, id, me } }) => {
  const U = window.GangUI;
  const { $, el, say } = U;
  const nomeEmpresa = sb.from('empresas').select('nome').eq('id', id).maybeSingle().then((r) => (r.data ? r.data.nome : ''));

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
        longo: !!f.longo, // frases longas: lista própria que mostra o texto inteiro
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
    // dica para quem está começando: aparece até o consultor dizer que entendeu (lembrado neste navegador)
    if (f.dica) {
      const chave = 'gang-dica-' + (f.dicaId || f.k);
      let visto = false; try { visto = localStorage.getItem(chave) === '1'; } catch (e) { /* sem armazenamento */ }
      if (!visto) {
        const dica = el('div', 'campo-dica', el('span', { class: 'campo-dica__i', 'aria-hidden': 'true' }, 'i'),
          el('p', 'campo-dica__t', f.dica),
          el('button', { class: 'campo-dica__ok', type: 'button', onclick: () => { try { localStorage.setItem(chave, '1'); } catch (e) { /* ok */ } dica.remove(); } }, 'Entendi'));
        wrap.append(dica);
      }
    }
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
        if (f.type === 'cores' && v) {
          const hs = v.split(/[\s,;]+/).filter(Boolean);
          if (hs.length < 2 || hs.some((h) => !/^#[0-9a-f]{6}$/i.test(h))) throw new Error('O degradê precisa de duas cores ou mais, no formato #RRGGBB, separadas por vírgula.');
          row[f.k] = hs.map((h) => h.toUpperCase()).join(', '); continue;
        }
        row[f.k] = v === '' ? null : v;
      }
      if (f.req && (row[f.k] == null || row[f.k] === '')) throw new Error('Preencha “' + f.label + '”.');
    }
    return row;
  };

  // ícones dos cartões (traço fino, como no restante do painel)
  const ICO = {
    pulso: 'M3 12h4l3-8 4 16 3-8h4', olho: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    check: 'M20 6 9 17l-5-5', estrela: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z',
    alvo: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', mapa: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z M9 4v14 M15 6v14',
    seta: 'M5 12h14 M13 6l6 6-6 6', menos: 'M5 12h14', radar: 'M12 12 19 5 M12 3a9 9 0 1 0 9 9',
    balao: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z', voz: 'M4 10v4 M8 6v12 M12 3v18 M16 7v10 M20 10v4',
    mais: 'M12 5v14 M5 12h14', nao: 'M6 6l12 12 M18 6 6 18', rosto: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M9 10h.01 M15 10h.01 M8.5 14.5a4.5 4.5 0 0 0 7 0',
    forma: 'M12 3 3 8v8l9 5 9-5V8Z', arquivo: 'M14 3H6v18h12V7Z M14 3v4h4', gota: 'M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z',
    letra: 'M5 20 12 4l7 16 M8 14h8', pin: 'M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z M12 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
    lapis: 'M4 20h4L19 9l-4-4L4 16Z', grip: 'M9 6h.01 M15 6h.01 M9 12h.01 M15 12h.01 M9 18h.01 M15 18h.01', lixo: 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13', sobe: 'M12 19V5 M6 11l6-6 6 6',
  };
  const ico = (nome) => { const NS = 'http://www.w3.org/2000/svg'; const sv = document.createElementNS(NS, 'svg');
    sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('aria-hidden', 'true');
    (ICO[nome] || ICO.pulso).split(' M').forEach((d, i) => { const pa = document.createElementNS(NS, 'path'); pa.setAttribute('d', (i ? 'M' : '') + d); sv.append(pa); });
    return sv; };
  const tile = (nome, tom) => el('span', 'ed-ico' + (tom ? ' ed-ico--' + tom : ''), ico(nome));

  // ----- ficha: um registro por empresa (diagnosticos, plataformas, identidades, planos) -----
  const ficha = async (mount, cfg) => {
    const { titulo, nota, tabela, fields, pasta } = cfg;
    mount.classList.add('is-largo');
    const pre = 'fi-' + tabela + '-';
    const { data } = await sb.from(tabela).select('*').eq('empresa_id', id).maybeSingle();
    let atual = data;
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const form = el('form', { class: 'ed-card ed-card--ficha', novalidate: true },
      el('div', 'ed-head', tile(cfg.icone || 'pulso'), el('div', 'ed-head__txt', el('h3', 'ed-head__t', titulo), nota ? el('p', 'ed-head__n', nota) : null),
        el('button', { class: 'btn btn--light btn--sm ed-head__btn', type: 'submit' }, 'Salvar')),
      el('div', 'new-client ed-campos', fields.map((f) => campo(f, atual ? atual[f.k] : null, pre))),
      el('div', 'ed-foot', msg));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector('[type=submit]'); btn.disabled = true; say(msg, 'Salvando…');
      try {
        const row = await ler(fields, pre, pasta, atual);
        const r = await sb.from(tabela).upsert({ empresa_id: id, ...row }).select('*').single();
        if (r.error) throw new Error('Não foi possível salvar.');
        await ficha(mount, cfg); // redesenha com os arquivos atuais
        document.dispatchEvent(new CustomEvent('gang:marca-salva'));
        say(mount.querySelector('.msg'), 'Salvo. O cliente já vê no portal.', 'ok');
        return;
      } catch (err) { say(msg, err.message, 'error'); }
      btn.disabled = false;
    });
    mount.replaceChildren(form);
    // campos que dependem de outro (ex.: as abordagens coerentes com o desafio escolhido)
    fields.filter((f) => f.depende).forEach((f) => {
      const P = window.GangPresets || {}; const idc = pre + f.k; const idDe = pre + f.depende.de;
      const filtra = (manter) => {
        const fonte = (P[f.depende.lista] || []).find((x) => x.texto === U.comboValue(idDe));
        const todas = P[f.presets] || [];
        const lista = fonte && fonte[f.depende.chave] ? todas.filter((a) => fonte[f.depende.chave].includes(a.texto)) : todas;
        const velho = $(idc) && $(idc).closest('.combo'); if (!velho) return;
        const atualV = U.comboValue(idc);
        // só libera depois que o campo de origem (o desafio) tem valor; sem ele, fica desativado e vazio
        const livre = !!U.comboValue(idDe);
        const valor = !livre ? null : manter || (atualV && lista.some((a) => a.texto === atualV)) ? atualV : null;
        const novo = U.combo(idc, lista, valor, { semGrupos: true, longo: !!f.longo, vazio: livre ? 'Escolha…' : 'Escolha o desafio primeiro' });
        novo.querySelectorAll('select, input').forEach((x) => { x.disabled = !livre; });
        novo.classList.toggle('is-travado', !livre);
        velho.replaceWith(novo);
      };
      filtra(true);
      const sel = $(idDe); if (sel) sel.addEventListener('change', () => filtra(false));
      const outro = $(idDe + '-outro'); if (outro) outro.addEventListener('input', () => { clearTimeout(outro._t); outro._t = setTimeout(() => filtra(true), 250); });
    });
  };

  // ----- lista: vários itens com ordem -----
  const lista = async (mount, { titulo, nota, tabela, fields, fixo = {}, resumo, pasta, vazio, ordem = true, icone, tom, largo, max, aoAbrir }) => {
    if (largo) mount.classList.add('is-largo');
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
      const form = el('form', { class: 'ed-form', novalidate: true },
        el('p', 'ed-form__t', r ? 'Editar' : 'Adicionar'),
        el('div', 'new-client', fields.map((f) => campo(f, r ? r[f.k] : null, pre,
          // só o campo principal (o nome do item) esconde o que já foi adicionado; os de apoio podem se repetir
          f.type === 'preset' && (f.req || f.k === 'titulo') ? rows.filter((x) => x !== r).map((x) => x[f.k]).filter(Boolean) : null))),
        el('div', 'new-client__foot',
          el('button', { class: 'btn btn--light btn--sm', type: 'submit' }, 'Salvar'),
          el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => { formBox.replaceChildren(); addBtn.hidden = !!(max && rows.length >= max); } }, 'Cancelar'), msg));
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const btn = form.querySelector('[type=submit]'); btn.disabled = true; say(msg, 'Salvando…');
        try {
          const row = { ...(await ler(fields, pre, pasta, editando)), ...fixo, empresa_id: id };
          if (!editando && ordem) row.ordem = rows.reduce((m, x) => Math.max(m, x.ordem || 0), 0) + 1;
          const r = editando ? await sb.from(tabela).update(row).eq('id', editando.id) : await sb.from(tabela).insert(row);
          if (r.error) throw new Error('Não foi possível salvar.');
          lista(mount, cfg); document.dispatchEvent(new CustomEvent('gang:marca-salva'));
        } catch (err) { say(msg, err.message, 'error'); btn.disabled = false; }
      });
      formBox.replaceChildren(form); addBtn.hidden = true;
      if (aoAbrir && !r) aoAbrir(pre);
      form.querySelector('input, textarea, select').focus();
    };
    const addBtn = el('button', { class: 'ed-add', type: 'button', onclick: () => abreForm(null) }, ico('mais'), 'Adicionar');

    const move = (i, d) => {
      if (!rows[i + d]) return;
      const ids = rows.map((x) => x.id); const [x] = ids.splice(i, 1); ids.splice(i + d, 0, x);
      focoDepois = x; salvaOrdem(ids);
    };
    const btn = (nome, rotulo, fn, extra) => el('button', { class: 'ed-acao' + (extra || ''), type: 'button', title: rotulo, 'aria-label': rotulo, onclick: fn }, ico(nome));

    const ul = el('ul', 'ed-lista');
    const arrastavel = ordem && rows.length > 1;
    // salva a nova ordem (1, 2, 3…) só das linhas que mudaram de lugar
    const salvaOrdem = async (ids) => {
      // grava 1, 2, 3… em todas (ordens antigas podem estar repetidas, o que deixaria a lista instável)
      const mud = ids.map((rid, k) => ({ rid, ordem: k + 1 }));
      await Promise.all(mud.map(({ rid, ordem: o }) => sb.from(tabela).update({ ordem: o }).eq('id', rid)));
      lista(mount, cfg).then(() => { if (focoDepois) { const h = mount.querySelector('.ed-item[data-id="' + focoDepois + '"] .ed-alca'); if (h) h.focus(); focoDepois = null; } });
    };
    let focoDepois = null;
    // arrastar pela alça: a linha acompanha o ponteiro e as outras abrem espaço; ao soltar, a ordem é salva
    const arrasta = (ev) => {
      const li = ev.currentTarget.closest('.ed-item'); if (!li || ev.button > 0) return;
      ev.preventDefault();
      // os eventos ficam na janela: mover a linha no DOM tira a captura do ponteiro da alça
      const antes = [...ul.children].map((x) => x.dataset.id).join();
      li.classList.add('is-arrastando'); ul.classList.add('is-ordenando');
      const anda = (e) => {
        const irmaos = [...ul.querySelectorAll('.ed-item:not(.is-arrastando)')];
        const depois = irmaos.find((x) => { const b = x.getBoundingClientRect(); return e.clientY < b.top + b.height / 2; });
        if (depois) { if (depois !== li.nextElementSibling) ul.insertBefore(li, depois); } else if (ul.lastElementChild !== li) ul.appendChild(li);
      };
      const solta = () => {
        window.removeEventListener('pointermove', anda); window.removeEventListener('pointerup', solta); window.removeEventListener('pointercancel', solta);
        li.classList.remove('is-arrastando'); ul.classList.remove('is-ordenando');
        const ids = [...ul.children].map((x) => x.dataset.id);
        if (ids.join() !== antes) salvaOrdem(ids);
      };
      window.addEventListener('pointermove', anda); window.addEventListener('pointerup', solta); window.addEventListener('pointercancel', solta);
    };
    mount.replaceChildren(el('div', 'ed-card',
      el('div', 'ed-head', tile(icone || 'pulso', tom),
        el('div', 'ed-head__txt', el('h3', 'ed-head__t', titulo, el('span', 'ed-n', String(rows.length))), nota ? el('p', 'ed-head__n', nota) : null),
        addBtn),
      formBox,
      ul),
      );
    ul.append(...(rows.length ? rows.map((r, i) => {
        const [t, sub] = resumo(r);
        return el('li', { class: 'ed-item', 'data-id': r.id },
          arrastavel ? el('button', { class: 'ed-alca', type: 'button', title: 'Arraste para mudar a ordem', 'aria-label': 'Mudar a ordem de “' + (typeof t === 'string' ? t : 'item') + '” (use as setas do teclado)',
            onpointerdown: (ev) => arrasta(ev), onkeydown: (ev) => { if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') { ev.preventDefault(); move(i, ev.key === 'ArrowUp' ? -1 : 1, true); } } }, ico('grip')) : null,
          el('div', 'ed-item__main', el('p', 'ed-item__t', t), sub ? el('p', 'ed-item__s', sub) : null),
          el('div', 'ed-item__acoes',
            btn('lapis', 'Editar', () => abreForm(r)),
            btn('lixo', 'Excluir', async () => { if (!confirm('Excluir “' + (typeof t === 'string' ? t : 'este item') + '”?')) return; await sb.from(tabela).delete().eq('id', r.id); lista(mount, cfg); document.dispatchEvent(new CustomEvent('gang:marca-salva')); }, ' ed-acao--bad')));
      }) : [el('li', 'ed-vazio', vazio || 'Nada cadastrado ainda.')]));
    const cfg = { titulo, nota, tabela, fields, fixo, resumo, pasta, vazio, ordem, icone, tom, largo, max, aoAbrir };
    if (max && rows.length >= max) addBtn.hidden = true;
  };

  // ----- seções de cada aba -----
  const montar = (pane, blocos) => {
    const box = $(pane);
    box.replaceChildren(); box.classList.add('ed-grade');
    blocos.forEach(([fn, cfg]) => { const m = el('div', 'editor-block'); box.append(m); fn(m, cfg); });
  };
  const POS = [['entrega', 'Entregava'], ['entrega_mal', 'Entregava mal'], ['nao_entrega', 'Não entregava']];
  const POS_T = Object.fromEntries(POS);

  montar('pane-diagnostico', [
    [ficha, { icone: 'pulso', titulo: 'Diagnóstico', nota: 'O ponto de partida da marca, como o cliente vê em Diagnóstico.', tabela: 'diagnosticos', fields: [
      { k: 'data', label: 'Data do diagnóstico', type: 'date' }, { k: 'proximo', label: 'Próximo diagnóstico', type: 'date' },
      { k: 'resumo', label: 'Em uma frase', full: true, type: 'preset', presets: 'resumosDiagnostico' }] }],
    [lista, { icone: 'olho', tom: 'gang', titulo: 'A marca do cliente', nota: 'Como as pessoas viam a marca antes do trabalho.', tabela: 'impressoes', fixo: { eh_cliente: true }, max: 1,
      vazio: 'Ainda sem a leitura da marca do cliente.', aoAbrir: (pre) => nomeEmpresa.then((n) => { const i = $(pre + 'marca_nome'); if (i && !i.value) i.value = n || ''; }), fields: [
      { k: 'marca_nome', label: 'Marca', req: true },
      { k: 'notam', label: 'O que notavam', type: 'preset', presets: 'notam' }, { k: 'acreditam', label: 'O que acreditavam', type: 'preset', presets: 'acreditam' },
      { k: 'sentem', label: 'O que sentiam', type: 'preset', presets: 'sentem' }],
    resumo: (r) => [r.marca_nome, [r.notam, r.acreditam, r.sentem].filter(Boolean).join(' · ')] }],
    [lista, { icone: 'olho', titulo: 'Concorrentes', nota: 'As mesmas perguntas para cada concorrente, para comparar com a marca do cliente.', tabela: 'impressoes', fixo: { eh_cliente: false },
      vazio: 'Nenhum concorrente ainda.', fields: [
      { k: 'marca_nome', label: 'Concorrente', req: true, placeholder: 'Nome do concorrente' },
      { k: 'notam', label: 'O que notavam', type: 'preset', presets: 'notam' }, { k: 'acreditam', label: 'O que acreditavam', type: 'preset', presets: 'acreditam' },
      { k: 'sentem', label: 'O que sentiam', type: 'preset', presets: 'sentem' }],
    resumo: (r) => [r.marca_nome, [r.notam, r.acreditam, r.sentem].filter(Boolean).join(' · ')] }],
    [lista, { icone: 'check', titulo: 'O que todo cliente exige', nota: 'Motivadores: o mínimo da categoria.', tabela: 'fatores', fixo: { tipo: 'motivador' }, fields: [
      { k: 'texto', label: 'Item', req: true, type: 'preset', presets: 'motivadores' }, { k: 'posicao', label: 'A marca…', type: 'select', options: POS }],
    resumo: (r) => [r.texto, POS_T[r.posicao]] }],
    [lista, { icone: 'estrela', tom: 'gang', titulo: 'O que faz escolher uma marca', nota: 'Discriminadores: o que diferencia.', tabela: 'fatores', fixo: { tipo: 'discriminador' }, fields: [
      { k: 'texto', label: 'Item', req: true, type: 'preset', presets: 'discriminadores' }, { k: 'posicao', label: 'A marca…', type: 'select', options: POS }],
    resumo: (r) => [r.texto, POS_T[r.posicao]] }],
    [lista, { icone: 'alvo', largo: true, titulo: 'As causas que o plano ataca', tabela: 'causas', fields: [{ k: 'texto', label: 'Causa', req: true, full: true, type: 'preset', presets: 'causas' }], resumo: (r) => [r.texto] }],
  ]);

  // ===== Teste de estratégia ruim: o que costuma faltar numa estratégia que é só desejo =====
  const testeEstrategia = async (mount) => {
    mount.classList.add('is-largo');
    const [{ data: p }, { data: acs }, { data: obs }, { data: esc }] = await Promise.all([
      sb.from('planos').select('desafio, como_vencer').eq('empresa_id', id).maybeSingle(),
      sb.from('acoes').select('titulo, executa, status').eq('empresa_id', id),
      sb.from('objetivos').select('nivel').eq('empresa_id', id),
      sb.from('escolhas').select('tipo').eq('empresa_id', id),
    ]);
    const P = p || {};
    const meta = /^\s*([+\-]?\d+[\d.,]*\s*%|crescer|aumentar|faturar|vender mais|dobrar)/i;
    const floreio = /(excel[êe]ncia|inova[çc][ãa]o|sinergia|refer[êe]ncia|l[íi]der|melhor (empresa|do mercado)|qualidade total|valor agregado)/i;
    const nObj = (obs || []).filter((o) => o.nivel !== 'comunicacao').length;
    // tática: começa por um verbo de tarefa (abrir, criar, publicar…); a abordagem é uma escolha, não uma tarefa
    const tatica = /^\s*(abrir|criar|publicar|postar|fazer|montar|lan[çc]ar|treinar|contratar|anunciar|produzir|escrever|investir|melhorar|aumentar a presen|padronizar|transformar cada|responder|enviar|ligar|cadastrar|refazer|reformular)\b/i;
    const renuncia = /(abr(e|imos|ir|indo) m[ãa]o|deixa(mos|r)? de|em vez de|n[ãa]o vamos|n[ãa]o atendemos|sem disputar|recusa)/i;
    const cv = P.como_vencer || '';
    // ações coerentes: o plano tem ações que executam a abordagem e nenhuma pendente que contradiga a renúncia
    const ab = cv ? ((window.GangPresets || {}).abordagens || []).find((a) => a.texto === cv && a.acoes) : null;
    const lista = acs || [];
    const nExec = ab ? lista.filter((a) => a.executa || ab.acoes.includes(a.titulo)).length : lista.filter((a) => a.executa).length;
    const contra = ab ? lista.filter((a) => a.status !== 'feita' && a.status !== 'descartada' && (ab.fora || []).includes(a.titulo)) : [];
    const coerente = [!!cv && nExec >= 4 && !contra.length, 'Ações coerentes',
      !cv ? 'Escolha a abordagem: é dela que saem as ações do plano.'
        : contra.length ? 'Há ' + (contra.length === 1 ? 'uma ação que contradiz' : contra.length + ' ações que contradizem') + ' o que a abordagem deixa de lado: “' + contra[0].titulo + '”. Tire do plano ou reveja a abordagem.'
          : nExec >= 4 ? nExec + ' ações do plano executam a abordagem.'
            : (nExec ? 'Só ' + nExec + (nExec === 1 ? ' ação executa' : ' ações executam') : 'Nenhuma ação executa') + ' a abordagem. Use “Montar o plano a partir de um modelo” ou o Planejar o mês para incluir as da estratégia.'];
    const T = [
      [!!P.desafio, 'Nomeia o desafio', P.desafio ? 'O obstáculo principal está escrito.' : 'Sem o desafio, não dá para saber se a estratégia resolve alguma coisa. Escreva o que impede a marca de crescer.'],
      [!!P.como_vencer && !meta.test(P.como_vencer), 'Tem uma abordagem, não só uma meta', !P.como_vencer ? 'Falta dizer como a marca vai vencer o desafio.' : meta.test(P.como_vencer) ? 'A abordagem parece uma meta ("crescer", "+30%"). Meta é aonde ir; a abordagem é o caminho.' : 'A abordagem diz o caminho, não só o destino.'],
      [!!P.como_vencer && !floreio.test(P.como_vencer), 'Sem floreio', !P.como_vencer ? 'Escreva a abordagem em palavras concretas.' : floreio.test(P.como_vencer) ? 'Troque palavras vagas ("excelência", "referência", "inovação") pelo que a marca faz de fato.' : 'A abordagem usa palavras concretas.'],
      [!!cv && !tatica.test(cv), 'É uma escolha, não uma ação', !cv ? 'A abordagem é a escolha que orienta as ações: onde jogar e por que a marca vence ali.' : tatica.test(cv) ? 'A abordagem parece uma tarefa. Tarefas vão para Ações; aqui fica a escolha que explica por que elas existem.' : 'A abordagem é uma escolha que orienta as ações.'],
      [!!cv && renuncia.test(cv), 'Diz do que abre mão', !cv ? 'Uma boa abordagem diz o que a marca deixa de fazer por causa dela.' : renuncia.test(cv) ? 'A abordagem diz o que fica de fora.' : 'Se a abordagem não obriga a dizer não para nada, ainda não é estratégia. Complete com "Abrimos mão de…".'],
      coerente,
      [(esc || []).some((e) => e.tipo === 'deixa_de_lado'), 'Faz escolhas', (esc || []).some((e) => e.tipo === 'deixa_de_lado') ? 'Há clientes, serviços ou canais em "Deixamos de lado".' : 'Estratégia também é dizer não. Cadastre o que a marca deixa de lado.'],
      [nObj > 0 && nObj <= 3, 'Foco', nObj === 0 ? 'Cadastre de 1 a 3 objetivos de negócio e marca.' : nObj <= 3 ? nObj + (nObj === 1 ? ' objetivo de negócio e marca.' : ' objetivos de negócio e marca.') : nObj + ' objetivos dividem o esforço. Fique com até 3.'],
    ];
    const ok = T.filter((x) => x[0]).length;
    mount.replaceChildren(el('div', 'ed-card',
      el('div', 'ed-head', tile('check'), el('div', 'ed-head__txt', el('h3', 'ed-head__t', 'Teste da estratégia', el('span', 'ed-n', ok + '/' + T.length)),
        el('p', 'ed-head__n', 'O que separa uma estratégia de verdade de uma lista de desejos. Atualiza a cada mudança.'))),
      el('ul', 'ed-lista teste', T.map(([bom, t, d]) => el('li', 'ed-item teste__i' + (bom ? ' is-ok' : ''),
        el('span', { class: 'teste__q', 'aria-hidden': 'true' }, bom ? '✓' : '!'),
        el('div', 'ed-item__main', el('p', 'ed-item__t', t), el('p', 'ed-item__s', d)))))));
  };
  // o teste refaz a conta quando algo da Estratégia é salvo
  const refazTeste = () => { const m = document.querySelector('#pane-estrategia .editor-block:nth-child(2)'); if (m) testeEstrategia(m); };
  document.addEventListener('gang:marca-salva', () => setTimeout(refazTeste, 300));

  const NIV = [['negocio', 'Negócio'], ['marca', 'Marca'], ['comunicacao', 'Comunicação']];
  const NIV_T = Object.fromEntries(NIV);
  const CON = [['se_confirma', 'Se confirma'], ['em_observacao', 'Em observação'], ['sem_dados', 'Sem dados ainda'], ['nao_se_confirma', 'Não se confirma']];
  const CON_T = Object.fromEntries(CON);
  montar('pane-estrategia', [
    [ficha, { icone: 'mapa', titulo: 'O cerne da estratégia', nota: 'O desafio que a marca precisa vencer e a abordagem para vencê-lo.', tabela: 'planos', pasta: 'estrategia', fields: [
      { k: 'desafio', label: '1. O desafio (o obstáculo principal)', full: true, longo: true, type: 'preset', presets: 'desafios',
        dica: 'Vários problemas? Escolha o que, resolvido, destrava os outros. Os demais entram como causas no Diagnóstico.' },
      { k: 'como_vencer', label: '2. A abordagem (como vencer o desafio)', full: true, longo: true, type: 'preset', presets: 'abordagens', depende: { de: 'desafio', lista: 'desafios', chave: 'abordagens' } },
      { k: 'estrategia_aprovada_em', label: 'Aprovada em', type: 'date' }, { k: 'proxima_revisao_estrategia', label: 'Próxima revisão', type: 'date' },
      { k: 'estrategia_pdf', label: 'Plano completo (PDF)', type: 'file', accept: 'application/pdf' }] }],
    [testeEstrategia, {}],
    [lista, { icone: 'alvo', tom: 'gang', titulo: 'Objetivos', nota: 'Negócio (com o número em destaque), Marca e Comunicação (notar, acreditar, sentir). As ações se ligam a eles.', tabela: 'objetivos', fields: [
      { k: 'titulo', label: 'Objetivo', full: true, type: 'preset', presets: 'objetivos', fill: { nivel: 'nivel' } },
      { k: 'nivel', label: 'Nível', type: 'select', options: NIV }, { k: 'destaque', label: 'Número em destaque (negócio)', type: 'preset', presets: 'destaques' },
      { k: 'notar', label: 'Notar (comunicação)', type: 'preset', presets: 'notar' }, { k: 'acreditar', label: 'Acreditar (comunicação)', type: 'preset', presets: 'acreditar' }, { k: 'sentir', label: 'Sentir (comunicação)', type: 'preset', presets: 'sentir' }],
    resumo: (r) => [NIV_T[r.nivel] + ': ' + (r.destaque ? r.destaque + ' ' : '') + (r.titulo || ''), r.nivel === 'comunicacao' ? ['Notar ' + (r.notar || '—'), 'acreditar ' + (r.acreditar || '—'), 'sentir ' + (r.sentir || '—')].join(' · ') : null] }],
    [lista, { icone: 'pin', titulo: 'Situações de compra', nota: 'Os momentos em que alguém pensa na categoria. Ex.: “vou reformar antes de alugar”, “apareceu uma infiltração”. Entram na pesquisa e nas ações.', tabela: 'situacoes', fields: [
      { k: 'texto', label: 'Situação', req: true, full: true, type: 'preset', presets: 'situacoes', dicaId: 'situacao',
        dica: 'Escreva um momento da vida de quem compra (quando, onde, por quê), não um motivo. Use de 5 a 10, sempre as mesmas: são elas que a pesquisa mede.' }], resumo: (r) => [r.texto] }],
    [lista, { icone: 'check', tom: 'ok', titulo: 'Onde atuamos: prioridade', tabela: 'escolhas', fixo: { tipo: 'prioridade' }, fields: [{ k: 'texto', label: 'Prioridade', req: true, full: true, type: 'preset', presets: 'prioridades' }], resumo: (r) => [r.texto] }],
    [lista, { icone: 'menos', titulo: 'Onde atuamos: deixamos de lado', tabela: 'escolhas', fixo: { tipo: 'deixa_de_lado' }, fields: [{ k: 'texto', label: 'Deixamos de lado', req: true, full: true, type: 'preset', presets: 'deixados' }], resumo: (r) => [r.texto] }],
    [lista, { icone: 'radar', largo: true, titulo: 'O que acompanhamos', nota: 'Condições que precisam continuar verdadeiras. Quando uma vira “Não se confirma”, o cliente vê o aviso e o tema entra na pauta do próximo encontro.', tabela: 'condicoes', fields: [
      { k: 'texto', label: 'Condição', req: true, full: true, type: 'preset', presets: 'condicoes' }, { k: 'como_verificar', label: 'Como verificamos', type: 'preset', presets: 'verificacoes' }, { k: 'status', label: 'Hoje', type: 'select', options: CON, def: 'sem_dados' },
      { k: 'checar_em', label: 'Próxima checagem', type: 'date' }],
    resumo: (r) => [r.texto, [r.como_verificar, CON_T[r.status], r.checar_em ? 'próxima: ' + U.dia(r.checar_em) : null].filter(Boolean).join(' · ')] }],
  ]);

  const FAC = [['aparencia', 'Aparência', 'facetaAparencia'], ['personalidade', 'Personalidade', 'facetaPersonalidade'], ['valores', 'Valores', 'facetaValores'],
    ['relacao', 'Relação com o cliente', 'facetaRelacao'], ['cliente_projetado', 'Cliente que projeta', 'facetaClienteProjetado'], ['autoimagem', 'Como o cliente se sente', 'facetaAutoimagem']];
  const facetas = async (mount) => {
    const { data } = await sb.from('facetas').select('*').eq('empresa_id', id);
    const v = Object.fromEntries((data || []).map((f) => [f.chave, f.texto]));
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    mount.classList.add('is-largo');
    const form = el('form', { class: 'ed-card ed-card--ficha', novalidate: true },
      el('div', 'ed-head', tile('rosto'), el('div', 'ed-head__txt', el('h3', 'ed-head__t', 'Quem a marca é'), el('p', 'ed-head__n', 'As seis facetas da identidade.')),
        el('button', { class: 'btn btn--light btn--sm ed-head__btn', type: 'submit' }, 'Salvar')),
      el('div', 'new-client new-client--3 ed-campos', FAC.map(([k, t, lista]) => el('div', null, el('label', { class: 'label', for: 'fa-' + k }, t),
        U.combo('fa-' + k, (window.GangPresets || {})[lista] || [], v[k] || null, { semGrupos: true, placeholder: 'Escreva com as palavras da marca' })))),
      el('div', 'ed-foot', msg));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const rows = FAC.map(([k]) => ({ empresa_id: id, chave: k, texto: U.comboValue('fa-' + k) }));
      const r = await sb.from('facetas').upsert(rows, { onConflict: 'empresa_id,chave' });
      say(msg, r.error ? 'Não foi possível salvar.' : 'Facetas salvas.', r.error ? 'error' : 'ok');
    });
    mount.replaceChildren(form);
  };
  montar('pane-plataforma', [
    [ficha, { icone: 'forma', titulo: 'Plataforma de marca', tabela: 'plataformas', pasta: 'plataforma', fields: [
      { k: 'entregue_em', label: 'Entregue em', type: 'date' }, { k: 'pdf', label: 'Plataforma em PDF', type: 'file', accept: 'application/pdf' },
      { k: 'posicionamento', label: 'Posicionamento', type: 'textarea', rows: 3, placeholder: 'Para [quem], [marca] é [o quê] que [benefício], porque [prova], ao contrário de [alternativa].',
        dica: 'Comece pela alternativa real: o que o cliente faria se a marca não existisse. Depois, o que só a marca tem, o valor disso e quem se importa muito com esse valor. Por último, escolha a categoria em que ela vira a escolha óbvia.' },
      { k: 'mensagem_central', label: 'Mensagem central', full: true, type: 'preset', presets: 'mensagensCentrais',
        dica: 'Uma ideia só, que o cliente entende em segundos. Teste: troque o nome da marca pelo de um concorrente. Se a frase continuar verdadeira, ainda não é a mensagem.' }] }],
    [lista, { icone: 'alvo', largo: true, titulo: 'Identidade central', nota: 'De 2 a 4 ideias que não mudam com o tempo. Servem de filtro para aprovar peças, parcerias e serviços novos.', tabela: 'identidade_central', max: 4,
      vazio: 'Ainda sem a identidade central.', fields: [
      { k: 'texto', label: 'Ideia que não muda', req: true, full: true, type: 'preset', presets: 'identidadeCentral', fill: { explicacao: 'explicacao' } },
      { k: 'explicacao', label: 'O que isso significa na prática', full: true, type: 'textarea', rows: 2, placeholder: 'Ex.: nenhum projeto começa sem o plano completo aprovado pelo cliente.' }],
    resumo: (r) => [r.texto, r.explicacao] }],
    [lista, { icone: 'balao', titulo: 'Mensagens de apoio', nota: 'As provas da mensagem central: por que acreditar nela.', tabela: 'mensagens_apoio', fields: [{ k: 'texto', label: 'Mensagem', req: true, full: true, type: 'preset', presets: 'mensagensApoio' }], resumo: (r) => [r.texto] }],
    [lista, { icone: 'voz', titulo: 'Tom de voz: atributos', tabela: 'tom_atributos', fields: [{ k: 'nome', label: 'Atributo', req: true, type: 'preset', presets: 'tom', fill: { descricao: 'descricao' } }, { k: 'descricao', label: 'Descrição', placeholder: 'Preenchida ao escolher o atributo' }], resumo: (r) => [r.nome, r.descricao] }],
    [lista, { icone: 'check', tom: 'ok', titulo: 'A marca diz', tabela: 'tom_exemplos', fixo: { tipo: 'diz' }, fields: [{ k: 'texto', label: 'Exemplo', req: true, full: true, type: 'preset', presets: 'tomDiz' }], resumo: (r) => [r.texto] }],
    [lista, { icone: 'nao', tom: 'bad', titulo: 'Nunca diz', tabela: 'tom_exemplos', fixo: { tipo: 'nunca_diz' }, fields: [{ k: 'texto', label: 'Exemplo', req: true, full: true, type: 'preset', presets: 'tomNuncaDiz' }], resumo: (r) => [r.texto] }],
    [facetas, {}],
  ]);

  const CAT = [['logo', 'Logo'], ['manual', 'Manual'], ['modelo', 'Modelo'], ['papelaria', 'Papelaria']];
  const AP = [['aplicada', 'Aplicada'], ['em_andamento', 'Em andamento'], ['prevista', 'Prevista']];
  const AP_T = Object.fromEntries(AP);
  const EL = [['degrade', 'Degradê'], ['textura', 'Textura / padrão'], ['mascote', 'Mascote'], ['personagem', 'Personagem'], ['embalagem', 'Embalagem'],
    ['simbolo', 'Símbolo'], ['ilustracao', 'Ilustração própria'], ['icones', 'Ícones'], ['foto', 'Estilo de foto'], ['forma', 'Forma do produto'],
    ['fonte_propria', 'Fonte própria'], ['som', 'Som / jingle'], ['cheiro', 'Cheiro do ambiente'], ['outro', 'Outro']];
  const EL_T = Object.fromEntries(EL);
  montar('pane-identidade', [
    [ficha, { icone: 'forma', titulo: 'Identidade visual', tabela: 'identidades', pasta: 'identidade', fields: [
      { k: 'entregue_em', label: 'Entregue em', type: 'date' }, { k: 'versao', label: 'Versão', placeholder: '1.0' },
      { k: 'zip', label: 'Tudo em um .zip', type: 'file', accept: '.zip,application/zip' }] }],
    [lista, { icone: 'estrela', tom: 'gang', titulo: 'Ativos distintivos', nota: 'O que faz reconhecer a marca sem ler o nome: cor, símbolo, frase, personagem. Na pesquisa, cada um aparece sem a marca e medimos fama e exclusividade.', tabela: 'ativos', fields: [
      { k: 'tipo', label: 'Tipo', type: 'select', options: [['cor', 'Cor'], ['simbolo', 'Símbolo'], ['frase', 'Frase'], ['personagem', 'Personagem'], ['som', 'Som'], ['outro', 'Outro']] },
      { k: 'nome', label: 'Nome (só para você)', req: true, type: 'preset', presets: 'nomesAtivo' },
      { k: 'texto', label: 'Frase sem o nome da marca, ou o HEX da cor', full: true, placeholder: '#E5482A' },
      { k: 'imagem_url', label: 'Imagem sem o nome da marca (símbolo, personagem)', type: 'filepub' }],
    resumo: (r) => [r.nome, ({ cor: 'Cor', simbolo: 'Símbolo', frase: 'Frase', personagem: 'Personagem', som: 'Som', outro: 'Outro' })[r.tipo] + (r.texto ? ' · ' + r.texto : '') + (r.imagem_url ? ' · com imagem' : '')] }],
    [lista, { icone: 'arquivo', titulo: 'Logos, manuais e modelos', nota: 'Logos aparecem com prévia (a 2ª fica sobre fundo escuro). Os outros viram a lista “Modelos e manuais”.', tabela: 'arquivos_marca', pasta: 'identidade', fields: [
      { k: 'categoria', label: 'Tipo', type: 'select', options: CAT }, { k: 'nome', label: 'Nome', req: true, placeholder: 'Logo principal' },
      { k: 'descricao', label: 'Descrição', full: true, placeholder: 'Sobre fundo escuro' },
      { k: 'previa', label: 'Prévia (imagem, para logos)', type: 'file', accept: 'image/*' },
      { k: 'formatos', label: 'Arquivos para baixar', type: 'formats' }],
    resumo: (r) => [r.nome, (CAT.find(([k]) => k === r.categoria) || [, ''])[1] + ' · ' + ((r.formatos || []).map((f) => f.formato).join(', ') || 'sem arquivos')] }],
    [lista, { icone: 'gota', titulo: 'Cores', tabela: 'cores', fields: [
      { k: 'nome', label: 'Nome', req: true, type: 'preset', presets: 'nomesCor' }, { k: 'hex', label: 'HEX', type: 'color', req: true, placeholder: '#111111' },
      { k: 'cmyk', label: 'CMYK', placeholder: '0 0 0 93' }, { k: 'pantone', label: 'Pantone', placeholder: 'Pantone 172 C' }],
    resumo: (r) => [el('span', null, el('span', { class: 'dot', style: 'background:' + r.hex }), r.nome), [r.hex, r.cmyk ? 'CMYK ' + r.cmyk : null, r.pantone].filter(Boolean).join(' · ')] }],
    [lista, { icone: 'letra', titulo: 'Tipografia', tabela: 'tipografias', fields: [{ k: 'nome', label: 'Fonte', req: true }, { k: 'uso', label: 'Uso', type: 'preset', presets: 'usosFonte' }], resumo: (r) => [r.nome, r.uso] }],
    [lista, { icone: 'forma', tom: 'gang', largo: true, titulo: 'Elementos da marca', nota: 'Degradê, textura, mascote, embalagem e o que mais a marca tiver. Só aparece para o cliente o que você cadastrar.', tabela: 'elementos_marca', pasta: 'identidade', fields: [
      { k: 'tipo', label: 'Tipo', type: 'select', options: EL },
      { k: 'nome', label: 'Nome', req: true, placeholder: 'Degradê principal' },
      { k: 'cores', label: 'Cores do degradê (só para degradê)', type: 'cores', placeholder: '#E5482A, #FFB36B' },
      { k: 'imagem', label: 'Imagem (textura, mascote, embalagem…)', type: 'file', accept: 'image/*' },
      { k: 'descricao', label: 'Como usar', full: true, type: 'textarea', rows: 2, placeholder: 'Fundo de posts e capas; nunca atrás do logo.' }],
    resumo: (r) => [el('span', null, r.tipo === 'degrade' && r.cores ? el('span', { class: 'dot dot--grad', style: 'background:linear-gradient(90deg,' + r.cores + ')' }) : null, r.nome),
      [EL_T[r.tipo], r.cores, r.imagem ? 'com imagem' : null, r.descricao].filter(Boolean).join(' · ')] }],
    [lista, { icone: 'pin', largo: true, titulo: 'Onde a nova marca já está', tabela: 'aplicacoes', fields: [
      { k: 'ponto_contato', label: 'Ponto de contato', req: true, type: 'preset', presets: 'pontosContato' }, { k: 'status', label: 'Situação', type: 'select', options: AP, def: 'prevista' },
      { k: 'data', label: 'Data', type: 'date' }],
    resumo: (r) => [r.ponto_contato, AP_T[r.status] + (r.data ? ' · ' + U.dia(r.data) : '')] }],
  ]);

  // ===== Implantação do cliente: o que já foi montado e o que falta (no topo de todas as abas, até ficar completo) =====
  const PASSOS = [
    ['diagnostico', 'Diagnóstico', 'O ponto de partida e a comparação com os concorrentes', async () => {
      const [d, i] = await Promise.all([sb.from('diagnosticos').select('empresa_id').eq('empresa_id', id).maybeSingle(), sb.from('impressoes').select('id').limit(1).eq('empresa_id', id)]);
      return !!d.data && (i.data || []).length > 0; }],
    ['estrategia', 'Estratégia', 'Objetivos, onde jogamos e o que acompanhamos', async () => {
      const [o, e] = await Promise.all([sb.from('objetivos').select('id').limit(1).eq('empresa_id', id), sb.from('escolhas').select('id').limit(1).eq('empresa_id', id)]);
      return (o.data || []).length > 0 && (e.data || []).length > 0; }],
    ['plataforma', 'Narrativa', 'Posicionamento, mensagem central e tom de voz', async () => {
      const r = await sb.from('plataformas').select('posicionamento, mensagem_central').eq('empresa_id', id).maybeSingle();
      return !!(r.data && r.data.posicionamento && r.data.mensagem_central); }],
    ['identidade', 'Identidade visual', 'Logos, cores e fontes', async () => {
      const [c, t] = await Promise.all([sb.from('cores').select('id').limit(1).eq('empresa_id', id), sb.from('tipografias').select('id').limit(1).eq('empresa_id', id)]);
      return (c.data || []).length > 0 && (t.data || []).length > 0; }],
    ['acoes', 'Plano de ações', 'As ações dos 18 meses', async () => {
      const r = await sb.from('acoes').select('id').limit(1).eq('empresa_id', id); return (r.data || []).length > 0; }],
    ['acessos', 'Acesso do cliente', 'O login para o cliente entrar no portal', async () => {
      const r = await sb.from('profiles').select('id').limit(1).eq('empresa_id', id).eq('role', 'client'); return (r.data || []).length > 0; }],
    ['resultados', 'Pesquisa de partida', 'A primeira rodada da pesquisa de marca', async () => {
      const r = await sb.from('pesquisas').select('id').limit(1).eq('empresa_id', id); return (r.data || []).length > 0; }],
  ];
  let implAberta = null;
  const implanta = async () => {
    const box = $('implanta'); if (!box) return;
    const feitos = await Promise.all(PASSOS.map(([, , , f]) => f().catch(() => false)));
    const n = feitos.filter(Boolean).length;
    if (n === PASSOS.length) { box.hidden = true; return; }
    const aqui = location.hash.slice(1);
    if (implAberta === null) implAberta = n < 3;
    const det = el('details', { class: 'implanta__det', open: implAberta },
      el('summary', 'implanta__s',
        el('span', { class: 'implanta__t', id: 'impl-t' }, 'Implantação do cliente'),
        el('span', 'implanta__n', n + ' de ' + PASSOS.length),
        el('span', { class: 'implanta__barra', 'aria-hidden': 'true' }, el('span', { style: 'width:' + Math.round((n / PASSOS.length) * 100) + '%' })),
        el('button', { class: 'btn btn--ghost btn--sm implanta__copia', type: 'button', onclick: (ev) => { ev.preventDefault(); abreCopia(); } }, 'Partir de outro cliente')),
      el('ol', 'implanta__lista', PASSOS.map(([tab, t, d], i) => el('li', 'implanta__i' + (feitos[i] ? ' is-ok' : '') + (tab === aqui ? ' is-aqui' : ''),
        el('span', 'implanta__q', feitos[i] ? '✓' : String(i + 1)),
        el('div', 'implanta__m', el('p', 'implanta__it', t), el('p', 'implanta__id', d)),
        feitos[i] ? el('span', 'implanta__ok', 'Pronto') : el('a', { class: 'btn btn--ghost btn--sm', href: '#' + tab }, tab === aqui ? 'Você está aqui' : 'Preencher')))));
    det.addEventListener('toggle', () => { implAberta = det.open; });
    box.replaceChildren(det); box.hidden = false;
  };
  implanta();
  window.addEventListener('hashchange', implanta);

  // ===== Partir de um cliente parecido: copia diagnóstico, estratégia e narrativa como ponto de partida =====
  const COPIAS = [
    ['Diagnóstico', [['fatores', 'O que todo cliente exige e o que faz escolher', (r) => ({ tipo: r.tipo, texto: r.texto, posicao: 'nao_entrega' })],
      ['causas', 'As causas que o plano ataca', (r) => ({ texto: r.texto })]]],
    ['Estratégia', [['objetivos', 'Objetivos', (r) => ({ nivel: r.nivel, titulo: r.titulo, destaque: r.destaque, notar: r.notar, acreditar: r.acreditar, sentir: r.sentir })],
      ['situacoes', 'Situações de compra', (r) => ({ texto: r.texto })],
      ['escolhas', 'Onde atuamos e o que deixamos de lado', (r) => ({ tipo: r.tipo, texto: r.texto })],
      ['condicoes', 'O que acompanhamos', (r) => ({ texto: r.texto, como_verificar: r.como_verificar, status: 'sem_dados' })]]],
    ['Narrativa', [['tom_atributos', 'Tom de voz', (r) => ({ nome: r.nome, descricao: r.descricao })],
      ['tom_exemplos', 'A marca diz e nunca diz', (r) => ({ tipo: r.tipo, texto: r.texto })],
      ['facetas', 'Quem a marca é (só as facetas vazias)', null]]],
  ];
  const abreCopia = async () => {
    const [{ data: emps }, { data: eu }] = await Promise.all([sb.from('empresas').select('id, nome, setor').neq('id', id).order('nome'), sb.from('empresas').select('setor').eq('id', id).maybeSingle()]);
    const setor = eu && eu.setor;
    const lista = (emps || []).sort((a, b) => (b.setor === setor) - (a.setor === setor));
    const nomeSet = (s) => ((window.GangPresets || {}).SETORES || {})[s] || s;
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const sel = el('select', { class: 'field', id: 'cp-de' }, lista.length ? lista.map((e) => el('option', { value: e.id }, e.nome + (e.setor ? ' · ' + nomeSet(e.setor) : '') + (setor && e.setor === setor ? ' (mesmo setor)' : ''))) : el('option', { value: '' }, 'Nenhum outro cliente'));
    const caixas = COPIAS.map(([g, itens]) => el('fieldset', 'copia__g', el('legend', 'label', g), itens.map(([t, rot]) =>
      el('label', 'copia__op', el('input', { type: 'checkbox', value: t, checked: true }), el('span', null, rot)))));
    const dlg = el('dialog', { class: 'dialog copia', 'aria-labelledby': 'cp-t' },
      el('form', { method: 'dialog', class: 'copia__f' },
        el('h2', { class: 'title-sm', id: 'cp-t' }, 'Partir de outro cliente'),
        el('p', 'small', 'Copia os itens como ponto de partida. Nada é apagado: o que já existe aqui fica, e itens iguais não se repetem. Depois, ajuste ao cliente.'),
        el('div', null, el('label', { class: 'label', for: 'cp-de' }, 'Copiar de'), lista.length ? sel : el('p', 'copia__vazio', 'Ainda não há outro cliente para copiar. Assim que houver, ele aparece aqui.')),
        el('div', 'copia__gs', caixas),
        el('div', 'new-client__foot',
          el('button', { class: 'btn btn--light btn--sm', type: 'button', disabled: !lista.length, onclick: async (ev) => {
            const de = sel.value; if (!de) return;
            const marcadas = [...dlg.querySelectorAll('input[type=checkbox]:checked')].map((x) => x.value);
            ev.currentTarget.disabled = true; say(msg, 'Copiando…');
            let total = 0;
            for (const [, itens] of COPIAS) for (const [tab, , map] of itens) {
              if (!marcadas.includes(tab)) continue;
              if (tab === 'facetas') {
                const [{ data: src }, { data: dst }] = await Promise.all([sb.from('facetas').select('*').eq('empresa_id', de), sb.from('facetas').select('*').eq('empresa_id', id)]);
                const tem = new Set((dst || []).filter((f) => f.texto).map((f) => f.chave));
                const rows = (src || []).filter((f) => f.texto && !tem.has(f.chave)).map((f) => ({ empresa_id: id, chave: f.chave, texto: f.texto }));
                if (rows.length) { await sb.from('facetas').upsert(rows, { onConflict: 'empresa_id,chave' }); total += rows.length; }
                continue;
              }
              const [{ data: src }, { data: dst }] = await Promise.all([sb.from(tab).select('*').eq('empresa_id', de).order('ordem'), sb.from(tab).select('*').eq('empresa_id', id)]);
              const chave = (r) => [r.tipo || r.nivel || '', (r.texto || r.titulo || r.nome || '').trim().toLowerCase()].join('|');
              const ja = new Set((dst || []).map(chave));
              let ordem = (dst || []).reduce((m, x) => Math.max(m, x.ordem || 0), 0);
              const rows = (src || []).filter((r) => !ja.has(chave(r))).map((r) => ({ ...map(r), empresa_id: id, ordem: (ordem += 1) }));
              if (rows.length) { const r = await sb.from(tab).insert(rows); if (!r.error) total += rows.length; }
            }
            say(msg, total ? total + (total === 1 ? ' item copiado.' : ' itens copiados.') + ' Atualizando…' : 'Nada novo para copiar.', total ? 'ok' : null);
            if (total) setTimeout(() => location.reload(), 900); else ev.currentTarget.disabled = false;
          } }, 'Copiar'),
          el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => dlg.close() }, 'Cancelar'), msg)));
    dlg.addEventListener('close', () => dlg.remove());
    document.body.append(dlg); dlg.showModal();
  };
});
