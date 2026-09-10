import { MistakeType } from "@/types/progress.types";
import { levenshteinDistance, normalizeText } from "@/lib/validation/answer-validator";

export interface MistakeClassification {
  type: MistakeType;
  label: string;
  explanation: string;
  remediationTip: string;
  severity: "low" | "medium" | "high";
  confidence: number; // 0 to 1
}

const ARTICLES = new Set(["a", "an", "the"]);

const PREPOSITIONS = new Set([
  "in", "on", "at", "by", "for", "with", "about", "against", "between", "into",
  "through", "during", "before", "after", "above", "below", "to", "from", "up",
  "down", "of", "off", "out", "over", "under", "again", "further", "then", "once",
  "across", "along", "behind", "beside", "beyond", "near", "toward", "towards",
  "upon", "within", "without", "among", "throughout", "despite", "regarding",
  "concerning", "per", "via", "onto", "inside", "outside", "underneath",
  "as", "since", "until", "till", "like"
]);

const MONTHS = new Set([
  "january", "february", "march", "april", "may", "june", "july", "august",
  "september", "october", "november", "december", "jan", "feb", "mar", "apr",
  "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"
]);

const DAYS_OF_WEEK = new Set([
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "mon", "tue", "wed", "thu", "fri", "sat", "sun"
]);

const TIME_INDICATORS = new Set([
  "am", "pm", "a.m.", "p.m.", "o'clock", "clock", "morning", "afternoon",
  "evening", "night", "noon", "midnight", "half", "quarter", "past", "to",
  "minute", "minutes", "hour", "hours"
]);

const NUMBER_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
  million: 1000000, billion: 1000000000
};

const ORDINALS = new Set([
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
  "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th",
  "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth",
  "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth",
  "twentieth", "thirtieth"
]);

const CURRENCIES = new Set(["$", "£", "€", "pounds", "pound", "dollars", "dollar", "euros", "euro", "cents", "pence"]);

const IRREGULAR_NOUNS: Record<string, string> = {
  child: "children",
  person: "people",
  man: "men",
  woman: "women",
  tooth: "teeth",
  foot: "feet",
  mouse: "mice",
  datum: "data",
  analysis: "analyses",
  phenomenon: "phenomena",
  criterion: "criteria",
  syllabus: "syllabi",
  hypothesis: "hypotheses",
  matrix: "matrices",
  vertex: "vertices",
  medium: "media",
  index: "indices",
  cactus: "cacti",
  parenthesis: "parentheses",
  thesis: "theses",
  axis: "axes",
  appendix: "appendices",
  bacterium: "bacteria",
  crisis: "crises",
  oasis: "oases",
  curriculum: "curricula",
  formula: "formulae",
  fungus: "fungi",
  nucleus: "nuclei",
  stimulus: "stimuli",
  radius: "radii",
  loaf: "loaves",
  knife: "knives",
  leaf: "leaves",
  wolf: "wolves",
  life: "lives",
  shelf: "shelves",
  half: "halves",
  calf: "calves",
  thief: "thieves",
};

// Create reverse mapping for irregulars
const IRREGULAR_PLURALS: Record<string, string> = {};
for (const [sing, plur] of Object.entries(IRREGULAR_NOUNS)) {
  IRREGULAR_PLURALS[plur] = sing;
}

/**
 * Checks if two single words are a singular/plural pair.
 */
function isSingularPluralPair(a: string, b: string): { isPair: boolean; singular?: string; plural?: string } {
  const w1 = a.toLowerCase().trim();
  const w2 = b.toLowerCase().trim();

  if (w1 === w2) return { isPair: false };

  // 1. Irregular nouns check
  if (IRREGULAR_NOUNS[w1] === w2) {
    return { isPair: true, singular: w1, plural: w2 };
  }
  if (IRREGULAR_NOUNS[w2] === w1) {
    return { isPair: true, singular: w2, plural: w1 };
  }
  if (IRREGULAR_PLURALS[w1] === w2) {
    return { isPair: true, singular: w2, plural: w1 };
  }
  if (IRREGULAR_PLURALS[w2] === w1) {
    return { isPair: true, singular: w1, plural: w2 };
  }

  // 2. Regular plural checks
  // e.g. student -> students, cat -> cats
  if (w1 + "s" === w2) return { isPair: true, singular: w1, plural: w2 };
  if (w2 + "s" === w1) return { isPair: true, singular: w2, plural: w1 };

  // e.g. box -> boxes, bus -> buses, watch -> watches, quiz -> quizzes
  if (w1 + "es" === w2) return { isPair: true, singular: w1, plural: w2 };
  if (w2 + "es" === w1) return { isPair: true, singular: w2, plural: w1 };

  // e.g. city -> cities
  if (w1.endsWith("y") && w1.slice(0, -1) + "ies" === w2) {
    return { isPair: true, singular: w1, plural: w2 };
  }
  if (w2.endsWith("y") && w2.slice(0, -1) + "ies" === w1) {
    return { isPair: true, singular: w2, plural: w1 };
  }

  // e.g. leaf -> leaves
  if (w1.endsWith("f") && w1.slice(0, -1) + "ves" === w2) {
    return { isPair: true, singular: w1, plural: w2 };
  }
  if (w2.endsWith("f") && w2.slice(0, -1) + "ves" === w1) {
    return { isPair: true, singular: w2, plural: w1 };
  }
  if (w1.endsWith("fe") && w1.slice(0, -2) + "ves" === w2) {
    return { isPair: true, singular: w1, plural: w2 };
  }
  if (w2.endsWith("fe") && w2.slice(0, -2) + "ves" === w1) {
    return { isPair: true, singular: w1, plural: w2 };
  }

  return { isPair: false };
}

/**
 * Checks if input relates to numbers or numerical values.
 */
function isNumberRelated(word: string): boolean {
  const clean = word.replace(/[,$£€%]/g, "").trim().toLowerCase();
  if (/^\d+(\.\d+)?$/.test(clean)) return true;
  if (NUMBER_WORDS[clean] !== undefined) return true;
  if (ORDINALS.has(clean)) return true;
  if (CURRENCIES.has(clean)) return true;
  return false;
}

/**
 * Checks if input relates to dates or times.
 */
function isDateTimeRelated(word: string): boolean {
  const clean = word.toLowerCase().trim();
  if (MONTHS.has(clean)) return true;
  if (DAYS_OF_WEEK.has(clean)) return true;
  if (TIME_INDICATORS.has(clean)) return true;
  if (/^\d{1,2}[:.]\d{2}(am|pm)?$/i.test(clean)) return true;
  if (/^(\d{1,2})(st|nd|rd|th)$/i.test(clean)) return true;
  return false;
}

/**
 * Tokenizes text into lowercase words/symbols.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Intelligent, deterministic, 100% non-AI mistake classifier.
 * Evaluates candidate input against target text and pinpoints the precise IELTS mistake type.
 */
export function classifyMistake(
  userInput: string,
  targetText: string,
  category?: string
): MistakeClassification {
  const rawUser = (userInput || "").trim();
  const rawTarget = (targetText || "").trim();

  const normUser = normalizeText(rawUser);
  const normTarget = normalizeText(rawTarget);

  // Exact match -> Not a mistake
  if (normUser === normTarget) {
    return {
      type: "spelling",
      label: "Correct",
      explanation: "Answer is accurate.",
      remediationTip: "Great job! Keep practicing to maintain Band 9 consistency.",
      severity: "low",
      confidence: 1.0,
    };
  }

  const userTokens = tokenize(normUser);
  const targetTokens = tokenize(normTarget);

  // 1. Check Date / Time Mistakes
  const hasDateTarget = targetTokens.some((t) => isDateTimeRelated(t)) || category === "dates-times";
  const hasDateUser = userTokens.some((t) => isDateTimeRelated(t));
  if (hasDateTarget || (category === "dates-times" && hasDateUser)) {
    // Check if difference is date or time oriented
    const dateMismatch = targetTokens.some((t) => isDateTimeRelated(t) && !userTokens.includes(t));
    if (dateMismatch || category === "dates-times") {
      return {
        type: "date-time",
        label: "Date / Time Mistake",
        explanation: `Date or time mismatch between "${rawUser}" and target "${rawTarget}".`,
        remediationTip: "In IELTS Listening Section 1, dates often use ordinals (e.g. 14th) and times use 12-hour am/pm format.",
        severity: "medium",
        confidence: 0.95,
      };
    }
  }

  // 2. Check Number / Numerical Mistakes
  const hasNumberTarget = targetTokens.some((t) => isNumberRelated(t)) || category === "numbers";
  const hasNumberUser = userTokens.some((t) => isNumberRelated(t));
  if (hasNumberTarget || hasNumberUser || category === "numbers") {
    // Check if difference involves numerical figures, currency, or words
    const numMismatch = targetTokens.some((t) => isNumberRelated(t) && !userTokens.includes(t));
    if (numMismatch || category === "numbers") {
      return {
        type: "number",
        label: "Number Mistake",
        explanation: `Numerical discrepancy: received "${rawUser}", expected "${rawTarget}".`,
        remediationTip: "Listen carefully for teen vs ty distinctions (e.g. 15 vs 50) and double digits (e.g. 00 vs 0).",
        severity: "medium",
        confidence: 0.95,
      };
    }
  }

  // 3. Check Singular / Plural Mistakes
  // Case A: Single word singular/plural
  if (userTokens.length === 1 && targetTokens.length === 1) {
    const pair = isSingularPluralPair(userTokens[0], targetTokens[0]);
    if (pair.isPair) {
      const isPluralTarget = pair.plural === targetTokens[0];
      return {
        type: "singular-plural",
        label: "Singular / Plural Mistake",
        explanation: isPluralTarget
          ? `Used singular "${userTokens[0]}" instead of plural "${targetTokens[0]}".`
          : `Used plural "${userTokens[0]}" instead of singular "${targetTokens[0]}".`,
        remediationTip: "IELTS penalizes missing or extra plural -s endings strictly. Listen for ending sibilants.",
        severity: "medium",
        confidence: 0.98,
      };
    }
  }

  // Case B: Multi-word phrase with singular/plural difference
  if (userTokens.length === targetTokens.length && userTokens.length > 1) {
    let spFound = false;
    let mismatchedWords: { user: string; target: string } | null = null;
    let diffCount = 0;

    for (let i = 0; i < targetTokens.length; i++) {
      if (userTokens[i] !== targetTokens[i]) {
        diffCount++;
        const pair = isSingularPluralPair(userTokens[i], targetTokens[i]);
        if (pair.isPair) {
          spFound = true;
          mismatchedWords = { user: userTokens[i], target: targetTokens[i] };
        }
      }
    }

    if (spFound && diffCount === 1 && mismatchedWords) {
      return {
        type: "singular-plural",
        label: "Singular / Plural Mistake",
        explanation: `Form difference on word: used "${mismatchedWords.user}" instead of "${mismatchedWords.target}".`,
        remediationTip: "Always verify subject-verb agreement and plural markers in context sentences.",
        severity: "medium",
        confidence: 0.95,
      };
    }
  }

  // 4. Check Article Mistakes (a, an, the)
  const userArticles = userTokens.filter((t) => ARTICLES.has(t));
  const targetArticles = targetTokens.filter((t) => ARTICLES.has(t));
  const nonArticleUser = userTokens.filter((t) => !ARTICLES.has(t)).join(" ");
  const nonArticleTarget = targetTokens.filter((t) => !ARTICLES.has(t)).join(" ");

  if (nonArticleUser === nonArticleTarget && nonArticleUser.length > 0) {
    let explanation = `Article error: `;
    if (userArticles.length === 0 && targetArticles.length > 0) {
      explanation += `Missing article "${targetArticles.join(" ")}".`;
    } else if (userArticles.length > 0 && targetArticles.length === 0) {
      explanation += `Unnecessary article "${userArticles.join(" ")}".`;
    } else {
      explanation += `Used "${userArticles.join(" ")}" instead of "${targetArticles.join(" ")}".`;
    }

    return {
      type: "article",
      label: "Article Mistake",
      explanation,
      remediationTip: "Pay close attention to indefinite (a/an) vs definite (the) articles before countable nouns.",
      severity: "low",
      confidence: 0.98,
    };
  }

  // 5. Check Preposition Mistakes
  const userPreps = userTokens.filter((t) => PREPOSITIONS.has(t));
  const targetPreps = targetTokens.filter((t) => PREPOSITIONS.has(t));
  const nonPrepUser = userTokens.filter((t) => !PREPOSITIONS.has(t)).join(" ");
  const nonPrepTarget = targetTokens.filter((t) => !PREPOSITIONS.has(t)).join(" ");

  if (nonPrepUser === nonPrepTarget && nonPrepUser.length > 0) {
    let explanation = `Preposition error: `;
    if (userPreps.length === 0 && targetPreps.length > 0) {
      explanation += `Missing preposition "${targetPreps.join(" ")}".`;
    } else if (userPreps.length > 0 && targetPreps.length === 0) {
      explanation += `Extra preposition "${userPreps.join(" ")}".`;
    } else {
      explanation += `Used "${userPreps.join(" ")}" instead of "${targetPreps.join(" ")}".`;
    }

    return {
      type: "preposition",
      label: "Preposition Mistake",
      explanation,
      remediationTip: "Learn dependent prepositions as fixed chunks (e.g. 'depend on', 'interested in', 'arrive at').",
      severity: "medium",
      confidence: 0.95,
    };
  }

  // 6. Check Missing Word(s)
  if (userTokens.length < targetTokens.length) {
    const isSubset = userTokens.every((ut) => targetTokens.includes(ut));
    const missing = targetTokens.filter((tt) => !userTokens.includes(tt));
    if (isSubset || missing.length <= targetTokens.length - userTokens.length) {
      return {
        type: "missing-word",
        label: "Missing Word",
        explanation: `Omitted word(s): "${missing.join(" ")}". Target was "${rawTarget}".`,
        remediationTip: "IELTS audio instructions usually specify exact word counts (e.g., 'NO MORE THAN TWO WORDS').",
        severity: "medium",
        confidence: 0.9,
      };
    }
  }

  // 7. Check Extra Word(s)
  if (userTokens.length > targetTokens.length) {
    const isSuperset = targetTokens.every((tt) => userTokens.includes(tt));
    const extra = userTokens.filter((ut) => !targetTokens.includes(ut));
    if (isSuperset || extra.length > 0) {
      return {
        type: "extra-word",
        label: "Extra Word",
        explanation: `Added extra word(s): "${extra.join(" ")}". Target was "${rawTarget}".`,
        remediationTip: "Write only what is heard. Adding unprompted filler words will cause IELTS to mark the answer incorrect.",
        severity: "medium",
        confidence: 0.9,
      };
    }
  }

  // 8. Spelling Mistake vs Wrong Word
  const dist = levenshteinDistance(normUser, normTarget);
  const maxLen = Math.max(normUser.length, normTarget.length);
  const similarity = maxLen > 0 ? 1 - dist / maxLen : 1;

  // Single word evaluation or typo across phrase
  if (userTokens.length === 1 && targetTokens.length === 1) {
    // If distance is <= 2 or similarity >= 0.65 -> It is a spelling mistake
    if (dist <= 2 || similarity >= 0.65) {
      return {
        type: "spelling",
        label: "Spelling Mistake",
        explanation: `Misspelled "${rawTarget}". Typed "${rawUser}" (${dist} character ${dist === 1 ? "difference" : "differences"}).`,
        remediationTip: "Check for silent letters, double consonants (e.g. 'cc', 'mm', 'rr'), and vowel combinations (e.g. 'ie' vs 'ei').",
        severity: "high",
        confidence: 0.95,
      };
    } else {
      return {
        type: "wrong-word",
        label: "Wrong Word",
        explanation: `Entered completely different word "${rawUser}". Target was "${rawTarget}".`,
        remediationTip: "Review vocabulary flashcards and listen closely to the phonetic pronunciation.",
        severity: "high",
        confidence: 0.9,
      };
    }
  }

  // Multi-word phrase spelling vs wrong word
  if (similarity >= 0.7 || dist <= 3) {
    return {
      type: "spelling",
      label: "Spelling Mistake",
      explanation: `Minor spelling discrepancy in phrase. Typed "${rawUser}", expected "${rawTarget}".`,
      remediationTip: "Review spelling of compound words and hyphenation rules.",
      severity: "medium",
      confidence: 0.85,
    };
  }

  // Default: Wrong Word
  return {
    type: "wrong-word",
    label: "Wrong Word",
    explanation: `Target phrase was "${rawTarget}", but you wrote "${rawUser}".`,
    remediationTip: "Listen for key content nouns and verbs before writing your answer.",
    severity: "high",
    confidence: 0.85,
  };
}

/**
 * Returns user-friendly metadata for a given mistake type.
 */
export function getMistakeTypeDetails(type: MistakeType | string) {
  switch (type) {
    case "spelling":
      return {
        label: "Spelling Mistake",
        badgeVariant: "destructive" as const,
        icon: "PenTool",
        color: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900",
      };
    case "article":
      return {
        label: "Article Mistake",
        badgeVariant: "warning" as const,
        icon: "FileText",
        color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
      };
    case "preposition":
      return {
        label: "Preposition Mistake",
        badgeVariant: "indigo" as const,
        icon: "Compass",
        color: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
      };
    case "singular-plural":
      return {
        label: "Singular / Plural Mistake",
        badgeVariant: "default" as const,
        icon: "Layers",
        color: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900",
      };
    case "number":
      return {
        label: "Number Mistake",
        badgeVariant: "secondary" as const,
        icon: "Binary",
        color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
      };
    case "date-time":
      return {
        label: "Date / Time Mistake",
        badgeVariant: "outline" as const,
        icon: "Clock",
        color: "text-teal-600 bg-teal-50 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900",
      };
    case "missing-word":
      return {
        label: "Missing Word",
        badgeVariant: "destructive" as const,
        icon: "MinusCircle",
        color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
      };
    case "extra-word":
      return {
        label: "Extra Word",
        badgeVariant: "destructive" as const,
        icon: "PlusCircle",
        color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
      };
    case "wrong-word":
    default:
      return {
        label: "Wrong Word",
        badgeVariant: "destructive" as const,
        icon: "HelpCircle",
        color: "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      };
  }
}
