import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconColor = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-50 dark:bg-indigo-950/50",
}: StatCardProps) {
  return (
    <Card className="hover:shadow-card transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-xs",
              iconBg,
              iconColor
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </div>
          <div className="flex items-center space-x-2">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md",
                  change.trend === "up"
                    ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : change.trend === "down"
                    ? "text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400"
                    : "text-slate-600 bg-slate-100 dark:bg-slate-800"
                )}
              >
                {change.trend === "up" && <TrendingUp className="w-3 h-3 mr-0.5" />}
                {change.trend === "down" && <TrendingDown className="w-3 h-3 mr-0.5" />}
                {change.value}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
