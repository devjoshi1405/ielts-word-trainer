"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GrammarQuestion, TestSubmissionResult } from "@/types/grammar.types";

interface TenseTestEngineProps {
  topicName: string;
  categorySlug: string;
  questions: GrammarQuestion[];
  onSubmitTest: (
    score: number,
    totalQuestions: number,
    incorrectQuestions: Array<{ question: GrammarQuestion; userAnswer: string }>
  ) => Promise<TestSubmissionResult>;
  onRetake: () => void;
  onGoToLearn: () => void;
  onPracticeWeakAreas: () => void;
}

export function TenseTestEngine({
  topicName,
  categorySlug,
  questions,
  onSubmitTest,
  onRetake,
  onGoToLearn,
  onPracticeWeakAreas,
}: TenseTestEngineProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<TestSubmissionResult | null>(null);
  const [showMistakesReview, setShowMistakesReview] = React.useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || questions[0];
  const selectedOptionId = selectedAnswers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / Math.max(1, totalQuestions)) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let score = 0;
      const incorrectList: Array<{ question: GrammarQuestion; userAnswer: string }> = [];

      questions.forEach((q, idx) => {
        const userChoiceId = selectedAnswers[idx];
        const correctOpt = q.options.find((o) => o.isCorrect);
        const userOpt = q.options.find((o) => o.id === userChoiceId);

        if (userChoiceId && correctOpt && userChoiceId === correctOpt.id) {
          score += 1;
        } else {
          incorrectList.push({
            question: q,
            userAnswer: userOpt ? userOpt.text : "No answer selected",
          });
        }
      });

      const result = await onSubmitTest(score, totalQuestions, incorrectList);
      setTestResult(result);
    } catch (e) {
      console.error("Test submission failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-sm text-muted-foreground">No test questions configured for this topic yet.</p>
      </Card>
    );
  }

  // 1. Result Screen
  if (testResult) {
    const isMastered = testResult.isMastered;
    const percentage = testResult.percentage;
    const incorrectCount = testResult.totalQuestions - testResult.score;

    let masteryLevelText = "Needs Learning";
    let badgeVariant: "warning" | "indigo" | "success" = "warning";

    if (isMastered || percentage >= 85) {
      masteryLevelText = "Mastered (85%+)";
      badgeVariant = "success";
    } else if (percentage >= 70) {
      masteryLevelText = "Practicing (70%+)";
      badgeVariant = "indigo";
    } else if (percentage >= 50) {
      masteryLevelText = "Learning (50%+)";
      badgeVariant = "warning";
    }

    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in-50 duration-300">
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          {/* Top Score Banner */}
          <div
            className={`p-8 sm:p-10 text-center border-b ${
              isMastered
                ? "bg-gradient-to-b from-emerald-50/80 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/60"
                : "bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-950/40 dark:to-slate-900 border-slate-200/80 dark:border-slate-800"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm mb-4 ${
                isMastered
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
              }`}
            >
              {isMastered ? <Award className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
            </div>

            <Badge variant={badgeVariant} className="text-xs px-3 py-1 font-bold uppercase mb-2">
              {masteryLevelText}
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 uppercase">
              {topicName} Test Complete
            </h2>

            <div className="mt-4 flex items-center justify-center space-x-6">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {testResult.percentage}%
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
                  Score: {testResult.score} / {testResult.totalQuestions}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-4 text-xs font-bold">
              <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {testResult.score} Correct
              </span>
              <span className="text-rose-700 dark:text-rose-400 inline-flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> {incorrectCount} Incorrect
              </span>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Strengths and Weak Areas Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>Demonstrated Strengths</span>
                </div>
                {testResult.strengths && testResult.strengths.length > 0 ? (
                  <ul className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                    {testResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Review foundational rules to establish core strengths.
                  </p>
                )}
              </div>

              {/* Needs Practice / Weak Areas */}
              <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-2.5">
                <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Targeted Weak Areas</span>
                </div>
                {testResult.weakAreas && testResult.weakAreas.length > 0 ? (
                  <ul className="space-y-1 text-xs text-rose-950 dark:text-rose-200 font-medium">
                    {testResult.weakAreas.map((wa, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">❌</span>
                        <span>{wa}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✓ Outstanding! No critical weak areas detected on this attempt.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {incorrectCount > 0 && (
                <Button
                  onClick={() => setShowMistakesReview(!showMistakesReview)}
                  variant="outline"
                  size="default"
                  className="gap-2 text-xs font-semibold"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showMistakesReview ? "Hide Mistakes" : `Review ${incorrectCount} Mistakes`}</span>
                </Button>
              )}

              {testResult.weakAreas && testResult.weakAreas.length > 0 && (
                <Button
                  onClick={onPracticeWeakAreas}
                  variant="outline"
                  size="default"
                  className="gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Practice Weak Areas</span>
                </Button>
              )}

              <Button
                onClick={onRetake}
                variant="outline"
                size="default"
                className="gap-2 text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Take Test Again</span>
              </Button>

              <Link href="/grammar">
                <Button variant="brand" size="default" className="gap-2 font-bold shadow-xs text-xs">
                  <span>Back to Grammar Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Review Mistakes Drawer */}
            {showMistakesReview && testResult.incorrectQuestions.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in-50 duration-200">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Review Mistakes ({testResult.incorrectQuestions.length})</span>
                </h3>

                <div className="space-y-3">
                  {testResult.incorrectQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2.5 text-xs"
                    >
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {idx + 1}. {item.question.prompt}
                      </div>

                      {item.question.sentence && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200">
                          &ldquo;{item.question.sentence}&rdquo;
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200/60 dark:border-rose-900/40">
                          <span className="font-bold text-[11px] block text-rose-700 uppercase">
                            Your answer:
                          </span>
                          <span className="font-semibold text-xs">{item.userAnswer}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-900/40">
                          <span className="font-bold text-[11px] block text-emerald-700 uppercase">
                            Correct answer:
                          </span>
                          <span className="font-semibold text-xs">{item.question.correctAnswer}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">
                          Why?
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.question.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Active Test Question Flow
  const isAllAnswered = Object.keys(selectedAnswers).length === totalQuestions;
  const isCurrentAnswered = selectedAnswers[currentIndex] !== undefined;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in-50 duration-200">
      {/* Test Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                currentQuestion.difficulty === "hard"
                  ? "warning"
                  : currentQuestion.difficulty === "medium"
                  ? "indigo"
                  : "secondary"
              }
              className="text-[10px] capitalize"
            >
              {currentQuestion.difficulty || "standard"} Difficulty
            </Badge>
            <span className="text-slate-900 dark:text-slate-100 font-bold">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
          <span className="text-muted-foreground">{progressPercent}% Completed</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-card bg-card">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {currentQuestion.type.replace(/_/g, " ")}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {currentQuestion.prompt}
            </h3>

            {currentQuestion.sentence && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                &ldquo;{currentQuestion.sentence}&rdquo;
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? "bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-600/20 shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>{option.text}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>

            {currentIndex < totalQuestions - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                variant="brand"
                size="sm"
                className="gap-1 text-xs font-semibold"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isAllAnswered || isSubmitting}
                variant="success"
                size="default"
                className="gap-2 font-bold shadow-md shadow-emerald-200 dark:shadow-none text-xs sm:text-sm"
              >
                <span>{isSubmitting ? "Scoring Test..." : "Submit Diagnostic Test"}</span>
                <Award className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
