import Image from "next/image";
import Link from "next/link";
import type { Article, OpinionItem, VideoHighlight } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { SectionHead } from "@/components/sport-page/atoms";

export function MediaRow({
  videos,
  opinions,
  latest,
  viewAllHref,
}: {
  videos: VideoHighlight[];
  opinions: OpinionItem[];
  latest: Article[];
  viewAllHref: string;
}) {
  const featured = videos.find((video) => video.featured) || videos[0];
  const rest = videos.filter((video) => video !== featured);

  return (
    <section className="sp-section" aria-label="Video, opinion and latest news">
      <div className="sp-threecol">
        <div>
          <SectionHead title="Video Highlights" href={viewAllHref} />
          {featured ? (
            <div className="sp-video__main">
              <Image
                src={featured.image.src}
                alt={featured.image.alt}
                fill
                sizes="(max-width: 1080px) 100vw, 44vw"
                style={{ objectFit: "cover" }}
              />
              <span className="sp-play" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <div className="sp-video__caption">
                <h4>{featured.title}</h4>
                <span>{featured.duration}</span>
              </div>
            </div>
          ) : null}
          <div className="sp-videolist">
            {rest.map((video) => (
              <div key={video.title} className="sp-videoitem">
                <div className="sp-videoitem__thumb">
                  <Image
                    src={video.image.src}
                    alt={video.image.alt}
                    fill
                    sizes="90px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h5>{video.title}</h5>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHead title="Opinion & Analysis" />
          <div className="sp-opinion-list">
            {opinions.map((opinion) => (
              <article key={opinion.title} className="sp-opinion">
                <span className="sp-avatar">{opinion.monogram}</span>
                <div className="sp-opinion__body">
                  <h5>{opinion.title}</h5>
                  <span>By {opinion.author}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <SectionHead title="Latest News" href={viewAllHref} />
          <div className="sp-newslist">
            {latest.map((article) => (
              <Link
                key={article.id}
                href={`/${article.sport.slug}/${article.slug}`}
                className="sp-newsitem"
              >
                <span className="sp-newsitem__tag">
                  {article.league?.name || article.sport.name}
                </span>
                <h5>{article.title}</h5>
                <time>{formatRelativeTime(article.publishedAt)}</time>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
