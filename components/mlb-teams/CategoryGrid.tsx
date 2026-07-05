import type { TeamCategory } from "@/lib/mlb-team-types";
import { CategoryIcon } from "@/components/mlb-teams/CategoryIcons";

interface CategoryGridProps {
  categories: TeamCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function CategoryGrid({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryGridProps) {
  return (
    <section className="td-section" aria-label="Browse categories">
      <div className="td-section-head">
        <h2 className="td-section-title">Browse Categories</h2>
      </div>

      <div className="td-cats__grid" role="list">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="listitem"
            className={`td-cat-card${activeCategory === cat.id ? " td-cat-card--active" : ""}`}
            onClick={() => onCategoryChange(cat.id)}
            aria-pressed={activeCategory === cat.id}
            aria-label={`Filter by ${cat.label}`}
          >
            <span className="td-cat-card__icon" aria-hidden="true">
              <CategoryIcon id={cat.id} />
            </span>
            <span className="td-cat-card__title">{cat.label}</span>
            <span className="td-cat-card__sub">{cat.subtitle}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
