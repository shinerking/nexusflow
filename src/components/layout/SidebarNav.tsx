"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, FileText, Settings, CheckSquare, History } from "lucide-react";
import { clsx } from "clsx";
import { type UserWithRole } from "@/app/actions/auth";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Box },
  { href: "/procurement", label: "Procurement", icon: FileText },
  { href: "/history", label: "History", icon: History, staffOnly: true },
  { href: "/approvals", label: "Approvals", icon: CheckSquare, managerOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

type SidebarNavProps = {
  currentUser?: UserWithRole | null;
};

export default function SidebarNav({ currentUser }: SidebarNavProps) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  // Filter menu items based on user role
  const visibleItems = navItems.filter((item) => {
    // Hide Approvals from STAFF and AUDITOR
    if (item.managerOnly) {
      return currentUser && ["MANAGER", "ADMIN"].includes(currentUser.role);
    }
    // Hide History from non-STAFF
    if (item.staffOnly) {
      return currentUser && currentUser.role === "STAFF";
    }
    return true;
  });

  useEffect(() => {
    // Only fetch pending count for MANAGER/ADMIN
    if (!currentUser || !["MANAGER", "ADMIN"].includes(currentUser.role)) {
      return;
    }

    // Fetch pending count for badge
    const fetchPendingCount = async () => {
      try {
        const res = await fetch("/api/approvals/count");
        if (res.ok) {
          const data = await res.json();
          setPendingCount(data.count || 0);
        }
      } catch (e) {
        // Silently fail
      }
    };

    fetchPendingCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <nav className="flex-1 space-y-0.5 p-4" aria-label="Sidebar">
      {visibleItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon
              className={clsx(
                "h-5 w-5 flex-shrink-0",
                isActive
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              )}
              aria-hidden
            />
            <span className="flex-1">{label}</span>
            {(href === "/approvals" || href === "/procurement") && pendingCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
