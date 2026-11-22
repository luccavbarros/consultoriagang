/* Painel GANG: Briefing — o encontro de início, depois do pagamento. Só o consultor vê.
   As perguntas são do diagnóstico; as respostas são a leitura do consultor (não o que o cliente disse: ele acha que sabe o problema,
   mas nem sempre sabe). Opinião vira hipótese a confirmar no Diagnóstico; fato (números, recursos) desce direto.
   Cascata: o briefing sugere no Diagnóstico, na Estratégia e no "não fazer"; o consultor adiciona com um clique. Nada entra sozinho. */
window.addEventListener('gang:cliente', ({ detail: { sb, id } }) => {
  const U = window.GangUI; const { el } = U;
  const P = window.GangPresets || {};
  const box = document.getElementById('pane-briefing'); if (!box) return;
  let dados = {};
  // o Diagnóstico também escreve no briefing (hipótese descartada, o que confirmou a causa): passa por aqui para salvar do mesmo jeito
  window.GangBriefing = { dados: () => dados, set: (k, v) => set(k, v) };

  // ===== salvar sozinho =====
  const estado = el('span', 'bf-salvo', '');
  let fila = null;
  const salva = () => {
    clearTimeout(fila); estado.textContent = 'Salvando…';
    fila = setTimeout(async () => {
      const r = await sb.from('briefings').upsert({ empresa_id: id, dados, atualizado_em: new Date().toISOString() });
      estado.textContent = r.error ? 'Não foi possível salvar. Confira se o portal.sql foi rodado no Supabase.' : 'Salvo às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      if (!r.error) window.dispatchEvent(new CustomEvent('gang:briefing'));
      atualizaTopo();
    }, 600);
  };
  const set = (k, v) => { dados[k] = v; salva(); };
  const setIn = (k, sub, v) => { dados[k] = { ...(dados[k] || {}), [sub]: v }; salva(); };

  // ===== campos =====
  const texto = (k, ph, rows = 3) => { const t = el('textarea', { class: 'field', rows, placeholder: ph }); t.value = dados[k] || ''; t.addEventListener('input', () => set(k, t.value)); return t; };
  const textoIn = (k, sub, ph, rows = 2) => { const t = el('textarea', { class: 'field', rows, placeholder: ph }); t.value = (dados[k] || {})[sub] || ''; t.addEventListener('input', () => setIn(k, sub, t.value)); return t; };
  const numero = (k, sub, ph) => { const i = el('input', { class: 'field', type: 'number', min: 0, inputmode: 'decimal', placeholder: ph }); i.value = (dados[k] || {})[sub] ?? ''; i.addEventListener('input', () => setIn(k, sub, i.value === '' ? '' : Number(i.value))); return i; };
  const escolhe = (opts, valor, fn) => { const s = el('select', { class: 'field' }, el('option', { value: '' }, 'Escolha…'), opts.map(([v, t]) => el('option', { value: v }, t))); s.value = valor || ''; s.addEventListener('change', () => fn(s.value)); return s; };
  const rotulo = (t, c) => el('label', 'bf-campo', el('span', 'label', t), c);

  // lista de escolhas: as opções da biblioteca (por grupo) ou "Outro…", em etiquetas; cada etiqueta pode ter a posição da marca
  const POS = [['entrega', 'Entrega'], ['entrega_mal', 'Entrega mal'], ['nao_entrega', 'Não entrega']];
  const etiquetas = (k, preset, { posicao = false, ph = 'Escreva' } = {}) => {
    const wrap = el('div', 'bf-tags');
    const itens = () => dados[k] || [];
    const nome = (x) => (typeof x === 'string' ? x : x.texto);
    const desenha = () => {
      const lista = P[preset] || [];
      const usados = new Set(itens().map(nome));
      const grupos = [...new Set(lista.map((x) => x.grupo))];
      const sel = el('select', { class: 'field bf-tags__sel', 'aria-label': 'Adicionar' }, el('option', { value: '' }, 'Adicionar da biblioteca…'),
        grupos.map((g) => el('optgroup', { label: g }, lista.filter((x) => x.grupo === g && !usados.has(x.texto)).map((x) => el('option', { value: x.texto }, x.texto)))),
        el('option', { value: '__outro' }, 'Outro… (escrever)'));
      const outro = el('input', { class: 'field', placeholder: ph, hidden: true });
      const add = (t) => { t = (t || '').trim(); if (!t || usados.has(t)) return; set(k, [...itens(), posicao ? { texto: t, posicao: '' } : t]); desenha(); };
      sel.addEventListener('change', () => { if (sel.value === '__outro') { outro.hidden = false; outro.focus(); sel.value = ''; return; } add(sel.value); });
      outro.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(outro.value); } });
      outro.addEventListener('blur', () => { if (outro.value.trim()) add(outro.value); });
      const chips = itens().map((x, i) => el('li', 'bf-tag', el('span', null, nome(x)),
        posicao ? escolhe(POS, x.posicao, (v) => { const n = itens().slice(); n[i] = { ...n[i], posicao: v }; set(k, n); }) : null,
        el('button', { class: 'bf-tag__x', type: 'button', 'aria-label': 'Tirar ' + nome(x), onclick: () => { set(k, itens().filter((_, j) => j !== i)); desenha(); } }, '×')));
      wrap.replaceChildren(...[chips.length ? el('ul', 'bf-tag__l', chips) : null, el('div', 'bf-tags__add', sel, outro)].filter(Boolean));
    };
    desenha(); return wrap;
  };

  // concorrentes: nome e faixa de preço em relação à marca
  const PRECO = [['mais_barato', 'Mais barato que a marca'], ['parecido', 'Preço parecido'], ['mais_caro', 'Mais caro que a marca']];
  const concorrentes = () => {
    const wrap = el('div', 'bf-conc');
    const desenha = () => {
      const l = dados.concorrentes || [];
      const linhas = l.map((c, i) => {
        const n = el('input', { class: 'field', placeholder: 'Nome do concorrente' }); n.value = c.nome || '';
        n.addEventListener('input', () => { const x = (dados.concorrentes || []).slice(); x[i] = { ...x[i], nome: n.value }; set('concorrentes', x); });
        return el('div', 'bf-conc__l', n, escolhe(PRECO, c.preco, (v) => { const x = (dados.concorrentes || []).slice(); x[i] = { ...x[i], preco: v }; set('concorrentes', x); }),
          el('button', { class: 'bf-tag__x', type: 'button', 'aria-label': 'Tirar concorrente', onclick: () => { set('concorrentes', (dados.concorrentes || []).filter((_, j) => j !== i)); desenha(); } }, '×'));
      });
      wrap.replaceChildren(...linhas, el('button', { class: 'ed-add', type: 'button', onclick: () => { set('concorrentes', [...(dados.concorrentes || []), { nome: '', preco: '' }]); desenha(); const ins = wrap.querySelectorAll('input'); if (ins.length) ins[ins.length - 1].focus(); } }, '+ Concorrente'));
    };
    desenha(); return wrap;
  };

  // ===== as perguntas: o que perguntar a si mesmo, o que ouvir e para onde vai =====
  const pergunta = (n, titulo, dica, destino, ...corpo) => el('section', { class: 'bf-q', id: 'bf-q' + n },
    el('div', 'bf-q__h', el('span', 'bf-q__n', String(n)), el('div', 'bf-q__t', el('h3', null, titulo), el('p', 'bf-q__d', dica))),
    el('div', 'bf-q__c', ...corpo), el('p', 'bf-q__dest', 'Vai para: ' + destino));
  const bloco = (titulo, ...qs) => el('div', 'bf-bloco', el('p', 'bf-bloco__t', titulo), ...qs);

  const respondidas = () => [
    !!dados.momento, !!(dados.cliente || '').trim(), (dados.situacoes || []).length > 0, (dados.concorrentes || []).some((c) => c.nome),
    (dados.motivadores || []).length > 0, (dados.discriminadores || []).length > 0,
    [...(dados.motivadores || []), ...(dados.discriminadores || [])].some((f) => f.posicao), (dados.obstaculos || []).length > 0,
    !!(dados.tentado || '').trim() || (dados.naoRepetir || []).length > 0, ['faixa', 'modo', 'sazonal'].some((x) => (dados.numeros || {})[x]),
    ['verba', 'horas', 'espaco'].some((x) => (dados.recursos || {})[x] !== undefined && (dados.recursos || {})[x] !== ''), !!((dados.ambicao || {}).nota || '').trim() || !!(dados.ambicao || {}).pct,
  ].filter(Boolean).length;
  const barra = el('span', 'bf-prog__b'); const contagem = el('span', 'bf-prog__n');
  const atualizaTopo = () => { const n = respondidas(); contagem.textContent = n + ' de 12'; barra.style.width = Math.round(n / 12 * 100) + '%'; };

  const desenha = () => {
    const topo = el('div', 'ed-card bf-topo',
      el('div', 'bf-topo__txt', el('p', 'bf-topo__t', 'Encontro de início'),
        el('p', 'bf-topo__d', 'Pergunte, ouça e registre a sua leitura, não a fala do cliente: ele conhece o negócio, mas nem sempre sabe qual é o problema. O que for opinião vira hipótese no Diagnóstico; números e recursos descem direto. Só você vê esta página.')),
      el('div', 'bf-prog', el('span', 'bf-prog__trilho', barra), contagem, estado));
    const qs = [
      bloco('1 · O momento e o cliente',
        pergunta(1, 'Qual o momento da marca?', 'Marca nova pede outro plano (conhecer antes de lembrar). Em mudança, o que precisa continuar reconhecível?', 'regras de lançamento e meta de marca do plano',
          escolhe([['nova', 'Nova: ainda não é conhecida'], ['estabelecida', 'Estabelecida'], ['mudanca', 'Em mudança (reposicionamento ou identidade nova)']], dados.momento, (v) => set('momento', v)),
          texto('momento_nota', 'Há quanto tempo existe e o que mudou recentemente', 2)),
        pergunta(2, 'Quem é o cliente que importa, e quem não é?', 'Pense em quem compra mais, paga sem negociar e indica. Quem dá trabalho e não volta também conta.', 'público da pesquisa · Estratégia: onde atuamos',
          rotulo('O cliente que importa', texto('cliente', 'Ex.: mulheres de 30 a 50 anos do bairro, que valorizam resultado e voltam a cada 2 meses', 2)),
          rotulo('Quem não é cliente', texto('nao_cliente', 'Ex.: quem só procura o menor preço', 2)))),
      bloco('2 · Onde e contra quem',
        pergunta(3, 'Em que situações alguém precisa do que a empresa vende, e com que frequência compra?', 'Momentos da vida de quem compra (quando, onde, por quê), não motivos. A frequência muda o peso da recompra no plano.', 'perguntas da pesquisa · Estratégia: situações de compra',
          etiquetas('situacoes', 'situacoes', { ph: 'Ex.: antes de um evento importante' }),
          rotulo('Frequência de compra', escolhe([['semanal', 'Toda semana'], ['mensal', 'Todo mês'], ['trimestral', 'A cada 2 ou 3 meses'], ['anual', 'Uma ou duas vezes por ano'], ['rara', 'Raramente (uma vez na vida ou a cada anos)']], dados.frequencia, (v) => set('frequencia', v)))),
        pergunta(4, 'Contra quem a marca disputa de verdade, e em que faixa de preço?', 'Os concorrentes que o cliente realmente compara, e também a alternativa que não é concorrente (fazer sozinho, não comprar, adiar).', 'Diagnóstico: concorrentes comparados',
          concorrentes(), rotulo('A alternativa que não é concorrente', texto('alternativa', 'Ex.: fazer em casa; deixar para depois', 2)))),
      bloco('3 · O que pesa na escolha',
        pergunta(5, 'O que todo cliente exige da categoria?', 'O mínimo para entrar na disputa. Marque onde a marca está em cada um: é a sua leitura, a pesquisa confirma.', 'Diagnóstico: o que todo cliente exige',
          etiquetas('motivadores', 'motivadores', { posicao: true })),
        pergunta(6, 'O que faz escolher uma marca em vez de outra?', 'O que desempata. Onde a marca entrega bem mas ninguém sabe costuma estar a melhor oportunidade.', 'Diagnóstico: o que faz escolher',
          etiquetas('discriminadores', 'discriminadores', { posicao: true })),
        pergunta(7, 'Onde a marca entrega, entrega mal ou não entrega?', 'Já marcado item a item nas perguntas 5 e 6. Abaixo, o resumo.', 'Diagnóstico: posição em cada fator',
          (() => { const fs = [...(dados.motivadores || []), ...(dados.discriminadores || [])]; const c = (p) => fs.filter((f) => f.posicao === p).length;
            return el('p', 'bf-res', fs.length ? 'Entrega: ' + c('entrega') + ' · entrega mal: ' + c('entrega_mal') + ' · não entrega: ' + c('nao_entrega') + (fs.some((f) => !f.posicao) ? ' · sem posição: ' + fs.filter((f) => !f.posicao).length : '') : 'Marque os itens nas perguntas 5 e 6.'); })())),
      bloco('4 · O problema',
        pergunta(8, 'Qual parece ser o obstáculo principal?', 'A sua leitura, não a do cliente (ele costuma dizer "preço"). Não ser lembrada, ser difícil de comprar, preço, experiência ou recompra? Escolha 1 a 3.', 'Diagnóstico: causas (como hipóteses a confirmar) e, delas, os desafios',
          etiquetas('obstaculos', 'causas'), rotulo('Por que você acha isso', texto('obstaculo_nota', 'O que você ouviu ou viu que sustenta essa leitura', 2))),
        pergunta(9, 'O que já foi tentado, e o que aconteceu?', 'Evita repetir o que já falhou. O que não deve voltar entra na lista do que decidimos não fazer.', 'Ações: o que decidimos não fazer',
          texto('tentado', 'Ex.: promoção no Instagram encheu a agenda um mês, com clientes que não voltaram', 2),
          rotulo('Não repetir', etiquetas('naoRepetir', 'naoFazer')))),
      bloco('5 · Números, recursos e ambição',
        pergunta(10, 'O tamanho da empresa hoje', 'Só a faixa, para o plano caber no tamanho da empresa. A plataforma não pede números depois: o cliente conta como foi cada mês em um clique.', 'Plano: o tamanho das ações',
          rotulo('Faixa de faturamento por mês', escolhe([['ate20', 'Até R$ 20 mil'], ['20a50', 'De R$ 20 mil a R$ 50 mil'], ['50a100', 'De R$ 50 mil a R$ 100 mil'], ['100a300', 'De R$ 100 mil a R$ 300 mil'], ['300mais', 'Acima de R$ 300 mil'], ['nao', 'Não quis informar']],
            (dados.numeros || {}).faixa || ((dados.numeros || {}).modo === 'nao' ? 'nao' : null), (v) => { setIn('numeros', 'faixa', v); setIn('numeros', 'modo', v === 'nao' ? 'nao' : 'faixa'); })),
          rotulo('Meses fortes e fracos', textoIn('numeros', 'sazonal', 'Ex.: forte em novembro e dezembro; fraco em fevereiro'))),
        pergunta(11, 'Os recursos para executar', 'O plano precisa caber na vida do cliente. Sem espaço físico de atendimento, as ações de loja ficam fora do plano.', 'Plano: o que entra e o peso dos meses · Estratégia: o que acompanhamos',
          el('div', 'bf-grid', rotulo('Verba de mídia por mês (R$)', numero('recursos', 'verba', 'Ex.: 2000')), rotulo('Horas por semana para a marca', numero('recursos', 'horas', 'Ex.: 4')),
            rotulo('Tem espaço físico de atendimento?', escolhe([['sim', 'Sim (loja, clínica, escritório, salão)'], ['nao', 'Não: atende só online ou na casa do cliente']], (dados.recursos || {}).espaco, (v) => setIn('recursos', 'espaco', v))),
            rotulo('Vende online?', escolhe([['sim', 'Sim'], ['nao', 'Não']], (dados.recursos || {}).online, (v) => setIn('recursos', 'online', v)))),
          rotulo('Quem executa', textoIn('recursos', 'executa', 'Ex.: a recepcionista cuida das redes; a dona aprova tudo'))),
        pergunta(12, 'Aonde quer chegar, e em quanto tempo?', 'Fato: a ambição do dono, nas palavras dele. Vira o rascunho do objetivo de negócio, sem número de faturamento.', 'Estratégia: objetivos',
          rotulo('Aonde quer chegar', textoIn('ambicao', 'nota', 'Ex.: ser a clínica que os pacientes indicam sem pensar duas vezes')),
          el('div', 'bf-grid', rotulo('Em quantos meses', numero('ambicao', 'meses', 'Ex.: 12'))))),
    ];
    // o que o briefing já passou adiante: a cascata à vista
    const B = dados; const nFat = (B.motivadores || []).length + (B.discriminadores || []).length;
    const pl = (n, um, varios) => n + ' ' + (n === 1 ? um : varios);
    const cascata = el('div', 'ed-card bf-casc', el('p', 'bf-casc__t', 'O que este briefing já sugere'),
      el('ul', 'bf-casc__l',
        el('li', null, el('a', { href: '#diagnostico' }, 'Diagnóstico'), ': ' + [pl((B.obstaculos || []).length, 'hipótese de causa', 'hipóteses de causa'), pl((B.concorrentes || []).filter((c) => c.nome).length, 'concorrente', 'concorrentes'), pl(nFat, 'fator', 'fatores')].join(' · ')),
        el('li', null, el('a', { href: '#estrategia' }, 'Estratégia'), ': ' + [pl((B.situacoes || []).length, 'situação de compra', 'situações de compra'), (B.ambicao || {}).pct ? 'rascunho do objetivo' + ((B.numeros || {}).faturamento ? '' : ' (em percentual)') : 'objetivo (falta a ambição)', (B.nao_cliente || '').trim() ? 'quem deixar de lado' : null].filter(Boolean).join(' · ')),
        el('li', null, el('a', { href: '#acoes' }, 'O que decidimos não fazer'), ': ' + pl((B.naoRepetir || []).length, 'item para não repetir', 'itens para não repetir')),
        el('li', null, 'Plano: ' + ((B.recursos || {}).espaco === 'nao' ? 'sem espaço físico, as ações de loja ficam fora' : 'sem restrição de espaço'))),
      el('p', 'bf-casc__d', 'Tudo aparece como sugestão nas outras abas, para você confirmar com a pesquisa e adicionar com um clique.'));
    box.replaceChildren(topo, ...qs, cascata);
    atualizaTopo();
  };
  // a resposta mudou o que outras perguntas mostram (resumo da 7, ticket da 10, cascata): redesenha sem perder o foco de quem digita
  window.addEventListener('gang:briefing', () => { if (box.contains(document.activeElement) && /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return; const y = window.scrollY; desenha(); window.scrollTo(0, y); });

  sb.from('briefings').select('dados').eq('empresa_id', id).maybeSingle().then(({ data }) => {
    dados = (data && data.dados) || {}; desenha();
    window.dispatchEvent(new CustomEvent('gang:briefing'));
  });
});
