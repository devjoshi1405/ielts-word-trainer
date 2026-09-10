import * as React from "react";
import { ComingSoonCard } from "@/components/shared/coming-soon-card";

export default function ReadingPage() {
  return (
    <div className="py-4 animate-in fade-in-50 duration-300">
      <ComingSoonCard
        moduleName="Reading"
        badgeText="Coming Soon"
        tagline="Active Speed Reading, Scanning & True/False/Not Given Drills"
        description="We are applying our proven active recall methodology to IELTS Academic & General Reading passages. Eliminate confusion on tricky inference questions and keyword distractors."
        plannedFeatures={[
          "Timed skimming & paragraph heading matching drills",
          "True / False / Not Given logic validator with explanation trees",
          "Synonym & paraphrasing dictionary targeted to Band 8.0+",
          "Interactive passage highlighter with keyword locator",
          "Passage difficulty ratings aligned with Cambridge IELTS 10-19",
          "Weakness diagnostics by question type (Summaries, MCQs, Diagrams)",
        ]}
        targetBandBenefit="Increase reading speed by 40% and eliminate false inference traps in Section 3 texts."
        quarterEstimate="Scheduled for Phase 2"
      />
    </div>
  );
}
