create extension if not exists pgcrypto;

create table public.names (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  first_letter text not null,
  gender text not null check (gender in ('feminin','masculin','mixte')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publisher text,
  source_type text not null default 'ouvrage',
  url text not null,
  accessed_at date,
  note text,
  created_at timestamptz not null default now()
);
create table public.name_profile_versions (
  id uuid primary key default gen_random_uuid(),
  name_id uuid not null references public.names(id) on delete cascade,
  version integer not null check (version > 0),
  status text not null check (status in ('brouillon','a_revoir','approuve','publie','archive')),
  introduction text not null,
  origin_text text,
  history_text text,
  usage_text text,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (name_id, version)
);
create table public.claims (
  id uuid primary key default gen_random_uuid(),
  profile_version_id uuid not null references public.name_profile_versions(id) on delete cascade,
  section text not null check (section in ('origine','histoire','usage','statistique')),
  content text not null,
  claim_status text not null check (claim_status in ('etabli','discute')),
  evidence_note text,
  created_at timestamptz not null default now()
);
create table public.claim_sources (
  claim_id uuid not null references public.claims(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete restrict,
  primary key (claim_id, source_id)
);
create table public.symbolic_associations (
  id uuid primary key default gen_random_uuid(),
  profile_version_id uuid not null references public.name_profile_versions(id) on delete cascade,
  category text not null,
  value text not null,
  context_note text not null,
  disclaimer text not null default 'Interprétation symbolique ou culturelle, sans valeur scientifique ou prédictive.',
  created_at timestamptz not null default now()
);

create index names_published_idx on public.names (is_published, first_letter, display_name);
create index profile_versions_public_idx on public.name_profile_versions (name_id, status, version desc);
create index claims_profile_idx on public.claims (profile_version_id, section);

alter table public.names enable row level security;
alter table public.sources enable row level security;
alter table public.name_profile_versions enable row level security;
alter table public.claims enable row level security;
alter table public.claim_sources enable row level security;
alter table public.symbolic_associations enable row level security;

create policy "Lecture publique des prénoms publiés" on public.names
for select to anon, authenticated using (is_published = true);
create policy "Lecture publique des versions publiées" on public.name_profile_versions
for select to anon, authenticated using (status = 'publie' and published_at is not null);
create policy "Lecture des affirmations des fiches publiées" on public.claims
for select to anon, authenticated using (exists (
  select 1 from public.name_profile_versions p
  where p.id = profile_version_id and p.status = 'publie' and p.published_at is not null
));
create policy "Lecture des sources citées dans les fiches publiées" on public.sources
for select to anon, authenticated using (exists (
  select 1 from public.claim_sources cs
  join public.claims c on c.id = cs.claim_id
  join public.name_profile_versions p on p.id = c.profile_version_id
  where cs.source_id = sources.id and p.status = 'publie' and p.published_at is not null
));
create policy "Lecture des liens de sources des fiches publiées" on public.claim_sources
for select to anon, authenticated using (exists (
  select 1 from public.claims c
  join public.name_profile_versions p on p.id = c.profile_version_id
  where c.id = claim_id and p.status = 'publie' and p.published_at is not null
));
create policy "Lecture de la symbolique des fiches publiées" on public.symbolic_associations
for select to anon, authenticated using (exists (
  select 1 from public.name_profile_versions p
  where p.id = profile_version_id and p.status = 'publie' and p.published_at is not null
));

grant select on public.names, public.sources, public.name_profile_versions,
  public.claims, public.claim_sources, public.symbolic_associations to anon, authenticated;

insert into public.names (id,slug,display_name,first_letter,gender,is_published) values
('10000000-0000-4000-8000-000000000001','alice','Alice','A','feminin',true),
('10000000-0000-4000-8000-000000000002','gabriel','Gabriel','G','masculin',true),
('10000000-0000-4000-8000-000000000003','emma','Emma','E','feminin',true),
('10000000-0000-4000-8000-000000000004','louis','Louis','L','masculin',true),
('10000000-0000-4000-8000-000000000005','lina','Lina','L','feminin',true),
('10000000-0000-4000-8000-000000000006','noah','Noah','N','masculin',true)
on conflict (slug) do update set display_name=excluded.display_name, first_letter=excluded.first_letter, gender=excluded.gender, is_published=true;

insert into public.sources (id,title,publisher,source_type,url,accessed_at,note) values
('20000000-0000-4000-8000-000000000001','L’Officiel des prénoms 2019','First Éditions','ouvrage','https://www.albin-michel.fr/sites/default/files/pages/node/72491/edit/Mois7_Pr%E2%80%9Anoms.pdf',current_date,'Extrait éditorial diffusé par Albin Michel ; les éléments étymologiques sont à confronter à des ouvrages d’onomastique.'),
('20000000-0000-4000-8000-000000000002','La Bible — Livre de la Genèse, chapitres 5 à 9','Association épiscopale liturgique pour les pays francophones','texte religieux','https://www.aelf.org/bible/Gn/5',current_date,'Source primaire pour la présence du personnage biblique Noé ; ne suffit pas à établir une étymologie.')
on conflict (id) do nothing;

insert into public.name_profile_versions (id,name_id,version,status,introduction,origin_text,history_text,usage_text,published_at) values
('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',1,'publie','Alice est un prénom ancien dont les formes ont circulé dans plusieurs langues européennes. Son histoire est notamment rapprochée de celle d’Adélaïde.','Les ouvrages de prénoms rapprochent généralement Alice de formes anciennes issues du germanique. Le détail de la chaîne historique mérite toutefois une vérification onomastique plus poussée.','Le prénom est attesté dans l’usage médiéval et a connu un regain de visibilité culturelle avec le personnage d’Alice au pays des merveilles, publié au XIXe siècle.','Prénom féminin utilisé dans de nombreux pays, avec des variantes comme Alicia, Alison ou Alix.',now()),
('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',1,'publie','Gabriel est un prénom d’origine hébraïque, porté par une figure importante des traditions bibliques.','La forme Gabriel est traditionnellement interprétée à partir d’éléments hébreux associés à la force et à Dieu.','Dans les traditions juive, chrétienne et musulmane, Gabriel est le nom d’un messager céleste, avec des récits et des rôles propres à chaque tradition.','Prénom masculin présent dans de nombreuses langues, avec des formes comme Gabrielle au féminin.',now()),
('30000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003',1,'publie','Emma est un prénom court ancien, associé à plusieurs formes germaniques médiévales.','Une piste étymologique courante le rattache à l’élément germanique ermin, souvent glosé par « grand » ou « puissant ». Les formes anciennes et les évolutions exactes varient selon les travaux.','Le prénom est porté au Moyen Âge dans plusieurs régions d’Europe et connaît des périodes de popularité renouvelée.','Prénom féminin largement diffusé en Europe et dans les pays anglophones.',now()),
('30000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000004',1,'publie','Louis est un prénom d’origine germanique, profondément ancré dans l’histoire française.','Il est traditionnellement rapproché des éléments germaniques hlod (« gloire ») et wig (« combat »).','Plusieurs souverains français ont porté ce prénom, ce qui a contribué à son ancrage dans l’histoire politique et culturelle du pays.','Prénom masculin dont la forme Louise est l’équivalent féminin traditionnel en français.',now()),
('30000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000005',1,'publie','Lina est un prénom bref dont les origines peuvent varier selon les langues et les familles de prénoms auxquelles il est rattaché.','Une piste germanique le rapproche de lind, élément associé au tilleul ou à la douceur selon les contextes. Lina peut aussi être une forme courte de prénoms plus longs.','Le prénom s’est diffusé dans plusieurs espaces linguistiques et son usage contemporain ne se rattache pas à une seule tradition.','Prénom féminin international, parfois employé comme prénom autonome et parfois comme forme abrégée.',now()),
('30000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000006',1,'publie','Noah est une forme internationale du prénom Noé, connu notamment par le récit biblique de l’arche.','Le rapprochement entre Noah et Noé est établi dans l’usage des langues modernes. Les interprétations du nom hébreu sont discutées et ne sont pas réduites ici à une traduction unique.','Noé est une figure du livre de la Genèse. Le prénom Noah est aujourd’hui utilisé dans de nombreuses langues, notamment en anglais et en français.','Prénom masculin international, dont Noé est la forme française traditionnelle.',now())
on conflict (id) do nothing;

insert into public.claims (id,profile_version_id,section,content,claim_status,evidence_note) values
('40000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','origine','Alice est rapproché de formes anciennes issues du germanique et de la famille d’Adélaïde.','discute','Le rapprochement est courant dans les ouvrages de prénoms ; la chaîne complète des formes demande une source d’onomastique spécialisée.'),
('40000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002','origine','Gabriel est traditionnellement décomposé en éléments hébreux associés à la force et à Dieu.','discute','Formulation courante dans les ouvrages de prénoms ; à compléter par une référence linguistique spécialisée.'),
('40000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000003','origine','Emma est rapproché de formes germaniques liées à l’élément ermin.','discute','Plusieurs hypothèses existent sur les formes anciennes et leur évolution.'),
('40000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000004','origine','Louis est rapproché des éléments germaniques hlod et wig.','discute','Étymologie traditionnelle donnée dans l’ouvrage cité.'),
('40000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000005','origine','Lina peut être rapproché de lind dans certaines hypothèses germaniques, mais possède aussi d’autres filiations possibles.','discute','Le prénom est polysémique et peut être une forme courte dans plusieurs langues.'),
('40000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000006','histoire','Noé est une figure du livre de la Genèse, aux chapitres consacrés à sa généalogie et au récit du déluge.','etabli','La source atteste le personnage et le récit, pas une étymologie du nom.')
on conflict (id) do nothing;

insert into public.claim_sources (claim_id,source_id) values
('40000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000002')
on conflict do nothing;

update public.claims set claim_status='discute'
where id in (
  '40000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000002',
  '40000000-0000-4000-8000-000000000003',
  '40000000-0000-4000-8000-000000000004',
  '40000000-0000-4000-8000-000000000005'
);
