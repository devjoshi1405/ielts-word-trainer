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
      grammar_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      grammar_topics: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          difficulty: "beginner" | "intermediate" | "advanced";
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      grammar_lessons: {
        Row: {
          id: string;
          category_id: string;
          topic_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          content: Json;
          difficulty: "beginner" | "intermediate" | "advanced";
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          topic_id?: string | null;
          title: string;
          slug: string;
          description?: string | null;
          content?: Json;
          difficulty?: "beginner" | "intermediate" | "advanced";
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          topic_id?: string | null;
          title?: string;
          slug?: string;
          description?: string | null;
          content?: Json;
          difficulty?: "beginner" | "intermediate" | "advanced";
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      verbs: {
        Row: {
          id: string;
          base_form: string;
          past_form: string;
          past_participle: string;
          meaning: string;
          pronunciation: string | null;
          example_sentence: string | null;
          example_meaning: string | null;
          verb_type: "regular" | "irregular";
          difficulty: "beginner" | "intermediate" | "advanced";
          is_common: boolean;
          is_ielts_relevant: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          base_form: string;
          past_form: string;
          past_participle: string;
          meaning: string;
          pronunciation?: string | null;
          example_sentence?: string | null;
          example_meaning?: string | null;
          verb_type?: "regular" | "irregular";
          difficulty?: "beginner" | "intermediate" | "advanced";
          is_common?: boolean;
          is_ielts_relevant?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          base_form?: string;
          past_form?: string;
          past_participle?: string;
          meaning?: string;
          pronunciation?: string | null;
          example_sentence?: string | null;
          example_meaning?: string | null;
          verb_type?: "regular" | "irregular";
          difficulty?: "beginner" | "intermediate" | "advanced";
          is_common?: boolean;
          is_ielts_relevant?: boolean;
          display_order?: number;
          updated_at?: string;
        };
      };
      user_grammar_progress: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          topic_id: string | null;
          lesson_id: string | null;
          status: "not_started" | "learning" | "practicing" | "mastered";
          progress_percent: number;
          mastery_score: number;
          attempts: number;
          correct_answers: number;
          total_answers: number;
          best_score?: number | null;
          latest_score?: number | null;
          average_score?: number | null;
          weak_areas?: Json;
          strengths?: Json;
          last_section?: string | null;
          last_stage?: string | null;
          last_attempt_at: string | null;
          next_review_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          topic_id?: string | null;
          lesson_id?: string | null;
          status?: "not_started" | "learning" | "practicing" | "mastered";
          progress_percent?: number;
          mastery_score?: number;
          attempts?: number;
          correct_answers?: number;
          total_answers?: number;
          best_score?: number | null;
          latest_score?: number | null;
          average_score?: number | null;
          weak_areas?: Json;
          strengths?: Json;
          last_section?: string | null;
          last_stage?: string | null;
          last_attempt_at?: string | null;
          next_review_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          topic_id?: string | null;
          lesson_id?: string | null;
          status?: "not_started" | "learning" | "practicing" | "mastered";
          progress_percent?: number;
          mastery_score?: number;
          attempts?: number;
          correct_answers?: number;
          total_answers?: number;
          best_score?: number | null;
          latest_score?: number | null;
          average_score?: number | null;
          weak_areas?: Json;
          strengths?: Json;
          last_section?: string | null;
          last_stage?: string | null;
          last_attempt_at?: string | null;
          next_review_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      grammar_questions: {
        Row: {
          id: string;
          category_slug: string;
          topic_slug: string;
          question_type: string;
          prompt: string;
          sentence: string | null;
          options: Json;
          correct_answer: string;
          explanation: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          points: number;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_slug: string;
          topic_slug: string;
          question_type: string;
          prompt: string;
          sentence?: string | null;
          options?: Json;
          correct_answer: string;
          explanation: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          points?: number;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_slug?: string;
          topic_slug?: string;
          question_type?: string;
          prompt?: string;
          sentence?: string | null;
          options?: Json;
          correct_answer?: string;
          explanation?: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          points?: number;
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      user_verb_progress: {
        Row: {
          id: string;
          user_id: string;
          verb_id: string;
          status: "not_started" | "learning" | "learned" | "mastered";
          confidence: number;
          attempts: number;
          correct_answers: number;
          total_answers: number;
          is_weak: boolean;
          last_practiced_at: string | null;
          next_review_at: string | null;
          learned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          verb_id: string;
          status?: "not_started" | "learning" | "learned" | "mastered";
          confidence?: number;
          attempts?: number;
          correct_answers?: number;
          total_answers?: number;
          is_weak?: boolean;
          last_practiced_at?: string | null;
          next_review_at?: string | null;
          learned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          verb_id?: string;
          status?: "not_started" | "learning" | "learned" | "mastered";
          confidence?: number;
          attempts?: number;
          correct_answers?: number;
          total_answers?: number;
          is_weak?: boolean;
          last_practiced_at?: string | null;
          next_review_at?: string | null;
          learned_at?: string | null;
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
export type GrammarCategoryRow = Database["public"]["Tables"]["grammar_categories"]["Row"];
export type GrammarTopicRow = Database["public"]["Tables"]["grammar_topics"]["Row"];
export type GrammarLessonRow = Database["public"]["Tables"]["grammar_lessons"]["Row"];
export type VerbRow = Database["public"]["Tables"]["verbs"]["Row"];
export type UserGrammarProgressRow = Database["public"]["Tables"]["user_grammar_progress"]["Row"];
export type GrammarQuestionRow = Database["public"]["Tables"]["grammar_questions"]["Row"];
export type UserVerbProgressRow = Database["public"]["Tables"]["user_verb_progress"]["Row"];



