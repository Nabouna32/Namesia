drop policy if exists "Lecture publique des associations des fiches publiées" on public.name_profile_associations;
drop policy if exists "Administrateurs : lecture de toutes les associations" on public.name_profile_associations;

create policy "Lecture publique des associations des fiches publiées"
on public.name_profile_associations
for select to anon
using (
  exists (
    select 1
    from public.name_profiles p
    where p.id = name_profile_associations.profile_id
      and p.status = 'publie'
      and p.published_at is not null
  )
);

create policy "Lecture des associations publiées ou administrateur"
on public.name_profile_associations
for select to authenticated
using (
  exists (
    select 1
    from public.name_profiles p
    where p.id = name_profile_associations.profile_id
      and p.status = 'publie'
      and p.published_at is not null
  )
  or exists (
    select 1
    from private.admin_users a
    where a.user_id = (select auth.uid())
  )
);
