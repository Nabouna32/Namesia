create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter table public.admin_users set schema private;
grant select on private.admin_users to authenticated;

drop policy if exists "Administrateurs : lecture de tous les prénoms" on public.names;
drop policy if exists "Administrateurs : création de prénoms" on public.names;
drop policy if exists "Administrateurs : modification des prénoms" on public.names;
drop policy if exists "Administrateurs : lecture de toutes les versions" on public.name_profiles;
drop policy if exists "Administrateurs : création de versions" on public.name_profiles;
drop policy if exists "Administrateurs : modification des versions" on public.name_profiles;

create policy "Administrateurs : lecture de tous les prénoms"
on public.names for select to authenticated
using (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())));

create policy "Administrateurs : création de prénoms"
on public.names for insert to authenticated
with check (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())));

create policy "Administrateurs : modification des prénoms"
on public.names for update to authenticated
using (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())))
with check (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())));

create policy "Administrateurs : lecture de toutes les versions"
on public.name_profiles for select to authenticated
using (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())));

create policy "Administrateurs : création de versions"
on public.name_profiles for insert to authenticated
with check (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())));

create policy "Administrateurs : modification des versions"
on public.name_profiles for update to authenticated
using (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())))
with check (exists (select 1 from private.admin_users a where a.user_id = (select auth.uid())));

alter table public.names drop constraint if exists names_gender_check;
alter table public.names add constraint names_gender_check
  check (gender in ('feminin', 'masculin', 'mixte', 'inconnu'));

create or replace function public.import_name_profile(
  p_slug text,
  p_display_name text,
  p_gender text,
  p_content jsonb,
  p_schema_version text
)
returns table(profile_id uuid, version integer)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_name_id uuid;
  v_profile_id uuid;
  v_version integer;
begin
  if not exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  ) then
    raise exception 'Accès administrateur requis' using errcode = '42501';
  end if;

  insert into public.names (slug, display_name, gender)
  values (p_slug, p_display_name, p_gender)
  on conflict (slug) do update
    set display_name = excluded.display_name,
        gender = excluded.gender
  returning id into v_name_id;

  select coalesce(max(p.version), 0) + 1
  into v_version
  from public.name_profiles p
  where p.name_id = v_name_id;

  insert into public.name_profiles (name_id, version, schema_version, content, status)
  values (v_name_id, v_version, p_schema_version, p_content, 'brouillon')
  returning id into v_profile_id;

  return query select v_profile_id, v_version;
end;
$$;

create or replace function public.publish_name_profile(p_profile_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_name_id uuid;
begin
  if not exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  ) then
    raise exception 'Accès administrateur requis' using errcode = '42501';
  end if;

  select p.name_id into v_name_id
  from public.name_profiles p
  where p.id = p_profile_id
  for update;

  if v_name_id is null then
    raise exception 'Version introuvable' using errcode = 'P0002';
  end if;

  update public.name_profiles
  set status = 'archive'
  where name_id = v_name_id and status = 'publie';

  update public.name_profiles
  set status = 'publie', published_at = now()
  where id = p_profile_id;
end;
$$;

create or replace function public.is_namesia_admin()
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.import_name_profile(text, text, text, jsonb, text) from public, anon;
revoke all on function public.publish_name_profile(uuid) from public, anon;
revoke all on function public.is_namesia_admin() from public, anon;
grant execute on function public.import_name_profile(text, text, text, jsonb, text) to authenticated;
grant execute on function public.publish_name_profile(uuid) to authenticated;
grant execute on function public.is_namesia_admin() to authenticated;
