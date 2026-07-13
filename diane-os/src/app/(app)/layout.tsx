import { AppShell } from "@/components/layout/app-shell";
import { requireWorkspace } from "@/lib/auth";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const context = await requireWorkspace();
  return (
    <AppShell displayName={context.user.displayName} workspaceName={context.workspace.name}>
      {children}
    </AppShell>
  );
}
