import {
  ExerciseCategory,
  ExerciseQuestion,
  ExerciseType,
  ExerciseDifficulty,
} from "@/types/exercise.types";
import { IExerciseService, BatchInfo } from "./exercise-service.interface";
import {
  MOCK_LISTEN_AND_TYPE_QUESTIONS,
  MOCK_VOCABULARY_QUESTIONS,
  MOCK_NUMBERS_QUESTIONS,
  MOCK_DATES_TIMES_QUESTIONS,
} from "@/data/mock-exercises";
import { MOCK_MISTAKES_LIST } from "@/data/mock-mistakes";
import { UNIQUE_VOCABULARY_ITEMS, ALL_VOCABULARY_ITEMS, VOCABULARY_BY_CATEGORY } from "@/data/vocabulary";
import { VocabularyItem } from "@/types/vocabulary.types";

/**
 * Extended pool of authentic IELTS Numbers, Currency, Codes & Quantities
 */
const EXTENDED_NUMBERS_POOL: ExerciseQuestion[] = [
  ...MOCK_NUMBERS_QUESTIONS,
  {
    id: "num-ext-1",
    category: "numbers",
    targetText: "$1,250",
    phoneticIpa: "one thousand two hundred and fifty dollars",
    partOfSpeech: "currency",
    definition: "International currency amount in US/Australian dollars.",
    contextSentence: "The student research fellowship includes a travel grant of $1,250 per term.",
    difficulty: "foundation",
    accent: "british",
    spellingTrapRule: "Write with dollar symbol or full words: $1,250 or 1250 dollars.",
    tags: ["Currency", "Section 1"],
  },
  {
    id: "num-ext-2",
    category: "numbers",
    targetText: "01865 270000",
    phoneticIpa: "oh-one-eight-six-five, two-seven-four-zeros",
    partOfSpeech: "phone number",
    definition: "UK landline telephone number.",
    contextSentence: "For general admissions enquiries, telephone 01865 270000 during office hours.",
    difficulty: "intermediate",
    accent: "british",
    spellingTrapRule: "Listen for digit groups: 'four zeros' = 0000.",
    tags: ["Phone Numbers", "Section 1"],
  },
  {
    id: "num-ext-3",
    category: "numbers",
    targetText: "2.5 kilograms",
    phoneticIpa: "two point five kilograms",
    partOfSpeech: "measurement",
    definition: "Metric weight measurement.",
    contextSentence: "The parcel weighed exactly 2.5 kilograms including the protective packaging.",
    difficulty: "foundation",
    accent: "british",
    spellingTrapRule: "Units can be written as '2.5 kg' or '2.5 kilograms'.",
    tags: ["Measurements", "Section 2"],
  },
  {
    id: "num-ext-4",
    category: "numbers",
    targetText: "350 pounds",
    phoneticIpa: "three hundred and fifty pounds",
    partOfSpeech: "currency",
    definition: "British currency sum.",
    contextSentence: "The return train ticket to the northern campus cost 350 pounds.",
    difficulty: "foundation",
    accent: "british",
    spellingTrapRule: "Accepts £350 or 350 pounds.",
    tags: ["Currency", "Section 1"],
  },
  {
    id: "num-ext-5",
    category: "numbers",
    targetText: "07911 123456",
    phoneticIpa: "oh-seven-nine-double-one, one-two-three-four-five-six",
    partOfSpeech: "phone number",
    definition: "UK mobile phone number with sequential digits.",
    contextSentence: "Please text your room confirmation reference to 07911 123456.",
    difficulty: "intermediate",
    accent: "british",
    tags: ["Phone Numbers", "Section 1"],
  },
  {
    id: "num-ext-6",
    category: "numbers",
    targetText: "45.8%",
    phoneticIpa: "forty-five point eight percent",
    partOfSpeech: "percentage",
    definition: "Survey statistical percentage.",
    contextSentence: "Exactly 45.8% of graduates secured employment within three months.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Statistics", "Section 3"],
  },
  {
    id: "num-ext-7",
    category: "numbers",
    targetText: "BA-2490",
    phoneticIpa: "B-A two-four-nine-zero",
    partOfSpeech: "flight code",
    definition: "Airline flight identifier code.",
    contextSentence: "Passengers for flight BA-2490 should proceed directly to gate 14.",
    difficulty: "intermediate",
    accent: "british",
    tags: ["Codes", "Section 1"],
  },
  {
    id: "num-ext-8",
    category: "numbers",
    targetText: "€85.00",
    phoneticIpa: "eighty-five euros",
    partOfSpeech: "currency",
    definition: "European Union currency amount.",
    contextSentence: "The conference registration fee is €85.00 per delegate.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Currency", "Section 1"],
  },
  {
    id: "num-ext-9",
    category: "numbers",
    targetText: "120 square metres",
    phoneticIpa: "one hundred and twenty square metres",
    partOfSpeech: "area measurement",
    definition: "Floor area specification.",
    contextSentence: "The laboratory workspace spans approximately 120 square metres.",
    difficulty: "intermediate",
    accent: "british",
    tags: ["Measurements", "Section 2"],
  },
  {
    id: "num-ext-10",
    category: "numbers",
    targetText: "020 7946 0912",
    phoneticIpa: "oh-two-oh, seven-nine-four-six, oh-nine-one-two",
    partOfSpeech: "phone number",
    definition: "London regional telephone contact number.",
    contextSentence: "Contact the student welfare helpline on 020 7946 0912.",
    difficulty: "intermediate",
    accent: "british",
    tags: ["Phone Numbers", "Section 1"],
  },
];

/**
 * Extended pool of authentic IELTS Dates, Times & Schedule Notations
 */
const EXTENDED_DATES_TIMES_POOL: ExerciseQuestion[] = [
  ...MOCK_DATES_TIMES_QUESTIONS,
  {
    id: "dt-ext-1",
    category: "dates-times",
    targetText: "3rd March 2025",
    phoneticIpa: "third of March twenty twenty-five",
    partOfSpeech: "date",
    definition: "Complete calendar date including year.",
    contextSentence: "The international symposium convenes on 3rd March 2025 in the great hall.",
    difficulty: "foundation",
    accent: "british",
    spellingTrapRule: "Accepts '3 March 2025' or '3rd March 2025'.",
    tags: ["Dates", "Section 1"],
  },
  {
    id: "dt-ext-2",
    category: "dates-times",
    targetText: "quarter past ten",
    phoneticIpa: "quarter past ten in the morning",
    partOfSpeech: "time",
    definition: "Colloquial British time expression.",
    contextSentence: "Morning tea will be served in the library foyer at quarter past ten.",
    difficulty: "foundation",
    accent: "british",
    spellingTrapRule: "'Quarter past ten' = 10:15 am.",
    tags: ["Times", "Section 1"],
  },
  {
    id: "dt-ext-3",
    category: "dates-times",
    targetText: "21st July",
    phoneticIpa: "twenty-first of July",
    partOfSpeech: "date",
    definition: "Summer schedule start date.",
    contextSentence: "Summer language immersion camps commence on the 21st July.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Dates", "Section 1"],
  },
  {
    id: "dt-ext-4",
    category: "dates-times",
    targetText: "half past two",
    phoneticIpa: "half past two in the afternoon",
    partOfSpeech: "time",
    definition: "Afternoon lecture start time.",
    contextSentence: "The chemistry practical begins at half past two in room 12.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Times", "Section 1"],
  },
  {
    id: "dt-ext-5",
    category: "dates-times",
    targetText: "Friday morning",
    phoneticIpa: "Friday morning",
    partOfSpeech: "schedule",
    definition: "Recurring weekly appointment slot.",
    contextSentence: "Library archive tours depart at ten o'clock every Friday morning.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Schedule", "Section 1"],
  },
  {
    id: "dt-ext-6",
    category: "dates-times",
    targetText: "1st September",
    phoneticIpa: "first of September",
    partOfSpeech: "date",
    definition: "Academic term commencement date.",
    contextSentence: "New undergraduate enrollment opens on 1st September.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Dates", "Section 1"],
  },
  {
    id: "dt-ext-7",
    category: "dates-times",
    targetText: "8:15 am",
    phoneticIpa: "eight fifteen in the morning / quarter past eight",
    partOfSpeech: "time",
    definition: "Early morning check-in time.",
    contextSentence: "The registration desk will open promptly at 8:15 am on Monday.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Times", "Section 1"],
  },
  {
    id: "dt-ext-8",
    category: "dates-times",
    targetText: "midnight",
    phoneticIpa: "twelve o'clock midnight",
    partOfSpeech: "time",
    definition: "Online submission cutoff timestamp.",
    contextSentence: "Online assignment submissions close at midnight on Sunday.",
    difficulty: "foundation",
    accent: "british",
    tags: ["Times", "Section 1"],
  },
];

/**
 * Converts a raw VocabularyItem into a fully formed IELTS ExerciseQuestion
 */
function vocabToQuestion(vocab: VocabularyItem, index = 0): ExerciseQuestion {
  const normWord = vocab.word.trim();
  const trap =
    vocab.commonMisspellings && vocab.commonMisspellings.length > 0
      ? `Watch out for common IELTS spelling trap: '${vocab.commonMisspellings[0]}'.`
      : `Pay close attention to double letters, vowels, and suffixes in '${normWord}'.`;

  return {
    id: vocab.id || `voc-${index}-${normWord.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    vocabularyId: vocab.id,
    category: (vocab.category as any) || "listen-and-type",
    targetText: normWord,
    transcript: vocab.exampleSentence || `Listen carefully and transcribe the word: ${normWord}.`,
    phoneticIpa: vocab.phonetic || `/${normWord}/`,
    partOfSpeech: vocab.partOfSpeech || "noun",
    definition: vocab.meaning || "Essential IELTS academic vocabulary item.",
    contextSentence: vocab.exampleSentence,
    difficulty:
      vocab.level === "C1"
        ? "advanced"
        : vocab.level === "B2"
        ? "intermediate"
        : "foundation",
    accent: "british",
    commonMisspellings: vocab.commonMisspellings || [],
    spellingTrapRule: trap,
    type: vocab.category === "articles" ? "ARTICLE_WORD" : "WORD",
    acceptedAnswers: [normWord.toLowerCase()],
    tags: [
      vocab.category ? vocab.category.charAt(0).toUpperCase() + vocab.category.slice(1) : "Vocabulary",
      `Level ${vocab.level || "B2"}`,
      "Band 7.5+",
    ],
  };
}

function normalizeCategoryKey(category: string): string {
  const c = (category || "").toLowerCase().trim();
  if (c.includes("acad") || c.includes("univ")) return "academic";
  if (c.includes("accom") || c.includes("hous")) return "accommodation";
  if (c.includes("env") || c.includes("eco")) return "environment";
  if (c.includes("trans") || c.includes("trav")) return "transport";
  if (c.includes("work") || c.includes("career") || c.includes("employ")) return "work";
  if (c.includes("health") || c.includes("med")) return "health";
  if (c.includes("tech") || c.includes("sci")) return "technology";
  if (c.includes("soc") || c.includes("cult")) return "society";
  if (c.includes("shop") || c.includes("comm")) return "shopping";
  if (c.includes("serv") || c.includes("facil")) return "services";
  if (c.includes("articl") || c.includes("prep")) return "articles";
  if (c.includes("num") || c.includes("curr")) return "numbers";
  if (c.includes("date") || c.includes("time")) return "dates-times";
  if (c.includes("mistake")) return "mistakes";
  return c;
}

export class MockExerciseService implements IExerciseService {
  private cachedAllQuestions: Map<string, ExerciseQuestion[]> = new Map();

  /**
   * Generates dynamic ExerciseQuestions from vocabulary items using rule-based templates
   */
  generateQuestions(filter: any = {}): ExerciseQuestion[] {
    const all = this.getAllQuestionsForCategory(filter.category || "listen-and-type");
    return filter.limit ? all.slice(0, filter.limit) : all;
  }

  /**
   * Generates or retrieves the complete list of questions for any category.
   * Maps through all 1,000+ words in UNIQUE_VOCABULARY_ITEMS.
   */
  public getAllQuestionsForCategory(category: string): ExerciseQuestion[] {
    const rawCat = (category || "listen-and-type").toLowerCase().trim();
    const cat = normalizeCategoryKey(rawCat);

    if (this.cachedAllQuestions.has(cat)) {
      return this.cachedAllQuestions.get(cat)!;
    }

    let questions: ExerciseQuestion[] = [];

    if (cat === "numbers") {
      questions = EXTENDED_NUMBERS_POOL;
    } else if (cat === "dates-times") {
      questions = EXTENDED_DATES_TIMES_POOL;
    } else if (cat === "mistakes") {
      questions = MOCK_MISTAKES_LIST.map((m) => ({
        id: `mistake-${m.id}`,
        category: "mistakes",
        targetText: m.word,
        phoneticIpa: m.phoneticIpa,
        partOfSpeech: "vocabulary",
        definition: m.definition,
        difficulty: m.masteryLevel === "critical" ? "advanced" : "intermediate",
        accent: "british",
        commonMisspellings: [m.userLastAttempt],
        spellingTrapRule: m.commonTrap,
        tags: ["My Mistakes", "Review Queue"],
      }));
    } else if (cat === "vocabulary" || cat === "academic") {
      // Academic vocabulary from the dataset
      const academicItems = UNIQUE_VOCABULARY_ITEMS.filter(
        (it) => it.category === "academic" || it.level === "C1" || it.level === "B2"
      );
      questions = [
        ...MOCK_VOCABULARY_QUESTIONS,
        ...academicItems.map((v, i) => vocabToQuestion(v, i)),
      ];
    } else if (VOCABULARY_BY_CATEGORY[cat] && VOCABULARY_BY_CATEGORY[cat].length > 0) {
      // Specific subcategory (e.g. accommodation, transport, health, etc.)
      const catItems = VOCABULARY_BY_CATEGORY[cat];
      questions = catItems.map((v, i) => vocabToQuestion(v, i));
    } else {
      // Check if any vocabulary items match category substring
      const matchedItems = UNIQUE_VOCABULARY_ITEMS.filter((it) =>
        it.category ? it.category.toLowerCase().includes(cat) : false
      );

      if (matchedItems.length > 0) {
        questions = matchedItems.map((v, i) => vocabToQuestion(v, i));
      } else {
        // General "listen-and-type": Includes all 1,000+ unique words
        const seen = new Set<string>();
        const combined: ExerciseQuestion[] = [];

        // Add mock base questions first
        for (const q of MOCK_LISTEN_AND_TYPE_QUESTIONS) {
          seen.add(q.targetText.toLowerCase());
          combined.push(q);
        }

        // Add all 1,000+ unique vocabulary items
        UNIQUE_VOCABULARY_ITEMS.forEach((vocab, i) => {
          const norm = vocab.word.toLowerCase();
          if (!seen.has(norm)) {
            seen.add(norm);
            combined.push(vocabToQuestion(vocab, i));
          }
        });

        questions = combined;
      }
    }

    // Deduplicate by targetText to ensure pristine quality
    const deduped: ExerciseQuestion[] = [];
    const seenWords = new Set<string>();
    for (const q of questions) {
      const key = q.targetText.trim().toLowerCase();
      if (!seenWords.has(key)) {
        seenWords.add(key);
        deduped.push(q);
      }
    }

    this.cachedAllQuestions.set(cat, deduped);
    return deduped;
  }

  /**
   * Fetches paginated or sliced questions for a given category.
   * Enables seamless batching (e.g. Set 1: words 0-19, Set 2: words 20-39, etc.).
   */
  async getQuestionsByCategory(
    category: ExerciseCategory | string,
    limit: number = 20,
    offset: number = 0,
    shuffle: boolean = false
  ): Promise<ExerciseQuestion[]> {
    const all = this.getAllQuestionsForCategory(category);
    if (all.length === 0) return MOCK_LISTEN_AND_TYPE_QUESTIONS;

    if (shuffle) {
      const copy = [...all];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, limit);
    }

    // Wrap around gracefully with modulo
    const safeOffset = all.length > 0 ? (offset >= all.length ? offset % all.length : offset) : 0;
    const end = safeOffset + limit;

    if (end <= all.length) {
      return all.slice(safeOffset, end);
    }

    // Wrap around to start if slice reaches past total pool
    return [...all.slice(safeOffset), ...all.slice(0, end - all.length)];
  }

  /**
   * Returns batch metadata with questions, current batch index, total batches, and word range
   */
  async getBatchInfo(
    category: ExerciseCategory | string,
    batchIndex: number = 0,
    limit: number = 20
  ): Promise<BatchInfo> {
    const all = this.getAllQuestionsForCategory(category);
    const totalQuestions = all.length;
    const totalBatches = Math.max(1, Math.ceil(totalQuestions / limit));
    const safeBatchIndex = totalBatches > 0 ? ((batchIndex % totalBatches) + totalBatches) % totalBatches : 0;
    const offset = safeBatchIndex * limit;

    const questions = await this.getQuestionsByCategory(category, limit, offset);

    return {
      questions,
      batchIndex: safeBatchIndex,
      totalBatches,
      totalQuestions,
      startWordIndex: offset + 1,
      endWordIndex: Math.min(offset + limit, totalQuestions),
    };
  }

  getTotalCount(category: ExerciseCategory | string): number {
    return this.getAllQuestionsForCategory(category).length;
  }

  async getQuestionById(id: string): Promise<ExerciseQuestion | null> {
    const all = this.getAllQuestionsForCategory("listen-and-type");
    const found = all.find((q) => q.id === id);
    if (found) return found;

    // Search in full vocabulary items
    const vocab = UNIQUE_VOCABULARY_ITEMS.find((v) => v.id === id);
    if (vocab) {
      return vocabToQuestion(vocab);
    }

    return null;
  }

  async getAllModules(): Promise<ExerciseCategory[]> {
    return [
      "listen-and-type",
      "vocabulary",
      "numbers",
      "dates-times",
      "mistakes",
      "academic",
      "accommodation",
      "transport",
      "work",
      "education",
      "health",
      "technology",
      "environment",
      "society",
      "shopping",
      "travel",
      "services",
      "everyday",
    ];
  }

  getVocabularyStats() {
    return {
      totalWords: UNIQUE_VOCABULARY_ITEMS.length,
      totalEntries: ALL_VOCABULARY_ITEMS.length,
      categoriesCount: Object.keys(VOCABULARY_BY_CATEGORY).length,
      categories: Object.keys(VOCABULARY_BY_CATEGORY),
    };
  }
}

export const exerciseService = new MockExerciseService();
