import * as React from "react";
import { Headphones } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QuestionProgressProps {
  current: number;
  total: number;
  categoryTitle?: string;
  difficulty?: string;
}

export function QuestionProgress({
  current,
  total,
  categoryTitle = "Listen & Type",
  difficulty = "Intermediate",
}: QuestionProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              IELTS LISTENING
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="neutral" className="text-[10px] py-0 px-2 uppercase">
              {difficulty}
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {categoryTitle}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Question {current} of {total}
          </div>
          <div className="text-xs text-muted-foreground">
            {percentage}% completed
          </div>
        </div>
      </div>

      <Progress value={current} max={total} className="h-2.5 bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
