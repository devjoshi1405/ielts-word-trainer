"use client";

import * as React from "react";
import {
  CheckCircle2,
  Zap,
  Award,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerbItem, UserVerbProgress } from "@/types/grammar.types";

interface VerbCardsMobileProps {
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

export function VerbCardsMobile({
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
}: VerbCardsMobileProps) {
  if (loading) {
    return (
      <div className="block md:hidden space-y-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  if (verbs.length === 0) {
    return (
      <div className="block md:hidden p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
        <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No verbs found</h4>
        <p className="text-xs text-muted-foreground">Try adjusting your search query or active filter category.</p>
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3.5">
      <div className="space-y-3">
        {verbs.map((verb) => {
          const prog = userProgressMap[verb.id];
          const isLearned = prog?.status === "learned" || prog?.status === "mastered";
          const isMastered = prog?.status === "mastered";
          const isWeak = prog?.isWeak;

          return (
            <Card
              key={verb.id}
              onClick={() => onSelectVerb(verb)}
              className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
            >
              <CardContent className="p-4 space-y-3">
                {/* Top Row: Verb Base & Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-base font-black text-slate-900 dark:text-slate-100 uppercase">
                      {verb.baseForm}
                    </span>
                    <Badge
                      variant={verb.verbType === "irregular" ? "warning" : "indigo"}
                      className="text-[9px] capitalize"
                    >
                      {verb.verbType}
                    </Badge>
                  </div>

                  <div>
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
                  </div>
                </div>

                {/* V1 - V2 - V3 Row */}
                <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-center text-xs">
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">V1</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                      {verb.baseForm}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">V2</div>
                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
                      {verb.pastForm}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">V3</div>
                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
                      {verb.pastParticiple}
                    </div>
                  </div>
                </div>

                {/* Meaning */}
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                  {verb.meaning}
                </p>

                {/* Actions Bottom Bar */}
                <div
                  className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    onClick={() => onToggleLearned(verb.id, isLearned)}
                    variant={isLearned ? "success" : "outline"}
                    size="sm"
                    className="flex-1 text-[11px] font-bold gap-1 h-8"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isLearned ? "✓ Learned" : "Mark Learned"}</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => onPracticeVerb(verb)}
                    variant="default"
                    size="sm"
                    className="flex-1 text-[11px] font-bold gap-1 h-8 shadow-xs"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Practice</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile Pagination */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            variant="outline"
            size="sm"
            className="text-xs h-8"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            variant="outline"
            size="sm"
            className="text-xs h-8"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
