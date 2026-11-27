-- Favoris personnels synchronisés entre appareils et isolés par compte.
create table public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  name_id uuid not null references public.names (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint user_favorites_pkey primary key (user_id, name_id)
);

-- Index nécessaire aux recherches inverses et aux cascades lors de la suppression d'un prénom.
create index user_favorites_name_id_idx
  on public.user_favorites (name_id);

alter table public.user_favorites enable row level security;

revoke all on table public.user_favorites from anon, authenticated;
grant select, delete on table public.user_favorites to authenticated;
grant insert (user_id, name_id) on table public.user_favorites to authenticated;

create policy user_favorites_select_own
  on public.user_favorites
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy user_favorites_insert_own_published
  on public.user_favorites
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.names n
      join public.name_profiles p on p.name_id = n.id
      where n.id = user_favorites.name_id
        and p.status = 'publie'
    )
  );

create policy user_favorites_delete_own
  on public.user_favorites
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

comment on table public.user_favorites is
  'Favoris privés synchronisés entre appareils, isolés par compte Supabase Auth.';
