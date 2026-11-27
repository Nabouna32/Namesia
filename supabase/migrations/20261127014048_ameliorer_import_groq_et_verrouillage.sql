-- Droits minimaux nécessaires à l’import Groq en SECURITY INVOKER.
grant select, insert on table public.names to service_role;
grant select, insert on table public.name_profiles to service_role;
grant insert on table public.name_profile_associations to service_role;

create or replace function public.import_name_profile(
  p_slug text,
  p_display_name text,
  p_gender text,
  p_content jsonb,
  p_schema_version text,
  p_generation_provider text default null,
  p_generation_model text default null,
  p_generation_prompt_version text default null,
  p_generation_prompt_sha256 text default null,
  p_generation_content_sha256 text default null,
  p_generation_schema_version text default null,
  p_generation_request_id text default null,
  p_generation_workflow_run_id bigint default null,
  p_generation_editorial_warning_count integer default null,
  p_generation_input_tokens integer default null,
  p_generation_output_tokens integer default null,
  p_generation_temperature numeric default null,
  p_generation_max_completion_tokens integer default null,
  p_generated_at timestamptz default null
)
returns table(profile_id uuid, version integer)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_name_id uuid;
  v_profile_id uuid;
  v_version integer;
  v_association jsonb;
  v_position integer := 0;
  v_is_service_role boolean := current_user = 'service_role';
  v_existing_content_sha256 text;
  v_existing_workflow_run_id bigint;
  v_existing_editorial_warning_count integer;
  v_existing_slug text;
  v_existing_display_name text;
  v_existing_gender text;
begin
  if v_is_service_role then
    if p_generation_provider is distinct from 'groq'
      or p_generation_model is null
      or char_length(btrim(p_generation_model)) not between 1 and 120
      or p_generation_model is distinct from btrim(p_generation_model)
      or p_generation_prompt_version is null
      or char_length(btrim(p_generation_prompt_version)) not between 1 and 80
      or p_generation_prompt_version is distinct from btrim(p_generation_prompt_version)
      or p_generation_prompt_sha256 is null
      or p_generation_prompt_sha256 !~ '^[0-9a-f]{64}$'
      or p_generation_content_sha256 is null
      or p_generation_content_sha256 !~ '^[0-9a-f]{64}$'
      or p_generation_schema_version is null
      or char_length(btrim(p_generation_schema_version)) not between 1 and 80
      or p_generation_schema_version is distinct from btrim(p_generation_schema_version)
      or p_generation_request_id is null
      or p_generation_workflow_run_id is null
      or p_generation_workflow_run_id <= 0
      or p_generation_editorial_warning_count is null
      or p_generation_editorial_warning_count < 0
      or char_length(btrim(p_generation_request_id)) not between 1 and 200
      or p_generation_request_id is distinct from btrim(p_generation_request_id)
      or (p_generation_input_tokens is not null and p_generation_input_tokens < 0)
      or (p_generation_output_tokens is not null and p_generation_output_tokens < 0)
      or p_generation_temperature is null
      or p_generation_temperature not between 0 and 2
      or p_generation_max_completion_tokens is null
      or p_generation_max_completion_tokens not between 1 and 65536
      or p_generated_at is null
    then
      raise exception 'Métadonnées de génération Groq invalides ou incomplètes' using errcode = '22023';
    end if;

  else
    if not exists (
      select 1 from private.admin_users a
      where a.user_id = (select auth.uid())
    ) then
      raise exception 'Accès administrateur requis' using errcode = '42501';
    end if;

    if p_generation_provider is not null
      or p_generation_model is not null
      or p_generation_prompt_version is not null
      or p_generation_prompt_sha256 is not null
      or p_generation_content_sha256 is not null
      or p_generation_schema_version is not null
      or p_generation_request_id is not null
      or p_generation_workflow_run_id is not null
      or p_generation_editorial_warning_count is not null
      or p_generation_input_tokens is not null
      or p_generation_output_tokens is not null
      or p_generation_temperature is not null
      or p_generation_max_completion_tokens is not null
      or p_generated_at is not null
    then
      raise exception 'Les métadonnées de génération sont réservées au pipeline interne' using errcode = '42501';
    end if;
  end if;

  if p_slug is null
    or p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    or char_length(p_slug) > 120
    or p_display_name is null
    or p_display_name is distinct from btrim(p_display_name)
    or char_length(p_display_name) not between 1 and 100
    or p_gender is null
    or p_gender not in ('feminin', 'masculin', 'mixte', 'inconnu')
    or p_schema_version is distinct from '2.0.0'
    or jsonb_typeof(p_content) is distinct from 'object'
    or (p_content - 'introduction' - 'origin' - 'history' - 'usage' - 'symbolic_associations') <> '{}'::jsonb
    or jsonb_typeof(p_content -> 'introduction') is distinct from 'string'
    or char_length(btrim(p_content ->> 'introduction')) not between 1 and 600
    or (p_content ? 'origin' and (jsonb_typeof(p_content -> 'origin') is distinct from 'string' or char_length(p_content ->> 'origin') > 3000))
    or (p_content ? 'history' and (jsonb_typeof(p_content -> 'history') is distinct from 'string' or char_length(p_content ->> 'history') > 3000))
    or (p_content ? 'usage' and (jsonb_typeof(p_content -> 'usage') is distinct from 'string' or char_length(p_content ->> 'usage') > 3000))
    or (
      case
        when jsonb_typeof(p_content -> 'symbolic_associations') = 'array'
        then jsonb_array_length(p_content -> 'symbolic_associations') > 12
        else true
      end
    )
  then
    raise exception 'Contrat JSON Namesia invalide ou non pris en charge' using errcode = '22023';
  end if;


  -- Sérialise les imports d’un même prénom sans élargir les droits UPDATE.
  perform pg_advisory_xact_lock(hashtextextended('namesia-profile:' || p_slug, 0));

  if v_is_service_role then
    -- Une reprise réseau avec le même identifiant Groq reste idempotente.
    select m.profile_id, p.version, m.content_sha256, m.workflow_run_id, m.editorial_warning_count, n.slug, n.display_name, n.gender
    into v_profile_id, v_version, v_existing_content_sha256, v_existing_workflow_run_id, v_existing_editorial_warning_count, v_existing_slug, v_existing_display_name, v_existing_gender
    from private.name_profile_generation_metadata m
    join public.name_profiles p on p.id = m.profile_id
    join public.names n on n.id = p.name_id
    where m.request_id = p_generation_request_id;

    if found then
      if v_existing_workflow_run_id is distinct from p_generation_workflow_run_id
        or v_existing_content_sha256 is distinct from p_generation_content_sha256
        or v_existing_editorial_warning_count is distinct from p_generation_editorial_warning_count
        or v_existing_slug is distinct from p_slug
        or v_existing_display_name is distinct from p_display_name
        or v_existing_gender is distinct from p_gender
      then
        raise exception 'Identifiant de requête Groq déjà associé à une autre exécution ou fiche.' using errcode = '22023';
      end if;
      return query select v_profile_id, v_version;
      return;
    end if;

    -- Une relance du même workflow ne crée jamais une seconde version.
    select m.profile_id, p.version, m.content_sha256, m.workflow_run_id, m.editorial_warning_count, n.slug, n.display_name, n.gender
    into v_profile_id, v_version, v_existing_content_sha256, v_existing_workflow_run_id, v_existing_editorial_warning_count, v_existing_slug, v_existing_display_name, v_existing_gender
    from private.name_profile_generation_metadata m
    join public.name_profiles p on p.id = m.profile_id
    join public.names n on n.id = p.name_id
    where m.workflow_run_id = p_generation_workflow_run_id;

    if found then
      if v_existing_content_sha256 is distinct from p_generation_content_sha256
        or v_existing_editorial_warning_count is distinct from p_generation_editorial_warning_count
        or v_existing_slug is distinct from p_slug
        or v_existing_display_name is distinct from p_display_name
        or v_existing_gender is distinct from p_gender
      then
        raise exception 'Cette exécution GitHub a déjà importé une autre fiche.' using errcode = '22023';
      end if;
      return query select v_profile_id, v_version;
      return;
    end if;
  end if;

  insert into public.names (slug, display_name, gender)
  values (p_slug, p_display_name, p_gender)
  on conflict (slug) do nothing;

  select n.id into v_name_id
  from public.names n
  where n.slug = p_slug;

  if exists (
    select 1 from public.names n
    where n.id = v_name_id
      and (n.display_name is distinct from p_display_name
        or n.gender is distinct from p_gender)
  ) then
    raise exception 'L''identité d''un prénom existant ne peut pas être modifiée par un import.' using errcode = '22023';
  end if;

  select coalesce(max(p.version), 0) + 1
  into v_version
  from public.name_profiles p
  where p.name_id = v_name_id;

  insert into public.name_profiles (
    name_id, version, schema_version, introduction, origin_text, history_text, usage_text, status
  )
  values (
    v_name_id,
    v_version,
    p_schema_version,
    btrim(p_content ->> 'introduction'),
    nullif(btrim(p_content ->> 'origin'), ''),
    nullif(btrim(p_content ->> 'history'), ''),
    nullif(btrim(p_content ->> 'usage'), ''),
    'brouillon'
  )
  returning id into v_profile_id;

  for v_association in
    select value
    from jsonb_array_elements(p_content -> 'symbolic_associations')
  loop
    if jsonb_typeof(v_association) is distinct from 'object'
      or (v_association - 'category' - 'value' - 'context_note') <> '{}'::jsonb
      or jsonb_typeof(v_association -> 'category') is distinct from 'string'
      or char_length(btrim(v_association ->> 'category')) not between 1 and 80
      or jsonb_typeof(v_association -> 'value') is distinct from 'string'
      or char_length(btrim(v_association ->> 'value')) not between 1 and 120
      or jsonb_typeof(v_association -> 'context_note') is distinct from 'string'
      or char_length(btrim(v_association ->> 'context_note')) not between 1 and 1000
    then
      raise exception 'Association symbolique invalide' using errcode = '22023';
    end if;

    insert into public.name_profile_associations (
      profile_id, position, category, value, context_note
    )
    values (
      v_profile_id,
      v_position,
      btrim(v_association ->> 'category'),
      btrim(v_association ->> 'value'),
      btrim(v_association ->> 'context_note')
    );
    v_position := v_position + 1;
  end loop;

  if v_is_service_role then
    insert into private.name_profile_generation_metadata (
      profile_id, provider, model, prompt_version, prompt_sha256, content_sha256,
      response_schema_version, request_id, workflow_run_id, editorial_warning_count, input_tokens, output_tokens,
      temperature, max_completion_tokens, generated_at
    )
    values (
      v_profile_id, p_generation_provider, p_generation_model, p_generation_prompt_version,
      p_generation_prompt_sha256, p_generation_content_sha256, p_generation_schema_version, p_generation_request_id,
      p_generation_workflow_run_id, p_generation_editorial_warning_count, p_generation_input_tokens, p_generation_output_tokens, p_generation_temperature,
      p_generation_max_completion_tokens, p_generated_at
    );
  end if;

  return query select v_profile_id, v_version;
end;
$$;


notify pgrst, 'reload schema';
