-- GANG — Empresa de exemplo para testar o portal
-- Rode depois do portal.sql. Supabase: SQL Editor → New query → cole tudo → Run.
-- Cria (ou recria) a "Empresa Exemplo" com plano no mês 4 de 18 e o conteúdo das telas de referência.
-- Depois, no painel, abra a Empresa Exemplo e crie um acesso de cliente para ela.
-- Pode rodar de novo: refaz o conteúdo e mantém os acessos já criados.
-- Para apagar: delete from public.empresas where id = '00000000-0000-4000-8000-0000000e0001';

do $$
declare
  e uuid := '00000000-0000-4000-8000-0000000e0001';
  c uuid := (select id from public.profiles where role = 'admin' and active order by created_at limit 1);
  m0 date := (date_trunc('month', current_date) - interval '3 months')::date;  -- início do plano: mês 4 agora
  mes text := to_char(current_date, 'YYYY-MM');
  prox text := to_char(current_date + interval '1 month', 'YYYY-MM');
  ant text := to_char(current_date - interval '1 month', 'YYYY-MM');
  o_neg uuid := gen_random_uuid(); o_marca uuid := gen_random_uuid(); o_com uuid := gen_random_uuid();
  t text;
begin
  insert into public.empresas (id, nome) values (e, 'Empresa Exemplo') on conflict (id) do update set nome = excluded.nome;

  -- limpa o conteúdo anterior (os acessos ficam)
  foreach t in array array['planos', 'objetivos', 'escolhas', 'condicoes', 'diagnosticos', 'impressoes', 'fatores', 'causas',
    'plataformas', 'mensagens_apoio', 'tom_atributos', 'tom_exemplos', 'facetas', 'identidades', 'arquivos_marca', 'cores',
    'tipografias', 'aplicacoes', 'orientacoes', 'acoes', 'acoes_descartadas', 'sugestoes', 'numeros_mensais', 'metricas',
    'encontros', 'pedidos_revisao', 'mensagens', 'pesquisas', 'buscas', 'vozes', 'situacoes', 'ativos'] loop
    execute format('delete from public.%I where empresa_id = $1', t) using e;
  end loop;

  -- plano
  insert into public.planos (empresa_id, consultor_id, inicio, duracao_meses, entregue_em, estrategia_aprovada_em,
    proxima_revisao_estrategia, meta_faturamento_pct, faturamento_base, esforco_marca_pct, como_vencer, proxima_fatura)
  values (e, c, m0, 18, m0 + 19, m0 + 19, (m0 + interval '6 months')::date, 30, 100000, 60,
    'Somos a única da região com um método próprio testado: o cliente paga mais porque sabe exatamente o que vai receber.',
    (date_trunc('month', current_date) + interval '1 month 4 days')::date);

  -- estratégia
  insert into public.objetivos (id, empresa_id, nivel, titulo, destaque, ordem) values
    (o_neg, e, 'negocio', 'faturamento em 18 meses, com ticket médio maior', '+30%', 1),
    (o_marca, e, 'marca', 'Ser lembrada em mais situações de compra que os concorrentes', null, 2);
  insert into public.objetivos (id, empresa_id, nivel, titulo, notar, acreditar, sentir, ordem) values
    (o_com, e, 'comunicacao', 'O que o cliente precisa notar, acreditar e sentir', 'a nova identidade', 'no método', 'segurança', 3);
  insert into public.escolhas (empresa_id, tipo, texto, ordem) values
    (e, 'prioridade', 'Empresas de médio porte da região', 1),
    (e, 'prioridade', 'Grande São Paulo', 2),
    (e, 'prioridade', 'Projetos completos com o método', 3),
    (e, 'deixa_de_lado', 'Cliente que só busca preço', 1),
    (e, 'deixa_de_lado', 'Serviço avulso de baixa margem', 2);
  insert into public.condicoes (empresa_id, texto, como_verificar, status, ordem, dono, checar_em) values
    (e, 'Clientes de alto valor aceitam pagar mais por especialização', 'Ticket médio das propostas novas', 'se_confirma', 1, 'Cliente', (date_trunc('month', current_date) + interval '1 month')::date),
    (e, 'A equipe entrega o método em todo projeto', 'Avaliação dos clientes ao fim do projeto', 'em_observacao', 2, 'Cliente', (date_trunc('month', current_date) + interval '2 months')::date),
    (e, 'Os concorrentes não copiam o método no curto prazo', 'Leitura trimestral dos sites e propostas deles', 'sem_dados', 3, 'GANG', (m0 + interval '6 months')::date);

  -- diagnóstico
  insert into public.diagnosticos (empresa_id, data, proximo, resumo) values
    (e, m0, (m0 + interval '12 months')::date,
     'A marca entregava o básico que o setor exige, mas não tinha uma diferença clara, por isso competia principalmente por preço.');
  insert into public.impressoes (empresa_id, marca_nome, eh_cliente, notam, acreditam, sentem, ordem) values
    (e, 'Empresa Exemplo', true, 'Fachada antiga, logo pouco lembrado', 'Bom preço, entrega no prazo', 'Confiança, mas sem orgulho de comprar', 1),
    (e, 'Concorrente A', false, 'Marca forte, muita propaganda', 'Grande e confiável', 'Distância, atendimento frio', 2),
    (e, 'Concorrente B', false, 'Preço baixo em destaque', 'Barato, qualidade variável', 'Desconfiança', 3);
  insert into public.fatores (empresa_id, tipo, texto, posicao, ordem) values
    (e, 'motivador', 'Prazo cumprido', 'entrega', 1),
    (e, 'motivador', 'Preço justo', 'entrega', 2),
    (e, 'motivador', 'Atendimento rápido', 'entrega_mal', 3),
    (e, 'discriminador', 'Método próprio', 'nao_entrega', 1),
    (e, 'discriminador', 'Especialização no segmento', 'entrega_mal', 2),
    (e, 'discriminador', 'Resultado comprovado', 'nao_entrega', 3);
  insert into public.causas (empresa_id, texto, ordem) values
    (e, 'A marca não mostrava o que a torna diferente', 1),
    (e, 'A proposta comercial começava pelo preço', 2),
    (e, 'A equipe não tinha um jeito único de apresentar o trabalho', 3);

  -- plataforma de marca
  insert into public.plataformas (empresa_id, entregue_em, posicionamento, mensagem_central) values
    (e, m0 + 19,
     'Para empresas de médio porte da região, a Empresa Exemplo é a especialista em projetos completos que entrega resultado sem retrabalho, porque tem um método próprio testado em 40 projetos, ao contrário de fornecedores que competem só por preço.',
     'Resultado sem retrabalho, com método.');
  insert into public.mensagens_apoio (empresa_id, texto, ordem) values
    (e, 'Um método testado em 40 projetos', 1),
    (e, 'Você sabe o que vai receber antes de começar', 2),
    (e, 'Prazo cumprido, sempre', 3);
  insert into public.tom_atributos (empresa_id, nome, descricao, ordem) values
    (e, 'Direta', 'Fala o que faz sem rodeio', 1),
    (e, 'Segura', 'Mostra método, não promessa', 2),
    (e, 'Próxima', 'Linguagem do dono, sem jargão', 3);
  insert into public.tom_exemplos (empresa_id, tipo, texto, ordem) values
    (e, 'diz', '“Antes de começar, você recebe o plano do projeto inteiro.”', 1),
    (e, 'nunca_diz', '“O menor preço da região!”', 1);
  insert into public.facetas (empresa_id, chave, texto) values
    (e, 'aparencia', 'Preto e branco, fotos reais das obras, a fachada nova'),
    (e, 'personalidade', 'Uma engenheira experiente que explica tudo com calma'),
    (e, 'valores', 'Fazer certo da primeira vez'),
    (e, 'relacao', 'Especialista que guia o cliente do começo ao fim'),
    (e, 'cliente_projetado', 'Quem compra é visto como alguém que decide bem'),
    (e, 'autoimagem', 'O cliente se sente seguro e no controle');

  -- identidade visual
  insert into public.identidades (empresa_id, entregue_em, versao) values (e, m0 + 19, '1.0');
  insert into public.arquivos_marca (empresa_id, categoria, nome, descricao, ordem) values
    (e, 'logo', 'Logo principal', 'Principal', 1),
    (e, 'logo', 'Versão negativa', 'Sobre fundo escuro', 2),
    (e, 'logo', 'Símbolo', 'Símbolo · avatar', 3),
    (e, 'manual', 'Manual da marca', 'Como usar logo, cores e tipografia · PDF', 4),
    (e, 'modelo', 'Modelo de proposta comercial', 'Para usar nas ações deste mês · DOCX', 5),
    (e, 'modelo', 'Modelos para redes sociais', 'Post, story e capa · Canva', 6),
    (e, 'papelaria', 'Papelaria', 'Cartão, assinatura de e-mail, timbrado', 7);
  insert into public.cores (empresa_id, nome, hex, cmyk, pantone, ordem) values
    (e, 'Primária', '#111111', '0 0 0 93', 'Black 6 C', 1),
    (e, 'Secundária', '#E5482A', '0 69 82 10', '7417 C', 2),
    (e, 'Apoio', '#B5B5B5', '0 0 0 29', 'Cool Gray 5 C', 3),
    (e, 'Fundo', '#F4F4F2', '0 0 1 4', '663 C', 4);
  insert into public.tipografias (empresa_id, nome, uso, ordem) values
    (e, 'Archivo', 'Títulos e destaques', 1),
    (e, 'IBM Plex Sans', 'Textos longos, propostas, site', 2);
  insert into public.aplicacoes (empresa_id, ponto_contato, status, data, ordem) values
    (e, 'Fachada', 'aplicada', (m0 + interval '1 month 20 days')::date, 1),
    (e, 'Redes sociais', 'aplicada', (m0 + 25), 2),
    (e, 'Proposta comercial', 'em_andamento', current_date, 3),
    (e, 'Site', 'prevista', (date_trunc('month', current_date) + interval '1 month')::date, 4);

  -- foco do mês
  insert into public.orientacoes (empresa_id, mes_ref, titulo, texto, consultor_id, publicada_em, veredito, nota_valor) values
    (e, mes, 'Levar a nova marca para a proposta comercial.',
     'A fachada já mudou e os clientes estão notando. O próximo passo é a proposta: é nela que o cliente decide se paga mais pela especialização. Use o modelo novo e abra sempre com a mensagem central.',
     c, date_trunc('month', current_date) + interval '3 days 9 hours',
     'Mais gente está chegando, mas ainda pelo preço. Este mês o trabalho é fazer a proposta mostrar a especialização.',
     'Entraram mais clientes pequenos, que baixaram a média. A proposta nova, deste mês, é o que deve fazer o ticket voltar a subir.');

  -- ações
  insert into public.acoes (empresa_id, objetivo_id, mes_previsto, titulo, serve_para, metrica_sucesso, responsavel, responsavel_nome, prazo, status, concluida_em, ordem, esforco, resultado, aprendizado) values
    (e, o_neg, mes, 'Reescrever a proposta comercial', 'ticket médio maior', 'ticket médio das propostas sobe', 'cliente', null, current_date + 4, 'em_andamento', null, 1, 'venda', null, null),
    (e, o_com, mes, 'Publicar o método no site', 'acreditar no método', 'leads que citam o método', 'cliente', 'Marketing', (date_trunc('month', current_date) + interval '1 month - 1 day')::date, 'a_fazer', null, 2, 'marca', null, null),
    (e, o_marca, mes, 'Treinar a equipe de vendas na mensagem central', 'ser vista como especialista', 'toda proposta abre com a mensagem central', 'gang', null, current_date + 12, 'em_andamento', null, 3, 'venda', null, null),
    (e, o_com, prox, 'Campanha de lembrança nas redes', 'notar a nova identidade', 'alcance e menções da marca', 'ambos', null, (date_trunc('month', current_date) + interval '1 month 20 days')::date, 'a_fazer', null, 4, 'marca', null, null),
    (e, o_marca, to_char(m0 + interval '1 month', 'YYYY-MM'), 'Trocar a fachada', 'ser vista como especialista', 'clientes comentam a mudança', 'cliente', null, (m0 + interval '1 month 15 days')::date, 'feita', (m0 + interval '1 month 20 days')::date, 5, 'marca', 'sim', 'Três clientes comentaram a fachada nova na primeira semana.'),
    (e, o_com, to_char(m0, 'YYYY-MM'), 'Atualizar perfis nas redes com a nova identidade', 'notar a nova identidade', 'perfis 100% na nova marca', 'gang', null, (m0 + 25), 'feita', (m0 + 25), 6, 'marca', 'parcial', 'Os perfis mudaram, mas os destaques do Instagram ainda estão com a marca antiga.');
  insert into public.acoes_descartadas (empresa_id, texto, ordem) values
    (e, 'Promoções de preço no varejo', 1),
    (e, 'Atender clientes que só buscam preço', 2);

  -- números: o mês de início (base) e o seguinte já informados; o mês passado ainda não
  insert into public.numeros_mensais (empresa_id, mes_ref, faturamento, leads, clientes_novos, enviado_em) values
    (e, to_char(m0, 'YYYY-MM'), 100000, 18, 3, m0 + 35),
    (e, to_char(m0 + interval '1 month', 'YYYY-MM'), 102000, 22, 4, m0 + 65);
  update public.planos set mensalidade = 2500 where empresa_id = e;
  update public.acoes set causa_id = (select id from public.causas where empresa_id = e and texto like 'A proposta comercial%' limit 1) where empresa_id = e and titulo = 'Reescrever a proposta comercial';
  update public.acoes set causa_id = (select id from public.causas where empresa_id = e and texto like 'A equipe%' limit 1) where empresa_id = e and titulo like 'Treinar a equipe%';
  insert into public.orientacoes (empresa_id, mes_ref, titulo, consultor_id, publicada_em, veredito) values
    (e, to_char(current_date - interval '1 month', 'YYYY-MM'), 'Trocar a fachada e ouvir os primeiros clientes.', c, now() - interval '35 days', 'A fachada nova já trouxe comentários; agora é transformar atenção em contato.');
  update public.acoes set observacao = 'Use o modelo novo que deixei na pasta de arquivos e me mande o rascunho antes de enviar para o primeiro cliente.' where empresa_id = e and titulo = 'Reescrever a proposta comercial';
  update public.numeros_mensais set clientes_atendidos = case when mes_ref = to_char(m0, 'YYYY-MM') then 11 else 12 end where empresa_id = e;
  update public.numeros_mensais set propostas = case when mes_ref = to_char(m0, 'YYYY-MM') then 20 else 22 end,
         fechadas = case when mes_ref = to_char(m0, 'YYYY-MM') then 6 else 8 end,
         sem_desconto = case when mes_ref = to_char(m0, 'YYYY-MM') then 2 else 4 end where empresa_id = e;
  insert into public.metricas (empresa_id, nivel, nome, frequencia, valor_atual, proxima_medicao, ordem) values
    (e, 'negocio', 'Ticket médio', 'mensal', 'R$ 8.400', null, 1),
    (e, 'marketing', 'Leads · conversão', 'mensal', '18 · 17%', null, 2),
    (e, 'marca', 'Lembrança e preferência', 'semestral', null, (m0 + interval '6 months')::date, 3),
    (e, 'marca', 'Fatia nas lembranças da categoria', 'semestral', null, (m0 + interval '6 months')::date, 4);

  -- encontros
  insert into public.encontros (empresa_id, tipo, inicio, duracao_min, local_ou_link, pauta, decisoes, status) values
    (e, 'entrega', m0 + 19 + time '10:00', 120, 'Escritório do cliente',
     '["Apresentação do plano de marca","Apresentação da identidade visual"]',
     '["Plano e identidade aprovados","Começar pela fachada e pelas redes"]', 'realizado'),
    (e, 'mensal', (m0 + interval '1 month 11 days') + time '10:00', 30, 'Videochamada',
     '["Fachada","Redes sociais"]',
     '["Fachada aprovada para execução","Redes no ar até o fim do mês"]', 'realizado'),
    (e, 'mensal', (date_trunc('month', current_date) - interval '1 month' + interval '9 days') + time '10:00', 30, 'Videochamada',
     '["Ações do mês","Números"]',
     '["Antecipar a proposta nova para este mês","Adiar a campanha de lembrança para o próximo mês","Você informa os números até o dia 5 de cada mês"]', 'realizado'),
    (e, 'mensal', (current_date + 18) + time '10:00', 30, 'https://meet.google.com/exemplo',
     '["As ações deste mês saíram no prazo?","Números do mês passado","Suas peças em revisão"]', '[]', 'agendado');

  -- peças enviadas para revisão
  insert into public.pedidos_revisao (empresa_id, tipo_peca, titulo, link, pergunta, enviado_em, status, resposta, respondido_em, visto_pelo_cliente) values
    (e, 'Post para redes', 'Post de lançamento do método', 'https://exemplo.com/post', 'O texto está no tom da marca?', now() - interval '3 days', 'em_analise', null, null, false),
    (e, 'Proposta comercial', 'Rascunho da proposta comercial', 'https://exemplo.com/proposta', 'Posso mandar assim?', now() - interval '6 days', 'ajustar', 'Abra com a mensagem central, não com a tabela de preços.', now() - interval '4 days', false),
    (e, 'Anúncio', 'Anúncio do mês passado', 'https://exemplo.com/anuncio', 'Aprovado para rodar?', now() - interval '30 days', 'aprovado', 'Pode rodar. Ótimo uso da cor secundária.', now() - interval '28 days', true),
    (e, 'Fachada', 'Arte da nova fachada', 'https://exemplo.com/fachada', 'A arte segue o manual?', (m0 + interval '1 month' + interval '9 days')::timestamptz, 'aprovado', 'Segue. Pode mandar produzir.', (m0 + interval '1 month' + interval '10 days')::timestamptz, true);
  update public.pedidos_revisao set exemplo = true, checklist = '{"cliente":true,"mensagem":true,"tom":true,"identidade":true}'
   where empresa_id = e and status = 'aprovado';
  update public.pedidos_revisao set checklist = '{"cliente":true,"mensagem":false,"tom":true,"identidade":true}'
   where empresa_id = e and status = 'ajustar';

  -- pesquisa de marca: rodada de partida, com respostas
  insert into public.pesquisas (id, empresa_id, titulo, categoria, afirmacoes, concorrentes, aberta, criada_em)
  values ('00000000-0000-4000-8000-0000000e0002', e, 'Rodada de partida', 'empresa de reformas',
          '["Notei a nova identidade da marca", "Acredito que eles têm um método próprio", "Sinto segurança em contratar"]',
          '["Concorrente A", "Concorrente B"]', true, m0 + 40);
  insert into public.respostas (pesquisa_id, empresa_id, lembranca, preferencia, notas, palavra, criada_em)
  select '00000000-0000-4000-8000-0000000e0002', e, l, pr, n::jsonb, pa, m0 + 45
    from (values ('Concorrente A, Empresa Exemplo', 'Empresa Exemplo', '[4,3,4]', 'confiável'),
                 ('Concorrente A', 'Concorrente A', '[2,2,3]', 'barata'),
                 ('empresa exemplo', 'Empresa Exemplo', '[5,4,4]', 'organizada'),
                 ('Concorrente B, Concorrente A', 'Concorrente B', '[2,1,3]', 'comum'),
                 ('Concorrente A', 'Empresa Exemplo', '[3,3,4]', 'prazo'),
                 ('Exemplo', 'Empresa Exemplo', '[4,4,5]', 'método'),
                 ('Concorrente B', 'Concorrente A', '[1,2,2]', 'preço'),
                 ('Concorrente A, Empresa Exemplo', 'Empresa Exemplo', '[4,3,4]', 'sério')) as t(l, pr, n, pa);

  -- How Brands Grow: situações de compra e ativos distintivos
  insert into public.situacoes (id, empresa_id, texto, ordem) values
    ('00000000-0000-4000-8000-00000000c001', e, 'Vou reformar antes de alugar ou vender', 1),
    ('00000000-0000-4000-8000-00000000c002', e, 'Apareceu um problema urgente (infiltração, elétrica)', 2),
    ('00000000-0000-4000-8000-00000000c003', e, 'Quero modernizar a empresa ou a loja', 3),
    ('00000000-0000-4000-8000-00000000c004', e, 'Comprei um imóvel e preciso adaptar', 4),
    ('00000000-0000-4000-8000-00000000c005', e, 'Preciso de alguém de confiança, sem dor de cabeça', 5);
  insert into public.ativos (id, empresa_id, tipo, nome, texto, ordem) values
    ('00000000-0000-4000-8000-00000000a001', e, 'cor', 'Laranja da marca', '#E5482A', 1),
    ('00000000-0000-4000-8000-00000000a002', e, 'frase', 'Frase da marca', 'Resultado sem retrabalho, com método.', 2),
    ('00000000-0000-4000-8000-00000000a003', e, 'simbolo', 'Símbolo quadrado', null, 3);
  update public.acoes set peso = 'essencial', porque = 'É na proposta que o cliente decide pagar mais. Sem ela, o +30% não vem.' where empresa_id = e and titulo like 'Reescrever%';
  update public.acoes set peso = 'ajuda', porque = 'Mostrar o método transforma promessa em prova.' where empresa_id = e and titulo like 'Publicar%';
  update public.acoes set peso = 'essencial', porque = 'A equipe é a marca em cada atendimento; sem discurso único, o posicionamento se perde.' where empresa_id = e and titulo like 'Treinar%';
  update public.acoes set peso = 'essencial', porque = 'Crescer exige chegar a quem ainda não é cliente.' where empresa_id = e and titulo like 'Campanha%';
  update public.acoes set peso = 'essencial', porque = 'A fachada é o primeiro contato: muda a percepção na hora.' where empresa_id = e and titulo like 'Trocar a fachada%';
  update public.acoes set peso = 'reforco', porque = 'Coerência em todos os pontos de contato constrói a identidade.' where empresa_id = e and titulo like 'Atualizar perfis%';
  update public.acoes set situacao_id = '00000000-0000-4000-8000-00000000c001' where empresa_id = e and titulo like 'Reescrever%';
  update public.acoes set situacao_id = '00000000-0000-4000-8000-00000000c005' where empresa_id = e and titulo like 'Publicar%';
  update public.acoes set situacao_id = '00000000-0000-4000-8000-00000000c003' where empresa_id = e and titulo like 'Campanha%';
  update public.pesquisas set afirmacoes = '[]',
    situacoes = (select jsonb_agg(jsonb_build_object('id', id, 'texto', texto) order by ordem) from public.situacoes where empresa_id = e),
    ativos = (select jsonb_agg(jsonb_build_object('id', id, 'nome', nome, 'tipo', tipo, 'texto', texto, 'imagem_url', imagem_url) order by ordem) from public.ativos where empresa_id = e)
   where empresa_id = e;
  update public.respostas r set notas = '[]',
    frase = case when x.k % 3 = 0 then 'Oferece o menor preço da região.' when x.k % 4 = 1 then 'Faz de tudo um pouco, como as outras.' else 'Resultado sem retrabalho, com método.' end,
    entende = not (x.k % 3 = 0 or x.k % 4 = 1),
    ceps = jsonb_build_object(
      '00000000-0000-4000-8000-00000000c001', case when x.k % 3 = 0 then '["Empresa Exemplo","Concorrente A"]'::jsonb else '["Concorrente A"]'::jsonb end,
      '00000000-0000-4000-8000-00000000c002', case when x.k % 4 = 0 then '["Empresa Exemplo"]'::jsonb else '["Concorrente B"]'::jsonb end,
      '00000000-0000-4000-8000-00000000c003', '["Concorrente A"]'::jsonb,
      '00000000-0000-4000-8000-00000000c004', case when x.k % 3 = 0 then '["Empresa Exemplo"]'::jsonb else '[]'::jsonb end,
      '00000000-0000-4000-8000-00000000c005', case when x.k % 3 = 1 then '["Empresa Exemplo"]'::jsonb else '["Concorrente A"]'::jsonb end),
    ativos = jsonb_build_object(
      '00000000-0000-4000-8000-00000000a001', case when x.k % 2 = 0 then 'Empresa Exemplo' when x.k % 3 = 0 then 'Concorrente B' else 'Não sei' end,
      '00000000-0000-4000-8000-00000000a002', case when x.k % 4 = 0 then 'Empresa Exemplo' else 'Não sei' end,
      '00000000-0000-4000-8000-00000000a003', case when x.k <= 2 then 'Empresa Exemplo' when x.k <= 5 then 'Concorrente A' else 'Não sei' end)
    from (select id, row_number() over (order by id) as k from public.respostas where empresa_id = e) x
   where r.id = x.id;

  -- participação nas buscas (Google Trends), mês a mês
  insert into public.buscas (empresa_id, mes_ref, marca_pct) values
    (e, to_char(m0, 'YYYY-MM'), 12), (e, to_char(m0 + interval '1 month', 'YYYY-MM'), 14), (e, to_char(m0 + interval '2 months', 'YYYY-MM'), 17);

  -- o que os clientes disseram
  insert into public.vozes (empresa_id, mes_ref, texto, criada_em) values
    (e, to_char(m0 + interval '1 month', 'YYYY-MM'), '“Passei na frente e achei que era uma empresa nova, bem mais séria.”', m0 + 50),
    (e, to_char(m0 + interval '2 months', 'YYYY-MM'), '“Vocês são os do método, né? Um amigo indicou por isso.”', m0 + 70);

  -- setor e os detalhes das ações (passos, tamanho, quando medir, mensagem pronta)
  update public.empresas set setor = 'servicos' where id = e;
  -- medição: quem respondeu já era cliente, faturamento do ano anterior (sazonalidade), participação de mercado e disponibilidade física
  update public.respostas r set ja_cliente = x.k <= 5
    from (select id, row_number() over (order by id) as k from public.respostas where empresa_id = e) x where r.id = x.id;
  update public.planos set participacao_mercado = 10,
    fat_ano_anterior = '{"01":88000,"02":90000,"03":96000,"04":98000,"05":100000,"06":97000,"07":99000,"08":101000,"09":100000,"10":104000,"11":108000,"12":119000}'::jsonb
   where empresa_id = e;
  insert into public.disponibilidade (empresa_id, mes_ref, itens, nota) values
    (e, to_char(m0, 'YYYY-MM'), '{"google":true,"mapas":false,"resposta":false,"pagamento":true,"site":true,"onde_procura":false}'::jsonb, 50);
  update public.acoes set tamanho = 'M', ler_em_dias = 60, passos = '[{"t":"Juntar as 3 últimas propostas enviadas","ok":true},{"t":"Abrir pela recomendação e pelo problema do cliente","ok":false},{"t":"Mostrar o impacto em dinheiro","ok":false},{"t":"Revisar o modelo com o consultor","ok":false}]'::jsonb
   where empresa_id = e and titulo = 'Reescrever a proposta comercial';
  update public.acoes set tamanho = 'M', ler_em_dias = 60, passos = '[{"t":"Marcar 1 hora com toda a equipe","ok":false},{"t":"Explicar a mensagem central e o tom de voz","ok":false},{"t":"Treinar com 3 situações reais de atendimento","ok":false}]'::jsonb
   where empresa_id = e and titulo = 'Treinar a equipe de vendas na mensagem central';
  update public.acoes set tamanho = 'M', ler_em_dias = 90, passos = '[{"t":"Desenhar as etapas do método","ok":false},{"t":"Escrever o que acontece em cada etapa","ok":false},{"t":"Publicar no site e nas propostas","ok":false}]'::jsonb
   where empresa_id = e and titulo = 'Publicar o método no site';
  update public.acoes set tamanho = 'G', ler_em_dias = 180 where empresa_id = e and titulo = 'Trocar a fachada';
  update public.acoes set tamanho = 'G', ler_em_dias = 90 where empresa_id = e and titulo = 'Campanha de lembrança nas redes';
end $$;

select 'Empresa Exemplo pronta. No painel, abra a empresa e crie um acesso de cliente para ela.' as resultado;
