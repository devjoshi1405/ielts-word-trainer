import { Accent, ExerciseType } from "@/types/exercise.types";

export type AudioCategory = "words" | "phrases" | "sentences" | "numbers" | "dates";

export type AudioSourceType = "file" | "tts" | "none";

export interface IAudioPlaybackOptions {
  rate?: number; // 0.5, 0.75, 1.0, etc. (default 1.0)
  pitch?: number;
  accent?: Accent;
  volume?: number; // 0.0 to 1.0 (default 1.0)
  startTime?: number; // seek start in seconds
  autoPlay?: boolean;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  isPaused: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  progress: number; // 0.0 to 1.0
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  playbackRate: number; // 0.5, 0.75, 1.0
  error: string | null;
  sourceType: AudioSourceType;
  currentUrl?: string;
  currentText?: string;
}

export type AudioEventListener = (state: AudioState) => void;
