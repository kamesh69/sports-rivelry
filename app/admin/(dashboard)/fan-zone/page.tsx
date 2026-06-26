import { listFanZoneCards } from "@/lib/supabase/admin-data";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { deleteFanZoneCard, saveFanZoneCard } from "@/app/admin/(dashboard)/content-actions";

const ICON_OPTIONS = ["trophy", "poll", "target", "shield", "star", "flame"];

export default async function AdminFanZonePage() {
  if (!isSupabaseAdminConfigured) {
    return (
      <section className="admin-page">
        <h1>Fan Zone</h1>
        <div className="admin-notice admin-notice--warning">Supabase is not configured.</div>
      </section>
    );
  }

  const cards = await listFanZoneCards();

  return (
    <section className="admin-page">
      <h1>Fan Zone cards</h1>
      <p className="admin-page__lead">
        These cards appear in the &ldquo;Join the Fan Zone&rdquo; block on the homepage.
      </p>

      <div className="admin-grid">
        {cards.map((card) => (
          <form key={card.id} action={saveFanZoneCard} className="admin-card">
            <input type="hidden" name="id" value={card.id} />
            <label className="admin-field">
              <span>Title</span>
              <input name="title" defaultValue={card.title} required />
            </label>
            <label className="admin-field">
              <span>Description</span>
              <textarea name="description" defaultValue={card.description} rows={2} />
            </label>
            <div className="admin-field-row">
              <label className="admin-field">
                <span>Icon</span>
                <select name="icon" defaultValue={card.icon}>
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Order</span>
                <input name="sortOrder" type="number" defaultValue={card.sortOrder} />
              </label>
            </div>
            <label className="admin-field">
              <span>Link (optional)</span>
              <input name="href" defaultValue={card.href ?? ""} placeholder="/newsletters/..." />
            </label>
            <div className="admin-card__actions">
              <button type="submit" className="button button--primary">
                Save
              </button>
              <button
                type="submit"
                formAction={deleteFanZoneCard}
                className="button button--ghost"
              >
                Delete
              </button>
            </div>
          </form>
        ))}

        <form action={saveFanZoneCard} className="admin-card admin-card--new">
          <h2>Add card</h2>
          <label className="admin-field">
            <span>Title</span>
            <input name="title" required />
          </label>
          <label className="admin-field">
            <span>Description</span>
            <textarea name="description" rows={2} />
          </label>
          <div className="admin-field-row">
            <label className="admin-field">
              <span>Icon</span>
              <select name="icon" defaultValue="trophy">
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Order</span>
              <input name="sortOrder" type="number" defaultValue={cards.length} />
            </label>
          </div>
          <label className="admin-field">
            <span>Link (optional)</span>
            <input name="href" placeholder="/newsletters/..." />
          </label>
          <button type="submit" className="button button--primary">
            Add card
          </button>
        </form>
      </div>
    </section>
  );
}
