export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || "media";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const isSupabaseAdminConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

export function getSupabaseStorageHostname(): string | null {
  if (!SUPABASE_URL) {
    return null;
  }

  try {
    return new URL(SUPABASE_URL).hostname;
  } catch {
    return null;
  }
}
