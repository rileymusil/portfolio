"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { VideoProject } from "@/lib/sanity/types";

interface VideoThumbCardProps {
  project: VideoProject;
  onOpen: () => void;
}

export function VideoThumbCard({ project, onOpen }: VideoThumbCardProps) {
  const { thumbnailUrl, thumbnailLqip, embed } = project;
  /* A platform thumbnail can 404 — a Google Drive file that is not shared with
     "anyone with the link" is the common case — and a broken image icon looks
     worse than no image, so fall back to the branded tile instead. */
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = Boolean(thumbnailUrl) && !thumbnailFailed;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${project.title}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-[#131f2e] text-left shadow-lg transition hover:-translate-y-1"
    >
      {/* Cards stay 16:9 whatever the video's own aspect, so a vertical TikTok
          next to a landscape short film does not make the grid ragged. */}
      <div className="relative aspect-video overflow-hidden">
        {showThumbnail && thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setThumbnailFailed(true)}
            {...(thumbnailLqip
              ? { placeholder: "blur" as const, blurDataURL: thumbnailLqip }
              : {})}
          />
        ) : (
          /* Vimeo, Facebook, Instagram, and TikTok serve no thumbnail without an
             API key, so a project with no uploaded cover gets a branded tile
             rather than an empty box. */
          <div className="absolute inset-0 flex items-end justify-start bg-[linear-gradient(135deg,#18293c,#0d1622)] p-4">
            <span className="font-serif text-sm tracking-widest text-white/50 uppercase">
              {embed.label}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/40" />
        <span className="absolute top-3 left-3 font-serif text-sm tracking-widest text-white/80">
          {project.number}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-brand-dark flex size-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 size-6 fill-current"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h3 className="font-serif text-lg text-[#e8ecf0]">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          {project.badges.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className="border-white/12 bg-white/5 text-[0.7rem] tracking-wide text-[#8a9bb0] uppercase"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  );
}
