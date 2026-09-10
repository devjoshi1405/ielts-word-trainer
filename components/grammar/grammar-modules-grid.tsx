import * as React from "react";
import {
  BookMarked,
  Zap,
  Clock,
  Layers,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GrammarModulesGrid() {
  const modules: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    href: string;
    icon: any;
    status: "active" | "coming_soon";
    badgeText: string;
    badgeVariant: "success" | "indigo" | "secondary" | "warning";
    stats: string;
  }> = [
    {
      id: "parts-of-speech",
      title: "Parts of Speech",
      subtitle: "8 Foundational Categories",
      description: "Master nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections.",
      href: "#parts-of-speech",
      icon: BookMarked,
      status: "active",
      badgeText: "Phase 2 Live",
      badgeVariant: "success" as const,
      stats: "8 Topics • 100% Interactive",
    },
    {
      id: "verb-master",
      title: "Verb Master",
      subtitle: "500+ Conjugation Database",
      description: "Scalable regular and irregular verbs with V1, V2, V3 forms, context sentences, and weak verb tracking.",
      href: "/grammar/verbs",
      icon: Zap,
      status: "active" as const,
      badgeText: "500+ Verbs Active",
      badgeVariant: "success" as const,
      stats: "500+ Verbs Loaded",
    },
    {
      id: "tenses",
      title: "Tenses & Aspect",
      subtitle: "Simple Present & Simple Past",
      description: "Simple Present & Simple Past learning, sentence building, V1/V2 verbs, and 15-question diagnostic mastery tests.",
      href: "/grammar/tenses",
      icon: Clock,
      status: "active" as const,
      badgeText: "Phase 4 Live",
      badgeVariant: "success" as const,
      stats: "Simple Present & Past Active",
    },
    {
      id: "sentence-building",
      title: "Sentence Building",
      subtitle: "Word Arrangement & Conversion",
      description: "Interactive word bank token arrangement and present-to-past tense conversion exercises with instant feedback.",
      href: "/grammar/tenses/simple-present?mode=sentence_building",
      icon: Layers,
      status: "active" as const,
      badgeText: "Interactive Active",
      badgeVariant: "indigo" as const,
      stats: "Sentence & Tense Builders",
    },
    {
      id: "grammar-tests",
      title: "Verb & Diagnostic Tests",
      subtitle: "Diagnostic & Mastery Tests",
      description: "Adaptive diagnostic tests across all question types that pinpoint weak areas and verify Band 7+ mastery.",
      href: "/grammar/verbs/test",
      icon: FileCheck2,
      status: "active" as const,
      badgeText: "Tests Active",
      badgeVariant: "indigo" as const,
      stats: "Diagnostic Tests Active",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Grammar Curriculum Pillars
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete systematic grammar roadmap for IELTS candidates
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          5 Core Pillars
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => {
          const Icon = m.icon;
          const isComingSoon = m.status === "coming_soon";

          return (
            <Card
              key={m.id}
              className={`border-slate-200/80 dark:border-slate-800 transition-all flex flex-col justify-between ${
                isComingSoon
                  ? "bg-slate-50/40 dark:bg-slate-900/30 opacity-90"
                  : "hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-card bg-card"
              }`}
            >
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isComingSoon
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                          : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={m.badgeVariant} className="text-[10px]">
                      {m.badgeText}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{m.title}</span>
                      {isComingSoon && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                    </h3>
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {m.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-muted-foreground">{m.stats}</span>
                  {isComingSoon ? (
                    <span className="text-[11px] text-slate-400 italic">Phase 2/3 Roadmap</span>
                  ) : (
                    <a
                      href={m.href}
                      className="text-indigo-600 font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
