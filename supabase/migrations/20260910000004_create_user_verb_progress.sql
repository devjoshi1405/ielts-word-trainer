-- Migration: 20260910000004_create_user_verb_progress.sql
-- Description: Create user_verb_progress table for individual verb mastery, spaced repetition, and performance tracking.

-- 1. Create user_verb_progress Table
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

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_user ON public.user_verb_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_verb ON public.user_verb_progress(verb_id);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_status ON public.user_verb_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_is_weak ON public.user_verb_progress(is_weak);
CREATE INDEX IF NOT EXISTS idx_user_verb_progress_next_review ON public.user_verb_progress(next_review_at);

-- Additional indexes on verbs table for fast search and filtering
CREATE INDEX IF NOT EXISTS idx_verbs_past_form ON public.verbs(past_form);
CREATE INDEX IF NOT EXISTS idx_verbs_past_participle ON public.verbs(past_participle);
CREATE INDEX IF NOT EXISTS idx_verbs_is_common ON public.verbs(is_common);

-- 3. Row Level Security
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

-- 4. Automatic updated_at Trigger
DROP TRIGGER IF EXISTS trigger_user_verb_progress_updated_at ON public.user_verb_progress;
CREATE TRIGGER trigger_user_verb_progress_updated_at
  BEFORE UPDATE ON public.user_verb_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
