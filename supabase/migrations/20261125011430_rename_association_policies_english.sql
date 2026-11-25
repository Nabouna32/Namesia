alter policy "Administrateurs : ajout atomique des associations"
on public.name_profile_associations
rename to "admin_insert_profile_associations";

alter policy "Lecture des associations publiées ou administrateur"
on public.name_profile_associations
rename to "read_published_or_admin_profile_associations";

alter policy "Lecture publique des associations des fiches publiées"
on public.name_profile_associations
rename to "read_published_profile_associations";
