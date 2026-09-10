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
    const client = getSupabaseBrowserClient();
    if (!client) {
      return localProgressService.getModuleSummaries(userId);
    }

    const uid = await this.getUserId(userId);

    try {
      const [{ data: attempts, error: attErr }, mistakes] = await Promise.all([
        client
          .from("user_attempts")
          .select("*")
          .eq("user_id", uid),
        this.getMistakes(userId),
      ]);

      if (attErr || !attempts) {
        return localProgressService.getModuleSummaries(userId);
      }

      const attemptRows = (attempts as UserAttemptRow[]) || [];

      // 1. Listen & Type Module
      const latAttempts = attemptRows.filter(
        (a) => !a.question_id.includes("number") && !a.question_id.includes("date")
      );
      const latCorrect = latAttempts.filter((a) => a.is_correct).length;
      const latAccuracy = latAttempts.length > 0 ? Math.round((latCorrect / latAttempts.length) * 100) : 0;
      const latCompleted = latAttempts.length;

      // 2. Vocabulary Module
      const vocabAttempts = attemptRows.filter(
        (a) =>
          a.question_id.includes("vocab") ||
          a.question_id.includes("academic") ||
          a.question_id.startsWith("q-academic")
      );
      const vocabCorrect = vocabAttempts.filter((a) => a.is_correct).length;
      const vocabAccuracy = vocabAttempts.length > 0 ? Math.round((vocabCorrect / vocabAttempts.length) * 100) : 0;
      const vocabCompleted = vocabAttempts.length;

      // 3. Numbers Module
      const numAttempts = attemptRows.filter((a) => a.question_id.includes("number"));
      const numCorrect = numAttempts.filter((a) => a.is_correct).length;
      const numAccuracy = numAttempts.length > 0 ? Math.round((numCorrect / numAttempts.length) * 100) : 0;
      const numCompleted = numAttempts.length;

      // 4. Dates & Times Module
      const dtAttempts = attemptRows.filter(
        (a) => a.question_id.includes("date") || a.question_id.includes("time")
      );
      const dtCorrect = dtAttempts.filter((a) => a.is_correct).length;
      const dtAccuracy = dtAttempts.length > 0 ? Math.round((dtCorrect / dtAttempts.length) * 100) : 0;
      const dtCompleted = dtAttempts.length;

      // 5. Mistakes Module
      const masteredMistakes = mistakes.filter((m) => (m.masteryNumeric ?? 1) >= 4).length;
      const totalMistakes = mistakes.length;
      const mistakesAccuracy =
        totalMistakes > 0
          ? Math.round(
              (mistakes.reduce((acc, m) => acc + (m.correctAttempts || 0), 0) /
                Math.max(
                  1,
                  mistakes.reduce((acc, m) => acc + (m.totalAttempts || 1), 0)
                )) *
                100
            )
          : 100;

      return [
        {
          id: "listen-and-type",
          title: "Listen & Type",
          subtitle: "Core Phonetic & Spelling Mastery",
          description: "Listen carefully and type exactly what you hear. Master challenging IELTS spelling traps.",
          itemCount: 20,
          completedCount: Math.min(latCompleted, 20),
          accuracy: latAttempts.length > 0 ? latAccuracy : 0,
          estimatedMinutes: 10,
          difficulty: "intermediate",
          href: "/listening/listen-and-type",
          iconName: "Headphones",
          badge: "Most Popular",
        },
        {
          id: "vocabulary",
          title: "Vocabulary",
          subtitle: "High-Frequency Academic Lexicon",
          description: "Build your IELTS listening vocabulary across environment, education, science, and arts.",
          itemCount: 25,
          completedCount: Math.min(vocabCompleted, 25),
          accuracy: vocabAttempts.length > 0 ? vocabAccuracy : 0,
          estimatedMinutes: 12,
          difficulty: "advanced",
          href: "/listening/vocabulary",
          iconName: "BookOpen",
          badge: "Band 7-9",
        },
        {
          id: "numbers",
          title: "Numbers",
          subtitle: "Prices, Quantities & Phone Codes",
          description: "Practice prices, quantities, percentages and measurements under real exam speed.",
          itemCount: 15,
          completedCount: Math.min(numCompleted, 15),
          accuracy: numAttempts.length > 0 ? numAccuracy : 0,
          estimatedMinutes: 8,
          difficulty: "foundation",
          href: "/listening/numbers",
          iconName: "Binary",
        },
        {
          id: "dates-times",
          title: "Dates & Times",
          subtitle: "Schedules, Days & Formats",
          description: "Improve recognition of dates, months, days of the week, and 12/24-hour time expressions.",
          itemCount: 15,
          completedCount: Math.min(dtCompleted, 15),
          accuracy: dtAttempts.length > 0 ? dtAccuracy : 0,
          estimatedMinutes: 7,
          difficulty: "foundation",
          href: "/listening/dates-times",
          iconName: "CalendarClock",
        },
        {
          id: "mistakes",
          title: "My Mistakes",
          subtitle: "Personal Weakness Elimination",
          description: "Practice the words and phrases you commonly miss to achieve flawless spelling.",
          itemCount: Math.max(totalMistakes, 1),
          completedCount: masteredMistakes,
          accuracy: totalMistakes > 0 ? mistakesAccuracy : 100,
          estimatedMinutes: 6,
          difficulty: "intermediate",
          href: "/listening/mistakes",
          iconName: "AlertTriangle",
          badge: totalMistakes > 0 ? `${totalMistakes} Tracked` : undefined,
        },
      ];
    } catch (e) {
      console.warn("Supabase getModuleSummaries error:", e);
      return localProgressService.getModuleSummaries(userId);
    }
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
