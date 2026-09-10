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
import { useVoicePreference } from "@/hooks/use-voice-preference";
import { exerciseService } from "@/lib/exercises/mock-exercise-service";

export interface UseListenExerciseOptions {
  initialQuestions: ExerciseQuestion[];
  category?: string;
  initialBatchIndex?: number;
  sessionKey?: string;
  maxAttempts?: number; // default 2
  onComplete?: (score: { correct: number; total: number; accuracy: number }) => void;
  autoPlayAudio?: boolean;
}

export function useListenExercise({
  initialQuestions,
  category = "listen-and-type",
  initialBatchIndex = 0,
  sessionKey,
  maxAttempts = 2,
  onComplete,
  autoPlayAudio = false,
}: UseListenExerciseOptions) {
  const { accent: userAccent } = useVoicePreference();
  const [questions, setQuestions] = React.useState<ExerciseQuestion[]>(initialQuestions);
  const [batchIndex, setBatchIndex] = React.useState<number>(initialBatchIndex);
  const [totalBatches, setTotalBatches] = React.useState<number>(50);
  const [totalCategoryWords, setTotalCategoryWords] = React.useState<number>(1000);
  const [isLoadingBatch, setIsLoadingBatch] = React.useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [userInput, setUserInput] = React.useState("");
  const [results, setResults] = React.useState<Record<number, AnswerValidationResult>>({});
  const [attemptsCount, setAttemptsCount] = React.useState<Record<number, number>>({});
  const [attemptHistory, setAttemptHistory] = React.useState<Record<number, UserAttempt[]>>({});
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = React.useState(false);

  const storageKey = sessionKey ? `ielts_exercise_session_${sessionKey}` : null;

  // Initialize total batch count
  React.useEffect(() => {
    if (category) {
      const count = exerciseService.getTotalCount(category);
      setTotalCategoryWords(count);
      setTotalBatches(Math.max(1, Math.ceil(count / 20)));
    }
  }, [category]);

  // Restore saved session from storage once initial questions are loaded
  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined") {
      setQuestions(initialQuestions);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentIndex === "number") {
          const restoredIndex = Math.min(
            parsed.currentIndex,
            (parsed.savedQuestions?.length || initialQuestions.length) - 1
          );
          if (parsed.savedQuestions && Array.isArray(parsed.savedQuestions) && parsed.savedQuestions.length > 0) {
            setQuestions(parsed.savedQuestions);
          } else {
            setQuestions(initialQuestions);
          }
          if (typeof parsed.batchIndex === "number") {
            setBatchIndex(parsed.batchIndex);
          }
          setCurrentIndex(restoredIndex >= 0 ? restoredIndex : 0);
          setResults(parsed.results || {});
          setAttemptsCount(parsed.attemptsCount || {});
          setAttemptHistory(parsed.attemptHistory || {});
          setIsCompleted(Boolean(parsed.isCompleted && restoredIndex >= (parsed.savedQuestions?.length || initialQuestions.length) - 1));
          setIsSessionLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to restore exercise session:", e);
    }

    setQuestions(initialQuestions);
    setIsSessionLoaded(true);
  }, [storageKey, initialQuestions]);

  // Persist session changes to localStorage
  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined" || !isSessionLoaded) return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          batchIndex,
          currentIndex,
          savedQuestions: questions,
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
  }, [storageKey, isSessionLoaded, batchIndex, currentIndex, questions, results, attemptsCount, attemptHistory, isCompleted]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentResult = results[currentIndex] || null;
  const currentAttempts = attemptsCount[currentIndex] || 0;
  const isAnswered = currentResult !== null;

  // Auto-play audio when moving to a new question if enabled
  React.useEffect(() => {
    if (autoPlayAudio && currentQuestion && !isAnswered && !isCompleted) {
      const timer = setTimeout(() => {
        const speakText =
          (currentQuestion.category === "numbers" || currentQuestion.category === "dates-times") &&
          currentQuestion.phoneticIpa &&
          !currentQuestion.phoneticIpa.startsWith("/")
            ? currentQuestion.phoneticIpa
            : currentQuestion.targetText;

        audioService.play(
          {
            url: currentQuestion.audioUrl,
            text: speakText,
            accent: userAccent || currentQuestion.accent || "british",
          },
          {
            accent: userAccent || currentQuestion.accent || "british",
            rate: 1.0,
          }
        );
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isCompleted, autoPlayAudio, currentQuestion, isAnswered, userAccent]);

  const playAudio = React.useCallback(
    (rate = 1.0) => {
      if (!currentQuestion) return;
      const speakText =
        (currentQuestion.category === "numbers" || currentQuestion.category === "dates-times") &&
        currentQuestion.phoneticIpa &&
        !currentQuestion.phoneticIpa.startsWith("/")
          ? currentQuestion.phoneticIpa
          : currentQuestion.targetText;

      audioService.play(
        {
          url: currentQuestion.audioUrl,
          text: speakText,
          accent: userAccent || currentQuestion.accent || "british",
        },
        {
          rate,
          accent: userAccent || currentQuestion.accent || "british",
        }
      );
    },
    [currentQuestion, userAccent]
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

  /**
   * Loads the next sequential 20-word batch from the 1,000+ vocabulary pool
   */
  const loadNextBatch = React.useCallback(async () => {
    setIsLoadingBatch(true);
    try {
      const nextBatch = batchIndex + 1;
      const batchData = await exerciseService.getBatchInfo(category || "listen-and-type", nextBatch, 20);

      setQuestions(batchData.questions);
      setBatchIndex(batchData.batchIndex);
      setTotalBatches(batchData.totalBatches);
      setCurrentIndex(0);
      setUserInput("");
      setResults({});
      setAttemptsCount({});
      setAttemptHistory({});
      setIsCompleted(false);

      if (storageKey && typeof window !== "undefined") {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            batchIndex: batchData.batchIndex,
            currentIndex: 0,
            savedQuestions: batchData.questions,
            results: {},
            attemptsCount: {},
            attemptHistory: {},
            isCompleted: false,
            updatedAt: Date.now(),
          })
        );
      }
    } finally {
      setIsLoadingBatch(false);
    }
  }, [batchIndex, category, storageKey]);

  /**
   * Loads a random 20-word batch from the library
   */
  const loadRandomBatch = React.useCallback(async () => {
    setIsLoadingBatch(true);
    try {
      const randomQuestions = await exerciseService.getQuestionsByCategory(
        category || "listen-and-type",
        20,
        0,
        true
      );

      const randomBatchIndex = Math.floor(Math.random() * totalBatches);
      setQuestions(randomQuestions);
      setBatchIndex(randomBatchIndex);
      setCurrentIndex(0);
      setUserInput("");
      setResults({});
      setAttemptsCount({});
      setAttemptHistory({});
      setIsCompleted(false);

      if (storageKey && typeof window !== "undefined") {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            batchIndex: randomBatchIndex,
            currentIndex: 0,
            savedQuestions: randomQuestions,
            results: {},
            attemptsCount: {},
            attemptHistory: {},
            isCompleted: false,
            updatedAt: Date.now(),
          })
        );
      }
    } finally {
      setIsLoadingBatch(false);
    }
  }, [category, totalBatches, storageKey]);

  /**
   * Loads a specific batch by index
   */
  const loadBatch = React.useCallback(async (targetBatchIndex: number) => {
    setIsLoadingBatch(true);
    try {
      const batchData = await exerciseService.getBatchInfo(category || "listen-and-type", targetBatchIndex, 20);

      setQuestions(batchData.questions);
      setBatchIndex(batchData.batchIndex);
      setCurrentIndex(0);
      setUserInput("");
      setResults({});
      setAttemptsCount({});
      setAttemptHistory({});
      setIsCompleted(false);

      if (storageKey && typeof window !== "undefined") {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            batchIndex: batchData.batchIndex,
            currentIndex: 0,
            savedQuestions: batchData.questions,
            results: {},
            attemptsCount: {},
            attemptHistory: {},
            isCompleted: false,
            updatedAt: Date.now(),
          })
        );
      }
    } finally {
      setIsLoadingBatch(false);
    }
  }, [category, storageKey]);

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
    // Batch controls & info
    batchIndex,
    totalBatches,
    totalCategoryWords,
    isLoadingBatch,
    loadNextBatch,
    loadRandomBatch,
    loadBatch,
  };
}
