"use client";

import * as React from "react";
import {
  VerbItem,
  UserVerbProgress,
  VerbProgressStats,
  VerbFilterCategory,
} from "@/types/grammar.types";
import { grammarManager } from "@/lib/grammar";
import { useAuth } from "@/hooks/use-auth";

interface UseVerbsOptions {
  initialLimit?: number;
  initialCategory?: VerbFilterCategory;
}

export function useVerbs({
  initialLimit = 20,
  initialCategory = "all",
}: UseVerbsOptions = {}) {
  const { user } = useAuth();
  const effectiveUserId = user?.id || "guest-user-uuid";

  const [verbs, setVerbs] = React.useState<VerbItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(initialLimit);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<VerbFilterCategory>(initialCategory);
  const [userProgressMap, setUserProgressMap] = React.useState<Record<string, UserVerbProgress>>({});
  const [stats, setStats] = React.useState<VerbProgressStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedVerb, setSelectedVerb] = React.useState<VerbItem | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);

      const verbType =
        category === "regular"
          ? "regular"
          : category === "irregular"
          ? "irregular"
          : undefined;

      const difficulty =
        category === "beginner" || category === "intermediate" || category === "advanced"
          ? category
          : undefined;

      const isCommon = category === "common" ? true : undefined;
      const ieltsRelevantOnly = category === "ielts" ? true : undefined;
      const isWeakOnly = category === "weak" ? true : undefined;
      const isLearnedOnly = category === "learned" ? true : undefined;

      const [res, statsData] = await Promise.all([
        grammarManager.getVerbs({
          page,
          limit,
          search,
          verbType,
          difficulty,
          isCommon,
          ieltsRelevantOnly,
          isWeakOnly,
          isLearnedOnly,
          userId: effectiveUserId,
        }),
        grammarManager.getVerbStats(effectiveUserId),
      ]);

      setVerbs(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      if (res.userProgressMap) {
        setUserProgressMap(res.userProgressMap);
      }
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load verbs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, effectiveUserId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleLearned = React.useCallback(
    async (verbId: string, currentLearned: boolean) => {
      try {
        const nextState = !currentLearned;
        await grammarManager.toggleVerbLearned(verbId, nextState, effectiveUserId);

        // Optimistic UI update
        setUserProgressMap((prev) => ({
          ...prev,
          [verbId]: {
            ...(prev[verbId] || {
              id: `prog-${verbId}`,
              userId: effectiveUserId,
              verbId,
              confidence: nextState ? 80 : 0,
              attempts: 0,
              correctAnswers: 0,
              totalAnswers: 0,
              isWeak: false,
            }),
            status: nextState ? "learned" : "not_started",
            learnedAt: nextState ? new Date().toISOString() : null,
          },
        }));

        // Refresh stats
        const updatedStats = await grammarManager.getVerbStats(effectiveUserId);
        setStats(updatedStats);
      } catch (err) {
        console.error("Failed to toggle verb learned state:", err);
      }
    },
    [effectiveUserId]
  );

  const handleRecordAttempt = React.useCallback(
    async (verbId: string, isCorrect: boolean) => {
      try {
        await grammarManager.recordVerbAttempt(verbId, isCorrect, effectiveUserId);
        await loadData();
      } catch (err) {
        console.error("Failed to record verb attempt:", err);
      }
    },
    [effectiveUserId, loadData]
  );

  const handleCategoryChange = (newCat: VerbFilterCategory) => {
    setCategory(newCat);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  return {
    verbs,
    total,
    page,
    limit,
    totalPages,
    search,
    category,
    userProgressMap,
    stats,
    loading,
    selectedVerb,
    setPage,
    setLimit,
    setSearch: handleSearchChange,
    setCategory: handleCategoryChange,
    setSelectedVerb,
    toggleLearned: handleToggleLearned,
    recordAttempt: handleRecordAttempt,
    refresh: loadData,
  };
}
