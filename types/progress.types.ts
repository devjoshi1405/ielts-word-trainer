import { ExerciseCategory, Difficulty } from "./exercise.types";

/**
 * 9 Deterministic Mistake Classifications (Phase 6)
 */
export type MistakeType =
  | "spelling"
  | "missing-word"
  | "extra-word"
  | "wrong-word"
  | "article"
  | "preposition"
  | "singular-plural"
  | "number"
  | "date-time";

/**
 * Mastery Levels:
 * 0 = New (0 attempts)
 * 1 = Learning (failed recently / 0 consecutive correct)
 * 2 = Practicing (1 consecutive correct)
 * 3 = Familiar (2 consecutive correct)
 * 4 = Mastered (3+ consecutive correct)
 */
export type NumericMasteryLevel = 0 | 1 | 2 | 3 | 4;

export type StringMasteryLevel =
  | "new"
  | "learning"
  | "practicing"
  | "familiar"
  | "mastered"
  | "critical"
  | "improving"
  | "almost-mastered";

export interface DashboardStats {
  listeningAccuracy: number; // percentage e.g. 91
  questionsCompleted: number; // count e.g. 1420
  wordsMastered: number; // count e.g. 385
  currentStreak: number; // days e.g. 12
  correctAnswers?: number;
  incorrectAnswers?: number;
  difficultWords?: number;
  weeklyActivity: { day: string; count: number; accuracy: number; date?: string }[];
  categoryAccuracy: {
    category: ExerciseCategory;
    name: string;
    accuracy: number;
    completed: number;
    total: number;
  }[];
}

export interface MistakeItem {
  id: string;
  word: string;
  phoneticIpa: string;
  definition: string;
  errorCount: number;
  totalAttempts?: number;
  correctAttempts?: number;
  incorrectAttempts?: number;
  consecutiveCorrect?: number;
  accuracy?: number; // percentage (e.g. 50)
  lastPracticed: string; // display string e.g. "Today, 2:30 PM" or "Sep 10"
  lastPracticedIso?: string;
  nextReview?: string; // display string e.g. "Due now", "In 1 day", "In 3 days"
  nextReviewIso?: string; // ISO 8601 timestamp
  isDue?: boolean;
  commonTrap?: string;
  userLastAttempt: string;
  mistakeType?: MistakeType | string;
  mistakeTypeLabel?: string;
  mistakeExplanation?: string;
  remediationTip?: string;
  masteryLevel: StringMasteryLevel;
  masteryNumeric?: NumericMasteryLevel;
  category: ExerciseCategory;
}

export interface PracticeModuleSummary {
  id: ExerciseCategory;
  title: string;
  subtitle: string;
  description: string;
  itemCount: number;
  completedCount: number;
  accuracy: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
  href: string;
  iconName: string;
  badge?: string;
}

export interface AttemptSubmission {
  userId?: string;
  questionId: string;
  vocabularyId?: string;
  word?: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  mistakeType?: MistakeType | string;
  attemptNumber?: number;
  category?: ExerciseCategory | string;
}
