import Image from "next/image";
import type { MediaAsset } from "@/lib/types";
import { ArticleShareBar } from "@/components/article-share-bar";

interface ArticleHeroImageProps {
  image: MediaAsset;
  sharePath?: string;
  shareTitle?: string;
}

export function ArticleHeroImage({ image, sharePath, shareTitle }: ArticleHeroImageProps) {
  return (
    <figure className="article-hero-image">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority
        className="article-hero-image__img"
        sizes="(max-width: 768px) 100vw, 900px"
      />
      {sharePath && shareTitle ? (
        <div className="article-hero-image__share">
          <ArticleShareBar path={sharePath} title={shareTitle} />
        </div>
      ) : null}
      {image.credit ? (
        <figcaption className="article-hero-image__credit">
          Image credit: {image.credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
