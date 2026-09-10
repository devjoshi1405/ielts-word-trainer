import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  Zap,
  Sparkles,
  Compass,
  Anchor,
  Link2,
  MessageCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrammarCategory, GrammarTopic } from "@/types/grammar.types";

interface PartsOfSpeechGridProps {
  categories: GrammarCategory[];
  topics: GrammarTopic[];
  loading: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText: FileText,
  Users: Users,
  Zap: Zap,
  Sparkles: Sparkles,
  Compass: Compass,
  Anchor: Anchor,
  Link2: Link2,
  MessageCircle: MessageCircle,
};

export function PartsOfSpeechGrid({ categories, topics, loading }: PartsOfSpeechGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const displayedTopics = selectedCategory
    ? topics.filter((t) => t.categoryId === selectedCategory || t.categorySlug === selectedCategory)
    : topics;

  return (
    <div id="parts-of-speech" className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Core Module
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="indigo" className="text-[10px]">
              8 Categories Loaded
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
            Parts of Speech Explorer
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            The foundation of English syntax. Select any category to view its IELTS topics and core rules.
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
          >
            Show All Topics
          </button>
        )}
      </div>

      {/* 8 Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
          const IconComponent = (cat.iconName && ICON_MAP[cat.iconName]) || FileText;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className="text-left w-full focus:outline-hidden"
            >
              <Card
                className={`transition-all hover:scale-[1.02] cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/20 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs"
                }`}
              >
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        cat.accentColor || "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <Badge variant={isSelected ? "indigo" : "outline"} className="text-[10px]">
                      {cat.topicCount || 4} Topics
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                      {cat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Selected Topics List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>
              {selectedCategory
                ? `Topics for ${categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory)?.name || "Category"}`
                : "Foundational Grammar Topics"}
            </span>
          </h3>
          <span className="text-xs text-muted-foreground">
            {displayedTopics.length} Topics Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTopics.map((topic) => {
            const catSlug =
              topic.categorySlug ||
              categories.find((c) => c.id === topic.categoryId)?.slug ||
              "noun";

            return (
              <Link
                key={topic.id}
                href={`/grammar/parts-of-speech/${catSlug}`}
                className="block group"
              >
                <Card className="h-full border-slate-200/80 dark:border-slate-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-600 transition-all group-hover:shadow-md flex flex-col justify-between cursor-pointer">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            topic.difficulty === "advanced"
                              ? "warning"
                              : topic.difficulty === "intermediate"
                              ? "indigo"
                              : "success"
                          }
                          className="text-[10px] uppercase tracking-wider capitalize"
                        >
                          {topic.difficulty}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {topic.lessonCount || 3} Lessons
                        </span>
                      </div>

                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {topic.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready to Study
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Study Now <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
