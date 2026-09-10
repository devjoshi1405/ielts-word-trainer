import { AudioCategory } from "../audio-types";
import { ExerciseType } from "@/types/exercise.types";

export interface IAudioStorageProvider {
  getProviderName(): string;
  getAudioUrl(category: AudioCategory, filename: string): string;
  resolveExerciseAudioUrl(type: ExerciseType | string, targetText: string, id?: string): string;
}
