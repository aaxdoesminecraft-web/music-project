import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { DashboardTopbar } from "@/components/navigation/dashboard-topbar";
import { PlayerBar } from "@/components/ui/player-bar";

export function AppShell({
  children,
  mainClassName = "",
}: {
  children: ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <DashboardTopbar />
        <DashboardSidebar />
        <section className={`dashboard-main ${mainClassName}`.trim()}>{children}</section>
        <PlayerBar />
      </div>
    </div>
  );
}
