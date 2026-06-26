import { listPredictions } from "@/lib/supabase/admin-data";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createPrediction, deletePrediction } from "@/app/admin/(dashboard)/content-actions";
import { formatDateTime } from "@/lib/utils";

export default async function AdminPredictionsPage() {
  if (!isSupabaseAdminConfigured) {
    return (
      <section className="admin-page">
        <h1>Predictions</h1>
        <div className="admin-notice admin-notice--warning">Supabase is not configured.</div>
      </section>
    );
  }

  const predictions = await listPredictions();

  return (
    <section className="admin-page">
      <h1>Match predictions</h1>

      <form action={createPrediction} className="admin-card admin-card--new">
        <h2>Add fixture</h2>
        <label className="admin-field">
          <span>Match label</span>
          <input name="matchLabel" required placeholder="Premier League · Matchweek 5" />
        </label>
        <div className="admin-field-row">
          <label className="admin-field">
            <span>Home team</span>
            <input name="homeTeam" required />
          </label>
          <label className="admin-field">
            <span>Away team</span>
            <input name="awayTeam" required />
          </label>
        </div>
        <label className="admin-field">
          <span>Kickoff (optional)</span>
          <input name="kickoffAt" type="datetime-local" />
        </label>
        <button type="submit" className="button button--primary">
          Add fixture
        </button>
      </form>

      <div className="admin-list">
        {predictions.map((prediction) => (
          <article key={prediction.id} className="admin-card">
            <div className="admin-card__header">
              <h3>
                {prediction.homeTeam} vs {prediction.awayTeam}
              </h3>
              <span className={`admin-badge${prediction.isActive ? " admin-badge--on" : ""}`}>
                {prediction.isActive ? "Active" : "Closed"}
              </span>
            </div>
            <p className="admin-muted">{prediction.matchLabel}</p>
            {prediction.kickoffAt ? (
              <p className="admin-muted">{formatDateTime(prediction.kickoffAt)}</p>
            ) : null}
            <form action={deletePrediction} className="admin-card__actions">
              <input type="hidden" name="id" value={prediction.id} />
              <button type="submit" className="button button--ghost">
                Delete
              </button>
            </form>
          </article>
        ))}
        {predictions.length === 0 ? <p className="admin-muted">No fixtures yet.</p> : null}
      </div>
    </section>
  );
}
