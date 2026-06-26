import { listSubscribers } from "@/lib/supabase/admin-data";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { formatDateTime } from "@/lib/utils";

export default async function AdminSubscribersPage() {
  if (!isSupabaseAdminConfigured) {
    return (
      <section className="admin-page">
        <h1>Subscribers</h1>
        <div className="admin-notice admin-notice--warning">Supabase is not configured.</div>
      </section>
    );
  }

  const subscribers = await listSubscribers();

  return (
    <section className="admin-page">
      <h1>Newsletter subscribers</h1>
      <p className="admin-page__lead">{subscribers.length} total subscribers.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Source</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id}>
              <td>{subscriber.email}</td>
              <td>{subscriber.source}</td>
              <td>{formatDateTime(subscriber.createdAt)}</td>
            </tr>
          ))}
          {subscribers.length === 0 ? (
            <tr>
              <td colSpan={3} className="admin-muted">
                No subscribers yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
