import type {
  CONFIDENTIALITY_LEVELS,
  PRIORITIES,
  PROJECT_HEALTH,
  PROJECT_STATUSES,
  TASK_STATUSES,
} from "@/lib/constants";

export type Confidentiality = (typeof CONFIDENTIALITY_LEVELS)[number];
export type Priority = (typeof PRIORITIES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectHealth = (typeof PROJECT_HEALTH)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type WorkspaceContext = {
  user: {
    id: string;
    email: string | null;
    displayName: string;
  };
  workspace: {
    id: string;
    name: string;
    role: "owner" | "trusted_user";
  };
};

export type Vault = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  privacy_level: Confidentiality;
  position: number;
  archived_at: string | null;
};

export type Area = {
  id: string;
  title: string;
  purpose: string | null;
  category: string | null;
  status: string;
  review_frequency: string | null;
  confidentiality: Confidentiality;
  vault_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: ProjectStatus;
  priority: Priority;
  stage: string | null;
  health: ProjectHealth;
  desired_outcome: string | null;
  success_criteria: string | null;
  start_date: string | null;
  target_date: string | null;
  actual_completion_date: string | null;
  next_action: string | null;
  confidentiality: Confidentiality;
  vault_id: string | null;
  area_id: string | null;
  pinned: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  vaults?: { name: string } | null;
  areas?: { title: string } | null;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  start_date: string | null;
  delegated_to_name: string | null;
  waiting_on_name: string | null;
  next_action: boolean;
  estimated_minutes: number | null;
  completed_at: string | null;
  follow_up_date: string | null;
  confidentiality: Confidentiality;
  project_id: string | null;
  area_id: string | null;
  vault_id: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  projects?: { title: string } | null;
  areas?: { title: string } | null;
};

export type InboxItem = {
  id: string;
  title: string | null;
  content: string;
  proposed_record_type: string | null;
  status: "inbox" | "processed" | "archived";
  due_date: string | null;
  confidentiality: Confidentiality;
  ai_processing_status: string;
  created_at: string;
  vault_id: string | null;
  project_id: string | null;
  area_id: string | null;
};

export type SearchResult = {
  record_type: string;
  record_id: string;
  title: string;
  snippet: string;
  reason: string;
  rank: number;
  updated_at: string;
  confidentiality: Confidentiality;
  project_id: string | null;
  area_id: string | null;
  vault_id: string | null;
};

export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_ACTION_STATE: ActionState = {
  ok: false,
  message: "",
};
