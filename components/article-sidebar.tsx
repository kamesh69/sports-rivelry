import type { Article } from "@/lib/types";
import { ArticleNextStory } from "@/components/article-next-story";
import { ArticleRecommended } from "@/components/article-recommended";

interface ArticleSidebarProps {
  nextStory?: Article;
  recommended: Article[];
}

export function ArticleSidebar({ nextStory, recommended }: ArticleSidebarProps) {
  if (!nextStory && !recommended.length) {
    return null;
  }

  return (
    <aside className="article-page__sidebar" aria-label="Related stories">
      <ArticleNextStory article={nextStory} />
      <ArticleRecommended articles={recommended} />
    </aside>
  );
}
