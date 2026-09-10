import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
