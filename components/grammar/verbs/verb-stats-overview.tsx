"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Award,
  AlertCircle,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerbProgressStats } from "@/types/grammar.types";

interface VerbStatsOverviewProps {
  stats: VerbProgressStats | null;
  loading?: boolean;
}

export function VerbStatsOverview({ stats, loading = false }: VerbStatsOverviewProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  const {
    totalVerbs,
    learnedCount,
    masteredCount,
    weakCount,
    notStartedCount,
    progressPercent,
  } = stats;

  return (
    <div className="space-y-4">
      {/* 4 Stats KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Verbs */}
        <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Verb Bank</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center text-xs">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalVerbs}+
            </div>
            <p className="text-[11px] text-muted-foreground">Curated IELTS verb bank</p>
          </CardContent>
        </Card>

        {/* Learned */}
        <Card className="border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">
                Learned Verbs
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 flex items-center justify-center text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {learnedCount}
              <span className="text-xs font-semibold text-muted-foreground ml-1">/ {totalVerbs}</span>
            </div>
            <div className="space-y-1 pt-0.5">
              <Progress value={progressPercent} className="h-1.5" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{progressPercent}% Complete</span>
                <span>{notStartedCount} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mastered */}
        <Card className="border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Mastered (85%+)
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center text-xs">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {masteredCount}
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
              Accurate across tests
            </p>
          </CardContent>
        </Card>

        {/* Needs Practice (Weak Verbs) */}
        <Card className="border-amber-200/80 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                Needs Practice
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 flex items-center justify-center text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              {weakCount}
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
              {weakCount > 0 ? "Flagged for revision" : "All tested verbs strong"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Banner to Take Test */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Diagnostic & Practice Test
            </span>
            <Badge variant="success" className="text-[9px]">
              Active Recall
            </Badge>
          </div>
          <h4 className="font-bold text-sm sm:text-base">
            Test Your V1 • V2 • V3 Recall & Conjugation
          </h4>
          <p className="text-xs text-indigo-100">
            Take a 10, 20, or 30-question diagnostic test to discover weak verbs and achieve mastery.
          </p>
        </div>

        <Link href="/grammar/verbs/test">
          <Button
            variant="default"
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-xs gap-1.5 shrink-0 w-full sm:w-auto"
          >
            <span>Take Verb Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
