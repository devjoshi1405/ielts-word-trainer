-- ==============================================================================
-- Migration: 20260910000005_enhance_grammar_progress_for_tenses.sql
-- Description: Adds multi-attempt tracking, weak area detection, and resume state
-- to user_grammar_progress and supports tense question types in grammar_questions.
-- ==============================================================================

-- 1. Safely add multi-attempt and weak-area columns to user_grammar_progress
ALTER TABLE public.user_grammar_progress 
  ADD COLUMN IF NOT EXISTS best_score NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS latest_score NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_score NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weak_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS last_section TEXT,
  ADD COLUMN IF NOT EXISTS last_stage TEXT DEFAULT 'learning';

-- 2. Drop old check constraint on grammar_questions.question_type if exists and recreate with expanded types
DO $$
BEGIN
  ALTER TABLE public.grammar_questions DROP CONSTRAINT IF EXISTS grammar_questions_question_type_check;
  ALTER TABLE public.grammar_questions ADD CONSTRAINT grammar_questions_question_type_check 
    CHECK (question_type IN (
      'multiple_choice',
      'identify_part_of_speech',
      'fill_blank',
      'error_identification',
      'sentence_arrangement',
      'tense_conversion',
      'do_does',
      'did',
      'v1_v2',
      'negative_sentence',
      'sentence_building'
    ));
EXCEPTION
  WHEN OTHERS THEN
    -- In case table does not exist or constraint already modified
    NULL;
END $$;

-- 3. Ensure Tenses category exists in grammar_categories
INSERT INTO public.grammar_categories (name, slug, description, display_order, is_active)
VALUES (
  'Tenses & Aspect',
  'tenses',
  'Master Simple Present, Simple Past, and English tense aspects critical for IELTS Writing & Speaking.',
  9,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Ensure Simple Present and Simple Past topics exist in grammar_topics
DO $$
DECLARE
  tenses_cat_id UUID;
BEGIN
  SELECT id INTO tenses_cat_id FROM public.grammar_categories WHERE slug = 'tenses' LIMIT 1;
  IF tenses_cat_id IS NOT NULL THEN
    INSERT INTO public.grammar_topics (category_id, name, slug, description, difficulty, display_order, is_active)
    VALUES 
      (
        tenses_cat_id,
        'Simple Present Tense',
        'simple-present',
        'Express routines, facts, general truths, and IELTS Task 1 static trends.',
        'beginner',
        1,
        true
      ),
      (
        tenses_cat_id,
        'Simple Past Tense',
        'simple-past',
        'Report completed past events, historical data, and IELTS Speaking Part 2 stories.',
        'beginner',
        2,
        true
      )
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;
