"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/images/articles/mlb-clubhouse.svg";

interface NewsImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}

/** Fixed-ratio, lazy-loaded article image with a graceful fallback when the source fails to load. */
export function NewsImage({ src, alt, sizes, priority = false }: NewsImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="nc-image">
      <Image
        src={failed || !src ? FALLBACK_IMAGE : src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: "cover" }}
        loading={priority ? undefined : "lazy"}
        priority={priority}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
