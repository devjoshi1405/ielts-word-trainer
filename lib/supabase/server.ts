import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { isSupabaseConfigured, normalizeSupabaseUrl } from "./client";
import * as fs from "fs";
import * as path from "path";

/**
 * Helper to load .env file in standalone Node.js script executions.
 */
export function ensureEnvLoaded() {
  if (typeof process === "undefined") return;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        content.split(/\r?\n/).forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        });
      }
    } catch {
      // Ignore if running in non-node env
    }
  }
}

// Auto-run env loader for scripts
ensureEnvLoaded();

/**
 * Server-side Supabase client for Server Components, Route Handlers, or Scripts.
 * Uses public anon key by default.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> | null {
  ensureEnvLoaded();

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Admin server client for administrative scripts (e.g. database seeding).
 * ONLY accessible when SUPABASE_SERVICE_ROLE_KEY is provided on the server.
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
  ensureEnvLoaded();

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = normalizeSupabaseUrl(rawUrl);

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
