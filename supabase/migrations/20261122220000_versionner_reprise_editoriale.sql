-- Les rubriques éditoriales ne doivent jamais réécrire une version déjà publiée.
-- La migration précédente a enrichi les six lignes publiées en place ; on restaure leur
-- contenu initial puis on porte les enrichissements dans une nouvelle version publiée.

create temporary table _namesia_profile_version_map on commit drop as
select p.id as old_id, gen_random_uuid() as new_id, p.name_id, p.version
from public.name_profiles p
where p.id in (
 '30000000-0000-4000-8000-000000000001',
 '30000000-0000-4000-8000-000000000002',
 '30000000-0000-4000-8000-000000000003',
 '30000000-0000-4000-8000-000000000004',
 '30000000-0000-4000-8000-000000000005',
 '30000000-0000-4000-8000-000000000006'
)
and p.status = 'publie';

do $$
begin
 if (select count(*) from _namesia_profile_version_map) <> 6 then
  raise exception 'Reprise éditoriale interrompue : les six versions publiées attendues ne sont pas présentes.';
 end if;
 if exists(select 1 from _namesia_profile_version_map where version <> 1) then
  raise exception 'Reprise éditoriale interrompue : la version initiale du catalogue a changé.';
 end if;
end;
$$;

insert into public.name_profiles (
 id,name_id,version,schema_version,introduction,origin_text,history_text,usage_text,status
)
select
 m.new_id,p.name_id,p.version+1,'3.0.0',p.introduction,p.origin_text,p.history_text,p.usage_text,'brouillon'
from _namesia_profile_version_map m
join public.name_profiles p on p.id=m.old_id;

insert into public.name_profile_associations(profile_id,position,category,value,context_note)
select m.new_id,a.position,a.category,a.value,a.context_note
from _namesia_profile_version_map m
join public.name_profile_associations a on a.profile_id=m.old_id;

insert into public.name_profile_references(profile_id,position,section,title,publisher,url,consulted_at)
select m.new_id,r.position,r.section,r.title,r.publisher,r.url,r.consulted_at
from _namesia_profile_version_map m
join public.name_profile_references r on r.profile_id=m.old_id;

-- Restaurer le texte réellement présent avant la première reprise éditoriale.
update public.name_profiles set
 schema_version='2.0.0',
 origin_text='Les ouvrages de prénoms rapprochent généralement Alice de formes anciennes issues du germanique. Le détail de la chaîne historique mérite toutefois une vérification onomastique plus poussée.',
 history_text='Le prénom est attesté dans l’usage médiéval et a connu un regain de visibilité culturelle avec le personnage d’Alice au pays des merveilles, publié au XIXe siècle.',
 usage_text='Prénom féminin utilisé dans de nombreux pays, avec des variantes comme Alicia, Alison ou Alix.',
 status='archive'
where id='30000000-0000-4000-8000-000000000001';

update public.name_profiles set
 schema_version='2.0.0',
 origin_text='La forme Gabriel est traditionnellement interprétée à partir d’éléments hébreux associés à la force et à Dieu.',
 history_text='Dans les traditions juive, chrétienne et musulmane, Gabriel est le nom d’un messager céleste, avec des récits et des rôles propres à chaque tradition.',
 usage_text='Prénom masculin présent dans de nombreuses langues, avec des formes comme Gabrielle au féminin.',
 status='archive'
where id='30000000-0000-4000-8000-000000000002';

update public.name_profiles set
 schema_version='2.0.0',
 origin_text='Une piste étymologique courante le rattache à l’élément germanique ermin, souvent glosé par « grand » ou « puissant ». Les formes anciennes et les évolutions exactes varient selon les travaux.',
 history_text='Le prénom est porté au Moyen Âge dans plusieurs régions d’Europe et connaît des périodes de popularité renouvelée.',
 usage_text='Prénom féminin largement diffusé en Europe et dans les pays anglophones.',
 status='archive'
where id='30000000-0000-4000-8000-000000000003';

update public.name_profiles set
 schema_version='2.0.0',
 origin_text='Il est traditionnellement rapproché des éléments germaniques hlod (« gloire ») et wig (« combat »).',
 history_text='Plusieurs souverains français ont porté ce prénom, ce qui a contribué à son ancrage dans l’histoire politique et culturelle du pays.',
 usage_text='Prénom masculin dont la forme Louise est l’équivalent féminin traditionnel en français.',
 status='archive'
where id='30000000-0000-4000-8000-000000000004';

update public.name_profiles set
 schema_version='2.0.0',
 origin_text='Une piste germanique le rapproche de lind, élément associé au tilleul ou à la douceur selon les contextes. Lina peut aussi être une forme courte de prénoms plus longs.',
 history_text='Le prénom s’est diffusé dans plusieurs espaces linguistiques et son usage contemporain ne se rattache pas à une seule tradition.',
 usage_text='Prénom féminin international, parfois employé comme prénom autonome et parfois comme forme abrégée.',
 status='archive'
where id='30000000-0000-4000-8000-000000000005';

update public.name_profiles set
 schema_version='2.0.0',
 origin_text='Le rapprochement entre Noah et Noé est établi dans l’usage des langues modernes. Les interprétations du nom hébreu sont discutées et ne sont pas réduites ici à une traduction unique.',
 history_text='Noé est une figure du livre de la Genèse. Le prénom Noah est aujourd’hui utilisé dans de nombreuses langues, notamment en anglais et en français.',
 usage_text='Prénom masculin international, dont Noé est la forme française traditionnelle.',
 status='archive'
where id='30000000-0000-4000-8000-000000000006';

-- Les références documentent la nouvelle version, pas la version historique restaurée.
delete from public.name_profile_references r
using _namesia_profile_version_map m
where r.profile_id=m.old_id;

-- Les variantes sont décrites comme formes apparentées recensées par la source,
-- jamais comme synonymes ou graphies interchangeables.
update public.name_profiles set usage_text='Nominis rattache Alice à la famille d’Adélaïde et recense des formes proches comme Alis, Alix, Alicia, Alizée et Alison. Cette liste décrit une famille de formes apparentées ; elle ne signifie pas que toutes sont des variantes orthographiques strictement interchangeables.' 
where id in (select new_id from _namesia_profile_version_map where old_id='30000000-0000-4000-8000-000000000001');

update public.name_profiles set usage_text='Nominis recense autour de Gabriel des formes comme Abriel, Djibril, Gabriela, Gabrielle et Gaby. Elles correspondent à des usages, des langues ou des genres différents : Gabrielle est notamment une forme féminine, tandis que Djibril est une forme utilisée dans d’autres espaces linguistiques.' 
where id in (select new_id from _namesia_profile_version_map where old_id='30000000-0000-4000-8000-000000000002');

update public.name_profiles set usage_text='Le Wiktionnaire atteste Emma comme prénom féminin en français et en anglais. Pour le français, il relève notamment les prénoms composés Emma-Lisa et Emma-Victoria. Ce sont des formes composées, pas des variantes orthographiques du prénom simple.' 
where id in (select new_id from _namesia_profile_version_map where old_id='30000000-0000-4000-8000-000000000003');

update public.name_profiles set usage_text='Nominis rassemble autour de Louis des formes comme Aloïs, Lewis, Loïc, Ludovic, Ludwig, Luigi et Luis. Ces formes sont apparentées dans la notice mais reflètent des langues et des histoires distinctes ; Louise est le féminin français usuel, pas une simple variante orthographique.' 
where id in (select new_id from _namesia_profile_version_map where old_id='30000000-0000-4000-8000-000000000004');

update public.name_profiles set usage_text='Nominis présente Adeline et Lin comme formes majeures associées à Lina, puis relève Aline, Line, Linah, Lino et Lyna parmi les formes dérivées. Cette famille de formes ne signifie pas qu’elles ont partout la même origine ou le même usage.' 
where id in (select new_id from _namesia_profile_version_map where old_id='30000000-0000-4000-8000-000000000005');

update public.name_profiles set usage_text='Nominis donne Noé comme forme majeure de Noah et recense notamment Noa, Noée, Noéline, Manoa et Manoe parmi les formes dérivées. Noa et Noah sont des graphies proches, mais leur genre et leur usage peuvent varier selon les pays.' 
where id in (select new_id from _namesia_profile_version_map where old_id='30000000-0000-4000-8000-000000000006');

insert into public.name_profile_references(profile_id,position,section,title,publisher,url,consulted_at)
select m.new_id,
 case when m.old_id in ('30000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000005') then 1 else 2 end,
 'usages',
 case
  when m.old_id='30000000-0000-4000-8000-000000000001' then 'Alice — formes majeures et dérivées'
  when m.old_id='30000000-0000-4000-8000-000000000002' then 'Gabriel — formes dérivées'
  when m.old_id='30000000-0000-4000-8000-000000000003' then 'Emma — prénom et formes composées'
  when m.old_id='30000000-0000-4000-8000-000000000004' then 'Louis — formes dérivées'
  when m.old_id='30000000-0000-4000-8000-000000000005' then 'Lina — formes majeures et dérivées'
  else 'Noah — formes majeures et dérivées'
 end,
 case when m.old_id='30000000-0000-4000-8000-000000000003' then 'Wiktionnaire' else 'Nominis · Conférence des évêques de France' end,
 case
  when m.old_id='30000000-0000-4000-8000-000000000001' then 'https://nominis.cef.fr/contenus/prenom/1288/Alice.html'
  when m.old_id='30000000-0000-4000-8000-000000000002' then 'https://nominis.cef.fr/contenus/prenoms/278/Gabriel.html'
  when m.old_id='30000000-0000-4000-8000-000000000003' then 'https://fr.wiktionary.org/wiki/Emma'
  when m.old_id='30000000-0000-4000-8000-000000000004' then 'https://nominis.cef.fr/contenus/prenom/623/Louis.html'
  when m.old_id='30000000-0000-4000-8000-000000000005' then 'https://nominis.cef.fr/contenus/prenom/4856/Lina.html'
  else 'https://nominis.cef.fr/contenus/prenom/4366/Noah.html'
 end,
 date '2026-11-22'
from _namesia_profile_version_map m;

-- La version précédente est archivée ; la version enrichie devient l'unique version publiée.
update public.name_profiles p
set status='publie',published_at=now()
from _namesia_profile_version_map m
where p.id=m.new_id;

do $$
begin
 if exists(
  select name_id from public.name_profiles
  where status='publie' and published_at is not null
  group by name_id having count(*)<>1
 ) then
  raise exception 'Publication des nouvelles versions interrompue : une fiche ne possède pas exactement une version publiée.';
 end if;
end;
$$;
