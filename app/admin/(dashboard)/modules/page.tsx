import { listHomeModules } from "@/lib/supabase/admin-data";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { toggleHomeModule, updateModuleOrder } from "@/app/admin/(dashboard)/content-actions";

export default async function AdminModulesPage() {
  if (!isSupabaseAdminConfigured) {
    return (
      <section className="admin-page">
        <h1>Homepage Modules</h1>
        <div className="admin-notice admin-notice--warning">Supabase is not configured.</div>
      </section>
    );
  }

  const modules = await listHomeModules();

  return (
    <section className="admin-page">
      <h1>Homepage modules</h1>
      <p className="admin-page__lead">
        Toggle visibility and order of the homepage sections.
      </p>

      <div className="admin-list">
        {modules.map((module) => (
          <article key={module.id} className="admin-card admin-card--row">
            <div>
              <h3>{module.title}</h3>
              <p className="admin-muted">{module.key}</p>
            </div>
            <div className="admin-card__actions">
              <form action={updateModuleOrder} className="admin-inline-form">
                <input type="hidden" name="id" value={module.id} />
                <label className="admin-field admin-field--inline">
                  <span>Order</span>
                  <input name="sortOrder" type="number" defaultValue={module.sortOrder} />
                </label>
                <button type="submit" className="button button--ghost">
                  Save
                </button>
              </form>
              <form action={toggleHomeModule}>
                <input type="hidden" name="id" value={module.id} />
                <input
                  type="hidden"
                  name="isEnabled"
                  value={module.isEnabled ? "false" : "true"}
                />
                <button type="submit" className="button button--ghost">
                  {module.isEnabled ? "Disable" : "Enable"}
                </button>
              </form>
              <span className={`admin-badge${module.isEnabled ? " admin-badge--on" : ""}`}>
                {module.isEnabled ? "Visible" : "Hidden"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
