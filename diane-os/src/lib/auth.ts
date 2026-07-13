import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { WorkspaceContext } from "@/types/domain";

export const requireWorkspace = cache(async (): Promise<WorkspaceContext> => {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const user = authData.user;
  const { data: membership, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error("Diane OS could not load your workspace membership.");
  }

  if (!membership) {
    throw new Error(
      "Your account exists, but its Diane OS workspace has not been provisioned. Run the database migration or contact the owner.",
    );
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("id", membership.workspace_id)
    .single();

  if (workspaceError || !workspace) {
    throw new Error("Diane OS could not load your workspace.");
  }

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Diane";

  return {
    user: {
      id: user.id,
      email: user.email ?? null,
      displayName,
    },
    workspace: {
      id: workspace.id,
      name: workspace.name,
      role: membership.role as "owner" | "trusted_user",
    },
  };
});
