import { listPolls } from "@/lib/supabase/admin-data";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createPoll, deletePoll, setPollActive } from "@/app/admin/(dashboard)/content-actions";

export default async function AdminPollsPage() {
  if (!isSupabaseAdminConfigured) {
    return (
      <section className="admin-page">
        <h1>Polls</h1>
        <div className="admin-notice admin-notice--warning">Supabase is not configured.</div>
      </section>
    );
  }

  const polls = await listPolls();

  return (
    <section className="admin-page">
      <h1>Fan polls</h1>

      <form action={createPoll} className="admin-card admin-card--new">
        <h2>Create poll</h2>
        <label className="admin-field">
          <span>Question</span>
          <input name="question" required />
        </label>
        <label className="admin-field">
          <span>Options (one per line, min 2)</span>
          <textarea name="options" rows={4} required placeholder={"Team A\nTeam B"} />
        </label>
        <button type="submit" className="button button--primary">
          Create poll
        </button>
      </form>

      <div className="admin-list">
        {polls.map((poll) => {
          const total = poll.options.reduce((sum, option) => sum + option.votes, 0);

          return (
            <article key={poll.id} className="admin-card">
              <div className="admin-card__header">
                <h3>{poll.question}</h3>
                <span className={`admin-badge${poll.isActive ? " admin-badge--on" : ""}`}>
                  {poll.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <ul className="admin-poll-results">
                {poll.options.map((option) => {
                  const pct = total ? Math.round((option.votes / total) * 100) : 0;
                  return (
                    <li key={option.id}>
                      <span>{option.label}</span>
                      <span className="admin-poll-results__bar">
                        <span style={{ width: `${pct}%` }} />
                      </span>
                      <span className="admin-poll-results__count">
                        {option.votes} ({pct}%)
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="admin-muted">{total} total votes</p>
              <div className="admin-card__actions">
                <form action={setPollActive}>
                  <input type="hidden" name="id" value={poll.id} />
                  <input type="hidden" name="isActive" value={poll.isActive ? "false" : "true"} />
                  <button type="submit" className="button button--ghost">
                    {poll.isActive ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <form action={deletePoll}>
                  <input type="hidden" name="id" value={poll.id} />
                  <button type="submit" className="button button--ghost">
                    Delete
                  </button>
                </form>
              </div>
            </article>
          );
        })}
        {polls.length === 0 ? <p className="admin-muted">No polls yet.</p> : null}
      </div>
    </section>
  );
}
