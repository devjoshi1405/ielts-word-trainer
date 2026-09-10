/**
 * Strongly-typed domain definitions for Grammar Master.
 * Covers categories, topics, lessons, rich content models, verbs,
 * user progress, and resume session state.
 */

export type GrammarDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "easy"
  | "medium"
  | "hard";
export type VerbType = "regular" | "irregular";
export type GrammarProgressStatus = "not_started" | "learning" | "practicing" | "mastered";

/**
 * Educational Lesson Content Structure
 * Decoupled from UI components for long-term scalability.
 */
export interface GrammarRule {
  id: string;
  title: string;
  rule: string;
  explanation?: string;
  example?: string;
}

export interface GrammarFormula {
  pattern: string;
  description: string;
  example: string;
}

export interface GrammarExample {
  sentence: string;
  explanation: string;
  highlight?: string;
}

export interface GrammarMistake {
  incorrect: string;
  correct: string;
  explanation: string;
  ruleId?: string;
}

export type GrammarQuestionType =
  | "multiple_choice"
  | "identify_part_of_speech"
  | "fill_blank"
  | "error_identification"
  | "sentence_arrangement"
  | "tense_conversion"
  | "do_does"
  | "did"
  | "v1_v2"
  | "negative_sentence"
  | "sentence_building";

export interface GrammarQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface GrammarQuestion {
  id: string;
  categorySlug?: string;
  topicSlug?: string;
  type: GrammarQuestionType;
  prompt: string;
  sentence?: string;
  options: GrammarQuestionOption[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  difficulty?: GrammarDifficulty;
  points?: number;
  displayOrder?: number;
  weakAreaTag?: string;
  weakAreaLabel?: string;
  // Sentence building and conversion fields
  words?: string[];
  targetSentence?: string;
  baseSentence?: string;
  targetTense?: string;
  acceptableAnswers?: string[];
}

export interface SentenceBuildingExercise {
  id: string;
  tense: "simple-present" | "simple-past";
  prompt: string;
  words: string[];
  correctSentence: string;
  alternativeAnswers?: string[];
  explanation: string;
  weakAreaTag?: string;
  difficulty: GrammarDifficulty;
  verbId?: string;
  verbV1?: string;
  verbV2?: string;
}

export interface TenseConversionExercise {
  id: string;
  sourceTense: string;
  targetTense: string;
  sourceSentence: string;
  targetSentence: string;
  words: string[];
  verbV1: string;
  verbV2: string;
  explanation: string;
  hint?: string;
}

export interface GrammarLessonContent {
  overview?: string;
  explanation: string;
  rules?: GrammarRule[];
  formulas?: GrammarFormula[];
  examples?: GrammarExample[];
  commonMistakes?: GrammarMistake[];
  tips?: string[];
  ieltsApplication?: string;
  practiceQuestions?: GrammarQuestion[];
  testQuestions?: GrammarQuestion[];
}

/**
 * Core Data Models
 */
export interface GrammarCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  topicCount?: number;
  iconName?: string;
  accentColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrammarTopic {
  id: string;
  categoryId: string;
  categorySlug?: string;
  name: string;
  slug: string;
  description: string | null;
  difficulty: GrammarDifficulty;
  displayOrder: number;
  isActive: boolean;
  lessonCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrammarLesson {
  id: string;
  categoryId: string;
  topicId: string | null;
  title: string;
  slug: string;
  description: string | null;
  content: GrammarLessonContent;
  difficulty: GrammarDifficulty;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerbItem {
  id: string;
  baseForm: string;          // V1
  pastForm: string;          // V2
  pastParticiple: string;    // V3
  meaning: string;
  pronunciation?: string | null;
  exampleSentence?: string | null;          // Present/Base example
  pastExample?: string | null;              // Past (V2) example
  pastParticipleExample?: string | null;    // Past Participle (V3) example
  exampleMeaning?: string | null;
  verbType: VerbType;
  difficulty: GrammarDifficulty;
  isCommon: boolean;
  isIeltsRelevant: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type VerbProgressStatus = "not_started" | "learning" | "learned" | "mastered";

export interface UserVerbProgress {
  id: string;
  userId: string;
  verbId: string;
  status: VerbProgressStatus;
  confidence: number;
  attempts: number;
  correctAnswers: number;
  totalAnswers: number;
  isWeak: boolean;
  lastPracticedAt?: string | null;
  nextReviewAt?: string | null;
  learnedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerbProgressStats {
  totalVerbs: number;
  learnedCount: number;
  masteredCount: number;
  weakCount: number;
  notStartedCount: number;
  progressPercent: number;
}

export type VerbQuestionType =
  | "v1_to_v2"
  | "v2_to_v1"
  | "to_v3"
  | "complete_table"
  | "meaning_to_verb"
  | "sentence_context";

export interface VerbTestQuestion {
  id: string;
  verbId: string;
  type: VerbQuestionType;
  prompt: string;
  sentence?: string;
  tableData?: {
    v1: string;
    v2: string;
    v3: string;
    missingField: "v1" | "v2" | "v3";
  };
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer: string;
  explanation: string;
  targetVerb: VerbItem;
}

export interface VerbTestResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  isMastered: boolean;
  weakVerbs: VerbItem[];
  incorrectQuestions: Array<{
    question: VerbTestQuestion;
    userAnswer: string;
  }>;
}

export type VerbFilterCategory =
  | "all"
  | "common"
  | "irregular"
  | "regular"
  | "ielts"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "weak"
  | "learned";

export interface UserGrammarProgress {
  id: string;
  userId: string;
  categoryId?: string | null;
  topicId?: string | null;
  lessonId?: string | null;
  status: GrammarProgressStatus;
  progressPercent: number;
  masteryScore: number;
  attempts: number;
  correctAnswers: number;
  totalAnswers: number;
  bestScore?: number;
  latestScore?: number;
  averageScore?: number;
  weakAreas?: string[];
  strengths?: string[];
  lastSection?: string;
  lastStage?: string;
  lastAttemptAt?: string | null;
  nextReviewAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Learning Session & Resume State
 * Enables the app to know what the user studied, what remains, and what to resume.
 */
export interface ResumeLearningSession {
  hasActiveSession: boolean;
  topicId?: string;
  topicTitle?: string;
  categorySlug?: string;
  categoryName?: string;
  lessonId?: string;
  lessonTitle?: string;
  currentStage: "learning" | "practicing" | "testing" | "ready_to_review" | "none";
  progressPercent: number;
  masteryScore: number;
  lastStudiedAt?: string;
  lastSection?: string;
  isReviewDue: boolean;
  recommendedNextStep: string;
  targetHref: string;
}

/**
 * Category Progress Summary for Dashboard Overview
 */
export interface CategoryProgressSummary {
  categorySlug: string;
  categoryName: string;
  progressPercent: number;
  masteryScore: number;
  status: GrammarProgressStatus;
  isMastered: boolean;
  stage: "not_started" | "learning" | "practicing" | "mastered";
  lastAttemptAt?: string;
  weakAreas?: string[];
  strengths?: string[];
  bestScore?: number;
  attempts?: number;
}

/**
 * Test Result Summary Structure with Strengths & Weak Areas
 */
export interface TestSubmissionResult {
  categorySlug: string;
  topicSlug: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  isMastered: boolean;
  masteryScore: number;
  status: GrammarProgressStatus;
  strengths: string[];
  weakAreas: string[];
  attempts?: number;
  bestScore?: number;
  latestScore?: number;
  averageScore?: number;
  incorrectQuestions: Array<{
    question: GrammarQuestion;
    userAnswer: string;
  }>;
}

export interface TenseLessonSection {
  id: string;
  title: string;
  subtitle?: string;
  explanation: string;
  rules?: GrammarRule[];
  formulas?: GrammarFormula[];
  examples?: GrammarExample[];
  spellingRules?: Array<{
    pattern: string;
    rule: string;
    examples: Array<{ base: string; changed: string }>;
  }>;
  signalWords?: Array<{
    word: string;
    frequency: string;
    example: string;
  }>;
  commonMistakes?: GrammarMistake[];
  ieltsNotes?: string[];
}

export interface TenseTopicData {
  slug: "simple-present" | "simple-past" | string;
  name: string;
  tagline: string;
  description: string;
  difficulty: GrammarDifficulty;
  ieltsBandTarget: string;
  sections: TenseLessonSection[];
  overview: string;
  practiceQuestions: GrammarQuestion[];
  sentenceBuildingExercises: SentenceBuildingExercise[];
  tenseConversionExercises: TenseConversionExercise[];
  testQuestions: GrammarQuestion[];
}

/**
 * High-level Dashboard Statistics for Grammar Master
 */
export interface GrammarDashboardStats {
  overallMastery: number;       // 0-100%
  topicsMastered: number;
  totalTopics: number;
  lessonsCompleted: number;
  totalLessons: number;
  verbsStudied: number;
  totalVerbsAvailable: number;
  accuracy: number;
  currentStreak: number;
}


