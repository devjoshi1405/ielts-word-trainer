"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  BookmarkPlus,
  Lightbulb,
  Snail,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnswerValidationResult, ExerciseQuestion } from "@/types/exercise.types";
import { audioService } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface AnswerFeedbackProps {
  result: AnswerValidationResult | null;
  question: ExerciseQuestion;
  onNext: () => void;
  onRetry: () => void;
  onPlayAgain?: () => void;
  onSlowAudio?: () => void;
  onAddToMistakes?: () => void;
  hasNextQuestion?: boolean;
}

export function AnswerFeedback({
  result,
  question,
  onNext,
  onRetry,
  onPlayAgain,
  onSlowAudio,
  onAddToMistakes,
  hasNextQuestion = true,
}: AnswerFeedbackProps) {
  const [addedToMistakes, setAddedToMistakes] = React.useState(false);

  React.useEffect(() => {
    if (result?.isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#4f46e5", "#10b981", "#3b82f6", "#f59e0b"],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [result]);

  if (!result) return null;

  const isCorrect = result.isCorrect;
  const isRevealed = result.isRevealed ?? true;
  const isFirstMistake = !isCorrect && !isRevealed;

  const handlePlayWord = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else if (question.audioUrl) {
      audioService.playAudioUrl(question.audioUrl, { accent: question.accent || "british", rate: 1.0 });
    } else {
      audioService.playText(question.targetText, { accent: question.accent || "british", rate: 1.0 });
    }
  };

  const handleSlowAudio = () => {
    if (onSlowAudio) {
      onSlowAudio();
    } else if (question.audioUrl) {
      audioService.playAudioUrl(question.audioUrl, { accent: question.accent || "british", rate: 0.75 });
    } else {
      audioService.playText(question.targetText, { accent: question.accent || "british", rate: 0.75 });
    }
  };

  const handleBookmark = () => {
    setAddedToMistakes(true);
    onAddToMistakes?.();
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border p-6 sm:p-7 space-y-6 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-3",
        isCorrect
          ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/30"
          : "border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30"
      )}
    >
      {/* Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          {isCorrect ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <h3
                className={cn(
                  "text-xl font-bold tracking-tight",
                  isCorrect
                    ? "text-emerald-900 dark:text-emerald-200"
                    : "text-rose-900 dark:text-rose-200"
                )}
              >
                {isCorrect ? "✓ Correct!" : "✕ Not quite"}
              </h3>
              {isCorrect && (
                <Badge variant="success" className="text-xs">
                  Mastered
                </Badge>
              )}
              {isFirstMistake && (
                <Badge variant="outline" className="text-xs text-amber-800 dark:text-amber-300 border-amber-300">
                  Attempt {result.attemptNumber || 1} of {result.maxAttempts || 2}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isCorrect
                ? "Excellent listening."
                : isFirstMistake
                ? "Try listening again."
                : "Review the correct spelling and mnemonic tip below."}
            </p>
          </div>
        </div>
      </div>

      {/* Answer Comparison Box */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
        {/* Case 1: First Mistake (Attempt 1) -> Only show user input & guidance */}
        {isFirstMistake ? (
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Your Answer
              </div>
              <div className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                {result.userAnswer || "(empty)"}
              </div>
            </div>
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 border border-amber-200/70 dark:border-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Listen closely to the vowels and double consonants, then try again.</span>
            </div>
          </div>
        ) : (
          /* Case 2: Correct OR Final Revealed Attempt */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Correct Answer
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {result.targetAnswer}
                  </span>
                  {question.phoneticIpa && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {question.phoneticIpa}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Your Answer
                </div>
                <div
                  className={cn(
                    "text-lg font-semibold",
                    isCorrect
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400 line-through"
                  )}
                >
                  {result.userAnswer || "(empty)"}
                </div>
              </div>
            </div>

            {/* Spelling Traps & Guidance Tip */}
            {question.spellingTrapRule && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    Tip:
                  </span>{" "}
                  {question.spellingTrapRule}
                </div>
              </div>
            )}

            {question.definition && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Definition:
                </span>{" "}
                {question.definition}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Buttons for Attempt 1 Mistake: [Play Again] [Slow Audio] [Try Again] */}
        {isFirstMistake ? (
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handlePlayWord}
              className="gap-2 bg-white dark:bg-slate-900 shadow-xs"
            >
              <Play className="w-4 h-4 fill-current text-indigo-600" />
              <span>Play Again</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleSlowAudio}
              className="gap-2 bg-white dark:bg-slate-900 shadow-xs"
            >
              <Snail className="w-4 h-4 text-amber-600" />
              <span>Slow Audio</span>
            </Button>

            <Button
              type="button"
              variant="brand"
              size="default"
              onClick={onRetry}
              className="gap-2 shadow-sm"
              autoFocus
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        ) : (
          /* Buttons for Correct or Final Revealed Attempt */
          <div className="flex items-center space-x-2">
            {!isCorrect && (
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={onRetry}
                className="gap-2 bg-white dark:bg-slate-900"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
            )}

            {!isCorrect && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                disabled={addedToMistakes}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>{addedToMistakes ? "Saved in Mistakes" : "Save to Mistakes"}</span>
              </Button>
            )}
          </div>
        )}

        {/* Next Question button (visible on Correct OR Final Revealed Attempt) */}
        {!isFirstMistake && (
          <Button
            type="button"
            variant="brand"
            size="default"
            onClick={onNext}
            className="gap-2 shadow-md shadow-indigo-200 dark:shadow-none ml-auto"
            autoFocus
          >
            <span>{hasNextQuestion ? "Next Question" : "Complete Session"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
