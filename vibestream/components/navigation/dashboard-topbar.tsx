export function DashboardTopbar() {
  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbarBrand">VibeStream</div>
      <div className="dashboard-topbarActions">
        <button type="button" aria-label="Notifications">
          ◌
        </button>
        <button type="button" aria-label="Settings">
          ⚙
        </button>
      </div>
    </header>
  );
}
