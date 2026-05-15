interface ArticleBodyProps {
  html: string;
}

export function ArticleBody({ html }: ArticleBodyProps) {
  return <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
