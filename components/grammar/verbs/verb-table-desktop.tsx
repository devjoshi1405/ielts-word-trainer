"use client";

import * as React from "react";
import {
  CheckCircle2,
  Zap,
  Award,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerbItem, UserVerbProgress } from "@/types/grammar.types";

interface VerbTableDesktopProps {
  verbs: VerbItem[];
  userProgressMap: Record<string, UserVerbProgress>;
  onSelectVerb: (verb: VerbItem) => void;
  onToggleLearned: (verbId: string, currentLearned: boolean) => void;
  onPracticeVerb: (verb: VerbItem) => void;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (p: number) => void;
  loading: boolean;
}

export function VerbTableDesktop({
  verbs,
  userProgressMap,
  onSelectVerb,
  onToggleLearned,
  onPracticeVerb,
  page,
  totalPages,
  totalCount,
  onPageChange,
  loading,
}: VerbTableDesktopProps) {
  if (loading) {
    return (
      <div className="hidden md:block rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-xs animate-pulse">
        <div className="h-12 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20"
          />
        ))}
      </div>
    );
  }

  if (verbs.length === 0) {
    return (
      <div className="hidden md:block p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
        <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No verbs found</h4>
        <p className="text-xs text-muted-foreground">Try adjusting your search query or active filter category.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block space-y-4">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/80 font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
                <th className="py-3 px-4">V1 (Base)</th>
                <th className="py-3 px-4">V2 (Past)</th>
                <th className="py-3 px-4">V3 (Participle)</th>
                <th className="py-3 px-4 min-w-[200px]">Meaning</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {verbs.map((verb) => {
                const prog = userProgressMap[verb.id];
                const isLearned = prog?.status === "learned" || prog?.status === "mastered";
                const isMastered = prog?.status === "mastered";
                const isWeak = prog?.isWeak;

                return (
                  <tr
                    key={verb.id}
                    onClick={() => onSelectVerb(verb)}
                    className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer group"
                  >
                    {/* V1 */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {verb.baseForm}
                    </td>

                    {/* V2 */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {verb.pastForm}
                    </td>

                    {/* V3 */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {verb.pastParticiple}
                    </td>

                    {/* Meaning */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 line-clamp-1 max-w-xs font-medium">
                      {verb.meaning}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-3">
                      <Badge
                        variant={verb.verbType === "irregular" ? "warning" : "indigo"}
                        className="text-[9px] capitalize"
                      >
                        {verb.verbType}
                      </Badge>
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] text-muted-foreground capitalize font-medium">
                        {verb.difficulty}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {isMastered ? (
                        <Badge variant="success" className="text-[9px] gap-1 font-bold">
                          <Award className="w-2.5 h-2.5" /> Mastered
                        </Badge>
                      ) : isWeak ? (
                        <Badge variant="warning" className="text-[9px] gap-1 font-bold">
                          <AlertCircle className="w-2.5 h-2.5" /> Weak
                        </Badge>
                      ) : isLearned ? (
                        <Badge variant="success" className="text-[9px] gap-1 font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Learned
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">New</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right space-x-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onPracticeVerb(verb)}
                        title="Practice this verb"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleLearned(verb.id, isLearned)}
                        title={isLearned ? "Mark as unlearned" : "Mark as learned"}
                        className={`p-1.5 rounded-lg transition-colors inline-flex items-center ${
                          isLearned
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total verbs)
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </Button>

          <Button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
