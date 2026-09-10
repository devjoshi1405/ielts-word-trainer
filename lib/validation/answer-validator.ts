import {
  AnswerValidationResult,
  DiffSegment,
  ExerciseType,
} from "@/types/exercise.types";

/**
 * Normalizes input text according to IELTS grading requirements:
 * - Lowercase
 * - Trim leading/trailing whitespace
 * - Collapse repeated spaces to single space
 * - Standardize smart quotes and dashes
 * - Strip non-essential trailing punctuation (. , ! ?)
 */
export function normalizeText(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .trim()
    .replace(/[“”"‘’`]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[.,!?;:]+$/g, "") // remove trailing punctuation
    .replace(/\s+/g, " ");
}

/**
 * Calculates Levenshtein Distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Computes character-level diff segments between user answer and target answer.
 */
export function computeCharacterDiff(userText: string, targetText: string): DiffSegment[] {
  const diffs: DiffSegment[] = [];
  const u = userText.trim().toLowerCase();
  const t = targetText.trim().toLowerCase();

  const maxLen = Math.max(u.length, t.length);

  for (let i = 0; i < maxLen; i++) {
    const uChar = u[i];
    const tChar = t[i];

    if (uChar === tChar && uChar !== undefined) {
      diffs.push({ char: targetText[i] || uChar, type: "correct" });
    } else if (uChar === undefined && tChar !== undefined) {
      diffs.push({ char: targetText[i], type: "missing" });
    } else if (uChar !== undefined && tChar === undefined) {
      diffs.push({ char: uChar, type: "extra" });
    } else {
      diffs.push({ char: targetText[i] || uChar, type: "mismatch" });
    }
  }

  return diffs;
}

/**
 * Normalizes number formats (currency, commas, percentage symbols).
 */
function normalizeNumberAnswer(s: string): string {
  return s
    .replace(/[£$€]/g, "")
    .replace(/pounds?|dollars?|euros?/g, "")
    .replace(/percent|percentage/g, "%")
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * Normalizes date formats (ordinals e.g. 14th -> 14, standard month names).
 */
function normalizeDateAnswer(s: string): string {
  return s
    .replace(/(\d+)(st|nd|rd|th)/g, "$1")
    .replace(/\bof\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes time formats (dots to colons, spacing before am/pm).
 */
function normalizeTimeAnswer(s: string): string {
  return s
    .replace(/\./g, ":")
    .replace(/(\d{1,2}:\d{2})\s*(am|pm)/g, "$1 $2")
    .replace(/a\.m\./g, "am")
    .replace(/p\.m\./g, "pm")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ValidationOptions {
  category?: string;
  type?: ExerciseType;
  acceptedAnswers?: string[];
  spellingTip?: string;
  phoneticIpa?: string;
  attemptNumber?: number;
  maxAttempts?: number;
}

/**
 * Validates a user answer against the target answer with multi-type tolerances and multi-attempt tracking.
 */
export function validateAnswer(
  userAnswer: string,
  targetAnswer: string,
  options: ValidationOptions = {}
): AnswerValidationResult {
  const {
    category,
    type,
    acceptedAnswers = [],
    spellingTip,
    phoneticIpa,
    attemptNumber = 1,
    maxAttempts = 2,
  } = options;

  const normUser = normalizeText(userAnswer);
  const normTarget = normalizeText(targetAnswer);

  let isMatch = false;

  // 1. Exact normalized match
  if (normUser === normTarget) {
    isMatch = true;
  }

  // 2. Match against explicit acceptedAnswers list
  if (!isMatch && acceptedAnswers.length > 0) {
    for (const alt of acceptedAnswers) {
      if (normUser === normalizeText(alt)) {
        isMatch = true;
        break;
      }
    }
  }

  // 3. Number tolerance
  if (!isMatch && (type === "NUMBER" || category === "numbers")) {
    const uNum = normalizeNumberAnswer(normUser);
    const tNum = normalizeNumberAnswer(normTarget);
    if (uNum.length > 0 && uNum === tNum) {
      isMatch = true;
    } else if (acceptedAnswers.some(a => normalizeNumberAnswer(normalizeText(a)) === uNum)) {
      isMatch = true;
    }
  }

  // 4. Date tolerance
  if (!isMatch && (type === "DATE" || category === "dates-times")) {
    const uDate = normalizeDateAnswer(normUser);
    const tDate = normalizeDateAnswer(normTarget);
    if (uDate.length > 0 && uDate === tDate) {
      isMatch = true;
    } else if (acceptedAnswers.some(a => normalizeDateAnswer(normalizeText(a)) === uDate)) {
      isMatch = true;
    }
  }

  // 5. Time tolerance
  if (!isMatch && (type === "TIME" || category === "dates-times")) {
    const uTime = normalizeTimeAnswer(normUser);
    const tTime = normalizeTimeAnswer(normTarget);
    if (uTime.length > 0 && uTime === tTime) {
      isMatch = true;
    } else if (acceptedAnswers.some(a => normalizeTimeAnswer(normalizeText(a)) === uTime)) {
      isMatch = true;
    }
  }

  // Calculate similarity and character diff
  const distance = levenshteinDistance(normUser, normTarget);
  const maxLen = Math.max(normUser.length, normTarget.length);
  const similarity = maxLen === 0 ? 1 : Math.max(0, 1 - distance / maxLen);

  const diffSegments = computeCharacterDiff(userAnswer, targetAnswer);

  const isRevealed = isMatch || attemptNumber >= maxAttempts;
  const canRetry = !isMatch && attemptNumber < maxAttempts;

  return {
    isCorrect: isMatch,
    userAnswer,
    targetAnswer,
    similarity,
    diffSegments,
    normalizedUserAnswer: normUser,
    normalizedTargetAnswer: normTarget,
    spellingTip,
    phoneticIpa,
    attemptNumber,
    maxAttempts,
    isRevealed,
    canRetry,
  };
}
