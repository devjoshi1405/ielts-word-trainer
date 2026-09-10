"use client";

import * as React from "react";
import Link from "next/link";
import {
  Headphones,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Binary,
  CalendarClock,
  ShieldCheck,
  TrendingUp,
  Volume2,
  BookMarked,
  PenTool,
  Mic,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { audioService } from "@/lib/audio";

export default function LandingPage() {
  const [demoInput, setDemoInput] = React.useState("accomodation");
  const [demoChecked, setDemoChecked] = React.useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = React.useState(false);

  const handlePlayDemo = async () => {
    setIsPlayingDemo(true);
    try {
      await audioService.playText("accommodation", { accent: "british", rate: 0.9 });
    } finally {
      setIsPlayingDemo(false);
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Soft background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-indigo-100/50 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-8 text-center max-w-4xl space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built specifically for IELTS Academic & General Training</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
            Understand What You Hear. <br />
            <span className="text-indigo-600">Type What You Hear.</span> <br />
            Master IELTS Listening.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Train your ears to recognize words, spelling, phrases, numbers and
            prepositions exactly as they are spoken.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/listening/listen-and-type" className="w-full sm:w-auto">
              <Button variant="brand" size="xl" className="w-full sm:w-auto gap-3 text-base shadow-lg shadow-indigo-200 dark:shadow-none">
                <Headphones className="w-5 h-5" />
                <span>Start Free Practice</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" className="w-full sm:w-auto text-base">
                Explore How It Works
              </Button>
            </Link>
          </div>

          {/* Social Proof Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Band 7.0 - 9.0 Targeted Vocabulary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Standard British & International Accents</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Spelling Diff Feedback</span>
            </div>
          </div>

          {/* Interactive Live Hero Demo Widget */}
          <div className="pt-8 max-w-2xl mx-auto">
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-elevated text-left space-y-5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-slate-500 ml-2">
                    Interactive Mini Demo
                  </span>
                </div>
                <Badge variant="indigo" className="text-[10px]">
                  Section 1 Common Trap
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handlePlayDemo}
                    className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Volume2 className={`w-5 h-5 ${isPlayingDemo ? "animate-pulse" : ""}`} />
                  </button>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Sample Audio Prompt
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Click to listen with British pronunciation
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border text-muted-foreground">
                  /əˌkɒm.əˈdeɪ.ʃən/
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Type what you hear:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={demoInput}
                    onChange={(e) => {
                      setDemoInput(e.target.value);
                      setDemoChecked(false);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium bg-background"
                    placeholder="Type spelling here..."
                  />
                  <Button
                    type="button"
                    variant="brand"
                    size="sm"
                    onClick={() => setDemoChecked(true)}
                  >
                    Check
                  </Button>
                </div>
              </div>

              {demoChecked && (
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/80 dark:bg-amber-950/30 text-xs space-y-1 animate-in fade-in-50">
                  <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Watch out for double letters!</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    Target: <strong className="text-emerald-700">accommodation</strong> (Double &apos;c&apos; and double &apos;m&apos;).
                    Your input: <span className="line-through text-rose-600">{demoInput}</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: THE LISTENING PROBLEM */}
      <section id="problem" className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="neutral">The Real Challenge</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Why 80% of Students Lose Marks in IELTS Listening
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            It is rarely because you did not understand the conversation. It is almost always a phonetic transcription failure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center font-bold text-xl">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Spelling & Silent Traps
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Words like <em>accommodation</em>, <em>necessary</em>, and <em>environment</em> contain silent letters or double consonants that are easily misspelled under exam pressure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold text-xl">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Connected Fast Speech
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Native speakers blend words together (elision and assimilation). Without active ear training, phrases sound like a single blurry sound.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Numbers, Dates & Prepositions
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Section 1 and 2 require instant capture of prices (£450.50), phone numbers with double digits, and UK date formats without hesitation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. SECTION: HOW LISTEN & TYPE WORKS */}
      <section id="how-it-works" className="bg-slate-50/70 dark:bg-slate-900/50 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <Badge variant="indigo">Scientific Ear Training</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              How Listen & Type Builds Instant Recall
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              A 3-step active recall loop that transforms passive hearing into active phonetic decoding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                1. Native Audio Playback
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Listen to real IELTS-style sentences and target vocabulary spoken with native British and international accents at 0.75x, 1.0x, or 1.25x speed.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                2. Active Transcription
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Type the exact spelling without visual cues. This forces your brain to connect phonetic acoustic signals directly to correct orthography.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                3. Instant Diff Feedback
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Get immediate character-level diffs, phonetic IPA breakdowns, and rules for double consonants or silent letters so you never repeat the error.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: VOCABULARY TRAINING */}
      <section id="features" className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="indigo">Curated Syllabus</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              High-Frequency Vocabulary for Sections 1 through 4
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Every practice item is categorized according to official IELTS topics: Accommodation & Bookings (Section 1), Local Facilities (Section 2), Academic Tutorials (Section 3), and University Lectures (Section 4).
            </p>

            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✓</div>
                <span>Environmental science, ecology, and climate lexicon</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✓</div>
                <span>University administrative terms, degrees & campus services</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✓</div>
                <span>Currency notations (£, $, €), quantities, and telephone groups</span>
              </li>
            </ul>

            <Link href="/listening/vocabulary">
              <Button variant="outline" className="gap-2">
                <span>Explore Vocabulary Packs</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
              <BookOpen className="w-6 h-6 text-indigo-600 mb-3" />
              <div className="font-bold text-base text-slate-900 dark:text-slate-100">Academic Lexicon</div>
              <p className="text-xs text-muted-foreground mt-1">Band 7.0 - 9.0 words</p>
            </Card>

            <Card className="p-5 border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
              <Binary className="w-6 h-6 text-indigo-600 mb-3" />
              <div className="font-bold text-base text-slate-900 dark:text-slate-100">Numbers & Prices</div>
              <p className="text-xs text-muted-foreground mt-1">Section 1 speed drills</p>
            </Card>

            <Card className="p-5 border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
              <CalendarClock className="w-6 h-6 text-indigo-600 mb-3" />
              <div className="font-bold text-base text-slate-900 dark:text-slate-100">Dates & Times</div>
              <p className="text-xs text-muted-foreground mt-1">UK standard formats</p>
            </Card>

            <Card className="p-5 border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
              <Headphones className="w-6 h-6 text-indigo-600 mb-3" />
              <div className="font-bold text-base text-slate-900 dark:text-slate-100">Accent Training</div>
              <p className="text-xs text-muted-foreground mt-1">British, US & Australian</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. SECTION: MISTAKE TRACKING */}
      <section id="mistakes" className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                Spelling Mastery Engine
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight leading-tight">
                Automatic Mistake Bank & Spaced Retesting
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whenever you miss a word during practice, it is automatically cataloged in your personal Mistakes Bank. Review it daily until you achieve 100% accuracy.
              </p>

              <div className="pt-2">
                <Link href="/listening/mistakes">
                  <Button variant="secondary" size="lg" className="gap-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                    <span>View Mistake Tracker</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-3 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Top IELTS Spelling Traps Cataloged
              </div>
              <div className="space-y-2">
                {[
                  { word: "accommodation", tip: "2 C's, 2 M's" },
                  { word: "environment", tip: "Silent 'n' in 'enviro-n-ment'" },
                  { word: "necessary", tip: "1 'c', 2 's's" },
                  { word: "university", tip: "Ends with '-sity'" },
                  { word: "reservation", tip: "Ends with '-tion'" },
                ].map((item) => (
                  <div
                    key={item.word}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 text-xs"
                  >
                    <span className="font-semibold text-white">{item.word}</span>
                    <span className="text-indigo-200 text-[11px]">{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION: PROGRESS TRACKING */}
      <section className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="indigo">Data-Driven Growth</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Track Accuracy & Predict Your Listening Band Score
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Detailed metrics showing your accuracy across topics, daily streak consistency, and words mastered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-slate-200/80 text-center p-6 space-y-2">
            <div className="text-3xl font-bold text-indigo-600">88%</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Average Accuracy</div>
            <div className="text-xs text-muted-foreground">Across all modules</div>
          </Card>

          <Card className="border-slate-200/80 text-center p-6 space-y-2">
            <div className="text-3xl font-bold text-emerald-600">1,420+</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Questions Solved</div>
            <div className="text-xs text-muted-foreground">Active ear training</div>
          </Card>

          <Card className="border-slate-200/80 text-center p-6 space-y-2">
            <div className="text-3xl font-bold text-amber-600">385</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Words Mastered</div>
            <div className="text-xs text-muted-foreground">Flawless spelling</div>
          </Card>

          <Card className="border-slate-200/80 text-center p-6 space-y-2">
            <div className="text-3xl font-bold text-indigo-600">12 Days</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Active Streak</div>
            <div className="text-xs text-muted-foreground">Consistent daily practice</div>
          </Card>
        </div>
      </section>

      {/* 7. SECTION: READING, WRITING & SPEAKING — COMING SOON */}
      <section className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <Badge variant="neutral">The Complete Suite</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Reading, Writing & Speaking — Coming Soon
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            IELTS Word Trainer is expanding to cover all four exam sub-skills with the same rigorous active recall method.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200/80 shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <BookMarked className="w-5 h-5" />
              </div>
              <Badge variant="neutral">In Development</Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              IELTS Reading
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Speed reading, keyword scanning techniques, and True/False/Not Given breakdown drills.
            </p>
            <Link href="/reading" className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1">
              Preview Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="border-slate-200/80 shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <Badge variant="neutral">In Development</Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              IELTS Writing
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Task 1 visual data vocabulary and Task 2 essay coherence, linking devices, and collocations.
            </p>
            <Link href="/writing" className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1">
              Preview Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="border-slate-200/80 shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <Badge variant="neutral">In Development</Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              IELTS Speaking
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Part 1, 2, and 3 cue card simulator, fluency timers, and pronunciation intonation checks.
            </p>
            <Link href="/speaking" className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1">
              Preview Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      </section>

      {/* 8. SECTION: FINAL CTA */}
      <section className="container mx-auto px-4 sm:px-8 max-w-4xl text-center">
        <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-10 sm:p-14 shadow-elevated space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Mastering IELTS Listening Today
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-base leading-relaxed">
            Stop losing valuable marks to silly spelling mistakes and fast speech. Begin your daily 10-minute training session right now.
          </p>
          <div className="pt-2">
            <Link href="/listening/listen-and-type">
              <Button size="xl" className="bg-white text-indigo-600 hover:bg-slate-100 font-bold text-base shadow-md">
                <span>Start Free Practice</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
