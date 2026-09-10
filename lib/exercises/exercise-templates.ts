import { Exercise, ExerciseDifficulty, ExerciseType } from "@/types/exercise.types";
import { VocabularyItem } from "@/types/vocabulary.types";

export interface ExerciseTemplateContext {
  vocabularyItem?: VocabularyItem;
  difficulty?: ExerciseDifficulty;
  customTranscript?: string;
  customTarget?: string;
}

export type ExerciseTemplateFn = (
  item: VocabularyItem,
  difficulty: ExerciseDifficulty,
  index?: number
) => Exercise;

/**
 * 1. WORD Template: Target the exact vocabulary word in an original IELTS sentence context.
 */
export const wordExerciseTemplate: ExerciseTemplateFn = (item, difficulty, index = 0): Exercise => {
  const sentence = item.exampleSentence || `Please write the target word "${item.word}" accurately.`;
  const acceptedAnswers = [
    item.word,
    item.word.toLowerCase(),
    item.word.toUpperCase(),
    item.word.charAt(0).toUpperCase() + item.word.slice(1),
  ];

  return {
    id: `ex-word-${item.id}-${index}`,
    type: "WORD",
    vocabularyId: item.id,
    transcript: sentence,
    targetText: item.word,
    acceptedAnswers: Array.from(new Set(acceptedAnswers)),
    difficulty,
    category: item.category || "academic",
    explanation: `Target: "${item.word}" (${item.partOfSpeech || "word"}). Meaning: ${item.meaning}. ${
      item.commonPhrases?.length ? `Common usage: ${item.commonPhrases.join(", ")}.` : ""
    }`,
    phoneticIpa: item.phonetic,
    spellingTrapRule: item.commonMisspellings?.length
      ? `Watch out for common errors like: ${item.commonMisspellings.join(", ")}.`
      : undefined,
  };
};

/**
 * 2. ARTICLE_WORD Template: Collocation of article + noun (e.g. "an environment", "the accommodation", "a university").
 */
export const articleWordExerciseTemplate: ExerciseTemplateFn = (item, difficulty, index = 0): Exercise => {
  const vowels = ["a", "e", "i", "o", "u"];
  const firstLetter = item.word.trim().toLowerCase().charAt(0);
  const isUniversity = item.word.toLowerCase().startsWith("uni"); // 'a university'
  const isVowelSound = vowels.includes(firstLetter) && !isUniversity;
  const article = isVowelSound ? "an" : "a";

  const targetPhrase = `${article} ${item.word}`;
  const definitePhrase = `the ${item.word}`;

  const transcript = `The researcher observed ${targetPhrase} during the initial site visit.`;

  const acceptedAnswers = [
    targetPhrase,
    targetPhrase.toLowerCase(),
    targetPhrase.charAt(0).toUpperCase() + targetPhrase.slice(1),
    definitePhrase,
    item.word,
  ];

  return {
    id: `ex-art-${item.id}-${index}`,
    type: "ARTICLE_WORD",
    vocabularyId: item.id,
    transcript,
    targetText: targetPhrase,
    acceptedAnswers: Array.from(new Set(acceptedAnswers)),
    difficulty,
    category: item.category || "grammar",
    explanation: `Collocation: "${targetPhrase}". In IELTS listening, always listen carefully whether an article ('a', 'an', or 'the') precedes the noun.`,
    phoneticIpa: item.phonetic,
    spellingTrapRule: isUniversity
      ? "Remember: 'university' begins with a /j/ consonant sound, so it takes 'a', not 'an'."
      : undefined,
  };
};

/**
 * 3. PREPOSITION_PHRASE Template: Preposition + noun phrase (e.g. "near the railway station", "opposite the library").
 */
export const prepositionPhraseExerciseTemplate = (
  prep: string,
  locationNoun: string,
  difficulty: ExerciseDifficulty = "medium",
  index = 0
): Exercise => {
  const targetText = `${prep} ${locationNoun}`;
  const transcript = `The office is located ${targetText}.`;

  const acceptedAnswers = [
    targetText,
    targetText.toLowerCase(),
    targetText.charAt(0).toUpperCase() + targetText.slice(1),
  ];

  return {
    id: `ex-prep-${prep.replace(/\s+/g, "_")}-${index}`,
    type: "PREPOSITION_PHRASE",
    transcript,
    targetText,
    acceptedAnswers,
    difficulty,
    category: "prepositions",
    explanation: `Preposition phrase: "${targetText}". Prepositions of place (near, opposite, beside, behind, next to) frequently appear in IELTS Section 1 & 2 maps and direction questions.`,
  };
};

/**
 * 4. PHRASE Template: Multi-word collocation or idiomatic academic expression.
 */
export const phraseExerciseTemplate: ExerciseTemplateFn = (item, difficulty, index = 0): Exercise => {
  const phrase = item.commonPhrases && item.commonPhrases.length > 0
    ? item.commonPhrases[0]
    : `focus on ${item.word}`;

  const transcript = `In order to achieve high marks, students must ${phrase}.`;

  const acceptedAnswers = [
    phrase,
    phrase.toLowerCase(),
    phrase.charAt(0).toUpperCase() + phrase.slice(1),
  ];

  return {
    id: `ex-phrase-${item.id}-${index}`,
    type: "PHRASE",
    vocabularyId: item.id,
    transcript,
    targetText: phrase,
    acceptedAnswers,
    difficulty,
    category: item.category || "collocations",
    explanation: `Collocation phrase: "${phrase}". Multi-word listening units test connected speech recognition and word boundaries.`,
  };
};

/**
 * 5. SENTENCE_TARGET Template: Full sentence or clause target within an academic lecture snippet.
 */
export const sentenceTargetExerciseTemplate = (
  transcript: string,
  targetText: string,
  category = "academic",
  difficulty: ExerciseDifficulty = "hard",
  index = 0,
  explanation?: string
): Exercise => {
  return {
    id: `ex-sent-${index}`,
    type: "SENTENCE_TARGET",
    transcript,
    targetText,
    acceptedAnswers: [
      targetText,
      targetText.toLowerCase(),
      targetText.replace(/[.,!]/g, "").trim(),
    ],
    difficulty,
    category,
    explanation: explanation || `Listen for the key information clause: "${targetText}".`,
  };
};

/**
 * 6. SPELLING Template: Focuses specifically on high-frequency IELTS spelling traps.
 */
export const spellingExerciseTemplate: ExerciseTemplateFn = (item, difficulty, index = 0): Exercise => {
  const transcript = `Please spell the word clearly: ${item.word}.`;

  const acceptedAnswers = [
    item.word,
    item.word.toLowerCase(),
    item.word.toUpperCase(),
    item.word.charAt(0).toUpperCase() + item.word.slice(1),
  ];

  const trapTip = item.commonMisspellings && item.commonMisspellings.length > 0
    ? `Common spelling errors: ${item.commonMisspellings.join(", ")}.`
    : "Check double consonants and silent letters carefully.";

  return {
    id: `ex-spell-${item.id}-${index}`,
    type: "SPELLING",
    vocabularyId: item.id,
    transcript,
    targetText: item.word,
    acceptedAnswers,
    difficulty,
    category: "spelling",
    explanation: `Spelling target: "${item.word}". ${trapTip}`,
    phoneticIpa: item.phonetic,
    spellingTrapRule: trapTip,
  };
};

/**
 * 7. NUMBER Template: Currency, telephone numbers, quantities, and statistical percentages.
 */
export const numberExerciseTemplate = (
  numberItem: { target: string; spokenText: string; context: string; category?: string },
  difficulty: ExerciseDifficulty = "easy",
  index = 0
): Exercise => {
  const accepted = [
    numberItem.target,
    numberItem.target.toLowerCase(),
    numberItem.target.replace(/[£$€,\s]/g, ""),
  ];

  return {
    id: `ex-num-${index}`,
    type: "NUMBER",
    transcript: numberItem.context,
    targetText: numberItem.target,
    acceptedAnswers: Array.from(new Set(accepted)),
    difficulty,
    category: "numbers",
    phoneticIpa: numberItem.spokenText,
    explanation: `Number target: "${numberItem.target}" (${numberItem.spokenText}). Common in IELTS Section 1 forms and Section 2 factual reports.`,
  };
};

/**
 * 8. DATE Template: UK and international calendar formats.
 */
export const dateExerciseTemplate = (
  dateItem: { target: string; spokenText: string; context: string; variations?: string[] },
  difficulty: ExerciseDifficulty = "medium",
  index = 0
): Exercise => {
  const accepted = [
    dateItem.target,
    dateItem.target.toLowerCase(),
    ...(dateItem.variations || []),
  ];

  return {
    id: `ex-date-${index}`,
    type: "DATE",
    transcript: dateItem.context,
    targetText: dateItem.target,
    acceptedAnswers: Array.from(new Set(accepted)),
    difficulty,
    category: "dates-times",
    phoneticIpa: dateItem.spokenText,
    explanation: `Date target: "${dateItem.target}". British IELTS convention accepts both '14th October' and '14 October'.`,
  };
};

/**
 * 9. TIME Template: Timetable, 12-hour and 24-hour schedules.
 */
export const timeExerciseTemplate = (
  timeItem: { target: string; spokenText: string; context: string; variations?: string[] },
  difficulty: ExerciseDifficulty = "easy",
  index = 0
): Exercise => {
  const accepted = [
    timeItem.target,
    timeItem.target.toLowerCase(),
    ...(timeItem.variations || []),
  ];

  return {
    id: `ex-time-${index}`,
    type: "TIME",
    transcript: timeItem.context,
    targetText: timeItem.target,
    acceptedAnswers: Array.from(new Set(accepted)),
    difficulty,
    category: "dates-times",
    phoneticIpa: timeItem.spokenText,
    explanation: `Time target: "${timeItem.target}" (${timeItem.spokenText}). Pay close attention to 'am/pm' and 'quarter past/to'.`,
  };
};
