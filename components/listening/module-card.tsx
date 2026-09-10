import * as React from "react";
import Link from "next/link";
import {
  Headphones,
  BookOpen,
  Binary,
  CalendarClock,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PracticeModuleSummary } from "@/types/progress.types";

const iconMap = {
  Headphones,
  BookOpen,
  Binary,
  CalendarClock,
  AlertTriangle,
};

interface ModuleCardProps {
  module: PracticeModuleSummary;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = iconMap[module.iconName as keyof typeof iconMap] || Headphones;

  return (
    <Card className="hover:shadow-card transition-all border-slate-200/80 group">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Icon className="w-6 h-6" />
            </div>
            {module.badge && (
              <Badge
                variant={module.badge === "Action Needed" ? "destructive" : "indigo"}
                className="text-xs"
              >
                {module.badge}
              </Badge>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
              {module.title}
            </h3>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              {module.subtitle}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {module.description}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Progress</span>
              <span>
                {module.completedCount}/{module.itemCount} items
              </span>
            </div>
            <Progress value={module.completedCount} max={module.itemCount} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{module.estimatedMinutes}m
              </span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                {module.accuracy}% Acc.
              </span>
            </div>

            <Link href={module.href}>
              <Button variant="brand" size="sm" className="gap-1.5 font-medium shadow-xs">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
