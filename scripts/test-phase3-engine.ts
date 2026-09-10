import { validateAnswer, normalizeText } from "../lib/validation/answer-validator";
import { exerciseGenerator } from "../lib/exercises/exercise-generator";
import { exerciseService } from "../lib/exercises/mock-exercise-service";
import { ExerciseQuestion } from "../types/exercise.types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

function runPhase3EngineTests() {
  console.log("==========================================================");
  console.log("   IELTS WORD TRAINER — PHASE 3 EXERCISE ENGINE TESTS     ");
  console.log("==========================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function test(name: string, fn: () => void) {
    totalTests++;
    try {
      fn();
      console.log(`  ✓ [TEST ${totalTests.toString().padStart(2, "0")}]: ${name}`);
      passedTests++;
    } catch (err: any) {
      console.error(`  ✗ [TEST ${totalTests.toString().padStart(2, "0")} FAILED]: ${name}`);
      console.error(`    ${err.message}`);
      throw err;
    }
  }

  // --- PART 1: NORMALIZATION & BASIC SPELLING ---
  console.log("[PART 1] Normalization & Basic Spelling Tests:");

  test("1. Case insensitivity: 'Accommodation' matches 'accommodation'", () => {
    const res = validateAnswer("Accommodation", "accommodation");
    assert(res.isCorrect, "Expected case-insensitive match");
  });

  test("2. Whitespace trimming: '   necessary   ' matches 'necessary'", () => {
    const res = validateAnswer("   necessary   ", "necessary");
    assert(res.isCorrect, "Expected trimmed whitespace match");
  });

  test("3. Multiple internal spaces collapsed: 'working   hypothesis' matches 'working hypothesis'", () => {
    const res = validateAnswer("working   hypothesis", "working hypothesis");
    assert(res.isCorrect, "Expected space collapsing match");
  });

  test("4. Smart quotes normalization: '’' and '“' are normalized", () => {
    assert(normalizeText("‘single room’") === "'single room'", "Smart single quotes should become standard");
    assert(normalizeText("“paradigm shift”") === "'paradigm shift'", "Smart double quotes should become standard");
  });

  test("5. Strict spelling failure: 'acommodation' fails against 'accommodation'", () => {
    const res = validateAnswer("acommodation", "accommodation");
    assert(!res.isCorrect, "Expected misspelling to fail");
  });

  test("6. Strict spelling failure: 'enviroment' fails against 'environment'", () => {
    const res = validateAnswer("enviroment", "environment");
    assert(!res.isCorrect, "Expected missing 'n' in environment to fail");
  });

  // --- PART 2: QUESTION TYPES TESTS (ALL 9 TYPES) ---
  console.log("\n[PART 2] All 9 Question Types Verification (20+ Target Scenarios):");

  // Type 1: WORD
  test("7. Type [WORD]: exact match 'biodiversity'", () => {
    const res = validateAnswer("biodiversity", "biodiversity", { type: "WORD" });
    assert(res.isCorrect, "WORD exact match should pass");
  });

  test("8. Type [WORD]: misspelling 'biodivercity' fails", () => {
    const res = validateAnswer("biodivercity", "biodiversity", { type: "WORD" });
    assert(!res.isCorrect, "WORD misspelling should fail");
  });

  // Type 2: ARTICLE_WORD
  test("9. Type [ARTICLE_WORD]: exact match 'an accommodation'", () => {
    const res = validateAnswer("an accommodation", "an accommodation", { type: "ARTICLE_WORD" });
    assert(res.isCorrect, "ARTICLE_WORD exact match should pass");
  });

  test("10. Type [ARTICLE_WORD]: wrong article 'a accommodation' fails", () => {
    const res = validateAnswer("a accommodation", "an accommodation", { type: "ARTICLE_WORD" });
    assert(!res.isCorrect, "Wrong article 'a' vs 'an' should fail");
  });

  test("11. Type [ARTICLE_WORD]: missing article 'accommodation' fails", () => {
    const res = validateAnswer("accommodation", "an accommodation", { type: "ARTICLE_WORD" });
    assert(!res.isCorrect, "Missing article should fail");
  });

  // Type 3: PREPOSITION_PHRASE
  test("12. Type [PREPOSITION_PHRASE]: exact match 'near the railway station'", () => {
    const res = validateAnswer("near the railway station", "near the railway station", { type: "PREPOSITION_PHRASE" });
    assert(res.isCorrect, "PREPOSITION_PHRASE exact match should pass");
  });

  test("13. Type [PREPOSITION_PHRASE]: wrong preposition 'in the railway station' fails", () => {
    const res = validateAnswer("in the railway station", "near the railway station", { type: "PREPOSITION_PHRASE" });
    assert(!res.isCorrect, "Wrong preposition should fail");
  });

  test("14. Type [PREPOSITION_PHRASE]: missing words 'near station' fails", () => {
    const res = validateAnswer("near station", "near the railway station", { type: "PREPOSITION_PHRASE" });
    assert(!res.isCorrect, "Missing 'the railway' should fail");
  });

  // Type 4: PHRASE
  test("15. Type [PHRASE]: exact collocation 'paradigm shift'", () => {
    const res = validateAnswer("paradigm shift", "paradigm shift", { type: "PHRASE" });
    assert(res.isCorrect, "PHRASE exact match should pass");
  });

  test("16. Type [PHRASE]: extra word 'a paradigm shift' fails if target is 'paradigm shift'", () => {
    const res = validateAnswer("a paradigm shift", "paradigm shift", { type: "PHRASE" });
    assert(!res.isCorrect, "Extra word should fail exact phrase target");
  });

  // Type 5: SENTENCE_TARGET
  test("17. Type [SENTENCE_TARGET]: extracted clause 'suitable accommodation'", () => {
    const res = validateAnswer("suitable accommodation", "suitable accommodation", { type: "SENTENCE_TARGET" });
    assert(res.isCorrect, "SENTENCE_TARGET exact match should pass");
  });

  // Type 6: SPELLING
  test("18. Type [SPELLING]: 'questionnaire' vs 'questionaire'", () => {
    const correctRes = validateAnswer("questionnaire", "questionnaire", { type: "SPELLING" });
    const wrongRes = validateAnswer("questionaire", "questionnaire", { type: "SPELLING" });
    assert(correctRes.isCorrect, "Correct spelling should pass");
    assert(!wrongRes.isCorrect, "Common misspelling 'questionaire' should fail");
  });

  // Type 7: NUMBER
  test("19. Type [NUMBER]: currency formats '£450.50' vs '450.50 pounds' vs '450.50'", () => {
    const res1 = validateAnswer("£450.50", "£450.50", { type: "NUMBER", category: "numbers" });
    const res2 = validateAnswer("450.50 pounds", "£450.50", { type: "NUMBER", category: "numbers" });
    const res3 = validateAnswer("450.50", "£450.50", { type: "NUMBER", category: "numbers" });
    assert(res1.isCorrect, "£450.50 should match");
    assert(res2.isCorrect, "450.50 pounds should match");
    assert(res3.isCorrect, "450.50 should match");
  });

  test("20. Type [NUMBER]: phone number spacing '07894551203' vs '07894 551203'", () => {
    const res = validateAnswer("07894551203", "07894 551203", { type: "NUMBER", category: "numbers" });
    assert(res.isCorrect, "Phone numbers without spaces should match target with spaces");
  });

  test("21. Type [NUMBER]: percentages '78.4%' vs '78.4 percent'", () => {
    const res1 = validateAnswer("78.4%", "78.4%", { type: "NUMBER", category: "numbers" });
    const res2 = validateAnswer("78.4 percent", "78.4%", { type: "NUMBER", category: "numbers" });
    assert(res1.isCorrect, "78.4% should match");
    assert(res2.isCorrect, "78.4 percent should match");
  });

  // Type 8: DATE
  test("22. Type [DATE]: date variations '14th October' vs '14 October' vs '14th of October'", () => {
    const res1 = validateAnswer("14th October", "14th October", { type: "DATE", category: "dates-times", acceptedAnswers: ["14 October", "14th of October"] });
    const res2 = validateAnswer("14 October", "14th October", { type: "DATE", category: "dates-times", acceptedAnswers: ["14 October", "14th of October"] });
    const res3 = validateAnswer("14th of October", "14th October", { type: "DATE", category: "dates-times", acceptedAnswers: ["14 October", "14th of October"] });
    assert(res1.isCorrect, "14th October should match");
    assert(res2.isCorrect, "14 October should match");
    assert(res3.isCorrect, "14th of October should match");
  });

  // Type 9: TIME
  test("23. Type [TIME]: time variations '9:45 am' vs '9:45am' vs '9.45 am' vs 'quarter to ten'", () => {
    const opts = { type: "TIME" as const, category: "dates-times", acceptedAnswers: ["9:45am", "9.45 am", "quarter to ten"] };
    assert(validateAnswer("9:45 am", "9:45 am", opts).isCorrect, "9:45 am match");
    assert(validateAnswer("9:45am", "9:45 am", opts).isCorrect, "9:45am match");
    assert(validateAnswer("9.45 am", "9:45 am", opts).isCorrect, "9.45 am match");
    assert(validateAnswer("quarter to ten", "9:45 am", opts).isCorrect, "quarter to ten match");
  });

  // --- PART 3: MULTI-ATTEMPT RETRY STATE MACHINE ---
  console.log("\n[PART 3] Multi-Attempt Retry State Machine Tests:");

  test("24. Attempt 1 Failure: canRetry = true, isRevealed = false", () => {
    const res = validateAnswer("acommodation", "accommodation", { attemptNumber: 1, maxAttempts: 2 });
    assert(!res.isCorrect, "Attempt 1 is incorrect");
    assert(res.canRetry === true, "Should allow retry on attempt 1");
    assert(res.isRevealed === false, "Should NOT reveal correct answer on attempt 1");
  });

  test("25. Attempt 2 Failure (Exhausted): canRetry = false, isRevealed = true", () => {
    const res = validateAnswer("acommodation", "accommodation", { attemptNumber: 2, maxAttempts: 2 });
    assert(!res.isCorrect, "Attempt 2 is incorrect");
    assert(res.canRetry === false, "Should NOT allow further retry after attempt 2");
    assert(res.isRevealed === true, "Should reveal correct answer after attempt 2");
  });

  test("26. Attempt 1 Success: isCorrect = true, isRevealed = true, canRetry = false", () => {
    const res = validateAnswer("accommodation", "accommodation", { attemptNumber: 1, maxAttempts: 2 });
    assert(res.isCorrect, "Attempt 1 is correct");
    assert(res.isRevealed === true, "Should reveal success feedback");
    assert(res.canRetry === false, "Should not retry if correct");
  });

  // --- PART 4: DYNAMIC QUESTION GENERATION (20 EXERCISES BATCH) ---
  console.log("\n[PART 4] Dynamic 20-Question Batch Verification:");

  test("27. Generating 20 questions across all modules", () => {
    const batch = exerciseService.generateQuestions({ limit: 20 });
    assert(batch.length === 20, `Expected 20 questions, got ${batch.length}`);
    for (let i = 0; i < batch.length; i++) {
      const q = batch[i];
      assert(!!q.id, `Question ${i} missing ID`);
      assert(!!q.targetText, `Question ${i} missing targetText`);
      assert(!!q.transcript, `Question ${i} missing transcript`);
    }
  });

  console.log("\n==========================================================");
  console.log(`   ALL ${passedTests}/${totalTests} PHASE 3 ENGINE TESTS PASSED!            `);
  console.log("==========================================================");
}

runPhase3EngineTests();
