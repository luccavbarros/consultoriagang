-- GANG — Teste: um cliente não acessa dados de outra empresa
-- Rode depois do portal.sql. Supabase: SQL Editor → New query → cole tudo → Run.
-- Cria duas empresas e três contas de teste, faz as tentativas como se fosse cada uma,
-- apaga tudo o que criou e mostra uma tabela: cada linha deve terminar em "ok".

create temp table if not exists resultado (n serial, teste text, ok boolean);
truncate resultado;
grant all on resultado to authenticated, anon;
grant all on sequence resultado_n_seq to authenticated, anon;

-- ---------- preparação (como dono do banco) ----------
create temp table ids as select
  gen_random_uuid() as ea, gen_random_uuid() as eb,
  gen_random_uuid() as ua, gen_random_uuid() as ub, gen_random_uuid() as uoff, gen_random_uuid() as adm,
  gen_random_uuid() as acao_a_cliente, gen_random_uuid() as acao_a_gang, gen_random_uuid() as acao_b,
  gen_random_uuid() as enc_b, gen_random_uuid() as acao_a_prox, gen_random_uuid() as acao_b_prox;
grant select on ids to authenticated;

insert into public.empresas (id, nome) select ea, 'TESTE Empresa A' from ids;
insert into public.empresas (id, nome) select eb, 'TESTE Empresa B' from ids;

insert into auth.users (id, email, raw_user_meta_data, aud, role)
select ua, 'teste-a-' || ua || '@exemplo.invalid', '{"name":"Cliente A"}'::jsonb, 'authenticated', 'authenticated' from ids
union all select ub, 'teste-b-' || ub || '@exemplo.invalid', '{"name":"Cliente B"}'::jsonb, 'authenticated', 'authenticated' from ids
union all select uoff, 'teste-off-' || uoff || '@exemplo.invalid', '{"name":"Desativado"}'::jsonb, 'authenticated', 'authenticated' from ids
union all select adm, 'teste-adm-' || adm || '@exemplo.invalid', '{"name":"Consultor Teste"}'::jsonb, 'authenticated', 'authenticated' from ids;

update public.profiles set empresa_id = (select ea from ids) where id = (select ua from ids);
update public.profiles set empresa_id = (select eb from ids) where id = (select ub from ids);
update public.profiles set empresa_id = (select ea from ids), active = false where id = (select uoff from ids);
update public.profiles set role = 'admin', whatsapp = '5511999999999' where id = (select adm from ids);

insert into public.planos (empresa_id, consultor_id, meta_faturamento_pct, inicio) select ea, adm, 30, current_date - 90 from ids;
insert into public.planos (empresa_id, consultor_id, meta_faturamento_pct, inicio) select eb, adm, 50, current_date - 90 from ids;
insert into public.acoes (id, empresa_id, mes_previsto, titulo, responsavel) select acao_a_cliente, ea, to_char(now(), 'YYYY-MM'), 'A: com o cliente', 'cliente' from ids;
insert into public.acoes (id, empresa_id, mes_previsto, titulo, responsavel) select acao_a_gang, ea, to_char(now(), 'YYYY-MM'), 'A: com a GANG', 'gang' from ids;
insert into public.acoes (id, empresa_id, mes_previsto, titulo, responsavel) select acao_b, eb, to_char(now(), 'YYYY-MM'), 'B: segredo', 'cliente' from ids;
insert into public.acoes (id, empresa_id, mes_previsto, titulo, responsavel) select acao_a_prox, ea, to_char(now() + interval '1 month', 'YYYY-MM'), 'A: do próximo mês', 'cliente' from ids;
insert into public.acoes (id, empresa_id, mes_previsto, titulo, responsavel) select acao_b_prox, eb, to_char(now() + interval '1 month', 'YYYY-MM'), 'B: do próximo mês', 'cliente' from ids;
insert into public.numeros_mensais (empresa_id, mes_ref, faturamento) select eb, '2020-01', 99999 from ids;
insert into public.encontros (id, empresa_id, inicio) select enc_b, eb, now() + interval '10 days' from ids;
insert into public.pedidos_revisao (empresa_id, tipo_peca, link) select eb, 'Outro', 'https://b.exemplo' from ids;
insert into public.plataformas (empresa_id, posicionamento) select eb, 'Segredo da B' from ids;
insert into public.mensagens (empresa_id, de, texto) select eb, 'cliente', 'Mensagem secreta da B' from ids;
insert into public.vozes (empresa_id, mes_ref, texto) select eb, '2026-01', 'Voz da B' from ids;
insert into public.disponibilidade (empresa_id, mes_ref, itens, nota) select eb, '2026-01', '{}'::jsonb, 50 from ids;
insert into public.situacoes (empresa_id, texto) select eb, 'Situação da B' from ids;
insert into public.ativos (empresa_id, nome) select eb, 'Ativo da B' from ids;
insert into public.pesquisas (empresa_id, titulo, categoria, afirmacoes, aberta) select eb, 'Pesquisa B', 'x', '["Frase"]', false from ids;

-- ---------- como o cliente A ----------
select set_config('request.jwt.claim.sub', (select ua::text from ids), false),
       set_config('request.jwt.claims', json_build_object('sub', (select ua from ids), 'role', 'authenticated')::text, false);
set role authenticated;

do $$
declare i ids; n int; ok boolean;
begin
  select * into i from ids;

  select count(*) into n from public.empresas where id = i.eb;
  insert into resultado (teste, ok) values ('A não vê a empresa B', n = 0);
  select count(*) into n from public.acoes where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não vê as ações da B', n = 0);
  select count(*) into n from public.acoes where id = i.acao_b;
  insert into resultado (teste, ok) values ('A não vê uma ação da B nem pelo ID', n = 0);
  select count(*) into n from public.numeros_mensais where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não vê os números da B', n = 0);
  select count(*) into n from public.plataformas where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não vê a plataforma da B', n = 0);
  select count(*) into n from public.pedidos_revisao where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não vê as peças da B', n = 0);
  select count(*) into n from public.profiles where id = i.ub;
  insert into resultado (teste, ok) values ('A não vê o perfil do cliente B', n = 0);
  select count(*) into n from public.acoes where empresa_id = i.ea;
  insert into resultado (teste, ok) values ('A vê as próprias ações', n = 3);

  update public.acoes set titulo = 'invadido' where id = i.acao_b;
  get diagnostics n = row_count;
  insert into resultado (teste, ok) values ('A não altera ação da B direto na tabela', n = 0);
  update public.acoes set titulo = 'mudado' where id = i.acao_a_cliente;
  get diagnostics n = row_count;
  insert into resultado (teste, ok) values ('A não altera nem a própria ação direto na tabela', n = 0);
  delete from public.acoes where empresa_id = i.eb;
  get diagnostics n = row_count;
  insert into resultado (teste, ok) values ('A não apaga dados da B', n = 0);

  begin
    insert into public.numeros_mensais (empresa_id, mes_ref, faturamento) values (i.eb, '2020-02', 1);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não grava números na B direto na tabela', ok);

  begin
    update public.profiles set empresa_id = i.eb where id = i.ua;
    get diagnostics n = row_count; ok := n = 0;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não troca a própria empresa no perfil', ok);

  begin
    perform public.portal_status_acao(i.acao_b, 'feita');
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não muda o status de ação da B pela função', ok);

  begin
    perform public.portal_status_acao(i.acao_a_gang, 'feita');
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não muda o status de ação que está com a GANG', ok);

  begin
    perform public.portal_passo_acao(i.acao_b, 0, true);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não marca passo de ação da B', ok);

  begin
    perform public.portal_trava_acao(i.acao_b, 'tempo', null);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não trava ação da B', ok);

  begin
    perform public.portal_trava_acao(i.acao_a_gang, 'tempo', null);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não trava ação que está com a GANG', ok);

  perform public.portal_trava_acao(i.acao_a_cliente, 'duvida', 'teste');
  select count(*) into n from public.acoes where id = i.acao_a_cliente and travada = 'duvida';
  insert into resultado (teste, ok) values ('A trava a própria ação com o motivo', n = 1);

  begin
    perform public.portal_levar_encontro('dúvida sobre a ação da B', i.acao_b);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não leva para o encontro uma ação da B', ok);
  perform public.portal_levar_encontro('dúvida minha', i.acao_a_cliente);
  select count(*) into n from public.sugestoes where empresa_id = i.ea and tipo = 'duvida' and acao_id = i.acao_a_cliente;
  insert into resultado (teste, ok) values ('A leva a própria dúvida para o encontro', n = 1);

  perform public.portal_ponto_partida(80000, '{"12": 95000}'::jsonb);
  select count(*) into n from public.planos where empresa_id = i.ea and faturamento_base = 80000 and partida_cliente and fat_ano_anterior ->> '12' = '95000';
  insert into resultado (teste, ok) values ('A informa o próprio ponto de partida', n = 1);
  select count(*) into n from public.planos where empresa_id = i.eb and faturamento_base is not null;
  insert into resultado (teste, ok) values ('O ponto de partida de A não muda o plano da B', n = 0);
  update public.planos set faturamento_base = 1 where empresa_id = i.ea;
  select count(*) into n from public.planos where empresa_id = i.ea and faturamento_base = 1;
  insert into resultado (teste, ok) values ('A não altera o plano direto (só pela função)', n = 0);

  perform public.portal_ver_acao(i.acao_b_prox);
  perform public.portal_ver_acao(i.acao_a_prox);
  reset role;
  select count(*) into n from public.acoes where (id = i.acao_b_prox and vista_em is not null) or (id = i.acao_a_prox and vista_em is null);
  set role authenticated;
  insert into resultado (teste, ok) values ('A marca como vista só a própria ação', n = 0);

  begin
    perform public.portal_adiantar_acao(i.acao_a_prox);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não adianta com ações do mês ainda abertas', ok);

  perform public.portal_status_acao(i.acao_a_cliente, 'feita');
  select count(*) into n from public.acoes where id = i.acao_a_cliente and status = 'feita' and concluida_em is not null;
  insert into resultado (teste, ok) values ('A marca a própria ação como feita (grava a data)', n = 1);

  begin
    perform public.portal_adiantar_acao(i.acao_b_prox);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não adianta uma ação da B', ok);
  perform public.portal_adiantar_acao(i.acao_a_prox);
  select count(*) into n from public.acoes where id = i.acao_a_prox and mes_previsto = to_char(now(), 'YYYY-MM') and adiantada_de = to_char(now() + interval '1 month', 'YYYY-MM') and prazo is not null;
  insert into resultado (teste, ok) values ('A adianta a própria ação do próximo mês (guarda de onde veio)', n = 1);

  begin
    perform public.portal_remarcar(i.enc_b, 'teste');
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não pede remarcação de encontro da B', ok);

  begin
    perform public.portal_pedir_revisao('Outro', 'x', i.eb::text || '/pecas/arquivo.pdf', null, 'oi');
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não registra peça apontando para arquivo da B', ok);

  insert into resultado (teste, ok) values ('A não lê arquivos da pasta da B',
    not public.pode_ver(public.pasta_empresa(i.eb::text || '/plataforma/plano.pdf')));
  insert into resultado (teste, ok) values ('A lê arquivos da própria pasta',
    public.pode_ver(public.pasta_empresa(i.ea::text || '/plataforma/plano.pdf')));

  perform public.portal_enviar_numeros(to_char(now() - interval '1 month', 'YYYY-MM'), 1000, 10, 2);
  select count(*) into n from public.numeros_mensais where empresa_id = i.ea;
  insert into resultado (teste, ok) values ('A envia os números do mês passado para a própria empresa', n = 1);

  begin
    perform public.portal_enviar_numeros(to_char(now(), 'YYYY-MM'), 1000, 10, 2);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não envia números de um mês que não terminou', ok);

  select count(*) into n from public.portal_consultor() where whatsapp = '5511999999999';
  insert into resultado (teste, ok) values ('A vê o próprio consultor', n = 1);

  select count(*) into n from public.mensagens where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não lê as mensagens da B', n = 0);
  begin
    insert into public.mensagens (empresa_id, de, texto) values (i.eb, 'cliente', 'invasão');
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não grava mensagem na conversa da B', ok);
  perform public.portal_enviar_mensagem('Olá, consultor');
  select count(*) into n from public.mensagens where empresa_id = i.ea and de = 'cliente';
  insert into resultado (teste, ok) values ('A envia mensagem para o próprio consultor', n = 1);
  begin
    perform public.portal_cancelar_mensagem((select id from public.mensagens where empresa_id = i.eb limit 1));
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não cancela mensagem da B', ok);
  perform public.portal_cancelar_mensagem((select id from public.mensagens where empresa_id = i.ea and de = 'cliente' limit 1));
  select count(*) into n from public.mensagens where empresa_id = i.ea;
  insert into resultado (teste, ok) values ('A cancela a própria mensagem não lida', n = 0);
  begin
    perform public.portal_minha_foto('https://x.supabase.co/storage/v1/object/public/avatares/' || i.ub || '/foto.jpg');
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não usa a pasta de foto do cliente B', ok);
  perform public.portal_minha_foto('https://x.supabase.co/storage/v1/object/public/avatares/' || i.ua || '/foto.jpg');
  select count(*) into n from public.profiles where id = i.ua and foto_url like '%/avatares/' || i.ua || '/%';
  insert into resultado (teste, ok) values ('A salva a própria foto', n = 1);
  select count(*) into n from public.vozes where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não lê a voz do cliente da B', n = 0);
  select count(*) into n from public.disponibilidade where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não lê a disponibilidade da B', n = 0);
  begin
    insert into public.disponibilidade (empresa_id, mes_ref, itens, nota) values (i.ea, '2026-02', '{}'::jsonb, 100);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não escreve a própria nota de disponibilidade', ok);
  select count(*) into n from public.pesquisas where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não vê a pesquisa da B', n = 0);
  select count(*) into n from public.situacoes where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não vê as situações de compra da B', n = 0);
  select count(*) into n from public.ativos where empresa_id = i.eb;
  insert into resultado (teste, ok) values ('A não vê os ativos da B', n = 0);
end $$;

reset role;

-- ---------- como a conta desativada (da empresa A) ----------
select set_config('request.jwt.claim.sub', (select uoff::text from ids), false),
       set_config('request.jwt.claims', json_build_object('sub', (select uoff from ids), 'role', 'authenticated')::text, false);
set role authenticated;
do $$
declare n int;
begin
  select count(*) into n from public.acoes;
  insert into resultado (teste, ok) values ('Conta desativada não vê nada', n = 0);
end $$;
reset role;

-- ---------- sem login ----------
select set_config('request.jwt.claim.sub', '', false), set_config('request.jwt.claims', '', false);
set role anon;
do $$
declare n int;
begin
  select count(*) into n from public.acoes;
  insert into resultado (teste, ok) values ('Sem login não vê nada', n = 0);
  insert into resultado (teste, ok) values ('Sem login não abre pesquisa fechada',
    public.pesquisa_publica((select token from public.pesquisas where titulo = 'Pesquisa B' limit 1)) is null);
exception when others then
  insert into resultado (teste, ok) values ('Sem login não vê nada', true);
end $$;
reset role;

-- ---------- como o consultor ----------
select set_config('request.jwt.claim.sub', (select adm::text from ids), false),
       set_config('request.jwt.claims', json_build_object('sub', (select adm from ids), 'role', 'authenticated')::text, false);
set role authenticated;
do $$
declare i ids; n int;
begin
  select * into i from ids;
  select count(*) into n from public.acoes where empresa_id in (i.ea, i.eb);
  insert into resultado (teste, ok) values ('O consultor vê as duas empresas', n = 5);
  update public.planos set faturamento_base = 90000, partida_cliente = false where empresa_id = i.ea; -- o consultor assume o valor
end $$;
reset role;
-- de volta como A: o valor agora é do consultor e não pode ser trocado pelo cliente
select set_config('request.jwt.claim.sub', (select ua::text from ids), false),
       set_config('request.jwt.claims', json_build_object('sub', (select ua from ids), 'role', 'authenticated')::text, false);
set role authenticated;
do $$
declare ok boolean;
begin
  begin
    perform public.portal_ponto_partida(1, '{}'::jsonb);
    ok := false;
  exception when others then ok := true; end;
  insert into resultado (teste, ok) values ('A não muda o ponto de partida definido pelo consultor', ok);
end $$;
reset role;
select set_config('request.jwt.claim.sub', '', false), set_config('request.jwt.claims', '', false);

-- ---------- limpeza: apaga tudo o que o teste criou ----------
delete from public.empresas where id in (select ea from ids union select eb from ids);
delete from auth.users where id in (select ua from ids union select ub from ids union select uoff from ids union select adm from ids);
drop table ids;

select n as "#", teste, case when ok then 'ok' else 'FALHOU' end as resultado from resultado order by n;
