"use client";

import * as React from "react";
import Link from "next/link";
import { BookMarked, PenTool, Mic, ArrowRight, Bell, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ComingSoonCardProps {
  moduleName: "Reading" | "Writing" | "Speaking";
  badgeText?: string;
  tagline: string;
  description: string;
  plannedFeatures: string[];
  targetBandBenefit: string;
  quarterEstimate?: string;
}

const moduleIconMap = {
  Reading: BookMarked,
  Writing: PenTool,
  Speaking: Mic,
};

export function ComingSoonCard({
  moduleName,
  badgeText = "In Development",
  tagline,
  description,
  plannedFeatures,
  targetBandBenefit,
  quarterEstimate = "Phase 2 & 3",
}: ComingSoonCardProps) {
  const [isNotified, setIsNotified] = React.useState(false);
  const Icon = moduleIconMap[moduleName] || BookMarked;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{moduleName}</span>
      </div>

      <Card className="border-slate-200/80 shadow-card overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-indigo-600">
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    IELTS {moduleName}
                  </h1>
                  <Badge variant="indigo">{badgeText}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{quarterEstimate}</p>
              </div>
            </div>
            <Button
              variant={isNotified ? "success" : "outline"}
              onClick={() => setIsNotified(true)}
              className="gap-2"
            >
              {isNotified ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Notified when ready
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" /> Notify Me on Launch
                </>
              )}
            </Button>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">
            {tagline}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base leading-relaxed">
            {description}
          </p>
        </div>

        <CardContent className="p-8 sm:p-10 space-y-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              What We Are Building for {moduleName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plannedFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Target Band Benefit</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {targetBandBenefit}
              </p>
            </div>
            <Link href="/listening/listen-and-type">
              <Button variant="brand" size="sm" className="gap-2 whitespace-nowrap">
                Practice Listening Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
