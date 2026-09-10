"use client";

import * as React from "react";
import { GrammarHeader } from "@/components/grammar/grammar-header";
import { GrammarStats } from "@/components/grammar/grammar-stats";
import { GrammarContinueCard } from "@/components/grammar/grammar-continue-card";
import { CategoryProgressList } from "@/components/grammar/category-progress-list";
import { GrammarModulesGrid } from "@/components/grammar/grammar-modules-grid";
import { PartsOfSpeechGrid } from "@/components/grammar/parts-of-speech-grid";
import { TensesOverviewCard } from "@/components/grammar/tenses/tenses-overview-card";
import { VerbMasterPreview } from "@/components/grammar/verb-master-preview";
import { useGrammarProgress } from "@/hooks/use-grammar-progress";
import { AlertCircle } from "lucide-react";

export default function GrammarMasterPage() {
  const {
    categories,
    topics,
    categoryProgressList,
    tenseProgressList,
    stats,
    resumeSession,
    loading,
    error,
  } = useGrammarProgress();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Banner */}
      <GrammarHeader />

      {/* Error / Notice Alert if any */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Notice: Operating in local persistence mode. Progress is saved locally.</span>
        </div>
      )}

      {/* 2. Overall Grammar Progress Statistics */}
      <GrammarStats stats={stats} loading={loading} />

      {/* 3. Hero Continue Learning / Resume Session Card */}
      <GrammarContinueCard session={resumeSession} loading={loading} />

      {/* 4. Core Tenses & Aspect Mastery (Simple Present & Simple Past) */}
      <TensesOverviewCard tenseProgressList={tenseProgressList} loading={loading} />

      {/* 5. Parts of Speech 8-Category Live Progress & Mastery Tracker */}
      <CategoryProgressList progressList={categoryProgressList} loading={loading} />

      {/* 6. 5 Core Curriculum Pillars */}
      <GrammarModulesGrid />

      {/* 7. Parts of Speech 8-Category Interactive Explorer */}
      <PartsOfSpeechGrid categories={categories} topics={topics} loading={loading} />

      {/* 8. Verb Master & Conjugation Database Preview */}
      <VerbMasterPreview />
    </div>
  );
}
