"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Headphones,
  TrendingUp,
  Settings,
  Menu,
  X,
  BookOpen,
  Binary,
  CalendarClock,
  AlertTriangle,
  BookMarked,
  PenTool,
  Mic,
  Flame,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Close drawer on route change
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent background scrolling when drawer is open
  React.useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur">
        <Link href="/dashboard" className="flex items-center space-x-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
            IELTS <span className="text-indigo-600">Trainer</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>12d</span>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Slide-over Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-4/5 max-w-xs bg-card h-full shadow-2xl z-10 border-r border-border/80 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  IELTS Trainer
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Practice Hero CTA in Drawer */}
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100/60 dark:border-indigo-900/40">
              <Link href="/listening/listen-and-type">
                <Button variant="brand" size="sm" className="w-full gap-2">
                  <Headphones className="w-4 h-4" />
                  Quick Listen & Type
                </Button>
              </Link>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                  Core Modules
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard"
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium",
                      pathname === "/dashboard"
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                      <span>Dashboard</span>
                    </div>
                  </Link>

                  <Link
                    href="/listening"
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium",
                      pathname === "/listening"
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Headphones className="w-4 h-4 text-indigo-600" />
                      <span>Listening Overview</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                  Listening Practice
                </div>
                <div className="space-y-0.5 pl-2">
                  <Link
                    href="/listening/listen-and-type"
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium",
                      pathname === "/listening/listen-and-type"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Listen & Type</span>
                    </div>
                    <Badge variant="indigo" className="text-[9px] py-0 px-1.5">
                      Core
                    </Badge>
                  </Link>

                  <Link
                    href="/listening/vocabulary"
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium",
                      pathname === "/listening/vocabulary"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Vocabulary</span>
                    </div>
                  </Link>

                  <Link
                    href="/listening/numbers"
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium",
                      pathname === "/listening/numbers"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Binary className="w-3.5 h-3.5" />
                      <span>Numbers</span>
                    </div>
                  </Link>

                  <Link
                    href="/listening/dates-times"
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium",
                      pathname === "/listening/dates-times"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>Dates & Times</span>
                    </div>
                  </Link>

                  <Link
                    href="/listening/mistakes"
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium",
                      pathname === "/listening/mistakes"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>My Mistakes</span>
                    </div>
                    <Badge variant="destructive" className="text-[9px] py-0 px-1.5">
                      7
                    </Badge>
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                  Other Modules
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/reading"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                  >
                    <div className="flex items-center space-x-2.5">
                      <BookMarked className="w-4 h-4 text-slate-400" />
                      <span>Reading</span>
                    </div>
                    <Badge variant="neutral" className="text-[9px] py-0 px-1.5">Soon</Badge>
                  </Link>

                  <Link
                    href="/writing"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                  >
                    <div className="flex items-center space-x-2.5">
                      <PenTool className="w-4 h-4 text-slate-400" />
                      <span>Writing</span>
                    </div>
                    <Badge variant="neutral" className="text-[9px] py-0 px-1.5">Soon</Badge>
                  </Link>

                  <Link
                    href="/speaking"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Mic className="w-4 h-4 text-slate-400" />
                      <span>Speaking</span>
                    </div>
                    <Badge variant="neutral" className="text-[9px] py-0 px-1.5">Soon</Badge>
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                  Account & Analytics
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/progress"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                      pathname === "/progress"
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Progress Tracker</span>
                  </Link>
                  <Link
                    href="/settings"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                      pathname === "/settings"
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Settings className="w-4 h-4 text-indigo-600" />
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Profile footer in drawer */}
            <div className="p-3 border-t border-border/60">
              <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    John Doe
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    Target Band 8.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 border-t border-border/80 backdrop-blur px-2 py-1.5 flex items-center justify-around">
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors",
            pathname === "/dashboard"
              ? "text-indigo-600 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/listening"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors",
            pathname.startsWith("/listening") && pathname !== "/listening/listen-and-type"
              ? "text-indigo-600 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Modules</span>
        </Link>

        {/* Center Prominent Practice Button */}
        <Link
          href="/listening/listen-and-type"
          className="flex flex-col items-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Headphones className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 mt-0.5">Practice</span>
        </Link>

        <Link
          href="/progress"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors",
            pathname === "/progress"
              ? "text-indigo-600 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span>Progress</span>
        </Link>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
