import {
  IGrammarService,
  GetVerbsOptions,
  PaginatedVerbsResult,
} from "./grammar-service.interface";
import { localGrammarService } from "./local-grammar-service";
import { supabaseGrammarService } from "./supabase-grammar-service";
import { isSupabaseConfigured } from "../supabase/client";
import {
  GrammarCategory,
  GrammarTopic,
  GrammarLesson,
  UserGrammarProgress,
  ResumeLearningSession,
  GrammarDashboardStats,
  GrammarQuestion,
  CategoryProgressSummary,
  TestSubmissionResult,
} from "@/types/grammar.types";
import { PartOfSpeechTopicData } from "@/data/grammar-pos-content";

/**
 * Singleton Grammar Manager that dynamically selects between Supabase and Local storage.
 */
export class GrammarManager implements IGrammarService {
  private activeService: IGrammarService;

  constructor() {
    if (isSupabaseConfigured()) {
      this.activeService = supabaseGrammarService;
    } else {
      this.activeService = localGrammarService;
    }
  }

  setService(service: IGrammarService) {
    this.activeService = service;
  }

  getActiveService(): IGrammarService {
    return this.activeService;
  }

  async getCategories(): Promise<GrammarCategory[]> {
    return this.activeService.getCategories();
  }

  async getCategoryBySlug(slug: string): Promise<GrammarCategory | null> {
    return this.activeService.getCategoryBySlug(slug);
  }

  async getTopics(categoryId?: string): Promise<GrammarTopic[]> {
    return this.activeService.getTopics(categoryId);
  }

  async getTopicBySlug(slug: string): Promise<GrammarTopic | null> {
    return this.activeService.getTopicBySlug(slug);
  }

  async getLessons(topicId?: string): Promise<GrammarLesson[]> {
    return this.activeService.getLessons(topicId);
  }

  async getLessonBySlug(slug: string): Promise<GrammarLesson | null> {
    return this.activeService.getLessonBySlug(slug);
  }

  async getPartOfSpeechData(slug: string): Promise<PartOfSpeechTopicData | null> {
    return this.activeService.getPartOfSpeechData(slug);
  }

  async getTenseData(slug: string) {
    return this.activeService.getTenseData(slug);
  }

  async getQuestionsByCategory(
    categorySlug: string,
    type: "practice" | "test" = "practice"
  ): Promise<GrammarQuestion[]> {
    return this.activeService.getQuestionsByCategory(categorySlug, type);
  }

  async getAllCategoryProgress(userId?: string): Promise<CategoryProgressSummary[]> {
    return this.activeService.getAllCategoryProgress(userId);
  }

  async getAllTenseProgress(userId?: string): Promise<CategoryProgressSummary[]> {
    return this.activeService.getAllTenseProgress(userId);
  }

  async getVerbs(options?: GetVerbsOptions): Promise<PaginatedVerbsResult> {
    return this.activeService.getVerbs(options);
  }

  async getVerbById(id: string) {
    return this.activeService.getVerbById(id);
  }

  async getAllVerbsList() {
    return this.activeService.getAllVerbsList();
  }

  async getUserVerbProgress(userId?: string) {
    return this.activeService.getUserVerbProgress(userId);
  }

  async getVerbStats(userId?: string) {
    return this.activeService.getVerbStats(userId);
  }

  async recordVerbAttempt(verbId: string, isCorrect: boolean, userId?: string) {
    return this.activeService.recordVerbAttempt(verbId, isCorrect, userId);
  }

  async toggleVerbLearned(verbId: string, learned: boolean, userId?: string) {
    return this.activeService.toggleVerbLearned(verbId, learned, userId);
  }

  async submitVerbTestResult(result: {
    totalQuestions: number;
    score: number;
    testedVerbIds: string[];
    incorrectVerbIds: string[];
    userId?: string;
  }) {
    return this.activeService.submitVerbTestResult(result);
  }

  async getUserProgress(userId?: string): Promise<UserGrammarProgress[]> {
    return this.activeService.getUserProgress(userId);
  }

  async getDashboardStats(userId?: string): Promise<GrammarDashboardStats> {
    return this.activeService.getDashboardStats(userId);
  }

  async getResumeSession(userId?: string): Promise<ResumeLearningSession> {
    return this.activeService.getResumeSession(userId);
  }

  async recordProgress(data: {
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
  }): Promise<void> {
    return this.activeService.recordProgress(data);
  }

  async recordLessonComplete(categorySlug: string, userId?: string, lastSection?: string): Promise<void> {
    return this.activeService.recordLessonComplete(categorySlug, userId, lastSection);
  }

  async submitTestResult(
    categorySlug: string,
    score: number,
    totalQuestions: number,
    incorrectQuestions?: Array<{ question: GrammarQuestion; userAnswer: string }>,
    userId?: string
  ): Promise<TestSubmissionResult> {
    return this.activeService.submitTestResult(categorySlug, score, totalQuestions, incorrectQuestions, userId);
  }

  async resetProgress(userId?: string): Promise<void> {
    if (this.activeService.resetProgress) {
      return this.activeService.resetProgress(userId);
    }
  }
}

export const grammarManager = new GrammarManager();
export const grammarService = grammarManager;
