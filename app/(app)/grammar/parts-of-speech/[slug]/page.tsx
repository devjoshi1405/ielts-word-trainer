"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  TopicHeader,
  TopicMode,
} from "@/components/grammar/topic-header";
import { LessonViewer } from "@/components/grammar/lesson-viewer";
import { PracticeQuiz } from "@/components/grammar/practice-quiz";
import { TopicTest } from "@/components/grammar/topic-test";
import { PARTS_OF_SPEECH_DATA } from "@/data/grammar-pos-content";
import { useGrammarProgress } from "@/hooks/use-grammar-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, BookOpen, Layers } from "lucide-react";

export default function PartOfSpeechTopicPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slugParam = typeof params?.slug === "string" ? params.slug.toLowerCase() : "noun";
  const initialMode = (searchParams.get("mode") as TopicMode) || "learn";

  const [currentMode, setCurrentMode] = React.useState<TopicMode>(initialMode);
  const [retakeKey, setRetakeKey] = React.useState(0);

  const {
    categoryProgressList,
    recordLessonComplete,
    submitTestResult,
    recordProgress,
    loading,
  } = useGrammarProgress();

  const topicData = PARTS_OF_SPEECH_DATA[slugParam];

  // Find progress for this category
  const progressInfo = categoryProgressList.find(
    (p) => p.categorySlug === slugParam
  );

  const progressPercent = progressInfo?.progressPercent || 0;
  const masteryScore = progressInfo?.masteryScore || 0;
  const isMastered = progressInfo?.isMastered || masteryScore >= 85;
  const isLessonDone = progressPercent >= 40 || isMastered;

  const handleSelectMode = (mode: TopicMode) => {
    setCurrentMode(mode);
  };

  const handleCompleteLesson = async () => {
    await recordLessonComplete(slugParam);
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

  if (!topicData) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Topic Not Found
        </h1>
        <p className="text-sm text-muted-foreground">
          The requested Part of Speech topic (&ldquo;{slugParam}&rdquo;) is not available.
        </p>
        <Link href="/grammar">
          <Button variant="brand" size="default" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Grammar Master Hub</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header with Breadcrumbs, Mode Tabs, and Mastery Indicator */}
      <TopicHeader
        topicName={topicData.name}
        tagline={topicData.tagline}
        categorySlug={slugParam}
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        progressPercent={progressPercent}
        masteryScore={masteryScore}
        isMastered={isMastered}
      />

      {/* 2. Active Mode View */}
      {currentMode === "learn" && (
        <LessonViewer
          topicName={topicData.name}
          categorySlug={slugParam}
          content={topicData.lessonContent}
          onCompleteLesson={handleCompleteLesson}
          isCompleted={isLessonDone}
        />
      )}

      {currentMode === "practice" && (
        <PracticeQuiz
          key={`practice-${slugParam}`}
          topicName={topicData.name}
          categorySlug={slugParam}
          questions={topicData.practiceQuestions}
          onStartTest={handleStartTest}
          onRecordAttempt={(isCorrect) => {
            // Soft progress update for drill interactions
            recordProgress({
              categorySlug: slugParam,
              status: isMastered ? "mastered" : "practicing",
              progressPercent: Math.max(progressPercent, 70),
              isCorrect,
            });
          }}
        />
      )}

      {currentMode === "test" && (
        <TopicTest
          key={`test-${slugParam}-${retakeKey}`}
          topicName={topicData.name}
          categorySlug={slugParam}
          questions={topicData.testQuestions}
          onSubmitTest={async (score, total, incorrect) => {
            return await submitTestResult(slugParam, score, total, incorrect);
          }}
          onRetake={handleRetakeTest}
          onGoToLearn={handleGoToLearn}
        />
      )}
    </div>
  );
}
