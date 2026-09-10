"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, Award, Zap, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type TopicMode = "learn" | "practice" | "test";

interface TopicHeaderProps {
  topicName: string;
  tagline: string;
  categorySlug: string;
  currentMode: TopicMode;
  onSelectMode: (mode: TopicMode) => void;
  progressPercent: number;
  masteryScore: number;
  isMastered: boolean;
}

export function TopicHeader({
  topicName,
  tagline,
  currentMode,
  onSelectMode,
  progressPercent,
  masteryScore,
  isMastered,
}: TopicHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          App
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <Link href="/grammar" className="hover:text-foreground transition-colors">
          Grammar Master
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <Link href="/grammar#parts-of-speech" className="hover:text-foreground transition-colors">
          Parts of Speech
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">{topicName}</span>
      </div>

      {/* Main Topic Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/grammar"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </Link>
            <Badge variant="indigo" className="text-[10px]">
              Part of Speech
            </Badge>
            {isMastered && (
              <Badge variant="success" className="text-[10px] gap-1">
                <CheckCircle2 className="w-3 h-3" /> Mastered (85%+)
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            {topicName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            {tagline}
          </p>
        </div>

        {/* Progress & Mastery Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
            {masteryScore > 0 ? `${masteryScore}%` : `${progressPercent}%`}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <span>{isMastered ? "Topic Mastered" : progressPercent > 0 ? "In Progress" : "Not Started"}</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {isMastered ? "Score: 85%+ achieved" : "Pass test with 85%+ for mastery"}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => onSelectMode("learn")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            currentMode === "learn"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Learn Rules</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode("practice")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            currentMode === "practice"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. Practice Drills</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode("test")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            currentMode === "test"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>3. Take Test</span>
        </button>
      </div>
    </div>
  );
}
