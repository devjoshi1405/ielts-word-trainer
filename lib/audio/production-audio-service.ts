import { IAudioService } from "./audio-service.interface";
import { AudioState, AudioEventListener, IAudioPlaybackOptions } from "./audio-types";
import { Accent } from "@/types/exercise.types";

export class ProductionAudioService implements IAudioService {
  private audioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<AudioEventListener> = new Set();
  private ttsInterval: NodeJS.Timeout | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private preloadedUrls: Set<string> = new Set();

  private state: AudioState = {
    isPlaying: false,
    isLoading: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    volume: 1.0,
    isMuted: false,
    playbackRate: 1.0,
    error: null,
    sourceType: "none",
  };

  private lastSource: { url?: string; text?: string; accent?: Accent } | null = null;
  private lastOptions: IAudioPlaybackOptions = {};

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioElement();
      this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => {
      try {
        this.cachedVoices = window.speechSynthesis.getVoices() || [];
      } catch {
        this.cachedVoices = [];
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private initAudioElement() {
    if (this.audioElement || typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "auto";

    audio.addEventListener("loadstart", () => {
      this.updateState({ isLoading: true, error: null });
    });

    audio.addEventListener("loadedmetadata", () => {
      const duration = isFinite(audio.duration) ? audio.duration : 0;
      this.updateState({ duration });
    });

    audio.addEventListener("canplay", () => {
      this.updateState({ isLoading: false });
    });

    audio.addEventListener("timeupdate", () => {
      const cur = audio.currentTime || 0;
      const dur = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : this.state.duration;
      const progress = dur > 0 ? Math.min(1, Math.max(0, cur / dur)) : 0;
      this.updateState({ currentTime: cur, duration: dur, progress });
    });

    audio.addEventListener("play", () => {
      this.updateState({ isPlaying: true, isPaused: false, isLoading: false });
    });

    audio.addEventListener("pause", () => {
      this.updateState({ isPlaying: false, isPaused: true });
    });

    audio.addEventListener("ended", () => {
      this.updateState({ isPlaying: false, isPaused: false, currentTime: 0, progress: 0 });
    });

    audio.addEventListener("error", () => {
      const errMessage = audio.error?.message || "Audio playback error";
      this.updateState({ isPlaying: false, isLoading: false, error: errMessage });
    });

    this.audioElement = audio;
  }

  private updateState(partial: Partial<AudioState>) {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Audio state listener error", err);
      }
    });
  }

  getState(): AudioState {
    return { ...this.state };
  }

  subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private getLangCode(accent: Accent = "british"): string {
    switch (accent) {
      case "british":
        return "en-GB";
      case "american":
        return "en-US";
      case "australian":
        return "en-AU";
      default:
        return "en-GB";
    }
  }

  /**
   * Preload TTS audio ahead of time into browser cache so it plays instantaneously on click.
   */
  preload(text: string, accent: Accent = "british"): void {
    if (typeof window === "undefined" || !text.trim()) return;
    const cleanText = text.trim();
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&accent=${accent}`;

    if (this.preloadedUrls.has(ttsUrl)) return;
    this.preloadedUrls.add(ttsUrl);

    // Warm up the browser cache via fetch or Audio preload
    try {
      fetch(ttsUrl, { cache: "force-cache" }).catch(() => {});
    } catch {
      // Ignore background preload errors
    }
  }

  private selectBestVoice(accent: Accent = "british"): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

    let voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const targetLang = this.getLangCode(accent).toLowerCase().replace("_", "-");
    const hqKeywords = [
      "natural", "online", "google", "premium", "enhanced",
      "libby", "george", "oliver", "daniel", "siri", "samantha",
      "karen", "serena", "arthur", "hazel", "sonia", "ryan",
      "david", "zira", "jenny", "guy", "aria", "alex", "tom"
    ];

    // 1. Exact match on targetLang with high quality keyword
    const exactHq = voices.find((v) => {
      const vLang = v.lang.toLowerCase().replace("_", "-");
      const vName = v.name.toLowerCase();
      return (vLang === targetLang || vLang.startsWith(targetLang)) && hqKeywords.some((kw) => vName.includes(kw));
    });
    if (exactHq) return exactHq;

    // 2. Exact match on targetLang code (e.g. en-US, en-GB, en-AU)
    const exactLang = voices.find((v) => {
      const vLang = v.lang.toLowerCase().replace("_", "-");
      return vLang === targetLang || vLang.startsWith(targetLang);
    });
    if (exactLang) return exactLang;

    // 3. Name & region match for the requested accent
    const nameMatch = voices.find((v) => {
      const name = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase().replace("_", "-");
      if (accent === "british") {
        return (
          vLang === "en-gb" ||
          name.includes("uk") ||
          name.includes("british") ||
          name.includes("great britain") ||
          name.includes("united kingdom") ||
          name.includes("george") ||
          name.includes("hazel") ||
          name.includes("susan") ||
          name.includes("oliver") ||
          name.includes("daniel") ||
          name.includes("serena")
        );
      }
      if (accent === "american") {
        return (
          vLang === "en-us" ||
          name.includes("us") ||
          name.includes("united states") ||
          name.includes("american") ||
          name.includes("david") ||
          name.includes("zira") ||
          name.includes("jenny") ||
          name.includes("guy") ||
          name.includes("aria") ||
          name.includes("samantha") ||
          name.includes("alex") ||
          name.includes("tom")
        );
      }
      if (accent === "australian") {
        return (
          vLang === "en-au" ||
          name.includes("australia") ||
          name.includes("australian") ||
          name.includes("karen") ||
          name.includes("lee") ||
          name.includes("russell") ||
          name.includes("nicole") ||
          name.includes("catherine")
        );
      }
      return false;
    });
    if (nameMatch) return nameMatch;

    const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    return anyEnglish || voices[0] || null;
  }

  async playAudioUrl(
    url: string,
    options: IAudioPlaybackOptions & { isTts?: boolean; text?: string } = {}
  ): Promise<void> {
    if (typeof window === "undefined") return;

    this.stop();
    this.initAudioElement();
    if (!this.audioElement) return;

    const isTts = options.isTts ?? false;
    this.lastSource = isTts
      ? { text: options.text || this.state.currentText, accent: options.accent }
      : { url };
    this.lastOptions = options;

    const rate = options.rate ?? this.state.playbackRate ?? 1.0;
    const vol = options.volume ?? this.state.volume ?? 1.0;

    this.updateState({
      sourceType: isTts ? "tts" : "file",
      currentUrl: url,
      currentText: options.text || (isTts ? this.state.currentText : undefined),
      playbackRate: rate,
      volume: vol,
      isLoading: true,
      error: null,
    });

    const audio = this.audioElement;
    audio.src = url;
    audio.playbackRate = Math.max(0.25, Math.min(rate, 2.0));
    (audio as any).preservesPitch = true;
    audio.volume = Math.max(0, Math.min(vol, 1.0));
    audio.muted = this.state.isMuted;

    if (options.startTime && options.startTime > 0) {
      audio.currentTime = options.startTime;
    }

    return new Promise<void>((resolve, reject) => {
      let resolved = false;

      const onEnded = () => {
        cleanup();
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      const onError = (e: Event) => {
        cleanup();
        if (!resolved) {
          resolved = true;
          const errMsg = audio.error?.message || "Audio playback error";
          this.updateState({ isPlaying: false, isLoading: false, error: errMsg });
          reject(new Error(errMsg));
        }
      };

      const cleanup = () => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
      };

      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      audio
        .play()
        .then(() => {
          this.updateState({ isPlaying: true, isLoading: false });
        })
        .catch((err) => {
          cleanup();
          if (!resolved) {
            resolved = true;
            this.updateState({ isPlaying: false, isLoading: false, error: err.message || "Playback failed" });
            reject(err);
          }
        });
    });
  }

  /**
   * High-reliability speech playback:
   * 1. Uses high-fidelity studio TTS stream via /api/tts.
   * 2. Automatically buffers audio and plays smoothly with rate control.
   * 3. Seamlessly falls back to client SpeechSynthesis if offline/unreachable.
   */
  async playText(text: string, options: IAudioPlaybackOptions = {}): Promise<void> {
    if (typeof window === "undefined") return;

    const cleanText = text.trim();
    if (!cleanText) return;

    const accent = options.accent || "british";
    const rate = options.rate ?? this.state.playbackRate ?? 1.0;
    const vol = options.volume ?? this.state.volume ?? 1.0;

    this.lastSource = { text: cleanText, accent };
    this.lastOptions = { ...options, accent };

    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&accent=${accent}`;

    this.stop();
    this.initAudioElement();

    this.updateState({
      sourceType: "tts",
      currentText: cleanText,
      playbackRate: rate,
      volume: vol,
      isLoading: true,
      error: null,
    });

    try {
      // Attempt server TTS with 3.5s loading timeout before fallback
      await Promise.race([
        this.playAudioUrl(ttsUrl, { ...options, rate, isTts: true, text: cleanText, accent }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("TTS stream timeout")), 3500)
        ),
      ]);
    } catch (err) {
      console.warn("[AudioService] Server TTS unavailable or timed out. Falling back to browser SpeechSynthesis.", err);
      await this.playTextViaSpeechSynthesis(cleanText, { ...options, accent });
    }
  }

  private async playTextViaSpeechSynthesis(text: string, options: IAudioPlaybackOptions = {}): Promise<void> {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.updateState({ error: "Speech synthesis not available", isLoading: false });
      return;
    }

    this.stop();

    const rate = options.rate ?? this.state.playbackRate ?? 1.0;
    const vol = options.volume ?? this.state.volume ?? 1.0;
    const accent = options.accent || "british";

    return new Promise((resolve) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      utterance.rate = Math.max(0.5, Math.min(rate, 1.5));
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = this.state.isMuted ? 0 : Math.max(0, Math.min(vol, 1.0));
      utterance.lang = this.getLangCode(accent);

      const bestVoice = this.selectBestVoice(accent);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      const wordCount = text.split(/\s+/).length;
      const estimatedDuration = Math.max(1.0, (wordCount * 0.45 + text.length * 0.04) / rate);
      let elapsedSeconds = 0;

      const clearTimer = () => {
        if (this.ttsInterval) {
          clearInterval(this.ttsInterval);
          this.ttsInterval = null;
        }
      };

      utterance.onstart = () => {
        clearTimer();
        this.updateState({
          isPlaying: true,
          isPaused: false,
          isLoading: false,
          sourceType: "tts",
          currentText: text,
          playbackRate: rate,
          volume: vol,
          error: null,
          currentTime: 0,
          duration: estimatedDuration,
          progress: 0,
        });

        const stepMs = 50;
        this.ttsInterval = setInterval(() => {
          elapsedSeconds += stepMs / 1000;
          const current = Math.min(elapsedSeconds, estimatedDuration);
          const prog = estimatedDuration > 0 ? Math.min(1, current / estimatedDuration) : 0;
          this.updateState({
            currentTime: current,
            progress: prog,
          });
        }, stepMs);
      };

      utterance.onend = () => {
        clearTimer();
        this.updateState({
          isPlaying: false,
          isPaused: false,
          currentTime: 0,
          progress: 0,
        });
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (e) => {
        clearTimer();
        this.updateState({
          isPlaying: false,
          isLoading: false,
          error: e.error || "Speech synthesis error",
        });
        this.currentUtterance = null;
        resolve();
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    });
  }

  async play(
    source: { url?: string; text?: string; accent?: Accent },
    options: IAudioPlaybackOptions = {}
  ): Promise<void> {
    const accent = options.accent || source.accent || "british";

    // If accent is American or Australian (or explicitly non-British) and text is available,
    // synthesize it via TTS so the user hears authentic American or Australian pronunciation
    // instead of a static British pre-recorded MP3.
    if (accent !== "british" && source.text && source.text.trim() !== "") {
      await this.playText(source.text, { ...options, accent });
      return;
    }

    if (source.url && source.url.trim() !== "") {
      try {
        await this.playAudioUrl(source.url, { ...options, accent });
        return;
      } catch (err) {
        console.warn(`[AudioService] Pre-recorded audio at '${source.url}' unavailable. Falling back to speech engine.`);
      }
    }

    if (source.text) {
      await this.playText(source.text, { ...options, accent });
    }
  }

  pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking) {
      if (this.ttsInterval) {
        clearInterval(this.ttsInterval);
        this.ttsInterval = null;
      }
      window.speechSynthesis.pause();
      this.updateState({ isPlaying: false, isPaused: true });
    }
  }

  resume(): void {
    if (this.audioElement && this.audioElement.src && this.state.isPaused) {
      this.audioElement.play().catch(console.error);
    } else if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.updateState({ isPlaying: true, isPaused: false });
    }
  }

  stop(): void {
    if (this.ttsInterval) {
      clearInterval(this.ttsInterval);
      this.ttsInterval = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.updateState({
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentTime: 0,
      progress: 0,
    });
  }

  async replay(): Promise<void> {
    if (this.lastSource) {
      this.stop();
      await this.play(this.lastSource, this.lastOptions);
    }
  }

  seek(timeInSeconds: number): void {
    const target = Math.max(0, Math.min(timeInSeconds, this.state.duration || timeInSeconds));
    if (this.audioElement && this.state.sourceType !== "none") {
      this.audioElement.currentTime = target;
      const dur = this.audioElement.duration || this.state.duration;
      const progress = dur > 0 ? target / dur : 0;
      this.updateState({ currentTime: target, progress });
    } else {
      this.updateState({ currentTime: target });
    }
  }

  seekPercent(percent: number): void {
    const p = Math.max(0, Math.min(1, percent));
    const targetTime = p * (this.state.duration || 0);
    this.seek(targetTime);
  }

  setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }
    this.updateState({ volume: clamped, isMuted: clamped === 0 });
  }

  setMuted(muted: boolean): void {
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window && this.currentUtterance) {
      this.currentUtterance.volume = muted ? 0 : this.state.volume;
    }
    this.updateState({ isMuted: muted });
  }

  setPlaybackRate(rate: number): void {
    const clamped = Math.max(0.25, Math.min(2.0, rate));
    if (this.audioElement) {
      this.audioElement.playbackRate = clamped;
      (this.audioElement as any).preservesPitch = true;
    }
    this.updateState({ playbackRate: clamped });
  }

  async getAvailableVoices(): Promise<string[]> {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
    return voices.map((v) => `${v.name} (${v.lang})`);
  }
}

export const productionAudioService = new ProductionAudioService();
export const audioService = productionAudioService;
