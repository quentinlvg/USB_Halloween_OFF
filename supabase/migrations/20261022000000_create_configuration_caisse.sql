create table if not exists public.configuration_caisse (
  id smallint primary key default 1 check (id = 1),
  nom text not null default 'Caisse',
  configuration text,
  cle_admin text,
  code_admin_salt text,
  code_admin_hash text
);

alter table public.configuration_caisse
  add column if not exists code_admin_salt text,
  add column if not exists code_admin_hash text;

alter table public.configuration_caisse
  drop column if exists code_admin;

alter table public.configuration_caisse enable row level security;

revoke all on table public.configuration_caisse from anon, authenticated;
grant all on table public.configuration_caisse to service_role;

create table if not exists public.admin_pin_attempts (
  client_hash text primary key check (client_hash ~ '^[0-9a-f]{64}$'),
  attempt_count integer not null default 0,
  window_started_at timestamptz not null default now()
);

alter table public.admin_pin_attempts enable row level security;

revoke all on table public.admin_pin_attempts from anon, authenticated;
grant all on table public.admin_pin_attempts to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('caisse-images', 'caisse-images', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

create or replace function public.claim_admin(p_key text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_key text;
begin
  if p_key is null or p_key !~ '^[0-9a-f]{48}$' then
    raise exception 'Invalid admin key';
  end if;

  insert into public.configuration_caisse (id, nom, cle_admin, configuration)
  values (1, 'Caisse', p_key, '')
  on conflict (id) do nothing;

  select cle_admin
  into current_key
  from public.configuration_caisse
  where id = 1
  for update;

  if current_key is null then
    update public.configuration_caisse
    set cle_admin = p_key
    where id = 1 and cle_admin is null
    returning cle_admin into current_key;
  end if;

  return current_key = p_key;
end;
$$;

create or replace function public.consume_admin_pin_attempt(p_client_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  attempts integer;
begin
  if p_client_hash is null or p_client_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid client hash';
  end if;

  insert into public.admin_pin_attempts (client_hash, attempt_count, window_started_at)
  values (p_client_hash, 1, now())
  on conflict (client_hash) do update
  set attempt_count = case
        when public.admin_pin_attempts.window_started_at <= now() - interval '15 minutes' then 1
        else public.admin_pin_attempts.attempt_count + 1
      end,
      window_started_at = case
        when public.admin_pin_attempts.window_started_at <= now() - interval '15 minutes' then now()
        else public.admin_pin_attempts.window_started_at
      end
  returning attempt_count into attempts;

  return attempts <= 10;
end;
$$;

create or replace function public.reset_admin_pin_attempt(p_client_hash text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.admin_pin_attempts where client_hash = p_client_hash;
end;
$$;

revoke all on function public.claim_admin(text) from public, anon, authenticated;
revoke all on function public.consume_admin_pin_attempt(text) from public, anon, authenticated;
revoke all on function public.reset_admin_pin_attempt(text) from public, anon, authenticated;
grant execute on function public.claim_admin(text) to service_role;
grant execute on function public.consume_admin_pin_attempt(text) to service_role;
grant execute on function public.reset_admin_pin_attempt(text) to service_role;
