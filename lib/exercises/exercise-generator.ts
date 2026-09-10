import { Exercise, ExerciseDifficulty, ExerciseType } from "@/types/exercise.types";
import { VocabularyItem, CEFRLevel } from "@/types/vocabulary.types";
import {
  ALL_VOCABULARY_ITEMS,
  UNIQUE_VOCABULARY_ITEMS,
  VOCABULARY_BY_CATEGORY,
  VOCABULARY_BY_ID,
  VOCABULARY_BY_LEVEL,
} from "@/data/vocabulary";
import {
  wordExerciseTemplate,
  articleWordExerciseTemplate,
  prepositionPhraseExerciseTemplate,
  phraseExerciseTemplate,
  sentenceTargetExerciseTemplate,
  spellingExerciseTemplate,
  numberExerciseTemplate,
  dateExerciseTemplate,
  timeExerciseTemplate,
} from "./exercise-templates";

export interface ExerciseGeneratorFilter {
  category?: string;
  type?: ExerciseType;
  difficulty?: ExerciseDifficulty;
  level?: CEFRLevel;
  limit?: number;
  searchQuery?: string;
}

/**
 * Static sample dataset covering numbers, dates, times, and prepositions
 */
const SAMPLE_PREPOSITION_LOCATIONS = [
  { prep: "near", loc: "the railway station" },
  { prep: "opposite", loc: "the main library" },
  { prep: "beside", loc: "the student union" },
  { prep: "behind", loc: "the science auditorium" },
  { prep: "next to", loc: "the campus cafeteria" },
  { prep: "across", loc: "the pedestrian bridge" },
  { prep: "between", loc: "the bank and the pharmacy" },
  { prep: "inside", loc: "the main entrance foyer" },
  { prep: "outside", loc: "the sports gymnasium" },
  { prep: "under", loc: "the covered bicycle shelter" },
];

const SAMPLE_NUMBERS = [
  { target: "£450.50", spokenText: "four hundred and fifty pounds fifty", context: "The monthly studio apartment maintenance fee comes to £450.50." },
  { target: "07894 551203", spokenText: "oh-seven-eight-nine-four, double five-one-two-oh-three", context: "You can reach the course coordinator on 07894 551203 during working hours." },
  { target: "78.4%", spokenText: "seventy-eight point four percent", context: "Survey statistics indicate that 78.4% of commuters preferred the express train." },
  { target: "14,500", spokenText: "fourteen thousand five hundred", context: "The annual international festival welcomed approximately 14,500 registered attendees." },
  { target: "$1,250", spokenText: "one thousand two hundred and fifty dollars", context: "The student research fellowship includes a travel grant of $1,250 per term." },
  { target: "2.5 kilograms", spokenText: "two point five kilograms", context: "The laboratory sample parcel weighed exactly 2.5 kilograms including container." },
  { target: "350 pounds", spokenText: "three hundred and fifty pounds", context: "The return international flight ticket cost 350 pounds." },
  { target: "01865 270000", spokenText: "oh-one-eight-six-five, two-seven-four-zeros", context: "For general admissions enquiries, telephone 01865 270000." },
];

const SAMPLE_DATES = [
  { target: "14th October", spokenText: "fourteenth of October", context: "The assignment submission deadline has been postponed to the 14th October.", variations: ["14 October", "14th of October"] },
  { target: "3rd March 2025", spokenText: "third of March twenty twenty-five", context: "The spring international symposium convenes on 3rd March 2025 in the great hall.", variations: ["3 March 2025", "3rd of March 2025"] },
  { target: "Wednesday afternoon", spokenText: "Wednesday afternoon", context: "The introductory tutorial workshop is scheduled for Wednesday afternoon.", variations: ["Wednesday pm"] },
  { target: "21st July", spokenText: "twenty-first of July", context: "Summer language immersion camps commence on the 21st July.", variations: ["21 July", "21st of July"] },
  { target: "Friday morning", spokenText: "Friday morning", context: "Library archive tours depart at ten o'clock every Friday morning.", variations: ["Friday am"] },
  { target: "1st September", spokenText: "first of September", context: "New undergraduate student enrollment opens on 1st September.", variations: ["1 September", "1st of September"] },
];

const SAMPLE_TIMES = [
  { target: "9:45 am", spokenText: "nine forty-five am / quarter to ten in the morning", context: "The guided campus tour departs promptly at 9:45 am from main reception.", variations: ["9:45am", "9.45 am", "quarter to ten"] },
  { target: "quarter past ten", spokenText: "quarter past ten in the morning", context: "Morning refreshments will be served in the foyer at quarter past ten.", variations: ["10:15", "10:15 am", "10.15 am"] },
  { target: "half past two", spokenText: "half past two in the afternoon", context: "The chemistry laboratory practical begins at half past two in room 12.", variations: ["2:30 pm", "2:30", "14:30"] },
  { target: "14:30", spokenText: "fourteen thirty", context: "The fast express train to Edinburgh departs at 14:30 from platform two.", variations: ["2:30 pm", "2.30 pm"] },
  { target: "midnight", spokenText: "twelve o'clock midnight", context: "Online assignment submissions will close promptly at midnight on Sunday.", variations: ["12:00 am", "00:00"] },
  { target: "8:15 am", spokenText: "eight fifteen in the morning", context: "The registration desk will open at 8:15 am on the first day of term.", variations: ["8:15am", "8.15 am", "quarter past eight"] },
];

const SAMPLE_SENTENCE_TARGETS = [
  {
    transcript: "The office is located near the railway station.",
    target: "near the railway station",
    category: "transport",
    difficulty: "medium" as const,
    explanation: "Listen carefully for the location clause following 'located'.",
  },
  {
    transcript: "The university helps international students find suitable accommodation.",
    target: "suitable accommodation",
    category: "accommodation",
    difficulty: "medium" as const,
    explanation: "Collocation target: 'suitable accommodation'.",
  },
  {
    transcript: "Industrial waste causes severe damage to the local environment.",
    target: "local environment",
    category: "environment",
    difficulty: "easy" as const,
    explanation: "Noun phrase target: 'local environment'.",
  },
  {
    transcript: "Researchers formulated a working hypothesis before laboratory trials.",
    target: "working hypothesis",
    category: "academic",
    difficulty: "hard" as const,
    explanation: "Academic collocation: 'working hypothesis'.",
  },
  {
    transcript: "The cafeteria is situated directly opposite the main entrance.",
    target: "opposite the main entrance",
    category: "services",
    difficulty: "medium" as const,
    explanation: "Directional preposition phrase: 'opposite the main entrance'.",
  },
];

/**
 * Generates an exercise from a single VocabularyItem and specified type
 */
export function generateExerciseFromVocabulary(
  item: VocabularyItem,
  type: ExerciseType = "WORD",
  difficulty: ExerciseDifficulty = "medium",
  index = 0
): Exercise {
  switch (type) {
    case "ARTICLE_WORD":
      return articleWordExerciseTemplate(item, difficulty, index);
    case "PHRASE":
      return phraseExerciseTemplate(item, difficulty, index);
    case "SPELLING":
      return spellingExerciseTemplate(item, difficulty, index);
    case "WORD":
    default:
      return wordExerciseTemplate(item, difficulty, index);
  }
}

/**
 * Queries vocabulary items matching criteria
 */
export function getVocabulary(filter: {
  category?: string;
  level?: CEFRLevel;
  partOfSpeech?: string;
  searchQuery?: string;
  limit?: number;
}): VocabularyItem[] {
  let items = UNIQUE_VOCABULARY_ITEMS;

  if (filter.category && filter.category !== "all") {
    const normCat = filter.category.toLowerCase();
    items = items.filter(
      (it) => it.category.toLowerCase() === normCat || it.category.toLowerCase().includes(normCat)
    );
  }

  if (filter.level) {
    items = items.filter((it) => it.level === filter.level);
  }

  if (filter.partOfSpeech) {
    items = items.filter((it) => it.partOfSpeech === filter.partOfSpeech);
  }

  if (filter.searchQuery) {
    const q = filter.searchQuery.toLowerCase().trim();
    items = items.filter(
      (it) =>
        it.word.toLowerCase().includes(q) ||
        it.meaning.toLowerCase().includes(q) ||
        it.exampleSentence.toLowerCase().includes(q)
    );
  }

  return filter.limit ? items.slice(0, filter.limit) : items;
}

/**
 * Main Exercise Generator Function
 * Generates batches of exercises across templates, categories, and difficulties.
 */
export function generateExercises(filter: ExerciseGeneratorFilter = {}): Exercise[] {
  const {
    category,
    type,
    difficulty = "medium",
    level,
    limit = 20,
    searchQuery,
  } = filter;

  const exercises: Exercise[] = [];
  let index = 0;

  // Handle specific non-vocabulary types (NUMBER, DATE, TIME, PREPOSITION_PHRASE, SENTENCE_TARGET)
  if (type === "NUMBER" || category === "numbers") {
    for (const numItem of SAMPLE_NUMBERS) {
      exercises.push(numberExerciseTemplate(numItem, difficulty, index++));
      if (exercises.length >= limit) return exercises;
    }
    return exercises;
  }

  if (type === "DATE") {
    for (const dtItem of SAMPLE_DATES) {
      exercises.push(dateExerciseTemplate(dtItem, difficulty, index++));
      if (exercises.length >= limit) return exercises;
    }
    return exercises;
  }

  if (type === "TIME") {
    for (const tmItem of SAMPLE_TIMES) {
      exercises.push(timeExerciseTemplate(tmItem, difficulty, index++));
      if (exercises.length >= limit) return exercises;
    }
    return exercises;
  }

  if (category === "dates-times") {
    // Interleave dates and times
    const combined = [...SAMPLE_DATES.map(d => ({ ...d, kind: "date" })), ...SAMPLE_TIMES.map(t => ({ ...t, kind: "time" }))];
    for (const item of combined) {
      if (item.kind === "date") {
        exercises.push(dateExerciseTemplate(item as any, difficulty, index++));
      } else {
        exercises.push(timeExerciseTemplate(item as any, difficulty, index++));
      }
      if (exercises.length >= limit) return exercises;
    }
    return exercises;
  }

  if (type === "PREPOSITION_PHRASE" || category === "prepositions") {
    for (const prepItem of SAMPLE_PREPOSITION_LOCATIONS) {
      exercises.push(
        prepositionPhraseExerciseTemplate(prepItem.prep, prepItem.loc, difficulty, index++)
      );
      if (exercises.length >= limit) return exercises;
    }
    return exercises;
  }

  if (type === "SENTENCE_TARGET") {
    for (const sentItem of SAMPLE_SENTENCE_TARGETS) {
      exercises.push(
        sentenceTargetExerciseTemplate(
          sentItem.transcript,
          sentItem.target,
          sentItem.category,
          sentItem.difficulty,
          index++,
          sentItem.explanation
        )
      );
      if (exercises.length >= limit) return exercises;
    }
    return exercises;
  }

  // Handle vocabulary-driven exercise generation
  const vocabItems = getVocabulary({ category, level, searchQuery });

  for (const vocab of vocabItems) {
    // Determine exercise type (either requested type or default based on item)
    const exerciseType: ExerciseType = type || (
      vocab.category === "articles" ? "ARTICLE_WORD" :
      vocab.commonMisspellings?.length ? "SPELLING" :
      "WORD"
    );

    exercises.push(generateExerciseFromVocabulary(vocab, exerciseType, difficulty, index++));

    if (exercises.length >= limit) {
      break;
    }
  }

  return exercises;
}

/**
 * Returns sample questions testing all 9 ExerciseTypes
 */
export function getSampleExerciseSuite(): Exercise[] {
  const sampleVocab = VOCABULARY_BY_ID.get("acad-1") || UNIQUE_VOCABULARY_ITEMS[0];
  const sampleAccom = VOCABULARY_BY_ID.get("acc-1") || UNIQUE_VOCABULARY_ITEMS[1];
  const sampleSpelling = VOCABULARY_BY_ID.get("acad-3") || UNIQUE_VOCABULARY_ITEMS[2];

  return [
    // 1. WORD
    wordExerciseTemplate(sampleVocab, "medium", 1),
    // 2. ARTICLE_WORD
    articleWordExerciseTemplate(sampleAccom, "easy", 2),
    // 3. PREPOSITION_PHRASE
    prepositionPhraseExerciseTemplate("near", "the railway station", "medium", 3),
    // 4. PHRASE
    phraseExerciseTemplate(sampleVocab, "hard", 4),
    // 5. SENTENCE_TARGET
    sentenceTargetExerciseTemplate(
      "The office is located near the railway station.",
      "near the railway station",
      "transport",
      "medium",
      5,
      "Target: 'near the railway station'."
    ),
    // 6. SPELLING
    spellingExerciseTemplate(sampleSpelling, "hard", 6),
    // 7. NUMBER
    numberExerciseTemplate(SAMPLE_NUMBERS[0], "easy", 7),
    // 8. DATE
    dateExerciseTemplate(SAMPLE_DATES[0], "medium", 8),
    // 9. TIME
    timeExerciseTemplate(SAMPLE_TIMES[0], "easy", 9),
  ];
}

export const exerciseGenerator = {
  generateExercises,
  generateExerciseFromVocabulary,
  getVocabulary,
  getSampleExerciseSuite,
};
