import { VocabularyItem } from "@/types/vocabulary.types";
import { ARTICLES_AND_PREPOSITIONS } from "./articles-prepositions";
import { ACADEMIC_UNIVERSITY_VOCABULARY } from "./academic-university";
import { ACCOMMODATION_HOUSING_VOCABULARY } from "./accommodation-housing";
import { ENVIRONMENT_ECOLOGY_VOCABULARY } from "./environment-ecology";
import { TRANSPORT_TRAVEL_VOCABULARY } from "./transport-travel";
import { WORK_CAREER_VOCABULARY } from "./work-career";
import { EDUCATION_LEARNING_VOCABULARY } from "./education-learning";
import { HEALTH_MEDICINE_VOCABULARY } from "./health-medicine";
import { TECHNOLOGY_SCIENCE_VOCABULARY } from "./technology-science";
import { SOCIETY_CULTURE_VOCABULARY } from "./society-culture";
import { SHOPPING_COMMERCE_VOCABULARY } from "./shopping-commerce";
import { SERVICES_FACILITIES_VOCABULARY } from "./services-facilities";
import { NUMBERS_DATES_TIMES_VOCABULARY } from "./numbers-dates-times";
import { EVERYDAY_ENGLISH_VOCABULARY } from "./everyday-english";
import { READING_ACADEMIC_VOCABULARY } from "./reading-academic";
import { IELTS_ACADEMIC_BOOSTER_VOCABULARY } from "./ielts-academic-booster";
import { LARGE_IELTS_VOCABULARY_BANK } from "./large-ielts-bank";

/**
 * Complete consolidated 1,000+ IELTS Vocabulary Dataset
 */
export const ALL_VOCABULARY_ITEMS: VocabularyItem[] = [
  ...ARTICLES_AND_PREPOSITIONS,
  ...ACADEMIC_UNIVERSITY_VOCABULARY,
  ...ACCOMMODATION_HOUSING_VOCABULARY,
  ...ENVIRONMENT_ECOLOGY_VOCABULARY,
  ...TRANSPORT_TRAVEL_VOCABULARY,
  ...WORK_CAREER_VOCABULARY,
  ...EDUCATION_LEARNING_VOCABULARY,
  ...HEALTH_MEDICINE_VOCABULARY,
  ...TECHNOLOGY_SCIENCE_VOCABULARY,
  ...SOCIETY_CULTURE_VOCABULARY,
  ...SHOPPING_COMMERCE_VOCABULARY,
  ...SERVICES_FACILITIES_VOCABULARY,
  ...NUMBERS_DATES_TIMES_VOCABULARY,
  ...EVERYDAY_ENGLISH_VOCABULARY,
  ...READING_ACADEMIC_VOCABULARY,
  ...IELTS_ACADEMIC_BOOSTER_VOCABULARY,
  ...LARGE_IELTS_VOCABULARY_BANK,
];

// Deduplicate items by word (keeping first occurrence)
const seenWords = new Set<string>();
export const UNIQUE_VOCABULARY_ITEMS: VocabularyItem[] = ALL_VOCABULARY_ITEMS.filter((item) => {
  const norm = item.word.trim().toLowerCase();
  if (seenWords.has(norm)) {
    return false;
  }
  seenWords.add(norm);
  return true;
});

// Fast lookup map by ID
export const VOCABULARY_BY_ID = new Map<string, VocabularyItem>(
  UNIQUE_VOCABULARY_ITEMS.map((item) => [item.id, item])
);

// Fast lookup map by normalized word
export const VOCABULARY_BY_WORD = new Map<string, VocabularyItem>(
  UNIQUE_VOCABULARY_ITEMS.map((item) => [item.word.toLowerCase(), item])
);

// Grouped by Category
export const VOCABULARY_BY_CATEGORY: Record<string, VocabularyItem[]> = UNIQUE_VOCABULARY_ITEMS.reduce(
  (acc, item) => {
    const cat = item.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  },
  {} as Record<string, VocabularyItem[]>
);

// Grouped by CEFR Level
export const VOCABULARY_BY_LEVEL: Record<string, VocabularyItem[]> = UNIQUE_VOCABULARY_ITEMS.reduce(
  (acc, item) => {
    const lvl = item.level || "B1";
    if (!acc[lvl]) acc[lvl] = [];
    acc[lvl].push(item);
    return acc;
  },
  {} as Record<string, VocabularyItem[]>
);

export {
  ARTICLES_AND_PREPOSITIONS,
  ACADEMIC_UNIVERSITY_VOCABULARY,
  ACCOMMODATION_HOUSING_VOCABULARY,
  ENVIRONMENT_ECOLOGY_VOCABULARY,
  TRANSPORT_TRAVEL_VOCABULARY,
  WORK_CAREER_VOCABULARY,
  EDUCATION_LEARNING_VOCABULARY,
  HEALTH_MEDICINE_VOCABULARY,
  TECHNOLOGY_SCIENCE_VOCABULARY,
  SOCIETY_CULTURE_VOCABULARY,
  SHOPPING_COMMERCE_VOCABULARY,
  SERVICES_FACILITIES_VOCABULARY,
  NUMBERS_DATES_TIMES_VOCABULARY,
  EVERYDAY_ENGLISH_VOCABULARY,
  READING_ACADEMIC_VOCABULARY,
  IELTS_ACADEMIC_BOOSTER_VOCABULARY,
  LARGE_IELTS_VOCABULARY_BANK,
};
