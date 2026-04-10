export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export const missingCredentialsError =
  "Missing Supabase server credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.";
