import { IProgressService } from "./progress-service.interface";
import { localProgressService } from "./local-progress-service";
import { supabaseProgressService } from "./supabase-progress-service";
import { isSupabaseConfigured } from "../supabase/client";
import { DashboardStats, MistakeItem, PracticeModuleSummary, AttemptSubmission } from "@/types/progress.types";
import { ExerciseCategory } from "@/types/exercise.types";

/**
 * Singleton Progress Manager that dynamically selects between Supabase and Local storage.
 */
export class ProgressManager implements IProgressService {
  private activeService: IProgressService;

  constructor() {
    if (isSupabaseConfigured()) {
      this.activeService = supabaseProgressService;
    } else {
      this.activeService = localProgressService;
    }
  }

  setService(service: IProgressService) {
    this.activeService = service;
  }

  getActiveService(): IProgressService {
    return this.activeService;
  }

  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    return this.activeService.getDashboardStats(userId);
  }

  async getMistakes(userId?: string): Promise<MistakeItem[]> {
    return this.activeService.getMistakes(userId);
  }

  async getModuleSummaries(userId?: string): Promise<PracticeModuleSummary[]> {
    return this.activeService.getModuleSummaries(userId);
  }

  async recordAttempt(data: AttemptSubmission | {
    exerciseId: string;
    userInput: string;
    isCorrect: boolean;
    category: ExerciseCategory;
    targetAnswer?: string;
    vocabularyId?: string;
    mistakeType?: string;
    attemptNumber?: number;
  }): Promise<void> {
    return this.activeService.recordAttempt(data);
  }

  async removeMistake(id: string, userId?: string): Promise<void> {
    return this.activeService.removeMistake(id, userId);
  }

  async resetProgress(userId?: string): Promise<void> {
    if (this.activeService.resetProgress) {
      return this.activeService.resetProgress(userId);
    }
  }
}

export const progressManager = new ProgressManager();
export const progressService = progressManager;
