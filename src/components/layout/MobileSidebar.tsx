"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, FileText, Settings, X, CheckSquare, History } from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { type UserWithRole } from "@/app/actions/auth";


const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Box },
  { href: "/procurement", label: "Procurement", icon: FileText },
  { href: "/history", label: "History", icon: History, staffOnly: true },
  { href: "/approvals", label: "Approvals", icon: CheckSquare, managerOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  orgName: string;
  currentUser?: UserWithRole | null;
}

export default function MobileSidebar({ isOpen, onClose, orgName, currentUser }: MobileSidebarProps) {
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

  // Fetch pending count for badge
  useEffect(() => {
    // Only fetch pending count for MANAGER/ADMIN
    if (!currentUser || !["MANAGER", "ADMIN"].includes(currentUser.role)) {
      return;
    }

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

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex h-full flex-col">
          {/* Header with Logo and Close Button */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
            <Link href="/" className="flex items-center gap-2" onClick={onClose}>
              <span className="text-xl font-semibold tracking-tight text-white">
                {orgName}
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 p-4" aria-label="Mobile sidebar">
            {visibleItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
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
                        : "text-slate-400"
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

          {/* Footer */}
          <div className="border-t border-slate-800 p-4">

            <p className="text-xs text-slate-500">{orgName} v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
