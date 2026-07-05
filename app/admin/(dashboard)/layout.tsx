import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";
import { signOutAction } from "@/app/admin/actions";
import { AdminNav } from "./admin-nav";

export const metadata: Metadata = {
  title: "Admin | The Sports Rivalry",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdmin();
  const isPending = session.role === "pending";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-sidebar__brand">
          The Sports Rivalry
          <span>Admin</span>
        </Link>
        <AdminNav />
        <div className="admin-sidebar__footer">
          <p className="admin-sidebar__user">{session.email}</p>
          <form action={signOutAction}>
            <button type="submit" className="admin-sidebar__signout">
              Sign out
            </button>
          </form>
          <Link href="/" className="admin-sidebar__view-site">
            View site →
          </Link>
        </div>
      </aside>
      <div className="admin-main">
        {isPending ? (
          <div className="admin-notice admin-notice--warning">
            Your account is signed in but not yet an admin. Add a row to{" "}
            <code>admin_profiles</code> with your user id to unlock editing.
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
