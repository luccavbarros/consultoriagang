-- GANG — Portal do Cliente (fase 1): empresas, plano e tudo o que o portal mostra
-- Rode DEPOIS do schema.sql. Supabase: SQL Editor → New query → cole tudo → Run.
-- Pode rodar de novo sem perder dados (só cria o que falta e reescreve regras e funções).
--
-- Como a segurança funciona:
--   • toda tabela tem empresa_id;
--   • o cliente só LÊ linhas da própria empresa (regra no banco, não na tela);
--   • o cliente nunca escreve direto nas tabelas: só pelas funções portal_* lá embaixo,
--     que conferem a empresa e a regra antes de gravar;
--   • o consultor (admin) lê e escreve tudo.


-- ===================== Empresas e perfis =====================

create table if not exists public.empresas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

alter table public.empresas add column if not exists logo_url text;   -- logo do cliente (balde público), no topo do menu
alter table public.profiles add column if not exists empresa_id uuid references public.empresas (id) on delete set null;
alter table public.profiles add column if not exists iniciais text;   -- consultor: aparece no menu do cliente
alter table public.profiles add column if not exists foto_url text;   -- consultor
alter table public.profiles add column if not exists whatsapp text;   -- consultor: botão "Falar com o consultor"

-- a empresa de quem está logado (null para o admin ou para conta desativada)
create or replace function public.minha_empresa()
returns uuid
language sql stable security definer set search_path = public
as $$
  select empresa_id from public.profiles where id = auth.uid() and active and role = 'client';
$$;

-- pode ver os dados desta empresa? (o admin vê todas; o cliente, só a dele)
create or replace function public.pode_ver(e uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_admin() or (e is not null and e = public.minha_empresa());
$$;

-- ===================== Plano =====================

create table if not exists public.planos (
  empresa_id uuid primary key references public.empresas (id) on delete cascade,
  consultor_id uuid references public.profiles (id) on delete set null,
  inicio date not null default current_date,
  duracao_meses int not null default 18 check (duracao_meses between 1 and 120),
  entregue_em date,
  estrategia_aprovada_em date,
  proxima_revisao_estrategia date,
  estrategia_pdf text,                       -- caminho no armazenamento
  meta_faturamento_pct numeric,              -- ex.: 30 = +30% ao fim do plano
  faturamento_base numeric,                  -- faturamento mensal de partida (R$)
  esforco_marca_pct int not null default 60 check (esforco_marca_pct between 0 and 100),
  como_vencer text,
  prazo_revisao_dias int not null default 2,
  plano_inclui text default '1 encontro mensal · revisão semestral · revisão de peças · contato direto com o consultor',
  proxima_fatura date,                       -- vazio = o portal não mostra fatura
  status text not null default 'ativo' check (status in ('ativo', 'pausado', 'encerrado')),
  updated_at timestamptz not null default now()
);

-- ===================== Estratégia =====================

create table if not exists public.objetivos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  nivel text not null check (nivel in ('negocio', 'marca', 'comunicacao')),
  titulo text not null default '',
  destaque text,              -- negócio: o número em destaque (ex.: "+30%")
  notar text, acreditar text, sentir text,   -- comunicação
  ordem int not null default 0
);

create table if not exists public.escolhas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  tipo text not null check (tipo in ('prioridade', 'deixa_de_lado')),
  texto text not null,
  ordem int not null default 0
);

create table if not exists public.condicoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  texto text not null,
  como_verificar text,
  status text not null default 'sem_dados' check (status in ('se_confirma', 'em_observacao', 'sem_dados', 'nao_se_confirma')),
  ordem int not null default 0
);

-- ===================== Diagnóstico =====================

create table if not exists public.diagnosticos (
  empresa_id uuid primary key references public.empresas (id) on delete cascade,
  data date,
  proximo date,
  resumo text
);

create table if not exists public.impressoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  marca_nome text not null,
  eh_cliente boolean not null default false,
  notam text, acreditam text, sentem text,
  ordem int not null default 0
);

create table if not exists public.fatores (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  tipo text not null check (tipo in ('motivador', 'discriminador')),
  texto text not null,
  posicao text not null default 'nao_entrega' check (posicao in ('entrega', 'entrega_mal', 'nao_entrega')),
  ordem int not null default 0
);

create table if not exists public.causas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  texto text not null,
  ordem int not null default 0
);

-- ===================== Plataforma de marca =====================

create table if not exists public.plataformas (
  empresa_id uuid primary key references public.empresas (id) on delete cascade,
  entregue_em date,
  posicionamento text,
  mensagem_central text,
  pdf text
);

create table if not exists public.mensagens_apoio (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  texto text not null,
  ordem int not null default 0
);

create table if not exists public.tom_atributos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  nome text not null,
  descricao text,
  ordem int not null default 0
);

create table if not exists public.tom_exemplos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  tipo text not null check (tipo in ('diz', 'nunca_diz')),
  texto text not null,
  ordem int not null default 0
);

create table if not exists public.facetas (
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  chave text not null check (chave in ('aparencia', 'personalidade', 'valores', 'relacao', 'cliente_projetado', 'autoimagem')),
  texto text,
  primary key (empresa_id, chave)
);

-- ===================== Identidade visual =====================

create table if not exists public.identidades (
  empresa_id uuid primary key references public.empresas (id) on delete cascade,
  entregue_em date,
  versao text default '1.0',
  zip text
);

create table if not exists public.arquivos_marca (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  categoria text not null check (categoria in ('logo', 'manual', 'modelo', 'papelaria')),
  nome text not null,
  descricao text,
  previa text,                                  -- imagem de prévia (logo)
  formatos jsonb not null default '[]'::jsonb,  -- [{"formato":"SVG","caminho":"..."} | {"formato":"Canva","link":"https://..."}]
  ordem int not null default 0
);

create table if not exists public.cores (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  nome text not null,
  hex text not null check (hex ~* '^#[0-9a-f]{6}$'),
  cmyk text,
  ordem int not null default 0
);

create table if not exists public.tipografias (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  nome text not null,
  uso text,
  ordem int not null default 0
);

create table if not exists public.aplicacoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  ponto_contato text not null,
  status text not null default 'prevista' check (status in ('aplicada', 'em_andamento', 'prevista')),
  data date,
  ordem int not null default 0
);

-- ===================== Execução mês a mês =====================

create table if not exists public.orientacoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  mes_ref text not null check (mes_ref ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  titulo text not null,
  texto text,
  consultor_id uuid references public.profiles (id) on delete set null,
  publicada_em timestamptz not null default now()
);

create table if not exists public.acoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  objetivo_id uuid references public.objetivos (id) on delete set null,
  mes_previsto text not null check (mes_previsto ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  titulo text not null,
  serve_para text,
  metrica_sucesso text,
  responsavel text not null default 'cliente' check (responsavel in ('cliente', 'gang', 'ambos')),
  responsavel_nome text,          -- ex.: "Marketing" → "Você · com Marketing"
  prazo date,
  status text not null default 'a_fazer' check (status in ('a_fazer', 'em_andamento', 'feita')),
  concluida_em date,
  atualizada_por uuid references public.profiles (id) on delete set null,
  atualizada_em timestamptz,
  ordem int not null default 0
);

create table if not exists public.acoes_descartadas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  texto text not null,
  ordem int not null default 0
);

create table if not exists public.sugestoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  usuario_id uuid references public.profiles (id) on delete set null,
  texto text not null,
  criada_em timestamptz not null default now(),
  status text not null default 'nova' check (status in ('nova', 'aceita', 'recusada'))
);

create table if not exists public.numeros_mensais (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  mes_ref text not null check (mes_ref ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  faturamento numeric check (faturamento >= 0),
  leads int check (leads >= 0),
  clientes_novos int check (clientes_novos >= 0),
  enviado_por uuid references public.profiles (id) on delete set null,
  enviado_em timestamptz not null default now(),
  unique (empresa_id, mes_ref)
);

create table if not exists public.metricas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  nivel text not null default 'negocio' check (nivel in ('negocio', 'marketing', 'marca')),
  nome text not null,
  frequencia text not null default 'mensal' check (frequencia in ('mensal', 'semestral', 'anual')),
  valor_atual text,
  proxima_medicao date,
  ordem int not null default 0
);

create table if not exists public.encontros (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  tipo text not null default 'mensal' check (tipo in ('mensal', 'semestral', 'anual', 'entrega')),
  inicio timestamptz not null,
  duracao_min int not null default 30,
  local_ou_link text,
  pauta jsonb not null default '[]'::jsonb,     -- ["As ações saíram no prazo?", ...]
  decisoes jsonb not null default '[]'::jsonb,
  status text not null default 'agendado' check (status in ('agendado', 'realizado', 'remarcar_solicitado')),
  remarcar_motivo text
);

create table if not exists public.pedidos_revisao (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  usuario_id uuid references public.profiles (id) on delete set null,
  tipo_peca text not null,
  titulo text,
  arquivo text,
  link text,
  pergunta text,
  enviado_em timestamptz not null default now(),
  status text not null default 'em_analise' check (status in ('em_analise', 'ajustar', 'aprovado')),
  resposta text,
  respondido_em timestamptz,
  visto_pelo_cliente boolean not null default false
);

create index if not exists acoes_empresa on public.acoes (empresa_id, mes_previsto);
create index if not exists encontros_empresa on public.encontros (empresa_id, inicio);
create index if not exists pedidos_empresa on public.pedidos_revisao (empresa_id, enviado_em desc);
create index if not exists profiles_empresa on public.profiles (empresa_id);

-- ===================== Regras de acesso (as mesmas para todas as tabelas) =====================

do $$
declare t text;
begin
  foreach t in array array[
    'empresas', 'planos', 'objetivos', 'escolhas', 'condicoes', 'diagnosticos', 'impressoes', 'fatores', 'causas',
    'plataformas', 'mensagens_apoio', 'tom_atributos', 'tom_exemplos', 'facetas',
    'identidades', 'arquivos_marca', 'cores', 'tipografias', 'aplicacoes',
    'orientacoes', 'acoes', 'acoes_descartadas', 'sugestoes', 'numeros_mensais', 'metricas', 'encontros', 'pedidos_revisao'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "ler da propria empresa" on public.%I', t);
    execute format('drop policy if exists "admin escreve" on public.%I', t);
    if t = 'empresas' then
      execute 'create policy "ler da propria empresa" on public.empresas for select using (public.pode_ver(id))';
    else
      execute format('create policy "ler da propria empresa" on public.%I for select using (public.pode_ver(empresa_id))', t);
    end if;
    -- só o consultor escreve direto; o cliente escreve pelas funções portal_*
    execute format('create policy "admin escreve" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- ===================== O que o cliente pode fazer (funções conferidas no servidor) =====================

-- o consultor do plano (nome, iniciais, foto, WhatsApp) — o cliente não lê a tabela de perfis dos outros
create or replace function public.portal_consultor()
returns table (nome text, iniciais text, foto_url text, whatsapp text, email text)
language sql stable security definer set search_path = public
as $$
  select p.name, p.iniciais, p.foto_url, p.whatsapp, p.email
  from public.planos pl join public.profiles p on p.id = pl.consultor_id
  where pl.empresa_id = public.minha_empresa();
$$;

-- muda o status de uma ação que está com o cliente
create or replace function public.portal_status_acao(p_acao uuid, p_status text)
returns void
language plpgsql security definer set search_path = public
as $$
declare a public.acoes;
begin
  if p_status not in ('a_fazer', 'em_andamento', 'feita') then raise exception 'Status inválido.'; end if;
  select * into a from public.acoes where id = p_acao;
  if a.id is null or a.empresa_id is distinct from public.minha_empresa() then raise exception 'Ação não encontrada.'; end if;
  if a.responsavel = 'gang' then raise exception 'Esta ação está com a GANG.'; end if;
  update public.acoes
     set status = p_status,
         concluida_em = case when p_status = 'feita' then coalesce(concluida_em, current_date) else null end,
         atualizada_por = auth.uid(), atualizada_em = now()
   where id = p_acao;
end;
$$;

-- envia (ou corrige) os números de um mês que já terminou.
-- Pode corrigir até o encontro seguinte ao envio começar.
alter table public.numeros_mensais add column if not exists clientes_atendidos int check (clientes_atendidos >= 0);
alter table public.numeros_mensais add column if not exists propostas int check (propostas >= 0);      -- propostas enviadas no mês
alter table public.numeros_mensais add column if not exists fechadas int check (fechadas >= 0);        -- propostas fechadas
alter table public.numeros_mensais add column if not exists sem_desconto int check (sem_desconto >= 0); -- fechadas sem pedir desconto
drop function if exists public.portal_enviar_numeros(text, numeric, int, int);
drop function if exists public.portal_enviar_numeros(text, numeric, int, int, int);
create or replace function public.portal_enviar_numeros(p_mes text, p_faturamento numeric, p_leads int, p_clientes int, p_atendidos int default null,
                                                        p_propostas int default null, p_fechadas int default null, p_sem_desconto int default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa(); ini date; atual public.numeros_mensais; prox timestamptz;
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  if p_mes !~ '^\d{4}-(0[1-9]|1[0-2])$' then raise exception 'Mês inválido.'; end if;
  if to_date(p_mes || '-01', 'YYYY-MM-DD') >= date_trunc('month', current_date) then raise exception 'Este mês ainda não terminou.'; end if;
  select inicio into ini from public.planos where empresa_id = e;
  if ini is not null and to_date(p_mes || '-01', 'YYYY-MM-DD') < date_trunc('month', ini) then raise exception 'Mês anterior ao início do plano.'; end if;
  if p_faturamento is null or p_faturamento < 0 or coalesce(p_leads, 0) < 0 or coalesce(p_clientes, 0) < 0 or coalesce(p_atendidos, 0) < 0 then raise exception 'Números inválidos.'; end if;
  if p_atendidos is not null and p_clientes is not null and p_clientes > p_atendidos then raise exception 'Os clientes novos não podem passar do total de clientes atendidos.'; end if;
  if coalesce(p_propostas, 0) < 0 or coalesce(p_fechadas, 0) < 0 or coalesce(p_sem_desconto, 0) < 0 then raise exception 'Números inválidos.'; end if;
  if p_propostas is not null and p_fechadas is not null and p_fechadas > p_propostas then raise exception 'As propostas fechadas não podem passar das enviadas.'; end if;
  if p_fechadas is not null and p_sem_desconto is not null and p_sem_desconto > p_fechadas then raise exception 'As fechadas sem desconto não podem passar das fechadas.'; end if;

  select * into atual from public.numeros_mensais where empresa_id = e and mes_ref = p_mes;
  if atual.id is not null then
    select min(inicio) into prox from public.encontros where empresa_id = e and inicio > atual.enviado_em;
    if prox is not null and now() >= prox then raise exception 'Estes números já foram usados no encontro. Fale com o consultor para corrigir.'; end if;
    update public.numeros_mensais
       set faturamento = p_faturamento, leads = p_leads, clientes_novos = p_clientes, clientes_atendidos = p_atendidos,
           propostas = p_propostas, fechadas = p_fechadas, sem_desconto = p_sem_desconto, enviado_por = auth.uid(), enviado_em = now()
     where id = atual.id;
  else
    insert into public.numeros_mensais (empresa_id, mes_ref, faturamento, leads, clientes_novos, clientes_atendidos, propostas, fechadas, sem_desconto, enviado_por)
    values (e, p_mes, p_faturamento, p_leads, p_clientes, p_atendidos, p_propostas, p_fechadas, p_sem_desconto, auth.uid());
  end if;
end;
$$;

create or replace function public.portal_sugerir_acao(p_texto text)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa();
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  if length(trim(coalesce(p_texto, ''))) < 3 then raise exception 'Escreva a sugestão.'; end if;
  insert into public.sugestoes (empresa_id, usuario_id, texto) values (e, auth.uid(), left(trim(p_texto), 2000));
end;
$$;

-- pede revisão de uma peça. O arquivo (se houver) já subiu para <empresa>/pecas/... no armazenamento
create or replace function public.portal_pedir_revisao(p_tipo text, p_titulo text, p_arquivo text, p_link text, p_pergunta text)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa();
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  if p_tipo not in ('Post para redes', 'Anúncio', 'Proposta comercial', 'Embalagem ou material impresso', 'Outro') then raise exception 'Tipo de peça inválido.'; end if;
  if coalesce(p_arquivo, '') = '' and coalesce(p_link, '') = '' then raise exception 'Envie um arquivo ou um link.'; end if;
  if coalesce(p_arquivo, '') <> '' and p_arquivo not like e::text || '/pecas/%' then raise exception 'Arquivo inválido.'; end if;
  if coalesce(p_link, '') <> '' and p_link !~* '^https?://' then raise exception 'O link precisa começar com http:// ou https://'; end if;
  insert into public.pedidos_revisao (empresa_id, usuario_id, tipo_peca, titulo, arquivo, link, pergunta)
  values (e, auth.uid(), p_tipo, left(nullif(trim(coalesce(p_titulo, '')), ''), 200), nullif(p_arquivo, ''), nullif(p_link, ''), left(coalesce(p_pergunta, ''), 4000));
end;
$$;

-- o cliente viu a resposta "ajustar" (some da lista de pendências do Início)
create or replace function public.portal_marcar_visto(p_pedido uuid)
returns void
language sql security definer set search_path = public
as $$
  update public.pedidos_revisao set visto_pelo_cliente = true
   where id = p_pedido and empresa_id = public.minha_empresa();
$$;

-- pede para remarcar um encontro (não muda a data: o consultor remarca)
create or replace function public.portal_remarcar(p_encontro uuid, p_motivo text)
returns void
language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  update public.encontros set status = 'remarcar_solicitado', remarcar_motivo = left(coalesce(p_motivo, ''), 1000)
   where id = p_encontro and empresa_id = public.minha_empresa() and status = 'agendado' and inicio > now();
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Encontro não encontrado.'; end if;
end;
$$;

-- estas funções só servem para quem está logado
do $$
declare f text;
begin
  foreach f in array array[
    'portal_consultor()', 'portal_status_acao(uuid,text)', 'portal_enviar_numeros(text,numeric,int,int,int,int,int,int)',
    'portal_sugerir_acao(text)', 'portal_pedir_revisao(text,text,text,text,text)', 'portal_marcar_visto(uuid)',
    'portal_remarcar(uuid,text)'
  ] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;

-- ===================== Arquivos (Storage) =====================
-- Um "balde" privado: cada empresa tem a própria pasta <empresa_id>/...
-- O consultor envia tudo; o cliente lê a pasta dele e só envia peças para <empresa_id>/pecas/

insert into storage.buckets (id, name, public) values ('portal', 'portal', false)
on conflict (id) do nothing;

create or replace function public.pasta_empresa(caminho text)
returns uuid
language sql immutable
as $$
  select case when split_part(caminho, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
              then split_part(caminho, '/', 1)::uuid end;
$$;

drop policy if exists "portal: ler da propria empresa" on storage.objects;
create policy "portal: ler da propria empresa" on storage.objects for select
  using (bucket_id = 'portal' and public.pode_ver(public.pasta_empresa(name)));

drop policy if exists "portal: cliente envia pecas" on storage.objects;
create policy "portal: cliente envia pecas" on storage.objects for insert
  with check (bucket_id = 'portal' and public.minha_empresa() is not null
              and public.pasta_empresa(name) = public.minha_empresa()
              and split_part(name, '/', 2) = 'pecas');

drop policy if exists "portal: admin escreve" on storage.objects;
create policy "portal: admin escreve" on storage.objects for all
  using (bucket_id = 'portal' and public.is_admin())
  with check (bucket_id = 'portal' and public.is_admin());

-- Foto do consultor: um "balde" público (a foto aparece no menu de todos os clientes dele).
-- Só o consultor (admin) envia, troca ou apaga; qualquer um com o link vê.
insert into storage.buckets (id, name, public) values ('avatares', 'avatares', true)
on conflict (id) do update set public = true;

drop policy if exists "avatares: admin escreve" on storage.objects;
create policy "avatares: admin escreve" on storage.objects for all
  using (bucket_id = 'avatares' and public.is_admin())
  with check (bucket_id = 'avatares' and public.is_admin());

-- ===================== Mensagens entre cliente e consultor =====================
-- "Falar com o consultor" no portal: a mensagem aparece no painel da GANG, que responde por ali.

create table if not exists public.mensagens (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  autor_id uuid references public.profiles (id) on delete set null,
  de text not null check (de in ('cliente', 'consultor')),
  texto text not null check (length(texto) between 1 and 4000),
  criada_em timestamptz not null default now(),
  lida boolean not null default false   -- lida pelo outro lado
);
create index if not exists mensagens_empresa on public.mensagens (empresa_id, criada_em);

alter table public.mensagens enable row level security;
drop policy if exists "ler da propria empresa" on public.mensagens;
create policy "ler da propria empresa" on public.mensagens for select using (public.pode_ver(empresa_id));
drop policy if exists "admin escreve" on public.mensagens;
create policy "admin escreve" on public.mensagens for all using (public.is_admin()) with check (public.is_admin());

-- o cliente envia uma mensagem para o consultor
create or replace function public.portal_enviar_mensagem(p_texto text)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa();
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  if length(trim(coalesce(p_texto, ''))) = 0 then raise exception 'Escreva a mensagem.'; end if;
  insert into public.mensagens (empresa_id, autor_id, de, texto) values (e, auth.uid(), 'cliente', left(trim(p_texto), 4000));
end;
$$;

-- o cliente leu as respostas do consultor
create or replace function public.portal_ler_mensagens()
returns void
language sql security definer set search_path = public
as $$
  update public.mensagens set lida = true
   where empresa_id = public.minha_empresa() and de = 'consultor' and not lida;
$$;

revoke all on function public.portal_enviar_mensagem(text) from public, anon;
revoke all on function public.portal_ler_mensagens() from public, anon;
grant execute on function public.portal_enviar_mensagem(text) to authenticated;
grant execute on function public.portal_ler_mensagens() to authenticated;

-- ===================== Aprender com os resultados (sugestões 1 a 6) =====================

-- 1. cada ação: funcionou? o que aprendemos?  ·  3. o esforço é de marca ou de venda?
alter table public.acoes add column if not exists resultado text check (resultado in ('sim', 'parcial', 'nao'));
alter table public.acoes add column if not exists aprendizado text;
alter table public.acoes add column if not exists esforco text check (esforco in ('marca', 'venda'));

-- 4. condições com dono e data de checagem
alter table public.condicoes add column if not exists dono text;
alter table public.condicoes add column if not exists checar_em date;

-- 5. revisão de peças com o checklist da plataforma; as aprovadas podem virar exemplo
alter table public.pedidos_revisao add column if not exists checklist jsonb;      -- {"cliente":true,"mensagem":false,"tom":true,"identidade":true}
alter table public.pedidos_revisao add column if not exists exemplo boolean not null default false;

-- 2. pesquisa de marca (link público, respondida pelos clientes do cliente) e participação nas buscas
create table if not exists public.pesquisas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  titulo text not null,
  categoria text not null,                          -- "empresa de reformas", usado na pergunta de lembrança
  afirmacoes jsonb not null default '[]'::jsonb,    -- ["Notei a nova identidade", ...] (nota de 1 a 5)
  concorrentes jsonb not null default '[]'::jsonb,  -- opções da pergunta de preferência, além da marca
  token uuid not null unique default gen_random_uuid(),
  aberta boolean not null default true,
  criada_em timestamptz not null default now()
);
create table if not exists public.respostas (
  id uuid primary key default gen_random_uuid(),
  pesquisa_id uuid not null references public.pesquisas (id) on delete cascade,
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  lembranca text,
  preferencia text,
  notas jsonb not null default '[]'::jsonb,
  palavra text,
  criada_em timestamptz not null default now()
);
create table if not exists public.buscas (
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  mes_ref text not null check (mes_ref ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  marca_pct numeric not null check (marca_pct between 0 and 100),   -- % das buscas da categoria que são pela marca (Google Trends)
  primary key (empresa_id, mes_ref)
);

-- 6. a voz do cliente final: frases reais, mês a mês
create table if not exists public.vozes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  autor_id uuid references public.profiles (id) on delete set null,
  mes_ref text not null check (mes_ref ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  texto text not null check (length(texto) between 1 and 1000),
  criada_em timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['pesquisas', 'respostas', 'buscas', 'vozes'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "ler da propria empresa" on public.%I', t);
    execute format('drop policy if exists "admin escreve" on public.%I', t);
    execute format('create policy "ler da propria empresa" on public.%I for select using (public.pode_ver(empresa_id))', t);
    execute format('create policy "admin escreve" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- o cliente diz se a ação dele funcionou e o que aprendeu
create or replace function public.portal_resultado_acao(p_acao uuid, p_resultado text, p_aprendizado text)
returns void
language plpgsql security definer set search_path = public
as $$
declare a public.acoes;
begin
  if p_resultado is not null and p_resultado not in ('sim', 'parcial', 'nao') then raise exception 'Resultado inválido.'; end if;
  select * into a from public.acoes where id = p_acao;
  if a.id is null or a.empresa_id is distinct from public.minha_empresa() then raise exception 'Ação não encontrada.'; end if;
  if a.responsavel = 'gang' then raise exception 'Esta ação está com a GANG.'; end if;
  if a.status <> 'feita' then raise exception 'Marque a ação como feita antes.'; end if;
  update public.acoes set resultado = p_resultado, aprendizado = left(nullif(trim(coalesce(p_aprendizado, '')), ''), 1000),
         atualizada_por = auth.uid(), atualizada_em = now()
   where id = p_acao;
end;
$$;

-- o cliente registra o que os clientes dele disseram
create or replace function public.portal_registrar_voz(p_texto text)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa();
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  if length(trim(coalesce(p_texto, ''))) = 0 then raise exception 'Escreva a frase.'; end if;
  insert into public.vozes (empresa_id, autor_id, mes_ref, texto) values (e, auth.uid(), to_char(current_date, 'YYYY-MM'), left(trim(p_texto), 1000));
end;
$$;

-- página pública da pesquisa (sem login): só o necessário para responder, e só se estiver aberta
-- ===== How Brands Grow (Sharp & Romaniuk): disponibilidade mental e ativos distintivos =====
-- situações de compra (category entry points): os momentos em que alguém pensa na categoria
create table if not exists public.situacoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  texto text not null,
  ordem int not null default 0
);
-- ativos distintivos: o que faz reconhecer a marca sem ler o nome (cor, símbolo, frase…)
create table if not exists public.ativos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  tipo text not null default 'simbolo' check (tipo in ('cor', 'simbolo', 'frase', 'personagem', 'som', 'outro')),
  nome text not null,
  texto text,          -- frase (sem o nome da marca) ou o HEX da cor
  imagem_url text,     -- imagem pública (balde "publico"), mostrada na pesquisa sem o nome da marca
  ordem int not null default 0
);
alter table public.acoes add column if not exists situacao_id uuid references public.situacoes (id) on delete set null;
alter table public.pesquisas add column if not exists situacoes jsonb not null default '[]'::jsonb;  -- [{id, texto}] no momento da rodada
alter table public.pesquisas add column if not exists ativos jsonb not null default '[]'::jsonb;     -- [{id, nome, tipo, texto, imagem_url}]
alter table public.respostas add column if not exists ceps jsonb not null default '{}'::jsonb;       -- {situacao_id: ["Marca A", ...]}
alter table public.respostas add column if not exists ativos jsonb not null default '{}'::jsonb;     -- {ativo_id: "Marca A" | "Não sei"}

do $$
declare t text;
begin
  foreach t in array array['situacoes', 'ativos'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "ler da propria empresa" on public.%I', t);
    execute format('drop policy if exists "admin escreve" on public.%I', t);
    execute format('create policy "ler da propria empresa" on public.%I for select using (public.pode_ver(empresa_id))', t);
    execute format('create policy "admin escreve" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- imagens dos ativos: balde público (aparecem na pesquisa, sem login); só o consultor envia
insert into storage.buckets (id, name, public) values ('publico', 'publico', true)
on conflict (id) do update set public = true;
drop policy if exists "publico: admin escreve" on storage.objects;
create policy "publico: admin escreve" on storage.objects for all
  using (bucket_id = 'publico' and public.is_admin())
  with check (bucket_id = 'publico' and public.is_admin());

alter table public.respostas add column if not exists frase text;        -- a frase que a pessoa escolheu para descrever a marca
alter table public.respostas add column if not exists entende boolean;    -- escolheu a mensagem central?

create or replace function public.pesquisa_publica(p_token uuid)
returns json
language sql stable security definer set search_path = public
as $$
  select json_build_object('titulo', p.titulo, 'categoria', p.categoria, 'afirmacoes', p.afirmacoes,
                           'opcoes', (select jsonb_build_array(e.nome) || p.concorrentes), 'marca', e.nome,
                           'situacoes', p.situacoes,
                           'frases', (select case when coalesce(pl.mensagem_central, '') = '' then '[]'::jsonb
                                        else jsonb_build_array(pl.mensagem_central, 'Oferece o menor preço da região.', 'Faz de tudo um pouco, como as outras.') end
                                        from public.plataformas pl where pl.empresa_id = e.id),
                           'ativos', (select coalesce(jsonb_agg(jsonb_build_object('id', a ->> 'id', 'tipo', a ->> 'tipo', 'texto', a ->> 'texto', 'imagem_url', a ->> 'imagem_url')), '[]'::jsonb)
                                        from jsonb_array_elements(p.ativos) a))
    from public.pesquisas p join public.empresas e on e.id = p.empresa_id
   where p.token = p_token and p.aberta;
$$;

drop function if exists public.pesquisa_responder(uuid, text, text, jsonb, text);
drop function if exists public.pesquisa_responder(uuid, text, text, jsonb, text, jsonb, jsonb);
create or replace function public.pesquisa_responder(p_token uuid, p_lembranca text, p_preferencia text, p_notas jsonb, p_palavra text,
                                                     p_ceps jsonb default '{}'::jsonb, p_ativos jsonb default '{}'::jsonb, p_frase text default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare p public.pesquisas; n int; i int;
begin
  select * into p from public.pesquisas where token = p_token and aberta;
  if p.id is null then raise exception 'Esta pesquisa não está aberta.'; end if;
  n := jsonb_array_length(p.afirmacoes);
  if jsonb_typeof(p_notas) <> 'array' or jsonb_array_length(p_notas) <> n then raise exception 'Responda todas as frases.'; end if;
  for i in 0 .. n - 1 loop
    if jsonb_typeof(p_notas -> i) <> 'number' or (p_notas ->> i)::int not between 1 and 5 then raise exception 'Notas de 1 a 5.'; end if;
  end loop;
  if jsonb_typeof(coalesce(p_ceps, '{}')) <> 'object' or jsonb_typeof(coalesce(p_ativos, '{}')) <> 'object' then raise exception 'Respostas inválidas.'; end if;
  if length(coalesce(p_ceps, '{}')::text) > 20000 or length(coalesce(p_ativos, '{}')::text) > 5000 then raise exception 'Respostas grandes demais.'; end if;
  insert into public.respostas (pesquisa_id, empresa_id, lembranca, preferencia, notas, palavra, ceps, ativos, frase, entende)
  values (p.id, p.empresa_id, left(coalesce(p_lembranca, ''), 300), left(coalesce(p_preferencia, ''), 120), p_notas, left(coalesce(p_palavra, ''), 60),
          coalesce(p_ceps, '{}'), coalesce(p_ativos, '{}'), left(p_frase, 300),
          case when p_frase is null then null
               else p_frase = (select mensagem_central from public.plataformas where empresa_id = p.empresa_id) end);
end;
$$;

revoke all on function public.portal_resultado_acao(uuid, text, text) from public, anon;
revoke all on function public.portal_registrar_voz(text) from public, anon;
grant execute on function public.portal_resultado_acao(uuid, text, text) to authenticated;
grant execute on function public.portal_registrar_voz(text) to authenticated;
grant execute on function public.pesquisa_publica(uuid) to anon, authenticated;
grant execute on function public.pesquisa_responder(uuid, text, text, jsonb, text, jsonb, jsonb, text) to anon, authenticated;

-- ===================== Tipo de plano =====================
-- consultoria: acompanhamento mensal completo · acesso: o cliente paga só para acessar o material da marca
alter table public.planos add column if not exists tipo text not null default 'consultoria' check (tipo in ('consultoria', 'acesso'));

-- o cliente cancela uma mensagem que mandou e que o consultor ainda não leu
create or replace function public.portal_cancelar_mensagem(p_mensagem uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  delete from public.mensagens
   where id = p_mensagem and empresa_id = public.minha_empresa() and de = 'cliente' and autor_id = auth.uid() and not lida;
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Esta mensagem já foi lida e não pode mais ser cancelada.'; end if;
end;
$$;
revoke all on function public.portal_cancelar_mensagem(uuid) from public, anon;
grant execute on function public.portal_cancelar_mensagem(uuid) to authenticated;

-- Pantone de cada cor da identidade (ex.: "Pantone 172 C")
alter table public.cores add column if not exists pantone text;

-- ===================== Foto do cliente =====================
-- cada pessoa envia a própria foto para avatares/<seu id>/...; o perfil guarda o link público
drop policy if exists "avatares: cada um a sua pasta" on storage.objects;
create policy "avatares: cada um a sua pasta" on storage.objects for all
  using (bucket_id = 'avatares' and split_part(name, '/', 1) = auth.uid()::text)
  with check (bucket_id = 'avatares' and split_part(name, '/', 1) = auth.uid()::text);

create or replace function public.portal_minha_foto(p_url text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Sem permissão.'; end if;
  if p_url is not null and position('/storage/v1/object/public/avatares/' || auth.uid()::text || '/' in p_url) = 0 then
    raise exception 'Foto inválida.';
  end if;
  update public.profiles set foto_url = p_url where id = auth.uid();
end;
$$;
revoke all on function public.portal_minha_foto(text) from public, anon;
grant execute on function public.portal_minha_foto(text) to authenticated;

-- ===================== Caminho até o objetivo =====================
-- quanto cada ação importa para o objetivo e por quê (aparece na tela Caminho do cliente)
alter table public.acoes add column if not exists peso text not null default 'ajuda' check (peso in ('essencial', 'ajuda', 'reforco'));
alter table public.acoes add column if not exists porque text;

-- valor mensal da consultoria (para o cliente ver quanto o plano devolveu: "O plano pagou?")
alter table public.planos add column if not exists mensalidade numeric check (mensalidade >= 0);

-- qual parte da promessa a ação move: venda mais, para mais pessoas ou com mais valor
alter table public.acoes add column if not exists promessa text check (promessa in ('vendas', 'pessoas', 'valor'));

-- veredito do mês (uma frase do consultor no topo de Resultados) e o porquê de cada número da promessa que cair
alter table public.orientacoes add column if not exists veredito text check (length(veredito) <= 300);
alter table public.orientacoes add column if not exists nota_vendas text check (length(nota_vendas) <= 300);
alter table public.orientacoes add column if not exists nota_pessoas text check (length(nota_pessoas) <= 300);
alter table public.orientacoes add column if not exists nota_valor text check (length(nota_valor) <= 300);

-- observação do consultor para o cliente, em cada ação (aparece no cartão da ação, no portal)
alter table public.acoes add column if not exists observacao text check (length(observacao) <= 1000);

-- qual causa do diagnóstico a ação ataca (o painel avisa quando alguma causa fica sem ação)
alter table public.acoes add column if not exists causa_id uuid references public.causas (id) on delete set null;

-- cliente que combinou não enviar os números do mês: o painel e o portal param de cobrar e de avisar
alter table public.planos add column if not exists sem_numeros boolean not null default false;

-- ===================== Ações com passos, tamanho, leitura e "travada" =====================
-- passos: a checklist da ação ([{"t": "texto", "ok": false}]); o cliente marca cada passo
alter table public.acoes add column if not exists passos jsonb not null default '[]'::jsonb;
-- tamanho: P (até 1 hora), M (até 1 dia), G (uma semana ou mais); o painel avisa quando o mês fica pesado
alter table public.acoes add column if not exists tamanho text check (tamanho in ('P', 'M', 'G'));
-- quantos dias depois de feita a métrica de sucesso deve ser lida (o Fechamento lembra o consultor)
alter table public.acoes add column if not exists ler_em_dias int check (ler_em_dias between 1 and 365);
-- mensagem pronta para o cliente usar (pedir avaliação, indicação, depoimento…)
alter table public.acoes add column if not exists modelo text check (length(modelo) <= 2000);
-- ação travada: o cliente diz o motivo em vez de deixar atrasar em silêncio
alter table public.acoes add column if not exists travada text check (travada in ('tempo', 'verba', 'duvida', 'outro'));
alter table public.acoes add column if not exists travada_nota text check (length(travada_nota) <= 500);
-- setor do cliente: as sugestões de ação mostram primeiro as que servem para ele
alter table public.empresas add column if not exists setor text check (setor in ('servicos', 'varejo', 'b2b'));

-- o cliente marca ou desmarca um passo da ação
create or replace function public.portal_passo_acao(p_acao uuid, p_i int, p_ok boolean)
returns void
language plpgsql security definer set search_path = public
as $$
declare a public.acoes;
begin
  select * into a from public.acoes where id = p_acao;
  if a.id is null or a.empresa_id is distinct from public.minha_empresa() then raise exception 'Ação não encontrada.'; end if;
  if a.responsavel = 'gang' then raise exception 'Esta ação está com a GANG.'; end if;
  if p_i < 0 or p_i >= jsonb_array_length(a.passos) then raise exception 'Passo inválido.'; end if;
  update public.acoes
     set passos = jsonb_set(passos, array[p_i::text, 'ok'], to_jsonb(coalesce(p_ok, false))),
         status = case when status = 'a_fazer' and p_ok then 'em_andamento' else status end,
         atualizada_por = auth.uid(), atualizada_em = now()
   where id = p_acao;
end;
$$;

-- o cliente diz que a ação travou (e por quê), ou destrava (p_motivo nulo)
create or replace function public.portal_trava_acao(p_acao uuid, p_motivo text, p_nota text)
returns void
language plpgsql security definer set search_path = public
as $$
declare a public.acoes;
begin
  if p_motivo is not null and p_motivo not in ('tempo', 'verba', 'duvida', 'outro') then raise exception 'Motivo inválido.'; end if;
  select * into a from public.acoes where id = p_acao;
  if a.id is null or a.empresa_id is distinct from public.minha_empresa() then raise exception 'Ação não encontrada.'; end if;
  if a.responsavel = 'gang' then raise exception 'Esta ação está com a GANG.'; end if;
  update public.acoes
     set travada = p_motivo, travada_nota = case when p_motivo is null then null else left(nullif(trim(coalesce(p_nota, '')), ''), 500) end,
         atualizada_por = auth.uid(), atualizada_em = now()
   where id = p_acao;
end;
$$;

-- mudar o andamento destrava a ação
create or replace function public.portal_status_acao(p_acao uuid, p_status text)
returns void
language plpgsql security definer set search_path = public
as $$
declare a public.acoes;
begin
  if p_status not in ('a_fazer', 'em_andamento', 'feita') then raise exception 'Status inválido.'; end if;
  select * into a from public.acoes where id = p_acao;
  if a.id is null or a.empresa_id is distinct from public.minha_empresa() then raise exception 'Ação não encontrada.'; end if;
  if a.responsavel = 'gang' then raise exception 'Esta ação está com a GANG.'; end if;
  update public.acoes
     set status = p_status, travada = null, travada_nota = null,
         concluida_em = case when p_status = 'feita' then coalesce(concluida_em, current_date) else null end,
         atualizada_por = auth.uid(), atualizada_em = now()
   where id = p_acao;
end;
$$;

revoke all on function public.portal_passo_acao(uuid, int, boolean) from public, anon;
revoke all on function public.portal_trava_acao(uuid, text, text) from public, anon;
grant execute on function public.portal_passo_acao(uuid, int, boolean) to authenticated;
grant execute on function public.portal_trava_acao(uuid, text, text) to authenticated;

-- ===================== Medição mais fiel à evidência =====================
-- pesquisa: quem respondeu já é cliente? (a lembrança entre quem ainda não compra é o número que mostra crescimento)
alter table public.respostas add column if not exists ja_cliente boolean;
-- sazonalidade: faturamento de cada mês do ano anterior ao plano ({"01": 95000, ..., "12": 120000}); "O plano pagou?" compara mês com mês
alter table public.planos add column if not exists fat_ano_anterior jsonb not null default '{}'::jsonb;
-- participação de mercado estimada pelo consultor (%): comparada com a participação nas buscas, mostra se a marca fala acima do tamanho
alter table public.planos add column if not exists participacao_mercado numeric check (participacao_mercado between 0 and 100);

-- disponibilidade física: é fácil encontrar e comprar? checklist do consultor, a cada 6 meses
create table if not exists public.disponibilidade (
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  mes_ref text not null check (mes_ref ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  itens jsonb not null default '{}'::jsonb,   -- {"google": true, "resposta": false, ...}
  nota int not null check (nota between 0 and 100),
  primary key (empresa_id, mes_ref)
);
alter table public.disponibilidade enable row level security;
drop policy if exists "ler da propria empresa" on public.disponibilidade;
drop policy if exists "admin escreve" on public.disponibilidade;
create policy "ler da propria empresa" on public.disponibilidade for select using (public.pode_ver(empresa_id));
create policy "admin escreve" on public.disponibilidade for all using (public.is_admin()) with check (public.is_admin());

-- a pesquisa pública agora pergunta, no fim, se a pessoa já é cliente (no fim para não lembrar o nome antes da lembrança espontânea)
drop function if exists public.pesquisa_responder(uuid, text, text, jsonb, text, jsonb, jsonb, text);
create or replace function public.pesquisa_responder(p_token uuid, p_lembranca text, p_preferencia text, p_notas jsonb, p_palavra text,
                                                     p_ceps jsonb default '{}'::jsonb, p_ativos jsonb default '{}'::jsonb, p_frase text default null,
                                                     p_ja_cliente boolean default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare p public.pesquisas; n int; i int;
begin
  select * into p from public.pesquisas where token = p_token and aberta;
  if p.id is null then raise exception 'Esta pesquisa não está aberta.'; end if;
  n := jsonb_array_length(p.afirmacoes);
  if jsonb_typeof(p_notas) <> 'array' or jsonb_array_length(p_notas) <> n then raise exception 'Responda todas as frases.'; end if;
  for i in 0 .. n - 1 loop
    if jsonb_typeof(p_notas -> i) <> 'number' or (p_notas ->> i)::int not between 1 and 5 then raise exception 'Notas de 1 a 5.'; end if;
  end loop;
  if jsonb_typeof(coalesce(p_ceps, '{}')) <> 'object' or jsonb_typeof(coalesce(p_ativos, '{}')) <> 'object' then raise exception 'Respostas inválidas.'; end if;
  if length(coalesce(p_ceps, '{}')::text) > 20000 or length(coalesce(p_ativos, '{}')::text) > 5000 then raise exception 'Respostas grandes demais.'; end if;
  insert into public.respostas (pesquisa_id, empresa_id, lembranca, preferencia, notas, palavra, ceps, ativos, frase, entende, ja_cliente)
  values (p.id, p.empresa_id, left(coalesce(p_lembranca, ''), 300), left(coalesce(p_preferencia, ''), 120), p_notas, left(coalesce(p_palavra, ''), 60),
          coalesce(p_ceps, '{}'), coalesce(p_ativos, '{}'), left(p_frase, 300),
          case when p_frase is null then null
               else p_frase = (select mensagem_central from public.plataformas where empresa_id = p.empresa_id) end,
          p_ja_cliente);
end;
$$;
grant execute on function public.pesquisa_responder(uuid, text, text, jsonb, text, jsonb, jsonb, text, boolean) to anon, authenticated;

-- ===================== Acesso ao consultor: o encontro é o lugar dele =====================
-- dúvidas e ideias do cliente vão para a pauta do próximo encontro (não viram mensagem avulsa)
alter table public.sugestoes add column if not exists tipo text not null default 'ideia' check (tipo in ('ideia', 'duvida'));
alter table public.sugestoes add column if not exists acao_id uuid references public.acoes (id) on delete set null;
-- em que dias o consultor responde mensagens, e quantas revisões de peça o plano inclui por mês
alter table public.planos add column if not exists dias_resposta text not null default 'terças e quintas' check (length(dias_resposta) <= 60);
alter table public.planos add column if not exists revisoes_mes int not null default 2 check (revisoes_mes between 0 and 50);

-- o cliente leva uma dúvida para o encontro (opcionalmente sobre uma ação dele)
create or replace function public.portal_levar_encontro(p_texto text, p_acao uuid default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa(); a public.acoes;
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  if length(trim(coalesce(p_texto, ''))) < 3 then raise exception 'Escreva a dúvida.'; end if;
  if p_acao is not null then
    select * into a from public.acoes where id = p_acao;
    if a.id is null or a.empresa_id is distinct from e then raise exception 'Ação não encontrada.'; end if;
  end if;
  insert into public.sugestoes (empresa_id, usuario_id, texto, tipo, acao_id) values (e, auth.uid(), left(trim(p_texto), 2000), 'duvida', p_acao);
end;
$$;
revoke all on function public.portal_levar_encontro(text, uuid) from public, anon;
grant execute on function public.portal_levar_encontro(text, uuid) to authenticated;

-- revisão de peças: respeita o limite do plano no mês
create or replace function public.portal_pedir_revisao(p_tipo text, p_titulo text, p_arquivo text, p_link text, p_pergunta text)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa(); lim int; usadas int;
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  if p_tipo not in ('Post para redes', 'Anúncio', 'Proposta comercial', 'Embalagem ou material impresso', 'Outro') then raise exception 'Tipo de peça inválido.'; end if;
  if coalesce(p_arquivo, '') = '' and coalesce(p_link, '') = '' then raise exception 'Envie um arquivo ou um link.'; end if;
  if coalesce(p_arquivo, '') <> '' and p_arquivo not like e::text || '/pecas/%' then raise exception 'Arquivo inválido.'; end if;
  if coalesce(p_link, '') <> '' and p_link !~* '^https?://' then raise exception 'O link precisa começar com http:// ou https://'; end if;
  select coalesce(revisoes_mes, 2) into lim from public.planos where empresa_id = e;
  select count(*) into usadas from public.pedidos_revisao where empresa_id = e and enviado_em >= date_trunc('month', now());
  if usadas >= coalesce(lim, 2) then raise exception 'As revisões incluídas neste mês já foram usadas.'; end if;
  insert into public.pedidos_revisao (empresa_id, usuario_id, tipo_peca, titulo, arquivo, link, pergunta)
  values (e, auth.uid(), p_tipo, left(nullif(trim(coalesce(p_titulo, '')), ''), 200), nullif(p_arquivo, ''), nullif(p_link, ''), left(coalesce(p_pergunta, ''), 4000));
end;
$$;

-- ===================== Ponto de partida informado pelo cliente =====================
-- Quando o consultor não preencheu o faturamento de partida, o cliente informa no mês 1:
-- a média mensal dos 12 meses antes do plano e, se souber, cada mês do ano anterior (sazonalidade).
-- O cliente pode corrigir enquanto o valor for dele; quando o consultor ajusta no painel, o valor passa a ser do consultor.
alter table public.planos add column if not exists partida_cliente boolean not null default false;

create or replace function public.portal_ponto_partida(p_base numeric, p_ano jsonb default '{}'::jsonb)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa(); pl public.planos; k text; v jsonb; ano jsonb := '{}'::jsonb;
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  select * into pl from public.planos where empresa_id = e;
  if pl.empresa_id is null then raise exception 'O plano ainda não foi cadastrado.'; end if;
  if pl.faturamento_base is not null and not pl.partida_cliente then raise exception 'O ponto de partida já foi definido pelo consultor.'; end if;
  -- 0 = empresa nova, ainda sem faturamento (marcado de propósito no portal); fora isso, a partir de R$ 100
  if p_base is null or (p_base <> 0 and p_base < 100) or p_base > 10000000000 then raise exception 'Informe um faturamento mensal válido.'; end if;
  for k, v in select * from jsonb_each(coalesce(p_ano, '{}'::jsonb)) loop
    if k !~ '^(0[1-9]|1[0-2])$' then raise exception 'Mês inválido.'; end if;
    if jsonb_typeof(v) <> 'number' or (v #>> '{}')::numeric < 0 or (v #>> '{}')::numeric > 10000000000 then raise exception 'Valor inválido.'; end if;
    ano := ano || jsonb_build_object(k, v);
  end loop;
  update public.planos set faturamento_base = round(p_base, 2), fat_ano_anterior = ano, partida_cliente = true where empresa_id = e;
end;
$$;
grant execute on function public.portal_ponto_partida(numeric, jsonb) to authenticated;

-- ===================== Adiantar uma ação =====================
-- Quem termina as ações do mês pode puxar uma do mês seguinte. A ação guarda o mês de onde veio (adiantada_de);
-- o painel do consultor repõe outra ação nesse mês (reposta), para o plano não acabar antes do fim.
alter table public.acoes add column if not exists adiantada_de text check (adiantada_de ~ '^\d{4}-(0[1-9]|1[0-2])$');
alter table public.acoes add column if not exists reposta boolean not null default false;

create or replace function public.portal_adiantar_acao(p_acao uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare e uuid := public.minha_empresa(); a public.acoes; agora text := to_char(current_date, 'YYYY-MM');
        prox text := to_char(current_date + interval '1 month', 'YYYY-MM'); fim date := (date_trunc('month', current_date) + interval '1 month - 1 day')::date; n int;
begin
  if e is null then raise exception 'Sem permissão.'; end if;
  select * into a from public.acoes where id = p_acao and empresa_id = e;
  if a.id is null then raise exception 'Ação não encontrada.'; end if;
  if a.responsavel = 'gang' or a.status <> 'a_fazer' or a.mes_previsto <> prox then raise exception 'Só dá para adiantar uma ação do próximo mês que ainda não começou.'; end if;
  -- só quem já terminou as ações do mês (as suas) pode adiantar
  select count(*) into n from public.acoes where empresa_id = e and responsavel <> 'gang' and status <> 'feita' and mes_previsto <= agora;
  if n > 0 then raise exception 'Termine as ações deste mês antes de adiantar.'; end if;
  update public.acoes
     set mes_previsto = agora, adiantada_de = prox, reposta = false,
         prazo = greatest(current_date + 1, least(fim, current_date + case a.tamanho when 'G' then 14 when 'M' then 7 else 3 end)),
         atualizada_por = auth.uid(), atualizada_em = now()
   where id = a.id;
end;
$$;
grant execute on function public.portal_adiantar_acao(uuid) to authenticated;

-- ===================== Ação nova no plano =====================
-- criada_em: quando a ação entrou (as que já existiam ficam sem data e não aparecem como novas);
-- vista_em: quando o cliente abriu a ação pela primeira vez. O portal mostra "Novo" até ele abrir.
alter table public.acoes add column if not exists criada_em timestamptz;
alter table public.acoes alter column criada_em set default now();
alter table public.acoes add column if not exists vista_em timestamptz;

create or replace function public.portal_ver_acao(p_acao uuid)
returns void
language sql security definer set search_path = public
as $$
  update public.acoes set vista_em = now()
   where id = p_acao and empresa_id = public.minha_empresa() and vista_em is null;
$$;
grant execute on function public.portal_ver_acao(uuid) to authenticated;

-- ===================== Elementos da identidade (degradê, textura, mascote, embalagem…) =====================
-- Só aparecem para o cliente os que o consultor cadastrar.
create table if not exists public.elementos_marca (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  tipo text not null default 'outro' check (tipo in ('degrade', 'textura', 'mascote', 'personagem', 'embalagem', 'simbolo', 'ilustracao',
    'icones', 'foto', 'forma', 'fonte_propria', 'som', 'cheiro', 'outro')),
  nome text not null,
  descricao text,      -- como usar
  cores text,          -- degradê: "#E5482A, #FFB36B" (da primeira à última)
  imagem text,         -- caminho no balde privado "portal"
  ordem int not null default 0
);
alter table public.elementos_marca enable row level security;
drop policy if exists "ler da propria empresa" on public.elementos_marca;
drop policy if exists "admin escreve" on public.elementos_marca;
create policy "ler da propria empresa" on public.elementos_marca for select using (public.pode_ver(empresa_id));
create policy "admin escreve" on public.elementos_marca for all using (public.is_admin()) with check (public.is_admin());

-- ===================== Ações dos meses futuros ficam com o consultor =====================
-- O cliente lê as ações até o mês seguinte; das que vêm depois, só a contagem por mês (portal_acoes_futuras).
-- Assim ninguém copia o plano inteiro de uma vez.
drop policy if exists "ler da propria empresa" on public.acoes;
create policy "ler da propria empresa" on public.acoes for select using (
  public.pode_ver(empresa_id)
  and (public.is_admin() or mes_previsto <= to_char((now() at time zone 'America/Sao_Paulo') + interval '1 month', 'YYYY-MM'))
);

create or replace function public.portal_acoes_futuras()
returns table (mes_previsto text, n int, essenciais int)
language sql stable security definer set search_path = public
as $$
  select a.mes_previsto, count(*)::int, count(*) filter (where a.peso = 'essencial')::int
    from public.acoes a
   where a.empresa_id = public.minha_empresa()
     and a.mes_previsto > to_char((now() at time zone 'America/Sao_Paulo') + interval '1 month', 'YYYY-MM')
     and a.status <> 'feita'
   group by a.mes_previsto
   order by a.mes_previsto;
$$;
grant execute on function public.portal_acoes_futuras() to authenticated;

-- ===================== Identidade central (de 2 a 4 ideias que não mudam) =====================
create table if not exists public.identidade_central (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  texto text not null,
  explicacao text,
  ordem int not null default 0
);
alter table public.identidade_central enable row level security;
drop policy if exists "ler da propria empresa" on public.identidade_central;
drop policy if exists "admin escreve" on public.identidade_central;
create policy "ler da propria empresa" on public.identidade_central for select using (public.pode_ver(empresa_id));
create policy "admin escreve" on public.identidade_central for all using (public.is_admin()) with check (public.is_admin());

-- ===================== Lembretes por e-mail (função diária api/lembretes.js no Vercel) =====================
-- O cliente pode desligar em "Sua foto e avisos". Cada aviso é enviado uma vez só (chave única por pessoa).
alter table public.profiles add column if not exists aceita_lembretes boolean not null default true;
create table if not exists public.lembretes_enviados (
  perfil_id uuid not null references public.profiles (id) on delete cascade,
  empresa_id uuid references public.empresas (id) on delete cascade,
  chave text not null,
  assunto text,
  enviado_em timestamptz not null default now(),
  primary key (perfil_id, chave)
);
alter table public.lembretes_enviados enable row level security;
drop policy if exists "consultor le" on public.lembretes_enviados;
create policy "consultor le" on public.lembretes_enviados for select using (public.is_admin());

create or replace function public.portal_lembretes(p_on boolean)
returns void
language sql security definer set search_path = public
as $$ update public.profiles set aceita_lembretes = coalesce(p_on, true) where id = auth.uid(); $$;
grant execute on function public.portal_lembretes(boolean) to authenticated;

-- ===================== Estratégia pelo cerne: o desafio, a abordagem (como_vencer) e o próximo marco =====================
alter table public.planos add column if not exists desafio text;             -- o diagnóstico: o obstáculo principal que a estratégia precisa vencer
alter table public.planos add column if not exists objetivo_proximo text;    -- o próximo marco: algo alcançável que destrava o resto
alter table public.planos add column if not exists objetivo_proximo_ate date;

-- ===================== Pesquisa de marca: quem responde e como pergunta =====================
-- 1) triagem pelo comportamento: quando a pessoa comprou a categoria pela última vez (quem nunca comprou não é o mercado)
-- 2) de quem comprou na última vez: um fato do passado, mais confiável do que "escolheria hoje"
alter table public.respostas add column if not exists recencia text check (recencia in ('3m', '12m', 'mais', 'nunca'));
alter table public.respostas add column if not exists ultima text;

drop function if exists public.pesquisa_responder(uuid, text, text, jsonb, text, jsonb, jsonb, text, boolean);
create or replace function public.pesquisa_responder(p_token uuid, p_lembranca text, p_preferencia text, p_notas jsonb, p_palavra text,
                                                     p_ceps jsonb default '{}'::jsonb, p_ativos jsonb default '{}'::jsonb, p_frase text default null,
                                                     p_ja_cliente boolean default null, p_recencia text default null, p_ultima text default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare p public.pesquisas; n int; i int;
begin
  select * into p from public.pesquisas where token = p_token and aberta;
  if p.id is null then raise exception 'Esta pesquisa não está aberta.'; end if;
  n := jsonb_array_length(p.afirmacoes);
  if jsonb_typeof(p_notas) <> 'array' or jsonb_array_length(p_notas) <> n then raise exception 'Responda todas as frases.'; end if;
  for i in 0 .. n - 1 loop
    if jsonb_typeof(p_notas -> i) <> 'number' or (p_notas ->> i)::int not between 1 and 5 then raise exception 'Notas de 1 a 5.'; end if;
  end loop;
  if jsonb_typeof(coalesce(p_ceps, '{}')) <> 'object' or jsonb_typeof(coalesce(p_ativos, '{}')) <> 'object' then raise exception 'Respostas inválidas.'; end if;
  if length(coalesce(p_ceps, '{}')::text) > 20000 or length(coalesce(p_ativos, '{}')::text) > 5000 then raise exception 'Respostas grandes demais.'; end if;
  if p_recencia is not null and p_recencia not in ('3m', '12m', 'mais', 'nunca') then raise exception 'Resposta inválida.'; end if;
  insert into public.respostas (pesquisa_id, empresa_id, lembranca, preferencia, notas, palavra, ceps, ativos, frase, entende, ja_cliente, recencia, ultima)
  values (p.id, p.empresa_id, left(coalesce(p_lembranca, ''), 300), left(coalesce(p_preferencia, ''), 120), p_notas, left(coalesce(p_palavra, ''), 60),
          coalesce(p_ceps, '{}'), coalesce(p_ativos, '{}'), left(p_frase, 300),
          case when p_frase is null then null
               else p_frase = (select mensagem_central from public.plataformas where empresa_id = p.empresa_id) end,
          p_ja_cliente, p_recencia, left(p_ultima, 120));
end;
$$;
grant execute on function public.pesquisa_responder(uuid, text, text, jsonb, text, jsonb, jsonb, text, boolean, text, text) to anon, authenticated;

-- 3) a pergunta "qual frase descreve a marca" compara a mensagem central com o que os concorrentes passam (do Diagnóstico),
--    e não com frases que ninguém escolheria; sem concorrentes cadastrados, ficam as alternativas genéricas
create or replace function public.pesquisa_publica(p_token uuid)
returns json
language sql stable security definer set search_path = public
as $$
  select json_build_object('titulo', p.titulo, 'categoria', p.categoria, 'afirmacoes', p.afirmacoes,
                           'opcoes', (select jsonb_build_array(e.nome) || p.concorrentes), 'marca', e.nome,
                           'situacoes', p.situacoes,
                           'frases', (select case when coalesce(pl.mensagem_central, '') = '' then '[]'::jsonb
                                        else jsonb_build_array(pl.mensagem_central) || coalesce(
                                          (select case when count(*) >= 2 then jsonb_agg(x.t) end
                                             from (select distinct i.acreditam as t from public.impressoes i
                                                    where i.empresa_id = e.id and not i.eh_cliente and coalesce(trim(i.acreditam), '') <> ''
                                                      and i.acreditam <> pl.mensagem_central limit 3) x),
                                          jsonb_build_array('Oferece o menor preço da região.', 'Faz de tudo um pouco, como as outras.')) end
                                        from public.plataformas pl where pl.empresa_id = e.id),
                           'ativos', (select coalesce(jsonb_agg(jsonb_build_object('id', a ->> 'id', 'tipo', a ->> 'tipo', 'texto', a ->> 'texto', 'imagem_url', a ->> 'imagem_url')), '[]'::jsonb)
                                        from jsonb_array_elements(p.ativos) a))
    from public.pesquisas p join public.empresas e on e.id = p.empresa_id
   where p.token = p_token and p.aberta;
$$;
grant execute on function public.pesquisa_publica(uuid) to anon, authenticated;

-- ===================== Plano pela estratégia =====================
-- a ação guarda qual abordagem ela executa (nome curto), para o consultor e o cliente verem a ligação com a estratégia
alter table public.acoes add column if not exists executa text;

-- ===================== Equilíbrio pelos estudos de eficácia =====================
-- tipo de esforço da ação: marca (comunicação de longo prazo), ativação (comunicação de curto prazo) ou base (proposta, preço,
-- atendimento, processo e medição, que ficam fora da conta marca × ativação)
alter table public.acoes add column if not exists tipo text check (tipo in ('marca', 'ativacao', 'base'));
