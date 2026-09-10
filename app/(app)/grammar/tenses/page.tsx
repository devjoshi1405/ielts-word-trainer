"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Zap,
  Layers,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGrammarProgress } from "@/hooks/use-grammar-progress";

export default function TensesHubPage() {
  const { tenseProgressList, loading } = useGrammarProgress();

  const tenseModules = [
    {
      slug: "simple-present",
      name: "Simple Present Tense",
      tagline: "Habits, Routines, Universal Facts & IELTS Task 1 Static Trends",
      description:
        "Master base V1 forms, the essential He/She/It + s/es rule, does not + V1 negative structures, and questions.",
      href: "/grammar/tenses/simple-present",
      ieltsFocus: "Writing Task 1 & 2 • Speaking Part 1",
      difficulty: "Beginner — Band 6.0+",
      sectionsCount: 7,
      drillsCount: 5,
      sbCount: 4,
      testCount: 15,
    },
    {
      slug: "simple-past",
      name: "Simple Past Tense",
      tagline: "Completed Actions, Past Trends & Speaking Part 2 Storytelling",
      description:
        "Master regular -ed spelling rules, irregular V2 forms linked to the 500+ Verb Master, did not + V1, and past questions.",
      href: "/grammar/tenses/simple-past",
      ieltsFocus: "Speaking Part 2 • Task 1 Past Data",
      difficulty: "Beginner — Band 6.0+",
      sectionsCount: 7,
      drillsCount: 4,
      sbCount: 3,
      testCount: 15,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="space-y-3 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Link
            href="/grammar"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mr-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Grammar Master Hub</span>
          </Link>
          <Badge variant="indigo" className="text-[10px] font-bold uppercase">
            Curriculum Pillar 3
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Tenses & Aspect Mastery
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Systematic learning, active sentence building, V1/V2 verb integration, and diagnostic tests for IELTS Simple Present & Simple Past.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tense Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tenseModules.map((module) => {
          const progressMatch = tenseProgressList.find((p) => p.categorySlug === module.slug);
          const progressPercent = progressMatch?.progressPercent ?? 0;
          const masteryScore = progressMatch?.masteryScore ?? 0;
          const isMastered = progressMatch?.isMastered || masteryScore >= 85;

          return (
            <Card
              key={module.slug}
              className="border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-card bg-card flex flex-col justify-between"
            >
              <CardContent className="p-6 sm:p-8 space-y-5 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                      <Clock className="w-6 h-6" />
                    </div>
                    <Badge
                      variant={isMastered ? "success" : progressPercent > 0 ? "indigo" : "secondary"}
                      className="text-xs font-bold"
                    >
                      {isMastered
                        ? "✓ Mastered (85%+)"
                        : progressPercent > 0
                        ? `${progressPercent}% Completed`
                        : "Not Started"}
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {module.name}
                    </h2>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {module.tagline}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                      {module.description}
                    </p>
                  </div>

                  {/* Feature Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-muted-foreground block">Sections</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{module.sectionsCount} Parts</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-muted-foreground block">Drills</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{module.drillsCount} Drills</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-muted-foreground block">Building</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{module.sbCount} Sentences</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-muted-foreground block">Test</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{module.testCount} Questions</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">Mastery Progress</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {masteryScore > 0 ? `${masteryScore}%` : `${progressPercent}%`}
                      </span>
                    </div>
                    <Progress value={Math.max(progressPercent, masteryScore)} className="h-2" />
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold text-muted-foreground">
                    Target: {module.ieltsFocus}
                  </div>

                  <Link href={module.href} className="w-full sm:w-auto">
                    <Button variant="brand" size="default" className="w-full sm:w-auto font-bold gap-2 shadow-xs text-xs">
                      <span>{progressPercent > 0 ? "Continue Learning" : "Start Learning"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. IELTS Educational Note Box */}
      <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Why Tense Consistency Determines IELTS Band 7+</span>
        </div>
        <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          In IELTS Writing Task 1, shifting irregularly between past and present when describing charts with specific years is a major reason candidates stay stuck at Band 5.0 in <strong>Grammatical Range & Accuracy (GRA)</strong>. Master Simple Present for static facts and opinions, and Simple Past for historical data and Speaking Part 2 stories.
        </p>
      </div>
    </div>
  );
}
