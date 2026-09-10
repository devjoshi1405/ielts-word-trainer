"use client";

import * as React from "react";
import {
  Settings,
  Volume2,
  Globe,
  Bell,
  Sparkles,
  Shield,
  Save,
  CheckCircle2,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accent } from "@/types/exercise.types";

export default function SettingsPage() {
  const [speed, setSpeed] = React.useState<number>(1.0);
  const [accent, setAccent] = React.useState<Accent>("british");
  const [dailyGoal, setDailyGoal] = React.useState<number>(30);
  const [targetBand, setTargetBand] = React.useState<string>("8.0");
  const [isSaved, setIsSaved] = React.useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Preferences
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <Badge variant="indigo" className="text-[10px]">
            User Profile
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Customize your audio playback speed, voice accent preferences, daily study targets, and exam goals.
        </p>
      </div>

      {/* Audio & Accent Preferences */}
      <Card className="border-slate-200/80 shadow-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Audio & Accent Preferences</CardTitle>
              <CardDescription>
                Configure the speech synthesis engine for Listen & Type exercises.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Playback Speed */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Default Playback Speed
            </label>
            <div className="flex gap-3">
              {[0.75, 1.0, 1.25].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    speed === s
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 shadow-xs"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {s}x {s === 1.0 ? "(Standard)" : s === 0.75 ? "(Learner Slow)" : "(Fast Pace)"}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Preference */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Preferred Voice Accent
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "british" as const, name: "British (UK)", note: "Standard IELTS BBC style" },
                { id: "american" as const, name: "American (US)", note: "General North American" },
                { id: "australian" as const, name: "Australian (AU)", note: "Common in Section 1 & 2" },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccent(acc.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    accent === acc.id
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-semibold text-sm">{acc.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{acc.note}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Band & Daily Goals */}
      <Card className="border-slate-200/80 shadow-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Study Goals & Target Band</CardTitle>
              <CardDescription>
                Set your daily questions quota and target IELTS listening score.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Target IELTS Band Score
              </label>
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(e.target.value)}
                className="w-full h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-background px-4 text-sm font-medium"
              >
                <option value="6.5">Band 6.5 (Competent)</option>
                <option value="7.0">Band 7.0 (Good)</option>
                <option value="7.5">Band 7.5 (High)</option>
                <option value="8.0">Band 8.0 (Very Good)</option>
                <option value="8.5">Band 8.5 (Expert)</option>
                <option value="9.0">Band 9.0 (Native Master)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Daily Goal Questions
              </label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-background px-4 text-sm font-medium"
              >
                <option value={15}>15 questions / day (~5 mins)</option>
                <option value={30}>30 questions / day (~10 mins)</option>
                <option value={50}>50 questions / day (~15 mins)</option>
                <option value={100}>100 questions / day (~30 mins)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Profile Mock */}
      <Card className="border-slate-200/80 shadow-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Account & Supabase Architecture</CardTitle>
              <CardDescription>
                Local profile data for Phase 1. Ready for Supabase authentication in Phase 2.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <Input defaultValue="John Doe" readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <Input defaultValue="student@ielts-prep.io" readOnly />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
          <span className="text-xs text-muted-foreground">
            Architecture: Supabase-ready client schema
          </span>
          <Button
            type="button"
            onClick={handleSave}
            variant="brand"
            className="gap-2 shadow-sm"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
