"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Headphones,
  Volume2,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function AppHeader() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ name: "Dashboard", href: "/dashboard" }];

    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const name = part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { name, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const userInitials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "G";

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Guest User";

  return (
    <header className="hidden md:flex h-16 border-b border-border/80 bg-background/95 backdrop-blur px-8 items-center justify-between sticky top-0 z-20">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          App
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.href}>
            <span className="text-muted-foreground/50">/</span>
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Quick Actions & Auth Indicators */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>British Accent (UK)</span>
        </div>

        <Link href="/listening/listen-and-type">
          <Button variant="brand" size="sm" className="gap-2">
            <Headphones className="w-4 h-4" />
            <span>Practice Session</span>
          </Button>
        </Link>

        {/* User Auth Profile Dropdown */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userInitials}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs bg-white dark:bg-slate-900">
                <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sign Up</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
