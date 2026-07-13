export const PROJECT_STATUSES = [
  "idea",
  "planned",
  "active",
  "waiting",
  "blocked",
  "on_hold",
  "completed",
  "cancelled",
  "archived",
] as const;

export const PROJECT_HEALTH = ["on_track", "needs_attention", "at_risk", "blocked", "unknown"] as const;

export const TASK_STATUSES = [
  "inbox",
  "next",
  "scheduled",
  "in_progress",
  "waiting",
  "blocked",
  "delegated",
  "completed",
  "cancelled",
  "someday",
] as const;

export const PRIORITIES = ["none", "low", "medium", "high", "urgent"] as const;

export const CONFIDENTIALITY_LEVELS = [
  "personal_private",
  "sensitive_personal",
  "personal_professional_knowledge",
  "company_confidential",
  "shareable",
  "public",
] as const;

export const RECORD_TYPES = ["note", "task", "idea", "decision", "meeting", "project", "question", "reminder", "conversation"] as const;

export const OPEN_TASK_STATUSES = new Set([
  "inbox",
  "next",
  "scheduled",
  "in_progress",
  "waiting",
  "blocked",
  "delegated",
  "someday",
]);

export function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
