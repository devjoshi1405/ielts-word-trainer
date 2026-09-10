"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Award,
  ArrowRight,
  BookOpen,
  Zap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryProgressSummary } from "@/types/grammar.types";

interface CategoryProgressListProps {
  progressList: CategoryProgressSummary[];
  loading?: boolean;
}

export function CategoryProgressList({
  progressList,
  loading = false,
}: CategoryProgressListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/60 dark:border-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  const masteredCount = progressList.filter((p) => p.isMastered).length;
  const inProgressCount = progressList.filter(
    (p) => !p.isMastered && (p.progressPercent > 0 || p.masteryScore > 0)
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Mastery Tracker
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="indigo" className="text-[10px]">
              8 Parts of Speech
            </Badge>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
            Parts of Speech Learning Progress
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{masteredCount} of 8 Mastered</span>
          </span>
          {inProgressCount > 0 && (
            <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{inProgressCount} In Progress</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {progressList.map((item) => {
          const displayScore = item.masteryScore > 0 ? item.masteryScore : item.progressPercent;
          const statusBadge = item.isMastered ? (
            <Badge variant="success" className="text-[10px] gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" /> Mastered
            </Badge>
          ) : item.status === "practicing" ? (
            <Badge variant="indigo" className="text-[10px] font-bold">
              Practicing
            </Badge>
          ) : item.status === "learning" ? (
            <Badge variant="warning" className="text-[10px] font-bold">
              Learning
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground font-medium">
              Not Started
            </Badge>
          );

          const ctaText = item.isMastered
            ? "Review"
            : item.status === "practicing"
            ? "Take Test"
            : item.status === "learning"
            ? "Practice"
            : "Start";

          return (
            <Card
              key={item.categorySlug}
              className={`border transition-all hover:scale-[1.01] hover:shadow-xs flex flex-col justify-between ${
                item.isMastered
                  ? "border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : displayScore > 0
                  ? "border-indigo-200/80 dark:border-indigo-900/50 bg-white dark:bg-slate-800/80"
                  : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80"
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {item.categoryName}
                  </h3>
                  {statusBadge}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Mastery Score
                    </span>
                    <span
                      className={`font-bold ${
                        item.isMastered
                          ? "text-emerald-600 dark:text-emerald-400"
                          : displayScore > 0
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-500"
                      }`}
                    >
                      {displayScore}%
                    </span>
                  </div>
                  <Progress
                    value={displayScore}
                    className="h-1.5"
                    indicatorClassName={
                      item.isMastered
                        ? "bg-emerald-500"
                        : displayScore >= 70
                        ? "bg-indigo-600"
                        : "bg-amber-500"
                    }
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">
                    Target: 85%+
                  </span>
                  <Link href={`/grammar/parts-of-speech/${item.categorySlug}`}>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1">
                      {ctaText} <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
