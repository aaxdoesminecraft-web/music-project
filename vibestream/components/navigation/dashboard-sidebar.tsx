"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/", icon: "◫" },
  { label: "Library", href: "/library", icon: "♫" },
  { label: "Browse", href: "/explore", icon: "◎" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-brandWrap">
        <div className="dashboard-brand">
          <div className="dashboard-brandBadge" aria-hidden="true">
            <span>▶</span>
          </div>
          <div className="dashboard-brandText">
            <h1>VibeStream</h1>
            <p>Premium Sound</p>
          </div>
        </div>
      </div>

      <nav aria-label="Dashboard">
        <ul className="dashboard-navList">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`dashboard-navLink${
                  pathname === item.href ? " is-active" : ""
                }`}
              >
                <span className="dashboard-navIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
