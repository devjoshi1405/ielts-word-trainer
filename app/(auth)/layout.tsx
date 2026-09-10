import * as React from "react";
import Link from "next/link";
import { Headphones, Sparkles, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background glowing radial gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none" />

      {/* Top Simple Header */}
      <header className="p-4 sm:p-6 md:px-12 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform shrink-0">
            <Headphones className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
              IELTS Word Trainer
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                PRO
              </span>
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-slate-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Supabase Auth & RLS</span>
          <span className="sm:hidden text-[11px]">Protected</span>
        </div>
      </header>

      {/* Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Bottom Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10">
        <p>© 2026 IELTS Word Trainer. Band 8.5+ Spaced Repetition Platform.</p>
      </footer>
    </div>
  );
}
