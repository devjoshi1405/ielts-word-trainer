import { classifyMistake } from "../lib/mistakes/mistake-classifier";
import {
  calculateMastery,
  getSRSIntervalMs,
  processAttemptSRS,
  formatNextReviewDisplay,
  calculateMistakePriority,
} from "../lib/mistakes/srs-engine";
import { localProgressService } from "../lib/progress/local-progress-service";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runTests() {
  console.log("\n🧪 Running Phase 6 Intelligent Non-AI Mistake Review Engine Tests...\n");

  // ==========================================
  // TEST SUITE 1: 9 Mistake Classification Types
  // ==========================================
  console.log("--- 1. Testing Deterministic 9-Type Mistake Classifier ---");

  // 1. Spelling Mistake
  const spellingTest = classifyMistake("accomodation", "accommodation");
  assert(spellingTest.type === "spelling", `Spelling check: accomodation -> accommodation (got: ${spellingTest.type})`);

  const spellingTest2 = classifyMistake("occured", "occurred");
  assert(spellingTest2.type === "spelling", `Spelling check: occured -> occurred (got: ${spellingTest2.type})`);

  // 2. Singular / Plural Mistake
  const spTest1 = classifyMistake("analysis", "analyses");
  assert(spTest1.type === "singular-plural", `Singular/Plural irregular: analysis -> analyses (got: ${spTest1.type})`);

  const spTest2 = classifyMistake("child", "children");
  assert(spTest2.type === "singular-plural", `Singular/Plural irregular: child -> children (got: ${spTest2.type})`);

  const spTest3 = classifyMistake("students", "student");
  assert(spTest3.type === "singular-plural", `Singular/Plural regular: students -> student (got: ${spTest3.type})`);

  // 3. Article Mistake
  const articleTest1 = classifyMistake("an university", "a university");
  assert(articleTest1.type === "article", `Article check: an university -> a university (got: ${articleTest1.type})`);

  const articleTest2 = classifyMistake("apple", "an apple");
  assert(articleTest2.type === "article", `Article check: apple -> an apple (got: ${articleTest2.type})`);

  const articleTest3 = classifyMistake("the sun", "a sun");
  assert(articleTest3.type === "article", `Article check: the sun -> a sun (got: ${articleTest3.type})`);

  // 4. Preposition Mistake
  const prepTest1 = classifyMistake("depend of", "depend on");
  assert(prepTest1.type === "preposition", `Preposition check: depend of -> depend on (got: ${prepTest1.type})`);

  const prepTest2 = classifyMistake("interested on", "interested in");
  assert(prepTest2.type === "preposition", `Preposition check: interested on -> interested in (got: ${prepTest2.type})`);

  // 5. Number Mistake
  const numTest1 = classifyMistake("14", "40");
  assert(numTest1.type === "number", `Number check: 14 -> 40 (got: ${numTest1.type})`);

  const numTest2 = classifyMistake("fifteen", "fifty");
  assert(numTest2.type === "number", `Number check: fifteen -> fifty (got: ${numTest2.type})`);

  const numTest3 = classifyMistake("£50", "$50");
  assert(numTest3.type === "number", `Number currency check: £50 -> $50 (got: ${numTest3.type})`);

  // 6. Date / Time Mistake
  const dateTest1 = classifyMistake("14th May", "14th March");
  assert(dateTest1.type === "date-time", `Date check: 14th May -> 14th March (got: ${dateTest1.type})`);

  const timeTest1 = classifyMistake("10:30 am", "10:30 pm");
  assert(timeTest1.type === "date-time", `Time check: 10:30 am -> 10:30 pm (got: ${timeTest1.type})`);

  // 7. Missing Word
  const missingTest = classifyMistake("spite of", "in spite of");
  assert(missingTest.type === "missing-word" || missingTest.type === "preposition", `Missing word check (got: ${missingTest.type})`);

  // 8. Extra Word
  const extraTest = classifyMistake("at in the morning", "in the morning");
  assert(extraTest.type === "extra-word" || extraTest.type === "preposition", `Extra word check (got: ${extraTest.type})`);

  // 9. Wrong Word
  const wrongWordTest = classifyMistake("refrigerator", "accommodation");
  assert(wrongWordTest.type === "wrong-word", `Wrong word check: refrigerator -> accommodation (got: ${wrongWordTest.type})`);

  // ==========================================
  // TEST SUITE 2: Mastery Level Progression (0 to 4)
  // ==========================================
  console.log("\n--- 2. Testing 5-Tier Mastery Levels (0 to 4) ---");

  // 0 = New
  const m0 = calculateMastery(0, 0, 0);
  assert(m0.numeric === 0 && m0.level === "new", `Mastery 0 check: New (numeric: ${m0.numeric})`);

  // 1 = Learning (failed attempt or 0 consecutive correct)
  const m1 = calculateMastery(2, 0, 2);
  assert(m1.numeric === 1 && m1.level === "learning", `Mastery 1 check: Learning (numeric: ${m1.numeric})`);

  // 2 = Practicing (1 consecutive correct)
  const m2 = calculateMastery(3, 1, 2);
  assert(m2.numeric === 2 && m2.level === "practicing", `Mastery 2 check: Practicing (numeric: ${m2.numeric})`);

  // 3 = Familiar (2 consecutive correct)
  const m3 = calculateMastery(4, 2, 2);
  assert(m3.numeric === 3 && m3.level === "familiar", `Mastery 3 check: Familiar (numeric: ${m3.numeric})`);

  // 4 = Mastered (3+ consecutive correct)
  const m4 = calculateMastery(5, 3, 2);
  assert(m4.numeric === 4 && m4.level === "mastered", `Mastery 4 check: Mastered after 3 consecutive correct (numeric: ${m4.numeric})`);

  // ==========================================
  // TEST SUITE 3: Spaced Repetition (SRS) Intervals
  // ==========================================
  console.log("\n--- 3. Testing SRS Review Intervals ---");

  const MINUTE_MS = 60 * 1000;
  const HOUR_MS = 60 * MINUTE_MS;
  const DAY_MS = 24 * HOUR_MS;

  // Mistake -> Review soon (20 minutes)
  const intervalMistake = getSRSIntervalMs(0, false);
  assert(intervalMistake === 20 * MINUTE_MS, `First mistake interval: 20m (got: ${intervalMistake / MINUTE_MS}m)`);

  // 1st Correct -> 1 day
  const interval1 = getSRSIntervalMs(1, true);
  assert(interval1 === 1 * DAY_MS, `1st correct interval: 1 day (got: ${interval1 / DAY_MS}d)`);

  // 2nd Correct -> 3 days
  const interval2 = getSRSIntervalMs(2, true);
  assert(interval2 === 3 * DAY_MS, `2nd correct interval: 3 days (got: ${interval2 / DAY_MS}d)`);

  // 3rd Correct -> 7 days
  const interval3 = getSRSIntervalMs(3, true);
  assert(interval3 === 7 * DAY_MS, `3rd correct interval: 7 days (got: ${interval3 / DAY_MS}d)`);

  // 4th Correct -> 14 days
  const interval4 = getSRSIntervalMs(4, true);
  assert(interval4 === 14 * DAY_MS, `4th correct interval: 14 days (got: ${interval4 / DAY_MS}d)`);

  // 5th Correct -> 30 days
  const interval5 = getSRSIntervalMs(5, true);
  assert(interval5 === 30 * DAY_MS, `5th correct interval: 30 days (got: ${interval5 / DAY_MS}d)`);

  // ==========================================
  // TEST SUITE 4: End-to-End Progress Service Recording
  // ==========================================
  console.log("\n--- 4. Testing End-to-End Progress Recording with Live Classification ---");

  await localProgressService.resetProgress?.();

  // Attempt 1: Wrong Answer ("acomodation" for "accommodation")
  await localProgressService.recordAttempt({
    questionId: "q-test-1",
    vocabularyId: "vocab-accommodation",
    userAnswer: "acomodation",
    correctAnswer: "accommodation",
    isCorrect: false,
    attemptNumber: 1,
  });

  let mistakes = await localProgressService.getMistakes();
  assert(mistakes.length === 1, `Recorded 1 mistake in database (got: ${mistakes.length})`);
  assert(mistakes[0].mistakeType === "spelling", `Classified as spelling mistake (got: ${mistakes[0].mistakeType})`);
  assert(mistakes[0].masteryNumeric === 1, `Mastery is Level 1 (Learning) on failure (got: ${mistakes[0].masteryNumeric})`);
  assert(mistakes[0].isDue === true, `Item is marked due for immediate review`);

  // Attempt 2: Correct Answer 1 ("accommodation")
  await localProgressService.recordAttempt({
    questionId: "q-test-1",
    vocabularyId: "vocab-accommodation",
    userAnswer: "accommodation",
    correctAnswer: "accommodation",
    isCorrect: true,
    attemptNumber: 1,
  });

  mistakes = await localProgressService.getMistakes();
  assert(mistakes[0].consecutiveCorrect === 1, `Consecutive correct upgraded to 1 (got: ${mistakes[0].consecutiveCorrect})`);
  assert(mistakes[0].masteryNumeric === 2, `Mastery upgraded to Level 2 (Practicing) (got: ${mistakes[0].masteryNumeric})`);

  // Attempt 3: Correct Answer 2 ("accommodation")
  await localProgressService.recordAttempt({
    questionId: "q-test-1",
    vocabularyId: "vocab-accommodation",
    userAnswer: "accommodation",
    correctAnswer: "accommodation",
    isCorrect: true,
    attemptNumber: 1,
  });

  mistakes = await localProgressService.getMistakes();
  assert(mistakes[0].masteryNumeric === 3, `Mastery upgraded to Level 3 (Familiar) (got: ${mistakes[0].masteryNumeric})`);

  // Attempt 4: Correct Answer 3 ("accommodation")
  await localProgressService.recordAttempt({
    questionId: "q-test-1",
    vocabularyId: "vocab-accommodation",
    userAnswer: "accommodation",
    correctAnswer: "accommodation",
    isCorrect: true,
    attemptNumber: 1,
  });

  mistakes = await localProgressService.getMistakes();
  assert(mistakes[0].masteryNumeric === 4, `Mastery upgraded to Level 4 (Mastered) after 3 consecutive correct! (got: ${mistakes[0].masteryNumeric})`);

  console.log("\n🎉 ALL PHASE 6 TESTS PASSED SUCCESSFULLY! 🚀\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
