import { AudioState, AudioEventListener, IAudioPlaybackOptions } from "./audio-types";
import { Accent } from "@/types/exercise.types";

export type { IAudioPlaybackOptions, AudioState, AudioEventListener };

export interface IAudioService {
  playAudioUrl(url: string, options?: IAudioPlaybackOptions): Promise<void>;
  playText(text: string, options?: IAudioPlaybackOptions): Promise<void>;
  play(source: { url?: string; text?: string; accent?: Accent }, options?: IAudioPlaybackOptions): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): void;
  replay(): Promise<void>;
  seek(timeInSeconds: number): void;
  seekPercent(percent: number): void; // 0 to 1
  setVolume(volume: number): void; // 0.0 to 1.0
  setMuted(muted: boolean): void;
  setPlaybackRate(rate: number): void;
  getState(): AudioState;
  subscribe(listener: AudioEventListener): () => void;
  getAvailableVoices(): Promise<string[]>;
}
