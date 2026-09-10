"use client";

import * as React from "react";
import { audioService } from "@/lib/audio/production-audio-service";
import { AudioState, IAudioPlaybackOptions } from "@/lib/audio/audio-types";
import { Accent } from "@/types/exercise.types";

export function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function useAudioPlayer() {
  const [state, setState] = React.useState<AudioState>(() => audioService.getState());

  React.useEffect(() => {
    const unsubscribe = audioService.subscribe((newState) => {
      setState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const play = React.useCallback(
    async (
      source: { url?: string; text?: string; accent?: Accent },
      options?: IAudioPlaybackOptions
    ) => {
      return audioService.play(source, options);
    },
    []
  );

  const playAudioUrl = React.useCallback(
    async (url: string, options?: IAudioPlaybackOptions) => {
      return audioService.playAudioUrl(url, options);
    },
    []
  );

  const playText = React.useCallback(
    async (text: string, options?: IAudioPlaybackOptions) => {
      return audioService.playText(text, options);
    },
    []
  );

  const pause = React.useCallback(() => {
    audioService.pause();
  }, []);

  const resume = React.useCallback(() => {
    audioService.resume();
  }, []);

  const stop = React.useCallback(() => {
    audioService.stop();
  }, []);

  const replay = React.useCallback(async () => {
    return audioService.replay();
  }, []);

  const seek = React.useCallback((seconds: number) => {
    audioService.seek(seconds);
  }, []);

  const seekPercent = React.useCallback((percent: number) => {
    audioService.seekPercent(percent);
  }, []);

  const setVolume = React.useCallback((volume: number) => {
    audioService.setVolume(volume);
  }, []);

  const setMuted = React.useCallback((muted: boolean) => {
    audioService.setMuted(muted);
  }, []);

  const toggleMute = React.useCallback(() => {
    audioService.setMuted(!state.isMuted);
  }, [state.isMuted]);

  const setPlaybackRate = React.useCallback((rate: number) => {
    audioService.setPlaybackRate(rate);
  }, []);

  return {
    state,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    isPaused: state.isPaused,
    currentTime: state.currentTime,
    duration: state.duration,
    progress: state.progress,
    volume: state.volume,
    isMuted: state.isMuted,
    playbackRate: state.playbackRate,
    error: state.error,
    sourceType: state.sourceType,
    formattedCurrentTime: formatAudioTime(state.currentTime),
    formattedDuration: formatAudioTime(state.duration),
    play,
    playAudioUrl,
    playText,
    pause,
    resume,
    stop,
    replay,
    seek,
    seekPercent,
    setVolume,
    setMuted,
    toggleMute,
    setPlaybackRate,
  };
}
