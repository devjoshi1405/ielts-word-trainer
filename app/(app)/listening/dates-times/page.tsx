"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
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

export default function DatesTimesPracticePage() {
  const [initialQuestions, setInitialQuestions] = React.useState<ExerciseQuestion[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const q = await exerciseService.getQuestionsByCategory("dates-times", 20);
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
  } = useListenExercise({
    initialQuestions,
    sessionKey: "dates-times",
    maxAttempts: 2,
    autoPlayAudio: false,
  });

  if (loading || !currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-muted-foreground space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Loading Dates & Times practice set...</p>
      </div>
    );
  }

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
        <Badge variant="indigo">Schedules & Calendar Notation</Badge>
      </div>

      {!isCompleted ? (
        <Card className="border-slate-200/90 shadow-card">
          <CardContent className="p-6 sm:p-10 space-y-8">
            <QuestionProgress
              current={currentIndex + 1}
              total={questions.length}
              categoryTitle="Dates & Times"
              difficulty="Foundation"
            />

            <AudioPlayer
              textToSpeak={currentQuestion?.phoneticIpa || currentQuestion?.targetText || "14th October"}
              audioUrl={currentQuestion?.audioUrl}
              accent={currentQuestion?.accent || "british"}
            />

            <AnswerInput
              value={userInput}
              onChange={setUserInput}
              onSubmit={checkAnswer}
              disabled={isAnswered}
              placeholder="Type date or time (e.g. 14th October or 9:45 am)..."
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
        <Card className="text-center p-8 sm:p-12 space-y-6 border-indigo-100 dark:border-indigo-950 shadow-elevated">
          <Badge variant="success">Dates & Times Completed</Badge>
          <h2 className="text-2xl font-bold">Schedule Formats Mastered</h2>
          <p className="text-sm text-muted-foreground">
            Accuracy: <strong>{score.accuracyPercent}%</strong> ({score.correct}/{score.total} correct)
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={restartSession}>
              Practice Again
            </Button>
            <Link href="/listening">
              <Button variant="brand">Next Module</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
