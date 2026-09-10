"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Zap,
  Layers,
  Award,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TENSES_DATA } from "@/data/grammar-tenses-content";
import { TenseLessonViewer } from "@/components/grammar/tenses/tense-lesson-viewer";
import { TensePracticeHub } from "@/components/grammar/tenses/tense-practice-hub";
import { TenseTestEngine } from "@/components/grammar/tenses/tense-test-engine";
import { useGrammarProgress } from "@/hooks/use-grammar-progress";

export type TensePageMode = "learn" | "practice" | "sentence_building" | "test";

export default function SimplePastTensePage() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as TensePageMode) || "learn";

  const [currentMode, setCurrentMode] = React.useState<TensePageMode>(initialMode);
  const [retakeKey, setRetakeKey] = React.useState(0);

  const {
    tenseProgressList,
    recordLessonComplete,
    submitTestResult,
    recordProgress,
    loading,
  } = useGrammarProgress();

  const topicData = TENSES_DATA["simple-past"];

  const progressInfo = tenseProgressList.find((p) => p.categorySlug === "simple-past");
  const progressPercent = progressInfo?.progressPercent || 0;
  const masteryScore = progressInfo?.masteryScore || 0;
  const isMastered = progressInfo?.isMastered || masteryScore >= 85;
  const isLessonDone = progressPercent >= 40 || isMastered;

  const handleSelectMode = (mode: TensePageMode) => {
    setCurrentMode(mode);
  };

  const handleCompleteLesson = async () => {
    await recordLessonComplete("simple-past", "completed");
    setCurrentMode("practice");
  };

  const handleStartTest = () => {
    setCurrentMode("test");
  };

  const handleRetakeTest = () => {
    setRetakeKey((k) => k + 1);
  };

  const handleGoToLearn = () => {
    setCurrentMode("learn");
  };

  const handlePracticeWeakAreas = () => {
    setCurrentMode("practice");
  };

  if (!topicData) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
        <h1 className="text-xl font-bold">Topic Not Found</h1>
        <Link href="/grammar/tenses">
          <Button variant="brand">Return to Tenses Hub</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 max-w-5xl mx-auto">
      {/* 1. Header with Breadcrumbs, Modes, and Progress */}
      <div className="space-y-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Link href="/grammar" className="hover:text-foreground transition-colors">
            Grammar Master
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <Link href="/grammar/tenses" className="hover:text-foreground transition-colors">
            Tenses & Aspect
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {topicData.name}
          </span>
        </div>

        {/* Title and Mastery Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Link
                href="/grammar/tenses"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Tenses</span>
              </Link>
              <Badge variant="indigo" className="text-[10px]">
                Essential Tense
              </Badge>
              {isMastered && (
                <Badge variant="success" className="text-[10px] gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Mastered (85%+)
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              {topicData.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              {topicData.tagline}
            </p>
          </div>

          {/* Progress & Mastery Pill */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
              {masteryScore > 0 ? `${masteryScore}%` : `${progressPercent}%`}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span>{isMastered ? "Tense Mastered" : progressPercent > 0 ? "In Progress" : "Not Started"}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {isMastered ? "Score: 85%+ achieved" : "Pass test with 85%+ for mastery"}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Navigation Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleSelectMode("learn")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentMode === "learn"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Learn Rules (7 Parts)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("practice")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentMode === "practice"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>2. Practice Drills</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("sentence_building")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentMode === "sentence_building"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Sentence Building</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("test")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentMode === "test"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. Diagnostic Test (15 Qs)</span>
          </button>
        </div>
      </div>

      {/* 2. Active Mode View */}
      {currentMode === "learn" && (
        <TenseLessonViewer
          topicData={topicData}
          onCompleteLesson={handleCompleteLesson}
          isCompleted={isLessonDone}
          onRecordSection={(sectionId) => {
            recordProgress({
              categorySlug: "simple-past",
              status: isMastered ? "mastered" : "learning",
              progressPercent: Math.max(progressPercent, 35),
              lastSection: sectionId,
              lastStage: "learning",
            });
          }}
        />
      )}

      {currentMode === "practice" && (
        <TensePracticeHub
          key="practice-drills"
          topicData={topicData}
          initialTab="drills"
          onStartTest={handleStartTest}
          onRecordAttempt={(isCorrect) => {
            recordProgress({
              categorySlug: "simple-past",
              status: isMastered ? "mastered" : "practicing",
              progressPercent: Math.max(progressPercent, 65),
              isCorrect,
              lastStage: "practicing",
            });
          }}
        />
      )}

      {currentMode === "sentence_building" && (
        <TensePracticeHub
          key="practice-sentence-building"
          topicData={topicData}
          initialTab="sentence_building"
          onStartTest={handleStartTest}
          onRecordAttempt={(isCorrect) => {
            recordProgress({
              categorySlug: "simple-past",
              status: isMastered ? "mastered" : "practicing",
              progressPercent: Math.max(progressPercent, 70),
              isCorrect,
              lastStage: "practicing",
            });
          }}
        />
      )}

      {currentMode === "test" && (
        <TenseTestEngine
          key={`test-spast-${retakeKey}`}
          topicName={topicData.name}
          categorySlug="simple-past"
          questions={topicData.testQuestions}
          onSubmitTest={async (score, total, incorrect) => {
            return await submitTestResult("simple-past", score, total, incorrect);
          }}
          onRetake={handleRetakeTest}
          onGoToLearn={handleGoToLearn}
          onPracticeWeakAreas={handlePracticeWeakAreas}
        />
      )}
    </div>
  );
}
