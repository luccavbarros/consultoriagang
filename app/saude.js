/* Saúde de cada cliente, para o painel do consultor:
   sinais de risco (visão geral), fechamento do mês, equilíbrio do plano e pauta sugerida do encontro.
   Tudo calculado a partir do que já está no banco; nada aqui grava dados. */
(() => {
  const U = window.GangUI;
  const hoje = () => U.ref();
  const mesPassado = () => U.addRef(U.ref(), -1);
  const proxMes = () => U.addRef(U.ref(), 1);
  const PESO = { essencial: 3, ajuda: 2, reforco: 1 };
  const PROM = { vendas: 'Venda mais', pessoas: 'Para mais pessoas', valor: 'Com mais valor' };
  const MESES_PESQUISA = (dur) => [...new Set([1, 7, 13, dur].filter((m) => m <= dur))]; // partida, 6 e 12 meses depois, e a chegada

  // carrega tudo de uma empresa (ou de todas, na visão geral) e agrupa por empresa
  async function carregar(sb, empresaId) {
    const f = (t, cols) => { let q = sb.from(t).select(cols); if (empresaId) q = q.eq('empresa_id', empresaId); return q; };
    let perf = sb.from('profiles').select('id, empresa_id').eq('role', 'client'); if (empresaId) perf = perf.eq('empresa_id', empresaId);
    const rs = await Promise.all([
      f('planos', '*'), f('acoes', '*'), f('numeros_mensais', '*').order('mes_ref'),
      f('orientacoes', 'empresa_id, mes_ref, veredito, nota_vendas, nota_pessoas, nota_valor'),
      f('pesquisas', 'id, empresa_id, titulo, aberta, criada_em'), f('respostas', 'empresa_id, pesquisa_id, lembranca'),
      f('pedidos_revisao', 'id, empresa_id, status, enviado_em, titulo'), f('encontros', '*').order('inicio'),
      f('mensagens', 'empresa_id, de, criada_em'), f('causas', 'id, empresa_id, texto'), f('objetivos', 'id, empresa_id, nivel, titulo'), perf,
      f('sugestoes', 'id, empresa_id, texto, tipo, acao_id, criada_em').eq('status', 'nova'),
    ]);
    if (rs.some((r) => r.error)) return null;
    // compromissos da semana: opcional (se a tabela ainda não existir no banco, o resto continua funcionando)
    const rc = await f('compromissos', 'id, empresa_id, semana, texto, cumprido, acao_id').gte('semana', U.addDias(new Date().toISOString().slice(0, 10), -70));
    const comps = (!rc.error && rc.data) || [];
    const [planos, acoes, numeros, oris, pesqs, resps, peds, encs, msgs, causas, objs, perfis, sugs] = rs.map((r) => r.data || []);
    // nome da empresa, para ler a lembrança espontânea nas respostas (opcional: sem ele, o sinal de lembrança só não aparece)
    let eq = sb.from('empresas').select('id, nome'); if (empresaId) eq = eq.eq('id', empresaId);
    const re = await eq; const nomes = Object.fromEntries(((!re.error && re.data) || []).map((e) => [e.id, e.nome]));
    const por = (arr, eid) => arr.filter((x) => x.empresa_id === eid);
    const ids = empresaId ? [empresaId] : [...new Set(planos.map((p) => p.empresa_id))];
    const out = {};
    ids.forEach((eid) => {
      out[eid] = {
        plano: planos.find((p) => p.empresa_id === eid) || null,
        acoes: por(acoes, eid), numeros: por(numeros, eid), orientacoes: por(oris, eid), pesquisas: por(pesqs, eid),
        respostas: por(resps, eid), pedidos: por(peds, eid), encontros: por(encs, eid), mensagens: por(msgs, eid),
        causas: por(causas, eid), objetivos: por(objs, eid), clientes: por(perfis, eid).map((x) => x.id), sugestoes: por(sugs, eid), compromissos: por(comps, eid), nome: nomes[eid] || '',
      };
    });
    return empresaId ? out[empresaId] : out;
  }

  // ===== regras comuns =====
  // lembrança espontânea por pesquisa (como no portal: a última palavra do nome da empresa aparece no que a pessoa lembrou)
  const semAc = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const lembrancaQueda = (b) => {
    if (!b.nome) return null;
    const chave = semAc(b.nome).split(/\s+/).filter((w) => w.length > 2).pop() || semAc(b.nome);
    const st = [...b.pesquisas].filter((q) => !q.aberta).sort((x, y) => String(x.criada_em).localeCompare(String(y.criada_em))).map((q) => {
      const rs = b.respostas.filter((r) => r.pesquisa_id === q.id);
      return rs.length >= 30 ? { n: rs.length, p: rs.filter((r) => semAc(r.lembranca).includes(chave)).length / rs.length } : null;
    }).filter(Boolean);
    if (st.length < 2) return null;
    const [a, c] = st.slice(-2);
    // só avisa se a queda for maior do que a amostra explicaria (teste de duas proporções, 95%): com 30 respostas, quedas pequenas são ruído
    const pm = (a.p * a.n + c.p * c.n) / (a.n + c.n); const ep = Math.sqrt(pm * (1 - pm) * (1 / a.n + 1 / c.n));
    return ep > 0 && (a.p - c.p) / ep >= 1.96 ? [Math.round(a.p * 100), Math.round(c.p * 100)] : null;
  };
  const inicioRef = (b) => (b.plano && b.plano.inicio ? U.ref(b.plano.inicio) : null);
  const ativo = (b) => b.plano && b.plano.status === 'ativo' && b.plano.tipo !== 'acesso';
  const diasDesde = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
  const diasUteisDesde = (iso) => { let n = 0; const d = new Date(iso); const fim = new Date(); while (d < fim) { d.setDate(d.getDate() + 1); if (d <= fim && d.getDay() % 6 !== 0) n += 1; } return n; };
  const baseFat = (b) => (b.plano && b.plano.faturamento_base != null ? Number(b.plano.faturamento_base) : (b.numeros.find((x) => x.faturamento != null) || {}).faturamento || null);
  // a promessa, medida como no portal: faturamento contra a base, clientes atendidos e ticket médio contra o primeiro mês
  const promessa = (b) => {
    const nums = b.numeros.filter((n) => n.faturamento != null); const ult = nums[nums.length - 1]; const base = baseFat(b);
    const v = (a, c) => (a != null && c ? Math.round((a / c - 1) * 1000) / 10 : null);
    const ini = inicioRef(b);
    const vendas = ult && base && (!ini || ult.mes_ref > ini) ? v(Number(ult.faturamento), Number(base)) : null;
    const cc = nums.filter((n) => n.clientes_atendidos);
    const tk = (n) => Number(n.faturamento) / n.clientes_atendidos;
    return { vendas, pessoas: cc.length > 1 ? v(cc[cc.length - 1].clientes_atendidos, cc[0].clientes_atendidos) : null, valor: cc.length > 1 ? v(tk(cc[cc.length - 1]), tk(cc[0])) : null };
  };
  const essAtrasadas = (b) => b.acoes.filter((a) => a.peso === 'essencial' && a.status !== 'feita' && ((a.prazo && a.prazo < new Date().toLocaleDateString('sv-SE')) || a.mes_previsto < hoje()));
  const ultimaAtividade = (b) => {
    const datas = [
      ...b.acoes.filter((a) => a.atualizada_por && b.clientes.includes(a.atualizada_por) && a.atualizada_em).map((a) => a.atualizada_em),
      ...b.mensagens.filter((m) => m.de === 'cliente').map((m) => m.criada_em),
      ...b.pedidos.map((p) => p.enviado_em), ...b.numeros.map((n) => n.enviado_em).filter(Boolean),
    ];
    return datas.length ? datas.sort().pop() : null;
  };
  const pecasAtrasadas = (b) => {
    const prazo = (b.plano && b.plano.prazo_revisao_dias) || 2;
    return b.pedidos.filter((p) => p.status === 'em_analise' && diasUteisDesde(p.enviado_em) > prazo);
  };
  const pesquisaPrevista = (b) => {
    const ini = inicioRef(b); if (!ini) return null;
    const dur = b.plano.duracao_meses || 18; const n = U.mesDoPlano(b.plano);
    const prox = MESES_PESQUISA(dur).find((m) => m >= n);
    return prox ? { mes: prox, ref: U.addRef(ini, prox - 1), agora: prox === n } : null;
  };

  // ===== sinais de risco (visão geral) =====
  function sinais(b) {
    const s = [];
    // "Só acesso": o período grátis (ou pago) acabando ou já vencido
    if (b.plano && b.plano.tipo === 'acesso' && b.plano.status === 'ativo') {
      const dias = U.acessoDiasRestantes(b.plano);
      if (dias != null && dias < 0) s.push({ nivel: 'alto', texto: 'Pagamento pendente desde ' + U.diaAno(U.acessoVence(b.plano)), aba: 'plano' });
      else if (dias != null && dias <= 10) s.push({ nivel: 'medio', texto: 'Acesso termina em ' + (dias === 0 ? 'hoje' : dias + (dias === 1 ? ' dia' : ' dias')), aba: 'plano' });
    }
    if (!ativo(b)) return s;
    const ini = inicioRef(b); const mp = mesPassado();
    const temNum = (r) => b.numeros.some((x) => x.mes_ref === r);
    if (ini && mp >= ini && !temNum(mp) && !b.plano.sem_numeros) {
      const ant = U.addRef(mp, -1);
      if (ant >= ini && !temNum(ant)) s.push({ nivel: 'alto', texto: 'Sem números há 2 meses', aba: 'resultados' });
      else s.push({ nivel: 'medio', texto: 'Números de ' + U.nomeMes(mp) + ' não chegaram', aba: 'resultados' });
    }
    const atr = essAtrasadas(b).length;
    if (atr) s.push({ nivel: 'alto', texto: atr + (atr === 1 ? ' essencial atrasada' : ' essenciais atrasadas'), aba: 'acoes' });
    // ação travada não é alerta: vai para a pauta do encontro (pautaSugerida)
    const pa = pecasAtrasadas(b).length;
    if (pa) s.push({ nivel: 'alto', texto: pa + (pa === 1 ? ' peça passou do prazo de revisão' : ' peças passaram do prazo de revisão'), aba: 'pecas' });
    const pr = promessa(b); const ori = b.orientacoes.find((o) => o.mes_ref === hoje()) || {};
    Object.entries(PROM).forEach(([k, t]) => { if (pr[k] != null && pr[k] < 0 && !ori['nota_' + k]) s.push({ nivel: 'medio', texto: t + ' caiu e está sem explicação', aba: 'foco' }); });
    if (!ori.veredito && new Date().getDate() >= 10) s.push({ nivel: 'medio', texto: 'Sem veredito de ' + U.nomeMes(hoje()), aba: 'foco' });
    if (U.mesDoPlano(b.plano) < (b.plano.duracao_meses || 18) && !b.acoes.some((a) => a.mes_previsto === proxMes())) s.push({ nivel: 'medio', texto: 'Nada planejado para ' + U.nomeMes(proxMes()), aba: 'foco' });
    const ult = ultimaAtividade(b);
    const ativoHa = ult ? diasDesde(ult) : (b.plano.inicio ? diasDesde(b.plano.inicio) : 0);
    if (ativoHa > 30) s.push({ nivel: 'medio', texto: 'Cliente sem atividade no portal há ' + ativoHa + ' dias', aba: 'mensagens' });
    const aberta = [...b.pesquisas].reverse().find((q) => q.aberta);
    if (aberta) { const n = b.respostas.filter((r) => r.pesquisa_id === aberta.id).length; if (n < 30) s.push({ nivel: 'info', texto: 'Pesquisa com ' + n + (n === 1 ? ' resposta' : ' respostas') + ' (o ideal é 30)', aba: 'resultados' }); }
    // lançamento: perto de 1 ano, avisar a virada da comunicação (a meta de marca já vira sozinha no 13º mês)
    if (b.plano.esforco_marca_pct === 35) { const mp2 = U.mesDoPlano(b.plano); if (mp2 >= 11 && mp2 <= 13) s.push({ nivel: 'info', texto: 'Lançamento perto de 1 ano: virar a comunicação de experimentar para lembrar da marca', aba: 'foco' }); }
    // lembrança espontânea caindo entre as duas últimas pesquisas com amostra mínima: primeiro sinal de marca envelhecendo
    const lq = lembrancaQueda(b);
    if (lq) s.push({ nivel: 'medio', texto: 'Lembrança espontânea caiu de ' + lq[0] + '% para ' + lq[1] + '% entre as duas últimas pesquisas', aba: 'resultados' });
    const pp = pesquisaPrevista(b);
    if (pp && pp.agora && !b.pesquisas.some((q) => q.criada_em && q.criada_em.slice(0, 7) === hoje())) s.push({ nivel: 'info', texto: 'Pesquisa de marca prevista para este mês', aba: 'resultados' });
    return s;
  }
  const PESO_NIVEL = { alto: 10, medio: 3, info: 1 };
  const gravidade = (s) => s.reduce((a, x) => a + PESO_NIVEL[x.nivel], 0);

  // ===== fechamento do mês (6 passos) =====
  function fechamento(b) {
    const mp = mesPassado(); const h = hoje(); const px = proxMes();
    const ori = b.orientacoes.find((o) => o.mes_ref === h) || {};
    const pr = promessa(b);
    const caindo = Object.keys(PROM).filter((k) => pr[k] != null && pr[k] < 0);
    const semNota = caindo.filter((k) => !ori['nota_' + k]);
    const doProx = b.acoes.filter((a) => a.mes_previsto === px);
    const agora = new Date().toISOString();
    const encontro = b.encontros.filter((e) => e.status !== 'realizado' && e.inicio >= agora).sort((x, y) => (x.inicio < y.inicio ? -1 : 1))[0];
    const pendentes = b.pedidos.filter((p) => p.status === 'em_analise');
    // ações feitas cuja data de leitura da métrica já chegou e ainda estão sem resultado
    const hojeD = new Date().toLocaleDateString('sv-SE');
    const semResultado = b.acoes.filter((a) => a.status === 'feita' && !a.resultado && a.concluida_em && U.addDias(a.concluida_em, a.esforco === 'marca' ? 7 : a.ler_em_dias || 30) <= hojeD);
    const ini = inicioRef(b);
    return [
      b.plano && b.plano.sem_numeros
        ? { ok: true, chave: 'numeros', desfazer: true, titulo: 'Números do mês', detalhe: 'Combinado: este cliente não envia os números. Os avisos estão desligados.', aba: 'plano' }
        : { ok: !ini || mp < ini || b.numeros.some((x) => x.mes_ref === mp), chave: 'numeros', titulo: 'Números de ' + U.nomeMes(mp) + ' recebidos', detalhe: 'Faturamento, clientes e propostas do mês que passou.', aba: 'resultados', acao: 'Lançar ou cobrar os números' },
      { ok: !!ori.veredito && !semNota.length, titulo: 'Veredito do mês e porquês escritos', detalhe: !ori.veredito ? 'Uma frase: estamos mais perto da meta?' : semNota.length ? 'Falta explicar: ' + semNota.map((k) => PROM[k]).join(', ') + '.' : 'Veredito publicado' + (caindo.length ? ' e números em queda explicados.' : '.'), aba: 'foco', acao: 'Planejar o mês' },
      { ok: doProx.length > 0 && doProx.some((a) => a.peso === 'essencial'), titulo: 'Ações de ' + U.nomeMes(px) + ' planejadas', detalhe: doProx.length ? doProx.length + (doProx.length === 1 ? ' ação' : ' ações') + (doProx.some((a) => a.peso === 'essencial') ? ', com essencial.' : ', mas nenhuma essencial.') : 'Nenhuma ação no próximo mês.', aba: 'foco', acao: 'Planejar o mês' },
      { ok: !!encontro && (encontro.pauta || []).length > 0, titulo: 'Próximo encontro marcado e com pauta', detalhe: encontro ? U.quando(encontro.inicio) + ((encontro.pauta || []).length ? ' · pauta com ' + encontro.pauta.length + ' itens.' : ' · sem pauta.') : 'Nenhum encontro marcado.', aba: 'encontros', acao: encontro ? 'Montar a pauta' : 'Marcar' },
      { ok: !pendentes.length, titulo: 'Peças em revisão respondidas', detalhe: pendentes.length ? pendentes.length + (pendentes.length === 1 ? ' peça esperando' : ' peças esperando') + (pecasAtrasadas(b).length ? ', ' + pecasAtrasadas(b).length + ' fora do prazo.' : '.') : 'Nada esperando revisão.', aba: 'pecas', acao: 'Revisar' },
      { ok: !semResultado.length, titulo: 'Resultados lidos na data certa', detalhe: semResultado.length ? semResultado.length + (semResultado.length === 1 ? ' ação chegou na data de medir e está' : ' ações chegaram na data de medir e estão') + ' sem resultado marcado (nas de marca, só se foi feita; o efeito sai na pesquisa do semestre).' : 'Nenhuma ação esperando leitura.', aba: 'acoes', acao: 'Medir agora' },
    ];
  }

  // ===== equilíbrio do plano (aparece em Ações) =====
  function equilibrio(b) {
    const acs = b.acoes;
    // marca × ativação pelo peso das ações (P=1, M=2, G=4); a base (proposta, preço, atendimento, processo) não entra na conta
    const pesoDe = (t) => acs.filter((a) => U.tipoEsforco(a) === t).reduce((s, a) => s + U.pesoTamanho(a), 0);
    const pM = pesoDe('marca'); const pA = pesoDe('ativacao');
    const marcaPct = pM + pA ? Math.round((pM / (pM + pA)) * 100) : null;
    const nBase = acs.filter((a) => U.tipoEsforco(a) === 'base').length;
    const planejado = (b.plano && b.plano.esforco_marca_pct != null) ? U.metaMarcaPlano(b.plano) : (U.esforcoPadrao ? U.esforcoPadrao(b.empresa && b.empresa.setor) : 62);
    const porPromessa = { vendas: 0, pessoas: 0, valor: 0 };
    acs.forEach((a) => { porPromessa[U.promessaDe(a)] += 1; });
    const ini = inicioRef(b); const dur = b.plano ? b.plano.duracao_meses || 18 : 18;
    const semMarca = [];
    // só os meses já planejados (o que ainda não foi planejado aparece como "nada planejado" na visão geral)
    const ultimoPlanejado = acs.map((a) => a.mes_previsto).sort().pop();
    if (ini && ultimoPlanejado) for (let k = 0, r = ini; k < dur && r <= ultimoPlanejado; k += 1, r = U.addRef(r, 1)) { if (r >= hoje() && !acs.some((a) => a.mes_previsto === r && U.tipoEsforco(a) === 'marca')) semMarca.push(r); }
    return {
      marcaPct, planejado, porPromessa, nBase, semMarca: semMarca.slice(0, 6), semMarcaTotal: semMarca.length,
      causasSemAcao: b.causas.filter((c) => !acs.some((a) => a.causa_id === c.id)),
      objetivosSemAcao: b.objetivos.filter((o) => o.nivel !== 'comunicacao' && !acs.some((a) => a.objetivo_id === o.id)),
    };
  }

  // ===== compromisso da semana: placar das últimas semanas (as 8 anteriores à atual) =====
  const segundaDe = (iso) => { const x = new Date(iso + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); return x.toISOString().slice(0, 10); };
  function compromissos(b) {
    const atual = segundaDe(new Date().toISOString().slice(0, 10));
    const cs = b.compromissos || [];
    const semanas = Array.from({ length: 8 }, (_, i) => U.addDias(atual, -7 * (8 - i)));
    const estado = (sem) => { const c = cs.find((x) => x.semana === sem); return !c ? 'vazio' : c.cumprido === true ? 'ok' : c.cumprido === false ? 'nao' : 'sem'; };
    const com = semanas.filter((x) => estado(x) !== 'vazio');
    return { semanas: semanas.map((s) => ({ semana: s, estado: estado(s) })), feitas: semanas.filter((x) => estado(x) === 'ok').length, com: com.length,
      atual: cs.find((c) => c.semana === atual) || null,
      naoCumpridos: cs.filter((c) => c.cumprido === false && c.semana >= U.addDias(atual, -28)).sort((x, y) => (x.semana < y.semana ? 1 : -1)) };
  }

  // ===== pauta sugerida do encontro, a partir dos dados =====
  function pautaSugerida(b) {
    const itens = [];
    const atr = essAtrasadas(b);
    if (atr.length) itens.push('Essenciais atrasadas: ' + atr.slice(0, 3).map((a) => a.titulo).join('; ') + (atr.length > 3 ? ' e mais ' + (atr.length - 3) : ''));
    const pr = promessa(b);
    Object.entries(PROM).forEach(([k, t]) => { if (pr[k] != null && pr[k] < 0) itens.push(t + ' caiu (' + String(pr[k]).replace('.', ',') + '%): o que mudou e o que fazer'); });
    if (!b.plano.sem_numeros && !b.numeros.some((x) => x.mes_ref === mesPassado()) && inicioRef(b) && mesPassado() >= inicioRef(b)) itens.push('Números de ' + U.nomeMes(mesPassado()) + ': enviar até o encontro');
    const pend = b.pedidos.filter((p) => p.status === 'em_analise');
    if (pend.length) itens.push('Peças em revisão: ' + pend.slice(0, 3).map((p) => p.titulo || 'peça').join('; '));
    const desde = U.addRef(hoje(), -3);
    const fz = b.acoes.filter((a) => a.status === 'feita' && a.mes_previsto >= desde);
    if (fz.length) itens.push('O que funcionou nas ações feitas: ' + fz.slice(0, 3).map((a) => a.titulo).join('; '));
    const px = b.acoes.filter((a) => a.mes_previsto === proxMes());
    itens.push(px.length ? 'Ações de ' + U.nomeMes(proxMes()) + ': ' + px.slice(0, 3).map((a) => a.titulo).join('; ') : 'Definir as ações de ' + U.nomeMes(proxMes()));
    const pp = pesquisaPrevista(b);
    if (pp && (pp.agora || pp.mes === U.mesDoPlano(b.plano) + 1)) itens.push('Pesquisa de marca de ' + U.nomeMes(pp.ref) + ': combinar o envio do convite');
    // o que o cliente trouxe para o encontro
    const MOT = { tempo: 'sem tempo', verba: 'sem verba', duvida: 'com dúvida', outro: 'outro motivo' };
    b.acoes.filter((a) => a.travada && a.status !== 'feita').forEach((a) => itens.push('Travada (' + MOT[a.travada] + '): ' + a.titulo));
    // o compromisso da semana saiu do portal (repetia as ações do mês): não entra mais na pauta
    (b.sugestoes || []).filter((x) => x.tipo === 'duvida').forEach((x) => itens.push('Dúvida do cliente: ' + x.texto.slice(0, 140)));
    const ideias = (b.sugestoes || []).filter((x) => x.tipo !== 'duvida');
    if (ideias.length) itens.push((ideias.length === 1 ? 'Ideia do cliente: ' : ideias.length + ' ideias do cliente: ') + ideias.slice(0, 2).map((x) => x.texto.split('\n')[0].slice(0, 80)).join('; '));
    return itens;
  }

  // ===== repor o que o cliente adiantou =====
  // o cliente puxou uma ação do mês seguinte: entra outra da biblioteca naquele mês (ou no atual, se ele já passou),
  // do mesmo tipo de esforço e de tamanho parecido. Assim o plano mantém o volume até o fim. Devolve quantas repôs.
  async function repor(sb, empresaId, acoes, setor) {
    const P = window.GangPresets; if (!P || !P.acoes || !acoes) return 0;
    const pend = acoes.filter((a) => a.adiantada_de && !a.reposta); if (!pend.length) return 0;
    const pts = (t) => ({ P: 1, M: 2, G: 4 }[t] || 2);
    const ja = new Set(acoes.map((a) => a.titulo));
    const doSetor = (x) => !setor || !x.setores || x.setores.includes(setor);
    const hoje = new Date(); const atual = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0');
    const prazoNo = (mes, tam) => {
      const [y, m] = mes.split('-').map(Number);
      const d = tam === 'G' ? new Date(y, m, 0, 12) : new Date(y, m - 1, tam === 'P' ? 10 : 20, 12);
      while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
      const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
      return (d < amanha ? amanha : d).toLocaleDateString('sv-SE');
    };
    let n = 0;
    for (const a of pend) {
      const x = P.acoes.filter((y) => !y.manutencao && doSetor(y) && !ja.has(y.texto))
        .sort((p, q) => ((q.esforco === a.esforco) - (p.esforco === a.esforco)) || (Math.abs(pts(p.tam) - pts(a.tamanho)) - Math.abs(pts(q.tam) - pts(a.tamanho))))[0];
      if (!x) break; // a biblioteca acabou para este cliente
      const mes = a.adiantada_de < atual ? atual : a.adiantada_de;
      const r = await sb.from('acoes').insert({
        empresa_id: empresaId, titulo: x.texto, mes_previsto: mes, peso: 'ajuda', promessa: x.promessa || null, esforco: x.esforco || null,
        porque: x.porque || null, metrica_sucesso: x.metrica || null, passos: (x.passos || []).map((t) => ({ t, ok: false })),
        tamanho: x.tam || null, ler_em_dias: x.ler || null, modelo: x.modelo || null, prazo: prazoNo(mes, x.tam),
        responsavel: 'cliente', status: 'a_fazer', atualizada_em: new Date().toISOString(),
      });
      if (r.error) break;
      await sb.from('acoes').update({ reposta: true }).eq('id', a.id);
      ja.add(x.texto); n += 1;
    }
    return n;
  }

  window.GangSaude = { promessa, carregar, compromissos, repor, sinais, gravidade, fechamento, equilibrio, pautaSugerida, pesquisaPrevista, MESES_PESQUISA, PROM };
})();
