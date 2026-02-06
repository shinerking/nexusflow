"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, User, Menu } from "lucide-react";
import Link from "next/link";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/inventory": "Inventory",
  "/procurement": "Procurement",
  "/settings": "Settings",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
  ];

  if (pathname === "/") {
    crumbs.push({ label: "Dashboard", href: "/" });
    return crumbs;
  }

  let href = "";
  for (const segment of segments) {
    href += `/${segment}`;
    const label = routeLabels[href] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
    crumbs.push({ label, href });
  }
  return crumbs;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 sm:gap-4 sm:px-6">
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs - Hidden on mobile */}
      <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-sm md:flex">
        {breadcrumbs.map((item, i) => (
          <span key={`${item.href}-${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-slate-300" aria-hidden>
                /
              </span>
            )}
            <Link
              href={item.href}
              className="text-slate-600 hover:text-slate-900"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4 lg:max-w-xl">
        {/* Search */}
        <div className="relative hidden flex-1 max-w-xs sm:block">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            aria-label="Search"
          />
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 sm:px-3"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
              <User className="h-4 w-4" aria-hidden />
            </span>
            <span className="hidden text-left sm:block">
              <span className="font-medium text-slate-900">Admin</span>
              <span className="block text-xs text-slate-500">admin@nexusflow.com</span>
            </span>
            <ChevronDown
              className={["h-4 w-4 text-slate-500 transition-transform hidden sm:block", profileOpen && "rotate-180"].filter(Boolean).join(" ")}
              aria-hidden
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              role="menu"
            >
              <Link
                href="/settings/profile"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Settings
              </Link>
              <hr className="my-1 border-slate-200" />
              <Link
                href="/logout"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Sign out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
