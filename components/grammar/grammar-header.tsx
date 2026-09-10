import * as React from "react";
import { Sparkles, GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GrammarHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Grammar Foundation
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <Badge variant="indigo" className="text-[10px]">
            IELTS Band 7.5+ Grammatical Range
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
          <span>Grammar Master</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            Phase 1
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
          Structured IELTS grammar curriculum: Parts of Speech, verb conjugations (V1/V2/V3), tense mastery, and error-free complex sentence building.
        </p>
      </div>

      <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-white dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
        <span><strong>8</strong> Parts of Speech • Scalable Curriculum</span>
      </div>
    </div>
  );
}
