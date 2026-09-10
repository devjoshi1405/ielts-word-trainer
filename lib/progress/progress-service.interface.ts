import { DashboardStats, MistakeItem, PracticeModuleSummary, AttemptSubmission } from "@/types/progress.types";
import { ExerciseCategory } from "@/types/exercise.types";

export interface IProgressService {
  /**
   * Returns computed real dashboard statistics.
   */
  getDashboardStats(userId?: string): Promise<DashboardStats>;

  /**
   * Returns list of words/questions the student repeatedly gets wrong.
   */
  getMistakes(userId?: string): Promise<MistakeItem[]>;

  /**
   * Returns module summary progress.
   */
  getModuleSummaries(userId?: string): Promise<PracticeModuleSummary[]>;

  /**
   * Records a user's answer attempt for a question/vocabulary item and updates progress.
   */
  recordAttempt(data: AttemptSubmission | {
    exerciseId: string;
    userInput: string;
    isCorrect: boolean;
    category?: ExerciseCategory | string;
    targetAnswer?: string;
    vocabularyId?: string;
    mistakeType?: string;
    attemptNumber?: number;
  }): Promise<void>;

  /**
   * Dismisses or clears a mistake from the active mistake bank.
   */
  removeMistake(id: string, userId?: string): Promise<void>;

  /**
   * Resets all progress data (useful for dev/testing/profile resets).
   */
  resetProgress?(userId?: string): Promise<void>;
}
