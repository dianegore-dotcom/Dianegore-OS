-- Diane OS Phase 1 foundation
-- PostgreSQL / Supabase migration

create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner', 'trusted_user');
create type public.confidentiality_level as enum (
  'personal_private',
  'sensitive_personal',
  'personal_professional_knowledge',
  'company_confidential',
  'shareable',
  'public'
);
create type public.priority_level as enum ('none', 'low', 'medium', 'high', 'urgent');
create type public.project_status as enum ('idea', 'planned', 'active', 'waiting', 'blocked', 'on_hold', 'completed', 'cancelled', 'archived');
create type public.project_health as enum ('on_track', 'needs_attention', 'at_risk', 'blocked', 'unknown');
create type public.task_status as enum ('inbox', 'next', 'scheduled', 'in_progress', 'waiting', 'blocked', 'delegated', 'completed', 'cancelled', 'someday');
create type public.inbox_status as enum ('inbox', 'processed', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Diane',
  timezone text not null default 'America/Montreal',
  date_format text not null default 'MMM d, yyyy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.workspace_role not null default 'trusted_user',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.vaults (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  slug text not null,
  description text,
  icon text,
  privacy_level public.confidentiality_level not null default 'personal_private',
  position integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  vault_id uuid references public.vaults(id) on delete set null,
  title text not null,
  purpose text,
  category text,
  status text not null default 'active' check (status in ('active', 'on_hold', 'archived')),
  review_frequency text,
  confidentiality public.confidentiality_level not null default 'personal_private',
  pinned boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(purpose, '') || ' ' || coalesce(category, ''))
  ) stored
);

create table public.inbox_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  title text,
  content text not null,
  proposed_record_type text,
  status public.inbox_status not null default 'inbox',
  due_date date,
  vault_id uuid references public.vaults(id) on delete set null,
  project_id uuid,
  area_id uuid references public.areas(id) on delete set null,
  confidentiality public.confidentiality_level not null default 'personal_private',
  ai_processing_status text not null default 'not_requested' check (ai_processing_status in ('not_requested', 'queued', 'processing', 'completed', 'failed', 'paused')),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(proposed_record_type, ''))
  ) stored
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  vault_id uuid references public.vaults(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  source_inbox_item_id uuid references public.inbox_items(id) on delete set null,
  title text not null,
  description text,
  category text,
  status public.project_status not null default 'planned',
  priority public.priority_level not null default 'medium',
  stage text,
  health public.project_health not null default 'unknown',
  desired_outcome text,
  success_criteria text,
  start_date date,
  target_date date,
  actual_completion_date date,
  next_action text,
  confidentiality public.confidentiality_level not null default 'personal_private',
  pinned boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, '') || ' ' ||
      coalesce(desired_outcome, '') || ' ' || coalesce(success_criteria, '') || ' ' || coalesce(next_action, '')
    )
  ) stored
);

alter table public.inbox_items
  add constraint inbox_items_project_id_fkey
  foreign key (project_id) references public.projects(id) on delete set null;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  vault_id uuid references public.vaults(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  source_inbox_item_id uuid references public.inbox_items(id) on delete set null,
  title text not null,
  description text,
  status public.task_status not null default 'next',
  priority public.priority_level not null default 'medium',
  due_date date,
  start_date date,
  delegated_to_name text,
  waiting_on_name text,
  next_action boolean not null default false,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  completed_at timestamptz,
  reminder_at timestamptz,
  follow_up_date date,
  confidentiality public.confidentiality_level not null default 'personal_private',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(delegated_to_name, '') || ' ' || coalesce(waiting_on_name, '')
    )
  ) stored
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  slug text not null,
  color text,
  created_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table public.record_tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  record_type text not null check (record_type in ('project', 'task', 'area', 'vault', 'inbox_item')),
  record_id uuid not null,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (record_type, record_id, tag_id)
);

create table public.activity_log (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  record_type text not null,
  record_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index vaults_workspace_active_idx on public.vaults(workspace_id, position) where archived_at is null;
create index areas_workspace_active_idx on public.areas(workspace_id, updated_at desc) where archived_at is null;
create index projects_workspace_status_idx on public.projects(workspace_id, status, target_date) where archived_at is null;
create index projects_workspace_updated_idx on public.projects(workspace_id, updated_at desc) where archived_at is null;
create index tasks_workspace_status_due_idx on public.tasks(workspace_id, status, due_date) where archived_at is null;
create index tasks_workspace_follow_up_idx on public.tasks(workspace_id, follow_up_date) where archived_at is null and status = 'waiting';
create index inbox_workspace_status_idx on public.inbox_items(workspace_id, status, created_at desc) where archived_at is null;
create index tags_workspace_name_idx on public.tags(workspace_id, name);
create index record_tags_record_idx on public.record_tags(workspace_id, record_type, record_id);
create index activity_log_workspace_created_idx on public.activity_log(workspace_id, created_at desc);
create index areas_search_idx on public.areas using gin(search_vector);
create index projects_search_idx on public.projects using gin(search_vector);
create index tasks_search_idx on public.tasks using gin(search_vector);
create index inbox_items_search_idx on public.inbox_items using gin(search_vector);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger workspaces_set_updated_at before update on public.workspaces for each row execute function public.set_updated_at();
create trigger vaults_set_updated_at before update on public.vaults for each row execute function public.set_updated_at();
create trigger areas_set_updated_at before update on public.areas for each row execute function public.set_updated_at();
create trigger inbox_items_set_updated_at before update on public.inbox_items for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.role = 'owner'
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_owner(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.vaults enable row level security;
alter table public.areas enable row level security;
alter table public.inbox_items enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.tags enable row level security;
alter table public.record_tags enable row level security;
alter table public.activity_log enable row level security;

create policy profiles_select_self on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy workspaces_select_member on public.workspaces for select to authenticated using (public.is_workspace_member(id));
create policy workspaces_update_owner on public.workspaces for update to authenticated using (public.is_workspace_owner(id)) with check (public.is_workspace_owner(id));

create policy workspace_members_select_member on public.workspace_members for select to authenticated using (public.is_workspace_member(workspace_id));
create policy workspace_members_insert_owner on public.workspace_members for insert to authenticated with check (public.is_workspace_owner(workspace_id));
create policy workspace_members_update_owner on public.workspace_members for update to authenticated using (public.is_workspace_owner(workspace_id)) with check (public.is_workspace_owner(workspace_id));
create policy workspace_members_delete_owner on public.workspace_members for delete to authenticated using (public.is_workspace_owner(workspace_id) and user_id <> auth.uid());

create policy vaults_select_member on public.vaults for select to authenticated using (public.is_workspace_member(workspace_id));
create policy vaults_insert_member on public.vaults for insert to authenticated with check (public.is_workspace_member(workspace_id) and owner_id = auth.uid());
create policy vaults_update_member on public.vaults for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy vaults_delete_owner on public.vaults for delete to authenticated using (public.is_workspace_owner(workspace_id));

create policy areas_select_member on public.areas for select to authenticated using (public.is_workspace_member(workspace_id));
create policy areas_insert_member on public.areas for insert to authenticated with check (public.is_workspace_member(workspace_id) and owner_id = auth.uid());
create policy areas_update_member on public.areas for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy areas_delete_owner on public.areas for delete to authenticated using (public.is_workspace_owner(workspace_id));

create policy inbox_select_member on public.inbox_items for select to authenticated using (public.is_workspace_member(workspace_id));
create policy inbox_insert_member on public.inbox_items for insert to authenticated with check (public.is_workspace_member(workspace_id) and owner_id = auth.uid());
create policy inbox_update_member on public.inbox_items for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy inbox_delete_owner on public.inbox_items for delete to authenticated using (public.is_workspace_owner(workspace_id));

create policy projects_select_member on public.projects for select to authenticated using (public.is_workspace_member(workspace_id));
create policy projects_insert_member on public.projects for insert to authenticated with check (public.is_workspace_member(workspace_id) and owner_id = auth.uid());
create policy projects_update_member on public.projects for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy projects_delete_owner on public.projects for delete to authenticated using (public.is_workspace_owner(workspace_id));

create policy tasks_select_member on public.tasks for select to authenticated using (public.is_workspace_member(workspace_id));
create policy tasks_insert_member on public.tasks for insert to authenticated with check (public.is_workspace_member(workspace_id) and owner_id = auth.uid());
create policy tasks_update_member on public.tasks for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy tasks_delete_owner on public.tasks for delete to authenticated using (public.is_workspace_owner(workspace_id));

create policy tags_select_member on public.tags for select to authenticated using (public.is_workspace_member(workspace_id));
create policy tags_insert_member on public.tags for insert to authenticated with check (public.is_workspace_member(workspace_id) and owner_id = auth.uid());
create policy tags_update_member on public.tags for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy tags_delete_owner on public.tags for delete to authenticated using (public.is_workspace_owner(workspace_id));

create policy record_tags_select_member on public.record_tags for select to authenticated using (public.is_workspace_member(workspace_id));
create policy record_tags_insert_member on public.record_tags for insert to authenticated with check (public.is_workspace_member(workspace_id));
create policy record_tags_delete_member on public.record_tags for delete to authenticated using (public.is_workspace_member(workspace_id));

create policy activity_log_select_member on public.activity_log for select to authenticated using (public.is_workspace_member(workspace_id));
create policy activity_log_insert_member on public.activity_log for insert to authenticated with check (public.is_workspace_member(workspace_id) and actor_id = auth.uid());

create or replace function public.provision_diane_os_user(
  new_user_id uuid,
  new_user_email text,
  user_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  workspace_uuid uuid;
  display_name_value text;
begin
  display_name_value := coalesce(nullif(user_metadata ->> 'display_name', ''), split_part(coalesce(new_user_email, 'Diane'), '@', 1), 'Diane');

  insert into public.profiles (id, display_name)
  values (new_user_id, display_name_value)
  on conflict (id) do update set display_name = excluded.display_name;

  if exists (select 1 from public.workspace_members where user_id = new_user_id) then
    return;
  end if;

  insert into public.workspaces (owner_id, name, slug)
  values (new_user_id, 'Diane OS', 'diane-os-' || left(replace(new_user_id::text, '-', ''), 8))
  returning id into workspace_uuid;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (workspace_uuid, new_user_id, 'owner');

  insert into public.vaults (workspace_id, owner_id, name, slug, description, icon, privacy_level, position)
  values
    (workspace_uuid, new_user_id, 'Work and Career', 'work-and-career', 'Projects, responsibilities, professional knowledge and career evidence.', '💼', 'company_confidential', 0),
    (workspace_uuid, new_user_id, 'Personal Life', 'personal-life', 'Family, household, health, finances, home, travel and personal projects.', '🏠', 'personal_private', 1),
    (workspace_uuid, new_user_id, 'Prompt and Template Vault', 'prompt-and-template-vault', 'Reusable prompts, messages, checklists and document patterns.', '🧩', 'personal_professional_knowledge', 2),
    (workspace_uuid, new_user_id, 'Decision Vault', 'decision-vault', 'Decisions, rationale, outcomes and review history.', '⚖️', 'personal_private', 3),
    (workspace_uuid, new_user_id, 'Knowledge Vault', 'knowledge-vault', 'Reusable knowledge, references, lessons and how-to records.', '📚', 'personal_professional_knowledge', 4),
    (workspace_uuid, new_user_id, 'Document Vault', 'document-vault', 'Source files, imports and supporting material.', '🗄️', 'personal_private', 5);

  insert into public.areas (workspace_id, owner_id, vault_id, title, purpose, category, review_frequency, confidentiality)
  select workspace_uuid, new_user_id, v.id, seed.title, seed.purpose, seed.category, seed.review_frequency, seed.confidentiality
  from (
    values
      ('Work Management', 'Maintain visibility across priorities, commitments, delegation and follow-ups.', 'work', 'Weekly', 'personal_professional_knowledge'::public.confidentiality_level, 'work-and-career'),
      ('Personal Health', 'Maintain health information, questions, appointments and decisions without relying on memory.', 'health', 'Weekly', 'sensitive_personal'::public.confidentiality_level, 'personal-life')
  ) as seed(title, purpose, category, review_frequency, confidentiality, vault_slug)
  join public.vaults v on v.workspace_id = workspace_uuid and v.slug = seed.vault_slug;
end;
$$;

revoke all on function public.provision_diane_os_user(uuid, text, jsonb) from public;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.provision_diane_os_user(new.id, new.email, new.raw_user_meta_data);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any auth user created before this migration.
do $$
declare
  existing_user record;
begin
  for existing_user in
    select u.id, u.email, u.raw_user_meta_data
    from auth.users u
    left join public.profiles p on p.id = u.id
    where p.id is null
  loop
    perform public.provision_diane_os_user(existing_user.id, existing_user.email, existing_user.raw_user_meta_data);
  end loop;
end;
$$;

create or replace function public.search_records(
  p_workspace_id uuid,
  p_query text,
  p_limit integer default 50
)
returns table (
  record_type text,
  record_id uuid,
  title text,
  snippet text,
  reason text,
  rank real,
  updated_at timestamptz,
  confidentiality public.confidentiality_level,
  project_id uuid,
  area_id uuid,
  vault_id uuid
)
language sql
stable
security invoker
set search_path = ''
as $$
  with query_input as (
    select websearch_to_tsquery('english', p_query) as q, '%' || p_query || '%' as pattern
  ),
  tag_matches as (
    select rt.record_type, rt.record_id, string_agg(t.name, ', ' order by t.name) as matched_tags
    from public.record_tags rt
    join public.tags t on t.id = rt.tag_id
    cross join query_input qi
    where rt.workspace_id = p_workspace_id
      and t.name ilike qi.pattern
    group by rt.record_type, rt.record_id
  ),
  combined as (
    select
      'project'::text as record_type,
      p.id as record_id,
      p.title,
      ts_headline('english', coalesce(p.description, p.desired_outcome, p.title), qi.q, 'MaxWords=28,MinWords=8') as snippet,
      case
        when p.title ilike qi.pattern then 'Project title matched'
        when tm.matched_tags is not null then 'Project tag matched: ' || tm.matched_tags
        else 'Project content matched'
      end as reason,
      greatest(ts_rank(p.search_vector, qi.q), case when p.title ilike qi.pattern then 0.8 else 0 end)::real as rank,
      p.updated_at,
      p.confidentiality,
      p.id as project_id,
      p.area_id,
      p.vault_id
    from public.projects p
    cross join query_input qi
    left join tag_matches tm on tm.record_type = 'project' and tm.record_id = p.id
    where p.workspace_id = p_workspace_id and p.archived_at is null
      and (p.search_vector @@ qi.q or p.title ilike qi.pattern or tm.record_id is not null)

    union all

    select
      'task',
      t.id,
      t.title,
      ts_headline('english', coalesce(t.description, t.title), qi.q, 'MaxWords=28,MinWords=8'),
      case
        when t.title ilike qi.pattern then 'Task title matched'
        when t.waiting_on_name ilike qi.pattern then 'Waiting-on person matched'
        when tm.matched_tags is not null then 'Task tag matched: ' || tm.matched_tags
        else 'Task content matched'
      end,
      greatest(ts_rank(t.search_vector, qi.q), case when t.title ilike qi.pattern then 0.8 else 0 end)::real,
      t.updated_at,
      t.confidentiality,
      t.project_id,
      t.area_id,
      t.vault_id
    from public.tasks t
    cross join query_input qi
    left join tag_matches tm on tm.record_type = 'task' and tm.record_id = t.id
    where t.workspace_id = p_workspace_id and t.archived_at is null
      and (t.search_vector @@ qi.q or t.title ilike qi.pattern or t.waiting_on_name ilike qi.pattern or tm.record_id is not null)

    union all

    select
      'area',
      a.id,
      a.title,
      ts_headline('english', coalesce(a.purpose, a.title), qi.q, 'MaxWords=28,MinWords=8'),
      case when a.title ilike qi.pattern then 'Area title matched' else 'Area purpose matched' end,
      greatest(ts_rank(a.search_vector, qi.q), case when a.title ilike qi.pattern then 0.8 else 0 end)::real,
      a.updated_at,
      a.confidentiality,
      null::uuid,
      a.id,
      a.vault_id
    from public.areas a
    cross join query_input qi
    where a.workspace_id = p_workspace_id and a.archived_at is null
      and (a.search_vector @@ qi.q or a.title ilike qi.pattern)

    union all

    select
      'inbox_item',
      i.id,
      coalesce(i.title, 'Untitled capture'),
      ts_headline('english', i.content, qi.q, 'MaxWords=28,MinWords=8'),
      case when i.title ilike qi.pattern then 'Capture title matched' else 'Capture content matched' end,
      greatest(ts_rank(i.search_vector, qi.q), case when i.title ilike qi.pattern then 0.8 else 0 end)::real,
      i.updated_at,
      i.confidentiality,
      i.project_id,
      i.area_id,
      i.vault_id
    from public.inbox_items i
    cross join query_input qi
    where i.workspace_id = p_workspace_id and i.archived_at is null
      and (i.search_vector @@ qi.q or i.title ilike qi.pattern)

    union all

    select
      'vault',
      v.id,
      v.name,
      coalesce(v.description, 'Vault'),
      case when v.name ilike qi.pattern then 'Vault name matched' else 'Vault description matched' end,
      case when v.name ilike qi.pattern then 0.8 else 0.3 end::real,
      v.updated_at,
      v.privacy_level,
      null::uuid,
      null::uuid,
      v.id
    from public.vaults v
    cross join query_input qi
    where v.workspace_id = p_workspace_id and v.archived_at is null
      and (v.name ilike qi.pattern or v.description ilike qi.pattern)
  )
  select *
  from combined
  order by rank desc, updated_at desc
  limit least(greatest(p_limit, 1), 100);
$$;

revoke all on function public.search_records(uuid, text, integer) from public;
grant execute on function public.search_records(uuid, text, integer) to authenticated;

comment on table public.activity_log is 'Append-only application activity. Full field-level audit/version history arrives in Phase 2.';
comment on table public.record_tags is 'Polymorphic tag links. Application and RLS validate workspace ownership; record existence is validated by application actions.';
