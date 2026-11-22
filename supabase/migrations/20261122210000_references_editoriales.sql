-- Références éditoriales par rubrique, liées à une version précise de fiche.
create table public.name_profile_references (
 id uuid primary key default gen_random_uuid(),
 profile_id uuid not null references public.name_profiles(id) on delete cascade,
 position smallint not null check(position between 0 and 19),
 section text not null check(section in ('origine','histoire','usages')),
 title text not null check(char_length(title) between 1 and 240),
 publisher text not null check(char_length(publisher) between 1 and 160),
 url text not null check(char_length(url) between 1 and 2048 and url ~ '^https?://'),
 consulted_at date not null,
 unique(profile_id,position)
);
alter table public.name_profile_references enable row level security;
create policy "Lecture publique des références des fiches publiées" on public.name_profile_references for select to anon
using(exists(select 1 from public.name_profiles p where p.id=profile_id and p.status='publie' and p.published_at is not null));
create policy "Administrateurs : lecture des références" on public.name_profile_references for select to authenticated
using(exists(select 1 from private.admin_users a where a.user_id=(select auth.uid())));
create policy "Administrateurs : ajout des références" on public.name_profile_references for insert to authenticated
with check(exists(select 1 from private.admin_users a where a.user_id=(select auth.uid())));
revoke all on table public.name_profile_references from anon,authenticated;
grant select on table public.name_profile_references to anon;
grant select,insert on table public.name_profile_references to authenticated;

-- Compatibilité : réutilise la transaction d'import existante, puis rattache les références
-- avant la fin de la même transaction. La fonction historique conserve ses validations métier.
create or replace function public.import_name_profile_with_references(p_slug text,p_display_name text,p_gender text,p_content jsonb,p_schema_version text)
returns table(profile_id uuid,version integer) language plpgsql security invoker set search_path=''
as $$
declare v_import record; v_reference jsonb; v_position integer:=0;
begin
 if not exists(select 1 from private.admin_users a where a.user_id=(select auth.uid())) then
  raise exception 'Accès administrateur requis' using errcode='42501';
 end if;
 if p_schema_version is distinct from '3.0.0' or jsonb_typeof(p_content) is distinct from 'object'
 or (p_content-'introduction'-'origin'-'history'-'usage'-'symbolic_associations'-'references')<>'{}'::jsonb
 or jsonb_typeof(coalesce(p_content->'references','[]'::jsonb)) is distinct from 'array'
 or jsonb_array_length(coalesce(p_content->'references','[]'::jsonb))>20 then
  raise exception 'Contrat JSON Namesia 3.0.0 invalide' using errcode='22023';
 end if;
 select * into v_import from public.import_name_profile(p_slug,p_display_name,p_gender,p_content-'references','2.0.0');
 update public.name_profiles set schema_version='3.0.0' where id=v_import.profile_id;
 for v_reference in select value from jsonb_array_elements(coalesce(p_content->'references','[]'::jsonb)) loop
  if jsonb_typeof(v_reference) is distinct from 'object'
   or (v_reference-'section'-'title'-'publisher'-'url'-'consulted_at')<>'{}'::jsonb
   or v_reference->>'section' not in ('origine','histoire','usages')
   or jsonb_typeof(v_reference->'title') is distinct from 'string' or char_length(btrim(v_reference->>'title')) not between 1 and 240
   or jsonb_typeof(v_reference->'publisher') is distinct from 'string' or char_length(btrim(v_reference->>'publisher')) not between 1 and 160
   or jsonb_typeof(v_reference->'url') is distinct from 'string' or char_length(v_reference->>'url') not between 1 and 2048
   or (v_reference->>'url') !~ '^https?://'
   or jsonb_typeof(v_reference->'consulted_at') is distinct from 'string'
   or (v_reference->>'consulted_at') !~ '^\\d{4}-\\d{2}-\\d{2}$' then
   raise exception 'Référence invalide' using errcode='22023';
  end if;
  insert into public.name_profile_references(profile_id,position,section,title,publisher,url,consulted_at)
  values(v_import.profile_id,v_position,v_reference->>'section',btrim(v_reference->>'title'),btrim(v_reference->>'publisher'),btrim(v_reference->>'url'),(v_reference->>'consulted_at')::date);
  v_position:=v_position+1;
 end loop;
 return query select v_import.profile_id,v_import.version;
end;
$$;
revoke all on function public.import_name_profile_with_references(text,text,text,jsonb,text) from public,anon;
grant execute on function public.import_name_profile_with_references(text,text,text,jsonb,text) to authenticated;

-- Références ouvertes et consultées lors de cette reprise éditoriale.
insert into public.name_profile_references(profile_id,position,section,title,publisher,url,consulted_at) values
('30000000-0000-4000-8000-000000000001',0,'origine','Alice — étymologie et histoire du nom','Online Etymology Dictionary','https://www.etymonline.com/fr/word/Alice','2026-11-22'),
('30000000-0000-4000-8000-000000000001',1,'histoire','Alice — notice de prénom','Nominis · Conférence des évêques de France','https://nominis.cef.fr/contenus/prenom/1288/Alice.html','2026-11-22'),
('30000000-0000-4000-8000-000000000002',0,'origine','Gabriel — notice de prénom','Nominis · Conférence des évêques de France','https://nominis.cef.fr/contenus/prenoms/278/Gabriel.html','2026-11-22'),
('30000000-0000-4000-8000-000000000002',1,'histoire','Fiche Abraham : Gabriel et ses formes dans les traditions','Bibliothèque nationale de France','https://cdn.essentiels.bnf.fr/uploads/media/attachment/20221123165921000000_fiche_2.pdf','2026-11-22'),
('30000000-0000-4000-8000-000000000003',0,'origine','Emma — étymologie','Wiktionnaire','https://fr.wiktionary.org/wiki/Emma','2026-11-22'),
('30000000-0000-4000-8000-000000000004',0,'origine','Louis — notice de prénom','Nominis · Conférence des évêques de France','https://nominis.cef.fr/contenus/prenoms/623/louis.html','2026-11-22'),
('30000000-0000-4000-8000-000000000004',1,'histoire','Louis IX — notice d’autorité','Bibliothèque nationale de France','https://catalogue.bnf.fr/ark:/12148/cb120344600','2026-11-22'),
('30000000-0000-4000-8000-000000000005',0,'usages','Lina — entrée de prénom','Wiktionnaire','https://fr.wiktionary.org/wiki/Lina','2026-11-22'),
('30000000-0000-4000-8000-000000000006',0,'origine','Noah — notice de prénom','Nominis · Conférence des évêques de France','https://nominis.cef.fr/contenus/prenom/4366/Noah.html','2026-11-22'),
('30000000-0000-4000-8000-000000000006',1,'histoire','Genèse, chapitres 5 à 9','Association épiscopale liturgique pour les pays francophones','https://www.aelf.org/bible/Gn/5','2026-11-22');

update public.name_profiles set origin_text='Lina ne possède pas une origine unique démontrée par les ressources consultées. La forme existe dans plusieurs espaces linguistiques et peut aussi être employée comme forme courte de prénoms plus longs. Sans attestation précise permettant de relier une personne ou une famille à une seule langue, mieux vaut ne pas lui attribuer une étymologie exclusive.' where id='30000000-0000-4000-8000-000000000005';
update public.name_profiles set origin_text='Emma est attesté comme prénom germanique ancien. Une étymologie le rapproche de formes telles qu’Imma et de l’élément ermin, mais les dictionnaires ne présentent pas tous la même chaîne de dérivation. Le sens « immense » ou « universel » doit donc être présenté comme une hypothèse, non comme une certitude.' where id='30000000-0000-4000-8000-000000000003';
