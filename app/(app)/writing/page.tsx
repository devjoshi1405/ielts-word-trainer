import * as React from "react";
import { ComingSoonCard } from "@/components/shared/coming-soon-card";

export default function WritingPage() {
  return (
    <div className="py-4 animate-in fade-in-50 duration-300">
      <ComingSoonCard
        moduleName="Writing"
        badgeText="Coming Soon"
        tagline="Task 1 Data Vocabulary & Task 2 Argument Coherence Engine"
        description="Master Band 8+ linking devices, trend descriptions for graphs/charts/maps, and academic sentence structures with instant feedback on grammar and lexical resource."
        plannedFeatures={[
          "Task 1 Chart & Process description template generator",
          "Task 2 Essay thesis builder and cohesive paragraph structure drills",
          "Lexical Resource booster: Replace repetitive words with Band 9 collocations",
          "Grammar Range Checker: Passive voice, conditionals, and complex clauses",
          "Examiner Band Score rubric breakdown simulator",
          "Timed 40-minute essay writing environment with distraction-free UI",
        ]}
        targetBandBenefit="Eliminate repetitive vocabulary and structure essays that consistently score Band 7.5+ in Task Achievement."
        quarterEstimate="Scheduled for Phase 2"
      />
    </div>
  );
}
