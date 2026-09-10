"use client";

import * as React from "react";
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Zap,
  HelpCircle,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TenseTopicData, TenseLessonSection } from "@/types/grammar.types";
import { VerbDetailModal } from "@/components/grammar/verbs/verb-detail-modal";
import { VERBS_500_DATA } from "@/data/verbs-500";
import { VerbItem } from "@/types/grammar.types";

interface TenseLessonViewerProps {
  topicData: TenseTopicData;
  onCompleteLesson: () => void;
  onRecordSection?: (sectionId: string) => void;
  isCompleted: boolean;
  initialSectionId?: string;
}

export function TenseLessonViewer({
  topicData,
  onCompleteLesson,
  onRecordSection,
  isCompleted,
  initialSectionId,
}: TenseLessonViewerProps) {
  const sections = topicData.sections;
  const [activeSectionId, setActiveSectionId] = React.useState<string>(
    initialSectionId || sections[0]?.id || "section-a"
  );

  // Selected verb for modal inspection
  const [inspectedVerb, setInspectedVerb] = React.useState<VerbItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const activeIndex = sections.findIndex((s) => s.id === activeSectionId);
  const activeSection = sections[activeIndex] || sections[0];

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id);
    if (onRecordSection) {
      onRecordSection(id);
    }
  };

  const handleNextSection = () => {
    if (activeIndex < sections.length - 1) {
      const nextId = sections[activeIndex + 1].id;
      setActiveSectionId(nextId);
      if (onRecordSection) {
        onRecordSection(nextId);
      }
      // Scroll to top of content
      window.scrollTo({ top: 200, behavior: "smooth" });
    } else {
      onCompleteLesson();
    }
  };

  const handleOpenVerbModal = (verbBase: string) => {
    const match = VERBS_500_DATA.find(
      (v) =>
        v.baseForm.toLowerCase() === verbBase.toLowerCase() ||
        v.pastForm.toLowerCase() === verbBase.toLowerCase()
    );
    if (match) {
      setInspectedVerb(match);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Interactive Verb Detail Modal */}
      <VerbDetailModal
        verb={inspectedVerb}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleLearned={() => {}}
        onPracticeVerb={() => {}}
      />

      {/* 2. Overview Banner */}
      <Card className="border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/20 shadow-card">
        <CardContent className="p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span>Complete Curriculum Lesson</span>
            </div>
            <Badge variant="indigo" className="text-[10px]">
              {topicData.ieltsBandTarget}
            </Badge>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {topicData.name} — Comprehensive Mastery
          </h2>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {topicData.overview}
          </p>
        </CardContent>
      </Card>

      {/* 3. Section Navigation Rail / Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
          <span>Lesson Modules (Sections A — G):</span>
          <span>
            Module {activeIndex + 1} of {sections.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {sections.map((sec, idx) => {
            const isCurrent = sec.id === activeSectionId;
            const isPast = idx < activeIndex;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSelectSection(sec.id)}
                className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isCurrent
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-600/20"
                    : isPast
                    ? "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] font-extrabold uppercase ${
                      isCurrent ? "text-indigo-100" : "text-muted-foreground"
                    }`}
                  >
                    Part {String.fromCharCode(65 + idx)}
                  </span>
                  {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
                <div
                  className={`text-xs font-bold truncate mt-1 ${
                    isCurrent ? "text-white" : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {sec.title.split("—")[1]?.trim() || sec.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Section Content Body */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-card bg-card overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Section Header */}
          <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center space-x-2">
              <Badge variant="indigo" className="text-[10px]">
                {activeSection.id.toUpperCase()}
              </Badge>
              {activeSection.subtitle && (
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {activeSection.subtitle}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {activeSection.title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
              {activeSection.explanation}
            </p>
          </div>

          {/* Formulas and Patterns */}
          {activeSection.formulas && activeSection.formulas.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Grammar Formula & Structure</span>
              </h4>

              <div className="space-y-3">
                {activeSection.formulas.map((form, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="font-mono text-sm sm:text-base font-black text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 inline-block shadow-xs">
                        {form.pattern}
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">{form.description}</p>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic sm:text-right font-medium max-w-sm">
                      &ldquo;{form.example}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules and Explanations */}
          {activeSection.rules && activeSection.rules.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Core Rules & Concepts</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSection.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs"
                  >
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                      {rule.title}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rule.rule}
                    </p>
                    {rule.explanation && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rule.explanation}
                      </p>
                    )}
                    {rule.example && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs border border-slate-100 dark:border-slate-700">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-1.5">
                          Example:
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 italic font-medium">
                          &ldquo;{rule.example}&rdquo;
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spelling Rules Table */}
          {activeSection.spellingRules && activeSection.spellingRules.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Spelling Patterns & Transformations</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeSection.spellingRules.map((sp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3"
                  >
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {sp.pattern}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{sp.rule}</p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {sp.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                        >
                          <span className="font-mono text-slate-600 dark:text-slate-400">
                            {ex.base}
                          </span>
                          <span className="text-indigo-500 font-bold">→</span>
                          <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                            {ex.changed}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenVerbModal(ex.base)}
                            title="Inspect in Verb Master"
                            className="text-[10px] text-muted-foreground hover:text-indigo-600 ml-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signal Words Table */}
          {activeSection.signalWords && activeSection.signalWords.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Time Expressions & Signal Words</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeSection.signalWords.map((sw, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg">
                        {sw.word}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {sw.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-1">
                      &ldquo;{sw.example}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes (Red/Green Side by Side) */}
          {activeSection.commonMistakes && activeSection.commonMistakes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Common Learner Mistakes & Corrections</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSection.commonMistakes.map((cm, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
                  >
                    {/* Incorrect */}
                    <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 flex items-start space-x-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                          Incorrect
                        </div>
                        <div className="text-xs font-semibold text-rose-950 dark:text-rose-200">
                          {cm.incorrect}
                        </div>
                      </div>
                    </div>

                    {/* Correct */}
                    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                          Correct
                        </div>
                        <div className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                          {cm.correct}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      <strong>Why?</strong> {cm.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IELTS Examiner Notes */}
          {activeSection.ieltsNotes && activeSection.ieltsNotes.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>IELTS Writing & Speaking Application</span>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                {activeSection.ieltsNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-muted-foreground font-medium">
              Section {activeIndex + 1} of {sections.length} completed
            </div>

            <Button
              onClick={handleNextSection}
              size="lg"
              variant="brand"
              className="gap-2 font-bold shadow-md shadow-indigo-200 dark:shadow-none w-full sm:w-auto text-xs sm:text-sm"
            >
              <span>
                {activeIndex < sections.length - 1
                  ? `Continue to ${sections[activeIndex + 1].title.split("—")[1]?.trim() || "Next Section"}`
                  : "Complete Lesson & Open Practice Drills"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
