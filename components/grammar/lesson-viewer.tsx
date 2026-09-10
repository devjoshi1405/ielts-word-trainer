"use client";

import * as React from "react";
import {
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  GraduationCap,
  Layers,
  FileCheck2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GrammarLessonContent } from "@/types/grammar.types";

interface LessonViewerProps {
  topicName: string;
  categorySlug: string;
  content: GrammarLessonContent;
  onCompleteLesson: () => void;
  isCompleted: boolean;
}

export function LessonViewer({
  topicName,
  content,
  onCompleteLesson,
  isCompleted,
}: LessonViewerProps) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Core Definition & Overview */}
      <Card className="border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/20 shadow-card">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-4 h-4" />
            <span>Foundational Concept</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            What is a {topicName}?
          </h2>

          <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {content.overview}
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {content.explanation}
          </p>
        </CardContent>
      </Card>

      {/* 2. Core Educational Rules */}
      {content.rules && content.rules.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Grammar Rules & Formations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.rules.map((rule, idx) => (
              <Card
                key={rule.id || idx}
                className="border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all bg-card"
              >
                <CardContent className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {rule.title}
                    </span>
                    <Badge variant="indigo" className="text-[9px]">
                      Rule #{idx + 1}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rule.rule}
                  </p>

                  {rule.explanation && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rule.explanation}
                    </p>
                  )}

                  {rule.example && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-xs">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-1.5">
                        Example:
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 italic">
                        &ldquo;{rule.example}&rdquo;
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3. Formulas & Sentence Patterns */}
      {content.formulas && content.formulas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Sentence Patterns & Formulas
            </h3>
          </div>

          <div className="space-y-3">
            {content.formulas.map((form, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                      {form.pattern}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{form.description}</p>
                </div>
                <div className="text-xs text-slate-800 dark:text-slate-200 italic sm:text-right max-w-sm">
                  &ldquo;{form.example}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Common Learner Mistakes (Visual Comparison) */}
      {content.commonMistakes && content.commonMistakes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-xs font-bold">
              !
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Common IELTS Pitfalls & Corrections
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.commonMistakes.map((mistake, idx) => (
              <Card
                key={idx}
                className="border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Incorrect */}
                  <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 flex items-start space-x-2.5">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                        Incorrect
                      </div>
                      <div className="text-xs text-rose-900 dark:text-rose-200 font-medium">
                        {mistake.incorrect}
                      </div>
                    </div>
                  </div>

                  {/* Correct */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Correct
                      </div>
                      <div className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                        {mistake.correct}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                    <strong>Why:</strong> {mistake.explanation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 5. IELTS Examiner Tips & Practical Advice */}
      {content.tips && content.tips.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>IELTS Examiner Band 7+ Tips</span>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            {content.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Lesson Completion & Transition to Practice CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs font-semibold text-indigo-100 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Active Recall?</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">
            Apply {topicName} Rules in Practice Drills
          </h3>
          <p className="text-xs text-indigo-100 max-w-lg">
            Complete interactive multiple choice, fill-in-the-blank, and error identification questions with instant feedback.
          </p>
        </div>

        <Button
          onClick={onCompleteLesson}
          size="lg"
          className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-md gap-2 shrink-0 w-full sm:w-auto"
        >
          <span>{isCompleted ? "Continue to Practice Drills" : "Mark Lesson Complete & Practice"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
