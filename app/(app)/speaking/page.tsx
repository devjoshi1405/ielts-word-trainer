import * as React from "react";
import { ComingSoonCard } from "@/components/shared/coming-soon-card";

export default function SpeakingPage() {
  return (
    <div className="py-4 animate-in fade-in-50 duration-300">
      <ComingSoonCard
        moduleName="Speaking"
        badgeText="Coming Soon"
        tagline="AI Speaking Examiner & Fluency Intonation Analyzer"
        description="Overcome hesitation and awkward pauses. Practice IELTS Speaking Parts 1, 2, and 3 with real exam simulation, topic cue cards, and pronunciation clarity feedback."
        plannedFeatures={[
          "Part 2 Cue Card 1-minute preparation and 2-minute speech timer",
          "Audio recording with pitch, pace, and hesitation metrics",
          "Pronunciation & syllable stress analysis (Intonation & Rhythm)",
          "Idiomatic language & discourse marker suggestions for Part 3",
          "Over 100+ Cambridge recent exam topics updated monthly",
          "Examiner follow-up questions generator based on your responses",
        ]}
        targetBandBenefit="Eliminate filler words ('um', 'uh'), improve natural linking, and speak confidently across all 3 speaking parts."
        quarterEstimate="Scheduled for Phase 3"
      />
    </div>
  );
}
