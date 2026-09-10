"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  Zap,
  Award,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerbExplainerCard } from "@/components/grammar/verbs/verb-explainer-card";
import { VerbStatsOverview } from "@/components/grammar/verbs/verb-stats-overview";
import { VerbFilters } from "@/components/grammar/verbs/verb-filters";
import { VerbTableDesktop } from "@/components/grammar/verbs/verb-table-desktop";
import { VerbCardsMobile } from "@/components/grammar/verbs/verb-cards-mobile";
import { VerbDetailModal } from "@/components/grammar/verbs/verb-detail-modal";
import { VerbPracticeEngine } from "@/components/grammar/verbs/verb-practice-engine";
import { useVerbs } from "@/hooks/use-verbs";
import { VerbItem } from "@/types/grammar.types";

export default function VerbMasterPage() {
  const {
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
    setSearch,
    setCategory,
    setSelectedVerb,
    toggleLearned,
    recordAttempt,
  } = useVerbs({ initialLimit: 20 });

  const [practicingVerb, setPracticingVerb] = React.useState<VerbItem | null>(null);

  return (
    <div className="space-y-7 animate-in fade-in-50 duration-300">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          App
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <Link href="/grammar" className="hover:text-foreground transition-colors">
          Grammar Master
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          500+ Verb Master
        </span>
      </div>

      {/* 2. Main Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/grammar"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </Link>
            <Badge variant="indigo" className="text-[10px]">
              Core Module
            </Badge>
            <Badge variant="success" className="text-[10px] gap-1">
              <Sparkles className="w-3 h-3" /> 500+ Verbs Active
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            500+ Verb Master
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Master the Base Form (V1), Simple Past (V2), and Past Participle (V3) of high-frequency English and IELTS academic verbs.
          </p>
        </div>

        <Link href="/grammar/verbs/test" className="self-start sm:self-auto">
          <Button variant="default" className="gap-2 font-bold text-xs shadow-xs">
            <span>Diagnostic Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* 3. V1 / V2 / V3 Educational Explainer Banner */}
      <VerbExplainerCard />

      {/* 4. Live Progress Stats KPI Cards */}
      <VerbStatsOverview stats={stats} loading={loading} />

      {/* 5. Search Bar & Category Filter Pills */}
      <div className="pt-2">
        <VerbFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          totalCount={total}
          weakCount={stats?.weakCount || 0}
        />
      </div>

      {/* 6. Desktop Table View */}
      <VerbTableDesktop
        verbs={verbs}
        userProgressMap={userProgressMap}
        onSelectVerb={(v) => setSelectedVerb(v)}
        onToggleLearned={toggleLearned}
        onPracticeVerb={(v) => setPracticingVerb(v)}
        page={page}
        totalPages={totalPages}
        totalCount={total}
        onPageChange={setPage}
        loading={loading}
      />

      {/* 7. Mobile Cards View */}
      <VerbCardsMobile
        verbs={verbs}
        userProgressMap={userProgressMap}
        onSelectVerb={(v) => setSelectedVerb(v)}
        onToggleLearned={toggleLearned}
        onPracticeVerb={(v) => setPracticingVerb(v)}
        page={page}
        totalPages={totalPages}
        totalCount={total}
        onPageChange={setPage}
        loading={loading}
      />

      {/* 8. Reusable Verb Detail Modal */}
      <VerbDetailModal
        verb={selectedVerb}
        isOpen={Boolean(selectedVerb)}
        onClose={() => setSelectedVerb(null)}
        progress={selectedVerb ? userProgressMap[selectedVerb.id] : undefined}
        onToggleLearned={toggleLearned}
        onPracticeVerb={(v) => {
          setSelectedVerb(null);
          setPracticingVerb(v);
        }}
      />

      {/* 9. Interactive Single Verb Practice Drill Modal */}
      <VerbPracticeEngine
        verb={practicingVerb}
        isOpen={Boolean(practicingVerb)}
        onClose={() => setPracticingVerb(null)}
        onRecordAttempt={recordAttempt}
      />
    </div>
  );
}
