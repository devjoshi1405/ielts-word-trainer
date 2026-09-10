-- ==============================================================================
-- Grammar Master Database Schema Migration (Phase 1 Foundation)
-- Tables: grammar_categories, grammar_topics, grammar_lessons, verbs, user_grammar_progress
-- ==============================================================================

-- 1. Grammar Categories Table (Parts of Speech & Major Grammar Categories)
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

-- 2. Grammar Topics Table (e.g. Simple Present, Countable Nouns, Modals)
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

-- 3. Grammar Lessons Table (Rich Educational Content Structure)
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

-- 4. Verbs Table (Scalable 500+ Verb Database Structure)
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

-- 5. User Grammar Progress Table (User-isolated Mastery, Session & Review Tracking)
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

-- 6. Attach updated_at triggers
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

-- 7. Seed Initial 8 Core Parts of Speech Categories
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
