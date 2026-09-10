"use client";

import * as React from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Layers,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SentenceBuildingExercise } from "@/types/grammar.types";

interface SentenceBuilderProps {
  exercise: SentenceBuildingExercise;
  onComplete?: (isCorrect: boolean) => void;
  onNext?: () => void;
  isLast?: boolean;
  onInspectVerb?: (verbBase: string) => void;
}

export function SentenceBuilder({
  exercise,
  onComplete,
  onNext,
  isLast,
  onInspectVerb,
}: SentenceBuilderProps) {
  // Available words in the bank
  const [bankWords, setBankWords] = React.useState<Array<{ id: string; text: string }>>([]);
  // Constructed sentence words in tray
  const [trayWords, setTrayWords] = React.useState<Array<{ id: string; text: string }>>([]);
  // Feedback state: null = unanswered, "correct" = correct, "incorrect" = incorrect
  const [feedback, setFeedback] = React.useState<"correct" | "incorrect" | null>(null);

  // Initialize word chips on exercise change
  React.useEffect(() => {
    const initialized = exercise.words.map((w, idx) => ({
      id: `${w}-${idx}-${Date.now()}`,
      text: w,
    }));
    // Shuffle words deterministically for practice
    const shuffled = [...initialized].sort(() => 0.5 - Math.random());
    setBankWords(shuffled);
    setTrayWords([]);
    setFeedback(null);
  }, [exercise]);

  const handleWordClick = (wordObj: { id: string; text: string }, from: "bank" | "tray") => {
    if (feedback === "correct") return; // locked once correct
    if (from === "bank") {
      setBankWords((prev) => prev.filter((w) => w.id !== wordObj.id));
      setTrayWords((prev) => [...prev, wordObj]);
      if (feedback === "incorrect") setFeedback(null); // clear error on change
    } else {
      setTrayWords((prev) => prev.filter((w) => w.id !== wordObj.id));
      setBankWords((prev) => [...prev, wordObj]);
      if (feedback === "incorrect") setFeedback(null);
    }
  };

  const handleReset = () => {
    const initialized = exercise.words.map((w, idx) => ({
      id: `${w}-${idx}-${Date.now()}`,
      text: w,
    }));
    setBankWords(initialized);
    setTrayWords([]);
    setFeedback(null);
  };

  const handleCheckSentence = () => {
    const constructed = trayWords
      .map((w) => w.text.trim())
      .join(" ")
      .replace(/\s+\?/g, "?")
      .replace(/\s+\./g, ".")
      .trim();

    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[.,?]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const normalizedConstructed = normalize(constructed);
    const normalizedCorrect = normalize(exercise.correctSentence);
    const isAltMatch =
      exercise.alternativeAnswers?.some((alt) => normalize(alt) === normalizedConstructed) ?? false;

    const isMatch = normalizedConstructed === normalizedCorrect || isAltMatch;

    if (isMatch) {
      setFeedback("correct");
      if (onComplete) onComplete(true);
    } else {
      setFeedback("incorrect");
      if (onComplete) onComplete(false);
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-card bg-card overflow-hidden animate-in fade-in-50 duration-200">
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Sentence Building Exercise
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {exercise.prompt}
              </h3>
            </div>
          </div>

          {exercise.verbV1 && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-xs">
              <span className="text-muted-foreground font-semibold">Target Verb:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                {exercise.verbV1}
              </span>
              {exercise.verbV2 && (
                <span className="text-muted-foreground text-[11px]">(V2: {exercise.verbV2})</span>
              )}
              {onInspectVerb && (
                <button
                  type="button"
                  onClick={() => onInspectVerb(exercise.verbV1 || "")}
                  className="ml-1 text-[10px] font-bold text-indigo-600 underline hover:text-indigo-700"
                >
                  Inspect
                </button>
              )}
            </div>
          )}
        </div>

        {/* Construction Tray (Drop/Click Target) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Your Sentence Construction:</span>
            <span className="text-[11px] text-muted-foreground">
              {trayWords.length} of {exercise.words.length} words placed
            </span>
          </div>

          <div
            className={`min-h-[72px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-all ${
              feedback === "correct"
                ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400 text-emerald-950 dark:text-emerald-100"
                : feedback === "incorrect"
                ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 text-rose-950 dark:text-rose-100"
                : trayWords.length === 0
                ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400"
                : "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 text-slate-900 dark:text-slate-100"
            }`}
          >
            {trayWords.length === 0 ? (
              <span className="text-xs text-muted-foreground italic select-none">
                Click or tap the word tokens below to construct your sentence in grammatical order...
              </span>
            ) : (
              trayWords.map((word) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleWordClick(word, "tray")}
                  className={`px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 ${
                    feedback === "correct"
                      ? "bg-emerald-600 text-white cursor-default"
                      : feedback === "incorrect"
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 active:scale-95"
                  }`}
                >
                  <span>{word.text}</span>
                  {feedback !== "correct" && <span className="text-[10px] opacity-70">×</span>}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Word Bank Tokens */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground block">
            Available Word Tokens:
          </span>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-2.5 min-h-[56px] items-center">
            {bankWords.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">
                All words have been placed in the tray above.
              </span>
            ) : (
              bankWords.map((word) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleWordClick(word, "bank")}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-all shadow-xs hover:scale-105 active:scale-95"
                >
                  {word.text}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm animate-in fade-in-50 duration-200 space-y-2 ${
              feedback === "correct"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-center space-x-2 font-bold">
              {feedback === "correct" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Excellent! Correct Sentence Formation:</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Not quite right. Review the mistake:</span>
                </>
              )}
            </div>

            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              &ldquo;{exercise.correctSentence}&rdquo;
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              <strong>Why?</strong> {exercise.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            disabled={trayWords.length === 0 && feedback === null}
            className="text-xs font-semibold gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tray</span>
          </Button>

          <div className="flex items-center gap-2">
            {feedback !== "correct" ? (
              <Button
                onClick={handleCheckSentence}
                disabled={trayWords.length === 0}
                variant="brand"
                size="default"
                className="gap-2 font-bold shadow-xs text-xs sm:text-sm"
              >
                <span>Check Answer</span>
                <Sparkles className="w-4 h-4" />
              </Button>
            ) : onNext ? (
              <Button
                onClick={onNext}
                variant="success"
                size="default"
                className="gap-2 font-bold shadow-md shadow-emerald-200 dark:shadow-none text-xs sm:text-sm"
              >
                <span>{isLast ? "Complete Building Section" : "Next Sentence"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
