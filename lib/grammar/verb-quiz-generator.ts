import { VerbItem, VerbTestQuestion, VerbQuestionType } from "@/types/grammar.types";
import { VERBS_500_DATA } from "@/data/verbs-500";

/**
 * Generates believable plausible distractors for verbs.
 */
function getDistractors(correct: string, pool: string[], count: number = 3): string[] {
  const filtered = pool.filter(
    (item) => item.toLowerCase() !== correct.toLowerCase()
  );
  // Shuffle
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate a single question for a target verb across the 6 supported types.
 */
export function generateQuestionForVerb(
  target: VerbItem,
  typeIndex?: number,
  allVerbs: VerbItem[] = VERBS_500_DATA
): VerbTestQuestion {
  const chosenTypeIdx = typeIndex !== undefined ? typeIndex % 6 : Math.floor(Math.random() * 6);
  const qId = `q-${target.id}-${chosenTypeIdx}-${Math.random().toString(36).substring(2, 7)}`;

  // Pools for distractors
  const basePool = allVerbs.map((v) => v.baseForm);
  const pastPool = allVerbs.map((v) => v.pastForm);
  const participlePool = allVerbs.map((v) => v.pastParticiple);

  switch (chosenTypeIdx) {
    // Type 1: V1 -> V2
    case 0: {
      const isRegular = target.verbType === "regular";
      const plausibleDistractors = isRegular
        ? [
            target.baseForm + "ing",
            target.baseForm + "s",
            target.baseForm.endsWith("e") ? target.baseForm + "d" : target.baseForm + "en",
          ]
        : [
            target.baseForm + "ed",
            target.pastParticiple,
            target.baseForm + "ing",
          ];

      const distractors = getDistractors(target.pastForm, [
        ...plausibleDistractors,
        ...pastPool,
      ], 3);

      const allOptions = [
        { id: "opt-correct", text: target.pastForm, isCorrect: true },
        ...distractors.map((d, i) => ({ id: `opt-${i}`, text: d, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);

      return {
        id: qId,
        verbId: target.id,
        type: "v1_to_v2",
        prompt: `What is the Simple Past (V2) form of: ${target.baseForm.toUpperCase()}?`,
        options: allOptions,
        correctAnswer: target.pastForm,
        explanation: `The Simple Past (V2) form of "${target.baseForm}" is "${target.pastForm}". (${target.verbType} verb)`,
        targetVerb: target,
      };
    }

    // Type 2: V2 -> V1
    case 1: {
      const distractors = getDistractors(target.baseForm, [
        target.pastParticiple,
        target.pastForm,
        target.baseForm + "ing",
        ...basePool,
      ], 3);

      const allOptions = [
        { id: "opt-correct", text: target.baseForm, isCorrect: true },
        ...distractors.map((d, i) => ({ id: `opt-${i}`, text: d, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);

      return {
        id: qId,
        verbId: target.id,
        type: "v2_to_v1",
        prompt: `What is the Base Form (V1) of: ${target.pastForm.toUpperCase()}?`,
        options: allOptions,
        correctAnswer: target.baseForm,
        explanation: `The base form (V1) is "${target.baseForm}". ("${target.pastForm}" is the past form)`,
        targetVerb: target,
      };
    }

    // Type 3: V1/V2 -> V3
    case 2: {
      const plausible = target.verbType === "irregular"
        ? [target.pastForm, target.baseForm + "ed", target.baseForm + "ing"]
        : [target.baseForm + "en", target.baseForm + "ing", target.baseForm + "s"];

      const distractors = getDistractors(target.pastParticiple, [
        ...plausible,
        ...participlePool,
      ], 3);

      const allOptions = [
        { id: "opt-correct", text: target.pastParticiple, isCorrect: true },
        ...distractors.map((d, i) => ({ id: `opt-${i}`, text: d, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);

      return {
        id: qId,
        verbId: target.id,
        type: "to_v3",
        prompt: `What is the Past Participle (V3) of: ${target.baseForm.toUpperCase()}?`,
        options: allOptions,
        correctAnswer: target.pastParticiple,
        explanation: `The Past Participle (V3) form is "${target.pastParticiple}". Used with have/has/had or passive voice.`,
        targetVerb: target,
      };
    }

    // Type 4: Complete the table
    case 3: {
      const missingField: "v1" | "v2" | "v3" =
        Math.random() > 0.5 ? "v2" : "v3";

      const answer = missingField === "v2" ? target.pastForm : target.pastParticiple;
      const pool = missingField === "v2" ? pastPool : participlePool;
      const distractors = getDistractors(answer, pool, 3);

      const allOptions = [
        { id: "opt-correct", text: answer, isCorrect: true },
        ...distractors.map((d, i) => ({ id: `opt-${i}`, text: d, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);

      return {
        id: qId,
        verbId: target.id,
        type: "complete_table",
        prompt: `Complete the missing form in the table below:`,
        tableData: {
          v1: target.baseForm,
          v2: missingField === "v2" ? "___" : target.pastForm,
          v3: missingField === "v3" ? "___" : target.pastParticiple,
          missingField,
        },
        options: allOptions,
        correctAnswer: answer,
        explanation: `The complete forms are: V1: ${target.baseForm} | V2: ${target.pastForm} | V3: ${target.pastParticiple}.`,
        targetVerb: target,
      };
    }

    // Type 5: Meaning to Verb
    case 4: {
      const otherVerbs = getDistractors(target.baseForm, basePool, 3);
      const allOptions = [
        { id: "opt-correct", text: target.baseForm, isCorrect: true },
        ...otherVerbs.map((text, i) => ({ id: `opt-${i}`, text, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);

      return {
        id: qId,
        verbId: target.id,
        type: "meaning_to_verb",
        prompt: `Which English verb means: "${target.meaning}"?`,
        options: allOptions,
        correctAnswer: target.baseForm,
        explanation: `"${target.baseForm}" means: ${target.meaning}.`,
        targetVerb: target,
      };
    }

    // Type 6: Sentence Context
    case 5:
    default: {
      // Create fill-in sentence from pastExample or exampleSentence
      const usePast = Boolean(target.pastExample);
      const rawSentence = usePast && target.pastExample
        ? target.pastExample
        : target.exampleSentence || `They ${target.baseForm} every week.`;

      const targetWord = usePast ? target.pastForm : target.baseForm;
      const blankedSentence = rawSentence.replace(
        new RegExp(`\\b${targetWord}\\b`, "i"),
        "_____"
      );

      const distractors = [
        target.baseForm,
        target.pastForm,
        target.pastParticiple,
        target.baseForm + "ing",
      ].filter((w) => w.toLowerCase() !== targetWord.toLowerCase());

      const finalDistractors = distractors.slice(0, 3);
      const allOptions = [
        { id: "opt-correct", text: targetWord, isCorrect: true },
        ...finalDistractors.map((d, i) => ({ id: `opt-${i}`, text: d, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);

      return {
        id: qId,
        verbId: target.id,
        type: "sentence_context",
        prompt: `Choose the grammatically correct verb form to complete the sentence:`,
        sentence: blankedSentence,
        options: allOptions,
        correctAnswer: targetWord,
        explanation: `Full sentence: "${rawSentence}".`,
        targetVerb: target,
      };
    }
  }
}

/**
 * Generates an array of randomized questions for test or practice.
 */
export function generateVerbQuizQuestions(
  verbsPool: VerbItem[],
  count: number = 10,
  allVerbs: VerbItem[] = VERBS_500_DATA
): VerbTestQuestion[] {
  if (!verbsPool || verbsPool.length === 0) return [];

  // Shuffle pool
  const shuffledPool = [...verbsPool].sort(() => Math.random() - 0.5);
  const questions: VerbTestQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const targetVerb = shuffledPool[i % shuffledPool.length];
    const typeIdx = i % 6; // Rotate through all 6 types
    questions.push(generateQuestionForVerb(targetVerb, typeIdx, allVerbs));
  }

  return questions;
}
