import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

let cached: SupabaseClient | null = null;

/**
 * Server-only client. Use SUPABASE_SERVICE_ROLE_KEY in Vercel env (never NEXT_PUBLIC_*).
 * For anon + RLS instead, use createAnonClient and adjust policies in Supabase.
 */
export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }
  if (!cached) {
    cached = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
};
