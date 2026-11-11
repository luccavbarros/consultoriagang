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

  // tema de cada ação: organiza a biblioteca e o menu do título por tipo de atividade
  window.GangPresets.temas = { presenca: 'Identidade e presença', posicionamento: 'Posicionamento', conteudo: 'Conteúdo e site', anuncio: 'Anúncios e campanhas',
    venda: 'Vendas e propostas', preco: 'Preço e ofertas', relacao: 'Relacionamento e indicação', experiencia: 'Experiência do cliente', equipe: 'Equipe', medicao: 'Medição e pesquisa' };
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
  window.GangPresets.acoes.forEach((x) => { if (window.GangPresets.MANUTENCAO.includes(x.texto)) x.manutencao = true; });
  ['Cuidar do pós-venda: o cliente que volta e indica.', 'Entregar a promessa em cada atendimento.'].forEach((f) => { if (window.GangPresets.modelosFoco[f]) window.GangPresets.modelosFoco[f].manutencao = true; });

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
})();
