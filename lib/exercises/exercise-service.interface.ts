import { ExerciseCategory, ExerciseQuestion } from "@/types/exercise.types";

export interface BatchInfo {
  questions: ExerciseQuestion[];
  batchIndex: number;
  totalBatches: number;
  totalQuestions: number;
  startWordIndex: number;
  endWordIndex: number;
}

export interface IExerciseService {
  getQuestionsByCategory(
    category: ExerciseCategory | string,
    limit?: number,
    offset?: number,
    shuffle?: boolean
  ): Promise<ExerciseQuestion[]>;
  getBatchInfo(
    category: ExerciseCategory | string,
    batchIndex?: number,
    limit?: number
  ): Promise<BatchInfo>;
  getQuestionById(id: string): Promise<ExerciseQuestion | null>;
  getAllModules(): Promise<ExerciseCategory[]>;
  getTotalCount(category: ExerciseCategory | string): number;
}
