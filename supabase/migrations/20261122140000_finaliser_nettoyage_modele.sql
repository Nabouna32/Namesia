-- Finaliser le modèle relationnel après déploiement de l'application qui le lit.
-- Cette migration est destructive : sauvegarde préalable obligatoire.

do $$
begin
  if exists (
    select 1
    from public.name_profiles p
    where p.introduction is null or btrim(p.introduction) = ''
  ) then
    raise exception 'Nettoyage interrompu : une version ne possède pas son introduction relationnelle.';
  end if;

  if exists (
    select 1
    from public.name_profiles p
    where p.content is not null
      and (
        p.content ->> 'introduction' is distinct from p.introduction
        or p.content ->> 'origin' is distinct from p.origin_text
        or p.content ->> 'history' is distinct from p.history_text
        or p.content ->> 'usage' is distinct from p.usage_text
      )
  ) then
    raise exception 'Nettoyage interrompu : les colonnes relationnelles divergent des anciens documents JSON.';
  end if;

  if exists (
    select 1
    from public.name_profiles p
    where p.content is not null
      and jsonb_array_length(coalesce(p.content -> 'symbolic_associations', '[]'::jsonb)) <>
        (select count(*) from public.name_profile_associations a where a.profile_id = p.id)
  ) then
    raise exception 'Nettoyage interrompu : le nombre d''associations relationnelles ne correspond pas aux anciens documents.';
  end if;

  if exists (
    select 1
    from public.name_profile_versions old_version
    join public.name_profiles new_version
      on new_version.name_id = old_version.name_id
     and new_version.version = old_version.version
    where new_version.introduction is distinct from old_version.introduction
       or new_version.origin_text is distinct from old_version.origin_text
       or new_version.history_text is distinct from old_version.history_text
       or new_version.usage_text is distinct from old_version.usage_text
  ) then
    raise exception 'Nettoyage interrompu : une rubrique historique ne correspond pas au nouveau modèle.';
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
      from public.name_profile_associations new_symbol
      where new_symbol.profile_id = new_version.id
        and new_symbol.category = old_symbol.category
        and new_symbol.value = old_symbol.value
        and new_symbol.context_note = old_symbol.context_note
    )
  ) then
    raise exception 'Nettoyage interrompu : une association symbolique historique manque dans le nouveau modèle.';
  end if;

  if exists (
    select 1 from public.name_profiles
    where status = 'publie' and published_at is null
  ) then
    raise exception 'Nettoyage interrompu : une version publiée ne possède pas de date de publication.';
  end if;

  if exists (
    select name_id from public.name_profiles
    where status = 'publie' and published_at is not null
    group by name_id having count(*) > 1
  ) then
    raise exception 'Nettoyage interrompu : plusieurs versions sont publiées pour un même prénom.';
  end if;
end;
$$;

-- Retirer les policies historiques avant les tables qu'elles référencent.
drop policy if exists "Lecture des sources citées dans les fiches publiées" on public.sources;
drop policy if exists "Lecture des liens de sources des fiches publiées" on public.claim_sources;
drop policy if exists "Lecture des affirmations des fiches publiées" on public.claims;
drop policy if exists "Lecture de la symbolique des fiches publiées" on public.symbolic_associations;
drop policy if exists "Lecture publique des versions publiées" on public.name_profile_versions;

revoke all on table
  public.sources,
  public.claims,
  public.claim_sources,
  public.symbolic_associations,
  public.name_profile_versions
from anon, authenticated;

drop index if exists public.names_published_idx;
drop index if exists public.name_profiles_name_version_idx;
drop index if exists public.name_profiles_published_idx;

drop table public.claim_sources;
drop table public.claims;
drop table public.sources;
drop table public.symbolic_associations;
drop table public.name_profile_versions;

alter table public.name_profiles drop column content;

alter table public.names
  drop column first_letter,
  drop column is_published;

alter table public.names
  drop constraint names_gender_check,
  add constraint names_gender_check
    check (gender in ('feminin', 'masculin', 'mixte', 'inconnu'));

revoke all on table private.admin_users from anon, authenticated;
grant select on table private.admin_users to authenticated;

revoke all on table public.names, public.name_profiles, public.name_profile_associations from anon, authenticated;
grant select on table public.names, public.name_profiles, public.name_profile_associations to anon;
grant select, insert, update on table public.names, public.name_profiles to authenticated;
grant select, insert on table public.name_profile_associations to authenticated;
