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
  Play,
  Loader2,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accent } from "@/types/exercise.types";
import { useVoicePreference } from "@/hooks/use-voice-preference";

export default function SettingsPage() {
  const [speed, setSpeed] = React.useState<number>(1.0);
  const { accent, setAccent, availableAccents, testVoice, isTestingVoice } = useVoicePreference();
  const [testingAccentId, setTestingAccentId] = React.useState<Accent | null>(null);
  const [dailyGoal, setDailyGoal] = React.useState<number>(30);
  const [targetBand, setTargetBand] = React.useState<string>("8.0");
  const [isSaved, setIsSaved] = React.useState<boolean>(false);

  const handleTestAccent = async (e: React.MouseEvent, accId: Accent) => {
    e.stopPropagation();
    setTestingAccentId(accId);
    try {
      await testVoice(accId, "Schedule, laboratory, and academic research.");
    } finally {
      setTestingAccentId(null);
    }
  };

  const handleSelectAccent = async (accId: Accent) => {
    setAccent(accId);
    setTestingAccentId(accId);
    try {
      await testVoice(accId, "Schedule, laboratory, and academic research.");
    } finally {
      setTestingAccentId(null);
    }
  };

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
                Configure the speech synthesis engine for Listen & Type exercises across the app.
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Preferred Voice Accent
              </label>
              <span className="text-xs text-muted-foreground">
                Click an accent to switch & hear live sample
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableAccents.map((acc) => {
                const isSelected = accent === acc.id;
                const isThisTesting = isTestingVoice && testingAccentId === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectAccent(acc.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100 shadow-xs ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{acc.flag}</span>
                          <span className="font-semibold text-sm">{acc.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1.5">{acc.description}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                        Region: {acc.region}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground italic truncate">
                        &quot;{acc.sampleWord}&quot;
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "brand" : "outline"}
                        className="h-7 px-2.5 text-[11px] gap-1 shrink-0 rounded-lg"
                        disabled={isThisTesting}
                        onClick={(e) => handleTestAccent(e, acc.id)}
                      >
                        {isThisTesting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Playing...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Test Voice</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
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
