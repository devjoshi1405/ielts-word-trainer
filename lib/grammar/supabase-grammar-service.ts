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
  GrammarLessonContent,
  GrammarQuestion,
  GrammarQuestionType,
  CategoryProgressSummary,
  TestSubmissionResult,
  GrammarProgressStatus,
  TenseTopicData,
} from "@/types/grammar.types";
import {
  GrammarCategoryRow,
  GrammarTopicRow,
  GrammarLessonRow,
  VerbRow,
  UserGrammarProgressRow,
  GrammarQuestionRow,
  UserVerbProgressRow,
} from "@/types/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { localGrammarService } from "./local-grammar-service";
import { PARTS_OF_SPEECH_DATA, PartOfSpeechTopicData } from "@/data/grammar-pos-content";
import { SEED_GRAMMAR_CATEGORIES } from "@/data/grammar-seed";

export class SupabaseGrammarService implements IGrammarService {
  private async getUserId(providedId?: string): Promise<string> {
    if (providedId) return providedId;

    const client = getSupabaseBrowserClient();
    if (!client) return "guest-user-uuid";

    try {
      const { data } = await client.auth.getSession();
      return data.session?.user?.id || "guest-user-uuid";
    } catch {
      return "guest-user-uuid";
    }
  }

  async getCategories(): Promise<GrammarCategory[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getCategories();

    try {
      const { data, error } = await client
        .from("grammar_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return localGrammarService.getCategories();
      }

      return (data as GrammarCategoryRow[]).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        displayOrder: row.display_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (e) {
      console.warn("Supabase getCategories failed, using fallback:", e);
      return localGrammarService.getCategories();
    }
  }

  async getCategoryBySlug(slug: string): Promise<GrammarCategory | null> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getCategoryBySlug(slug);

    try {
      const { data, error } = await client
        .from("grammar_categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        return localGrammarService.getCategoryBySlug(slug);
      }

      const row = data as GrammarCategoryRow;
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        displayOrder: row.display_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (e) {
      return localGrammarService.getCategoryBySlug(slug);
    }
  }

  async getTopics(categoryId?: string): Promise<GrammarTopic[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getTopics(categoryId);

    try {
      let query = client
        .from("grammar_topics")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return localGrammarService.getTopics(categoryId);
      }

      return (data as GrammarTopicRow[]).map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        difficulty: row.difficulty,
        displayOrder: row.display_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (e) {
      return localGrammarService.getTopics(categoryId);
    }
  }

  async getTopicBySlug(slug: string): Promise<GrammarTopic | null> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getTopicBySlug(slug);

    try {
      const { data, error } = await client
        .from("grammar_topics")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        return localGrammarService.getTopicBySlug(slug);
      }

      const row = data as GrammarTopicRow;
      return {
        id: row.id,
        categoryId: row.category_id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        difficulty: row.difficulty,
        displayOrder: row.display_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (e) {
      return localGrammarService.getTopicBySlug(slug);
    }
  }

  async getLessons(topicId?: string): Promise<GrammarLesson[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getLessons(topicId);

    try {
      let query = client
        .from("grammar_lessons")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (topicId) {
        query = query.eq("topic_id", topicId);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return localGrammarService.getLessons(topicId);
      }

      return (data as GrammarLessonRow[]).map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        topicId: row.topic_id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        content: row.content as unknown as GrammarLessonContent,
        difficulty: row.difficulty,
        displayOrder: row.display_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (e) {
      return localGrammarService.getLessons(topicId);
    }
  }

  async getLessonBySlug(slug: string): Promise<GrammarLesson | null> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getLessonBySlug(slug);

    try {
      const { data, error } = await client
        .from("grammar_lessons")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        return localGrammarService.getLessonBySlug(slug);
      }

      const row = data as GrammarLessonRow;
      return {
        id: row.id,
        categoryId: row.category_id,
        topicId: row.topic_id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        content: row.content as unknown as GrammarLessonContent,
        difficulty: row.difficulty,
        displayOrder: row.display_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (e) {
      return localGrammarService.getLessonBySlug(slug);
    }
  }

  async getPartOfSpeechData(slug: string): Promise<PartOfSpeechTopicData | null> {
    return localGrammarService.getPartOfSpeechData(slug);
  }

  async getTenseData(slug: string): Promise<TenseTopicData | null> {
    return localGrammarService.getTenseData(slug);
  }

  async getQuestionsByCategory(
    categorySlug: string,
    type: "practice" | "test" = "practice"
  ): Promise<GrammarQuestion[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getQuestionsByCategory(categorySlug, type);

    try {
      const { data, error } = await client
        .from("grammar_questions")
        .select("*")
        .eq("category_slug", categorySlug)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return localGrammarService.getQuestionsByCategory(categorySlug, type);
      }

      return (data as GrammarQuestionRow[]).map((q) => ({
        id: q.id,
        categorySlug: q.category_slug,
        topicSlug: q.topic_slug,
        type: q.question_type as GrammarQuestionType,
        prompt: q.prompt,
        sentence: q.sentence || undefined,
        options: (q.options as any) || [],
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        points: q.points,
        displayOrder: q.display_order,
      }));
    } catch {
      return localGrammarService.getQuestionsByCategory(categorySlug, type);
    }
  }

  async getAllCategoryProgress(userId?: string): Promise<CategoryProgressSummary[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getAllCategoryProgress(userId);

    const uid = await this.getUserId(userId);

    try {
      const { data, error } = await client
        .from("user_grammar_progress")
        .select("*")
        .eq("user_id", uid);

      if (error || !data || data.length === 0) {
        return localGrammarService.getAllCategoryProgress(userId);
      }

      const rows = data as UserGrammarProgressRow[];

      return SEED_GRAMMAR_CATEGORIES.map((cat) => {
        const match = rows.find(
          (r) =>
            r.category_id === cat.id ||
            r.category_id === cat.slug ||
            r.topic_id === cat.slug
        );

        const progressPercent = match?.progress_percent ?? 0;
        const masteryScore = Number(match?.mastery_score ?? 0);
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
          lastAttemptAt: match?.last_attempt_at || undefined,
        };
      });
    } catch {
      return localGrammarService.getAllCategoryProgress(userId);
    }
  }

  async getAllTenseProgress(userId?: string): Promise<CategoryProgressSummary[]> {
    return localGrammarService.getAllTenseProgress(userId);
  }

  async getVerbs(options: GetVerbsOptions = {}): Promise<PaginatedVerbsResult> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getVerbs(options);

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

    try {
      let query = client
        .from("verbs")
        .select("*", { count: "exact" })
        .order("display_order", { ascending: true });

      if (search) {
        query = query.or(
          `base_form.ilike.%${search}%,past_form.ilike.%${search}%,past_participle.ilike.%${search}%,meaning.ilike.%${search}%`
        );
      }

      if (verbType) {
        query = query.eq("verb_type", verbType);
      }

      if (difficulty) {
        query = query.eq("difficulty", difficulty);
      }

      if (isCommon !== undefined) {
        query = query.eq("is_common", isCommon);
      }

      if (ieltsRelevantOnly) {
        query = query.eq("is_ielts_relevant", true);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error || !data || data.length === 0) {
        return localGrammarService.getVerbs(options);
      }

      const items: VerbItem[] = (data as VerbRow[]).map((row) => this.mapVerbRowToItem(row));

      const total = count ?? items.length;
      const totalPages = Math.ceil(total / limit) || 1;

      // Also get user progress map if user is logged in
      const userProgressMap = await this.getUserVerbProgress(userId);

      return {
        items,
        total,
        page,
        limit,
        totalPages,
        userProgressMap,
      };
    } catch (e) {
      return localGrammarService.getVerbs(options);
    }
  }

  async getVerbById(id: string): Promise<VerbItem | null> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getVerbById(id);

    try {
      const { data, error } = await client
        .from("verbs")
        .select("*")
        .or(`id.eq.${id},base_form.ilike.${id}`)
        .single();

      if (error || !data) {
        return localGrammarService.getVerbById(id);
      }

      return this.mapVerbRowToItem(data as VerbRow);
    } catch {
      return localGrammarService.getVerbById(id);
    }
  }

  async getAllVerbsList(): Promise<VerbItem[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getAllVerbsList();

    try {
      const { data, error } = await client
        .from("verbs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return localGrammarService.getAllVerbsList();
      }

      return (data as VerbRow[]).map((row) => this.mapVerbRowToItem(row));
    } catch {
      return localGrammarService.getAllVerbsList();
    }
  }

  private mapVerbRowToItem(row: VerbRow): VerbItem {
    let pastEx: string | undefined;
    let partEx: string | undefined;

    if (row.example_meaning && row.example_meaning.includes(" | ")) {
      const parts = row.example_meaning.split(" | ");
      pastEx = parts[0]?.trim();
      partEx = parts[1]?.trim();
    }

    return {
      id: row.id,
      baseForm: row.base_form,
      pastForm: row.past_form,
      pastParticiple: row.past_participle,
      meaning: row.meaning,
      pronunciation: row.pronunciation || undefined,
      exampleSentence: row.example_sentence || undefined,
      pastExample: pastEx,
      pastParticipleExample: partEx,
      exampleMeaning: row.meaning,
      verbType: row.verb_type as any,
      difficulty: row.difficulty as any,
      isCommon: row.is_common,
      isIeltsRelevant: row.is_ielts_relevant,
      displayOrder: row.display_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getUserVerbProgress(userId?: string): Promise<Record<string, UserVerbProgress>> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getUserVerbProgress(userId);

    const effectiveUserId = await this.getUserId(userId);

    try {
      const { data, error } = await client
        .from("user_verb_progress")
        .select("*")
        .eq("user_id", effectiveUserId);

      if (error || !data) {
        return localGrammarService.getUserVerbProgress(userId);
      }

      const map: Record<string, UserVerbProgress> = {};
      (data as UserVerbProgressRow[]).forEach((row) => {
        map[row.verb_id] = {
          id: row.id,
          userId: row.user_id,
          verbId: row.verb_id,
          status: row.status,
          confidence: row.confidence,
          attempts: row.attempts,
          correctAnswers: row.correct_answers,
          totalAnswers: row.total_answers,
          isWeak: row.is_weak,
          lastPracticedAt: row.last_practiced_at,
          nextReviewAt: row.next_review_at,
          learnedAt: row.learned_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      });

      return map;
    } catch {
      return localGrammarService.getUserVerbProgress(userId);
    }
  }

  async getVerbStats(userId?: string): Promise<VerbProgressStats> {
    const map = await this.getUserVerbProgress(userId);
    const allVerbs = await this.getAllVerbsList();
    const totalVerbs = allVerbs.length;
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
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.recordVerbAttempt(verbId, isCorrect, userId);

    const effectiveUserId = await this.getUserId(userId);

    try {
      // First read existing
      const { data: existing } = await (client as any)
        .from("user_verb_progress")
        .select("*")
        .eq("user_id", effectiveUserId)
        .eq("verb_id", verbId)
        .maybeSingle();

      const existingRow = existing as UserVerbProgressRow | null;
      const attempts = (existingRow?.attempts || 0) + 1;
      const totalAnswers = (existingRow?.total_answers || 0) + 1;
      const correctAnswers = (existingRow?.correct_answers || 0) + (isCorrect ? 1 : 0);
      const accuracy = correctAnswers / totalAnswers;

      const isWeak = attempts >= 2 && accuracy < 0.7;
      let status = existingRow?.status || "learning";
      if (correctAnswers >= 3 && accuracy >= 0.85) {
        status = "mastered";
      } else if (status === "not_started") {
        status = "learning";
      }

      const daysToAdd = isWeak ? 1 : status === "mastered" ? 7 : 3;
      const nextReview = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

      await (client as any).from("user_verb_progress").upsert(
        {
          user_id: effectiveUserId,
          verb_id: verbId,
          attempts,
          total_answers: totalAnswers,
          correct_answers: correctAnswers,
          confidence: Math.round(accuracy * 100),
          is_weak: isWeak,
          status,
          last_practiced_at: new Date().toISOString(),
          next_review_at: nextReview,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,verb_id" }
      );
    } catch {
      await localGrammarService.recordVerbAttempt(verbId, isCorrect, userId);
    }
  }

  async toggleVerbLearned(verbId: string, learned: boolean, userId?: string): Promise<void> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.toggleVerbLearned(verbId, learned, userId);

    const effectiveUserId = await this.getUserId(userId);

    try {
      await (client as any).from("user_verb_progress").upsert(
        {
          user_id: effectiveUserId,
          verb_id: verbId,
          status: learned ? "learned" : "not_started",
          confidence: learned ? 80 : 0,
          learned_at: learned ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,verb_id" }
      );
    } catch {
      await localGrammarService.toggleVerbLearned(verbId, learned, userId);
    }
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
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getUserProgress(userId);

    const uid = await this.getUserId(userId);

    try {
      const { data, error } = await client
        .from("user_grammar_progress")
        .select("*")
        .eq("user_id", uid)
        .order("updated_at", { ascending: false });

      if (error || !data) {
        return localGrammarService.getUserProgress(userId);
      }

      return (data as UserGrammarProgressRow[]).map((row) => ({
        id: row.id,
        userId: row.user_id,
        categoryId: row.category_id,
        topicId: row.topic_id,
        lessonId: row.lesson_id,
        status: row.status,
        progressPercent: row.progress_percent,
        masteryScore: Number(row.mastery_score),
        attempts: row.attempts,
        correctAnswers: row.correct_answers,
        totalAnswers: row.total_answers,
        lastAttemptAt: row.last_attempt_at,
        nextReviewAt: row.next_review_at,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (e) {
      return localGrammarService.getUserProgress(userId);
    }
  }

  async getDashboardStats(userId?: string): Promise<GrammarDashboardStats> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.getDashboardStats(userId);

    const categorySummaries = await this.getAllCategoryProgress(userId);
    const totalTopics = SEED_GRAMMAR_CATEGORIES.length;

    const masteredCategories = categorySummaries.filter((c) => c.isMastered);
    const topicsMastered = masteredCategories.length;
    const lessonsCompleted = categorySummaries.filter((c) => c.progressPercent >= 50).length;

    const avgMastery =
      categorySummaries.length > 0
        ? Math.round(
            categorySummaries.reduce((acc, c) => acc + c.masteryScore, 0) /
              Math.max(1, categorySummaries.length)
          )
        : 0;

    const activeCount = categorySummaries.filter((c) => c.status !== "not_started").length;

    return {
      overallMastery: avgMastery,
      topicsMastered,
      totalTopics,
      lessonsCompleted,
      totalLessons: totalTopics,
      verbsStudied: Math.min(activeCount, 4),
      totalVerbsAvailable: 4,
      accuracy: avgMastery,
      currentStreak: activeCount > 0 ? 1 : 0,
    };
  }

  async getResumeSession(userId?: string): Promise<ResumeLearningSession> {
    return localGrammarService.getResumeSession(userId);
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
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.recordProgress(data);

    const uid = await this.getUserId(data.userId);
    const catIdentifier = data.categorySlug || data.categoryId || data.topicSlug || data.topicId || "simple-present";
    const nowIso = new Date().toISOString();

    try {
      const { data: existing } = await client
        .from("user_grammar_progress")
        .select("*")
        .eq("user_id", uid)
        .eq("category_id", catIdentifier)
        .maybeSingle();

      const existingRow = existing as UserGrammarProgressRow | null;
      const attempts = (existingRow?.attempts || 0) + 1;
      const correctAnswers = (existingRow?.correct_answers || 0) + (data.isCorrect ? 1 : 0);

      const payload = {
        user_id: uid,
        category_id: catIdentifier,
        topic_id: catIdentifier,
        lesson_id: data.lessonId || `lesson-${catIdentifier}`,
        status: data.status,
        progress_percent: Math.min(100, Math.max(existingRow?.progress_percent || 0, data.progressPercent)),
        mastery_score: data.masteryScore ?? (existingRow ? Number(existingRow.mastery_score) : 0),
        attempts,
        correct_answers: correctAnswers,
        total_answers: attempts,
        best_score: existingRow?.best_score || (data.masteryScore || 0),
        latest_score: data.masteryScore || existingRow?.latest_score || 0,
        average_score: existingRow?.average_score || data.masteryScore || 0,
        weak_areas: data.weakAreas || existingRow?.weak_areas || [],
        strengths: data.strengths || existingRow?.strengths || [],
        last_section: data.lastSection || existingRow?.last_section,
        last_stage: data.lastStage || existingRow?.last_stage || "learning",
        last_attempt_at: nowIso,
        completed_at: data.status === "mastered" ? nowIso : existingRow?.completed_at || null,
        updated_at: nowIso,
      };

      await (client.from("user_grammar_progress") as any).upsert(payload, {
        onConflict: "user_id,category_id",
      });

      // Keep local store in sync
      await localGrammarService.recordProgress(data);
    } catch {
      await localGrammarService.recordProgress(data);
    }
  }

  async recordLessonComplete(categorySlug: string, userId?: string, lastSection?: string): Promise<void> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.recordLessonComplete(categorySlug, userId, lastSection);

    const uid = await this.getUserId(userId);
    const nowIso = new Date().toISOString();

    try {
      const { data: existing } = await client
        .from("user_grammar_progress")
        .select("*")
        .eq("user_id", uid)
        .eq("category_id", categorySlug)
        .maybeSingle();

      const existingRow = existing as UserGrammarProgressRow | null;
      const progressPercent = Math.max(existingRow?.progress_percent || 0, 50);
      const status: GrammarProgressStatus = existingRow?.status === "mastered" ? "mastered" : "practicing";

      const payload = {
        user_id: uid,
        category_id: categorySlug,
        topic_id: categorySlug,
        lesson_id: `lesson-${categorySlug}`,
        status,
        progress_percent: progressPercent,
        mastery_score: existingRow ? Number(existingRow.mastery_score) : 50,
        attempts: (existingRow?.attempts || 0) + 1,
        correct_answers: existingRow?.correct_answers || 0,
        total_answers: (existingRow?.total_answers || 0) + 1,
        best_score: existingRow?.best_score || 50,
        latest_score: 50,
        last_section: lastSection || "completed",
        last_stage: "practicing",
        last_attempt_at: nowIso,
        completed_at: existingRow?.completed_at || null,
        updated_at: nowIso,
      };

      await (client.from("user_grammar_progress") as any).upsert(payload, {
        onConflict: "user_id,category_id",
      });

      await localGrammarService.recordLessonComplete(categorySlug, userId, lastSection);
    } catch {
      await localGrammarService.recordLessonComplete(categorySlug, userId, lastSection);
    }
  }

  async submitTestResult(
    categorySlug: string,
    score: number,
    totalQuestions: number,
    incorrectQuestions: Array<{ question: GrammarQuestion; userAnswer: string }> = [],
    userId?: string
  ): Promise<TestSubmissionResult> {
    const localResult = await localGrammarService.submitTestResult(categorySlug, score, totalQuestions, incorrectQuestions, userId);

    const client = getSupabaseBrowserClient();
    if (client) {
      try {
        const uid = await this.getUserId(userId);
        const { data: existing } = await client
          .from("user_grammar_progress")
          .select("*")
          .eq("user_id", uid)
          .eq("category_id", categorySlug)
          .maybeSingle();

        const existingRow = existing as UserGrammarProgressRow | null;
        const nowIso = new Date().toISOString();

        const payload = {
          user_id: uid,
          category_id: categorySlug,
          topic_id: categorySlug,
          lesson_id: `lesson-${categorySlug}`,
          status: localResult.status,
          progress_percent: localResult.isMastered ? 100 : Math.max(localResult.percentage, 70),
          mastery_score: localResult.masteryScore,
          attempts: (existingRow?.attempts || 0) + 1,
          correct_answers: (existingRow?.correct_answers || 0) + score,
          total_answers: (existingRow?.total_answers || 0) + totalQuestions,
          best_score: localResult.bestScore,
          latest_score: localResult.latestScore,
          average_score: localResult.averageScore,
          weak_areas: localResult.weakAreas,
          strengths: localResult.strengths,
          last_stage: localResult.isMastered ? "mastered" : "testing",
          last_attempt_at: nowIso,
          completed_at: localResult.isMastered ? nowIso : existingRow?.completed_at || null,
          updated_at: nowIso,
        };

        await (client.from("user_grammar_progress") as any).upsert(payload, {
          onConflict: "user_id,category_id",
        });
      } catch (e) {
        console.warn("Supabase submitTestResult failed, local state preserved:", e);
      }
    }

    return localResult;
  }

  async resetProgress(userId?: string): Promise<void> {
    const client = getSupabaseBrowserClient();
    if (!client) return localGrammarService.resetProgress(userId);

    const uid = await this.getUserId(userId);
    try {
      await client.from("user_grammar_progress").delete().eq("user_id", uid);
    } catch {
      // ignore
    }
    await localGrammarService.resetProgress(userId);
  }
}

export const supabaseGrammarService = new SupabaseGrammarService();
