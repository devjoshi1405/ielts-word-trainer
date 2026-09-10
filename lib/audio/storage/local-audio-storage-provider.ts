import { AudioCategory } from "../audio-types";
import { IAudioStorageProvider } from "./audio-storage.interface";
import { ExerciseType } from "@/types/exercise.types";

export class LocalAudioStorageProvider implements IAudioStorageProvider {
  private basePath: string;

  constructor(basePath = "/audio") {
    this.basePath = basePath.replace(/\/+$/, "");
  }

  getProviderName(): string {
    return "local";
  }

  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[£$€]/g, "cur-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  getAudioUrl(category: AudioCategory, filename: string): string {
    const cleanName = filename.endsWith(".wav") || filename.endsWith(".mp3")
      ? filename
      : `${this.sanitizeFilename(filename)}.wav`;
    return `${this.basePath}/${category}/${cleanName}`;
  }

  resolveExerciseAudioUrl(type: ExerciseType | string, targetText: string, id?: string): string {
    const clean = this.sanitizeFilename(targetText || id || "audio");

    switch (type) {
      case "NUMBER":
        return this.getAudioUrl("numbers", `num-${clean}`);
      case "DATE":
        return this.getAudioUrl("dates", `dt-${clean}`);
      case "TIME":
        return this.getAudioUrl("dates", `tm-${clean}`);
      case "PREPOSITION_PHRASE":
      case "PHRASE":
        return this.getAudioUrl("phrases", `phr-${clean}`);
      case "SENTENCE_TARGET":
        return this.getAudioUrl("sentences", `sent-${clean}`);
      case "ARTICLE_WORD":
      case "SPELLING":
      case "WORD":
      default:
        return this.getAudioUrl("words", clean);
    }
  }
}
