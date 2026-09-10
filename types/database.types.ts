/**
 * Supabase Database schema definitions for IELTS Word Trainer (Phase 5).
 * Strongly typed definitions for:
 * - profiles
 * - vocabulary
 * - questions
 * - user_attempts
 * - user_progress
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type MasteryLevel = "learning" | "improving" | "almost-mastered" | "mastered" | "critical";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          updated_at?: string;
        };
      };
      vocabulary: {
        Row: {
          id: string;
          word: string;
          category: string;
          level: CEFRLevel;
          meaning: string;
          pronunciation: string | null;
          phonetic: string | null;
          example_sentence: string | null;
          common_misspellings: string[];
          common_phrases: string[];
          is_ielts_common: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          word: string;
          category: string;
          level: CEFRLevel;
          meaning: string;
          pronunciation?: string | null;
          phonetic?: string | null;
          example_sentence?: string | null;
          common_misspellings?: string[];
          common_phrases?: string[];
          is_ielts_common?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          word?: string;
          category?: string;
          level?: CEFRLevel;
          meaning?: string;
          pronunciation?: string | null;
          phonetic?: string | null;
          example_sentence?: string | null;
          common_misspellings?: string[];
          common_phrases?: string[];
          is_ielts_common?: boolean;
        };
      };
      questions: {
        Row: {
          id: string;
          vocabulary_id: string | null;
          type: string;
          transcript: string;
          target_text: string;
          audio_url: string | null;
          difficulty: string;
          category: string;
          explanation: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          vocabulary_id?: string | null;
          type: string;
          transcript: string;
          target_text: string;
          audio_url?: string | null;
          difficulty?: string;
          category: string;
          explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vocabulary_id?: string | null;
          type?: string;
          transcript?: string;
          target_text?: string;
          audio_url?: string | null;
          difficulty?: string;
          category?: string;
          explanation?: string | null;
        };
      };
      user_attempts: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          user_answer: string;
          correct_answer: string;
          is_correct: boolean;
          mistake_type: string | null;
          attempt_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          user_answer: string;
          correct_answer: string;
          is_correct: boolean;
          mistake_type?: string | null;
          attempt_number?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          user_answer?: string;
          correct_answer?: string;
          is_correct?: boolean;
          mistake_type?: string | null;
          attempt_number?: number;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          vocabulary_id: string;
          correct_count: number;
          incorrect_count: number;
          consecutive_correct: number;
          mastery_level: MasteryLevel;
          last_reviewed: string | null;
          next_review: string | null;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vocabulary_id: string;
          correct_count?: number;
          incorrect_count?: number;
          consecutive_correct?: number;
          mastery_level?: MasteryLevel;
          last_reviewed?: string | null;
          next_review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vocabulary_id?: string;
          correct_count?: number;
          incorrect_count?: number;
          consecutive_correct?: number;
          mastery_level?: MasteryLevel;
          last_reviewed?: string | null;
          next_review?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type VocabularyRow = Database["public"]["Tables"]["vocabulary"]["Row"];
export type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
export type UserAttemptRow = Database["public"]["Tables"]["user_attempts"]["Row"];
export type UserProgressRow = Database["public"]["Tables"]["user_progress"]["Row"];
