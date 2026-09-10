import * as React from "react";
import Link from "next/link";
import { Headphones, ShieldCheck, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                IELTS <span className="text-indigo-600">Word Trainer</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              The premier phonetic transcription and listening spelling trainer engineered specifically for IELTS candidates aiming for Band 8.0+.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Listening Modules
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/listening/listen-and-type" className="hover:text-indigo-600 transition-colors">
                  Listen & Type
                </Link>
              </li>
              <li>
                <Link href="/listening/vocabulary" className="hover:text-indigo-600 transition-colors">
                  Academic Vocabulary
                </Link>
              </li>
              <li>
                <Link href="/listening/numbers" className="hover:text-indigo-600 transition-colors">
                  Numbers & Quantities
                </Link>
              </li>
              <li>
                <Link href="/listening/dates-times" className="hover:text-indigo-600 transition-colors">
                  Dates & Times
                </Link>
              </li>
              <li>
                <Link href="/listening/mistakes" className="hover:text-indigo-600 transition-colors">
                  Mistake Review
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Platform & Roadmap
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reading" className="hover:text-indigo-600 transition-colors">
                  Reading (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/writing" className="hover:text-indigo-600 transition-colors">
                  Writing (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/speaking" className="hover:text-indigo-600 transition-colors">
                  Speaking (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-indigo-600 transition-colors">
                  Progress Analytics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} IELTS Word Trainer. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Built for IELTS Academic & General Training</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
