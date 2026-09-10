"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Binary,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shuffle,
  Loader2,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionProgress } from "@/components/listening/question-progress";
import { AudioPlayer } from "@/components/listening/audio-player";
import { AnswerInput } from "@/components/listening/answer-input";
import { AnswerFeedback } from "@/components/listening/answer-feedback";
import { useListenExercise } from "@/hooks/use-listen-exercise";
import { exerciseService } from "@/lib/exercises/mock-exercise-service";
import { ExerciseQuestion } from "@/types/exercise.types";

export default function NumbersPracticePage() {
  const [initialQuestions, setInitialQuestions] = React.useState<ExerciseQuestion[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const q = await exerciseService.getQuestionsByCategory("numbers", 20, 0);
      setInitialQuestions(q);
      setLoading(false);
    }
    load();
  }, []);

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
    category: "numbers",
    sessionKey: "numbers-currency",
    maxAttempts: 2,
    autoPlayAudio: false,
  });

  if (loading || !currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-muted-foreground space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Loading Numbers practice set...</p>
      </div>
    );
  }

  const currentSetNum = batchIndex + 1;
  const nextSetNum = ((batchIndex + 1) % totalBatches) + 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href="/listening"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Modules</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] border border-indigo-100 dark:border-indigo-900">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>
              Set {currentSetNum} of {totalBatches} ({totalCategoryWords} Items)
            </span>
          </div>
          <Badge variant="indigo">Section 1 & 2 Speed Drills</Badge>
        </div>
      </div>

      {!isCompleted ? (
        <Card className="border-slate-200/90 shadow-card">
          <CardContent className="p-6 sm:p-10 space-y-8">
            <QuestionProgress
              current={currentIndex + 1}
              total={questions.length}
              categoryTitle="Numbers & Currency"
              difficulty="Foundation"
            />

            <AudioPlayer
              textToSpeak={currentQuestion?.phoneticIpa || currentQuestion?.targetText || "£450.50"}
              audioUrl={currentQuestion?.audioUrl}
            />

            <AnswerInput
              value={userInput}
              onChange={setUserInput}
              onSubmit={checkAnswer}
              disabled={isAnswered}
              placeholder="Type price, phone number or digits (e.g. £450.50 or 07894...)"
              autoFocus
            />

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
        <Card className="text-center p-8 sm:p-12 space-y-6 border-indigo-100 dark:border-indigo-950 shadow-elevated bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="success" className="px-3 py-1">
              Set {currentSetNum} Completed!
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Number Recognition Drilled
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Accuracy: <strong>{score.accuracyPercent}%</strong> ({score.correct}/{score.total} correct). Ready to drill the next set of numbers & codes?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {questions.length}
              </div>
              <div className="text-xs text-muted-foreground">Items Tested</div>
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

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              type="button"
              onClick={loadNextBatch}
              disabled={isLoadingBatch}
              variant="brand"
              size="lg"
              className="w-full sm:w-auto gap-2 shadow-lg shadow-indigo-200 dark:shadow-none bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold"
            >
              {isLoadingBatch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading New Items...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Practice Next 20 Numbers (Set {nextSetNum})</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={restartSession}
              className="w-full sm:w-auto gap-2 bg-white dark:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Review This Set</span>
            </Button>

            <Button
              type="button"
              onClick={loadRandomBatch}
              disabled={isLoadingBatch}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <Shuffle className="w-4 h-4 text-indigo-600" />
              <span>Random 20 Numbers</span>
            </Button>

            <Link href="/listening">
              <Button variant="ghost" size="lg">Next Module</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
