-- Optional, non-sensitive example data for Diane OS.
-- Run only after at least one auth user has been created.

do $$
declare
  owner_uuid uuid;
  workspace_uuid uuid;
  work_vault uuid;
  personal_vault uuid;
  work_area uuid;
  diane_project uuid;
  cit_project uuid;
begin
  select u.id into owner_uuid from auth.users u order by u.created_at limit 1;
  if owner_uuid is null then
    raise notice 'No auth user exists. Create the owner account before running seed.sql.';
    return;
  end if;

  select wm.workspace_id into workspace_uuid
  from public.workspace_members wm
  where wm.user_id = owner_uuid
  order by wm.created_at
  limit 1;

  select id into work_vault from public.vaults where workspace_id = workspace_uuid and slug = 'work-and-career';
  select id into personal_vault from public.vaults where workspace_id = workspace_uuid and slug = 'personal-life';
  select id into work_area from public.areas where workspace_id = workspace_uuid and title = 'Work Management';

  insert into public.projects (
    workspace_id, owner_id, vault_id, area_id, title, description, status, priority, health,
    desired_outcome, success_criteria, next_action, target_date, confidentiality
  ) values (
    workspace_uuid, owner_uuid, personal_vault, work_area, '[Example] Build Diane OS',
    'Create a private, searchable and portable operating system owned by Diane.',
    'active', 'high', 'on_track',
    'A secure deployed MVP that supports projects, tasks, captures, search and source-aware AI review.',
    'The 25 MVP acceptance checks can be demonstrated.',
    'Complete and verify the Phase 1 foundation.', current_date + 45,
    'personal_private'
  ) returning id into diane_project;

  insert into public.projects (
    workspace_id, owner_id, vault_id, area_id, title, description, status, priority, health,
    desired_outcome, success_criteria, next_action, target_date, confidentiality
  ) values (
    workspace_uuid, owner_uuid, work_vault, work_area, '[Example] CIT Knowledge Centre',
    'Organize procedures, ownership, references and supporting evidence for CIT work.',
    'planned', 'medium', 'unknown',
    'A maintained knowledge centre that supports the team and preserves professional knowledge appropriately.',
    'Core SOPs are assigned, current, searchable and linked to source material.',
    'Confirm the first five SOP priorities.', current_date + 90,
    'company_confidential'
  ) returning id into cit_project;

  insert into public.tasks (workspace_id, owner_id, project_id, area_id, vault_id, title, status, priority, due_date, next_action, confidentiality)
  values
    (workspace_uuid, owner_uuid, diane_project, work_area, personal_vault, '[Example] Review imported ChatGPT conversations', 'next', 'high', current_date + 7, true, 'personal_private'),
    (workspace_uuid, owner_uuid, cit_project, work_area, work_vault, '[Example] Receive project input', 'waiting', 'medium', current_date + 14, false, 'company_confidential');

  update public.tasks
  set waiting_on_name = 'Sample Team Member', follow_up_date = current_date + 7
  where workspace_id = workspace_uuid and title = '[Example] Receive project input';

  insert into public.inbox_items (workspace_id, owner_id, title, content, proposed_record_type, confidentiality)
  values (
    workspace_uuid, owner_uuid, '[Example] Imported conversation',
    'This is a short fictional conversation used to show how imported source material will enter the review queue in a later phase.',
    'conversation', 'personal_private'
  );

  raise notice 'Example data created for workspace %', workspace_uuid;
end;
$$;
