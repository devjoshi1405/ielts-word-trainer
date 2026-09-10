"use client";

import * as React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  Snail,
  Loader2,
  AlertCircle,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAudioPlayer, formatAudioTime } from "@/hooks/use-audio-player";
import { audioService } from "@/lib/audio";
import { Accent } from "@/types/exercise.types";
import { useVoicePreference } from "@/hooks/use-voice-preference";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

export type AudioSpeed = 0.5 | 0.75 | 1.0;

interface AudioPlayerProps {
  textToSpeak: string;
  audioUrl?: string;
  accent?: Accent;
  autoPlay?: boolean;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  initialSpeed?: AudioSpeed;
  exerciseType?: string;
  showSeeker?: boolean;
}

export function AudioPlayer({
  textToSpeak,
  audioUrl,
  accent: propAccent,
  autoPlay = false,
  onPlayStart,
  onPlayEnd,
  initialSpeed = 1.0,
  exerciseType = "WORD",
  showSeeker = true,
}: AudioPlayerProps) {
  const { accent: globalAccent, setAccent, availableAccents } = useVoicePreference();
  const effectiveAccent = propAccent || globalAccent;
  const [accentMenuOpen, setAccentMenuOpen] = React.useState(false);

  const {
    state,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    playbackRate,
    error,
    sourceType,
    play,
    pause,
    resume,
    replay,
    seekPercent,
    setVolume,
    toggleMute,
    setPlaybackRate,
  } = useAudioPlayer();

  const [playCount, setPlayCount] = React.useState(0);

  // Proactively preload audio buffer in background so play is instantaneous on click
  React.useEffect(() => {
    if (textToSpeak) {
      audioService.preload(textToSpeak, effectiveAccent);
    }
  }, [textToSpeak, effectiveAccent]);

  const currentAccentOption = React.useMemo(() => {
    return availableAccents.find((a) => a.id === effectiveAccent) || availableAccents[0];
  }, [availableAccents, effectiveAccent]);

  const accentLabel = `${currentAccentOption.flag} ${currentAccentOption.name}`;

  const handlePlayToggle = React.useCallback(async () => {
    if (isPlaying) {
      pause();
      return;
    }

    if (state.isPaused) {
      resume();
      return;
    }

    setPlayCount((prev) => prev + 1);
    onPlayStart?.();

    try {
      await play(
        { url: audioUrl, text: textToSpeak, accent: effectiveAccent },
        { rate: playbackRate, volume, accent: effectiveAccent }
      );
    } finally {
      onPlayEnd?.();
    }
  }, [isPlaying, state.isPaused, pause, resume, play, audioUrl, textToSpeak, effectiveAccent, playbackRate, volume, onPlayStart, onPlayEnd]);

  const handleSlowAudio = React.useCallback(async () => {
    setPlaybackRate(0.75);
    setPlayCount((prev) => prev + 1);
    onPlayStart?.();
    try {
      await play(
        { url: audioUrl, text: textToSpeak, accent: effectiveAccent },
        { rate: 0.75, volume, accent: effectiveAccent }
      );
    } finally {
      onPlayEnd?.();
    }
  }, [setPlaybackRate, play, audioUrl, textToSpeak, effectiveAccent, volume, onPlayStart, onPlayEnd]);

  const handleReplay = React.useCallback(async () => {
    setPlayCount((prev) => prev + 1);
    onPlayStart?.();
    try {
      await replay();
    } finally {
      onPlayEnd?.();
    }
  }, [replay, onPlayStart, onPlayEnd]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = parseFloat(e.target.value);
    seekPercent(p);
  };

  const handleSpeedChange = (speed: AudioSpeed) => {
    setPlaybackRate(speed);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
  };

  const handleAccentSelect = async (newAccent: Accent) => {
    setAccent(newAccent);
    setAccentMenuOpen(false);
    if (isPlaying || state.isPaused) {
      await play(
        { url: audioUrl, text: textToSpeak, accent: newAccent },
        { rate: playbackRate, volume, accent: newAccent }
      );
    }
  };

  // Autoplay on question change if enabled
  React.useEffect(() => {
    setPlayCount(0);
    if (autoPlay) {
      const timer = setTimeout(() => {
        handlePlayToggle();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [textToSpeak, audioUrl, autoPlay, handlePlayToggle]);

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-6 sm:p-8 flex flex-col items-center justify-center space-y-5 transition-all shadow-xs">
      {/* Top Status Bar with Interactive Accent Switcher */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Headphones className="w-4 h-4 text-indigo-600" />
          <span>IELTS Audio Stream</span>
        </div>

        <div className="relative flex items-center space-x-2">
          {/* In-Player Accent Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccentMenuOpen(!accentMenuOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 transition-all shadow-xs cursor-pointer"
              title="Click to switch accent"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>{accentLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {accentMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccentMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase text-muted-foreground border-b border-slate-100 dark:border-slate-800">
                    Switch Voice Accent
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {availableAccents.map((acc) => {
                      const isSelected = acc.id === effectiveAccent;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => handleAccentSelect(acc.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{acc.flag}</span>
                            <span>{acc.name}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {error && (
            <Badge variant="destructive" className="text-[10px] gap-1">
              <AlertCircle className="w-3 h-3" />
              Fallback Active
            </Badge>
          )}
        </div>
      </div>

      {/* Waveform visualizer */}
      <div className="flex items-center justify-center space-x-1.5 h-12 w-48">
        {[
          "animate-wave-1",
          "animate-wave-2",
          "animate-wave-3",
          "animate-wave-4",
          "animate-wave-5",
          "animate-wave-2",
          "animate-wave-4",
          "animate-wave-1",
        ].map((anim, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 rounded-full bg-indigo-500 transition-all duration-200",
              isPlaying
                ? `${anim} h-10 bg-indigo-600`
                : "h-3 bg-slate-300 dark:bg-slate-700 opacity-60"
            )}
          />
        ))}
      </div>

      {/* Scrubber / Seeker Bar */}
      {showSeeker && (
        <div className="w-full max-w-md space-y-1.5">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={progress || 0}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
              aria-label="Seek audio"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>{formatAudioTime(currentTime)}</span>
            <span>{formatAudioTime(duration || 0)}</span>
          </div>
        </div>
      )}

      {/* Main Play & Interactive Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={handlePlayToggle}
          variant="brand"
          size="lg"
          className="h-13 px-7 rounded-2xl gap-2.5 text-base shadow-lg shadow-indigo-200 dark:shadow-none min-w-[170px]"
          id="play-audio-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading Audio...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-0.5" />
              <span>{playCount > 0 ? "Play Again" : "Play Audio"}</span>
            </>
          )}
        </Button>

        {playCount > 0 && (
          <Button
            type="button"
            onClick={handleReplay}
            variant="outline"
            size="lg"
            className="h-13 px-4 rounded-2xl gap-2 text-sm bg-white dark:bg-slate-800 shadow-xs"
            title="Replay from start"
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={handleSlowAudio}
          variant="secondary"
          size="lg"
          className="h-13 px-4 rounded-2xl gap-2 text-sm"
          title="Play at 0.75x slow speed"
          disabled={isLoading}
        >
          <Snail className="w-4 h-4 text-amber-600" />
          <span>Slow Audio</span>
        </Button>
      </div>

      {/* Bottom Sub-Controls: Speeds (0.5x, 0.75x, 1.0x), Volume, and Listen Counter */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-md pt-2 border-t border-slate-200/60 dark:border-slate-800 gap-3">
        {/* Speed Selector */}
        <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] text-muted-foreground font-medium px-1.5">Speed</span>
          {([0.5, 0.75, 1.0] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSpeedChange(s)}
              className={cn(
                "px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors",
                playbackRate === s
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Volume & Mute Controls */}
        <div className="relative flex items-center space-x-2 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors p-1"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label="Toggle mute"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            aria-label="Volume slider"
          />
        </div>

        {/* Listen Count */}
        {playCount > 0 && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>Listened:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{playCount}x</span>
          </div>
        )}
      </div>
    </div>
  );
}
