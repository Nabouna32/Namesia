drop policy if exists "Lecture publique des prénoms avec fiche publiée" on public.names;
drop policy if exists "Administrateurs : lecture de tous les prénoms" on public.names;
create policy "Lecture publique des prénoms publiés"
on public.names for select to anon
using (
  exists (
    select 1 from public.name_profiles p
    where p.name_id = names.id
      and p.status = 'publie'
      and p.published_at is not null
  )
);
create policy "Administrateurs : lecture de tous les prénoms"
on public.names for select to authenticated
using (
  exists (
    select 1 from public.name_profiles p
    where p.name_id = names.id
      and p.status = 'publie'
      and p.published_at is not null
  )
  or exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  )
);

drop policy if exists "Lecture publique des fiches publiées" on public.name_profiles;
drop policy if exists "Administrateurs : lecture de toutes les versions" on public.name_profiles;
create policy "Lecture publique des fiches publiées"
on public.name_profiles for select to anon
using (status = 'publie' and published_at is not null);
create policy "Administrateurs : lecture de toutes les versions"
on public.name_profiles for select to authenticated
using (
  (status = 'publie' and published_at is not null)
  or exists (
    select 1 from private.admin_users a
    where a.user_id = (select auth.uid())
  )
);
