import { IAudioStorageProvider } from "./audio-storage.interface";
import { LocalAudioStorageProvider } from "./local-audio-storage-provider";
import { SupabaseAudioStorageProvider } from "./supabase-audio-storage-provider";
import { AudioCategory } from "../audio-types";
import { ExerciseType } from "@/types/exercise.types";

export class AudioStorageManager {
  private activeProvider: IAudioStorageProvider;

  constructor() {
    const providerType = process.env.NEXT_PUBLIC_AUDIO_STORAGE_PROVIDER || "local";
    if (providerType === "supabase") {
      this.activeProvider = new SupabaseAudioStorageProvider();
    } else {
      this.activeProvider = new LocalAudioStorageProvider();
    }
  }

  setProvider(provider: IAudioStorageProvider): void {
    this.activeProvider = provider;
  }

  getProvider(): IAudioStorageProvider {
    return this.activeProvider;
  }

  getAudioUrl(category: AudioCategory, filename: string): string {
    return this.activeProvider.getAudioUrl(category, filename);
  }

  resolveExerciseAudioUrl(type: ExerciseType | string, targetText: string, id?: string): string {
    return this.activeProvider.resolveExerciseAudioUrl(type, targetText, id);
  }
}

export const audioStorageManager = new AudioStorageManager();
