"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, FileText, Settings, X } from "lucide-react";
import { clsx } from "clsx";
import { useEffect } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Box },
  { href: "/procurement", label: "Procurement", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  orgName: string;
}

export default function MobileSidebar({ isOpen, onClose, orgName }: MobileSidebarProps) {
  const pathname = usePathname();

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
          "fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-slate-700/50 bg-slate-900 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex h-full flex-col">
          {/* Header with Logo and Close Button */}
          <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-6">
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
            {navItems.map(({ href, label, icon: Icon }) => {
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
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  )}
                >
                  <Icon
                    className={clsx("h-5 w-5 flex-shrink-0", isActive && "text-slate-200")}
                    aria-hidden
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700/50 p-4">
            <p className="text-xs text-slate-500">{orgName} v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
