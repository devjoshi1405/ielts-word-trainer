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
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-lg tracking-tight">
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

        <div className="flex items-center space-x-3">
          {user ? (
            <Link href="/dashboard">
              <Button variant="brand" size="sm" className="gap-2 shadow-xs">
                <span>Dashboard ({profile?.display_name || user.email?.split("@")[0]})</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log in</span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="brand" size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign up Free</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
