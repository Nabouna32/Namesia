-- Réduire les privilèges hérités du rôle service_role sur les tables utilisées par Groq.
revoke all on table public.names, public.name_profiles, public.name_profile_associations from service_role;

grant select, insert on table public.names to service_role;
grant select, insert on table public.name_profiles to service_role;
grant insert on table public.name_profile_associations to service_role;
