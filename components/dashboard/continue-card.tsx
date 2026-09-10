"use client";

import * as React from "react";
import Link from "next/link";
import { Headphones, ArrowRight, Sparkles, Volume2, Clock, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ContinuePracticeCard() {
  const [activeSession, setActiveSession] = React.useState<{ title: string; href: string; questionNum: number } | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const vocabSession = localStorage.getItem("ielts_exercise_session_vocabulary-academic");
      if (vocabSession) {
        const parsed = JSON.parse(vocabSession);
        if (parsed?.currentIndex > 0 && !parsed.isCompleted) {
          setActiveSession({
            title: "Academic Vocabulary",
            href: "/listening/vocabulary",
            questionNum: parsed.currentIndex + 1,
          });
          return;
        }
      }

      const coreSession = localStorage.getItem("ielts_exercise_session_listen-and-type-core");
      if (coreSession) {
        const parsed = JSON.parse(coreSession);
        if (parsed?.currentIndex > 0 && !parsed.isCompleted) {
          setActiveSession({
            title: "Listen & Type",
            href: "/listening/listen-and-type",
            questionNum: parsed.currentIndex + 1,
          });
          return;
        }
      }

      const numSession = localStorage.getItem("ielts_exercise_session_numbers-currency");
      if (numSession) {
        const parsed = JSON.parse(numSession);
        if (parsed?.currentIndex > 0 && !parsed.isCompleted) {
          setActiveSession({
            title: "Numbers & Currency",
            href: "/listening/numbers",
            questionNum: parsed.currentIndex + 1,
          });
          return;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const targetTitle = activeSession ? activeSession.title : "Listen & Type";
  const targetHref = activeSession ? activeSession.href : "/listening/listen-and-type";

  return (
    <Card className="relative overflow-hidden border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 shadow-card hover:shadow-elevated transition-all">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <Badge variant="indigo" className="gap-1 px-3 py-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeSession ? "Session In Progress" : "Primary Recommendation"}</span>
              </Badge>
              {activeSession ? (
                <div className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-semibold gap-1.5">
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Resume from Question {activeSession.questionNum}</span>
                </div>
              ) : (
                <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~10 mins</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Headphones className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {targetTitle}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Improve your ability to recognize spoken English and spell it correctly.
                Focus on IELTS Sections 1 to 4 phonetic patterns, accents, and silent letters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Standard UK Audio</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                🎯 Target Accuracy: <strong>95%+</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3 flex-shrink-0">
            <Link href={targetHref} className="w-full sm:w-auto">
              <Button
                variant="brand"
                size="lg"
                className="w-full sm:w-auto gap-2 text-base font-semibold shadow-md shadow-indigo-200 dark:shadow-none"
              >
                <span>{activeSession ? `Resume (Q${activeSession.questionNum})` : "Start Practice"}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/listening" className="w-full sm:w-auto text-center">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs text-muted-foreground">
                Browse All 5 Modules
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

