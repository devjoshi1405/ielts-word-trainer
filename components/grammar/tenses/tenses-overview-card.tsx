"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap,
  Layers,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CategoryProgressSummary } from "@/types/grammar.types";

interface TensesOverviewCardProps {
  tenseProgressList: CategoryProgressSummary[];
  loading?: boolean;
}

export function TensesOverviewCard({
  tenseProgressList = [],
  loading,
}: TensesOverviewCardProps) {
  const safeList = tenseProgressList || [];
  const tenses = [
    {
      slug: "simple-present",
      name: "Simple Present Tense",
      subtitle: "Habits, Routines & Facts",
      description: "Third-person -s/-es, does not + V1, question inversions, and IELTS Task 1 static trends.",
      href: "/grammar/tenses/simple-present",
      ieltsUse: "Writing Task 1 & 2 • Speaking Part 1",
    },
    {
      slug: "simple-past",
      name: "Simple Past Tense",
      subtitle: "Completed Past Actions & Events",
      description: "Regular -ed verbs, irregular V2 from 500+ database, did not + V1, and Speaking Part 2 stories.",
      href: "/grammar/tenses/simple-past",
      ieltsUse: "Speaking Part 2 • Task 1 Past Data",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Badge variant="indigo" className="text-[10px] uppercase font-bold">
              Phase 4 Core Tenses
            </Badge>
            <span className="text-xs text-muted-foreground font-semibold">
              Simple Present & Simple Past Systems
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            Tense & Aspect Mastery
          </h2>
        </div>

        <Link href="/grammar/tenses">
          <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1 text-indigo-600 dark:text-indigo-400">
            <span>View All Tense Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tenses.map((tense) => {
          const match = safeList.find((p) => p.categorySlug === tense.slug);
          const progressPercent = match?.progressPercent ?? 0;
          const masteryScore = match?.masteryScore ?? 0;
          const isMastered = match?.isMastered || masteryScore >= 85;

          let statusBadgeText = "Not Started";
          let statusBadgeVariant: "secondary" | "warning" | "indigo" | "success" = "secondary";

          if (isMastered) {
            statusBadgeText = "✓ Mastered (85%+)";
            statusBadgeVariant = "success";
          } else if (progressPercent >= 70 || masteryScore >= 70) {
            statusBadgeText = "🟡 Practice Recommended";
            statusBadgeVariant = "warning";
          } else if (progressPercent > 0) {
            statusBadgeText = "🔵 Continue Learning";
            statusBadgeVariant = "indigo";
          }

          return (
            <Card
              key={tense.slug}
              className="border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all bg-card shadow-xs flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <Badge variant={statusBadgeVariant} className="text-[10px] font-bold">
                      {statusBadgeText}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      {tense.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {tense.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                      {tense.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">Progress:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {masteryScore > 0 ? `${masteryScore}% Mastery` : `${progressPercent}% Completed`}
                      </span>
                    </div>
                    <Progress value={Math.max(progressPercent, masteryScore)} className="h-2" />
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground font-medium truncate">
                    {tense.ieltsUse}
                  </span>

                  <Link href={tense.href}>
                    <Button variant="brand" size="sm" className="text-xs font-bold gap-1 shadow-xs">
                      <span>{progressPercent > 0 ? "Continue" : "Learn"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
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
