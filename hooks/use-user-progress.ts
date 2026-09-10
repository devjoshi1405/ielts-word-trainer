"use client";

import * as React from "react";
import { DashboardStats, MistakeItem, PracticeModuleSummary, AttemptSubmission } from "@/types/progress.types";
import { progressManager } from "@/lib/progress";
import { useAuth } from "@/hooks/use-auth";

export function useUserProgress(explicitUserId?: string) {
  const { user } = useAuth();
  const effectiveUserId = explicitUserId || user?.id || "guest-user-uuid";

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [mistakes, setMistakes] = React.useState<MistakeItem[]>([]);
  const [modules, setModules] = React.useState<PracticeModuleSummary[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadProgress = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, mistakesData, modulesData] = await Promise.all([
        progressManager.getDashboardStats(effectiveUserId),
        progressManager.getMistakes(effectiveUserId),
        progressManager.getModuleSummaries(effectiveUserId),
      ]);

      setStats(statsData);
      setMistakes(mistakesData);
      setModules(modulesData);
    } catch (err: any) {
      console.error("Failed to load user progress:", err);
      setError(err?.message || "Failed to load progress data");
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  React.useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleRecordAttempt = React.useCallback(
    async (attempt: AttemptSubmission) => {
      try {
        await progressManager.recordAttempt({
          ...attempt,
          userId: attempt.userId || effectiveUserId,
        });
        await loadProgress();
      } catch (err: any) {
        console.error("Failed to record attempt in progress:", err);
      }
    },
    [effectiveUserId, loadProgress]
  );

  const handleRemoveMistake = React.useCallback(
    async (id: string) => {
      try {
        await progressManager.removeMistake(id, effectiveUserId);
        setMistakes((prev) => prev.filter((m) => m.id !== id));
      } catch (err: any) {
        console.error("Failed to remove mistake:", err);
      }
    },
    [effectiveUserId]
  );

  return {
    stats,
    mistakes,
    modules,
    loading,
    error,
    refresh: loadProgress,
    recordAttempt: handleRecordAttempt,
    removeMistake: handleRemoveMistake,
  };
}
