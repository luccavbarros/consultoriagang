-- GANG — login areas (admin panel + client area)
-- Run once in Supabase: SQL Editor → New query → paste everything → Run.

-- One profile per account: who the person is and which area they open
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  company text,
  role text not null default 'client' check (role in ('admin', 'client')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- true when whoever is logged in is an active admin (security definer: reads profiles without tripping its own rules)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and active);
$$;

-- each person reads their own profile; the admin reads and edits all of them.
-- Nobody creates or deletes profiles from the browser: accounts are made by the admin through /api/admin-users
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using (id = auth.uid());

drop policy if exists "admin reads all" on public.profiles;
create policy "admin reads all" on public.profiles for select using (public.is_admin());

drop policy if exists "admin updates all" on public.profiles;
create policy "admin updates all" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- every new account gets its profile automatically (as a client)
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, company)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'company');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ===== Step 2 (run after creating your own user in Authentication → Users) =====
-- Swap the e-mail for the one you used, then run just this line:
-- update public.profiles set role = 'admin' where email = 'SEU_EMAIL_AQUI';
