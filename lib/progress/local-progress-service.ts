import { IProgressService } from "./progress-service.interface";
import { DashboardStats, MistakeItem, PracticeModuleSummary, AttemptSubmission, MistakeType } from "@/types/progress.types";
import { ExerciseCategory } from "@/types/exercise.types";
import { UserAttemptRow, UserProgressRow, MasteryLevel } from "@/types/database.types";
import { calculateProgressStats } from "./progress-calculator";
import { classifyMistake, getMistakeTypeDetails } from "@/lib/mistakes/mistake-classifier";
import { processAttemptSRS, formatNextReviewDisplay, calculateMistakePriority, calculateMastery } from "@/lib/mistakes/srs-engine";
import { MOCK_MODULE_SUMMARIES } from "@/data/mock-stats";
import { VOCABULARY_BY_WORD, VOCABULARY_BY_ID } from "@/data/vocabulary";

const LOCAL_STORAGE_ATTEMPTS_KEY = "ielts_user_attempts_v1";
const LOCAL_STORAGE_PROGRESS_KEY = "ielts_user_progress_v1";
const LOCAL_STORAGE_REMOVED_MISTAKES_KEY = "ielts_removed_mistakes_v1";

/**
 * Local-first / Offline Progress Service using HTML5 localStorage with in-memory fallback.
 * Integrates deterministic 9-type mistake classification & 5-tier Spaced Repetition System (SRS).
 */
export class LocalProgressService implements IProgressService {
  private inMemoryAttempts: UserAttemptRow[] = [];
  private inMemoryProgress: Map<string, UserProgressRow> = new Map();
  private inMemoryRemovedMistakes: Set<string> = new Set();
  private isInitialized = false;

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    if (typeof window === "undefined") return;

    try {
      const storedAttempts = localStorage.getItem(LOCAL_STORAGE_ATTEMPTS_KEY);
      if (storedAttempts) {
        this.inMemoryAttempts = JSON.parse(storedAttempts);
      }

      const storedProgress = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      if (storedProgress) {
        const arr: UserProgressRow[] = JSON.parse(storedProgress);
        this.inMemoryProgress = new Map(arr.map((p) => [p.vocabulary_id, p]));
      }

      const storedRemoved = localStorage.getItem(LOCAL_STORAGE_REMOVED_MISTAKES_KEY);
      if (storedRemoved) {
        const arr: string[] = JSON.parse(storedRemoved);
        this.inMemoryRemovedMistakes = new Set(arr);
      }

      this.isInitialized = true;
    } catch (e) {
      console.warn("Failed to load progress from localStorage:", e);
    }
  }

  private syncToStorage() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(LOCAL_STORAGE_ATTEMPTS_KEY, JSON.stringify(this.inMemoryAttempts));
      localStorage.setItem(
        LOCAL_STORAGE_PROGRESS_KEY,
        JSON.stringify(Array.from(this.inMemoryProgress.values()))
      );
      localStorage.setItem(
        LOCAL_STORAGE_REMOVED_MISTAKES_KEY,
        JSON.stringify(Array.from(this.inMemoryRemovedMistakes))
      );
    } catch (e) {
      console.warn("Failed to sync progress to localStorage:", e);
    }
  }

  async recordAttempt(data: AttemptSubmission | any): Promise<void> {
    this.initFromStorage();

    const isSubmission = "questionId" in data;
    const questionId = isSubmission ? data.questionId : data.exerciseId;
    const userAnswer = (isSubmission ? data.userAnswer : data.userInput) || "";
    const isCorrect = Boolean(data.isCorrect);
    const targetAnswer = (isSubmission ? data.correctAnswer : data.targetAnswer) || "";
    const attemptNumber = (isSubmission ? data.attemptNumber : data.attemptNumber) || 1;
    const category = isSubmission ? data.category : data.category;
    const userId = data.userId || "local-user-uuid";

    // Automatic deterministic classification if mistakeType is not supplied or if failed
    let mistakeType = isSubmission ? data.mistakeType : data.mistakeType;
    if (!isCorrect && !mistakeType) {
      const classification = classifyMistake(userAnswer, targetAnswer, typeof category === "string" ? category : undefined);
      mistakeType = classification.type;
    }

    // Deduce vocabulary ID from targetAnswer or questionId
    let vocabId = data.vocabularyId;
    if (!vocabId && targetAnswer) {
      const vItem = VOCABULARY_BY_WORD.get(targetAnswer.trim().toLowerCase());
      if (vItem) {
        vocabId = vItem.id;
      } else {
        vocabId = `vocab-${targetAnswer.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      }
    }
    if (!vocabId) {
      vocabId = `vocab-${questionId}`;
    }

    // 1. Record Attempt Row
    const attemptRow: UserAttemptRow = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      user_id: userId,
      question_id: questionId,
      user_answer: userAnswer,
      correct_answer: targetAnswer,
      is_correct: isCorrect,
      mistake_type: mistakeType || null,
      attempt_number: attemptNumber,
      created_at: new Date().toISOString(),
    };

    this.inMemoryAttempts.push(attemptRow);

    // 2. Update Progress Row with Spaced Repetition & Mastery
    const existing = this.inMemoryProgress.get(vocabId) || {
      id: `prog-${vocabId}`,
      user_id: userId,
      vocabulary_id: vocabId,
      correct_count: 0,
      incorrect_count: 0,
      consecutive_correct: 0,
      mastery_level: "learning" as MasteryLevel,
      last_reviewed: null,
      next_review: null,
      created_at: new Date().toISOString(),
    };

    const srsUpdate = processAttemptSRS(
      {
        correctCount: existing.correct_count,
        incorrectCount: existing.incorrect_count,
        consecutiveCorrect: existing.consecutive_correct,
      },
      isCorrect
    );

    existing.correct_count = srsUpdate.correctCount;
    existing.incorrect_count = srsUpdate.incorrectCount;
    existing.consecutive_correct = srsUpdate.consecutiveCorrect;
    existing.mastery_level = srsUpdate.masteryLevel as MasteryLevel;
    existing.last_reviewed = srsUpdate.lastReviewedIso;
    existing.next_review = srsUpdate.nextReviewIso;

    this.inMemoryProgress.set(vocabId, existing);

    // If word was previously removed from mistakes, un-remove if failed again
    if (!isCorrect) {
      this.inMemoryRemovedMistakes.delete(vocabId);
    }

    this.syncToStorage();
  }

  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    this.initFromStorage();

    const progressRows = Array.from(this.inMemoryProgress.values());
    const stats = calculateProgressStats(this.inMemoryAttempts, progressRows);

    return {
      listeningAccuracy: stats.accuracy,
      questionsCompleted: stats.questionsCompleted,
      wordsMastered: stats.wordsMastered,
      currentStreak: stats.streak,
      correctAnswers: stats.correctAnswers,
      incorrectAnswers: stats.incorrectAnswers,
      difficultWords: stats.difficultWords,
      weeklyActivity: stats.weeklyActivity,
      categoryAccuracy: stats.categoryAccuracy,
    };
  }

  async getMistakes(userId?: string): Promise<MistakeItem[]> {
    this.initFromStorage();

    const mistakes: MistakeItem[] = [];
    const progressRows = Array.from(this.inMemoryProgress.values());

    for (const prog of progressRows) {
      if (prog.incorrect_count <= 0) continue;
      if (this.inMemoryRemovedMistakes.has(prog.vocabulary_id)) continue;

      // Find vocabulary details
      const vocabItem =
        VOCABULARY_BY_ID.get(prog.vocabulary_id) ||
        Array.from(VOCABULARY_BY_WORD.values()).find(
          (v) => v.id === prog.vocabulary_id
        );

      // Find user's attempts for this vocabulary item
      const attemptsForVocab = this.inMemoryAttempts.filter(
        (a) =>
          a.question_id.includes(prog.vocabulary_id) ||
          (vocabItem && a.correct_answer.toLowerCase() === vocabItem.word.toLowerCase()) ||
          (a.correct_answer && prog.vocabulary_id.includes(a.correct_answer.toLowerCase()))
      );

      const wrongAttempts = attemptsForVocab.filter((a) => !a.is_correct);
      const lastWrongAttempt = wrongAttempts.slice(-1)[0];
      const lastAttempt = attemptsForVocab.slice(-1)[0];

      const word =
        vocabItem?.word ||
        lastWrongAttempt?.correct_answer ||
        lastAttempt?.correct_answer ||
        prog.vocabulary_id.replace(/^vocab-(q-)?/, "");

      const phonetic = vocabItem?.phonetic || "/wɜːd/";
      const definition = vocabItem?.meaning || "IELTS vocabulary target";
      const category = (vocabItem?.category || "academic") as ExerciseCategory;

      const totalAttempts = prog.correct_count + prog.incorrect_count;
      const accuracy = totalAttempts > 0 ? Math.round((prog.correct_count / totalAttempts) * 100) : 0;

      // Calculate SRS & Mastery
      const { numeric: masteryNumeric, level: masteryLevel } = calculateMastery(
        totalAttempts,
        prog.consecutive_correct,
        prog.incorrect_count
      );

      const { text: nextReviewText, isDue } = formatNextReviewDisplay(prog.next_review);

      // Classify Mistake Type deterministically
      const userLastAnswer = lastWrongAttempt?.user_answer || "misspelled";
      const classification = classifyMistake(userLastAnswer, word, category);
      const typeDetails = getMistakeTypeDetails(classification.type);

      const commonTrap =
        vocabItem?.commonMisspellings && vocabItem.commonMisspellings.length > 0
          ? `Common confusion: ${vocabItem.commonMisspellings.join(", ")}`
          : classification.explanation;

      mistakes.push({
        id: prog.vocabulary_id,
        word,
        phoneticIpa: phonetic,
        definition,
        errorCount: prog.incorrect_count,
        totalAttempts,
        correctAttempts: prog.correct_count,
        incorrectAttempts: prog.incorrect_count,
        consecutiveCorrect: prog.consecutive_correct,
        accuracy,
        lastPracticed: prog.last_reviewed
          ? new Date(prog.last_reviewed).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Recently",
        lastPracticedIso: prog.last_reviewed || undefined,
        nextReview: nextReviewText,
        nextReviewIso: prog.next_review || undefined,
        isDue,
        commonTrap,
        userLastAttempt: userLastAnswer,
        mistakeType: classification.type,
        mistakeTypeLabel: typeDetails.label,
        mistakeExplanation: classification.explanation,
        remediationTip: classification.remediationTip,
        masteryLevel,
        masteryNumeric,
        category,
      });
    }

    // Sort by priority (due items first, highest errors, lowest mastery)
    return mistakes.sort((a, b) => {
      const pA = calculateMistakePriority(a);
      const pB = calculateMistakePriority(b);
      return pB - pA;
    });
  }

  async getModuleSummaries(userId?: string): Promise<PracticeModuleSummary[]> {
    return MOCK_MODULE_SUMMARIES;
  }

  async removeMistake(id: string, userId?: string): Promise<void> {
    this.initFromStorage();
    this.inMemoryRemovedMistakes.add(id);
    this.syncToStorage();
  }

  async resetProgress(userId?: string): Promise<void> {
    this.inMemoryAttempts = [];
    this.inMemoryProgress.clear();
    this.inMemoryRemovedMistakes.clear();
    this.syncToStorage();
  }
}

export const localProgressService = new LocalProgressService();
