import * as React from "react";
import Link from "next/link";
import {
  Headphones,
  Sparkles,
  Layers,
  BookOpen,
  Building,
  TreePine,
  Bus,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Cpu,
  Globe2,
  ShoppingBag,
  Store,
  Calendar,
  Languages,
  ArrowRight,
} from "lucide-react";
import { ModuleCard } from "@/components/listening/module-card";
import { MOCK_MODULE_SUMMARIES } from "@/data/mock-stats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UNIQUE_VOCABULARY_ITEMS, VOCABULARY_BY_CATEGORY } from "@/data/vocabulary";

const CATEGORY_META = [
  { id: "academic", name: "Academic & University", icon: GraduationCap, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
  { id: "accommodation", name: "Accommodation & Housing", icon: Building, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
  { id: "environment", name: "Environment & Ecology", icon: TreePine, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40" },
  { id: "transport", name: "Transport & Travel", icon: Bus, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
  { id: "work", name: "Work & Employment", icon: Briefcase, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
  { id: "health", name: "Health & Medicine", icon: HeartPulse, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40" },
  { id: "technology", name: "Technology & Science", icon: Cpu, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40" },
  { id: "society", name: "Society & Culture", icon: Globe2, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40" },
  { id: "shopping", name: "Shopping & Commerce", icon: ShoppingBag, color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40" },
  { id: "services", name: "Services & Facilities", icon: Store, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40" },
  { id: "articles", name: "Articles & Prepositions", icon: Languages, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40" },
  { id: "numbers", name: "Numbers & Dates", icon: Calendar, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40" },
];

export default function ListeningHubPage() {
  const modules = MOCK_MODULE_SUMMARIES;
  const totalWords = UNIQUE_VOCABULARY_ITEMS.length;

  return (
    <div className="space-y-10 animate-in fade-in-50 duration-300">
      {/* Listening Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              IELTS Prep Hub
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="indigo" className="text-[10px]">
              {totalWords}+ Words Loaded
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Listening Modules
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Choose a targeted practice mode to build ear recognition, eliminate spelling errors, and master all IELTS question formats.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-white dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span><strong>{totalWords}</strong> Vocabulary Items Ready</span>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Core Practice Modes
          </h2>
          <span className="text-xs text-muted-foreground">5 Core Drills</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      </div>

      {/* 15 Topic Vocabulary Categories Explorer */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              IELTS Topic Vocabulary Bank
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Targeted word sets organized across key IELTS listening exam contexts
            </p>
          </div>
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            15 Topic Categories
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORY_META.map((cat) => {
            const Icon = cat.icon;
            const count = VOCABULARY_BY_CATEGORY[cat.id]?.length || 20;

            return (
              <Link
                key={cat.id}
                href={`/listening/listen-and-type`}
                className="group block"
              >
                <Card className="hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-xs border-slate-200/80 dark:border-slate-800">
                  <CardContent className="p-3.5 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {count} words
                      </div>
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
