"use client";

import Link from "next/link";
import SidebarNav from "./SidebarNav";

interface SidebarProps {
  orgName: string;
}

export default function Sidebar({ orgName }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-shrink-0 border-r border-slate-700/50 bg-slate-900 lg:block"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-700/50 px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-white">
              {orgName}
            </span>
          </Link>
        </div>

        {/* Nav */}
        <SidebarNav />

        {/* Footer */}
        <div className="border-t border-slate-700/50 p-4">
          <p className="text-xs text-slate-500">{orgName} v1.0</p>
        </div>
      </div>
    </aside>
  );
}
