"use client";

import * as React from "react";
import Link from "next/link";
import {
  Percent,
  CheckCircle2,
  BookOpen,
  Flame,
  ArrowRight,
  TrendingUp,
  Target,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ContinuePracticeCard } from "@/components/dashboard/continue-card";
import { MistakesPreview } from "@/components/dashboard/mistakes-preview";
import { QuickModulesGrid } from "@/components/dashboard/quick-modules";
import { useUserProgress } from "@/hooks/use-user-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { stats, loading, error } = useUserProgress();

  const listeningAccuracy = stats?.listeningAccuracy ?? 0;
  const questionsCompleted = stats?.questionsCompleted ?? 0;
  const wordsMastered = stats?.wordsMastered ?? 0;
  const currentStreak = stats?.currentStreak ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Good day 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Real-time IELTS listening accuracy and personalized spaced repetition.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/progress"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target Band: 8.5 (Active)</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Notice: Operating in local persistence mode. Progress is saved locally.</span>
        </div>
      )}

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Listening Accuracy"
          value={loading ? "..." : `${listeningAccuracy}%`}
          subtitle={
            questionsCompleted > 0
              ? `${stats?.correctAnswers ?? 0} / ${questionsCompleted} correct`
              : "No attempts yet"
          }
          change={
            listeningAccuracy >= 80
              ? { value: "Band 8+ Pace", trend: "up" }
              : questionsCompleted > 0
              ? { value: "In Progress", trend: "neutral" }
              : undefined
          }
          icon={Percent}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/50"
        />

        <StatCard
          title="Questions Completed"
          value={loading ? "..." : questionsCompleted.toLocaleString()}
          subtitle="Target: 2,000"
          change={
            questionsCompleted > 0
              ? { value: `+${questionsCompleted} total`, trend: "up" }
              : { value: "Start now", trend: "neutral" }
          }
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
        />

        <StatCard
          title="Words Mastered"
          value={loading ? "..." : wordsMastered.toLocaleString()}
          subtitle="Zero spelling mistakes"
          change={
            wordsMastered > 0
              ? { value: `${wordsMastered} mastered`, trend: "up" }
              : { value: "3x correct needed", trend: "neutral" }
          }
          icon={BookOpen}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
        />

        <StatCard
          title="Current Streak"
          value={loading ? "..." : `${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`}
          subtitle={currentStreak > 0 ? "Continuous activity" : "Practice today!"}
          change={
            currentStreak > 0
              ? { value: "Active Streak", trend: "up" }
              : { value: "Begin streak", trend: "neutral" }
          }
          icon={Flame}
          iconColor="text-orange-600 dark:text-orange-400"
          iconBg="bg-orange-50 dark:bg-orange-950/50"
        />
      </div>

      {/* Hero Continue Practice Card */}
      <ContinuePracticeCard />

      {/* Practice Your Mistakes Section */}
      <MistakesPreview />

      {/* Quick Launch Practice Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Practice by Category
          </h2>
          <Link
            href="/listening"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <QuickModulesGrid />
      </div>

      {/* Featured New Module: Grammar Master */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Grammar Master
              </h3>
              <Badge variant="indigo">New Module</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Structured curriculum for Parts of Speech, verb conjugations, and Band 7.5+ grammatical range.
            </p>
          </div>
        </div>
        <Link href="/grammar" className="shrink-0 w-full sm:w-auto">
          <Button variant="brand" size="sm" className="w-full sm:w-auto gap-2">
            <span>Explore Grammar Master</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
