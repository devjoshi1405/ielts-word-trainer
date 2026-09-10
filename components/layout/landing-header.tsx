"use client";

import * as React from "react";
import Link from "next/link";
import { Headphones, ArrowRight, LogIn, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function LandingHeader() {
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0 select-none">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform shrink-0">
            <Headphones className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight whitespace-nowrap">
              IELTS <span className="text-indigo-600">Word Trainer</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="#problem" className="hover:text-indigo-600 transition-colors">
            The Problem
          </Link>
          <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">
            How It Works
          </Link>
          <Link href="#features" className="hover:text-indigo-600 transition-colors">
            Curriculum
          </Link>
          <Link href="#mistakes" className="hover:text-indigo-600 transition-colors">
            Mistake Engine
          </Link>
        </nav>

        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {user ? (
            <Link href="/dashboard">
              <Button variant="brand" size="sm" className="gap-1.5 sm:gap-2 text-xs font-semibold shadow-xs px-2.5 sm:px-3">
                <span>Dashboard<span className="hidden sm:inline"> ({profile?.display_name || user.email?.split("@")[0]})</span></span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-1.5 text-xs font-semibold px-2 sm:px-3">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log in</span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="brand" size="sm" className="gap-1 sm:gap-1.5 text-xs font-semibold shadow-xs px-2.5 sm:px-3.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign up<span className="hidden sm:inline"> Free</span></span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
