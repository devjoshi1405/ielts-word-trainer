"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserProgress } from "@/hooks/use-user-progress";

export default function ProgressPage() {
  const { stats, mistakes, loading } = useUserProgress();

  const listeningAccuracy = stats?.listeningAccuracy ?? 0;
  const questionsCompleted = stats?.questionsCompleted ?? 0;
  const currentStreak = stats?.currentStreak ?? 0;
  const categoryAccuracy = stats?.categoryAccuracy ?? [];
  const weeklyActivity = stats?.weeklyActivity ?? [];

  const totalMistakes = mistakes.length;
  const clearedMistakes = mistakes.filter((m) => (m.masteryNumeric ?? 1) >= 4).length;
  const clearanceRate =
    totalMistakes > 0 ? Math.round((clearedMistakes / totalMistakes) * 100) : 100;

  const estimatedBand =
    listeningAccuracy >= 95
      ? "Band 9.0"
      : listeningAccuracy >= 88
      ? "Band 8.5"
      : listeningAccuracy >= 80
      ? "Band 7.5"
      : listeningAccuracy >= 70
      ? "Band 6.5"
      : "Band 6.0";

  const bandEstimates = [
    { accuracy: "95% - 100%", band: "Band 8.5 - 9.0", desc: "Expert user, native-level spelling & decoding", current: listeningAccuracy >= 88 },
    { accuracy: "85% - 94%", band: "Band 7.5 - 8.0", desc: "Very good user, minor isolated spelling slips", current: listeningAccuracy >= 75 && listeningAccuracy < 88 },
    { accuracy: "75% - 84%", band: "Band 6.5 - 7.0", desc: "Competent user, frequent double-letter mistakes", current: listeningAccuracy >= 65 && listeningAccuracy < 75 },
    { accuracy: "< 75%", band: "Band 5.5 - 6.0", desc: "Modest user, significant phonetic gaps", current: listeningAccuracy < 65 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Analytics & Mastery
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="indigo" className="text-[10px]">
              {estimatedBand} Trajectory
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Learning Progress
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Detailed performance breakdown of your listening phonetic accuracy, mistake resolution rate, and consistency.
          </p>
        </div>

        <Link href="/listening/listen-and-type">
          <Button variant="brand" className="gap-2 shadow-sm">
            <Headphones className="w-4 h-4" />
            <span>Practice Session</span>
          </Button>
        </Link>
      </div>

      {/* Top 3 Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/60 to-white dark:from-slate-900 dark:to-indigo-950/20">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated Band
              </span>
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {loading ? "..." : estimatedBand}
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Accuracy: {listeningAccuracy}% ({stats?.correctAnswers ?? 0}/{questionsCompleted} correct)
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Questions Completed
              </span>
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {loading ? "..." : questionsCompleted}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all listening & transcription drills
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mistake Clearance Rate
              </span>
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {loading ? "..." : `${clearanceRate}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {clearedMistakes} of {Math.max(totalMistakes, 1)} flagged mistakes mastered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy by Category Breakdown */}
      <Card className="border-slate-200/80 shadow-card">
        <CardHeader>
          <CardTitle>Accuracy by Category</CardTitle>
          <CardDescription>
            Performance breakdown across individual IELTS listening exercise types.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoryAccuracy.length > 0 ? (
            categoryAccuracy.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-muted-foreground">
                      {cat.completed}/{cat.total} completed
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {cat.accuracy}%
                    </span>
                  </div>
                </div>
                <Progress value={cat.accuracy} max={100} className="h-2.5" />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Start practicing to see category accuracy analytics.</p>
          )}
        </CardContent>
      </Card>

      {/* Weekly Activity Calendar / Day Grid */}
      <Card className="border-slate-200/80 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Practice Activity</CardTitle>
              <CardDescription>Questions completed over the last 7 days</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>{currentStreak} Day Streak</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-3 text-center">
            {weeklyActivity.map((day) => (
              <div
                key={day.day}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1.5"
              >
                <div className="text-xs font-semibold text-muted-foreground">{day.day}</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {day.count}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  {day.count > 0 ? `${day.accuracy}%` : "-"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IELTS Band Score Benchmarks */}
      <Card className="border-slate-200/80 shadow-card">
        <CardHeader>
          <CardTitle>IELTS Band Score Conversion Benchmark</CardTitle>
          <CardDescription>
            How your transcription accuracy correlates with standard IELTS Listening band scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {bandEstimates.map((item) => (
              <div
                key={item.band}
                className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.current ? "bg-indigo-50/50 dark:bg-indigo-950/20 -mx-6 px-6 rounded-xl" : ""
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {item.band}
                    </span>
                    {item.current && (
                      <Badge variant="indigo" className="text-[10px]">
                        Your Current Range ({listeningAccuracy}%)
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <span className="text-sm font-semibold font-mono text-slate-700 dark:text-slate-300">
                  {item.accuracy}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

