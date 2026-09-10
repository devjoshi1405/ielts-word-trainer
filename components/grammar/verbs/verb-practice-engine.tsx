"use client";

import * as React from "react";
import {
  X,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VerbItem, VerbTestQuestion } from "@/types/grammar.types";
import { generateQuestionForVerb } from "@/lib/grammar/verb-quiz-generator";

interface VerbPracticeEngineProps {
  verb: VerbItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordAttempt: (verbId: string, isCorrect: boolean) => void;
}

export function VerbPracticeEngine({
  verb,
  isOpen,
  onClose,
  onRecordAttempt,
}: VerbPracticeEngineProps) {
  const [questions, setQuestions] = React.useState<VerbTestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);
  const [answersState, setAnswersState] = React.useState<
    Record<number, { selectedId: string; isCorrect: boolean }>
  >({});
  const [isCompleted, setIsCompleted] = React.useState(false);

  // Generate 4 targeted questions for this verb when opened
  React.useEffect(() => {
    if (verb && isOpen) {
      const qList = [0, 1, 2, 4].map((tIdx) => generateQuestionForVerb(verb, tIdx));
      setQuestions(qList);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setAnswersState({});
      setIsCompleted(false);
    }
  }, [verb, isOpen]);

  if (!isOpen || !verb) return null;

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const currentAnswer = answersState[currentIndex];
  const isAnswered = currentAnswer !== undefined;

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setAnswersState((prev) => ({
      ...prev,
      [currentIndex]: { selectedId: optionId, isCorrect },
    }));

    onRecordAttempt(verb.id, isCorrect);
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
    const qList = [0, 1, 2, 4].map((tIdx) => generateQuestionForVerb(verb, tIdx));
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswersState({});
    setIsCompleted(false);
  };

  const correctCount = Object.values(answersState).filter((a) => a.isCorrect).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-indigo-50/60 to-slate-50 dark:from-slate-900 dark:to-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Practice: {verb.baseForm.toUpperCase()}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isCompleted ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in-50 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Verb Practice Complete!
                </h3>
                <p className="text-xs text-muted-foreground">
                  You scored {correctCount} / {totalQuestions} ({scorePercent}% accuracy) for{" "}
                  <strong>{verb.baseForm}</strong>.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleRestart}
                  variant="outline"
                  size="default"
                  className="gap-1.5 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Practice Again</span>
                </Button>

                <Button
                  type="button"
                  onClick={onClose}
                  variant="default"
                  size="default"
                  className="gap-1.5 text-xs font-bold"
                >
                  <span>Done</span>
                </Button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-4">
              {/* Question Prompt */}
              <div className="space-y-2">
                <Badge variant="indigo" className="text-[9px] uppercase">
                  {currentQuestion.type.replace(/_/g, " ")}
                </Badge>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {currentQuestion.prompt}
                </h4>

                {/* Table Data if complete_table type */}
                {currentQuestion.tableData && (
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center font-mono text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">V1</span>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {currentQuestion.tableData.v1}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">V2</span>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {currentQuestion.tableData.v2}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">V3</span>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {currentQuestion.tableData.v3}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const isSelected =
                    currentAnswer ? currentAnswer.selectedId === option.id : selectedOptionId === option.id;
                  const showCorrect = isAnswered && option.isCorrect;
                  const showIncorrect = isAnswered && isSelected && !option.isCorrect;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option.id, option.isCorrect)}
                      className={`w-full p-3.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between border ${
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
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                      {showIncorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback Box */}
              {isAnswered && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1 animate-in fade-in-50 duration-200 ${
                    currentAnswer.isCorrect
                      ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60"
                      : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {currentAnswer.isCorrect ? (
                      <span className="text-emerald-800 dark:text-emerald-300">✓ Correct!</span>
                    ) : (
                      <span className="text-amber-800 dark:text-amber-300">
                        ✗ Correct Answer: {currentQuestion.correctAnswer}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Next Question Navigation */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <Button onClick={handleNext} variant="default" size="default" className="gap-1.5 text-xs font-bold">
                    <span>{currentIndex < totalQuestions - 1 ? "Next Question" : "Finish Practice"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
