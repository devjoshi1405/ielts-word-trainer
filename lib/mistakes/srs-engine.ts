import { NumericMasteryLevel, StringMasteryLevel, MistakeItem } from "@/types/progress.types";

export interface SRSState {
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  masteryNumeric: NumericMasteryLevel;
  masteryLevel: StringMasteryLevel;
  lastReviewedIso: string;
  nextReviewIso: string;
  nextReviewDisplay: string;
  isDue: boolean;
  accuracy: number;
}

/**
 * Calculates numeric and string mastery level:
 * 0 = New
 * 1 = Learning
 * 2 = Practicing
 * 3 = Familiar
 * 4 = Mastered (Only after repeated correct answers: consecutive_correct >= 3)
 */
export function calculateMastery(
  totalAttempts: number,
  consecutiveCorrect: number,
  incorrectCount: number
): { numeric: NumericMasteryLevel; level: StringMasteryLevel; label: string } {
  if (totalAttempts === 0) {
    return { numeric: 0, level: "new", label: "New (Unseen)" };
  }

  if (consecutiveCorrect >= 3) {
    return { numeric: 4, level: "mastered", label: "Mastered (Band 9)" };
  }

  if (consecutiveCorrect === 2) {
    return { numeric: 3, level: "familiar", label: "Familiar (Near Mastery)" };
  }

  if (consecutiveCorrect === 1) {
    return { numeric: 2, level: "practicing", label: "Practicing (Improving)" };
  }

  // consecutiveCorrect === 0
  return { numeric: 1, level: "learning", label: "Learning (Needs Work)" };
}

/**
 * Returns review interval in milliseconds based on consecutive correct count and result.
 * - First mistake / failed attempt: Review soon (20 minutes).
 * - 1st correct: 1 day
 * - 2nd correct: 3 days
 * - 3rd correct: 7 days
 * - 4th correct: 14 days
 * - 5th+ correct: 30 days
 */
export function getSRSIntervalMs(consecutiveCorrect: number, isCorrect: boolean): number {
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  if (!isCorrect) {
    // Review soon: 20 minutes
    return 20 * MINUTE;
  }

  switch (consecutiveCorrect) {
    case 1:
      return 1 * DAY; // 24 hours
    case 2:
      return 3 * DAY; // 72 hours
    case 3:
      return 7 * DAY; // 7 days
    case 4:
      return 14 * DAY; // 14 days
    default:
      return 30 * DAY; // 30 days
  }
}

/**
 * Formats a next review ISO timestamp into human-readable relative string.
 */
export function formatNextReviewDisplay(nextReviewIso?: string | null): { text: string; isDue: boolean } {
  if (!nextReviewIso) {
    return { text: "Due now", isDue: true };
  }

  const target = new Date(nextReviewIso).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return { text: "Due now", isDue: true };
  }

  const diffMinutes = Math.round(diffMs / (60 * 1000));
  const diffHours = Math.round(diffMs / (60 * 60 * 1000));
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  if (diffMinutes <= 30) {
    return { text: `Due in ${diffMinutes}m`, isDue: true };
  }
  if (diffMinutes < 60) {
    return { text: `Due in ${diffMinutes}m`, isDue: false };
  }
  if (diffHours < 24) {
    return { text: `Due in ${diffHours}h`, isDue: false };
  }
  if (diffDays === 1) {
    return { text: "Due tomorrow", isDue: false };
  }
  return { text: `Review in ${diffDays}d`, isDue: false };
}

/**
 * Calculates updated SRS state after an attempt.
 */
export function processAttemptSRS(
  prev: {
    correctCount?: number;
    incorrectCount?: number;
    consecutiveCorrect?: number;
  },
  isCorrect: boolean
): SRSState {
  const correctCount = (prev.correctCount || 0) + (isCorrect ? 1 : 0);
  const incorrectCount = (prev.incorrectCount || 0) + (isCorrect ? 0 : 1);
  const consecutiveCorrect = isCorrect ? (prev.consecutiveCorrect || 0) + 1 : 0;

  const totalAttempts = correctCount + incorrectCount;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  const { numeric, level } = calculateMastery(totalAttempts, consecutiveCorrect, incorrectCount);

  const now = Date.now();
  const intervalMs = getSRSIntervalMs(consecutiveCorrect, isCorrect);
  const nextReviewDate = new Date(now + intervalMs);

  const { text: nextReviewDisplay, isDue } = formatNextReviewDisplay(nextReviewDate.toISOString());

  return {
    correctCount,
    incorrectCount,
    consecutiveCorrect,
    masteryNumeric: numeric,
    masteryLevel: level,
    lastReviewedIso: new Date(now).toISOString(),
    nextReviewIso: nextReviewDate.toISOString(),
    nextReviewDisplay,
    isDue,
    accuracy,
  };
}

/**
 * Calculates priority score for sorting mistake review queue.
 * Higher score = Higher review priority.
 * - Due items get massive priority boost (+1000).
 * - Lower mastery levels get higher priority.
 * - Higher error counts increase priority.
 */
export function calculateMistakePriority(item: {
  isDue?: boolean;
  nextReviewIso?: string;
  errorCount: number;
  masteryNumeric?: number;
  accuracy?: number;
}): number {
  let score = 0;

  // 1. Due status priority
  const isDue = item.isDue ?? (item.nextReviewIso ? new Date(item.nextReviewIso).getTime() <= Date.now() : true);
  if (isDue) {
    score += 1000;
  }

  // 2. Error count priority (+50 per error, max 500)
  score += Math.min(500, (item.errorCount || 1) * 50);

  // 3. Lower mastery = higher priority (Mastery 0: +400, Mastery 1: +300, Mastery 2: +200, Mastery 3: +100, Mastery 4: 0)
  const mastery = item.masteryNumeric ?? 1;
  score += (4 - mastery) * 100;

  // 4. Low accuracy priority
  if (item.accuracy !== undefined) {
    score += (100 - item.accuracy);
  }

  return score;
}
