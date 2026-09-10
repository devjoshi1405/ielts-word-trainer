"use client";

import * as React from "react";
import { Search, X, Filter, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VerbFilterCategory } from "@/types/grammar.types";

interface VerbFiltersProps {
  search: string;
  onSearchChange: (q: string) => void;
  category: VerbFilterCategory;
  onCategoryChange: (cat: VerbFilterCategory) => void;
  totalCount: number;
  weakCount?: number;
}

const CATEGORIES: Array<{
  id: VerbFilterCategory;
  label: string;
  badge?: string;
  variant?: "default" | "indigo" | "success" | "warning" | "outline";
}> = [
  { id: "all", label: "All Verbs" },
  { id: "common", label: "Common" },
  { id: "irregular", label: "Irregular" },
  { id: "regular", label: "Regular" },
  { id: "ielts", label: "IELTS Band 7+", variant: "indigo" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "weak", label: "Needs Practice", variant: "warning" },
  { id: "learned", label: "Learned", variant: "success" },
];

export function VerbFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  totalCount,
  weakCount = 0,
}: VerbFiltersProps) {
  return (
    <div className="space-y-3.5">
      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by V1, V2, V3 or meaning (e.g. 'go', 'went', 'gone', 'happen')..."
          className="pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 rounded-xl border-slate-200/80 dark:border-slate-700 shadow-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        <div className="flex items-center text-xs font-semibold text-muted-foreground mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5 mr-1" />
          <span>Filter:</span>
        </div>

        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
              }`}
            >
              <span>{cat.label}</span>
              {cat.id === "weak" && weakCount > 0 && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? "bg-white text-indigo-700" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {weakCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result Count and Active Filters Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Showing <strong>{totalCount}</strong> matching verbs
          {search && (
            <span>
              {" "}
              for &ldquo;<strong>{search}</strong>&rdquo;
            </span>
          )}
        </span>

        {(search || category !== "all") && (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              onCategoryChange("all");
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
