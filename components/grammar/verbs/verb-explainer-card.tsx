"use client";

import * as React from "react";
import { BookOpen, Sparkles, Zap, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function VerbExplainerCard() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/20 shadow-xs">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>The 3 Verb Forms (V1 • V2 • V3)</span>
                <Badge variant="indigo" className="text-[9px]">
                  Essential Rule
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">
                Understand when to use Base Form, Simple Past, and Past Participle in IELTS Writing & Speaking.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{isOpen ? "Hide Full Grammar Rules" : "View Full Grammar Rules"}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 3 Pillar Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* V1 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                V1 — Base Form
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">e.g. go, work</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pt-1">
              Used in Simple Present, infinitives (to + V1), and after modal verbs (can, should, must).
            </p>
          </div>

          {/* V2 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                V2 — Simple Past
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">e.g. went, worked</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pt-1">
              Used for completed past events and historical data trends in IELTS Task 1.
            </p>
          </div>

          {/* V3 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                V3 — Past Participle
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">e.g. gone, worked</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pt-1">
              Used with auxiliary verbs (have / has / had) for perfect tenses and passive voice structures.
            </p>
          </div>
        </div>

        {/* Expandable Regular vs Irregular Explanation */}
        {isOpen && (
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in-50 duration-200">
            <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Regular Verbs (Add -ed / -d)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Regular verbs follow standard inflection by appending <strong>-ed</strong> to form both V2 and V3.
              </p>
              <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-slate-900/60 p-1.5 rounded">
                analyze → analyzed → analyzed
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Irregular Verbs (Vowel / Pattern Shifts)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Irregular verbs undergo internal stem transformations or stay identical across forms.
              </p>
              <div className="font-mono text-[11px] text-amber-700 dark:text-amber-400 bg-white/80 dark:bg-slate-900/60 p-1.5 rounded">
                choose → chose → chosen | cut → cut → cut
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
