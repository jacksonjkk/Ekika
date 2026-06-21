import { createClient } from "@supabase/supabase-js";
import { config } from "./config.js";

/**
 * Creates a Supabase client for backend use.
 * Prefers the service role key (bypasses RLS) when available,
 * falls back to the anon key for development.
 */
export function createSupabaseClient() {
  if (!config.supabaseUrl) {
    throw new Error(
      "SUPABASE_URL is missing. Check your .env file."
    );
  }

  // Service role key bypasses Row Level Security — required for backend use
  const apiKey = config.supabaseServiceKey || config.supabaseAnonKey;
  if (!apiKey) {
    throw new Error(
      "Supabase API key is missing. Set SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) in your .env file."
    );
  }

  if (!config.supabaseServiceKey) {
    console.warn(
      "[supabase] SUPABASE_SERVICE_KEY is not set — falling back to anon key. " +
      "Inserts may fail if Row Level Security is enabled on your tables."
    );
  }

  return createClient(config.supabaseUrl, apiKey, {
    auth: { persistSession: false },
  });
}
