"use client";

import * as React from "react";
import Link from "next/link";
import {
  Volume2,
  RotateCcw,
  AlertTriangle,
  Check,
  Trash2,
  Clock,
  CheckCircle2,
  HelpCircle,
  PenTool,
  FileText,
  Compass,
  Layers,
  Binary,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MistakeItem } from "@/types/progress.types";
import { audioService } from "@/lib/audio";
import { getMistakeTypeDetails } from "@/lib/mistakes/mistake-classifier";
import { cn } from "@/lib/utils";

interface MistakeCardProps {
  mistake: MistakeItem;
  onRemove?: (id: string) => void;
}

export function MistakeCard({ mistake, onRemove }: MistakeCardProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = async () => {
    try {
      setIsPlaying(true);
      await audioService.playText(mistake.word, { accent: "british", rate: 0.9 });
    } finally {
      setIsPlaying(false);
    }
  };

  const typeDetails = getMistakeTypeDetails(mistake.mistakeType || "spelling");

  // Mastery level visual mapping
  const numericMastery = mistake.masteryNumeric ?? 1;
  const masteryConfig = {
    0: { label: "Level 0: New", variant: "outline" as const, color: "text-slate-600 border-slate-300" },
    1: { label: "Level 1: Learning", variant: "destructive" as const, color: "text-rose-700 bg-rose-50 dark:bg-rose-950/40" },
    2: { label: "Level 2: Practicing", variant: "warning" as const, color: "text-amber-700 bg-amber-50 dark:bg-amber-950/40" },
    3: { label: "Level 3: Familiar", variant: "indigo" as const, color: "text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40" },
    4: { label: "Level 4: Mastered", variant: "success" as const, color: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40" },
  }[numericMastery] || { label: "Learning", variant: "destructive" as const, color: "text-rose-700" };

  const isDue = mistake.isDue ?? true;

  return (
    <Card className="border-slate-200/80 hover:border-slate-300 dark:border-slate-800 hover:shadow-card transition-all">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          {/* Top Row: Word, Phonetic, Audio, Mistake Type Badge, Mastery Badge, Due Status */}
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {mistake.word}
            </h4>
            <span className="text-xs font-mono text-muted-foreground">
              {mistake.phoneticIpa}
            </span>
            <button
              type="button"
              onClick={handlePlay}
              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
              aria-label={`Listen to ${mistake.word}`}
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? "text-indigo-600 animate-pulse" : ""}`} />
            </button>

            {/* 9-Type Mistake Classification Badge */}
            <Badge
              variant="outline"
              className={cn("text-[11px] font-semibold border px-2 py-0.5 rounded-lg", typeDetails.color)}
            >
              {mistake.mistakeTypeLabel || typeDetails.label}
            </Badge>

            {/* Mastery Level Badge */}
            <Badge variant={masteryConfig.variant} className="text-[10px] px-2 py-0.5">
              {masteryConfig.label}
            </Badge>

            {/* Next Review SRS Due Badge */}
            <Badge
              variant={isDue ? "destructive" : "outline"}
              className={cn(
                "text-[10px] px-2 py-0.5 inline-flex items-center gap-1",
                !isDue && "text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200"
              )}
            >
              <Clock className="w-2.5 h-2.5" />
              <span>{mistake.nextReview || (isDue ? "Due now" : "Scheduled")}</span>
            </Badge>
          </div>

          {/* Diagnostic & Spelling Trap / Tip */}
          <div className="space-y-1 text-xs">
            {mistake.mistakeExplanation && (
              <p className="text-slate-700 dark:text-slate-200">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Diagnosis:</span>{" "}
                {mistake.mistakeExplanation}
              </p>
            )}

            {mistake.commonTrap && (
              <p className="text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <span className="font-medium text-amber-800 dark:text-amber-300">Spelling Trap:</span>{" "}
                  {mistake.commonTrap}
                </span>
              </p>
            )}
          </div>

          {/* Stats Bar: Last Attempt, Error Count, Total Attempts, Accuracy, Last Practiced */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
            <span>
              Last attempt:{" "}
              <span className="line-through text-rose-600 dark:text-rose-400 font-medium">
                {mistake.userLastAttempt}
              </span>
            </span>
            <span>•</span>
            <span>
              Attempts: <strong className="text-slate-700 dark:text-slate-300">{mistake.totalAttempts ?? mistake.errorCount}</strong> (
              <span className="text-emerald-600">{mistake.correctAttempts ?? 0}✓</span> /{" "}
              <span className="text-rose-600">{mistake.errorCount}✕</span>)
            </span>
            <span>•</span>
            <span>
              Accuracy: <strong className="text-indigo-600 dark:text-indigo-400">{mistake.accuracy ?? Math.round((1 / (mistake.errorCount + 1)) * 100)}%</strong>
            </span>
            <span>•</span>
            <span>Last practiced: {mistake.lastPracticed}</span>
          </div>
        </div>

        {/* Action Buttons: Practice & Remove */}
        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
          <Link href={`/listening/listen-and-type?focus=${encodeURIComponent(mistake.word)}`}>
            <Button variant="brand" size="sm" className="gap-1.5 text-xs shadow-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice</span>
            </Button>
          </Link>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(mistake.id)}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Mark as Mastered / Dismiss"
              aria-label="Remove from mistakes"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
