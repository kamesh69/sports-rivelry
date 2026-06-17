"use client";

import { useState } from "react";
import { SocialIcon } from "@/components/social-icon";
import { absoluteUrl } from "@/lib/utils";

interface ArticleShareBarProps {
  path: string;
  title: string;
}

export function ArticleShareBar({ path, title }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(path);

  function openShare(target: string) {
    window.open(target, "_blank", "noopener,noreferrer,width=720,height=640");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="article-share-bar" aria-label="Share this article">
      <button
        type="button"
        className="article-share-bar__button"
        onClick={() =>
          openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        }
      >
        <SocialIcon platform="facebook" />
        <span>Facebook</span>
      </button>
      <button
        type="button"
        className="article-share-bar__button"
        onClick={() =>
          openShare(
            `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          )
        }
      >
        <SocialIcon platform="x" />
        <span>X</span>
      </button>
      <button
        type="button"
        className="article-share-bar__button"
        onClick={() =>
          openShare(
            `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          )
        }
      >
        <SocialIcon platform="reddit" />
        <span>Reddit</span>
      </button>
      <button type="button" className="article-share-bar__button" onClick={copyLink}>
        <SocialIcon platform="link" />
        <span>{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
