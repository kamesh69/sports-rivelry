import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/article-card";

interface HomeHeroProps {
  heroArticle: Article;
  secondaryArticles: Article[];
}

export function HomeHero({ heroArticle, secondaryArticles }: HomeHeroProps) {
  return (
    <section className="hero-grid">
      <div className="hero-grid__lead">
        <ArticleCard article={heroArticle} variant="hero" />
      </div>
      <div className="hero-grid__stack">
        {secondaryArticles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </section>
  );
}
