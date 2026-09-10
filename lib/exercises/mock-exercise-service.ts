import { ExerciseCategory, ExerciseQuestion, ExerciseType, ExerciseDifficulty } from "@/types/exercise.types";
import { IExerciseService } from "./exercise-service.interface";
import {
  MOCK_LISTEN_AND_TYPE_QUESTIONS,
  MOCK_VOCABULARY_QUESTIONS,
  MOCK_NUMBERS_QUESTIONS,
  MOCK_DATES_TIMES_QUESTIONS,
} from "@/data/mock-exercises";
import { MOCK_MISTAKES_LIST } from "@/data/mock-mistakes";
import { exerciseGenerator, ExerciseGeneratorFilter } from "./exercise-generator";
import { UNIQUE_VOCABULARY_ITEMS, ALL_VOCABULARY_ITEMS, VOCABULARY_BY_CATEGORY } from "@/data/vocabulary";

export class MockExerciseService implements IExerciseService {
  /**
   * Generates dynamic ExerciseQuestions from vocabulary items using rule-based templates
   */
  generateQuestions(filter: ExerciseGeneratorFilter = {}): ExerciseQuestion[] {
    const exercises = exerciseGenerator.generateExercises(filter);
    return exercises.map((ex) => ({
      id: ex.id,
      category: ex.category,
      targetText: ex.targetText,
      transcript: ex.transcript,
      phoneticIpa: ex.phoneticIpa,
      definition: ex.explanation,
      contextSentence: ex.transcript,
      difficulty: ex.difficulty,
      spellingTrapRule: ex.spellingTrapRule,
      type: ex.type,
      acceptedAnswers: ex.acceptedAnswers,
      tags: [ex.category, ex.type],
    }));
  }

  private getQuestionsMap(): Record<string, ExerciseQuestion[]> {
    const mistakeQuestions: ExerciseQuestion[] = MOCK_MISTAKES_LIST.map((m) => ({
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

    return {
      "listen-and-type": MOCK_LISTEN_AND_TYPE_QUESTIONS,
      vocabulary: MOCK_VOCABULARY_QUESTIONS,
      numbers: MOCK_NUMBERS_QUESTIONS,
      "dates-times": MOCK_DATES_TIMES_QUESTIONS,
      mistakes: mistakeQuestions,
    };
  }

  async getQuestionsByCategory(
    category: ExerciseCategory | string,
    limit?: number
  ): Promise<ExerciseQuestion[]> {
    const map = this.getQuestionsMap();
    if (map[category]) {
      const questions = map[category];
      return limit ? questions.slice(0, limit) : questions;
    }

    // Otherwise generate dynamically from the full 1,000+ vocabulary bank
    const generated = this.generateQuestions({
      category: category as any,
      limit: limit || 20,
    });
    return generated.length > 0 ? generated : MOCK_LISTEN_AND_TYPE_QUESTIONS;
  }

  async getQuestionById(id: string): Promise<ExerciseQuestion | null> {
    const all = Object.values(this.getQuestionsMap()).flat();
    const found = all.find((q) => q.id === id);
    if (found) return found;

    // Search in full vocabulary items
    const vocab = UNIQUE_VOCABULARY_ITEMS.find((v) => v.id === id);
    if (vocab) {
      const ex = exerciseGenerator.generateExerciseFromVocabulary(vocab);
      return {
        id: ex.id,
        category: ex.category,
        targetText: ex.targetText,
        transcript: ex.transcript,
        phoneticIpa: ex.phoneticIpa,
        definition: ex.explanation,
        contextSentence: ex.transcript,
        difficulty: ex.difficulty,
        spellingTrapRule: ex.spellingTrapRule,
        type: ex.type,
        tags: [ex.category],
      };
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

  /**
   * Returns total vocabulary statistics
   */
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
