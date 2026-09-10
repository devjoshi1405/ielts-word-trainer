import * as React from "react";
import { Percent, CheckCircle2, Zap, Flame, Award } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { GrammarDashboardStats } from "@/types/grammar.types";

interface GrammarStatsProps {
  stats: GrammarDashboardStats | null;
  loading: boolean;
}

export function GrammarStats({ stats, loading }: GrammarStatsProps) {
  const overallMastery = stats?.overallMastery ?? 0;
  const topicsMastered = stats?.topicsMastered ?? 0;
  const totalTopics = stats?.totalTopics ?? 6;
  const verbsStudied = stats?.verbsStudied ?? 0;
  const totalVerbsAvailable = stats?.totalVerbsAvailable ?? 4;
  const currentStreak = stats?.currentStreak ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Grammar Mastery"
        value={loading ? "..." : `${overallMastery}%`}
        subtitle={overallMastery > 0 ? "Aggregated band score" : "Foundations active"}
        change={
          overallMastery >= 75
            ? { value: "Band 7.5+ Pace", trend: "up" }
            : { value: "Initial Level", trend: "neutral" }
        }
        icon={Percent}
        iconColor="text-indigo-600 dark:text-indigo-400"
        iconBg="bg-indigo-50 dark:bg-indigo-950/50"
      />

      <StatCard
        title="Topics Mastered"
        value={loading ? "..." : `${topicsMastered} / ${totalTopics}`}
        subtitle="Foundational Grammar Topics"
        change={
          topicsMastered > 0
            ? { value: `+${topicsMastered} completed`, trend: "up" }
            : { value: "Begin Topic 1", trend: "neutral" }
        }
        icon={CheckCircle2}
        iconColor="text-emerald-600 dark:text-emerald-400"
        iconBg="bg-emerald-50 dark:bg-emerald-950/50"
      />

      <StatCard
        title="Verb Bank Preview"
        value={loading ? "..." : `${verbsStudied} / ${totalVerbsAvailable}`}
        subtitle="500+ Verbs Coming Phase 3"
        change={{ value: "V1 / V2 / V3 Schema", trend: "neutral" }}
        icon={Zap}
        iconColor="text-amber-600 dark:text-amber-400"
        iconBg="bg-amber-50 dark:bg-amber-950/50"
      />

      <StatCard
        title="Grammar Streak"
        value={loading ? "..." : `${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`}
        subtitle="Daily grammar practice"
        change={
          currentStreak > 0
            ? { value: "Active Streak", trend: "up" }
            : { value: "Study today", trend: "neutral" }
        }
        icon={Flame}
        iconColor="text-orange-600 dark:text-orange-400"
        iconBg="bg-orange-50 dark:bg-orange-950/50"
      />
    </div>
  );
}
