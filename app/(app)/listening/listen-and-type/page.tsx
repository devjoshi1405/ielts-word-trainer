"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Trophy,
  ArrowLeft,
  Volume2,
  Shuffle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { QuestionProgress } from "@/components/listening/question-progress";
import { AudioPlayer } from "@/components/listening/audio-player";
import { AnswerInput } from "@/components/listening/answer-input";
import { AnswerFeedback } from "@/components/listening/answer-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListenExercise } from "@/hooks/use-listen-exercise";
import { exerciseService } from "@/lib/exercises/mock-exercise-service";
import { progressManager } from "@/lib/progress";
import { ExerciseQuestion } from "@/types/exercise.types";

const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic & University",
  accommodation: "Accommodation & Housing",
  environment: "Environment & Ecology",
  transport: "Transport & Travel",
  work: "Work & Employment",
  health: "Health & Medicine",
  technology: "Technology & Science",
  society: "Society & Culture",
  shopping: "Shopping & Commerce",
  services: "Services & Facilities",
  articles: "Articles & Prepositions",
  numbers: "Numbers & Dates",
  "dates-times": "Dates & Times",
  "listen-and-type": "Listen & Type Core",
  vocabulary: "Academic Vocabulary",
};

function ListenAndTypeExerciseContent() {
  const searchParams = useSearchParams();
  const focusWord = searchParams.get("focus");
  const categoryParam = searchParams.get("category");
  const typeParam = searchParams.get("type");
  const modeParam = searchParams.get("mode"); // "mistakes"

  const [initialQuestions, setInitialQuestions] = React.useState<ExerciseQuestion[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadQuestions() {
      setLoading(true);

      // Mode 1: Practicing Mistakes specifically
      if (modeParam === "mistakes") {
        const mistakes = await progressManager.getMistakes();
        if (mistakes.length > 0) {
          const mistakeQuestions: ExerciseQuestion[] = mistakes.map((m) => ({
            id: `mistake-${m.id}`,
            vocabularyId: m.id,
            category: m.category || "mistakes",
            targetText: m.word,
            phoneticIpa: m.phoneticIpa,
            partOfSpeech: "vocabulary",
            definition: m.definition,
            difficulty: (m.masteryNumeric ?? 1) <= 1 ? "band-7-9" : "intermediate",
            accent: "british",
            commonMisspellings: [m.userLastAttempt],
            spellingTrapRule: m.commonTrap || m.mistakeExplanation,
            tags: ["Mistake Review", m.mistakeType || "Spelling"],
          }));
          setInitialQuestions(mistakeQuestions);
          setLoading(false);
          return;
        }
      }

      // Mode 2: Standard Category Questions from 1,000+ vocabulary pool
      const questions = await exerciseService.getQuestionsByCategory(
        categoryParam || "listen-and-type",
        20,
        0
      );

      // If focus word specified (e.g. from mistake card Practice button)
      if (focusWord) {
        const decoded = decodeURIComponent(focusWord).trim().toLowerCase();
        const matched = questions.find(
          (q) => q.targetText.toLowerCase() === decoded
        );

        if (matched) {
          setInitialQuestions([
            matched,
            ...questions.filter((q) => q.id !== matched.id),
          ]);
        } else {
          // Construct question dynamically for the focused word
          const customFocusQ: ExerciseQuestion = {
            id: `focus-${decoded}`,
            category: "listen-and-type",
            targetText: decoded,
            phoneticIpa: "/wɜːd/",
            definition: "Target IELTS practice item",
            difficulty: "intermediate",
            accent: "british",
            spellingTrapRule: "Practice spelling and pronunciation carefully.",
            tags: ["Target Word Review"],
          };
          setInitialQuestions([customFocusQ, ...questions]);
        }
        setLoading(false);
        return;
      }

      setInitialQuestions(questions);
      setLoading(false);
    }

    loadQuestions();
  }, [categoryParam, typeParam, focusWord, modeParam]);

  const {
    questions,
    currentIndex,
    currentQuestion,
    currentResult,
    userInput,
    setUserInput,
    isAnswered,
    isCompleted,
    score,
    checkAnswer,
    nextQuestion,
    retryCurrentQuestion,
    restartSession,
    playAudio,
    playSlowAudio,
    hasNextQuestion,
    batchIndex,
    totalBatches,
    totalCategoryWords,
    isLoadingBatch,
    loadNextBatch,
    loadRandomBatch,
  } = useListenExercise({
    initialQuestions,
    category: categoryParam || "listen-and-type",
    sessionKey: modeParam === "mistakes"
      ? "mistakes-review-queue"
      : focusWord
      ? `focus-${encodeURIComponent(focusWord)}`
      : categoryParam
      ? `cat-${categoryParam}`
      : "listen-and-type-core",
    maxAttempts: 2,
    autoPlayAudio: false,
  });

  if (loading || !currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-muted-foreground space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Loading IELTS Listen & Type exercise...</p>
      </div>
    );
  }

  const isMistakesMode = modeParam === "mistakes";
  const currentSetNum = batchIndex + 1;
  const nextSetNum = ((batchIndex + 1) % totalBatches) + 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href={isMistakesMode ? "/listening/mistakes" : "/listening"}
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isMistakesMode ? "Back to My Mistakes" : "Back to Modules"}</span>
        </Link>
        <div className="flex items-center gap-3">
          {!isMistakesMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] border border-indigo-100 dark:border-indigo-900">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>
                Set {currentSetNum} of {totalBatches} ({totalCategoryWords} Words)
              </span>
            </div>
          )}
          {isMistakesMode && (
            <Badge variant="warning" className="text-[10px]">
              SRS Mistakes Queue
            </Badge>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[11px]">
            <span>Accuracy:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {score.answered > 0 ? `${score.accuracyPercent}%` : "100%"}
            </span>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <Card className="border-slate-200/90 dark:border-slate-800 shadow-card">
          <CardContent className="p-6 sm:p-10 space-y-8">
            {/* Header: IELTS LISTENING, Question X of 20, Progress bar + Quick New Batch button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <QuestionProgress
                  current={currentIndex + 1}
                  total={questions.length}
                  categoryTitle={
                    isMistakesMode
                      ? "MISTAKE REVIEW QUEUE"
                      : categoryParam && CATEGORY_LABELS[categoryParam.toLowerCase()]
                      ? CATEGORY_LABELS[categoryParam.toLowerCase()].toUpperCase()
                      : currentQuestion.category
                      ? `${currentQuestion.category.toUpperCase()}`
                      : "Listen & Type"
                  }
                  difficulty={currentQuestion.difficulty || "Intermediate"}
                />
              </div>
            </div>

            {/* Audio Player Component */}
            <AudioPlayer
              textToSpeak={currentQuestion.targetText || "accommodation"}
              audioUrl={currentQuestion.audioUrl}
            />

            {/* Answer Input Component */}
            <AnswerInput
              value={userInput}
              onChange={setUserInput}
              onSubmit={checkAnswer}
              disabled={isAnswered}
              placeholder="Type exactly what you hear..."
              autoFocus
            />

            {/* Answer Feedback Component (displays Correct, Retry/First Mistake, or Final Revealed UI) */}
            {isAnswered && (
              <AnswerFeedback
                result={currentResult}
                question={currentQuestion}
                onNext={nextQuestion}
                onRetry={retryCurrentQuestion}
                onPlayAgain={() => playAudio(1.0)}
                onSlowAudio={playSlowAudio}
                hasNextQuestion={hasNextQuestion}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        /* Session Completed Results Card with Next 20 New Words */
        <Card className="border-indigo-100 dark:border-indigo-950 shadow-elevated bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-center p-8 sm:p-12 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="indigo" className="px-3 py-1">
              {isMistakesMode
                ? "Mistake Review Complete!"
                : `Set ${currentSetNum} of ${totalBatches} Completed!`}
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Great Practice Session
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You&apos;ve completed this set of {questions.length} words! Ready to learn the next batch of new IELTS vocabulary?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {questions.length}
              </div>
              <div className="text-xs text-muted-foreground">Words Tested</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {score.correct}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {score.accuracyPercent}%
              </div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Action Buttons: Practice Next 20 New Words (Primary), Review Set, Random Set, Dashboard */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-4">
            {!isMistakesMode && (
              <Button
                type="button"
                onClick={loadNextBatch}
                disabled={isLoadingBatch}
                variant="brand"
                size="lg"
                className="w-full sm:w-auto gap-2 shadow-lg shadow-indigo-200 dark:shadow-none bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold"
                id="next-words-btn"
              >
                {isLoadingBatch ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading New Words...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Practice Next 20 New Words (Set {nextSetNum})</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </Button>
            )}

            <Button
              type="button"
              onClick={restartSession}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 bg-white dark:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Review This Set Again</span>
            </Button>

            {!isMistakesMode && (
              <Button
                type="button"
                onClick={loadRandomBatch}
                disabled={isLoadingBatch}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto gap-2"
                title="Practice 20 randomized words from the 1,000+ library"
              >
                <Shuffle className="w-4 h-4 text-indigo-600" />
                <span>Random 20 Words</span>
              </Button>
            )}

            <Link href={isMistakesMode ? "/listening/mistakes" : "/dashboard"} className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto gap-2 text-slate-600 dark:text-slate-400"
              >
                <span>{isMistakesMode ? "View Mistakes Bank" : "Dashboard"}</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ListenAndTypeExercisePage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-3xl mx-auto p-12 text-center text-muted-foreground">
          Loading exercise...
        </div>
      }
    >
      <ListenAndTypeExerciseContent />
    </React.Suspense>
  );
}
