-- Retour au modèle demandé : fiches générées en amont par IA, JSON importé,
-- puis réparti dans les colonnes relationnelles. Aucun système de sources.
drop function if exists public.import_name_profile_with_references(text,text,text,jsonb,text);
drop table if exists public.name_profile_references;
update public.name_profiles set schema_version='2.0.0' where schema_version='3.0.0';
