"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppHeader } from "@/components/layout/app-header";
import { useAuth } from "@/hooks/use-auth";
import { Headphones } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?returnTo=${returnUrl}`);
    }
  }, [user, loading, router, pathname]);

  // While checking auth status, show clean branded loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 animate-pulse">
            <Headphones className="w-6 h-6" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-muted-foreground">
              Verifying session...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in and not loading, render null while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar className="hidden md:flex flex-shrink-0" />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navigation (Header + Bottom Bar + Drawer) */}
        <MobileNav />

        {/* Desktop Header */}
        <AppHeader />

        {/* Page Content Viewport with mobile bottom bar padding */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-12 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

