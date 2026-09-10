import { ExerciseCategory, ExerciseQuestion } from "@/types/exercise.types";

export interface IExerciseService {
  getQuestionsByCategory(category: ExerciseCategory, limit?: number): Promise<ExerciseQuestion[]>;
  getQuestionById(id: string): Promise<ExerciseQuestion | null>;
  getAllModules(): Promise<ExerciseCategory[]>;
}
