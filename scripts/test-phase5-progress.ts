import fs from "fs";
import path from "path";
import {
  calculateProgressStats,
  calculateStreak,
  calculateWeeklyActivity,
} from "../lib/progress/progress-calculator";
import { LocalProgressService } from "../lib/progress/local-progress-service";
import { ProgressManager } from "../lib/progress/progress-manager";
import { isSupabaseConfigured } from "../lib/supabase/client";
import { seedSupabase } from "./seed-supabase";
import { UserAttemptRow, UserProgressRow } from "../types/database.types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

let totalTests = 0;
let passedTests = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(() => {
        passedTests++;
        console.log(`  ✓ [TEST ${totalTests.toString().padStart(2, "0")}]: ${name}`);
      });
    } else {
      passedTests++;
      console.log(`  ✓ [TEST ${totalTests.toString().padStart(2, "0")}]: ${name}`);
    }
  } catch (err: any) {
    console.error(`  ✗ [TEST ${totalTests.toString().padStart(2, "0")}]: ${name}`);
    console.error(`     Error: ${err?.message}`);
    throw err;
  }
}

async function main() {
  console.log("==========================================================");
  console.log("   IELTS WORD TRAINER — PHASE 5 PROGRESS & DB TESTS       ");
  console.log("==========================================================");

  console.log("\n[PART 1] Supabase SQL Schema & Migration Verification:");

  runTest("1. Migration file exists and contains all 5 required tables", () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "20260910000001_create_ielts_tables.sql"
    );
    assert(fs.existsSync(migrationPath), "Migration file must exist");
    const content = fs.readFileSync(migrationPath, "utf-8");

    assert(content.includes("CREATE TABLE IF NOT EXISTS public.profiles"), "profiles table missing");
    assert(content.includes("CREATE TABLE IF NOT EXISTS public.vocabulary"), "vocabulary table missing");
    assert(content.includes("CREATE TABLE IF NOT EXISTS public.questions"), "questions table missing");
    assert(content.includes("CREATE TABLE IF NOT EXISTS public.user_attempts"), "user_attempts table missing");
    assert(content.includes("CREATE TABLE IF NOT EXISTS public.user_progress"), "user_progress table missing");
  });

  runTest("2. Schema defines foreign keys, constraints, and indexes", () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "20260910000001_create_ielts_tables.sql"
    );
    const content = fs.readFileSync(migrationPath, "utf-8");

    assert(content.includes("REFERENCES public.vocabulary(id)"), "questions vocabulary_id FK missing");
    assert(content.includes("REFERENCES public.profiles(id)"), "user_attempts user_id FK missing");
    assert(content.includes("CONSTRAINT unique_user_vocabulary UNIQUE"), "unique user_vocabulary constraint missing");
    assert(content.includes("CREATE INDEX IF NOT EXISTS idx_user_attempts_user_id"), "user_attempts index missing");
    assert(content.includes("CREATE INDEX IF NOT EXISTS idx_user_progress_mastery"), "user_progress mastery index missing");
  });

  runTest("3. Schema enables Row Level Security (RLS) on user tables", () => {
    const migrationPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "20260910000001_create_ielts_tables.sql"
    );
    const content = fs.readFileSync(migrationPath, "utf-8");

    assert(content.includes("ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY"), "profiles RLS missing");
    assert(content.includes("ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY"), "user_attempts RLS missing");
    assert(content.includes("ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY"), "user_progress RLS missing");
  });

  console.log("\n[PART 2] Seeding Engine Verification:");

  await runTest("4. Seeding engine prepares 1,000+ vocabulary rows and question bank", async () => {
    const seedResult = await seedSupabase();
    assert(seedResult.vocabRows.length >= 1000, `Expected 1000+ vocab rows, got ${seedResult.vocabRows.length}`);
    assert(seedResult.questionRows.length > 0, "Question rows must be generated");

    const sample = seedResult.vocabRows.find((v) => v.word.toLowerCase() === "accommodation");
    assert(Boolean(sample), "accommodation must be in seeded vocabulary");
    assert(sample?.category === "accommodation", "category must match");
  });

  console.log("\n[PART 3] Progress Calculation Engine Tests:");

  runTest("5. Accuracy calculation: 0 attempts -> 0%", () => {
    const stats = calculateProgressStats([], []);
    assert(stats.accuracy === 0, "Accuracy with 0 attempts must be 0");
    assert(stats.questionsCompleted === 0, "Questions completed must be 0");
  });

  runTest("6. Accuracy calculation: 8 correct / 10 total -> 80%", () => {
    const dummyAttempts: UserAttemptRow[] = [
      { id: "1", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "2", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "3", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "4", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "5", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "6", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "7", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "8", user_id: "u", question_id: "q", user_answer: "a", correct_answer: "a", is_correct: true, mistake_type: null, attempt_number: 1, created_at: new Date().toISOString() },
      { id: "9", user_id: "u", question_id: "q", user_answer: "b", correct_answer: "a", is_correct: false, mistake_type: "spelling", attempt_number: 1, created_at: new Date().toISOString() },
      { id: "10", user_id: "u", question_id: "q", user_answer: "b", correct_answer: "a", is_correct: false, mistake_type: "spelling", attempt_number: 1, created_at: new Date().toISOString() },
    ];

    const stats = calculateProgressStats(dummyAttempts, []);
    assert(stats.accuracy === 80, `Expected 80% accuracy, got ${stats.accuracy}%`);
    assert(stats.questionsCompleted === 10, "Questions completed must be 10");
    assert(stats.correctAnswers === 8, "Correct answers must be 8");
    assert(stats.incorrectAnswers === 2, "Incorrect answers must be 2");
  });

  runTest("7. Streak calculation: consecutive active days leading to today", () => {
    const today = new Date();
    const d0 = today.toISOString();
    const d1 = new Date(today.getTime() - 86400000).toISOString();
    const d2 = new Date(today.getTime() - 2 * 86400000).toISOString();
    const d3 = new Date(today.getTime() - 3 * 86400000).toISOString();

    const streak4 = calculateStreak([d0, d1, d2, d3]);
    assert(streak4 === 4, `Expected 4-day streak, got ${streak4}`);

    // Broken streak (skipping yesterday)
    const brokenStreak = calculateStreak([d0, d2, d3]);
    assert(brokenStreak === 1, `Expected 1-day streak for broken sequence, got ${brokenStreak}`);

    // Inactive for 5 days
    const oldDate = new Date(today.getTime() - 5 * 86400000).toISOString();
    const inactiveStreak = calculateStreak([oldDate]);
    assert(inactiveStreak === 0, `Expected 0-day streak for inactive user, got ${inactiveStreak}`);
  });

  runTest("8. Words mastered & difficult words calculation", () => {
    const progressList: UserProgressRow[] = [
      { id: "p1", user_id: "u", vocabulary_id: "v1", correct_count: 5, incorrect_count: 0, consecutive_correct: 3, mastery_level: "mastered", last_reviewed: null, next_review: null, created_at: "" },
      { id: "p2", user_id: "u", vocabulary_id: "v2", correct_count: 3, incorrect_count: 0, consecutive_correct: 3, mastery_level: "almost-mastered", last_reviewed: null, next_review: null, created_at: "" },
      { id: "p3", user_id: "u", vocabulary_id: "v3", correct_count: 0, incorrect_count: 3, consecutive_correct: 0, mastery_level: "critical", last_reviewed: null, next_review: null, created_at: "" },
      { id: "p4", user_id: "u", vocabulary_id: "v4", correct_count: 1, incorrect_count: 2, consecutive_correct: 0, mastery_level: "critical", last_reviewed: null, next_review: null, created_at: "" },
    ];

    const stats = calculateProgressStats([], progressList);
    assert(stats.wordsMastered === 2, `Expected 2 words mastered, got ${stats.wordsMastered}`);
    assert(stats.difficultWords === 2, `Expected 2 difficult words, got ${stats.difficultWords}`);
  });

  runTest("9. Weekly activity breakdown returns 7 days", () => {
    const weekly = calculateWeeklyActivity([
      { created_at: new Date().toISOString(), is_correct: true },
    ]);
    assert(weekly.length === 7, "Weekly activity must return 7 days");
    const todayActivity = weekly[weekly.length - 1];
    assert(todayActivity.count >= 1, "Today's activity count must be >= 1");
  });

  console.log("\n[PART 4] LocalProgressService & Mastery Progression Tests:");

  const localService = new LocalProgressService();
  await localService.resetProgress?.();

  await runTest("10. LocalProgressService starts with clean initial stats", async () => {
    const stats = await localService.getDashboardStats();
    assert(stats.questionsCompleted === 0, "Initial questions completed must be 0");
    assert(stats.wordsMastered === 0, "Initial words mastered must be 0");
  });

  await runTest("11. Attempt recording updates attempts and increases questions completed", async () => {
    await localService.recordAttempt({
      questionId: "q-accommodation",
      userAnswer: "accommodation",
      correctAnswer: "accommodation",
      isCorrect: true,
      category: "accommodation",
      attemptNumber: 1,
    });

    const stats = await localService.getDashboardStats();
    assert(stats.questionsCompleted === 1, `Questions completed expected 1, got ${stats.questionsCompleted}`);
    assert(stats.listeningAccuracy === 100, `Accuracy expected 100%, got ${stats.listeningAccuracy}%`);
  });

  await runTest("12. Consecutive correct answers (3x) transitions word to 'mastered'", async () => {
    await localService.recordAttempt({
      questionId: "q-environment",
      userAnswer: "environment",
      correctAnswer: "environment",
      isCorrect: true,
      category: "environment",
    });
    await localService.recordAttempt({
      questionId: "q-environment",
      userAnswer: "environment",
      correctAnswer: "environment",
      isCorrect: true,
      category: "environment",
    });
    await localService.recordAttempt({
      questionId: "q-environment",
      userAnswer: "environment",
      correctAnswer: "environment",
      isCorrect: true,
      category: "environment",
    });

    const stats = await localService.getDashboardStats();
    assert(stats.wordsMastered >= 1, `Words mastered should be >= 1, got ${stats.wordsMastered}`);
  });

  await runTest("13. Incorrect attempt creates a mistake entry in My Mistakes", async () => {
    await localService.recordAttempt({
      questionId: "q-necessary",
      userAnswer: "neccessary",
      correctAnswer: "necessary",
      isCorrect: false,
      mistakeType: "spelling",
      category: "academic",
    });

    const mistakes = await localService.getMistakes();
    assert(mistakes.length >= 1, `Expected at least 1 mistake, got ${mistakes.length}`);
    const necMistake = mistakes.find((m) => m.word.toLowerCase() === "necessary");
    assert(Boolean(necMistake), "'necessary' should be in mistake bank");
    assert(necMistake?.errorCount === 1, "Error count should be 1");
    assert(necMistake?.userLastAttempt === "neccessary", "userLastAttempt must be recorded");
  });

  await runTest("14. Multiple mistakes on same word increments errorCount", async () => {
    await localService.recordAttempt({
      questionId: "q-necessary",
      userAnswer: "necesary",
      correctAnswer: "necessary",
      isCorrect: false,
      mistakeType: "spelling",
      category: "academic",
    });

    const mistakes = await localService.getMistakes();
    const necMistake = mistakes.find((m) => m.word.toLowerCase() === "necessary");
    assert(necMistake?.errorCount === 2, `Error count expected 2, got ${necMistake?.errorCount}`);
  });

  await runTest("15. removeMistake() dismisses item from active mistake bank", async () => {
    const mistakesBefore = await localService.getMistakes();
    const firstId = mistakesBefore[0].id;
    await localService.removeMistake(firstId);

    const mistakesAfter = await localService.getMistakes();
    assert(!mistakesAfter.some((m) => m.id === firstId), "Removed mistake should not appear in active bank");
  });

  console.log("\n[PART 5] ProgressManager & Safety Tests:");

  runTest("16. ProgressManager selects correct provider without throwing", () => {
    const manager = new ProgressManager();
    const active = manager.getActiveService();
    assert(Boolean(active), "Active progress service must be initialized");
  });

  runTest("17. Supabase client safety: isSupabaseConfigured() operates safely without env crash", () => {
    const isConfigured = isSupabaseConfigured();
    assert(typeof isConfigured === "boolean", "isSupabaseConfigured must return boolean");
  });

  console.log("\n==========================================================");
  console.log(`   ALL ${passedTests}/${totalTests} PHASE 5 TESTS PASSED!            `);
  console.log("==========================================================");
}

main().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
