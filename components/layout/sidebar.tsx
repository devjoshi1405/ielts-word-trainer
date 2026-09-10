"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Headphones,
  BookOpen,
  Binary,
  CalendarClock,
  AlertTriangle,
  TrendingUp,
  Settings,
  ChevronDown,
  Sparkles,
  Flame,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "indigo" | "neutral";
  subItems?: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Listening",
    href: "/listening",
    icon: Headphones,
    subItems: [
      { name: "Listen & Type", href: "/listening/listen-and-type", icon: Headphones, badge: "Core" },
      { name: "Vocabulary", href: "/listening/vocabulary", icon: BookOpen },
      { name: "Numbers", href: "/listening/numbers", icon: Binary },
      { name: "Dates & Times", href: "/listening/dates-times", icon: CalendarClock },
      { name: "My Mistakes", href: "/listening/mistakes", icon: AlertTriangle, badge: "7" },
    ],
  },
  {
    name: "Progress",
    href: "/progress",
    icon: TrendingUp,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [listeningOpen, setListeningOpen] = React.useState(true);

  const isListeningActive = pathname.startsWith("/listening");

  return (
    <aside
      className={cn(
        "flex flex-col w-64 border-r border-border/80 bg-card text-card-foreground h-screen sticky top-0 select-none z-30",
        className
      )}
    >
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/60 justify-between">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight tracking-tight flex items-center space-x-1">
              <span>IELTS</span>
              <span className="text-indigo-600 font-extrabold">Trainer</span>
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Listen & Type Platform
            </div>
          </div>
        </Link>
      </div>

      {/* Target Band Goal Pill */}
      <div className="px-4 pt-4 pb-2">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                12 Day Streak
              </div>
              <div className="text-[10px] text-muted-foreground">Target Band: 8.0</div>
            </div>
          </div>
          <Badge variant="indigo" className="text-[10px] px-2 py-0">
            Active
          </Badge>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : item.href === "/listening"
              ? isListeningActive
              : pathname.startsWith(item.href);

          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.name} className="space-y-1">
              {hasSubItems ? (
                <div>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-indigo-600" : "text-slate-400"
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setListeningOpen(!listeningOpen)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg mr-1"
                      aria-label="Toggle Submenu"
                    >
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          listeningOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </div>

                  {listeningOpen && (
                    <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-1">
                      {item.subItems?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                              isSubActive
                                ? "bg-indigo-600 text-white font-semibold shadow-xs"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                            )}
                          >
                            <div className="flex items-center space-x-2.5">
                              <sub.icon
                                className={cn(
                                  "w-3.5 h-3.5",
                                  isSubActive ? "text-white" : "text-slate-400"
                                )}
                              />
                              <span>{sub.name}</span>
                            </div>
                            {sub.badge && (
                              <span
                                className={cn(
                                  "text-[10px] px-1.5 py-0.2 rounded-full font-semibold",
                                  isSubActive
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                )}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-indigo-600" : "text-slate-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "neutral"} className="text-[10px] py-0 px-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Card at bottom */}
      <div className="p-4 border-t border-border/60">
        {user ? (
          <Link
            href="/settings"
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {profile?.display_name
                ? profile.display_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : user.email?.slice(0, 2).toUpperCase() || "ID"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {profile?.display_name || user.email?.split("@")[0] || "Candidate"}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors text-xs font-semibold"
          >
            <div className="flex items-center space-x-2">
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span>Sign In to Sync</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900/80">
              Cloud
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
}
