import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IELTS Word Trainer - Understand & Type What You Hear",
  description:
    "Train your ears to recognize words, spelling, phrases, numbers and prepositions exactly as they are spoken. Built specifically for IELTS candidates aiming for Band 8+.",
  keywords: [
    "IELTS Listening",
    "IELTS Spelling",
    "IELTS Word Trainer",
    "Phonetic Transcription",
    "Listen and Type",
    "Academic Vocabulary",
    "IELTS Prep",
  ],
};

import { AuthProvider } from "@/hooks/use-auth";
import { VoicePreferenceProvider } from "@/hooks/use-voice-preference";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <AuthProvider>
          <VoicePreferenceProvider>{children}</VoicePreferenceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

