/* Respostas prontas do painel, agrupadas pelo autor da metodologia GANG.
   Cada lista vira um menu com "Outro…" no fim. Itens com campos extras (esforco, metrica, nivel…) preenchem o resto do formulário.
   Autores: Sharp & Romaniuk (How Brands Grow), Binet & Field (The Long and the Short of It), JWT (ciclo de planejamento),
   Roger Martin (escolhas e "o que teria que ser verdade"), Kapferer (identidade de marca). */
(() => {
  const S = 'Sharp & Romaniuk'; const B = 'Binet & Field'; const J = 'JWT'; const M = 'Roger Martin'; const K = 'Kapferer';
  const g = (grupo, itens) => itens.map((i) => (typeof i === 'string' ? { grupo, texto: i } : { grupo, ...i }));

  window.GangPresets = {
    // ===== Ações (título → já sugere esforço e métrica) =====
    acoes: [
      ...g(S, [
        { texto: 'Padronizar WhatsApp Business, assinatura de e-mail e modelos de documentos com a identidade da marca', porque: 'Marcas crescem quando são reconhecidas na hora; repetir a mesma cor, símbolo e frase em tudo cria memória.', esforco: 'marca', metrica: 'canais e documentos do dia a dia na identidade' },
        { texto: 'Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba', porque: 'O crescimento vem de conquistar mais compradores, principalmente os que compram pouco ou nunca compraram; a maior parte do mercado não está comprando hoje, e é ela que vai lembrar da marca na hora.', esforco: 'marca', metrica: 'Lembrança espontânea sobe na próxima pesquisa e clientes novos aumentam' },
        { texto: 'Produzir um conteúdo para uma situação de compra específica', porque: 'Ser lembrada em mais momentos de compra aumenta as chances de ser escolhida.', esforco: 'marca', metrica: 'a marca é mais lembrada nessa situação na próxima pesquisa' },
        { texto: 'Cadastrar e completar o perfil da empresa no Google, nos mapas e nos marketplaces do setor', porque: 'Quem é fácil de encontrar e comprar vende mais.', esforco: 'venda', metrica: 'buscas e contatos vindos desses canais aumentam' },
        { texto: 'Revisar o caminho de compra e cortar etapas: botão de WhatsApp, orçamento em 24h, Pix e cartão', porque: 'Cada obstáculo na compra perde clientes que já tinham escolhido a marca.', esforco: 'venda', metrica: 'Mais contatos viram compra' },
        { texto: 'Montar o calendário de comunicação dos próximos 6 meses', porque: 'Lembrança cai rápido; presença contínua o ano todo vale mais do que campanhas grandes e soltas, e a ausência abre espaço para o concorrente.', esforco: 'marca', metrica: 'Ação de marca em todos os meses do calendário' },
      ]),
      ...g(B, [
        { texto: 'Produzir uma peça emocional de marca (história, causa ou cliente real)', porque: 'Campanhas emocionais geram efeitos de marca maiores e mais duradouros do que as racionais, inclusive no B2B, que ainda usa pouca emoção.', esforco: 'marca', metrica: 'lembrança e preferência sobem na próxima pesquisa' },
        { texto: 'Fazer uma ação de ativação com prazo (oferta ou condição especial)', porque: 'Ativação converte quem já quer comprar; funciona no curto prazo, em equilíbrio com a marca.', esforco: 'venda', metrica: 'Pedidos no período da ação acima do normal' },
        { texto: 'Planejar a presença em anúncios para aparecer mais que os concorrentes, a partir da Biblioteca de Anúncios da Meta', porque: 'Marcas que aparecem mais do que o seu tamanho no mercado (participação de voz) tendem a crescer nos períodos seguintes.', esforco: 'marca', metrica: 'participação nas buscas sobe' },
      ]),
      ...g(J, [
        { texto: 'Reescrever o modelo de proposta: recomendação primeiro, problema do cliente, impacto em dinheiro e a mensagem central', porque: 'Quem decide lê o começo; proposta sem impacto calculado vira comparação de preço. É na proposta que o cliente decide pagar mais; ela precisa abrir pelo diferencial, não pelo preço.', esforco: 'venda', metrica: 'Fechamento e ticket médio das propostas sobem' },
        { texto: 'Treinar a equipe na mensagem central e no tom de voz', porque: 'A marca é o que a equipe diz em cada atendimento; sem discurso único, o posicionamento se perde.', esforco: 'marca', metrica: 'Equipe usa a mensagem central nas propostas e nos atendimentos' },
        { texto: 'Publicar o método ou processo da empresa', porque: 'Mostrar como se trabalha transforma promessa em prova e justifica preço.', esforco: 'marca', metrica: 'Contatos que citam o método' },
        { texto: 'Coletar e publicar depoimentos com nomes e números reais', porque: 'Prova social reduz o risco percebido na hora de contratar; quanto mais específica (nome, número, resultado), mais convence.', esforco: 'venda', metrica: 'Mais contatos viram clientes' },
      ]),
      ...g(K, [
        { texto: 'Trocar a fachada / ambiente para a nova identidade', porque: 'O ponto físico é o primeiro contato; a identidade aplicada ali muda a percepção na hora.', esforco: 'marca', metrica: 'clientes comentam a mudança' },
        { texto: 'Atualizar redes sociais com a nova identidade', porque: 'Coerência em todos os pontos de contato é o que constrói a identidade ao longo do tempo.', esforco: 'marca', metrica: 'perfis 100% na nova marca' },
        { texto: 'Aplicar a identidade em papelaria, uniforme e veículos', porque: 'Cada ponto de contato é uma exposição gratuita da marca; inconsistência dilui a memória.', esforco: 'marca', metrica: 'todos os itens na nova marca' },
      ]),
    ],
    metricasSucesso: [
      ...g(S, ['lembrança espontânea sobe na próxima pesquisa', 'a marca é mais lembrada na situação de compra escolhida', 'clientes novos aumentam', 'ativos aparecem em 100% das peças e pontos de contato', 'nenhum mês sem ação de marca']),
      ...g(B, ['participação nas buscas sobe', 'preferência sobe na pesquisa semestral', 'Pedidos no período da ação acima do normal']),
      ...g(J, ['Fechamento e ticket médio das propostas sobem', 'Mais contatos viram compra', 'Contatos que citam o método', 'toda proposta abre com a mensagem central']),
      ...g(K, ['clientes comentam a mudança', 'todos os itens na nova marca']),
    ],
    naoFazer: [
      ...g(S, ['Promoções de preço frequentes', 'Trocar a identidade visual sem necessidade', 'Campanhas soltas com longas pausas', 'Falar só com quem já é cliente', 'Mudar a cor, o símbolo ou a frase da marca a cada peça']),
      ...g(B, ['Cortar a verba de marca para bater a meta do mês', 'Medir só as vendas da semana', 'Usar só anúncios de oferta']),
      ...g(M, ['Atender todo tipo de cliente', 'Lançar serviços fora do foco', 'Competir com quem joga só no preço']),
      ...g(K, ['Usar o logo antigo ou versões não oficiais', 'Fugir do tom de voz da marca', 'Prometer o que a equipe não entrega']),
    ],
    comQuem: g('Equipe do cliente', ['Marketing', 'Vendas', 'Atendimento', 'Sócio(a)', 'Agência', 'Fornecedor']),

    // ===== Foco do mês =====
    focos: [
      ...g(S, ['Ser lembrada em mais situações de compra.', 'Chegar a quem ainda não é cliente.', 'Usar os ativos distintivos em tudo o que sair.', 'Manter a marca presente todo mês, sem pausas.']),
      ...g(B, ['Equilibrar marca e vendas no plano do mês.', 'Fazer a marca ser lembrada antes da compra.']),
      ...g(J, ['Levar a nova marca para a proposta comercial.', 'Colocar a mensagem central em todo atendimento.', 'Medir: enviar os números e rodar a pesquisa.']),
      ...g(K, ['Aplicar a nova identidade em todos os pontos de contato.', 'Falar sempre no tom de voz da marca.']),
      ...g('Ehrenberg-Bass', ['Alcançar quem compra pouco ou nunca comprou.', 'Ficar fácil de encontrar e de comprar.', 'Ser reconhecida mesmo sem o logo.']),
      ...g('Binet & Field', ['Criar emoção e lembrança, não só oferta.', 'Escrever o objetivo da campanha em números de negócio.']),
      ...g('Berry', ['Entregar a promessa em cada atendimento.', 'Fazer a equipe entender e viver a marca.']),
      ...g('Preço e valor', ['Mostrar o valor antes do preço.', 'Proteger o preço: desconto só com regra e em troca de algo.', 'Provar com casos e números o que a empresa entrega.']),
      ...g('Relacionamento', ['Transformar clientes satisfeitos em avaliações e indicações.', 'Cuidar do pós-venda: o cliente que volta e indica.']),
      ...g('Pesquisa', ['Ouvir o cliente: rodar a pesquisa de marca do semestre.', 'Entender por que quem não comprou escolheu outro.']),
    ],

    // ===== Veredito do mês: uma frase que responde "estamos mais perto da meta?" =====
    vereditos: [
      ...g('No rumo', [
        'Estamos no ritmo da meta: mais gente lembrando da marca e mais clientes chegando.',
        'O ticket médio subiu: os clientes estão aceitando pagar mais pelo que a empresa entrega.',
        'Mais clientes novos vieram de indicação e busca pelo nome: sinal de que a marca está sendo lembrada.',
        'As vendas cresceram sem desconto: a proposta nova está mostrando o valor.',
      ]),
      ...g('Atenção', [
        'Mais gente está chegando, mas ainda pelo preço: o trabalho agora é mostrar o valor antes do preço.',
        'As vendas subiram, mas vieram quase só de quem já era cliente: precisamos alcançar quem ainda não compra.',
        'A marca começou a ser mais lembrada; o efeito em vendas costuma aparecer nos próximos meses.',
        'As ações de marca atrasaram neste mês; sem presença contínua, a lembrança cai.',
        'O mês foi fraco por fatores de fora (época do ano, mercado); o plano segue como combinado.',
      ]),
      ...g('Ajuste', [
        'Os números caíram e o plano precisa de ajuste: vamos rever as ações no encontro.',
        'Estamos vendendo com desconto demais: a prioridade agora é proteger o preço.',
        'A mensagem ainda não está clara para o cliente: vamos simplificar o que a empresa diz.',
      ]),
      ...g('Sem números', [
        'Sem os números do mês, o veredito é sobre a execução: as ações essenciais andaram como o previsto.',
        'Sem os números do mês, o veredito é sobre a execução: as ações essenciais atrasaram e vamos recuperar no próximo mês.',
      ]),
    ],

    // ===== Por que o número caiu (um por parte da promessa) =====
    notasVendas: g('Venda mais', [
      'Mês mais fraco pela época do ano; comparado ao mesmo mês do ano passado, estamos no mesmo nível ou acima.',
      'Um mês fraco não muda a tendência: o efeito da marca aparece em meses, não em semanas.',
      'Ficamos sem comunicação de marca no período e a procura caiu; voltamos a aparecer neste mês.',
      'Fatores de fora (economia, concorrente com promoção) pesaram; seguimos sem baixar o preço.',
      'Menos pessoas pediram orçamento; o foco do mês é voltar a ser lembrada por quem ainda não compra.',
    ]),
    notasPessoas: g('Para mais pessoas', [
      'Menos clientes novos porque a campanha de alcance terminou; a próxima já está no calendário.',
      'Atendemos menos clientes, mas maiores: efeito da escolha do nicho.',
      'A marca ainda é pouco lembrada fora da base atual; o foco do mês é alcançar quem ainda não compra.',
      'A base de clientes cresce devagar no começo; quem compra pouco aparece ao longo dos meses.',
      'Os canais onde o cliente procura (Google, mapas) ficaram desatualizados; estamos corrigindo.',
    ]),
    notasValor: g('Com mais valor', [
      'Entraram mais clientes pequenos, que baixaram a média; a proposta nova deve fazer o ticket voltar a subir.',
      'Demos mais descontos do que o combinado; a política de descontos entra em vigor neste mês.',
      'O ticket caiu porque vendemos mais do serviço de entrada; é a porta para o serviço maior.',
      'O preço ainda aparece antes do valor nas peças; estamos invertendo isso na comunicação.',
      'Ainda faltam provas do que a empresa entrega (casos, números, depoimentos); é o próximo passo.',
    ]),

    // ===== Métricas (nome → já sugere nível e frequência) =====
    metricas: [
      ...g(S, [
        { texto: 'Lembrança em situações de compra', nivel: 'marca', frequencia: 'semestral' },
        { texto: 'Clientes novos (penetração)', nivel: 'negocio', frequencia: 'mensal' },
        { texto: 'Fama e exclusividade dos ativos', nivel: 'marca', frequencia: 'semestral' },
      ]),
      ...g(B, [
        { texto: 'Participação nas buscas', nivel: 'marketing', frequencia: 'mensal' },
        { texto: 'Lembrança e preferência', nivel: 'marca', frequencia: 'semestral' },
      ]),
      ...g(J, [
        { texto: 'Ticket médio', nivel: 'negocio', frequencia: 'mensal' },
        { texto: 'Leads · conversão', nivel: 'marketing', frequencia: 'mensal' },
        { texto: 'Faturamento', nivel: 'negocio', frequencia: 'mensal' },
      ]),
      ...g(S, [{ texto: 'Fatia nas lembranças da categoria', nivel: 'marca', frequencia: 'semestral' }]),
    ],

    // ===== Encontros =====
    pauta: [
      ...g(J, ['As ações do mês saíram no prazo?', 'Números do mês passado', 'Plano de ações do próximo mês', 'Decisões e responsáveis']),
      ...g(B, ['Equilíbrio entre marca e vendas']),
      ...g(S, ['Resultados da pesquisa de marca', 'Situação de compra mais fraca: o que fazer']),
      ...g(M, ['Revisar as condições da estratégia']),
      ...g(K, ['Suas peças em revisão', 'Coerência da marca nos pontos de contato']),
      ...g('Outros temas', ['Ações que funcionaram e as que não', 'Mensagens e pedidos do mês', 'Clientes novos e os que voltaram', 'Próxima rodada da pesquisa', 'Sugestões do cliente', 'Calendário do próximo mês']),
    ],

    // ===== Revisão de peças: respostas prontas =====
    respostasPeca: [
      ...g(S, ['Use os ativos distintivos (cor, símbolo) de forma visível.', 'Mostre o nome da marca mais cedo e maior.', 'Fale com a situação de compra, não só com o produto.']),
      ...g(J, ['Abra com a mensagem central, não com a tabela de preços.', 'Deixe claro o próximo passo para o cliente.']),
      ...g(K, ['O tom está fora da plataforma: mais direto e próximo.', 'A identidade visual não está aplicada corretamente.']),
      ...g('Aprovação', ['Aprovado: está no padrão da marca.', 'Aprovado com um ajuste pequeno, pode publicar depois de corrigir.']),
    ],

    // ===== Diagnóstico (JWT) =====
    notam: g(J, ['Marca pouco lembrada', 'Visual antigo ou sem padrão', 'Não notam diferença entre as marcas', 'Presença forte nas redes', 'Preço baixo em destaque', 'Marca forte, muita propaganda']),
    acreditam: g(J, ['Bom preço, entrega no prazo', 'Grande e confiável', 'Barato, qualidade variável', 'Especialista no que faz', 'Igual aos outros']),
    sentem: g(J, ['Confiança, mas sem orgulho de comprar', 'Segurança', 'Desconfiança', 'Distância, atendimento frio', 'Proximidade']),
    motivadores: g(J, ['Prazo cumprido', 'Preço justo', 'Atendimento rápido', 'Qualidade do serviço', 'Garantia', 'Facilidade de contratar', 'Localização']),
    discriminadores: g(J, ['Método próprio', 'Especialização no segmento', 'Resultado comprovado', 'Experiência do atendimento', 'Inovação', 'Marca reconhecida']),
    causas: g(J, [
      'A marca não mostra o que a torna diferente', 'A proposta comercial começa pelo preço', 'A equipe não tem um discurso único',
      'Pouca presença onde o cliente procura', 'Comunicação irregular, com pausas longas', 'O visual não tem ativos distintivos',
      'A marca compete principalmente por preço',
    ]),

    // ===== Estratégia =====
    objetivos: [
      ...g(B, [
        { texto: 'faturamento em 18 meses, com ticket médio maior', nivel: 'negocio' },
        { texto: 'faturamento em 12 meses com mais clientes novos', nivel: 'negocio' },
      ]),
      ...g(S, [
        { texto: 'Ser lembrada em mais situações de compra que os concorrentes', nivel: 'marca' },
        { texto: 'Ser reconhecida sem precisar ler o nome', nivel: 'marca' },
      ]),
      ...g(K, [
        { texto: 'O que o cliente precisa notar, acreditar e sentir', nivel: 'comunicacao' },
      ]),
    ],
    destaques: g(B, ['+10%', '+20%', '+30%', '+50%', '2x']),
    notar: g(K, ['a nova identidade', 'a marca em mais lugares', 'o método', 'a especialização']),
    acreditar: g(K, ['no método', 'na especialização', 'na qualidade', 'no resultado']),
    sentir: g(K, ['segurança', 'confiança', 'orgulho de escolher', 'proximidade']),
    situacoes: g(S, [
      'Algo quebrou ou é urgente', 'Vou mudar de fase (abrir, mudar, ampliar)', 'Comprei ou aluguei um imóvel / espaço novo',
      'Vou reformar antes de alugar ou vender', 'Quero modernizar a empresa ou a loja', 'Recebi uma indicação de alguém de confiança',
      'Estou comparando preços', 'Preciso de alguém de confiança, sem dor de cabeça', 'Data sazonal (fim de ano, volta às aulas…)',
      'Quero me presentear ou presentear alguém',
    ]),
    prioridades: g(M, ['Clientes que valorizam qualidade acima de preço', 'Empresas de médio porte da região', 'O serviço principal, de maior margem', 'Projetos completos com o método', 'A região onde a marca já é conhecida']),
    deixados: g(M, ['Cliente que só busca preço', 'Serviço avulso de baixa margem', 'Regiões distantes', 'Promoções de preço no varejo', 'Canais que não trazem clientes']),
    condicoes: g(M, [
      'Os clientes-alvo valorizam a especialização', 'Clientes de alto valor aceitam pagar mais pelo diferencial', 'A equipe entrega a promessa em todo atendimento',
      'Os concorrentes não copiam o diferencial no curto prazo', 'O canal escolhido alcança o cliente-alvo', 'A operação comporta o crescimento',
    ]),
    verificacoes: g(M, ['Ticket médio das propostas novas', 'Avaliação dos clientes ao fim do serviço', 'Taxa de fechamento das propostas', 'Pesquisa de marca semestral', 'Leitura trimestral dos sites e propostas dos concorrentes', 'Capacidade da equipe no mês']),
    donos: g('Quem checa', ['Cliente', 'GANG', 'Cliente e GANG']),

    // ===== Plataforma (Kapferer) =====
    tom: g(K, [
      { texto: 'Direta', descricao: 'Fala o que faz sem rodeio' }, { texto: 'Segura', descricao: 'Mostra método, não promessa' },
      { texto: 'Próxima', descricao: 'Linguagem do dono, sem jargão' }, { texto: 'Acolhedora', descricao: 'Cuida, explica com calma' },
      { texto: 'Técnica', descricao: 'Precisa, com dados e provas' }, { texto: 'Ousada', descricao: 'Provoca e sai do óbvio' },
      { texto: 'Bem-humorada', descricao: 'Leve, sem perder a seriedade' }, { texto: 'Sofisticada', descricao: 'Poucas palavras, bem escolhidas' },
    ]),

    // ===== Identidade =====
    pontosContato: g(K, ['Fachada', 'Redes sociais', 'Site', 'Proposta comercial', 'Google (perfil da empresa)', 'WhatsApp Business', 'Cartão de visita', 'Assinatura de e-mail', 'Uniforme', 'Veículo', 'Embalagem', 'Papelaria']),
    nomesCor: g(K, ['Primária', 'Secundária', 'Apoio', 'Fundo', 'Destaque']),
    usosFonte: g(K, ['Títulos e destaques', 'Textos longos, propostas, site', 'Números e dados', 'Assinatura e detalhes']),
    nomesAtivo: g(S, ['Cor da marca', 'Símbolo', 'Frase da marca', 'Personagem', 'Padrão gráfico', 'Som / vinheta']),
    planoInclui: g('GANG', ['1 encontro mensal · revisão semestral · revisão de peças · contato direto com o consultor', '2 encontros mensais · revisão trimestral · revisão de peças ilimitada · contato direto com o consultor']),
  };
  // ===== Biblioteca: ações dos livros do Drive mais bem avaliados no Goodreads =====
  // cada uma diz qual parte da promessa move (vendas, pessoas, valor)
  const livro = (grupo, itens) => itens.map(([texto, esforco, promessa, porque, metrica, tema]) => ({ grupo, texto, esforco, promessa, porque, metrica, tema }));
  window.GangPresets.acoes.push(
    ...livro('Schwartz · Breakthrough Advertising', [
      ['Reescrever o anúncio principal para o nível de consciência do cliente', 'venda', 'pessoas', 'Quem ainda não sabe que tem o problema não reage a oferta: a mensagem precisa começar onde está a cabeça do cliente.', 'contatos por anúncio sobem'],
    ]),
    ...livro('Dib · Lean Marketing', [
      ['Escolher a especialidade principal e mostrá-la em tudo, sem deixar de falar com toda a categoria', 'marca', 'pessoas', 'Ser conhecida por uma especialidade ajuda a ser lembrada, mas a marca cresce falando com todos que compram a categoria, não só com um segmento.', 'contatos que citam a especialidade'],
      ['Criar um material útil em troca do contato (guia, checklist ou diagnóstico)', 'venda', 'pessoas', 'A maioria não compra no primeiro contato; guardar o contato permite acompanhar até a hora da compra.', 'contatos gerados pelo material'],
    ]),
    ...livro('Dunford · Obviously Awesome', [
      ['Reescrever o site: abrir pelo que só você entrega, na linguagem do cliente', 'marca', 'valor', 'O cliente decide em segundos se você é para ele; o valor único precisa vir primeiro, em texto claro e com as palavras dele.', 'contatos vindos do site sobem'],
    ]),
    ...livro('Sheridan · They Ask, You Answer', [
      ['Responder no site as 5 perguntas que todo cliente faz, inclusive o preço', 'marca', 'pessoas', 'Quem responde com honestidade às dúvidas do comprador vira a fonte de confiança da categoria; falar de preço abertamente filtra curiosos e traz o cliente mais preparado.', 'visitas e contatos vindos dessas páginas'],
      ['Montar um kit de conteúdos (vídeo, caso, perguntas frequentes) para mandar antes da reunião', 'venda', 'vendas', 'O cliente que leu antes da conversa chega com menos dúvidas e fecha mais rápido.', 'clientes que viram o kit fecham mais', 'venda'],
    ]),
    ...livro('Miller · StoryBrand', [
      ['Escrever o roteiro da marca: o cliente é o herói, a marca é o guia', 'marca', 'vendas', 'Mensagens que falam da empresa são ignoradas; mensagens sobre o problema do cliente são ouvidas.', 'roteiro aplicado no site e nas propostas'],
      ['Escrever o plano em 3 passos e a chamada principal e aplicar no site e nas peças atuais', 'venda', 'vendas', 'Confusão custa vendas: o cliente precisa saber exatamente qual é o próximo passo.', 'contatos por visita sobem', 'conteudo'],
    ]),
    ...livro('Enns · The Four Conversations', [
      ['Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada', 'venda', 'valor', 'Com opções, o cliente escolhe entre as suas propostas, não entre você e o concorrente; a mais completa vira a referência e a recomendada facilita a decisão.', 'ticket médio sobe'],
    ]),
    ...livro('Helmer · 7 Powers', [
      ['Fazer uma oficina de 1 hora com os sócios: o que o cliente usaria se a empresa não existisse e o que só ela faz', 'marca', 'valor', 'O posicionamento começa pela comparação que o cliente realmente faz e se apoia no que é difícil de copiar.', 'diferenciais escritos e confirmados com 3 clientes'],
      ['Escrever em uma página o passo a passo do atendimento e treinar a equipe nele', 'venda', 'valor', 'O que está escrito se repete em todo atendimento e vira um ativo da marca; o que depende de cada pessoa varia.', 'Atendimento igual em toda a equipe e nota de satisfação sobe'],
    ]),
    ...livro('Trott · Predatory Thinking', [
      ['Criar um comparativo de uma página: a empresa e o concorrente principal, lado a lado', 'venda', 'valor', 'O cliente sempre compara; quem conduz a comparação escolhe em que terreno a disputa acontece.', 'propostas perdidas para o concorrente caem', 'venda'],
    ]),
    ...livro('Morgan · Eating the Big Fish', [
      ['Publicar um manifesto curto: o que a marca defende e o que se recusa a fazer', 'marca', 'valor', 'Marcas desafiantes crescem com uma posição clara; ficar no meio não chama atenção.', 'Manifesto publicado e citado por clientes'],
    ]),
    ...livro('Maister · The Trusted Advisor', [
      ['Ligar para os clientes atendidos há cerca de 30 dias', 'venda', 'vendas', 'Confiança se constrói depois da venda; é nela que nascem a recompra e a indicação.', 'recompras e indicações'],
      ['Escrever e enviar para a base de clientes uma mensagem útil (dica, novidade ou caso), sem vender', 'marca', 'vendas', 'Quem ajuda sem pedir nada é lembrado quando a necessidade aparece.', 'clientes antigos que respondem ou voltam a comprar', 'relacao'],
    ]),
    ...livro('Hopkins · A ciência da publicidade', [
      ['Testar duas versões do anúncio ou da página, com a métrica decidida antes', 'venda', 'vendas', 'Publicidade se decide por resultado medido, não por opinião; decidir a métrica antes evita escolher o resultado depois.', 'versão vencedora escolhida pelos números'],
      ['Revisar o site e os anúncios trocando adjetivos por fatos e números', 'venda', 'valor', 'Fato específico convence; promessa genérica é ignorada.', 'peças revisadas convertem mais', 'anuncio'],
    ]),
    ...livro('Port · Book Yourself Solid', [
      ['Publicar no site as situações em que a empresa é a melhor escolha', 'marca', 'pessoas', 'As pessoas compram quando surge uma situação; mostrar essas situações liga a marca a elas e faz a empresa ser lembrada na hora certa.', 'contatos que citam uma das situações', 'conteudo'],
    ]),
    // ----- mais atividades práticas, dos outros livros do Drive (o último campo é o tema) -----
    ...livro('Kennedy · The Ultimate Sales Letter', [
      ['Criar uma garantia clara, por escrito, que tira o risco do cliente', 'venda', 'valor', 'Tirar o risco da decisão remove a última objeção e permite cobrar mais.', 'fechamento sobe sem baixar preço', 'preco'],
    ]),
    ...livro('Williams · The Wizard of Ads', [
      ['Criar um bordão ou personagem próprio e usar em todos os anúncios', 'marca', 'pessoas', 'Elementos memoráveis repetidos fazem a marca ser lembrada sem esforço do cliente.', 'bordão lembrado na pesquisa', 'anuncio'],
    ]),
    ...livro('Sheridan · The Visual Sale', [
      ['Gravar um vídeo de 2 minutos apresentando a equipe e o jeito de trabalhar', 'marca', 'pessoas', 'Ver as pessoas antes do primeiro contato cria confiança e encurta a venda.', 'Contatos chegam às reuniões já tendo visto o vídeo', 'conteudo'],
    ]),
    ...livro('Dib · Lean Marketing', [
      ['Pedir avaliação no Google aos clientes satisfeitos recentes e deixar o link pronto para os próximos', 'venda', 'pessoas', 'Avaliações são a prova social que o cliente vê antes de ligar; pedir na hora certa multiplica o número delas.', 'Número e nota média das avaliações sobem', 'relacao'],
    ]),
    ...livro('Port · Book Yourself Solid', [
      ['Pedir indicações de forma direta, dizendo que tipo de cliente a empresa procura', 'venda', 'pessoas', 'Clientes indicam quando sabem quem indicar; pedido genérico rende pouco.', 'Indicações recebidas aumentam', 'relacao'],
      ['Montar uma rede de parceiros que atendem o mesmo cliente e trocar indicações', 'venda', 'pessoas', 'Parceiros que falam com o mesmo público abrem portas que a empresa sozinha não abre.', 'clientes vindos de parceiros', 'relacao'],
    ]),
    ...livro('Maister · Managing the Professional Service Firm', [
      ['Fazer reunião de balanço com os clientes que concluíram projetos recentemente: o que funcionou e o que melhorar', 'marca', 'valor', 'Ouvir o cliente no fim mostra cuidado, corrige falhas e abre espaço para o próximo projeto.', 'Balanços feitos e novos projetos fechados', 'experiencia'],
      ['Criar e enviar uma pesquisa curta aos clientes atendidos recentemente: nota de 0 a 10 e um porquê', 'marca', 'valor', 'Medir a satisfação logo após a entrega mostra problemas antes que virem perda de cliente.', 'reclamações resolvidas a partir das respostas', 'medicao'],
    ]),
    ...livro('Your Customer Journey', [
      ['Desenhar a jornada do cliente, do primeiro contato ao pós-venda, e corrigir o pior momento', 'marca', 'valor', 'A experiência é lembrada pelo pior momento; corrigir esse ponto vale mais que melhorar o que já é bom.', 'pior momento identificado e corrigido', 'experiencia'],
      ['Escrever a mensagem de boas-vindas pós-compra, explicando os próximos passos', 'marca', 'valor', 'O cliente fica inseguro logo depois de pagar; explicar o que vem a seguir confirma que escolheu bem.', 'menos dúvidas e reclamações no início', 'experiencia'],
    ]),
    ...livro('Anderson · TED Talks', [
      ['Montar e ensaiar uma apresentação comercial curta, com uma ideia central', 'venda', 'valor', 'Uma ideia clara, bem ensaiada, convence mais que muitos argumentos soltos.', 'reuniões que avançam para proposta', 'venda'],
    ]),
    ...livro('Nagle · Estratégia e tática de preços', [
      ['Criar uma versão premium do serviço principal', 'venda', 'valor', 'Parte dos clientes paga mais por mais; sem a versão premium, esse dinheiro fica na mesa.', 'vendas da versão premium', 'preco'],
    ]),
    ...livro('Moon · Diferente', [
      ['Cortar um item que a empresa oferece e o cliente não valoriza, e reforçar o essencial na comunicação', 'marca', 'valor', 'Quando todos oferecem tudo, cortar o supérfluo e reforçar o essencial torna a marca diferente.', 'custo menor sem queda na satisfação', 'posicionamento'],
    ]),
    ...livro('Aaker · Creating Signature Stories', [
      ['Contar a história de origem da empresa em um texto e um vídeo', 'marca', 'valor', 'Histórias são lembradas e repetidas muito mais que fatos e listas de benefícios.', 'história publicada e usada nas vendas', 'conteudo'],
    ]),
    ...livro('Hanlon · Primalbranding', [
      ['Criar um ritual marcante na entrega (embalagem, boas-vindas, encerramento)', 'marca', 'valor', 'Rituais dão significado à compra e fazem o cliente contar para os outros.', 'clientes que comentam ou postam a entrega', 'experiencia'],
    ]),
    ...livro('Watkins · Hello, My Name Is Awesome', [
      ['Dar um nome próprio ao método ou ao serviço principal', 'marca', 'valor', 'O que tem nome é lembrado, indicado e difícil de comparar com o concorrente.', 'clientes que citam o nome do método', 'posicionamento'],
    ]),
    ...livro('Dooley · Brainfluence', [
      ['Usar fotos de clientes reais com quem o público se identifica, e da equipe, no lugar de bancos de imagem', 'marca', 'valor', 'Rostos reais chamam atenção e transmitem confiança; e as pessoas criam ligação com marcas usadas por gente parecida com elas, enquanto foto genérica é ignorada.', 'Peças com pessoas reais convertem mais', 'conteudo'],
    ]),
    ...livro('Romaniuk · Ativos distintivos', [
      ['Reeditar os vídeos e anúncios para a marca aparecer nos 3 primeiros segundos', 'marca', 'pessoas', 'Se a marca aparece só no fim, quem pula o anúncio nunca sabe de quem era.', 'Mais pessoas lembram de quem era o anúncio', 'anuncio'],
    ]),
    ...livro('LeeYohn · Fusion', [
      ['Incluir os valores da marca no processo de contratação', 'marca', 'valor', 'A equipe entrega a marca todos os dias; contratar quem combina com ela é o jeito mais barato de manter a promessa.', 'novas contratações apresentadas à marca', 'equipe'],
    ]),
    ...livro('Heyward · Obsessed', [
      ['Mandar o guia de tom de voz para todos que escrevem ou atendem pela empresa', 'marca', 'valor', 'A marca soa como uma só quando todos falam do mesmo jeito.', 'peças aprovadas na revisão sem ajuste de tom', 'equipe'],
    ]),
    ...livro('Blank & Dorf · Startup: Manual do Empreendedor', [
      ['Entrevistar 10 clientes que escolheram o concorrente: por que não a sua empresa', 'marca', 'valor', 'Quem não comprou mostra o que a empresa não enxerga sobre si mesma.', '10 entrevistas e 3 aprendizados', 'medicao'],
    ]),
    // ----- lacunas da jornada (revisão de cobertura) -----
    ...livro('Dib · Lean Marketing', [
      ['Definir quem responde os contatos e criar respostas prontas para responder em até 1 hora', 'venda', 'vendas', 'Quem responde primeiro costuma levar o cliente; contato que espera esfria ou procura o concorrente.', 'Tempo médio de resposta abaixo de 1 hora', 'experiencia'],
    ]),
    ...livro('Binet & Field', [
      ['Anunciar no Google para quem já está buscando o serviço', 'venda', 'vendas', 'Ativação funciona melhor com quem já quer comprar; aparecer na busca captura essa demanda.', 'contatos vindos da busca paga', 'anuncio'],
    ]),
    ...livro('Código de Eficácia B2B · LinkedIn, WARC e Lions', [
      ['Levar uma história da empresa para a imprensa local ou para a mídia do setor', 'marca', 'pessoas', 'Fama é um dos efeitos de maior impacto: ser comentado leva a marca a quem a publicidade não alcança.', 'matérias e menções publicadas', 'anuncio'],
      ['Participar de uma feira ou evento do setor com os ativos da marca', 'marca', 'pessoas', 'Eventos colocam a marca diante de compradores que ainda não a conhecem, no momento em que comparam fornecedores.', 'contatos novos qualificados', 'presenca'],
    ]),
    ...livro('Sharp & Romaniuk', [
      ['Planejar uma campanha para as datas e épocas em que o cliente mais compra, com a linguagem da marca', 'marca', 'vendas', 'Datas e estações são situações de compra; quem aparece nelas com a cara de sempre é lembrado e escolhido.', 'vendas da data acima do ano anterior', 'anuncio'],
    ]),
    ...livro('Sheridan · They Ask, You Answer', [
      ['Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números', 'venda', 'valor', 'O caso mostra a mudança de ponta a ponta e responde à pergunta "vai funcionar para mim?".', 'caso publicado e usado nas propostas', 'conteudo'],
    ]),
    ...livro('Fournier · Strong Brands, Strong Relationships', [
      ['Organizar um encontro ou evento para clientes (aula, café, visita ou lançamento)', 'marca', 'vendas', 'Clientes que se encontram em torno da marca criam laços com ela e entre si, e indicam mais.', 'presença no evento e indicações depois', 'relacao'],
    ]),
    ...livro('Your Customer Journey', [
      ['Fazer o teste do cliente oculto no próprio atendimento: telefone, WhatsApp e site', 'marca', 'valor', 'Quem está dentro não vê as falhas; passar pela jornada como cliente mostra onde a promessa quebra.', 'falhas encontradas e corrigidas', 'experiencia'],
      ['Responder todas as avaliações atuais, inclusive as negativas, e definir quem responde as novas', 'marca', 'valor', 'Quem pesquisa lê as respostas; uma reclamação bem respondida gera mais confiança que só elogios.', 'avaliações respondidas em até 2 dias', 'relacao'],
    ]),
    ...livro('LeeYohn · Fusion', [
      ['Fazer uma reunião com a equipe para mostrar os resultados da marca e os elogios de clientes', 'marca', 'valor', 'A equipe sustenta a marca quando vê o efeito do próprio trabalho.', 'reunião feita com toda a equipe', 'equipe'],
    ]),
    ...livro('Your Customer Journey', [
      ['Criar uma regra para reclamações: responder no mesmo dia e resolver em até 48 horas', 'marca', 'valor', 'Uma reclamação bem resolvida costuma gerar mais lealdade do que se o problema não tivesse acontecido.', 'reclamações resolvidas no prazo', 'experiencia'],
    ]),
    // ----- brindes: só os que levam a marca adiante ou fortalecem a relação -----
    ...livro('Sharp & Romaniuk', [
      ['Criar um brinde útil, do dia a dia, com os ativos da marca para entregar aos clientes', 'marca', 'pessoas', 'Brinde que é usado fica à vista e repete a cor, o símbolo e a frase da marca para o cliente e para quem está perto dele; brinde descartável desperdiça a verba.', 'brindes entregues e vistos em uso', 'presenca'],
    ]),
    ...livro('Luna & Renninger · Surprise', [
      ['Mandar um presente surpresa e personalizado para os melhores clientes, sem pedir nada em troca', 'marca', 'vendas', 'O inesperado é lembrado e comentado; um gesto pessoal, sem venda junto, fortalece a relação e gera indicação.', 'clientes que agradecem, comentam ou indicam', 'relacao'],
    ]),
    // ----- mais evidência: estudos do Ehrenberg-Bass, do IPA e testes de usabilidade (Drive) -----
    ...livro('Ehrenberg-Bass · Quando as marcas apagam as luzes', [
      ['Calcular a perda provável de vendas por ficar sem anunciar, antes de qualquer corte na verba de marca', 'marca', 'vendas', 'Em 41 marcas que pararam de anunciar, as vendas caíram em média 16% no primeiro ano, 25% em dois e 36% em três; marcas pequenas caem mais rápido.', 'decisão de verba tomada com a simulação', 'anuncio'],
    ]),
    ...livro('Ehrenberg-Bass · Uma vez é suficiente?', [
      ['Configurar os anúncios para alcance, com limite de frequência por pessoa', 'marca', 'pessoas', 'A resposta de vendas à publicidade é convexa: a primeira exposição rende mais que as repetições. Alcançar mais gente uma vez vale mais que poucas pessoas muitas vezes.', 'alcance sobe com a mesma verba', 'anuncio'],
    ]),
    ...livro('Romaniuk, Sharp & Ehrenberg · Diferenciação percebida', [
      ['Cobrir o logo das peças e testar se ainda dá para saber que são da marca', 'marca', 'pessoas', 'Em 17 mercados, os clientes quase não percebem diferença entre as marcas que compram; o que ajuda a ser escolhida é ser fácil de reconhecer. Peça que sem o logo podia ser de qualquer um não constrói marca.', 'peças reconhecíveis mesmo sem o logo', 'presenca'],
    ]),
    ...livro('Binet & Field · Marketing na era da responsabilidade', [
      ['Escrever o objetivo da próxima campanha em números de negócio (vendas, clientes ou preço), não em curtidas', 'marca', 'vendas', 'Em centenas de campanhas analisadas, as que tinham vários objetivos de negócio em números tiveram efeitos muito grandes em 76% dos casos, contra 28% das que tinham um só; objetivos intermediários (curtidas, lembrança) devem ser degraus, não a meta.', 'objetivo em número definido antes da campanha', 'medicao'],
    ]),
    // ----- mais estudos do Drive: credibilidade, saliência, teste de anúncio e preço -----
    ...livro('Erdem, Swait & Louviere · Credibilidade da marca e preço', [
      ['Reunir no site e nas propostas as provas de credibilidade: anos de mercado, clientes atendidos, certificações e garantias', 'marca', 'valor', 'No estudo, marcas com mais credibilidade deixaram o cliente menos sensível a preço; credibilidade é competência e confiança comprovadas, não promessa.', 'propostas fechadas sem desconto sobem', 'conteudo'],
    ]),
    ...livro('Romaniuk & Sharp · Relevância da marca e cancelamento', [
      ['Enviar aos clientes atuais um resumo do que foi entregue e do resultado', 'marca', 'vendas', 'Em bancos e telecomunicações, clientes que lembram mais da marca cancelam menos; mostrar o que foi entregue mantém a marca presente para quem já é cliente.', 'clientes que voltam a comprar ou renovam', 'relacao'],
    ]),
    ...livro('Briggs & Stuart · What Sticks', [
      ['Mostrar o anúncio a 5 pessoas do público antes de rodar e conferir se entendem a mensagem e lembram da marca', 'marca', 'vendas', 'Nas campanhas medidas, boa parte da verba se perdeu em anúncios que as pessoas não ligavam à marca; testar antes é barato e evita o desperdício.', 'anúncios aprovados no teste antes de rodar', 'medicao'],
    ]),
    // ----- estudos do Drive: marca de serviços, comunidade, influenciadores e redes sociais -----
    ...livro('Berry · Cultivando a marca de serviços', [
      ['Apresentar as campanhas para a equipe antes de irem ao ar, explicando o que a marca quer dizer', 'marca', 'valor', 'Em serviços, a equipe é quem entrega a marca; empresas de marca forte usam a própria comunicação para que os funcionários entendam e tenham orgulho dela, e os funcionários são influenciados pelos anúncios da empresa.', 'Equipe explica a campanha com as próprias palavras', 'equipe'],
      ['Tirar o preço como mensagem principal dos anúncios e mostrar o que a empresa faz melhor', 'marca', 'valor', 'Nas empresas de serviço com marca mais forte, o preço quase não aparece na comunicação: falar de preço troca a chance de criar ligação com o cliente por uma comparação de valor.', 'Ticket médio se mantém e contatos citam o diferencial', 'anuncio'],
    ]),
    ...livro('Muniz & O’Guinn · Comunidade de marca', [
      ['Criar um grupo de clientes com um encontro marcado e espaço para eles trocarem experiências', 'marca', 'vendas', 'Comunidades de marca criam sentimento de pertencer, rituais próprios e clientes que ajudam uns aos outros; isso aumenta a fidelidade e o valor da marca.', 'Clientes ativos no grupo e indicações vindas dele', 'relacao'],
    ]),
    ...livro('Ye et al. · O valor do marketing de influência', [
      ['Escolher influenciadores pela afinidade com a marca e com o público, não pelo número de seguidores, e deixar claro que é publicidade', 'marca', 'pessoas', 'A combinação entre influenciador e marca muda a resposta do público mais do que o tamanho da audiência; a credibilidade vem da autenticidade, e esconder o patrocínio derruba a confiança.', 'Contatos e vendas vindos dos influenciadores', 'anuncio'],
    ]),
    ...livro('Voorveld et al. · Engajamento e publicidade nas redes', [
      ['Adaptar a campanha ao formato e ao uso de cada rede, mantendo os mesmos ativos da marca', 'marca', 'pessoas', 'As pessoas usam cada rede de um jeito, e isso muda como elas reagem aos anúncios; a mesma peça repetida em todas rende menos.', 'Resultado das peças melhora em cada rede', 'anuncio'],
    ]),
    // ----- última rodada do Drive: ativo sonoro e autoridade em serviços -----
    ...livro('Romaniuk · Ativos distintivos', [
      ['Criar uma vinheta sonora curta e usar no início e no fim de todos os vídeos', 'marca', 'pessoas', 'O som é um ativo que faz a marca ser reconhecida mesmo por quem não está olhando para a tela; só vira memória se for sempre o mesmo.', 'Vinheta reconhecida na pesquisa de ativos', 'anuncio'],
    ]),
    ...livro('Schultz & Doerr · Professional Services Marketing', [
      ['Dar uma palestra ou aula aberta sobre o tema da empresa em um evento do setor', 'marca', 'pessoas', 'Numa pesquisa com 231 compradores de serviços profissionais, falar em público aparece entre os caminhos mais usados para encontrar fornecedores; quem ensina vira referência no assunto.', 'Contatos vindos de quem assistiu', 'conteudo'],
    ]),
    // ----- fontes com evidência: estudos com centenas de casos, institutos de pesquisa e livros acadêmicos -----
    ...livro('WARC · Anatomia da Eficácia', [
      ['Incluir a pergunta "como nos conheceu?" no atendimento e na ficha do cliente', 'venda', 'vendas', 'Sem saber a origem, não dá para separar o que veio da marca e o que veio da oferta; é a base para medir o curto e o longo prazo.', 'origem anotada nos clientes novos', 'medicao'],
    ]),
    ...livro('Ehrenberg-Bass · Dupla Ameaça', [
      ['Medir a base de clientes dos últimos 3 anos: quantos compraram uma única vez e quantos voltaram', 'venda', 'vendas', 'Em 200 marcas, 80% dos compradores compram uma vez por ano ou menos e ainda fazem 40% das vendas; a base real só aparece olhando vários anos. E a fidelidade acompanha o tamanho da marca: o problema quase sempre é falta de clientes novos.', 'base de clientes de 3 anos conhecida', 'medicao'],
    ]),
    ...livro('Romaniuk · Ativos distintivos', [
      ['Colocar os ativos da marca na pesquisa e mandar para pelo menos 30 pessoas', 'marca', 'pessoas', 'Um ativo vale quando muita gente o reconhece (fama) e o liga só à sua marca (exclusividade); isso só se sabe perguntando.', 'ativos com mais de 50% de reconhecimento correto'],
    ]),
    ...livro('Nagle · Estratégia e tática de preços', [
      ['Refazer a tabela de preços a partir do valor que cada serviço gera para o cliente', 'venda', 'valor', 'O cliente paga pelo que ganha, não pelo que custou produzir; preço por custo deixa dinheiro na mesa.', 'margem sobe sem perder fechamento', 'preco'],
      ['Escrever a política de descontos: quando, quanto e em troca de quê', 'venda', 'valor', 'Desconto sem regra ensina o cliente a pedir desconto; desconto em troca de algo protege o preço.', 'propostas fechadas sem desconto sobem'],
    ]),
    ...livro('Keller · Gestão estratégica de marcas', [
      ['Perguntar a 10 clientes quais 3 palavras descrevem a empresa e comparar com o que a marca quer', 'marca', 'valor', 'O valor da marca vem de associações fortes, favoráveis e únicas; perguntar mostra se a marca é vista como deveria.', 'palavras desejadas aparecem nas respostas'],
    ]),
  );


  // ===== Biblioteca ampliada: disponibilidade mental e física, ativos, mídia, decisão de compra, vendas, preço, serviço,
  // medição e ações por setor. Fontes: os livros e papers da pasta "livros de branding e design" do Drive (o grupo é interno, não aparece para o cliente) =====
  window.GangPresets.acoes.push(
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Listar as 10 situações em que alguém precisa do que a empresa vende: quando, onde, com quem e por quê", "esforco": "marca", "promessa": "pessoas", "porque": "A marca é escolhida quando vem à cabeça no momento da necessidade. Conhecer essas situações mostra a quais delas a marca precisa ficar ligada.", "metrica": "10 situações de compra escritas e as 3 principais escolhidas", "tema": "posicionamento"},
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Ligar a marca às 3 situações de compra mais frequentes em toda a comunicação do semestre", "esforco": "marca", "promessa": "pessoas", "porque": "Quanto mais situações de compra lembram a marca, mais vezes ela é escolhida. Repetir as mesmas situações cria essa ligação na memória.", "metrica": "A marca é mais lembrada nessas situações na próxima pesquisa", "tema": "anuncio"},
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Revisar as peças do último mês: quantas citam uma situação de compra, e não só o produto", "esforco": "marca", "promessa": "pessoas", "porque": "Falar só do produto não cria lembrança na hora da necessidade. A peça que mostra o momento de uso ajuda o cliente a lembrar da marca quando ele acontece.", "metrica": "Metade das peças do mês cita uma situação de compra", "tema": "medicao"},
    {"grupo": "Romaniuk · Ativos distintivos", "texto": "Fazer o inventário dos ativos da marca: o que existe, onde aparece e com que frequência", "esforco": "marca", "promessa": "pessoas", "porque": "Cor, símbolo, frase e personagem só viram atalho para a marca se aparecem sempre do mesmo jeito. O inventário mostra o que está sendo diluído.", "metrica": "Lista dos ativos com onde e quanto cada um aparece", "tema": "presenca"},
    {"grupo": "Romaniuk · Ativos distintivos", "texto": "Testar os ativos com 30 pessoas: quantas ligam cada um à marca e quantas ligam a outra empresa", "esforco": "marca", "promessa": "pessoas", "porque": "Um ativo só funciona se muita gente o liga à marca e quase ninguém o liga a um concorrente. O teste mostra em quais vale investir e quais trocar.", "metrica": "Cada ativo com sua porcentagem de reconhecimento e de confusão", "tema": "medicao"},
    {"grupo": "Romaniuk · Ativos distintivos", "texto": "Escrever as regras de uso dos 2 ativos mais fortes e não mudar nada neles por 12 meses", "esforco": "marca", "promessa": "pessoas", "porque": "Trocar cor, frase ou símbolo a cada campanha apaga a memória construída. Manter o mesmo padrão por muito tempo é o que faz o ativo ser reconhecido.", "metrica": "Os 2 ativos aparecem do mesmo jeito em todas as peças do ano", "tema": "presenca"},
    {"grupo": "Binet & Field · Effectiveness in Context", "texto": "Dividir a verba do ano entre construir a marca e gerar vendas imediatas, com cerca de 60% para marca", "esforco": "marca", "promessa": "vendas", "porque": "Só oferta vende hoje e para de vender quando a verba acaba. Construir marca faz as vendas futuras custarem menos. A proporção varia por setor; em B2B fica perto de metade.", "metrica": "Verba do ano dividida e respeitada mês a mês", "tema": "anuncio"},
    {"grupo": "Binet & Field · Effectiveness in Context", "texto": "Calcular a fatia de voz da marca e manter o investimento acima da fatia de mercado", "esforco": "marca", "promessa": "pessoas", "porque": "Marcas que aparecem mais do que o seu tamanho tendem a crescer; as que aparecem menos tendem a encolher. A conta mostra se o investimento é suficiente para crescer.", "metrica": "Fatia de voz acima da participação de mercado", "tema": "anuncio"},
    {"grupo": "Ehrenberg-Bass · Quando as marcas apagam as luzes", "texto": "Manter anúncios no ar todos os meses, com menos verba por mês, em vez de picos com meses parados", "esforco": "marca", "promessa": "pessoas", "porque": "A lembrança da marca cai quando ela some. Aparecer todo mês, mesmo com pouco, alcança as pessoas que vão comprar em qualquer época do ano.", "metrica": "Nenhum mês do ano sem anúncio", "tema": "anuncio"},
    {"grupo": "Código de Eficácia B2B · LinkedIn, WARC e Lions", "texto": "Anunciar o ano todo para quem não está comprando agora: a maioria do mercado só vai comprar mais tarde", "esforco": "marca", "promessa": "pessoas", "porque": "Em B2B, a grande maioria das empresas não está comprando o serviço neste momento. Quem é lembrado quando elas entram no mercado sai na frente.", "metrica": "Lembrança da marca entre empresas que ainda não são clientes", "tema": "anuncio"},
    {"grupo": "Binet & Field · The Long and the Short of It", "texto": "Criar uma campanha feita para ser comentada: uma ideia que as pessoas contem a outras", "esforco": "marca", "promessa": "pessoas", "porque": "As campanhas que geram conversa estão entre as mais eficazes, porque o efeito vai muito além de quem viu o anúncio.", "metrica": "Menções espontâneas e compartilhamentos acima da média", "tema": "anuncio"},
    {"grupo": "Heath · Seducing the Subconscious", "texto": "Testar o anúncio pela emoção que ele provoca, não só pela mensagem que passa", "esforco": "marca", "promessa": "valor", "porque": "Boa parte da publicidade é vista com pouca atenção. O que fica na memória é a sensação que ela deixa, e não o argumento.", "metrica": "7 de 10 pessoas descrevem a sensação que a marca quer passar", "tema": "medicao"},
    {"grupo": "Binet & Field · The Long and the Short of It", "texto": "Manter a mesma ideia de campanha por pelo menos 2 anos, variando só as peças", "esforco": "marca", "promessa": "pessoas", "porque": "As campanhas mais eficazes duram anos. Trocar de ideia a cada estação faz a marca recomeçar do zero na memória das pessoas.", "metrica": "Mesma ideia de campanha no ar por 24 meses", "tema": "anuncio"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Mostrar prova social concreta no site e na proposta: quantos clientes, quem são e desde quando", "esforco": "venda", "promessa": "vendas", "porque": "As pessoas seguem o que os outros parecidos com elas já fazem. Números e nomes reais diminuem o medo de escolher errado.", "metrica": "Contatos por visita sobem depois da mudança", "tema": "conteudo"},
    {"grupo": "Simon · Confessions of the Pricing Man", "texto": "Criar um pacote que junte o serviço principal a um complemento, por menos do que os dois separados", "esforco": "venda", "promessa": "valor", "porque": "Pacotes bem montados fazem o cliente levar mais, sem precisar baixar preço. Em testes, a simples apresentação em pacote aumentou a receita por cliente.", "metrica": "Ticket médio sobe e parte das vendas sai no pacote", "tema": "preco"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Trocar a urgência inventada por um limite real e honesto: agenda, lote ou turma", "esforco": "venda", "promessa": "vendas", "porque": "O que é escasso parece mais valioso, mas urgência falsa destrói a confiança. Um limite verdadeiro dá o empurrão sem custar credibilidade.", "metrica": "Mais vendas fechadas no prazo, sem reclamação de pressão", "tema": "preco"},
    {"grupo": "Sutherland · Alquimia", "texto": "Pedir a 3 pessoas de fora que tentem comprar ou pedir orçamento pelo celular e cortar o que travar", "esforco": "venda", "promessa": "vendas", "porque": "Pequenos atritos fazem muita gente desistir, e quem é de dentro não percebe mais. Tirar uma etapa costuma render mais do que convencer mais.", "metrica": "Mais pedidos concluídos, com menos etapas", "tema": "experiencia"},
    {"grupo": "Dixon & Adamson · A venda desafiadora", "texto": "Calcular com o cliente, na primeira reunião, quanto o problema custa a ele por mês", "esforco": "venda", "promessa": "valor", "porque": "O cliente adia decisões quando não enxerga o custo de ficar como está. Mostrar a perda em dinheiro torna a solução urgente e justifica o preço.", "metrica": "Propostas com o custo do problema fecham mais", "tema": "venda"},
    {"grupo": "Dixon & Adamson · A venda desafiadora", "texto": "Preparar uma ideia que ensine algo novo ao cliente sobre o negócio dele e abrir as reuniões com ela", "esforco": "venda", "promessa": "valor", "porque": "Os vendedores de melhor resultado trazem uma visão nova sobre o problema do cliente, em vez de só responder perguntas. Isso posiciona a empresa como especialista.", "metrica": "Mais reuniões viram proposta", "tema": "venda"},
    {"grupo": "Dixon & McKenna · The JOLT Effect", "texto": "Dizer ao cliente indeciso o que você recomendaria no lugar dele, e por quê", "esforco": "venda", "promessa": "vendas", "porque": "Muitas vendas se perdem não para o concorrente, mas para a indecisão. Uma recomendação clara tira do cliente o medo de escolher errado.", "metrica": "Menos propostas paradas sem resposta", "tema": "venda"},
    {"grupo": "Dixon & McKenna · The JOLT Effect", "texto": "Mandar ao cliente indeciso só as 2 informações que decidem, e não o catálogo inteiro", "esforco": "venda", "promessa": "vendas", "porque": "Informação demais paralisa: o cliente continua pesquisando e não decide. Limitar o que ele precisa avaliar acelera a decisão.", "metrica": "Tempo entre proposta e fechamento diminui", "tema": "venda"},
    {"grupo": "Dixon & McKenna · The JOLT Effect", "texto": "Oferecer uma forma de diminuir o risco da primeira compra: etapa piloto, garantia ou saída combinada", "esforco": "venda", "promessa": "vendas", "porque": "O medo de errar pesa mais do que a vontade de acertar. Tirar o risco da primeira compra faz o cliente decidir mais rápido.", "metrica": "Mais primeiras compras fechadas", "tema": "preco"},
    {"grupo": "Miller & Heiman · The New Strategic Selling", "texto": "Mapear em cada venda B2B quem decide, quem usa, quem paga e quem pode barrar, e falar com cada um", "esforco": "venda", "promessa": "vendas", "porque": "Em vendas para empresas, várias pessoas influenciam a decisão. Quem conversa só com um contato perde para o fornecedor que conversou com todos.", "metrica": "Propostas com todos os envolvidos mapeados fecham mais", "tema": "venda"},
    {"grupo": "Rackham · Rethinking the Sales Force", "texto": "Registrar o motivo de cada venda perdida e revisar a lista todo mês", "esforco": "venda", "promessa": "vendas", "porque": "Sem saber por que perde, a empresa repete o erro. O padrão aparece rápido quando os motivos são anotados sempre.", "metrica": "Motivos de perda registrados em todas as propostas", "tema": "medicao"},
    {"grupo": "Enns · The Win Without Pitching Manifesto", "texto": "Trocar propostas feitas sem conversa por um diagnóstico curto, pago ou agendado, antes de orçar", "esforco": "venda", "promessa": "valor", "porque": "Proposta enviada sem entender o problema vira comparação de preço. O diagnóstico posiciona a empresa como especialista e qualifica o cliente.", "metrica": "Mais propostas fechadas e preço médio maior", "tema": "venda"},
    {"grupo": "Holden · Pricing with Confidence", "texto": "Medir quanto foi dado de desconto no mês, em quais vendas e por quem", "esforco": "venda", "promessa": "valor", "porque": "Descontos sem controle somem com o lucro sem ninguém perceber. Medir é o primeiro passo para que eles passem a ter regra.", "metrica": "Desconto médio do mês conhecido e em queda", "tema": "preco"},
    {"grupo": "Nagle · Estratégia e tática de preços", "texto": "Revisar os preços uma vez por ano com uma regra escrita, e não só quando o custo sobe", "esforco": "venda", "promessa": "valor", "porque": "Preço revisto às pressas acompanha o custo e esquece o valor. Uma revisão marcada considera o valor entregue, a concorrência e a margem.", "metrica": "Preços revistos na data marcada e margem mantida", "tema": "preco"},
    {"grupo": "Simon · Confessions of the Pricing Man", "texto": "Avisar o aumento de preço com antecedência, explicando o motivo e o que melhorou", "esforco": "venda", "promessa": "valor", "porque": "Aumentos bem explicados e avisados antes perdem poucos clientes. A surpresa e a falta de motivo são o que gera rejeição.", "metrica": "Aumento aplicado sem perda relevante de clientes", "tema": "preco"},
    {"grupo": "Baker · Implementing Value Pricing", "texto": "Cobrar pelo diagnóstico ou pela primeira etapa, em vez de fazer de graça", "esforco": "venda", "promessa": "valor", "porque": "O que é de graça parece valer pouco e atrai quem só quer comparar. Cobrar a primeira etapa mostra o valor do trabalho e filtra quem leva a sério.", "metrica": "Diagnósticos pagos e convertidos em projeto", "tema": "preco"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Dar à equipe um valor ou uma solução que ela pode usar na hora para resolver uma reclamação, sem pedir autorização", "esforco": "venda", "promessa": "vendas", "porque": "Quando a falha é resolvida rápido e bem, o cliente pode ficar mais fiel do que se nada tivesse dado errado. A demora é o que transforma o problema em perda.", "metrica": "Reclamações resolvidas no primeiro contato", "tema": "experiencia"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Avisar o cliente do próximo passo e de quanto falta sempre que ele precisar esperar", "esforco": "venda", "promessa": "valor", "porque": "Espera sem informação parece muito mais longa e gera ansiedade. Saber o que vem e quando torna a mesma espera aceitável.", "metrica": "Menos mensagens perguntando o andamento", "tema": "experiencia"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Escrever as promessas do atendimento que todo cliente deve sentir e conferir uma por semana", "esforco": "venda", "promessa": "valor", "porque": "O cliente julga a empresa pelo atendimento que recebe, e não pelo que está escrito no site. Promessas claras e conferidas tornam o serviço igual em todo contato.", "metrica": "Nota de satisfação sobe e fica estável", "tema": "experiencia"},
    {"grupo": "Ehrenberg · Repeat-buying", "texto": "Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar", "esforco": "venda", "promessa": "vendas", "porque": "A maioria dos clientes compra pouco e esquece a marca entre uma compra e outra. Um lembrete útil traz de volta parte deles a custo baixo.", "metrica": "Clientes inativos que voltaram a comprar", "tema": "relacao"},
    {"grupo": "Sharp · How Brands Grow", "texto": "Medir a recompra: quantos clientes do ano passado voltaram a comprar neste ano", "esforco": "venda", "promessa": "vendas", "porque": "A fidelidade costuma acompanhar o tamanho da marca. Medir a recompra mostra se a base está estável e evita apostar tudo em programas de fidelidade.", "metrica": "Taxa de recompra conhecida e comparada ano a ano", "tema": "medicao"},
    {"grupo": "Sharp · How Brands Grow", "texto": "Listar todos os lugares onde o cliente poderia comprar e marcar onde a empresa ainda não está", "esforco": "venda", "promessa": "pessoas", "porque": "Marcas crescem quando são fáceis de encontrar e de comprar. Cada canal onde a empresa não está é uma venda que vai para outra.", "metrica": "Lista de canais com 2 prioridades para os próximos meses", "tema": "distribuicao"},
    {"grupo": "Sharp · How Brands Grow", "texto": "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo", "esforco": "venda", "promessa": "pessoas", "porque": "Estar presente em mais lugares alcança compradores que nunca chegariam até a empresa pelo caminho de hoje.", "metrica": "Vendas vindas do canal novo", "tema": "distribuicao"},
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Ampliar o horário ou os dias de atendimento nos períodos em que o cliente mais procura", "esforco": "venda", "promessa": "pessoas", "porque": "Quem procura e não encontra a empresa aberta compra de outro. Estar disponível no momento da procura também é parte da marca.", "metrica": "Contatos atendidos nos horários novos", "tema": "distribuicao"},
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Garantir que o produto ou a agenda não falte nos períodos de pico", "esforco": "venda", "promessa": "vendas", "porque": "Faltar produto ou horário no pico manda o cliente para o concorrente, e parte deles não volta. Planejar o estoque e a agenda protege a venda.", "metrica": "Nenhuma venda perdida por falta no pico", "tema": "distribuicao"},
    {"grupo": "Burgess · Account-Based Marketing", "texto": "Escolher 20 empresas-alvo e montar uma abordagem sob medida para cada uma", "esforco": "venda", "promessa": "vendas", "porque": "Em B2B, poucos clientes grandes valem mais do que muitos contatos soltos. Uma conversa feita para cada empresa mostra que a marca entende o negócio dela.", "metrica": "Reuniões marcadas com as empresas-alvo", "tema": "venda"},
    {"grupo": "Código de Eficácia B2B · LinkedIn, WARC e Lions", "texto": "Publicar toda semana no LinkedIn da empresa e dos sócios, sempre com os mesmos ativos da marca", "esforco": "marca", "promessa": "pessoas", "porque": "No B2B, os sócios são parte da marca. Aparecer com regularidade e sempre do mesmo jeito mantém a empresa lembrada até a hora da compra.", "metrica": "Publicações semanais por 3 meses seguidos", "tema": "conteudo"},
    {"grupo": "Código de Eficácia B2B · LinkedIn, WARC e Lions", "texto": "Fazer um levantamento do setor e divulgar os números para clientes, imprensa e redes", "esforco": "marca", "promessa": "pessoas", "porque": "Dados próprios sobre o setor dão motivo para falarem da marca e a colocam como referência. É uma forma de ganhar fama sem pagar mídia.", "metrica": "Menções da marca e contatos vindos do levantamento", "tema": "conteudo"},
    {"grupo": "Sheridan · They Ask, You Answer", "texto": "Gravar vídeos de 1 minuto respondendo às perguntas que mais chegam no WhatsApp", "esforco": "marca", "promessa": "pessoas", "porque": "Responder antes que o cliente pergunte gera confiança e poupa tempo da equipe. O vídeo mostra as pessoas por trás da marca.", "metrica": "5 vídeos publicados e usados nas respostas", "tema": "conteudo"},
    {"grupo": "Handley · Everybody Writes", "texto": "Escrever uma página para cada serviço usando o nome que o cliente digita na busca", "esforco": "venda", "promessa": "pessoas", "porque": "O cliente procura com as palavras dele, e não com o nome interno do serviço. Uma página clara para cada busca faz a empresa ser encontrada.", "metrica": "Visitas vindas da busca em cada página", "tema": "conteudo"},
    {"grupo": "Voorveld et al. · Engajamento e publicidade nas redes", "texto": "Criar uma série fixa nas redes: mesmo dia, mesmo formato e a mesma abertura", "esforco": "marca", "promessa": "pessoas", "porque": "Formatos repetidos viram hábito para quem acompanha e reforçam os ativos da marca a cada publicação.", "metrica": "Série publicada por 12 semanas seguidas", "tema": "conteudo"},
    {"grupo": "Berry · Cultivando a marca de serviços", "texto": "Reconhecer todo mês, na frente da equipe, quem melhor entregou a promessa da marca a um cliente", "esforco": "marca", "promessa": "valor", "porque": "Em serviços, a equipe é a marca para o cliente. Reconhecer o comportamento certo mostra a todos o que a marca espera.", "metrica": "Um reconhecimento por mês com o caso contado", "tema": "equipe"},
    {"grupo": "LeeYohn · Fusion", "texto": "Mostrar a marca no primeiro dia de quem entra: a promessa, o tom de voz e como atender", "esforco": "marca", "promessa": "valor", "porque": "Quem entra sem conhecer a marca atende do seu próprio jeito. O primeiro dia é quando a pessoa está mais aberta para aprender o padrão.", "metrica": "Todo novo funcionário passa pela apresentação", "tema": "equipe"},
    {"grupo": "Martin · Playing to Win", "texto": "Escrever o que a empresa deixa de fazer neste ano para focar no que importa", "esforco": "marca", "promessa": "valor", "porque": "Estratégia é escolher, e escolher também é dizer não. Sem cortes, a empresa tenta agradar a todos e não se destaca para ninguém.", "metrica": "Lista de cortes escrita e cumprida no ano", "tema": "posicionamento"},
    {"grupo": "Neumeier · Zag", "texto": "Testar a frase de posicionamento com 10 clientes: eles entendem, acreditam e acham diferente?", "esforco": "marca", "promessa": "valor", "porque": "Um posicionamento só funciona se o cliente entende, acredita e vê diferença. Testar antes de espalhar evita investir numa frase que não convence.", "metrica": "7 de 10 clientes entendem e acham a frase verdadeira", "tema": "medicao"},
    {"grupo": "Aaker · Brand Relevance", "texto": "Dar nome à categoria que a empresa quer liderar e usar sempre o mesmo nome", "esforco": "marca", "promessa": "valor", "porque": "Quem nomeia uma categoria vira a referência dela. Usar sempre o mesmo nome ensina o cliente a procurar exatamente aquilo.", "metrica": "Clientes usam o nome da categoria ao pedir orçamento", "tema": "posicionamento"},
    {"grupo": "Kapferer · The New Strategic Brand Management", "texto": "Organizar os serviços numa estrutura simples: a marca principal mais um nome descritivo, sem submarcas soltas", "esforco": "marca", "promessa": "valor", "porque": "Muitas submarcas dividem a memória e o investimento. Uma marca forte com nomes descritivos é mais fácil de lembrar e de comprar.", "metrica": "Todos os serviços com o mesmo padrão de nome", "tema": "posicionamento"},
    {"grupo": "Airey · Identity Designed", "texto": "Juntar numa parede as peças dos últimos 3 meses e cortar o que não parece da marca", "esforco": "marca", "promessa": "pessoas", "porque": "Peças que fogem do padrão enfraquecem o reconhecimento. Ver tudo junto mostra o que destoa melhor do que olhar uma peça por vez.", "metrica": "Peças fora do padrão corrigidas ou retiradas", "tema": "presenca"},
    {"grupo": "Airey · Identity Designed", "texto": "Criar modelos editáveis de posts, propostas e apresentações para a equipe não improvisar", "esforco": "marca", "promessa": "pessoas", "porque": "Sem modelos, cada pessoa cria do seu jeito e a marca se fragmenta. Modelos prontos garantem consistência e poupam tempo.", "metrica": "Equipe usando os modelos em tudo o que produz", "tema": "presenca"},
    {"grupo": "Farris · Métricas de Marketing", "texto": "Montar um painel mensal com 5 números: faturamento, clientes novos, ticket médio, recompra e lembrança", "esforco": "venda", "promessa": "vendas", "porque": "O que não é medido não melhora. Poucos números acompanhados sempre mostram tendências que olhar de vez em quando esconde.", "metrica": "Painel atualizado todo mês por 6 meses", "tema": "medicao"},
    {"grupo": "Binet & Carter · How not to Plan", "texto": "Comparar os resultados com o mesmo período do ano anterior antes de tirar conclusões", "esforco": "venda", "promessa": "vendas", "porque": "Muitos negócios têm épocas fortes e fracas. Comparar com o mês anterior confunde a sazonalidade com o efeito das ações.", "metrica": "Todo resultado comparado com o mesmo período do ano anterior", "tema": "medicao"},
    {"grupo": "Fitzpatrick · O Teste da Mãe", "texto": "Entrevistar 5 clientes recentes sobre o momento em que decidiram comprar: o que estava acontecendo e o que pesou", "esforco": "marca", "promessa": "pessoas", "porque": "Perguntar se o cliente gostaria de algo gera respostas educadas e inúteis. Perguntar sobre o que ele já fez revela o motivo real da compra.", "metrica": "5 entrevistas com os motivos de compra anotados", "tema": "medicao"},
    {"grupo": "Kohavi · Trustworthy Online Controlled Experiments", "texto": "Testar uma ação com metade da base e comparar com a metade que não recebeu", "esforco": "venda", "promessa": "vendas", "porque": "Sem um grupo de comparação, não dá para saber se o resultado veio da ação ou de outra coisa. O teste mostra o efeito real.", "metrica": "Diferença medida entre quem recebeu e quem não recebeu", "tema": "medicao"},
    {"grupo": "Underhill · Vamos às compras", "texto": "Revisar a vitrine e a entrada: em 3 segundos dá para saber o que a loja vende e de quem é?", "esforco": "marca", "promessa": "pessoas", "porque": "Quem passa decide em segundos se entra ou não. Uma vitrine clara e com a marca visível convida a entrar.", "metrica": "Mais pessoas entram na loja", "tema": "presenca"},
    {"grupo": "Underhill · Vamos às compras", "texto": "Organizar a loja: os mais procurados ao fundo e os de impulso perto do caixa", "esforco": "venda", "promessa": "vendas", "porque": "O caminho dentro da loja define o que o cliente vê. Quem busca o mais procurado passa pelo resto, e o caixa é o lugar da compra por impulso.", "metrica": "Ticket médio da loja sobe", "tema": "experiencia"},
    {"grupo": "Romaniuk · Ativos distintivos", "texto": "Aplicar os ativos da marca na embalagem e na sacola, do mesmo jeito em todas", "esforco": "marca", "promessa": "pessoas", "porque": "A embalagem é vista em casa e na rua, e funciona como um anúncio que o cliente carrega. Repetir os ativos reforça o reconhecimento.", "metrica": "Todas as embalagens com os ativos da marca", "tema": "presenca"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Enviar lembrete da consulta 24 horas antes, com endereço, preparo e o que levar", "esforco": "venda", "promessa": "vendas", "porque": "Faltas custam agenda e receita. Um lembrete claro reduz as faltas e mostra cuidado antes mesmo do atendimento.", "metrica": "Taxa de faltas cai", "tema": "experiencia"},
    {"grupo": "Maister · The Trusted Advisor", "texto": "Publicar a formação e a especialidade de cada profissional em linguagem simples", "esforco": "marca", "promessa": "valor", "porque": "Em serviços de saúde e especializados, o cliente escolhe a pessoa antes da empresa. Mostrar quem atende, de forma clara, gera confiança.", "metrica": "Página de cada profissional publicada", "tema": "conteudo"},
    {"grupo": "Romaniuk · Ativos distintivos", "texto": "Fotografar os 10 itens mais vendidos no mesmo estilo e usar em todos os canais", "esforco": "marca", "promessa": "pessoas", "porque": "Fotos no mesmo estilo viram um ativo da marca e fazem os itens serem reconhecidos em qualquer canal, do cardápio ao aplicativo.", "metrica": "Fotos novas em todos os canais de venda", "tema": "presenca"},
    {"grupo": "Nagle · Estratégia e tática de preços", "texto": "Revisar o cardápio: destacar os itens de maior margem e tirar os que quase ninguém pede", "esforco": "venda", "promessa": "valor", "porque": "Cardápio grande confunde e esconde os melhores itens. Destacar os de maior margem aumenta o lucro sem precisar vender mais.", "metrica": "Margem média por pedido sobe", "tema": "preco"},
    {"grupo": "Krug · Rocket Surgery Made Easy", "texto": "Reduzir a compra no site ao menor número de etapas e testar no celular", "esforco": "venda", "promessa": "vendas", "porque": "Cada etapa a mais faz parte dos compradores desistir. A maioria compra pelo celular, onde o atrito pesa ainda mais.", "metrica": "Mais compras concluídas no site", "tema": "experiencia"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Mostrar prazo de entrega, frete e política de troca antes do carrinho", "esforco": "venda", "promessa": "vendas", "porque": "Surpresas no fim da compra são o maior motivo de desistência. Mostrar tudo antes passa segurança e evita o abandono.", "metrica": "Menos carrinhos abandonados", "tema": "experiencia"},
    {"grupo": "Kennedy · The Ultimate Sales Letter", "texto": "Mandar mensagem de carrinho abandonado em até 1 hora, oferecendo ajuda, e não desconto", "esforco": "venda", "promessa": "vendas", "porque": "Muita gente abandona por dúvida ou distração. Ajudar recupera vendas sem ensinar o cliente a esperar desconto.", "metrica": "Carrinhos recuperados pela mensagem", "tema": "relacao"},
    {"grupo": "Port · Book Yourself Solid", "texto": "Oferecer uma aula ou amostra gratuita, com data marcada, para quem ainda não é aluno", "esforco": "venda", "promessa": "pessoas", "porque": "Experimentar diminui o risco de quem ainda não conhece. Data marcada cria compromisso e reúne interessados de uma vez.", "metrica": "Participantes da aula que viram alunos", "tema": "venda"},
    {"grupo": "Sheridan · The Visual Sale", "texto": "Publicar resultados reais de ex-alunos ou ex-clientes, com autorização", "esforco": "marca", "promessa": "valor", "porque": "Resultado de alguém parecido com o comprador é a prova mais convincente. Mostra o que é possível com a empresa.", "metrica": "5 resultados publicados com nome e autorização", "tema": "conteudo"},
    {"grupo": "Sheridan · The Visual Sale", "texto": "Fotografar antes e depois sempre com a mesma luz e o mesmo ângulo, com autorização", "esforco": "marca", "promessa": "valor", "porque": "Comparações honestas e no mesmo padrão provam o resultado. Fotos diferentes entre si parecem montagem e perdem credibilidade.", "metrica": "Galeria de antes e depois no mesmo padrão", "tema": "conteudo"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Marcar o próximo atendimento antes de o cliente ir embora", "esforco": "venda", "promessa": "vendas", "porque": "Serviços que se repetem dependem de o cliente voltar no tempo certo. Sair com a data marcada evita que ele esqueça ou procure outro.", "metrica": "Clientes que saem com o próximo horário marcado", "tema": "relacao"},
    {"grupo": "Romaniuk & Sharp · Relevância da marca e cancelamento", "texto": "Medir em quantos dias o cliente novo chega ao primeiro resultado e encurtar esse caminho", "esforco": "venda", "promessa": "vendas", "porque": "O cliente que não vê resultado logo no começo cancela. Chegar mais rápido ao primeiro ganho mantém a marca relevante para ele.", "metrica": "Dias até o primeiro resultado diminuem", "tema": "experiencia"},
    {"grupo": "Olsen · The Lean Product Playbook", "texto": "Oferecer teste gratuito com acompanhamento nos primeiros 7 dias", "esforco": "venda", "promessa": "pessoas", "porque": "O teste sem acompanhamento acaba esquecido. Ajudar nos primeiros dias faz o cliente sentir o valor e decidir pela compra.", "metrica": "Testes que viram clientes pagantes", "tema": "venda"}
  );

  // ===== Biblioteca ampliada (2ª parte): serviço, pesquisa, negociação, criação, cultura, identidade, reputação e setores =====
  window.GangPresets.acoes.push(
    {"grupo": "Zeithaml · Marketing de serviços", "texto": "Comparar o que a equipe acha que o cliente quer com o que o cliente diz querer, e corrigir as diferenças", "esforco": "venda", "promessa": "valor", "porque": "Muitas falhas de serviço começam antes do atendimento: a empresa cuida do que acha importante, e não do que o cliente valoriza. A comparação mostra onde está o desencontro.", "metrica": "As 3 maiores diferenças corrigidas", "tema": "experiencia"},
    {"grupo": "Zeithaml · Marketing de serviços", "texto": "Conferir se o que o site e a venda prometem é o que a operação consegue entregar, e alinhar os dois", "esforco": "venda", "promessa": "valor", "porque": "Prometer mais do que se entrega gera decepção, mesmo quando o serviço é bom. Alinhar a promessa à entrega evita reclamação e protege a marca.", "metrica": "Nenhuma promessa sem entrega correspondente", "tema": "experiencia"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Desenhar o mapa do serviço: o que o cliente vê, o que acontece por trás e onde costuma falhar", "esforco": "venda", "promessa": "valor", "porque": "Muitas falhas que o cliente sente nascem em etapas que ele não vê. Mapear a parte de trás do serviço mostra onde corrigir na origem.", "metrica": "Pontos de falha mapeados e 2 corrigidos", "tema": "experiencia"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Separar os clientes em níveis pelo que trazem para a empresa e definir o atendimento de cada nível", "esforco": "venda", "promessa": "valor", "porque": "Clientes diferentes trazem resultados diferentes. Atender todos do mesmo jeito gasta energia onde rende pouco e falta onde rende muito.", "metrica": "Clientes classificados e atendimento de cada nível definido", "tema": "relacao"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Medir por uma semana o tempo real de resposta aos contatos, por canal", "esforco": "venda", "promessa": "vendas", "porque": "A empresa costuma achar que responde rápido. O número real mostra onde os contatos esperam demais e se perdem.", "metrica": "Tempo médio de resposta conhecido em cada canal", "tema": "medicao"},
    {"grupo": "Revella · Buyer Personas", "texto": "Escrever o perfil de compra: o que leva a buscar, o que conta como sucesso, o que trava, quem participa e como compara", "esforco": "marca", "promessa": "valor", "porque": "Saber como o cliente decide vale mais do que saber idade e renda. Esses 5 pontos mostram o que dizer em cada momento da compra.", "metrica": "Perfil de compra escrito a partir de entrevistas reais", "tema": "posicionamento"},
    {"grupo": "Klement · When Kale and Coffee Compete", "texto": "Listar os medos que impedem o cliente de trocar de fornecedor e responder a cada um na comunicação", "esforco": "venda", "promessa": "vendas", "porque": "Não basta o cliente querer o novo: o medo de errar e o costume com o antigo seguram a troca. Responder aos medos destrava a decisão.", "metrica": "Respostas aos medos publicadas e usadas nas vendas", "tema": "conteudo"},
    {"grupo": "Torres · Continuous Discovery Habits", "texto": "Conversar com um cliente toda semana, por 15 minutos, e anotar o que aprendeu", "esforco": "marca", "promessa": "valor", "porque": "Uma pesquisa por ano chega tarde. Conversas curtas e frequentes mostram cedo o que mudou na vida do cliente.", "metrica": "12 conversas registradas em 3 meses", "tema": "medicao"},
    {"grupo": "Ramanujam & Tacke · Monetizing Innovation", "texto": "Antes de lançar um serviço novo, perguntar a 10 clientes se pagariam, quanto e de que forma", "esforco": "venda", "promessa": "valor", "porque": "Muitos lançamentos falham porque o preço é pensado só no fim. Conversar sobre preço antes de criar mostra se vale a pena e como cobrar.", "metrica": "Preço e formato definidos antes do lançamento", "tema": "preco"},
    {"grupo": "Malhotra · Negotiation Genius", "texto": "Definir, antes de cada negociação grande, o preço mínimo aceitável e o que fazer se não fechar", "esforco": "venda", "promessa": "valor", "porque": "Quem entra na negociação sem alternativa cede mais do que devia. Saber o limite e o plano B dá firmeza para não baixar preço por medo.", "metrica": "Negociações grandes com mínimo e plano B definidos", "tema": "preco"},
    {"grupo": "Holden · Negotiating with Backbone", "texto": "Listar o que a empresa pode ceder sem baixar o preço: prazo, escopo, forma de pagamento ou extras", "esforco": "venda", "promessa": "valor", "porque": "Quando o cliente pede desconto, ceder no preço é o jeito mais caro de fechar. Trocar por outras condições preserva a margem.", "metrica": "Negociações fechadas com troca de condição, sem desconto", "tema": "preco"},
    {"grupo": "Weiss · Value-Based Fees", "texto": "Combinar com o cliente, antes de falar de preço, os objetivos e como o sucesso será medido", "esforco": "venda", "promessa": "valor", "porque": "Quando o resultado esperado está claro e acordado, o preço passa a ser comparado com o valor, e não com o concorrente.", "metrica": "Propostas com objetivos e medidas combinados antes", "tema": "venda"},
    {"grupo": "Enns · Pricing Creativity", "texto": "Perguntar a faixa de investimento já na primeira conversa, com naturalidade", "esforco": "venda", "promessa": "vendas", "porque": "Evitar o assunto do dinheiro leva a propostas fora da realidade e a semanas perdidas. Falar cedo poupa tempo dos dois lados.", "metrica": "Menos propostas fora do orçamento do cliente", "tema": "venda"},
    {"grupo": "Snyder & Kearns · Escaping the Price-Driven Sale", "texto": "Identificar se o cliente compra por preço, por valor ou por relação, e adaptar a proposta", "esforco": "venda", "promessa": "valor", "porque": "Nem todo cliente quer a mesma coisa. Tratar quem busca valor como quem busca preço deixa dinheiro na mesa; o contrário perde a venda.", "metrica": "Cada proposta adaptada ao tipo de comprador", "tema": "venda"},
    {"grupo": "Stark · Hourly Billing Is Nuts", "texto": "Cobrar por projeto ou por resultado, e não por hora", "esforco": "venda", "promessa": "valor", "porque": "Cobrar por hora pune a eficiência e faz o cliente vigiar o relógio. Preço por projeto foca no valor entregue.", "metrica": "Serviços principais com preço fechado", "tema": "preco"},
    {"grupo": "Simon · Confessions of the Pricing Man", "texto": "Oferecer formas de pagamento que facilitem a compra sem baixar o preço: parcelas, assinatura ou entrada menor", "esforco": "venda", "promessa": "vendas", "porque": "Muitas vezes o problema não é o valor, e sim o tamanho do pagamento de uma vez. Mudar a forma de pagar destrava vendas mantendo o preço.", "metrica": "Mais vendas fechadas com o mesmo preço", "tema": "preco"},
    {"grupo": "Kapferer & Bastien · The Luxury Strategy", "texto": "Para marcas premium: tirar o desconto público e reservar condições só para clientes antigos", "esforco": "venda", "promessa": "valor", "porque": "Em marcas de alto valor, desconto aberto ensina que o preço cheio é exagerado. Reconhecer quem já é cliente premia a relação sem baratear a marca.", "metrica": "Preço cheio mantido e clientes antigos reconhecidos", "tema": "preco"},
    {"grupo": "Doyle · Value-Based Marketing", "texto": "Calcular a margem de cada serviço ou produto e concentrar a comunicação nos mais lucrativos", "esforco": "venda", "promessa": "valor", "porque": "Vender mais do item errado pode aumentar o faturamento e diminuir o lucro. Saber a margem mostra o que vale empurrar.", "metrica": "Margem de cada item conhecida e os 3 melhores em destaque", "tema": "preco"},
    {"grupo": "Doyle · Value-Based Marketing", "texto": "Revisar o portfólio: separar o que traz clientes, o que dá lucro e o que só ocupa espaço", "esforco": "venda", "promessa": "valor", "porque": "Itens que não trazem clientes nem lucro custam atenção e confundem a escolha. Organizar o portfólio deixa a oferta mais clara.", "metrica": "Portfólio enxuto com papel definido para cada item", "tema": "preco"},
    {"grupo": "Keenan · Gap Selling", "texto": "Descrever com o cliente a situação de hoje e a situação desejada antes de apresentar a solução", "esforco": "venda", "promessa": "vendas", "porque": "O cliente compra para sair de onde está e chegar aonde quer. Sem deixar claro esse caminho, a solução parece cara e desnecessária.", "metrica": "Propostas com situação atual e desejada descritas", "tema": "venda"},
    {"grupo": "Dunford · Sales Pitch", "texto": "Abrir a apresentação comercial pela mudança no mercado que torna o jeito antigo arriscado", "esforco": "venda", "promessa": "valor", "porque": "O maior concorrente costuma ser deixar tudo como está. Mostrar o que mudou no mercado dá ao cliente um motivo para agir agora.", "metrica": "Mais reuniões que avançam para proposta", "tema": "venda"},
    {"grupo": "Adamson & Dixon · The Challenger Customer", "texto": "Montar um material para o contato interno convencer os outros decisores da empresa dele", "esforco": "venda", "promessa": "vendas", "porque": "Em compras de empresa, quem conversa com você precisa convencer outros que você não vê. Dar a ele argumentos prontos aumenta a chance de aprovação.", "metrica": "Propostas aprovadas pelos outros decisores", "tema": "venda"},
    {"grupo": "Pink · Saber vender é da natureza humana", "texto": "Combinar com o cliente o acompanhamento depois da proposta: em 2, 5 e 10 dias, cada contato com algo útil", "esforco": "venda", "promessa": "vendas", "porque": "Muitas vendas se perdem por falta de retorno, e não por um não. Um acompanhamento combinado e útil mantém a conversa viva sem pressão.", "metrica": "Menos propostas sem resposta depois de 15 dias", "tema": "venda"},
    {"grupo": "Caples · Tested Advertising Methods", "texto": "Escrever 10 títulos diferentes para o anúncio principal antes de escolher um", "esforco": "marca", "promessa": "pessoas", "porque": "O título decide se o resto será visto. Testes mostram grandes diferenças entre títulos para o mesmo produto.", "metrica": "Título escolhido entre 10 opções e testado", "tema": "anuncio"},
    {"grupo": "Sullivan · Hey Whipple, Squeeze This", "texto": "Reduzir cada anúncio a uma só ideia e cortar o resto", "esforco": "marca", "promessa": "pessoas", "porque": "Anúncio com muitas mensagens não comunica nenhuma. Uma ideia clara é percebida e lembrada mesmo com pouca atenção.", "metrica": "Cada anúncio resumido em uma frase", "tema": "anuncio"},
    {"grupo": "Steel · Perfect Pitch", "texto": "Escrever o briefing de cada campanha em uma página: o que a pessoa deve pensar, sentir e fazer", "esforco": "marca", "promessa": "pessoas", "porque": "Briefing vago gera peças bonitas e sem efeito. Uma página clara orienta a criação e serve para avaliar o resultado.", "metrica": "Toda campanha com briefing de uma página", "tema": "anuncio"},
    {"grupo": "Du Plessis · The Advertised Mind", "texto": "Manter o anúncio que funciona no ar por mais tempo: o cansaço da equipe não é o cansaço do público", "esforco": "marca", "promessa": "pessoas", "porque": "Quem faz o anúncio cansa dele muito antes do público. Trocar cedo demais joga fora a memória que estava sendo construída.", "metrica": "Anúncios bons mantidos até os resultados caírem", "tema": "anuncio"},
    {"grupo": "Briggs & Stuart · What Sticks", "texto": "Dividir a verba entre pelo menos 2 tipos de mídia, porque juntos alcançam mais gente", "esforco": "marca", "promessa": "pessoas", "porque": "Cada meio alcança pessoas diferentes. Combinar meios aumenta o alcance e reforça a lembrança de quem vê nos dois.", "metrica": "Alcance maior com a mesma verba", "tema": "anuncio"},
    {"grupo": "Caples · Tested Advertising Methods", "texto": "Usar um código ou link diferente em cada canal para saber de onde vêm as vendas", "esforco": "venda", "promessa": "vendas", "porque": "Sem rastrear a origem, a verba vai para o canal que parece funcionar, e não para o que funciona. O código mostra a resposta real.", "metrica": "Origem conhecida da maioria das vendas", "tema": "medicao"},
    {"grupo": "Voorveld et al. · Engajamento e publicidade nas redes", "texto": "Anunciar de novo para quem visitou o site ou falou com a empresa e não comprou", "esforco": "venda", "promessa": "vendas", "porque": "Quem já demonstrou interesse está mais perto de comprar. Lembrá-lo da marca nos dias seguintes recupera parte dessas vendas.", "metrica": "Vendas vindas de quem já tinha visitado", "tema": "anuncio"},
    {"grupo": "Caples · Tested Advertising Methods", "texto": "Lançar uma novidade por semestre e comunicar como notícia", "esforco": "marca", "promessa": "pessoas", "porque": "Notícia chama mais atenção do que propaganda. Ter algo novo para contar dá motivo para falar da marca sem repetir a mesma oferta.", "metrica": "Uma novidade comunicada por semestre", "tema": "anuncio"},
    {"grupo": "Feldwick · The Anatomy of Humbug", "texto": "Criar uma data própria da marca e celebrar todo ano do mesmo jeito", "esforco": "marca", "promessa": "pessoas", "porque": "Eventos que se repetem viram tradição e dão um momento fixo para lembrar da marca. A repetição anual constrói memória.", "metrica": "Data própria celebrada por 2 anos seguidos", "tema": "anuncio"},
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Apoiar algo local que o público frequenta, com a marca bem visível", "esforco": "marca", "promessa": "pessoas", "porque": "Estar presente onde o público já está, de forma repetida, aumenta a familiaridade com a marca. Patrocínio sem a marca visível não constrói nada.", "metrica": "Marca vista pelo público do evento ou do lugar", "tema": "anuncio"},
    {"grupo": "Lawes · Using Semiotics in Marketing", "texto": "Mapear os códigos da categoria: o que todos repetem, o que está ficando velho e o que está surgindo", "esforco": "marca", "promessa": "valor", "porque": "Toda categoria tem imagens e palavras que todo mundo usa. Saber quais estão envelhecendo e quais estão surgindo ajuda a parecer atual e diferente.", "metrica": "Mapa de códigos com 3 escolhas para a marca", "tema": "posicionamento"},
    {"grupo": "Holt & Cameron · Cultural Strategy", "texto": "Identificar uma tensão que o cliente vive na sociedade e colocar a marca do lado dele", "esforco": "marca", "promessa": "valor", "porque": "Marcas que viram referência costumam responder a uma tensão do seu tempo, e não só a uma necessidade de produto. Isso cria afinidade difícil de copiar.", "metrica": "Tensão escolhida e expressa em uma peça de marca", "tema": "posicionamento"},
    {"grupo": "Simler & Hanson · The Elephant in the Brain", "texto": "Mostrar o que a escolha da marca diz sobre quem compra", "esforco": "marca", "promessa": "valor", "porque": "Muitas compras também servem para mostrar algo aos outros: cuidado, bom gosto ou inteligência. Deixar isso claro torna a marca mais desejável.", "metrica": "Peças que mostram o que a escolha diz sobre o cliente", "tema": "conteudo"},
    {"grupo": "Jenkins, Ford & Green · Cultura da conexão", "texto": "Criar algo que o cliente queira mostrar: um certificado, uma foto ou uma frase da marca", "esforco": "marca", "promessa": "pessoas", "porque": "As pessoas compartilham o que as faz parecer bem. Dar a elas algo bonito para mostrar espalha a marca de graça.", "metrica": "Clientes compartilhando com a marca visível", "tema": "relacao"},
    {"grupo": "Peters · Logos That Last", "texto": "Testar o logo bem pequeno, como ícone de celular, carimbo e bordado, e criar uma versão reduzida se precisar", "esforco": "marca", "promessa": "pessoas", "porque": "Grande parte das aplicações do logo hoje é minúscula. Se ele não funciona pequeno, a marca some justamente onde mais aparece.", "metrica": "Logo legível em todos os tamanhos", "tema": "presenca"},
    {"grupo": "Lidwell · Universal Principles of Design", "texto": "Conferir o contraste das cores da marca em textos e botões para que todos consigam ler", "esforco": "marca", "promessa": "pessoas", "porque": "Cor bonita com pouco contraste deixa o texto ilegível para muita gente, principalmente no celular e ao sol. Ler bem também é parte da marca.", "metrica": "Todos os textos e botões com contraste adequado", "tema": "presenca"},
    {"grupo": "Carter, Day & Meggs · Typographic Design", "texto": "Limitar a marca a 2 fontes e definir tamanhos fixos para títulos e textos", "esforco": "marca", "promessa": "pessoas", "porque": "Muitas fontes e tamanhos deixam as peças desorganizadas e diferentes entre si. Poucas regras dão unidade e deixam a marca reconhecível.", "metrica": "Todas as peças com as 2 fontes e os tamanhos definidos", "tema": "presenca"},
    {"grupo": "Fenton & Kiefer Lee · Nicely Said", "texto": "Reescrever as mensagens automáticas no tom de voz da marca: confirmações, avisos, cobranças e erros", "esforco": "marca", "promessa": "valor", "porque": "Mensagens automáticas são lidas por todos os clientes e costumam soar frias. São muitos contatos que podem reforçar a marca em vez de apagá-la.", "metrica": "Mensagens automáticas reescritas no tom da marca", "tema": "conteudo"},
    {"grupo": "West · Strong Language", "texto": "Escrever o glossário da marca: as palavras que a marca usa e as que evita", "esforco": "marca", "promessa": "valor", "porque": "Palavras repetidas viram parte da identidade, assim como cores. Um glossário mantém todos falando do mesmo jeito.", "metrica": "Glossário em uso por toda a equipe", "tema": "equipe"},
    {"grupo": "Rumelt · Estratégia boa, estratégia ruim", "texto": "Escrever em um parágrafo o principal obstáculo ao crescimento e as 3 ações que atacam ele", "esforco": "marca", "promessa": "valor", "porque": "Lista de metas não é estratégia. Uma boa estratégia começa por nomear o obstáculo e concentrar as ações nele.", "metrica": "Obstáculo e ações aprovados pelos sócios", "tema": "posicionamento"},
    {"grupo": "Hubbard · How to Measure Anything", "texto": "Estimar o resultado com mínimo e máximo antes de investir, e conferir depois", "esforco": "venda", "promessa": "vendas", "porque": "Estimar em faixa obriga a pensar no risco e ensina a calibrar as próximas apostas. Comparar com o real melhora as decisões seguintes.", "metrica": "Estimativas registradas e comparadas com o resultado", "tema": "medicao"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Calcular quanto custa conquistar um cliente e quanto ele deixa ao longo do tempo", "esforco": "venda", "promessa": "vendas", "porque": "Sem esses dois números, não dá para saber quanto vale investir para atrair clientes. A comparação mostra o limite saudável do investimento.", "metrica": "Custo de conquista e valor do cliente conhecidos", "tema": "medicao"},
    {"grupo": "Fournier · Strong Brands, Strong Relationships", "texto": "Combinar como responder a uma crise: quem fala, o que diz e em quanto tempo", "esforco": "marca", "promessa": "valor", "porque": "Na crise, a demora e o improviso fazem mais estrago do que o problema. Ter o roteiro pronto protege a confiança construída.", "metrica": "Roteiro de crise escrito e conhecido pela equipe", "tema": "experiencia"},
    {"grupo": "Fournier · Strong Brands, Strong Relationships", "texto": "Acompanhar uma vez por semana o que falam da marca na internet", "esforco": "marca", "promessa": "valor", "porque": "Comentários e avaliações espalham a imagem da marca mais rápido do que a comunicação oficial. Ver cedo permite agradecer e corrigir.", "metrica": "Menções revisadas toda semana por 3 meses", "tema": "medicao"},
    {"grupo": "Pinci & Glaser · The Referral Code", "texto": "Agradecer por escrito cada indicação recebida e contar o que aconteceu com ela", "esforco": "venda", "promessa": "pessoas", "porque": "Quem indica quer saber se ajudou. Agradecer e contar o resultado faz a pessoa indicar de novo.", "metrica": "Indicações repetidas pelos mesmos clientes", "tema": "relacao"},
    {"grupo": "LeeYohn · Fusion", "texto": "Pedir à equipe 3 ideias para melhorar o atendimento e testar a melhor no mês seguinte", "esforco": "marca", "promessa": "valor", "porque": "Quem atende vê problemas que a gestão não vê. Ouvir a equipe melhora o serviço e faz ela se sentir dona da marca.", "metrica": "Uma ideia da equipe testada por mês", "tema": "equipe"},
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Aparecer nas listas, guias e comparadores que o cliente consulta antes de comprar", "esforco": "venda", "promessa": "pessoas", "porque": "Muitos clientes montam sua lista de opções em guias, associações e sites do setor. Quem não está lá nem entra na disputa.", "metrica": "Empresa presente nas 3 principais listas do setor", "tema": "distribuicao"},
    {"grupo": "Harhut · Using Behavioral Science in Marketing", "texto": "Deixar a opção recomendada já marcada no pedido, no orçamento ou no formulário", "esforco": "venda", "promessa": "vendas", "porque": "A maioria das pessoas fica com a opção que já vem marcada. Escolher bem esse padrão ajuda o cliente e aumenta a venda certa.", "metrica": "Mais clientes escolhem a opção recomendada", "tema": "experiencia"},
    {"grupo": "Harhut · Using Behavioral Science in Marketing", "texto": "Mostrar ao cliente quanto falta para concluir: no pedido, no cadastro ou no programa", "esforco": "venda", "promessa": "vendas", "porque": "Quem vê que está perto do fim se esforça mais para terminar. Mostrar o progresso reduz desistências no meio do caminho.", "metrica": "Menos desistências antes do fim", "tema": "experiencia"},
    {"grupo": "Zeithaml · Marketing de serviços", "texto": "Explicar o tratamento ou o serviço em etapas, com prazos e custos por escrito, antes de começar", "esforco": "venda", "promessa": "valor", "porque": "Serviços difíceis de avaliar geram ansiedade. Saber o caminho, o tempo e o custo antes dá segurança e evita desistência no meio.", "metrica": "Menos desistências no meio do tratamento", "tema": "experiencia"},
    {"grupo": "Moon · Diferente", "texto": "Ter um item que só a casa tem e colocá-lo em destaque em todos os canais", "esforco": "marca", "promessa": "valor", "porque": "Um item exclusivo vira motivo para escolher e para comentar. Ele funciona como um ativo da marca dentro da oferta.", "metrica": "Item exclusivo entre os mais pedidos", "tema": "posicionamento"},
    {"grupo": "Underhill · Vamos às compras", "texto": "Treinar a equipe da loja a abordar com uma pergunta útil, e não com \"posso ajudar?\"", "esforco": "venda", "promessa": "vendas", "porque": "\"Posso ajudar?\" quase sempre recebe um não automático. Uma pergunta útil sobre o que o cliente procura abre a conversa e a venda.", "metrica": "Mais conversas que viram venda na loja", "tema": "equipe"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Acompanhar de perto o cliente nas 2 primeiras semanas, quando o risco de desistência é maior", "esforco": "venda", "promessa": "vendas", "porque": "O começo decide se o cliente fica. Um acompanhamento próximo nessa fase evita que dúvidas pequenas virem cancelamento.", "metrica": "Menos desistências no primeiro mês", "tema": "relacao"},
    {"grupo": "Romaniuk & Sharp · Relevância da marca e cancelamento", "texto": "Avisar o cliente que está usando pouco o serviço e oferecer ajuda antes que ele cancele", "esforco": "venda", "promessa": "vendas", "porque": "Quem usa pouco esquece o valor e cancela. Perceber cedo e ajudar a usar mantém a marca relevante.", "metrica": "Cancelamentos caem entre os que usavam pouco", "tema": "relacao"},
    {"grupo": "Maister · Managing the Professional Service Firm", "texto": "Fazer uma revisão de resultados a cada trimestre com cada cliente grande", "esforco": "venda", "promessa": "vendas", "porque": "Clientes grandes saem quando deixam de ver o valor. Rever os resultados com regularidade mostra o que foi entregue e abre espaço para novos projetos.", "metrica": "Revisões feitas com todos os clientes grandes", "tema": "relacao"}
  );

  // ===== Biblioteca ampliada (3ª parte): vendas, decisão de compra, experiência, marca, mídia local, canais e medição do crescimento =====
  window.GangPresets.acoes.push(
    {"grupo": "Dixon & McKenna · The JOLT Effect", "texto": "Listar as 5 objeções mais comuns e escrever uma resposta curta e honesta para cada uma", "esforco": "venda", "promessa": "vendas", "porque": "As mesmas dúvidas travam quase todas as vendas. Quem tem a resposta pronta e verdadeira passa segurança e não perde a venda no improviso.", "metrica": "Menos vendas perdidas pelas mesmas objeções", "tema": "venda"},
    {"grupo": "Rackham · Rethinking the Sales Force", "texto": "Ouvir uma conversa de venda por semana e anotar uma coisa para melhorar", "esforco": "venda", "promessa": "vendas", "porque": "Quem vende raramente se ouve. Rever conversas reais mostra onde o cliente esfriou e o que funcionou, e melhora a próxima.", "metrica": "Uma melhoria aplicada por semana nas conversas de venda", "tema": "venda"},
    {"grupo": "Baker · The Business of Expertise", "texto": "Escrever o perfil do cliente ideal e os sinais de quem não é cliente para a empresa", "esforco": "venda", "promessa": "valor", "porque": "Atender qualquer um dilui a especialidade e derruba o preço. Saber dizer não aos clientes errados abre espaço para os certos.", "metrica": "Mais vendas para clientes com o perfil ideal", "tema": "posicionamento"},
    {"grupo": "Burgess · Executive Engagement Strategies", "texto": "Pedir uma conversa por ano com o dono ou o diretor de cada cliente B2B importante", "esforco": "venda", "promessa": "vendas", "porque": "Quem decide a continuidade e os novos projetos raramente é quem atende no dia a dia. Falar com essa pessoa protege o cliente e abre novas vendas.", "metrica": "Conversas anuais feitas com os decisores dos clientes principais", "tema": "relacao"},
    {"grupo": "Block · Flawless Consulting", "texto": "Combinar por escrito, no início, o que a empresa faz, o que o cliente faz e como os dois vão saber que deu certo", "esforco": "venda", "promessa": "valor", "porque": "Boa parte da insatisfação nasce de expectativas diferentes, e não do trabalho. Combinar antes evita frustração e protege a indicação no final.", "metrica": "Todo projeto novo começa com o combinado por escrito", "tema": "experiencia"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Admitir na comunicação uma limitação honesta da empresa, ao lado do que ela faz de melhor", "esforco": "marca", "promessa": "valor", "porque": "Quem só fala de qualidades parece estar vendendo. Admitir uma limitação pequena e verdadeira torna o resto da mensagem mais crível.", "metrica": "Mais confiança percebida nas pesquisas e nos comentários", "tema": "conteudo"},
    {"grupo": "Shotton · A ilusão da escolha", "texto": "Pedir ao cliente novo um primeiro passo bem pequeno antes do compromisso maior", "esforco": "venda", "promessa": "vendas", "porque": "Um primeiro passo fácil faz a pessoa se ver como cliente, e os passos seguintes ficam mais naturais. Pedir tudo de uma vez assusta.", "metrica": "Mais pessoas avançam do primeiro contato para a compra", "tema": "venda"},
    {"grupo": "Sutherland · Alquimia", "texto": "Mostrar o trabalho que o cliente não vê: o cuidado e as etapas por trás do resultado", "esforco": "marca", "promessa": "valor", "porque": "As pessoas valorizam mais o que percebem que deu trabalho. Mostrar os bastidores justifica o preço e aumenta a satisfação com o mesmo serviço.", "metrica": "Clientes citam o cuidado e o processo nos comentários", "tema": "conteudo"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Trocar avisos que reforçam o erro (\"muitos clientes esquecem…\") por mensagens sobre o que a maioria faz certo", "esforco": "venda", "promessa": "vendas", "porque": "Dizer que muita gente faz algo errado acaba ensinando que isso é normal. Mostrar o comportamento certo da maioria funciona melhor.", "metrica": "Mais clientes fazem o que a mensagem pede", "tema": "experiencia"},
    {"grupo": "Shotton · A ilusão da escolha", "texto": "Mostrar o preço em parcelas pequenas do dia ou do uso, quando fizer sentido", "esforco": "venda", "promessa": "vendas", "porque": "O mesmo valor parece menor quando dividido no tempo em que é usado. Isso ajuda quem compara o preço cheio com o próprio orçamento.", "metrica": "Mais vendas fechadas com o mesmo preço", "tema": "preco"},
    {"grupo": "Sutherland · Alquimia", "texto": "Usar preço redondo nos serviços premium e reservar os quebrados para as ofertas", "esforco": "venda", "promessa": "valor", "porque": "Preço quebrado sinaliza promoção; preço redondo sinaliza qualidade e decisão pensada. Em serviços de alto valor, o redondo combina mais com a marca.", "metrica": "Preço médio mantido sem perda de fechamento", "tema": "preco"},
    {"grupo": "Zeithaml · Marketing de serviços", "texto": "Revisar o ambiente onde o cliente espera e é atendido: limpeza, luz, som, conforto e a marca à vista", "esforco": "marca", "promessa": "valor", "porque": "Em serviços, o cliente julga a qualidade pelo que vê ao redor, porque o serviço em si é difícil de avaliar. O ambiente fala pela marca.", "metrica": "Comentários positivos sobre o ambiente", "tema": "experiencia"},
    {"grupo": "Halvorson · Content Design", "texto": "Revisar o site com uma regra: cada página com um objetivo e uma chamada principal", "esforco": "venda", "promessa": "vendas", "porque": "Páginas que tentam dizer tudo confundem e não levam a lugar nenhum. Um objetivo por página deixa claro o próximo passo.", "metrica": "Mais contatos por visita", "tema": "conteudo"},
    {"grupo": "Krug · Rocket Surgery Made Easy", "texto": "Mostrar a página inicial por 5 segundos a 5 pessoas e perguntar o que a empresa faz", "esforco": "marca", "promessa": "pessoas", "porque": "O visitante decide em segundos se ficou no lugar certo. Se em 5 segundos não dá para entender, a mensagem principal precisa mudar.", "metrica": "4 de 5 pessoas entendem o que a empresa faz", "tema": "medicao"},
    {"grupo": "Kalbag & Pickering · Accessibility for Everyone", "texto": "Colocar legenda em todos os vídeos da marca", "esforco": "marca", "promessa": "pessoas", "porque": "Muita gente assiste a vídeos sem som, e parte do público depende da legenda. Com legenda, a mensagem chega a todos.", "metrica": "Todos os vídeos publicados com legenda", "tema": "conteudo"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Descobrir de quanto em quanto tempo o cliente volta a comprar e lembrá-lo perto da data", "esforco": "venda", "promessa": "vendas", "porque": "Cada serviço ou produto tem um ritmo natural de recompra. Lembrar na hora certa traz o cliente de volta antes que ele procure outro.", "metrica": "Mais recompras no prazo esperado", "tema": "relacao"},
    {"grupo": "Keller · Strategic Brand Management", "texto": "Fazer uma ação com outra marca respeitada pelo mesmo público", "esforco": "marca", "promessa": "pessoas", "porque": "Uma marca empresta parte da sua imagem à outra quando aparecem juntas. Uma parceria bem escolhida apresenta a empresa a um público que já confia na parceira.", "metrica": "Clientes novos vindos da base da marca parceira", "tema": "anuncio"},
    {"grupo": "Aaker · Brand Relevance", "texto": "Antes de lançar algo com o nome da marca, conferir se combina com o que a marca representa", "esforco": "marca", "promessa": "valor", "porque": "Uma extensão que não combina confunde e enfraquece a marca principal. Uma que combina aproveita a confiança que já existe.", "metrica": "Lançamentos que reforçam a marca principal", "tema": "posicionamento"},
    {"grupo": "Romaniuk · Ativos distintivos", "texto": "Ao atualizar a identidade, manter os elementos que as pessoas já reconhecem", "esforco": "marca", "promessa": "pessoas", "porque": "Trocar tudo de uma vez joga fora anos de memória. Atualizar por cima do que já é reconhecido moderniza sem fazer a marca recomeçar.", "metrica": "Reconhecimento da marca mantido após a atualização", "tema": "presenca"},
    {"grupo": "Malone & Fiske · The Human Brand", "texto": "Mostrar cuidado com as pessoas, e não só competência: gestos, histórias e respostas humanas", "esforco": "marca", "promessa": "valor", "porque": "As pessoas julgam empresas como julgam pessoas: primeiro se têm boas intenções, depois se são capazes. Só competência parece fria.", "metrica": "Clientes descrevem a marca com palavras de cuidado", "tema": "conteudo"},
    {"grupo": "Miller · Brand New Name", "texto": "Testar o nome da marca ou do serviço: é fácil de dizer, de escrever e de achar na busca?", "esforco": "marca", "promessa": "pessoas", "porque": "Um nome difícil de falar ou de escrever atrapalha a indicação e a busca. Quem ouve precisa conseguir encontrar a empresa depois.", "metrica": "8 de 10 pessoas escrevem o nome certo depois de ouvir", "tema": "medicao"},
    {"grupo": "Greenwald & Kahn · Competition Demystified", "texto": "Concentrar a presença numa região ou num nicho onde a empresa possa ser a mais lembrada", "esforco": "marca", "promessa": "pessoas", "porque": "Ser grande em um lugar pequeno vale mais do que ser pequeno em todo lugar. A concentração faz cada real de comunicação render mais.", "metrica": "Participação maior na região ou no nicho escolhido", "tema": "posicionamento"},
    {"grupo": "Chernatony · From Brand Vision to Brand Evaluation", "texto": "Escrever com cada área o que ela faz, no dia a dia, para cumprir a promessa da marca", "esforco": "marca", "promessa": "valor", "porque": "A promessa só vira realidade quando cada área sabe o seu papel nela. Sem isso, a marca fica no site e não chega ao cliente.", "metrica": "Cada área com 3 comportamentos ligados à promessa", "tema": "equipe"},
    {"grupo": "Binet & Field · Mídia em foco", "texto": "Usar o melhor conteúdo da marca como anúncio para quem ainda não segue a empresa", "esforco": "marca", "promessa": "pessoas", "porque": "O conteúdo orgânico chega quase só a quem já conhece a marca. Investir no que já provou funcionar leva a marca a novas pessoas.", "metrica": "Alcance entre quem ainda não conhece a marca", "tema": "anuncio"},
    {"grupo": "Sharp · Marketing: Theory, Evidence, Practice", "texto": "Anunciar perto de onde o cliente compra: mídia de rua, rádio local ou ponto de venda", "esforco": "marca", "promessa": "pessoas", "porque": "Ser lembrada perto do momento e do lugar da compra aumenta a chance de ser escolhida. A mídia local alcança quem passa por ali todo dia.", "metrica": "Mais clientes citam a mídia local como lembrança", "tema": "anuncio"},
    {"grupo": "Sharp · How Brands Grow", "texto": "Garantir que quem procura o nome da marca encontre a empresa em primeiro lugar", "esforco": "venda", "promessa": "vendas", "porque": "Quem procura pelo nome já quer comprar. Se um concorrente ou um site errado aparece antes, a venda vai embora no último passo.", "metrica": "Empresa em primeiro na busca pelo próprio nome", "tema": "distribuicao"},
    {"grupo": "Schultz & Doerr · Professional Services Marketing", "texto": "Publicar uma vez por mês uma opinião forte da empresa sobre um tema do setor", "esforco": "marca", "promessa": "valor", "porque": "Especialistas são escolhidos pelo que pensam, e não só pelo que fazem. Uma opinião clara e repetida posiciona a empresa como referência.", "metrica": "Convites, menções e contatos vindos das opiniões publicadas", "tema": "conteudo"},
    {"grupo": "Chernatony · From Brand Vision to Brand Evaluation", "texto": "Inscrever a empresa em prêmios, rankings ou certificações respeitados no setor", "esforco": "marca", "promessa": "valor", "porque": "Reconhecimento de terceiros vale mais do que a empresa falar bem de si. Um selo respeitado reduz o risco percebido de quem não conhece a marca.", "metrica": "Um reconhecimento conquistado e usado na comunicação", "tema": "conteudo"},
    {"grupo": "Romaniuk · Ativos distintivos", "texto": "Montar o catálogo no WhatsApp Business com fotos, preços e descrição de cada serviço ou produto", "esforco": "venda", "promessa": "vendas", "porque": "O cliente quer ver as opções sem precisar perguntar tudo. O catálogo encurta a conversa e leva mais gente até o pedido.", "metrica": "Mais pedidos feitos direto pelo catálogo", "tema": "distribuicao"},
    {"grupo": "Underhill · Vamos às compras", "texto": "Fazer degustação, demonstração ou teste no ponto de venda", "esforco": "venda", "promessa": "pessoas", "porque": "Experimentar tira o risco da primeira compra e mostra a qualidade melhor do que qualquer anúncio.", "metrica": "Vendas feitas para quem experimentou", "tema": "venda"},
    {"grupo": "Underhill · Vamos às compras", "texto": "Colocar os ativos da marca no balcão, no caixa e na entrega, onde o cliente está decidindo", "esforco": "marca", "promessa": "pessoas", "porque": "O momento da compra é quando a marca mais influencia. Ser vista ali reforça a escolha e a lembrança da próxima vez.", "metrica": "Ativos da marca presentes em todos os pontos de decisão", "tema": "presenca"},
    {"grupo": "Pinci & Glaser · The Referral Code", "texto": "Criar um programa de indicação com benefício para quem indica e para quem chega", "esforco": "venda", "promessa": "pessoas", "porque": "Muita gente indicaria, mas esquece ou não sabe como. Um programa simples, com vantagem para os dois lados, transforma a intenção em indicação.", "metrica": "Clientes novos vindos do programa de indicação", "tema": "relacao"},
    {"grupo": "Berman & Knight · Financial Intelligence", "texto": "Calcular quantas vendas uma campanha precisa trazer para se pagar, antes de lançar", "esforco": "venda", "promessa": "vendas", "porque": "Sem esse número, não dá para saber se a campanha valeu a pena. Com ele, a meta fica clara e a decisão de continuar fica fácil.", "metrica": "Toda campanha com ponto de equilíbrio calculado", "tema": "medicao"},
    {"grupo": "Snijders · Eat Your Greens", "texto": "Separar o que aumentou por causa da marca do que aumentou por causa de preço, época ou promoção", "esforco": "venda", "promessa": "vendas", "porque": "Nem todo crescimento vem da comunicação. Separar as causas evita creditar à marca o que veio da época, ou cortar o que estava funcionando.", "metrica": "Leitura dos resultados com as causas separadas", "tema": "medicao"},
    {"grupo": "Ambler · Marketing and the Bottom Line", "texto": "Acompanhar a cada trimestre 3 números de saúde da marca, além das vendas", "esforco": "marca", "promessa": "pessoas", "porque": "Vendas mostram o passado; lembrança, preferência e preço mostram o futuro. Acompanhar os dois evita cortar a marca quando as vendas oscilam.", "metrica": "Três indicadores de marca medidos todo trimestre", "tema": "medicao"},
    {"grupo": "Hubbard · How to Measure Anything", "texto": "Antes de decidir algo grande, listar o que falta saber e medir só o que pode mudar a decisão", "esforco": "venda", "promessa": "vendas", "porque": "Muita medição não muda nenhuma decisão. Focar no que pode mudar a escolha economiza tempo e dinheiro.", "metrica": "Decisões grandes tomadas com a dúvida principal medida", "tema": "medicao"},
    {"grupo": "Palmatier & Sridhar · Marketing Strategy", "texto": "Revisar a cada semestre como os clientes mudaram: o que compram, por qual canal e por quê", "esforco": "marca", "promessa": "valor", "porque": "Os clientes mudam com o tempo, e a estratégia que funcionava pode parar de funcionar. Rever com regularidade evita apostar no passado.", "metrica": "Mudanças dos clientes registradas e ações ajustadas", "tema": "medicao"},
    {"grupo": "Lehmann & Winer · Marketing Driven Revenue Growth", "texto": "Separar o crescimento em três fontes: clientes novos, clientes que voltam e quanto cada um gasta", "esforco": "venda", "promessa": "vendas", "porque": "Crescer pode vir de mais clientes, mais compras ou compras maiores. Separar as fontes mostra onde está a maior oportunidade.", "metrica": "Plano do trimestre focado na fonte com mais espaço", "tema": "medicao"}
  );

  // ===== Biblioteca ampliada (4ª parte): estratégia, negociação, escrita, recompra, preço e decisões com dados =====
  window.GangPresets.acoes.push(
    {"grupo": "Levitt · Miopia de Marketing", "texto": "Descrever o negócio pela necessidade que ele resolve, e não pelo produto que vende", "esforco": "marca", "promessa": "valor", "porque": "Empresas que se definem pelo produto deixam de ver novos concorrentes e novas oportunidades. Pensar na necessidade amplia o que a marca pode oferecer.", "metrica": "Frase do negócio escrita pela necessidade do cliente", "tema": "posicionamento"},
    {"grupo": "Escalas · Imagine-se no produto", "texto": "Mostrar o produto ou serviço em uso do ponto de vista de quem compra: a mão, o lugar, o momento dele", "esforco": "marca", "promessa": "pessoas", "porque": "Imagens que ajudam a pessoa a se imaginar usando aumentam a vontade de comprar. Ver de fora é diferente de se ver dentro da cena.", "metrica": "Mais respostas nas peças com a cena em primeira pessoa", "tema": "anuncio"},
    {"grupo": "Sierra · Badass", "texto": "Ensinar o cliente a ficar melhor naquilo que ele quer fazer com o produto ou serviço", "esforco": "venda", "promessa": "vendas", "porque": "As pessoas não amam o produto, amam o que conseguem fazer com ele. Quem ajuda o cliente a ficar bom fica na cabeça dele e é indicado.", "metrica": "Clientes usam o conteúdo e citam o que aprenderam", "tema": "relacao"},
    {"grupo": "Perri · Escaping the Build Trap", "texto": "Antes de criar um serviço novo, abrir uma lista de espera e ver quantos se inscrevem", "esforco": "venda", "promessa": "valor", "porque": "Dizer que compraria é fácil; deixar o contato é um sinal mais forte de interesse. A lista mostra a demanda antes de investir.", "metrica": "Número de inscritos antes do lançamento", "tema": "medicao"},
    {"grupo": "McCracken · Chief Culture Officer", "texto": "Escolher com cuidado as pessoas, os lugares e as situações que aparecem nas peças da marca", "esforco": "marca", "promessa": "valor", "porque": "O significado de quem aparece ao lado da marca passa para ela. Rostos, cenários e situações dizem quem a marca é antes do texto.", "metrica": "Peças com pessoas e cenários coerentes com a marca", "tema": "anuncio"},
    {"grupo": "Christensen · O dilema da inovação", "texto": "Observar concorrentes mais simples e mais baratos que estão crescendo e decidir como responder", "esforco": "marca", "promessa": "valor", "porque": "Os concorrentes que mais ameaçam costumam começar pequenos e baratos, atendendo quem a empresa ignora. Notar cedo dá tempo de reagir.", "metrica": "Ameaças mapeadas e resposta decidida no semestre", "tema": "posicionamento"},
    {"grupo": "Mintzberg · Safári de Estratégia", "texto": "Anotar o que deu certo sem ter sido planejado e decidir se vira parte da estratégia", "esforco": "marca", "promessa": "valor", "porque": "Parte da melhor estratégia nasce da prática, e não do plano. Quem registra os acertos inesperados aprende com o próprio mercado.", "metrica": "Acertos inesperados registrados e incorporados", "tema": "medicao"},
    {"grupo": "Fisher, Ury & Patton · Como chegar ao sim", "texto": "Na negociação, perguntar o motivo por trás de cada pedido do cliente antes de responder", "esforco": "venda", "promessa": "valor", "porque": "Pedidos são posições; por trás deles há interesses que podem ser atendidos de outros jeitos. Entender o motivo evita ceder no preço à toa.", "metrica": "Negociações fechadas atendendo ao interesse, sem desconto", "tema": "venda"},
    {"grupo": "Lencioni · Getting Naked", "texto": "Dar uma recomendação útil já na primeira conversa, antes de fechar qualquer coisa", "esforco": "venda", "promessa": "vendas", "porque": "Mostrar o valor na prática convence mais do que prometer. Quem ajuda antes de vender ganha confiança e costuma ser escolhido.", "metrica": "Mais primeiras conversas que viram proposta", "tema": "venda"},
    {"grupo": "Hart · Wordcraft", "texto": "Ler em voz alta os textos principais da marca e cortar frases longas e palavras difíceis", "esforco": "marca", "promessa": "valor", "porque": "Texto que trava na leitura em voz alta trava também na cabeça do cliente. Frases curtas e palavras comuns são lidas e lembradas.", "metrica": "Textos principais com frases curtas e sem jargão", "tema": "conteudo"},
    {"grupo": "Simmons · We, Me, Them & It", "texto": "Reescrever os textos para falar com o cliente (\"você\"), e não sobre a empresa (\"nós\")", "esforco": "marca", "promessa": "valor", "porque": "Texto centrado na empresa afasta; texto que fala da vida do cliente aproxima. Contar quantas vezes aparece \"nós\" mostra o desequilíbrio.", "metrica": "Textos principais com mais \"você\" do que \"nós\"", "tema": "conteudo"},
    {"grupo": "Kall · Brand Metrics", "texto": "Medir em que etapa as pessoas se perdem: conhecem, consideram, compram e voltam", "esforco": "venda", "promessa": "vendas", "porque": "Saber onde o cliente se perde mostra onde investir. Pouca gente conhecendo pede alcance; muita gente conhecendo e pouca comprando pede outra coisa.", "metrica": "Etapa com maior perda identificada e atacada", "tema": "medicao"},
    {"grupo": "Esteves · Menos achismo, mais dados", "texto": "Manter um diário de testes: o que foi tentado, o que se esperava e o que aconteceu", "esforco": "venda", "promessa": "vendas", "porque": "Sem registro, a empresa repete os mesmos testes e esquece o que aprendeu. O diário transforma tentativas em conhecimento.", "metrica": "Testes registrados e consultados no planejamento", "tema": "medicao"},
    {"grupo": "Rackham · Rethinking the Sales Force", "texto": "Medir quantos orçamentos viram venda e quanto tempo leva para fechar", "esforco": "venda", "promessa": "vendas", "porque": "Com esses dois números, fica claro se o problema é ter poucos contatos ou converter mal. Cada um pede uma ação diferente.", "metrica": "Taxa de conversão e prazo médio conhecidos todo mês", "tema": "medicao"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Permitir agendar ou pedir online a qualquer hora do dia", "esforco": "venda", "promessa": "pessoas", "porque": "Muita gente decide fora do horário comercial. Se não dá para agendar na hora, a vontade passa ou vai para quem permite.", "metrica": "Pedidos e agendamentos feitos fora do horário", "tema": "distribuicao"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Montar um conselho com 5 clientes que se reúne a cada semestre para opinar", "esforco": "marca", "promessa": "valor", "porque": "Clientes ouvidos com regularidade apontam problemas cedo e se sentem parte da marca. Viram defensores e indicam mais.", "metrica": "Duas reuniões por ano com ideias aplicadas", "tema": "relacao"},
    {"grupo": "Lehmann & Winer · Marketing Driven Revenue Growth", "texto": "Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado", "esforco": "venda", "promessa": "vendas", "porque": "O momento mais fácil de vender de novo é logo depois de uma entrega bem-sucedida. A oferta certa nessa hora parece ajuda, e não pressão.", "metrica": "Vendas de um segundo serviço para clientes atuais", "tema": "venda"},
    {"grupo": "Kholmatova · Design Systems", "texto": "Reunir os arquivos da marca numa pasta única com as versões finais e acesso para toda a equipe", "esforco": "marca", "promessa": "pessoas", "porque": "Quando cada um usa uma versão antiga do logo ou das cores, a marca se fragmenta. Uma fonte única garante que todos usem o certo.", "metrica": "Equipe e fornecedores usando só os arquivos oficiais", "tema": "presenca"},
    {"grupo": "Weber · Brand Seduction", "texto": "Criar uma marca sensorial no espaço: um cheiro, uma música ou um material que seja sempre o mesmo", "esforco": "marca", "promessa": "pessoas", "porque": "Sensações ficam na memória sem esforço e ligam o momento à marca. Repetidas sempre iguais, viram um ativo da marca.", "metrica": "Clientes reconhecem o ambiente pelos sentidos", "tema": "experiencia"},
    {"grupo": "Fournier · Strong Brands, Strong Relationships", "texto": "Lembrar com o cliente os marcos da relação: um ano de parceria, um resultado alcançado", "esforco": "marca", "promessa": "valor", "porque": "Relações se fortalecem com momentos celebrados juntos. Lembrar um marco mostra que a empresa acompanha a história do cliente.", "metrica": "Clientes respondem e comentam os marcos lembrados", "tema": "relacao"},
    {"grupo": "Ries & Trout · Posicionamento", "texto": "Escolher a palavra que a marca quer ocupar na cabeça do cliente e repeti-la em tudo", "esforco": "marca", "promessa": "valor", "porque": "A memória guarda poucas associações por marca. Repetir sempre a mesma palavra faz dela o atalho para lembrar a empresa.", "metrica": "Clientes usam a palavra escolhida para descrever a marca", "tema": "posicionamento"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Levar o serviço até o cliente: atendimento em casa, na empresa dele ou online", "esforco": "venda", "promessa": "pessoas", "porque": "Ir até o cliente amplia o alcance para quem não pode ou não quer se deslocar. É outra forma de ser fácil de comprar.", "metrica": "Vendas vindas do atendimento fora do espaço próprio", "tema": "distribuicao"},
    {"grupo": "Pink · Saber vender é da natureza humana", "texto": "Preparar 3 histórias curtas de clientes para contar nas conversas de venda", "esforco": "venda", "promessa": "vendas", "porque": "Histórias são lembradas e convencem mais do que argumentos. Ter as histórias certas na ponta da língua ajuda o cliente a se ver no resultado.", "metrica": "Histórias usadas nas conversas e citadas pelos clientes", "tema": "venda"},
    {"grupo": "Anderson · TED Talks", "texto": "Escolher um porta-voz da marca e treiná-lo para entrevistas, eventos e vídeos", "esforco": "marca", "promessa": "pessoas", "porque": "Uma pessoa reconhecível dá rosto à marca e facilita convites e imprensa. Treinada, ela comunica a mensagem sempre do mesmo jeito.", "metrica": "Aparições do porta-voz em mídia e eventos", "tema": "equipe"},
    {"grupo": "Wirtz · Services Marketing", "texto": "Oferecer uma condição melhor nos horários e dias de pouco movimento", "esforco": "venda", "promessa": "vendas", "porque": "Horário vazio é receita perdida. Uma vantagem nos períodos fracos distribui a procura e aumenta o faturamento sem baixar o preço do pico.", "metrica": "Ocupação maior nos horários fracos", "tema": "preco"},
    {"grupo": "Simon · Confessions of the Pricing Man", "texto": "Cobrar mais pelo atendimento urgente ou fora do horário", "esforco": "venda", "promessa": "valor", "porque": "Quem precisa com urgência valoriza mais e aceita pagar por isso. Cobrar a urgência à parte aumenta a margem e protege a agenda.", "metrica": "Receita extra com atendimentos urgentes", "tema": "preco"},
    {"grupo": "Nagle · Estratégia e tática de preços", "texto": "Separar do preço principal os extras que hoje saem de graça e cobrar por eles", "esforco": "venda", "promessa": "valor", "porque": "Extras dados de graça ensinam que não têm valor. Separar o que é básico do que é adicional aumenta a margem e deixa o preço de entrada competitivo.", "metrica": "Receita vinda dos extras cobrados à parte", "tema": "preco"}
  );

  // ===== Biblioteca ampliada (5ª parte): vieses de decisão, auditoria, relação com o cliente e retorno por canal =====
  window.GangPresets.acoes.push(
    {"grupo": "Shotton · The Choice Factory", "texto": "Ordenar listas de benefícios com o mais forte primeiro e o segundo mais forte por último", "esforco": "marca", "promessa": "valor", "porque": "As pessoas lembram mais do começo e do fim de uma lista. O meio é onde os argumentos se perdem.", "metrica": "Clientes citam os benefícios principais ao descrever a empresa", "tema": "conteudo"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Pedir a alguém de fora que explique o serviço com as próprias palavras e reescrever a comunicação a partir disso", "esforco": "marca", "promessa": "valor", "porque": "Quem conhece demais o próprio negócio esquece o que o cliente não sabe. A explicação de alguém de fora mostra as palavras que o público entende.", "metrica": "Comunicação reescrita com as palavras de quem é de fora", "tema": "conteudo"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Personalizar as mensagens aos clientes com o nome e um detalhe da história de cada um", "esforco": "venda", "promessa": "vendas", "porque": "As pessoas prestam atenção quando algo fala delas. Mensagens com nome e contexto recebem mais resposta do que mensagens genéricas.", "metrica": "Taxa de resposta maior nas mensagens personalizadas", "tema": "relacao"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Oferecer um brinde ou um extra em vez de baixar o preço", "esforco": "venda", "promessa": "valor", "porque": "Algo grátis chama mais atenção do que o mesmo valor em desconto, e não ensina o cliente a esperar preço menor.", "metrica": "Vendas fechadas sem desconto no preço", "tema": "preco"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Anunciar em conteúdos e lugares ligados ao momento em que o cliente pensa no assunto", "esforco": "marca", "promessa": "pessoas", "porque": "O mesmo anúncio funciona melhor quando aparece num contexto que combina com ele. O ambiente prepara a pessoa para a mensagem.", "metrica": "Resposta maior nos anúncios em contexto relacionado", "tema": "anuncio"},
    {"grupo": "Shotton · A ilusão da escolha", "texto": "Dar aos clientes um nome de grupo que eles tenham orgulho de ter, como \"cliente fundador\" ou \"membro\"", "esforco": "marca", "promessa": "valor", "porque": "Quando a pessoa se vê como parte de um grupo, passa a agir de acordo com ele. Um rótulo positivo aumenta a lealdade e a indicação.", "metrica": "Clientes usam o nome do grupo e indicam mais", "tema": "relacao"},
    {"grupo": "Shotton · The Choice Factory", "texto": "Antes de aprovar o plano ou a campanha, pedir a alguém que defenda o contrário", "esforco": "marca", "promessa": "valor", "porque": "Quem criou a ideia procura motivos para confirmar que ela funciona. Alguém do contra encontra os furos antes que custem dinheiro.", "metrica": "Riscos encontrados antes de cada lançamento", "tema": "medicao"},
    {"grupo": "Paper · Anatomia de uma auditoria estratégica de marca", "texto": "Fazer uma vez por ano a auditoria da marca: tudo o que ela diz e faz, comparado com o que os clientes percebem", "esforco": "marca", "promessa": "valor", "porque": "A marca muda aos poucos sem ninguém perceber. Uma revisão anual completa mostra o que se afastou da estratégia e o que precisa voltar.", "metrica": "Relatório anual com 3 correções feitas", "tema": "medicao"},
    {"grupo": "Paper · Redefinindo a relevância da marca", "texto": "Dizer sempre o que a empresa é junto com o nome: \"Lume, clínica de estética\"", "esforco": "marca", "promessa": "pessoas", "porque": "Para ser lembrada na hora certa, a marca precisa estar ligada à categoria na memória. O nome sozinho não ensina o que a empresa faz.", "metrica": "Pessoas que ouvem o nome sabem o que a empresa faz", "tema": "presenca"},
    {"grupo": "Reichheld · O único número que você precisa para crescer", "texto": "Ligar em até 48 horas para quem deu nota baixa na pesquisa e resolver o motivo", "esforco": "venda", "promessa": "vendas", "porque": "Clientes insatisfeitos falam mal e vão embora em silêncio. Resolver rápido recupera parte deles e mostra o que precisa mudar.", "metrica": "Clientes de nota baixa contatados e problemas resolvidos", "tema": "relacao"},
    {"grupo": "Minto · O Princípio da Pirâmide", "texto": "Começar todo relatório e e-mail importante ao cliente pela conclusão, em uma frase", "esforco": "venda", "promessa": "valor", "porque": "O cliente tem pouco tempo e lê o começo. A conclusão primeiro mostra o valor do trabalho e facilita a decisão.", "metrica": "Relatórios e e-mails abrindo pela conclusão", "tema": "relacao"},
    {"grupo": "Aaker · Brand Relevance", "texto": "Medir quanto a mais o cliente aceita pagar pela marca em comparação com a média do mercado", "esforco": "marca", "promessa": "valor", "porque": "O preço a mais que a marca sustenta é uma das melhores medidas da força dela. Se esse valor cresce, a marca está ficando mais forte.", "metrica": "Diferença de preço contra a média medida a cada semestre", "tema": "medicao"},
    {"grupo": "Benun · The Creative Professional’s Guide to Money", "texto": "Calcular quais clientes dão lucro e quais dão prejuízo, contando o tempo gasto com cada um", "esforco": "venda", "promessa": "valor", "porque": "Alguns clientes faturam bem e consomem tanto tempo que dão prejuízo. Saber disso mostra quem atrair mais e o que renegociar.", "metrica": "Clientes classificados por lucro, não só por faturamento", "tema": "preco"},
    {"grupo": "Binet & Field · Marketing na era da responsabilidade", "texto": "Antes de falar de uma causa ou propósito, conferir se a empresa já pratica o que vai dizer", "esforco": "marca", "promessa": "valor", "porque": "Falar de uma causa sem praticar gera desconfiança e pode virar crise. A prática vem antes da comunicação.", "metrica": "Toda causa comunicada com provas de prática", "tema": "posicionamento"},
    {"grupo": "Johnson · Designing with the Mind in Mind", "texto": "Deixar o botão de contato ou de compra sempre visível no celular, em todas as páginas", "esforco": "venda", "promessa": "vendas", "porque": "No celular, quem precisa rolar para achar o contato desiste. Um botão sempre à vista encurta o caminho até o pedido.", "metrica": "Mais contatos vindos do celular", "tema": "experiencia"},
    {"grupo": "Jeffery · Data-Driven Marketing", "texto": "Comparar o retorno de cada canal a cada trimestre e passar verba do pior para o melhor", "esforco": "venda", "promessa": "vendas", "porque": "A verba costuma ficar onde sempre esteve, e não onde rende mais. Rever com números a cada trimestre faz o mesmo dinheiro trazer mais clientes.", "metrica": "Verba redistribuída com base no retorno de cada canal", "tema": "medicao"}
  );

  // tema de cada ação: organiza a biblioteca e o menu do título por tipo de atividade
  window.GangPresets.temas = { presenca: 'Identidade e presença', posicionamento: 'Posicionamento', conteudo: 'Conteúdo e site', anuncio: 'Anúncios e campanhas',
    venda: 'Vendas e propostas', preco: 'Preço e ofertas', relacao: 'Relacionamento e indicação', experiencia: 'Experiência do cliente', distribuicao: 'Onde comprar e canais', equipe: 'Equipe', medicao: 'Medição e pesquisa' };
  const TEMA_DE = [
    ['presenca', ['Padronizar WhatsApp Business', 'Cadastrar e completar o perfil', 'Trocar a fachada', 'Atualizar redes sociais', 'Aplicar a identidade em papelaria', 'Manter os mesmos ativos distintivos']],
    ['posicionamento', ['Escolher a especialidade', 'Listar o que o cliente usaria', 'Fazer uma oficina de 1 hora', 'Escolher uma palavra', 'Publicar um manifesto', 'Dizer publicamente quem']],
    ['conteudo', ['Produzir um conteúdo para uma situação', 'Publicar o método', 'Coletar e publicar depoimentos', 'Criar um material útil', 'Reescrever o site', 'Responder no site', 'Escrever o roteiro da marca', 'Plano em 3 passos']],
    ['anuncio', ['Fazer uma campanha de alcance amplo', 'Montar o calendário de comunicação', 'Produzir uma peça emocional', 'Planejar a presença em anúncios', 'Reescrever o anúncio principal', 'Título que nomeia', 'Antes de cada campanha', 'Um gesto ousado', 'Trocar adjetivos', 'Manter a mesma campanha', 'Reservar uma verba fixa', 'Direcionar a maior parte da verba']],
    ['venda', ['Reescrever o modelo de proposta', 'Criar uma sequência de mensagens', 'Criar o roteiro de diagnóstico', 'Colocar na proposta', 'Mandar os conteúdos antes', 'Mostrar o que muda', 'Lançar um diagnóstico gratuito', 'Levar a cada reunião']],
    ['preco', ['Fazer uma ação de ativação', 'Montar a proposta com 3 opções', 'Definir o preço pelo valor', 'Escrever a política de descontos', 'Calcular a margem']],
    ['relacao', ['Ligar para os clientes atendidos', 'Contato útil e periódico']],
    ['experiencia', ['Revisar o caminho de compra', 'Escrever em uma página o passo a passo']],
    ['equipe', ['Treinar a equipe']],
    ['medicao', ['Testar duas versões', 'Perguntar e anotar de onde veio', 'Levantar quantos clientes', 'Colocar os ativos da marca na pesquisa', 'Ouvir 5 clientes', 'Perguntar a 10 clientes']],
  ];
  const PROMESSA_DE = [
    ['pessoas', ['Padronizar WhatsApp Business', 'Fazer uma campanha de alcance amplo', 'Produzir um conteúdo para uma situação', 'Cadastrar e completar o perfil', 'Montar o calendário de comunicação', 'Planejar a presença em anúncios', 'Trocar a fachada', 'Atualizar redes sociais', 'Aplicar a identidade em papelaria']],
    ['vendas', ['Revisar o caminho de compra', 'Fazer uma ação de ativação', 'Coletar e publicar depoimentos']],
    ['valor', ['Produzir uma peça emocional', 'Reescrever o modelo de proposta', 'Treinar a equipe', 'Publicar o método']],
  ];
  window.GangPresets.acoes.forEach((x) => { if (!x.promessa) { const t = PROMESSA_DE.find(([, ini]) => ini.some((i) => x.texto.startsWith(i))); if (t) x.promessa = t[0]; } });
  window.GangPresets.acoes.forEach((x) => { if (!x.tema) { const t = TEMA_DE.find(([, ini]) => ini.some((i) => x.texto.startsWith(i))); x.tema = t ? t[0] : 'conteudo'; } });

  // ===== Modelos de plano por setor: o esqueleto de 18 meses (o consultor ajusta depois) =====
  // [mês (1 a 18), peso, promessa, esforço, ação, porquê, sucesso se]
  const BASE = [
    [1, 'essencial', 'pessoas', 'marca', 'Padronizar WhatsApp Business, assinatura de e-mail e modelos de documentos com a identidade da marca', 'Marcas crescem quando são reconhecidas na hora; a mesma cor, símbolo e frase em tudo cria memória.', 'identidade aplicada nos 5 pontos de contato principais'],
    [1, 'essencial', 'pessoas', 'marca', 'Lançar a pesquisa de partida', 'Sem o retrato de hoje, não dá para provar a mudança depois.', 'pelo menos 30 respostas'],
    [2, 'essencial', 'valor', 'venda', 'Treinar a equipe na mensagem central e no tom de voz', 'A equipe é a marca em cada atendimento; sem discurso único, o posicionamento se perde.', 'toda conversa de venda abre com a mensagem central'],
    [2, 'ajuda', 'pessoas', 'venda', 'Cadastrar e completar o perfil da empresa no Google, nos mapas e nos marketplaces do setor', 'Quem é fácil de encontrar e comprar vende mais.', 'buscas e contatos vindos desses canais aumentam'],
    [3, 'essencial', 'valor', 'venda', 'Reescrever o modelo de proposta: recomendação primeiro, problema do cliente, impacto em dinheiro e a mensagem central', 'É na proposta que o cliente decide pagar mais pela especialização.', 'propostas fecham mais e sem pedir desconto'],
    [4, 'ajuda', 'pessoas', 'marca', 'Produzir um conteúdo para uma situação de compra específica', 'Ser lembrada em mais momentos de compra aumenta as chances de ser escolhida.', 'a marca é mais lembrada nessa situação na próxima pesquisa'],
    [5, 'essencial', 'pessoas', 'marca', 'Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba', 'O crescimento vem de conquistar mais compradores, principalmente os que compram pouco ou nunca compraram.', 'Lembrança espontânea sobe na próxima pesquisa e clientes novos aumentam'],
    [6, 'essencial', 'vendas', 'venda', 'Revisão semestral: o que manter, o que cortar', 'Rever se as condições da estratégia continuam verdadeiras antes de dobrar a aposta.', 'estratégia revista e próximos 6 meses definidos'],
    [7, 'ajuda', 'pessoas', 'marca', 'Segunda rodada da pesquisa de marca', 'Comparar com a partida mostra se a marca está sendo mais lembrada.', 'pelo menos 30 respostas'],
    [8, 'ajuda', 'vendas', 'venda', 'Pedir indicações de forma direta, dizendo que tipo de cliente a empresa procura', 'Cliente satisfeito traz cliente parecido, e custa menos que mídia.', 'clientes novos vindos de indicação'],
    [10, 'ajuda', 'pessoas', 'marca', 'Nova campanha de alcance, com os mesmos ativos da primeira', 'Consistência: repetir a mesma cor, símbolo e frase fortalece a memória.', 'lembrança espontânea sobe'],
    [12, 'essencial', 'vendas', 'venda', 'Revisão anual e plano do segundo ano', 'Um ano de dados mostra o que funcionou; o segundo ano aposta nisso.', 'plano do segundo ano aprovado'],
    [13, 'ajuda', 'pessoas', 'marca', 'Pesquisa de marca de 12 meses', 'O retrato de um ano depois, para comparar com a partida.', 'pelo menos 30 respostas'],
    [15, 'ajuda', 'valor', 'venda', 'Refazer a tabela de preços a partir do valor que cada serviço gera para o cliente', 'Marca mais forte sustenta preço maior; o preço precisa acompanhar.', 'ticket médio sobe sem perder fechamento'],
    [18, 'essencial', 'vendas', 'marca', 'Chegada: comparar com o ponto de partida', 'Fechar o ciclo com os números e a pesquisa lado a lado.', 'relatório final apresentado'],
  ];
  window.GangPresets.modelos = {
    servicos: { nome: 'Serviços (consultórios, escritórios, prestadores)', acoes: BASE.concat([
      [3, 'ajuda', 'valor', 'marca', 'Publicar o método ou processo da empresa', 'Mostrar o método transforma promessa em prova.', 'contatos que citam o método'],
      [9, 'ajuda', 'valor', 'marca', 'Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números', 'Prova concreta faz o cliente aceitar pagar mais.', '3 casos publicados'],
    ]) },
    varejo: { nome: 'Varejo e lojas', acoes: BASE.concat([
      [2, 'essencial', 'pessoas', 'marca', 'Trocar a fachada / ambiente para a nova identidade', 'A fachada é o primeiro contato: muda a percepção na hora.', 'clientes comentam a fachada nova'],
      [9, 'ajuda', 'vendas', 'venda', 'Planejar uma campanha para as datas e épocas em que o cliente mais compra, com a linguagem da marca', 'Aproveitar os picos de compra sem perder a cara da marca.', 'vendas da data acima do ano anterior'],
    ]) },
    b2b: { nome: 'Indústria e B2B', acoes: BASE.concat([
      [3, 'ajuda', 'valor', 'venda', 'Apresentação comercial e catálogo novos', 'O comprador B2B compara materiais: o seu precisa parecer o especialista.', 'reuniões que viram proposta'],
      [9, 'ajuda', 'pessoas', 'marca', 'Participar de uma feira ou evento do setor com os ativos da marca', 'Ser visto por quem ainda não compra de você, no momento em que o setor compara fornecedores.', 'contatos novos qualificados'],
    ]) },
  };

  // modelos de mais setores e reforços nos que já existiam: só o mês, o peso e o título; promessa, esforço, porquê e sucesso vêm da biblioteca
  const daBiblioteca = ([mes, peso, t]) => { const x = window.GangPresets.acoes.find((a) => a.texto === t); if (!x) throw new Error("Ação do modelo fora da biblioteca: " + t); return [mes, peso, x.promessa, x.esforco, t, x.porque, x.metrica]; };
  Object.assign(window.GangPresets.modelos, {
    saude: { nome: "Saúde (clínicas, consultórios e terapias)", acoes: BASE.concat([[2, "essencial", "Enviar lembrete da consulta 24 horas antes, com endereço, preparo e o que levar"], [3, "ajuda", "Publicar a formação e a especialidade de cada profissional em linguagem simples"], [4, "ajuda", "Gravar vídeos de 1 minuto respondendo às perguntas que mais chegam no WhatsApp"], [8, "ajuda", "Marcar o próximo atendimento antes de o cliente ir embora"], [9, "ajuda", "Ampliar o horário ou os dias de atendimento nos períodos em que o cliente mais procura"], [11, "ajuda", "Escrever as promessas do atendimento que todo cliente deve sentir e conferir uma por semana"]].map(daBiblioteca)) },
    alimentacao: { nome: "Alimentação (restaurantes, cafés e delivery)", acoes: BASE.concat([[2, "essencial", "Fotografar os 10 itens mais vendidos no mesmo estilo e usar em todos os canais"], [3, "essencial", "Revisar o cardápio: destacar os itens de maior margem e tirar os que quase ninguém pede"], [4, "ajuda", "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo"], [5, "ajuda", "Aplicar os ativos da marca na embalagem e na sacola, do mesmo jeito em todas"], [8, "ajuda", "Garantir que o produto ou a agenda não falte nos períodos de pico"], [10, "ajuda", "Criar uma série fixa nas redes: mesmo dia, mesmo formato e a mesma abertura"]].map(daBiblioteca)) },
    loja_online: { nome: "Loja online (e-commerce e venda direta)", acoes: BASE.concat([[2, "essencial", "Reduzir a compra no site ao menor número de etapas e testar no celular"], [2, "ajuda", "Mostrar prazo de entrega, frete e política de troca antes do carrinho"], [3, "ajuda", "Mandar mensagem de carrinho abandonado em até 1 hora, oferecendo ajuda, e não desconto"], [4, "ajuda", "Escrever uma página para cada serviço usando o nome que o cliente digita na busca"], [8, "ajuda", "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo"], [11, "ajuda", "Testar uma ação com metade da base e comparar com a metade que não recebeu"]].map(daBiblioteca)) },
    educacao: { nome: "Educação (cursos, escolas e treinamentos)", acoes: BASE.concat([[3, "essencial", "Oferecer uma aula ou amostra gratuita, com data marcada, para quem ainda não é aluno"], [4, "ajuda", "Publicar resultados reais de ex-alunos ou ex-clientes, com autorização"], [5, "ajuda", "Gravar vídeos de 1 minuto respondendo às perguntas que mais chegam no WhatsApp"], [8, "ajuda", "Trocar a urgência inventada por um limite real e honesto: agenda, lote ou turma"], [11, "ajuda", "Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar"]].map(daBiblioteca)) },
    beleza: { nome: "Beleza e estética (salões, clínicas de estética e barbearias)", acoes: BASE.concat([[2, "essencial", "Fotografar antes e depois sempre com a mesma luz e o mesmo ângulo, com autorização"], [3, "essencial", "Marcar o próximo atendimento antes de o cliente ir embora"], [4, "ajuda", "Criar um pacote que junte o serviço principal a um complemento, por menos do que os dois separados"], [8, "ajuda", "Criar uma série fixa nas redes: mesmo dia, mesmo formato e a mesma abertura"], [10, "ajuda", "Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar"]].map(daBiblioteca)) },
    tecnologia: { nome: "Tecnologia e assinatura (software, apps e serviços recorrentes)", acoes: BASE.concat([[2, "essencial", "Medir em quantos dias o cliente novo chega ao primeiro resultado e encurtar esse caminho"], [3, "ajuda", "Oferecer teste gratuito com acompanhamento nos primeiros 7 dias"], [4, "ajuda", "Anunciar o ano todo para quem não está comprando agora: a maioria do mercado só vai comprar mais tarde"], [5, "ajuda", "Publicar toda semana no LinkedIn da empresa e dos sócios, sempre com os mesmos ativos da marca"], [8, "ajuda", "Mapear em cada venda B2B quem decide, quem usa, quem paga e quem pode barrar, e falar com cada um"], [11, "ajuda", "Fazer um levantamento do setor e divulgar os números para clientes, imprensa e redes"]].map(daBiblioteca)) },
  });
  window.GangPresets.modelos.servicos.acoes.push(...[[4, "ajuda", "Trocar propostas feitas sem conversa por um diagnóstico curto, pago ou agendado, antes de orçar"], [7, "ajuda", "Dizer ao cliente indeciso o que você recomendaria no lugar dele, e por quê"], [11, "ajuda", "Testar os ativos com 30 pessoas: quantas ligam cada um à marca e quantas ligam a outra empresa"]].map(daBiblioteca));
  window.GangPresets.modelos.varejo.acoes.push(...[[3, "ajuda", "Listar todos os lugares onde o cliente poderia comprar e marcar onde a empresa ainda não está"], [8, "ajuda", "Garantir que o produto ou a agenda não falte nos períodos de pico"], [11, "ajuda", "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo"]].map(daBiblioteca));
  window.GangPresets.modelos.b2b.acoes.push(...[[2, "ajuda", "Anunciar o ano todo para quem não está comprando agora: a maioria do mercado só vai comprar mais tarde"], [4, "ajuda", "Mapear em cada venda B2B quem decide, quem usa, quem paga e quem pode barrar, e falar com cada um"], [7, "ajuda", "Escolher 20 empresas-alvo e montar uma abordagem sob medida para cada uma"]].map(daBiblioteca));
  window.GangPresets.modelos.servicos.acoes.push(...[[5, "ajuda", "Combinar com o cliente, antes de falar de preço, os objetivos e como o sucesso será medido"], [13, "ajuda", "Desenhar o mapa do serviço: o que o cliente vê, o que acontece por trás e onde costuma falhar"]].map(daBiblioteca));
  window.GangPresets.modelos.varejo.acoes.push(...[[4, "ajuda", "Treinar a equipe da loja a abordar com uma pergunta útil, e não com \"posso ajudar?\""], [14, "ajuda", "Calcular a margem de cada serviço ou produto e concentrar a comunicação nos mais lucrativos"]].map(daBiblioteca));
  window.GangPresets.modelos.b2b.acoes.push(...[[5, "ajuda", "Montar um material para o contato interno convencer os outros decisores da empresa dele"], [10, "ajuda", "Fazer uma revisão de resultados a cada trimestre com cada cliente grande"]].map(daBiblioteca));
  window.GangPresets.modelos.saude.acoes.push(...[[1, "ajuda", "Explicar o tratamento ou o serviço em etapas, com prazos e custos por escrito, antes de começar"]].map(daBiblioteca));
  window.GangPresets.modelos.alimentacao.acoes.push(...[[6, "ajuda", "Ter um item que só a casa tem e colocá-lo em destaque em todos os canais"]].map(daBiblioteca));
  window.GangPresets.modelos.educacao.acoes.push(...[[4, "ajuda", "Acompanhar de perto o cliente nas 2 primeiras semanas, quando o risco de desistência é maior"]].map(daBiblioteca));
  window.GangPresets.modelos.tecnologia.acoes.push(...[[7, "ajuda", "Avisar o cliente que está usando pouco o serviço e oferecer ajuda antes que ele cancele"]].map(daBiblioteca));
  window.GangPresets.modelos.loja_online.acoes.push(...[[6, "ajuda", "Anunciar de novo para quem visitou o site ou falou com a empresa e não comprou"]].map(daBiblioteca));
  window.GangPresets.modelos.beleza.acoes.push(...[[6, "ajuda", "Agradecer por escrito cada indicação recebida e contar o que aconteceu com ela"]].map(daBiblioteca));
  window.GangPresets.modelos.servicos.acoes.push(...[[6, "ajuda", "Combinar por escrito, no início, o que a empresa faz, o que o cliente faz e como os dois vão saber que deu certo"], [8, "ajuda", "Listar as 5 objeções mais comuns e escrever uma resposta curta e honesta para cada uma"]].map(daBiblioteca));
  window.GangPresets.modelos.varejo.acoes.push(...[[5, "ajuda", "Montar o catálogo no WhatsApp Business com fotos, preços e descrição de cada serviço ou produto"], [10, "ajuda", "Fazer degustação, demonstração ou teste no ponto de venda"]].map(daBiblioteca));
  window.GangPresets.modelos.b2b.acoes.push(...[[6, "ajuda", "Pedir uma conversa por ano com o dono ou o diretor de cada cliente B2B importante"], [12, "ajuda", "Publicar uma vez por mês uma opinião forte da empresa sobre um tema do setor"]].map(daBiblioteca));
  window.GangPresets.modelos.saude.acoes.push(...[[5, "ajuda", "Revisar o ambiente onde o cliente espera e é atendido: limpeza, luz, som, conforto e a marca à vista"]].map(daBiblioteca));
  window.GangPresets.modelos.alimentacao.acoes.push(...[[4, "ajuda", "Montar o catálogo no WhatsApp Business com fotos, preços e descrição de cada serviço ou produto"], [9, "ajuda", "Fazer degustação, demonstração ou teste no ponto de venda"]].map(daBiblioteca));
  window.GangPresets.modelos.loja_online.acoes.push(...[[3, "ajuda", "Garantir que quem procura o nome da marca encontre a empresa em primeiro lugar"]].map(daBiblioteca));
  window.GangPresets.modelos.educacao.acoes.push(...[[6, "ajuda", "Criar um programa de indicação com benefício para quem indica e para quem chega"]].map(daBiblioteca));
  window.GangPresets.modelos.beleza.acoes.push(...[[5, "ajuda", "Descobrir de quanto em quanto tempo o cliente volta a comprar e lembrá-lo perto da data"]].map(daBiblioteca));
  window.GangPresets.modelos.tecnologia.acoes.push(...[[5, "ajuda", "Listar as 5 objeções mais comuns e escrever uma resposta curta e honesta para cada uma"]].map(daBiblioteca));
  window.GangPresets.modelos.servicos.acoes.push(...[[9, "ajuda", "Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado"]].map(daBiblioteca));
  window.GangPresets.modelos.saude.acoes.push(...[[4, "ajuda", "Permitir agendar ou pedir online a qualquer hora do dia"], [10, "ajuda", "Oferecer uma condição melhor nos horários e dias de pouco movimento"]].map(daBiblioteca));
  window.GangPresets.modelos.beleza.acoes.push(...[[3, "ajuda", "Permitir agendar ou pedir online a qualquer hora do dia"], [9, "ajuda", "Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado"]].map(daBiblioteca));
  window.GangPresets.modelos.varejo.acoes.push(...[[7, "ajuda", "Criar uma marca sensorial no espaço: um cheiro, uma música ou um material que seja sempre o mesmo"]].map(daBiblioteca));
  window.GangPresets.modelos.b2b.acoes.push(...[[9, "ajuda", "Montar um conselho com 5 clientes que se reúne a cada semestre para opinar"]].map(daBiblioteca));
  window.GangPresets.modelos.tecnologia.acoes.push(...[[6, "ajuda", "Ensinar o cliente a ficar melhor naquilo que ele quer fazer com o produto ou serviço"]].map(daBiblioteca));
  window.GangPresets.modelos.educacao.acoes.push(...[[8, "ajuda", "Ensinar o cliente a ficar melhor naquilo que ele quer fazer com o produto ou serviço"]].map(daBiblioteca));
  window.GangPresets.modelos.servicos.acoes.push(...[[12, "ajuda", "Fazer uma vez por ano a auditoria da marca: tudo o que ela diz e faz, comparado com o que os clientes percebem"]].map(daBiblioteca));
  window.GangPresets.modelos.loja_online.acoes.push(...[[2, "ajuda", "Deixar o botão de contato ou de compra sempre visível no celular, em todas as páginas"]].map(daBiblioteca));
  window.GangPresets.modelos.b2b.acoes.push(...[[14, "ajuda", "Calcular quais clientes dão lucro e quais dão prejuízo, contando o tempo gasto com cada um"]].map(daBiblioteca));
  const P0 = window.GangPresets;
  // toda medida de sucesso começa com letra maiúscula
  const maiuscula = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
  P0.acoes.forEach((x) => { x.metrica = maiuscula(x.metrica); });
  P0.metricasSucesso.forEach((x) => { x.texto = maiuscula(x.texto); });
  Object.values(P0.modelos || {}).forEach((m) => m.acoes.forEach((x) => { x[6] = maiuscula(x[6]); }));
  // toda métrica sugerida por uma ação também existe na lista "Sucesso se" (no grupo do mesmo autor)
  const P = window.GangPresets;
  P.acoes.forEach((x) => { if (x.metrica && !P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: x.grupo, texto: x.metrica }); });

  // ===== Modelo de ações para cada foco do mês (só ações da biblioteca) =====
  // promessa: qual parte da promessa o foco move (o veredito sugere o foco por ela)
  window.GangPresets.modelosFoco = {
    "Ser lembrada em mais situações de compra.": { promessa: "pessoas", acoes: ["Produzir um conteúdo para uma situação de compra específica", "Responder no site as 5 perguntas que todo cliente faz, inclusive o preço", "Planejar uma campanha para as datas e épocas em que o cliente mais compra, com a linguagem da marca", "Colocar os ativos da marca na pesquisa e mandar para pelo menos 30 pessoas", "Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba"] },
    "Chegar a quem ainda não é cliente.": { promessa: "pessoas", acoes: ["Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba", "Configurar os anúncios para alcance, com limite de frequência por pessoa", "Levar uma história da empresa para a imprensa local ou para a mídia do setor", "Participar de uma feira ou evento do setor com os ativos da marca", "Dar uma palestra ou aula aberta sobre o tema da empresa em um evento do setor"] },
    "Usar os ativos distintivos em tudo o que sair.": { promessa: "pessoas", acoes: ["Criar um bordão ou personagem próprio e usar em todos os anúncios", "Reeditar os vídeos e anúncios para a marca aparecer nos 3 primeiros segundos", "Cobrir o logo das peças e testar se ainda dá para saber que são da marca", "Criar uma vinheta sonora curta e usar no início e no fim de todos os vídeos", "Padronizar WhatsApp Business, assinatura de e-mail e modelos de documentos com a identidade da marca"] },
    "Manter a marca presente todo mês, sem pausas.": { promessa: "pessoas", acoes: ["Montar o calendário de comunicação dos próximos 6 meses", "Escrever e enviar para a base de clientes uma mensagem útil (dica, novidade ou caso), sem vender", "Adaptar a campanha ao formato e ao uso de cada rede, mantendo os mesmos ativos da marca", "Configurar os anúncios para alcance, com limite de frequência por pessoa"] },
    "Equilibrar marca e vendas no plano do mês.": { promessa: "vendas", acoes: ["Montar o calendário de comunicação dos próximos 6 meses", "Escrever o objetivo da próxima campanha em números de negócio (vendas, clientes ou preço), não em curtidas", "Calcular a perda provável de vendas por ficar sem anunciar, antes de qualquer corte na verba de marca", "Anunciar no Google para quem já está buscando o serviço"] },
    "Fazer a marca ser lembrada antes da compra.": { promessa: "pessoas", acoes: ["Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba", "Produzir uma peça emocional de marca (história, causa ou cliente real)", "Planejar uma campanha para as datas e épocas em que o cliente mais compra, com a linguagem da marca", "Produzir um conteúdo para uma situação de compra específica", "Gravar um vídeo de 2 minutos apresentando a equipe e o jeito de trabalhar"] },
    "Levar a nova marca para a proposta comercial.": { promessa: "valor", acoes: ["Reescrever o modelo de proposta: recomendação primeiro, problema do cliente, impacto em dinheiro e a mensagem central", "Montar um kit de conteúdos (vídeo, caso, perguntas frequentes) para mandar antes da reunião", "Criar um comparativo de uma página: a empresa e o concorrente principal, lado a lado", "Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada", "Reunir no site e nas propostas as provas de credibilidade: anos de mercado, clientes atendidos, certificações e garantias"] },
    "Colocar a mensagem central em todo atendimento.": { promessa: "valor", acoes: ["Treinar a equipe na mensagem central e no tom de voz", "Mandar o guia de tom de voz para todos que escrevem ou atendem pela empresa", "Escrever em uma página o passo a passo do atendimento e treinar a equipe nele", "Definir quem responde os contatos e criar respostas prontas para responder em até 1 hora", "Fazer o teste do cliente oculto no próprio atendimento: telefone, WhatsApp e site"] },
    "Medir: enviar os números e rodar a pesquisa.": { promessa: "vendas", acoes: ["Incluir a pergunta \"como nos conheceu?\" no atendimento e na ficha do cliente", "Criar e enviar uma pesquisa curta aos clientes atendidos recentemente: nota de 0 a 10 e um porquê", "Colocar os ativos da marca na pesquisa e mandar para pelo menos 30 pessoas", "Medir a base de clientes dos últimos 3 anos: quantos compraram uma única vez e quantos voltaram", "Perguntar a 10 clientes quais 3 palavras descrevem a empresa e comparar com o que a marca quer"] },
    "Aplicar a nova identidade em todos os pontos de contato.": { promessa: "pessoas", acoes: ["Padronizar WhatsApp Business, assinatura de e-mail e modelos de documentos com a identidade da marca", "Trocar a fachada / ambiente para a nova identidade", "Atualizar redes sociais com a nova identidade", "Aplicar a identidade em papelaria, uniforme e veículos", "Criar um brinde útil, do dia a dia, com os ativos da marca para entregar aos clientes"] },
    "Falar sempre no tom de voz da marca.": { promessa: "valor", acoes: ["Mandar o guia de tom de voz para todos que escrevem ou atendem pela empresa", "Treinar a equipe na mensagem central e no tom de voz", "Revisar o site e os anúncios trocando adjetivos por fatos e números", "Perguntar a 10 clientes quais 3 palavras descrevem a empresa e comparar com o que a marca quer"] },
    "Alcançar quem compra pouco ou nunca comprou.": { promessa: "pessoas", acoes: ["Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba", "Configurar os anúncios para alcance, com limite de frequência por pessoa", "Cadastrar e completar o perfil da empresa no Google, nos mapas e nos marketplaces do setor", "Anunciar no Google para quem já está buscando o serviço", "Montar uma rede de parceiros que atendem o mesmo cliente e trocar indicações"] },
    "Ficar fácil de encontrar e de comprar.": { promessa: "vendas", acoes: ["Cadastrar e completar o perfil da empresa no Google, nos mapas e nos marketplaces do setor", "Revisar o caminho de compra e cortar etapas: botão de WhatsApp, orçamento em 24h, Pix e cartão", "Definir quem responde os contatos e criar respostas prontas para responder em até 1 hora", "Anunciar no Google para quem já está buscando o serviço", "Responder no site as 5 perguntas que todo cliente faz, inclusive o preço"] },
    "Ser reconhecida mesmo sem o logo.": { promessa: "pessoas", acoes: ["Cobrir o logo das peças e testar se ainda dá para saber que são da marca", "Criar um bordão ou personagem próprio e usar em todos os anúncios", "Criar uma vinheta sonora curta e usar no início e no fim de todos os vídeos", "Reeditar os vídeos e anúncios para a marca aparecer nos 3 primeiros segundos", "Colocar os ativos da marca na pesquisa e mandar para pelo menos 30 pessoas"] },
    "Criar emoção e lembrança, não só oferta.": { promessa: "valor", acoes: ["Produzir uma peça emocional de marca (história, causa ou cliente real)", "Contar a história de origem da empresa em um texto e um vídeo", "Escrever o roteiro da marca: o cliente é o herói, a marca é o guia", "Usar fotos de clientes reais com quem o público se identifica, e da equipe, no lugar de bancos de imagem", "Gravar um vídeo de 2 minutos apresentando a equipe e o jeito de trabalhar"] },
    "Escrever o objetivo da campanha em números de negócio.": { promessa: "vendas", acoes: ["Escrever o objetivo da próxima campanha em números de negócio (vendas, clientes ou preço), não em curtidas", "Mostrar o anúncio a 5 pessoas do público antes de rodar e conferir se entendem a mensagem e lembram da marca", "Testar duas versões do anúncio ou da página, com a métrica decidida antes", "Calcular a perda provável de vendas por ficar sem anunciar, antes de qualquer corte na verba de marca"] },
    "Entregar a promessa em cada atendimento.": { promessa: "valor", acoes: ["Escrever em uma página o passo a passo do atendimento e treinar a equipe nele", "Escrever a mensagem de boas-vindas pós-compra, explicando os próximos passos", "Criar um ritual marcante na entrega (embalagem, boas-vindas, encerramento)", "Criar uma regra para reclamações: responder no mesmo dia e resolver em até 48 horas", "Fazer o teste do cliente oculto no próprio atendimento: telefone, WhatsApp e site"] },
    "Fazer a equipe entender e viver a marca.": { promessa: "valor", acoes: ["Treinar a equipe na mensagem central e no tom de voz", "Fazer uma reunião com a equipe para mostrar os resultados da marca e os elogios de clientes", "Apresentar as campanhas para a equipe antes de irem ao ar, explicando o que a marca quer dizer", "Incluir os valores da marca no processo de contratação", "Mandar o guia de tom de voz para todos que escrevem ou atendem pela empresa"] },
    "Mostrar o valor antes do preço.": { promessa: "valor", acoes: ["Tirar o preço como mensagem principal dos anúncios e mostrar o que a empresa faz melhor", "Reescrever o modelo de proposta: recomendação primeiro, problema do cliente, impacto em dinheiro e a mensagem central", "Reescrever o site: abrir pelo que só você entrega, na linguagem do cliente", "Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada", "Revisar o site e os anúncios trocando adjetivos por fatos e números"] },
    "Proteger o preço: desconto só com regra e em troca de algo.": { promessa: "valor", acoes: ["Escrever a política de descontos: quando, quanto e em troca de quê", "Refazer a tabela de preços a partir do valor que cada serviço gera para o cliente", "Criar uma garantia clara, por escrito, que tira o risco do cliente", "Criar uma versão premium do serviço principal", "Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada"] },
    "Provar com casos e números o que a empresa entrega.": { promessa: "valor", acoes: ["Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números", "Coletar e publicar depoimentos com nomes e números reais", "Reunir no site e nas propostas as provas de credibilidade: anos de mercado, clientes atendidos, certificações e garantias", "Publicar o método ou processo da empresa", "Revisar o site e os anúncios trocando adjetivos por fatos e números"] },
    "Transformar clientes satisfeitos em avaliações e indicações.": { promessa: "pessoas", acoes: ["Pedir avaliação no Google aos clientes satisfeitos recentes e deixar o link pronto para os próximos", "Pedir indicações de forma direta, dizendo que tipo de cliente a empresa procura", "Responder todas as avaliações atuais, inclusive as negativas, e definir quem responde as novas", "Coletar e publicar depoimentos com nomes e números reais", "Montar uma rede de parceiros que atendem o mesmo cliente e trocar indicações"] },
    "Cuidar do pós-venda: o cliente que volta e indica.": { promessa: "vendas", acoes: ["Ligar para os clientes atendidos há cerca de 30 dias", "Enviar aos clientes atuais um resumo do que foi entregue e do resultado", "Escrever a mensagem de boas-vindas pós-compra, explicando os próximos passos", "Mandar um presente surpresa e personalizado para os melhores clientes, sem pedir nada em troca", "Fazer reunião de balanço com os clientes que concluíram projetos recentemente: o que funcionou e o que melhorar"] },
    "Ouvir o cliente: rodar a pesquisa de marca do semestre.": { promessa: "pessoas", acoes: ["Colocar os ativos da marca na pesquisa e mandar para pelo menos 30 pessoas", "Criar e enviar uma pesquisa curta aos clientes atendidos recentemente: nota de 0 a 10 e um porquê", "Perguntar a 10 clientes quais 3 palavras descrevem a empresa e comparar com o que a marca quer", "Entrevistar 10 clientes que escolheram o concorrente: por que não a sua empresa"] },
    "Entender por que quem não comprou escolheu outro.": { promessa: "vendas", acoes: ["Entrevistar 10 clientes que escolheram o concorrente: por que não a sua empresa", "Criar um comparativo de uma página: a empresa e o concorrente principal, lado a lado", "Fazer o teste do cliente oculto no próprio atendimento: telefone, WhatsApp e site", "Fazer reunião de balanço com os clientes que concluíram projetos recentemente: o que funcionou e o que melhorar"] },
  };


  // focos novos (biblioteca ampliada)
  window.GangPresets.focos.push({"grupo": "Sharp & Romaniuk", "texto": "Estar à venda em mais lugares e horários."}, {"grupo": "Sharp & Romaniuk", "texto": "Ligar a marca às situações de compra certas."}, {"grupo": "Sharp & Romaniuk", "texto": "Fortalecer os ativos que fazem a marca ser reconhecida."}, {"grupo": "Binet & Field", "texto": "Investir na mídia do jeito que faz a marca crescer."}, {"grupo": "Vendas", "texto": "Vencer a indecisão do cliente e fechar mais."}, {"grupo": "Preço", "texto": "Cobrar o preço certo e proteger a margem."}, {"grupo": "Serviço", "texto": "Resolver bem quando algo dá errado."}, {"grupo": "Serviço", "texto": "Trazer de volta quem já comprou."}, {"grupo": "Medição", "texto": "Medir com método e comparar do jeito certo."}, {"grupo": "B2B", "texto": "Ser lembrada pelas empresas antes de elas comprarem."});
  Object.assign(window.GangPresets.modelosFoco, {
    "Estar à venda em mais lugares e horários.": { promessa: "pessoas", acoes: ["Listar todos os lugares onde o cliente poderia comprar e marcar onde a empresa ainda não está", "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo", "Ampliar o horário ou os dias de atendimento nos períodos em que o cliente mais procura", "Garantir que o produto ou a agenda não falte nos períodos de pico"] },
    "Ligar a marca às situações de compra certas.": { promessa: "pessoas", acoes: ["Listar as 10 situações em que alguém precisa do que a empresa vende: quando, onde, com quem e por quê", "Ligar a marca às 3 situações de compra mais frequentes em toda a comunicação do semestre", "Revisar as peças do último mês: quantas citam uma situação de compra, e não só o produto", "Produzir um conteúdo para uma situação de compra específica"] },
    "Fortalecer os ativos que fazem a marca ser reconhecida.": { promessa: "pessoas", acoes: ["Fazer o inventário dos ativos da marca: o que existe, onde aparece e com que frequência", "Testar os ativos com 30 pessoas: quantas ligam cada um à marca e quantas ligam a outra empresa", "Escrever as regras de uso dos 2 ativos mais fortes e não mudar nada neles por 12 meses", "Cobrir o logo das peças e testar se ainda dá para saber que são da marca"] },
    "Investir na mídia do jeito que faz a marca crescer.": { promessa: "pessoas", acoes: ["Dividir a verba do ano entre construir a marca e gerar vendas imediatas, com cerca de 60% para marca", "Calcular a fatia de voz da marca e manter o investimento acima da fatia de mercado", "Manter anúncios no ar todos os meses, com menos verba por mês, em vez de picos com meses parados", "Manter a mesma ideia de campanha por pelo menos 2 anos, variando só as peças"] },
    "Vencer a indecisão do cliente e fechar mais.": { promessa: "vendas", acoes: ["Dizer ao cliente indeciso o que você recomendaria no lugar dele, e por quê", "Mandar ao cliente indeciso só as 2 informações que decidem, e não o catálogo inteiro", "Oferecer uma forma de diminuir o risco da primeira compra: etapa piloto, garantia ou saída combinada", "Calcular com o cliente, na primeira reunião, quanto o problema custa a ele por mês", "Registrar o motivo de cada venda perdida e revisar a lista todo mês"] },
    "Cobrar o preço certo e proteger a margem.": { promessa: "valor", acoes: ["Medir quanto foi dado de desconto no mês, em quais vendas e por quem", "Escrever a política de descontos: quando, quanto e em troca de quê", "Revisar os preços uma vez por ano com uma regra escrita, e não só quando o custo sobe", "Criar um pacote que junte o serviço principal a um complemento, por menos do que os dois separados"] },
    "Resolver bem quando algo dá errado.": { promessa: "vendas", acoes: ["Dar à equipe um valor ou uma solução que ela pode usar na hora para resolver uma reclamação, sem pedir autorização", "Criar uma regra para reclamações: responder no mesmo dia e resolver em até 48 horas", "Avisar o cliente do próximo passo e de quanto falta sempre que ele precisar esperar", "Escrever as promessas do atendimento que todo cliente deve sentir e conferir uma por semana"] },
    "Trazer de volta quem já comprou.": { promessa: "vendas", acoes: ["Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar", "Marcar o próximo atendimento antes de o cliente ir embora", "Medir a recompra: quantos clientes do ano passado voltaram a comprar neste ano", "Ligar para os clientes atendidos há cerca de 30 dias"] },
    "Medir com método e comparar do jeito certo.": { promessa: "vendas", acoes: ["Montar um painel mensal com 5 números: faturamento, clientes novos, ticket médio, recompra e lembrança", "Comparar os resultados com o mesmo período do ano anterior antes de tirar conclusões", "Testar uma ação com metade da base e comparar com a metade que não recebeu", "Entrevistar 5 clientes recentes sobre o momento em que decidiram comprar: o que estava acontecendo e o que pesou"] },
    "Ser lembrada pelas empresas antes de elas comprarem.": { promessa: "pessoas", acoes: ["Anunciar o ano todo para quem não está comprando agora: a maioria do mercado só vai comprar mais tarde", "Publicar toda semana no LinkedIn da empresa e dos sócios, sempre com os mesmos ativos da marca", "Fazer um levantamento do setor e divulgar os números para clientes, imprensa e redes", "Escolher 20 empresas-alvo e montar uma abordagem sob medida para cada uma"] },
  });

  // focos novos (2ª parte)
  window.GangPresets.focos.push({"grupo": "Pesquisa", "texto": "Entender de verdade como o cliente decide."}, {"grupo": "Preço", "texto": "Negociar sem perder margem."}, {"grupo": "Serviço", "texto": "Entregar o que a venda promete."}, {"grupo": "Publicidade", "texto": "Fazer anúncios que funcionam."}, {"grupo": "Cultura", "texto": "Dar à marca um significado que vai além do produto."}, {"grupo": "Identidade", "texto": "Cuidar dos detalhes da identidade em todo lugar."}, {"grupo": "Reputação", "texto": "Proteger a reputação da marca."}, {"grupo": "Preço", "texto": "Lucrar mais com o que já se vende."});
  Object.assign(window.GangPresets.modelosFoco, {
    "Entender de verdade como o cliente decide.": { promessa: "valor", acoes: ["Escrever o perfil de compra: o que leva a buscar, o que conta como sucesso, o que trava, quem participa e como compara", "Listar os medos que impedem o cliente de trocar de fornecedor e responder a cada um na comunicação", "Conversar com um cliente toda semana, por 15 minutos, e anotar o que aprendeu", "Comparar o que a equipe acha que o cliente quer com o que o cliente diz querer, e corrigir as diferenças"] },
    "Negociar sem perder margem.": { promessa: "valor", acoes: ["Definir, antes de cada negociação grande, o preço mínimo aceitável e o que fazer se não fechar", "Listar o que a empresa pode ceder sem baixar o preço: prazo, escopo, forma de pagamento ou extras", "Combinar com o cliente, antes de falar de preço, os objetivos e como o sucesso será medido", "Perguntar a faixa de investimento já na primeira conversa, com naturalidade"] },
    "Entregar o que a venda promete.": { promessa: "valor", acoes: ["Conferir se o que o site e a venda prometem é o que a operação consegue entregar, e alinhar os dois", "Desenhar o mapa do serviço: o que o cliente vê, o que acontece por trás e onde costuma falhar", "Medir por uma semana o tempo real de resposta aos contatos, por canal", "Reescrever as mensagens automáticas no tom de voz da marca: confirmações, avisos, cobranças e erros"] },
    "Fazer anúncios que funcionam.": { promessa: "pessoas", acoes: ["Escrever o briefing de cada campanha em uma página: o que a pessoa deve pensar, sentir e fazer", "Escrever 10 títulos diferentes para o anúncio principal antes de escolher um", "Reduzir cada anúncio a uma só ideia e cortar o resto", "Manter o anúncio que funciona no ar por mais tempo: o cansaço da equipe não é o cansaço do público", "Usar um código ou link diferente em cada canal para saber de onde vêm as vendas"] },
    "Dar à marca um significado que vai além do produto.": { promessa: "valor", acoes: ["Mapear os códigos da categoria: o que todos repetem, o que está ficando velho e o que está surgindo", "Identificar uma tensão que o cliente vive na sociedade e colocar a marca do lado dele", "Mostrar o que a escolha da marca diz sobre quem compra", "Criar algo que o cliente queira mostrar: um certificado, uma foto ou uma frase da marca"] },
    "Cuidar dos detalhes da identidade em todo lugar.": { promessa: "pessoas", acoes: ["Testar o logo bem pequeno, como ícone de celular, carimbo e bordado, e criar uma versão reduzida se precisar", "Conferir o contraste das cores da marca em textos e botões para que todos consigam ler", "Limitar a marca a 2 fontes e definir tamanhos fixos para títulos e textos", "Escrever o glossário da marca: as palavras que a marca usa e as que evita"] },
    "Proteger a reputação da marca.": { promessa: "valor", acoes: ["Combinar como responder a uma crise: quem fala, o que diz e em quanto tempo", "Acompanhar uma vez por semana o que falam da marca na internet", "Responder todas as avaliações atuais, inclusive as negativas, e definir quem responde as novas"] },
    "Lucrar mais com o que já se vende.": { promessa: "valor", acoes: ["Calcular a margem de cada serviço ou produto e concentrar a comunicação nos mais lucrativos", "Revisar o portfólio: separar o que traz clientes, o que dá lucro e o que só ocupa espaço", "Oferecer formas de pagamento que facilitem a compra sem baixar o preço: parcelas, assinatura ou entrada menor", "Calcular quanto custa conquistar um cliente e quanto ele deixa ao longo do tempo"] },
  });

  // focos novos (3ª parte)
  window.GangPresets.focos.push({"grupo": "Vendas", "texto": "Vender melhor nas conversas."}, {"grupo": "Marca", "texto": "Ganhar confiança de quem ainda não conhece a marca."}, {"grupo": "Mídia", "texto": "Ser lembrada perto do momento da compra."}, {"grupo": "Medição", "texto": "Saber de onde vem o crescimento."});
  Object.assign(window.GangPresets.modelosFoco, {
    "Vender melhor nas conversas.": { promessa: "vendas", acoes: ["Listar as 5 objeções mais comuns e escrever uma resposta curta e honesta para cada uma", "Ouvir uma conversa de venda por semana e anotar uma coisa para melhorar", "Pedir ao cliente novo um primeiro passo bem pequeno antes do compromisso maior", "Escrever o perfil do cliente ideal e os sinais de quem não é cliente para a empresa"] },
    "Ganhar confiança de quem ainda não conhece a marca.": { promessa: "pessoas", acoes: ["Admitir na comunicação uma limitação honesta da empresa, ao lado do que ela faz de melhor", "Mostrar o trabalho que o cliente não vê: o cuidado e as etapas por trás do resultado", "Inscrever a empresa em prêmios, rankings ou certificações respeitados no setor", "Fazer uma ação com outra marca respeitada pelo mesmo público"] },
    "Ser lembrada perto do momento da compra.": { promessa: "pessoas", acoes: ["Anunciar perto de onde o cliente compra: mídia de rua, rádio local ou ponto de venda", "Garantir que quem procura o nome da marca encontre a empresa em primeiro lugar", "Colocar os ativos da marca no balcão, no caixa e na entrega, onde o cliente está decidindo", "Usar o melhor conteúdo da marca como anúncio para quem ainda não segue a empresa"] },
    "Saber de onde vem o crescimento.": { promessa: "vendas", acoes: ["Separar o crescimento em três fontes: clientes novos, clientes que voltam e quanto cada um gasta", "Separar o que aumentou por causa da marca do que aumentou por causa de preço, época ou promoção", "Calcular quantas vendas uma campanha precisa trazer para se pagar, antes de lançar", "Acompanhar a cada trimestre 3 números de saúde da marca, além das vendas"] },
  });

  // focos novos (4ª parte)
  window.GangPresets.focos.push({"grupo": "Vendas", "texto": "Fazer cada cliente comprar mais vezes e mais coisas."}, {"grupo": "Medição", "texto": "Decidir com dados, e não com achismo."}, {"grupo": "Preço", "texto": "Cobrar melhor pelo que já se entrega."});
  Object.assign(window.GangPresets.modelosFoco, {
    "Fazer cada cliente comprar mais vezes e mais coisas.": { promessa: "vendas", acoes: ["Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado", "Descobrir de quanto em quanto tempo o cliente volta a comprar e lembrá-lo perto da data", "Ensinar o cliente a ficar melhor naquilo que ele quer fazer com o produto ou serviço", "Lembrar com o cliente os marcos da relação: um ano de parceria, um resultado alcançado"] },
    "Decidir com dados, e não com achismo.": { promessa: "vendas", acoes: ["Medir em que etapa as pessoas se perdem: conhecem, consideram, compram e voltam", "Medir quantos orçamentos viram venda e quanto tempo leva para fechar", "Manter um diário de testes: o que foi tentado, o que se esperava e o que aconteceu", "Anotar o que deu certo sem ter sido planejado e decidir se vira parte da estratégia"] },
    "Cobrar melhor pelo que já se entrega.": { promessa: "valor", acoes: ["Separar do preço principal os extras que hoje saem de graça e cobrar por eles", "Cobrar mais pelo atendimento urgente ou fora do horário", "Oferecer uma condição melhor nos horários e dias de pouco movimento", "Mostrar o preço em parcelas pequenas do dia ou do uso, quando fizer sentido"] },
  });

  // focos novos (5ª parte)
  window.GangPresets.focos.push({"grupo": "Comunicação", "texto": "Escrever para o cliente entender e lembrar."}, {"grupo": "Serviço", "texto": "Transformar clientes insatisfeitos em clientes que ficam."});
  Object.assign(window.GangPresets.modelosFoco, {
    "Escrever para o cliente entender e lembrar.": { promessa: "valor", acoes: ["Pedir a alguém de fora que explique o serviço com as próprias palavras e reescrever a comunicação a partir disso", "Ordenar listas de benefícios com o mais forte primeiro e o segundo mais forte por último", "Dizer sempre o que a empresa é junto com o nome: \"Lume, clínica de estética\"", "Reescrever os textos para falar com o cliente (\"você\"), e não sobre a empresa (\"nós\")"] },
    "Transformar clientes insatisfeitos em clientes que ficam.": { promessa: "vendas", acoes: ["Ligar em até 48 horas para quem deu nota baixa na pesquisa e resolver o motivo", "Criar uma regra para reclamações: responder no mesmo dia e resolver em até 48 horas", "Dar à equipe um valor ou uma solução que ela pode usar na hora para resolver uma reclamação, sem pedir autorização", "Personalizar as mensagens aos clientes com o nome e um detalhe da história de cada um"] },
  });

  // ===== Detalhes de cada ação: passos, tamanho (P/M/G), quando medir (dias), setores, o que vem antes e mensagem pronta =====
  window.GangPresets.detalhes = {
   "Padronizar WhatsApp Business, assinatura de e-mail e modelos de documentos com a identidade da marca": {
    "tam": "M",
    "ler": 30,
    "passos": [
     "Listar os modelos usados no dia a dia",
     "Aplicar logo, cores e frase da marca",
     "Trocar assinatura, perfil e modelos de todos",
     "Conferir 3 envios reais com a equipe"
    ]
   },
   "Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba": {
    "tam": "G",
    "ler": 90,
    "passos": [
     "Definir o público que ainda não compra",
     "Escolher 2 canais de alcance amplo",
     "Separar a maior parte da verba para alcance",
     "Rodar por pelo menos 4 semanas"
    ]
   },
   "Produzir um conteúdo para uma situação de compra específica": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher uma situação de compra da pesquisa",
     "Escrever o conteúdo com a dor dessa situação",
     "Publicar com a marca visível",
     "Divulgar para quem vive essa situação"
    ]
   },
   "Cadastrar e completar o perfil da empresa no Google, nos mapas e nos marketplaces do setor": {
    "tam": "P",
    "ler": 30,
    "setores": [
     "servicos",
     "varejo"
    ],
    "passos": [
     "Criar ou reivindicar o perfil no Google",
     "Completar horário, fotos, serviços e link",
     "Repetir nos mapas e marketplaces do setor",
     "Pedir as primeiras avaliações"
    ]
   },
   "Revisar o caminho de compra e cortar etapas: botão de WhatsApp, orçamento em 24h, Pix e cartão": {
    "tam": "M",
    "ler": 30,
    "setores": [
     "servicos",
     "varejo"
    ],
    "passos": [
     "Fazer a compra como se fosse cliente",
     "Anotar cada etapa que dá trabalho",
     "Cortar ou simplificar as 2 piores",
     "Colocar WhatsApp, Pix e cartão à vista"
    ]
   },
   "Montar o calendário de comunicação dos próximos 6 meses": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar datas e épocas fortes do cliente",
     "Distribuir os temas pelos 6 meses",
     "Definir canal e responsável de cada mês",
     "Revisar o calendário no encontro mensal"
    ]
   },
   "Produzir uma peça emocional de marca (história, causa ou cliente real)": {
    "tam": "G",
    "ler": 90,
    "passos": [
     "Escolher uma história real (cliente, causa ou origem)",
     "Escrever o roteiro com começo, conflito e virada",
     "Produzir com a marca nos primeiros segundos",
     "Publicar e impulsionar para quem não conhece"
    ]
   },
   "Fazer uma ação de ativação com prazo (oferta ou condição especial)": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Definir a condição e o prazo final",
     "Escrever a oferta sem esconder a marca",
     "Divulgar nos canais de quem já quer comprar",
     "Encerrar no prazo, sem prorrogar"
    ]
   },
   "Planejar a presença em anúncios para aparecer mais que os concorrentes, a partir da Biblioteca de Anúncios da Meta": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Abrir a Biblioteca de Anúncios dos concorrentes",
     "Anotar canais, frequência e mensagens deles",
     "Definir onde aparecer mais que eles",
     "Planejar a verba mês a mês"
    ]
   },
   "Reescrever o modelo de proposta: recomendação primeiro, problema do cliente, impacto em dinheiro e a mensagem central": {
    "tam": "M",
    "ler": 60,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Juntar as 3 últimas propostas enviadas",
     "Abrir pela recomendação e pelo problema do cliente",
     "Mostrar o impacto em dinheiro",
     "Revisar o modelo com o consultor"
    ]
   },
   "Treinar a equipe na mensagem central e no tom de voz": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Marcar 1 hora com toda a equipe",
     "Explicar a mensagem central e o tom de voz",
     "Treinar com 3 situações reais de atendimento",
     "Deixar a mensagem visível para consulta"
    ]
   },
   "Publicar o método ou processo da empresa": {
    "tam": "M",
    "ler": 90,
    "antes": "Dar um nome próprio ao método ou ao serviço principal",
    "passos": [
     "Desenhar as etapas do método",
     "Escrever o que acontece em cada etapa",
     "Publicar no site e nas propostas",
     "Usar o nome do método no atendimento"
    ]
   },
   "Coletar e publicar depoimentos com nomes e números reais": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher 5 clientes com resultado claro",
     "Pedir um depoimento com nome e número",
     "Pedir autorização por escrito",
     "Publicar no site, propostas e redes"
    ],
    "modelo": "Oi, [nome]! Tudo bem? Ficamos muito felizes com o resultado do seu [serviço/projeto]. Você toparia escrever duas ou três frases sobre como foi trabalhar com a gente, com o resultado que teve? Se puder, a gente publica com o seu nome. Muito obrigado!"
   },
   "Trocar a fachada / ambiente para a nova identidade": {
    "tam": "G",
    "ler": 180,
    "setores": [
     "servicos",
     "varejo"
    ],
    "passos": [
     "Levantar medidas e regras do local",
     "Aprovar o projeto com a nova identidade",
     "Contratar e acompanhar a produção",
     "Fotografar a fachada nova e divulgar"
    ]
   },
   "Atualizar redes sociais com a nova identidade": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Trocar foto de perfil, capa e bio",
     "Arquivar ou ajustar destaques antigos",
     "Publicar o anúncio da nova marca",
     "Conferir todas as redes no celular"
    ]
   },
   "Aplicar a identidade em papelaria, uniforme e veículos": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar papelaria, uniforme e veículos",
     "Aplicar a identidade em cada peça",
     "Orçar e aprovar a produção",
     "Trocar tudo de uma vez, numa data"
    ]
   },
   "Reescrever o anúncio principal para o nível de consciência do cliente": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Descobrir o quanto o cliente já sabe do problema",
     "Reescrever o título para esse nível",
     "Manter a marca visível no anúncio",
     "Comparar com o anúncio antigo por 30 dias"
    ]
   },
   "Escolher a especialidade principal e mostrá-la em tudo, sem deixar de falar com toda a categoria": {"tam": "M", "ler": 90, "setores": ["servicos", "b2b"], "passos": ["Listar os serviços que mais dão resultado", "Escolher a especialidade a mostrar", "Destacar no site, redes e propostas", "Manter a comunicação aberta a toda a categoria"]},
   "Criar um material útil em troca do contato (guia, checklist ou diagnóstico)": {
    "tam": "M",
    "ler": 60,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Escolher o formato (guia, checklist ou diagnóstico)",
     "Escrever o material resolvendo uma dor real",
     "Montar a página de troca pelo contato",
     "Divulgar e responder cada contato em 24h"
    ]
   },
   "Reescrever o site: abrir pelo que só você entrega, na linguagem do cliente": {
    "tam": "G",
    "ler": 90,
    "antes": "Escrever o roteiro da marca: o cliente é o herói, a marca é o guia",
    "passos": [
     "Escrever o que só a empresa entrega",
     "Reescrever a página inicial nessa linguagem",
     "Revisar as páginas de serviço",
     "Testar a leitura com 3 clientes"
    ]
   },
   "Responder no site as 5 perguntas que todo cliente faz, inclusive o preço": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Juntar as 5 perguntas que mais chegam",
     "Escrever respostas curtas e honestas",
     "Incluir a faixa de preço",
     "Publicar no site e linkar no WhatsApp"
    ]
   },
   "Montar um kit de conteúdos (vídeo, caso, perguntas frequentes) para mandar antes da reunião": {
    "tam": "M",
    "ler": 60,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Gravar um vídeo curto de apresentação",
     "Separar um caso e as perguntas frequentes",
     "Montar o kit num link só",
     "Enviar antes de toda reunião"
    ]
   },
   "Escrever o roteiro da marca: o cliente é o herói, a marca é o guia": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Descrever o cliente e o problema dele",
     "Mostrar a marca como guia, com empatia e prova",
     "Escrever o plano e o resultado",
     "Revisar com o consultor"
    ]
   },
   "Escrever o plano em 3 passos e a chamada principal e aplicar no site e nas peças atuais": {
    "tam": "M",
    "ler": 60,
    "antes": "Escrever o roteiro da marca: o cliente é o herói, a marca é o guia",
    "passos": [
     "Escrever o plano em 3 passos simples",
     "Definir a chamada principal",
     "Aplicar no site e nas peças atuais",
     "Usar o mesmo texto em todo canal"
    ]
   },
   "Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada": {
    "tam": "P",
    "ler": 60,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Montar 3 opções: completa, recomendada e básica",
     "Colocar a mais completa primeiro",
     "Marcar a recomendada",
     "Usar nas próximas 5 propostas"
    ]
   },
   "Fazer uma oficina de 1 hora com os sócios: o que o cliente usaria se a empresa não existisse e o que só ela faz": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Marcar 1 hora com os sócios",
     "Perguntar o que o cliente usaria sem a empresa",
     "Listar o que só a empresa faz",
     "Escrever o posicionamento em uma frase"
    ]
   },
   "Escrever em uma página o passo a passo do atendimento e treinar a equipe nele": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Descrever o atendimento do primeiro contato à entrega",
     "Escrever em uma página",
     "Treinar a equipe com casos reais",
     "Revisar depois de 30 dias"
    ]
   },
   "Criar um comparativo de uma página: a empresa e o concorrente principal, lado a lado": {
    "tam": "P",
    "ler": 60,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Escolher o concorrente principal",
     "Comparar lado a lado o que importa ao cliente",
     "Ser honesto onde o concorrente ganha",
     "Usar na proposta e na reunião"
    ]
   },
   "Publicar um manifesto curto: o que a marca defende e o que se recusa a fazer": {
    "tam": "M",
    "ler": 180,
    "antes": "Fazer uma oficina de 1 hora com os sócios: o que o cliente usaria se a empresa não existisse e o que só ela faz",
    "passos": [
     "Listar o que a marca defende",
     "Listar o que ela se recusa a fazer",
     "Escrever um manifesto de até 10 linhas",
     "Publicar no site e nas redes"
    ]
   },
   "Ligar para os clientes atendidos há cerca de 30 dias": {
    "tam": "P",
    "ler": 30,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Listar clientes atendidos há cerca de 30 dias",
     "Ligar com o roteiro pronto",
     "Anotar elogios, problemas e pedidos",
     "Resolver o que aparecer na semana"
    ],
    "modelo": "Oi, [nome]! Aqui é [seu nome], da [empresa]. Faz uns 30 dias que concluímos o seu [serviço/projeto] e queria saber: está tudo certo? Tem algo que podemos melhorar ou ajustar?"
   },
   "Escrever e enviar para a base de clientes uma mensagem útil (dica, novidade ou caso), sem vender": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escolher uma dica, novidade ou caso útil",
     "Escrever sem vender nada",
     "Enviar para toda a base de clientes",
     "Anotar quem respondeu"
    ]
   },
   "Testar duas versões do anúncio ou da página, com a métrica decidida antes": {
    "tam": "M",
    "ler": 30,
    "antes": "Reescrever o anúncio principal para o nível de consciência do cliente",
    "passos": [
     "Decidir a métrica antes de testar",
     "Criar duas versões com uma só diferença",
     "Rodar as duas com a mesma verba",
     "Ficar com a vencedora"
    ]
   },
   "Revisar o site e os anúncios trocando adjetivos por fatos e números": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Marcar os adjetivos do site e dos anúncios",
     "Trocar cada um por um fato ou número",
     "Publicar a nova versão",
     "Usar a mesma regra nas próximas peças"
    ]
   },
   "Publicar no site as situações em que a empresa é a melhor escolha": {"tam": "P", "ler": 90, "passos": ["Listar as situações de compra da pesquisa", "Escrever uma frase para cada situação", "Publicar no site", "Usar as mesmas situações nos anúncios"]},
   "Criar uma garantia clara, por escrito, que tira o risco do cliente": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar o maior medo do cliente ao comprar",
     "Escrever uma garantia que tira esse risco",
     "Validar se a empresa consegue cumprir",
     "Colocar na proposta e no site"
    ]
   },
   "Criar um bordão ou personagem próprio e usar em todos os anúncios": {
    "tam": "G",
    "ler": 180,
    "passos": [
     "Escolher bordão ou personagem com o consultor",
     "Testar com 5 pessoas do público",
     "Aplicar em todos os anúncios",
     "Não trocar por pelo menos 1 ano"
    ]
   },
   "Gravar um vídeo de 2 minutos apresentando a equipe e o jeito de trabalhar": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escrever um roteiro de 2 minutos",
     "Gravar com a equipe real",
     "Publicar no site e nas redes",
     "Usar no primeiro contato com clientes novos"
    ]
   },
   "Pedir avaliação no Google aos clientes satisfeitos recentes e deixar o link pronto para os próximos": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Listar clientes satisfeitos dos últimos 3 meses",
     "Deixar o link de avaliação pronto",
     "Enviar a mensagem pronta",
     "Repetir com todo cliente novo"
    ],
    "modelo": "Oi, [nome]! Que bom que deu tudo certo com o seu [serviço/projeto]. Você pode nos ajudar com uma avaliação no Google? Leva 1 minuto e ajuda outras pessoas a nos encontrar: [link]. Muito obrigado!"
   },
   "Pedir indicações de forma direta, dizendo que tipo de cliente a empresa procura": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Descrever o tipo de cliente que a empresa procura",
     "Escolher 10 clientes satisfeitos",
     "Pedir a indicação de forma direta",
     "Agradecer cada indicação"
    ],
    "modelo": "Oi, [nome]! Obrigado pela confiança no nosso trabalho. Estamos procurando mais clientes como você: [tipo de cliente]. Se lembrar de alguém assim, pode nos indicar? A gente cuida com o mesmo carinho."
   },
   "Montar uma rede de parceiros que atendem o mesmo cliente e trocar indicações": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar quem atende o mesmo cliente",
     "Convidar 3 parceiros para conversar",
     "Combinar como trocar indicações",
     "Rever as indicações a cada mês"
    ]
   },
   "Fazer reunião de balanço com os clientes que concluíram projetos recentemente: o que funcionou e o que melhorar": {
    "tam": "M",
    "ler": 60,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Listar projetos concluídos recentemente",
     "Marcar 30 minutos com cada cliente",
     "Perguntar o que funcionou e o que melhorar",
     "Registrar e agir no que se repetir"
    ],
    "modelo": "Oi, [nome]! Concluímos o seu [serviço/projeto] e queríamos ouvir você: podemos marcar 30 minutos para conversar sobre o que funcionou e o que podemos melhorar?"
   },
   "Criar e enviar uma pesquisa curta aos clientes atendidos recentemente: nota de 0 a 10 e um porquê": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Escrever 2 perguntas: nota de 0 a 10 e o porquê",
     "Enviar aos clientes recentes",
     "Ler todas as respostas",
     "Agir no motivo mais citado"
    ],
    "modelo": "Oi, [nome]! Pode responder duas perguntas rápidas? 1) De 0 a 10, quanto você indicaria a [empresa] para um amigo? 2) Por quê? Sua resposta nos ajuda muito a melhorar."
   },
   "Desenhar a jornada do cliente, do primeiro contato ao pós-venda, e corrigir o pior momento": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Desenhar a jornada do primeiro contato ao pós-venda",
     "Marcar o pior momento para o cliente",
     "Corrigir esse momento",
     "Medir de novo em 3 meses"
    ]
   },
   "Escrever a mensagem de boas-vindas pós-compra, explicando os próximos passos": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar os próximos passos depois da compra",
     "Escrever a mensagem de boas-vindas",
     "Enviar a todo cliente novo",
     "Ajustar com as dúvidas que aparecerem"
    ]
   },
   "Montar e ensaiar uma apresentação comercial curta, com uma ideia central": {
    "tam": "M",
    "ler": 60,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Definir a ideia central da apresentação",
     "Montar no máximo 10 telas",
     "Ensaiar com a equipe",
     "Usar nas próximas reuniões"
    ]
   },
   "Criar uma versão premium do serviço principal": {
    "tam": "M",
    "ler": 90,
    "setores": [
     "servicos",
     "varejo"
    ],
    "passos": [
     "Escolher o serviço principal",
     "Montar uma versão premium com mais entrega",
     "Definir o preço pelo valor",
     "Oferecer em toda proposta"
    ]
   },
   "Cortar um item que a empresa oferece e o cliente não valoriza, e reforçar o essencial na comunicação": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar o que a empresa oferece",
     "Marcar o que o cliente não valoriza",
     "Cortar um item",
     "Reforçar o essencial na comunicação"
    ]
   },
   "Contar a história de origem da empresa em um texto e um vídeo": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Escrever a história de origem em uma página",
     "Gravar um vídeo curto contando",
     "Publicar no site e nas redes",
     "Usar na apresentação da empresa"
    ]
   },
   "Criar um ritual marcante na entrega (embalagem, boas-vindas, encerramento)": {
    "tam": "M",
    "ler": 90,
    "setores": [
     "servicos",
     "varejo"
    ],
    "passos": [
     "Escolher o momento da entrega",
     "Criar um ritual marcante e simples",
     "Treinar a equipe",
     "Ouvir o que os clientes comentam"
    ]
   },
   "Dar um nome próprio ao método ou ao serviço principal": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar 5 opções de nome",
     "Escolher com o consultor",
     "Conferir se o nome está livre",
     "Usar em site, proposta e atendimento"
    ]
   },
   "Usar fotos de clientes reais com quem o público se identifica, e da equipe, no lugar de bancos de imagem": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Fotografar clientes reais (com autorização) e a equipe",
     "Trocar as fotos de banco",
     "Usar no site, redes e propostas",
     "Manter um banco de fotos próprio"
    ]
   },
   "Reeditar os vídeos e anúncios para a marca aparecer nos 3 primeiros segundos": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar os vídeos e anúncios atuais",
     "Reeditar com a marca nos 3 primeiros segundos",
     "Publicar as novas versões",
     "Usar a regra em todo vídeo novo"
    ]
   },
   "Incluir os valores da marca no processo de contratação": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Escrever os valores em comportamentos",
     "Incluir perguntas sobre eles na entrevista",
     "Avaliar os candidatos por eles",
     "Apresentar os valores no primeiro dia"
    ]
   },
   "Mandar o guia de tom de voz para todos que escrevem ou atendem pela empresa": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Separar o guia de tom de voz",
     "Enviar a todos que escrevem ou atendem",
     "Explicar com 3 exemplos reais",
     "Revisar mensagens depois de 2 semanas"
    ]
   },
   "Entrevistar 10 clientes que escolheram o concorrente: por que não a sua empresa": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar quem escolheu o concorrente",
     "Convidar 10 para uma conversa curta",
     "Seguir o roteiro pronto",
     "Agir no motivo que mais se repetir"
    ],
    "modelo": "Oi, [nome]! Aqui é [seu nome], da [empresa]. Sei que você escolheu outra empresa, e está tudo bem. Você toparia uma conversa de 10 minutos para eu entender o que pesou na sua escolha? Isso nos ajuda a melhorar."
   },
   "Definir quem responde os contatos e criar respostas prontas para responder em até 1 hora": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Definir quem responde cada canal",
     "Escrever respostas prontas para as 5 perguntas",
     "Combinar a meta de 1 hora",
     "Conferir o tempo de resposta toda semana"
    ]
   },
   "Anunciar no Google para quem já está buscando o serviço": {
    "tam": "M",
    "ler": 30,
    "passos": [
     "Listar o que o cliente digita ao buscar",
     "Criar a campanha com essas palavras",
     "Levar para uma página clara com contato",
     "Ajustar toda semana pelo custo por contato"
    ]
   },
   "Levar uma história da empresa para a imprensa local ou para a mídia do setor": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escolher uma história com interesse público",
     "Escrever um texto curto para a imprensa",
     "Enviar a jornalistas locais e do setor",
     "Divulgar o que for publicado"
    ]
   },
   "Participar de uma feira ou evento do setor com os ativos da marca": {
    "tam": "G",
    "ler": 90,
    "setores": [
     "b2b",
     "servicos"
    ],
    "passos": [
     "Escolher a feira ou evento certo",
     "Preparar o espaço com os ativos da marca",
     "Levar material e um jeito de captar contatos",
     "Fazer o contato com todos em até 48h"
    ]
   },
   "Planejar uma campanha para as datas e épocas em que o cliente mais compra, com a linguagem da marca": {
    "tam": "G",
    "ler": 90,
    "passos": [
     "Listar as datas em que o cliente mais compra",
     "Planejar a campanha com antecedência",
     "Manter a linguagem e os ativos da marca",
     "Comparar as vendas com o ano anterior"
    ]
   },
   "Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números": {
    "tam": "M",
    "ler": 90,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Escolher o melhor cliente com resultado em número",
     "Entrevistar o cliente",
     "Escrever problema, solução e resultado",
     "Usar no site e nas propostas"
    ]
   },
   "Organizar um encontro ou evento para clientes (aula, café, visita ou lançamento)": {
    "tam": "G",
    "ler": 90,
    "passos": [
     "Escolher o formato (aula, café, visita ou lançamento)",
     "Convidar os clientes",
     "Preparar a experiência com a marca",
     "Pedir indicações no fim"
    ]
   },
   "Fazer o teste do cliente oculto no próprio atendimento: telefone, WhatsApp e site": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Pedir a alguém de fora para ser cliente oculto",
     "Testar telefone, WhatsApp e site",
     "Anotar cada falha",
     "Corrigir as 3 piores"
    ]
   },
   "Responder todas as avaliações atuais, inclusive as negativas, e definir quem responde as novas": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Responder todas as avaliações atuais",
     "Responder as negativas com solução",
     "Definir quem responde as novas",
     "Responder em até 2 dias"
    ]
   },
   "Fazer uma reunião com a equipe para mostrar os resultados da marca e os elogios de clientes": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Juntar os resultados e os elogios da marca",
     "Marcar 30 minutos com a equipe",
     "Mostrar o que mudou",
     "Agradecer quem fez acontecer"
    ]
   },
   "Criar uma regra para reclamações: responder no mesmo dia e resolver em até 48 horas": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Definir quem cuida das reclamações",
     "Responder no mesmo dia",
     "Resolver em até 48 horas",
     "Revisar as reclamações todo mês"
    ]
   },
   "Criar um brinde útil, do dia a dia, com os ativos da marca para entregar aos clientes": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escolher um objeto útil do dia a dia",
     "Aplicar os ativos da marca",
     "Produzir uma quantidade pequena",
     "Entregar com um bilhete escrito à mão"
    ]
   },
   "Mandar um presente surpresa e personalizado para os melhores clientes, sem pedir nada em troca": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escolher os melhores clientes",
     "Escolher um presente pessoal para cada um",
     "Enviar sem pedir nada em troca",
     "Anotar quem respondeu"
    ]
   },
   "Calcular a perda provável de vendas por ficar sem anunciar, antes de qualquer corte na verba de marca": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Levantar as vendas dos meses com e sem anúncio",
     "Estimar a perda provável sem anunciar",
     "Apresentar o número antes de cortar a verba",
     "Decidir com o consultor"
    ]
   },
   "Configurar os anúncios para alcance, com limite de frequência por pessoa": {
    "tam": "P",
    "ler": 60,
    "antes": "Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba",
    "passos": [
     "Mudar o objetivo dos anúncios para alcance",
     "Definir o limite de frequência por pessoa",
     "Ampliar o público",
     "Medir alcance e lembrança"
    ]
   },
   "Cobrir o logo das peças e testar se ainda dá para saber que são da marca": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Separar 5 peças recentes",
     "Cobrir o logo de cada uma",
     "Mostrar a 5 pessoas e perguntar de quem é",
     "Reforçar o que não foi reconhecido"
    ]
   },
   "Escrever o objetivo da próxima campanha em números de negócio (vendas, clientes ou preço), não em curtidas": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escolher o número de negócio (vendas, clientes ou preço)",
     "Escrever o objetivo com prazo",
     "Registrar o ponto de partida",
     "Comparar no fim da campanha"
    ]
   },
   "Reunir no site e nas propostas as provas de credibilidade: anos de mercado, clientes atendidos, certificações e garantias": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar anos de mercado, clientes e certificações",
     "Reunir em um bloco de credibilidade",
     "Colocar no site e nas propostas",
     "Atualizar a cada 6 meses"
    ]
   },
   "Enviar aos clientes atuais um resumo do que foi entregue e do resultado": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar o que foi entregue para cada cliente",
     "Escrever o resumo com o resultado",
     "Enviar com a mensagem pronta",
     "Oferecer o próximo passo"
    ],
    "modelo": "Oi, [nome]! Fizemos um resumo do que entregamos para você: [o que foi feito]. O resultado até aqui: [resultado]. Se quiser, podemos conversar sobre o próximo passo."
   },
   "Mostrar o anúncio a 5 pessoas do público antes de rodar e conferir se entendem a mensagem e lembram da marca": {
    "tam": "P",
    "ler": 30,
    "antes": "Reescrever o anúncio principal para o nível de consciência do cliente",
    "passos": [
     "Escolher 5 pessoas do público",
     "Mostrar o anúncio por 5 segundos",
     "Perguntar o que entenderam e de quem era",
     "Ajustar antes de rodar"
    ]
   },
   "Apresentar as campanhas para a equipe antes de irem ao ar, explicando o que a marca quer dizer": {
    "tam": "P",
    "ler": 60,
    "antes": "Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba",
    "passos": [
     "Marcar 20 minutos com a equipe",
     "Mostrar as campanhas antes de irem ao ar",
     "Explicar o que a marca quer dizer",
     "Responder dúvidas da equipe"
    ]
   },
   "Tirar o preço como mensagem principal dos anúncios e mostrar o que a empresa faz melhor": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar os anúncios que vendem pelo preço",
     "Trocar a mensagem pelo que a empresa faz melhor",
     "Rodar a nova versão",
     "Comparar o ticket médio"
    ]
   },
   "Criar um grupo de clientes com um encontro marcado e espaço para eles trocarem experiências": {
    "tam": "G",
    "ler": 180,
    "setores": [
     "servicos",
     "b2b"
    ],
    "passos": [
     "Convidar os melhores clientes",
     "Criar o grupo com regras simples",
     "Marcar o primeiro encontro",
     "Manter um encontro fixo"
    ]
   },
   "Escolher influenciadores pela afinidade com a marca e com o público, não pelo número de seguidores, e deixar claro que é publicidade": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar influenciadores com afinidade",
     "Conferir se o público é o do cliente",
     "Combinar a entrega com os ativos da marca",
     "Medir pelo número de negócio"
    ]
   },
   "Adaptar a campanha ao formato e ao uso de cada rede, mantendo os mesmos ativos da marca": {
    "tam": "M",
    "ler": 60,
    "antes": "Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba",
    "passos": [
     "Listar as redes da campanha",
     "Adaptar formato e duração a cada uma",
     "Manter os mesmos ativos da marca",
     "Comparar os resultados por rede"
    ]
   },
   "Criar uma vinheta sonora curta e usar no início e no fim de todos os vídeos": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Criar a vinheta com o consultor",
     "Testar se é curta e lembrável",
     "Usar no início e no fim de todos os vídeos",
     "Não trocar por pelo menos 1 ano"
    ]
   },
   "Dar uma palestra ou aula aberta sobre o tema da empresa em um evento do setor": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escolher um evento do setor",
     "Propor um tema útil",
     "Preparar a fala com a marca",
     "Captar os contatos da plateia"
    ]
   },
   "Incluir a pergunta \"como nos conheceu?\" no atendimento e na ficha do cliente": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Incluir a pergunta no atendimento",
     "Incluir na ficha do cliente",
     "Registrar toda resposta",
     "Ler os números todo mês"
    ],
    "modelo": "Pergunta para o atendimento e para a ficha: \"Como você conheceu a [empresa]?\" (Google, indicação de alguém, redes sociais, passou em frente, outro)"
   },
   "Medir a base de clientes dos últimos 3 anos: quantos compraram uma única vez e quantos voltaram": {
    "tam": "M",
    "ler": 30,
    "passos": [
     "Exportar os clientes dos últimos 3 anos",
     "Contar quantos compraram uma única vez",
     "Contar quantos voltaram",
     "Levar os números para o encontro"
    ]
   },
   "Colocar os ativos da marca na pesquisa e mandar para pelo menos 30 pessoas": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Separar os ativos da marca",
     "Incluir na pesquisa da plataforma",
     "Mandar para pelo menos 30 pessoas",
     "Ler o resultado no encontro"
    ]
   },
   "Refazer a tabela de preços a partir do valor que cada serviço gera para o cliente": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar os serviços e o valor que geram",
     "Recalcular o preço pelo valor",
     "Testar a tabela nova em 5 propostas",
     "Ajustar e oficializar"
    ]
   },
   "Escrever a política de descontos: quando, quanto e em troca de quê": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Definir quando o desconto é permitido",
     "Definir o limite de quanto",
     "Definir o que se pede em troca",
     "Treinar quem vende"
    ]
   },
   "Perguntar a 10 clientes quais 3 palavras descrevem a empresa e comparar com o que a marca quer": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Escolher 10 clientes",
     "Pedir 3 palavras que descrevem a empresa",
     "Comparar com o que a marca quer",
     "Levar a diferença para o encontro"
    ],
    "modelo": "Oi, [nome]! Uma pergunta rápida: quais 3 palavras você usaria para descrever a [empresa]? Pode responder do jeito que vier à cabeça. Obrigado!"
   }
  };
  Object.assign(window.GangPresets.detalhes, {
   "Listar as 10 situações em que alguém precisa do que a empresa vende: quando, onde, com quem e por quê": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Perguntar a 5 clientes quando lembraram da empresa",
     "Completar: quando, onde, com quem e por quê",
     "Juntar tudo em 10 situações",
     "Marcar as 3 mais frequentes"
    ]
   },
   "Ligar a marca às 3 situações de compra mais frequentes em toda a comunicação do semestre": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Escrever uma frase para cada situação",
     "Distribuir as 3 situações no calendário",
     "Usar sempre os mesmos ativos da marca",
     "Conferir na pesquisa do semestre"
    ]
   },
   "Revisar as peças do último mês: quantas citam uma situação de compra, e não só o produto": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Juntar as peças publicadas no mês",
     "Marcar as que mostram um momento de uso",
     "Reescrever 3 que só falam do produto",
     "Repetir a conta no mês seguinte"
    ]
   },
   "Fazer o inventário dos ativos da marca: o que existe, onde aparece e com que frequência": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Juntar 20 peças recentes de todos os canais",
     "Listar cor, símbolo, frase e outros elementos",
     "Contar em quantas peças cada um aparece",
     "Marcar as variações que fogem do padrão"
    ]
   },
   "Testar os ativos com 30 pessoas: quantas ligam cada um à marca e quantas ligam a outra empresa": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Mostrar cada ativo sem o nome da marca",
     "Perguntar de qual empresa parece ser",
     "Anotar acertos e confusões com concorrentes",
     "Escolher os 2 ativos para reforçar"
    ]
   },
   "Escrever as regras de uso dos 2 ativos mais fortes e não mudar nada neles por 12 meses": {
    "tam": "P",
    "ler": 365,
    "passos": [
     "Definir tamanho, cor e posição de cada ativo",
     "Fazer 3 exemplos certos e 3 errados",
     "Mandar para quem produz peças",
     "Revisar as peças do mês contra a regra"
    ]
   },
   "Dividir a verba do ano entre construir a marca e gerar vendas imediatas, com cerca de 60% para marca": {
    "tam": "M",
    "ler": 365,
    "passos": [
     "Somar a verba de comunicação do ano",
     "Separar a parte de marca e a de oferta",
     "Distribuir as duas pelos 12 meses",
     "Conferir a divisão a cada trimestre"
    ]
   },
   "Calcular a fatia de voz da marca e manter o investimento acima da fatia de mercado": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Estimar a participação de mercado na região",
     "Contar anúncios da marca e dos concorrentes",
     "Calcular a fatia de voz da marca",
     "Ajustar a verba se ficar abaixo"
    ]
   },
   "Manter anúncios no ar todos os meses, com menos verba por mês, em vez de picos com meses parados": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Dividir a verba anual pelos 12 meses",
     "Deixar um valor mínimo fixo por mês",
     "Somar reforço nas épocas fortes",
     "Conferir se algum mês ficou parado"
    ]
   },
   "Anunciar o ano todo para quem não está comprando agora: a maioria do mercado só vai comprar mais tarde": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Definir o público de empresas que ainda não compram",
     "Criar uma mensagem de marca, sem oferta",
     "Rodar o ano todo com verba fixa",
     "Perguntar aos novos clientes se já conheciam a marca"
    ],
    "setores": [
     "b2b"
    ]
   },
   "Criar uma campanha feita para ser comentada: uma ideia que as pessoas contem a outras": {
    "tam": "G",
    "ler": 90,
    "passos": [
     "Listar 10 ideias que alguém contaria a um amigo",
     "Escolher a que é mais da cara da marca",
     "Produzir com os ativos da marca",
     "Contar menções e compartilhamentos"
    ]
   },
   "Testar o anúncio pela emoção que ele provoca, não só pela mensagem que passa": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Mostrar o anúncio a 10 pessoas do público",
     "Perguntar o que sentiram, não o que entenderam",
     "Comparar com a sensação que a marca quer",
     "Ajustar música, imagem ou ritmo"
    ]
   },
   "Manter a mesma ideia de campanha por pelo menos 2 anos, variando só as peças": {
    "tam": "P",
    "ler": 365,
    "passos": [
     "Escrever a ideia central em uma frase",
     "Definir o que muda e o que nunca muda",
     "Planejar 4 peças novas com a mesma ideia",
     "Revisar no fim do ano sem trocar a ideia"
    ]
   },
   "Mostrar prova social concreta no site e na proposta: quantos clientes, quem são e desde quando": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Contar clientes atendidos e anos de mercado",
     "Escolher 5 clientes conhecidos com autorização",
     "Colocar no topo do site e na proposta",
     "Comparar os contatos antes e depois"
    ]
   },
   "Criar um pacote que junte o serviço principal a um complemento, por menos do que os dois separados": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Ver o que os clientes costumam comprar juntos",
     "Montar o pacote com preço menor que separado",
     "Apresentar o pacote antes das opções avulsas",
     "Medir quantos escolhem o pacote"
    ]
   },
   "Trocar a urgência inventada por um limite real e honesto: agenda, lote ou turma": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Ver qual é o limite real da empresa",
     "Escrever o limite com número e data",
     "Tirar frases de urgência falsa das peças",
     "Cumprir o limite à risca"
    ]
   },
   "Pedir a 3 pessoas de fora que tentem comprar ou pedir orçamento pelo celular e cortar o que travar": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Chamar 3 pessoas que nunca compraram",
     "Pedir que comprem ou peçam orçamento sozinhas",
     "Anotar onde travaram ou desistiram",
     "Cortar ou simplificar a etapa pior"
    ]
   },
   "Calcular com o cliente, na primeira reunião, quanto o problema custa a ele por mês": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Perguntar quanto o problema acontece por mês",
     "Estimar junto com o cliente o custo de cada vez",
     "Escrever o valor mensal na proposta",
     "Comparar com o preço da solução"
    ]
   },
   "Preparar uma ideia que ensine algo novo ao cliente sobre o negócio dele e abrir as reuniões com ela": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar o que o cliente costuma subestimar",
     "Escolher um dado ou caso que prove isso",
     "Montar 3 slides ou uma fala de 5 minutos",
     "Usar na abertura das próximas reuniões"
    ]
   },
   "Dizer ao cliente indeciso o que você recomendaria no lugar dele, e por quê": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Identificar propostas paradas há 15 dias",
     "Escolher a opção que você recomendaria",
     "Escrever a recomendação com o motivo",
     "Mandar e marcar uma conversa curta"
    ],
    "modelo": "Oi, [nome]! Pensando no que você me contou sobre [problema], eu escolheria a opção [opção], porque [motivo]. Se fosse comigo, começaria por ela. Quer conversar 15 minutos para fechar os detalhes?"
   },
   "Mandar ao cliente indeciso só as 2 informações que decidem, e não o catálogo inteiro": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Ver as dúvidas que mais atrasam o fechamento",
     "Escolher as 2 informações que resolvem",
     "Montar um resumo de uma página",
     "Usar no lugar do material completo"
    ]
   },
   "Oferecer uma forma de diminuir o risco da primeira compra: etapa piloto, garantia ou saída combinada": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Ver o que o cliente teme perder",
     "Escolher piloto, garantia ou saída combinada",
     "Escrever as regras com clareza",
     "Oferecer nas propostas paradas"
    ]
   },
   "Mapear em cada venda B2B quem decide, quem usa, quem paga e quem pode barrar, e falar com cada um": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar as vendas em andamento",
     "Anotar quem decide, usa, paga e pode barrar",
     "Marcar quem ainda não foi ouvido",
     "Agendar uma conversa com cada um"
    ],
    "setores": [
     "b2b"
    ]
   },
   "Registrar o motivo de cada venda perdida e revisar a lista todo mês": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Criar uma lista simples de motivos",
     "Perguntar ao cliente por que não fechou",
     "Anotar cada perda com o motivo",
     "Revisar o motivo mais comum no fim do mês"
    ],
    "modelo": "Oi, [nome]! Tudo certo seguir com outra opção. Para a gente melhorar, você pode me dizer em uma frase o que pesou na decisão? Ajuda muito. Obrigado!"
   },
   "Trocar propostas feitas sem conversa por um diagnóstico curto, pago ou agendado, antes de orçar": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Definir o que o diagnóstico entrega",
     "Escolher se é pago ou uma reunião marcada",
     "Explicar o motivo a quem pede orçamento",
     "Comparar a taxa de fechamento"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Medir quanto foi dado de desconto no mês, em quais vendas e por quem": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Listar as vendas do mês com preço cheio e cobrado",
     "Calcular o desconto de cada uma",
     "Ver quem deu e por qual motivo",
     "Definir um teto para o mês seguinte"
    ]
   },
   "Revisar os preços uma vez por ano com uma regra escrita, e não só quando o custo sobe": {
    "tam": "M",
    "ler": 365,
    "passos": [
     "Marcar a data anual da revisão",
     "Juntar custo, concorrência e valor percebido",
     "Definir o novo preço de cada serviço",
     "Avisar os clientes com antecedência"
    ]
   },
   "Avisar o aumento de preço com antecedência, explicando o motivo e o que melhorou": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Definir o novo preço e a data",
     "Escrever o motivo e o que melhorou",
     "Avisar com pelo menos 30 dias",
     "Acompanhar quem pede para conversar"
    ],
    "modelo": "Oi, [nome]! Queria te avisar com antecedência: a partir de [data], o valor de [serviço] passa a ser [novo valor]. Nesse período, a gente [o que melhorou]. Se quiser conversar sobre isso, é só me chamar."
   },
   "Cobrar pelo diagnóstico ou pela primeira etapa, em vez de fazer de graça": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Definir o que a primeira etapa entrega",
     "Dar um preço que pode ser abatido depois",
     "Explicar o valor na conversa",
     "Medir quantos seguem para o projeto"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Dar à equipe um valor ou uma solução que ela pode usar na hora para resolver uma reclamação, sem pedir autorização": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar as 5 falhas mais comuns",
     "Definir a solução padrão de cada uma",
     "Combinar um valor que a equipe pode usar",
     "Registrar cada uso e o resultado"
    ]
   },
   "Avisar o cliente do próximo passo e de quanto falta sempre que ele precisar esperar": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Listar os momentos em que o cliente espera",
     "Escrever o aviso de cada momento",
     "Dizer o próximo passo e o prazo",
     "Contar as perguntas de andamento"
    ],
    "modelo": "Oi, [nome]! Passando para te atualizar: agora estamos em [etapa]. O próximo passo é [próximo passo], previsto para [data]. Qualquer dúvida, é só chamar."
   },
   "Escrever as promessas do atendimento que todo cliente deve sentir e conferir uma por semana": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escrever 5 promessas do atendimento",
     "Explicar cada uma à equipe",
     "Escolher uma promessa para conferir por semana",
     "Corrigir o que falhar"
    ]
   },
   "Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar quem não compra há 6 meses",
     "Escrever uma mensagem útil, sem pressão",
     "Dar um motivo concreto para voltar",
     "Contar quantos responderam e compraram"
    ],
    "modelo": "Oi, [nome]! Faz um tempo que a gente não conversa. Lembrei de você porque [novidade útil ou dica]. Se fizer sentido, a gente pode [motivo para voltar]. Um abraço!"
   },
   "Medir a recompra: quantos clientes do ano passado voltaram a comprar neste ano": {
    "tam": "P",
    "ler": 365,
    "passos": [
     "Listar os clientes do ano passado",
     "Marcar quem comprou de novo neste ano",
     "Calcular a porcentagem",
     "Comparar com o ano anterior"
    ]
   },
   "Listar todos os lugares onde o cliente poderia comprar e marcar onde a empresa ainda não está": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar canais físicos, digitais e parceiros",
     "Marcar onde a empresa já vende",
     "Estimar o tamanho de cada canal",
     "Escolher 2 canais para entrar"
    ]
   },
   "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo": {
    "tam": "G",
    "ler": 180,
    "passos": [
     "Escolher o canal na lista de prioridades",
     "Cadastrar a empresa com os ativos da marca",
     "Definir preço e prazo para o canal",
     "Medir as vendas por 3 meses"
    ]
   },
   "Ampliar o horário ou os dias de atendimento nos períodos em que o cliente mais procura": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Ver os horários em que chegam mais contatos",
     "Comparar com o horário de atendimento",
     "Ampliar o horário nos picos",
     "Contar os atendimentos nos horários novos"
    ]
   },
   "Garantir que o produto ou a agenda não falte nos períodos de pico": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Marcar os picos do ano no calendário",
     "Ver o que faltou no último pico",
     "Planejar estoque ou agenda extra",
     "Registrar as vendas perdidas por falta"
    ]
   },
   "Escolher 20 empresas-alvo e montar uma abordagem sob medida para cada uma": {
    "tam": "G",
    "ler": 180,
    "passos": [
     "Escolher 20 empresas com o perfil ideal",
     "Levantar um problema provável de cada uma",
     "Preparar uma mensagem sob medida",
     "Registrar respostas e reuniões"
    ],
    "setores": [
     "b2b"
    ]
   },
   "Publicar toda semana no LinkedIn da empresa e dos sócios, sempre com os mesmos ativos da marca": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Definir 3 temas fixos de publicação",
     "Criar o modelo visual com os ativos",
     "Combinar quem publica e quando",
     "Manter a frequência por 3 meses"
    ],
    "setores": [
     "b2b",
     "servicos"
    ]
   },
   "Fazer um levantamento do setor e divulgar os números para clientes, imprensa e redes": {
    "tam": "G",
    "ler": 120,
    "passos": [
     "Escolher uma pergunta que o setor quer saber",
     "Coletar respostas de clientes e parceiros",
     "Resumir em 5 números e gráficos",
     "Divulgar para imprensa, clientes e redes"
    ],
    "setores": [
     "b2b",
     "servicos"
    ]
   },
   "Gravar vídeos de 1 minuto respondendo às perguntas que mais chegam no WhatsApp": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar as 5 perguntas mais frequentes",
     "Gravar uma resposta curta para cada",
     "Publicar e salvar os links",
     "Usar os links nas respostas do dia a dia"
    ]
   },
   "Escrever uma página para cada serviço usando o nome que o cliente digita na busca": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Perguntar a clientes como procurariam o serviço",
     "Escolher o termo principal de cada serviço",
     "Escrever uma página por serviço",
     "Acompanhar as visitas pela busca"
    ]
   },
   "Criar uma série fixa nas redes: mesmo dia, mesmo formato e a mesma abertura": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escolher um tema que rende muitos episódios",
     "Definir dia, formato e abertura fixa",
     "Produzir 4 episódios antes de começar",
     "Publicar toda semana sem falhar"
    ]
   },
   "Reconhecer todo mês, na frente da equipe, quem melhor entregou a promessa da marca a um cliente": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Pedir à equipe casos de bom atendimento",
     "Escolher o que mais mostra a promessa",
     "Contar o caso na reunião do mês",
     "Guardar os casos para o treinamento"
    ],
    "setores": [
     "servicos",
     "varejo"
    ]
   },
   "Mostrar a marca no primeiro dia de quem entra: a promessa, o tom de voz e como atender": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Montar 10 slides sobre a marca",
     "Incluir exemplos de bom atendimento",
     "Apresentar no primeiro dia",
     "Conferir depois de 30 dias"
    ]
   },
   "Escrever o que a empresa deixa de fazer neste ano para focar no que importa": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Listar serviços, clientes e canais atuais",
     "Marcar o que dá pouco resultado",
     "Escolher 3 coisas para parar",
     "Comunicar a decisão à equipe"
    ]
   },
   "Testar a frase de posicionamento com 10 clientes: eles entendem, acreditam e acham diferente?": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Escrever a frase em uma linha",
     "Mostrar a 10 clientes",
     "Perguntar se entendem, acreditam e é diferente",
     "Ajustar o que não passou"
    ]
   },
   "Dar nome à categoria que a empresa quer liderar e usar sempre o mesmo nome": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Descrever o que a empresa faz de diferente",
     "Criar 5 nomes para essa categoria",
     "Escolher o mais claro e testar",
     "Usar o mesmo nome em todos os canais"
    ]
   },
   "Organizar os serviços numa estrutura simples: a marca principal mais um nome descritivo, sem submarcas soltas": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar todos os nomes usados hoje",
     "Marcar o que confunde o cliente",
     "Aplicar marca mais nome descritivo",
     "Atualizar site, proposta e redes"
    ]
   },
   "Juntar numa parede as peças dos últimos 3 meses e cortar o que não parece da marca": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Imprimir ou juntar as peças em uma tela",
     "Marcar o que foge da identidade",
     "Corrigir ou tirar do ar",
     "Anotar a regra que faltava"
    ]
   },
   "Criar modelos editáveis de posts, propostas e apresentações para a equipe não improvisar": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar as peças feitas com mais frequência",
     "Criar um modelo para cada uma",
     "Ensinar a equipe a usar",
     "Revisar as peças do mês seguinte"
    ]
   },
   "Montar um painel mensal com 5 números: faturamento, clientes novos, ticket médio, recompra e lembrança": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Definir de onde vem cada número",
     "Montar a planilha com os 5 números",
     "Atualizar no começo de cada mês",
     "Comentar a tendência no encontro"
    ]
   },
   "Comparar os resultados com o mesmo período do ano anterior antes de tirar conclusões": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Juntar os números do ano anterior",
     "Marcar as épocas fortes e fracas",
     "Comparar mês com o mesmo mês",
     "Rever as conclusões já tiradas"
    ]
   },
   "Entrevistar 5 clientes recentes sobre o momento em que decidiram comprar: o que estava acontecendo e o que pesou": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher 5 clientes dos últimos 3 meses",
     "Perguntar sobre fatos, não opiniões",
     "Anotar o gatilho e o que pesou",
     "Levar os padrões para a comunicação"
    ],
    "modelo": "Oi, [nome]! Estamos tentando entender melhor como nossos clientes decidem. Você toparia uma conversa de 15 minutos para contar como foi quando decidiu contratar a gente? Ajuda muito!"
   },
   "Testar uma ação com metade da base e comparar com a metade que não recebeu": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher a ação e a métrica antes",
     "Dividir a base em duas metades ao acaso",
     "Aplicar a ação só em uma delas",
     "Comparar o resultado das duas"
    ]
   },
   "Revisar a vitrine e a entrada: em 3 segundos dá para saber o que a loja vende e de quem é?": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Fotografar a fachada como quem passa",
     "Mostrar a 5 pessoas por 3 segundos",
     "Perguntar o que a loja vende",
     "Ajustar o que não ficou claro"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Organizar a loja: os mais procurados ao fundo e os de impulso perto do caixa": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar os itens mais procurados",
     "Mudar esses itens para o fundo",
     "Colocar itens de impulso no caixa",
     "Comparar o ticket médio"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Aplicar os ativos da marca na embalagem e na sacola, do mesmo jeito em todas": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar todas as embalagens e sacolas",
     "Aplicar cor, símbolo e frase",
     "Produzir o novo lote",
     "Fotografar e usar nas redes"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Enviar lembrete da consulta 24 horas antes, com endereço, preparo e o que levar": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escrever a mensagem de lembrete",
     "Incluir endereço, preparo e o que levar",
     "Configurar o envio 24 horas antes",
     "Comparar as faltas antes e depois"
    ],
    "setores": [
     "servicos"
    ],
    "modelo": "Oi, [nome]! Lembrando da sua consulta amanhã, [data] às [hora], com [profissional]. Endereço: [endereço]. Traga [documentos]. Se precisar remarcar, é só responder aqui."
   },
   "Publicar a formação e a especialidade de cada profissional em linguagem simples": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Juntar formação e experiência de cada um",
     "Reescrever sem jargão técnico",
     "Colocar foto real e o que cada um atende",
     "Publicar no site e no perfil do Google"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Fotografar os 10 itens mais vendidos no mesmo estilo e usar em todos os canais": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher os 10 mais vendidos",
     "Definir luz, fundo e ângulo fixos",
     "Fotografar todos no mesmo dia",
     "Trocar as fotos em todos os canais"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Revisar o cardápio: destacar os itens de maior margem e tirar os que quase ninguém pede": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar vendas e margem de cada item",
     "Marcar os de alta margem e muita saída",
     "Destacar esses itens no cardápio",
     "Tirar os itens que quase não saem"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Reduzir a compra no site ao menor número de etapas e testar no celular": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Contar as etapas da compra hoje",
     "Tirar campos e etapas desnecessários",
     "Testar a compra em 3 celulares",
     "Comparar a taxa de conclusão"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Mostrar prazo de entrega, frete e política de troca antes do carrinho": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Ver onde aparecem frete e prazo hoje",
     "Mostrar na página do produto",
     "Deixar a troca explicada em uma frase",
     "Comparar o abandono de carrinho"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Mandar mensagem de carrinho abandonado em até 1 hora, oferecendo ajuda, e não desconto": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Configurar o aviso de carrinho abandonado",
     "Escrever uma mensagem de ajuda",
     "Enviar em até 1 hora",
     "Medir quantos voltam e compram"
    ],
    "setores": [
     "varejo"
    ],
    "modelo": "Oi, [nome]! Vi que você deixou [produto] no carrinho. Ficou alguma dúvida sobre tamanho, entrega ou pagamento? Estou por aqui para ajudar."
   },
   "Oferecer uma aula ou amostra gratuita, com data marcada, para quem ainda não é aluno": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher um tema curto e útil",
     "Marcar data e abrir inscrições",
     "Dar a aula com os ativos da marca",
     "Fazer a oferta no final e medir"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Publicar resultados reais de ex-alunos ou ex-clientes, com autorização": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar quem teve bons resultados",
     "Pedir autorização e números",
     "Escrever cada caso em poucas linhas",
     "Publicar no site e nas redes"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Fotografar antes e depois sempre com a mesma luz e o mesmo ângulo, com autorização": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Definir local, luz e ângulo fixos",
     "Pedir autorização por escrito",
     "Fotografar antes e depois do serviço",
     "Publicar com o consentimento do cliente"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Marcar o próximo atendimento antes de o cliente ir embora": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Definir o intervalo ideal de cada serviço",
     "Oferecer a próxima data no fim do atendimento",
     "Enviar lembrete perto da data",
     "Contar quantos saem com horário"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Medir em quantos dias o cliente novo chega ao primeiro resultado e encurtar esse caminho": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Definir o que é o primeiro resultado",
     "Medir quantos dias leva hoje",
     "Cortar o que atrasa no começo",
     "Medir de novo em 3 meses"
    ],
    "setores": [
     "b2b"
    ]
   },
   "Oferecer teste gratuito com acompanhamento nos primeiros 7 dias": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Definir o que o cliente deve fazer no teste",
     "Planejar 3 contatos nos 7 dias",
     "Acompanhar quem não avança",
     "Medir a conversão do teste"
    ],
    "setores": [
     "b2b"
    ]
   }
  });
  Object.assign(window.GangPresets.detalhes, {
   "Comparar o que a equipe acha que o cliente quer com o que o cliente diz querer, e corrigir as diferenças": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Perguntar à equipe o que o cliente mais valoriza",
     "Perguntar o mesmo a 10 clientes",
     "Comparar as duas listas",
     "Corrigir as 3 maiores diferenças"
    ]
   },
   "Conferir se o que o site e a venda prometem é o que a operação consegue entregar, e alinhar os dois": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar tudo o que o site e a venda prometem",
     "Perguntar à operação se entrega cada item",
     "Ajustar a promessa ou a entrega",
     "Avisar vendas e atendimento da mudança"
    ]
   },
   "Desenhar o mapa do serviço: o que o cliente vê, o que acontece por trás e onde costuma falhar": {
    "tam": "G",
    "ler": 90,
    "passos": [
     "Listar as etapas que o cliente vê",
     "Anotar o que acontece por trás de cada uma",
     "Marcar onde já houve falha",
     "Corrigir os 2 pontos mais críticos"
    ]
   },
   "Separar os clientes em níveis pelo que trazem para a empresa e definir o atendimento de cada nível": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar os clientes do último ano",
     "Separar por faturamento e frequência",
     "Definir o que cada nível recebe",
     "Aplicar e revisar em 3 meses"
    ]
   },
   "Medir por uma semana o tempo real de resposta aos contatos, por canal": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Anotar a hora de chegada de cada contato",
     "Anotar a hora da primeira resposta",
     "Calcular a média por canal",
     "Corrigir o canal mais lento"
    ]
   },
   "Escrever o perfil de compra: o que leva a buscar, o que conta como sucesso, o que trava, quem participa e como compara": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Entrevistar 5 clientes que compraram há pouco",
     "Anotar os 5 pontos de cada conversa",
     "Juntar o que se repete",
     "Usar no site, na proposta e nos anúncios"
    ]
   },
   "Listar os medos que impedem o cliente de trocar de fornecedor e responder a cada um na comunicação": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Perguntar a clientes o que quase os impediu",
     "Listar os medos e os costumes citados",
     "Escrever uma resposta para cada um",
     "Colocar no site e na proposta"
    ]
   },
   "Conversar com um cliente toda semana, por 15 minutos, e anotar o que aprendeu": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Reservar um horário fixo na semana",
     "Convidar um cliente diferente a cada vez",
     "Perguntar sobre a última experiência real",
     "Anotar o aprendizado em uma frase"
    ],
    "modelo": "Oi, [nome]! Estamos conversando rapidinho com alguns clientes para melhorar o nosso trabalho. Você teria 15 minutos esta semana? Quero muito ouvir como tem sido para você."
   },
   "Antes de lançar um serviço novo, perguntar a 10 clientes se pagariam, quanto e de que forma": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Descrever o serviço em uma frase",
     "Perguntar a 10 clientes se teria valor",
     "Perguntar a faixa de preço e a forma de pagar",
     "Ajustar o serviço ao que ouviu"
    ]
   },
   "Definir, antes de cada negociação grande, o preço mínimo aceitável e o que fazer se não fechar": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Calcular o preço abaixo do qual não vale",
     "Definir o que fazer se não fechar",
     "Pensar na alternativa do cliente",
     "Levar isso escrito para a conversa"
    ]
   },
   "Listar o que a empresa pode ceder sem baixar o preço: prazo, escopo, forma de pagamento ou extras": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar o que custa pouco e o cliente valoriza",
     "Definir o que se pede em troca de cada item",
     "Ensaiar as respostas a pedidos de desconto",
     "Registrar o que foi trocado"
    ]
   },
   "Combinar com o cliente, antes de falar de preço, os objetivos e como o sucesso será medido": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Perguntar quais resultados o cliente quer",
     "Perguntar como ele vai saber que deu certo",
     "Escrever e confirmar com o cliente",
     "Só então apresentar o preço"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Perguntar a faixa de investimento já na primeira conversa, com naturalidade": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escrever a pergunta sobre investimento",
     "Treinar como fazer sem constrangimento",
     "Fazer a pergunta em toda primeira conversa",
     "Comparar propostas aceitas antes e depois"
    ]
   },
   "Identificar se o cliente compra por preço, por valor ou por relação, e adaptar a proposta": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar sinais de cada tipo de comprador",
     "Classificar as negociações abertas",
     "Ajustar a proposta a cada tipo",
     "Comparar o fechamento por tipo"
    ]
   },
   "Cobrar por projeto ou por resultado, e não por hora": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Ver quanto tempo e resultado cada serviço tem",
     "Montar um preço fechado por projeto",
     "Testar em 3 propostas novas",
     "Comparar margem e fechamento"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Oferecer formas de pagamento que facilitem a compra sem baixar o preço: parcelas, assinatura ou entrada menor": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Ver onde o cliente trava no pagamento",
     "Escolher uma forma de pagar mais leve",
     "Calcular o custo para a empresa",
     "Oferecer e medir o fechamento"
    ]
   },
   "Para marcas premium: tirar o desconto público e reservar condições só para clientes antigos": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Listar os descontos públicos atuais",
     "Tirar os anúncios de desconto",
     "Criar uma condição só para clientes antigos",
     "Acompanhar ticket e recompra"
    ]
   },
   "Calcular a margem de cada serviço ou produto e concentrar a comunicação nos mais lucrativos": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar preço e custo de cada item",
     "Calcular a margem de cada um",
     "Escolher os 3 de melhor margem",
     "Dar destaque a eles no site e nas vendas"
    ]
   },
   "Revisar o portfólio: separar o que traz clientes, o que dá lucro e o que só ocupa espaço": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Listar todos os serviços ou produtos",
     "Marcar quais atraem clientes novos",
     "Marcar quais dão mais lucro",
     "Decidir o que sai e o que fica"
    ]
   },
   "Descrever com o cliente a situação de hoje e a situação desejada antes de apresentar a solução": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Perguntar como as coisas estão hoje",
     "Perguntar como seria o ideal",
     "Escrever a distância entre os dois",
     "Mostrar como a solução fecha essa distância"
    ]
   },
   "Abrir a apresentação comercial pela mudança no mercado que torna o jeito antigo arriscado": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escrever o que mudou no mercado do cliente",
     "Mostrar por que o jeito antigo ficou arriscado",
     "Descrever como seria o jeito ideal",
     "Só então mostrar a empresa"
    ]
   },
   "Montar um material para o contato interno convencer os outros decisores da empresa dele": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Perguntar quem mais precisa aprovar",
     "Listar as dúvidas de cada um",
     "Montar um resumo de uma página com respostas",
     "Entregar ao contato antes da reunião interna"
    ],
    "setores": [
     "b2b"
    ]
   },
   "Combinar com o cliente o acompanhamento depois da proposta: em 2, 5 e 10 dias, cada contato com algo útil": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Combinar as datas de contato na reunião",
     "Preparar algo útil para cada contato",
     "Enviar nas datas combinadas",
     "Registrar a resposta de cada etapa"
    ],
    "modelo": "Oi, [nome]! Como combinamos, passando para te mandar [algo útil: caso, dado ou resposta]. Ficou alguma dúvida sobre a proposta? Posso te ligar [dia]?"
   },
   "Escrever 10 títulos diferentes para o anúncio principal antes de escolher um": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Escrever 10 títulos com abordagens diferentes",
     "Escolher os 2 mais fortes",
     "Testar os 2 com o mesmo público",
     "Ficar com o que tiver mais resposta"
    ]
   },
   "Reduzir cada anúncio a uma só ideia e cortar o resto": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Escrever a ideia do anúncio em uma frase",
     "Cortar o que não serve a ela",
     "Mostrar a 3 pessoas e pedir o resumo",
     "Ajustar se o resumo não bater"
    ]
   },
   "Escrever o briefing de cada campanha em uma página: o que a pessoa deve pensar, sentir e fazer": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Definir o público e o problema dele",
     "Escrever o que deve pensar, sentir e fazer",
     "Anotar os ativos obrigatórios da marca",
     "Aprovar antes de começar a criar"
    ]
   },
   "Manter o anúncio que funciona no ar por mais tempo: o cansaço da equipe não é o cansaço do público": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar os anúncios que funcionam",
     "Definir o sinal real de desgaste",
     "Só trocar quando o resultado cair",
     "Variar detalhes sem mudar a ideia"
    ]
   },
   "Dividir a verba entre pelo menos 2 tipos de mídia, porque juntos alcançam mais gente": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Ver onde o público passa o tempo",
     "Escolher 2 tipos de mídia diferentes",
     "Dividir a verba entre eles",
     "Comparar o alcance com o período anterior"
    ]
   },
   "Usar um código ou link diferente em cada canal para saber de onde vêm as vendas": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Criar um código ou link por canal",
     "Usar em todas as peças daquele canal",
     "Registrar o código em cada venda",
     "Comparar os canais no fim do mês"
    ]
   },
   "Anunciar de novo para quem visitou o site ou falou com a empresa e não comprou": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Instalar o rastreamento do site e das redes",
     "Criar o público de quem visitou e não comprou",
     "Fazer um anúncio com prova e próximo passo",
     "Limitar a frequência e medir"
    ]
   },
   "Lançar uma novidade por semestre e comunicar como notícia": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Escolher o que há de novo de verdade",
     "Escrever como notícia, com o fato primeiro",
     "Divulgar para clientes, redes e imprensa",
     "Medir contatos gerados"
    ]
   },
   "Criar uma data própria da marca e celebrar todo ano do mesmo jeito": {
    "tam": "M",
    "ler": 365,
    "passos": [
     "Escolher uma data com sentido para a marca",
     "Criar uma forma fixa de celebrar",
     "Avisar clientes com antecedência",
     "Repetir do mesmo jeito no ano seguinte"
    ]
   },
   "Apoiar algo local que o público frequenta, com a marca bem visível": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Listar eventos e lugares que o público frequenta",
     "Escolher um com bom alcance e afinidade",
     "Garantir os ativos da marca bem visíveis",
     "Perguntar aos novos clientes se viram"
    ]
   },
   "Mapear os códigos da categoria: o que todos repetem, o que está ficando velho e o que está surgindo": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Juntar 30 peças de concorrentes",
     "Agrupar imagens, cores e frases que se repetem",
     "Marcar o que parece velho e o que parece novo",
     "Escolher o que a marca usa e o que evita"
    ]
   },
   "Identificar uma tensão que o cliente vive na sociedade e colocar a marca do lado dele": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Listar mudanças que incomodam o cliente",
     "Escolher a que tem a ver com a empresa",
     "Escrever a posição da marca sobre ela",
     "Expressar em uma peça e medir a reação"
    ]
   },
   "Mostrar o que a escolha da marca diz sobre quem compra": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Perguntar a clientes como se sentem ao contar que compram",
     "Listar o que a escolha diz sobre eles",
     "Escrever 3 mensagens com esse sinal",
     "Usar em anúncios e redes"
    ]
   },
   "Criar algo que o cliente queira mostrar: um certificado, uma foto ou uma frase da marca": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Ver o momento de maior orgulho do cliente",
     "Criar algo que ele queira mostrar",
     "Colocar os ativos da marca nisso",
     "Contar os compartilhamentos"
    ]
   },
   "Testar o logo bem pequeno, como ícone de celular, carimbo e bordado, e criar uma versão reduzida se precisar": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Aplicar o logo em 16 e 32 pixels",
     "Simular carimbo e bordado",
     "Ver o que some ou embaralha",
     "Criar a versão reduzida se precisar"
    ]
   },
   "Conferir o contraste das cores da marca em textos e botões para que todos consigam ler": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Listar as combinações de cor usadas em texto",
     "Medir o contraste de cada uma",
     "Trocar as que ficaram abaixo",
     "Atualizar o manual da marca"
    ]
   },
   "Limitar a marca a 2 fontes e definir tamanhos fixos para títulos e textos": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escolher a fonte de títulos e a de textos",
     "Definir 3 tamanhos fixos",
     "Atualizar os modelos de peça",
     "Conferir as peças do mês"
    ]
   },
   "Reescrever as mensagens automáticas no tom de voz da marca: confirmações, avisos, cobranças e erros": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar todas as mensagens automáticas",
     "Reescrever no tom de voz da marca",
     "Pedir que alguém de fora leia",
     "Trocar em todos os sistemas"
    ]
   },
   "Escrever o glossário da marca: as palavras que a marca usa e as que evita": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar as palavras que já marcam a empresa",
     "Listar as que soam como os concorrentes",
     "Escrever o glossário em uma página",
     "Entregar a quem escreve e atende"
    ]
   },
   "Escrever em um parágrafo o principal obstáculo ao crescimento e as 3 ações que atacam ele": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar o que impede o crescimento",
     "Escolher o obstáculo principal",
     "Definir 3 ações que atacam ele",
     "Cortar ações que não ajudam nisso"
    ]
   },
   "Estimar o resultado com mínimo e máximo antes de investir, e conferir depois": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escrever o mínimo e o máximo esperados",
     "Registrar antes de começar",
     "Anotar o resultado real",
     "Ver se o real caiu na faixa"
    ]
   },
   "Calcular quanto custa conquistar um cliente e quanto ele deixa ao longo do tempo": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Somar o gasto para atrair clientes no ano",
     "Dividir pelos clientes novos",
     "Calcular o faturamento médio por cliente na vida",
     "Comparar os dois números"
    ]
   },
   "Combinar como responder a uma crise: quem fala, o que diz e em quanto tempo": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Listar as crises mais prováveis",
     "Definir quem fala em nome da empresa",
     "Escrever a primeira resposta de cada uma",
     "Combinar o prazo máximo para responder"
    ]
   },
   "Acompanhar uma vez por semana o que falam da marca na internet": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Criar alertas com o nome da marca",
     "Ver avaliações e menções da semana",
     "Responder o que pede resposta",
     "Anotar elogios e críticas que se repetem"
    ]
   },
   "Agradecer por escrito cada indicação recebida e contar o que aconteceu com ela": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Registrar quem indicou cada cliente",
     "Agradecer no mesmo dia",
     "Contar o resultado depois do atendimento",
     "Ver quem indicou mais de uma vez"
    ],
    "modelo": "Oi, [nome]! Queria agradecer por ter indicado [cliente indicado]. Já conversamos e [o que aconteceu]. Obrigado pela confiança!"
   },
   "Pedir à equipe 3 ideias para melhorar o atendimento e testar a melhor no mês seguinte": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Pedir 3 ideias a cada pessoa",
     "Escolher a mais simples e útil",
     "Testar por um mês",
     "Contar o resultado à equipe"
    ]
   },
   "Aparecer nas listas, guias e comparadores que o cliente consulta antes de comprar": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Perguntar a clientes onde pesquisaram",
     "Listar guias, associações e comparadores",
     "Cadastrar a empresa com os ativos da marca",
     "Medir contatos vindos de cada um"
    ]
   },
   "Deixar a opção recomendada já marcada no pedido, no orçamento ou no formulário": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Ver onde o cliente escolhe entre opções",
     "Definir a opção mais indicada",
     "Deixar essa opção marcada",
     "Comparar as escolhas antes e depois"
    ]
   },
   "Mostrar ao cliente quanto falta para concluir: no pedido, no cadastro ou no programa": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar processos com várias etapas",
     "Mostrar a etapa atual e quantas faltam",
     "Dar uma pequena vitória logo no início",
     "Medir quantos chegam ao fim"
    ]
   },
   "Explicar o tratamento ou o serviço em etapas, com prazos e custos por escrito, antes de começar": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar as etapas do serviço",
     "Escrever prazo e custo de cada uma",
     "Entregar ao cliente no primeiro dia",
     "Revisar quando algo mudar"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Ter um item que só a casa tem e colocá-lo em destaque em todos os canais": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Ver o que só a casa faz ou pode fazer",
     "Dar um nome próprio a esse item",
     "Destacar no cardápio e nas redes",
     "Acompanhar os pedidos dele"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Treinar a equipe da loja a abordar com uma pergunta útil, e não com \"posso ajudar?\"": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar as perguntas úteis por situação",
     "Treinar a equipe em uma reunião",
     "Testar por duas semanas",
     "Comparar as vendas da loja"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Acompanhar de perto o cliente nas 2 primeiras semanas, quando o risco de desistência é maior": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Definir 3 contatos nas 2 primeiras semanas",
     "Perguntar como está e se travou em algo",
     "Resolver logo o que aparecer",
     "Comparar desistências antes e depois"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Avisar o cliente que está usando pouco o serviço e oferecer ajuda antes que ele cancele": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Definir o que é uso baixo",
     "Listar os clientes nessa situação",
     "Oferecer ajuda personalizada",
     "Acompanhar quem cancelou e quem ficou"
    ],
    "setores": [
     "b2b"
    ]
   },
   "Fazer uma revisão de resultados a cada trimestre com cada cliente grande": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar os clientes grandes",
     "Preparar resultados do trimestre em uma página",
     "Marcar a reunião com cada um",
     "Anotar próximos passos e oportunidades"
    ],
    "setores": [
     "b2b",
     "servicos"
    ]
   }
  });
  Object.assign(window.GangPresets.detalhes, {
   "Listar as 5 objeções mais comuns e escrever uma resposta curta e honesta para cada uma": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Anotar as objeções das últimas 20 conversas",
     "Escolher as 5 mais repetidas",
     "Escrever uma resposta curta para cada",
     "Treinar com quem vende"
    ]
   },
   "Ouvir uma conversa de venda por semana e anotar uma coisa para melhorar": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Pedir autorização para gravar ou anotar a conversa",
     "Ouvir com quem vendeu",
     "Anotar um acerto e uma melhoria",
     "Testar a melhoria na semana seguinte"
    ]
   },
   "Escrever o perfil do cliente ideal e os sinais de quem não é cliente para a empresa": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar os 5 melhores clientes que a empresa já teve",
     "Anotar o que eles têm em comum",
     "Listar os sinais de quem dá problema",
     "Usar a lista para escolher onde investir"
    ]
   },
   "Pedir uma conversa por ano com o dono ou o diretor de cada cliente B2B importante": {
    "tam": "P",
    "ler": 365,
    "passos": [
     "Listar os clientes que mais faturam",
     "Identificar quem decide em cada um",
     "Preparar uma pauta sobre o negócio deles",
     "Marcar a conversa e registrar próximos passos"
    ],
    "setores": [
     "b2b",
     "servicos"
    ]
   },
   "Combinar por escrito, no início, o que a empresa faz, o que o cliente faz e como os dois vão saber que deu certo": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar o que a empresa entrega",
     "Listar o que depende do cliente",
     "Escrever como o resultado será medido",
     "Revisar com o cliente e guardar"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Admitir na comunicação uma limitação honesta da empresa, ao lado do que ela faz de melhor": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escolher uma limitação real e pequena",
     "Mostrar por que ela existe",
     "Ligar a limitação a uma qualidade",
     "Usar no site e na proposta"
    ]
   },
   "Pedir ao cliente novo um primeiro passo bem pequeno antes do compromisso maior": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar o caminho até a compra",
     "Escolher um primeiro passo de 5 minutos",
     "Oferecer esse passo em todos os contatos",
     "Medir quantos seguem adiante"
    ]
   },
   "Mostrar o trabalho que o cliente não vê: o cuidado e as etapas por trás do resultado": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar as etapas que o cliente não vê",
     "Escolher as 3 mais impressionantes",
     "Mostrar em fotos, vídeos ou no relatório",
     "Incluir no site e na entrega"
    ]
   },
   "Trocar avisos que reforçam o erro (\"muitos clientes esquecem…\") por mensagens sobre o que a maioria faz certo": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar avisos e lembretes atuais",
     "Marcar os que citam o erro de muitos",
     "Reescrever pelo que a maioria faz",
     "Comparar a resposta antes e depois"
    ]
   },
   "Mostrar o preço em parcelas pequenas do dia ou do uso, quando fizer sentido": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Calcular o valor por dia, mês ou uso",
     "Escolher a forma mais fácil de entender",
     "Mostrar junto ao preço cheio",
     "Comparar o fechamento antes e depois"
    ]
   },
   "Usar preço redondo nos serviços premium e reservar os quebrados para as ofertas": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Separar serviços premium e ofertas",
     "Arredondar os preços premium",
     "Manter os quebrados só nas ofertas",
     "Acompanhar fechamento e ticket"
    ]
   },
   "Revisar o ambiente onde o cliente espera e é atendido: limpeza, luz, som, conforto e a marca à vista": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Sentar no lugar do cliente por 15 minutos",
     "Anotar o que incomoda e o que falta",
     "Corrigir os 3 pontos mais visíveis",
     "Colocar os ativos da marca no espaço"
    ],
    "setores": [
     "servicos",
     "varejo"
    ]
   },
   "Revisar o site com uma regra: cada página com um objetivo e uma chamada principal": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Listar as páginas do site",
     "Escrever o objetivo de cada uma",
     "Deixar uma chamada principal por página",
     "Cortar o que não ajuda no objetivo"
    ]
   },
   "Mostrar a página inicial por 5 segundos a 5 pessoas e perguntar o que a empresa faz": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Mostrar a página por 5 segundos",
     "Perguntar o que a empresa faz e para quem",
     "Anotar as respostas",
     "Ajustar o título e a imagem principal"
    ]
   },
   "Colocar legenda em todos os vídeos da marca": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Listar os vídeos publicados",
     "Gerar e revisar as legendas",
     "Usar a fonte e as cores da marca",
     "Legendar todos os vídeos novos"
    ]
   },
   "Descobrir de quanto em quanto tempo o cliente volta a comprar e lembrá-lo perto da data": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Ver o intervalo médio entre compras",
     "Separar clientes perto da data",
     "Escrever um lembrete útil",
     "Enviar e medir quem volta"
    ],
    "modelo": "Oi, [nome]! Já faz [tempo] desde o seu último [serviço]. Normalmente é a hora de [motivo]. Quer que eu veja um horário para você?"
   },
   "Fazer uma ação com outra marca respeitada pelo mesmo público": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar marcas que o seu cliente já admira",
     "Escolher uma que combine e não concorra",
     "Criar uma ação útil para os dois públicos",
     "Medir os contatos de cada lado"
    ]
   },
   "Antes de lançar algo com o nome da marca, conferir se combina com o que a marca representa": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escrever o que a marca representa hoje",
     "Comparar o lançamento com isso",
     "Perguntar a 5 clientes se faz sentido",
     "Decidir o nome com base nas respostas"
    ]
   },
   "Ao atualizar a identidade, manter os elementos que as pessoas já reconhecem": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Listar os elementos que as pessoas reconhecem",
     "Decidir o que fica e o que muda",
     "Atualizar mantendo os reconhecidos",
     "Testar o reconhecimento antes de lançar"
    ]
   },
   "Mostrar cuidado com as pessoas, e não só competência: gestos, histórias e respostas humanas": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar gestos de cuidado que já acontecem",
     "Contar 3 deles em histórias reais",
     "Revisar respostas para soar humano",
     "Perguntar aos clientes como descrevem a marca"
    ]
   },
   "Testar o nome da marca ou do serviço: é fácil de dizer, de escrever e de achar na busca?": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Falar o nome para 10 pessoas",
     "Pedir que escrevam como entenderam",
     "Buscar o nome no Google e nos mapas",
     "Ajustar grafia ou criar atalhos de busca"
    ]
   },
   "Concentrar a presença numa região ou num nicho onde a empresa possa ser a mais lembrada": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Ver onde estão os melhores clientes",
     "Escolher a região ou o nicho principal",
     "Concentrar ali a verba e a presença",
     "Medir a participação nesse recorte"
    ]
   },
   "Escrever com cada área o que ela faz, no dia a dia, para cumprir a promessa da marca": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Explicar a promessa a cada área",
     "Pedir 3 comportamentos de cada uma",
     "Escrever e combinar com todos",
     "Revisar no encontro do mês"
    ]
   },
   "Usar o melhor conteúdo da marca como anúncio para quem ainda não segue a empresa": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escolher os 3 conteúdos com mais resposta",
     "Ajustar para os primeiros segundos",
     "Anunciar para quem não segue a marca",
     "Medir alcance e novos contatos"
    ]
   },
   "Anunciar perto de onde o cliente compra: mídia de rua, rádio local ou ponto de venda": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Mapear onde o cliente passa antes de comprar",
     "Escolher um meio local com bom alcance",
     "Criar a peça com os ativos da marca",
     "Perguntar aos novos clientes se viram"
    ],
    "setores": [
     "varejo",
     "servicos"
    ]
   },
   "Garantir que quem procura o nome da marca encontre a empresa em primeiro lugar": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Buscar o nome da marca no Google e nos mapas",
     "Ver quem aparece antes",
     "Corrigir perfil, site e cadastros",
     "Anunciar no próprio nome se for preciso"
    ]
   },
   "Publicar uma vez por mês uma opinião forte da empresa sobre um tema do setor": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Listar temas em que a empresa discorda do comum",
     "Escolher um por mês",
     "Escrever com argumentos e exemplos",
     "Publicar e levar para a imprensa do setor"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Inscrever a empresa em prêmios, rankings ou certificações respeitados no setor": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Listar prêmios e certificações respeitados",
     "Escolher os que a empresa pode ganhar",
     "Preparar a inscrição com provas",
     "Usar o resultado no site e na proposta"
    ]
   },
   "Montar o catálogo no WhatsApp Business com fotos, preços e descrição de cada serviço ou produto": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar os itens mais procurados",
     "Fotografar no padrão da marca",
     "Cadastrar com preço e descrição",
     "Usar o link do catálogo nas respostas"
    ],
    "setores": [
     "varejo",
     "servicos"
    ]
   },
   "Fazer degustação, demonstração ou teste no ponto de venda": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher o item mais fácil de experimentar",
     "Definir dia, hora e quem conduz",
     "Preparar o espaço com a marca",
     "Contar quantos experimentaram e compraram"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Colocar os ativos da marca no balcão, no caixa e na entrega, onde o cliente está decidindo": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar onde o cliente decide e paga",
     "Ver o que aparece ali hoje",
     "Colocar cor, símbolo e frase da marca",
     "Conferir a aplicação uma vez por mês"
    ],
    "setores": [
     "varejo"
    ]
   },
   "Criar um programa de indicação com benefício para quem indica e para quem chega": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Definir o benefício de quem indica e de quem chega",
     "Criar um jeito simples de indicar",
     "Avisar os clientes satisfeitos",
     "Medir indicações e vendas"
    ],
    "modelo": "Oi, [nome]! Se você conhece alguém que precisa de [serviço], é só me passar o contato. Quem chega por você ganha [benefício] e você ganha [benefício]. Obrigado pela confiança!"
   },
   "Calcular quantas vendas uma campanha precisa trazer para se pagar, antes de lançar": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Somar o custo total da campanha",
     "Ver a margem de cada venda",
     "Dividir custo pela margem",
     "Comparar com as vendas que vieram"
    ]
   },
   "Separar o que aumentou por causa da marca do que aumentou por causa de preço, época ou promoção": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Listar o que mudou no período",
     "Comparar com o mesmo período do ano anterior",
     "Separar efeitos de preço e promoção",
     "Anotar o que sobra para a marca"
    ]
   },
   "Acompanhar a cada trimestre 3 números de saúde da marca, além das vendas": {
    "tam": "M",
    "ler": 365,
    "passos": [
     "Escolher lembrança, preferência e preço médio",
     "Definir como medir cada um",
     "Medir a cada trimestre",
     "Comparar com as vendas no encontro"
    ]
   },
   "Antes de decidir algo grande, listar o que falta saber e medir só o que pode mudar a decisão": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escrever a decisão a tomar",
     "Listar as dúvidas que podem mudar a escolha",
     "Escolher a mais importante",
     "Medir de forma simples antes de decidir"
    ]
   },
   "Revisar a cada semestre como os clientes mudaram: o que compram, por qual canal e por quê": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Comparar vendas por produto e canal",
     "Ouvir 5 clientes sobre o que mudou",
     "Anotar as 3 mudanças principais",
     "Ajustar o plano do semestre"
    ]
   },
   "Separar o crescimento em três fontes: clientes novos, clientes que voltam e quanto cada um gasta": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Contar clientes novos do período",
     "Contar quantos voltaram",
     "Calcular o ticket médio",
     "Escolher a fonte com mais espaço"
    ]
   }
  });
  Object.assign(window.GangPresets.detalhes, {
   "Descrever o negócio pela necessidade que ele resolve, e não pelo produto que vende": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escrever o que a empresa vende hoje",
     "Perguntar: que necessidade isso resolve?",
     "Reescrever a frase do negócio por essa necessidade",
     "Listar novas ofertas que a frase permite"
    ]
   },
   "Mostrar o produto ou serviço em uso do ponto de vista de quem compra: a mão, o lugar, o momento dele": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher o momento de uso mais desejado",
     "Fotografar ou filmar do ponto de vista do cliente",
     "Usar em anúncios e no site",
     "Comparar com as peças antigas"
    ]
   },
   "Ensinar o cliente a ficar melhor naquilo que ele quer fazer com o produto ou serviço": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar o que o cliente quer conseguir fazer",
     "Escolher 3 dicas que fazem diferença",
     "Entregar em vídeo, guia ou conversa",
     "Perguntar o resultado depois de um mês"
    ]
   },
   "Antes de criar um serviço novo, abrir uma lista de espera e ver quantos se inscrevem": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Descrever a oferta em uma página",
     "Abrir a lista de espera",
     "Divulgar para clientes e redes",
     "Decidir o lançamento pelo número de inscritos"
    ]
   },
   "Escolher com cuidado as pessoas, os lugares e as situações que aparecem nas peças da marca": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Descrever quem a marca quer parecer",
     "Listar pessoas e lugares que combinam",
     "Revisar as fotos atuais",
     "Trocar o que passa a ideia errada"
    ]
   },
   "Observar concorrentes mais simples e mais baratos que estão crescendo e decidir como responder": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Listar concorrentes novos e mais baratos",
     "Ver quais clientes eles atraem",
     "Decidir: ignorar, competir ou criar versão própria",
     "Rever a decisão no semestre"
    ]
   },
   "Anotar o que deu certo sem ter sido planejado e decidir se vira parte da estratégia": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Revisar os resultados dos últimos meses",
     "Marcar o que funcionou sem ser planejado",
     "Entender por que funcionou",
     "Decidir se entra no plano"
    ]
   },
   "Na negociação, perguntar o motivo por trás de cada pedido do cliente antes de responder": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Anotar cada pedido feito na negociação",
     "Perguntar o que ele resolve para o cliente",
     "Propor outro jeito de atender ao motivo",
     "Registrar o que foi combinado"
    ]
   },
   "Dar uma recomendação útil já na primeira conversa, antes de fechar qualquer coisa": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Preparar 3 recomendações rápidas por tipo de cliente",
     "Dar uma delas na primeira conversa",
     "Não condicionar a ajuda à compra",
     "Medir quantas conversas avançam"
    ]
   },
   "Ler em voz alta os textos principais da marca e cortar frases longas e palavras difíceis": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Escolher site, proposta e apresentação",
     "Ler cada texto em voz alta",
     "Cortar o que travar ou soar difícil",
     "Pedir que alguém de fora leia"
    ]
   },
   "Reescrever os textos para falar com o cliente (\"você\"), e não sobre a empresa (\"nós\")": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Contar \"nós\" e \"você\" na página inicial",
     "Reescrever as frases sobre a empresa",
     "Começar pelo que o cliente ganha",
     "Aplicar no site e na proposta"
    ]
   },
   "Medir em que etapa as pessoas se perdem: conhecem, consideram, compram e voltam": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Estimar quantos conhecem a marca",
     "Medir quantos pedem orçamento",
     "Medir quantos compram e voltam",
     "Atacar a etapa com maior perda"
    ]
   },
   "Manter um diário de testes: o que foi tentado, o que se esperava e o que aconteceu": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Criar uma planilha simples de testes",
     "Registrar hipótese e métrica antes",
     "Anotar o resultado depois",
     "Rever o diário a cada trimestre"
    ]
   },
   "Medir quantos orçamentos viram venda e quanto tempo leva para fechar": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Listar os orçamentos do mês",
     "Marcar quais viraram venda",
     "Calcular a taxa e o prazo médio",
     "Acompanhar mês a mês"
    ]
   },
   "Permitir agendar ou pedir online a qualquer hora do dia": {
    "tam": "M",
    "ler": 60,
    "passos": [
     "Escolher uma ferramenta de agenda ou pedido",
     "Configurar com os horários reais",
     "Colocar o link em todos os canais",
     "Contar os pedidos fora do horário"
    ],
    "setores": [
     "servicos",
     "varejo"
    ]
   },
   "Montar um conselho com 5 clientes que se reúne a cada semestre para opinar": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Convidar 5 clientes de perfis diferentes",
     "Preparar 3 perguntas por reunião",
     "Registrar e aplicar uma ideia",
     "Contar a eles o que mudou"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Mapear qual serviço costuma vir depois de cada um",
     "Definir o momento certo de oferecer",
     "Escrever a oferta ligada ao resultado",
     "Medir quantos compram o segundo"
    ],
    "modelo": "Oi, [nome]! Que bom que [resultado]. Muitos clientes, depois disso, fazem [próximo serviço] para [benefício]. Quer que eu te mostre como seria no seu caso?"
   },
   "Reunir os arquivos da marca numa pasta única com as versões finais e acesso para toda a equipe": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Juntar logos, cores, fontes e modelos",
     "Apagar as versões antigas",
     "Organizar por tipo de uso",
     "Enviar o link à equipe e aos fornecedores"
    ]
   },
   "Criar uma marca sensorial no espaço: um cheiro, uma música ou um material que seja sempre o mesmo": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Escolher um sentido para trabalhar",
     "Definir o cheiro, som ou material",
     "Aplicar em todos os pontos físicos",
     "Manter sem trocar por um ano"
    ],
    "setores": [
     "varejo",
     "servicos"
    ]
   },
   "Lembrar com o cliente os marcos da relação: um ano de parceria, um resultado alcançado": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Registrar a data de início de cada cliente",
     "Definir os marcos que vale celebrar",
     "Escrever uma mensagem para cada marco",
     "Enviar perto da data"
    ],
    "modelo": "Oi, [nome]! Hoje faz [tempo] que a gente trabalha junto. Nesse tempo, [resultado ou lembrança]. Obrigado pela confiança!"
   },
   "Escolher a palavra que a marca quer ocupar na cabeça do cliente e repeti-la em tudo": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Listar palavras que o cliente associa à categoria",
     "Escolher uma que a marca possa ter",
     "Usar em título, site e atendimento",
     "Medir na pesquisa se ela aparece"
    ]
   },
   "Levar o serviço até o cliente: atendimento em casa, na empresa dele ou online": {
    "tam": "G",
    "ler": 90,
    "passos": [
     "Ver quais serviços podem ser feitos fora",
     "Definir preço e logística",
     "Testar com 5 clientes",
     "Divulgar se funcionar"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Preparar 3 histórias curtas de clientes para contar nas conversas de venda": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escolher 3 clientes com perfis diferentes",
     "Escrever problema, virada e resultado",
     "Ensaiar contar em 1 minuto",
     "Usar conforme o perfil de quem ouve"
    ]
   },
   "Escolher um porta-voz da marca e treiná-lo para entrevistas, eventos e vídeos": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Escolher quem fala bem e representa a marca",
     "Escrever as 3 mensagens principais",
     "Treinar com gravações",
     "Buscar as primeiras oportunidades"
    ]
   },
   "Oferecer uma condição melhor nos horários e dias de pouco movimento": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Ver os horários e dias mais vazios",
     "Definir uma vantagem só para eles",
     "Divulgar para quem tem horário flexível",
     "Comparar a ocupação"
    ],
    "setores": [
     "servicos",
     "varejo"
    ]
   },
   "Cobrar mais pelo atendimento urgente ou fora do horário": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Definir o que é urgente ou fora do horário",
     "Escolher o acréscimo",
     "Deixar a regra clara na tabela",
     "Acompanhar quantos pedem"
    ],
    "setores": [
     "servicos"
    ]
   },
   "Separar do preço principal os extras que hoje saem de graça e cobrar por eles": {
    "tam": "M",
    "ler": 90,
    "passos": [
     "Listar tudo o que é entregue hoje",
     "Separar o essencial dos extras",
     "Dar preço a cada extra",
     "Apresentar na próxima tabela"
    ]
   }
  });
  Object.assign(window.GangPresets.detalhes, {
   "Ordenar listas de benefícios com o mais forte primeiro e o segundo mais forte por último": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Listar os benefícios usados no site e na proposta",
     "Escolher os 2 mais fortes",
     "Colocar um no início e outro no fim",
     "Cortar os fracos do meio"
    ]
   },
   "Pedir a alguém de fora que explique o serviço com as próprias palavras e reescrever a comunicação a partir disso": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Explicar o serviço a 3 pessoas de fora",
     "Pedir que cada uma explique de volta",
     "Anotar as palavras que usaram",
     "Reescrever o site com essas palavras"
    ]
   },
   "Personalizar as mensagens aos clientes com o nome e um detalhe da história de cada um": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Registrar um detalhe de cada cliente na ficha",
     "Usar nome e detalhe nas mensagens",
     "Comparar com mensagens genéricas",
     "Manter o que responder melhor"
    ]
   },
   "Oferecer um brinde ou um extra em vez de baixar o preço": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escolher um extra que custa pouco e vale muito",
     "Oferecer no lugar do desconto",
     "Deixar claro o valor do extra",
     "Comparar o fechamento e a margem"
    ]
   },
   "Anunciar em conteúdos e lugares ligados ao momento em que o cliente pensa no assunto": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Listar conteúdos e lugares ligados ao tema",
     "Escolher onde o anúncio vai aparecer",
     "Comparar com anúncios sem contexto",
     "Concentrar a verba onde render mais"
    ]
   },
   "Dar aos clientes um nome de grupo que eles tenham orgulho de ter, como \"cliente fundador\" ou \"membro\"": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escolher um nome de grupo que dê orgulho",
     "Dar a ele um sinal visível (cartão, selo)",
     "Usar o nome nas mensagens",
     "Medir indicações do grupo"
    ]
   },
   "Antes de aprovar o plano ou a campanha, pedir a alguém que defenda o contrário": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Escolher uma pessoa para fazer o papel do contra",
     "Apresentar o plano a ela",
     "Anotar as objeções",
     "Ajustar o que fizer sentido"
    ]
   },
   "Fazer uma vez por ano a auditoria da marca: tudo o que ela diz e faz, comparado com o que os clientes percebem": {
    "tam": "G",
    "ler": 365,
    "passos": [
     "Juntar peças, site, atendimento e proposta",
     "Comparar com a estratégia da marca",
     "Comparar com a pesquisa com clientes",
     "Escolher 3 correções para o ano"
    ]
   },
   "Dizer sempre o que a empresa é junto com o nome: \"Lume, clínica de estética\"": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Escrever uma frase curta com nome e categoria",
     "Usar no perfil, assinatura e anúncios",
     "Usar ao atender o telefone e o WhatsApp",
     "Testar com quem não conhece a marca"
    ]
   },
   "Ligar em até 48 horas para quem deu nota baixa na pesquisa e resolver o motivo": {
    "tam": "P",
    "ler": 60,
    "passos": [
     "Marcar as notas de 0 a 6 da pesquisa",
     "Ligar em até 48 horas",
     "Ouvir e resolver o motivo",
     "Registrar o problema para não repetir"
    ],
    "modelo": "Oi, [nome]! Vi sua resposta na nossa pesquisa e queria entender melhor o que não foi bom. Podemos conversar 10 minutos? Quero resolver isso com você."
   },
   "Começar todo relatório e e-mail importante ao cliente pela conclusão, em uma frase": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Escrever a conclusão em uma frase",
     "Colocar no início do texto",
     "Organizar os argumentos logo abaixo",
     "Cortar o que não sustenta a conclusão"
    ]
   },
   "Medir quanto a mais o cliente aceita pagar pela marca em comparação com a média do mercado": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Levantar o preço médio do mercado",
     "Comparar com o preço da empresa",
     "Ver se a taxa de fechamento se mantém",
     "Acompanhar a diferença a cada semestre"
    ]
   },
   "Calcular quais clientes dão lucro e quais dão prejuízo, contando o tempo gasto com cada um": {
    "tam": "M",
    "ler": 180,
    "passos": [
     "Anotar o tempo gasto com cada cliente",
     "Calcular o custo desse tempo",
     "Comparar com o que cada um paga",
     "Decidir o que renegociar ou atrair"
    ],
    "setores": [
     "servicos",
     "b2b"
    ]
   },
   "Antes de falar de uma causa ou propósito, conferir se a empresa já pratica o que vai dizer": {
    "tam": "P",
    "ler": 180,
    "passos": [
     "Listar as causas que a marca quer defender",
     "Anotar o que a empresa já faz por cada uma",
     "Comunicar só as que têm prova",
     "Planejar a prática das outras"
    ]
   },
   "Deixar o botão de contato ou de compra sempre visível no celular, em todas as páginas": {
    "tam": "P",
    "ler": 30,
    "passos": [
     "Abrir o site no celular",
     "Ver onde fica o contato em cada página",
     "Fixar um botão de contato na tela",
     "Comparar os contatos antes e depois"
    ]
   },
   "Comparar o retorno de cada canal a cada trimestre e passar verba do pior para o melhor": {
    "tam": "P",
    "ler": 90,
    "passos": [
     "Somar gasto e clientes de cada canal",
     "Calcular o custo por cliente de cada um",
     "Tirar parte da verba do pior",
     "Colocar no melhor e medir de novo"
    ]
   }
  });
  window.GangPresets.acoes.forEach((x) => { const d = window.GangPresets.detalhes[x.texto]; if (d) Object.assign(x, d); });
  window.GangPresets.SETORES = { servicos: 'Serviços', varejo: 'Varejo e lojas', b2b: 'Indústria e B2B' };
  window.GangPresets.TAMANHO = { P: ['P', 'até 1 hora', 1], M: ['M', 'até 1 dia', 2], G: ['G', 'uma semana ou mais', 4] };

  // ===== Narrativa: exemplos de "A marca diz" e "Nunca diz" (o consultor ajusta à marca) =====
  window.GangPresets.tomDiz = g('Clara e direta', [
    'Antes de começar, você recebe o plano do projeto inteiro.',
    'Você sabe o preço antes de fechar, sem surpresa no fim.',
    'Fazemos assim porque já testamos em muitos projetos.',
    'Se não for para você, a gente diz na primeira conversa.',
  ]).concat(g('Segura e com prova', [
    'Em 40 projetos, entregamos todos no prazo combinado.',
    'Você acompanha cada etapa e sabe o que vem depois.',
    'A gente mostra o resultado em números, não em promessas.',
  ]), g('Próxima e humana', [
    'Pode chamar no WhatsApp, quem responde é a equipe.',
    'A gente explica sem jargão, do jeito que você fala.',
    'Seu problema vira nosso problema até estar resolvido.',
  ]));
  window.GangPresets.tomNuncaDiz = g('Promessa vazia', [
    'O menor preço da região!',
    'Somos os melhores do mercado.',
    'Qualidade e excelência em tudo o que fazemos.',
    'Resultados garantidos ou seu dinheiro de volta (sem regra clara).',
  ]).concat(g('Pressão e exagero', [
    'Últimas vagas, corra antes que acabe!',
    'Oferta imperdível só hoje!!!',
    'Você não vai acreditar no que fizemos.',
  ]), g('Jargão e distância', [
    'Soluções inovadoras e disruptivas para o seu negócio.',
    'Prezado cliente, informamos que…',
    'Entregamos sinergia e valor agregado.',
  ]));
  // ===== Manutenção: cuidam de quem já é cliente. Valem, mas não fazem a marca crescer (a lealdade acompanha o tamanho da marca) =====
  window.GangPresets.MANUTENCAO = [
    "Ligar para os clientes atendidos há cerca de 30 dias",
    "Escrever e enviar para a base de clientes uma mensagem útil (dica, novidade ou caso), sem vender",
    "Fazer reunião de balanço com os clientes que concluíram projetos recentemente: o que funcionou e o que melhorar",
    "Escrever a mensagem de boas-vindas pós-compra, explicando os próximos passos",
    "Criar um ritual marcante na entrega (embalagem, boas-vindas, encerramento)",
    "Organizar um encontro ou evento para clientes (aula, café, visita ou lançamento)",
    "Criar uma regra para reclamações: responder no mesmo dia e resolver em até 48 horas",
    "Mandar um presente surpresa e personalizado para os melhores clientes, sem pedir nada em troca",
    "Enviar aos clientes atuais um resumo do que foi entregue e do resultado",
    "Criar um grupo de clientes com um encontro marcado e espaço para eles trocarem experiências"
  ];
  window.GangPresets.MANUTENCAO.push("Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar", "Marcar o próximo atendimento antes de o cliente ir embora");
  window.GangPresets.MANUTENCAO.push("Agradecer por escrito cada indicação recebida e contar o que aconteceu com ela", "Acompanhar de perto o cliente nas 2 primeiras semanas, quando o risco de desistência é maior", "Avisar o cliente que está usando pouco o serviço e oferecer ajuda antes que ele cancele", "Fazer uma revisão de resultados a cada trimestre com cada cliente grande");
  window.GangPresets.MANUTENCAO.push("Descobrir de quanto em quanto tempo o cliente volta a comprar e lembrá-lo perto da data", "Pedir uma conversa por ano com o dono ou o diretor de cada cliente B2B importante");
  window.GangPresets.MANUTENCAO.push("Lembrar com o cliente os marcos da relação: um ano de parceria, um resultado alcançado", "Ensinar o cliente a ficar melhor naquilo que ele quer fazer com o produto ou serviço", "Montar um conselho com 5 clientes que se reúne a cada semestre para opinar");
  window.GangPresets.MANUTENCAO.push("Ligar em até 48 horas para quem deu nota baixa na pesquisa e resolver o motivo", "Começar todo relatório e e-mail importante ao cliente pela conclusão, em uma frase");
  window.GangPresets.acoes.forEach((x) => { if (window.GangPresets.MANUTENCAO.includes(x.texto)) x.manutencao = true; });
  ['Cuidar do pós-venda: o cliente que volta e indica.', 'Entregar a promessa em cada atendimento.', 'Trazer de volta quem já comprou.'].forEach((f) => { if (window.GangPresets.modelosFoco[f]) window.GangPresets.modelosFoco[f].manutencao = true; });

  // ===== Prioridade no modelo de plano: a base vem primeiro =====
  // fundação (meses 1 e 2): a identidade nos canais próprios e o caminho de compra; presença (meses 3 e 4): prova e avaliações
  window.GangPresets.FUNDACAO = [
    "Atualizar redes sociais com a nova identidade",
    "Padronizar WhatsApp Business, assinatura de e-mail e modelos de documentos com a identidade da marca",
    "Cadastrar e completar o perfil da empresa no Google, nos mapas e nos marketplaces do setor",
    "Definir quem responde os contatos e criar respostas prontas para responder em até 1 hora",
    "Revisar o caminho de compra e cortar etapas: botão de WhatsApp, orçamento em 24h, Pix e cartão"
  ];
  window.GangPresets.PRESENCA = [
    "Responder no site as 5 perguntas que todo cliente faz, inclusive o preço",
    "Coletar e publicar depoimentos com nomes e números reais",
    "Pedir avaliação no Google aos clientes satisfeitos recentes e deixar o link pronto para os próximos"
  ];
  // ===== Diagnóstico, estratégia e narrativa ampliados: causas, situações de compra, condições, vereditos e tom de voz =====
  (() => {
    const P = window.GangPresets;
    P.causas.push(...g("Lembrança", ["Pouca gente lembra da marca quando precisa do serviço", "A marca é lembrada só por quem já é cliente", "A marca não está ligada às situações em que o cliente compra", "A comunicação fala do produto, e não do momento em que ele é usado"]), ...g("Ativos e identidade", ["Cada peça usa cores e estilos diferentes", "O logo e as cores mudaram várias vezes nos últimos anos", "O nome é difícil de dizer, escrever ou achar na busca", "A marca não tem um elemento próprio que as pessoas reconheçam"]), ...g("Fácil de comprar", ["A empresa é difícil de achar no Google e nos mapas", "O cliente demora para conseguir resposta ou orçamento", "Poucos canais de venda: o cliente precisa ir até a empresa", "Horários e formas de pagamento limitados"]), ...g("Valor e preço", ["Descontos frequentes ensinaram o cliente a esperar promoção", "O preço aparece antes do valor", "Faltam provas do resultado: casos, números e depoimentos", "A empresa tenta atender todo tipo de cliente"]), ...g("Experiência", ["O atendimento muda muito de pessoa para pessoa", "A promessa da venda não é cumprida na entrega", "Não há pós-venda: o cliente some depois da compra", "Reclamações demoram para ser resolvidas"]), ...g("Investimento", ["O investimento em comunicação é menor do que o tamanho da marca pede", "Só há anúncios de oferta, nada que construa a marca", "Ninguém mede de onde vêm os clientes"]));
    P.motivadores.push(...g("Por que compram", ["Indicação de alguém de confiança", "Rapidez para resolver", "Clareza no preço e no que está incluído", "Experiência boa da última vez", "Formas de pagamento", "Horário e disponibilidade", "Segurança de que vai dar certo"]));
    P.discriminadores.push(...g("O que diferencia", ["Atendimento feito por especialista", "Garantia por escrito", "Prazo menor que a média", "Acompanhamento depois da compra", "Estrutura ou tecnologia própria", "Item ou serviço exclusivo", "Mais avaliações e provas públicas", "Presença em mais lugares e canais"]));
    P.notam.push(...g("Como a marca é vista hoje", ["Avaliações boas no Google", "Atendimento difícil de conseguir", "Promoções o tempo todo", "Marca nova, pouco conhecida"]));
    P.acreditam.push(...g("Como a marca é vista hoje", ["Caro, mas vale o preço", "Bom, mas difícil de contratar", "Tradicional e confiável", "Moderna, mas pouco testada"]));
    P.sentem.push(...g("Como a marca é vista hoje", ["Indiferença", "Admiração", "Pressão na hora da venda", "Acolhimento"]));
    P.notar.push(...g("O que a comunicação busca", ["os resultados dos clientes", "o atendimento rápido", "o preço claro", "a marca na hora da compra"]));
    P.acreditar.push(...g("O que a comunicação busca", ["no atendimento", "no prazo", "no preço justo pelo que entrega", "na segurança da escolha"]));
    P.sentir.push(...g("O que a comunicação busca", ["alívio", "cuidado", "admiração", "pertencimento"]));
    P.situacoes.push(...g("Serviços", ["Preciso resolver antes de uma data importante", "Já tentei resolver sozinho e não deu", "Mudou a lei, a regra ou o prazo", "Vou crescer e preciso de ajuda"]), ...g("Varejo e alimentação", ["Estou passando perto e quero algo agora", "Vou receber visitas", "Quero comemorar algo", "Estou com pressa e quero algo prático", "Fim de semana em família"]), ...g("Saúde e beleza", ["Tenho um evento chegando", "Senti um incômodo", "Quero cuidar de mim", "Mudou a estação do ano"]), ...g("Empresas", ["O fornecedor atual falhou", "Começou o planejamento do ano", "Chegou verba nova", "Vou contratar ou trocar a equipe", "Uma auditoria ou fiscalização vai acontecer"]));
    P.prioridades.push(...g("Onde jogar", ["Clientes que compram com frequência", "Um nicho em que a empresa já tem casos de sucesso", "Clientes que chegam por indicação", "Os canais que já trazem mais clientes"]));
    P.deixados.push(...g("O que deixar", ["Clientes que exigem muito e pagam pouco", "Serviços que a equipe não entrega bem", "Canais caros sem retorno medido", "Projetos fora da especialidade"]));
    P.condicoes.push(...g("Clientes", ["Existe um grupo grande o bastante de clientes com essa necessidade", "Os clientes percebem a diferença e conseguem explicá-la", "O cliente decide por mais do que o preço"]), ...g("Concorrência", ["Nenhum concorrente forte ocupa essa posição", "Os concorrentes não conseguem responder só baixando o preço"]), ...g("Empresa", ["A empresa tem margem para investir em marca todo mês", "A equipe consegue manter o padrão de atendimento", "A empresa atende mais clientes sem perder qualidade"]), ...g("Canais", ["O cliente compra pelos canais onde a marca está"]));
    P.verificacoes.push(...g("Como verificar", ["Lembrança espontânea na pesquisa", "Clientes novos por mês", "Recompra dos clientes", "Origem dos clientes (\"como nos conheceu?\")", "Desconto médio do mês"]));
    P.naoFazer.push(...g("Atalhos que custam caro", ["Copiar a comunicação do concorrente", "Mudar de posicionamento a cada estação", "Responder a uma crise com silêncio", "Prometer prazo que não dá para cumprir", "Medir o sucesso por curtidas", "Dar desconto para fechar no fim do mês"]));
    P.pauta.push(...g("Outros temas", ["Ações travadas e como destravar", "O que o cliente adiantou e o que entrou no lugar", "Avaliações e comentários novos sobre a marca"]));
    P.respostasPeca.push(...g("Ajustes comuns", ["Uma ideia por peça: tire o que sobra.", "Coloque legenda no vídeo.", "Mostre a pessoa usando, do ponto de vista dela.", "Troque adjetivos por um fato ou um número."]));
    P.objetivos.push(...g("Marca e vendas", [{"texto": "faturamento em 18 meses, com mais clientes novos e mais recompra", "nivel": "negocio"}, {"texto": "margem em 12 meses, vendendo com menos desconto", "nivel": "negocio"}, {"texto": "clientes novos por mês em 12 meses", "nivel": "negocio"}]), ...g("Lembrança e presença", [{"texto": "Ser a primeira marca lembrada da categoria na região", "nivel": "marca"}, {"texto": "Ser conhecida pela especialidade, e não pelo preço", "nivel": "marca"}, {"texto": "Ficar fácil de encontrar e de comprar em todos os canais", "nivel": "marca"}]), ...g("Identidade", [{"texto": "Uma mensagem central repetida em todos os pontos de contato", "nivel": "comunicacao"}]));
    P.destaques.push(...g('Marca e vendas', ['+15%', '+25%', '+40%']));
    P.vereditos.push(...g("No rumo", ["A recompra subiu: quem compra está voltando mais vezes.", "Mais pessoas chegaram por canais novos: a marca está mais fácil de encontrar."]));
    P.vereditos.push(...g("Atenção", ["Muita gente pede orçamento, mas poucos fecham: o problema está na conversa de venda, não na marca.", "Os clientes novos vêm quase todos de um canal só: dependemos demais dele.", "As ações travaram por falta de tempo: o próximo mês terá menos ações e mais simples."]));
    P.vereditos.push(...g("Ajuste", ["Os clientes não estão voltando: o pós-venda vira prioridade.", "A equipe não está aplicando a mensagem central: vamos treinar de novo."]));
    P.notasVendas.push(...g("Venda mais", ["Os pedidos de orçamento continuaram, mas fechamos menos: vamos rever as objeções e a proposta.", "Um cliente grande saiu e pesou no mês; a base de clientes novos segue crescendo."]));
    P.notasPessoas.push(...g("Para mais pessoas", ["Os clientes novos vieram quase todos de um canal; vamos abrir um segundo canal.", "A marca apareceu menos no período de pico; o calendário do próximo ano já prevê isso."]));
    P.notasValor.push(...g("Com mais valor", ["Os extras que saíam de graça entraram na tabela; o ticket deve subir nos próximos meses.", "Clientes novos começam pelo serviço menor; a oferta do próximo serviço já está no plano."]));
    P.tom.push(...g("Identidade", [{"texto": "Calma", "descricao": "Sem pressa, transmite controle"}, {"texto": "Alegre", "descricao": "Leve e otimista"}, {"texto": "Exigente", "descricao": "Alto padrão, atenção ao detalhe"}, {"texto": "Didática", "descricao": "Ensina e explica o porquê"}, {"texto": "Irreverente", "descricao": "Humor com propósito"}]));
    P.tomDiz.push(...g("Didática e paciente", ["Vamos por partes: primeiro, o mais importante.", "Se ficar alguma dúvida, a gente explica de novo.", "Fazemos assim por um motivo: ele evita retrabalho para você."]), ...g("Cuidadosa e exclusiva", ["Atendemos poucos clientes por vez, para cuidar de cada um.", "Cada detalhe é conferido antes de chegar até você."]));
    P.tomNuncaDiz.push(...g("Fria e burocrática", ["Conforme política da empresa, não é possível.", "Isso não é com este setor."]), ...g("Culpa o cliente", ["Você deveria ter avisado antes.", "Isso não é problema nosso."]));
    // os menus do painel agrupam pelo rótulo: nenhum nome de autor aparece, só o tema (as ações já usam o tema)
    const ROT = { 'Sharp & Romaniuk': 'Lembrança e presença', 'Binet & Field': 'Marca e vendas', JWT: 'Planejamento', 'Roger Martin': 'Escolhas estratégicas', Kapferer: 'Identidade', 'Ehrenberg-Bass': 'Crescimento', Berry: 'Serviço' };
    Object.entries(P).forEach(([k, v]) => {
      if (k === 'acoes' || !Array.isArray(v)) return;
      v.forEach((x) => { if (x && typeof x === 'object' && x.grupo) { if (ROT[x.grupo]) x.grupo = ROT[x.grupo]; else if (x.grupo.includes('·')) x.grupo = 'Outras da biblioteca'; } });
    });
    // listas que eram de um grupo só: os itens de antes ficam em "Mais comuns", ao lado dos grupos novos
    ['causas', 'situacoes', 'motivadores', 'discriminadores', 'notam', 'acreditam', 'sentem', 'notar', 'acreditar', 'sentir', 'prioridades', 'deixados', 'condicoes', 'verificacoes', 'tom']
      .forEach((k) => (P[k] || []).forEach((x) => { if (Object.values(ROT).includes(x.grupo)) x.grupo = 'Mais comuns'; }));
  })();
  // ===== Métricas, pontos de contato e ativos ampliados (métricas de marketing, ativos distintivos e guias de identidade) =====
  (() => {
    const P = window.GangPresets;
    P.metricas.push(...g("Clientes", [{"texto": "Recompra (clientes que voltaram a comprar)", "nivel": "negocio", "frequencia": "semestral"}, {"texto": "Valor do cliente ao longo do tempo", "nivel": "negocio", "frequencia": "semestral"}, {"texto": "Nota de recomendação (0 a 10)", "nivel": "marca", "frequencia": "semestral"}, {"texto": "Avaliações no Google (nota e quantidade)", "nivel": "marca", "frequencia": "mensal"}]), ...g("Vendas", [{"texto": "Taxa de fechamento dos orçamentos", "nivel": "negocio", "frequencia": "mensal"}, {"texto": "Tempo de resposta aos contatos", "nivel": "marketing", "frequencia": "mensal"}, {"texto": "Custo por cliente novo", "nivel": "marketing", "frequencia": "mensal"}]), ...g("Preço", [{"texto": "Desconto médio concedido", "nivel": "negocio", "frequencia": "mensal"}, {"texto": "Preço acima da média do mercado", "nivel": "marca", "frequencia": "semestral"}, {"texto": "Margem por serviço ou produto", "nivel": "negocio", "frequencia": "semestral"}]));
    P.pontosContato.push(...g("Pontos de contato", ["Sinalização e placas", "Ambiente e sala de espera", "Balcão e caixa", "Sacola e embalagem de entrega", "Cardápio ou catálogo", "Apresentação comercial", "Proposta", "Nota fiscal, boleto e recibo", "Mensagens automáticas", "Crachá da equipe", "LinkedIn da empresa e dos sócios", "Aplicativos de entrega e marketplaces", "Vídeos e reels"]));
    P.nomesAtivo.push(...g("Ativos", ["Logotipo (o nome desenhado)", "Mascote", "Embalagem", "Forma do produto", "Ilustração própria", "Estilo de foto", "Fonte própria", "Jingle", "Cheiro do ambiente"]));
    P.nomesCor.push(...g("Cores", ["Terciária", "Texto", "Neutra", "Alerta"]));
    P.usosFonte.push(...g("Usos", ["Legendas e textos pequenos", "Sinalização e fachada", "Botões e chamadas"]));
    P.comQuem.push(...g("Equipe do cliente", ["Financeiro", "Operação", "Recepção", "Designer", "Fotógrafo ou videomaker"]));
    ['pontosContato', 'nomesAtivo', 'nomesCor', 'usosFonte', 'metricas'].forEach((k) => P[k].forEach((x) => { if (['Identidade', 'Lembrança e presença', 'Marca e vendas', 'Planejamento'].includes(x.grupo) && k !== 'metricas') x.grupo = 'Mais comuns'; }));
  })();
})();

// ===== Quem a marca é: respostas prontas para as seis facetas (prisma de identidade) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const g = (grupo, itens) => itens.map((texto) => ({ grupo, texto }));
  Object.assign(P, {
    facetaAparencia: g('Mais comuns', [
      'Limpa e organizada: muito espaço, poucos elementos, tudo no lugar',
      'Técnica e precisa: números, detalhes e prova à vista',
      'Calorosa e próxima: pessoas reais, cores quentes, fotos do dia a dia',
      'Sofisticada e discreta: tons sóbrios, acabamento caprichado, nada em excesso',
      'Ousada e chamativa: cor forte, contraste alto, impossível de ignorar',
      'Natural e artesanal: texturas, materiais reais, feito à mão',
      'Moderna e tecnológica: interfaces, linhas finas, sensação de novidade',
      'Tradicional e sólida: elementos clássicos que passam história e segurança',
      'Divertida e leve: ilustração, humor e cores alegres',
      'Funcional antes de bonita: tudo serve para facilitar a escolha',
    ]),
    facetaPersonalidade: g('Mais comuns', [
      'Especialista que explica sem complicar',
      'Parceira confiável, que cumpre o que promete',
      'Direta e objetiva, sem rodeio nem exagero',
      'Acolhedora e paciente, que escuta antes de falar',
      'Inquieta e inovadora, que sempre testa algo novo',
      'Exigente com detalhes, quase perfeccionista',
      'Bem-humorada, que não se leva a sério demais',
      'Firme e corajosa, que diz o que os outros evitam',
      'Discreta e elegante, que fala pouco e entrega muito',
      'Mão na massa, prática e resolutiva',
    ]),
    facetaValores: g('Mais comuns', [
      'Fazer certo da primeira vez',
      'Transparência em preço, prazo e problemas',
      'Respeito ao tempo do cliente',
      'Qualidade acima de volume',
      'Cuidado com cada pessoa, não com o “caso”',
      'Aprender e melhorar sempre',
      'Compromisso com a cidade e a comunidade local',
      'Responsabilidade com o ambiente e com o que se descarta',
      'Simplicidade: tirar o que não precisa',
      'Honestidade, mesmo quando custa uma venda',
    ]),
    facetaRelacao: g('Mais comuns', [
      'Conselheira: orienta e ajuda a decidir',
      'Parceira de longo prazo: acompanha antes, durante e depois',
      'Anfitriã: recebe bem e faz sentir em casa',
      'Professora: ensina para o cliente decidir sozinho',
      'Guardiã: protege de erro, risco e dor de cabeça',
      'Resolvedora: chega, resolve e não deixa pendência',
      'Cúmplice: está do lado do cliente, contra o problema',
      'Exclusiva: atendimento sob medida, poucos clientes por vez',
    ]),
    facetaClienteProjetado: g('Mais comuns', [
      'Quem valoriza fazer bem feito e não aceita gambiarra',
      'Quem decide com informação e compara antes de comprar',
      'Quem tem pouco tempo e quer alguém de confiança',
      'Quem cuida da família e pensa no longo prazo',
      'Quem gosta de estar à frente e testar o novo',
      'Quem tem bom gosto e repara nos detalhes',
      'Quem prefere apoiar empresas da região',
      'Empresa séria, que investe para crescer',
    ]),
    facetaAutoimagem: g('Mais comuns', [
      'Fiz uma escolha inteligente',
      'Estou em boas mãos',
      'Me sinto cuidado e respeitado',
      'Faço parte de um grupo que entende do assunto',
      'Investi em mim (ou na minha empresa) do jeito certo',
      'Não preciso me preocupar com isso agora',
      'Tenho bom gosto',
      'Estou ajudando algo maior do que a compra',
    ]),
  });
})();


// ===== Rodada 8: mais opções para todas as respostas prontas do consultor (biblioteca do Drive; sem repetir as que já existem) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  if (P.donos) P.donos.push(...[{"grupo": "Da biblioteca", "texto": "Sócio(a) responsável"}, {"grupo": "Da biblioteca", "texto": "Equipe de vendas"}, {"grupo": "Da biblioteca", "texto": "Equipe de atendimento"}, {"grupo": "Da biblioteca", "texto": "Agência parceira"}]);
  if (P.notasVendas) P.notasVendas.push(...[{"grupo": "Da biblioteca", "texto": "Os orçamentos de agora viram venda daqui a alguns meses: o ciclo de compra desta categoria é longo."}, {"grupo": "Da biblioteca", "texto": "Feriados e férias reduziram os dias úteis; por dia trabalhado, vendemos o mesmo que no mês anterior."}, {"grupo": "Da biblioteca", "texto": "A procura existe, mas a equipe demorou a responder; tempo de resposta virou meta do mês."}, {"grupo": "Da biblioteca", "texto": "O mês anterior foi atípico (pedido grande ou data especial), então a comparação engana."}, {"grupo": "Da biblioteca", "texto": "Faltou estoque ou agenda para atender tudo o que entrou; o gargalo foi a operação, não a marca."}]);
  if (P.notasPessoas) P.notasPessoas.push(...[{"grupo": "Da biblioteca", "texto": "Muitos clientes novos experimentaram e não voltaram; o primeiro atendimento precisa melhorar."}, {"grupo": "Da biblioteca", "texto": "Quem chegou neste mês não conhecia a marca antes: sinal de alcance novo, mesmo com poucas vendas."}, {"grupo": "Da biblioteca", "texto": "A busca pelo nome da marca subiu, mas o site e o WhatsApp não converteram essa procura."}, {"grupo": "Da biblioteca", "texto": "Clientes antigos sumiram sem reclamar; vamos ligar para entender o motivo."}, {"grupo": "Da biblioteca", "texto": "Os clientes que mais compram são poucos; a base precisa de mais gente comprando de vez em quando."}]);
  if (P.notasValor) P.notasValor.push(...[{"grupo": "Da biblioteca", "texto": "Vendemos mais pacotes completos, o que puxou o ticket para cima."}, {"grupo": "Da biblioteca", "texto": "O reajuste de preço entrou neste mês e quase ninguém reclamou: a percepção de valor aguenta."}, {"grupo": "Da biblioteca", "texto": "Os clientes que vieram por indicação gastaram mais que os de anúncio."}, {"grupo": "Da biblioteca", "texto": "A tabela nova com três opções fez mais gente escolher a do meio."}, {"grupo": "Da biblioteca", "texto": "Clientes compararam só o preço porque a proposta não mostrava o que está incluído."}]);
  if (P.usosFonte) P.usosFonte.push(...[{"grupo": "Da biblioteca", "texto": "Embalagem e rótulos"}, {"grupo": "Da biblioteca", "texto": "Apresentações e relatórios"}, {"grupo": "Da biblioteca", "texto": "Assinatura de vídeo e reels"}, {"grupo": "Da biblioteca", "texto": "Cardápio, catálogo e tabela de preços"}, {"grupo": "Da biblioteca", "texto": "Citações e frases da marca"}]);
  if (P.destaques) P.destaques.push(...[{"grupo": "Da biblioteca", "texto": "+5%"}, {"grupo": "Da biblioteca", "texto": "+35%"}, {"grupo": "Da biblioteca", "texto": "+60%"}, {"grupo": "Da biblioteca", "texto": "+80%"}, {"grupo": "Da biblioteca", "texto": "+100 clientes"}, {"grupo": "Da biblioteca", "texto": "3x"}]);
  if (P.notar) P.notar.push(...[{"grupo": "Da biblioteca", "texto": "as avaliações dos clientes"}, {"grupo": "Da biblioteca", "texto": "a cor e o símbolo da marca"}, {"grupo": "Da biblioteca", "texto": "a garantia"}, {"grupo": "Da biblioteca", "texto": "que a marca está em todo lugar"}, {"grupo": "Da biblioteca", "texto": "o cuidado com os detalhes"}, {"grupo": "Da biblioteca", "texto": "quem está por trás da empresa"}, {"grupo": "Da biblioteca", "texto": "a facilidade de contratar"}]);
  if (P.acreditar) P.acreditar.push(...[{"grupo": "Da biblioteca", "texto": "na experiência da equipe"}, {"grupo": "Da biblioteca", "texto": "que a marca entende o problema dele"}, {"grupo": "Da biblioteca", "texto": "que é a escolha mais segura da categoria"}, {"grupo": "Da biblioteca", "texto": "que vale mais do que custa"}, {"grupo": "Da biblioteca", "texto": "que a empresa vai estar lá depois da venda"}, {"grupo": "Da biblioteca", "texto": "que a marca é a especialista da região"}, {"grupo": "Da biblioteca", "texto": "nas boas intenções da empresa"}, {"grupo": "Da biblioteca", "texto": "que outras pessoas como ele já escolheram"}]);
  if (P.sentir) P.sentir.push(...[{"grupo": "Da biblioteca", "texto": "tranquilidade"}, {"grupo": "Da biblioteca", "texto": "controle"}, {"grupo": "Da biblioteca", "texto": "entusiasmo"}, {"grupo": "Da biblioteca", "texto": "reconhecimento"}, {"grupo": "Da biblioteca", "texto": "gratidão"}, {"grupo": "Da biblioteca", "texto": "leveza"}, {"grupo": "Da biblioteca", "texto": "exclusividade"}, {"grupo": "Da biblioteca", "texto": "otimismo"}]);
  if (P.facetaAparencia) P.facetaAparencia.push(...[{"grupo": "Da biblioteca", "texto": "Reconhecível de longe: uma cor e uma forma que se repetem em tudo"}, {"grupo": "Da biblioteca", "texto": "Editorial e elegante: fotografia forte e muito respiro"}, {"grupo": "Da biblioteca", "texto": "Brasileira e vibrante: cores e referências locais com orgulho"}, {"grupo": "Da biblioteca", "texto": "Clínica e confiável: branco, azul e organização impecável"}, {"grupo": "Da biblioteca", "texto": "Robusta e industrial: materiais crus, peso e resistência"}, {"grupo": "Da biblioteca", "texto": "Gourmet e sensorial: textura, close e apetite"}, {"grupo": "Da biblioteca", "texto": "Infantil sem ser bobinha: formas arredondadas e cor alegre com cuidado"}, {"grupo": "Da biblioteca", "texto": "Minimalista de luxo: quase nada, e tudo de ótima qualidade"}]);
  if (P.facetaPersonalidade) P.facetaPersonalidade.push(...[{"grupo": "Da biblioteca", "texto": "Calorosa e competente ao mesmo tempo: cuida e resolve"}, {"grupo": "Da biblioteca", "texto": "Generosa: ensina e compartilha o que sabe sem pedir nada"}, {"grupo": "Da biblioteca", "texto": "Otimista e animada, que contagia quem está perto"}, {"grupo": "Da biblioteca", "texto": "Rebelde com causa, que desafia o jeito antigo da categoria"}, {"grupo": "Da biblioteca", "texto": "Sábia e serena, que fala com a calma de quem já viu de tudo"}, {"grupo": "Da biblioteca", "texto": "Curiosa, que pergunta antes de propor"}, {"grupo": "Da biblioteca", "texto": "Humilde, que admite erro e corrige rápido"}, {"grupo": "Da biblioteca", "texto": "Protetora, que antecipa problemas antes do cliente perceber"}]);
  if (P.facetaValores) P.facetaValores.push(...[{"grupo": "Da biblioteca", "texto": "Boas intenções antes do lucro do mês"}, {"grupo": "Da biblioteca", "texto": "Assumir o erro e corrigir sem empurrar a culpa"}, {"grupo": "Da biblioteca", "texto": "Valorizar quem faz: equipe bem tratada atende melhor"}, {"grupo": "Da biblioteca", "texto": "Acessibilidade: tornar bom e simples o que era caro e complicado"}, {"grupo": "Da biblioteca", "texto": "Tradição com cuidado: manter o que funciona há anos"}, {"grupo": "Da biblioteca", "texto": "Coragem de dizer não ao cliente errado"}, {"grupo": "Da biblioteca", "texto": "Inclusão: todo cliente tratado com o mesmo respeito"}, {"grupo": "Da biblioteca", "texto": "Pontualidade como forma de respeito"}]);
  if (P.facetaRelacao) P.facetaRelacao.push(...[{"grupo": "Da biblioteca", "texto": "Mentora: desafia o cliente a pensar diferente e crescer"}, {"grupo": "Da biblioteca", "texto": "Amiga experiente: fala a verdade, mesmo a que incomoda"}, {"grupo": "Da biblioteca", "texto": "Concierge: resolve tudo em um só lugar, sem o cliente correr atrás"}, {"grupo": "Da biblioteca", "texto": "Comunidade: reúne clientes que se ajudam entre si"}, {"grupo": "Da biblioteca", "texto": "Fornecedora fiel: sempre igual, sempre no prazo, sem surpresa"}, {"grupo": "Da biblioteca", "texto": "Companheira de rotina: presente no dia a dia, sem cerimônia"}]);
  if (P.facetaClienteProjetado) P.facetaClienteProjetado.push(...[{"grupo": "Da biblioteca", "texto": "Quem sabe o que quer e não perde tempo"}, {"grupo": "Da biblioteca", "texto": "Quem tem orgulho do próprio negócio e cuida da imagem"}, {"grupo": "Da biblioteca", "texto": "Gente comum que faz escolhas inteligentes"}, {"grupo": "Da biblioteca", "texto": "Quem pensa em quem vem depois: família, equipe, cidade"}, {"grupo": "Da biblioteca", "texto": "Quem não se contenta com o básico"}, {"grupo": "Da biblioteca", "texto": "Profissional respeitado na própria área"}]);
  if (P.facetaAutoimagem) P.facetaAutoimagem.push(...[{"grupo": "Da biblioteca", "texto": "Sou alguém que cuida do que é importante"}, {"grupo": "Da biblioteca", "texto": "Tomei a decisão de quem entende do assunto"}, {"grupo": "Da biblioteca", "texto": "Fiz a escolha mais segura e não vou me arrepender"}, {"grupo": "Da biblioteca", "texto": "Estou no controle da situação"}, {"grupo": "Da biblioteca", "texto": "Sou reconhecido por ter escolhido bem"}, {"grupo": "Da biblioteca", "texto": "Estou apoiando gente que faz bem feito"}]);
  if (P.acreditam) P.acreditam.push(...[{"grupo": "Da biblioteca", "texto": "Faz bem, mas demora"}, {"grupo": "Da biblioteca", "texto": "Só para clientes grandes"}, {"grupo": "Da biblioteca", "texto": "Boa só para o básico"}, {"grupo": "Da biblioteca", "texto": "Antiga, parou no tempo"}, {"grupo": "Da biblioteca", "texto": "Atende bem, mas cobra extra por tudo"}, {"grupo": "Da biblioteca", "texto": "Muito parecida com a concorrente"}, {"grupo": "Da biblioteca", "texto": "Confiável, mas cara para o que entrega"}]);
  if (P.sentem) P.sentem.push(...[{"grupo": "Da biblioteca", "texto": "Curiosidade"}, {"grupo": "Da biblioteca", "texto": "Insegurança sobre o resultado"}, {"grupo": "Da biblioteca", "texto": "Cansaço de tanta promoção"}, {"grupo": "Da biblioteca", "texto": "Orgulho de ser cliente"}, {"grupo": "Da biblioteca", "texto": "Frustração com o pós-venda"}, {"grupo": "Da biblioteca", "texto": "Tranquilidade"}, {"grupo": "Da biblioteca", "texto": "Impaciência com a demora"}]);
  if (P.notam) P.notam.push(...[{"grupo": "Da biblioteca", "texto": "Site fraco ou desatualizado"}, {"grupo": "Da biblioteca", "texto": "Fachada e ambiente bem cuidados"}, {"grupo": "Da biblioteca", "texto": "Equipe uniformizada e organizada"}, {"grupo": "Da biblioteca", "texto": "Pouca informação sobre preço e serviços"}, {"grupo": "Da biblioteca", "texto": "Fotos de clientes e casos reais"}, {"grupo": "Da biblioteca", "texto": "Comunicação parecida com a dos concorrentes"}, {"grupo": "Da biblioteca", "texto": "Marca presente em eventos da região"}, {"grupo": "Da biblioteca", "texto": "Embalagem bonita e reconhecível"}]);
  if (P.prioridades) P.prioridades.push(...[{"grupo": "Da biblioteca", "texto": "Clientes que já compraram e podem voltar a comprar"}, {"grupo": "Da biblioteca", "texto": "Quem ainda não compra da categoria na região"}, {"grupo": "Da biblioteca", "texto": "As situações de compra em que a marca é mais lembrada"}, {"grupo": "Da biblioteca", "texto": "O serviço que traz o cliente para os outros"}, {"grupo": "Da biblioteca", "texto": "Empresas com quem já há relacionamento"}, {"grupo": "Da biblioteca", "texto": "Os meses de maior procura da categoria"}]);
  if (P.deixados) P.deixados.push(...[{"grupo": "Da biblioteca", "texto": "Concorrer em licitações só pelo menor preço"}, {"grupo": "Da biblioteca", "texto": "Personalizações que travam a operação"}, {"grupo": "Da biblioteca", "texto": "Clientes que pedem prazo impossível"}, {"grupo": "Da biblioteca", "texto": "Produtos com estoque parado"}, {"grupo": "Da biblioteca", "texto": "Parcerias que não combinam com a marca"}, {"grupo": "Da biblioteca", "texto": "Datas promocionais que só derrubam a margem"}, {"grupo": "Da biblioteca", "texto": "Canais em que a marca não consegue manter o padrão"}]);
  if (P.nomesCor) P.nomesCor.push(...[{"grupo": "Da biblioteca", "texto": "Primária escura"}, {"grupo": "Da biblioteca", "texto": "Primária clara"}, {"grupo": "Da biblioteca", "texto": "Sucesso"}, {"grupo": "Da biblioteca", "texto": "Erro"}, {"grupo": "Da biblioteca", "texto": "Link"}, {"grupo": "Da biblioteca", "texto": "Linha e borda"}, {"grupo": "Da biblioteca", "texto": "Superfície"}, {"grupo": "Da biblioteca", "texto": "Cor de campanha"}]);
  if (P.comQuem) P.comQuem.push(...[{"grupo": "Da biblioteca", "texto": "Contador"}, {"grupo": "Da biblioteca", "texto": "Gerente da loja"}, {"grupo": "Da biblioteca", "texto": "TI ou desenvolvedor"}, {"grupo": "Da biblioteca", "texto": "Arquiteto ou decorador"}, {"grupo": "Da biblioteca", "texto": "Gráfica"}, {"grupo": "Da biblioteca", "texto": "Social media"}]);
  if (P.verificacoes) P.verificacoes.push(...[{"grupo": "Da biblioteca", "texto": "Busca pelo nome da marca no Google"}, {"grupo": "Da biblioteca", "texto": "Nota e número de avaliações no Google"}, {"grupo": "Da biblioteca", "texto": "Leitura das reclamações e comentários"}, {"grupo": "Da biblioteca", "texto": "Visita como cliente oculto"}, {"grupo": "Da biblioteca", "texto": "Conversa mensal com cinco clientes"}, {"grupo": "Da biblioteca", "texto": "Margem por serviço no fechamento do mês"}, {"grupo": "Da biblioteca", "texto": "Tempo de resposta a contatos novos"}, {"grupo": "Da biblioteca", "texto": "Pedidos de orçamento por canal"}, {"grupo": "Da biblioteca", "texto": "Ocupação da agenda ou da produção"}, {"grupo": "Da biblioteca", "texto": "Pesquisa de recomendação (0 a 10)"}]);
  if (P.objetivos) P.objetivos.push(...[{"grupo": "Da biblioteca", "texto": "ticket médio em 12 meses, sem perder clientes", "nivel": "negocio"}, {"grupo": "Da biblioteca", "texto": "recompra em 12 meses, com clientes voltando mais vezes", "nivel": "negocio"}, {"grupo": "Da biblioteca", "texto": "clientes vindos de indicação em 12 meses", "nivel": "negocio"}, {"grupo": "Da biblioteca", "texto": "Ser associada a um benefício claro, e não a todos", "nivel": "marca"}, {"grupo": "Da biblioteca", "texto": "Ser vista como calorosa e competente ao mesmo tempo", "nivel": "marca"}, {"grupo": "Da biblioteca", "texto": "Ter ativos que as pessoas reconhecem e ligam só à marca", "nivel": "marca"}, {"grupo": "Da biblioteca", "texto": "Ser considerada por quem ainda não compra da categoria", "nivel": "marca"}, {"grupo": "Da biblioteca", "texto": "Contar uma história que o cliente consiga repetir", "nivel": "comunicacao"}, {"grupo": "Da biblioteca", "texto": "Mostrar provas em vez de promessas em todas as peças", "nivel": "comunicacao"}, {"grupo": "Da biblioteca", "texto": "Manter presença constante o ano todo, sem pausas longas", "nivel": "comunicacao"}]);
  if (P.respostasPeca) P.respostasPeca.push(...[{"grupo": "Da biblioteca", "texto": "Use um número preciso no lugar de um número redondo."}, {"grupo": "Da biblioteca", "texto": "Mostre quantas pessoas já escolheram a marca."}, {"grupo": "Da biblioteca", "texto": "Admita um pequeno defeito: aumenta a confiança no resto."}, {"grupo": "Da biblioteca", "texto": "Mostre o trabalho que vai por trás, não só o resultado."}, {"grupo": "Da biblioteca", "texto": "Deixe a peça mais concreta: uma cena, não um conceito."}, {"grupo": "Da biblioteca", "texto": "Ancore o preço: mostre primeiro a opção mais completa."}, {"grupo": "Da biblioteca", "texto": "Termine bem: o final é o que fica na memória."}, {"grupo": "Da biblioteca", "texto": "Falta emoção: mostre uma pessoa, não só o produto."}, {"grupo": "Da biblioteca", "texto": "Está parecida demais com a concorrência: use o que é só nosso."}, {"grupo": "Da biblioteca", "texto": "Texto longo demais para o lugar onde vai aparecer."}, {"grupo": "Da biblioteca", "texto": "Imagem com baixa qualidade: troque antes de publicar."}, {"grupo": "Da biblioteca", "texto": "Reprovado: fora da estratégia; vamos conversar no encontro."}]);
  if (P.tom) P.tom.push(...[{"grupo": "Da biblioteca", "texto": "Calorosa", "descricao": "Mostra que se importa antes de vender"}, {"grupo": "Da biblioteca", "texto": "Confiante", "descricao": "Afirma sem precisar provar a cada frase"}, {"grupo": "Da biblioteca", "texto": "Honesta", "descricao": "Diz o que faz e o que não faz"}, {"grupo": "Da biblioteca", "texto": "Inspiradora", "descricao": "Mostra o que é possível, com os pés no chão"}, {"grupo": "Da biblioteca", "texto": "Clara", "descricao": "Uma ideia por frase, palavras do dia a dia"}, {"grupo": "Da biblioteca", "texto": "Curiosa", "descricao": "Pergunta, escuta e só então propõe"}]);
  if (P.motivadores) P.motivadores.push(...[{"grupo": "Da biblioteca", "texto": "Higiene e organização do lugar"}, {"grupo": "Da biblioteca", "texto": "Facilidade de encontrar e falar com a empresa"}, {"grupo": "Da biblioteca", "texto": "Respeito ao horário marcado"}, {"grupo": "Da biblioteca", "texto": "Cumprir o orçamento sem surpresa"}, {"grupo": "Da biblioteca", "texto": "Equipe educada e preparada"}, {"grupo": "Da biblioteca", "texto": "Resolver o problema na primeira vez"}]);
  if (P.discriminadores) P.discriminadores.push(...[{"grupo": "Da biblioteca", "texto": "Fala com o cliente em linguagem simples"}, {"grupo": "Da biblioteca", "texto": "Mostra os bastidores e o processo"}, {"grupo": "Da biblioteca", "texto": "Atende em horários que os outros não atendem"}, {"grupo": "Da biblioteca", "texto": "Personaliza para cada cliente"}, {"grupo": "Da biblioteca", "texto": "Tem um elemento visual que todos reconhecem"}, {"grupo": "Da biblioteca", "texto": "É de fato da região e conhece o cliente"}, {"grupo": "Da biblioteca", "texto": "Assume e resolve erros rápido"}, {"grupo": "Da biblioteca", "texto": "Ensina o cliente a decidir melhor"}]);
  if (P.tomNuncaDiz) P.tomNuncaDiz.push(...[{"grupo": "Da biblioteca", "texto": "Garantimos 100% de satisfação."}, {"grupo": "Da biblioteca", "texto": "Atendimento humanizado."}, {"grupo": "Da biblioteca", "texto": "Somos referência no mercado."}, {"grupo": "Da biblioteca", "texto": "Clique aqui e saiba mais."}, {"grupo": "Da biblioteca", "texto": "Aproveite enquanto dura!"}, {"grupo": "Da biblioteca", "texto": "Não perca essa oportunidade única."}, {"grupo": "Da biblioteca", "texto": "Isso é padrão, todo mundo faz assim."}, {"grupo": "Da biblioteca", "texto": "Seu pedido é muito importante para nós."}]);
  if (P.tomDiz) P.tomDiz.push(...[{"grupo": "Da biblioteca", "texto": "Erramos aqui, e já corrigimos assim."}, {"grupo": "Da biblioteca", "texto": "Esse serviço não é para você, e indicamos quem faz bem."}, {"grupo": "Da biblioteca", "texto": "312 clientes já fizeram isso com a gente."}, {"grupo": "Da biblioteca", "texto": "Você fala com a mesma pessoa do começo ao fim."}, {"grupo": "Da biblioteca", "texto": "Olha como fica antes de pagar."}, {"grupo": "Da biblioteca", "texto": "Se atrasar, você sabe antes, e por quê."}, {"grupo": "Da biblioteca", "texto": "Pergunta o que quiser: a gente responde até o preço."}, {"grupo": "Da biblioteca", "texto": "Já vimos esse problema muitas vezes; tem solução."}]);
  if (P.condicoes) P.condicoes.push(...[{"grupo": "Da biblioteca", "texto": "O cliente percebe a marca nos momentos em que decide"}, {"grupo": "Da biblioteca", "texto": "Os ativos da marca são reconhecidos sem o nome"}, {"grupo": "Da biblioteca", "texto": "A marca consegue manter presença o ano todo"}, {"grupo": "Da biblioteca", "texto": "O preço maior é sustentado pela experiência"}, {"grupo": "Da biblioteca", "texto": "Quem compra uma vez tem motivo para voltar"}, {"grupo": "Da biblioteca", "texto": "Os clientes indicam a marca sem ser pedidos"}, {"grupo": "Da biblioteca", "texto": "A equipe entende e repete a mensagem central"}, {"grupo": "Da biblioteca", "texto": "A categoria continua crescendo na região"}]);
  if (P.nomesAtivo) P.nomesAtivo.push(...[{"grupo": "Da biblioteca", "texto": "Degradê da marca"}, {"grupo": "Da biblioteca", "texto": "Ícones próprios"}, {"grupo": "Da biblioteca", "texto": "Forma da fachada ou da loja"}, {"grupo": "Da biblioteca", "texto": "Uniforme"}, {"grupo": "Da biblioteca", "texto": "Gesto ou bordão do atendimento"}]);
  if (P.pauta) P.pauta.push(...[{"grupo": "Da biblioteca", "texto": "O que os clientes disseram neste mês"}, {"grupo": "Da biblioteca", "texto": "Ativos da marca: estão sendo usados?"}, {"grupo": "Da biblioteca", "texto": "Preço e descontos do mês"}, {"grupo": "Da biblioteca", "texto": "Concorrentes: o que mudou"}, {"grupo": "Da biblioteca", "texto": "O que aprendemos com uma peça que não funcionou"}, {"grupo": "Da biblioteca", "texto": "Próximas datas da categoria"}]);
  if (P.naoFazer) P.naoFazer.push(...[{"grupo": "Da biblioteca", "texto": "Esconder o preço quando o cliente pergunta"}, {"grupo": "Da biblioteca", "texto": "Falar de si sem mostrar prova"}, {"grupo": "Da biblioteca", "texto": "Usar banco de imagens genérico"}, {"grupo": "Da biblioteca", "texto": "Responder reclamação de forma automática"}, {"grupo": "Da biblioteca", "texto": "Vender o que a operação não consegue entregar no prazo"}, {"grupo": "Da biblioteca", "texto": "Falar com todo mundo do mesmo jeito"}]);
  if (P.vereditos) P.vereditos.push(...[{"grupo": "Da biblioteca", "texto": "As avaliações subiram em nota e quantidade: a experiência está sendo notada."}, {"grupo": "Da biblioteca", "texto": "O preço subiu e as vendas se mantiveram: a marca está sustentando o valor."}, {"grupo": "Da biblioteca", "texto": "O mês foi bom, mas puxado por um só cliente: a base ainda precisa crescer."}, {"grupo": "Da biblioteca", "texto": "A pesquisa mostrou que a marca é lembrada, mas não pelas situações certas: vamos ajustar a mensagem."}, {"grupo": "Da biblioteca", "texto": "A operação não deu conta da procura: crescer agora depende da capacidade."}]);
  if (P.pontosContato) P.pontosContato.push(...[{"grupo": "Da biblioteca", "texto": "Atendimento por telefone"}, {"grupo": "Da biblioteca", "texto": "E-mail de boas-vindas"}, {"grupo": "Da biblioteca", "texto": "Pós-venda e acompanhamento"}, {"grupo": "Da biblioteca", "texto": "Eventos e feiras"}, {"grupo": "Da biblioteca", "texto": "Brindes"}, {"grupo": "Da biblioteca", "texto": "Contrato"}, {"grupo": "Da biblioteca", "texto": "Relatórios ao cliente"}, {"grupo": "Da biblioteca", "texto": "Mural ou quadro de avisos"}, {"grupo": "Da biblioteca", "texto": "Música e trilha do ambiente"}]);
  if (P.situacoes) P.situacoes.push(...[{"grupo": "Da biblioteca", "texto": "Mudou de cidade ou de bairro"}, {"grupo": "Da biblioteca", "texto": "Teve um filho ou a família cresceu"}, {"grupo": "Da biblioteca", "texto": "Começou um negócio novo"}, {"grupo": "Da biblioteca", "texto": "Quer se preparar para uma viagem"}, {"grupo": "Da biblioteca", "texto": "Recebeu uma reclamação de cliente"}, {"grupo": "Da biblioteca", "texto": "O equipamento ficou velho"}, {"grupo": "Da biblioteca", "texto": "Viu um concorrente fazendo melhor"}, {"grupo": "Da biblioteca", "texto": "Vai abrir uma filial"}]);
  if (P.causas) P.causas.push(...[{"grupo": "Da biblioteca", "texto": "A marca muda de ideia a cada campanha"}, {"grupo": "Da biblioteca", "texto": "A experiência no ponto de venda não combina com a comunicação"}, {"grupo": "Da biblioteca", "texto": "Clientes satisfeitos não são incentivados a indicar"}, {"grupo": "Da biblioteca", "texto": "O site não diz em segundos o que a empresa faz"}, {"grupo": "Da biblioteca", "texto": "Os erros não viram aprendizado nem desculpa pública"}, {"grupo": "Da biblioteca", "texto": "A marca parece distante: falta gente por trás"}, {"grupo": "Da biblioteca", "texto": "As propostas não mostram o que está incluído"}]);
})();

// ===== Rodada 9: indecisão na compra, lacunas do serviço, métricas e eficácia (sem repetir) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  if (P.metricas) P.metricas.push(...[{"grupo": "Da biblioteca", "texto": "Fatia da verba de comunicação na categoria", "nivel": "marketing", "frequencia": "semestral"}, {"grupo": "Da biblioteca", "texto": "Clientes perdidos no período", "nivel": "negocio", "frequencia": "mensal"}, {"grupo": "Da biblioteca", "texto": "Quanto cada cliente gasta com a marca em relação à categoria", "nivel": "negocio", "frequencia": "anual"}, {"grupo": "Da biblioteca", "texto": "Consideração (entraria na lista de quem compra)", "nivel": "marca", "frequencia": "semestral"}, {"grupo": "Da biblioteca", "texto": "Tempo do orçamento ao fechamento", "nivel": "negocio", "frequencia": "mensal"}, {"grupo": "Da biblioteca", "texto": "Indicações recebidas", "nivel": "negocio", "frequencia": "mensal"}, {"grupo": "Da biblioteca", "texto": "Diferença entre o que o cliente esperava e o que recebeu", "nivel": "marca", "frequencia": "semestral"}]);
  if (P.causas) P.causas.push(...[{"grupo": "Da biblioteca", "texto": "O cliente fica indeciso e a equipe não ajuda a decidir"}, {"grupo": "Da biblioteca", "texto": "Opções demais na proposta confundem o cliente"}, {"grupo": "Da biblioteca", "texto": "O cliente tem medo de errar e ninguém tira esse risco da frente"}, {"grupo": "Da biblioteca", "texto": "A empresa não sabe o que o cliente espera, só imagina"}, {"grupo": "Da biblioteca", "texto": "Os clientes perdidos não são acompanhados nem entendidos"}]);
  if (P.condicoes) P.condicoes.push(...[{"grupo": "Da biblioteca", "texto": "O cliente tem uma razão clara para trocar o que usa hoje"}, {"grupo": "Da biblioteca", "texto": "A recomendação da equipe é aceita pelo cliente"}, {"grupo": "Da biblioteca", "texto": "A fatia de comunicação da marca está acima da fatia de mercado"}, {"grupo": "Da biblioteca", "texto": "O cliente consegue comprar sem muitas etapas"}]);
  if (P.verificacoes) P.verificacoes.push(...[{"grupo": "Da biblioteca", "texto": "Motivos de quem não fechou (perguntar a cada proposta perdida)"}, {"grupo": "Da biblioteca", "texto": "Entrevista com clientes recentes sobre como decidiram"}, {"grupo": "Da biblioteca", "texto": "Comparar a promessa das peças com a entrega real"}, {"grupo": "Da biblioteca", "texto": "Contagem de clientes perdidos e por quê"}, {"grupo": "Da biblioteca", "texto": "Tempo entre o primeiro contato e o fechamento"}]);
  if (P.pauta) P.pauta.push(...[{"grupo": "Da biblioteca", "texto": "Propostas perdidas: por que o cliente não fechou"}, {"grupo": "Da biblioteca", "texto": "O que os clientes esperavam e o que receberam"}, {"grupo": "Da biblioteca", "texto": "Indecisão: onde os clientes travam para comprar"}, {"grupo": "Da biblioteca", "texto": "Clientes perdidos no mês"}]);
  if (P.situacoes) P.situacoes.push(...[{"grupo": "Da biblioteca", "texto": "Precisa justificar a escolha para alguém (sócio, família, chefe)"}, {"grupo": "Da biblioteca", "texto": "Já pesquisou bastante e está com medo de errar"}, {"grupo": "Da biblioteca", "texto": "Ganhou um prazo curto para decidir"}, {"grupo": "Da biblioteca", "texto": "Recebeu uma proposta do concorrente"}, {"grupo": "Da biblioteca", "texto": "Vai sair de férias ou de licença"}]);
  if (P.respostasPeca) P.respostasPeca.push(...[{"grupo": "Da biblioteca", "texto": "Recomende uma opção em vez de mostrar todas."}, {"grupo": "Da biblioteca", "texto": "Tire o risco da frente: diga o que acontece se der errado."}, {"grupo": "Da biblioteca", "texto": "Fale de um cliente parecido com quem vai ler."}, {"grupo": "Da biblioteca", "texto": "Conte uma história real, com começo, problema e virada."}, {"grupo": "Da biblioteca", "texto": "Mostre o custo de não decidir agora, sem pressão."}]);
  if (P.tomDiz) P.tomDiz.push(...[{"grupo": "Da biblioteca", "texto": "Se fosse comigo, eu escolheria esta opção, e explico por quê."}, {"grupo": "Da biblioteca", "texto": "Se não der certo, a gente faz assim."}, {"grupo": "Da biblioteca", "texto": "Clientes como você costumam começar por aqui."}, {"grupo": "Da biblioteca", "texto": "Não precisa decidir tudo hoje: vamos pelo primeiro passo."}]);
  if (P.tomNuncaDiz) P.tomNuncaDiz.push(...[{"grupo": "Da biblioteca", "texto": "Fica a seu critério, temos todas as opções."}, {"grupo": "Da biblioteca", "texto": "Depende, cada caso é um caso."}, {"grupo": "Da biblioteca", "texto": "Pode ficar tranquilo que não dá problema."}]);
  if (P.vereditos) P.vereditos.push(...[{"grupo": "Da biblioteca", "texto": "Os clientes estão pedindo orçamento e adiando a decisão: vamos ajudar a decidir, não insistir."}, {"grupo": "Da biblioteca", "texto": "Perdemos alguns clientes antigos sem perceber: acompanhar a base vira rotina."}, {"grupo": "Da biblioteca", "texto": "A promessa da comunicação ficou acima da entrega: vamos alinhar antes de anunciar mais."}]);
  if (P.notasVendas) P.notasVendas.push(...[{"grupo": "Da biblioteca", "texto": "Muitas propostas ficaram paradas por indecisão do cliente, não por preço; vamos recomendar uma opção só."}, {"grupo": "Da biblioteca", "texto": "Perdemos propostas para não fazer nada: o cliente decidiu esperar."}]);
  if (P.notasPessoas) P.notasPessoas.push(...[{"grupo": "Da biblioteca", "texto": "Perdemos mais clientes do que de costume; vamos ligar para entender o que faltou."}]);
  if (P.notasValor) P.notasValor.push(...[{"grupo": "Da biblioteca", "texto": "Mostramos uma opção recomendada na proposta e a maioria escolheu ela, com ticket maior."}]);
  if (P.discriminadores) P.discriminadores.push(...[{"grupo": "Da biblioteca", "texto": "Recomenda com segurança em vez de só listar opções"}, {"grupo": "Da biblioteca", "texto": "Faz o oposto do que a categoria inteira faz"}, {"grupo": "Da biblioteca", "texto": "Tem uma história de origem que as pessoas lembram"}]);
  if (P.prioridades) P.prioridades.push(...[{"grupo": "Da biblioteca", "texto": "Clientes que já sabem que precisam e só falta decidir"}, {"grupo": "Da biblioteca", "texto": "Quem influencia a decisão (sócio, família, arquiteto, contador)"}]);
  if (P.deixados) P.deixados.push(...[{"grupo": "Da biblioteca", "texto": "Propostas com opções demais"}]);
  if (P.comQuem) P.comQuem.push(...[{"grupo": "Da biblioteca", "texto": "Quem influencia a decisão do cliente"}, {"grupo": "Da biblioteca", "texto": "Parceiros que indicam"}]);
  if (P.motivadores) P.motivadores.push(...[{"grupo": "Da biblioteca", "texto": "Saber o que acontece se der errado"}]);
  if (P.acreditam) P.acreditam.push(...[{"grupo": "Da biblioteca", "texto": "Muitas opções, difícil escolher"}]);
  if (P.sentem) P.sentem.push(...[{"grupo": "Da biblioteca", "texto": "Medo de errar na escolha"}]);
  if (P.notam) P.notam.push(...[{"grupo": "Da biblioteca", "texto": "Demora para responder orçamento"}]);
})();

// ===== Rodada 10: ideias do Aaker que ainda não estavam aqui (energia e relevância da marca, qualidade percebida, histórias da equipe) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const G = 'Da biblioteca';
  const acao = (texto, esforco, promessa, porque, metrica, tema) => ({ grupo: G, texto, esforco, promessa, porque, metrica, tema });
  P.acoes.push(
    acao('Criar um programa próprio e recorrente que dê energia à marca (prêmio local, série de conteúdo ou encontro anual), sempre com o mesmo nome', 'marca', 'pessoas',
      'Marcas conhecidas, mas sem energia, deixam de ser lembradas. Um programa próprio, repetido e associado à marca, dá motivo para falarem dela.', 'menções e participantes do programa a cada edição', 'presenca'),
    acao('Revisar a cada semestre o que mudou na categoria: novos concorrentes, novos canais e novas exigências dos clientes', 'marca', 'pessoas',
      'Marcas perdem espaço quando o jeito de comprar muda e elas não percebem. Olhar a categoria com regularidade evita ficar fora da lista do cliente.', 'revisão feita e mudanças levadas ao plano', 'medicao'),
    acao('Escolher os sinais de qualidade que o cliente enxerga (pontualidade, acabamento, limpeza, resposta rápida) e padronizar esses primeiro', 'venda', 'valor',
      'O cliente não avalia a qualidade técnica, avalia o que consegue ver. Cuidar dos sinais visíveis aumenta a qualidade percebida e sustenta o preço.', 'nota de qualidade percebida na pesquisa', 'experiencia'),
    acao('Contar a história de alguém da equipe que mostre, na prática, como a empresa trabalha', 'marca', 'valor',
      'Histórias reais de quem faz o trabalho tornam a promessa concreta e crível, e são lembradas mais do que listas de qualidades.', 'história publicada e usada nas conversas de venda', 'conteudo'),
  );
  const add = (k, itens) => { if (P[k]) P[k].push(...itens.map((x) => (typeof x === 'string' ? { grupo: G, texto: x } : { grupo: G, ...x }))); };
  add('causas', ['A marca é conhecida, mas está parada: ninguém comenta nem indica', 'A categoria mudou e a marca não acompanhou', 'A qualidade existe, mas o cliente não enxerga os sinais dela']);
  add('condicoes', ['A marca continua relevante para o que o cliente compra hoje', 'O programa próprio da marca continua atraindo atenção']);
  add('discriminadores', ['Tem um programa ou evento próprio que as pessoas ligam à marca']);
  add('objetivos', [{ texto: 'Ser vista como uma marca atual e com energia, não só conhecida', nivel: 'marca' }, { texto: 'Ser percebida como a de melhor qualidade da região', nivel: 'marca' }]);
  add('metricas', [{ texto: 'Qualidade percebida (nota de 0 a 10)', nivel: 'marca', frequencia: 'semestral' }, { texto: 'Energia da marca (quantos acham a marca atual e diferente)', nivel: 'marca', frequencia: 'semestral' }]);
  add('verificacoes', ['Pergunta na pesquisa: a marca parece atual e diferente das outras?']);
  add('pauta', ['O que mudou na categoria e pode tirar a relevância da marca']);
})();

// ===== Rodada 11: Building Strong Brands (identidade central e ampliada, proposta de valor completa, armadilhas de identidade, medidas de valor da marca) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const G = 'Da biblioteca';
  const acao = (texto, esforco, promessa, porque, metrica, tema) => ({ grupo: G, texto, esforco, promessa, porque, metrica, tema });
  P.acoes.push(
    acao('Definir a identidade central da marca (de 2 a 4 ideias que não mudam) e usar como filtro para aprovar peças, parcerias e novos serviços', 'marca', 'valor',
      'Sem um núcleo fixo, cada decisão puxa a marca para um lado. O que não muda dá direção e faz a marca ser reconhecida pelo mesmo motivo ao longo dos anos.', 'identidade central escrita e usada nas aprovações', 'posicionamento'),
    acao('Completar a proposta de valor com os três benefícios: o que a marca resolve, como faz o cliente se sentir e o que a escolha diz sobre ele', 'marca', 'valor',
      'Marcas que vendem só o benefício prático ficam fáceis de comparar e trocar. Somar o que o cliente sente e o que a escolha diz sobre ele cria preferência.', 'proposta de valor revisada e aplicada no site e na proposta', 'posicionamento'),
    acao('Criar um clube de clientes com nome, encontros e pequenos benefícios para quem já compra', 'marca', 'pessoas',
      'Clientes que se sentem parte de um grupo voltam, defendem a marca e trazem outros. O vínculo vai além da última compra.', 'clientes participando e indicações vindas do clube', 'relacao'),
  );
  const add = (k, itens) => { if (P[k]) P[k].push(...itens.map((x) => (typeof x === 'string' ? { grupo: G, texto: x } : { grupo: G, ...x }))); };
  // as armadilhas de identidade, como causas do diagnóstico
  add('causas', [
    'A marca é descrita só pelo que os clientes acham hoje, sem dizer o que ela quer ser',
    'A marca fala só do produto: ninguém conhece quem faz, a origem ou o jeito de atender',
    'A marca se resume a um slogan, sem nada que guie as escolhas do dia a dia',
  ]);
  add('condicoes', ['A identidade central continua a mesma nas decisões do ano']);
  add('metricas', [{ texto: 'Valor percebido (vale o que custa?)', nivel: 'marca', frequencia: 'semestral' }, { texto: 'Liderança percebida (vista como a líder da categoria)', nivel: 'marca', frequencia: 'semestral' }]);
  add('verificacoes', ['Pergunta na pesquisa: o que a empresa entrega vale o que custa?']);
  add('naoFazer', ['Mudar a identidade central para seguir a moda do momento']);
  if (P.tom) P.tom.push({ grupo: G, texto: 'Robusta', descricao: 'Firme e durável, transmite que aguenta o uso pesado' });
})();

// ===== Identidade central: exemplos de ideias que não mudam (o consultor adapta ao cliente) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const G = 'Da biblioteca';
  // cada ideia já vem com o que ela significa na prática (o consultor ajusta ao cliente)
  P.identidadeCentral = [
    ['Resultado sem retrabalho', 'Nenhum trabalho é entregue sem conferência final; se algo volta, a correção é prioridade e sem custo.'],
    ['Método próprio, testado e explicado', 'Todo cliente recebe o passo a passo antes de começar e sabe em que etapa está.'],
    ['Cuidado em cada detalhe', 'Acabamento, limpeza e pontualidade são conferidos em toda entrega, não só no que o cliente pediu.'],
    ['Feito para durar', 'Só usamos materiais e soluções que aguentam o uso real; não vendemos o que vai dar problema depois.'],
    ['Atendimento de perto, por quem entende', 'Quem atende o cliente é quem conhece o trabalho; nada de repassar de pessoa em pessoa.'],
    ['Preço claro, sem surpresa', 'O valor é fechado antes de começar e o que está incluído fica por escrito.'],
    ['Especialista no que faz, e só nisso', 'Dizemos não ao que está fora da nossa especialidade e indicamos quem faz bem.'],
    ['Da região, para a região', 'Conhecemos o dia a dia de quem mora e trabalha aqui, e isso aparece em como atendemos.'],
    ['Prazo cumprido como regra', 'Prazo é combinado com folga e, se algo atrasar, o cliente sabe antes e sabe por quê.'],
    ['Simples de comprar e de usar', 'Do primeiro contato ao pós-venda, cada passo é fácil e sem burocracia para o cliente.'],
    ['Qualidade que dá para ver', 'Mostramos o processo, os materiais e o resultado, para o cliente enxergar a diferença.'],
    ['Honestidade, mesmo quando custa uma venda', 'Se não for o melhor para o cliente, dizemos, mesmo que ele deixe de comprar.'],
  ].map(([texto, explicacao]) => ({ grupo: G, texto, explicacao }));
})();

// ===== Narrativa: mensagem central e mensagens de apoio (a ideia que a marca repete e as provas que sustentam) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const G = 'Da biblioteca';
  const g = (itens) => itens.map((texto) => ({ grupo: G, texto }));
  // uma ideia simples, repetida em todo ponto de contato; diz o benefício, não a lista de serviços
  P.mensagensCentrais = g([
    'Resultado sem retrabalho, com método.',
    'Você sabe o que vai receber antes de começar.',
    'Feito por quem entende, do jeito certo.',
    'Simples de contratar, do começo ao fim.',
    'O cuidado que a sua empresa merece.',
    'Qualidade que dá para ver.',
    'Do bairro, para quem é do bairro.',
    'Sem surpresa no preço nem no prazo.',
    'A escolha segura para quem não pode errar.',
    'Especialistas no que você precisa, e só nisso.',
  ]);
  // provas: fatos, números, processo, garantia, gente real (substituem adjetivos)
  P.mensagensApoio = g([
    'Um método próprio, testado em muitos projetos',
    'Você recebe o plano completo antes de começar',
    'Preço fechado antes de começar, sem surpresa no fim',
    'Prazo combinado por escrito, e cumprido',
    'Garantia por escrito sobre o que entregamos',
    'Quem atende é quem faz o trabalho',
    'Você acompanha cada etapa e sabe o que vem depois',
    'Clientes que voltam e indicam a empresa',
    'Avaliações reais de clientes, publicadas no Google',
    'Anos de experiência no mesmo segmento',
    'Resposta rápida em todos os canais',
    'Cada detalhe é conferido antes da entrega',
    'Atendimento depois da compra, não só antes',
    'Equipe própria e treinada no nosso jeito de trabalhar',
    'Casos reais de clientes, com antes e depois',
    'Materiais de qualidade, escolhidos com critério',
    'Explicamos sem jargão, do jeito que você fala',
    'Se não for para você, dizemos na primeira conversa',
    'Formas de pagamento que facilitam a decisão',
    'Somos da região e conhecemos o seu dia a dia',
  ]);
})();

// ===== Estratégia pelo cerne: o desafio (diagnóstico), a abordagem (política orientadora) e o próximo marco (objetivo próximo) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const G = 'Da biblioteca';
  const g = (itens) => itens.map((texto) => ({ grupo: G, texto }));
  // o desafio: o obstáculo principal, dito com franqueza; não é meta nem desejo
  P.desafios = g([
    'A marca é pouco lembrada quando o cliente precisa do serviço, então perde para quem aparece primeiro',
    'O cliente não vê diferença entre a marca e os concorrentes, então decide pelo preço',
    'A marca só é lembrada por quem já é cliente; quem nunca comprou não a conhece',
    'A proposta começa pelo preço, e o cliente compara item por item com os concorrentes',
    'A experiência muda de pessoa para pessoa, e a promessa da marca não se sustenta na entrega',
    'Os clientes compram uma vez e não voltam, então todo mês é preciso começar do zero',
    'A marca depende de um único canal de clientes, e qualquer mudança nele derruba as vendas',
    'Um concorrente maior ocupa a posição de referência e a marca fica como segunda opção',
    'A marca tenta atender todo mundo e não convence ninguém em especial',
    'A empresa tem qualidade, mas não tem provas visíveis: casos, números e avaliações',
    'É difícil achar e comprar da empresa: pouca presença onde o cliente procura',
    'A comunicação é irregular e some por meses, então a lembrança cai',
  ]);
  // a abordagem: o caminho para vencer o desafio; diz o que fazer e, por consequência, o que não fazer
  P.abordagens = g([
    'Ser a especialista em um tipo de cliente e mostrar provas disso em todo contato, em vez de competir por preço',
    'Estar presente nas situações em que o cliente decide comprar, com os mesmos sinais visuais sempre',
    'Vender pelo método e pelo resultado, deixando o preço para depois do valor',
    'Padronizar a experiência para que todo cliente receba a mesma promessa, do contato ao pós-venda',
    'Transformar clientes satisfeitos em indicação, com um processo simples e constante',
    'Alcançar quem ainda não compra da marca, com presença contínua e não só ofertas',
    'Concentrar o esforço em uma região e um serviço até virar a referência, antes de expandir',
    'Abrir um segundo canal de clientes para não depender de um só',
    'Mostrar o que só a marca faz, com nome próprio, para sair da comparação direta',
    'Ser a opção mais fácil de comprar: resposta rápida, preço claro e poucos passos',
  ]);
  // o próximo marco: alcançável em poucos meses e que destrava o resto
  P.marcos = g([
    'Proposta comercial nova em uso em todas as vendas',
    'Identidade aplicada em todos os pontos de contato principais',
    'Primeira rodada da pesquisa de marca com 30 respostas',
    'Perfil no Google completo e com 30 avaliações',
    '3 casos de clientes publicados e usados nas vendas',
    'Equipe treinada na mensagem central',
    'Um canal novo trazendo clientes todo mês',
    'Processo de indicação funcionando com os clientes atuais',
    'Site novo no ar, com contato em um clique',
    'Comunicação de marca constante por 3 meses seguidos',
  ]);
})();

// ===== Cada desafio aponta as abordagens que fazem sentido para ele (o consultor só vê as coerentes) =====
(function () {
  const P = window.GangPresets; if (!P || !P.desafios || !P.abordagens) return;
  const G = 'Da biblioteca';
  const novas = [
    'Criar motivos para voltar: acompanhamento depois da compra e oferta do próximo passo',
    'Transformar cada entrega em prova: casos, números e avaliações em todo contato',
    'Manter presença constante o ano todo com poucos sinais sempre iguais, em vez de campanhas soltas',
  ];
  novas.forEach((texto) => { if (!P.abordagens.some((a) => a.texto === texto)) P.abordagens.push({ grupo: G, texto }); });
  const A = {
    especialista: 'Ser a especialista em um tipo de cliente e mostrar provas disso em todo contato, em vez de competir por preço',
    presente: 'Estar presente nas situações em que o cliente decide comprar, com os mesmos sinais visuais sempre',
    metodo: 'Vender pelo método e pelo resultado, deixando o preço para depois do valor',
    padrao: 'Padronizar a experiência para que todo cliente receba a mesma promessa, do contato ao pós-venda',
    indicacao: 'Transformar clientes satisfeitos em indicação, com um processo simples e constante',
    alcance: 'Alcançar quem ainda não compra da marca, com presença contínua e não só ofertas',
    foco: 'Concentrar o esforço em uma região e um serviço até virar a referência, antes de expandir',
    canal: 'Abrir um segundo canal de clientes para não depender de um só',
    nome: 'Mostrar o que só a marca faz, com nome próprio, para sair da comparação direta',
    facil: 'Ser a opção mais fácil de comprar: resposta rápida, preço claro e poucos passos',
    voltar: novas[0], prova: novas[1], constante: novas[2],
  };
  const MAPA = [
    ['A marca é pouco lembrada', ['presente', 'alcance', 'constante']],
    ['O cliente não vê diferença', ['especialista', 'nome', 'metodo']],
    ['A marca só é lembrada por quem já é cliente', ['alcance', 'indicacao', 'presente']],
    ['A proposta começa pelo preço', ['metodo', 'nome', 'prova']],
    ['A experiência muda de pessoa para pessoa', ['padrao']],
    ['Os clientes compram uma vez e não voltam', ['voltar', 'indicacao', 'padrao']],
    ['A marca depende de um único canal', ['canal', 'presente']],
    ['Um concorrente maior ocupa a posição de referência', ['foco', 'especialista', 'nome']],
    ['A marca tenta atender todo mundo', ['especialista', 'foco']],
    ['A empresa tem qualidade, mas não tem provas visíveis', ['prova', 'metodo']],
    ['É difícil achar e comprar da empresa', ['facil', 'presente']],
    ['A comunicação é irregular', ['constante', 'presente']],
  ];
  P.desafios.forEach((d) => { const m = MAPA.find(([ini]) => d.texto.startsWith(ini)); if (m) d.abordagens = m[1].map((k) => A[k]); });
})();

// ===== Diagnóstico "em uma frase": o retrato do ponto de partida (o que a marca entrega, o que falta e a consequência) =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const G = 'Da biblioteca';
  P.resumosDiagnostico = [
    'A marca entregava o básico que o setor exige, mas não tinha uma diferença clara, por isso competia principalmente por preço.',
    'A marca era bem avaliada por quem já era cliente, mas pouco lembrada por quem ainda não comprava, por isso crescia devagar.',
    'A qualidade do trabalho era alta, mas não aparecia na comunicação, por isso o cliente não via motivo para pagar mais.',
    'A marca era conhecida, mas parada no tempo: o visual e a comunicação não acompanharam o que a empresa virou.',
    'Cada canal falava de um jeito, com cores e mensagens diferentes, por isso a marca não era reconhecida de longe.',
    'A empresa dependia quase só de indicação, o que trazia bons clientes, mas tornava o crescimento imprevisível.',
    'A marca tentava atender todo tipo de cliente e acabava não sendo a primeira escolha de nenhum.',
    'A promessa da venda era boa, mas a entrega variava de pessoa para pessoa, e isso afastava quem poderia voltar.',
    'A marca aparecia pouco nos momentos em que o cliente decidia comprar, por isso perdia para quem estava presente.',
    'Os clientes compravam uma vez e não voltavam: faltava motivo e caminho para a segunda compra.',
    'A marca era difícil de achar e de comprar, então parte da procura se perdia antes do primeiro contato.',
    'A comunicação vinha em campanhas soltas, com pausas longas, por isso a lembrança subia e caía a cada mês.',
  ].map((texto) => ({ grupo: G, texto }));
})();

// ===== Cerne da estratégia, rodada 2: mais desafios e abordagens (alavancagem, ondas de mudança, inércia, onde jogar e como vencer,
// ser o único, marcas que fazem o oposto, custos de troca, quadro de referência, foco e escolhas) =====
(function () {
  const P = window.GangPresets; if (!P || !P.desafios || !P.abordagens) return;
  const G = 'Da biblioteca';
  const A = {
    especialista: 'Ser a especialista em um tipo de cliente e mostrar provas disso em todo contato, em vez de competir por preço',
    presente: 'Estar presente nas situações em que o cliente decide comprar, com os mesmos sinais visuais sempre',
    metodo: 'Vender pelo método e pelo resultado, deixando o preço para depois do valor',
    padrao: 'Padronizar a experiência para que todo cliente receba a mesma promessa, do contato ao pós-venda',
    indicacao: 'Transformar clientes satisfeitos em indicação, com um processo simples e constante',
    alcance: 'Alcançar quem ainda não compra da marca, com presença contínua e não só ofertas',
    foco: 'Concentrar o esforço em uma região e um serviço até virar a referência, antes de expandir',
    canal: 'Abrir um segundo canal de clientes para não depender de um só',
    nome: 'Mostrar o que só a marca faz, com nome próprio, para sair da comparação direta',
    facil: 'Ser a opção mais fácil de comprar: resposta rápida, preço claro e poucos passos',
    voltar: 'Criar motivos para voltar: acompanhamento depois da compra e oferta do próximo passo',
    prova: 'Transformar cada entrega em prova: casos, números e avaliações em todo contato',
    constante: 'Manter presença constante o ano todo com poucos sinais sempre iguais, em vez de campanhas soltas',
    // novas
    onda: 'Aproveitar a mudança no jeito de comprar: chegar antes dos concorrentes ao canal e ao hábito novo',
    cortar: 'Cortar o que dispersa: poucos serviços, poucos clientes-alvo e uma mensagem só, até a marca ser lembrada por isso',
    premium: 'Assumir o preço mais alto e mostrar em tudo o que o justifica: processo, materiais, atendimento e garantia',
    subirValor: 'Subir o valor percebido antes do preço: apresentação, provas e um serviço mais completo para o cliente certo',
    quadro: 'Escolher contra quem a marca quer ser comparada e dizer isso com clareza logo na primeira frase',
    subcategoria: 'Criar e nomear uma subcategoria em que a marca é a primeira, para não disputar a categoria inteira',
    naoCopia: 'Apostar no que não se copia: nome, sinais visuais, relacionamento e reputação acumulados com o tempo',
    oposto: 'Fazer o oposto do que a categoria inteira faz, de propósito, para ser a alternativa óbvia',
    confianca: 'Emprestar confiança enquanto não há história: garantias claras, primeiros casos bem documentados e parcerias conhecidas',
    proximo: 'Manter o jeito próximo como regra escrita: quem atende, como atende e em quanto tempo, igual para todos',
    vinculo: 'Aumentar o que se perde ao trocar de fornecedor: histórico, acompanhamento e benefícios para quem fica',
    doisPublicos: 'Falar com quem decide e com quem usa, com motivos diferentes para cada um, dentro da mesma mensagem central',
    base: 'Ampliar a base de clientes menores e recorrentes para o resultado não depender de poucos grandes',
    alinhar: 'Alinhar venda e comunicação: um roteiro de conversa com a mesma promessa, as mesmas provas e os mesmos limites',
    reposicionar: 'Mudar o que a marca representa aos poucos: um novo foco repetido em todos os pontos de contato, sem apagar o que já é conhecido',
    unico: 'Escolher uma coisa em que a marca pode ser a única da região e organizar o negócio inteiro em torno dela',
  };
  Object.values(A).forEach((texto) => { if (!P.abordagens.some((a) => a.texto === texto)) P.abordagens.push({ grupo: G, texto }); });
  // desafios novos, cada um com as abordagens que fazem sentido
  const NOVOS = [
    ['O jeito de comprar da categoria mudou (novos canais, novos hábitos) e a marca continua vendendo do jeito antigo', ['onda', 'canal', 'facil']],
    ['A empresa faz de tudo um pouco e a equipe não sabe o que é prioridade', ['cortar', 'foco', 'especialista']],
    ['A marca é vista como a mais cara sem que o cliente entenda o porquê', ['premium', 'metodo', 'prova']],
    ['A marca é vista como barata e não consegue cobrar mais pelo que entrega', ['subirValor', 'especialista', 'prova']],
    ['O cliente não entende em que categoria a empresa se encaixa e a compara com as empresas erradas', ['quadro', 'subcategoria']],
    ['Os concorrentes copiam rápido tudo o que a marca lança', ['naoCopia', 'vinculo', 'oposto']],
    ['A empresa é nova e o cliente desconfia de quem ainda não tem história', ['confianca', 'foco', 'especialista']],
    ['A marca cresceu e perdeu o jeito próximo que fazia os clientes escolherem ela', ['proximo', 'padrao']],
    ['O cliente troca de fornecedor com facilidade, porque nada o prende à marca', ['vinculo', 'voltar', 'indicacao']],
    ['Quem decide a compra não é quem usa o serviço, e a marca só fala com um dos dois', ['doisPublicos', 'prova']],
    ['Todos os concorrentes fazem igual e a categoria virou uma coisa só', ['oposto', 'unico', 'subcategoria']],
    ['A empresa depende de poucos clientes grandes, e perder um deles derruba o mês', ['base', 'alcance', 'canal']],
    ['A equipe de vendas promete coisas diferentes do que a comunicação da marca diz', ['alinhar', 'padrao']],
    ['A marca é lembrada por um produto ou fase antiga, não pelo que a empresa faz hoje', ['reposicionar', 'nome', 'constante']],
  ];
  NOVOS.forEach(([texto, ks]) => { if (!P.desafios.some((d) => d.texto === texto)) P.desafios.push({ grupo: G, texto, abordagens: ks.map((k) => A[k]) }); });
  // os desafios antigos ganham as abordagens novas que também servem para eles
  const EXTRA = [
    ['O cliente não vê diferença', ['oposto', 'quadro', 'unico']],
    ['Um concorrente maior ocupa a posição de referência', ['oposto', 'subcategoria']],
    ['A marca tenta atender todo mundo', ['cortar', 'unico']],
    ['A proposta começa pelo preço', ['subirValor']],
    ['Os clientes compram uma vez e não voltam', ['vinculo']],
    ['A empresa tem qualidade, mas não tem provas visíveis', ['confianca']],
    ['A marca é pouco lembrada', ['unico']],
  ];
  EXTRA.forEach(([ini, ks]) => { const d = P.desafios.find((x) => x.texto.startsWith(ini)); if (d) d.abordagens = [...new Set([...(d.abordagens || []), ...ks.map((k) => A[k])])]; });
})();

// ===== Diagnóstico "em uma frase", rodada 2 (curto prazo x marca, lacuna entre expectativa e entrega, categoria sem diferença,
// alternativa real do cliente, quadro de referência, ativos, preço, dependência, inércia) =====
(function () {
  const P = window.GangPresets; if (!P || !P.resumosDiagnostico) return;
  const G = 'Da biblioteca';
  [
    'A empresa investia só em ofertas para vender no mês, sem construir a marca, por isso as vendas paravam quando as promoções paravam.',
    'O cliente esperava uma coisa e recebia outra: a comunicação prometia mais do que a entrega mostrava, e a confiança caía depois da compra.',
    'As empresas da categoria pareciam todas iguais, e a marca seguia o mesmo padrão, por isso era trocada pela primeira oferta melhor.',
    'O maior concorrente da marca não era outra empresa, e sim o cliente resolver sozinho ou adiar, e a comunicação nunca falava disso.',
    'O cliente comparava a marca com as empresas erradas, mais baratas e mais simples, por isso o preço parecia alto.',
    'A marca não tinha sinais próprios (cor, símbolo, frase) que o cliente reconhecesse sem ler o nome, então cada peça começava do zero.',
    'A marca era vista como a opção barata, e isso impedia de cobrar pelo que a empresa já entregava de melhor.',
    'A marca cobrava como as melhores, mas não mostrava por quê, então o cliente achava caro e ia embora sem perguntar.',
    'A maior parte do faturamento vinha de poucos clientes grandes, e qualquer perda colocava o mês em risco.',
    'A empresa fazia tudo do jeito de sempre porque sempre tinha funcionado, mas o cliente e o mercado já tinham mudado.',
    'A marca era conhecida pelo dono, não pela empresa: quando ele não estava na conversa, a venda não acontecia.',
    'A empresa tinha clientes satisfeitos, mas nenhum processo para pedir indicação, então o melhor canal de vendas ficava parado.',
    'Quem decidia a compra não era quem usava o serviço, e a marca só convencia um dos dois.',
    'A marca era bonita, mas não dizia o que a empresa fazia, então chamava atenção e não gerava procura.',
    'A equipe de vendas e a comunicação diziam coisas diferentes, e o cliente não sabia em qual versão acreditar.',
    'A empresa era nova e sem histórico, e o cliente preferia arriscar menos escolhendo quem já conhecia.',
  ].forEach((texto) => { if (!P.resumosDiagnostico.some((x) => x.texto === texto)) P.resumosDiagnostico.push({ grupo: G, texto }); });
})();

// ===== Cerne da estratégia, rodada 3: a abordagem é uma escolha, não uma ação.
// Cada uma diz onde jogar, por que a marca vence ali e do que ela abre mão. As táticas de antes viraram ações da biblioteca. =====
(function () {
  const P = window.GangPresets; if (!P || !P.desafios) return;
  const G = 'Da biblioteca';
  const A = {
    especialista: 'Ser a especialista em um tipo de cliente e em um problema, vencendo por conhecer esse problema melhor que qualquer generalista. Abrimos mão de atender quem está fora desse perfil, mesmo quando pede orçamento.',
    foco: 'Ser a referência em uma região e em um serviço antes de crescer, vencendo pela concentração de casos, indicações e lembrança no mesmo lugar. Abrimos mão de expandir para outras regiões e serviços por enquanto.',
    cortar: 'Concentrar a empresa no que ela faz melhor e dá mais margem, vencendo pela qualidade que só o foco permite. Abrimos mão dos serviços e clientes que dão trabalho e pouco retorno.',
    premium: 'Ser a opção premium da categoria, vencendo por um nível de entrega que os concorrentes não querem bancar. Abrimos mão do cliente que decide só pelo preço e de dar desconto para fechar.',
    subirValor: 'Sair da faixa de preço baixo e escolher clientes que valorizam resultado, vencendo por uma entrega mais completa. Abrimos mão dos clientes que só ficam pelo preço.',
    simples: 'Ser a opção simples e acessível da categoria, vencendo por um modelo enxuto que custa menos para operar. Abrimos mão de personalizar e de fazer serviços sob medida.',
    conveniente: 'Ser a escolha mais conveniente da categoria, vencendo por ser fácil em cada passo, da procura ao pós-venda. Abrimos mão de ser a mais barata ou a mais sofisticada.',
    subcategoria: 'Criar uma subcategoria e ser a primeira nela, vencendo por não ter com quem ser comparada. Abrimos mão de disputar a categoria inteira de frente.',
    oposto: 'Ser a alternativa ao jeito como a categoria inteira trabalha, vencendo por fazer de propósito o que os concorrentes não conseguem copiar sem se contradizer. Abrimos mão das convenções que o mercado acha obrigatórias.',
    quadro: 'Escolher contra quem a marca é comparada, vencendo em uma comparação em que ela é claramente melhor. Abrimos mão de convencer quem procura outra coisa.',
    naoCopia: 'Competir pelo que leva tempo para construir: reputação, relacionamento e sinais próprios, vencendo porque isso não se copia em um lançamento. Abrimos mão de correr atrás de cada novidade dos concorrentes.',
    parceira: 'Ser a parceira de longo prazo do cliente, vencendo pelo que ele perderia ao trocar: histórico, conhecimento do negócio e continuidade. Abrimos mão das vendas avulsas que não levam a uma relação.',
    continuo: 'Trocar a venda única pelo acompanhamento contínuo, vencendo por estar presente em cada etapa do cliente. Abrimos mão de vender só o projeto pontual.',
    conquistar: 'Crescer conquistando quem ainda não compra, vencendo por ser a marca que vem à cabeça primeiro em toda a categoria. Abrimos mão de concentrar o esforço só em quem já é cliente.',
    momento: 'Ser a marca dona de uma situação de compra, vencendo por aparecer sempre que ela acontece. Abrimos mão de tentar estar em todo momento e em todo canal.',
    onda: 'Liderar o jeito novo de comprar da categoria, vencendo por chegar antes ao canal e ao hábito que estão crescendo. Abrimos mão de proteger o modelo antigo à custa do novo.',
    direto: 'Ter uma relação direta com o cliente, vencendo por não depender de intermediários nem de uma única plataforma. Abrimos mão de parte das vendas fáceis que o intermediário traz.',
    base: 'Atender muitos clientes médios em vez de poucos grandes, vencendo por um serviço que se repete bem. Abrimos mão de projetos gigantes que ocupam a equipe inteira.',
    nicho: 'Começar por um nicho pequeno em que a empresa consegue provar resultado rápido, vencendo pela atenção que os grandes não dão. Abrimos mão de clientes grandes enquanto não há história.',
    proxima: 'Ser a empresa próxima, em que o cliente fala com quem decide, vencendo pela atenção pessoal que as maiores perderam. Abrimos mão de crescer em um ritmo que tire essa proximidade.',
    confiavel: 'Prometer menos e entregar sempre igual, vencendo pela confiança de que o resultado não depende de sorte. Abrimos mão de exceções e promessas sob medida que a equipe não sustenta.',
    dentro: 'Conquistar quem usa para que ele defenda a marca para quem decide, vencendo por ser a preferida dentro do cliente. Abrimos mão de vender só para quem assina.',
    hoje: 'Assumir o que a empresa é hoje e deixar a fase antiga para trás, vencendo por uma marca que mostra o negócio atual. Abrimos mão do público que só conhece a empresa antiga.',
    unica: 'Ser a única da região em uma coisa que o cliente valoriza, vencendo por organizar o negócio inteiro em torno dela. Abrimos mão de fazer bem o que todos fazem.',
    resultado: 'Vender o resultado, e não horas ou itens, vencendo por assumir parte do risco do cliente. Abrimos mão de concorrer em orçamentos item por item.',
    comprovada: 'Ser a mais comprovada da categoria, vencendo por deixar o resultado falar antes da venda. Abrimos mão de prometer o que ainda não conseguimos provar.',
    coerente: 'Ter uma só promessa que guia venda, atendimento e comunicação, vencendo pela coerência que o cliente sente em todo contato. Abrimos mão de mensagens diferentes para cada canal ou vendedor.',
    continua: 'Construir a marca de forma contínua, e não por campanhas, vencendo pela lembrança que se acumula mês a mês. Abrimos mão dos picos de campanha que somem depois.',
    desafiante: 'Ser a desafiante declarada da líder, vencendo pelo que a líder não muda por ser grande. Abrimos mão de imitar a líder em versão menor.',
  };
  P.abordagens = Object.values(A).map((texto) => ({ grupo: G, texto }));
  const MAPA = [
    ['A marca é pouco lembrada', ['conquistar', 'momento', 'continua', 'unica']],
    ['O cliente não vê diferença', ['especialista', 'oposto', 'unica', 'subcategoria']],
    ['A marca só é lembrada por quem já é cliente', ['conquistar', 'momento', 'continua']],
    ['A proposta começa pelo preço', ['resultado', 'premium', 'quadro']],
    ['A experiência muda de pessoa para pessoa', ['confiavel', 'proxima']],
    ['Os clientes compram uma vez e não voltam', ['continuo', 'parceira']],
    ['A marca depende de um único canal', ['direto', 'onda', 'momento']],
    ['Um concorrente maior ocupa a posição de referência', ['desafiante', 'oposto', 'especialista', 'foco']],
    ['A marca tenta atender todo mundo', ['especialista', 'cortar', 'foco']],
    ['A empresa tem qualidade, mas não tem provas visíveis', ['comprovada', 'especialista', 'resultado']],
    ['É difícil achar e comprar da empresa', ['conveniente', 'direto', 'momento']],
    ['A comunicação é irregular', ['continua', 'coerente']],
    ['O jeito de comprar da categoria mudou', ['onda', 'conveniente', 'direto']],
    ['A empresa faz de tudo um pouco', ['cortar', 'especialista', 'foco']],
    ['A marca é vista como a mais cara', ['premium', 'resultado', 'quadro']],
    ['A marca é vista como barata', ['subirValor', 'especialista', 'simples']],
    ['O cliente não entende em que categoria', ['quadro', 'subcategoria']],
    ['Os concorrentes copiam rápido', ['naoCopia', 'parceira', 'oposto']],
    ['A empresa é nova', ['nicho', 'especialista', 'foco']],
    ['A marca cresceu e perdeu o jeito próximo', ['proxima', 'confiavel']],
    ['O cliente troca de fornecedor com facilidade', ['parceira', 'continuo']],
    ['Quem decide a compra não é quem usa', ['dentro', 'resultado']],
    ['Todos os concorrentes fazem igual', ['oposto', 'unica', 'subcategoria']],
    ['A empresa depende de poucos clientes grandes', ['base', 'conquistar']],
    ['A equipe de vendas promete coisas diferentes', ['coerente', 'confiavel']],
    ['A marca é lembrada por um produto ou fase antiga', ['hoje', 'especialista', 'continua']],
  ];
  P.desafios.forEach((d) => { const m = MAPA.find(([ini]) => d.texto.startsWith(ini)); d.abordagens = m ? m[1].map((k) => A[k]) : []; });
  // as táticas que estavam como abordagem viram ações da biblioteca (as que ainda não existiam)
  const NOVAS = [
    { texto: 'Escrever o roteiro da conversa de venda com a mesma promessa, as mesmas provas e os mesmos limites da comunicação', esforco: 'venda', promessa: 'vendas', tema: 'venda',
      porque: 'Quando o vendedor promete uma coisa e a marca diz outra, o cliente desconfia. Um roteiro comum faz a venda confirmar o que a comunicação já disse.', metrica: 'Vendedores usando o mesmo roteiro' },
    { texto: 'Escrever o padrão de atendimento: quem responde, como responde e em quanto tempo, do primeiro contato ao pós-venda', esforco: 'venda', promessa: 'pessoas', tema: 'experiencia',
      porque: 'Se cada pessoa atende de um jeito, a promessa da marca vira sorte. Um padrão escrito faz todo cliente viver a mesma experiência.', metrica: 'Atendimentos dentro do padrão' },
    { texto: 'Montar o acompanhamento depois da compra, com um contato marcado e a oferta do próximo passo', esforco: 'venda', promessa: 'valor', tema: 'relacao',
      porque: 'O cliente que não ouve mais falar da empresa esquece dela. Um contato planejado depois da entrega abre caminho para a segunda compra.', metrica: 'Clientes que voltam a comprar' },
    { texto: 'Transformar cada entrega concluída em um caso curto: o problema, o que foi feito e o resultado em número', esforco: 'marca', promessa: 'valor', tema: 'conteudo',
      porque: 'Qualidade que ninguém vê não ajuda a vender. Um caso por entrega cria, com o tempo, um acervo de provas para todo contato.', metrica: 'Casos publicados por mês' },
    { texto: 'Deixar o preço de partida e o próximo passo visíveis em todos os canais da marca', esforco: 'venda', promessa: 'vendas', tema: 'experiencia',
      porque: 'Quem não sabe quanto custa nem o que fazer depois desiste antes de falar com a empresa. Clareza no começo encurta a compra.', metrica: 'Contatos que chegam já sabendo o preço de partida' },
  ];
  if (P.acoes) NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
})();

// ===== Rodada 14: mais opções para Diagnóstico, Estratégia e Narrativa, vindas da biblioteca do Drive
// (marcas desafiantes, vantagens de demanda e de nicho, trabalhos que o cliente quer resolver, relevância e subcategorias,
// posicionamento de especialistas, cordialidade e competência, preço pelo valor). Cada abordagem nova só aparece
// nos desafios em que ela é uma resposta coerente; nenhum desafio ganha opção só para encher a lista. =====
(function () {
  const P = window.GangPresets; if (!P || !P.desafios || !P.abordagens) return;
  const G = 'Da biblioteca';
  const add = (lista, itens) => { if (!P[lista]) P[lista] = []; itens.forEach((texto) => { if (!P[lista].some((x) => x.texto === texto)) P[lista].push({ grupo: G, texto }); }); };
  const achar = (ini) => (P.abordagens.find((a) => a.texto.startsWith(ini)) || {}).texto;

  // ---- Estratégia: abordagens novas (onde jogar, por que vence ali, do que abre mão) ----
  const N = {
    farol: 'Ter um ponto de vista claro sobre a categoria e assumi-lo em público, vencendo por ser a marca de quem todos sabem o que pensa. Abrimos mão de agradar a todos e de soar neutra.',
    conversa: 'Puxar a conversa da categoria, dizendo o que está errado nela e para onde ela deve ir, vencendo por ser vista como quem define as regras, e não quem as segue. Abrimos mão de falar só de nós e das nossas ofertas.',
    concentrar: 'Concentrar quase todo o esforço em poucas frentes, com intensidade, vencendo por parecer maior do que é onde aparece. Abrimos mão de estar em todo canal com pouca força.',
    emocao: 'Trazer para a categoria uma emoção que nenhum concorrente oferece, como alívio, orgulho ou prazer, vencendo por ser a marca que faz o cliente se sentir diferente. Abrimos mão de falar só de características técnicas, como todos falam.',
    habito: 'Tornar a compra um hábito, com recorrência, agenda fixa ou reposição combinada, vencendo pela fidelidade que nasce da repetição. Abrimos mão das vendas avulsas com desconto que não criam rotina.',
    custoBusca: 'Ser a fornecedora de confiança em um serviço complexo e feito sob medida, vencendo porque trocar exigiria procurar, explicar e testar tudo de novo. Abrimos mão dos serviços padronizados que o cliente compara com facilidade.',
    trabalho: 'Organizar a oferta em torno do progresso que o cliente quer fazer em uma situação específica, e não em torno do serviço, vencendo por resolver também o lado emocional e social da compra. Abrimos mão de vender o catálogo inteiro para todo mundo.',
    naoConsumo: 'Competir com a não compra, ou seja, com quem adia, improvisa ou faz sozinho, vencendo por ser simples e acessível o bastante para quem hoje não compra de ninguém. Abrimos mão de disputar de frente os clientes que já compram dos concorrentes.',
    beneficio: 'Ser dona de um benefício que o cliente considera indispensável, vencendo por ser a marca ligada a ele antes de qualquer outra. Abrimos mão de comunicar vários benefícios ao mesmo tempo.',
    conhecimento: 'Vender conhecimento e diagnóstico, e não só execução, vencendo por pensar o problema do cliente antes dele. Abrimos mão de ser apenas a mão de obra que executa o que pedem.',
    humana: 'Mostrar as pessoas por trás da marca e agir sempre a favor do cliente, vencendo pela confiança que vem de ser cordial e competente ao mesmo tempo. Abrimos mão de ganhos de curto prazo que exploram o cliente, como letras miúdas, taxas escondidas e pressão para fechar.',
    niveis: 'Ter ofertas em níveis diferentes para clientes que valorizam coisas diferentes, vencendo por cobrar de cada um pelo valor que ele percebe. Abrimos mão de um preço único para todos e de descontos sem contrapartida.',
    valorEconomico: 'Cobrar pela diferença de valor em relação à alternativa do cliente, vencendo por mostrar quanto ele ganha ou deixa de perder. Abrimos mão de calcular o preço só pelo custo mais a margem.',
  };
  add('abordagens', Object.values(N));
  const A = (k) => N[k] || achar({ simples: 'Ser a opção simples', coerente: 'Ter uma só promessa', comprovada: 'Ser a mais comprovada', nicho: 'Começar por um nicho', premium: 'Ser a opção premium',
    resultado: 'Vender o resultado', especialista: 'Ser a especialista', confiavel: 'Prometer menos', momento: 'Ser a marca dona', onda: 'Liderar o jeito novo', continua: 'Construir a marca de forma contínua',
    oposto: 'Ser a alternativa ao jeito', conveniente: 'Ser a escolha mais conveniente', parceira: 'Ser a parceira', continuo: 'Trocar a venda única', subcategoria: 'Criar uma subcategoria', quadro: 'Escolher contra quem' }[k]);

  // ---- Estratégia: desafios novos ----
  const NOVOS = [
    ['O maior concorrente é o cliente não comprar: ele adia, improvisa ou resolve sozinho', ['naoConsumo', 'trabalho', 'conveniente', 'simples']],
    ['A marca não tem opinião nem jeito próprio, e soa igual a qualquer outra da categoria', ['farol', 'conversa', 'emocao', 'oposto']],
    ['A categoria só fala do lado técnico e a marca não desperta nenhum sentimento no cliente', ['emocao', 'trabalho', 'farol']],
    ['A venda depende do dono: quando ele não está na conversa, o cliente não fecha', ['humana', 'confiavel', 'coerente', 'conhecimento']],
    ['A empresa dá desconto para fechar quase toda venda e a margem desaparece', ['valorEconomico', 'niveis', 'premium', 'resultado']],
    ['O cliente vê quanto paga, mas não percebe quanto ganha com o serviço', ['valorEconomico', 'resultado', 'comprovada', 'conhecimento']],
    ['A marca investe um pouco em muitos canais e não é forte em nenhum', ['concentrar', 'momento', 'continua']],
  ];
  NOVOS.forEach(([texto, ks]) => { if (!P.desafios.some((d) => d.texto === texto)) P.desafios.push({ grupo: G, texto, abordagens: ks.map(A).filter(Boolean) }); });

  // ---- os desafios que já existiam ganham as abordagens novas que de fato respondem a eles ----
  const EXTRA = [
    ['A marca é pouco lembrada', ['concentrar', 'beneficio']],
    ['O cliente não vê diferença', ['beneficio', 'emocao', 'farol']],
    ['A marca só é lembrada por quem já é cliente', ['concentrar']],
    ['A proposta começa pelo preço', ['valorEconomico', 'conhecimento', 'niveis']],
    ['A experiência muda de pessoa para pessoa', ['coerente', 'simples']],
    ['Os clientes compram uma vez e não voltam', ['habito', 'custoBusca']],
    ['Um concorrente maior ocupa a posição de referência', ['farol', 'conversa', 'concentrar']],
    ['A marca tenta atender todo mundo', ['trabalho', 'nicho']],
    ['A empresa tem qualidade, mas não tem provas visíveis', ['conhecimento', 'conversa']],
    ['É difícil achar e comprar da empresa', ['simples', 'onda']],
    ['A comunicação é irregular', ['concentrar', 'farol', 'momento']],
    ['O jeito de comprar da categoria mudou', ['simples', 'trabalho']],
    ['A empresa faz de tudo um pouco', ['trabalho', 'nicho']],
    ['A marca é vista como a mais cara', ['valorEconomico', 'niveis', 'comprovada']],
    ['A marca é vista como barata', ['valorEconomico', 'niveis', 'conhecimento']],
    ['O cliente não entende em que categoria', ['trabalho', 'beneficio', 'especialista']],
    ['Os concorrentes copiam rápido', ['custoBusca', 'beneficio', 'farol', 'conhecimento']],
    ['A empresa é nova', ['humana', 'comprovada', 'naoConsumo']],
    ['A marca cresceu e perdeu o jeito próximo', ['humana', 'coerente']],
    ['O cliente troca de fornecedor com facilidade', ['habito', 'custoBusca', 'humana']],
    ['Quem decide a compra não é quem usa', ['valorEconomico', 'trabalho']],
    ['Todos os concorrentes fazem igual', ['emocao', 'farol', 'beneficio']],
    ['A empresa depende de poucos clientes grandes', ['niveis', 'naoConsumo']],
    ['A marca é lembrada por um produto ou fase antiga', ['farol', 'conversa']],
  ];
  EXTRA.forEach(([ini, ks]) => { const d = P.desafios.find((x) => x.texto.startsWith(ini)); if (d) d.abordagens = [...new Set([...(d.abordagens || []), ...ks.map(A).filter(Boolean)])]; });

  // ---- Diagnóstico ----
  add('resumosDiagnostico', [
    'O maior concorrente da marca era a não compra: muita gente adiava ou resolvia sozinha, e a comunicação falava só com quem já tinha decidido comprar.',
    'A marca não tinha opinião sobre nada da categoria, então não dava ao cliente nenhum motivo para lembrar dela ou falar dela.',
    'A empresa vendia o serviço, mas o cliente comprava o alívio de resolver um problema, e a marca nunca falava disso.',
    'A marca era competente, mas fria: o cliente confiava no trabalho, mas não sentia que a empresa estava do lado dele.',
    'O preço era calculado pelo custo, e não pelo que o cliente ganhava, por isso a empresa cobrava menos do que entregava.',
    'Um único preço para todos fazia a empresa perder os clientes que pagariam mais e também os que só podiam pagar menos.',
    'O esforço de comunicação estava espalhado em muitos canais, e a marca não era forte o bastante em nenhum para ser lembrada.',
    'Nada prendia o cliente à marca: trocar de fornecedor era fácil, e o cliente trocava na primeira oferta.',
  ]);
  add('causas', [
    'A marca não tem um ponto de vista sobre a categoria',
    'A comunicação só fala com quem já decidiu comprar e ignora quem adia ou resolve sozinho',
    'A empresa não sabe que progresso o cliente quer fazer quando procura o serviço',
    'A marca só mostra competência e esquece de mostrar que se importa com o cliente',
    'O preço é calculado pelo custo, não pelo valor para o cliente',
    'Há um único preço e uma única oferta para clientes muito diferentes',
    'O esforço está espalhado em canais demais, sem força em nenhum',
    'Nada na relação faz o cliente perder algo ao trocar de fornecedor',
    'A categoria só fala de características técnicas e ninguém fala do que o cliente sente',
  ]);
  add('notam', ['Fala só de características técnicas', 'Muitos canais, pouco movimento em cada um', 'Ninguém da equipe aparece', 'Opinião clara sobre o mercado']);
  add('acreditam', ['Competente, mas não se importa comigo', 'Próxima, mas não sei se é boa', 'Não sei quanto custa nem o que está incluído', 'Faz só o que pedem, não pensa junto', 'Sabe muito sobre o meu tipo de negócio']);
  add('sentem', ['Alívio', 'Vontade de adiar a decisão', 'Respeito', 'Sensação de ser só mais um cliente', 'Gratidão']);
  add('motivadores', ['Saber quanto custa antes de pedir orçamento', 'Não precisar explicar tudo de novo a cada contato', 'Sentir que a empresa está do lado do cliente']);
  add('discriminadores', ['Tem opinião clara sobre o mercado', 'Pensa o problema junto antes de orçar', 'Oferece níveis de serviço para cada necessidade', 'Mostra quanto o cliente ganha, não só quanto paga', 'Conhece o histórico do cliente e não precisa perguntar de novo']);

  // ---- Narrativa: mensagem central, provas e ideias que não mudam ----
  add('mensagensCentrais', [
    'A gente pensa o problema com você antes de começar.',
    'Do seu lado, do primeiro contato ao fim.',
    'O resultado que você quer, sem precisar acompanhar tudo.',
    'Feito para quem não pode parar para resolver isso.',
    'Para quem já tentou de outro jeito e não deu certo.',
    'Menos preocupação, mais resultado.',
    'A gente diz o que pensa, mesmo quando não é o que você quer ouvir.',
    'Quem entende do seu tipo de negócio.',
    'Você paga pelo resultado, não pelas horas.',
    'Uma vez com a gente, você não precisa procurar de novo.',
  ]);
  add('mensagensApoio', [
    'Mostramos quanto você ganha ou deixa de perder antes do preço',
    'Opções em níveis diferentes, para você escolher o que faz sentido',
    'Guardamos o seu histórico: você nunca precisa explicar tudo de novo',
    'Um diagnóstico antes de qualquer orçamento',
    'Você sabe quem são as pessoas que cuidam do seu caso',
    'Dizemos com clareza o que pensamos sobre o mercado',
    'Sem letras miúdas, taxas escondidas ou pressão para fechar',
    'Atendemos só o tipo de cliente que conhecemos a fundo',
  ]);
  add('identidadeCentral', ['Do lado do cliente, sempre', 'Pensar antes de fazer', 'Opinião própria, dita com respeito', 'Conhecimento que o cliente não precisa ter']);
})();

// ===== Rodada 14b: abordagens antigas reescritas para passar no próprio Teste da estratégia
// (sem "referência" ou "líder", sem começar por meta nem por tarefa); o sentido e a renúncia continuam os mesmos =====
(function () {
  const P = window.GangPresets; if (!P || !P.abordagens) return;
  const TROCA = [
    ['Ser a referência em uma região e em um serviço', 'Ser a mais lembrada em uma região e em um serviço antes de expandir, vencendo pela concentração de casos, indicações e lembrança no mesmo lugar. Abrimos mão de expandir para outras regiões e serviços por enquanto.'],
    ['Criar uma subcategoria e ser a primeira nela', 'Ser a primeira em uma subcategoria nova, com nome próprio, vencendo por não ter com quem ser comparada. Abrimos mão de disputar a categoria inteira de frente.'],
    ['Crescer conquistando quem ainda não compra', 'Ganhar mercado conquistando quem ainda não compra, vencendo por ser a marca que vem à cabeça primeiro em toda a categoria. Abrimos mão de concentrar o esforço só em quem já é cliente.'],
    ['Liderar o jeito novo de comprar', 'Sair na frente no jeito novo de comprar da categoria, vencendo por chegar antes ao canal e ao hábito que estão crescendo. Abrimos mão de proteger o modelo antigo à custa do novo.'],
    ['Ser a desafiante declarada da líder', 'Ser a desafiante declarada da marca mais forte da categoria, vencendo pelo que a maior não muda por ser grande. Abrimos mão de imitar a maior em versão menor.'],
  ];
  const novo = (t) => { const m = TROCA.find(([ini]) => t && t.startsWith(ini)); return m ? m[1] : t; };
  P.abordagens.forEach((a) => { a.texto = novo(a.texto); });
  (P.desafios || []).forEach((d) => { if (d.abordagens) d.abordagens = d.abordagens.map(novo); });
})();

// ===== Rodada 15: só o que tem evidência de eficácia e ainda não estava aqui
// (estudos de campanhas eficazes em B2B e B2C, vendas de marcas que pararam de anunciar, diferenciação percebida x distintividade,
// experimentos de comportamento do consumidor sobre preço e ordem da informação). O que já existia (fatia de voz como ação,
// prova social, histórias, equilíbrio marca/venda, emoção) não foi repetido. =====
(function () {
  const P = window.GangPresets; if (!P || !P.desafios || !P.abordagens) return;
  const G = 'Da biblioteca';
  const add = (lista, itens) => { if (!P[lista]) P[lista] = []; itens.forEach((texto) => { if (!P[lista].some((x) => x.texto === texto)) P[lista].push({ grupo: G, texto }); }); };
  const achar = (ini) => (P.abordagens.find((a) => a.texto.startsWith(ini)) || {}).texto;

  // marcas que falam mais do que o seu tamanho tendem a ganhar participação; as que param de anunciar perdem vendas ano após ano
  const esov = 'Aparecer mais do que o tamanho atual da marca, mantendo a fatia de comunicação acima da fatia de mercado, vencendo porque as marcas que falam mais do que o seu tamanho tendem a crescer. Abrimos mão de parte do lucro de curto prazo para financiar esse crescimento.';
  // os clientes quase nunca veem grandes diferenças entre marcas e compram mesmo assim; o que pesa é reconhecer e lembrar rápido
  const distinta = 'Ser fácil de reconhecer, em vez de tentar parecer diferente em tudo, usando sempre os mesmos sinais próprios, vencendo porque o cliente escolhe a marca que reconhece e lembra mais rápido. Abrimos mão de trocar de visual e de mensagem a cada campanha.';
  add('abordagens', [esov, distinta]);
  const A = { esov, distinta, conquistar: achar('Ganhar mercado conquistando'), emocao: achar('Trazer para a categoria uma emoção'), continua: achar('Construir a marca de forma contínua') };

  // campanhas só racionais, curtas e com público estreito são as que menos fazem a marca crescer (estudo com 435 casos B2B)
  const novo = 'A comunicação fala só com quem já está pronto para comprar agora, de forma racional e em ações curtas, e a marca não ganha clientes novos';
  if (!P.desafios.some((d) => d.texto === novo)) P.desafios.push({ grupo: G, texto: novo, abordagens: ['conquistar', 'esov', 'emocao', 'continua'].map((k) => A[k]).filter(Boolean) });

  const EXTRA = [
    ['A marca é pouco lembrada', ['esov', 'distinta']],
    ['A marca só é lembrada por quem já é cliente', ['esov']],
    ['Um concorrente maior ocupa a posição de referência', ['esov']],
    ['A comunicação é irregular', ['esov', 'distinta']],
    ['O cliente não vê diferença', ['distinta']],
    ['Todos os concorrentes fazem igual', ['distinta']],
  ];
  EXTRA.forEach(([ini, ks]) => { const d = P.desafios.find((x) => x.texto.startsWith(ini)); if (d) d.abordagens = [...new Set([...(d.abordagens || []), ...ks.map((k) => A[k]).filter(Boolean)])]; });

  // Diagnóstico
  add('resumosDiagnostico', [
    'A marca falava só com quem já estava procurando o serviço naquele momento e era desconhecida para a maioria que ia comprar nos meses seguintes.',
  ]);
  add('causas', [
    'A comunicação fala só com quem já está pronto para comprar agora',
    'As campanhas duram pouco tempo e passam por poucos canais',
    'O preço aparece sozinho, sem uma referência para o cliente comparar',
    'A primeira coisa que o cliente vê é a lista de serviços, e não o principal motivo para escolher a marca',
    'Cobranças avulsas e taxas extras fazem o cliente sentir que está pagando o tempo todo',
  ]);
})();

// ===== Rodada 16: situações de compra são momentos da vida de quem compra, não motivos nem etapas da compra.
// "Comparando preços", "alguém de confiança" e "recebi uma indicação" valem para qualquer marca e não mostram em que momento ela é lembrada. =====
(function () {
  const P = window.GangPresets; if (!P || !P.situacoes) return;
  const FORA = ['Estou comparando preços', 'Preciso de alguém de confiança, sem dor de cabeça', 'Recebi uma indicação de alguém de confiança'];
  P.situacoes = P.situacoes.filter((x) => !FORA.includes(x.texto));
})();

// ===== Rodada 17: base da marca (voz e posicionamento), com critério de consultoria
// Voz: atributos genéricos ("amigável", "profissional") servem para qualquer marca; os que diferenciam vêm em tensão,
// dizendo o que a marca é e até onde vai. A voz é fixa; o tom muda conforme o momento (erro, cobrança, atraso, boas-vindas). =====
(function () {
  const P = window.GangPresets; if (!P) return;
  const G = 'Da biblioteca';
  const addObj = (lista, itens) => { if (!P[lista]) P[lista] = []; itens.forEach((it) => { if (!P[lista].some((x) => x.texto === it.texto)) P[lista].push({ grupo: G, ...it }); }); };
  const add = (lista, itens) => addObj(lista, itens.map((texto) => ({ texto })));

  addObj('tom', [
    { texto: 'Confiante sem arrogância', descricao: 'Afirma com base em fatos e casos; nunca diz que é a melhor' },
    { texto: 'Técnica sem jargão', descricao: 'Mostra que domina o assunto, mas explica com as palavras do cliente' },
    { texto: 'Próxima sem intimidade forçada', descricao: 'Fala de igual para igual, sem apelidos nem gírias que a marca não usaria' },
    { texto: 'Direta sem ser fria', descricao: 'Vai ao ponto em poucas frases e sempre diz o próximo passo' },
    { texto: 'Bem-humorada sem fazer piada', descricao: 'Leveza nas palavras, nunca às custas do cliente ou de um problema sério' },
    { texto: 'Firme sem ser dura', descricao: 'Diz não com clareza, explica o porquê e oferece uma saída' },
    { texto: 'Simples sem ser simplória', descricao: 'Frases curtas e palavras comuns, sem tratar o cliente como quem não entende' },
    { texto: 'Calorosa sem exagero', descricao: 'Mostra cuidado com atitudes e detalhes, não com pontos de exclamação' },
    { texto: 'Ousada com fundamento', descricao: 'Diz o que os outros evitam, sempre com um motivo ou uma prova' },
    { texto: 'Sóbria sem ser distante', descricao: 'Poucas palavras e nenhum exagero, mas sempre com uma pessoa por trás' },
  ]);
  // o que a marca diz: inclui os momentos difíceis, em que o tom mais pesa
  add('tomDiz', [
    'Seu pagamento não passou. Para resolver, é só tentar de novo por este link.',
    'Recebemos seu pedido. O próximo passo é nosso: até amanhã você recebe a proposta.',
    'Vai atrasar dois dias, por causa do fornecedor. Já ajustamos o resto para você não esperar mais.',
    'Bem-vindo. Nos primeiros dias, isto é o que vai acontecer.',
    'Não fazemos esse serviço, mas sabemos quem faz bem.',
    'Você pode cancelar quando quiser, pelo mesmo canal em que contratou.',
  ]);
  // o que a marca não diz: frases que qualquer empresa poderia assinar, ou que escondem quem está falando
  add('tomNuncaDiz', [
    'Sua solicitação foi encaminhada ao setor responsável.',
    'Em caso de dúvidas, estamos à disposição.',
    'Somos apaixonados pelo que fazemos.',
    'Soluções completas para todas as suas necessidades.',
    'Agradecemos a compreensão.',
    'Lamentamos o ocorrido.',
  ]);
})();

// ===== Rodada 18: cada abordagem aponta as ações da biblioteca que a executam e as que contradizem a renúncia dela.
// O modelo de plano usa isso: o setor dá o esqueleto (marcos, fundação, canais); a abordagem decide o que entra primeiro e o que fica de fora. =====
(function () {
  const P = window.GangPresets; if (!P || !P.abordagens) return;
  const L = [
 {
  "ini": "Ser a especialista",
  "curto": "Ser a especialista",
  "acoes": [
   "Escolher a especialidade principal e mostrá-la em tudo, sem deixar de falar com toda a categoria",
   "Escrever o perfil do cliente ideal e os sinais de quem não é cliente para a empresa",
   "Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números",
   "Publicar a formação e a especialidade de cada profissional em linguagem simples",
   "Escrever uma página para cada serviço usando o nome que o cliente digita na busca",
   "Preparar uma ideia que ensine algo novo ao cliente sobre o negócio dele e abrir as reuniões com ela",
   "Trocar propostas feitas sem conversa por um diagnóstico curto, pago ou agendado, antes de orçar"
  ],
  "fora": []
 },
 {
  "ini": "Ser a mais lembrada em uma região",
  "curto": "Ser a mais lembrada na região",
  "acoes": [
   "Concentrar a presença numa região ou num nicho onde a empresa possa ser a mais lembrada",
   "Anunciar perto de onde o cliente compra: mídia de rua, rádio local ou ponto de venda",
   "Apoiar algo local que o público frequenta, com a marca bem visível",
   "Participar de uma feira ou evento do setor com os ativos da marca",
   "Pedir avaliação no Google aos clientes satisfeitos recentes e deixar o link pronto para os próximos",
   "Cadastrar e completar o perfil da empresa no Google, nos mapas e nos marketplaces do setor"
  ],
  "fora": []
 },
 {
  "ini": "Concentrar a empresa no que ela faz melhor",
  "curto": "Concentrar no que faz melhor",
  "acoes": [
   "Revisar o portfólio: separar o que traz clientes, o que dá lucro e o que só ocupa espaço",
   "Calcular a margem de cada serviço ou produto e concentrar a comunicação nos mais lucrativos",
   "Cortar um item que a empresa oferece e o cliente não valoriza, e reforçar o essencial na comunicação",
   "Escrever o que a empresa deixa de fazer neste ano para focar no que importa",
   "Revisar o cardápio: destacar os itens de maior margem e tirar os que quase ninguém pede",
   "Calcular quais clientes dão lucro e quais dão prejuízo, contando o tempo gasto com cada um"
  ],
  "fora": [
   "Lançar uma novidade por semestre e comunicar como notícia"
  ]
 },
 {
  "ini": "Ser a opção premium",
  "curto": "Ser a opção premium",
  "acoes": [
   "Criar uma versão premium do serviço principal",
   "Para marcas premium: tirar o desconto público e reservar condições só para clientes antigos",
   "Usar preço redondo nos serviços premium e reservar os quebrados para as ofertas",
   "Refazer a tabela de preços a partir do valor que cada serviço gera para o cliente",
   "Criar um ritual marcante na entrega (embalagem, boas-vindas, encerramento)",
   "Escolher os sinais de qualidade que o cliente enxerga (pontualidade, acabamento, limpeza, resposta rápida) e padronizar esses primeiro",
   "Criar uma garantia clara, por escrito, que tira o risco do cliente",
   "Revisar o ambiente onde o cliente espera e é atendido: limpeza, luz, som, conforto e a marca à vista"
  ],
  "fora": [
   "Fazer uma ação de ativação com prazo (oferta ou condição especial)",
   "Oferecer uma condição melhor nos horários e dias de pouco movimento",
   "Criar um pacote que junte o serviço principal a um complemento, por menos do que os dois separados"
  ]
 },
 {
  "ini": "Sair da faixa de preço baixo",
  "curto": "Sair do preço baixo",
  "acoes": [
   "Refazer a tabela de preços a partir do valor que cada serviço gera para o cliente",
   "Reescrever o modelo de proposta: recomendação primeiro, problema do cliente, impacto em dinheiro e a mensagem central",
   "Tirar o preço como mensagem principal dos anúncios e mostrar o que a empresa faz melhor",
   "Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada",
   "Revisar os preços uma vez por ano com uma regra escrita, e não só quando o custo sobe",
   "Avisar o aumento de preço com antecedência, explicando o motivo e o que melhorou",
   "Separar do preço principal os extras que hoje saem de graça e cobrar por eles",
   "Escrever o perfil do cliente ideal e os sinais de quem não é cliente para a empresa"
  ],
  "fora": [
   "Fazer uma ação de ativação com prazo (oferta ou condição especial)",
   "Oferecer uma condição melhor nos horários e dias de pouco movimento"
  ]
 },
 {
  "ini": "Ser a opção simples",
  "curto": "Ser a opção simples",
  "acoes": [
   "Cortar um item que a empresa oferece e o cliente não valoriza, e reforçar o essencial na comunicação",
   "Revisar o caminho de compra e cortar etapas: botão de WhatsApp, orçamento em 24h, Pix e cartão",
   "Deixar o preço de partida e o próximo passo visíveis em todos os canais da marca",
   "Mandar ao cliente indeciso só as 2 informações que decidem, e não o catálogo inteiro",
   "Organizar os serviços numa estrutura simples: a marca principal mais um nome descritivo, sem submarcas soltas",
   "Oferecer formas de pagamento que facilitem a compra sem baixar o preço: parcelas, assinatura ou entrada menor",
   "Permitir agendar ou pedir online a qualquer hora do dia"
  ],
  "fora": [
   "Criar uma versão premium do serviço principal"
  ]
 },
 {
  "ini": "Ser a escolha mais conveniente",
  "curto": "Ser a mais conveniente",
  "acoes": [
   "Revisar o caminho de compra e cortar etapas: botão de WhatsApp, orçamento em 24h, Pix e cartão",
   "Permitir agendar ou pedir online a qualquer hora do dia",
   "Deixar o botão de contato ou de compra sempre visível no celular, em todas as páginas",
   "Montar o catálogo no WhatsApp Business com fotos, preços e descrição de cada serviço ou produto",
   "Ampliar o horário ou os dias de atendimento nos períodos em que o cliente mais procura",
   "Levar o serviço até o cliente: atendimento em casa, na empresa dele ou online",
   "Definir quem responde os contatos e criar respostas prontas para responder em até 1 hora",
   "Pedir a 3 pessoas de fora que tentem comprar ou pedir orçamento pelo celular e cortar o que travar",
   "Reduzir a compra no site ao menor número de etapas e testar no celular"
  ],
  "fora": []
 },
 {
  "ini": "Ser a primeira em uma subcategoria",
  "curto": "Ser a primeira numa subcategoria",
  "acoes": [
   "Dar nome à categoria que a empresa quer liderar e usar sempre o mesmo nome",
   "Dar um nome próprio ao método ou ao serviço principal",
   "Escolher a palavra que a marca quer ocupar na cabeça do cliente e repeti-la em tudo",
   "Fazer um levantamento do setor e divulgar os números para clientes, imprensa e redes",
   "Abrir a apresentação comercial pela mudança no mercado que torna o jeito antigo arriscado",
   "Dizer sempre o que a empresa é junto com o nome: \"Lume, clínica de estética\""
  ],
  "fora": []
 },
 {
  "ini": "Ser a alternativa ao jeito",
  "curto": "Ser a alternativa à categoria",
  "acoes": [
   "Mapear os códigos da categoria: o que todos repetem, o que está ficando velho e o que está surgindo",
   "Publicar um manifesto curto: o que a marca defende e o que se recusa a fazer",
   "Criar uma campanha feita para ser comentada: uma ideia que as pessoas contem a outras",
   "Publicar uma vez por mês uma opinião forte da empresa sobre um tema do setor",
   "Admitir na comunicação uma limitação honesta da empresa, ao lado do que ela faz de melhor",
   "Identificar uma tensão que o cliente vive na sociedade e colocar a marca do lado dele"
  ],
  "fora": []
 },
 {
  "ini": "Escolher contra quem a marca é comparada",
  "curto": "Escolher contra quem é comparada",
  "acoes": [
   "Criar um comparativo de uma página: a empresa e o concorrente principal, lado a lado",
   "Fazer uma oficina de 1 hora com os sócios: o que o cliente usaria se a empresa não existisse e o que só ela faz",
   "Dizer sempre o que a empresa é junto com o nome: \"Lume, clínica de estética\"",
   "Descrever o negócio pela necessidade que ele resolve, e não pelo produto que vende",
   "Testar a frase de posicionamento com 10 clientes: eles entendem, acreditam e acham diferente?"
  ],
  "fora": []
 },
 {
  "ini": "Competir pelo que leva tempo",
  "curto": "Competir pelo que não se copia",
  "acoes": [
   "Fazer o inventário dos ativos da marca: o que existe, onde aparece e com que frequência",
   "Escrever as regras de uso dos 2 ativos mais fortes e não mudar nada neles por 12 meses",
   "Manter a mesma ideia de campanha por pelo menos 2 anos, variando só as peças",
   "Ao atualizar a identidade, manter os elementos que as pessoas já reconhecem",
   "Cobrir o logo das peças e testar se ainda dá para saber que são da marca",
   "Testar os ativos com 30 pessoas: quantas ligam cada um à marca e quantas ligam a outra empresa",
   "Criar um programa próprio e recorrente que dê energia à marca (prêmio local, série de conteúdo ou encontro anual), sempre com o mesmo nome",
   "Criar uma marca sensorial no espaço: um cheiro, uma música ou um material que seja sempre o mesmo"
  ],
  "fora": [
   "Lançar uma novidade por semestre e comunicar como notícia"
  ]
 },
 {
  "ini": "Ser a parceira de longo prazo",
  "curto": "Ser parceira de longo prazo",
  "acoes": [
   "Fazer uma revisão de resultados a cada trimestre com cada cliente grande",
   "Pedir uma conversa por ano com o dono ou o diretor de cada cliente B2B importante",
   "Lembrar com o cliente os marcos da relação: um ano de parceria, um resultado alcançado",
   "Enviar aos clientes atuais um resumo do que foi entregue e do resultado",
   "Montar um conselho com 5 clientes que se reúne a cada semestre para opinar",
   "Separar os clientes em níveis pelo que trazem para a empresa e definir o atendimento de cada nível",
   "Combinar por escrito, no início, o que a empresa faz, o que o cliente faz e como os dois vão saber que deu certo"
  ],
  "fora": [
   "Fazer uma ação de ativação com prazo (oferta ou condição especial)"
  ]
 },
 {
  "ini": "Trocar a venda única",
  "curto": "Acompanhar, não só vender",
  "acoes": [
   "Montar o acompanhamento depois da compra, com um contato marcado e a oferta do próximo passo",
   "Acompanhar de perto o cliente nas 2 primeiras semanas, quando o risco de desistência é maior",
   "Marcar o próximo atendimento antes de o cliente ir embora",
   "Descobrir de quanto em quanto tempo o cliente volta a comprar e lembrá-lo perto da data",
   "Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado",
   "Fazer uma revisão de resultados a cada trimestre com cada cliente grande",
   "Avisar o cliente que está usando pouco o serviço e oferecer ajuda antes que ele cancele"
  ],
  "fora": []
 },
 {
  "ini": "Ganhar mercado conquistando",
  "curto": "Conquistar quem ainda não compra",
  "acoes": [
   "Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba",
   "Anunciar o ano todo para quem não está comprando agora: a maioria do mercado só vai comprar mais tarde",
   "Calcular a fatia de voz da marca e manter o investimento acima da fatia de mercado",
   "Configurar os anúncios para alcance, com limite de frequência por pessoa",
   "Dividir a verba entre pelo menos 2 tipos de mídia, porque juntos alcançam mais gente",
   "Usar o melhor conteúdo da marca como anúncio para quem ainda não segue a empresa",
   "Ligar a marca às 3 situações de compra mais frequentes em toda a comunicação do semestre"
  ],
  "fora": []
 },
 {
  "ini": "Ser a marca dona de uma situação",
  "curto": "Ser dona de uma situação de compra",
  "acoes": [
   "Listar as 10 situações em que alguém precisa do que a empresa vende: quando, onde, com quem e por quê",
   "Ligar a marca às 3 situações de compra mais frequentes em toda a comunicação do semestre",
   "Produzir um conteúdo para uma situação de compra específica",
   "Anunciar em conteúdos e lugares ligados ao momento em que o cliente pensa no assunto",
   "Revisar as peças do último mês: quantas citam uma situação de compra, e não só o produto",
   "Entrevistar 5 clientes recentes sobre o momento em que decidiram comprar: o que estava acontecendo e o que pesou"
  ],
  "fora": []
 },
 {
  "ini": "Sair na frente no jeito novo",
  "curto": "Sair na frente no jeito novo de comprar",
  "acoes": [
   "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo",
   "Permitir agendar ou pedir online a qualquer hora do dia",
   "Revisar a cada semestre o que mudou na categoria: novos concorrentes, novos canais e novas exigências dos clientes",
   "Reduzir a compra no site ao menor número de etapas e testar no celular",
   "Montar o catálogo no WhatsApp Business com fotos, preços e descrição de cada serviço ou produto",
   "Aparecer nas listas, guias e comparadores que o cliente consulta antes de comprar"
  ],
  "fora": []
 },
 {
  "ini": "Ter uma relação direta",
  "curto": "Ter relação direta com o cliente",
  "acoes": [
   "Garantir que quem procura o nome da marca encontre a empresa em primeiro lugar",
   "Permitir agendar ou pedir online a qualquer hora do dia",
   "Montar o catálogo no WhatsApp Business com fotos, preços e descrição de cada serviço ou produto",
   "Escrever e enviar para a base de clientes uma mensagem útil (dica, novidade ou caso), sem vender",
   "Criar um clube de clientes com nome, encontros e pequenos benefícios para quem já compra"
  ],
  "fora": []
 },
 {
  "ini": "Atender muitos clientes médios",
  "curto": "Atender muitos clientes médios",
  "acoes": [
   "Oferecer formas de pagamento que facilitem a compra sem baixar o preço: parcelas, assinatura ou entrada menor",
   "Criar um programa de indicação com benefício para quem indica e para quem chega",
   "Entrar em um canal novo de venda por semestre: marketplace, parceiro, revenda ou aplicativo",
   "Criar um pacote que junte o serviço principal a um complemento, por menos do que os dois separados",
   "Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada"
  ],
  "fora": [
   "Escolher 20 empresas-alvo e montar uma abordagem sob medida para cada uma"
  ]
 },
 {
  "ini": "Começar por um nicho",
  "curto": "Começar por um nicho",
  "acoes": [
   "Concentrar a presença numa região ou num nicho onde a empresa possa ser a mais lembrada",
   "Escrever o perfil do cliente ideal e os sinais de quem não é cliente para a empresa",
   "Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números",
   "Oferecer uma forma de diminuir o risco da primeira compra: etapa piloto, garantia ou saída combinada",
   "Publicar resultados reais de ex-alunos ou ex-clientes, com autorização"
  ],
  "fora": []
 },
 {
  "ini": "Ser a empresa próxima",
  "curto": "Ser a empresa próxima",
  "acoes": [
   "Gravar um vídeo de 2 minutos apresentando a equipe e o jeito de trabalhar",
   "Personalizar as mensagens aos clientes com o nome e um detalhe da história de cada um",
   "Contar a história de alguém da equipe que mostre, na prática, como a empresa trabalha",
   "Conversar com um cliente toda semana, por 15 minutos, e anotar o que aprendeu",
   "Pedir uma conversa por ano com o dono ou o diretor de cada cliente B2B importante"
  ],
  "fora": []
 },
 {
  "ini": "Prometer menos e entregar",
  "curto": "Prometer menos, entregar sempre",
  "acoes": [
   "Escrever o padrão de atendimento: quem responde, como responde e em quanto tempo, do primeiro contato ao pós-venda",
   "Escrever em uma página o passo a passo do atendimento e treinar a equipe nele",
   "Escrever as promessas do atendimento que todo cliente deve sentir e conferir uma por semana",
   "Escolher os sinais de qualidade que o cliente enxerga (pontualidade, acabamento, limpeza, resposta rápida) e padronizar esses primeiro",
   "Conferir se o que o site e a venda prometem é o que a operação consegue entregar, e alinhar os dois",
   "Combinar por escrito, no início, o que a empresa faz, o que o cliente faz e como os dois vão saber que deu certo",
   "Explicar o tratamento ou o serviço em etapas, com prazos e custos por escrito, antes de começar"
  ],
  "fora": []
 },
 {
  "ini": "Conquistar quem usa",
  "curto": "Conquistar quem usa",
  "acoes": [
   "Mapear em cada venda B2B quem decide, quem usa, quem paga e quem pode barrar, e falar com cada um",
   "Montar um material para o contato interno convencer os outros decisores da empresa dele",
   "Ensinar o cliente a ficar melhor naquilo que ele quer fazer com o produto ou serviço",
   "Acompanhar de perto o cliente nas 2 primeiras semanas, quando o risco de desistência é maior",
   "Avisar o cliente que está usando pouco o serviço e oferecer ajuda antes que ele cancele"
  ],
  "fora": []
 },
 {
  "ini": "Assumir o que a empresa é hoje",
  "curto": "Assumir o que a empresa é hoje",
  "acoes": [
   "Reescrever o site: abrir pelo que só você entrega, na linguagem do cliente",
   "Atualizar redes sociais com a nova identidade",
   "Trocar a fachada / ambiente para a nova identidade",
   "Descrever o negócio pela necessidade que ele resolve, e não pelo produto que vende",
   "Perguntar a 10 clientes quais 3 palavras descrevem a empresa e comparar com o que a marca quer"
  ],
  "fora": []
 },
 {
  "ini": "Ser a única da região",
  "curto": "Ser a única da região",
  "acoes": [
   "Ter um item que só a casa tem e colocá-lo em destaque em todos os canais",
   "Dar um nome próprio ao método ou ao serviço principal",
   "Escolher a palavra que a marca quer ocupar na cabeça do cliente e repeti-la em tudo",
   "Escolher a especialidade principal e mostrá-la em tudo, sem deixar de falar com toda a categoria",
   "Concentrar a presença numa região ou num nicho onde a empresa possa ser a mais lembrada"
  ],
  "fora": []
 },
 {
  "ini": "Vender o resultado",
  "curto": "Vender o resultado",
  "acoes": [
   "Cobrar por projeto ou por resultado, e não por hora",
   "Calcular com o cliente, na primeira reunião, quanto o problema custa a ele por mês",
   "Combinar com o cliente, antes de falar de preço, os objetivos e como o sucesso será medido",
   "Criar uma garantia clara, por escrito, que tira o risco do cliente",
   "Oferecer uma forma de diminuir o risco da primeira compra: etapa piloto, garantia ou saída combinada",
   "Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números"
  ],
  "fora": []
 },
 {
  "ini": "Ser a mais comprovada",
  "curto": "Ser a mais comprovada",
  "acoes": [
   "Transformar cada entrega concluída em um caso curto: o problema, o que foi feito e o resultado em número",
   "Coletar e publicar depoimentos com nomes e números reais",
   "Mostrar prova social concreta no site e na proposta: quantos clientes, quem são e desde quando",
   "Escrever o estudo de caso do melhor cliente: problema, solução e resultado em números",
   "Publicar resultados reais de ex-alunos ou ex-clientes, com autorização",
   "Fotografar antes e depois sempre com a mesma luz e o mesmo ângulo, com autorização",
   "Reunir no site e nas propostas as provas de credibilidade: anos de mercado, clientes atendidos, certificações e garantias",
   "Inscrever a empresa em prêmios, rankings ou certificações respeitados no setor",
   "Revisar o site e os anúncios trocando adjetivos por fatos e números"
  ],
  "fora": []
 },
 {
  "ini": "Ter uma só promessa",
  "curto": "Ter uma só promessa",
  "acoes": [
   "Escrever o roteiro da conversa de venda com a mesma promessa, as mesmas provas e os mesmos limites da comunicação",
   "Treinar a equipe na mensagem central e no tom de voz",
   "Mandar o guia de tom de voz para todos que escrevem ou atendem pela empresa",
   "Mostrar a marca no primeiro dia de quem entra: a promessa, o tom de voz e como atender",
   "Escrever com cada área o que ela faz, no dia a dia, para cumprir a promessa da marca",
   "Conferir se o que o site e a venda prometem é o que a operação consegue entregar, e alinhar os dois",
   "Criar modelos editáveis de posts, propostas e apresentações para a equipe não improvisar",
   "Escrever o glossário da marca: as palavras que a marca usa e as que evita"
  ],
  "fora": []
 },
 {
  "ini": "Construir a marca de forma contínua",
  "curto": "Construir a marca sem parar",
  "acoes": [
   "Manter anúncios no ar todos os meses, com menos verba por mês, em vez de picos com meses parados",
   "Manter a mesma ideia de campanha por pelo menos 2 anos, variando só as peças",
   "Criar uma série fixa nas redes: mesmo dia, mesmo formato e a mesma abertura",
   "Montar o calendário de comunicação dos próximos 6 meses",
   "Dividir a verba do ano entre construir a marca e gerar vendas imediatas, com cerca de 60% para marca",
   "Manter o anúncio que funciona no ar por mais tempo: o cansaço da equipe não é o cansaço do público",
   "Calcular a perda provável de vendas por ficar sem anunciar, antes de qualquer corte na verba de marca"
  ],
  "fora": []
 },
 {
  "ini": "Ser a desafiante declarada",
  "curto": "Ser a desafiante declarada",
  "acoes": [
   "Criar um comparativo de uma página: a empresa e o concorrente principal, lado a lado",
   "Criar uma campanha feita para ser comentada: uma ideia que as pessoas contem a outras",
   "Publicar uma vez por mês uma opinião forte da empresa sobre um tema do setor",
   "Publicar um manifesto curto: o que a marca defende e o que se recusa a fazer",
   "Fazer uma ação com outra marca respeitada pelo mesmo público",
   "Admitir na comunicação uma limitação honesta da empresa, ao lado do que ela faz de melhor"
  ],
  "fora": []
 },
 {
  "ini": "Ter um ponto de vista claro",
  "curto": "Ter um ponto de vista claro",
  "acoes": [
   "Publicar um manifesto curto: o que a marca defende e o que se recusa a fazer",
   "Publicar uma vez por mês uma opinião forte da empresa sobre um tema do setor",
   "Identificar uma tensão que o cliente vive na sociedade e colocar a marca do lado dele",
   "Antes de falar de uma causa ou propósito, conferir se a empresa já pratica o que vai dizer",
   "Admitir na comunicação uma limitação honesta da empresa, ao lado do que ela faz de melhor"
  ],
  "fora": []
 },
 {
  "ini": "Puxar a conversa da categoria",
  "curto": "Puxar a conversa da categoria",
  "acoes": [
   "Publicar uma vez por mês uma opinião forte da empresa sobre um tema do setor",
   "Fazer um levantamento do setor e divulgar os números para clientes, imprensa e redes",
   "Dar uma palestra ou aula aberta sobre o tema da empresa em um evento do setor",
   "Abrir a apresentação comercial pela mudança no mercado que torna o jeito antigo arriscado",
   "Preparar uma ideia que ensine algo novo ao cliente sobre o negócio dele e abrir as reuniões com ela",
   "Levar uma história da empresa para a imprensa local ou para a mídia do setor"
  ],
  "fora": []
 },
 {
  "ini": "Concentrar quase todo o esforço",
  "curto": "Concentrar o esforço",
  "acoes": [
   "Comparar o retorno de cada canal a cada trimestre e passar verba do pior para o melhor",
   "Escrever o que a empresa deixa de fazer neste ano para focar no que importa",
   "Ligar a marca às 3 situações de compra mais frequentes em toda a comunicação do semestre",
   "Manter o anúncio que funciona no ar por mais tempo: o cansaço da equipe não é o cansaço do público",
   "Manter anúncios no ar todos os meses, com menos verba por mês, em vez de picos com meses parados"
  ],
  "fora": []
 },
 {
  "ini": "Trazer para a categoria uma emoção",
  "curto": "Trazer uma emoção nova à categoria",
  "acoes": [
   "Produzir uma peça emocional de marca (história, causa ou cliente real)",
   "Testar o anúncio pela emoção que ele provoca, não só pela mensagem que passa",
   "Mostrar cuidado com as pessoas, e não só competência: gestos, histórias e respostas humanas",
   "Mostrar o que a escolha da marca diz sobre quem compra",
   "Criar algo que o cliente queira mostrar: um certificado, uma foto ou uma frase da marca",
   "Criar um ritual marcante na entrega (embalagem, boas-vindas, encerramento)"
  ],
  "fora": []
 },
 {
  "ini": "Tornar a compra um hábito",
  "curto": "Tornar a compra um hábito",
  "acoes": [
   "Descobrir de quanto em quanto tempo o cliente volta a comprar e lembrá-lo perto da data",
   "Marcar o próximo atendimento antes de o cliente ir embora",
   "Oferecer formas de pagamento que facilitem a compra sem baixar o preço: parcelas, assinatura ou entrada menor",
   "Criar um clube de clientes com nome, encontros e pequenos benefícios para quem já compra",
   "Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar",
   "Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado"
  ],
  "fora": [
   "Fazer uma ação de ativação com prazo (oferta ou condição especial)"
  ]
 },
 {
  "ini": "Ser a fornecedora de confiança",
  "curto": "Ser a fornecedora de confiança",
  "acoes": [
   "Fazer uma revisão de resultados a cada trimestre com cada cliente grande",
   "Combinar por escrito, no início, o que a empresa faz, o que o cliente faz e como os dois vão saber que deu certo",
   "Começar todo relatório e e-mail importante ao cliente pela conclusão, em uma frase",
   "Lembrar com o cliente os marcos da relação: um ano de parceria, um resultado alcançado",
   "Montar um conselho com 5 clientes que se reúne a cada semestre para opinar",
   "Separar os clientes em níveis pelo que trazem para a empresa e definir o atendimento de cada nível"
  ],
  "fora": []
 },
 {
  "ini": "Organizar a oferta em torno do progresso",
  "curto": "Organizar a oferta pelo progresso do cliente",
  "acoes": [
   "Escrever o perfil de compra: o que leva a buscar, o que conta como sucesso, o que trava, quem participa e como compara",
   "Entrevistar 5 clientes recentes sobre o momento em que decidiram comprar: o que estava acontecendo e o que pesou",
   "Descrever o negócio pela necessidade que ele resolve, e não pelo produto que vende",
   "Publicar no site as situações em que a empresa é a melhor escolha",
   "Descrever com o cliente a situação de hoje e a situação desejada antes de apresentar a solução",
   "Produzir um conteúdo para uma situação de compra específica"
  ],
  "fora": []
 },
 {
  "ini": "Competir com a não compra",
  "curto": "Competir com a não compra",
  "acoes": [
   "Oferecer uma aula ou amostra gratuita, com data marcada, para quem ainda não é aluno",
   "Oferecer teste gratuito com acompanhamento nos primeiros 7 dias",
   "Pedir ao cliente novo um primeiro passo bem pequeno antes do compromisso maior",
   "Oferecer uma forma de diminuir o risco da primeira compra: etapa piloto, garantia ou saída combinada",
   "Responder no site as 5 perguntas que todo cliente faz, inclusive o preço",
   "Listar os medos que impedem o cliente de trocar de fornecedor e responder a cada um na comunicação"
  ],
  "fora": []
 },
 {
  "ini": "Ser dona de um benefício",
  "curto": "Ser dona de um benefício",
  "acoes": [
   "Escolher a palavra que a marca quer ocupar na cabeça do cliente e repeti-la em tudo",
   "Reduzir cada anúncio a uma só ideia e cortar o resto",
   "Ligar a marca às 3 situações de compra mais frequentes em toda a comunicação do semestre",
   "Completar a proposta de valor com os três benefícios: o que a marca resolve, como faz o cliente se sentir e o que a escolha diz sobre ele",
   "Ordenar listas de benefícios com o mais forte primeiro e o segundo mais forte por último"
  ],
  "fora": []
 },
 {
  "ini": "Vender conhecimento e diagnóstico",
  "curto": "Vender conhecimento e diagnóstico",
  "acoes": [
   "Trocar propostas feitas sem conversa por um diagnóstico curto, pago ou agendado, antes de orçar",
   "Cobrar pelo diagnóstico ou pela primeira etapa, em vez de fazer de graça",
   "Preparar uma ideia que ensine algo novo ao cliente sobre o negócio dele e abrir as reuniões com ela",
   "Dar uma recomendação útil já na primeira conversa, antes de fechar qualquer coisa",
   "Fazer um levantamento do setor e divulgar os números para clientes, imprensa e redes",
   "Calcular com o cliente, na primeira reunião, quanto o problema custa a ele por mês"
  ],
  "fora": []
 },
 {
  "ini": "Mostrar as pessoas por trás",
  "curto": "Mostrar as pessoas por trás da marca",
  "acoes": [
   "Gravar um vídeo de 2 minutos apresentando a equipe e o jeito de trabalhar",
   "Contar a história de alguém da equipe que mostre, na prática, como a empresa trabalha",
   "Mostrar cuidado com as pessoas, e não só competência: gestos, histórias e respostas humanas",
   "Admitir na comunicação uma limitação honesta da empresa, ao lado do que ela faz de melhor",
   "Responder todas as avaliações atuais, inclusive as negativas, e definir quem responde as novas",
   "Dar à equipe um valor ou uma solução que ela pode usar na hora para resolver uma reclamação, sem pedir autorização"
  ],
  "fora": []
 },
 {
  "ini": "Ter ofertas em níveis",
  "curto": "Ter ofertas em níveis",
  "acoes": [
   "Montar a proposta com 3 opções: a mais completa primeiro e a recomendada marcada",
   "Separar os clientes em níveis pelo que trazem para a empresa e definir o atendimento de cada nível",
   "Criar um pacote que junte o serviço principal a um complemento, por menos do que os dois separados",
   "Criar uma versão premium do serviço principal",
   "Oferecer formas de pagamento que facilitem a compra sem baixar o preço: parcelas, assinatura ou entrada menor"
  ],
  "fora": []
 },
 {
  "ini": "Cobrar pela diferença de valor",
  "curto": "Cobrar pelo valor",
  "acoes": [
   "Refazer a tabela de preços a partir do valor que cada serviço gera para o cliente",
   "Calcular com o cliente, na primeira reunião, quanto o problema custa a ele por mês",
   "Reescrever o modelo de proposta: recomendação primeiro, problema do cliente, impacto em dinheiro e a mensagem central",
   "Combinar com o cliente, antes de falar de preço, os objetivos e como o sucesso será medido",
   "Cobrar por projeto ou por resultado, e não por hora",
   "Medir quanto a mais o cliente aceita pagar pela marca em comparação com a média do mercado"
  ],
  "fora": []
 },
 {
  "ini": "Aparecer mais do que o tamanho",
  "curto": "Aparecer mais do que o tamanho",
  "acoes": [
   "Calcular a fatia de voz da marca e manter o investimento acima da fatia de mercado",
   "Dividir a verba do ano entre construir a marca e gerar vendas imediatas, com cerca de 60% para marca",
   "Manter anúncios no ar todos os meses, com menos verba por mês, em vez de picos com meses parados",
   "Calcular a perda provável de vendas por ficar sem anunciar, antes de qualquer corte na verba de marca",
   "Fazer uma campanha de alcance amplo para quem ainda não é cliente, com a maior parte da verba"
  ],
  "fora": []
 },
 {
  "ini": "Ser fácil de reconhecer",
  "curto": "Ser fácil de reconhecer",
  "acoes": [
   "Fazer o inventário dos ativos da marca: o que existe, onde aparece e com que frequência",
   "Escrever as regras de uso dos 2 ativos mais fortes e não mudar nada neles por 12 meses",
   "Cobrir o logo das peças e testar se ainda dá para saber que são da marca",
   "Testar os ativos com 30 pessoas: quantas ligam cada um à marca e quantas ligam a outra empresa",
   "Criar um bordão ou personagem próprio e usar em todos os anúncios",
   "Criar uma vinheta sonora curta e usar no início e no fim de todos os vídeos",
   "Ao atualizar a identidade, manter os elementos que as pessoas já reconhecem"
  ],
  "fora": []
 }
];
  L.forEach((x) => { const a = P.abordagens.find((y) => y.texto.startsWith(x.ini)); if (a) { a.curto = x.curto; a.acoes = x.acoes; a.fora = x.fora; } });
})();

// ===== Rodada 19: ações novas que a biblioteca ainda não cobria (posicionamento a partir dos melhores clientes, custo de troca,
// marcas desafiantes, posicionamento reverso, participação no gasto do cliente, preço de referência, dor de pagar, conselheiro de confiança).
// Cada uma já vem ligada às abordagens que ela executa. =====
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Listar os 10 melhores clientes (compraram rápido, pagaram sem negociar, indicaram) e escrever o que eles têm em comum', esforco: 'marca', promessa: 'valor', tema: 'posicionamento', tam: 'M', ler: 60,
      porque: 'O posicionamento sai mais certeiro a partir de quem já ama a empresa do que de um público imaginado. O que esses clientes têm em comum mostra para quem a marca é a escolha óbvia.',
      metrica: 'Clientes novos parecidos com os melhores', passos: ['Escolher os 10 melhores clientes do último ano', 'Anotar por que compraram e o que valorizam', 'Achar o que se repete entre eles', 'Usar isso no perfil do cliente ideal e na comunicação'] },
    { texto: 'Mandar ao cliente, no mesmo dia, um resumo escrito de cada reunião: o que foi decidido, quem faz o quê e até quando', esforco: 'venda', promessa: 'vendas', tema: 'relacao', tam: 'P', ler: 60,
      porque: 'Confiança nasce de cumprir o combinado, e o combinado só existe se estiver escrito. O resumo evita mal-entendidos e mostra que a empresa cuida do cliente entre um contato e outro.',
      metrica: 'Reuniões com resumo enviado no mesmo dia', passos: ['Criar um modelo curto de resumo', 'Preencher logo depois da reunião', 'Enviar no mesmo dia', 'Começar a reunião seguinte pelo que foi combinado'] },
    { texto: 'Tirar o trabalho de quem quer trocar o concorrente pela empresa: a empresa faz a mudança, leva o histórico e cuida da transição', esforco: 'venda', promessa: 'pessoas', tema: 'experiencia', tam: 'M', ler: 90,
      porque: 'Muita gente insatisfeita com o fornecedor atual não troca por causa do trabalho de mudar. Quando a empresa assume esse trabalho, a barreira some e o cliente do concorrente fica ao alcance.',
      metrica: 'Clientes vindos de concorrentes', passos: ['Listar o que dá trabalho para quem troca de fornecedor', 'Definir o que a empresa assume na mudança', 'Escrever a oferta de transição em uma frase', 'Usar nas conversas com quem compra do concorrente'] },
    { texto: 'Fazer um gesto público que mostre que a marca mudou: tirar algo que a categoria inteira faz e explicar por quê', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tam: 'M', ler: 90,
      porque: 'Marcas desafiantes crescem quando as pessoas são obrigadas a reavaliar o que pensavam delas. Um gesto visível e explicado faz mais por essa reavaliação do que uma campanha dizendo que a marca mudou.',
      metrica: 'Pessoas que comentam ou perguntam sobre a mudança', passos: ['Listar o que todos na categoria fazem por costume', 'Escolher um item que a marca vai abandonar', 'Escrever o porquê em poucas linhas', 'Comunicar a mudança em todos os canais'] },
    { texto: 'Levantar o que os clientes atuais ainda compram de outros fornecedores e oferecer o que faz sentido', esforco: 'venda', promessa: 'vendas', tema: 'relacao', tam: 'M', ler: 90,
      porque: 'Crescer com quem já confia na empresa custa menos do que conquistar um cliente novo. Saber o que o cliente ainda compra fora mostra onde há espaço para atendê-lo melhor.',
      metrica: 'Participação da empresa no gasto do cliente', passos: ['Perguntar aos principais clientes o que mais compram na categoria', 'Anotar o que a empresa poderia atender', 'Escolher as ofertas que fazem sentido', 'Oferecer na próxima conversa, sem pressão'] },
    { texto: 'Antes de cada reunião com cliente, escrever 3 hipóteses sobre o problema dele e testá-las com perguntas', esforco: 'venda', promessa: 'valor', tema: 'venda', tam: 'P', ler: 60,
      porque: 'Quem chega com hipóteses conduz a conversa como especialista; quem chega só para ouvir vira fornecedor. As perguntas certas mostram conhecimento antes de qualquer proposta.',
      metrica: 'Reuniões que viram proposta', passos: ['Pesquisar o cliente antes da reunião', 'Escrever 3 hipóteses sobre o problema', 'Transformar cada uma em pergunta', 'Anotar quais se confirmaram'] },
    { texto: 'Tirar da oferta algo que todos acham obrigatório e o cliente não valoriza, e acrescentar algo que ninguém oferece', esforco: 'marca', promessa: 'valor', tema: 'posicionamento', tam: 'M', ler: 90,
      porque: 'Melhorar o que todos já fazem deixa as marcas cada vez mais parecidas. Tirar o que sobra e acrescentar o inesperado cria uma diferença que o cliente percebe e lembra.',
      metrica: 'Clientes que citam o item novo como motivo de escolha', passos: ['Listar o que toda a categoria oferece', 'Perguntar a clientes o que eles não usam', 'Escolher o que tirar e o que acrescentar', 'Comunicar a nova oferta com clareza'] },
    { texto: 'Mostrar ao lado do preço uma referência para o cliente comparar: o custo do problema ou o da alternativa que ele usaria', esforco: 'venda', promessa: 'valor', tema: 'preco', tam: 'P', ler: 60,
      porque: 'Ninguém avalia um preço sozinho: ele é sempre comparado com algo. Se a empresa não dá a referência, o cliente usa a do concorrente mais barato.',
      metrica: 'Pedidos de desconto por proposta', passos: ['Calcular o custo do problema ou da alternativa', 'Escrever a comparação em uma linha', 'Colocar ao lado do preço na proposta e no site', 'Acompanhar os pedidos de desconto'] },
    { texto: 'Juntar cobranças pequenas e avulsas em um valor único e tirar as taxas que o cliente não espera', esforco: 'venda', promessa: 'valor', tema: 'preco', tam: 'P', ler: 60,
      porque: 'Cada cobrança separada faz o cliente sentir de novo que está pagando. Um valor único e sem surpresa deixa a compra mais leve e a marca mais confiável.',
      metrica: 'Reclamações sobre cobrança', passos: ['Listar todas as cobranças e taxas atuais', 'Marcar as que o cliente não espera', 'Montar um valor único ou um pacote', 'Avisar os clientes da mudança'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  // ligar às abordagens que elas executam
  const T = (ini) => (NOVAS.find((x) => x.texto.startsWith(ini)) || {}).texto;
  const LIGA = [
    ['Listar os 10 melhores', ['Ser a especialista', 'Começar por um nicho', 'Organizar a oferta em torno do progresso']],
    ['Mandar ao cliente, no mesmo dia', ['Prometer menos e entregar', 'Ser a parceira de longo prazo', 'Ser a fornecedora de confiança', 'Ser a empresa próxima']],
    ['Tirar o trabalho de quem quer trocar', ['Ganhar mercado conquistando', 'Ser a desafiante declarada', 'Ser a escolha mais conveniente']],
    ['Fazer um gesto público', ['Ter um ponto de vista claro', 'Ser a alternativa ao jeito', 'Assumir o que a empresa é hoje', 'Ser a desafiante declarada']],
    ['Levantar o que os clientes atuais', ['Ser a parceira de longo prazo', 'Trocar a venda única']],
    ['Antes de cada reunião com cliente', ['Vender conhecimento e diagnóstico', 'Ser a especialista']],
    ['Tirar da oferta algo que todos', ['Ser a alternativa ao jeito', 'Ser a primeira em uma subcategoria', 'Ser a única da região']],
    ['Mostrar ao lado do preço', ['Cobrar pela diferença de valor', 'Ser a opção premium', 'Sair da faixa de preço baixo']],
    ['Juntar cobranças pequenas', ['Ser a opção simples', 'Ser a escolha mais conveniente']],
  ];
  LIGA.forEach(([ini, abs]) => { const t = T(ini); if (!t) return; abs.forEach((a) => { const ab = (P.abordagens || []).find((y) => y.texto.startsWith(a)); if (ab && ab.acoes && !ab.acoes.includes(t)) ab.acoes.push(t); }); });
})();


// ===== Rodada 20: o tipo de esforço de cada ação, como nos estudos de eficácia de marca.
// Marca = comunicação de longo prazo, ampla, para ser lembrada (anúncio de alcance, conteúdo, presença com os ativos, comunidade).
// Ativação = comunicação de curto prazo para quem já está comprando (oferta, busca, remarketing, reativação, novos canais de venda).
// Base = o que não é comunicação: posicionamento, proposta, preço, venda, atendimento, equipe e medição. Fica fora da conta marca × ativação. =====
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const PROMO = /(ativação com prazo|condição melhor|urgência|parcelas|brinde ou um extra|pacote que junte|teste gratuito|amostra gratuita|degustação)/i;
  P.acoes.forEach((x) => {
    if (x.esforco === 'marca' && ['anuncio', 'conteudo', 'presenca', 'relacao'].includes(x.tema)) x.tipo = 'marca';
    else if (x.esforco === 'venda' && ['anuncio', 'conteudo', 'relacao', 'distribuicao'].includes(x.tema)) x.tipo = 'ativacao';
    else if (PROMO.test(x.texto)) x.tipo = 'ativacao';
    else x.tipo = 'base';
  });
  // revisão uma a uma: operação e atendimento não são comunicação (base); campanha de data e respostas para quem já compara são ativação
  const BASE = /^(Revisar o site e os anúncios trocando|Listar todos os lugares|Ampliar o horário|Garantir que o produto|Separar os clientes em níveis|Fazer uma revisão de resultados|Pedir uma conversa por ano|Revisar o site com uma regra|Permitir agendar|Levar o serviço até|Começar todo relatório|Mandar ao cliente, no mesmo dia|Acompanhar de perto o cliente|Montar o calendário de comunicação|Responder todas as avaliações|Escrever o plano em 3 passos)/;
  const ATIV = /^(Responder no site as 5 perguntas|Planejar uma campanha para as datas)/;
  P.acoes.forEach((x) => { if (BASE.test(x.texto)) x.tipo = 'base'; else if (ATIV.test(x.texto)) x.tipo = 'ativacao'; });
})();

// ===== Rodada 21: quem usa nem sempre é quem decide (paciente e família, aluno e pais, equipe e dono).
// Ações que servem a qualquer setor, para "Conquistar quem usa" não depender só das ações de B2B. =====
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Dar a quem usa o serviço um resumo simples do resultado, pronto para mostrar a quem paga ou decide', esforco: 'venda', promessa: 'vendas', tema: 'relacao', tipo: 'ativacao', tam: 'P', ler: 60,
      porque: 'Quem usa vira defensor da marca quando tem como mostrar o resultado. Um resumo pronto faz essa conversa acontecer sem a empresa estar presente.',
      metrica: 'Renovações e indicações vindas de quem usa', passos: ['Escolher os 3 números ou fatos que mostram o resultado', 'Montar um resumo de uma página', 'Entregar a quem usa ao fim de cada etapa', 'Perguntar se ele mostrou a quem decide'] },
    { texto: 'Ouvir quem usa o serviço no dia a dia e levar o que ele pede para a conversa com quem decide', esforco: 'venda', promessa: 'valor', tema: 'relacao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Quem decide confia mais no que vem de dentro da própria casa. Levar a voz de quem usa mostra que a empresa conhece a rotina dele e transforma o usuário em aliado.',
      metrica: 'Pedidos de quem usa atendidos', passos: ['Marcar uma conversa curta com quem usa', 'Anotar o que ele mais pede ou reclama', 'Levar os pontos à conversa com quem decide', 'Contar a quem usa o que foi feito'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  const ab = (P.abordagens || []).find((y) => y.texto.startsWith('Conquistar quem usa'));
  if (ab && ab.acoes) NOVAS.forEach((x) => { if (!ab.acoes.includes(x.texto)) ab.acoes.push(x.texto); });
})();

// ===== Rodada 22: no varejo e na alimentação, "Vender o resultado" e "Conquistar quem usa" ficavam com poucas ações,
// porque parte delas é de serviços ou B2B. Ligadas aqui ações gerais que de fato executam essas escolhas. =====
(function () {
  const P = window.GangPresets; if (!P || !P.abordagens) return;
  const liga = (ini, titulos) => { const ab = P.abordagens.find((y) => y.texto.startsWith(ini)); if (!ab || !ab.acoes) return;
    titulos.forEach((t) => { if (P.acoes.some((a) => a.texto === t) && !ab.acoes.includes(t)) ab.acoes.push(t); }); };
  liga('Vender o resultado', ['Coletar e publicar depoimentos com nomes e números reais',
    'Mostrar ao lado do preço uma referência para o cliente comparar: o custo do problema ou o da alternativa que ele usaria']);
  liga('Conquistar quem usa', ['Criar algo que o cliente queira mostrar: um certificado, uma foto ou uma frase da marca']);
})();

// ===== Rodada 23: em B2B e tecnologia, "Sair na frente no jeito novo de comprar" e "Ter relação direta com o cliente"
// ficavam com 3 ações. Ligadas as ações desses setores que executam as duas escolhas (canal próprio, teste gratuito, relação com quem decide). =====
(function () {
  const P = window.GangPresets; if (!P || !P.abordagens) return;
  const liga = (ini, titulos) => { const ab = P.abordagens.find((y) => y.texto.startsWith(ini)); if (!ab || !ab.acoes) return;
    titulos.forEach((t) => { if (P.acoes.some((a) => a.texto === t) && !ab.acoes.includes(t)) ab.acoes.push(t); }); };
  liga('Sair na frente no jeito novo', ['Publicar toda semana no LinkedIn da empresa e dos sócios, sempre com os mesmos ativos da marca',
    'Oferecer teste gratuito com acompanhamento nos primeiros 7 dias']);
  liga('Ter uma relação direta', ['Publicar toda semana no LinkedIn da empresa e dos sócios, sempre com os mesmos ativos da marca',
    'Pedir uma conversa por ano com o dono ou o diretor de cada cliente B2B importante']);
})();

// ===== Rodada 24: ativação fundamentada, onde a biblioteca tinha pouca (a auditoria mostrou 2,6× mais marca que ativação).
// B2B: os "comportamentos vencedores" dos níveis de resposta, leads e conversão do estudo de 435 casos de eficácia B2B.
// Varejo: as medições de comportamento de compra dentro da loja (cesta, zona de entrada, caminho real e sinalização).
// Também passam a contar como ativação 4 ações que são ofertas e contatos de venda de curto prazo, pela definição de ativação dos estudos de eficácia. =====
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Mostrar o serviço funcionando para quem está avaliando: uma demonstração concreta, e não uma lista de vantagens', esforco: 'venda', promessa: 'vendas', tema: 'venda', tipo: 'ativacao', tam: 'M', ler: 60, setores: ['b2b', 'servicos'],
      porque: 'Nos casos B2B mais eficazes, mostrar o benefício de forma concreta e inesperada fez mais pela resposta do que listar atributos. Ver funcionando tira a dúvida que a proposta não tira.',
      metrica: 'Demonstrações que viram proposta', passos: ['Escolher o resultado mais convincente do serviço', 'Montar uma demonstração curta, com um caso real', 'Oferecer a demonstração a quem está avaliando', 'Anotar quantas viram proposta'] },
    { texto: 'Mandar às empresas-alvo uma peça direta que convide a agir (um desafio, uma pergunta, um teste rápido), e não uma lista de argumentos', esforco: 'venda', promessa: 'pessoas', tema: 'anuncio', tipo: 'ativacao', tam: 'M', ler: 60, setores: ['b2b'],
      porque: 'Nos casos B2B eficazes, o contato direto que envolve o destinatário teve mais resposta do que o que tenta dizer tudo. Quem participa se qualifica sozinho.',
      metrica: 'Respostas à peça direta', passos: ['Escolher as empresas-alvo', 'Criar um convite com uma pergunta ou desafio do setor', 'Enviar com um próximo passo simples', 'Contar as respostas e as conversas abertas'] },
    { texto: 'Acompanhar os contatos que mudam de empresa e retomar a conversa na empresa nova', esforco: 'venda', promessa: 'pessoas', tema: 'relacao', tipo: 'ativacao', tam: 'P', ler: 90, setores: ['b2b', 'servicos'],
      porque: 'Nos casos B2B estudados, manter a relação com a pessoa mesmo quando ela troca de empresa gerou mais oportunidades do que acompanhar só o cargo. Quem já confia na marca a leva junto.',
      metrica: 'Oportunidades vindas de contatos que mudaram de empresa', passos: ['Listar os contatos que mais compraram ou indicaram', 'Ver todo mês quem mudou de empresa', 'Mandar uma mensagem de parabéns com algo útil', 'Propor uma conversa na empresa nova'] },
    { texto: 'Preparar os parceiros e revendedores que vendem a marca: material pronto, o argumento principal e um incentivo claro', esforco: 'venda', promessa: 'vendas', tema: 'distribuicao', tipo: 'ativacao', tam: 'M', ler: 90, setores: ['b2b', 'varejo'],
      porque: 'Em muitas categorias, quem revende influencia a decisão final. Nos casos B2B eficazes de conversão, informar, inspirar e incentivar o canal foi um dos comportamentos vencedores.',
      metrica: 'Vendas feitas pelos parceiros', passos: ['Listar quem revende ou indica a marca', 'Montar um material curto com o argumento principal', 'Definir um incentivo simples', 'Acompanhar as vendas por parceiro'] },
    { texto: 'Deixar cestas ou sacolas ao alcance na entrada e ao longo da loja', esforco: 'venda', promessa: 'vendas', tema: 'experiencia', tipo: 'ativacao', tam: 'P', ler: 30, setores: ['varejo'],
      porque: 'Nas medições de comportamento de compra em loja, quem pegou uma cesta comprou muito mais do que quem andava de mãos cheias: num dos estudos, 75% contra 34%. Mão ocupada é compra que não acontece.',
      metrica: 'Clientes que compram por visita', passos: ['Colocar cestas logo depois da entrada', 'Deixar cestas também no meio e no fundo da loja', 'Treinar a equipe a oferecer cesta a quem está com as mãos cheias', 'Comparar as vendas por visita antes e depois'] },
    { texto: 'Tirar das primeiras passadas da loja as ofertas e avisos importantes e colocá-los onde o cliente já desacelerou', esforco: 'venda', promessa: 'vendas', tema: 'experiencia', tipo: 'ativacao', tam: 'P', ler: 30, setores: ['varejo'],
      porque: 'Nas medições em loja, quem acaba de entrar ainda está se ajustando ao ambiente e quase não vê o que está na entrada. A mesma oferta rende mais alguns passos para dentro.',
      metrica: 'Vendas dos itens em oferta', passos: ['Ver o que está nos primeiros metros da loja', 'Mudar ofertas e avisos para depois da entrada', 'Deixar a entrada livre e convidativa', 'Comparar as vendas dos itens antes e depois'] },
    { texto: 'Virar placas e ofertas para o caminho que o cliente realmente faz, e não para a porta principal', esforco: 'venda', promessa: 'vendas', tema: 'experiencia', tipo: 'ativacao', tam: 'P', ler: 30, setores: ['varejo'],
      porque: 'Nas medições em loja, grande parte da sinalização estava virada para a entrada principal, enquanto os clientes chegavam às seções por outro lado. Placa que não é vista não vende.',
      metrica: 'Clientes que param nos pontos com oferta', passos: ['Observar por um dia por onde os clientes chegam a cada seção', 'Marcar as placas que estão de costas para esse caminho', 'Virar ou mudar as placas', 'Observar de novo quantos param'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  // ofertas e contatos de venda de curto prazo: ativação, e não base
  ['Oferecer o próximo serviço lógico logo depois que o cliente tem um resultado', 'Oferecer uma forma de diminuir o risco da primeira compra: etapa piloto, garantia ou saída combinada',
    'Pedir ao cliente novo um primeiro passo bem pequeno antes do compromisso maior', 'Combinar com o cliente o acompanhamento depois da proposta: em 2, 5 e 10 dias, cada contato com algo útil']
    .forEach((t) => { const a = P.acoes.find((x) => x.texto === t); if (a) a.tipo = 'ativacao'; });
  // ligar às abordagens que elas executam
  const liga = (ini, titulos) => { const ab = (P.abordagens || []).find((y) => y.texto.startsWith(ini)); if (!ab || !ab.acoes) return;
    titulos.forEach((t) => { if (!ab.acoes.includes(t)) ab.acoes.push(t); }); };
  liga('Ser a mais comprovada', [NOVAS[0].texto]);
  liga('Vender o resultado', [NOVAS[0].texto]);
  liga('Ser a parceira de longo prazo', [NOVAS[2].texto]);
  liga('Ter uma relação direta', [NOVAS[2].texto]);
  liga('Ganhar mercado conquistando', [NOVAS[3].texto]);
  liga('Ser a escolha mais conveniente', [NOVAS[4].texto]);
})();

// ===== Rodada 25: execução, serviços e varejo, a partir de três livros novos do Drive (leitura do texto completo).
// Execução: a meta "de X para Y até quando", as medidas de direção (o que a equipe controla e antecipa o resultado), o placar
// e a reunião semanal curta. Serviços: a flor do serviço, as travas contra erro, a psicologia da espera, os motivos de saída
// e a zona de tolerância. Varejo: o tempo do comprador (só 20% dele é escolhendo produto), os itens que mais vendem no caminho
// e a medição de quem passa, para e compra. =====
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Escrever o objetivo principal do ano no formato "de X para Y até quando" e mostrar para toda a equipe', esforco: 'marca', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 30,
      porque: 'Uma meta sem ponto de partida, ponto de chegada e prazo não orienta ninguém. Escrita como "de X para Y até quando", ela diz onde a empresa está, aonde quer chegar e quando.',
      metrica: 'Equipe que sabe dizer o objetivo e o prazo', passos: ['Escolher o objetivo que mais importa no ano', 'Escrever onde está hoje, aonde quer chegar e até quando', 'Mostrar para toda a equipe', 'Perguntar a 3 pessoas qual é o objetivo um mês depois'] },
    { texto: 'Escolher 1 ou 2 medidas de direção para o objetivo principal: ações que a equipe controla e que antecipam o resultado', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 60,
      porque: 'O faturamento só mostra o resultado depois que ele aconteceu. Uma medida de direção, como propostas enviadas ou clientes contatados por semana, prevê o resultado e está nas mãos da equipe.',
      metrica: 'Medida de direção cumprida por semana', passos: ['Listar o que a equipe pode fazer que mais mexe no objetivo', 'Escolher 1 ou 2 que dá para medir toda semana', 'Definir a meta semanal de cada uma', 'Acompanhar junto com o resultado'] },
    { texto: 'Montar um placar simples, à vista da equipe, que mostre em segundos se o objetivo está sendo ganho', esforco: 'venda', promessa: 'vendas', tema: 'equipe', tipo: 'base', tam: 'P', ler: 30,
      porque: 'As pessoas jogam diferente quando sabem o placar. Um quadro simples, com a meta e as medidas de direção, mostra se a equipe está ganhando ou perdendo sem precisar de relatório.',
      metrica: 'Semanas com o placar atualizado', passos: ['Colocar no placar o objetivo e as medidas de direção', 'Deixar à vista de todos', 'Atualizar toda semana', 'Mostrar com clareza se está ganhando ou perdendo'] },
    { texto: 'Fazer uma reunião semanal de 20 a 30 minutos com a equipe: o que cada um cumpriu, como está o placar e o compromisso da próxima semana', esforco: 'venda', promessa: 'vendas', tema: 'equipe', tipo: 'base', tam: 'P', ler: 60,
      porque: 'O dia a dia sempre engole o que é novo. Uma reunião curta e fixa, em que cada pessoa presta contas do que prometeu, mantém o plano andando no meio da rotina.',
      metrica: 'Compromissos semanais cumpridos', passos: ['Marcar o mesmo dia e horário toda semana', 'Cada pessoa conta o que cumpriu da semana anterior', 'Olhar o placar juntos', 'Cada pessoa assume um compromisso para a semana'] },
    { texto: 'Revisar o que cerca o serviço principal (informação, agendamento, cobrança, pagamento, orientação, recepção e exceções) e corrigir o que mais incomoda o cliente', esforco: 'venda', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'M', ler: 60,
      porque: 'O serviço principal costuma ser parecido entre concorrentes. O que o cliente lembra muitas vezes é o que está em volta dele: a informação que faltou, a cobrança confusa, a espera na recepção.',
      metrica: 'Reclamações sobre o que cerca o serviço', passos: ['Listar tudo o que acontece em volta do serviço principal', 'Perguntar a clientes o que mais incomoda', 'Escolher o pior ponto', 'Corrigir e conferir depois de um mês'] },
    { texto: 'Colocar uma trava contra erro em cada ponto do atendimento que mais falha: checklist, confirmação ou um passo que não deixa pular etapa', esforco: 'venda', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'M', ler: 60,
      porque: 'Pedir cuidado não evita erro; o processo precisa tornar o erro difícil de acontecer. Uma trava simples, como um checklist ou uma confirmação, protege a promessa da marca nos pontos frágeis.',
      metrica: 'Erros nos pontos com trava', passos: ['Listar os pontos onde o atendimento mais falha', 'Descobrir por que falha', 'Criar uma trava simples para cada um', 'Contar os erros antes e depois'] },
    { texto: 'Ocupar o tempo de espera do cliente com algo útil ou agradável, no local ou por mensagem', esforco: 'venda', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'P', ler: 30, setores: ['servicos', 'varejo'],
      porque: 'Tempo ocioso parece mais longo do que tempo ocupado: as pessoas acham que esperaram mais do que de fato esperaram. Dar algo para fazer ou ver encurta a espera sentida.',
      metrica: 'Reclamações sobre espera', passos: ['Ver onde e quanto o cliente espera', 'Escolher algo útil para esse tempo (informação, conforto, conteúdo)', 'Aplicar na recepção ou na mensagem de espera', 'Perguntar aos clientes como sentiram a espera'] },
    { texto: 'Ouvir os clientes que deixaram de comprar, anotar por que saíram e corrigir o motivo que mais se repete', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'M', ler: 90,
      porque: 'Reduzir a saída de clientes começa por saber o que leva à saída. Os motivos costumam se repetir, e corrigir o principal deles protege mais clientes do que qualquer oferta para quem já decidiu sair.',
      metrica: 'Clientes que deixam de comprar', passos: ['Listar quem deixou de comprar nos últimos 6 meses', 'Conversar com pelo menos 10 deles', 'Agrupar os motivos', 'Corrigir o que mais se repete'] },
    { texto: 'Perguntar aos clientes o prazo e a espera mínimos que aceitam e os que gostariam, e manter o serviço dentro dessa faixa', esforco: 'venda', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Dentro de uma faixa de tolerância o cliente nem repara no serviço; abaixo dela ele se frustra, acima ele se encanta. Saber onde está essa faixa mostra onde vale investir.',
      metrica: 'Atendimentos dentro da faixa aceita', passos: ['Perguntar a 10 clientes o mínimo aceitável e o desejado', 'Comparar com o que a empresa entrega hoje', 'Corrigir o que estiver abaixo do mínimo', 'Escolher um ponto para superar o desejado'] },
    { texto: 'Medir em cada área da loja quantos clientes passam, quantos param e quantos compram, e mudar o que não para ninguém', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'M', ler: 60, setores: ['varejo'],
      porque: 'Toda venda na loja passa por três momentos: o cliente passa pelo produto, para diante dele e decide comprar. Medir os três mostra se o problema é o lugar, a exposição ou a oferta.',
      metrica: 'Clientes que compram por cliente que passa', passos: ['Escolher as áreas mais importantes da loja', 'Contar por uma hora quantos passam, param e compram', 'Achar onde as pessoas passam e não param', 'Mudar a exposição e medir de novo'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  // a ação antiga mandava os itens mais procurados para o fundo da loja; as medições de trajeto mostram que esconder os itens
  // mais vendidos desperdiça o tempo do comprador (só 20% do tempo na loja é gasto escolhendo produto) e metade das compras tem até 5 itens
  const ANTIGA = 'Organizar a loja: os mais procurados ao fundo e os de impulso perto do caixa';
  const NOVA = 'Deixar os itens que mais vendem fáceis de achar no caminho principal da loja, e os de impulso perto do caixa';
  const a = P.acoes.find((x) => x.texto === ANTIGA);
  if (a) {
    a.texto = NOVA;
    a.porque = 'Nas medições de trajeto, o comprador passa só 20% do tempo na loja escolhendo produto, e metade das compras tem até 5 itens. Esconder os itens que mais vendem desperdiça tempo e vende menos; deixá-los à mão atende quem entra para uma compra rápida.';
    a.passos = ['Listar os 20 itens que mais vendem', 'Colocá-los no caminho principal, fáceis de achar', 'Deixar os de impulso perto do caixa', 'Comparar as vendas por cliente antes e depois'];
  }
  Object.values(P.modelos || {}).forEach((m) => (m.acoes || []).forEach((x) => { if (x[4] === ANTIGA) x[4] = NOVA; }));
  (P.abordagens || []).forEach((ab) => { if (ab.acoes) ab.acoes = ab.acoes.map((t) => (t === ANTIGA ? NOVA : t)); });

  // diagnóstico: causas que esses livros ajudam a nomear
  [
    'O dia a dia toma todo o tempo e as ações do plano ficam sempre para depois',
    'A equipe não sabe se está ganhando: o objetivo não tem número, ponto de partida nem prazo',
    'O que cerca o serviço (agendamento, cobrança, informação, espera) incomoda mais do que o serviço em si',
    'Os itens que mais vendem ficam difíceis de achar, e o cliente perde tempo dentro da loja',
  ].forEach((texto) => { if (P.causas && !P.causas.some((c) => c.texto === texto)) P.causas.push({ grupo: G, texto }); });

  // ligar às abordagens que elas executam
  const liga = (ini, titulos) => { const ab = (P.abordagens || []).find((y) => y.texto.startsWith(ini)); if (!ab || !ab.acoes) return;
    titulos.forEach((t) => { if (!ab.acoes.includes(t)) ab.acoes.push(t); }); };
  liga('Concentrar quase todo o esforço', [NOVAS[0].texto, NOVAS[3].texto]);
  liga('Prometer menos e entregar', [NOVAS[5].texto, NOVAS[8].texto]);
  liga('Ser a escolha mais conveniente', [NOVAS[6].texto]);
  liga('Ser a parceira de longo prazo', [NOVAS[7].texto]);
})();

// ===== Rodada 26: correções do cruzamento com a pasta Evidência =====
// O crescimento vem de mais clientes (penetração), e não de fazer os atuais comprarem mais: a frequência de compra
// segue o tamanho da marca e quase não muda com marketing. Programas e clubes atraem sobretudo quem já compra muito.
(function () {
  const P = window.GangPresets; if (!P) return;

  // 1) foco: o texto antigo prometia aumentar a frequência de cada cliente. O novo fala em ser lembrada na próxima compra.
  //    O texto antigo continua valendo para quem já o escolheu.
  const FOCO_ANT = 'Fazer cada cliente comprar mais vezes e mais coisas.';
  const FOCO_NOVO = 'Ser lembrada por quem já comprou na hora de comprar de novo.';
  const f = (P.focos || []).find((x) => x.texto === FOCO_ANT);
  if (f) f.texto = FOCO_NOVO;
  if (P.modelosFoco && P.modelosFoco[FOCO_ANT] && !P.modelosFoco[FOCO_NOVO]) P.modelosFoco[FOCO_NOVO] = P.modelosFoco[FOCO_ANT];

  // 2) clube e grupo de clientes: o motivo prometia fidelidade e crescimento. Agora diz o que a evidência sustenta.
  const CLUBE = 'Criar um clube de clientes com nome, encontros e pequenos benefícios para quem já compra';
  const GRUPO = 'Criar um grupo de clientes com um encontro marcado e espaço para eles trocarem experiências';
  const corrige = (t, porque, metrica) => { const a = (P.acoes || []).find((x) => x.texto === t); if (a) { a.porque = porque; a.metrica = metrica; } };
  corrige(CLUBE,
    'Clubes e programas atraem sobretudo quem já compra muito, e o efeito na recompra costuma ser pequeno. Não trazem cliente novo. Vale como cuidado com a base depois que a marca já alcança gente nova todo mês, não como forma de crescer.',
    'Indicações vindas do clube comparadas ao custo do clube');
  corrige(GRUPO,
    'Um encontro marcado dá aos clientes atuais um motivo para lembrar da marca e indicar. Atinge sobretudo quem já compra muito, então ajuda a manter a base, não a crescer.',
    'Indicações vindas do grupo comparadas ao custo dos encontros');

  // 3) nas estratégias padrão, o clube sai e entra a presença contínua da marca, que alcança também quem compra pouco
  const CAL = 'Montar o calendário de comunicação dos próximos 6 meses';
  ['Ter uma relação direta', 'Tornar a compra um hábito'].forEach((ini) => {
    const ab = (P.abordagens || []).find((y) => y.texto.startsWith(ini)); if (!ab || !ab.acoes) return;
    ab.acoes = ab.acoes.filter((t) => t !== CLUBE);
    if (!ab.acoes.includes(CAL)) ab.acoes.push(CAL);
  });

  // 4) manifesto: a crença orienta a equipe e gera ideias; o crescimento vem da fama dessas ideias, não do texto em si
  corrige('Publicar um manifesto curto: o que a marca defende e o que se recusa a fazer',
    'Uma posição clara dá direção à equipe e matéria para ideias que chamam atenção. O que faz vender é a fama que essas ideias trazem, não o manifesto em si; o cliente liga menos para a causa do que a empresa imagina.',
    'Manifesto usado para aprovar ideias e peças, e ideias publicadas a partir dele');

  // 5) presente aos melhores clientes: atinge só quem já compra muito
  corrige('Mandar um presente surpresa e personalizado para os melhores clientes, sem pedir nada em troca',
    'O inesperado é lembrado e comentado, e pode render indicação. Mas atinge só quem já compra muito, então vale como gesto de cuidado com a base, não como forma de crescer.',
    'Indicações vindas de quem recebeu, comparadas ao custo dos presentes');

  // 6) identidade nova: manter o que os clientes já reconhecem. Trocar tudo apaga a memória da marca (a Tropicana perdeu 20% das vendas)
  const MANTER = 'Listar o que os clientes já reconhecem na marca (cor, símbolo, formato, frase) e manter na versão nova';
  ['Trocar a fachada / ambiente para a nova identidade', 'Atualizar redes sociais com a nova identidade'].forEach((t) => {
    const a = (P.acoes || []).find((x) => x.texto === t);
    if (a && Array.isArray(a.passos) && !a.passos.includes(MANTER)) a.passos.unshift(MANTER);
  });

  // 7) objetivo e veredito que mediam a frequência: a recompra acompanha o tamanho da base, então se lê junto com os clientes novos
  const troca = (lista, ant, novo) => { const x = (P[lista] || []).find((y) => y.texto === ant); if (x) x.texto = novo; };
  troca('objetivos', 'recompra em 12 meses, com clientes voltando mais vezes', 'clientes ativos no ano em 12 meses, puxados por clientes novos');
  troca('vereditos', 'A recompra subiu: quem compra está voltando mais vezes.', 'A recompra subiu junto com os clientes novos: a base está crescendo.');

  // 8) ofertas com prazo: o pico some quando a oferta acaba, vem quase todo de quem já comprava a marca e não traz cliente novo.
  //    Medir só "acima do normal" faz quase toda oferta parecer que funcionou: compara com o ano anterior e olha a queda depois.
  const OFERTA = 'Fazer uma ação de ativação com prazo (oferta ou condição especial)';
  corrige(OFERTA,
    'Ativação converte quem já quer comprar e funciona no curto prazo, em equilíbrio com a marca. O pico some quando a oferta acaba, vem quase todo de quem já comprava e não traz cliente novo; por isso o resultado só vale comparado ao ano anterior e somando a queda das semanas seguintes.',
    'Vendas no período e nas 4 semanas seguintes, comparadas ao mesmo período do ano anterior');
  const of = (P.acoes || []).find((x) => x.texto === OFERTA);
  const MEDE = 'Comparar as vendas do período e das 4 semanas seguintes com o mesmo período do ano anterior';
  if (of && Array.isArray(of.passos) && !of.passos.includes(MEDE)) of.passos.push(MEDE);
})();

// ===== Rodada 27: pacote de lançamento de marca =====
// Fontes (pasta Evidência): marca nova cresce sem anúncio, mas com campanha de lançamento cresce muito mais rápido, e cada real
// anunciado rende mais nela; divisão ~35:65 no começo e virada para ~57% de marca perto de 1 ano (muitos lançamentos falham por
// não virar); volume antes de preço premium; marca nova precisa das memórias básicas (o que é, nome, aparência, onde comprar)
// e de compra fácil antes da campanha; momentos de mudança de vida são quando as pessoas mais experimentam marcas novas;
// o teste decisivo é a recompra ao longo de 1 a 2 anos, não a experimentação.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes || !P.abordagens) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Deixar a compra pronta antes de anunciar: onde comprar, horários, formas de pagamento e resposta rápida', esforco: 'venda', promessa: 'vendas', tema: 'distribuicao', tipo: 'base', tam: 'M', ler: 30,
      porque: 'Sem um jeito fácil de comprar, parte do anúncio é desperdiçada: quem se interessa não acha onde nem como comprar. Na marca nova, a compra pronta vem antes da campanha.',
      metrica: 'Todos os pontos de compra prontos antes da campanha', passos: ['Listar onde o cliente vai procurar e comprar', 'Conferir horários, formas de pagamento e prazo de resposta', 'Fazer uma compra de teste em cada canal', 'Corrigir o que travou antes de anunciar'] },
    { texto: 'Escolher 2 ou 3 sinais próprios da marca nova (cor, símbolo, frase) e usar os mesmos em tudo desde o primeiro dia', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'base', tam: 'P', ler: 180,
      porque: 'Marca nova ainda não tem nada que as pessoas reconheçam. Um sinal só vira da marca quando aparece sempre igual e muita gente o vê; trocar a cada peça recomeça do zero.',
      metrica: 'Os mesmos sinais em todas as peças, e reconhecidos na pesquisa', passos: ['Escolher 2 ou 3 sinais que nenhum concorrente usa', 'Colocar os mesmos sinais em todas as peças', 'Conferir cada peça antes de publicar', 'Medir o reconhecimento na pesquisa de 6 meses'] },
    { texto: 'Comunicar o básico da marca nova: o que ela é, o nome, como ela é e onde comprar', esforco: 'marca', promessa: 'pessoas', tema: 'conteudo', tipo: 'marca', tam: 'M', ler: 90,
      porque: 'Para ser escolhida, a marca nova precisa primeiro existir na memória: o que é, o nome, como é e onde se compra. Simples e repetido funciona melhor do que uma mensagem esperta que as pessoas lembram sem lembrar da marca.',
      metrica: 'Pessoas que sabem dizer o que a marca é e onde comprar', passos: ['Escrever em uma frase o que a marca é e para quem', 'Mostrar o nome e os sinais próprios em toda peça', 'Dizer sempre onde comprar', 'Mostrar a marca sendo usada em situações reais'] },
    { texto: 'Fazer uma campanha de lançamento concentrada nos primeiros meses, com alcance amplo entre quem compra a categoria', esforco: 'venda', promessa: 'pessoas', tema: 'anuncio', tipo: 'ativacao', tam: 'G', ler: 90,
      porque: 'Marca nova cresce sem anúncio, pelo boca a boca, mas com campanha de lançamento cresce muito mais rápido. Nessa fase cada real anunciado rende mais do que numa marca já conhecida, e falar com todos os compradores da categoria traz mais gente que mirar um grupo estreito.',
      metrica: 'Clientes de primeira compra por mês durante a campanha', passos: ['Definir quem compra a categoria, em números', 'Escolher meios que alcancem a maioria deles', 'Concentrar a verba nos primeiros meses', 'Contar as primeiras compras mês a mês'] },
    { texto: 'Falar com quem acabou de passar por uma mudança de vida (mudança de casa, empresa nova, filho, novo emprego)', esforco: 'venda', promessa: 'pessoas', tema: 'anuncio', tipo: 'ativacao', tam: 'M', ler: 60,
      porque: 'Nos momentos de mudança de vida as pessoas mais experimentam marcas novas, porque os hábitos antigos deixam de valer. É quando a marca nova tem mais chance de ser testada.',
      metrica: 'Primeiras compras vindas de quem estava num momento de mudança', passos: ['Listar os momentos de mudança ligados à categoria', 'Achar onde essas pessoas estão (cadastros, parceiros, anúncios)', 'Fazer uma oferta de experimentação para esse momento', 'Contar as primeiras compras que vieram daí'] },
    { texto: 'Medir quantos clientes de primeira compra voltam a comprar em 6 e em 12 meses', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 180,
      porque: 'Na marca nova, o que decide se o lançamento deu certo não é quantos experimentaram, e sim se uma parte deles continua comprando. Essa resposta leva de 1 a 2 anos para aparecer, então é preciso começar a medir cedo.',
      metrica: 'Parcela dos clientes de primeira compra que voltou em 6 e 12 meses', passos: ['Registrar a data da primeira compra de cada cliente', 'Contar quem voltou a comprar em 6 meses', 'Repetir em 12 meses', 'Comparar a primeira turma com as seguintes'] },
    { texto: 'Virar a comunicação de "experimente" para "lembre da marca" perto de 1 ano depois do lançamento', esforco: 'marca', promessa: 'pessoas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'No começo, o esforço vai para fazer as pessoas experimentarem. Quando a novidade passa, a marca precisa ser lembrada por quem ainda vai comprar. Muitos lançamentos falham por não fazer essa virada a tempo.',
      metrica: 'Divisão do plano passada para perto de 57% de marca', passos: ['Rever o que trouxe as primeiras compras', 'Trocar as ofertas de experimentação por presença contínua da marca', 'Manter os mesmos sinais próprios', 'Conferir a nova divisão no plano'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  // a estratégia de lançamento: as ações dela entram nos 3 primeiros meses, na ordem abaixo (compra pronta e sinais antes da campanha)
  const LANC = 'Lançar a marca para o maior número possível de compradores da categoria, vencendo por ser experimentada logo e lembrada pelo básico: o que é, o nome e onde comprar. Abrimos mão de começar com preço premium e de mirar só um grupo estreito.';
  const ex = (ini) => (P.acoes.find((a) => a.texto.startsWith(ini)) || {}).texto;
  const acoesLanc = [NOVAS[0].texto, NOVAS[1].texto, NOVAS[2].texto, NOVAS[3].texto,
    ex('Oferecer uma forma de diminuir o risco da primeira compra'), ex('Planejar a presença em anúncios para aparecer mais que os concorrentes'),
    NOVAS[4].texto, NOVAS[5].texto].filter(Boolean);
  const foraLanc = ['Criar uma versão premium do serviço principal', 'Montar uma versão premium com mais entrega',
    'Criar um clube de clientes com nome, encontros e pequenos benefícios para quem já compra',
    'Reativar quem não compra há mais de 6 meses com uma mensagem útil e um motivo para voltar'].filter((t) => P.acoes.some((a) => a.texto === t));
  if (!P.abordagens.some((a) => a.texto === LANC)) P.abordagens.push({ grupo: G, texto: LANC, curto: 'Lançar a marca', acoes: acoesLanc, fora: foraLanc, lancamento: true });
  // o desafio da empresa nova passa a oferecer o lançamento como abordagem
  const d = (P.desafios || []).find((x) => x.texto.startsWith('A empresa é nova e o cliente desconfia'));
  if (d && Array.isArray(d.abordagens) && !d.abordagens.includes(LANC)) d.abordagens.unshift(LANC);

  // métricas do lançamento: primeiras compras e recompra, não recompra e lembrança desde o mês 1
  if (P.metricas) [
    { texto: 'Clientes de primeira compra no mês', nivel: 'negocio', frequencia: 'mensal' },
    { texto: 'Clientes de primeira compra que voltaram (6 e 12 meses)', nivel: 'negocio', frequencia: 'semestral' },
    { texto: 'Reconhecimento dos sinais próprios da marca', nivel: 'marca', frequencia: 'semestral' },
  ].forEach((m) => { if (!P.metricas.some((y) => y.texto === m.texto)) P.metricas.push({ grupo: 'Lançamento', ...m }); });
})();

// ===== Rodada 28: a estratégia sai do diagnóstico =====
// Cada causa do Diagnóstico aponta os desafios que ela indica; os fatores que fazem escolher (ou que todo cliente exige)
// em que a marca não entrega também. A tela de Estratégia mostra primeiro os desafios indicados, e o teste da estratégia
// avisa quando o desafio escolhido não responde a nada do diagnóstico.
(function () {
  const P = window.GangPresets; if (!P || !P.causas || !P.desafios) return;
  const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
  const LEMB = 'A marca é pouco lembrada quando'; const DIF = 'O cliente não vê diferença'; const SO_CLI = 'A marca só é lembrada por quem já é cliente';
  const PROP = 'A proposta começa pelo preço'; const EXP = 'A experiência muda de pessoa'; const VOLTA = 'Os clientes compram uma vez';
  const CANAL1 = 'A marca depende de um único canal'; const MAIOR = 'Um concorrente maior ocupa'; const TODOS = 'A marca tenta atender todo mundo';
  const PROVA = 'A empresa tem qualidade, mas não tem provas'; const ACHAR = 'É difícil achar e comprar'; const IRREG = 'A comunicação é irregular';
  const JEITO = 'O jeito de comprar da categoria mudou'; const TUDO = 'A empresa faz de tudo um pouco'; const CARA = 'A marca é vista como a mais cara';
  const BARATA = 'A marca é vista como barata'; const CATEG = 'O cliente não entende em que categoria'; const NOVA = 'A empresa é nova';
  const PERDEU = 'A marca cresceu e perdeu'; const TROCA = 'O cliente troca de fornecedor'; const VENDAS = 'A equipe de vendas promete';
  const ANTIGA = 'A marca é lembrada por um produto ou fase antiga'; const NAOCOMPRA = 'O maior concorrente é o cliente não comprar';
  const OPINIAO = 'A marca não tem opinião'; const TECNICO = 'A categoria só fala do lado técnico'; const DONO = 'A venda depende do dono';
  const DESCONTO = 'A empresa dá desconto'; const GANHA = 'O cliente vê quanto paga'; const ESPALHA = 'A marca investe um pouco em muitos canais';
  const PRONTO = 'A comunicação fala só com quem já está pronto'; const IGUAL = 'Todos os concorrentes fazem igual';
  const MAPA = [
    ['A marca não mostra o que a torna diferente', [DIF, IGUAL, OPINIAO]], ['A proposta comercial começa pelo preço', [PROP, DESCONTO]],
    ['A equipe não tem um discurso único', [VENDAS, DONO, EXP]], ['Pouca presença onde o cliente procura', [ACHAR, LEMB]],
    ['Comunicação irregular, com pausas longas', [IRREG, LEMB]], ['O visual não tem ativos distintivos', [OPINIAO, LEMB]],
    ['A marca compete principalmente por preço', [DIF, BARATA, DESCONTO]], ['Pouca gente lembra da marca quando precisa', [LEMB]],
    ['A marca é lembrada só por quem já é cliente', [SO_CLI, PRONTO]], ['A marca não está ligada às situações', [LEMB]],
    ['A comunicação fala do produto, e não do momento', [LEMB, TECNICO]], ['Cada peça usa cores e estilos diferentes', [OPINIAO]],
    ['O logo e as cores mudaram várias vezes', [ANTIGA, OPINIAO]], ['O nome é difícil de dizer', [ACHAR, LEMB]],
    ['A marca não tem um elemento próprio', [OPINIAO]], ['A empresa é difícil de achar no Google', [ACHAR]],
    ['O cliente demora para conseguir resposta', [ACHAR, EXP]], ['Poucos canais de venda', [ACHAR, CANAL1, JEITO]],
    ['Horários e formas de pagamento limitados', [ACHAR]], ['Descontos frequentes ensinaram', [DESCONTO, BARATA]],
    ['O preço aparece antes do valor', [PROP, GANHA]], ['Faltam provas do resultado', [PROVA, NOVA]],
    ['A empresa tenta atender todo tipo de cliente', [TODOS, TUDO]], ['O atendimento muda muito de pessoa para pessoa', [EXP]],
    ['A promessa da venda não é cumprida na entrega', [EXP, VENDAS]], ['Não há pós-venda', [VOLTA, TROCA]],
    ['Reclamações demoram para ser resolvidas', [EXP]], ['O investimento em comunicação é menor', [IRREG, PRONTO, MAIOR]],
    ['Só há anúncios de oferta', [PRONTO]], ['A marca muda de ideia a cada campanha', [OPINIAO, IRREG]],
    ['A experiência no ponto de venda não combina', [EXP, VENDAS]], ['Clientes satisfeitos não são incentivados a indicar', [VOLTA]],
    ['O site não diz em segundos', [CATEG, ACHAR]], ['Os erros não viram aprendizado', [EXP]],
    ['A marca parece distante', [PERDEU, TECNICO]], ['As propostas não mostram o que está incluído', [PROP, GANHA]],
    ['O cliente fica indeciso', [NAOCOMPRA]], ['Opções demais na proposta', [PROP]], ['O cliente tem medo de errar', [NOVA, NAOCOMPRA]],
    ['A empresa não sabe o que o cliente espera', [TODOS]], ['Os clientes perdidos não são acompanhados', [VOLTA, TROCA]],
    ['A marca é conhecida, mas está parada', [ANTIGA, SO_CLI]], ['A categoria mudou e a marca não acompanhou', [JEITO]],
    ['A qualidade existe, mas o cliente não enxerga', [PROVA, CARA]], ['A marca é descrita só pelo que os clientes acham hoje', [OPINIAO]],
    ['A marca fala só do produto', [TECNICO, PERDEU]], ['A marca se resume a um slogan', [OPINIAO]],
    ['A marca não tem um ponto de vista', [OPINIAO, IGUAL]], ['A comunicação só fala com quem já decidiu', [NAOCOMPRA, PRONTO]],
    ['A empresa não sabe que progresso', [NAOCOMPRA, TODOS]], ['A marca só mostra competência', [TECNICO]],
    ['O preço é calculado pelo custo', [GANHA, BARATA]], ['Há um único preço e uma única oferta', [CARA, BARATA]],
    ['O esforço está espalhado em canais demais', [ESPALHA]], ['Nada na relação faz o cliente perder algo', [TROCA]],
    ['A categoria só fala de características técnicas', [TECNICO]], ['A comunicação fala só com quem já está pronto', [PRONTO]],
    ['As campanhas duram pouco tempo', [PRONTO, IRREG]], ['O preço aparece sozinho, sem uma referência', [CARA, GANHA]],
    ['A primeira coisa que o cliente vê é a lista de serviços', [CATEG, DIF]], ['Cobranças avulsas e taxas extras', [GANHA]],
    ['O dia a dia toma todo o tempo', [TUDO]], ['A equipe não sabe se está ganhando', [TUDO]],
    ['O que cerca o serviço', [EXP]], ['Os itens que mais vendem ficam difíceis de achar', [ACHAR]],
  ];
  MAPA.forEach(([ini, ds]) => { const c = P.causas.find((x) => x.texto.startsWith(ini)); if (c) c.desafios = ds.map(D).filter(Boolean); });

  // o que o diagnóstico indica: causas (pelo texto, inclusive escritas à mão que batem com a biblioteca) e fatores em que a marca não entrega bem
  // o diagnóstico "em uma frase" também indica desafios (início de cada frase da biblioteca -> desafios)
  const RESUMO = [
    ['A marca entregava o básico que o setor exige', [DIF, PROP]], ['A marca era bem avaliada por quem já era cliente', [SO_CLI, LEMB]],
    ['A qualidade do trabalho era alta, mas não aparecia', [PROVA, CARA]], ['A marca era conhecida, mas parada no tempo', [ANTIGA, PERDEU]],
    ['Cada canal falava de um jeito', [LEMB, IRREG]], ['A empresa dependia quase só de indicação', [CANAL1]],
    ['A marca tentava atender todo tipo de cliente', [TODOS]], ['A promessa da venda era boa, mas a entrega variava', [EXP, VENDAS]],
    ['A marca aparecia pouco nos momentos', [LEMB, ACHAR]], ['Os clientes compravam uma vez e não voltavam', [VOLTA]],
    ['A marca era difícil de achar e de comprar', [ACHAR]], ['A comunicação vinha em campanhas soltas', [IRREG]],
    ['A empresa investia só em ofertas', [DESCONTO, IRREG]], ['O cliente esperava uma coisa e recebia outra', [EXP, VENDAS]],
    ['As empresas da categoria pareciam todas iguais', [IGUAL, DIF]], ['O maior concorrente da marca não era outra empresa', [NAOCOMPRA]],
    ['O cliente comparava a marca com as empresas erradas', [CATEG, CARA]], ['A marca não tinha sinais próprios', [LEMB, DIF]],
    ['A marca era vista como a opção barata', [BARATA]], ['A marca cobrava como as melhores, mas não mostrava', [CARA, PROVA]],
    ['A maior parte do faturamento vinha de poucos clientes', [CANAL1]], ['A empresa fazia tudo do jeito de sempre', [JEITO, ANTIGA]],
    ['A marca era conhecida pelo dono', [DONO]], ['A empresa tinha clientes satisfeitos, mas nenhum processo', [SO_CLI]],
    ['Quem decidia a compra não era quem usava', [PROP, DIF]], ['A marca era bonita, mas não dizia o que a empresa fazia', [CATEG]],
    ['A equipe de vendas e a comunicação diziam coisas diferentes', [VENDAS]], ['A empresa era nova e sem histórico', [NOVA, PROVA]],
    ['O maior concorrente da marca era a não compra', [NAOCOMPRA, PRONTO]], ['A marca não tinha opinião', [OPINIAO]],
    ['A empresa vendia o serviço, mas o cliente comprava o alívio', [TECNICO, GANHA]], ['A marca era competente, mas fria', [TECNICO]],
    ['O preço era calculado pelo custo', [GANHA, BARATA]], ['Um único preço para todos', [CARA, BARATA]],
    ['O esforço de comunicação estava espalhado', [ESPALHA]], ['Nada prendia o cliente à marca', [TROCA]],
    ['A marca falava só com quem já estava procurando', [PRONTO, NAOCOMPRA]],
  ];
  P.resumoDesafios = RESUMO;
  P.desafiosDoDiagnostico = (causas, fatores, resumo) => {
    const ind = new Map();
    const soma = (d, motivo) => { if (!d) return; if (!ind.has(d)) ind.set(d, []); if (!ind.get(d).includes(motivo)) ind.get(d).push(motivo); };
    // a causa do cliente pode ter sido ajustada à mão ("não mostrava" em vez de "não mostra"): vale a da biblioteca mais parecida
    const pal = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2).map((w) => w.slice(0, 5));
    const parecida = (t) => {
      const exata = P.causas.find((y) => y.texto === t); if (exata) return exata;
      const a = new Set(pal(t)); let melhor = null; let nota = 0;
      P.causas.forEach((y) => { const b = new Set(pal(y.texto)); const comum = [...a].filter((w) => b.has(w)).length; const j = comum / Math.max(1, new Set([...a, ...b]).size); if (j > nota) { nota = j; melhor = y; } });
      return nota >= 0.5 ? melhor : null;
    };
    (causas || []).forEach((c) => { const x = parecida(c.texto); (x && x.desafios || []).forEach((d) => soma(d, 'causa: ' + c.texto)); });
    (fatores || []).filter((f) => f.posicao === 'nao_entrega' || f.posicao === 'entrega_mal').forEach((f) => {
      const ds = f.tipo === 'discriminador' ? [D(DIF), D(IGUAL)] : [D(EXP)];
      ds.forEach((d) => soma(d, (f.tipo === 'discriminador' ? 'faz escolher, e a marca ' : 'todo cliente exige, e a marca ') + (f.posicao === 'nao_entrega' ? 'não entrega: ' : 'entrega mal: ') + f.texto));
    });
    // a frase do diagnóstico: a da biblioteca pelo começo; escrita à mão, vale a frase da biblioteca mais parecida
    if (resumo && String(resumo).trim()) {
      const r = String(resumo).trim();
      let m = RESUMO.find(([ini]) => r.startsWith(ini));
      if (!m) {
        const a = new Set(pal(r)); let nota = 0;
        (P.resumosDiagnostico || []).forEach((y) => { const b = new Set(pal(y.texto)); const j = [...a].filter((w) => b.has(w)).length / Math.max(1, new Set([...a, ...b]).size); const x = RESUMO.find(([ini]) => y.texto.startsWith(ini)); if (x && j > nota) { nota = j; m = x; } });
        if (nota < 0.4) m = null;
      }
      if (m) m[1].map(D).forEach((d) => soma(d, 'em uma frase: ' + r));
    }
    return ind;
  };
})();

// ===== Rodada 29: o que não muda na marca, como ela envelhece, reclamações, cortes de custo e B2B =====
// Fontes (leitura completa de um manual de gestão estratégica de marcas, com as pesquisas que ele cita):
// ideias que o cliente diz serem indispensáveis melhoram a percepção de toda a linha, as outras só de parte dela (e podem
// atrapalhar); identidade em camadas: núcleo fixo, expressão que se renova, promessas que mudam (reposicionar a cada 4-5 anos);
// sinais de envelhecimento (lembrança espontânea caindo, clientes mais velhos, mais "mais ou menos satisfeitos", nada novo);
// reclamação bem atendida: 84% voltariam, contra 64% de quem nunca reclamou; cortes "sem diferença significativa" somados
// derrubam a marca; no B2B, pergunta direta põe a marca em último e a escolha real mostra a reputação como decisiva;
// troca de nome: de 11,9% para 4,7% de participação apesar do investimento.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Testar cada ideia da identidade central com 10 clientes: "se a marca não tivesse isto, ainda seria ela?"', esforco: 'marca', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 180,
      porque: 'Nem tudo que se diz da marca é essencial. Em pesquisa com clientes, as ideias que eles diziam ser indispensáveis melhoraram a avaliação de todos os produtos da marca, do mais barato ao mais caro; as outras ajudaram só em alguns e às vezes atrapalharam. A pergunta separa o essencial do resto.',
      metrica: 'Ideias que a maioria diz serem indispensáveis', passos: ['Listar as ideias da identidade central', 'Perguntar a 10 clientes, ideia por ideia: sem isto, ainda é a marca?', 'Manter como centrais as que a maioria diz que sim', 'Tratar as outras como variáveis, por serviço ou público'] },
    { texto: 'Conferir se cada serviço ou produto carrega todas as ideias da identidade central, e ajustar ou tirar o que contradiz', esforco: 'marca', promessa: 'valor', tema: 'posicionamento', tipo: 'base', tam: 'M', ler: 365,
      porque: 'O cliente conhece a marca pelo que compra e usa, não pelo documento. Quando cada serviço mostra só uma parte das ideias, ninguém vê a marca inteira. O que contradiz uma ideia central pode até vender, mas reduz a simpatia pela marca toda.',
      metrica: 'Serviços que carregam todas as ideias centrais', passos: ['Listar os serviços ou produtos', 'Marcar quais ideias centrais cada um mostra', 'Ajustar os que mostram só uma parte', 'Tirar ou separar o que contradiz alguma ideia'] },
    { texto: 'Renovar o visual, os formatos e as campanhas sem mexer na identidade central nem nos sinais próprios', esforco: 'marca', promessa: 'pessoas', tema: 'presenca', tipo: 'marca', tam: 'M', ler: 365,
      porque: 'O jeito de se mostrar envelhece mais rápido do que aquilo que a marca é. Atualizar a expressão mantém a marca atual; mudar o núcleo ou os sinais junto faz o cliente perder a referência. Reposicionar de verdade, só a cada 4 ou 5 anos.',
      metrica: 'Peças renovadas com as ideias centrais e os sinais próprios mantidos', passos: ['Separar o que não muda (ideias centrais e sinais próprios)', 'Escolher o que renovar: fotos, formatos, campanhas', 'Conferir cada peça nova contra o que não muda', 'Registrar a data da renovação'] },
    { texto: 'Facilitar a reclamação: um canal simples, resposta no mesmo dia e solução combinada com o cliente', esforco: 'venda', promessa: 'vendas', tema: 'experiencia', tipo: 'base', tam: 'P', ler: 90,
      porque: 'O pior cliente insatisfeito é o que não reclama: some e fala mal para os outros. Numa companhia aérea, 84% de quem reclamou e foi bem atendido voltaria a voar com ela, contra 64% de quem nunca reclamou. Receber a reclamação é a chance de manter o cliente.',
      metrica: 'Reclamações respondidas no mesmo dia e clientes que voltaram a comprar depois', passos: ['Criar um canal simples e divulgar onde reclamar', 'Definir quem responde e em quanto tempo', 'Combinar a solução com o cliente', 'Conferir se quem reclamou voltou a comprar'] },
    { texto: 'Antes de cortar custo no produto ou serviço, testar com clientes e não aprovar se a avaliação cair, mesmo pouco', esforco: 'venda', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Cada corte pequeno parece não fazer diferença no teste e por isso é aprovado. Somados, os clientes percebem a queda e vão embora. Uma avaliação menor que a do padrão já é motivo para não cortar.',
      metrica: 'Cortes aprovados sem queda na avaliação dos clientes', passos: ['Fazer a versão com o corte', 'Comparar com a atual com clientes, sem dizer qual é qual', 'Não aprovar se a nova tiver avaliação menor', 'Registrar cada corte aprovado'] },
    { texto: 'Descobrir o que pesa na escolha olhando as propostas ganhas e perdidas, e não só perguntando ao cliente', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'M', ler: 180, setores: ['b2b', 'servicos'],
      porque: 'Perguntado diretamente, o comprador diz que escolhe por preço e prazo e põe a marca em último lugar. Quando se olham as escolhas reais, a reputação aparece como fator decisivo. Concluir que "o cliente só liga para preço" a partir da pergunta direta leva a cortar justamente o que faz vender.',
      metrica: 'Fatores de escolha tirados de propostas reais', passos: ['Juntar as propostas dos últimos 6 meses, ganhas e perdidas', 'Anotar o que era diferente nas que fecharam', 'Comparar com o que os clientes disseram quando perguntados', 'Ajustar a proposta pelo que as escolhas mostram'] },
    { texto: 'Entender o problema do cliente com os clientes dele e mostrar na proposta como a empresa ajuda nisso', esforco: 'venda', promessa: 'valor', tema: 'venda', tipo: 'base', tam: 'M', ler: 180, setores: ['b2b'],
      porque: 'No B2B, o que se compra vira parte do que o cliente entrega aos clientes dele, e a reputação dele depende disso. Mostrar que a empresa entende e protege isso tira a conversa do preço por unidade.',
      metrica: 'Propostas que citam o problema do cliente final', passos: ['Perguntar a 5 clientes o que os clientes deles mais cobram', 'Ligar o serviço a esse problema', 'Colocar isso no começo da proposta', 'Ver se as propostas com isso fecham mais'] },
    { texto: 'Fazer com a equipe uma conversa por ideia central: o que começar, parar e continuar a fazer no próprio trabalho', esforco: 'marca', promessa: 'valor', tema: 'equipe', tipo: 'base', tam: 'P', ler: 180,
      porque: 'Em serviço, a marca é o que as pessoas fazem em cada atendimento. Quando cada um descobre o que a ideia muda no próprio trabalho, passa a cuidar do próprio jeito de agir; um discurso de cima não faz isso.',
      metrica: 'Pessoas da equipe com o que começar, parar e continuar escrito', passos: ['Explicar cada ideia central e por que ela existe', 'Pedir a cada pessoa o que começar, parar e continuar', 'Combinar um exemplo prático por pessoa', 'Rever em 3 meses o que mudou'] },
    { texto: 'Escolher o serviço ou produto que melhor mostra o que a marca é e fazer dele o primeiro a aparecer', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'base', tam: 'P', ler: 365,
      porque: 'O primeiro produto que as pessoas conhecem vira o exemplo da marca na memória e é difícil de mudar depois. Ele deve ser o que melhor mostra a intenção da marca, mesmo que não seja o que mais vende.',
      metrica: 'Serviço de destaque escolhido e em primeiro lugar no site e nas peças', passos: ['Listar os serviços e o que cada um mostra da marca', 'Escolher o que mostra mais das ideias centrais', 'Colocar ele em primeiro no site, nas peças e na proposta', 'Conferir se as pessoas citam esse serviço ao falar da marca'] },
    { texto: 'Uma vez por ano, fazer o check da marca: sinais de envelhecimento e desvios da estratégia', esforco: 'marca', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 365,
      porque: 'Marca envelhece devagar e em silêncio, e perde o rumo por pequenos ajustes que, somados, a desviam da estratégia. Os sinais aparecem antes da queda nas vendas: lembrança espontânea caindo, clientes cada vez mais velhos, mais gente "mais ou menos satisfeita" e muito tempo sem nada novo.',
      metrica: 'Check feito no ano e o que tirar ou recolocar decidido', passos: ['Comparar a lembrança espontânea das últimas pesquisas', 'Ver se a idade média dos clientes está subindo', 'Contar os "mais ou menos satisfeitos" e ouvir clientes perdidos', 'Listar há quanto tempo não há serviço, embalagem ou campanha nova', 'Reler a estratégia e decidir o que tirar e o que recolocar'] },
    { texto: 'Antes de trocar o nome da marca, medir quantos lembram do nome atual e manter os sinais conhecidos na transição', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'base', tam: 'P', ler: 365,
      porque: 'Trocar o nome apaga parte do que as pessoas lembram. Uma marca que só mudou de nome caiu de 11,9% para 4,7% de participação, mesmo com muito investimento para avisar. Se a troca for mesmo necessária, os sinais conhecidos ajudam a não recomeçar do zero.',
      metrica: 'Lembrança medida antes da troca e sinais mantidos', passos: ['Medir a lembrança espontânea do nome atual', 'Escrever por que a troca é necessária', 'Manter cores, símbolo e frase conhecidos', 'Medir a lembrança de novo 6 meses depois'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Trocar o nome da marca só para parecer nova', 'Aprovar um corte de custo porque o teste "não mostrou diferença"',
    'Concluir que o cliente só liga para preço a partir de pergunta direta', 'Reposicionar a marca antes de 4 ou 5 anos']);
  add('verificacoes', ['Pergunta a clientes: se a marca não tivesse isto, ainda seria ela?', 'Propostas ganhas e perdidas, e o que pesou em cada uma',
    'Reclamações respondidas no mesmo dia', 'Lembrança espontânea comparada entre as pesquisas']);

  // sinais de envelhecimento e de coerência como causas do diagnóstico, já ligadas aos desafios que indicam
  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['Os clientes estão ficando mais velhos e os novos não chegam', ['A marca é lembrada por um produto ou fase antiga', 'A marca só é lembrada por quem já é cliente']],
      ['Faz tempo que a marca não lança nada novo', ['A marca é lembrada por um produto ou fase antiga', 'A marca cresceu e perdeu']],
      ['Mais clientes dizem estar "mais ou menos satisfeitos"', ['A experiência muda de pessoa', 'Os clientes compram uma vez']],
      ['Cada serviço mostra uma parte da marca, e nenhum mostra ela inteira', ['A marca não tem opinião', 'A empresa faz de tudo um pouco']],
      ['Pequenos cortes de custo foram piorando o produto ou o serviço', ['A experiência muda de pessoa', 'A marca cresceu e perdeu']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 30: estratégia como foco, diagnóstico de motivos, elos fracos, teste pequeno e manutenção =====
// Fontes (leitura completa de um livro sobre estratégia boa e ruim, com casos de empresas pequenas e grandes):
// o desafio é o motivo do resultado, não o resultado; a boa estratégia concentra em poucos objetivos realizáveis com os
// recursos de hoje; num sistema de elos, melhorar um elo só não adianta, e a virada vem atacando um gargalo por vez;
// ideia nova é hipótese: testar pequeno, observar e ajustar; unidades que dão prejuízo ficam escondidas por subsídio
// cruzado (ordenar pelo ganho e somar mostra); linhas da mesma empresa disputando o mesmo cliente encolhem o resultado;
// melhoria vem de reexaminar os detalhes do trabalho, inclusive o esforço do cliente para comprar e usar.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Ordenar os serviços (ou unidades) pelo ganho de cada um e somar do maior para o menor, para ver quais puxam o resultado para baixo', esforco: 'venda', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'M', ler: 365,
      porque: 'O resultado total esconde serviços ou unidades que dão prejuízo e são sustentados pelos que dão lucro. Ordenar do que mais ganha para o que menos ganha e ir somando mostra onde o total para de subir. Numa rede de lojas, fechar as piores e copiar nas fracas o que as melhores faziam multiplicou o ganho sem nenhuma ideia nova.',
      metrica: 'Serviços ou unidades com ganho negativo identificados e com decisão tomada', passos: ['Calcular o ganho de cada serviço ou unidade, com todos os custos', 'Ordenar do maior para o menor', 'Somar um a um e ver onde o total começa a cair', 'Decidir: corrigir copiando os melhores, mudar o preço ou parar'] },
    { texto: 'Escolher o elo mais fraco (qualidade, venda ou custo) e dedicar o trimestre só a ele, antes de passar para o próximo', esforco: 'venda', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'G', ler: 90,
      porque: 'Quando a entrega, a venda e o custo dependem uns dos outros, melhorar só um deles não aparece no resultado, e por isso ninguém tem incentivo para começar. A saída é atacar um gargalo por vez, com a atenção da empresa inteira, aceitando que o retorno vem depois.',
      metrica: 'Gargalo do trimestre resolvido e o próximo escolhido', passos: ['Listar os gargalos que se travam entre si', 'Escolher a ordem (o corte de custo costuma vir por último)', 'Dedicar o trimestre a um só, com meta clara', 'Não cobrar resultado de vendas da fase em andamento'] },
    { texto: 'Testar a ideia nova pequeno (um serviço, uma unidade ou um grupo de clientes), observar o que os clientes fazem e ajustar antes de expandir', esforco: 'venda', promessa: 'pessoas', tema: 'medicao', tipo: 'base', tam: 'M', ler: 90,
      porque: 'Toda estratégia nova é uma hipótese sobre o que vai funcionar. Testar pequeno custa pouco e mostra o que os clientes fazem de verdade; os ajustes que surgem do teste costumam valer mais que a ideia original.',
      metrica: 'Ajustes feitos a partir do teste antes de expandir', passos: ['Escrever a hipótese em uma frase', 'Escolher onde testar com pouco investimento', 'Observar o que os clientes fazem, não só o que dizem', 'Ajustar e só então expandir'] },
    { texto: 'Uma vez por ano, escrever as 10 coisas mais importantes que a empresa consegue fazer e começar pela primeira', esforco: 'marca', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 365,
      porque: 'O dia a dia faz esquecer o que é mais importante. Fazer a lista força a escolher o que é ao mesmo tempo importante e realizável, e transforma preocupações em ações.',
      metrica: 'Lista feita e o primeiro item em andamento', passos: ['Listar o que é importante para a empresa', 'Cortar o que não dá para fazer com os recursos de hoje', 'Ordenar as 10 restantes', 'Começar pela primeira e só depois passar à seguinte'] },
    { texto: 'Dar a cada serviço ou linha um público e uma faixa de preço próprios, para que não disputem o mesmo cliente', esforco: 'marca', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'M', ler: 365,
      porque: 'Quando os serviços da mesma empresa se sobrepõem, a energia vai para tirar cliente de dentro de casa, o cliente se confunde e o preço cai. Cada linha com seu público e sua faixa deixa claro para quem é cada coisa. Sem manutenção, as linhas voltam a se misturar.',
      metrica: 'Cada serviço com público e faixa de preço definidos, sem sobreposição', passos: ['Listar os serviços com preço e para quem são', 'Marcar onde dois disputam o mesmo cliente', 'Separar por público ou faixa de preço', 'Rever a cada ano se continuam separados'] },
    { texto: 'Acompanhar uma compra do começo ao fim, do lado do cliente, e tirar cada passo que dá trabalho a ele', esforco: 'venda', promessa: 'vendas', tema: 'experiencia', tipo: 'base', tam: 'P', ler: 180,
      porque: 'Melhoria não vem só de pressão ou incentivo: vem de reexaminar os detalhes de como o trabalho é feito. Para o cliente, o custo inclui procurar, comparar, esperar, aprender a usar e resolver problemas; cada passo tirado vale como desconto sem baixar o preço.',
      metrica: 'Passos tirados da jornada do cliente', passos: ['Fazer uma compra como cliente, do primeiro contato ao uso', 'Anotar cada espera, dúvida e retrabalho', 'Escolher os 3 passos que mais atrapalham', 'Tirar ou simplificar e refazer o percurso'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Chamar de estratégia uma meta de crescimento ("crescer 30%")', 'Montar a estratégia por consenso para agradar todo mundo',
    'Copiar o que um concorrente de sucesso faz sem entender por que funciona para ele', 'Ficar com a primeira ideia sem comparar com outra alternativa',
    'Espalhar o esforço em muitas frentes ao mesmo tempo']);
  add('verificacoes', ['Ganho de cada serviço ou unidade, ordenado do maior para o menor', 'Resultado do teste pequeno antes de expandir']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['Serviços ou unidades que dão prejuízo são sustentados pelos que dão lucro, sem ninguém perceber', ['A empresa faz de tudo um pouco', 'A marca tenta atender todo mundo']],
      ['Um elo fraco (entrega, venda ou atendimento) anula o esforço feito nos outros', ['A experiência muda de pessoa', 'A equipe de vendas promete']],
      ['Os serviços da própria empresa disputam o mesmo cliente entre si', ['A empresa faz de tudo um pouco', 'O cliente não entende em que categoria']],
      ['Há metas e iniciativas demais ao mesmo tempo, e nenhuma recebe esforço suficiente', ['A empresa faz de tudo um pouco', 'A marca investe um pouco em muitos canais']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 31: escolher entre caminhos, entrar pela porta menos disputada e medir a preferência inteira =====
// Fontes (leitura completa de um livro sobre estratégia como escolha, escrito a partir de uma grande empresa de bens de consumo):
// estratégia = onde jogar e como vencer, escolhidos juntos; transformar o problema em pelo menos dois caminhos que se excluem
// e perguntar "o que teria que ser verdade" para cada um, testando primeiro a condição mais duvidosa; entrar pelo segmento
// menos disputado antes de enfrentar o líder; grupos pequenos e apaixonados mal atendidos pelo líder viram marcas fortes;
// medir a preferência pela proposta inteira (aparência, facilidade, marca, preço) e não só pelo atributo técnico;
// o primeiro contato e o primeiro uso decidem a recompra; no teste de preço, a faixa do meio pode não convencer ninguém.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Antes de escolher a abordagem, escrever dois caminhos que não dá para seguir juntos e, para cada um, o que teria que ser verdade para dar certo', esforco: 'marca', promessa: 'valor', tema: 'posicionamento', tipo: 'base', tam: 'P', ler: 365,
      porque: 'Discutir qual caminho "é o certo" vira disputa de opinião. Perguntar o que teria que ser verdade para cada um dar certo mostra exatamente o que precisa ser checado, e a escolha fica quase óbvia depois do teste. Testar primeiro a condição mais duvidosa economiza tempo: se ela falha, o caminho cai sem testar o resto.',
      metrica: 'Caminho escolhido depois de testar a condição mais duvidosa', passos: ['Escrever o problema como uma escolha entre pelo menos 2 caminhos', 'Para cada um, listar o que teria que ser verdade (clientes, concorrentes, custos, capacidade)', 'Marcar a condição mais duvidosa de cada caminho', 'Testar essa primeiro, de um jeito que o mais cético aceite'] },
    { texto: 'Entrar pela porta menos disputada: começar pelo grupo de clientes ou serviço que os concorrentes fortes ignoram e avançar depois', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'base', tam: 'M', ler: 365,
      porque: 'Atacar de frente o concorrente mais forte, onde ele defende tudo, costuma sair caro e falhar. Começar onde ele não está olhando dá tempo de ganhar experiência e escala; depois a marca avança para os segmentos mais disputados com mais força.',
      metrica: 'Participação no grupo ou serviço escolhido para entrar', passos: ['Listar onde os concorrentes fortes concentram esforço', 'Achar o grupo de clientes ou serviço que eles deixam de lado', 'Entrar ali com uma oferta pensada para esse grupo', 'Decidir o próximo passo só depois de liderar ali'] },
    { texto: 'Encontrar um grupo pequeno e apaixonado que o líder atende mal e posicionar a marca inteira para ele', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'base', tam: 'M', ler: 365,
      porque: 'O líder costuma atender bem a maioria e mal quem dá muito valor a uma coisa específica. Uma marca que escolhe esse grupo e mostra isso em tudo (produto, embalagem, comunicação) vira a preferida dele, mesmo sendo pequena no começo.',
      metrica: 'Clientes do grupo escolhido que preferem a marca', passos: ['Procurar clientes que reclamam de algo que ninguém faz bem', 'Medir se o grupo é grande o bastante para sustentar o negócio', 'Ajustar produto, embalagem e comunicação para ele', 'Acompanhar a preferência desse grupo'] },
    { texto: 'Medir a preferência dos clientes pela proposta inteira (aparência, facilidade, marca e preço), e não só pelo atributo técnico de que a empresa se orgulha', esforco: 'venda', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 180,
      porque: 'A empresa costuma medir o que sabe fazer melhor e concluir que tem o melhor produto. O cliente decide pelo conjunto. Uma medida que pesava aparência, facilidade de uso, marca e preço explicou quem crescia no mercado melhor do que o teste técnico.',
      metrica: 'Preferência dos clientes medida pela proposta inteira', passos: ['Listar o que pesa na escolha, além do desempenho técnico', 'Pedir a clientes que comparem a empresa e 2 concorrentes em cada ponto', 'Ver onde a empresa perde mesmo sendo tecnicamente melhor', 'Corrigir o ponto que mais pesa na escolha'] },
    { texto: 'Desenhar o primeiro contato e o primeiro uso para que confirmem a promessa da marca', esforco: 'venda', promessa: 'vendas', tema: 'experiencia', tipo: 'base', tam: 'M', ler: 180,
      porque: 'Dois momentos decidem se a pessoa compra e volta: quando encontra a empresa (vitrine, perfil, prateleira) e quando usa pela primeira vez. Se o primeiro explica a promessa e o segundo a confirma, abre-se o caminho para recompra.',
      metrica: 'Clientes que voltam depois da primeira compra', passos: ['Descrever o que a pessoa vê no primeiro contato', 'Conferir se a promessa aparece em segundos', 'Descrever o primeiro uso e o que pode dar errado', 'Ajustar para que o primeiro uso entregue a promessa'] },
    { texto: 'Testar a oferta nova em três preços antes de lançar, sem assumir que o do meio é o mais seguro', esforco: 'venda', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'P', ler: 90,
      porque: 'O preço muda quem compra, não só quanto se vende. Num teste de produto novo, a intenção de compra foi boa no preço baixo, caiu no do meio (caro para um público, barato demais para o outro) e voltou a subir no mais alto, que atraiu os dois. Preço baixo demais também faz o cliente exigente duvidar da qualidade.',
      metrica: 'Preço escolhido a partir do teste', passos: ['Definir 3 preços: o atual, um intermediário e um mais alto', 'Mostrar a oferta a clientes de perfis diferentes em cada preço', 'Anotar quem diz que compraria em cada um', 'Escolher o preço pelo público que se quer atrair'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Atacar de frente, primeiro, o concorrente mais forte', 'Abrir disputa com vários concorrentes em várias frentes ao mesmo tempo',
    'Lançar a melhoria com outro nome e deixar a marca principal sem ela', 'Concluir que o cliente não pagaria mais por algo claramente melhor só porque ele disse que não',
    'Aceitar o mercado atual como o único jeito possível de competir']);
  add('verificacoes', ['Condição mais duvidosa da estratégia testada antes de investir', 'Preferência dos clientes pela proposta inteira, comparada a 2 concorrentes']);
})();

// ===== Rodada 32: o que vem à mente, perfis em ordem, fiéis sem desconto, visitas que ouvem problemas e serviço novo com o mesmo nome =====
// Fontes (leitura de um livro-texto de gestão estratégica de marcas, caps. 2, 3, 9, 10, 11 e diretrizes dos caps. 12 a 14):
// associação livre é a técnica mais simples e muitas vezes a mais eficaz; a ordem em que as associações aparecem indica a força,
// e comparar com as do concorrente mostra o que é único; o inventário da marca inclui os perfis digitais (abandonados, repetidos,
// desatualizados, canais ausentes); clientes mais fiéis esperam pagar menos (estudo publicado em revista acadêmica de marketing),
// então a recompensa deve vir por outros meios; boas visitas a clientes seguem um plano, vão além dos favoritos e pedem problemas,
// não soluções; extensões dão certo quando há ajuste percebido com a marca, e a divulgação deve explicar o produto novo;
// a categoria vem antes do diferencial numa marca nova; o diferencial é dito como benefício, com a característica como prova;
// intenção de compra prevê melhor quando a pergunta tem situação e prazo concretos.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Perguntar a 10 clientes o que vem à mente sobre a empresa e sobre o principal concorrente, e separar o que só aparece para a empresa', esforco: 'marca', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 30,
      porque: 'Perguntar sem dar pistas é a forma mais simples de ver o que a marca significa para o cliente. O que aparece primeiro é o que está mais forte na memória. Fazer a mesma pergunta sobre o concorrente mostra o que é só da marca: o que aparece para os dois não diferencia.',
      metrica: 'Ideias que aparecem só para a empresa entre as 3 primeiras citadas', passos: ['Perguntar: "O que vem à sua cabeça quando pensa em [empresa]?", sem dar pistas', 'Anotar as respostas na ordem em que aparecem', 'Depois perguntar o que mais gosta, o que menos gosta e o que acha único', 'Fazer as mesmas perguntas sobre o principal concorrente', 'Separar o que aparece só para a empresa e comparar com o que a marca quer ser'] },
    { texto: 'Revisar todos os perfis e canais da marca: fechar os abandonados, juntar os repetidos e atualizar logo, horário e contato', esforco: 'marca', promessa: 'pessoas', tema: 'presenca', tipo: 'base', tam: 'P', ler: 30,
      porque: 'Com o tempo, a marca deixa perfis esquecidos, páginas repetidas e informações velhas espalhadas. Quem encontra um desses vê uma marca parada ou desencontrada. A revisão também mostra onde a marca não está e deveria estar.',
      metrica: 'Perfis e canais com logo, horário e contato atuais', passos: ['Listar todos os perfis, páginas, cadastros e mapas em que a marca aparece', 'Fechar ou atualizar os abandonados', 'Juntar os repetidos num só', 'Conferir logo, cores, horário e contato em cada um', 'Anotar onde os clientes procuram e a marca não está'] },
    { texto: 'Recompensar os clientes mais antigos com atendimento e benefícios, e não com descontos maiores', esforco: 'venda', promessa: 'valor', tema: 'relacao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Um estudo publicado em revista acadêmica de marketing mostrou que os clientes mais fiéis esperam pagar menos e negociam mais, porque se sabem valiosos. Se a única recompensa for desconto, a margem dos melhores clientes encolhe ano a ano. Prioridade, atendimento dedicado ou um extra mostram o mesmo reconhecimento sem baixar o preço.',
      metrica: 'Margem dos clientes mais antigos comparada à dos demais', passos: ['Listar o que os clientes mais antigos recebem hoje e quanto de desconto têm', 'Escolher benefícios que não sejam preço: prioridade, atendimento dedicado, um extra', 'Orientar a equipe de vendas a oferecer esses benefícios antes de qualquer desconto', 'Acompanhar a margem desses clientes'] },
    { texto: 'Visitar 12 clientes escolhidos por um plano, e não só os favoritos, para ouvir os problemas deles', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'M', ler: 90, setores: ['b2b', 'servicos'],
      porque: 'Visitar sempre os mesmos clientes favoritos dá uma visão confortável e parcial. Um método reconhecido de visitas recomenda escolher por um plano (tamanho, setor, satisfeitos e insatisfeitos), ver pelo menos uma dúzia e ouvir quem participa de cada etapa da compra. O cliente descreve bem o problema; a solução é trabalho da empresa.',
      metrica: 'Problemas que se repetiram em pelo menos 3 visitas', passos: ['Escolher 12 clientes por um plano: tamanhos, setores, satisfeitos e insatisfeitos', 'Enviar antes a agenda da conversa', 'Ir em 2 ou 3 pessoas: uma conduz, outra anota as falas como foram ditas', 'Fazer perguntas abertas sobre problemas, e não pedir soluções', 'Conversar sobre o que ouviu logo depois de cada visita', 'Juntar o que se repetiu num resumo por tema'] },
    { texto: 'Antes de lançar um serviço novo com o nome da marca, perguntar a clientes se esperariam isso dela e quais serviços acham que ela já oferece', esforco: 'marca', promessa: 'valor', tema: 'posicionamento', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Pesquisas sobre extensões de marca mostram que o produto novo vai bem quando a marca tem boa imagem e o cliente vê ligação entre os dois. Se muitos já acham que a empresa oferece aquilo, o risco é baixo. Se ninguém espera, o serviço pode confundir a marca. Na divulgação, funciona melhor explicar o serviço novo do que só repetir o nome da marca.',
      metrica: 'Clientes que esperariam o serviço novo da marca', passos: ['Perguntar a 10 clientes quais serviços acham que a empresa já oferece', 'Descrever o serviço novo e perguntar se esperariam isso da marca, de 0 a 10', 'Perguntar o que vem à mente ao saber da novidade', 'Se a ligação for fraca, rever o serviço ou o nome', 'Na divulgação, explicar o que o serviço novo faz'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Fazer um anúncio chamativo que não deixa claro o que a empresa vende', 'Dar os maiores descontos justamente aos clientes mais fiéis',
    'Pedir ao cliente que invente a solução em vez de contar o problema']);
  add('verificacoes', ['Marca nova: a comunicação diz o que a empresa é antes de dizer por que é diferente', 'Diferencial dito como ganho para o cliente, com a característica como prova',
    'Pontos em que a marca precisa ser "boa o suficiente" tirados dos diferenciais dos concorrentes', 'Pergunta de intenção de compra com situação e prazo concretos, conferida depois com as vendas']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['O diferencial da marca foi copiado e virou o mínimo que todo concorrente oferece', ['Os concorrentes copiam rápido', 'Todos os concorrentes fazem igual', 'O cliente não vê diferença']],
      ['Os clientes mais antigos recebem os maiores descontos e passaram a esperar preço menor', ['A empresa dá desconto para fechar', 'A marca é vista como barata']],
      ['Perfis e cadastros da marca estão abandonados, repetidos ou com informação antiga', ['É difícil achar e comprar', 'A marca é lembrada por um produto ou fase antiga']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 33: boletim da marca, ponto físico para quem vende só on-line, mudar sinais conhecidos com cuidado, patrocínio que se mede e prova de clientes conhecidos =====
// Fontes (segunda passada no mesmo livro-texto de gestão de marcas: caps. 1, 4 a 8, 14 e 16): boletim da marca com 10 pontos,
// respondido também para o concorrente e comparado entre as pessoas; estudos publicados em revistas acadêmicas mostraram que abrir
// showrooms aumentou as vendas também on-line e reduziu devoluções, e que somar lojas físicas ao on-line elevou a receita;
// reformulações de embalagem e logo voltaram atrás em semanas quando os clientes deixaram de reconhecer a marca, e a mudança
// precisa ser bem avaliada e explicada; patrocínio exige público igual ao da marca, verba de ativação e medida no público,
// não só exposição; em B2B e serviços a credibilidade e a lista de clientes conhecidos reduzem o risco de quem compra;
// promoções por localização rendem mais perto do concorrente que perto da própria loja (estudo publicado em revista acadêmica);
// ao revitalizar, buscar público totalmente novo antes de segurar o atual é a opção mais arriscada.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Dar com a equipe uma nota de 1 a 10 à marca em 10 pontos, fazer o mesmo para o principal concorrente e comparar as notas de cada pessoa', esforco: 'marca', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 365,
      porque: 'Um boletim simples, proposto num artigo conhecido sobre gestão de marcas, mostra onde a marca está forte e onde está fraca. Fazer o mesmo para o concorrente coloca as notas em perspectiva. Comparar as notas entre as pessoas revela onde a equipe não concorda sobre a própria marca, o que já é um problema a resolver.',
      metrica: 'Pontos com nota abaixo de 6 ou com notas muito diferentes entre as pessoas', passos: ['Dar nota de 1 a 10, cada pessoa sozinha, a: entrega o que o cliente mais quer; continua atual; preço segue o valor percebido; posicionamento claro; consistência; serviços organizados; usa bem todos os canais; equipe sabe o que a marca significa; recebe apoio constante; acompanha os próprios números', 'Responder como alguém de fora, sendo honesto', 'Fazer o mesmo para o principal concorrente', 'Comparar as notas entre as pessoas e conversar onde divergem', 'Escolher os 2 pontos mais fracos para o plano do próximo semestre'] },
    { texto: 'Para quem vende só on-line: testar um ponto físico temporário (loja provisória, espaço dentro de outra loja ou evento) para os clientes verem e provarem', esforco: 'venda', promessa: 'pessoas', tema: 'distribuicao', tipo: 'ativacao', tam: 'M', ler: 90, setores: ['loja_online'],
      porque: 'Estudos publicados em revistas acadêmicas de gestão mostraram que, quando uma marca nascida on-line abriu espaços para o cliente ver e provar, as vendas cresceram também no site e as devoluções caíram; somar lojas físicas a uma operação on-line elevou a receita total. Começar com algo temporário testa o efeito sem o custo de uma loja fixa.',
      metrica: 'Vendas on-line da região do ponto, antes e depois', passos: ['Escolher a cidade ou o bairro com mais clientes on-line', 'Montar um ponto temporário: loja provisória, espaço numa loja parceira ou estande em evento', 'Deixar o cliente ver, provar e sair com um código de compra', 'Comparar vendas on-line e devoluções da região antes e depois'] },
    { texto: 'Antes de mudar a frase, o logo ou a embalagem que os clientes já conhecem, listar o que eles reconhecem, testar a versão nova e explicar a mudança', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Reformulações de embalagem e logo de marcas grandes voltaram atrás em uma a seis semanas porque os clientes deixaram de reconhecer o produto ou acharam o novo genérico. A reação inicial a mudanças tende a ser negativa. Por isso o elemento novo precisa ser bem avaliado por si, manter o que os clientes usam para reconhecer a marca e vir com uma explicação clara do porquê.',
      metrica: 'Clientes que reconhecem a marca na versão nova', passos: ['Listar o que os clientes usam para reconhecer a marca hoje (cor, forma, frase, símbolo)', 'Decidir o que disso ainda serve e precisa ficar', 'Mostrar a versão nova a 10 clientes e ver se reconhecem e gostam', 'Explicar aos clientes o porquê da mudança quando ela for ao ar'] },
    { texto: 'Patrocinar ou apoiar um evento só se o público dele for o da marca, separar verba para ativar a presença e perguntar ao público depois se lembra da marca', esforco: 'marca', promessa: 'pessoas', tema: 'presenca', tipo: 'marca', tam: 'M', ler: 60,
      porque: 'O que faz um patrocínio funcionar é o que se faz junto com ele: amostras, experiência, conteúdo, promoção. Profissionais da área recomendam gastar com essa ativação de 2 a 3 vezes o valor da cota. Medir só quanto tempo a marca apareceu ignora se o público lembrou dela; pesquisas depois de grandes eventos mostram muita gente apontando como patrocinador quem não era.',
      metrica: 'Pessoas do público que lembram da marca como apoiadora, sem ajuda', passos: ['Conferir se o público do evento é o público da marca', 'Preferir eventos com poucos patrocinadores', 'Separar verba para ativar: amostras, experiência, conteúdo', 'Perguntar a parte do público, depois, quais marcas lembram do evento'] },
    { texto: 'Mostrar, com autorização, os clientes conhecidos que a empresa atende, sem deixar que eles apareçam mais que a própria marca', esforco: 'venda', promessa: 'vendas', tema: 'conteudo', tipo: 'base', tam: 'P', ler: 90, setores: ['b2b', 'servicos', 'tecnologia'],
      porque: 'Para quem compra serviço ou compra para uma empresa, o maior medo é errar. A credibilidade da empresa é o principal atalho que o comprador usa para reduzir esse risco, e saber quem mais já confia nela transmite isso. O cuidado é não deixar a lista de clientes tomar o lugar da mensagem sobre a própria empresa.',
      metrica: 'Propostas fechadas depois de mostrar os clientes atendidos', passos: ['Listar os clientes mais conhecidos ou respeitados no setor', 'Pedir autorização para citar o nome', 'Colocar a lista no site, na proposta e na apresentação, abaixo da promessa da empresa', 'Atualizar a lista a cada semestre'] },
    { texto: 'Mostrar o anúncio de oferta a quem está perto do concorrente, e não só a quem já está perto da própria loja', esforco: 'venda', promessa: 'pessoas', tema: 'anuncio', tipo: 'ativacao', tam: 'P', ler: 30, setores: ['varejo', 'alimentacao', 'beleza'],
      porque: 'Um estudo publicado em revista acadêmica de marketing testou promoções no celular por localização: mirar quem estava perto da loja do concorrente rendeu mais do que mirar quem estava perto da própria loja, que tende a comprar de qualquer jeito e só recebe o desconto. Quanto mais perto do momento da compra, maior a resposta.',
      metrica: 'Clientes novos vindos do anúncio por localização', passos: ['Marcar no mapa as lojas dos principais concorrentes', 'Criar um anúncio de oferta com raio pequeno em volta delas', 'Rodar nos horários em que as pessoas compram', 'Comparar com o mesmo anúncio em volta da própria loja'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Com as vendas caindo, correr atrás de um público totalmente novo antes de segurar quem já compra',
    'Usar bicho, bebê, humor ou famoso que chama mais atenção que a própria marca', 'Avaliar um patrocínio só pelo tempo que a marca apareceu',
    'Mudar o produto ou serviço principal a ponto de o cliente não reconhecê-lo: melhor, não diferente']);
  add('verificacoes', ['Mudança de logo, frase ou embalagem testada com clientes e explicada na estreia', 'Boletim da marca respondido pela equipe e comparado com o do principal concorrente']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['A empresa correu atrás de um público novo e deixou de cuidar de quem já comprava', ['A marca cresceu e perdeu', 'Os clientes compram uma vez']],
      ['A marca mudou algo que os clientes usavam para reconhecê-la (embalagem, logo, frase ou o próprio produto)', ['A marca é pouco lembrada', 'A marca cresceu e perdeu']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 34: lucro da campanha (e não faturamento), preço comparado ao concorrente, mostrar como os clientes são tratados,
// duas frentes para compras pensadas, poucos canais pagos somados a canais não pagos, comparação entre lugares, perfil dos novos clientes e crise =====
// Fontes (análise de 880 campanhas premiadas por eficácia no Reino Unido, publicada por uma associação de agências): cerca de 2/3 dos casos
// calcularam retorno sobre faturamento e não sobre lucro; a margem certa é a de contribuição da venda a mais; maximizar o retorno percentual
// leva a cortar verba e reduzir o lucro total; reduzir a sensibilidade a preço foi o objetivo de maior efeito no lucro e o preço relativo é o
// termômetro quando não dá para medi-la; campanhas de fidelização que deram certo trouxeram sobretudo clientes novos (num caso de telefonia,
// ~2/3 do ganho); quem está procurando quer informação, quem não está responde à emoção; ~3 mídias pagas é o ponto ótimo, e canais não pagos
// somam; comparar lugares com mais e menos anúncio isola o efeito, enquanto testes com regiões sem anúncio quase sempre são inconclusivos;
// o perfil de quem compra mudar na direção da estratégia é a prova mais forte sem modelagem; em tempos difíceis, marca + preço juntos.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Calcular se a última campanha deu lucro: vendas a mais do que o esperado sem ela, vezes a margem de cada venda, menos o custo da campanha', esforco: 'venda', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'M', ler: 90,
      porque: 'Numa análise de 880 campanhas premiadas por eficácia, cerca de dois terços calcularam o "retorno" sobre o faturamento, como se toda venda fosse lucro. A conta certa usa só as vendas a mais em relação ao que se venderia sem a campanha e a margem de cada venda extra (preço menos o custo de produzir ou entregar), que costuma ser bem maior que o lucro final da empresa.',
      metrica: 'Lucro em reais de cada campanha, calculado com a mesma conta', passos: ['Estimar o que se venderia sem a campanha: mesmo período do ano anterior ou a tendência dos meses antes', 'Subtrair isso das vendas reais do período', 'Multiplicar pela margem de cada venda extra (preço menos o custo de produzir ou entregar)', 'Descontar o custo total da campanha', 'Anotar o resultado em reais e comparar com as próximas campanhas'] },
    { texto: 'Acompanhar a cada trimestre o preço que a empresa consegue cobrar em comparação com os principais concorrentes e quanto das vendas sai com desconto', esforco: 'venda', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Na mesma análise de 880 campanhas, as que buscaram reduzir a sensibilidade do cliente a preço tiveram os maiores efeitos no lucro, mas só 4% tinham esse objetivo. Com margem de 20%, cobrar 1% a mais rende cerca de cinco vezes o lucro de vender 1% a mais. Quando não dá para medir quanto o cliente reage ao preço, o preço comparado ao dos concorrentes é o termômetro.',
      metrica: 'Preço médio comparado ao dos 3 principais concorrentes, a cada trimestre', passos: ['Escolher 3 concorrentes e 3 produtos ou serviços comparáveis', 'Anotar o preço de cada um a cada trimestre', 'Calcular o preço médio que a empresa realmente cobrou, já com descontos', 'Acompanhar se a diferença para os concorrentes sobe ou cai junto com as vendas'] },
    { texto: 'Mostrar a quem ainda não é cliente como a empresa trata quem já compra: atendimento, benefícios e reconhecimento', esforco: 'marca', promessa: 'pessoas', tema: 'relacao', tipo: 'marca', tam: 'P', ler: 90,
      porque: 'Numa análise de 880 campanhas premiadas, as campanhas de fidelização que deram certo funcionaram principalmente trazendo clientes novos. Num caso de telefonia que divulgou recompensas aos clientes, cerca de dois terços do ganho veio de clientes novos e um terço de menos cancelamentos. Mostrar em público que a empresa valoriza quem já compra atrai quem ainda não compra e leva os atuais a indicarem.',
      metrica: 'Clientes novos que citam o tratamento aos clientes como motivo da escolha', passos: ['Listar o que os clientes atuais recebem e que pouca gente fora sabe', 'Escolher um ou dois benefícios fáceis de mostrar', 'Mostrar isso em anúncios, no site e nas redes, com clientes reais quando possível', 'Perguntar aos clientes novos o que os fez escolher a empresa'] },
    { texto: 'Para compras pensadas com antecedência, manter duas frentes: comunicação de marca com emoção para quem ainda não está procurando e material completo, com detalhes e preço, para quem está procurando agora', esforco: 'marca', promessa: 'pessoas', tema: 'anuncio', tipo: 'marca', tam: 'M', ler: 90,
      porque: 'Em compras feitas de tempos em tempos, as pessoas passam a maior parte do tempo sem procurar e só por um período estão de fato pesquisando. Numa análise de 880 campanhas premiadas, a emoção venceu na construção da marca, mas os argumentos racionais venceram na resposta imediata de quem já está no mercado. Uma montadora que separou as duas frentes dobrou sua participação em sete anos.',
      metrica: 'Pedidos de orçamento ou visitas de quem já conhecia a marca antes de procurar', passos: ['Separar a comunicação em duas: marca (todo o tempo) e informação (para quem procura)', 'Na frente de marca, contar uma história com emoção, sem lista de características', 'Na frente de informação, reunir detalhes, comparações, preço e próximos passos', 'Colocar a informação onde quem pesquisa procura: site, buscas e atendimento', 'Perguntar a quem pede orçamento se já conhecia a marca'] },
    { texto: 'Limitar a 3 os canais pagos de anúncio e somar a eles canais que não são anúncio: imprensa, indicação, ponto de venda e eventos', esforco: 'marca', promessa: 'pessoas', tema: 'anuncio', tipo: 'base', tam: 'P', ler: 180,
      porque: 'Numa análise de 880 campanhas premiadas, as que usaram vários canais foram mais eficazes que as de um só, mesmo com a mesma verba. Mas nos anúncios pagos o ganho cai depois de cerca de 3 canais (4 para verbas grandes): o alcance para de crescer, a produção consome a verba e a marca perde destaque em cada um. Já os canais que não são anúncio somam, porque cumprem tarefas diferentes.',
      metrica: 'Número de canais pagos e de canais não pagos em cada campanha', passos: ['Listar todos os canais pagos usados no último semestre e o que cada um trouxe', 'Ficar com os 3 mais fortes e passar a verba dos outros para eles', 'Escolher pelo menos 2 canais que não são anúncio para a mesma campanha', 'Usar a mesma mensagem e a mesma cara em todos'] },
    { texto: 'Quando anunciar mais em alguns bairros, cidades ou lojas do que em outros, comparar as vendas desses lugares com as dos demais', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Comparar lugares com mais e menos anúncio isola o efeito da campanha, porque preço, produto e época são os mesmos em todos. Na análise de 880 campanhas premiadas, essas comparações foram mais confiáveis que testes com regiões totalmente sem anúncio, que perdem vendas e, numa revisão de testes desse tipo, deram resultado conclusivo em só 1 de 20.',
      metrica: 'Diferença de vendas entre os lugares com mais e com menos anúncio', passos: ['Anotar quanto se anunciou em cada bairro, cidade ou loja', 'Anotar as vendas de cada lugar no mesmo período e no período anterior', 'Comparar o crescimento dos lugares com mais anúncio com o dos demais', 'Repetir por algumas campanhas antes de tirar conclusão'] },
    { texto: 'Depois de uma campanha para um público novo, conferir se o perfil de quem passou a comprar mudou na direção planejada', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Na análise de 880 campanhas premiadas, a prova mais convincente de eficácia, sem modelos estatísticos, foi mostrar que o perfil de quem compra, ou o que se compra, mudou exatamente para onde a estratégia mirava. Mostrar que quem lembra do anúncio gosta mais da marca não prova nada: quem já é cliente costuma lembrar mais.',
      metrica: 'Parte dos clientes novos que é do público-alvo, antes e depois', passos: ['Antes da campanha, anotar o perfil dos clientes novos (idade, região, tipo de empresa ou de compra)', 'Definir qual mudança a campanha quer causar', 'Depois, anotar o perfil dos novos clientes do mesmo jeito', 'Comparar e ver se a mudança foi na direção planejada'] },
    { texto: 'Em época de crise no setor, manter a presença da marca e juntar a mensagem de marca com uma condição de preço ou pagamento', esforco: 'marca', promessa: 'pessoas', tema: 'anuncio', tipo: 'marca', tam: 'P', ler: 90,
      porque: 'Na análise de 880 campanhas premiadas, em tempos de otimismo a emoção pura funcionou melhor; em tempos difíceis, as mais eficazes juntaram mensagem de marca com mensagem de preço ou condição. Estudos citados na mesma análise mostram que marcas que mantêm a presença durante a recessão se saem melhor depois, porque os concorrentes cortam e a mídia fica mais barata.',
      metrica: 'Presença mantida durante a crise e participação comparada à dos concorrentes depois', passos: ['Manter um nível mínimo de presença combinado antes da crise', 'Juntar à mensagem de marca uma condição concreta: parcela, garantia ou pacote', 'Observar se os concorrentes cortaram a comunicação', 'Comparar as vendas com as do mercado, e não só com o ano anterior'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Chamar de retorno uma conta feita sobre o faturamento, sem descontar custos', 'Cortar a verba de anúncio só para o retorno percentual parecer maior',
    'Usar "quem lembra do anúncio compra mais" como prova de que o anúncio funciona', 'Pôr emoção só como enfeite numa oferta racional, em vez de no centro da campanha',
    'Espalhar a verba de anúncio por mais de 3 ou 4 canais pagos']);
  add('verificacoes', ['Retorno da campanha calculado sobre o lucro da venda a mais, e não sobre o faturamento', 'Resultado comparado com o mercado e com os concorrentes antes de julgar a campanha',
    'Previsão do teste da peça conferida depois com o resultado real', 'Meta ajustada ao momento: em mercado difícil, manter as vendas já pode ser vitória']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['As campanhas são julgadas pelo faturamento, sem descontar custos nem o que se venderia sem elas', ['A comunicação fala só com quem já está pronto', 'A comunicação é irregular']],
      ['A verba de anúncio foi cortada para o retorno de curto prazo parecer melhor', ['A marca é pouco lembrada', 'A comunicação é irregular']],
      ['A comunicação se concentra em segurar quem já compra e quase não fala com quem nunca comprou', ['A marca só é lembrada por quem já é cliente', 'A comunicação fala só com quem já está pronto']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 35: descadastros no resultado das campanhas, testar a procura antes de montar, ligar/desligar quando não dá para dividir clientes =====
// Fontes (livro de referência sobre experimentos controlados em grandes empresas digitais): a medida de e-mail baseada só na receita
// dos cliques sempre melhora com mais envios; ao descontar o valor perdido com cada descadastro, mais da metade das campanhas passou a
// dar resultado negativo; "porta pintada" mede a procura antes de construir (só ter o campo de cupom reduziu a receita); 100 ms a mais
// reduziram vendas em 1% e scripts de terceiros no topo deixam a página lenta; metas precisam de métricas de proteção e são burladas
// quando ligadas a prêmio (frango só frito depois do pedido); quando não dá para sortear grupos, ligar e desligar várias vezes
// (vigilância por helicóptero e arrombamentos); estudos observacionais exageram muito o efeito de anúncios (871–1198% contra 5,4%
// medido em experimento); o que se diz em grupo de conversa difere do que se escolhe; aumentar preço sobe a receita agora e reduz depois.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Em cada campanha por e-mail ou WhatsApp, contar quantos se descadastram ou bloqueiam e descontar essa perda do resultado', esforco: 'venda', promessa: 'valor', tema: 'relacao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Medida só pelas vendas que gera, uma campanha por mensagem sempre parece melhor quanto mais se envia, e isso leva ao excesso. Numa grande loja on-line, quando se passou a descontar o valor perdido com cada pessoa que se descadastra (que nunca mais recebe nada), mais da metade das campanhas automáticas passou a dar resultado negativo.',
      metrica: 'Vendas da campanha menos o valor perdido com descadastros e bloqueios', passos: ['Anotar, em cada envio, as vendas e quantos se descadastraram ou bloquearam', 'Estimar quanto um contato da lista costuma comprar por ano', 'Descontar dos ganhos da campanha esse valor vezes os descadastros', 'Cortar ou espaçar os tipos de envio que dão resultado negativo', 'Deixar o cliente escolher receber menos, em vez de só sair de tudo'] },
    { texto: 'Antes de montar um serviço ou oferta nova, anunciar que está chegando com uma lista de interesse e contar quantos se inscrevem', esforco: 'venda', promessa: 'vendas', tema: 'venda', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Um livro de referência sobre experimentos mostra que mesmo equipes experientes erram o valor das ideias: em grandes empresas digitais, só de 10% a um terço das ideias testadas melhorou o resultado. Medir a procura antes de construir evita gastar com o que ninguém quer; num caso, só mostrar um campo de cupom já derrubou as vendas, e a ideia foi abandonada antes de ser montada. O anúncio precisa ser honesto: dizer que é novidade e pedir o contato.',
      metrica: 'Inscritos na lista de interesse em relação a quem viu o anúncio', passos: ['Descrever a oferta nova em poucas linhas, com preço aproximado', 'Divulgar que está chegando, com um botão para deixar o contato', 'Definir antes quantos inscritos justificam montar', 'Contar os inscritos em 2 a 4 semanas', 'Avisar os inscritos sobre a decisão, qualquer que seja'] },
    { texto: 'Quando não der para dividir os clientes em dois grupos, ligar e desligar a ação em semanas alternadas, várias vezes, e comparar os períodos', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'M', ler: 90,
      porque: 'Sem grupo de comparação, é fácil confundir o efeito da ação com a época do ano. Ligar e desligar várias vezes reduz esse risco: num estudo, a cada vez que a vigilância de uma região era ligada, os arrombamentos caíam, e a cada vez que era desligada, subiam. Comparações soltas costumam exagerar muito: em anúncios, análises sem grupo de comparação estimaram efeitos centenas de vezes maiores que o medido num experimento.',
      metrica: 'Diferença média entre as semanas com e sem a ação', passos: ['Escolher a ação: anúncio, oferta no balcão, mensagem automática', 'Alternar semanas com e sem a ação por pelo menos 6 semanas', 'Anotar o resultado de cada semana e o que mais aconteceu nela (feriado, chuva, promoção)', 'Comparar a média das semanas com e sem a ação'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Concluir que um benefício funciona porque quem o usa compra mais: pode ser só que são os clientes mais ativos',
    'Decidir entre opções pelo que os clientes disseram numa conversa em grupo, sem ver o que escolhem de fato', 'Julgar um aumento de preço ou mais mensagens só pelo resultado do primeiro mês',
    'Parar um teste no dia em que o resultado "deu certo"']);
  add('verificacoes', ['Teste com duração definida antes, de pelo menos uma semana inteira', 'Resultado bom demais conferido antes de comemorar (dados repetidos, erro de registro)',
    'Grupos do teste com o tamanho combinado e recebendo a mensagem no mesmo horário', 'Efeito acompanhado semana a semana: se cai, era só novidade',
    'Teste com clientes que a empresa aceitaria aplicar a todos, sem enganar ninguém']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['Mensagens frequentes demais fizeram clientes se descadastrarem ou bloquearem a empresa', ['Os clientes compram uma vez', 'O cliente troca de fornecedor']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 36: tamanho do mercado por decomposição, 5 casos sorteados
// e gráfico de campanhas passadas =====
// Fontes (livro de referência sobre medição para decisões): decompor uma estimativa muito incerta em até 5 partes reduziu o erro de 10 a 100
// vezes; tamanho de mercado de seguros numa cidade estimado com dados públicos (carros × prêmio × comissão ÷ agências); amostragem por
// instantes (12 de 100 observações → 8% a 18% do tempo); regra dos cinco (93,75% de chance de a mediana estar entre o menor e o maior de 5
// sorteados); experimento com 30 atendentes treinados e a pergunta "para quantos amigos recomendou?"; regressão de semanas de divulgação ×
// audiência (correlação 0,7); modelos lineares simples com pesos iguais superam especialistas e entrevistas sem estrutura; discussão em grupo
// aumenta a confiança, não a qualidade; painéis sem gatilhos raramente mudam decisões; notas alto/médio/baixo e pesos arbitrários sem evidência.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Estimar o tamanho do mercado da região com números públicos: quantos podem comprar, quantos compram de fato, quanto gastam por ano e entre quantas empresas isso se divide', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'M', ler: 365,
      porque: 'Um livro de referência sobre medição para decisões mostra que dividir uma estimativa muito incerta em até cinco partes reduziu o erro de 10 a 100 vezes. Num caso real, a decisão de abrir uma agência de seguros numa cidade foi tomada com dados públicos: número de carros, valor médio do seguro, comissão e número de agências. A conta mostra também qual parte é a mais incerta e merece ser medida.',
      metrica: 'Faixa do faturamento possível na região e parte que a empresa já tem', passos: ['Escrever a decisão: abrir unidade, contratar, entrar em outro bairro', 'Quebrar o mercado em partes: quantos podem comprar × quantos compram × gasto por ano', 'Buscar cada número em fontes públicas (órgãos de estatística, prefeitura, associações do setor)', 'Dar um mínimo e um máximo para os números que não achar', 'Dividir pelo número de concorrentes e comparar com o faturamento atual'] },
    { texto: 'Quando faltar um número para decidir, medir primeiro em 5 casos sorteados antes de esperar uma pesquisa grande', esforco: 'venda', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'A regra dos cinco, mostrada num livro de referência sobre medição: sorteando 5 casos, há 93,75% de chance de o valor do meio de todos estar entre o menor e o maior deles. Quando se sabe pouco, poucas observações ensinam muito; a crença de que só centenas de respostas servem impede de medir. Os casos precisam ser sorteados, não escolhidos.',
      metrica: 'Faixa obtida com os 5 casos e se ela muda a decisão', passos: ['Escrever qual número falta e a partir de que valor a decisão muda', 'Sortear 5 casos (clientes, pedidos, dias) de uma lista completa', 'Medir o número em cada um', 'Ver se a faixa entre o menor e o maior já fica de um lado do limite', 'Se não ficar, medir mais casos'] },
    { texto: 'Montar um gráfico com as campanhas e lançamentos passados: quanto tempo ou verba de divulgação cada um teve e quanto vendeu', esforco: 'venda', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 365,
      porque: 'Os dados para decidir quanto divulgar muitas vezes já existem. Num caso relatado num livro de referência sobre medição, um gráfico com as semanas de divulgação e a audiência de 28 estreias mostrou correlação clara: cada semana a mais valia um ganho que justificou mudar o processo. O primeiro passo é sempre o gráfico de pontos; a correlação não prova causa sozinha, mas aumenta a confiança quando há um motivo para ela.',
      metrica: 'Ganho de vendas por semana (ou real) a mais de divulgação, segundo o histórico', passos: ['Listar as campanhas ou lançamentos dos últimos anos', 'Anotar de cada um: semanas de divulgação ou verba, e vendas no período', 'Fazer um gráfico de pontos numa planilha', 'Ver se os pontos sobem juntos e calcular a inclinação', 'Usar o resultado para planejar a próxima campanha'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Medir só o que é fácil, como custos e horas, e deixar de fora os benefícios incertos que decidem', 'Desistir de medir por achar que só centenas de respostas servem',
    'Pedir estimativas em reunião sem que cada um anote a sua antes de ouvir os outros']);
  add('verificacoes', ['Decisão escrita com as alternativas e o número que faria mudar de ideia', 'Faixa de estimativa testada: preferiria apostar nela ou numa roleta com 90% de chance?',
    'Perguntas da pesquisa revisadas por outra pessoa: uma coisa por pergunta e nenhuma palavra que puxe a resposta', 'Custo de uma escolha "por princípio" calculado e mostrado antes de decidir']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['As decisões grandes são tomadas por palpite, sem estimar a chance de dar errado nem quanto se perderia', ['A empresa faz de tudo um pouco']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 37: marca desde o primeiro quadro do anúncio, motivações em três níveis e uma ideia por campanha =====
// Fonte: livro sobre eficácia de propaganda baseado em experimentos com grupo exposto × grupo de controle. Os números agregados do livro
// (desperdício total, percentuais de campanhas que falham) são da própria consultoria dos autores e NÃO foram usados. Usados só casos medidos:
// anúncio on-line que mostrava marca e imagem juntas desde o início aumentou o volume de vendas em 14% (a versão que guardava a marca
// para o fim falhou); anúncio de macarrão com 15% de lembrança mudava a percepção da marca e vendia; pessoas atribuíram a TV e revista
// o efeito de anúncios que só viram on-line; creme dental que fracassou com mensagem de gengivite e vendeu com "proteção o dia todo",
// mesma fórmula; loja cuja associação com roupas caía cada vez que entrava a campanha de utensílios domésticos; anúncio parecido com o
// de um concorrente que lançou antes reforçou o concorrente.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Nos anúncios em vídeo ou animados, mostrar o nome e o símbolo da marca junto com a imagem principal desde o primeiro quadro, e não só no final', esforco: 'marca', promessa: 'pessoas', tema: 'anuncio', tipo: 'marca', tam: 'P', ler: 90,
      porque: 'Num experimento com grupo exposto e grupo de controle, um anúncio on-line de creme facial que contava uma história e só mostrava a marca nos últimos segundos não funcionou. A nova versão, com a mesma mulher, a mesma frase e o logo aparecendo junto com ela desde o início, aumentou o volume de vendas em 14%. Quem vê anúncio está distraído e passa rápido; se a marca não aparece logo, o anúncio pode ajudar a categoria ou o concorrente.',
      metrica: 'Anúncios com a marca visível desde o primeiro quadro', passos: ['Rever os anúncios em vídeo e animados em uso', 'Marcar em que segundo a marca aparece pela primeira vez', 'Refazer os que só mostram a marca no fim, pondo nome e símbolo junto da imagem principal', 'Manter a marca visível em todos os quadros, mesmo pequena'] },
    { texto: 'Escrever por que os clientes compram em três níveis: por que compram a categoria, por que escolhem esse tipo de produto ou serviço e por que escolhem a marca, incluindo por que alguns escolhem o concorrente ou não compram', esforco: 'marca', promessa: 'valor', tema: 'posicionamento', tipo: 'base', tam: 'M', ler: 365,
      porque: 'Um livro sobre eficácia de propaganda relata um creme dental que fracassou falando de gengivite e dentistas e virou sucesso, com a mesma fórmula, quando passou a falar de proteção que dura o dia todo; com a mensagem certa, os clientes até acharam o sabor melhor. Em outro caso, a equipe achava que o público de um programa queria o prêmio, e queria aprender com os melhores. Escrever as motivações em três níveis, com os motivos do concorrente e de quem não compra, deixa as suposições à vista para serem conferidas.',
      metrica: 'Motivações escritas nos três níveis e conferidas com clientes', passos: ['Listar por que as pessoas compram a categoria (o problema que resolvem)', 'Listar por que escolhem esse tipo e não outro (ex.: serviço completo × fazer sozinho)', 'Listar por que escolhem a marca e por que escolhem o concorrente', 'Listar por que algumas pessoas não compram', 'Separar o que é funcional, emocional e social', 'Conferir a lista em conversas com 5 clientes e 3 não clientes'] },
    { texto: 'Planejar a sequência das campanhas para que cada período reforce uma ideia só sobre a marca, sem alternar temas que disputam o mesmo espaço na cabeça do cliente', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'marca', tam: 'P', ler: 180,
      porque: 'Num acompanhamento contínuo de uma grande loja, a associação "lugar para comprar roupas" subia durante a campanha de moda e caía rapidamente cada vez que entrava a campanha de utensílios domésticos. Quem vê anúncios com pouca atenção guarda uma ideia simples sobre a marca; mensagens que se revezam sobre o que a marca é podem apagar uma à outra.',
      metrica: 'Campanhas do ano ligadas à mesma ideia central da marca', passos: ['Escrever a ideia principal que a marca quer deixar na cabeça do cliente', 'Listar as campanhas planejadas para o ano', 'Ver se alguma comunica uma ideia que compete com a principal', 'Reordenar ou reescrever para que cada uma reforce a mesma ideia', 'Quando precisar falar de outra linha, ligar a ela a mesma ideia central'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Tirar um anúncio do ar só porque poucas pessoas lembram de tê-lo visto', 'Decidir em que canal investir perguntando aos clientes onde viram o anúncio',
    'Fazer um anúncio parecido com o de um concorrente que lançou antes: ele pode acabar lembrando a marca do concorrente']);
  add('verificacoes', ['Sucesso da campanha definido sem ambiguidade e o que fazer se ficar abaixo, combinado antes de começar']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['Campanhas seguidas falam de coisas diferentes sobre a marca e uma apaga a ideia da outra', ['A comunicação é irregular', 'A marca tenta atender todo mundo']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 38: avaliar o anúncio pelo sentimento que deixa sobre a marca e escolher símbolos pelo sentimento que carregam =====
// Fonte: livro de um pesquisador acadêmico de publicidade sobre processamento com pouca atenção. Estudo publicado com dados dos EUA e do
// Reino Unido: só o "poder emotivo" dos anúncios se correlacionou com a melhora da simpatia pela marca; o poder da mensagem racional não
// (no Reino Unido, relação inversa). Anúncios aumentaram a preferência pela marca até entre quem não lembrava deles (estudos publicados com
// ração e seguradora). Quanto mais atenção se dá a uma afirmação persuasiva, mais ela é contestada (pesquisa de resposta cognitiva).
// Casos de elementos emocionais mantidos por anos junto à marca: bebês dos pneus (segurança), cachorrinho do papel higiênico (carinho e maciez).
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Avaliar cada anúncio também pelo sentimento que ele deixa sobre a marca: mostrar a 10 pessoas do público e perguntar como se sentem em relação à marca, não só o que entenderam', esforco: 'marca', promessa: 'pessoas', tema: 'anuncio', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Um estudo publicado com anúncios dos EUA e do Reino Unido mediu separadamente a força emocional e a força da mensagem de cada anúncio. Só a força emocional acompanhou o aumento da simpatia pela marca; a mensagem racional não ajudou e, no Reino Unido, quanto mais evidente, menor o efeito. Outros estudos mostraram anúncios melhorando a preferência pela marca até entre quem não lembrava de tê-los visto. Perguntar só "o que você entendeu?" deixa de fora o que mais pesa.',
      metrica: 'Anúncios avaliados pelo sentimento sobre a marca antes de ir ao ar', passos: ['Mostrar o anúncio a 10 pessoas do público, uma de cada vez', 'Perguntar: depois de ver, como você se sente em relação a esta marca? (pior, igual, melhor e por quê)', 'Pedir 3 palavras que descrevam o jeito da marca no anúncio', 'Comparar com o sentimento que a marca quer deixar', 'Ajustar música, imagem, tom ou ritmo quando o sentimento não bater'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Encher o anúncio de afirmações e argumentos que o cliente pode contestar, no lugar de um sentimento claro sobre a marca']);
  add('verificacoes', ['Personagem, música ou símbolo da marca escolhido pelo sentimento que desperta (cuidado, segurança, alegria) e mantido por anos']);
})();

// ===== Rodada 39: novidade contada sem confusão, lançamentos com peso suficiente, renovação que não pareça repetição e ligação com a marca =====
// Fonte: livro de pesquisador de rastreamento de anúncios (banco com dezenas de milhares de comerciais medidos 3 semanas após a estreia,
// ligado a dados de audiência). Gostar do anúncio explicou 58% da variação na lembrança de anúncios de alimentos (duração, 2%), e "gostar"
// não é humor: notícia relevante e identificação aumentam, confusão, irritação e "já vi igual" diminuem; em 65 anúncios de produtos novos,
// notícia relevante foi o principal fator da experimentação; humor somado à notícia confunde. Anúncios novos precisam passar de um limiar
// com peso concentrado; vários lançados juntos sem peso ficaram com baixo impacto. Em 800 comerciais, só cerca de 1 em 4 pessoas reconhecia
// o anúncio e dizia a marca certa; renovações que mudam pouco se desgastam rápido por familiaridade.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Num anúncio de novidade, cobrir a notícia com humor ou cenas demais: com novidade, conte a novidade com clareza',
    'Lançar vários anúncios novos ao mesmo tempo dividindo a verba, sem peso suficiente para nenhum ser notado']);
  add('verificacoes', ['Quem vê o anúncio sabe dizer de que marca é (testado com pessoas do público)',
    'Peça nova de uma campanha antiga diferente o bastante para não parecer repetida, mantendo os sinais da marca']);
})();

// ===== Rodada 40: qualidade comparada ao concorrente, dependência de promoção e leitura correta dos resultados da marca =====
// Fonte: livro de professor de escola de negócios sobre métricas de marketing (pesquisa de 30 meses com empresas). Satisfação absoluta
// não é confiável: há satisfeitos que trocam de marca e insatisfeitos que ficam por inércia; a qualidade percebida relativa ao concorrente
// previu o lucro futuro melhor que a participação de mercado (estudo publicado). Promoções em 50% do tempo com 80% das vendas nelas indicam
// marca fraca; linha de base de promoção puxada para baixo infla o ganho; promoções de preço quando os concorrentes também fazem podem
// prejudicar. Estudos publicados em vários serviços: recomendação caiu com o tempo de cliente em 3 de 4 serviços; clientes antigos não eram
// necessariamente mais baratos de atender nem menos sensíveis a preço. Medir divulgação pelo espaço ocupado nunca foi sólido. A marca muda
// devagar: avaliação completa no máximo duas vezes por ano fora de crises. Vendas altas com marca enfraquecida (preço subindo e produto
// encolhendo) enganam até a marca despencar. Marca nova precisa de conhecimento e experimentação; marca madura, de diferença frente aos imitadores.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Perguntar aos clientes como a empresa se compara ao principal concorrente em qualidade, não só se estão satisfeitos', esforco: 'marca', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'A nota de satisfação sozinha engana: há clientes satisfeitos que trocam de marca e insatisfeitos que ficam só por comodidade. Um estudo publicado mostrou que a qualidade percebida em comparação com o concorrente prevê o lucro futuro melhor do que a participação de mercado. A pergunta comparada mostra se a marca está ganhando ou perdendo terreno na cabeça do cliente.',
      metrica: 'Parte dos clientes que acha a empresa melhor que o principal concorrente, medida a cada semestre', passos: ['Escolher o concorrente que o cliente mais considera no lugar da empresa', 'Perguntar a pelo menos 20 clientes e 10 pessoas que compram na categoria: comparando as duas, qual tem mais qualidade? Qual você prefere?', 'Anotar a parte que diz "a empresa", "igual" e "o concorrente"', 'Repetir a cada semestre com as mesmas perguntas e o mesmo concorrente', 'Quando a diferença cair, perguntar o motivo e agir nele antes de mexer no preço'] },
    { texto: 'Comparar a parte das vendas feita em promoção com a parte do tempo em que há promoção, para ver se a marca depende de desconto', esforco: 'venda', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Se há promoção em metade do tempo, mas 80% das vendas acontecem nela, o cliente aprendeu a esperar o desconto: sinal de marca fraca. Os estudos citados mostram que promoções de preço muitas vezes não dão lucro nem no curto prazo, e que o ganho costuma ser inflado quando é medido contra um período de vendas baixo.',
      metrica: 'Parte das vendas em promoção comparada à parte do tempo com promoção, a cada trimestre', passos: ['Contar em quantos dias do trimestre houve alguma promoção ou desconto aberto', 'Somar quanto foi vendido nesses dias e quanto foi vendido a preço cheio', 'Comparar: parte do tempo com promoção x parte das vendas com promoção', 'Se as vendas em promoção forem bem maiores que o tempo de promoção, reduzir a frequência dos descontos e reforçar a comunicação de marca', 'Repetir a conta no trimestre seguinte'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Medir o ganho de uma promoção comparando com o pior período de vendas: compare com a média normal ou com um local parecido sem promoção',
    'Fazer promoção de preço só porque o concorrente fez: quando todos dão desconto, ninguém ganha cliente e todos perdem margem',
    'Medir a divulgação na imprensa pelo tamanho da matéria ou por quanto custaria em anúncio: o que importa é o efeito em quem leu',
    'Contar que clientes antigos indicam mais e aceitam preço maior sem conferir: em vários serviços estudados, a indicação caiu com o tempo de cliente',
    'Refazer a avaliação completa da marca toda semana ou mês e mudar o rumo por oscilação: a marca muda devagar']);
  add('verificacoes', ['Vendas boas no período conferidas contra a saúde da marca: não vieram de subir preço, encolher o produto ou cortar qualidade',
    'Ao comparar crescimento ou participação, o mercado considerado é o mesmo do período anterior',
    'Marca nova acompanhada primeiro por conhecimento e experimentação; marca já conhecida, pela diferença em relação aos imitadores']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['A maior parte das vendas só acontece em promoção, e o preço cheio quase não vende', ['A proposta começa pelo preço', 'O cliente não vê diferença']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 41: experimentação x recompra, quem conhece e não compra, satisfação bem medida e força da marca por região =====
// Fonte: livro acadêmico de métricas de marca ao longo da jornada do cliente (2022). Matriz experimentação x recompra: muita
// experimentação e pouca recompra = produto/entrega; pouca experimentação e muita recompra = comunicação e disponibilidade.
// Taxa de ativação: parte de quem conhece a marca que compra; barreiras: opiniões negativas ouvidas, medo do pós-venda, já ter favorita.
// Satisfação: questionário deixado no balcão atrai sobretudo insatisfeitos (autosseleção); sortear quem responde; 3,2 numa escala de 5 é
// cliente educado, não satisfeito; mesma média pode esconder 25% totalmente insatisfeitos; índice ponderado pela importância previu
// melhor o desempenho futuro que a recomendação isolada (estudo publicado). Vendas por habitante da marca x da categoria por região.
// Diferença de compras entre seguidores e não seguidores foi atribuída por engano às redes sociais. Pesquisa de atitude ampla quando
// os números de comportamento vão bem tem pouco valor e pode confundir. Penetração alta veio com apego mais fraco quando a marca largou
// benefícios de nicho para alcançar mais gente (estudo publicado). Vendas que crescem num mercado que cresce mais rápido = marca mais fraca.
// Conhecimento auxiliado abaixo de 20% = marca desconhecida.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Cruzar quantas pessoas experimentaram a marca com quantas voltaram a comprar, para saber se o problema está na divulgação ou na entrega', esforco: 'marca', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Os dois números juntos dizem onde agir. Muita gente experimenta e pouca volta: divulgação e acesso funcionam, mas o produto ou o atendimento não convence. Pouca gente experimenta e quase todos voltam: a entrega é boa, mas faltam alcance e facilidade de compra. Os dois baixos: os dois lados falham. Olhar só um deles leva a mexer na coisa errada.',
      metrica: 'Clientes novos do período e parte deles que comprou de novo, lidos juntos a cada trimestre', passos: ['Contar os clientes que compraram pela primeira vez no período', 'Contar quantos deles compraram de novo no período seguinte', 'Comparar com o ciclo normal de recompra do setor', 'Se muitos chegam e poucos voltam, olhar o produto e o primeiro atendimento', 'Se poucos chegam e quase todos voltam, reforçar divulgação e facilidade de compra'] },
    { texto: 'Perguntar a quem conhece a marca e ainda não compra por que não compra', esforco: 'marca', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Conhecer não basta: parte de quem conhece a marca nunca vira cliente. Os motivos costumam ser opiniões negativas que ouviu, medo de ficar sem suporte depois da compra, já ter uma marca favorita ou não saber onde comprar. Cada motivo pede uma resposta diferente, e só perguntando dá para saber qual pesa mais.',
      metrica: 'Parte de quem conhece a marca que já comprou, e o principal motivo de quem não comprou', passos: ['Na próxima pesquisa ou conversa, separar quem conhece a marca e nunca comprou', 'Perguntar o que impediu: preço, opinião que ouviu, medo do pós-venda, já ter outra preferida, não saber onde comprar', 'Contar as respostas e ver qual motivo aparece mais', 'Agir no motivo principal (provas, garantia, presença onde compram)', 'Repetir a pergunta depois de alguns meses'] },
    { texto: 'Na pesquisa de satisfação, sortear quem responde e contar a parte de notas máximas, não só a média', esforco: 'marca', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'P', ler: 90,
      porque: 'Questionário deixado no balcão atrai sobretudo quem está insatisfeito, e a média esconde muito: 3,2 numa escala de 5 é um cliente educado, não satisfeito, e duas marcas com a mesma média podem ter uma com um quarto dos clientes totalmente insatisfeitos. Um estudo publicado mostrou que a satisfação pesada pela importância de cada ponto previu melhor o desempenho futuro do que a pergunta de recomendação sozinha.',
      metrica: 'Parte de notas máximas em cada ponto importante, em amostra sorteada', passos: ['Escolher uma regra de sorteio, por exemplo 1 em cada 5 clientes ao final do serviço', 'Perguntar a nota de cada ponto que importa (atendimento, prazo, resultado, preço) e quanto cada ponto importa', 'Contar a parte de notas máximas e a parte de notas baixas, além da média', 'Melhorar primeiro o que é muito importante e tem poucas notas máximas', 'Repetir com a mesma regra a cada semestre'] },
    { texto: 'Comparar as vendas por habitante em cada cidade ou bairro atendido com o consumo da categoria ali, para decidir onde reforçar a marca', esforco: 'marca', promessa: 'vendas', tema: 'distribuicao', tipo: 'base', tam: 'M', ler: 90,
      porque: 'Vender mais numa região grande não quer dizer que a marca é mais forte ali. Dividindo pelas pessoas da região e comparando com quanto a categoria vende ali, aparece onde a marca está bem, onde a categoria é forte e a marca é fraca (a maior oportunidade) e onde o problema é a própria categoria. Se os índices são parecidos em todas as regiões, não há motivo para tratá-las de forma diferente.',
      metrica: 'Índice de vendas por habitante da marca e da categoria em cada região', passos: ['Listar as cidades ou bairros atendidos e a população de cada um', 'Calcular as vendas da empresa por habitante em cada um e comparar com a média de todos (média = 100)', 'Estimar, com dados públicos ou do setor, se a categoria vende mais ou menos ali', 'Onde a categoria é forte e a marca é fraca, reforçar presença e divulgação', 'Onde marca e categoria são fracas, não insistir antes de entender o motivo'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Creditar às redes sociais a diferença de compras entre seguidores e não seguidores: quem segue a marca já era cliente mais ativo',
    'Encomendar pesquisa grande de imagem quando conhecimento, vendas, recompra e facilidade de compra vão bem: aprofunde só quando algum número cair',
    'Para alcançar públicos novos, abandonar o benefício que fazia a marca ser única: o apego dos clientes se dilui',
    'Deixar questionários de satisfação no balcão para quem quiser responder: quem responde é sobretudo quem está insatisfeito']);
  add('verificacoes', ['Crescimento das vendas comparado ao crescimento do mercado e do principal concorrente',
    'Marca reconhecida pelo nome por menos de 1 em cada 5 pessoas do público é desconhecida: mudar canal, conteúdo ou verba antes de tudo']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['Muita gente experimenta a marca, mas pouca volta a comprar', ['Os clientes compram uma vez', 'A experiência muda de pessoa']],
     ['Muita gente conhece a marca, mas pouca chega a comprar', ['A empresa tem qualidade, mas não tem provas', 'É difícil achar e comprar']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 42: o que se vê de relance, sinais que não podem sumir no redesenho, ganho x não perder e foco num objetivo =====
// Fonte: livro de ex-executivo de marketing sobre ciência da decisão (2ª ed., 2022). Ficaram de fora as métricas e números da consultoria
// do autor. Usado: a visão nítida cobre uma área mínima e o resto é borrado; reconhecemos marcas por poucos sinais característicos;
// mudar esses sinais derrubou vendas (suco que trocou a laranja com canudo por um copo; sabão para lã que trocou o rosa por branco e perdeu
// clientes para a concorrente rosa). Mensagem com foco igual ao da categoria (ganhar x evitar perda) persuade mais (pesquisa publicada sobre
// foco de promoção e prevenção). Diferença de preço só é notada acima de um limiar proporcional ao preço (lei de Weber-Fechner).
// Ligação da marca a muitos objetivos enfraquece cada ligação (pesquisa publicada de psicologia da motivação). Lembrança muda conforme a
// situação perguntada. Texto em maiúsculas é mais difícil de processar. "Emocionar" sem objetivo vira anúncio genérico de gente feliz.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Desfocar anúncios, embalagens, fachada e a página principal e conferir se a marca e o que a diferencia ainda aparecem', esforco: 'marca', promessa: 'pessoas', tema: 'anuncio', tipo: 'base', tam: 'P', ler: 60,
      porque: 'O olho só vê com nitidez uma área do tamanho de uma unha; o resto chega borrado, e a maior parte dos contatos com anúncios dura uns 2 segundos. Nessa olhada rápida o cérebro reconhece a marca por poucos sinais característicos (cor, forma, símbolo), não pelos textos. Se a peça desfocada não mostra a marca, quase ninguém vai ligá-la à empresa.',
      metrica: 'Peças principais aprovadas no teste do desfoque', passos: ['Juntar as peças principais: anúncio, embalagem ou sacola, fachada, página inicial e perfil', 'Desfocar cada imagem (ou olhar de longe, apertando os olhos)', 'Perguntar: dá para saber de que marca é? O que a diferencia aparece?', 'Mostrar a versão desfocada a 5 pessoas e pedir que digam a marca', 'Aumentar ou repetir os sinais da marca nas peças que falharem'] },
    { texto: 'Antes de redesenhar logo, embalagem, site ou fachada, listar os sinais pelos quais o cliente reconhece a marca e mantê-los no novo desenho', esforco: 'marca', promessa: 'pessoas', tema: 'posicionamento', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Os clientes reconhecem a marca por poucos sinais característicos. Uma marca de suco trocou a laranja com canudo da embalagem por um copo, mudou a letra e a posição dos elementos; mesmo com campanha milionária, perdeu cerca de 30 milhões de euros em dois meses e a embalagem nova foi retirada. Uma marca de sabão para lã trocou o rosa por branco e perdeu clientes para a concorrente rosa. Modernizar é possível; apagar os sinais que o cliente usa para achar a marca, não.',
      metrica: 'Redesenho aprovado só depois de conferir os sinais reconhecidos', passos: ['Mostrar a 10 clientes partes isoladas da marca (cor, símbolo, forma, letra) e perguntar de quem é cada uma', 'Marcar os sinais que quase todos ligam à marca', 'Colocar esses sinais no briefing do redesenho como obrigatórios', 'Testar a versão nova da mesma forma antes de lançar', 'Lançar só se os sinais continuarem sendo reconhecidos'] },
    { texto: 'Decidir se a mensagem principal fala do que o cliente ganha ou do que ele evita perder, conforme o que ele busca na categoria', esforco: 'marca', promessa: 'pessoas', tema: 'conteudo', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Pesquisas publicadas sobre motivação mostram que as pessoas buscam ganhos em algumas compras (beleza, lazer, crescimento) e buscam evitar perdas e riscos em outras (saúde, segurança, dinheiro). A mensagem com o mesmo foco do cliente convence mais. "Fique com o visual de verão" funciona na beleza; "não perca seus dados" funciona na segurança.',
      metrica: 'Mensagem principal com foco escolhido e testado', passos: ['Perguntar a 5 clientes o que eles queriam conseguir ou evitar quando procuraram a empresa', 'Classificar a categoria: busca de ganho ou proteção contra perda', 'Escrever duas versões da mensagem principal, uma de cada foco', 'Testar as duas com o público ou em anúncios iguais', 'Usar a versão de melhor resultado em todos os pontos de contato'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Dar um desconto pequeno demais para ser notado: a diferença só é percebida acima de uma proporção do preço, e abaixo disso só reduz a margem',
    'Ligar a marca a muitos objetivos ao mesmo tempo (ser barata, premium, divertida e séria): cada ligação fica mais fraca',
    'Pedir à agência apenas que o anúncio "emocione": diga qual objetivo do cliente a marca ajuda a cumprir, ou o resultado vira gente feliz genérica',
    'Escrever títulos e informações importantes todo em letras maiúsculas: fica mais difícil de ler de relance']);
  add('verificacoes', ['Lembrança da marca perguntada também por situação de uso ("para um almoço rápido, qual vem à cabeça?"), não só pela categoria',
    'Novidade anunciada na embalagem, na fachada ou no site é visível de relance; se não for, não espere efeito nas vendas']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['A marca foi redesenhada e os clientes deixaram de reconhecê-la', ['A marca é pouco lembrada', 'É difícil achar e comprar']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Rodada 43: aroma e música que combinam, preço que o cliente vê como justo e testes de design sem distorcer a escolha =====
// Fonte: manual acadêmico de psicologia do consumidor (47 capítulos de revisão; lidos os de sentidos, persuasão, associações, preço,
// preço justo, estética, marcas, ambiente e música). Aroma e música combinados no mesmo clima (agitado ou calmo) aumentaram avaliação,
// satisfação e intenção de visita; combinados de forma errada, efeito nulo ou negativo (estudos publicados em loja). Música que chama
// atenção para si atrapalha a lembrança da mensagem. Locução um pouco mais rápida e de tom grave gerou menos contra-argumentos e atitude
// melhor com a marca (estudo publicado). Preço justo: aumento por custo maior é aceito; por procura alta ou falta de oferta é visto como
// injusto (Kahneman, Knetsch e Thaler); preços diferentes para clientes parecidos sem motivo claro foram vistos como injustos por 71% a 94%
// mesmo quando sabiam da prática; regra de preço transparente aumenta a justiça percebida. Explicar em palavras por que gosta de um design
// muda a preferência e a afasta do comportamento real (Wilson e Schooler).
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'No espaço físico, escolher aroma e música que combinem entre si e com o que a marca vende (os dois calmos ou os dois animados)', esforco: 'marca', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Estudos publicados em lojas mostraram que aroma e música no mesmo clima aumentaram a avaliação da loja, a satisfação e a vontade de voltar. Quando não combinavam (aroma calmo com música agitada, por exemplo), o efeito sumiu ou piorou. Aroma ligado à categoria também fez as pessoas prestarem mais atenção às marcas.',
      metrica: 'Aroma e música escolhidos juntos e avaliação do espaço pelos clientes', passos: ['Definir o clima que a marca quer no espaço: calmo e acolhedor ou animado e energético', 'Escolher um aroma e uma seleção de músicas com esse mesmo clima e ligados ao que a empresa vende', 'Manter a música em volume baixo, sem chamar atenção para si', 'Perguntar a 10 clientes como se sentiram no espaço antes e depois da mudança', 'Manter a combinação por meses para virar parte da marca'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });

  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Subir o preço porque a procura aumentou ou faltam concorrentes: o cliente vê como injusto; aumento por custo maior é aceito',
    'Cobrar preços diferentes de clientes parecidos sem uma regra clara: mesmo quem sabe da prática acha injusto',
    'Ao testar logo, embalagem, fachada ou anúncio, pedir que as pessoas expliquem por que gostam antes de escolher: explicar muda a preferência; peça a escolha primeiro',
    'Usar no anúncio uma música que chama mais atenção que a mensagem: ela atrapalha a lembrança do que foi dito']);
  add('verificacoes', ['Regra de preço que o cliente entende: ele sabe por que paga o que paga e por que outro pode pagar diferente',
    'Locução dos anúncios firme e num ritmo um pouco mais rápido que o normal, sem pausas longas']);

  if (P.causas && P.desafios) {
    const D = (ini) => (P.desafios.find((d) => d.texto.startsWith(ini)) || {}).texto;
    [['Os clientes acham o preço injusto: não entendem por que pagam o que pagam', ['A marca é vista como a mais cara', 'A proposta começa pelo preço']],
    ].forEach(([t, ds]) => { if (!P.causas.some((c) => c.texto === t)) P.causas.push({ grupo: G, texto: t, desafios: ds.map(D).filter(Boolean) }); });
  }
})();

// ===== Diagnóstico "em uma frase" reescrito como o que foi observado (sinais concretos), para não repetir o desafio da Estratégia =====
// O diagnóstico descreve o que se via; o desafio nomeia o obstáculo. As frases antigas continuam valendo para quem já as escolheu.
(function () {
  const P = window.GangPresets; if (!P || !P.resumosDiagnostico || !P.resumoDesafios) return;
  [
    ['A marca entregava o básico que o setor exige', 'Os clientes diziam que o serviço era bom, mas não sabiam dizer o que a empresa tinha de diferente, e a maioria comparava orçamentos só pelo valor.'],
    ['A marca era bem avaliada por quem já era cliente', 'Quase todos os clientes novos vinham de quem já conhecia a empresa; fora desse círculo, pouca gente tinha ouvido falar dela.'],
    ['A qualidade do trabalho era alta, mas não aparecia', 'O trabalho entregue era elogiado, mas o site, as redes e as propostas não mostravam nenhum resultado, caso ou número.'],
    ['A marca era conhecida, mas parada no tempo', 'O visual e a forma de falar eram os mesmos de anos atrás, enquanto a empresa já oferecia serviços e atendia clientes bem diferentes.'],
    ['Cada canal falava de um jeito', 'Cada canal usava cores, versões do logo e mensagens diferentes, e os clientes não ligavam as peças à mesma empresa.'],
    ['A empresa dependia quase só de indicação', 'Quase todos os clientes chegavam por indicação, e os meses sem indicações eram meses sem vendas novas.'],
    ['A marca tentava atender todo tipo de cliente', 'A empresa aceitava qualquer tipo de cliente e de pedido, e a comunicação falava com todos sem citar ninguém em especial.'],
    ['A promessa da venda era boa, mas a entrega variava', 'As reclamações mudavam conforme quem atendia: o mesmo serviço saía ótimo com uma pessoa e fraco com outra.'],
    ['A marca aparecia pouco nos momentos', 'Quem procurava o serviço na hora da necessidade encontrava primeiro os concorrentes; a empresa só aparecia para quem já a conhecia.'],
    ['Os clientes compravam uma vez e não voltavam', 'A maior parte dos clientes fazia uma única compra, e a empresa não tinha nenhum contato com eles depois da entrega.'],
    ['A marca era difícil de achar e de comprar', 'Os contatos chegavam por canais espalhados e sem resposta rápida, e parte de quem procurava desistia antes de conseguir falar com a empresa.'],
    ['A comunicação vinha em campanhas soltas', 'A empresa anunciava em campanhas curtas com meses de silêncio entre elas, e os pedidos subiam e caíam junto.'],
    ['A empresa investia só em ofertas', 'Quase toda a comunicação eram ofertas do mês; quando as promoções paravam, as vendas paravam junto.'],
    ['O cliente esperava uma coisa e recebia outra', 'Depois da compra apareciam queixas de que o serviço não era o que a propaganda tinha mostrado.'],
    ['As empresas da categoria pareciam todas iguais', 'Os sites, as fotos e as promessas das empresas do setor eram quase idênticos, e os da empresa também.'],
    ['O maior concorrente da marca não era outra empresa', 'Muitos que precisavam do serviço resolviam sozinhos ou deixavam para depois, e a comunicação nunca falava com eles.'],
    ['O cliente comparava a marca com as empresas erradas', 'Nos orçamentos, o cliente colocava a empresa ao lado de opções mais simples e baratas, que não faziam o mesmo trabalho.'],
    ['A marca não tinha sinais próprios', 'Sem o nome escrito, ninguém reconhecia uma peça da empresa: não havia cor, símbolo ou frase que fosse só dela.'],
    ['A marca era vista como a opção barata', 'Os clientes escolhiam a empresa por ser a mais em conta e reagiam mal a qualquer aumento, mesmo elogiando o resultado.'],
    ['A marca cobrava como as melhores, mas não mostrava', 'O preço estava entre os mais altos do setor, mas nada na proposta explicava a diferença, e muitos sumiam depois do orçamento.'],
    ['A maior parte do faturamento vinha de poucos clientes', 'Dois ou três clientes respondiam pela maior parte do faturamento, e a saída de um deles derrubava o mês.'],
    ['A empresa fazia tudo do jeito de sempre', 'Os canais, o processo de venda e a comunicação eram os mesmos de muitos anos, enquanto os clientes já pesquisavam e compravam de outro jeito.'],
    ['A marca era conhecida pelo dono', 'Os clientes ligavam pedindo pelo dono e confiavam no que ele dizia, mais do que no nome da empresa.'],
    ['A empresa tinha clientes satisfeitos, mas nenhum processo', 'Os clientes diziam estar satisfeitos, mas quase nenhum indicava a empresa, porque ninguém pedia.'],
    ['Quem decidia a compra não era quem usava', 'Quem usava o serviço gostava dele, mas quem aprovava a compra recebia outras informações e decidia pelo preço.'],
    ['A marca era bonita, mas não dizia o que a empresa fazia', 'As peças chamavam atenção e recebiam elogios, mas as pessoas não sabiam dizer o que a empresa fazia.'],
    ['A equipe de vendas e a comunicação diziam coisas diferentes', 'O que o vendedor dizia não batia com o site e as redes, e os clientes chegavam com dúvidas sobre qual versão valia.'],
    ['A empresa era nova e sem histórico', 'Com pouco tempo de mercado e sem casos para mostrar, a empresa perdia para nomes conhecidos mesmo cobrando menos.'],
    ['O maior concorrente da marca era a não compra', 'A maior parte das pessoas que poderiam contratar ainda não estava procurando, e nenhuma ação da empresa chegava até elas.'],
    ['A marca não tinha opinião', 'A empresa nunca se posicionava sobre nada do setor, e seus textos poderiam ser assinados por qualquer concorrente.'],
    ['A empresa vendia o serviço, mas o cliente comprava o alívio', 'A comunicação descrevia etapas e técnicas, enquanto os clientes, ao contratar, falavam do problema que queriam tirar da frente.'],
    ['A marca era competente, mas fria', 'Os clientes confiavam no trabalho, mas descreviam o contato com a empresa como distante e burocrático.'],
    ['O preço era calculado pelo custo', 'O preço era montado somando custos e uma margem, sem levar em conta quanto o cliente ganhava com o resultado.'],
    ['Um único preço para todos', 'Havia um só preço e uma só oferta: quem queria mais não tinha opção, e quem podia menos ia embora.'],
    ['O esforço de comunicação estava espalhado', 'A verba e o tempo estavam divididos em muitos canais, e em nenhum deles a empresa aparecia com frequência.'],
    ['Nada prendia o cliente à marca', 'Muitos clientes saíam na primeira oferta de outro fornecedor, e nada na relação os fazia pensar duas vezes.'],
    ['A marca falava só com quem já estava procurando', 'Toda a comunicação estava no momento da busca, e quem só ia precisar nos meses seguintes nunca tinha contato com a empresa.'],
  ].forEach(([velha, nova]) => {
    const r = P.resumosDiagnostico.find((x) => x.texto.startsWith(velha));
    const m = P.resumoDesafios.find(([ini]) => ini === velha);
    if (r) r.texto = nova;
    if (m && !P.resumoDesafios.some(([ini]) => ini === nova)) P.resumoDesafios.push([nova, m[1]]);
  });
})();

// ===== Rodada 44: o teste mais duro da lealdade e respostas de clientes separadas das de não clientes =====
// Fonte: manual de métricas de marketing de professores de escolas de negócios (2ª ed. em português e 1ª ed. em inglês).
// "Disposição para procurar": parte dos clientes que adiaria a compra, mudaria de loja ou compraria menos para não trocar de marca,
// chamada de teste ácido da lealdade; lealdade de comportamento pode ser só inércia ou hábito. Em pesquisas de conhecimento, atitude
// e uso, separar as respostas de clientes e de não clientes, que podem ser muito diferentes.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Perguntar aos clientes o que fariam se a empresa não pudesse atendê-los agora: esperar, procurar outro jeito de contratar a empresa ou ir para um concorrente', esforco: 'marca', promessa: 'valor', tema: 'medicao', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Essa pergunta é chamada de teste mais duro da lealdade: mostra quantos clientes preferem esperar ou se esforçar a trocar de marca. Comprar sempre da mesma empresa pode ser só hábito ou comodidade; quem aceita esperar tem um apego real, e essa parte tende a sustentar preço e indicação.',
      metrica: 'Parte dos clientes que esperaria ou procuraria a empresa em vez de ir a um concorrente', passos: ['Escolher 20 clientes ativos', 'Perguntar: se não pudéssemos atender você nas próximas semanas, o que faria? (esperaria, procuraria outro jeito de contratar a empresa, iria para outra empresa)', 'Contar a parte de cada resposta', 'Perguntar a quem iria embora o que faria esperar valer a pena', 'Repetir a cada semestre e acompanhar a parte que esperaria'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('verificacoes', ['Nas pesquisas de marca, as respostas de clientes e de quem ainda não é cliente são lidas separadas']);
})();

// ===== Rodada 45: mudar a peça antes de pôr mais verba, promoção que ensina a esperar desconto e saída gradual das promoções =====
// Fontes: livro acadêmico sobre a história da ciência do marketing (capítulos de publicidade e de promoções, com centenas de
// experimentos de mercado publicados) e livro de um prêmio Nobel de economia comportamental. Em 120 testes de mercado, mudar a peça
// alterou as vendas em 47% dos casos e mudar a verba em 30%; em 19 experimentos de uma marca de sopas, mudar a verba quase não mexeu
// nas vendas, enquanto mudar texto, mídia e público mexeu; quando as vendas subiram, subiram logo no começo. Em mais de 8 anos de dados,
// a publicidade reduziu e as promoções aumentaram a sensibilidade dos clientes a preço e a promoção (estudo publicado). Em 72 anúncios
// usados em 23 mercados, argumentos e especialistas funcionaram mais em mercados novos e emoção em mercados antigos (estudo publicado).
// Duas lojas de departamento cortaram de uma vez os cupons a que os clientes estavam acostumados e as vendas despencaram; os cupons voltaram.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Antes de pôr mais verba num anúncio, testar outra peça ou mensagem; se a peça não mostrar efeito nas primeiras semanas, trocá-la em vez de aumentar a verba', esforco: 'marca', promessa: 'vendas', tema: 'anuncio', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Em centenas de experimentos de mercado publicados, mudar a peça ou a mensagem mexeu nas vendas com mais frequência do que mudar a verba: em 120 testes, a troca de peça alterou as vendas em quase metade dos casos, e a de verba em menos de um terço. Quando as vendas subiram, subiram logo no começo, e não depois de muita repetição.',
      metrica: 'Peças trocadas por falta de efeito antes de qualquer aumento de verba', passos: ['Definir o sinal de efeito do anúncio (pedidos, buscas pelo nome, visitas) e medir antes de começar', 'Rodar a peça por algumas semanas com a verba atual', 'Se o sinal não subir, trocar a peça ou a mensagem, mantendo a verba', 'Comparar duas peças lado a lado quando possível', 'Só aumentar a verba de uma peça que já mostrou efeito'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Trocar anúncios de marca por promoções de preço: com o tempo, a publicidade deixa o cliente menos sensível a preço e a promoção o deixa mais',
    'Cortar de uma vez todas as promoções a que o cliente se acostumou: reduza aos poucos, mostrando o valor, ou as vendas despencam']);
  add('verificacoes', ['Em mercado novo para a categoria, anúncios com argumentos e especialistas; em mercado já conhecido, mais emoção']);
})();

// ===== Setores das ações gerais: as de venda consultiva (reunião, proposta, orçamento, quem decide) não entram no plano de varejo =====
// Pedido do usuário: cada setor deve ter um plano próprio. Os modelos específicos herdam do setor-base (saúde, beleza e educação = serviços;
// alimentação e loja online = varejo; tecnologia = B2B), então basta marcar com os setores-base.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const CONSULTIVA = ['servicos', 'b2b'];
  const SO_B2B = ['b2b'];
  [
    ['Antes de cada reunião com cliente, escrever 3 hipóteses', CONSULTIVA],
    ['Calcular com o cliente, na primeira reunião, quanto o problema custa', CONSULTIVA],
    ['Combinar com o cliente o acompanhamento depois da proposta', CONSULTIVA],
    ['Dar a quem usa o serviço um resumo simples do resultado', SO_B2B],
    ['Dar um nome próprio ao método ou ao serviço principal', CONSULTIVA],
    ['Escrever uma página para cada serviço usando o nome que o cliente digita', CONSULTIVA],
    ['Identificar se o cliente compra por preço, por valor ou por relação', CONSULTIVA],
    ['Mandar ao cliente, no mesmo dia, um resumo escrito de cada reunião', CONSULTIVA],
    ['Medir quantos orçamentos viram venda', CONSULTIVA],
    ['Ouvir quem usa o serviço no dia a dia e levar o que ele pede para a conversa com quem decide', SO_B2B],
    ['Preparar uma ideia que ensine algo novo ao cliente sobre o negócio dele', SO_B2B],
    ['Refazer a tabela de preços a partir do valor que cada serviço gera', CONSULTIVA],
    ['Reescrever o modelo de proposta', CONSULTIVA],
    ['Pedir indicações de forma direta, dizendo que tipo de cliente a empresa procura', CONSULTIVA],
    ['Listar os 10 melhores clientes (compraram rápido, pagaram sem negociar, indicaram)', CONSULTIVA],
    ['Escrever o perfil do cliente ideal e os sinais de quem não é cliente', CONSULTIVA],
    ['No espaço físico, escolher aroma e música', ['varejo', 'servicos']],
  ].forEach(([ini, st]) => { P.acoes.filter((a) => a.texto.startsWith(ini) && !a.setores).forEach((a) => { a.setores = st.slice(); }); });
})();

// ===== Rodada 46: promoção sem desconto, serviço novo com regra de parada, clientes à frente do mercado, remarketing e segmentação =====
// Fonte: livro acadêmico sobre a história da ciência do marketing, capítulos de promoções de vendas, relacionamento com o cliente,
// segmentação e novos produtos (leitura completa). Destaque e exposição sem desconto: aumento menor, mas com margem cheia, e não reduzem a
// fidelidade; amostras grátis a aumentam; promoção de preço baixa o preço de referência e a recompra a preço cheio (estudos publicados).
// Em 23 milhões de promoções de uma rede, menos da metade deu lucro, e o que aumenta vendas tende a reduzir o lucro (estudo publicado).
// Brinde de pouco valor pode reduzir a compra. Promoção só para quem é de outra marca gera ciúme nos fiéis. Projetos com clientes à frente
// do mercado (usuários líderes) venderam 8 vezes mais numa grande empresa industrial (estudo publicado). Gestores mantêm produto novo fadado
// ao fracasso; uma regra de interrupção combinada antes reduz o problema. Vantagem de ser o primeiro é superestimada (viés de sobrevivência).
// Remarketing logo depois da visita teve efeito negativo; de 1 a 3 dias depois, positivo. E-mail com o nome da pessoa teve mais aberturas.
// Segmentos por idade e renda mostram pouca diferença de compra; o benefício buscado é a base preferida.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Trocar parte dos descontos por destaque sem desconto (vitrine, topo do site, amostra ou experimentação) e comparar o lucro das duas formas', esforco: 'venda', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Estudos publicados mostram que o destaque sem desconto vende um pouco menos, mas com a margem cheia, e não enfraquece a marca. Já a promoção de preço baixa o preço que o cliente espera pagar e reduz a recompra a preço cheio. Amostras e experimentação chegaram a aumentar a fidelidade.',
      metrica: 'Lucro do período com destaque sem desconto comparado ao período com desconto', passos: ['Escolher um produto ou serviço que hoje costuma entrar em desconto', 'Num período, dar destaque sem baixar o preço: vitrine, topo do site e das redes, amostra ou experimentação', 'Em outro período parecido, fazer o desconto de sempre', 'Comparar o lucro (não só as vendas) dos dois períodos', 'Manter a forma que deu mais lucro'] },
    { texto: 'Antes de lançar um serviço ou produto novo, combinar por escrito quantas vendas ele precisa ter em 3 a 6 meses para continuar', esforco: 'marca', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Até 9 em cada 10 novidades fracassam, e estudos publicados mostram que os gestores tendem a manter o que não está funcionando, porque já investiram. Uma regra de interrupção combinada antes, ou alguém de fora para decidir, reduz esse viés e libera verba e atenção para o que funciona.',
      metrica: 'Novidades lançadas com meta mínima e prazo combinados antes', passos: ['Escrever a meta mínima de vendas e o prazo antes do lançamento', 'Definir quem decide se o número não for atingido (de preferência alguém que não criou a novidade)', 'Acompanhar mês a mês', 'No prazo, manter, ajustar uma vez ou encerrar, como combinado', 'Registrar o que se aprendeu para a próxima novidade'] },
    { texto: 'Convidar 3 a 5 clientes que já pedem coisas à frente do mercado para testar e ajudar a desenhar um serviço novo antes do lançamento', esforco: 'marca', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'M', ler: 60,
      porque: 'Clientes com necessidades à frente do mercado (os que pedem o que ninguém pede, ou já improvisam uma solução) enxergam antes o que os outros vão querer. Numa grande empresa industrial, os projetos feitos com eles venderam 8 vezes mais que os feitos do jeito tradicional (estudo publicado). Eles também tendem a comprar e indicar logo no lançamento.',
      metrica: 'Serviços novos testados com clientes à frente do mercado antes de lançar', passos: ['Listar clientes que pedem adaptações, usam o serviço de um jeito diferente ou improvisam soluções', 'Convidar 3 a 5 deles para uma conversa sobre o serviço novo', 'Mostrar uma versão simples e ouvir o que mudariam', 'Deixar que usem antes do lançamento', 'Usar os relatos deles na comunicação do lançamento, com autorização'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Avaliar uma promoção só pelo aumento de vendas: menos da metade das promoções dá lucro, e o que mais aumenta as vendas costuma reduzir o lucro',
    'Dar brinde de pouco valor para incentivar a compra: brinde sem valor pode afastar o cliente em vez de atrair',
    'Dar ofertas só para quem compra de outra marca e esquecer os clientes fiéis: eles se sentem traídos',
    'Correr para ser o primeiro com uma novidade achando que isso garante a liderança: a vantagem de quem chega primeiro é bem menor do que parece']);
  add('verificacoes', ['Anúncio de remarketing aparece de 1 a 3 dias depois da visita, e não logo em seguida',
    'E-mails e mensagens para clientes usam o nome da pessoa',
    'Grupos de clientes definidos pelo benefício que buscam, e não só por idade, renda ou região']);
})();

// ===== Rodada 47: mudança grande por etapas, opção de comparação na tabela, pergunta de intenção, testes confiáveis =====
// Fontes: livro técnico sobre experimentos controlados em empresas digitais (caps. 12 a 22, leitura completa) e manual acadêmico de
// psicologia do consumidor (caps. de tomada de decisão e de escolha guiada por objetivos, leitura completa). Mudanças grandes vão primeiro
// a um grupo pequeno e são ampliadas por etapas. Ganho num grupo pequeno precisa ser diluído pelo peso dele no total. Clientes muito
// grandes podem inverter um resultado. Ofertas testadas não podem aparecer antes do ponto do teste. Grupos que dividem a mesma verba
// interferem um no outro. Comparar dois grupos iguais revela se o método está errado (~6% dos testes numa grande empresa tinham grupos
// desbalanceados). Pôr ao lado de uma opção outra parecida e claramente pior aumenta a escolha da primeira (estudos publicados). Trocas
// difíceis e carregadas de emoção levam o cliente a adiar ou ficar com o que já tem (estudos publicados). Perguntar a intenção de escolher
// uma marca bem avaliada aumentou a escolha real dela (estudo publicado).
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Fazer uma mudança grande (preço, nome, forma de atender) primeiro com uma parte dos clientes e só ampliar se os números se mantiverem', esforco: 'marca', promessa: 'vendas', tema: 'medicao', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Empresas que testam muito começam mudanças grandes por um grupo pequeno e ampliam por etapas, olhando a cada etapa se nada importante piorou. Assim um erro atinge poucos clientes e pode ser desfeito antes de virar prejuízo para a marca.',
      metrica: 'Mudanças grandes feitas por etapas, com números conferidos antes de ampliar', passos: ['Escolher a mudança e os números que não podem piorar (vendas, reclamações, cancelamentos)', 'Aplicar primeiro numa parte dos clientes, numa unidade ou num canal', 'Comparar com quem ainda não recebeu a mudança por pelo menos uma semana inteira', 'Ampliar só se os números se mantiverem; se piorarem, voltar atrás', 'Registrar o que se aprendeu em cada etapa'] },
    { texto: 'Na tabela de preços, pôr ao lado do pacote que a marca quer vender uma opção parecida e claramente menos vantajosa', esforco: 'venda', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'P', ler: 30,
      porque: 'Estudos publicados mostram que acrescentar uma opção parecida, mas pior em tudo, aumenta a escolha da opção que ela faz parecer melhor. A comparação dá ao cliente uma razão fácil para decidir e justificar a escolha.',
      metrica: 'Parte dos clientes que escolhe o pacote principal, antes e depois', passos: ['Escolher o pacote que a marca quer que mais gente escolha', 'Criar ao lado uma opção parecida, com preço próximo e claramente menos vantajosa', 'Manter as opções reais e honestas: a menos vantajosa precisa poder ser comprada', 'Comparar a escolha do pacote principal antes e depois por um mês'] },
    { texto: 'Perguntar a clientes satisfeitos, no fim do atendimento, se pretendem voltar ou indicar a empresa', esforco: 'venda', promessa: 'vendas', tema: 'relacao', tipo: 'base', tam: 'P', ler: 30,
      porque: 'Um estudo publicado mostrou que perguntar às pessoas se pretendiam escolher uma marca de que gostavam aumentou a escolha real dessa marca. Dizer a intenção em voz alta reforça o compromisso de quem já está satisfeito. Funciona quando a pergunta soa natural: quando o cliente a percebe como tática de venda, o efeito some ou se inverte (estudo publicado).',
      metrica: 'Recompra e indicações de quem respondeu à pergunta comparadas às de quem não respondeu', passos: ['Escolher o momento: fim do atendimento ou da entrega, com o cliente satisfeito', 'Fazer uma pergunta simples: pretende voltar? indicaria a alguém?', 'Anotar a resposta junto ao cadastro', 'Comparar recompra e indicações de quem respondeu e de quem não respondeu'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Deixar o cliente pesar sozinho prós e contras difíceis (saúde, segurança, muito dinheiro): diante de trocas difíceis ele adia ou fica com o que já tem',
    'Comparar dois anúncios ou ofertas que gastam da mesma verba sem separar o orçamento: o que gasta mais rápido parece melhor',
    'Comemorar o ganho de um grupo pequeno de clientes como se fosse da empresa toda: o ganho precisa ser medido pelo peso desse grupo nas vendas']);
  add('verificacoes', ['Clientes muito grandes olhados à parte no resultado de um teste, para não inverterem a conclusão',
    'Nenhuma das ofertas testadas anunciada antes do ponto em que o teste acontece',
    'Antes de confiar num jeito de testar, comparar dois grupos que receberam a mesma coisa: se der diferença, o método está errado']);
})();

// ===== Rodada 48: experiência que melhora com o tempo, espera aproveitada, uso de planos pagos de uma vez, catálogo organizado =====
// Fonte: manual acadêmico de psicologia do consumidor, capítulos de felicidade no consumo, preço e contabilidade mental (início) e
// variedade de produtos (leitura completa). As pessoas se adaptam ao que é constante e reagem às mudanças; preferem sequências que
// melhoram; experiências quase sempre boas, com quedas raras, agradam mais que o contrário (estudos publicados). A espera traz prazer
// de antecipação, maior quando a pessoa conhece ou imagina bem a experiência (estudo publicado). Em academias, quem pagava por mês
// usava de forma constante; quem pagava de uma vez usava cada vez menos até o pagamento seguinte (estudo publicado). Escolhas comparadas
// lado a lado valorizam diferenças que pouco mudam a experiência no uso. Descontos têm um mínimo para serem notados e um ponto de
// saturação (estudo publicado). Exposição organizada aumentou a variedade percebida e o consumo (de 12,7 para 28,3 itens); cortar 50%
// dos itens de categorias fortes não mudou a variedade percebida e facilitou a compra; uma marca que passou de 1 para 5 versões
// diferentes em coisas não comparáveis caiu de 53% para 40% de participação (estudos publicados).
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Organizar pacotes, sessões ou etapas do serviço para que a experiência melhore ao longo do tempo, deixando um ponto alto para o fim', esforco: 'marca', promessa: 'valor', tema: 'experiencia', tipo: 'base', tam: 'P', ler: 60, setores: ['servicos'],
      porque: 'As pessoas se acostumam com o que é constante e reagem às mudanças. Estudos publicados mostram que elas preferem sequências que melhoram e que experiências quase sempre boas, com poucas quedas, agradam mais que experiências comuns com raros momentos especiais.',
      metrica: 'Satisfação no fim do pacote e recompra de quem completou', passos: ['Desenhar as etapas do pacote ou do serviço na ordem em que o cliente passa', 'Garantir que nenhuma etapa fique abaixo do padrão da marca', 'Guardar um ponto alto para o fim (resultado mostrado, brinde útil, conversa de fechamento)', 'Perguntar a satisfação no fim e comparar com o desenho anterior'] },
    { texto: 'Entre a compra e o atendimento, mandar ao cliente o que vai acontecer, com fotos ou vídeo, para ele aproveitar a espera', esforco: 'marca', promessa: 'valor', tema: 'relacao', tipo: 'base', tam: 'P', ler: 30,
      porque: 'A espera também dá prazer: imaginar a experiência faz parte do valor da compra. Um estudo publicado mostrou que esse prazer é maior quando a pessoa conhece ou consegue imaginar bem o que vai viver; sem isso, a espera vira ansiedade.',
      metrica: 'Faltas, cancelamentos e dúvidas antes do atendimento, antes e depois', passos: ['Escolher o momento entre a compra e o atendimento ou a entrega', 'Preparar uma mensagem curta com o que vai acontecer, passo a passo', 'Incluir fotos ou vídeo do lugar, da equipe ou do resultado', 'Enviar logo após a compra e perto da data', 'Comparar faltas, cancelamentos e dúvidas antes e depois'] },
    { texto: 'Em planos e pacotes pagos de uma vez, lembrar o cliente de usar e marcar os próximos usos ao longo de todo o período', esforco: 'venda', promessa: 'vendas', tema: 'relacao', tipo: 'base', tam: 'P', ler: 60, setores: ['servicos'],
      porque: 'Num estudo publicado com academias, quem pagava por mês usava de forma constante; quem pagava de uma vez usava cada vez menos à medida que o pagamento ficava distante. Quem deixa de usar sente menos o valor do que comprou na hora de renovar.',
      metrica: 'Uso mês a mês de quem pagou de uma vez e renovação no fim do período', passos: ['Listar quem pagou plano anual, semestral ou pacote de sessões', 'Acompanhar o uso mês a mês', 'Mandar lembrete com o que o cliente ainda tem direito, sem tom de cobrança', 'Oferecer horário para o próximo uso', 'Comparar a renovação de quem usou com a de quem não usou'] },
    { texto: 'Organizar o cardápio, o catálogo ou a vitrine por tipo, uso ou ocasião, em vez de uma lista corrida', esforco: 'venda', promessa: 'vendas', tema: 'experiencia', tipo: 'base', tam: 'P', ler: 60, setores: ['varejo'],
      porque: 'Estudos publicados mostram que a mesma variedade, quando organizada, parece maior e facilita a escolha: com a exposição organizada, o consumo subiu de 12,7 para 28,3 itens. Desorganizada, a variedade extra não fez diferença.',
      metrica: 'Itens por pedido e tempo até a escolha, antes e depois', passos: ['Agrupar os itens por tipo, uso ou ocasião, do jeito que o cliente pensa', 'Dar um título claro a cada grupo', 'Pôr os mais procurados no começo de cada grupo', 'Aplicar no cardápio, no site e na loja', 'Comparar itens por pedido antes e depois'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Fazer um atendimento comum na maior parte das vezes e caprichar só de vez em quando: experiências quase sempre boas, com quedas raras, agradam mais',
    'Vender só pelas diferenças que aparecem na comparação lado a lado (tamanho, quantidade, potência) e que o cliente pouco sente no uso',
    'Dar descontos pequenos demais para serem notados ou grandes demais sem ganho a mais: a resposta ao desconto tem um mínimo e um teto',
    'Lançar várias versões de um produto que diferem em coisas difíceis de comparar entre si: uma marca perdeu participação (de 53% para 40%) ao fazer isso']);
  add('verificacoes', ['Ao reduzir a linha ou o cardápio, os itens favoritos dos clientes continuam disponíveis',
    'Clientes de planos pagos de uma vez acompanhados no uso mês a mês']);
})();

// ===== Rodada 49: avaliações online, emoção que faz compartilhar, comentários por rede, compras B2B, excesso de funções =====
// Fonte: livro acadêmico sobre a história da ciência do marketing, capítulos de valor da marca, internet como meio social, marketing de
// serviços e compra organizacional (leitura completa). Quem avalia por conta própria e com frequência dá notas mais baixas; quem está
// satisfeito e pouco envolvido tende a não avaliar (estudo publicado). Avaliações negativas pesam mais nas vendas que as positivas.
// Conteúdo com emoção de alta ativação (surpresa, entusiasmo, admiração, também raiva) é mais compartilhado (estudo publicado). O que
// se diz da marca muda conforme a rede; comparar dentro da mesma rede ao longo do tempo antecipou pesquisas de marca (estudo publicado).
// O alcance de uma cascata depende mais da receptividade do público que de um influenciador especial (estudo publicado). Em compras de
// empresas, uma só pessoa representa bem a decisão só nas recompras de rotina (estudo publicado). Funções demais atraem na compra e
// cansam no uso (estudo publicado). Capítulo de valor da marca: credibilidade, garantia e extensões já estavam na biblioteca.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Encher o serviço de opcionais e funções porque o cliente gosta deles na hora de comprar: no uso, o excesso cansa e reduz a satisfação',
    'Contar com um único influenciador "especial" para espalhar a marca: o alcance depende mais de quão receptivo é o público do que de quem começa']);
  add('verificacoes', ['Avaliações pedidas a todos os clientes atendidos, não só aos que se oferecem: quem avalia por conta própria costuma dar notas mais baixas',
    'Comentários sobre a marca comparados dentro da mesma rede ao longo do tempo, sem misturar redes diferentes',
    'Posts feitos para serem compartilhados despertam emoção forte (surpresa, entusiasmo, admiração), e não só informam',
    'Em compras novas ou de valor alto, mais de uma pessoa da empresa cliente ouvida: uma pessoa só representa bem a empresa nas recompras de rotina']);
})();

// ===== Rodada 50: faixa de preço aceitável, preço testado com venda real, serviço novo por etapas, táticas que o cliente percebe =====
// Fontes: livro acadêmico sobre a história da ciência do marketing, capítulo de preço (leitura completa), e manual acadêmico de psicologia
// do consumidor, capítulos de preço, preço justo, imaginação, conhecimento de persuasão e categorias de marca (leitura completa).
// Perguntas hipotéticas superestimam quanto se pagaria (meta-análise de 77 estudos: viés médio de 21%); métodos com compra real erram
// bem menos. As quatro perguntas de faixa de preço (barato demais, barato, caro, caro demais) são o método mais usado na prática.
// Preço que muda com frequência aumentou a sensibilidade a preço (estudo publicado). Quando o cliente percebe segunda intenção (elogio
// exagerado, tática evidente), confia menos, paga menos e escolhe menos (vários estudos publicados). Números e comparações técnicas
// misturados a uma peça que pede para imaginar atrapalharam o efeito; pedir para imaginar sem detalhes concretos piorou a avaliação.
// Extensão que contradiz o atributo principal enfraqueceu a marca e a imagem dos produtos antigos; marcas que chegaram a categorias
// distantes por etapas foram mais aceitas; versão barata de marca de prestígio foi rejeitada pelos clientes atuais; parceria rende mais
// com marca complementar do que com marca só bem avaliada (estudos publicados).
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const NOVAS = [
    { texto: 'Medir a faixa de preço aceitável com 30 clientes ou interessados: a partir de quanto acham barato demais, barato, caro e caro demais', esforco: 'venda', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'P', ler: 60,
      porque: 'As quatro perguntas mostram de onde o preço parece suspeito de tão baixo até onde passa a afastar o cliente. É o método mais usado na prática para achar a faixa de preço. Como respostas hipotéticas costumam exagerar quanto a pessoa pagaria (em média 21% numa revisão de 77 estudos), o resultado serve de faixa, não de preço final.',
      metrica: 'Faixa de preço aceitável medida e comparada com o preço atual', passos: ['Escolher o serviço ou produto e quem vai responder (clientes e interessados)', 'Fazer as 4 perguntas: barato demais (desconfiaria da qualidade), barato, começa a ficar caro, caro demais', 'Juntar as respostas e ver onde a maioria aceita o preço', 'Comparar com o preço atual', 'Testar o novo preço com vendas reais antes de mudar a tabela inteira'] },
    { texto: 'Antes de fixar o preço de um serviço novo, vender de verdade a poucos clientes (pré-venda ou reserva com sinal) em vez de só perguntar quanto pagariam', esforco: 'venda', promessa: 'valor', tema: 'preco', tipo: 'base', tam: 'P', ler: 60,
      porque: 'Quem só responde quanto pagaria não arrisca nada e costuma exagerar. Nos estudos que compararam métodos, os que envolviam compra real erraram bem menos que as perguntas hipotéticas. Uma pré-venda mostra o preço que as pessoas aceitam de fato.',
      metrica: 'Reservas ou pré-vendas fechadas no preço testado', passos: ['Definir o preço a testar e um limite de vagas', 'Oferecer a poucos clientes, com reserva paga ou sinal', 'Contar quantos aceitaram e quantos desistiram no preço', 'Ajustar o preço antes de lançar para todos'] },
    { texto: 'Para chegar a um serviço bem diferente do atual, ir por etapas: primeiro um serviço vizinho, depois o mais distante, sempre com o mesmo nome', esforco: 'marca', promessa: 'valor', tema: 'posicionamento', tipo: 'base', tam: 'M', ler: 60,
      porque: 'O cliente aceita uma novidade da marca quando ela parece ter a ver com o que a marca já faz. Estudos publicados mostram que marcas que chegaram a categorias distantes passando por categorias intermediárias foram mais aceitas do que as que saltaram direto: cada etapa amplia o que o cliente acha que a marca sabe fazer.',
      metrica: 'Clientes atuais que compram o serviço novo', passos: ['Listar o que a marca já faz e o serviço distante que ela quer oferecer', 'Achar um serviço no meio do caminho, próximo do atual', 'Lançar primeiro o serviço vizinho e comunicar a ligação com o atual', 'Só então lançar o mais distante', 'Acompanhar se os clientes atuais compram cada novidade'] },
  ];
  NOVAS.forEach((x) => { if (!P.acoes.some((a) => a.texto === x.texto)) P.acoes.push({ grupo: G, ...x }); });
  if (P.metricasSucesso) NOVAS.forEach((x) => { if (!P.metricasSucesso.some((m) => m.texto === x.metrica)) P.metricasSucesso.push({ grupo: G, texto: x.metrica }); });
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Mudar o preço com frequência: preço que muda o tempo todo deixa o cliente mais sensível a preço',
    'Usar táticas que o cliente percebe como manobra (elogio exagerado, pressa forçada): quando ele vê segunda intenção, confia menos e paga menos',
    'Na peça que pede ao cliente para se imaginar usando o serviço, encher de números, notas ou comparações técnicas: isso atrapalha a imaginação e reduz o efeito',
    'Lançar com o mesmo nome um serviço que contradiz o que a marca tem de principal: isso enfraquece a marca e até a imagem dos serviços que já existem',
    'Lançar uma versão barata com o mesmo nome de uma marca de prestígio: os clientes atuais rejeitam; um nome derivado protege a marca']);
  add('verificacoes', ['Peças que pedem para o cliente se imaginar trazem detalhes concretos (fotos, cenas, palavras concretas): sem isso, pedir para imaginar piora a avaliação',
    'Marca parceira escolhida pelo que acrescenta à sua (o que ela tem e a sua não), e não só por ser conhecida']);
})();

// ===== Rodada 51: anúncios on-line medidos do jeito certo, informação que falta, pesquisa que prevê compra, causas com ligação =====
// Fontes: livro acadêmico sobre a história da ciência do marketing, capítulos de marketing na internet, canais e força de vendas, e
// manual acadêmico de psicologia do consumidor, capítulos de inferência e de atitudes e comportamento (leitura completa).
// Atribuir a venda toda ao último contato favorece canais baratos e frequentes e leva a anunciar demais (estudo publicado). Anúncios de
// busca nas primeiras posições tiveram mais cliques, mas os de posições abaixo converteram e deram mais lucro (estudo publicado). Remarketing
// com o produto exato não superou o genérico no começo da jornada; funcionou melhor quando a preferência já estava definida (estudo
// publicado). Em 15 campanhas numa grande rede social medidas com grupo de controle, só 8 aumentaram as vendas de forma clara. Produto sem
// informação sobre um atributo foi avaliado pior do que se o atributo fosse descrito como médio (vários estudos). Lembrar 1 motivo para
// gostar de uma marca gerou avaliação melhor que lembrar 10 (estudo publicado). Apoio a uma causa ligada ao negócio foi visto como
// sincero; sem ligação, como interesse próprio (estudo publicado). Intenção sobre a ação específica prevê o comportamento (correlação
// média 0,53); opinião geral prevê mal (meta-análises). Comissão aumentou a venda e fez a equipe largar tarefas sem comissão
// (experimento de campo de 3 anos).
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Dar todo o crédito da venda ao último contato (normalmente o e-mail ou a busca): isso infla os canais baratos e esconde o efeito dos anúncios que vieram antes',
    'Pagar sempre pela primeira posição nos anúncios de busca por palavras genéricas: posições um pouco abaixo trouxeram menos cliques, mas mais vendas e lucro',
    'Pedir ao cliente que liste muitos motivos para escolher a marca: ter dificuldade de lembrar tantos piora a avaliação; peça um ou dois',
    'Pagar a equipe só por comissão de venda sem acompanhar o atendimento: a comissão aumenta a venda e faz a equipe largar o que não dá comissão, como o pós-venda']);
  add('verificacoes', ['Remarketing com o serviço exato só para quem já comparou opções; para quem só visitou uma vez, anúncio geral da marca funciona igual ou melhor',
    'Resultado dos anúncios nas redes comparado com um período ou grupo sem anúncio: em 15 campanhas estudadas assim, só 8 aumentaram as vendas',
    'Site, anúncios e proposta trazem o que o cliente procura (preço ou faixa, prazo, garantia): informação que falta é lida como ponto fraco',
    'Causa ou projeto apoiado pela marca tem ligação com o que a empresa faz: com ligação, o apoio parece sincero; sem ela, parece interesse próprio',
    'Pesquisa com clientes pergunta sobre a ação específica (contratar este serviço nos próximos 3 meses), e não só a opinião geral sobre a marca']);
})();

// ===== Rodada 52: mídia (segmentação estreita, rajadas, espaçamento e visualização real dos anúncios on-line) =====
// Fonte: livro-texto de marketing baseado em evidências de um instituto de pesquisa de crescimento de marcas, capítulo de decisões de mídia
// (segunda metade das páginas, agora lida inteira; capítulos de plano de marketing e do papel do marketing lidos inteiros, sem itens novos).
// O maior anunciante do mundo admitiu ter segmentado demais nas redes e voltou a priorizar alcance; aceitar algum desperdício costuma ser
// mais barato por pessoa alcançada do que pagar por mídia estreita. Não há evidência empírica confiável de que exista um peso mínimo de
// anúncio por semana para a propaganda funcionar. Intervalos maiores entre exposições melhoraram a memória em até 20%. Só cerca de metade dos
// anúncios gráficos entregues chegou a aparecer na tela (relatório de 2014 de um grande vendedor de anúncios, com critério generoso);
// "visualização" de vídeo nas redes contava 3 segundos visíveis, e números de visualização chegaram a ser superestimados em até 80%.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Segmentar os anúncios num público estreito demais para "não desperdiçar": aceitar algum desperdício costuma sair mais barato por pessoa alcançada do que pagar por mídia muito segmentada',
    'Concentrar a verba em poucas semanas achando que o anúncio só funciona acima de um peso mínimo: não há evidência confiável de que esse limite exista']);
  add('verificacoes', ['Anúncios espaçados ao longo das semanas e em canais diferentes, e não amontoados: intervalos maiores entre exposições melhoraram a memória em até 20%',
    'Resultado dos anúncios on-line medido por quem viu o anúncio na tela, e não por impressões entregues: "visualização" de 3 segundos não é ver o anúncio, e só cerca de metade dos anúncios entregues chega a aparecer']);
})();

// ===== Rodada 53: mudar comportamento (não normalizar o que se quer evitar, facilitar a ação, medir o que o cliente faz) =====
// Fonte: livro-texto de marketing baseado em evidências de um instituto de pesquisa de crescimento de marcas, capítulo de marketing social
// (leitura completa). Campanhas que só informam tiveram eficácia limitada; o comportamento costuma vir antes da atitude, e atitudes
// explicaram no máximo 10% do comportamento em 21 países (estudo publicado). Mensagens que mostram o comportamento indesejado como comum
// podem estimulá-lo (estudo publicado sobre mensagens normativas). Comportamento declarado é impreciso: as pessoas relatam a mais o que é
// bem visto e a menos o que não é; a avaliação deve observar o comportamento real e comparar com antes e com um grupo não exposto.
(function () {
  const P = window.GangPresets; if (!P || !P.acoes) return;
  const G = 'Da biblioteca';
  const add = (k, itens) => { if (P[k]) itens.forEach((t) => { if (!P[k].some((y) => y.texto === t)) P[k].push({ grupo: G, texto: t }); }); };
  add('naoFazer', ['Pedir ao cliente que pare de fazer algo (faltar, atrasar, pedir desconto) dizendo que "muita gente faz isso": a mensagem mostra o comportamento como normal e pode estimulá-lo',
    'Fazer campanha só para informar ou mudar a opinião do cliente, sem facilitar a ação (agendar, comprar, experimentar): informação sozinha mudou pouco o comportamento, e a atitude costuma vir depois da ação']);
  add('verificacoes', ['Resultado medido pelo que o cliente fez (compras, agendamentos, retornos), e não só pelo que ele diz que fez: o comportamento declarado infla o que é bem visto']);
})();

// ===== Temas dos itens de "não fazer" e das verificações, e sugestão a partir da estratégia =====
// Cada item ganha os temas que o próprio texto deixa claros (regras abaixo); item sem tema claro não é sugerido.
// A sugestão olha os temas das ações da abordagem escolhida (só as que servem ao setor do cliente) e devolve os itens
// que mais combinam. É sugestão: o consultor confirma antes de qualquer coisa ir para o portal.
(function () {
  const P = window.GangPresets; if (!P) return;
  const REGRAS = [
    ['preco', /preço|preços|desconto|promoç|brinde|oferta|margem|vale o que custa|ticket médio/i],
    ['anuncio', /anúncio|campanha|verba|mídia|canais pagos|patrocínio|remarketing|influenciador|segmentar|locução|publicidade|imprensa/i],
    ['medicao', /medir|medid|teste|testad|pesquisa|retorno|estimativ|avaliação completa|creditar|crédito da venda|conferid|acompanhad|contagem|taxa de|lembrança|busca pelo nome|origem dos clientes|comparad|resultado/i],
    ['posicionamento', /posicionamento|reposicion|diferencia|diferente das|estratégia|concorrente|fora do foco|todo tipo de cliente|muitos objetivos|frentes|mesmo nome|versões|prestígio|benefício que|o que a marca tem de principal/i],
    ['presenca', /identidade|logo|símbolo|tom de voz|banco de imagens|maiúsculas|embalagem|fachada|personagem|reconhec|de que marca é/i],
    ['relacao', /fiéis|fiel|quem já é cliente|já compra|recompra|reclamaç|avaliaç|comentários|indica|clientes perdidos|nome da pessoa|conversa mensal|planos pagos|cinco clientes/i],
    ['experiencia', /atendimento|prazo|entrega|operação|promessa|opcionais|cardápio|favoritos|imaginar|experiência/i],
    ['venda', /proposta|fechar|fechamento|orçamento|vender só|tempo de resposta|não fechou|comissão|manobra|pressa|prós e contras|compras novas/i],
    ['equipe', /equipe|comissão|capacidade/i],
    ['conteudo', /posts|redes|conteúdo|crise|compartilh|mostrar prova|sem mostrar prova/i],
  ];
  // o que está entre parênteses são exemplos, não o assunto do item: fica de fora da leitura
  const marca = (lista) => (lista || []).forEach((x) => { if (x && !x.temas) { const t = x.texto.replace(/\([^)]*\)/g, ''); x.temas = REGRAS.filter(([, r]) => r.test(t)).map(([n]) => n); } });
  marca(P.naoFazer); marca(P.verificacoes);
  const BASE = { saude: 'servicos', beleza: 'servicos', educacao: 'servicos', alimentacao: 'varejo', loja_online: 'varejo', tecnologia: 'b2b' };
  // pesos dos temas a partir das ações da abordagem (as que servem ao setor)
  const pesosDa = (abordagem, setor) => {
    const ab = (P.abordagens || []).find((a) => a.texto === abordagem && a.acoes); if (!ab) return null;
    const base = BASE[setor] || setor;
    const pesos = {};
    ab.acoes.forEach((t) => {
      const x = (P.acoes || []).find((y) => y.texto === t); if (!x || !x.tema) return;
      if (setor && x.setores && !x.setores.includes(setor) && !x.setores.includes(base)) return;
      pesos[x.tema] = (pesos[x.tema] || 0) + 1;
    });
    return Object.keys(pesos).length ? pesos : null;
  };
  // devolve os textos sugeridos, sem os que o cliente já tem
  P.sugereDaEstrategia = (lista, abordagem, setor, jaTem, quantos) => {
    const pesos = pesosDa(abordagem, setor); if (!pesos) return [];
    const ja = new Set(jaTem || []);
    // palavras da própria abordagem que o item repete (ex.: "especialista" × "especialização") contam a mais
    const raiz = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z]+/).filter((w) => w.length > 4).map((w) => w.slice(0, 6));
    const VAZ = new Set(['abrimo', 'vencen', 'client', 'empres', 'marcas', 'outras', 'outros', 'quando', 'mesmo', 'servic', 'categor']);
    const doAb = new Set(raiz(abordagem).filter((w) => !VAZ.has(w)));
    const extra = (t) => (lista === 'prioridades' || lista === 'condicoes' ? raiz(t).filter((w) => doAb.has(w)).length * 2 : 0); // só nas listas curtas de frases da estratégia
    return (P[lista] || []).filter((x) => x.temas && x.temas.length && !ja.has(x.texto))
      .map((x, i) => [x.texto, x.temas.reduce((s, t) => s + (pesos[t] || 0), 0) / Math.sqrt(x.temas.length) + extra(x.texto), i])
      .filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1] || b[2] - a[2]).slice(0, quantos || 5).map(([t]) => t);
  };
})();

// ===== Temas das prioridades e das condições, e a renúncia de cada abordagem =====
// Ligação feita item a item, pelo que cada texto diz. Assim "Onde atuamos" e "O que acompanhamos" também podem ser
// sugeridos pela estratégia (o consultor confirma). A renúncia vem do próprio texto da abordagem ("Abrimos mão de…").
(function () {
  const P = window.GangPresets; if (!P) return;
  const T = {
    'Clientes que valorizam qualidade acima de preço': ['preco', 'posicionamento'],
    'Empresas de médio porte da região': ['venda'],
    'O serviço principal, de maior margem': ['preco', 'posicionamento'],
    'Projetos completos com o método': ['posicionamento', 'venda'],
    'A região onde a marca já é conhecida': ['presenca', 'anuncio'],
    'Clientes que compram com frequência': ['relacao'],
    'Um nicho em que a empresa já tem casos de sucesso': ['posicionamento', 'conteudo'],
    'Clientes que chegam por indicação': ['relacao'],
    'Os canais que já trazem mais clientes': ['distribuicao', 'anuncio'],
    'Clientes que já compraram e podem voltar a comprar': ['relacao'],
    'Quem ainda não compra da categoria na região': ['anuncio', 'presenca'],
    'As situações de compra em que a marca é mais lembrada': ['presenca', 'anuncio'],
    'O serviço que traz o cliente para os outros': ['experiencia', 'venda'],
    'Empresas com quem já há relacionamento': ['relacao', 'venda'],
    'Os meses de maior procura da categoria': ['anuncio'],
    'Clientes que já sabem que precisam e só falta decidir': ['venda'],
    'Quem influencia a decisão (sócio, família, arquiteto, contador)': ['venda', 'relacao'],
    'Os clientes-alvo valorizam a especialização': ['posicionamento'],
    'Clientes de alto valor aceitam pagar mais pelo diferencial': ['preco', 'posicionamento'],
    'A equipe entrega a promessa em todo atendimento': ['experiencia', 'equipe'],
    'Os concorrentes não copiam o diferencial no curto prazo': ['posicionamento'],
    'O canal escolhido alcança o cliente-alvo': ['distribuicao', 'anuncio'],
    'A operação comporta o crescimento': ['experiencia'],
    'Existe um grupo grande o bastante de clientes com essa necessidade': ['posicionamento'],
    'Os clientes percebem a diferença e conseguem explicá-la': ['posicionamento', 'conteudo'],
    'O cliente decide por mais do que o preço': ['preco'],
    'Nenhum concorrente forte ocupa essa posição': ['posicionamento'],
    'Os concorrentes não conseguem responder só baixando o preço': ['preco'],
    'A empresa tem margem para investir em marca todo mês': ['anuncio'],
    'A equipe consegue manter o padrão de atendimento': ['experiencia', 'equipe'],
    'A empresa atende mais clientes sem perder qualidade': ['experiencia'],
    'O cliente compra pelos canais onde a marca está': ['distribuicao'],
    'O cliente percebe a marca nos momentos em que decide': ['presenca', 'anuncio'],
    'Os ativos da marca são reconhecidos sem o nome': ['presenca'],
    'A marca consegue manter presença o ano todo': ['anuncio', 'presenca'],
    'O preço maior é sustentado pela experiência': ['preco', 'experiencia'],
    'Quem compra uma vez tem motivo para voltar': ['relacao'],
    'Os clientes indicam a marca sem ser pedidos': ['relacao'],
    'A equipe entende e repete a mensagem central': ['equipe'],
    'A categoria continua crescendo na região': ['medicao'],
    'O cliente tem uma razão clara para trocar o que usa hoje': ['posicionamento', 'venda'],
    'A recomendação da equipe é aceita pelo cliente': ['venda'],
    'A fatia de comunicação da marca está acima da fatia de mercado': ['anuncio'],
    'O cliente consegue comprar sem muitas etapas': ['distribuicao', 'venda'],
    'A marca continua relevante para o que o cliente compra hoje': ['posicionamento'],
    'O programa próprio da marca continua atraindo atenção': ['conteudo'],
    'A identidade central continua a mesma nas decisões do ano': ['presenca'],
  };
  ['prioridades', 'condicoes'].forEach((k) => (P[k] || []).forEach((x) => { if (x && !x.temas && T[x.texto]) x.temas = T[x.texto]; }));
  // a renúncia escrita na abordagem e os itens de "deixados" que dizem a mesma coisa (palavras em comum)
  const raiz = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z]+/).filter((w) => w.length > 3).map((w) => w.slice(0, 5));
  const VAZIAS = new Set(['abrim', 'mesmo', 'quand', 'outra', 'outro', 'para', 'parte', 'enqua', 'fazer', 'dentr', 'desse', 'dessa', 'apena']);
  P.renunciaDa = (abordagem) => {
    const m = String(abordagem || '').match(/Abrimos mão d[eoa]s? ([^.]*)\./); if (!m) return null;
    const frase = m[1].charAt(0).toUpperCase() + m[1].slice(1);
    const r = new Set(raiz(frase).filter((w) => !VAZIAS.has(w)));
    const deixados = (P.deixados || []).map((x) => [x.texto, raiz(x.texto).filter((w) => r.has(w)).length]).filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
    return { frase, deixados };
  };
})();

// ===== Das causas para o diagnóstico: as frases que as causas marcadas sustentam =====
// Cada causa da biblioteca aponta para desafios; cada frase do Diagnóstico também. A frase sugerida é a que reúne mais
// causas marcadas. É sugestão: o que o cliente relata nem sempre é a causa real, e a frase também depende de fatores e números.
(function () {
  const P = window.GangPresets; if (!P || !P.causas || !P.resumoDesafios) return;
  const pal = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2).map((w) => w.slice(0, 5));
  const daBiblioteca = (t) => {
    const exata = P.causas.find((y) => y.texto === t); if (exata) return exata;
    const a = new Set(pal(t)); let melhor = null; let nota = 0;
    P.causas.forEach((y) => { const b = new Set(pal(y.texto)); const j = [...a].filter((w) => b.has(w)).length / Math.max(1, new Set([...a, ...b]).size); if (j > nota) { nota = j; melhor = y; } });
    return nota >= 0.4 ? melhor : null;
  };
  const desafiosDaFrase = (frase) => { const r = P.resumoDesafios.find(([pre]) => String(frase).startsWith(pre)); return r ? r[1] : []; };
  P.frasesDasCausas = (causasTextos, quantas) => {
    const cs = (causasTextos || []).map((t) => [t, daBiblioteca(t)]).filter(([, c]) => c && c.desafios && c.desafios.length);
    if (!cs.length) return { frases: [], lidas: 0 };
    const frases = (P.resumosDiagnostico || []).map((f) => {
      const ds = desafiosDaFrase(f.texto); if (!ds.length) return null;
      const liga = cs.filter(([, c]) => c.desafios.some((d) => ds.some((pre) => d.startsWith(pre))));
      const fortes = cs.reduce((n, [, c]) => n + c.desafios.filter((d) => ds.some((pre) => d.startsWith(pre))).length, 0);
      return liga.length ? { texto: f.texto, causas: liga.map(([t]) => t), nota: liga.length + fortes / 100 } : null;
    }).filter(Boolean).sort((a, b) => b.nota - a.nota).slice(0, quantas || 3);
    return { frases, lidas: cs.length };
  };
})();
