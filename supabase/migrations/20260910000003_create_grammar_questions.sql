-- ==============================================================================
-- Grammar Master Migration: grammar_questions table & RLS policies
-- ==============================================================================

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

-- Updated_at trigger
DROP TRIGGER IF EXISTS trigger_grammar_questions_updated_at ON public.grammar_questions;
CREATE TRIGGER trigger_grammar_questions_updated_at
  BEFORE UPDATE ON public.grammar_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
