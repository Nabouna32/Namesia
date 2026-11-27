-- Réduire les privilèges SQL au strict nécessaire.
revoke insert on table public.user_favorites from authenticated;
grant insert (user_id, name_id) on table public.user_favorites to authenticated;
