"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResumeLearningSession } from "@/types/grammar.types";

interface GrammarContinueCardProps {
  session: ResumeLearningSession | null;
  loading: boolean;
}

export function GrammarContinueCard({ session, loading }: GrammarContinueCardProps) {
  const hasActiveSession = session?.hasActiveSession ?? false;
  const topicTitle = session?.topicTitle || "Simple Present Tense";
  const categoryName = session?.categoryName || "Parts of Speech: Verbs";
  const progressPercent = session?.progressPercent || 0;
  const masteryScore = session?.masteryScore || 0;
  const stage = session?.currentStage || "none";
  const recommendedNextStep =
    session?.recommendedNextStep || "Start with Simple Present Tense rules & IELTS Task 1/2 applications";
  const targetHref = session?.targetHref || "#parts-of-speech";

  const getStageBadge = () => {
    switch (stage) {
      case "practicing":
        return <Badge variant="warning">Stage 2: Practice Drills</Badge>;
      case "testing":
        return <Badge variant="success">Stage 3: Mastery Test</Badge>;
      case "learning":
        return <Badge variant="indigo">Stage 1: Core Rules</Badge>;
      default:
        return <Badge variant="indigo">Recommended Starting Point</Badge>;
    }
  };

  return (
    <Card className="relative overflow-hidden border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 shadow-card hover:shadow-elevated transition-all">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {getStageBadge()}
              <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>~12 mins structured session</span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {categoryName}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {topicTitle}
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                {recommendedNextStep}
              </p>
            </div>

            {/* Session Progress Bar */}
            {hasActiveSession && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Topic Progress</span>
                  <span>{progressPercent}% Completed</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Learning → Practice → Test</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Target Score: <strong>Band 7.5+</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3 flex-shrink-0">
            <a href={targetHref} className="w-full sm:w-auto">
              <Button
                variant="brand"
                size="lg"
                className="w-full sm:w-auto gap-2 text-base font-semibold shadow-md shadow-indigo-200 dark:shadow-none"
              >
                <span>{hasActiveSession ? "Resume Learning" : "Start First Topic"}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <a href="#parts-of-speech" className="w-full sm:w-auto text-center">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs text-muted-foreground">
                Browse All 8 Parts of Speech
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
