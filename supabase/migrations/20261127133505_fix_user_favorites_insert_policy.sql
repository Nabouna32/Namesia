-- Qualifier explicitement la colonne de la table cible dans la policy RLS.
-- Sans ce préfixe, name_id pourrait être résolu sur name_profiles.name_id dans la sous-requête.
drop policy user_favorites_insert_own_published on public.user_favorites;

create policy user_favorites_insert_own_published
  on public.user_favorites
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_favorites.user_id
    and exists (
      select 1
      from public.names n
      join public.name_profiles p on p.name_id = n.id
      where n.id = user_favorites.name_id
        and p.status = 'publie'
    )
  );
