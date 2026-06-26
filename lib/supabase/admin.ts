import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/config";

/**
 * Service-role client for privileged server-side writes (admin panel only).
 * Never import this in client components.
 */
export function createSupabaseAdminClient() {
  if (!isSupabaseAdminConfigured) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
