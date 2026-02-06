"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, FileText, Settings } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Box },
  { href: "/procurement", label: "Procurement", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-0.5 p-4" aria-label="Sidebar">
      {navItems.map(({ href, label, icon: Icon }) => {
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
  );
}
