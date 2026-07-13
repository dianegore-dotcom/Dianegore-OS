import { describe, expect, it } from "vitest";
import { captureSchema, projectSchema, taskSchema } from "@/lib/validators/records";

const uuid = "123e4567-e89b-12d3-a456-426614174000";

describe("projectSchema", () => {
  it("accepts a practical project payload", () => {
    const result = projectSchema.safeParse({
      title: "Build Diane OS",
      description: "Private operating system",
      status: "active",
      priority: "high",
      health: "on_track",
      desired_outcome: "A usable deployed application",
      success_criteria: "Phase 1 acceptance checks pass",
      next_action: "Apply the database migration",
      target_date: "2026-08-31",
      vault_id: uuid,
      area_id: "",
      confidentiality: "personal_private",
      tags: "OS, Netlify",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = projectSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });
});

describe("taskSchema", () => {
  it("normalizes optional form values", () => {
    const result = taskSchema.parse({
      title: "Follow up on QIZ certificate",
      status: "waiting",
      priority: "high",
      due_date: "",
      project_id: "",
      area_id: "",
      vault_id: "",
      delegated_to_name: "",
      waiting_on_name: "Supplier",
      follow_up_date: "2026-07-20",
      next_action: "on",
      confidentiality: "company_confidential",
      tags: "QIZ, Egypt",
    });
    expect(result.project_id).toBeNull();
    expect(result.next_action).toBe(true);
    expect(result.waiting_on_name).toBe("Supplier");
  });
});

describe("captureSchema", () => {
  it("requires meaningful capture content", () => {
    const result = captureSchema.safeParse({
      title: "",
      content: " ",
      proposed_record_type: "note",
      due_date: "",
      project_id: "",
      area_id: "",
      vault_id: "",
      confidentiality: "personal_private",
      tags: "",
    });
    expect(result.success).toBe(false);
  });
});
