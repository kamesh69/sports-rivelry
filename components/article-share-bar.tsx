"use client";

import { useState } from "react";
import { SocialIcon } from "@/components/social-icon";
import { absoluteUrl } from "@/lib/utils";

interface ArticleShareBarProps {
  path: string;
  title: string;
}

const shareButtons = [
  { platform: "facebook", label: "Share on Facebook", className: "article-share-bar__button--facebook" },
  { platform: "x", label: "Share on X", className: "article-share-bar__button--x" },
  { platform: "reddit", label: "Share on Reddit", className: "article-share-bar__button--reddit" },
  { platform: "link", label: "Copy link", className: "article-share-bar__button--link" },
] as const;

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

  function handleShare(platform: string) {
    if (platform === "facebook") {
      openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
      return;
    }

    if (platform === "x") {
      openShare(
        `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      );
      return;
    }

    if (platform === "reddit") {
      openShare(
        `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      );
      return;
    }

    void copyLink();
  }

  return (
    <div className="article-share-bar" aria-label="Share this article">
      {shareButtons.map((button) => (
        <button
          key={button.platform}
          type="button"
          className={`article-share-bar__button ${button.className}`}
          aria-label={button.platform === "link" && copied ? "Link copied" : button.label}
          onClick={() => handleShare(button.platform)}
        >
          <SocialIcon platform={button.platform} />
        </button>
      ))}
    </div>
  );
}
