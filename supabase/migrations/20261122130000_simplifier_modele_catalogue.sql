-- Simplification du modèle Namesia après reprise des données vers JSONB.
-- Cette migration est volontairement bloquante si la reprise n'est pas complète.

do $$
begin
  if exists (
    select 1
    from public.name_profile_versions old_version
    where not exists (
      select 1
      from public.name_profiles new_version
      where new_version.name_id = old_version.name_id
        and new_version.version = old_version.version
    )
  ) then
    raise exception 'Migration interrompue : une ancienne version ne possède pas de copie JSONB.';
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

-- Révoquer les accès avant de retirer les anciennes tables exposées.
revoke all on table
  public.sources,
  public.claims,
  public.claim_sources,
  public.symbolic_associations,
  public.name_profile_versions
from anon, authenticated;

drop index if exists public.names_published_idx;

drop table public.claim_sources;
drop table public.claims;
drop table public.sources;
drop table public.symbolic_associations;
drop table public.name_profile_versions;

-- Les valeurs sont calculables ou redondantes avec name_profiles.status.
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

-- Les privilèges SQL complètent RLS : aucune permission anonyme d'écriture ou d'administration.
revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

revoke all on table public.names, public.name_profiles from anon, authenticated;
grant select on table public.names, public.name_profiles to anon;
grant select, insert, update on table public.names, public.name_profiles to authenticated;

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
    from public.admin_users a
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
