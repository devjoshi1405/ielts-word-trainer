import { UNIQUE_VOCABULARY_ITEMS } from "../data/vocabulary";
import { exerciseGenerator } from "../lib/exercises/exercise-generator";
import { createSupabaseAdminClient } from "../lib/supabase/server";
import { VocabularyRow, QuestionRow } from "../types/database.types";

/**
 * Seeder script to populate Supabase database with the 1,000+ IELTS vocabulary words
 * and generated exercise question bank.
 */
export async function seedSupabase() {
  console.log("==========================================================");
  console.log("   IELTS WORD TRAINER — SUPABASE SEED SCRIPT             ");
  console.log("==========================================================");

  console.log(`[1] Preparing ${UNIQUE_VOCABULARY_ITEMS.length} vocabulary records...`);

  const vocabRows: VocabularyRow[] = UNIQUE_VOCABULARY_ITEMS.map((v) => ({
    id: v.id,
    word: v.word,
    category: v.category,
    level: v.level,
    meaning: v.meaning,
    pronunciation: v.pronunciation || null,
    phonetic: v.phonetic || null,
    example_sentence: v.exampleSentence || null,
    common_misspellings: v.commonMisspellings || [],
    common_phrases: v.commonPhrases || [],
    is_ielts_common: (v as any).isIELTSCommon ?? (v as any).isIeltsCommon ?? true,
    created_at: new Date().toISOString(),
  }));

  console.log(`[2] Generating exercise questions suite...`);
  const sampleExercises = exerciseGenerator.generateExercises({ limit: 100 });
  const questionRows: QuestionRow[] = sampleExercises.map((ex) => ({
    id: ex.id,
    vocabulary_id: ex.vocabularyId || null,
    type: ex.type,
    transcript: ex.transcript,
    target_text: ex.targetText,
    audio_url: ex.audioUrl || null,
    difficulty: ex.difficulty || "intermediate",
    category: ex.category,
    explanation: ex.explanation || null,
    created_at: new Date().toISOString(),
  }));

  const client = createSupabaseAdminClient();

  if (!client) {
    console.log("⚠️  Supabase environment not configured (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY unset).");
    console.log("ℹ️  Generated in-memory seed records:");
    console.log(`    - Vocabulary items: ${vocabRows.length}`);
    console.log(`    - Sample questions: ${questionRows.length}`);
    console.log("✅ Seed dataset generated successfully for local/in-memory use.");
    return { vocabRows, questionRows, seededRemote: false };
  }

  console.log("[3] Seeding vocabulary into Supabase...");
  const { error: vocabError } = await (client
    .from("vocabulary") as any)
    .upsert(vocabRows, { onConflict: "id" });

  if (vocabError) {
    console.error("❌ Failed to seed vocabulary:", vocabError.message);
  } else {
    console.log(`✓ Successfully seeded ${vocabRows.length} vocabulary rows.`);
  }

  console.log("[4] Seeding questions into Supabase...");
  const { error: questionsError } = await (client
    .from("questions") as any)
    .upsert(questionRows, { onConflict: "id" });

  if (questionsError) {
    console.error("❌ Failed to seed questions:", questionsError.message);
  } else {
    console.log(`✓ Successfully seeded ${questionRows.length} question rows.`);
  }

  console.log("==========================================================");
  console.log("   SEEDING PROCESS COMPLETE                              ");
  console.log("==========================================================");
  return { vocabRows, questionRows, seededRemote: true };
}

if (require.main === module) {
  seedSupabase().catch((err) => {
    console.error("Fatal seed error:", err);
    process.exit(1);
  });
}
