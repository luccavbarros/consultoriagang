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
    return box;
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
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((x) => { if (x.nodeType === 1) traduzDatas(x.parentNode || x); }))).observe(document.documentElement, { childList: true, subtree: true });

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
  const SUBT = '.verdict__q, .cmsg__q, .insight > span:last-child, .box__empty, .screen__lead, .res-part__d, .box__title + .box__text, .box__head + .box__text, .app-section__head .small, .app-section__head + .small, .app-section > .small, .lib summary .small';
  const FIM = /([.!?…])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ“"(0-9])/g;
  // sem palavra órfã: a última palavra de cada frase fica presa à anterior (espaço que não quebra)
  const semOrfa = (linha) => (linha.split(' ').length >= 3 ? linha.replace(/ (\S+)$/, '\u00a0$1') : linha);
  const frases = () => {
    document.querySelectorAll(SUBT).forEach((n) => {
      if (n.children.length || n.dataset.frases === n.textContent) return;
      const t = n.textContent.replace(/\s*\n\s*/g, ' ').replace(/\u00a0/g, ' ').trim();
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
  window.GangUI = { buscaFonte, addDias, moedaFmt, moedaValor, moedaSet, PROMESSAS, promessaDe, combo, comboValue, comboSet, multi, multiValue, avatar, iniciais, $, el, say, day, fmt, cap, dia, diaAno, mesAno, hora, quando, ref, refDate, addRef, nomeMes, nomeMesCurto, mesesEntre, mesDoPlano, diasAte, reais, pct };
})();
