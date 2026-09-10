"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  UserCheck,
  KeyRound,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithPassword, isConfigured, user, loading: authLoading } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const { error } = await signInWithPassword(email.trim(), password);

      if (error) {
        setErrorMessage(error.message || "Invalid login credentials.");
      } else {
        setSuccessMessage("Login successful! Redirecting to your dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-1">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Student Account Login</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Sign in to sync your mistakes, streak, and Band 8.5+ mastery across devices.
        </p>
      </div>

      {!isConfigured && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">Supabase Setup Notice</p>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Add <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-100">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-100">.env</code> to enable live database sync. You can also test with Guest Mode below.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@ielts.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset is managed via your Supabase project authentication settings.");
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="brand"
          size="lg"
          disabled={submitting}
          className="w-full gap-2 shadow-lg shadow-indigo-600/30 font-semibold"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Word Trainer</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-widest absolute">
          or
        </span>
      </div>

      <Button
        type="button"
        onClick={handleGuestLogin}
        variant="outline"
        size="lg"
        className="w-full gap-2 bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <UserCheck className="w-4 h-4 text-emerald-400" />
        <span>Continue as Guest / Local Storage</span>
      </Button>

      <div className="text-center text-xs text-slate-400 pt-2">
        Don&apos;t have an account yet?{" "}
        <Link href="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 underline underline-offset-4">
          Create free account
        </Link>
      </div>
    </div>
  );
}
