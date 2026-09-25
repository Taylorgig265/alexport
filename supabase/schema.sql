-- ============================================================================
-- Alexander Daudi — Portfolio schema (Supabase / Postgres)
-- Run this file in the Supabase SQL Editor BEFORE running seed.sql.
-- ============================================================================

-- ---------------------------------------------------------------- profiles --
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text not null default '',
  headline      text not null default '',
  email         text not null default '',
  phone         text not null default '',
  location      text not null default '',
  bio           text not null default '',
  availability  text not null default 'Available for new opportunities',
  github_url    text,
  linkedin_url  text,
  twitter_url   text,
  resume_url    text,
  avatar_url    text,
  role          text not null default 'editor' check (role in ('admin', 'editor')),
  updated_at    timestamptz not null default now()
);

-- -------------------------------------------------------------- experience --
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  company     text not null,
  role        text not null,
  period      text not null default '',
  summary     text not null default '',
  bullets     text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  constraint experiences_company_role_key unique (company, role)
);

-- ------------------------------------------------------------------ skills --
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,
  level       int check (level is null or (level >= 1 and level <= 100)),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  constraint skills_name_category_key unique (name, category)
);

-- ---------------------------------------------------------------- projects --
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null unique,
  description text not null default '',
  tech        text[] not null default '{}',
  url         text,
  image_url   text,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- --------------------------------------------------------------- education --
create table if not exists public.education (
  id           uuid primary key default gen_random_uuid(),
  institution  text not null,
  qualification text not null,
  period       text not null default '',
  details      text not null default '',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  constraint education_institution_qualification_key unique (institution, qualification)
);

-- ------------------------------------------------------------------ helper --
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Keep profiles.updated_at fresh.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile for every new auth user. The first account listed below is
-- promoted to admin automatically — change the email if you use a different one.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    new.email,
    case when lower(new.email) = 'alexdaud17@gmail.com' then 'admin' else 'editor' end
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------------- RLS --
alter table public.profiles    enable row level security;
alter table public.experiences enable row level security;
alter table public.skills      enable row level security;
alter table public.projects    enable row level security;
alter table public.education   enable row level security;

-- profiles
drop policy if exists "Public can view profiles" on public.profiles;
create policy "Public can view profiles" on public.profiles
  for select using (true);

drop policy if exists "Admins can insert profiles" on public.profiles;
create policy "Admins can insert profiles" on public.profiles
  for insert with check (public.is_admin());

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles" on public.profiles
  for delete using (public.is_admin());

-- experiences
drop policy if exists "Public can view experiences" on public.experiences;
create policy "Public can view experiences" on public.experiences
  for select using (true);

drop policy if exists "Admins can manage experiences" on public.experiences;
create policy "Admins can manage experiences" on public.experiences
  for all using (public.is_admin()) with check (public.is_admin());

-- skills
drop policy if exists "Public can view skills" on public.skills;
create policy "Public can view skills" on public.skills
  for select using (true);

drop policy if exists "Admins can manage skills" on public.skills;
create policy "Admins can manage skills" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());

-- projects
drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects" on public.projects
  for select using (true);

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- education
drop policy if exists "Public can view education" on public.education;
create policy "Public can view education" on public.education
  for select using (true);

drop policy if exists "Admins can manage education" on public.education;
create policy "Admins can manage education" on public.education
  for all using (public.is_admin()) with check (public.is_admin());
