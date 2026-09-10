import { Accent } from "./exercise.types";

export interface UserPreferences {
  defaultPlaybackRate: number; // 0.75, 1.0, 1.25
  preferredAccent: Accent;
  dailyGoalQuestions: number;
  autoPlayNext: boolean;
  soundEffects: boolean;
  keyboardShortcuts: boolean;
  theme: "system" | "light" | "dark";
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  targetBandScore: number; // 6.5, 7.0, 7.5, 8.0, 8.5, 9.0
  examDate?: string;
  createdAt: string;
  preferences: UserPreferences;
}
