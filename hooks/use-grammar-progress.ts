"use client";

import * as React from "react";
import {
  GrammarCategory,
  GrammarTopic,
  GrammarDashboardStats,
  ResumeLearningSession,
  UserGrammarProgress,
  CategoryProgressSummary,
  TestSubmissionResult,
  GrammarQuestion,
} from "@/types/grammar.types";
import { grammarManager } from "@/lib/grammar";
import { useAuth } from "@/hooks/use-auth";

export function useGrammarProgress(explicitUserId?: string) {
  const { user } = useAuth();
  const effectiveUserId = explicitUserId || user?.id || "guest-user-uuid";

  const [categories, setCategories] = React.useState<GrammarCategory[]>([]);
  const [topics, setTopics] = React.useState<GrammarTopic[]>([]);
  const [categoryProgressList, setCategoryProgressList] = React.useState<CategoryProgressSummary[]>([]);
  const [tenseProgressList, setTenseProgressList] = React.useState<CategoryProgressSummary[]>([]);
  const [stats, setStats] = React.useState<GrammarDashboardStats | null>(null);
  const [resumeSession, setResumeSession] = React.useState<ResumeLearningSession | null>(null);
  const [userProgress, setUserProgress] = React.useState<UserGrammarProgress[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadGrammarData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [catsData, topicsData, catProgData, tenseProgData, statsData, sessionData, progData] =
        await Promise.all([
          grammarManager.getCategories(),
          grammarManager.getTopics(),
          grammarManager.getAllCategoryProgress(effectiveUserId),
          grammarManager.getAllTenseProgress(effectiveUserId),
          grammarManager.getDashboardStats(effectiveUserId),
          grammarManager.getResumeSession(effectiveUserId),
          grammarManager.getUserProgress(effectiveUserId),
        ]);

      setCategories(catsData);
      setTopics(topicsData);
      setCategoryProgressList(catProgData);
      setTenseProgressList(tenseProgData);
      setStats(statsData);
      setResumeSession(sessionData);
      setUserProgress(progData);
    } catch (err: any) {
      console.error("Failed to load grammar progress:", err);
      setError(err?.message || "Failed to load grammar data");
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  React.useEffect(() => {
    loadGrammarData();
  }, [loadGrammarData]);

  const handleRecordProgress = React.useCallback(
    async (data: {
      categoryId?: string;
      categorySlug?: string;
      topicId?: string;
      topicSlug?: string;
      lessonId?: string;
      status: "not_started" | "learning" | "practicing" | "mastered";
      progressPercent: number;
      masteryScore?: number;
      isCorrect?: boolean;
      lastSection?: string;
      lastStage?: string;
      weakAreas?: string[];
      strengths?: string[];
    }) => {
      try {
        await grammarManager.recordProgress({
          ...data,
          userId: effectiveUserId,
        });
        await loadGrammarData();
      } catch (err: any) {
        console.error("Failed to record grammar progress:", err);
      }
    },
    [effectiveUserId, loadGrammarData]
  );

  const handleRecordLessonComplete = React.useCallback(
    async (categorySlug: string, lastSection?: string) => {
      try {
        await grammarManager.recordLessonComplete(categorySlug, effectiveUserId, lastSection);
        await loadGrammarData();
      } catch (err: any) {
        console.error("Failed to record lesson complete:", err);
      }
    },
    [effectiveUserId, loadGrammarData]
  );

  const handleSubmitTestResult = React.useCallback(
    async (
      categorySlug: string,
      score: number,
      totalQuestions: number,
      incorrectQuestions: Array<{ question: GrammarQuestion; userAnswer: string }> = []
    ): Promise<TestSubmissionResult> => {
      const result = await grammarManager.submitTestResult(
        categorySlug,
        score,
        totalQuestions,
        incorrectQuestions,
        effectiveUserId
      );
      await loadGrammarData();
      return result;
    },
    [effectiveUserId, loadGrammarData]
  );

  const handleReset = React.useCallback(async () => {
    try {
      await grammarManager.resetProgress?.(effectiveUserId);
      await loadGrammarData();
    } catch (err: any) {
      console.error("Failed to reset grammar progress:", err);
    }
  }, [effectiveUserId, loadGrammarData]);

  return {
    categories,
    topics,
    categoryProgressList,
    tenseProgressList,
    stats,
    resumeSession,
    userProgress,
    loading,
    error,
    refresh: loadGrammarData,
    recordProgress: handleRecordProgress,
    recordLessonComplete: handleRecordLessonComplete,
    submitTestResult: handleSubmitTestResult,
    resetProgress: handleReset,
  };
}
