-- Préparer le modèle relationnel cible sans casser la version actuellement en production.
-- Le JSONB historique reste temporairement présent pendant la bascule applicative.

do $$
begin
  if exists (
    select 1
    from public.name_profiles
    where jsonb_typeof(content) is distinct from 'object'
       or jsonb_typeof(content -> 'introduction') is distinct from 'string'
       or btrim(content ->> 'introduction') = ''
  ) then
    raise exception 'Préparation interrompue : un document JSON historique est invalide.';
  end if;
end;
$$;

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
    where jsonb_typeof(coalesce(p.content -> 'symbolic_associations', '[]'::jsonb)) is distinct from 'array'
       or jsonb_array_length(coalesce(p.content -> 'symbolic_associations', '[]'::jsonb)) <>
          (select count(*) from public.name_profile_associations a where a.profile_id = p.id)
  ) then
    raise exception 'Préparation interrompue : une association symbolique n''a pas été reprise.';
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

grant select on public.name_profile_associations to anon;
grant select, insert on public.name_profile_associations to authenticated;

create unique index name_profiles_one_published_per_name_idx
  on public.name_profiles (name_id)
  where status = 'publie' and published_at is not null;

-- Les anciens documents restent lisibles par l'application actuellement déployée.
-- Les nouvelles versions sont écrites dans les colonnes relationnelles uniquement.
alter table public.name_profiles alter column content drop not null;

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
    btrim(p_content ->> 'introduction'),
    nullif(btrim(p_content ->> 'origin'), ''),
    nullif(btrim(p_content ->> 'history'), ''),
    nullif(btrim(p_content ->> 'usage'), ''),
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
