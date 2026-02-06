"use client";

import Link from "next/link";
import SidebarNav from "./SidebarNav";
import { type UserWithRole } from "@/app/actions/auth";


interface SidebarProps {
  orgName: string;
  currentUser?: UserWithRole | null;
}

export default function Sidebar({ orgName, currentUser }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-shrink-0 border-r border-slate-200 bg-white transition-colors duration-300 lg:block dark:border-slate-700/50 dark:bg-slate-900"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-700/50">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {orgName}
            </span>
          </Link>
        </div>

        {/* Nav */}
        <SidebarNav currentUser={currentUser} />

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-700/50">

          <p className="text-xs text-slate-500">{orgName} v1.0</p>
        </div>
      </div>
    </aside>
  );
}
