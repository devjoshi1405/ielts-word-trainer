import {
  GrammarCategory,
  GrammarTopic,
  GrammarLesson,
  VerbItem,
  UserGrammarProgress,
  UserVerbProgress,
  VerbProgressStats,
  ResumeLearningSession,
  GrammarDashboardStats,
  VerbType,
  GrammarQuestion,
  CategoryProgressSummary,
  TestSubmissionResult,
  TenseTopicData,
} from "@/types/grammar.types";
import { PartOfSpeechTopicData } from "@/data/grammar-pos-content";

export interface GetVerbsOptions {
  page?: number;
  limit?: number;
  search?: string;
  verbType?: VerbType;
  difficulty?: string;
  isCommon?: boolean;
  ieltsRelevantOnly?: boolean;
  isWeakOnly?: boolean;
  isLearnedOnly?: boolean;
  userId?: string;
}

export interface PaginatedVerbsResult {
  items: VerbItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  userProgressMap?: Record<string, UserVerbProgress>;
}

export interface IGrammarService {
  getCategories(): Promise<GrammarCategory[]>;
  getCategoryBySlug(slug: string): Promise<GrammarCategory | null>;
  getTopics(categoryId?: string): Promise<GrammarTopic[]>;
  getTopicBySlug(slug: string): Promise<GrammarTopic | null>;
  getLessons(topicId?: string): Promise<GrammarLesson[]>;
  getLessonBySlug(slug: string): Promise<GrammarLesson | null>;
  getPartOfSpeechData(slug: string): Promise<PartOfSpeechTopicData | null>;
  getTenseData(slug: string): Promise<TenseTopicData | null>;
  getQuestionsByCategory(categorySlug: string, type?: "practice" | "test"): Promise<GrammarQuestion[]>;
  getUserProgress(userId?: string): Promise<UserGrammarProgress[]>;
  getAllCategoryProgress(userId?: string): Promise<CategoryProgressSummary[]>;
  getAllTenseProgress(userId?: string): Promise<CategoryProgressSummary[]>;
  getDashboardStats(userId?: string): Promise<GrammarDashboardStats>;
  getResumeSession(userId?: string): Promise<ResumeLearningSession>;
  recordProgress(progressData: {
    userId?: string;
    categoryId?: string;
    categorySlug?: string;
    topicId?: string;
    topicSlug?: string;
    lessonId?: string;
    status: "not_started" | "learning" | "practicing" | "mastered";
    progressPercent: number;
    masteryScore?: number;
    isCorrect?: boolean;
    lastSection?: string;
    lastStage?: string;
    weakAreas?: string[];
    strengths?: string[];
  }): Promise<void>;
  recordLessonComplete(categorySlug: string, userId?: string, lastSection?: string): Promise<void>;
  submitTestResult(
    categorySlug: string,
    score: number,
    totalQuestions: number,
    incorrectQuestions?: Array<{ question: GrammarQuestion; userAnswer: string }>,
    userId?: string
  ): Promise<TestSubmissionResult>;
  
  // Verb Master Methods
  getVerbs(options?: GetVerbsOptions): Promise<PaginatedVerbsResult>;
  getVerbById(id: string): Promise<VerbItem | null>;
  getAllVerbsList(): Promise<VerbItem[]>;
  getUserVerbProgress(userId?: string): Promise<Record<string, UserVerbProgress>>;
  getVerbStats(userId?: string): Promise<VerbProgressStats>;
  recordVerbAttempt(verbId: string, isCorrect: boolean, userId?: string): Promise<void>;
  toggleVerbLearned(verbId: string, learned: boolean, userId?: string): Promise<void>;
  submitVerbTestResult(result: {
    totalQuestions: number;
    score: number;
    testedVerbIds: string[];
    incorrectVerbIds: string[];
    userId?: string;
  }): Promise<void>;
  
  resetProgress?(userId?: string): Promise<void>;
}

