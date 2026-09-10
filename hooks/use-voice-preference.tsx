"use client";

import * as React from "react";
import { Accent } from "@/types/exercise.types";
import { audioService } from "@/lib/audio";

export interface AccentOption {
  id: Accent;
  name: string;
  flag: string;
  region: string;
  description: string;
  sampleWord: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  {
    id: "british",
    name: "British (UK)",
    flag: "🇬🇧",
    region: "BBC RP Standard",
    description: "Traditional IELTS British pronunciation",
    sampleWord: "schedule and laboratory",
  },
  {
    id: "american",
    name: "American (US)",
    flag: "🇺🇸",
    region: "General American",
    description: "Standard North American phonetics & rhotic vowels",
    sampleWord: "schedule and laboratory",
  },
  {
    id: "australian",
    name: "Australian (AU)",
    flag: "🇦🇺",
    region: "General Australian",
    description: "Common in IELTS Section 1 & 2 dialogs",
    sampleWord: "schedule and laboratory",
  },
];

interface VoicePreferenceContextType {
  accent: Accent;
  setAccent: (accent: Accent) => void;
  accentOption: AccentOption;
  accentLabel: string;
  accentFlag: string;
  availableAccents: AccentOption[];
  testVoice: (accentToTest?: Accent, sampleWord?: string) => Promise<void>;
  isTestingVoice: boolean;
}

const VoicePreferenceContext = React.createContext<VoicePreferenceContextType | undefined>(undefined);

const LOCAL_ACCENT_KEY = "ielts_preferred_accent";

export function VoicePreferenceProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = React.useState<Accent>("british");
  const [isTestingVoice, setIsTestingVoice] = React.useState(false);

  // Read stored accent preference on initial mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(LOCAL_ACCENT_KEY) as Accent | null;
      if (stored && (stored === "british" || stored === "american" || stored === "australian")) {
        setAccentState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setAccent = React.useCallback((newAccent: Accent) => {
    setAccentState(newAccent);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_ACCENT_KEY, newAccent);
      } catch {
        // ignore
      }
    }
  }, []);

  const testVoice = React.useCallback(
    async (accentToTest?: Accent, sampleWord: string = "Schedule and laboratory research") => {
      const targetAccent = accentToTest || accent;
      try {
        setIsTestingVoice(true);
        await audioService.playText(sampleWord, {
          accent: targetAccent,
          rate: 1.0,
        });
      } catch (err) {
        console.warn("Test voice playback error:", err);
      } finally {
        setIsTestingVoice(false);
      }
    },
    [accent]
  );

  const accentOption = React.useMemo(() => {
    return ACCENT_OPTIONS.find((a) => a.id === accent) || ACCENT_OPTIONS[0];
  }, [accent]);

  return (
    <VoicePreferenceContext.Provider
      value={{
        accent,
        setAccent,
        accentOption,
        accentLabel: `${accentOption.flag} ${accentOption.name}`,
        accentFlag: accentOption.flag,
        availableAccents: ACCENT_OPTIONS,
        testVoice,
        isTestingVoice,
      }}
    >
      {children}
    </VoicePreferenceContext.Provider>
  );
}

export function useVoicePreference() {
  const context = React.useContext(VoicePreferenceContext);
  if (!context) {
    throw new Error("useVoicePreference must be used within a VoicePreferenceProvider");
  }
  return context;
}
