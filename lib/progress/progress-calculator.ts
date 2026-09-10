import { ExerciseCategory } from "@/types/exercise.types";
import { UserAttemptRow, UserProgressRow } from "@/types/database.types";
import { DashboardStats } from "@/types/progress.types";

export interface ProgressCalculationResult {
  accuracy: number; // percentage e.g. 91
  questionsCompleted: number; // total attempts
  correctAnswers: number; // total correct
  incorrectAnswers: number; // total incorrect
  streak: number; // consecutive active days
  wordsMastered: number; // words with consecutive_correct >= 3 or mastered
  difficultWords: number; // words with incorrect_count >= 2
  weeklyActivity: { day: string; count: number; accuracy: number; date: string }[];
  categoryAccuracy: {
    category: ExerciseCategory;
    name: string;
    accuracy: number;
    completed: number;
    total: number;
  }[];
}

const CATEGORY_NAMES: Record<string, string> = {
  academic: "Academic & University",
  accommodation: "Housing & Accommodation",
  transport: "Transport & Travel",
  work: "Work & Employment",
  education: "Education & Learning",
  health: "Health & Medicine",
  technology: "Technology & Science",
  environment: "Environment & Ecology",
  society: "Society & Culture",
  shopping: "Shopping & Retail",
  services: "Services & Facilities",
  everyday: "Everyday English",
  numbers: "Numbers, Dates & Times",
  prepositions: "Articles & Prepositions",
  vocabulary: "General Vocabulary",
  spelling: "Spelling Traps",
  collocations: "Collocations",
  sentences: "Sentence Dictation",
};

/**
 * Calculates current active streak in consecutive calendar days.
 */
export function calculateStreak(timestamps: (string | number | Date)[]): number {
  if (!timestamps || timestamps.length === 0) return 0;

  // Normalize to unique UTC date strings "YYYY-MM-DD"
  const dateSet = new Set<string>();
  for (const t of timestamps) {
    const d = new Date(t);
    if (!isNaN(d.getTime())) {
      dateSet.add(d.toISOString().slice(0, 10));
    }
  }

  const sortedDates = Array.from(dateSet).sort().reverse();
  if (sortedDates.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // If latest active date is neither today nor yesterday, streak is broken
  const latest = sortedDates[0];
  if (latest !== today && latest !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(latest);

  for (let i = 0; i < sortedDates.length; i++) {
    const expected = checkDate.toISOString().slice(0, 10);
    if (sortedDates.includes(expected)) {
      streak++;
      // Move 1 day back
      checkDate = new Date(checkDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates weekly activity array for the past 7 days.
 */
export function calculateWeeklyActivity(
  attempts: { created_at: string; is_correct: boolean }[]
): { day: string; count: number; accuracy: number; date: string }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: { day: string; count: number; accuracy: number; date: string }[] = [];

  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = days[d.getDay()];

    const dayAttempts = attempts.filter((a) => a.created_at.slice(0, 10) === dateStr);
    const count = dayAttempts.length;
    const correct = dayAttempts.filter((a) => a.is_correct).length;
    const accuracy = count > 0 ? Math.round((correct / count) * 100) : 0;

    result.push({
      day: dayName,
      date: dateStr,
      count,
      accuracy,
    });
  }

  return result;
}

/**
 * Calculates comprehensive progress metrics from raw attempts and progress records.
 */
export function calculateProgressStats(
  attempts: UserAttemptRow[],
  progressRows: UserProgressRow[]
): ProgressCalculationResult {
  const questionsCompleted = attempts.length;
  const correctAnswers = attempts.filter((a) => a.is_correct).length;
  const incorrectAnswers = questionsCompleted - correctAnswers;
  const accuracy = questionsCompleted > 0 ? Math.round((correctAnswers / questionsCompleted) * 100) : 0;

  const streak = calculateStreak(attempts.map((a) => a.created_at));

  // Words mastered: consecutive_correct >= 3 OR mastery_level === 'mastered'
  const wordsMastered = progressRows.filter(
    (p) => p.consecutive_correct >= 3 || p.mastery_level === "mastered"
  ).length;

  // Difficult words: items with 2 or more incorrect attempts
  const difficultWords = progressRows.filter(
    (p) => p.incorrect_count >= 2 || p.mastery_level === "critical"
  ).length;

  const weeklyActivity = calculateWeeklyActivity(attempts);

  // Group attempts by category if question metadata is present
  const categoryMap = new Map<
    string,
    { total: number; correct: number; completed: number }
  >();

  // Default seed categories to ensure consistent dashboard display
  const standardCategories: ExerciseCategory[] = [
    "academic",
    "accommodation",
    "transport",
    "work",
    "education",
    "health",
    "technology",
    "environment",
    "numbers",
  ];

  for (const cat of standardCategories) {
    categoryMap.set(cat, { total: 50, correct: 0, completed: 0 });
  }

  for (const attempt of attempts) {
    // Determine category from question_id prefix or default
    let cat = "academic";
    const qId = attempt.question_id || "";
    for (const sc of standardCategories) {
      if (qId.toLowerCase().includes(sc)) {
        cat = sc;
        break;
      }
    }

    const current = categoryMap.get(cat) || { total: 50, correct: 0, completed: 0 };
    current.completed++;
    if (attempt.is_correct) {
      current.correct++;
    }
    categoryMap.set(cat, current);
  }

  const categoryAccuracy = Array.from(categoryMap.entries()).map(([cat, stats]) => ({
    category: cat as ExerciseCategory,
    name: CATEGORY_NAMES[cat] || cat.toUpperCase(),
    completed: stats.completed,
    total: Math.max(stats.total, stats.completed),
    accuracy: stats.completed > 0 ? Math.round((stats.correct / stats.completed) * 100) : 0,
  }));

  return {
    accuracy,
    questionsCompleted,
    correctAnswers,
    incorrectAnswers,
    streak,
    wordsMastered,
    difficultWords,
    weeklyActivity,
    categoryAccuracy,
  };
}
