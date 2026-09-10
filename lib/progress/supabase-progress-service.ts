import { IProgressService } from "./progress-service.interface";
import { DashboardStats, MistakeItem, PracticeModuleSummary, AttemptSubmission, MistakeType } from "@/types/progress.types";
import { ExerciseCategory } from "@/types/exercise.types";
import { UserAttemptRow, UserProgressRow, MasteryLevel } from "@/types/database.types";
import { calculateProgressStats } from "./progress-calculator";
import { getSupabaseBrowserClient } from "../supabase/client";
import { localProgressService } from "./local-progress-service";
import { classifyMistake, getMistakeTypeDetails } from "@/lib/mistakes/mistake-classifier";
import { processAttemptSRS, formatNextReviewDisplay, calculateMistakePriority, calculateMastery } from "@/lib/mistakes/srs-engine";
import { MOCK_MODULE_SUMMARIES } from "@/data/mock-stats";
import { VOCABULARY_BY_WORD, VOCABULARY_BY_ID } from "@/data/vocabulary";

/**
 * Supabase-backed persistent progress service.
 * Interacts with `user_attempts`, `user_progress`, `vocabulary`, and `questions`.
 * Automatically delegates to local fallback if Supabase is offline or unconfigured.
 */
export class SupabaseProgressService implements IProgressService {
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

  async recordAttempt(data: AttemptSubmission | any): Promise<void> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return localProgressService.recordAttempt(data);
    }

    const userId = await this.getUserId(data.userId);
    const isSubmission = "questionId" in data;
    const questionId = isSubmission ? data.questionId : data.exerciseId;
    const userAnswer = (isSubmission ? data.userAnswer : data.userInput) || "";
    const isCorrect = Boolean(data.isCorrect);
    const targetAnswer = (isSubmission ? data.correctAnswer : data.targetAnswer) || "";
    const attemptNumber = (isSubmission ? data.attemptNumber : data.attemptNumber) || 1;
    const category = isSubmission ? data.category : data.category;

    // Automatic deterministic classification if mistakeType is not supplied or if failed
    let mistakeType = isSubmission ? data.mistakeType : data.mistakeType;
    if (!isCorrect && !mistakeType) {
      const classification = classifyMistake(userAnswer, targetAnswer, typeof category === "string" ? category : undefined);
      mistakeType = classification.type;
    }

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

    try {
      // 1. Insert Attempt Row into user_attempts
      const { error: attemptErr } = await (client.from("user_attempts") as any).insert({
        user_id: userId,
        question_id: questionId,
        user_answer: userAnswer,
        correct_answer: targetAnswer,
        is_correct: isCorrect,
        mistake_type: mistakeType || null,
        attempt_number: attemptNumber,
        created_at: new Date().toISOString(),
      });

      if (attemptErr) {
        console.warn("Supabase attempt insert failed, falling back to local:", attemptErr.message);
        await localProgressService.recordAttempt(data);
        return;
      }

      // 2. Fetch existing user_progress row
      const { data: existingProg } = await (client
        .from("user_progress") as any)
        .select("*")
        .eq("user_id", userId)
        .eq("vocabulary_id", vocabId)
        .maybeSingle();

      const srsUpdate = processAttemptSRS(
        {
          correctCount: existingProg?.correct_count || 0,
          incorrectCount: existingProg?.incorrect_count || 0,
          consecutiveCorrect: existingProg?.consecutive_correct || 0,
        },
        isCorrect
      );

      await (client.from("user_progress") as any).upsert(
        {
          user_id: userId,
          vocabulary_id: vocabId,
          correct_count: srsUpdate.correctCount,
          incorrect_count: srsUpdate.incorrectCount,
          consecutive_correct: srsUpdate.consecutiveCorrect,
          mastery_level: srsUpdate.masteryLevel,
          last_reviewed: srsUpdate.lastReviewedIso,
          next_review: srsUpdate.nextReviewIso,
        },
        { onConflict: "user_id,vocabulary_id" }
      );
    } catch (e) {
      console.warn("Supabase recordAttempt error, falling back to local:", e);
      await localProgressService.recordAttempt(data);
    }
  }

  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return localProgressService.getDashboardStats(userId);
    }

    const uid = await this.getUserId(userId);

    try {
      const [{ data: attempts, error: attErr }, { data: progressRows, error: progErr }] =
        await Promise.all([
          client
            .from("user_attempts")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: false }),
          client.from("user_progress").select("*").eq("user_id", uid),
        ]);

      if (attErr || progErr || !attempts) {
        return localProgressService.getDashboardStats(userId);
      }

      const stats = calculateProgressStats(
        (attempts as UserAttemptRow[]) || [],
        (progressRows as UserProgressRow[]) || []
      );

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
    } catch (e) {
      console.warn("Supabase getDashboardStats failed, returning local stats:", e);
      return localProgressService.getDashboardStats(userId);
    }
  }

  async getMistakes(userId?: string): Promise<MistakeItem[]> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return localProgressService.getMistakes(userId);
    }

    const uid = await this.getUserId(userId);

    try {
      const { data: progressRows, error } = await client
        .from("user_progress")
        .select("*")
        .eq("user_id", uid)
        .gt("incorrect_count", 0)
        .order("incorrect_count", { ascending: false });

      if (error || !progressRows || progressRows.length === 0) {
        return localProgressService.getMistakes(userId);
      }

      const mistakes: MistakeItem[] = [];

      for (const prog of progressRows as UserProgressRow[]) {
        const vocabItem =
          VOCABULARY_BY_ID.get(prog.vocabulary_id) ||
          Array.from(VOCABULARY_BY_WORD.values()).find(
            (v) => v.id === prog.vocabulary_id
          );

        const word = vocabItem ? vocabItem.word : prog.vocabulary_id.replace("vocab-", "");
        const phonetic = vocabItem?.phonetic || "/wɜːd/";
        const definition = vocabItem?.meaning || "IELTS vocabulary target";
        const category = (vocabItem?.category || "academic") as ExerciseCategory;

        const totalAttempts = prog.correct_count + prog.incorrect_count;
        const accuracy = totalAttempts > 0 ? Math.round((prog.correct_count / totalAttempts) * 100) : 0;

        const { numeric: masteryNumeric, level: masteryLevel } = calculateMastery(
          totalAttempts,
          prog.consecutive_correct,
          prog.incorrect_count
        );

        const { text: nextReviewText, isDue } = formatNextReviewDisplay(prog.next_review);

        const classification = classifyMistake("misspelled", word, category);
        const typeDetails = getMistakeTypeDetails(classification.type);

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
          commonTrap:
            vocabItem?.commonMisspellings && vocabItem.commonMisspellings.length > 0
              ? `Common confusion: ${vocabItem.commonMisspellings.join(", ")}`
              : classification.explanation,
          userLastAttempt: "Misspelled",
          mistakeType: classification.type,
          mistakeTypeLabel: typeDetails.label,
          mistakeExplanation: classification.explanation,
          remediationTip: classification.remediationTip,
          masteryLevel,
          masteryNumeric,
          category,
        });
      }

      return mistakes.sort((a, b) => {
        const pA = calculateMistakePriority(a);
        const pB = calculateMistakePriority(b);
        return pB - pA;
      });
    } catch (e) {
      console.warn("Supabase getMistakes error:", e);
      return localProgressService.getMistakes(userId);
    }
  }

  async getModuleSummaries(userId?: string): Promise<PracticeModuleSummary[]> {
    return MOCK_MODULE_SUMMARIES;
  }

  async removeMistake(id: string, userId?: string): Promise<void> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return localProgressService.removeMistake(id, userId);
    }

    const uid = await this.getUserId(userId);
    try {
      await (client
        .from("user_progress") as any)
        .update({ incorrect_count: 0, mastery_level: "mastered" })
        .eq("user_id", uid)
        .eq("vocabulary_id", id);
    } catch {
      await localProgressService.removeMistake(id, userId);
    }
  }
}

export const supabaseProgressService = new SupabaseProgressService();
