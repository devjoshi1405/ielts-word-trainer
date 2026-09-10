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
  ChevronRight,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VerbItem, VerbTestQuestion, VerbTestResult } from "@/types/grammar.types";
import { VERBS_500_DATA } from "@/data/verbs-500";
import { generateVerbQuizQuestions } from "@/lib/grammar/verb-quiz-generator";
import { grammarManager } from "@/lib/grammar";
import { useAuth } from "@/hooks/use-auth";

export default function VerbTestPage() {
  const { user } = useAuth();
  const effectiveUserId = user?.id || "guest-user-uuid";

  // Test Setup State
  const [questionCount, setQuestionCount] = React.useState<number>(10);
  const [testMode, setTestMode] = React.useState<"all" | "irregular" | "weak" | "ielts">("all");
  const [isTestStarted, setIsTestStarted] = React.useState<boolean>(false);
  const [allVerbs, setAllVerbs] = React.useState<VerbItem[]>(VERBS_500_DATA);
  const [weakVerbsList, setWeakVerbsList] = React.useState<VerbItem[]>([]);

  // Active Test State
  const [questions, setQuestions] = React.useState<VerbTestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [testResult, setTestResult] = React.useState<VerbTestResult | null>(null);
  const [showMistakesReview, setShowMistakesReview] = React.useState<boolean>(false);

  // Load weak verbs on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        const verbsList = await grammarManager.getAllVerbsList();
        if (verbsList && verbsList.length > 0) {
          setAllVerbs(verbsList);
        }

        const progMap = await grammarManager.getUserVerbProgress(effectiveUserId);
        const weak = verbsList.filter((v) => progMap[v.id]?.isWeak);
        setWeakVerbsList(weak);
      } catch (err) {
        console.error("Failed to load verbs for test:", err);
      }
    }
    loadData();
  }, [effectiveUserId]);

  const handleStartTest = (mode = testMode, count = questionCount) => {
    let pool = [...allVerbs];

    if (mode === "irregular") {
      pool = pool.filter((v) => v.verbType === "irregular");
    } else if (mode === "weak" && weakVerbsList.length > 0) {
      pool = [...weakVerbsList];
    } else if (mode === "ielts") {
      pool = pool.filter((v) => v.isIeltsRelevant);
    }

    const generated = generateVerbQuizQuestions(pool, count, allVerbs);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTestResult(null);
    setShowMistakesReview(false);
    setIsTestStarted(true);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let score = 0;
      const incorrectList: Array<{ question: VerbTestQuestion; userAnswer: string }> = [];
      const testedVerbIds: string[] = [];
      const incorrectVerbIds: string[] = [];
      const weakVerbsIdentified: VerbItem[] = [];

      questions.forEach((q, idx) => {
        const userChoiceId = selectedAnswers[idx];
        const correctOpt = q.options.find((o) => o.isCorrect);
        const userOpt = q.options.find((o) => o.id === userChoiceId);

        testedVerbIds.push(q.verbId);

        if (userChoiceId && correctOpt && userChoiceId === correctOpt.id) {
          score += 1;
        } else {
          incorrectVerbIds.push(q.verbId);
          if (!weakVerbsIdentified.some((v) => v.id === q.targetVerb.id)) {
            weakVerbsIdentified.push(q.targetVerb);
          }
          incorrectList.push({
            question: q,
            userAnswer: userOpt ? userOpt.text : "No answer selected",
          });
        }
      });

      const totalQuestions = questions.length;
      const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);
      const isMastered = percentage >= 85;

      // Save to persistence
      await grammarManager.submitVerbTestResult({
        totalQuestions,
        score,
        testedVerbIds,
        incorrectVerbIds,
        userId: effectiveUserId,
      });

      setTestResult({
        score,
        totalQuestions,
        percentage,
        isMastered,
        weakVerbs: weakVerbsIdentified,
        incorrectQuestions: incorrectList,
      });
    } catch (err) {
      console.error("Test submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    handleStartTest(testMode, questionCount);
  };

  const handlePracticeWeakOnly = () => {
    if (testResult && testResult.weakVerbs.length > 0) {
      const generated = generateVerbQuizQuestions(
        testResult.weakVerbs,
        Math.min(10, testResult.weakVerbs.length * 3),
        allVerbs
      );
      setQuestions(generated);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setTestResult(null);
      setShowMistakesReview(false);
      setIsTestStarted(true);
    }
  };

  // 1. Result Screen
  if (testResult) {
    const isMastered = testResult.isMastered;
    const incorrectCount = testResult.totalQuestions - testResult.score;

    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in-50 duration-300 py-4">
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          <div
            className={`p-8 sm:p-10 text-center border-b ${
              isMastered
                ? "bg-gradient-to-b from-emerald-50/80 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/60"
                : "bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-950/40 dark:to-slate-900 border-slate-200/80 dark:border-slate-800"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-xs mb-4 ${
                isMastered
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
              }`}
            >
              {isMastered ? <Award className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge
                variant={isMastered ? "success" : testResult.percentage >= 70 ? "indigo" : "warning"}
                className="text-xs px-3 py-1 font-bold uppercase"
              >
                {isMastered
                  ? "Verb Master (85%+ Achieved)"
                  : testResult.percentage >= 70
                  ? "Good Performance (70%+)"
                  : "Needs Practice"}
              </Badge>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              VERB TEST COMPLETE
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

            <div className="flex justify-center gap-4 mt-4 text-xs font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {testResult.score} Correct
              </span>
              <span className="text-rose-700 dark:text-rose-400 inline-flex items-center gap-1">
                <XCircle className="w-4 h-4" /> {incorrectCount} Incorrect
              </span>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Weak Verbs Identified List */}
            {testResult.weakVerbs.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Weak Verbs Flagged ({testResult.weakVerbs.length}):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {testResult.weakVerbs.map((v) => (
                    <span
                      key={v.id}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-mono font-bold text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                    >
                      {v.baseForm} ({v.pastForm} / {v.pastParticiple})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
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

              {testResult.weakVerbs.length > 0 && (
                <Button
                  onClick={handlePracticeWeakOnly}
                  variant="outline"
                  size="default"
                  className="gap-2 text-xs font-semibold"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Practice {testResult.weakVerbs.length} Weak Verbs</span>
                </Button>
              )}

              <Button
                onClick={handleRetake}
                variant="outline"
                size="default"
                className="gap-2 text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Take Test Again</span>
              </Button>

              <Link href="/grammar/verbs">
                <Button variant="default" size="default" className="gap-2 font-bold shadow-xs">
                  <span>Back to Verb Master</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mistakes Review Drawer */}
            {showMistakesReview && testResult.incorrectQuestions.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in-50 duration-200">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Questions to Review ({testResult.incorrectQuestions.length})
                </h3>

                <div className="space-y-3">
                  {testResult.incorrectQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2 text-xs"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {idx + 1}. {item.question.prompt}
                      </div>

                      {item.question.sentence && (
                        <div className="italic text-muted-foreground">
                          &ldquo;{item.question.sentence}&rdquo;
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200/60 dark:border-red-900/40">
                          <span className="font-bold">Your answer: </span>
                          {item.userAnswer}
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-900/40">
                          <span className="font-bold">Correct answer: </span>
                          {item.question.correctAnswer}
                        </div>
                      </div>

                      <p className="text-muted-foreground pt-1">
                        <strong>Explanation:</strong> {item.question.explanation}
                      </p>
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

  // 2. Active Test In Progress
  if (isTestStarted && questions.length > 0) {
    const totalQuestions = questions.length;
    const currentQuestion = questions[currentIndex] || questions[0];
    const selectedOptionId = selectedAnswers[currentIndex];
    const progressPercent = Math.round(((currentIndex + 1) / Math.max(1, totalQuestions)) * 100);
    const isAllAnswered = Object.keys(selectedAnswers).length === totalQuestions;
    const isCurrentAnswered = selectedAnswers[currentIndex] !== undefined;

    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in-50 duration-200 py-4">
        {/* Test Progress Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <Badge variant="indigo" className="text-[10px]">
                Verb Diagnostic Test
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
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {currentQuestion.type.replace(/_/g, " ")}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {currentQuestion.prompt}
              </h3>

              {/* Table Data if complete_table type */}
              {currentQuestion.tableData && (
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center font-mono text-xs sm:text-sm">
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

              {currentQuestion.sentence && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  &ldquo;{currentQuestion.sentence}&rdquo;
                </div>
              )}
            </div>

            {/* Options List */}
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

            {/* Test Navigation & Submit Bar */}
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
                  variant="default"
                  size="sm"
                  className="gap-1 text-xs font-semibold"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitTest}
                  disabled={!isAllAnswered || isSubmitting}
                  variant="success"
                  size="default"
                  className="gap-2 font-bold shadow-md shadow-emerald-200 dark:shadow-none"
                >
                  <span>{isSubmitting ? "Calculating Result..." : "Submit Test"}</span>
                  <Award className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Test Configuration / Welcome Screen
  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in-50 duration-300 py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          App
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <Link href="/grammar" className="hover:text-foreground transition-colors">
          Grammar Master
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <Link href="/grammar/verbs" className="hover:text-foreground transition-colors">
          Verb Master
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">Verb Test</span>
      </div>

      <Card className="border-slate-200/80 dark:border-slate-800 shadow-card">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Verb Diagnostic & Mastery Test
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Test your recall of V1 (Base), V2 (Past), V3 (Past Participle), and contextual IELTS usage. Pass with <strong>85%+ for mastery</strong>.
            </p>
          </div>

          {/* Test Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Test Focus
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTestMode("all")}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  testMode === "all"
                    ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-600/20 font-bold text-slate-900 dark:text-slate-100"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="font-bold">Comprehensive Test</div>
                <div className="text-[11px] text-muted-foreground font-normal">All 500+ English verbs</div>
              </button>

              <button
                type="button"
                onClick={() => setTestMode("irregular")}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  testMode === "irregular"
                    ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-600/20 font-bold text-slate-900 dark:text-slate-100"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="font-bold">Irregular Verbs Only</div>
                <div className="text-[11px] text-muted-foreground font-normal">High-frequency stem shifts</div>
              </button>

              <button
                type="button"
                onClick={() => setTestMode("ielts")}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  testMode === "ielts"
                    ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-600/20 font-bold text-slate-900 dark:text-slate-100"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="font-bold">IELTS Academic Focus</div>
                <div className="text-[11px] text-muted-foreground font-normal">Writing & Task 1/2 vocabulary</div>
              </button>

              <button
                type="button"
                onClick={() => setTestMode("weak")}
                disabled={weakVerbsList.length === 0}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  testMode === "weak"
                    ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-600/20 font-bold text-slate-900 dark:text-slate-100"
                    : weakVerbsList.length === 0
                    ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-muted-foreground"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Weak Verbs Drill</span>
                  {weakVerbsList.length > 0 && (
                    <Badge variant="warning" className="text-[9px]">
                      {weakVerbsList.length}
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground font-normal">
                  {weakVerbsList.length > 0 ? "Targeted revision" : "No weak verbs flagged yet"}
                </div>
              </button>
            </div>
          </div>

          {/* Question Count Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[10, 20, 30].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    questionCount === count
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <Link href="/grammar/verbs" className="w-full sm:w-auto">
              <Button variant="ghost" size="default" className="w-full sm:w-auto text-xs gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Verb Master</span>
              </Button>
            </Link>

            <Button
              onClick={() => handleStartTest()}
              variant="default"
              size="default"
              className="w-full sm:w-auto font-bold text-xs gap-2 shadow-xs"
            >
              <span>Start Verb Test</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
