import * as React from "react";
import Link from "next/link";
import { BookOpen, Binary, CalendarClock, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function QuickModulesGrid() {
  const modules = [
    {
      title: "Academic Vocabulary",
      description: "High-yield Band 7-9 topics: environment, research & education.",
      href: "/listening/vocabulary",
      icon: BookOpen,
      count: "25 words",
      badge: "Band 7-9",
    },
    {
      title: "Numbers & Currency",
      description: "Prices (£/$/€), quantities, telephone numbers, and percentages.",
      href: "/listening/numbers",
      icon: Binary,
      count: "15 items",
    },
    {
      title: "Dates & Times",
      description: "Schedules, calendar formats (14th October), and time expressions.",
      href: "/listening/dates-times",
      icon: CalendarClock,
      count: "15 items",
    },
    {
      title: "My Mistakes",
      description: "Targeted repetition of your 7 flagged spelling traps.",
      href: "/listening/mistakes",
      icon: AlertTriangle,
      count: "7 items",
      badge: "Action Required",
      badgeVariant: "destructive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {modules.map((m) => {
        const Icon = m.icon;
        return (
          <Link key={m.href} href={m.href} className="group">
            <Card className="h-full border-slate-200/80 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-card">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    {m.badge && (
                      <Badge variant={m.badgeVariant || "indigo"} className="text-[10px]">
                        {m.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{m.count}</span>
                  <span className="text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Practice <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
