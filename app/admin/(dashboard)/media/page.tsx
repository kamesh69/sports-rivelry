import Image from "next/image";
import { listMedia } from "@/lib/supabase/admin-data";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { deleteMedia, uploadMedia } from "@/app/admin/(dashboard)/content-actions";
import { CopyUrl } from "./copy-url";

function formatBytes(size: number | null) {
  if (!size) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  if (!isSupabaseAdminConfigured) {
    return (
      <section className="admin-page">
        <h1>Media Library</h1>
        <div className="admin-notice admin-notice--warning">Supabase is not configured.</div>
      </section>
    );
  }

  const media = await listMedia();

  return (
    <section className="admin-page">
      <h1>Media library</h1>
      <p className="admin-page__lead">
        Upload images to Supabase storage, then copy the public URL into WordPress or a Fan Zone
        card.
      </p>

      <form action={uploadMedia} className="admin-card admin-card--new admin-upload">
        <label className="admin-field">
          <span>Upload image</span>
          <input type="file" name="file" accept="image/*" required />
        </label>
        <button type="submit" className="button button--primary">
          Upload
        </button>
      </form>

      <div className="admin-media-grid">
        {media.map((item) => (
          <article key={item.name} className="admin-media-item">
            <div className="admin-media-item__thumb">
              <Image src={item.url} alt={item.name} width={320} height={200} unoptimized />
            </div>
            <p className="admin-media-item__name">{item.name}</p>
            <p className="admin-muted">{formatBytes(item.size)}</p>
            <div className="admin-card__actions">
              <CopyUrl url={item.url} />
              <form action={deleteMedia}>
                <input type="hidden" name="name" value={item.name} />
                <button type="submit" className="button button--ghost">
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
        {media.length === 0 ? <p className="admin-muted">No media uploaded yet.</p> : null}
      </div>
    </section>
  );
}
