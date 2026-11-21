create table public.name_profiles (
  id uuid primary key default gen_random_uuid(),
  name_id uuid not null references public.names(id) on delete cascade,
  version integer not null check (version > 0),
  schema_version text not null,
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  status text not null default 'brouillon'
    check (status in ('brouillon', 'publie', 'archive')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (name_id, version),
  check (status <> 'publie' or published_at is not null)
);

create index name_profiles_name_version_idx
  on public.name_profiles (name_id, version desc);
create index name_profiles_published_idx
  on public.name_profiles (name_id, published_at desc)
  where status = 'publie' and published_at is not null;

insert into public.name_profiles (
  name_id, version, schema_version, content, status, created_at, published_at
)
select
  p.name_id,
  p.version,
  '2.0.0',
  jsonb_strip_nulls(
    jsonb_build_object(
      'introduction', p.introduction,
      'origin', p.origin_text,
      'history', p.history_text,
      'usage', p.usage_text,
      'symbolic_associations',
        coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'category', sa.category,
              'value', sa.value,
              'context_note', sa.context_note
            ) order by sa.created_at
          )
          from public.symbolic_associations sa
          where sa.profile_version_id = p.id
        ), '[]'::jsonb)
    )
  ),
  case when p.status = 'publie' then 'publie' else 'brouillon' end,
  p.created_at,
  case
    when p.status = 'publie' then coalesce(p.published_at, p.created_at)
    else null
  end
from public.name_profile_versions p
where not exists (
  select 1
  from public.name_profiles existing
  where existing.name_id = p.name_id and existing.version = p.version
);

alter table public.name_profiles enable row level security;

drop policy if exists "Lecture publique des prénoms publiés" on public.names;
create policy "Lecture publique des prénoms avec fiche publiée"
on public.names
for select to anon, authenticated
using (
  exists (
    select 1
    from public.name_profiles p
    where p.name_id = names.id
      and p.status = 'publie'
      and p.published_at is not null
  )
);

create policy "Lecture publique des fiches publiées"
on public.name_profiles
for select to anon, authenticated
using (status = 'publie' and published_at is not null);

grant select on public.names, public.name_profiles to anon, authenticated;
