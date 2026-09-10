"use client";

import * as React from "react";
import {
  ExerciseQuestion,
  AnswerValidationResult,
  UserAttempt,
} from "@/types/exercise.types";
import { validateAnswer } from "@/lib/validation/answer-validator";
import { audioService } from "@/lib/audio";
import { progressManager } from "@/lib/progress";
import { classifyMistake } from "@/lib/mistakes/mistake-classifier";

export interface UseListenExerciseOptions {
  initialQuestions: ExerciseQuestion[];
  sessionKey?: string;
  maxAttempts?: number; // default 2
  onComplete?: (score: { correct: number; total: number; accuracy: number }) => void;
  autoPlayAudio?: boolean;
}

export function useListenExercise({
  initialQuestions,
  sessionKey,
  maxAttempts = 2,
  onComplete,
  autoPlayAudio = false,
}: UseListenExerciseOptions) {
  const [questions, setQuestions] = React.useState<ExerciseQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [userInput, setUserInput] = React.useState("");
  const [results, setResults] = React.useState<Record<number, AnswerValidationResult>>({});
  const [attemptsCount, setAttemptsCount] = React.useState<Record<number, number>>({});
  const [attemptHistory, setAttemptHistory] = React.useState<Record<number, UserAttempt[]>>({});
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = React.useState(false);

  const storageKey = sessionKey ? `ielts_exercise_session_${sessionKey}` : null;

  // Restore saved session from storage once initial questions are loaded
  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined" || initialQuestions.length === 0) {
      setQuestions(initialQuestions);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentIndex === "number") {
          const restoredIndex = Math.min(parsed.currentIndex, initialQuestions.length - 1);
          setCurrentIndex(restoredIndex >= 0 ? restoredIndex : 0);
          setResults(parsed.results || {});
          setAttemptsCount(parsed.attemptsCount || {});
          setAttemptHistory(parsed.attemptHistory || {});
          setIsCompleted(Boolean(parsed.isCompleted && parsed.currentIndex >= initialQuestions.length - 1));
        }
      }
    } catch (e) {
      console.warn("Failed to restore exercise session:", e);
    } finally {
      setQuestions(initialQuestions);
      setIsSessionLoaded(true);
    }
  }, [storageKey, initialQuestions]);

  // Persist session changes to localStorage
  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined" || !isSessionLoaded) return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          currentIndex,
          results,
          attemptsCount,
          attemptHistory,
          isCompleted,
          updatedAt: Date.now(),
        })
      );
    } catch (e) {
      console.warn("Failed to persist exercise session:", e);
    }
  }, [storageKey, isSessionLoaded, currentIndex, results, attemptsCount, attemptHistory, isCompleted]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentResult = results[currentIndex] || null;
  const currentAttempts = attemptsCount[currentIndex] || 0;
  const isAnswered = currentResult !== null;

  // Auto-play audio when moving to a new question if enabled
  React.useEffect(() => {
    if (autoPlayAudio && currentQuestion && !isAnswered && !isCompleted) {
      const timer = setTimeout(() => {
        if (currentQuestion.audioUrl) {
          audioService.playAudioUrl(currentQuestion.audioUrl, {
            accent: currentQuestion.accent || "british",
            rate: 1.0,
          });
        } else {
          const speakText =
            (currentQuestion.category === "numbers" || currentQuestion.category === "dates-times") &&
            currentQuestion.phoneticIpa &&
            !currentQuestion.phoneticIpa.startsWith("/")
              ? currentQuestion.phoneticIpa
              : currentQuestion.targetText;
          audioService.playText(speakText, {
            accent: currentQuestion.accent || "british",
            rate: 1.0,
          });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isCompleted, autoPlayAudio, currentQuestion, isAnswered]);

  const playAudio = React.useCallback(
    (rate = 1.0) => {
      if (!currentQuestion) return;
      if (currentQuestion.audioUrl) {
        audioService.playAudioUrl(currentQuestion.audioUrl, {
          rate,
          accent: currentQuestion.accent || "british",
        });
      } else {
        const speakText =
          (currentQuestion.category === "numbers" || currentQuestion.category === "dates-times") &&
          currentQuestion.phoneticIpa &&
          !currentQuestion.phoneticIpa.startsWith("/")
            ? currentQuestion.phoneticIpa
            : currentQuestion.targetText;
        audioService.playText(speakText, {
          rate,
          accent: currentQuestion.accent || "british",
        });
      }
    },
    [currentQuestion]
  );

  const playSlowAudio = React.useCallback(() => {
    playAudio(0.75);
  }, [playAudio]);

  const checkAnswer = React.useCallback(() => {
    if (!userInput.trim() || !currentQuestion) return null;

    const nextAttempt = currentAttempts + 1;

    const validation = validateAnswer(userInput, currentQuestion.targetText, {
      category: currentQuestion.category,
      type: currentQuestion.type,
      acceptedAnswers: currentQuestion.acceptedAnswers,
      spellingTip: currentQuestion.spellingTrapRule,
      phoneticIpa: currentQuestion.phoneticIpa,
      attemptNumber: nextAttempt,
      maxAttempts,
    });

    setAttemptsCount((prev) => ({
      ...prev,
      [currentIndex]: nextAttempt,
    }));

    setAttemptHistory((prev) => ({
      ...prev,
      [currentIndex]: [
        ...(prev[currentIndex] || []),
        {
          attemptNumber: nextAttempt,
          userAnswer: userInput,
          isCorrect: validation.isCorrect,
          timestamp: Date.now(),
        },
      ],
    }));

    setResults((prev) => ({
      ...prev,
      [currentIndex]: validation,
    }));

    // Asynchronously record attempt into persistent storage
    const classification = !validation.isCorrect
      ? classifyMistake(userInput.trim(), currentQuestion.targetText, typeof currentQuestion.category === "string" ? currentQuestion.category : undefined)
      : undefined;

    progressManager
      .recordAttempt({
        questionId: currentQuestion.id,
        vocabularyId: currentQuestion.vocabularyId,
        userAnswer: userInput.trim(),
        correctAnswer: currentQuestion.targetText,
        isCorrect: validation.isCorrect,
        mistakeType: classification?.type,
        attemptNumber: nextAttempt,
        category: currentQuestion.category,
      })
      .catch((err) => console.warn("Failed to persist attempt:", err));

    return validation;
  }, [userInput, currentQuestion, currentAttempts, currentIndex, maxAttempts]);

  const nextQuestion = React.useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput("");
    } else {
      setIsCompleted(true);
      const total = questions.length;
      const correct = Object.values(results).filter((r) => r.isCorrect).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      onComplete?.({ correct, total, accuracy });
    }
  }, [currentIndex, questions.length, results, onComplete]);

  const retryCurrentQuestion = React.useCallback(() => {
    setUserInput("");
    // Remove the current result so the input re-enables for attempt #2
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
  }, [currentIndex]);

  const restartSession = React.useCallback(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        // ignore
      }
    }
    setCurrentIndex(0);
    setUserInput("");
    setResults({});
    setAttemptsCount({});
    setAttemptHistory({});
    setIsCompleted(false);
  }, [storageKey]);

  const score = React.useMemo(() => {
    const list = Object.values(results);
    const correct = list.filter((r) => r.isCorrect).length;
    const answered = list.length;
    const total = questions.length;
    return {
      correct,
      incorrect: answered - correct,
      answered,
      total,
      accuracyPercent: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    };
  }, [results, questions.length]);

  return {
    questions,
    currentIndex,
    currentQuestion,
    currentResult,
    currentAttempts,
    maxAttempts,
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
    totalQuestions: questions.length,
    hasNextQuestion: currentIndex < questions.length - 1,
  };
}

