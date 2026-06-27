import Link from "next/link";
import type { Article } from "@/lib/types";

interface ArticleTopicsProps {
  article: Article;
}

export function ArticleTopics({ article }: ArticleTopicsProps) {
  const seenLabels = new Set<string>();
  const topics: { label: string; href: string }[] = [];

  const addTopic = (label: string, href: string) => {
    if (!seenLabels.has(label)) {
      seenLabels.add(label);
      topics.push({ label, href });
    }
  };

  addTopic(article.league?.name ?? article.sport.name, `/${article.sport.slug}`);

  for (const tag of article.tags) {
    addTopic(tag, `/search?q=${encodeURIComponent(tag)}`);
  }

  if (!topics.length) {
    return null;
  }

  return (
    <div className="article-topics">
      <span className="article-topics__label">Topics:</span>
      <div className="article-topics__links">
        {topics.map((topic) => (
          <Link key={topic.label} href={topic.href}>
            {topic.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
