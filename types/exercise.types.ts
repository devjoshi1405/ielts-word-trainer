import { CEFRLevel, VocabularyItem } from "./vocabulary.types";

export type ExerciseCategory =
  | "listen-and-type"
  | "vocabulary"
  | "numbers"
  | "dates-times"
  | "mistakes"
  | "academic"
  | "accommodation"
  | "transport"
  | "work"
  | "education"
  | "health"
  | "technology"
  | "environment"
  | "society"
  | "shopping"
  | "travel"
  | "services"
  | "everyday";

export type ExerciseType =
  | "WORD"
  | "ARTICLE_WORD"
  | "PREPOSITION_PHRASE"
  | "PHRASE"
  | "SENTENCE_TARGET"
  | "SPELLING"
  | "NUMBER"
  | "DATE"
  | "TIME";

export type ExerciseDifficulty = "easy" | "medium" | "hard";
export type Difficulty = "foundation" | "intermediate" | "advanced" | "band-7-9";
export type Accent = "british" | "american" | "australian";

export interface Exercise {
  id: string;
  type: ExerciseType;
  vocabularyId?: string;
  transcript: string;
  targetText: string;
  acceptedAnswers?: string[];
  difficulty: ExerciseDifficulty;
  category: string;
  explanation?: string;
  audioUrl?: string;
  phoneticIpa?: string;
  spellingTrapRule?: string;
}

export interface ExerciseQuestion {
  id: string;
  vocabularyId?: string;
  category: ExerciseCategory | string;
  targetText: string;
  transcript?: string;
  phoneticIpa?: string;
  partOfSpeech?: string;
  definition?: string;
  contextSentence?: string;
  audioUrl?: string;
  difficulty: Difficulty | ExerciseDifficulty;
  accent?: Accent;
  commonMisspellings?: string[];
  spellingTrapRule?: string;
  tags?: string[];
  type?: ExerciseType;
  acceptedAnswers?: string[];
}

export interface DiffSegment {
  char: string;
  type: "correct" | "missing" | "extra" | "mismatch";
}

export interface UserAttempt {
  attemptNumber: number;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  userAnswer: string;
  targetAnswer: string;
  similarity: number; // 0 to 1
  diffSegments: DiffSegment[];
  normalizedUserAnswer: string;
  normalizedTargetAnswer: string;
  spellingTip?: string;
  phoneticIpa?: string;
  attemptNumber?: number;
  maxAttempts?: number;
  isRevealed?: boolean;
  canRetry?: boolean;
}

export interface ExerciseSessionState {
  questions: ExerciseQuestion[];
  currentIndex: number;
  userAnswers: Record<string, string>;
  results: Record<string, AnswerValidationResult>;
  attemptsCount: Record<string, number>;
  attemptHistory: Record<string, UserAttempt[]>;
  isCompleted: boolean;
  score: {
    correct: number;
    incorrect: number;
    total: number;
    accuracyPercent: number;
  };
}
