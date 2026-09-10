"use client";

import * as React from "react";
import {
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
  Volume2,
  Award,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VerbItem, UserVerbProgress } from "@/types/grammar.types";

interface VerbDetailModalProps {
  verb: VerbItem | null;
  isOpen: boolean;
  onClose: () => void;
  progress?: UserVerbProgress;
  onToggleLearned: (verbId: string, currentLearned: boolean) => void;
  onPracticeVerb: (verb: VerbItem) => void;
}

export function VerbDetailModal({
  verb,
  isOpen,
  onClose,
  progress,
  onToggleLearned,
  onPracticeVerb,
}: VerbDetailModalProps) {
  if (!isOpen || !verb) return null;

  const isLearned = progress?.status === "learned" || progress?.status === "mastered";
  const isMastered = progress?.status === "mastered";
  const isWeak = progress?.isWeak;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-indigo-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800/80 dark:to-indigo-950/20 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant={verb.verbType === "irregular" ? "warning" : "indigo"} className="text-[10px] capitalize">
                {verb.verbType} Verb
              </Badge>
              <Badge
                variant={
                  verb.difficulty === "advanced"
                    ? "warning"
                    : verb.difficulty === "intermediate"
                    ? "indigo"
                    : "success"
                }
                className="text-[10px] capitalize"
              >
                {verb.difficulty}
              </Badge>
              {verb.isIeltsRelevant && (
                <Badge variant="indigo" className="text-[10px]">
                  IELTS Band 7+
                </Badge>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
              {verb.baseForm}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 3 Forms Grid (V1 • V2 • V3) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                V1 (Base)
              </span>
              <div className="font-mono text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {verb.baseForm}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                V2 (Past)
              </span>
              <div className="font-mono text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {verb.pastForm}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                V3 (Participle)
              </span>
              <div className="font-mono text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {verb.pastParticiple}
              </div>
            </div>
          </div>

          {/* Meaning & Definition */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Definition & Meaning
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {verb.meaning}
            </p>
          </div>

          {/* Context Sentences for all 3 Forms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sentence Usage Examples</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Present / Base */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  Present (V1):
                </span>
                <p className="italic text-slate-800 dark:text-slate-200 font-medium">
                  &ldquo;{verb.exampleSentence}&rdquo;
                </p>
              </div>

              {/* Past */}
              {verb.pastExample && (
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Past (V2):
                  </span>
                  <p className="italic text-slate-800 dark:text-slate-200 font-medium">
                    &ldquo;{verb.pastExample}&rdquo;
                  </p>
                </div>
              )}

              {/* Participle */}
              {verb.pastParticipleExample && (
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Past Participle (V3):
                  </span>
                  <p className="italic text-slate-800 dark:text-slate-200 font-medium">
                    &ldquo;{verb.pastParticipleExample}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            onClick={() => onToggleLearned(verb.id, isLearned)}
            variant={isLearned ? "success" : "outline"}
            className="w-full sm:w-auto gap-2 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLearned ? "✓ Marked as Learned" : "Mark as Learned"}</span>
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              onClick={() => {
                onClose();
                onPracticeVerb(verb);
              }}
              variant="default"
              className="w-full sm:w-auto gap-2 text-xs font-bold shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Practice This Verb</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
