import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  children,
  displayName,
  workspaceName,
}: {
  children: React.ReactNode;
  displayName: string;
  workspaceName: string;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar workspaceName={workspaceName} />
      <div className="min-w-0 flex-1">
        <Topbar displayName={displayName} />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
