"use client";

import { useState } from "react";
import Image from "next/image";

interface PlayerAvatarProps {
  src: string;
  name: string;
  size?: number;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Player headshot with a graceful initials fallback when the image fails to load. */
export function PlayerAvatar({ src, name, size = 40 }: PlayerAvatarProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <span
        className="tr-avatar tr-avatar--fallback"
        style={{ width: size, height: size, fontSize: size * 0.36 }}
        role="img"
        aria-label={name}
      >
        {initialsOf(name)}
      </span>
    );
  }

  return (
    <span className="tr-avatar" style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={`${name} headshot`}
        fill
        sizes={`${size}px`}
        style={{ objectFit: "cover" }}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
