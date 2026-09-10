"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  Award,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GrammarQuestion } from "@/types/grammar.types";

interface PracticeQuizProps {
  topicName: string;
  categorySlug: string;
  questions: GrammarQuestion[];
  onStartTest: () => void;
  onRecordAttempt?: (isCorrect: boolean) => void;
}

export function PracticeQuiz({
  topicName,
  questions,
  onStartTest,
  onRecordAttempt,
}: PracticeQuizProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);
  const [answersState, setAnswersState] = React.useState<
    Record<number, { selectedId: string; isCorrect: boolean }>
  >({});
  const [isCompleted, setIsCompleted] = React.useState(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const currentAnswer = answersState[currentIndex];
  const isAnswered = currentAnswer !== undefined;

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return; // Prevent changing after answer

    setSelectedOptionId(optionId);
    setAnswersState((prev) => ({
      ...prev,
      [currentIndex]: { selectedId: optionId, isCorrect },
    }));

    if (onRecordAttempt) {
      onRecordAttempt(isCorrect);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswersState({});
    setIsCompleted(false);
  };

  const correctCount = Object.values(answersState).filter((a) => a.isCorrect).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  if (!questions || questions.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-sm text-muted-foreground">No practice questions available for this topic yet.</p>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-card animate-in fade-in-50 duration-300">
        <CardContent className="p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Practice Drills Completed!
            </h2>
            <p className="text-sm text-muted-foreground">
              You answered {correctCount} out of {totalQuestions} questions correctly ({scorePercent}% accuracy).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 max-w-md mx-auto">
            <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Next Step in Master Journey
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Take the scored diagnostic test to earn <strong>85%+ mastery</strong> for {topicName}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleRestart}
              variant="outline"
              size="default"
              className="w-full sm:w-auto gap-2 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </Button>
            <Button
              onClick={onStartTest}
              variant="brand"
              size="default"
              className="w-full sm:w-auto gap-2 font-bold shadow-md shadow-indigo-200 dark:shadow-none"
            >
              <span>Take Diagnostic Test</span>
              <Award className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in-50 duration-200">
      {/* Quiz Progress & Question Type Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="indigo" className="text-[10px] uppercase">
            {currentQuestion.type.replace(/_/g, " ")}
          </Badge>
          <span className="text-xs font-semibold text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <span className="text-xs font-medium text-slate-500">
          Score: {correctCount} / {currentIndex + (isAnswered ? 1 : 0)}
        </span>
      </div>

      {/* Question Card */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-card">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Prompt */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {currentQuestion.prompt}
            </h3>

            {currentQuestion.sentence && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                &ldquo;{currentQuestion.sentence}&rdquo;
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option) => {
              const isSelected =
                (currentAnswer ? currentAnswer.selectedId === option.id : selectedOptionId === option.id);
              const showCorrect = isAnswered && option.isCorrect;
              const showIncorrect = isAnswered && isSelected && !option.isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option.id, option.isCorrect)}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                    showCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                      : showIncorrect
                      ? "bg-rose-50 dark:bg-red-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20"
                      : isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>{option.text}</span>

                  {showCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {showIncorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational Feedback Box (Shown immediately after answer) */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl border animate-in fade-in-50 duration-200 space-y-1.5 ${
                currentAnswer.isCorrect
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60"
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60"
              }`}
            >
              <div className="flex items-center space-x-1.5 font-bold text-xs">
                {currentAnswer.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800 dark:text-emerald-300">✓ Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-800 dark:text-amber-300">✗ Not quite.</span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Navigation to Next Question */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <Button onClick={handleNext} variant="brand" size="default" className="gap-2">
                <span>{currentIndex < totalQuestions - 1 ? "Next Question" : "Finish Practice"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
