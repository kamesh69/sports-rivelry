import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin Login | Sports Rivalry",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <p className="admin-auth__brand">Sports Rivalry</p>
        <h1>Admin sign in</h1>
        <p className="admin-auth__hint">
          Manage the Fan Zone, polls, media library, and homepage modules.
        </p>
        {isSupabaseConfigured ? (
          <LoginForm redirectTo={redirectTo || "/admin"} />
        ) : (
          <p className="admin-auth__warning">
            Supabase is not configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code>, then run the
            SQL migration in <code>supabase/migrations</code>.
          </p>
        )}
      </div>
    </div>
  );
}
