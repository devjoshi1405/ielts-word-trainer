export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "article"
  | "phrase"
  | "conjunction"
  | "number"
  | "date"
  | "time";

export interface VocabularyItem {
  id: string;
  word: string;
  category: string;
  partOfSpeech?: PartOfSpeech;
  level: CEFRLevel;
  meaning: string;
  pronunciation?: string;
  phonetic?: string;
  exampleSentence: string;
  commonMisspellings: string[];
  commonPhrases: string[];
  isIELTSCommon: boolean;
}
