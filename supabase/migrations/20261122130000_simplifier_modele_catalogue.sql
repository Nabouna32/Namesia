-- Simplification du modèle Namesia après reprise des données vers JSONB.
-- Cette migration est volontairement bloquante si la reprise n'est pas complète.

do $$
begin
  if exists (
    select 1
    from public.name_profile_versions old_version
    left join public.name_profiles new_version
      on new_version.name_id = old_version.name_id
     and new_version.version = old_version.version
    where new_version.id is null
       or new_version.content ->> 'introduction' is distinct from old_version.introduction
       or new_version.content ->> 'origin' is distinct from old_version.origin_text
       or new_version.content ->> 'history' is distinct from old_version.history_text
       or new_version.content ->> 'usage' is distinct from old_version.usage_text
  ) then
    raise exception 'Migration interrompue : une version ou un champ éditorial n''a pas été repris dans JSONB.';
  end if;

  if exists (
    select 1
    from public.name_profile_versions old_version
    join public.name_profiles new_version
      on new_version.name_id = old_version.name_id
     and new_version.version = old_version.version
    where (
      select count(*)
      from public.symbolic_associations old_symbol
      where old_symbol.profile_version_id = old_version.id
    ) <> jsonb_array_length(
      coalesce(new_version.content -> 'symbolic_associations', '[]'::jsonb)
    )
  ) then
    raise exception 'Migration interrompue : le nombre d''associations symboliques reprises ne correspond pas.';
  end if;

  if exists (
    select 1
    from public.symbolic_associations old_symbol
    join public.name_profile_versions old_version
      on old_version.id = old_symbol.profile_version_id
    join public.name_profiles new_version
      on new_version.name_id = old_version.name_id
     and new_version.version = old_version.version
    where not exists (
      select 1
      from jsonb_array_elements(coalesce(new_version.content -> 'symbolic_associations', '[]'::jsonb)) item
      where item ->> 'category' = old_symbol.category
        and item ->> 'value' = old_symbol.value
        and item ->> 'context_note' = old_symbol.context_note
    )
  ) then
    raise exception 'Migration interrompue : une association symbolique historique n''a pas été reprise dans JSONB.';
  end if;

  if exists (
    select 1
    from public.name_profiles
    where status = 'publie' and published_at is null
  ) then
    raise exception 'Migration interrompue : une version publiée ne possède pas de date de publication.';
  end if;

  if exists (
    select name_id
    from public.name_profiles
    where status = 'publie' and published_at is not null
    group by name_id
    having count(*) > 1
  ) then
    raise exception 'Migration interrompue : plusieurs versions sont publiées pour un même prénom.';
  end if;
end;
$$;

-- Retirer les anciennes tables documentaires et leur modèle de preuve.
revoke all on table
  public.sources,
  public.claims,
  public.claim_sources,
  public.symbolic_associations,
  public.name_profile_versions
from anon, authenticated;

drop index if exists public.names_published_idx;
-- Redondant avec la contrainte unique (name_id, version), qui couvre aussi la recherche de version.
drop index if exists public.name_profiles_name_version_idx;
-- L'index partiel de lecture devient redondant avec l'unicité d'une seule version publiée par prénom.
drop index if exists public.name_profiles_published_idx;

drop table public.claim_sources;
drop table public.claims;
drop table public.sources;
drop table public.symbolic_associations;
drop table public.name_profile_versions;

-- L'initiale est calculée par l'application ; la publication appartient à la version.
alter table public.names
  drop column first_letter,
  drop column is_published;

alter table public.names
  drop constraint names_gender_check,
  add constraint names_gender_check
    check (gender in ('feminin', 'masculin', 'mixte', 'inconnu'));

-- Une seule version publiée par prénom, garantie également en cas de concurrence.
create unique index name_profiles_one_published_per_name_idx
  on public.name_profiles (name_id)
  where status = 'publie' and published_at is not null;

-- La liste d'autorisation reste dans le schéma privé.
revoke all on table private.admin_users from anon, authenticated;
grant select on table private.admin_users to authenticated;

-- Les privilèges SQL complètent RLS.
revoke all on table public.names, public.name_profiles from anon, authenticated;
grant select on table public.names, public.name_profiles to anon;
grant select, insert, update on table public.names, public.name_profiles to authenticated;

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

  if p_schema_version is distinct from '2.0.0' or jsonb_typeof(p_content) is distinct from 'object' then
    raise exception 'Contrat JSON Namesia invalide ou non pris en charge' using errcode = '22023';
  end if;

  insert into public.names (slug, display_name, gender)
  values (p_slug, p_display_name, p_gender)
  on conflict (slug) do nothing;

  select n.id
  into v_name_id
  from public.names n
  where n.slug = p_slug
  for update;

  if exists (
    select 1
    from public.name_profiles p
    where p.name_id = v_name_id and p.status = 'publie'
  ) then
    if exists (
      select 1
      from public.names n
      where n.id = v_name_id
        and (n.display_name is distinct from p_display_name
          or n.gender is distinct from p_gender)
    ) then
      raise exception 'L''identité d''un prénom déjà publié ne peut pas être modifiée par un simple import.' using errcode = '22023';
    end if;
  else
    update public.names
    set display_name = p_display_name,
        gender = p_gender
    where id = v_name_id;
  end if;

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

revoke all on function public.import_name_profile(text, text, text, jsonb, text) from public, anon;
grant execute on function public.import_name_profile(text, text, text, jsonb, text) to authenticated;

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
    select 1
    from private.admin_users a
    where a.user_id = (select auth.uid())
  ) then
    raise exception 'Accès administrateur requis' using errcode = '42501';
  end if;

  select p.name_id
  into v_name_id
  from public.name_profiles p
  where p.id = p_profile_id
    and p.status = 'brouillon'
  for update;

  if not found then
    raise exception 'Seule une version en brouillon peut être publiée' using errcode = '22023';
  end if;

  update public.name_profiles
  set status = 'archive'
  where name_id = v_name_id
    and status = 'publie';

  update public.name_profiles
  set status = 'publie',
      published_at = now()
  where id = p_profile_id;
end;
$$;

revoke all on function public.publish_name_profile(uuid) from public, anon;
grant execute on function public.publish_name_profile(uuid) to authenticated;
