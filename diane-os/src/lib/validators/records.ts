import { z } from "zod";
import {
  CONFIDENTIALITY_LEVELS,
  PRIORITIES,
  PROJECT_HEALTH,
  PROJECT_STATUSES,
  RECORD_TYPES,
  TASK_STATUSES,
} from "@/lib/constants";

const optionalUuid = z.preprocess(
  (value) => (typeof value === "string" && value.trim() ? value : null),
  z.uuid().nullable(),
);

const optionalText = (max = 5000) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() ? value.trim() : null),
    z.string().max(max).nullable(),
  );

const optionalDate = z.preprocess(
  (value) => (typeof value === "string" && value.trim() ? value : null),
  z.iso.date().nullable(),
);

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Enter a project title.").max(180),
  description: optionalText(10000),
  category: optionalText(80),
  status: z.enum(PROJECT_STATUSES).default("planned"),
  priority: z.enum(PRIORITIES).default("medium"),
  health: z.enum(PROJECT_HEALTH).default("unknown"),
  desired_outcome: optionalText(2000),
  success_criteria: optionalText(3000),
  next_action: optionalText(500),
  target_date: optionalDate,
  vault_id: optionalUuid,
  area_id: optionalUuid,
  confidentiality: z.enum(CONFIDENTIALITY_LEVELS).default("personal_private"),
  tags: optionalText(500),
});

export const areaSchema = z.object({
  title: z.string().trim().min(2, "Enter an area title.").max(180),
  purpose: optionalText(3000),
  category: optionalText(80),
  review_frequency: optionalText(80),
  vault_id: optionalUuid,
  confidentiality: z.enum(CONFIDENTIALITY_LEVELS).default("personal_private"),
});

export const taskSchema = z.object({
  title: z.string().trim().min(2, "Enter a task title.").max(240),
  description: optionalText(5000),
  status: z.enum(TASK_STATUSES).default("next"),
  priority: z.enum(PRIORITIES).default("medium"),
  due_date: optionalDate,
  project_id: optionalUuid,
  area_id: optionalUuid,
  vault_id: optionalUuid,
  delegated_to_name: optionalText(180),
  waiting_on_name: optionalText(180),
  follow_up_date: optionalDate,
  next_action: z.preprocess((value) => value === "on" || value === "true", z.boolean()),
  confidentiality: z.enum(CONFIDENTIALITY_LEVELS).default("personal_private"),
  tags: optionalText(500),
});

export const captureSchema = z.object({
  title: optionalText(180),
  content: z.string().trim().min(2, "Enter something to capture.").max(25000),
  proposed_record_type: z.enum(RECORD_TYPES).nullable().optional(),
  due_date: optionalDate,
  project_id: optionalUuid,
  area_id: optionalUuid,
  vault_id: optionalUuid,
  confidentiality: z.enum(CONFIDENTIALITY_LEVELS).default("personal_private"),
  tags: optionalText(500),
});

export const vaultSchema = z.object({
  name: z.string().trim().min(2, "Enter a vault name.").max(100),
  description: optionalText(1000),
  icon: optionalText(12),
  privacy_level: z.enum(CONFIDENTIALITY_LEVELS).default("personal_private"),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  intent: z.enum(["login", "signup"]),
});
