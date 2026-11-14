/* Shared by the panel and the client portal: small DOM helpers, dates in pt-BR and the plan's month math */
(() => {
  const $ = (id) => document.getElementById(id);

  // el('p', 'small', 'texto') · el('a', {class:'link', href:'#'}, 'texto') · children can be nodes, strings or arrays
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    if (typeof attrs === 'string') n.className = attrs;
    else if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (v == null || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? '' : v);
      });
    }
    kids.flat(Infinity).forEach((k) => { if (k != null && k !== false) n.append(k instanceof Node ? k : String(k)); });
    return n;
  };

  const say = (node, text, kind) => { node.textContent = text || ''; node.className = 'msg' + (kind ? ' is-' + kind : ''); };

  // ===== dates =====
  // a plain date from the database ("2026-09-01") is a calendar day: read it at local midnight, not UTC
  const day = (v) => {
    if (!v) return null;
    if (v instanceof Date) return v;
    return /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(v + 'T00:00:00') : new Date(v);
  };
  const fmt = (v, opts) => (v ? new Intl.DateTimeFormat('pt-BR', opts).format(day(v)).replace(/\./g, '').replace(/ de /g, ' ') : '');
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

  const dia = (v) => fmt(v, { day: '2-digit', month: 'short' });                     // 12 dez
  const diaAno = (v) => fmt(v, { day: '2-digit', month: 'short', year: 'numeric' }); // 12 dez 2026
  const mesAno = (v) => fmt(v, { month: 'short', year: 'numeric' });   // ago 2026
  const hora = (v) => {
    const d = day(v);
    return d.getMinutes() ? fmt(d, { hour: '2-digit', minute: '2-digit' }).replace(':', 'h') : d.getHours() + 'h';
  };
  const quando = (v) => cap(fmt(v, { weekday: 'short' })) + ', ' + dia(v) + ' · ' + hora(v); // Qui, 12 dez · 10h

  // ===== months ("2026-11") =====
  const ref = (d) => { d = day(d) || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  const refDate = (r) => new Date(+r.slice(0, 4), +r.slice(5, 7) - 1, 1);
  const addRef = (r, n) => { const d = refDate(r); d.setMonth(d.getMonth() + n); return ref(d); };
  const nomeMes = (r) => fmt(refDate(r), { month: 'long' });         // novembro
  const nomeMesCurto = (r) => fmt(refDate(r), { month: 'short' });   // nov
  const mesesEntre = (a, b) => { const x = day(a); const y = day(b); return (y.getFullYear() - x.getFullYear()) * 12 + (y.getMonth() - x.getMonth()); };

  // which month of the plan we are in (1 … duração)
  const mesDoPlano = (plano, hoje = new Date()) => {
    if (!plano || !plano.inicio) return 1;
    return Math.min(Math.max(mesesEntre(plano.inicio, hoje) + 1, 1), plano.duracao_meses || 18);
  };

  const diasAte = (v) => { const d = day(v); const h = new Date(); h.setHours(0, 0, 0, 0); return Math.round((d - h) / 864e5); };

  const reais = (n) => (n == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n));
  const pct = (n, casas = 1) => (n == null ? '—' : (n > 0 ? '+' : '') + n.toLocaleString('pt-BR', { maximumFractionDigits: casas }) + '%');

  // "Lucca Barros" → "LB"; "Lucca" → "L"
  const iniciais = (nome) => {
    const p = String(nome || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return 'G';
    return ((p[0][0] || '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  };

  // a bolinha da pessoa: foto quando houver, senão as iniciais do nome
  const avatar = (node, nome, foto) => {
    if (!node) return;
    node.style.backgroundImage = foto ? 'url("' + encodeURI(foto) + '")' : '';
    node.textContent = foto ? '' : iniciais(nome);
    node.classList.toggle('tem-img', !!foto); // com imagem, ela ocupa o quadrado todo (sem moldura branca em volta)
  };

  // ===== lista de respostas prontas com "Outro…" (o consultor escolhe; só escreve quando nada serve) =====
  const OUTRO = '__outro';
  const combo = (idc, lista, valor, opts = {}) => {
    const itens = lista || [];
    const sel = el('select', { class: 'field', id: idc });
    sel.append(el('option', { value: '' }, opts.vazio || 'Escolha…'));
    const grupos = [...new Set(itens.map((i) => i.grupo))];
    if (opts.semGrupos) itens.forEach((i) => sel.append(el('option', { value: i.texto }, i.texto)));
    else grupos.forEach((gname) => sel.append(el('optgroup', { label: gname }, itens.filter((i) => i.grupo === gname).map((i) => el('option', { value: i.texto }, i.texto)))));
    sel.append(el('option', { value: OUTRO }, 'Outro… (escrever)'));
    const txt = el('input', { class: 'field combo__outro', id: idc + '-outro', maxlength: opts.max || 400, placeholder: opts.placeholder || 'Escreva', 'aria-label': 'Escreva outra opção' });
    const box = el('div', 'combo', sel, txt);
    const mostra = () => { txt.hidden = sel.value !== OUTRO; };
    const set = (v) => {
      if (!v) sel.value = '';
      else if (itens.some((i) => i.texto === v)) sel.value = v;
      else { sel.value = OUTRO; txt.value = v; }
      mostra();
    };
    sel.addEventListener('change', () => {
      mostra();
      if (sel.value === OUTRO) { txt.focus(); return; }
      const item = itens.find((i) => i.texto === sel.value);
      if (item && opts.onPick) opts.onPick(item);
    });
    set(valor);
    box.comboSet = set;
    rico(sel, box);
    return box;
  };
  // ===== lista de opções da plataforma: troca a lista nativa do navegador (que corta frases e não segue o visual) por uma própria.
  // O select continua no lugar, escondido: guarda o valor, dispara 'change' e funciona com formulários e com o código de sempre. =====
  const quebra = (s) => String(s || '').replace(/([.;]) (?=\S)/g, '$1\n');
  const VP = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const IP = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
  let aberto = null; // só uma lista aberta por vez
  const rico = (sel, box) => {
    if (sel._rico || sel.multiple || sel.size > 1 || sel.hasAttribute('data-nativo')) return;
    sel._rico = true;
    if (!box) { box = el('span', 'dd'); sel.before(box); box.append(sel); }
    box.classList.add('dd-box');
    sel.classList.add('combo__nativo'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    const btn = el('button', { type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false' });
    const pain = el('div', { class: 'combo__lista', role: 'listbox', hidden: true });
    const aria = sel.getAttribute('aria-label'); if (aria) btn.setAttribute('aria-label', aria);
    if (sel.id) { const lbl = document.querySelector('label[for="' + sel.id + '"]'); if (lbl) lbl.addEventListener('click', (e) => { e.preventDefault(); btn.focus(); }); }
    const placeholder = (o) => o.value === '' && /…$|^Escolha|^Mês$|^Ano$|^Selecione/.test(o.text.trim());
    const rotulo = () => {
      const o = sel.options[IP.get.call(sel)];
      const vazio = !o || placeholder(o);
      const txt = !o ? '' : o.value === OUTRO ? 'Outro (escrever)' : o.text; // fechado: uma linha só; a frase inteira aparece ao abrir
      btn.className = (sel.className.replace(/\bcombo__nativo\b/, '') + ' combo__btn').trim();
      btn.title = vazio ? '' : txt;
      btn.replaceChildren(el('span', 'combo__txt' + (vazio ? ' is-vazio' : ''), txt), el('span', { class: 'combo__seta', 'aria-hidden': 'true' }));
      btn.disabled = sel.disabled;
      btn.hidden = sel.hidden;
      if (sel.style.cssText) btn.style.cssText = sel.style.cssText;
    };
    const posiciona = () => {
      const r = btn.getBoundingClientRect(); const H = window.innerHeight;
      const baixo = H - r.bottom - 12, cima = r.top - 12;
      const praCima = baixo < 220 && cima > baixo;
      pain.style.left = Math.max(8, Math.min(r.left, window.innerWidth - Math.max(r.width, 220) - 8)) + 'px';
      pain.style.width = Math.max(r.width, 220) + 'px';
      pain.style.maxHeight = Math.min(420, praCima ? cima : baixo) + 'px';
      pain.style.top = praCima ? '' : r.bottom + 6 + 'px';
      pain.style.bottom = praCima ? H - r.top + 6 + 'px' : '';
    };
    const fecha = () => {
      if (pain.hidden) return;
      pain.hidden = true; pain.remove(); btn.setAttribute('aria-expanded', 'false'); if (aberto === fecha) aberto = null;
      document.removeEventListener('pointerdown', fora, true); document.removeEventListener('keydown', tecla, true);
      window.removeEventListener('scroll', rola, true); window.removeEventListener('resize', fecha);
    };
    const fora = (e) => { if (!pain.contains(e.target) && !btn.contains(e.target)) fecha(); };
    const rola = (e) => { if (!pain.contains(e.target)) fecha(); };
    const tecla = (e) => {
      if (e.key === 'Escape' || e.key === 'Tab') { fecha(); if (e.key === 'Escape') btn.focus(); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const os = [...pain.querySelectorAll('.combo__op')]; const i = os.indexOf(document.activeElement);
      (os[e.key === 'ArrowDown' ? Math.min(os.length - 1, i + 1) : Math.max(0, i - 1)] || os[0]).focus();
    };
    const escolhe = (v) => {
      const mudou = VP.get.call(sel) !== v;
      VP.set.call(sel, v); rotulo(); fecha();
      if (mudou) { sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); }
      if (v !== OUTRO) btn.focus();
    };
    const abre = () => {
      if (sel.disabled) return;
      if (aberto) aberto();
      const atual = VP.get.call(sel);
      const op = (o) => el('button', { type: 'button', role: 'option', class: 'combo__op' + (o.value === OUTRO ? ' combo__op--outro' : '') + (o.value === atual ? ' is-on' : ''),
        'aria-selected': String(o.value === atual), disabled: o.disabled || null, onclick: () => escolhe(o.value) }, o.value === OUTRO ? 'Outro (escrever)' : quebra(o.text));
      const itens = [];
      [...sel.children].forEach((n) => {
        if (n.tagName === 'OPTGROUP') { const os = [...n.children].filter((o) => !o.hidden); if (os.length) itens.push(el('p', 'combo__grupo', n.label), ...os.map(op)); }
        else if (n.tagName === 'OPTION' && !n.hidden && !placeholder(n)) itens.push(op(n));
      });
      pain.replaceChildren(...itens);
      pain.classList.toggle('is-curta', [...sel.options].every((o) => o.text.length < 40));
      document.body.append(pain); pain.hidden = false; posiciona();
      btn.setAttribute('aria-expanded', 'true'); aberto = fecha;
      document.addEventListener('pointerdown', fora, true); document.addEventListener('keydown', tecla, true);
      window.addEventListener('scroll', rola, true); window.addEventListener('resize', fecha);
      const on = pain.querySelector('.is-on'); (on || pain.querySelector('.combo__op') || btn).focus({ preventScroll: true });
      if (on) on.scrollIntoView({ block: 'nearest' });
    };
    btn.addEventListener('click', () => (pain.hidden ? abre() : fecha()));
    btn.addEventListener('keydown', (e) => { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && pain.hidden) { e.preventDefault(); abre(); } });
    sel.addEventListener('focus', () => btn.focus());
    sel.addEventListener('change', rotulo);
    // o código da plataforma muda o valor direto (sel.value = …): a etiqueta acompanha
    Object.defineProperty(sel, 'value', { configurable: true, get() { return VP.get.call(sel); }, set(v) { VP.set.call(sel, v); rotulo(); } });
    Object.defineProperty(sel, 'selectedIndex', { configurable: true, get() { return IP.get.call(sel); }, set(v) { IP.set.call(sel, v); rotulo(); } });
    new MutationObserver(rotulo).observe(sel, { attributes: true, attributeFilter: ['disabled', 'hidden', 'class', 'style'], childList: true, subtree: true, characterData: true });
    if (sel.form) sel.form.addEventListener('reset', () => setTimeout(rotulo));
    sel.before(btn);
    rotulo();
  };
  // ===== dias da semana: lista que abre com caixas de marcar; o valor fica num campo escondido, em texto ("terças e quintas") =====
  const DIAS = [['segundas', 'Segunda'], ['tercas', 'Terça'], ['quartas', 'Quarta'], ['quintas', 'Quinta'], ['sextas', 'Sexta'], ['sabados', 'Sábado'], ['domingos', 'Domingo']];
  const DIAS_TXT = ['segundas', 'terças', 'quartas', 'quintas', 'sextas', 'sábados', 'domingos'];
  const semAc = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const diasLer = (t) => { // texto salvo → índices dos dias marcados
    const s = semAc(t);
    if (/todos os dias/.test(s)) return [0, 1, 2, 3, 4, 5, 6];
    if (/dias uteis/.test(s)) return [0, 1, 2, 3, 4];
    return DIAS.map(([k], i) => (s.includes(k.slice(0, 4)) ? i : -1)).filter((i) => i >= 0);
  };
  const juntaE = (xs) => (xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' e ' + xs[xs.length - 1]);
  const diasTexto = (idx) => (idx.length === 7 ? 'todos os dias' : juntaE(idx.slice().sort((a, b) => a - b).map((i) => DIAS_TXT[i])));
  // para frases do portal: "às terças e quintas", "aos sábados", "às sextas e aos sábados", "todos os dias"
  const diasComArtigo = (t) => {
    const idx = diasLer(t);
    if (!idx.length) return 'às ' + t; // texto antigo que não é lista de dias: mantém como estava
    if (idx.length === 7) return 'todos os dias';
    const fem = idx.filter((i) => i < 5); const mas = idx.filter((i) => i >= 5);
    if (!mas.length) return 'às ' + diasTexto(fem);
    if (!fem.length) return 'aos ' + diasTexto(mas);
    return 'às ' + diasTexto(fem) + ' e aos ' + diasTexto(mas);
  };
  const diasSemana = (input, opts = {}) => { // input: campo escondido que guarda o texto
    const btn = el('button', { type: 'button', class: 'field combo__btn', 'aria-haspopup': 'true', 'aria-expanded': 'false', id: input.id + '-btn' });
    const pain = el('div', { class: 'combo__lista is-curta dias__lista', hidden: true });
    const caixas = DIAS.map(([k, nome], i) => el('label', 'combo__op dias__op', el('input', { type: 'checkbox', value: String(i) }), nome));
    pain.append(...caixas);
    const marcados = () => caixas.map((c, i) => (c.querySelector('input').checked ? i : -1)).filter((i) => i >= 0);
    const rotulo = () => {
      const v = input.value;
      btn.replaceChildren(el('span', 'combo__txt' + (v ? '' : ' is-vazio'), v ? v.charAt(0).toUpperCase() + v.slice(1) : opts.vazio || 'Escolha os dias'), el('span', { class: 'combo__seta', 'aria-hidden': 'true' }));
    };
    const sincroniza = () => { const idx = diasLer(input.value); caixas.forEach((c, i) => { c.querySelector('input').checked = idx.includes(i); c.classList.toggle('is-on', idx.includes(i)); }); rotulo(); };
    pain.addEventListener('change', () => {
      const idx = marcados(); caixas.forEach((c, i) => c.classList.toggle('is-on', idx.includes(i)));
      input.value = idx.length ? diasTexto(idx) : ''; rotulo();
      input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const posiciona = () => { const r = btn.getBoundingClientRect(); pain.style.left = r.left + 'px'; pain.style.width = Math.max(r.width, 220) + 'px'; pain.style.top = r.bottom + 6 + 'px'; pain.style.maxHeight = Math.max(200, window.innerHeight - r.bottom - 18) + 'px'; };
    const fecha = () => { if (pain.hidden) return; pain.hidden = true; pain.remove(); btn.setAttribute('aria-expanded', 'false'); if (aberto === fecha) aberto = null;
      document.removeEventListener('pointerdown', fora, true); document.removeEventListener('keydown', tecla, true); window.removeEventListener('scroll', rola, true); window.removeEventListener('resize', fecha); };
    const fora = (e) => { if (!pain.contains(e.target) && !btn.contains(e.target)) fecha(); };
    const rola = (e) => { if (!pain.contains(e.target)) fecha(); };
    const tecla = (e) => { if (e.key === 'Escape' || e.key === 'Tab') { fecha(); if (e.key === 'Escape') btn.focus(); } };
    const abre = () => { if (aberto) aberto(); sincroniza(); document.body.append(pain); pain.hidden = false; posiciona(); btn.setAttribute('aria-expanded', 'true'); aberto = fecha;
      document.addEventListener('pointerdown', fora, true); document.addEventListener('keydown', tecla, true); window.addEventListener('scroll', rola, true); window.addEventListener('resize', fecha);
      caixas[0].querySelector('input').focus({ preventScroll: true }); };
    btn.addEventListener('click', () => (pain.hidden ? abre() : fecha()));
    const lbl = document.querySelector('label[for="' + input.id + '"]'); if (lbl) lbl.setAttribute('for', btn.id);
    // o código da plataforma muda o valor direto (input.value = …): a etiqueta acompanha
    const VI = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    Object.defineProperty(input, 'value', { configurable: true, get() { return VI.get.call(input); }, set(v) { VI.set.call(input, v); sincroniza(); } });
    input.after(btn); sincroniza();
    return btn;
  };
  const comboValue = (idc) => {
    const sel = document.getElementById(idc);
    if (!sel) return null;
    const v = sel.value === OUTRO ? document.getElementById(idc + '-outro').value.trim() : sel.value;
    return v || null;
  };
  const comboSet = (idc, v) => { const sel = document.getElementById(idc); if (sel && sel.parentElement.comboSet) sel.parentElement.comboSet(v); };

  // várias respostas prontas (ex.: pauta): caixas de seleção + um campo para o que faltar, uma por linha
  const multi = (idc, lista, valores, opts = {}) => {
    const v = valores || [];
    const itens = lista || [];
    const extras = v.filter((x) => !itens.some((i) => i.texto === x));
    const caixas = itens.map((i, n) => el('label', 'chk multi__opt', el('input', { type: 'checkbox', value: i.texto, checked: v.includes(i.texto) }), i.texto));
    const outro = el('textarea', { class: 'field', id: idc + '-outro', rows: 2, placeholder: opts.placeholder || 'Outros itens (um por linha)', 'aria-label': 'Outros itens' });
    outro.value = extras.join('\n');
    return el('div', { class: 'multi', id: idc }, el('div', 'multi__opts', caixas), outro);
  };
  const multiValue = (idc) => {
    const box = document.getElementById(idc);
    if (!box) return [];
    const marc = [...box.querySelectorAll('input[type=checkbox]:checked')].map((i) => i.value);
    const ext = document.getElementById(idc + '-outro').value.split('\n').map((x) => x.trim()).filter(Boolean);
    return [...marc, ...ext];
  };

  // datas sempre em português: os campos nativos de data, mês e hora seguem o idioma do navegador (em inglês viram "November 2026",
  // mm/dd/yyyy, AM/PM). Aqui eles viram campos próprios em pt-BR; o .value continua no formato do banco (AAAA-MM-DD, AAAA-MM, HH:MM).
  const MESES_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const nativo = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  const getN = (n) => nativo.get.call(n); const setN = (n, v) => nativo.set.call(n, v);
  const mascara = (n, partes, sep) => n.addEventListener('input', () => {
    const d = getN(n).replace(/\D/g, '').slice(0, partes.reduce((a, b) => a + b, 0));
    let out = ''; let i = 0;
    partes.forEach((t, k) => { const seg = d.slice(i, i + t); if (seg) out += (k ? sep : '') + seg; i += t; });
    setN(n, out);
  });
  const viraData = (n) => {
    const iso = getN(n); n.type = 'text'; n.inputMode = 'numeric'; n.autocomplete = 'off'; n.placeholder = n.placeholder || 'dd/mm/aaaa'; n.maxLength = 10;
    Object.defineProperty(n, 'value', {
      configurable: true,
      get() { const m = getN(n).match(/^(\d{2})\/(\d{2})\/(\d{4})$/); if (!m) return ''; const dt = new Date(+m[3], +m[2] - 1, +m[1]); return dt.getMonth() === +m[2] - 1 ? m[3] + '-' + m[2] + '-' + m[1] : ''; },
      set(v) { const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})/); setN(n, m ? m[3] + '/' + m[2] + '/' + m[1] : ''); },
    });
    mascara(n, [2, 2, 4], '/'); n.value = iso;
    calendario(n);
  };
  // ===== calendário: ícone dentro do campo de data; abre no mês da data escolhida (ou no mês atual) =====
  const SEM = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const isoDe = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  let calAberto = null;
  const calendario = (n) => {
    if (n._cal) return; n._cal = true;
    const caixa = el('span', 'dt'); n.before(caixa); caixa.append(n);
    const btn = el('button', { type: 'button', class: 'dt__btn', 'aria-label': 'Abrir calendário', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' });
    caixa.append(btn);
    const pain = el('div', { class: 'dtcal', role: 'dialog', 'aria-label': 'Escolher data' });
    let vis; // primeiro dia do mês mostrado
    const escolhe = (iso) => {
      n.value = iso; n.dispatchEvent(new Event('input', { bubbles: true })); n.dispatchEvent(new Event('change', { bubbles: true }));
      fecha(); n.focus();
    };
    const desenha = () => {
      const hoje = isoDe(new Date()); const sel = n.value;
      const ini = new Date(vis.getFullYear(), vis.getMonth(), 1);
      const pula = ini.getDay(); const total = new Date(vis.getFullYear(), vis.getMonth() + 1, 0).getDate();
      const dias = [];
      for (let i = 0; i < pula; i += 1) dias.push(el('span', 'dtcal__vazio'));
      for (let d = 1; d <= total; d += 1) {
        const iso = isoDe(new Date(vis.getFullYear(), vis.getMonth(), d));
        dias.push(el('button', { type: 'button', class: 'dtcal__dia' + (iso === hoje ? ' is-hoje' : '') + (iso === sel ? ' is-on' : ''), 'aria-label': d + ' de ' + MESES_PT[vis.getMonth()], 'aria-pressed': String(iso === sel), onclick: () => escolhe(iso) }, String(d)));
      }
      const muda = (k) => { vis = new Date(vis.getFullYear(), vis.getMonth() + k, 1); desenha(); };
      pain.replaceChildren(
        el('div', 'dtcal__topo',
          el('button', { type: 'button', class: 'dtcal__nav', 'aria-label': 'Mês anterior', onclick: () => muda(-1) }, '‹'),
          el('p', 'dtcal__mes', MESES_PT[vis.getMonth()] + ' ' + vis.getFullYear()),
          el('button', { type: 'button', class: 'dtcal__nav', 'aria-label': 'Próximo mês', onclick: () => muda(1) }, '›')),
        el('div', 'dtcal__sem', SEM.map((s) => el('span', null, s))),
        el('div', 'dtcal__dias', dias),
        el('div', 'dtcal__pe',
          el('button', { type: 'button', class: 'dtcal__link', onclick: () => escolhe(hoje) }, 'Hoje'),
          n.value ? el('button', { type: 'button', class: 'dtcal__link', onclick: () => escolhe('') }, 'Limpar') : null));
    };
    const posiciona = () => {
      const r = caixa.getBoundingClientRect(); const H = window.innerHeight; const W = 280;
      const praCima = H - r.bottom < 340 && r.top > H - r.bottom;
      pain.style.left = Math.max(8, Math.min(r.right - W, window.innerWidth - W - 8)) + 'px';
      pain.style.top = praCima ? '' : r.bottom + 6 + 'px';
      pain.style.bottom = praCima ? H - r.top + 6 + 'px' : '';
    };
    const fora = (e) => { if (!pain.contains(e.target) && !caixa.contains(e.target)) fecha(); };
    const tecla = (e) => { if (e.key === 'Escape') { fecha(); btn.focus(); } };
    const rola = (e) => { if (!pain.contains(e.target)) fecha(); };
    const fecha = () => {
      if (!pain.isConnected) return;
      pain.remove(); btn.setAttribute('aria-expanded', 'false'); if (calAberto === fecha) calAberto = null;
      document.removeEventListener('pointerdown', fora, true); document.removeEventListener('keydown', tecla, true);
      window.removeEventListener('scroll', rola, true); window.removeEventListener('resize', fecha);
    };
    const abre = () => {
      if (n.disabled || n.readOnly) return;
      if (calAberto) calAberto();
      const atual = n.value ? new Date(n.value + 'T12:00') : new Date();
      vis = new Date(atual.getFullYear(), atual.getMonth(), 1);
      desenha(); document.body.append(pain); posiciona();
      btn.setAttribute('aria-expanded', 'true'); calAberto = fecha;
      document.addEventListener('pointerdown', fora, true); document.addEventListener('keydown', tecla, true);
      window.addEventListener('scroll', rola, true); window.addEventListener('resize', fecha);
      (pain.querySelector('.dtcal__dia.is-on') || pain.querySelector('.dtcal__dia.is-hoje') || pain.querySelector('.dtcal__dia')).focus({ preventScroll: true });
    };
    btn.addEventListener('click', () => (pain.isConnected ? fecha() : abre()));
    n.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' && e.altKey) { e.preventDefault(); abre(); } });
    new MutationObserver(() => { btn.disabled = n.disabled || n.readOnly; caixa.hidden = n.hidden; }).observe(n, { attributes: true, attributeFilter: ['disabled', 'readonly', 'hidden'] });
  };
  const viraHora = (n) => {
    const v0 = getN(n); n.type = 'text'; n.inputMode = 'numeric'; n.autocomplete = 'off'; n.placeholder = n.placeholder || '00:00'; n.maxLength = 5;
    Object.defineProperty(n, 'value', {
      configurable: true,
      get() { const m = getN(n).match(/^(\d{2}):(\d{2})$/); return m && +m[1] < 24 && +m[2] < 60 ? getN(n) : ''; },
      set(v) { const m = String(v || '').match(/^(\d{2}):(\d{2})/); setN(n, m ? m[1] + ':' + m[2] : ''); },
    });
    mascara(n, [2, 2], ':'); n.value = v0;
  };
  const viraMes = (n) => {
    const v0 = getN(n); const id = n.id;
    const ano = new Date().getFullYear();
    const mSel = el('select', { class: 'field', id: id ? id + '__m' : null, 'aria-label': 'Mês' }, el('option', { value: '' }, 'Mês'), MESES_PT.map((t, i) => el('option', { value: String(i + 1).padStart(2, '0') }, t)));
    const ySel = el('select', { class: 'field', 'aria-label': 'Ano' }, el('option', { value: '' }, 'Ano'));
    const anos = (y) => { if (y && ![...ySel.options].some((o) => o.value === y)) { ySel.append(el('option', { value: y }, y)); [...ySel.options].slice(1).sort((a, b) => a.value - b.value).forEach((o) => ySel.append(o)); } };
    for (let y = ano - 3; y <= ano + 4; y += 1) anos(String(y));
    const caixa = el('div', 'mes-pt', mSel, ySel);
    n.type = 'hidden'; n.after(caixa);
    const lbl = id && document.querySelector('label[for="' + id + '"]'); if (lbl) lbl.htmlFor = mSel.id;
    if (n.getAttribute('aria-label')) mSel.setAttribute('aria-label', n.getAttribute('aria-label') + ': mês');
    Object.defineProperty(n, 'value', {
      configurable: true,
      get() { return getN(n); },
      set(v) { const m = String(v || '').match(/^(\d{4})-(\d{2})/); setN(n, m ? m[1] + '-' + m[2] : ''); anos(m ? m[1] : null); mSel.value = m ? m[2] : ''; ySel.value = m ? m[1] : ''; },
    });
    const muda = () => { setN(n, mSel.value && ySel.value ? ySel.value + '-' + mSel.value : ''); n.dispatchEvent(new Event('input', { bubbles: true })); n.dispatchEvent(new Event('change', { bubbles: true })); };
    mSel.addEventListener('change', () => { if (mSel.value && !ySel.value) ySel.value = String(ano); muda(); });
    ySel.addEventListener('change', muda);
    n.value = v0;
  };
  // seletor de arquivo em português: o botão nativo segue o idioma do navegador, então vira um botão nosso
  const viraArquivo = (n) => {
    const nome = document.createElement('span'); nome.className = 'arq__nome';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'arq__btn';
    btn.textContent = n.multiple ? 'Escolher arquivos' : 'Escolher arquivo';
    const caixa = document.createElement('span'); caixa.className = n.className + ' arq';
    n.parentNode.insertBefore(caixa, n); caixa.append(btn, nome, n);
    n.classList.add('arq__input'); n.tabIndex = -1;
    const mostra = () => {
      const f = n.files || [];
      nome.textContent = !f.length ? 'Nenhum arquivo escolhido' : f.length === 1 ? f[0].name : f.length + ' arquivos';
      nome.classList.toggle('is-vazio', !f.length);
    };
    btn.addEventListener('click', () => n.click());
    n.addEventListener('change', mostra);
    if (n.form) n.form.addEventListener('reset', () => setTimeout(mostra));
    mostra();
  };
  const traduzDatas = (raiz) => {
    if (!raiz.querySelectorAll) return;
    raiz.querySelectorAll('input[type=file]').forEach((n) => {
      if (n.dataset.pt || !n.parentNode) return; n.dataset.pt = '1'; viraArquivo(n);
    });
    raiz.querySelectorAll('input[type=date], input[type=month], input[type=time]').forEach((n) => {
      if (n.dataset.pt) return; n.dataset.pt = '1';
      ({ date: viraData, month: viraMes, time: viraHora })[n.type](n);
    });
  };
  traduzDatas(document);
  // todas as listas da plataforma usam a lista própria (as que aparecem depois também)
  const ricos = (raiz) => { if (!raiz.querySelectorAll) return; (raiz.tagName === 'SELECT' ? [raiz] : raiz.querySelectorAll('select')).forEach((s) => { if (!s.closest('.combo') || s.parentElement.classList.contains('combo')) rico(s, s.parentElement.classList.contains('combo') ? s.parentElement : null); }); };
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((x) => { if (x.nodeType === 1) { traduzDatas(x.parentNode || x); ricos(x); } }))).observe(document.documentElement, { childList: true, subtree: true });
  ricos(document);

  // dinheiro: campos com data-moeda viram "R$ 2.500,00" enquanto se digita (os números entram pela direita, como numa calculadora)
  const moedaFmt = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? '' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  const moedaValor = (n) => { const d = String((n && n.value) || '').replace(/\D/g, ''); return d ? Number(d) / 100 : null; };
  const moedaSet = (n, v) => { if (n) n.value = moedaFmt(v); };
  document.addEventListener('input', (ev) => {
    const n = ev.target;
    if (!n.matches || !n.matches('input[data-moeda]')) return;
    const d = n.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 13);
    n.value = d ? moedaFmt(Number(d) / 100) : '';
  });
  // qual parte da promessa a ação move. Usa o que o consultor marcou; sem isso, deduz pelo texto da ação.
  const PROMESSAS = { vendas: 'Venda mais', pessoas: 'Para mais pessoas', valor: 'Com mais valor' };
  // tipo de esforço pelos estudos de eficácia: marca (comunicação de longo prazo, ampla), ativação (comunicação de curto prazo,
  // para quem já está comprando) e base (proposta, preço, atendimento, processo, medição: fora da conta marca × ativação)
  const tipoEsforco = (a) => {
    if (!a) return null;
    if (a.tipo) return a.tipo;
    const lib = ((window.GangPresets || {}).acoes || []).find((x) => x.texto === a.titulo);
    if (lib && lib.tipo) return lib.tipo;
    // revisões, rodadas da pesquisa e a chegada são medição: base, fora da conta marca × ativação
    if (/^(Revisão|Chegada|Lançar a pesquisa de partida|Segunda rodada da pesquisa|Pesquisa de marca de)/.test(a.titulo || '')) return 'base';
    return a.esforco === 'marca' ? 'marca' : a.esforco === 'venda' ? 'ativacao' : null;
  };
  const pesoTamanho = (a) => ({ P: 1, M: 2, G: 4 }[a && (a.tamanho || a.tam)] || 2);
  const promessaDe = (a) => {
    if (a && PROMESSAS[a.promessa]) return a.promessa;
    const t = String([a && a.titulo, a && a.porque, a && a.metrica_sucesso].join(' ')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (/preco|ticket|desconto|premium|valor|margem|embalagem|experiencia|atendimento|especialista|posiciona/.test(t)) return 'valor';
    if (/alcance|novos clientes|nunca compr|ainda nao|indica|encontr|google|mapa|marketplace|situac|lembr|reconhec|visibil|publico|divulg|parceri|ativos/.test(t)) return 'pessoas';
    return 'vendas';
  };
  // ===== busca rápida no menu lateral (atalho "/"), como nas referências =====
  // ===== busca da plataforma inteira (atalho "/"): páginas do menu + o que cada tela registra (ações, encontros, clientes…) =====
  // cada página registra fontes com GangUI.buscaFonte(() => [{ grupo, titulo, sub, href, onclick, extra }])
  const FONTES = [];
  const buscaFonte = (fn) => { FONTES.push(fn); };
  const buscaMenu = () => {
    const nav = document.querySelector('.side__nav'); if (!nav || nav.querySelector('.qsearch')) return;
    const box = el('label', 'qsearch');
    const inp = el('input', { type: 'search', placeholder: 'Buscar na plataforma…', 'aria-label': 'Buscar na plataforma', autocomplete: 'off', role: 'combobox', 'aria-expanded': 'false', 'aria-controls': 'qsearch-res' });
    box.append(el('span', { class: 'qsearch__ico', 'aria-hidden': 'true' }), inp, el('kbd', 'qsearch__kbd', '/'));
    nav.prepend(box);
    const pop = el('div', { class: 'qres', id: 'qsearch-res', role: 'listbox', hidden: true });
    document.body.append(pop);
    const sem = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    let itens = []; let ativo = 0;
    const paginas = () => [...nav.querySelectorAll('.side__link')].map((a) => ({ grupo: 'Páginas', titulo: a.querySelector('span').textContent, href: a.getAttribute('href'), onclick: null }));
    const posiciona = () => {
      const r = box.getBoundingClientRect();
      pop.style.left = Math.round(r.left) + 'px'; pop.style.top = Math.round(r.bottom + 6) + 'px';
      pop.style.width = Math.round(Math.min(440, window.innerWidth - r.left - 12)) + 'px';
    };
    const fecha = () => { pop.hidden = true; inp.setAttribute('aria-expanded', 'false'); };
    const vai = (x) => {
      fecha(); inp.value = ''; inp.blur();
      if (x.onclick) x.onclick();
      if (x.href) { if (location.hash === x.href || location.href.endsWith(x.href)) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.href = x.href; }
    };
    const desenha = () => {
      const q = sem(inp.value.trim());
      if (!q) { fecha(); return; }
      let todos = paginas();
      FONTES.forEach((f) => { try { todos = todos.concat(f() || []); } catch (e) { /* uma fonte com erro não derruba a busca */ } });
      const termos = q.split(/\s+/);
      itens = todos.filter((x) => { const t = sem(x.titulo + ' ' + (x.sub || '') + ' ' + (x.extra || '') + ' ' + x.grupo); return termos.every((w) => t.includes(w)); })
        .sort((a, b) => (sem(b.titulo).startsWith(q) - sem(a.titulo).startsWith(q))).slice(0, 30);
      ativo = 0;
      const grupos = [...new Set(itens.map((x) => x.grupo))];
      pop.replaceChildren(...(itens.length ? [el('p', 'qres__n', itens.length + (itens.length === 1 ? ' resultado' : ' resultados'))].concat(grupos.map((g) => el('div', 'qres__grupo',
        el('p', 'qres__g', g),
        itens.filter((x) => x.grupo === g).map((x) => {
          const k = itens.indexOf(x);
          return el('a', { class: 'qres__item' + (k === ativo ? ' is-on' : ''), href: x.href || '#', role: 'option', 'data-k': k,
            onclick: (e) => { e.preventDefault(); vai(x); }, onmouseenter: () => marca(k) },
            el('span', 'qres__t', x.titulo), x.sub ? el('span', 'qres__s', x.sub) : null);
        }))))
        : [el('div', 'vazio vazio--sm', el('span', 'vazio__ico'), el('p', 'vazio__t', 'Nada encontrado'), el('p', 'vazio__d', 'Tente outra palavra.'))]));
      posiciona(); pop.hidden = false; inp.setAttribute('aria-expanded', 'true');
    };
    const marca = (k) => {
      ativo = k;
      pop.querySelectorAll('.qres__item').forEach((n) => n.classList.toggle('is-on', +n.dataset.k === k));
      const on = pop.querySelector('.qres__item.is-on'); if (on) on.scrollIntoView({ block: 'nearest' });
    };
    inp.addEventListener('input', desenha);
    inp.addEventListener('focus', () => { if (inp.value.trim()) desenha(); });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { inp.value = ''; fecha(); inp.blur(); }
      if (pop.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); marca(Math.min(itens.length - 1, ativo + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); marca(Math.max(0, ativo - 1)); }
      if (e.key === 'Enter') { e.preventDefault(); if (itens[ativo]) vai(itens[ativo]); }
    });
    document.addEventListener('click', (e) => { if (!pop.contains(e.target) && !box.contains(e.target)) fecha(); });
    window.addEventListener('resize', () => { if (!pop.hidden) posiciona(); });
    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target; if (t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      const side = document.querySelector('.side'); if (side && getComputedStyle(nav).display === 'none') { side.classList.add('is-open'); }
      inp.focus();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buscaMenu); else buscaMenu();

  // ===== subtítulos de seção: uma frase por linha (quebra depois de cada ponto final) =====
  const SUBT = '.verdict__q, .cmsg__q, .insight > span:last-child, .box__empty, .screen__lead, .res-part__d, .res-painel__d, .box__title + .box__text, .box__head + .box__text, .app-section__head .small, .app-section__head + .small, .app-section > .small, .lib summary .small, .box__text, .gh__nota, .vazio__d, .vz__d, .ed-head__n, .gl__s, .oc__sub, .cerne__vazio, .aviso-tg__d, .qrdlg__d, .implanta__id, .atencao__t, .sv-cab p, .field-hint, .clients__empty';
  const FIM = /([.!?…])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ“"(0-9])/g;
  // sem palavra órfã: a última palavra de cada frase fica presa à anterior (espaço que não quebra)
  const semOrfa = (linha) => (linha.split(' ').length >= 3 ? linha.replace(/ (\S+)$/, '\u00a0$1') : linha);
  const frases = () => {
    document.querySelectorAll(SUBT).forEach((n) => {
      if (n.children.length || n.dataset.frases === n.textContent) return;
      const t = n.textContent.replace(/[ \t]*\n[ \t]*/g, ' ').trim(); // mantém os espaços que não quebram escritos no texto (para escolher onde a linha quebra)
      const q = t.replace(FIM, '$1\n').replace(/;\s+/g, ';\n').split('\n').map(semOrfa).join('\n');
      if (q !== n.textContent) n.textContent = q;
      n.dataset.frases = n.textContent; n.classList.add('is-frases');
    });
    // demais textos corridos: só prende a última palavra
    document.querySelectorAll('.pmain p, .admin-main p, .pmain dd').forEach((n) => {
      if (n.children.length || n.dataset.orfa === n.textContent || n.classList.contains('is-frases')) return;
      const q = semOrfa(n.textContent.replace(/\s+$/, ''));
      if (q !== n.textContent) n.textContent = q;
      n.dataset.orfa = n.textContent;
    });
  };
  let fq = 0;
  const agenda = () => { if (!fq) fq = requestAnimationFrame(() => { fq = 0; frases(); }); };
  const iniciaFrases = () => { frases(); new MutationObserver(agenda).observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciaFrases); else iniciaFrases();

  // soma dias a uma data AAAA-MM-DD (para "medir em")
  const addDias = (iso, n) => { const d = new Date(String(iso).slice(0, 10) + 'T12:00:00'); d.setDate(d.getDate() + Number(n || 0)); return d.toLocaleDateString('sv-SE'); };
  // barra lateral sem rolagem: mantém o espaçamento do desktop e só aperta (em 3 níveis) quando não cabe na altura da tela
  const ajustaLado = () => {
    const side = document.querySelector('.side');
    if (!side || window.innerWidth <= 860) { if (side) side.classList.remove('side--c1', 'side--c2', 'side--c3'); return; }
    side.classList.remove('side--c1', 'side--c2', 'side--c3');
    for (const n of ['side--c1', 'side--c2', 'side--c3']) {
      if (side.scrollHeight <= side.clientHeight + 1) break;
      side.classList.remove('side--c1', 'side--c2', 'side--c3'); side.classList.add(n);
    }
  };
  let ajT = null; const ajusta = () => { clearTimeout(ajT); ajT = setTimeout(ajustaLado, 60); };
  // ===== encolher a barra lateral: só os ícones (preferência guardada neste navegador) =====
  const MINI = 'gang-side-mini';
  const lerMini = () => { try { return localStorage.getItem(MINI) === '1'; } catch (e) { return false; } };
  if (lerMini()) document.documentElement.classList.add('side-mini');
  let abrindoT = null;
  const poeMini = (on) => {
    // ao abrir, o selo do plano só aparece quando a barra termina de se estender (antes, ele quebraria a linha e pularia)
    const h = document.documentElement; clearTimeout(abrindoT);
    if (!on && h.classList.contains('side-mini')) { h.classList.add('side-abrindo'); abrindoT = setTimeout(() => h.classList.remove('side-abrindo'), 300); }
    else h.classList.remove('side-abrindo');
    document.documentElement.classList.toggle('side-mini', on);
    try { localStorage.setItem(MINI, on ? '1' : '0'); } catch (e) { /* sem armazenamento: vale só nesta página */ }
    const b = document.querySelector('.side__mini');
    if (b) { b.setAttribute('aria-expanded', String(!on)); b.setAttribute('aria-label', on ? 'Abrir a barra lateral' : 'Encolher a barra lateral'); b.title = b.getAttribute('aria-label'); }
    ajusta();
  };
  const botaoMini = () => {
    const side = document.querySelector('.side'); if (!side || document.querySelector('.side__mini')) return;
    const b = el('button', { class: 'side__mini', type: 'button', 'aria-controls': side.id || 'side-nav', onclick: () => poeMini(!document.documentElement.classList.contains('side-mini')) });
    b.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 4 4.5 8l4 4"/><path d="M12 4 8 8l4 4"/></svg>';
    document.body.append(b);
    poeMini(lerMini());
    // encolhida, o nome de cada item aparece ao passar o mouse
    const titulos = () => side.querySelectorAll('.side__link').forEach((a) => { const s = a.querySelector('span:not(.side__ind):not(.cli-logo)'); if (s && !a.title) a.title = s.textContent.trim(); });
    titulos(); if (window.MutationObserver) new MutationObserver(titulos).observe(side, { childList: true, subtree: true });
    // a busca encolhida vira só a lupa: clicar abre a barra e já põe o cursor no campo
    side.addEventListener('click', (e) => {
      const q = e.target.closest && e.target.closest('.qsearch');
      if (!q || !document.documentElement.classList.contains('side-mini')) return;
      e.preventDefault(); poeMini(false); const i = q.querySelector('input'); if (i) setTimeout(() => i.focus(), 0);
    });
    document.addEventListener('keydown', (e) => { if (e.key === '/' && document.documentElement.classList.contains('side-mini') && !(e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]'))) poeMini(false); }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', botaoMini); else botaoMini();
  window.addEventListener('resize', ajusta);
  document.addEventListener('DOMContentLoaded', () => {
    ajustaLado();
    const side = document.querySelector('.side');
    // o menu muda de altura quando entram avisos, o consultor ou o nome: reavalia
    if (side && window.MutationObserver) new MutationObserver(ajusta).observe(side, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  });
  // divisão marca:ativação de referência por setor (Binet & Field, Effectiveness in Context; B2B: Código de Eficácia B2B)
  const ESFORCO_SETOR = { b2b: 45, varejo: 64, loja_online: 64, servicos: 51, saude: 51, beleza: 51, educacao: 51, alimentacao: 51, tecnologia: 62 };
  const esforcoPadrao = (setor) => ESFORCO_SETOR[setor] || 62;
  // lançamento (35%): mais ativação no 1º ano para gerar experimentação, e depois ~57% de marca. Muitos lançamentos
  // fracassam por não virar a tempo (Effectiveness in Context, p.77 e p.133). A virada é automática no 13º mês do plano.
  const LANC = 35; const POS_LANC = 57;
  // quantos meses de passado a ação precisa para fazer sentido numa marca nova (0 = nenhum)
  // revisar peças precisa de peças publicadas; comparar com o ano anterior precisa de um ano; ouvir clientes precisa de clientes
  const mesesDeHistorico = (t) => {
    if (/(ano passado|ano anterior|mesmo período do ano)/i.test(t)) return 12;
    if (/últimos 3 meses/i.test(t)) return 3;
    if (/(último mês|mês passado)/i.test(t)) return 2;
    if (/(clientes antigos|clientes perdidos|ex-clientes|ex-alunos|melhores clientes|clientes recentes|clientes atuais|quem já comprou|conselho com \d+ clientes|perguntar a \d+ clientes|com \d+ clientes)/i.test(t)) return 3;
    return 0;
  };
  const metaMarcaMes = (p, r) => {
    const v = p && p.esforco_marca_pct; if (v !== LANC || !p.inicio) return v;
    const k = mesesEntre(p.inicio, (r || ref()) + '-01') + 1;
    return k > 12 ? POS_LANC : LANC;
  };
  const metaMarcaPlano = (p) => {
    const v = p && p.esforco_marca_pct; if (v !== LANC) return v;
    const d = p.duracao_meses || 18; return Math.round((Math.min(12, d) * LANC + Math.max(0, d - 12) * POS_LANC) / d);
  };
  // referência para o cliente: setor + ajustes do mesmo estudo (Tabela S3): compra recorrente/assinatura +12, preço baixo −5
  const esforcoReferencia = (setor, comoVencer) => {
    const base = esforcoPadrao(setor); const partes = []; let v = base;
    const t = String(comoVencer || '');
    if (/^Lançar a marca/.test(t)) return { pct: LANC, base, partes: ['lançamento: 35% no 1º ano, depois 57%'] };
    if (/^Tornar a compra um hábito/.test(t)) { v += 12; partes.push('compra recorrente +12'); }
    if (/^Ser a opção simples/.test(t)) { v -= 5; partes.push('preço baixo −5'); }
    return { pct: Math.max(30, Math.min(85, v)), base, partes };
  };
  // ===== gráficos (mesmo desenho do portal do cliente: SVG feito à mão, linhas e barras; nunca pizza) =====
  const graficos = (cor = '#f3f3f3') => {
    const SVGNS = 'http://www.w3.org/2000/svg';
    const sv = (tag, attrs, ...kids) => {
      const n = document.createElementNS(SVGNS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => { if (v != null) n.setAttribute(k, v); });
      kids.flat().forEach((k) => { if (k != null) n.append(k instanceof Node ? k : document.createTextNode(String(k))); });
      return n;
    };
    const C = { grid: '#2e2e2e', axis: '#737373', surface: '#1c1c1c', bar: cor, barHover: '#ffffff', ref2: '#5c5c5c' };
    const ticks = (min, max, alvo = 4) => {
      const span = Math.max(max - min, 1e-9); const passo0 = span / alvo; const mag = 10 ** Math.floor(Math.log10(passo0));
      const passo = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((x) => x >= passo0) || 10 * mag;
      const lo = Math.floor(min / passo) * passo; const hi = Math.ceil(max / passo) * passo;
      const out = []; for (let v = lo; v <= hi + passo / 2; v += passo) out.push(Math.round(v * 1e6) / 1e6);
      return out;
    };
    const caixa = (cls, label, draw) => {
      const box = el('div', { class: 'chart ' + cls, role: 'img', 'aria-label': label });
      const tip = el('div', { class: 'chart__tip', hidden: true });
      let w0 = 0;
      const ro = new ResizeObserver(([e]) => {
        const w = Math.round(e.contentRect.width); if (!w || w === w0) return; w0 = w;
        [...box.querySelectorAll('svg')].forEach((x) => x.remove()); box.prepend(draw(w, tip, box));
      });
      box.append(tip); requestAnimationFrame(() => ro.observe(box));
      return box;
    };
    const dica = (tip, box, x, y, linhas) => {
      tip.replaceChildren(...linhas.map(([v, nome, c]) => el('div', 'chart__row', c ? el('span', { class: 'chart__key', style: 'background:' + c }) : null, el('strong', null, v), nome ? el('span', null, nome) : null)));
      tip.hidden = false;
      const bw = box.clientWidth; const tw = tip.offsetWidth;
      tip.style.left = Math.min(Math.max(x - tw / 2, 0), bw - tw) + 'px'; tip.style.top = Math.max(y - tip.offsetHeight - 12, 0) + 'px';
    };
    const eixoY = (svg, tk, y, L, W, R, fmt) => tk.forEach((t) => svg.append(sv('line', { x1: L, x2: W - R, y1: y(t), y2: y(t), stroke: C.grid, 'stroke-width': 1, 'stroke-dasharray': t === tk[0] ? null : '3 4' }),
      sv('text', { x: L - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'chart__axis' }, fmt(t))));
    // linhas: séries com valores por rótulo (null = sem dado); a primeira com "pontos" ganha área e pontos
    const linhas = ({ rotulos, series, fmt, label, zero = true }) => caixa('chart--line', label, (W, tip, box) => {
      const H = 220; const R = 56; const T = 14; const B = 30;
      const vals = series.flatMap((x) => x.valores.filter((v) => v != null));
      const tk = ticks(zero ? Math.min(0, ...vals) : Math.min(...vals), Math.max(1, ...vals));
      const L = Math.max(40, 14 + Math.max(...tk.map((t) => fmt(t).length)) * 6.6); // espaço para o maior rótulo do eixo
      const y = (v) => T + (H - T - B) * (1 - (v - tk[0]) / (tk[tk.length - 1] - tk[0]));
      const n = rotulos.length; const x = (i) => L + (n === 1 ? (W - L - R) / 2 : ((W - L - R) * i) / (n - 1));
      const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
      eixoY(svg, tk, y, L, W, R, fmt);
      const cada = Math.ceil(n / Math.max(1, Math.floor((W - L - R) / 56)));
      rotulos.forEach((r, i) => { if (i % cada === 0 || i === n - 1) svg.append(sv('text', { x: x(i), y: H - 8, 'text-anchor': 'middle', class: 'chart__axis' }, r)); });
      series.forEach((sr) => {
        let d = ''; let caneta = false;
        sr.valores.forEach((v, i) => { if (v == null) { caneta = false; return; } d += (caneta ? 'L' : 'M') + x(i) + ' ' + y(v) + ' '; caneta = true; });
        svg.append(sv('path', { d, fill: 'none', stroke: sr.cor, 'stroke-width': sr.tracejado ? 1.5 : 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': sr.tracejado ? '4 5' : null }));
        if (sr.pontos) sr.valores.forEach((v, i) => { if (v != null) svg.append(sv('circle', { cx: x(i), cy: y(v), r: 4, fill: sr.cor, stroke: C.surface, 'stroke-width': 2 })); });
        const last = sr.valores.reduce((a, v, i) => (v != null ? i : a), -1);
        if (last >= 0 && sr.rotuloFim) svg.append(sv('text', { x: x(last) + 8, y: y(sr.valores[last]) - 10, class: 'chart__end' }, fmt(sr.valores[last])));
      });
      const mira = sv('line', { y1: T, y2: H - B, stroke: C.axis, 'stroke-width': 1, visibility: 'hidden' }); svg.append(mira);
      const hit = sv('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }); svg.append(hit);
      hit.addEventListener('pointermove', (e) => {
        const r = svg.getBoundingClientRect(); const i = Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left - L) / Math.max(1, W - L - R)) * (n - 1))));
        mira.setAttribute('x1', x(i)); mira.setAttribute('x2', x(i)); mira.setAttribute('visibility', 'visible');
        dica(tip, box, x(i), T + 10, [[rotulos[i]], ...series.map((sr) => [sr.valores[i] == null ? '—' : fmt(sr.valores[i]), sr.nome, sr.cor])]);
      });
      hit.addEventListener('pointerleave', () => { mira.setAttribute('visibility', 'hidden'); tip.hidden = true; });
      return svg;
    });
    // barras empilhadas: a (embaixo, na cor) + o resto até o total (cinza)
    const pilhas = ({ rotulos, a, total, fmt, label, nomes = ['novos', 'voltaram'] }) => caixa('chart--bars', label, (W, tip, box) => {
      const H = 220; const L = 36; const R = 8; const T = 22; const B = 28;
      const tk = ticks(0, Math.max(1, ...total.filter((v) => v != null)), 3); const top = tk[tk.length - 1];
      const y = (v) => T + (H - T - B) * (1 - v / top);
      const n = total.length; const banda = (W - L - R) / n; const bw = Math.min(44, banda * 0.55);
      const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
      eixoY(svg, tk, y, L, W, R, fmt);
      const cada = Math.ceil(n / Math.max(1, Math.floor((W - L - R) / 40)));
      total.forEach((tot, i) => {
        const cx = L + banda * i + banda / 2;
        if (i % cada === 0 || i === n - 1) svg.append(sv('text', { x: cx, y: H - 8, 'text-anchor': 'middle', class: 'chart__axis' }, rotulos[i]));
        if (tot == null || tot <= 0) return;
        const nov = Math.min(a[i] || 0, tot); const volt = tot - nov;
        const x0 = cx - bw / 2; const yb = y(0); const yN = y(nov); const yT = y(tot);
        const rect = (y1, y2, fill, roundTop) => { const h = y2 - y1; if (h <= 0) return null; const r = roundTop ? Math.min(7, h / 2, bw / 2) : 0;
          return sv('path', { d: `M${x0} ${y2}V${y1 + r}Q${x0} ${y1} ${x0 + r} ${y1}H${x0 + bw - r}Q${x0 + bw} ${y1} ${x0 + bw} ${y1 + r}V${y2}Z`, fill }); };
        const gap = volt > 0 && nov > 0 ? 2 : 0;
        [rect(yN, yb, C.bar, volt === 0), rect(yT, yN - gap, C.ref2, true)].forEach((q) => q && svg.append(q));
        svg.append(sv('text', { x: cx, y: yT - 6, 'text-anchor': 'middle', class: 'chart__end' }, fmt(tot)));
        const hit = sv('rect', { x: L + banda * i, y: T, width: banda, height: H - T - B, fill: 'transparent' });
        hit.addEventListener('pointerenter', () => dica(tip, box, cx, yT, [[rotulos[i]], [fmt(tot), 'no total'], [fmt(nov), nomes[0], C.bar], [fmt(volt), nomes[1], C.ref2]]));
        hit.addEventListener('pointerleave', () => { tip.hidden = true; });
        svg.append(hit);
      });
      return svg;
    });
    const legenda = (itens) => el('div', 'chart__legend', itens.map(([nome, c, tipo]) => el('span', null,
      tipo === 'sq' ? el('span', { class: 'chart__sq', style: 'background:' + c }) : el('span', { class: 'chart__line' + (tipo === 'dash' ? ' chart__line--dash' : ''), style: tipo === 'dash' ? null : 'background:' + c }), nome)));
    return { linhas, pilhas, legenda };
  };
  // ===== acesso à plataforma ("Só acesso"): período grátis e depois plano pago (a regra que vale é a do banco: acesso_vence_em) =====
  const hojeLocal = () => new Date().toLocaleDateString('sv-SE');
  const acessoVence = (p) => {
    if (!p || p.tipo !== 'acesso') return null;
    if (p.acesso_ate) return String(p.acesso_ate).slice(0, 10);
    const d = new Date(String(p.inicio).slice(0, 10) + 'T12:00:00'); d.setMonth(d.getMonth() + (p.acesso_gratis_meses ?? 1)); d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('sv-SE');
  };
  const acessoVencido = (p) => { const v = acessoVence(p); return !!v && v < hojeLocal(); };
  const acessoDiasRestantes = (p) => { const v = acessoVence(p); return v ? Math.round((new Date(v + 'T12:00:00') - new Date(hojeLocal() + 'T12:00:00')) / 864e5) : null; };
  // a situação que aparece no selo: Ativo, Pausado, Encerrado ou Pagamento pendente (acesso vencido)
  const situacaoPlano = (p) => (!p ? null : p.status === 'encerrado' ? [' is-off', 'Encerrado'] : p.status === 'pausado' ? [' is-warn', 'Pausado']
    : acessoVencido(p) ? [' is-warn', 'Pagamento pendente'] : ['', 'Ativo']);
  window.GangUI = { buscaFonte, acessoVence, acessoVencido, acessoDiasRestantes, situacaoPlano, graficos, esforcoPadrao, ESFORCO_SETOR, metaMarcaMes, mesesDeHistorico, metaMarcaPlano, esforcoReferencia, addDias, moedaFmt, moedaValor, moedaSet, PROMESSAS, promessaDe, tipoEsforco, pesoTamanho, combo, comboValue, comboSet, diasSemana, diasComArtigo, multi, multiValue, avatar, iniciais, $, el, say, day, fmt, cap, dia, diaAno, mesAno, hora, quando, ref, refDate, addRef, nomeMes, nomeMesCurto, mesesEntre, mesDoPlano, diasAte, reais, pct };
})();
