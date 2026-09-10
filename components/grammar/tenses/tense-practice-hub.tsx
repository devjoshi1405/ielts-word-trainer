"use client";

import * as React from "react";
import {
  Zap,
  Layers,
  Sparkles,
  RotateCcw,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TenseTopicData,
  GrammarQuestion,
  SentenceBuildingExercise,
  TenseConversionExercise,
  VerbItem,
} from "@/types/grammar.types";
import { SentenceBuilder } from "@/components/grammar/sentence-builder";
import { VerbDetailModal } from "@/components/grammar/verbs/verb-detail-modal";
import { VERBS_500_DATA } from "@/data/verbs-500";

export type PracticeTab = "drills" | "sentence_building" | "tense_conversion";

interface TensePracticeHubProps {
  topicData: TenseTopicData;
  onStartTest: () => void;
  onRecordAttempt?: (isCorrect: boolean) => void;
  initialTab?: PracticeTab;
}

export function TensePracticeHub({
  topicData,
  onStartTest,
  onRecordAttempt,
  initialTab = "drills",
}: TensePracticeHubProps) {
  const [activeTab, setActiveTab] = React.useState<PracticeTab>(initialTab);

  // Drill state
  const [drillIndex, setDrillIndex] = React.useState(0);
  const [drillAnswers, setDrillAnswers] = React.useState<
    Record<number, { selectedId: string; isCorrect: boolean }>
  >({});
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);

  // Sentence building state
  const [sbIndex, setSbIndex] = React.useState(0);

  // Tense conversion state
  const [tcIndex, setTcIndex] = React.useState(0);
  const [tcAnswers, setTcAnswers] = React.useState<Record<number, boolean>>({});

  // Verb inspection modal
  const [inspectedVerb, setInspectedVerb] = React.useState<VerbItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const questions = topicData.practiceQuestions;
  const sentenceExercises = topicData.sentenceBuildingExercises;
  const conversionExercises = topicData.tenseConversionExercises;

  const currentQuestion = questions[drillIndex] || questions[0];
  const currentAnswer = drillAnswers[drillIndex];
  const isAnswered = currentAnswer !== undefined;

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setDrillAnswers((prev) => ({
      ...prev,
      [drillIndex]: { selectedId: optionId, isCorrect },
    }));

    if (onRecordAttempt) {
      onRecordAttempt(isCorrect);
    }
  };

  const handleNextDrill = () => {
    if (drillIndex < questions.length - 1) {
      setDrillIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    }
  };

  const handlePrevDrill = () => {
    if (drillIndex > 0) {
      setDrillIndex((prev) => prev - 1);
      setSelectedOptionId(null);
    }
  };

  const handleResetDrills = () => {
    setDrillIndex(0);
    setSelectedOptionId(null);
    setDrillAnswers({});
  };

  const handleInspectVerb = (verbBase: string) => {
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

  const drillCorrectCount = Object.values(drillAnswers).filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in-50 duration-200">
      {/* Verb Modal */}
      <VerbDetailModal
        verb={inspectedVerb}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleLearned={() => {}}
        onPracticeVerb={() => {}}
      />

      {/* Practice Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("drills")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "drills"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1. Grammar Drills ({questions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sentence_building")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "sentence_building"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Sentence Building ({sentenceExercises.length})</span>
          </button>

          {conversionExercises.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("tense_conversion")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "tense_conversion"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>3. Tense Conversion ({conversionExercises.length})</span>
            </button>
          )}
        </div>

        <Button
          onClick={onStartTest}
          variant="brand"
          size="sm"
          className="gap-1.5 font-bold shadow-xs text-xs"
        >
          <span>Jump to Diagnostic Test</span>
          <Award className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 1. Grammar Drills Tab */}
      {activeTab === "drills" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <Badge variant="indigo" className="text-[10px] uppercase">
                {currentQuestion.type.replace(/_/g, " ")}
              </Badge>
              <span className="text-slate-900 dark:text-slate-100">
                Drill Question {drillIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-emerald-600 font-bold">
                ✓ {drillCorrectCount} Correct
              </span>
              <button
                type="button"
                onClick={handleResetDrills}
                className="hover:text-foreground text-xs inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <Card className="border-slate-200/80 dark:border-slate-800 shadow-card bg-card">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {currentQuestion.prompt}
                </h3>

                {currentQuestion.sentence && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                    &ldquo;{currentQuestion.sentence}&rdquo;
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option) => {
                  const isSelected = isAnswered && currentAnswer.selectedId === option.id;
                  const isCorrect = isAnswered && option.isCorrect;
                  const isWrongSelection = isAnswered && isSelected && !option.isCorrect;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option.id, option.isCorrect)}
                      className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                        isCorrect
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs"
                          : isWrongSelection
                          ? "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span>{option.text}</span>
                      {isAnswered && (
                        <div>
                          {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                          {isWrongSelection && (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Drawer */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in-50 duration-200 space-y-1 ${
                    currentAnswer.isCorrect
                      ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200"
                      : "bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {currentAnswer.isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                  </div>
                  <p>
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Drill Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={handlePrevDrill}
                  disabled={drillIndex === 0}
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </Button>

                {drillIndex < questions.length - 1 ? (
                  <Button
                    onClick={handleNextDrill}
                    disabled={!isAnswered}
                    variant="brand"
                    size="sm"
                    className="text-xs font-semibold gap-1"
                  >
                    <span>Next Drill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setActiveTab("sentence_building")}
                    variant="brand"
                    size="sm"
                    className="text-xs font-bold gap-1"
                  >
                    <span>Continue to Sentence Building</span>
                    <Layers className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2. Sentence Building Tab */}
      {activeTab === "sentence_building" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
            <span>
              Sentence Building {sbIndex + 1} of {sentenceExercises.length}
            </span>
            <div className="flex items-center gap-2">
              {sentenceExercises.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSbIndex(idx)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                    idx === sbIndex
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <SentenceBuilder
            key={`sb-${sbIndex}`}
            exercise={sentenceExercises[sbIndex]}
            isLast={sbIndex === sentenceExercises.length - 1}
            onInspectVerb={handleInspectVerb}
            onComplete={(isCorrect) => {
              if (onRecordAttempt) onRecordAttempt(isCorrect);
            }}
            onNext={() => {
              if (sbIndex < sentenceExercises.length - 1) {
                setSbIndex((prev) => prev + 1);
              } else if (conversionExercises.length > 0) {
                setActiveTab("tense_conversion");
              } else {
                onStartTest();
              }
            }}
          />
        </div>
      )}

      {/* 3. Tense Conversion Tab */}
      {activeTab === "tense_conversion" && conversionExercises.length > 0 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {(() => {
            const ex = conversionExercises[tcIndex];
            const isCompleted = tcAnswers[tcIndex] !== undefined;

            const sbExercise: SentenceBuildingExercise = {
              id: ex.id,
              tense: topicData.slug as any,
              prompt: `Convert from ${ex.sourceTense} to ${ex.targetTense}: "${ex.sourceSentence}"`,
              words: ex.words,
              correctSentence: ex.targetSentence,
              explanation: ex.explanation,
              difficulty: "intermediate",
              verbV1: ex.verbV1,
              verbV2: ex.verbV2,
            };

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
                  <span>
                    Tense Conversion Challenge {tcIndex + 1} of {conversionExercises.length}
                  </span>
                  <div className="flex items-center gap-2">
                    {conversionExercises.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTcIndex(idx)}
                        className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                          idx === tcIndex
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Original Statement ({ex.sourceTense})
                    </span>
                    <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      &ldquo;{ex.sourceSentence}&rdquo;
                    </div>
                  </div>
                  <Badge variant="indigo" className="text-[10px]">
                    Target: {ex.targetTense}
                  </Badge>
                </div>

                <SentenceBuilder
                  key={`tc-${tcIndex}`}
                  exercise={sbExercise}
                  isLast={tcIndex === conversionExercises.length - 1}
                  onInspectVerb={handleInspectVerb}
                  onComplete={(isCorrect) => {
                    setTcAnswers((prev) => ({ ...prev, [tcIndex]: isCorrect }));
                    if (onRecordAttempt) onRecordAttempt(isCorrect);
                  }}
                  onNext={() => {
                    if (tcIndex < conversionExercises.length - 1) {
                      setTcIndex((prev) => prev + 1);
                    } else {
                      onStartTest();
                    }
                  }}
                />
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
