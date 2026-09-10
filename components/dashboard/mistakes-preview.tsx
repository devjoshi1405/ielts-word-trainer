"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { audioService } from "@/lib/audio";
import { useUserProgress } from "@/hooks/use-user-progress";
import { getMistakeTypeDetails } from "@/lib/mistakes/mistake-classifier";
import { cn } from "@/lib/utils";

export function MistakesPreview() {
  const { mistakes, loading } = useUserProgress();
  const [playingWord, setPlayingWord] = React.useState<string | null>(null);

  const handlePlayWord = async (word: string) => {
    try {
      setPlayingWord(word);
      await audioService.playText(word, { accent: "british", rate: 0.9 });
    } finally {
      setPlayingWord(null);
    }
  };

  // Top highest-priority mistakes (sorted by SRS priority engine)
  const displayMistakes = mistakes.slice(0, 5);
  const dueMistakesCount = mistakes.filter((m) => m.isDue).length;

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <CardTitle className="text-xl">Words That Need Practice</CardTitle>
            {dueMistakesCount > 0 && (
              <Badge variant="destructive" className="text-[10px] animate-pulse">
                {dueMistakesCount} Due
              </Badge>
            )}
          </div>
          <CardDescription className="mt-1">
            Highest-priority mistakes requiring spaced repetition to reach Band 8.5+ spelling and accuracy.
          </CardDescription>
        </div>

        <div className="flex items-center space-x-2">
          {mistakes.length > 0 && (
            <Link href="/listening/listen-and-type?mode=mistakes">
              <Button variant="brand" size="sm" className="gap-1.5 text-xs shadow-xs">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Due</span>
              </Button>
            </Link>
          )}
          <Link href="/listening/mistakes">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>View All ({mistakes.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : displayMistakes.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayMistakes.map((item) => {
              const typeDetails = getMistakeTypeDetails(item.mistakeType || "spelling");
              const masteryNumeric = item.masteryNumeric ?? 1;
              const masteryVariant =
                masteryNumeric >= 4
                  ? ("success" as const)
                  : masteryNumeric === 3
                  ? ("indigo" as const)
                  : masteryNumeric === 2
                  ? ("warning" as const)
                  : ("destructive" as const);

              const masteryLabel =
                masteryNumeric >= 4
                  ? "Mastered (L4)"
                  : masteryNumeric === 3
                  ? "Familiar (L3)"
                  : masteryNumeric === 2
                  ? "Practicing (L2)"
                  : "Learning (L1)";

              return (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                        {item.word}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {item.phoneticIpa}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayWord(item.word)}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        title="Play pronunciation"
                        aria-label={`Listen to ${item.word}`}
                      >
                        <Volume2
                          className={`w-3.5 h-3.5 ${
                            playingWord === item.word ? "text-indigo-600 animate-pulse" : ""
                          }`}
                        />
                      </button>

                      {/* Mistake Type Tag */}
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-semibold border px-1.5 py-0 rounded-md", typeDetails.color)}
                      >
                        {item.mistakeTypeLabel || typeDetails.label}
                      </Badge>

                      {/* Mastery Level Tag */}
                      <Badge variant={masteryVariant} className="text-[10px] px-1.5 py-0">
                        {masteryLabel}
                      </Badge>

                      {/* Due tag */}
                      {item.isDue && (
                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                          Due now
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Spelling trap:
                      </span>{" "}
                      {item.commonTrap}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                    <div className="text-right text-[11px] text-muted-foreground hidden sm:block">
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {item.errorCount} {item.errorCount === 1 ? "miss" : "misses"}
                      </div>
                      <div>{item.accuracy ?? 33}% accuracy</div>
                    </div>

                    <Link href={`/listening/listen-and-type?focus=${encodeURIComponent(item.word)}`}>
                      <Button variant="brand" size="sm" className="h-8 gap-1 text-xs shadow-xs">
                        <RotateCcw className="w-3 h-3" />
                        <span>Practice</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              No active mistakes recorded!
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Any words or grammar points you miss will automatically appear here prioritized by spaced repetition for rapid Band 8+ mastery.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
