-- Modèle relationnel cible : le JSON est un format d'import, pas le stockage canonique.
-- La migration reste bloquante si une donnée éditoriale ou symbolique n'est pas reprise.

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
    raise exception 'Migration interrompue : une version ou un champ éditorial historique n''a pas été repris.';
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
    raise exception 'Migration interrompue : une association symbolique historique n''a pas été reprise.';
  end if;

  if exists (
    select 1 from public.name_profiles
    where status = 'publie' and published_at is null
  ) then
    raise exception 'Migration interrompue : une version publiée ne possède pas de date de publication.';
  end if;

  if exists (
    select name_id from public.name_profiles
    where status = 'publie' and published_at is not null
    group by name_id having count(*) > 1
  ) then
    raise exception 'Migration interrompue : plusieurs versions sont publiées pour un même prénom.';
  end if;
end;
$$;

-- 1. Décomposer les rubriques éditoriales en colonnes interrogeables.
alter table public.name_profiles
  add column introduction text,
  add column origin_text text,
  add column history_text text,
  add column usage_text text;

update public.name_profiles
set introduction = content ->> 'introduction',
    origin_text = content ->> 'origin',
    history_text = content ->> 'history',
    usage_text = content ->> 'usage';

do $$
begin
  if exists (
    select 1 from public.name_profiles
    where introduction is null or btrim(introduction) = ''
  ) then
    raise exception 'Migration interrompue : une introduction manque dans une version.';
  end if;
end;
$$;

alter table public.name_profiles
  alter column introduction set not null,
  add constraint name_profiles_introduction_length_check
    check (char_length(introduction) between 1 and 600),
  add constraint name_profiles_origin_length_check
    check (origin_text is null or char_length(origin_text) <= 3000),
  add constraint name_profiles_history_length_check
    check (history_text is null or char_length(history_text) <= 3000),
  add constraint name_profiles_usage_length_check
    check (usage_text is null or char_length(usage_text) <= 3000);

-- 2. Décomposer les associations symboliques en lignes filtrables.
create table public.name_profile_associations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.name_profiles(id) on delete cascade,
  position smallint not null check (position between 0 and 11),
  category text not null check (char_length(category) between 1 and 80),
  value text not null check (char_length(value) between 1 and 120),
  context_note text not null check (char_length(context_note) between 1 and 1000),
  unique (profile_id, position)
);

insert into public.name_profile_associations (profile_id, position, category, value, context_note)
select
  p.id,
  (item.ordinality - 1)::smallint,
  item.value ->> 'category',
  item.value ->> 'value',
  item.value ->> 'context_note'
from public.name_profiles p
cross join lateral jsonb_array_elements(
  coalesce(p.content -> 'symbolic_associations', '[]'::jsonb)
) with ordinality as item(value, ordinality);

do $$
begin
  if exists (
    select 1
    from public.name_profiles p
    where jsonb_array_length(coalesce(p.content -> 'symbolic_associations', '[]'::jsonb)) <>
      (select count(*) from public.name_profile_associations a where a.profile_id = p.id)
  ) then
    raise exception 'Migration interrompue : une association symbolique n''a pas été convertie en ligne relationnelle.';
  end if;
end;
$$;

create index name_profile_associations_category_idx
  on public.name_profile_associations (category);
create index name_profile_associations_value_idx
  on public.name_profile_associations (value);

alter table public.name_profile_associations enable row level security;
create policy "Lecture publique des associations des fiches publiées"
on public.name_profile_associations
for select to anon, authenticated
using (
  exists (
    select 1 from public.name_profiles p
    where p.id = name_profile_associations.profile_id
      and p.status = 'publie'
      and p.published_at is not null
  )
);
create policy "Administrateurs : lecture de toutes les associations"
on public.name_profile_associations
for select to authenticated
using (
  exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  )
);
create policy "Administrateurs : ajout atomique des associations"
on public.name_profile_associations
for insert to authenticated
with check (
  exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  )
);

-- Le document JSONB a servi de transport/migration ; les données sont désormais relationnelles.
alter table public.name_profiles drop column content;

-- Retirer les anciennes tables documentaires et leur modèle de preuve.
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

-- L'initiale est calculée par l'application ; la publication appartient à la version.
alter table public.names
  drop column first_letter,
  drop column is_published;

alter table public.names
  drop constraint names_gender_check,
  add constraint names_gender_check
    check (gender in ('feminin', 'masculin', 'mixte', 'inconnu'));

create unique index name_profiles_one_published_per_name_idx
  on public.name_profiles (name_id)
  where status = 'publie' and published_at is not null;

revoke all on table private.admin_users from anon, authenticated;
grant select on table private.admin_users to authenticated;

revoke all on table public.names, public.name_profiles, public.name_profile_associations from anon, authenticated;
grant select on table public.names, public.name_profiles, public.name_profile_associations to anon;
grant select, insert, update on table public.names, public.name_profiles, public.name_profile_associations to authenticated;

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
  v_association jsonb;
  v_position integer := 0;
begin
  if not exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  ) then
    raise exception 'Accès administrateur requis' using errcode = '42501';
  end if;

  if p_schema_version is distinct from '2.0.0'
    or jsonb_typeof(p_content) is distinct from 'object'
    or (p_content - 'introduction' - 'origin' - 'history' - 'usage' - 'symbolic_associations') <> '{}'::jsonb
    or jsonb_typeof(p_content -> 'introduction') is distinct from 'string'
    or char_length(btrim(p_content ->> 'introduction')) not between 1 and 600
    or (p_content ? 'origin' and (jsonb_typeof(p_content -> 'origin') is distinct from 'string' or char_length(p_content ->> 'origin') > 3000))
    or (p_content ? 'history' and (jsonb_typeof(p_content -> 'history') is distinct from 'string' or char_length(p_content ->> 'history') > 3000))
    or (p_content ? 'usage' and (jsonb_typeof(p_content -> 'usage') is distinct from 'string' or char_length(p_content ->> 'usage') > 3000))
    or jsonb_typeof(coalesce(p_content -> 'symbolic_associations', '[]'::jsonb)) is distinct from 'array'
    or jsonb_array_length(coalesce(p_content -> 'symbolic_associations', '[]'::jsonb)) > 12
  then
    raise exception 'Contrat JSON Namesia invalide ou non pris en charge' using errcode = '22023';
  end if;

  insert into public.names (slug, display_name, gender)
  values (p_slug, p_display_name, p_gender)
  on conflict (slug) do nothing;

  select n.id into v_name_id
  from public.names n
  where n.slug = p_slug
  for update;

  if exists (
    select 1 from public.names n
    where n.id = v_name_id
      and (n.display_name is distinct from p_display_name
        or n.gender is distinct from p_gender)
  ) then
    raise exception 'L''identité d''un prénom existant ne peut pas être modifiée par un import.' using errcode = '22023';
  end if;

  select coalesce(max(p.version), 0) + 1
  into v_version
  from public.name_profiles p
  where p.name_id = v_name_id;

  insert into public.name_profiles (
    name_id, version, schema_version, introduction, origin_text, history_text, usage_text, status
  )
  values (
    v_name_id,
    v_version,
    p_schema_version,
    p_content ->> 'introduction',
    p_content ->> 'origin',
    p_content ->> 'history',
    p_content ->> 'usage',
    'brouillon'
  )
  returning id into v_profile_id;

  for v_association in
    select value
    from jsonb_array_elements(coalesce(p_content -> 'symbolic_associations', '[]'::jsonb))
  loop
    if jsonb_typeof(v_association) is distinct from 'object'
      or (v_association - 'category' - 'value' - 'context_note') <> '{}'::jsonb
      or jsonb_typeof(v_association -> 'category') is distinct from 'string'
      or char_length(btrim(v_association ->> 'category')) not between 1 and 80
      or jsonb_typeof(v_association -> 'value') is distinct from 'string'
      or char_length(btrim(v_association ->> 'value')) not between 1 and 120
      or jsonb_typeof(v_association -> 'context_note') is distinct from 'string'
      or char_length(btrim(v_association ->> 'context_note')) not between 1 and 1000
    then
      raise exception 'Association symbolique invalide' using errcode = '22023';
    end if;

    insert into public.name_profile_associations (
      profile_id, position, category, value, context_note
    )
    values (
      v_profile_id,
      v_position,
      btrim(v_association ->> 'category'),
      btrim(v_association ->> 'value'),
      btrim(v_association ->> 'context_note')
    );
    v_position := v_position + 1;
  end loop;

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
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  ) then
    raise exception 'Accès administrateur requis' using errcode = '42501';
  end if;

  select p.name_id into v_name_id
  from public.name_profiles p
  where p.id = p_profile_id and p.status = 'brouillon'
  for update;

  if not found then
    raise exception 'Seule une version existante en brouillon peut être publiée' using errcode = '22023';
  end if;

  update public.name_profiles
  set status = 'archive'
  where name_id = v_name_id and status = 'publie';

  update public.name_profiles
  set status = 'publie', published_at = now()
  where id = p_profile_id;
end;
$$;

revoke all on function public.publish_name_profile(uuid) from public, anon;
grant execute on function public.publish_name_profile(uuid) to authenticated;
