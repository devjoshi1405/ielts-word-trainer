import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

let supabaseBrowserClient: SupabaseClient<Database> | null = null;

/**
 * Normalizes Supabase URL to ensure valid https URL even if only reference ID is given.
 */
export function normalizeSupabaseUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  // If only project ID was provided (e.g. "wlfptvvchechowphqzly")
  return `https://${trimmed}.supabase.co`;
}

/**
 * Checks if Supabase credentials are configured in the current environment.
 */
export function isSupabaseConfigured(): boolean {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = normalizeSupabaseUrl(rawUrl);
  return Boolean(url && anonKey && anonKey.length > 20);
}

/**
 * Creates or retrieves the singleton Supabase browser client.
 * Safe for use in Client Components. Does NOT expose service-role keys.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseBrowserClient) {
    const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

    supabaseBrowserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseBrowserClient;
}
