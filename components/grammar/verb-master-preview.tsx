import * as React from "react";
import Link from "next/link";
import { Zap, Sparkles, Volume2, Info, ArrowRight, BookOpen, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VERBS_500_DATA } from "@/data/verbs-500";

export function VerbMasterPreview() {
  const previewVerbs = VERBS_500_DATA.slice(0, 5);

  return (
    <div id="verb-master" className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              500+ Verb Master
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="success" className="text-[10px] gap-1">
              <Sparkles className="w-3 h-3" /> Phase 3 Live
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
            Verb Master & Conjugations
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            500+ English regular and irregular verbs with V1, V2, V3 forms, context sentences, and diagnostic tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/grammar/verbs">
            <Button variant="default" size="default" className="gap-1.5 text-xs font-bold shadow-xs">
              <span>Open 500+ Verb Master</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              500+ Essential English Verbs Loaded
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Practice forms, test recall across 6 interactive question types, and detect weak verbs.
            </p>
          </div>
        </div>
        <Link href="/grammar/verbs/test">
          <Button variant="outline" size="default" className="text-xs font-bold gap-1.5 shrink-0">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>Take Diagnostic Test</span>
          </Button>
        </Link>
      </div>

      {/* Verb Database Preview Table */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 pl-5">V1 (Base Form)</th>
                <th className="p-3.5">V2 (Past Simple)</th>
                <th className="p-3.5">V3 (Past Participle)</th>
                <th className="p-3.5">Meaning & IELTS Context</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5 pr-5 text-right">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {previewVerbs.map((verb) => (
                <tr
                  key={verb.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="p-3.5 pl-5 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center space-x-2">
                      <span>{verb.baseForm}</span>
                      {verb.pronunciation && (
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {verb.pronunciation}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    {verb.pastForm}
                  </td>
                  <td className="p-3.5 font-semibold text-indigo-700 dark:text-indigo-300">
                    {verb.pastParticiple}
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {verb.meaning}
                    </div>
                    {verb.exampleSentence && (
                      <div className="text-[11px] text-muted-foreground italic mt-0.5">
                        &ldquo;{verb.exampleSentence}&rdquo;
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <Badge
                      variant={verb.verbType === "irregular" ? "warning" : "indigo"}
                      className="text-[10px] uppercase font-semibold"
                    >
                      {verb.verbType}
                    </Badge>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase capitalize"
                    >
                      {verb.difficulty}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
