import {
  IGrammarService,
  GetVerbsOptions,
  PaginatedVerbsResult,
} from "./grammar-service.interface";
import {
  GrammarCategory,
  GrammarTopic,
  GrammarLesson,
  VerbItem,
  UserGrammarProgress,
  UserVerbProgress,
  VerbProgressStats,
  ResumeLearningSession,
  GrammarDashboardStats,
  GrammarQuestion,
  CategoryProgressSummary,
  TestSubmissionResult,
  GrammarProgressStatus,
} from "@/types/grammar.types";
import {
  SEED_GRAMMAR_CATEGORIES,
  SEED_GRAMMAR_TOPICS,
  SEED_GRAMMAR_LESSONS,
} from "@/data/grammar-seed";
import { VERBS_500_DATA } from "@/data/verbs-500";
import {
  PARTS_OF_SPEECH_DATA,
  PartOfSpeechTopicData,
} from "@/data/grammar-pos-content";
import { TENSES_DATA } from "@/data/grammar-tenses-content";
import { TenseTopicData } from "@/types/grammar.types";

const LOCAL_STORAGE_PROGRESS_KEY = "ielts_grammar_user_progress_v1";
const LOCAL_STORAGE_VERB_PROGRESS_KEY = "ielts_grammar_user_verb_progress_v1";

export class LocalGrammarService implements IGrammarService {
  private getStorageKey(userId?: string): string {
    const uid = userId || "guest-user-uuid";
    return `${LOCAL_STORAGE_PROGRESS_KEY}_${uid}`;
  }

  private getVerbStorageKey(userId?: string): string {
    const uid = userId || "guest-user-uuid";
    return `${LOCAL_STORAGE_VERB_PROGRESS_KEY}_${uid}`;
  }

  private readProgress(userId?: string): UserGrammarProgress[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(this.getStorageKey(userId));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private writeProgress(items: UserGrammarProgress[], userId?: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to write grammar progress to localStorage:", e);
    }
  }

  private readVerbProgress(userId?: string): Record<string, UserVerbProgress> {
    if (typeof window === "undefined") return {};
    try {
      const data = localStorage.getItem(this.getVerbStorageKey(userId));
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private writeVerbProgress(map: Record<string, UserVerbProgress>, userId?: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.getVerbStorageKey(userId), JSON.stringify(map));
    } catch (e) {
      console.warn("Failed to write verb progress to localStorage:", e);
    }
  }

  async getCategories(): Promise<GrammarCategory[]> {
    return SEED_GRAMMAR_CATEGORIES;
  }

  async getCategoryBySlug(slug: string): Promise<GrammarCategory | null> {
    const category = SEED_GRAMMAR_CATEGORIES.find((c) => c.slug === slug);
    return category || null;
  }

  async getTopics(categoryId?: string): Promise<GrammarTopic[]> {
    if (!categoryId) return SEED_GRAMMAR_TOPICS;
    return SEED_GRAMMAR_TOPICS.filter((t) => t.categoryId === categoryId);
  }

  async getTopicBySlug(slug: string): Promise<GrammarTopic | null> {
    const topic = SEED_GRAMMAR_TOPICS.find((t) => t.slug === slug);
    return topic || null;
  }

  async getLessons(topicId?: string): Promise<GrammarLesson[]> {
    if (!topicId) return SEED_GRAMMAR_LESSONS;
    return SEED_GRAMMAR_LESSONS.filter((l) => l.topicId === topicId);
  }

  async getLessonBySlug(slug: string): Promise<GrammarLesson | null> {
    const lesson = SEED_GRAMMAR_LESSONS.find((l) => l.slug === slug);
    return lesson || null;
  }

  async getPartOfSpeechData(slug: string): Promise<PartOfSpeechTopicData | null> {
    const data = PARTS_OF_SPEECH_DATA[slug];
    return data || null;
  }

  async getTenseData(slug: string): Promise<TenseTopicData | null> {
    const data = TENSES_DATA[slug];
    return data || null;
  }

  async getQuestionsByCategory(
    categorySlug: string,
    type: "practice" | "test" = "practice"
  ): Promise<GrammarQuestion[]> {
    const posTopic = PARTS_OF_SPEECH_DATA[categorySlug];
    if (posTopic) {
      return type === "test" ? posTopic.testQuestions : posTopic.practiceQuestions;
    }
    const tenseTopic = TENSES_DATA[categorySlug];
    if (tenseTopic) {
      return type === "test" ? tenseTopic.testQuestions : tenseTopic.practiceQuestions;
    }
    return [];
  }

  async getAllTenseProgress(userId?: string): Promise<CategoryProgressSummary[]> {
    const progressList = this.readProgress(userId);
    const tenseDefs = [
      { slug: "simple-present", name: "Simple Present Tense" },
      { slug: "simple-past", name: "Simple Past Tense" },
    ];

    return tenseDefs.map((t) => {
      const match = progressList.find(
        (p) => p.categoryId === t.slug || p.topicId === t.slug || p.lessonId === `lesson-${t.slug}`
      );

      const progressPercent = match?.progressPercent ?? 0;
      const masteryScore = match?.masteryScore ?? (match?.bestScore ?? 0);
      const status: GrammarProgressStatus = match?.status ?? "not_started";
      const isMastered = status === "mastered" || masteryScore >= 85;

      let stage: CategoryProgressSummary["stage"] = "not_started";
      if (isMastered) stage = "mastered";
      else if (status === "practicing" || progressPercent >= 70) stage = "practicing";
      else if (status === "learning" || progressPercent > 0) stage = "learning";

      return {
        categorySlug: t.slug,
        categoryName: t.name,
        progressPercent,
        masteryScore,
        status,
        isMastered,
        stage,
        lastAttemptAt: match?.lastAttemptAt || undefined,
        weakAreas: match?.weakAreas,
        strengths: match?.strengths,
        bestScore: match?.bestScore,
        attempts: match?.attempts,
      };
    });
  }

  async getAllCategoryProgress(userId?: string): Promise<CategoryProgressSummary[]> {
    const progressList = this.readProgress(userId);

    return SEED_GRAMMAR_CATEGORIES.map((cat) => {
      const match = progressList.find(
        (p) =>
          (p.categoryId === cat.id || p.categoryId === cat.slug || p.topicId === cat.slug)
      );

      const progressPercent = match?.progressPercent ?? 0;
      const masteryScore = match?.masteryScore ?? 0;
      const status: GrammarProgressStatus = match?.status ?? "not_started";
      const isMastered = status === "mastered" || masteryScore >= 85;

      let stage: CategoryProgressSummary["stage"] = "not_started";
      if (isMastered) stage = "mastered";
      else if (status === "practicing" || progressPercent >= 70) stage = "practicing";
      else if (status === "learning" || progressPercent > 0) stage = "learning";

      return {
        categorySlug: cat.slug,
        categoryName: cat.name,
        progressPercent,
        masteryScore,
        status,
        isMastered,
        stage,
        lastAttemptAt: match?.lastAttemptAt || undefined,
      };
    });
  }

  async getVerbs(options: GetVerbsOptions = {}): Promise<PaginatedVerbsResult> {
    const {
      page = 1,
      limit = 20,
      search = "",
      verbType,
      difficulty,
      isCommon,
      ieltsRelevantOnly,
      isWeakOnly,
      isLearnedOnly,
      userId,
    } = options;

    const userProgressMap = this.readVerbProgress(userId);
    let filtered = [...VERBS_500_DATA];

    if (search) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.baseForm.toLowerCase().includes(q) ||
          v.pastForm.toLowerCase().includes(q) ||
          v.pastParticiple.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q)
      );
    }

    if (verbType) {
      filtered = filtered.filter((v) => v.verbType === verbType);
    }

    if (difficulty) {
      filtered = filtered.filter((v) => v.difficulty === difficulty);
    }

    if (isCommon !== undefined) {
      filtered = filtered.filter((v) => v.isCommon === isCommon);
    }

    if (ieltsRelevantOnly) {
      filtered = filtered.filter((v) => v.isIeltsRelevant);
    }

    if (isWeakOnly) {
      filtered = filtered.filter((v) => userProgressMap[v.id]?.isWeak);
    }

    if (isLearnedOnly) {
      filtered = filtered.filter(
        (v) =>
          userProgressMap[v.id]?.status === "learned" ||
          userProgressMap[v.id]?.status === "mastered"
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      userProgressMap,
    };
  }

  async getVerbById(id: string): Promise<VerbItem | null> {
    const found =
      VERBS_500_DATA.find((v) => v.id === id) ||
      VERBS_500_DATA.find((v) => v.baseForm.toLowerCase() === id.toLowerCase());
    return found || null;
  }

  async getAllVerbsList(): Promise<VerbItem[]> {
    return VERBS_500_DATA;
  }

  async getUserVerbProgress(userId?: string): Promise<Record<string, UserVerbProgress>> {
    return this.readVerbProgress(userId);
  }

  async getVerbStats(userId?: string): Promise<VerbProgressStats> {
    const map = this.readVerbProgress(userId);
    const totalVerbs = VERBS_500_DATA.length;
    const entries = Object.values(map);

    const learnedCount = entries.filter((e) => e.status === "learned" || e.status === "mastered").length;
    const masteredCount = entries.filter((e) => e.status === "mastered").length;
    const weakCount = entries.filter((e) => e.isWeak).length;
    const notStartedCount = Math.max(0, totalVerbs - learnedCount);
    const progressPercent = totalVerbs > 0 ? Math.round((learnedCount / totalVerbs) * 100) : 0;

    return {
      totalVerbs,
      learnedCount,
      masteredCount,
      weakCount,
      notStartedCount,
      progressPercent,
    };
  }

  async recordVerbAttempt(verbId: string, isCorrect: boolean, userId?: string): Promise<void> {
    const map = this.readVerbProgress(userId);
    const existing = map[verbId] || {
      id: `prog-${verbId}`,
      userId: userId || "guest-user-uuid",
      verbId,
      status: "learning" as const,
      confidence: 50,
      attempts: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      isWeak: false,
    };

    const newAttempts = existing.attempts + 1;
    const newTotal = existing.totalAnswers + 1;
    const newCorrect = existing.correctAnswers + (isCorrect ? 1 : 0);
    const accuracy = newCorrect / newTotal;

    // Weak detection: if attempted at least 2 times and accuracy < 70%
    const isWeak = newAttempts >= 2 && accuracy < 0.7;

    // Mastery detection: at least 3 correct answers and accuracy >= 85%
    let newStatus = existing.status;
    if (newCorrect >= 3 && accuracy >= 0.85) {
      newStatus = "mastered";
    } else if (existing.status === "not_started") {
      newStatus = "learning";
    }

    // Next review scheduling: weak -> 1 day, mastered -> 7 days, other -> 3 days
    const daysToAdd = isWeak ? 1 : newStatus === "mastered" ? 7 : 3;
    const nextReview = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    map[verbId] = {
      ...existing,
      attempts: newAttempts,
      totalAnswers: newTotal,
      correctAnswers: newCorrect,
      confidence: Math.round(accuracy * 100),
      isWeak,
      status: newStatus,
      lastPracticedAt: new Date().toISOString(),
      nextReviewAt: nextReview,
      updatedAt: new Date().toISOString(),
    };

    this.writeVerbProgress(map, userId);
  }

  async toggleVerbLearned(verbId: string, learned: boolean, userId?: string): Promise<void> {
    const map = this.readVerbProgress(userId);
    const existing = map[verbId] || {
      id: `prog-${verbId}`,
      userId: userId || "guest-user-uuid",
      verbId,
      confidence: learned ? 80 : 0,
      attempts: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      isWeak: false,
    };

    map[verbId] = {
      ...existing,
      status: learned ? "learned" : "not_started",
      learnedAt: learned ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    this.writeVerbProgress(map, userId);
  }

  async submitVerbTestResult(result: {
    totalQuestions: number;
    score: number;
    testedVerbIds: string[];
    incorrectVerbIds: string[];
    userId?: string;
  }): Promise<void> {
    const { testedVerbIds, incorrectVerbIds, userId } = result;

    for (const verbId of testedVerbIds) {
      const isCorrect = !incorrectVerbIds.includes(verbId);
      await this.recordVerbAttempt(verbId, isCorrect, userId);
    }
  }

  async getUserProgress(userId?: string): Promise<UserGrammarProgress[]> {
    return this.readProgress(userId);
  }

  async getDashboardStats(userId?: string): Promise<GrammarDashboardStats> {
    const categoryProgress = await this.getAllCategoryProgress(userId);
    const totalTopics = SEED_GRAMMAR_CATEGORIES.length;

    const masteredCategories = categoryProgress.filter((c) => c.isMastered);
    const topicsMastered = masteredCategories.length;
    const lessonsCompleted = categoryProgress.filter((c) => c.progressPercent >= 50).length;

    const avgMastery =
      categoryProgress.length > 0
        ? Math.round(
            categoryProgress.reduce((acc, c) => acc + c.masteryScore, 0) /
              Math.max(1, categoryProgress.length)
          )
        : 0;

    const activeCount = categoryProgress.filter((c) => c.status !== "not_started").length;

    return {
      overallMastery: avgMastery,
      topicsMastered,
      totalTopics,
      lessonsCompleted,
      totalLessons: totalTopics,
      verbsStudied: Math.min(activeCount, VERBS_500_DATA.length),
      totalVerbsAvailable: VERBS_500_DATA.length,
      accuracy: avgMastery > 0 ? avgMastery : 0,
      currentStreak: activeCount > 0 ? 1 : 0,
    };
  }

  async getResumeSession(userId?: string): Promise<ResumeLearningSession> {
    const categorySummaries = await this.getAllCategoryProgress(userId);
    const tenseSummaries = await this.getAllTenseProgress(userId);
    const allSummaries = [...tenseSummaries, ...categorySummaries];

    // Find first active topic that is not yet mastered
    const activeSession = allSummaries.find(
      (c) => c.status !== "not_started" && !c.isMastered
    );

    const progressList = this.readProgress(userId);

    if (!activeSession) {
      // Check if Simple Present is unstarted
      const spProgress = progressList.find((p) => p.categoryId === "simple-present" || p.topicId === "simple-present");
      if (!spProgress || spProgress.status === "not_started") {
        return {
          hasActiveSession: false,
          topicId: "simple-present",
          topicTitle: "Simple Present Tense",
          categorySlug: "simple-present",
          categoryName: "Tenses: Simple Present",
          currentStage: "none",
          progressPercent: 0,
          masteryScore: 0,
          isReviewDue: false,
          recommendedNextStep: "Start learning Simple Present habits & sentence structures",
          targetHref: "/grammar/tenses/simple-present",
        };
      }

      // Pick first unstarted
      const firstUnstarted = allSummaries.find((c) => c.status === "not_started");
      const targetSlug = firstUnstarted?.categorySlug || "simple-present";
      const isTense = targetSlug === "simple-present" || targetSlug === "simple-past";
      const targetHref = isTense ? `/grammar/tenses/${targetSlug}` : `/grammar/parts-of-speech/${targetSlug}`;

      return {
        hasActiveSession: false,
        topicId: targetSlug,
        topicTitle: firstUnstarted?.categoryName || "Simple Present Tense",
        categorySlug: targetSlug,
        categoryName: isTense ? `Tenses: ${firstUnstarted?.categoryName}` : `Parts of Speech: ${firstUnstarted?.categoryName}`,
        currentStage: "none",
        progressPercent: 0,
        masteryScore: 0,
        isReviewDue: false,
        recommendedNextStep: `Start learning ${firstUnstarted?.categoryName || "Simple Present"} foundations & rules`,
        targetHref,
      };
    }

    const isTense = activeSession.categorySlug === "simple-present" || activeSession.categorySlug === "simple-past";
    const targetHref = isTense
      ? `/grammar/tenses/${activeSession.categorySlug}`
      : `/grammar/parts-of-speech/${activeSession.categorySlug}`;

    const matchingProgress = progressList.find(
      (p) => p.categoryId === activeSession.categorySlug || p.topicId === activeSession.categorySlug
    );

    let currentStage: ResumeLearningSession["currentStage"] = "learning";
    let nextStep = `Continue studying ${activeSession.categoryName} rules & examples`;

    if (activeSession.progressPercent >= 70) {
      currentStage = "testing";
      nextStep = `Take the ${activeSession.categoryName} diagnostic test to achieve 85%+ mastery`;
    } else if (activeSession.progressPercent >= 50) {
      currentStage = "practicing";
      nextStep = `Solve ${activeSession.categoryName} practice questions with instant feedback`;
    }

    return {
      hasActiveSession: true,
      topicId: activeSession.categorySlug,
      topicTitle: activeSession.categoryName,
      categorySlug: activeSession.categorySlug,
      categoryName: isTense ? `Tenses: ${activeSession.categoryName}` : `Parts of Speech: ${activeSession.categoryName}`,
      currentStage,
      progressPercent: activeSession.progressPercent,
      masteryScore: activeSession.masteryScore,
      lastStudiedAt: activeSession.lastAttemptAt,
      lastSection: matchingProgress?.lastSection,
      isReviewDue: false,
      recommendedNextStep: nextStep,
      targetHref,
    };
  }

  async recordProgress(data: {
    userId?: string;
    categoryId?: string;
    categorySlug?: string;
    topicId?: string;
    topicSlug?: string;
    lessonId?: string;
    status: "not_started" | "learning" | "practicing" | "mastered";
    progressPercent: number;
    masteryScore?: number;
    isCorrect?: boolean;
    lastSection?: string;
    lastStage?: string;
    weakAreas?: string[];
    strengths?: string[];
  }): Promise<void> {
    const current = this.readProgress(data.userId);
    const catIdentifier = data.categorySlug || data.categoryId || data.topicSlug || data.topicId;

    const existingIndex = current.findIndex(
      (p) =>
        (catIdentifier && (p.categoryId === catIdentifier || p.topicId === catIdentifier)) ||
        (data.lessonId && p.lessonId === data.lessonId)
    );

    const existing = existingIndex >= 0 ? current[existingIndex] : null;
    const nowIso = new Date().toISOString();
    const attempts = (existing?.attempts || 0) + 1;
    const correctCount = (existing?.correctAnswers || 0) + (data.isCorrect ? 1 : 0);

    const updatedItem: UserGrammarProgress = {
      id: existing?.id || `prog-${Date.now()}`,
      userId: data.userId || "guest-user-uuid",
      categoryId: catIdentifier || "simple-present",
      topicId: catIdentifier || "simple-present",
      lessonId: data.lessonId || `lesson-${catIdentifier}`,
      status: data.status,
      progressPercent: Math.min(100, Math.max(existing?.progressPercent || 0, data.progressPercent)),
      masteryScore: data.masteryScore ?? (existing?.masteryScore || 0),
      attempts,
      correctAnswers: correctCount,
      totalAnswers: attempts,
      bestScore: existing?.bestScore || (data.masteryScore || 0),
      latestScore: data.masteryScore || existing?.latestScore || 0,
      averageScore: existing?.averageScore || data.masteryScore || 0,
      weakAreas: data.weakAreas || existing?.weakAreas || [],
      strengths: data.strengths || existing?.strengths || [],
      lastSection: data.lastSection || existing?.lastSection,
      lastStage: data.lastStage || existing?.lastStage || "learning",
      lastAttemptAt: nowIso,
      completedAt: data.status === "mastered" ? nowIso : existing?.completedAt,
      updatedAt: nowIso,
    };

    if (existingIndex >= 0) {
      current[existingIndex] = updatedItem;
    } else {
      current.push(updatedItem);
    }

    this.writeProgress(current, data.userId);
  }

  async recordLessonComplete(categorySlug: string, userId?: string, lastSection?: string): Promise<void> {
    const current = this.readProgress(userId);
    const existingIndex = current.findIndex(
      (p) => p.categoryId === categorySlug || p.topicId === categorySlug
    );

    const existing = existingIndex >= 0 ? current[existingIndex] : null;
    const nowIso = new Date().toISOString();

    const progressPercent = Math.max(existing?.progressPercent || 0, 50);
    const status: GrammarProgressStatus = existing?.status === "mastered" ? "mastered" : "practicing";

    const updatedItem: UserGrammarProgress = {
      id: existing?.id || `prog-${Date.now()}`,
      userId: userId || "guest-user-uuid",
      categoryId: categorySlug,
      topicId: categorySlug,
      lessonId: `lesson-${categorySlug}`,
      status,
      progressPercent,
      masteryScore: existing?.masteryScore || 50,
      attempts: (existing?.attempts || 0) + 1,
      correctAnswers: existing?.correctAnswers || 0,
      totalAnswers: (existing?.totalAnswers || 0) + 1,
      bestScore: existing?.bestScore || 50,
      latestScore: 50,
      lastSection: lastSection || "completed",
      lastStage: "practicing",
      lastAttemptAt: nowIso,
      completedAt: existing?.completedAt,
      updatedAt: nowIso,
    };

    if (existingIndex >= 0) {
      current[existingIndex] = updatedItem;
    } else {
      current.push(updatedItem);
    }

    this.writeProgress(current, userId);
  }

  async submitTestResult(
    categorySlug: string,
    score: number,
    totalQuestions: number,
    incorrectQuestions: Array<{ question: GrammarQuestion; userAnswer: string }> = [],
    userId?: string
  ): Promise<TestSubmissionResult> {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isMastered = percentage >= 85;

    let status: GrammarProgressStatus = "learning";
    if (isMastered) {
      status = "mastered";
    } else if (percentage >= 70) {
      status = "practicing";
    }

    const progressPercent = isMastered ? 100 : Math.max(percentage, 70);
    const nowIso = new Date().toISOString();

    // Extract weak area labels from incorrect questions
    const weakAreaSet = new Set<string>();
    incorrectQuestions.forEach((item) => {
      const label = item.question.weakAreaLabel || item.question.weakAreaTag;
      if (label) weakAreaSet.add(label);
    });

    // Derive strength labels
    const strengthSet = new Set<string>();
    if (percentage >= 70) {
      strengthSet.add("Sentence Structure & Word Order");
      strengthSet.add("Basic V1/V2 Verb Conjugations");
    }
    if (score > 0 && !weakAreaSet.has("Positive sentences")) {
      strengthSet.add("Positive sentence formations");
    }
    if (percentage >= 85) {
      strengthSet.add("Auxiliary & Question Inversions");
      strengthSet.add("Negative sentence precision");
    }

    const weakAreas = Array.from(weakAreaSet);
    const strengths = Array.from(strengthSet);

    const current = this.readProgress(userId);
    const existingIndex = current.findIndex(
      (p) => p.categoryId === categorySlug || p.topicId === categorySlug
    );

    const existing = existingIndex >= 0 ? current[existingIndex] : null;
    const attempts = (existing?.attempts || 0) + 1;
    const bestScore = Math.max(existing?.bestScore || 0, percentage);
    const latestScore = percentage;
    const prevAvg = existing?.averageScore ?? percentage;
    const averageScore = Math.round(((prevAvg * (attempts - 1)) + percentage) / attempts);

    const updatedItem: UserGrammarProgress = {
      id: existing?.id || `prog-${Date.now()}`,
      userId: userId || "guest-user-uuid",
      categoryId: categorySlug,
      topicId: categorySlug,
      lessonId: `lesson-${categorySlug}`,
      status,
      progressPercent,
      masteryScore: bestScore,
      attempts,
      correctAnswers: (existing?.correctAnswers || 0) + score,
      totalAnswers: (existing?.totalAnswers || 0) + totalQuestions,
      bestScore,
      latestScore,
      averageScore,
      weakAreas,
      strengths,
      lastStage: isMastered ? "mastered" : "testing",
      lastAttemptAt: nowIso,
      completedAt: isMastered ? nowIso : existing?.completedAt,
      updatedAt: nowIso,
    };

    if (existingIndex >= 0) {
      current[existingIndex] = updatedItem;
    } else {
      current.push(updatedItem);
    }

    this.writeProgress(current, userId);

    return {
      categorySlug,
      topicSlug: categorySlug,
      score,
      totalQuestions,
      percentage,
      isMastered,
      masteryScore: bestScore,
      status,
      strengths,
      weakAreas,
      attempts,
      bestScore,
      latestScore,
      averageScore,
      incorrectQuestions,
    };
  }

  async resetProgress(userId?: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(this.getStorageKey(userId));
    } catch {
      // ignore
    }
  }
}

export const localGrammarService = new LocalGrammarService();
