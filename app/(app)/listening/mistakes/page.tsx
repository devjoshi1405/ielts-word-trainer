"use client";

import * as React from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Search,
  Clock,
  BookOpen,
  Filter,
  Check,
} from "lucide-react";
import { MistakeCard } from "@/components/listening/mistake-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/hooks/use-user-progress";
import { MistakeType } from "@/types/progress.types";

export default function MistakesReviewPage() {
  const { mistakes, loading, error, removeMistake } = useUserProgress();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const handleRemove = (id: string) => {
    removeMistake(id);
  };

  const dueCount = mistakes.filter((m) => m.isDue).length;
  const masteredCount = mistakes.filter((m) => (m.masteryNumeric ?? 1) >= 4).length;
  const learningCount = mistakes.filter((m) => (m.masteryNumeric ?? 1) <= 1).length;

  const filteredMistakes = React.useMemo(() => {
    return mistakes.filter((m) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesWord = m.word.toLowerCase().includes(q);
        const matchesTrap = (m.commonTrap || "").toLowerCase().includes(q);
        const matchesDiag = (m.mistakeExplanation || "").toLowerCase().includes(q);
        if (!matchesWord && !matchesTrap && !matchesDiag) return false;
      }

      // 2. Tab Filter (All, Due, Mastery Levels)
      if (activeTab === "due") {
        if (!m.isDue) return false;
      } else if (activeTab === "learning") {
        if ((m.masteryNumeric ?? 1) !== 1) return false;
      } else if (activeTab === "practicing") {
        if ((m.masteryNumeric ?? 1) !== 2) return false;
      } else if (activeTab === "familiar") {
        if ((m.masteryNumeric ?? 1) !== 3) return false;
      } else if (activeTab === "mastered") {
        if ((m.masteryNumeric ?? 1) < 4) return false;
      }

      // 3. Mistake Type Filter
      if (typeFilter !== "all") {
        if (m.mistakeType !== typeFilter) return false;
      }

      return true;
    });
  }, [mistakes, activeTab, typeFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Personal Spaced Repetition Bank
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="destructive" className="text-[10px]">
              {mistakes.length} Words Tracked
            </Badge>
            {dueCount > 0 && (
              <Badge variant="warning" className="text-[10px] animate-pulse">
                {dueCount} Due for Review
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            My Mistakes Review
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Deterministic classification for spelling, grammar, numbers, and vocabulary traps. Repeated practice upgrades words to Mastered (Level 4).
          </p>
        </div>

        {mistakes.length > 0 && (
          <div className="flex items-center gap-2">
            <Link href="/listening/listen-and-type?mode=mistakes">
              <Button variant="brand" size="lg" className="gap-2 shadow-sm font-semibold">
                <RotateCcw className="w-4 h-4" />
                <span>Practice All Mistakes ({mistakes.length})</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-muted-foreground font-medium">Total Mistakes</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{mistakes.length}</div>
        </div>
        <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/40">
          <div className="text-xs text-amber-800 dark:text-amber-300 font-medium">Due for Review</div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">{dueCount} words</div>
        </div>
        <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200/80 dark:border-rose-900/40">
          <div className="text-xs text-rose-800 dark:text-rose-300 font-medium">Level 1: Learning</div>
          <div className="text-xl font-bold text-rose-700 dark:text-rose-400 mt-0.5">{learningCount} words</div>
        </div>
        <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40">
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Level 4: Mastered</div>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{masteredCount} words</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search word or spelling trap..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        {/* 9-Type Mistake Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          >
            <option value="all">All Mistake Types (9)</option>
            <option value="spelling">Spelling Mistakes</option>
            <option value="singular-plural">Singular / Plural Mistakes</option>
            <option value="article">Article Mistakes</option>
            <option value="preposition">Preposition Mistakes</option>
            <option value="number">Number Mistakes</option>
            <option value="date-time">Date / Time Mistakes</option>
            <option value="missing-word">Missing Words</option>
            <option value="extra-word">Extra Words</option>
            <option value="wrong-word">Wrong Words</option>
          </select>
        </div>
      </div>

      {/* Mastery Level Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "all"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          All ({mistakes.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("due")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${
            activeTab === "due"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>Due for Review ({dueCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("learning")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "learning"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
          }`}
        >
          Level 1: Learning ({learningCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("practicing")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "practicing"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          Level 2: Practicing ({mistakes.filter((m) => (m.masteryNumeric ?? 1) === 2).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("familiar")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "familiar"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400"
          }`}
        >
          Level 3: Familiar ({mistakes.filter((m) => (m.masteryNumeric ?? 1) === 3).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mastered")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "mastered"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
          }`}
        >
          Level 4: Mastered ({masteredCount})
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredMistakes.length > 0 ? (
        <div className="space-y-3">
          {filteredMistakes.map((mistake) => (
            <MistakeCard
              key={mistake.id}
              mistake={mistake}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title={searchQuery ? "No Matching Mistakes Found" : activeTab === "all" ? "No Mistakes Recorded Yet" : "No Mistakes in this Filter"}
          description={
            searchQuery
              ? "Try searching for a different word or clearing the active filters."
              : activeTab === "due"
              ? "All caught up! No mistake items are currently due for spaced review."
              : "Words you miss during Listen & Type practice will automatically be classified into your personal spaced-repetition queue."
          }
          actionLabel={searchQuery ? "Clear Search" : "Practice Listen & Type"}
          onAction={() => {
            if (searchQuery) {
              setSearchQuery("");
              setActiveTab("all");
              setTypeFilter("all");
            } else {
              window.location.href = "/listening/listen-and-type";
            }
          }}
        />
      )}
    </div>
  );
}
