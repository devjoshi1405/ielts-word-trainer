import {
  GrammarCategory,
  GrammarTopic,
  GrammarLesson,
  VerbItem,
  GrammarLessonContent,
} from "@/types/grammar.types";

/**
 * 8 Foundational Parts of Speech Categories for IELTS Grammar Mastery
 */
export const SEED_GRAMMAR_CATEGORIES: GrammarCategory[] = [
  {
    id: "cat-noun",
    name: "Noun",
    slug: "noun",
    description: "People, places, things, ideas, and academic concepts in IELTS tasks.",
    displayOrder: 1,
    isActive: true,
    topicCount: 6,
    iconName: "FileText",
    accentColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
  },
  {
    id: "cat-pronoun",
    name: "Pronoun",
    slug: "pronoun",
    description: "Referencing words that replace nouns to ensure cohesion and avoid repetition.",
    displayOrder: 2,
    isActive: true,
    topicCount: 4,
    iconName: "Users",
    accentColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
  },
  {
    id: "cat-verb",
    name: "Verb",
    slug: "verb",
    description: "Action, state, and modal verbs; base forms, past tense, and participles.",
    displayOrder: 3,
    isActive: true,
    topicCount: 12,
    iconName: "Zap",
    accentColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60",
  },
  {
    id: "cat-adjective",
    name: "Adjective",
    slug: "adjective",
    description: "Descriptive vocabulary enhancing lexical resource in IELTS Writing & Speaking.",
    displayOrder: 4,
    isActive: true,
    topicCount: 5,
    iconName: "Sparkles",
    accentColor: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60",
  },
  {
    id: "cat-adverb",
    name: "Adverb",
    slug: "adverb",
    description: "Words modifying verbs, adjectives, and clauses to add precision and tone.",
    displayOrder: 5,
    isActive: true,
    topicCount: 4,
    iconName: "Compass",
    accentColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
  },
  {
    id: "cat-preposition",
    name: "Preposition",
    slug: "preposition",
    description: "Words expressing spatial, temporal, and dependent relational contexts.",
    displayOrder: 6,
    isActive: true,
    topicCount: 8,
    iconName: "Anchor",
    accentColor: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
  },
  {
    id: "cat-conjunction",
    name: "Conjunction",
    slug: "conjunction",
    description: "Linking words and cohesive devices critical for complex sentence structures.",
    displayOrder: 7,
    isActive: true,
    topicCount: 6,
    iconName: "Link2",
    accentColor: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/60",
  },
  {
    id: "cat-interjection",
    name: "Interjection",
    slug: "interjection",
    description: "Expressive conversational markers primarily observed in informal spoken English.",
    displayOrder: 8,
    isActive: true,
    topicCount: 2,
    iconName: "MessageCircle",
    accentColor: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60",
  },
];

/**
 * Initial Seed Topics
 */
export const SEED_GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: "topic-simple-present",
    categoryId: "cat-verb",
    categorySlug: "verb",
    name: "Simple Present Tense",
    slug: "simple-present",
    description: "Expressing habitual actions, general truths, and static academic data in IELTS Task 1 & 2.",
    difficulty: "beginner",
    displayOrder: 1,
    isActive: true,
    lessonCount: 3,
  },
  {
    id: "topic-simple-past",
    categoryId: "cat-verb",
    categorySlug: "verb",
    name: "Simple Past Tense",
    slug: "simple-past",
    description: "Reporting completed historical trends, past research studies, and personal experiences in Speaking Part 2.",
    difficulty: "beginner",
    displayOrder: 2,
    isActive: true,
    lessonCount: 3,
  },
  {
    id: "topic-subject-verb-agreement",
    categoryId: "cat-verb",
    categorySlug: "verb",
    name: "Subject-Verb Agreement",
    slug: "subject-verb-agreement",
    description: "Ensuring singular and plural subjects match their corresponding verb forms without common Band 5/6 errors.",
    difficulty: "intermediate",
    displayOrder: 3,
    isActive: true,
    lessonCount: 2,
  },
  {
    id: "topic-countable-uncountable",
    categoryId: "cat-noun",
    categorySlug: "noun",
    name: "Countable vs Uncountable Nouns",
    slug: "countable-uncountable-nouns",
    description: "Crucial for avoiding quantifier errors (much/many, less/fewer) with academic nouns like research, information, equipment.",
    difficulty: "beginner",
    displayOrder: 1,
    isActive: true,
    lessonCount: 2,
  },
  {
    id: "topic-dependent-prepositions",
    categoryId: "cat-preposition",
    categorySlug: "preposition",
    name: "Dependent Prepositions",
    slug: "dependent-prepositions",
    description: "Mastering verb + preposition and adjective + preposition collocations (e.g., depend on, contribute to, prone to).",
    difficulty: "intermediate",
    displayOrder: 1,
    isActive: true,
    lessonCount: 3,
  },
  {
    id: "topic-cohesive-devices",
    categoryId: "cat-conjunction",
    categorySlug: "conjunction",
    name: "Cohesive Devices & Linkers",
    slug: "cohesive-devices",
    description: "Linking clauses with contrastive, additive, and causal transitions to score Band 7+ in Coherence & Cohesion.",
    difficulty: "advanced",
    displayOrder: 1,
    isActive: true,
    lessonCount: 4,
  },
];

/**
 * Educational Lesson Content Structure Sample
 */
export const SAMPLE_SIMPLE_PRESENT_CONTENT: GrammarLessonContent = {
  overview: "The Simple Present tense is vital for IELTS Task 1 (describing static facts/maps) and Task 2 (arguing universal truths and general states).",
  explanation: "We use the Simple Present tense to state permanent facts, routines, scientific truths, and general opinions. In IELTS academic writing, it is used whenever describing trends that have no specific past time frame or stating an author's current stance.",
  rules: [
    {
      id: "rule-1",
      title: "Third-Person Singular Suffix (-s / -es)",
      rule: "For subjects such as he, she, it, or singular noun phrases (e.g., 'the government', 'this chart'), the base verb must take -s or -es.",
      explanation: "A very common slip in IELTS Writing Task 2 is omitting the 's' on singular abstract subjects.",
      example: "The diagram illustrates (not: illustrate) how hydroelectric power is generated.",
    },
    {
      id: "rule-2",
      title: "Negative & Interrogative with Auxiliary 'Do / Does'",
      rule: "Use 'does not + base verb' for third-person singular, and 'do not + base verb' for all other persons.",
      explanation: "Do not add -s to the main verb when 'does' is already used as the auxiliary.",
      example: "This method does not require extensive financial investment.",
    },
  ],
  formulas: [
    {
      pattern: "Subject + Base Verb (s/es) + Object/Complement",
      description: "Affirmative statement",
      example: "Renewable energy provides substantial environmental benefits.",
    },
    {
      pattern: "Subject + do/does not + Base Verb + Complement",
      description: "Negative statement",
      example: "Urban migration does not necessarily reduce rural poverty.",
    },
  ],
  examples: [
    {
      sentence: "Global temperatures fluctuate throughout different seasons.",
      explanation: "Fluctuate is in present simple because it describes an enduring natural phenomenon.",
      highlight: "fluctuate",
    },
    {
      sentence: "The university provides comprehensive healthcare facilities to international students.",
      explanation: "Singular subject 'The university' takes 'provides'.",
      highlight: "provides",
    },
  ],
  commonMistakes: [
    {
      incorrect: "The researcher conclude that renewable energy is effective.",
      correct: "The researcher concludes that renewable energy is effective.",
      explanation: "Singular third-person subject 'The researcher' requires 'concludes'.",
    },
    {
      incorrect: "Most students does not have access to high-speed internet.",
      correct: "Most students do not have access to high-speed internet.",
      explanation: "Plural subject 'Most students' requires the auxiliary 'do not'.",
    },
  ],
  tips: [
    "In IELTS Task 1, if the prompt gives data for 'the current year' or has no time markers, use Simple Present throughout.",
    "Be alert with compound subjects joined by 'and' — they are plural (e.g., 'Wind and solar power produce zero carbon').",
  ],
  practiceQuestions: [
    {
      id: "q-sp-1",
      type: "multiple_choice",
      prompt: "Select the correct verb form for the sentence below:",
      sentence: "The pie chart _____ the proportion of energy generated by different sources.",
      options: [
        { id: "opt-1", text: "illustrate", isCorrect: false, explanation: "'chart' is singular" },
        { id: "opt-2", text: "illustrates", isCorrect: true, explanation: "Correct third-person singular form" },
        { id: "opt-3", text: "illustrating", isCorrect: false, explanation: "Requires auxiliary 'is' for continuous form" },
        { id: "opt-4", text: "illustrated", isCorrect: false, explanation: "Past tense is unnecessary without a past time marker" },
      ],
      correctAnswer: "illustrates",
      explanation: "Singular subject 'The pie chart' takes the third-person present verb 'illustrates'.",
    },
  ],
};

/**
 * Initial Sample Lessons
 */
export const SEED_GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: "lesson-simple-present-basics",
    categoryId: "cat-verb",
    topicId: "topic-simple-present",
    title: "Simple Present: Formation & Core Rules",
    slug: "simple-present-basics",
    description: "Master third-person singular rules, affirmative/negative structures, and IELTS Task 1 applications.",
    content: SAMPLE_SIMPLE_PRESENT_CONTENT,
    difficulty: "beginner",
    displayOrder: 1,
    isActive: true,
  },
];

/**
 * Sample Initial Verbs (Demonstrating Scalable Verb Model)
 * Phase 3 will ingest 500+ records.
 */
export const SAMPLE_INITIAL_VERBS: VerbItem[] = [
  {
    id: "verb-arise",
    baseForm: "arise",
    pastForm: "arose",
    pastParticiple: "arisen",
    meaning: "To happen or begin to exist; to originate from a situation.",
    pronunciation: "/əˈraɪz/",
    exampleSentence: "Significant challenges arise when international students adapt to new academic environments.",
    exampleMeaning: "Difficulties happen or begin to occur.",
    verbType: "irregular",
    difficulty: "intermediate",
    isCommon: true,
    isIeltsRelevant: true,
    displayOrder: 1,
  },
  {
    id: "verb-demonstrate",
    baseForm: "demonstrate",
    pastForm: "demonstrated",
    pastParticiple: "demonstrated",
    meaning: "To clearly show the existence or truth of something by giving proof or evidence.",
    pronunciation: "/ˈdemənstreɪt/",
    exampleSentence: "The survey results demonstrate a marked shift toward digital learning tools.",
    exampleMeaning: "The results clearly show evidence.",
    verbType: "regular",
    difficulty: "intermediate",
    isCommon: true,
    isIeltsRelevant: true,
    displayOrder: 2,
  },
  {
    id: "verb-fluctuate",
    baseForm: "fluctuate",
    pastForm: "fluctuated",
    pastParticiple: "fluctuated",
    meaning: "To rise and fall irregularly in number, amount, or level.",
    pronunciation: "/ˈflʌktʃueɪt/",
    exampleSentence: "Oil prices fluctuated wildly during the final quarter of the decade.",
    exampleMeaning: "Prices continuously went up and down.",
    verbType: "regular",
    difficulty: "advanced",
    isCommon: true,
    isIeltsRelevant: true,
    displayOrder: 3,
  },
  {
    id: "verb-undergo",
    baseForm: "undergo",
    pastForm: "underwent",
    pastParticiple: "undergone",
    meaning: "To experience or be subjected to something (especially a process, transformation, or change).",
    pronunciation: "/ˌʌndərˈɡoʊ/",
    exampleSentence: "The transportation sector has undergone massive modernization over the past 20 years.",
    exampleMeaning: "The sector experienced significant changes.",
    verbType: "irregular",
    difficulty: "advanced",
    isCommon: true,
    isIeltsRelevant: true,
    displayOrder: 4,
  },
];
