-- ==============================================================================
-- IELTS Word Trainer — Complete Supabase Database Schema
-- Run this entire script in Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 0. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Linked to Supabase Auth users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  target_band TEXT DEFAULT '8.5',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by owner" ON public.profiles;
CREATE POLICY "Public profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger: Automatically create public.profiles row on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, target_band)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'target_band', '8.5')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. Vocabulary Table (Static dataset bank: 1,000+ IELTS words)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  meaning TEXT NOT NULL,
  pronunciation TEXT,
  phonetic TEXT,
  example_sentence TEXT,
  common_misspellings TEXT[] DEFAULT ARRAY[]::TEXT[],
  common_phrases TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_ielts_common BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_word ON public.vocabulary(word);
CREATE INDEX IF NOT EXISTS idx_vocabulary_category ON public.vocabulary(category);
CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON public.vocabulary(level);
CREATE INDEX IF NOT EXISTS idx_vocabulary_ielts_common ON public.vocabulary(is_ielts_common);
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vocabulary items are readable by all users" ON public.vocabulary;
CREATE POLICY "Vocabulary items are readable by all users"
  ON public.vocabulary FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------------------------
-- 3. Questions Table (Exercise audio & sentence items)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  vocabulary_id TEXT REFERENCES public.vocabulary(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  transcript TEXT NOT NULL,
  target_text TEXT NOT NULL,
  audio_url TEXT,
  difficulty TEXT NOT NULL DEFAULT 'intermediate',
  category TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_questions_vocab_id ON public.questions(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions are readable by all users" ON public.questions;
CREATE POLICY "Questions are readable by all users"
  ON public.questions FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------------------------
-- 4. User Attempts Table (Every question submission & mistake classification)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  mistake_type TEXT,
  attempt_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_attempts_user_id ON public.user_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_created_at ON public.user_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_attempts_is_correct ON public.user_attempts(is_correct);
CREATE INDEX IF NOT EXISTS idx_user_attempts_user_question ON public.user_attempts(user_id, question_id);
ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own attempts" ON public.user_attempts;
CREATE POLICY "Users can view their own attempts"
  ON public.user_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own attempts" ON public.user_attempts;
CREATE POLICY "Users can insert their own attempts"
  ON public.user_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. User Progress Table (Aggregated mastery and Spaced Repetition SRS per word)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocabulary_id TEXT NOT NULL,
  correct_count INT NOT NULL DEFAULT 0,
  incorrect_count INT NOT NULL DEFAULT 0,
  consecutive_correct INT NOT NULL DEFAULT 0,
  mastery_level TEXT NOT NULL DEFAULT 'learning',
  last_reviewed TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_vocabulary UNIQUE (user_id, vocabulary_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_vocab_id ON public.user_progress(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_mastery ON public.user_progress(mastery_level);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON public.user_progress(next_review);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress;
CREATE POLICY "Users can delete their own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. Updated_at Auto-update Trigger Functions
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER trigger_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. Grammar Categories Table (Parts of Speech & Major Grammar Areas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grammar_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_grammar_categories_slug ON public.grammar_categories(slug);
CREATE INDEX IF NOT EXISTS idx_grammar_categories_display_order ON public.grammar_categories(display_order);
ALTER TABLE public.grammar_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Grammar categories are viewable by all users" ON public.grammar_categories;
CREATE POLICY "Grammar categories are viewable by all users"
  ON public.grammar_categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------------------------
-- 8. Grammar Topics Table (e.g. Simple Present, Countable Nouns, Modals)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grammar_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.grammar_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_grammar_topics_category ON public.grammar_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_grammar_topics_slug ON public.grammar_topics(slug);
CREATE INDEX IF NOT EXISTS idx_grammar_topics_difficulty ON public.grammar_topics(difficulty);
ALTER TABLE public.grammar_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Grammar topics are viewable by all users" ON public.grammar_topics;
CREATE POLICY "Grammar topics are viewable by all users"
  ON public.grammar_topics FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------------------------
-- 9. Grammar Lessons Table (Rich Educational Content Structure)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grammar_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.grammar_categories(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.grammar_topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_grammar_lessons_category ON public.grammar_lessons(category_id);
CREATE INDEX IF NOT EXISTS idx_grammar_lessons_topic ON public.grammar_lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_grammar_lessons_slug ON public.grammar_lessons(slug);
ALTER TABLE public.grammar_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Grammar lessons are viewable by all users" ON public.grammar_lessons;
CREATE POLICY "Grammar lessons are viewable by all users"
  ON public.grammar_lessons FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------------------------
-- 10. Verbs Table (Scalable 500+ Verb Database Structure)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_form TEXT NOT NULL,
  past_form TEXT NOT NULL,
  past_participle TEXT NOT NULL,
  meaning TEXT NOT NULL,
  pronunciation TEXT,
  example_sentence TEXT,
  example_meaning TEXT,
  verb_type TEXT NOT NULL DEFAULT 'regular' CHECK (verb_type IN ('regular', 'irregular')),
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_common BOOLEAN NOT NULL DEFAULT true,
  is_ielts_relevant BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_verbs_base_form ON public.verbs(base_form);
CREATE INDEX IF NOT EXISTS idx_verbs_type ON public.verbs(verb_type);
CREATE INDEX IF NOT EXISTS idx_verbs_difficulty ON public.verbs(difficulty);
CREATE INDEX IF NOT EXISTS idx_verbs_ielts_relevant ON public.verbs(is_ielts_relevant);
ALTER TABLE public.verbs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Verbs are viewable by all users" ON public.verbs;
CREATE POLICY "Verbs are viewable by all users"
  ON public.verbs FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------------------------
-- 11. User Grammar Progress Table (User-isolated Progress & Mastery)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_grammar_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.grammar_categories(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.grammar_topics(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.grammar_lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'learning', 'practicing', 'mastered')),
  progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  attempts INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  total_answers INT NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id),
  CONSTRAINT unique_user_topic UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_user ON public.user_grammar_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_category ON public.user_grammar_progress(category_id);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_topic ON public.user_grammar_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_lesson ON public.user_grammar_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_status ON public.user_grammar_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_next_review ON public.user_grammar_progress(next_review_at);
ALTER TABLE public.user_grammar_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own grammar progress" ON public.user_grammar_progress;
CREATE POLICY "Users can view their own grammar progress"
  ON public.user_grammar_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own grammar progress" ON public.user_grammar_progress;
CREATE POLICY "Users can insert their own grammar progress"
  ON public.user_grammar_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own grammar progress" ON public.user_grammar_progress;
CREATE POLICY "Users can update their own grammar progress"
  ON public.user_grammar_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own grammar progress" ON public.user_grammar_progress;
CREATE POLICY "Users can delete their own grammar progress"
  ON public.user_grammar_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Attach updated_at triggers for grammar tables
DROP TRIGGER IF EXISTS trigger_grammar_categories_updated_at ON public.grammar_categories;
CREATE TRIGGER trigger_grammar_categories_updated_at
  BEFORE UPDATE ON public.grammar_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_grammar_topics_updated_at ON public.grammar_topics;
CREATE TRIGGER trigger_grammar_topics_updated_at
  BEFORE UPDATE ON public.grammar_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_grammar_lessons_updated_at ON public.grammar_lessons;
CREATE TRIGGER trigger_grammar_lessons_updated_at
  BEFORE UPDATE ON public.grammar_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_verbs_updated_at ON public.verbs;
CREATE TRIGGER trigger_verbs_updated_at
  BEFORE UPDATE ON public.verbs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_user_grammar_progress_updated_at ON public.user_grammar_progress;
CREATE TRIGGER trigger_user_grammar_progress_updated_at
  BEFORE UPDATE ON public.user_grammar_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Initial Parts of Speech Seed
INSERT INTO public.grammar_categories (name, slug, description, display_order, is_active)
VALUES
  ('Noun', 'noun', 'People, places, things, ideas, and academic concepts in IELTS tasks.', 1, true),
  ('Pronoun', 'pronoun', 'Referencing words that replace nouns to ensure cohesion and avoid repetition.', 2, true),
  ('Verb', 'verb', 'Action, state, and modal verbs; base forms, past tense, and participles.', 3, true),
  ('Adjective', 'adjective', 'Descriptive vocabulary enhancing lexical resource in IELTS Writing & Speaking.', 4, true),
  ('Adverb', 'adverb', 'Words modifying verbs, adjectives, and clauses to add precision and tone.', 5, true),
  ('Preposition', 'preposition', 'Words expressing spatial, temporal, and dependent relational contexts.', 6, true),
  ('Conjunction', 'conjunction', 'Linking words and cohesive devices critical for complex sentence structures.', 7, true),
  ('Interjection', 'interjection', 'Expressive conversational markers primarily observed in informal spoken English.', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 12. Grammar Questions Table (Question bank for Practice & Tests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grammar_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL,
  topic_slug TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'identify_part_of_speech', 'fill_blank', 'error_identification')),
  prompt TEXT NOT NULL,
  sentence TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  points INT NOT NULL DEFAULT 1,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_grammar_questions_category ON public.grammar_questions(category_slug);
CREATE INDEX IF NOT EXISTS idx_grammar_questions_topic ON public.grammar_questions(topic_slug);
CREATE INDEX IF NOT EXISTS idx_grammar_questions_type ON public.grammar_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_grammar_questions_difficulty ON public.grammar_questions(difficulty);
ALTER TABLE public.grammar_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Grammar questions are viewable by all users" ON public.grammar_questions;
CREATE POLICY "Grammar questions are viewable by all users"
  ON public.grammar_questions FOR SELECT
  TO authenticated, anon
  USING (true);

DROP TRIGGER IF EXISTS trigger_grammar_questions_updated_at ON public.grammar_questions;
CREATE TRIGGER trigger_grammar_questions_updated_at
  BEFORE UPDATE ON public.grammar_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 13. User Verb Progress Table (Verb Mastery, Learned Status, & Review Scheduling)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_verb_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verb_id UUID NOT NULL REFERENCES public.verbs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'learning', 'learned', 'mastered')),
  confidence INT NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  attempts INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  total_answers INT NOT NULL DEFAULT 0,
  is_weak BOOLEAN NOT NULL DEFAULT false,
  last_practiced_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  learned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_verb UNIQUE (user_id, verb_id)
);

CREATE INDEX IF NOT EXISTS idx_user_verb_progress_user ON public.user_verb_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_verb ON public.user_verb_progress(verb_id);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_status ON public.user_verb_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_is_weak ON public.user_verb_progress(is_weak);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_next_review ON public.user_verb_progress(next_review_at);

CREATE INDEX IF NOT EXISTS idx_verbs_past_form ON public.verbs(past_form);
CREATE INDEX IF NOT EXISTS idx_verbs_past_participle ON public.verbs(past_participle);
CREATE INDEX IF NOT EXISTS idx_verbs_is_common ON public.verbs(is_common);

ALTER TABLE public.user_verb_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own verb progress" ON public.user_verb_progress;
CREATE POLICY "Users can view their own verb progress"
  ON public.user_verb_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own verb progress" ON public.user_verb_progress;
CREATE POLICY "Users can insert their own verb progress"
  ON public.user_verb_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own verb progress" ON public.user_verb_progress;
CREATE POLICY "Users can update their own verb progress"
  ON public.user_verb_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own verb progress" ON public.user_verb_progress;
CREATE POLICY "Users can delete their own verb progress"
  ON public.user_verb_progress FOR DELETE
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trigger_user_verb_progress_updated_at ON public.user_verb_progress;
CREATE TRIGGER trigger_user_verb_progress_updated_at
  BEFORE UPDATE ON public.user_verb_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();



