"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PortableDescription } from "@/components/molecules/PortableDescription";
import { VideoPlayerFrame } from "@/components/molecules/VideoPlayerFrame";
import { VideoThumbCard } from "@/components/molecules/VideoThumbCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VideoProject } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

/* 18px rather than the 16px default: at 16px the chevrons read as smudges
   against the player above them. */
const videoControlBase =
  "size-9 text-[#e8ecf0] [&_svg]:size-[18px] focus-visible:ring-white/60";

const videoControlClass = cn(
  videoControlBase,
  "rounded-lg border border-white/25 bg-white/10 hover:border-white/45 hover:bg-white/20 hover:text-white",
);

/* Dismissing is not stepping through, so close inverts on hover instead of
   brightening, and is a circle rather than a square. */
const closeControlClass = cn(
  videoControlBase,
  "rounded-full border border-white/30 bg-white/15 hover:border-white hover:bg-white hover:text-brand-dark",
);

interface VideoProjectGridProps {
  projects: VideoProject[];
}

export function VideoProjectGrid({ projects }: VideoProjectGridProps) {
  const [index, setIndex] = useState<number | null>(null);
  const project = index !== null ? projects[index] : null;

  function close(): void {
    setIndex(null);
  }

  function navigate(direction: number): void {
    if (index === null) {
      return;
    }
    setIndex((index + direction + projects.length) % projects.length);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((item, itemIndex) => (
          <VideoThumbCard
            key={item.id}
            project={item}
            onOpen={() => setIndex(itemIndex)}
          />
        ))}
      </div>

      {project ? (
        <div
          className="fixed inset-0 z-[9000] flex items-start justify-center overflow-y-auto bg-black/80 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close project"
            onClick={close}
          />
          <div className="relative z-1 my-8 w-full max-w-4xl overflow-hidden rounded-xl bg-[#131f2e] text-[#e8ecf0] shadow-2xl">
            <VideoPlayerFrame embed={project.embed} title={project.title} />
            <div className="p-6 md:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm tracking-widest text-[#8a9bb0]">
                    {project.number}
                  </p>
                  <h2 id="video-modal-title" className="font-serif text-2xl">
                    {project.title}
                  </h2>
                </div>
                {/* These sit on the dark modal, so they carry their own light-on-dark
                    treatment rather than the outline variant's white fill. Stepping
                    through projects and dismissing the modal are different actions, so
                    the two chevrons are grouped as squares and the close is a separate
                    circle, matching the photo lightbox. */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={videoControlClass}
                    onClick={() => navigate(-1)}
                    aria-label="Previous project"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={videoControlClass}
                    onClick={() => navigate(1)}
                    aria-label="Next project"
                  >
                    <ChevronRight />
                  </Button>
                  <span
                    aria-hidden="true"
                    className="mx-1 h-6 w-px bg-white/20"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={closeControlClass}
                    onClick={close}
                    aria-label="Close"
                  >
                    <X />
                  </Button>
                </div>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {project.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="border-white/12 bg-white/5 text-[#8a9bb0]"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
              <a
                href={project.embed.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent mb-4 inline-block text-xs tracking-wide underline underline-offset-4 hover:text-white"
              >
                Watch on {project.embed.label}
              </a>
              <PortableDescription
                value={project.description}
                className="[&_a]:text-accent space-y-3 text-sm leading-7 text-[#c5ced6] [&_a]:underline"
              />
              {project.stills.length ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.stills.map((still) => (
                    <figure
                      key={still.fullUrl}
                      className="overflow-hidden rounded-lg"
                    >
                      <Image
                        src={still.thumbUrl}
                        alt={still.alt}
                        width={800}
                        height={500}
                        className="h-auto w-full object-cover"
                        {...(still.lqip
                          ? {
                              placeholder: "blur" as const,
                              blurDataURL: still.lqip,
                            }
                          : {})}
                      />
                      {still.caption ? (
                        <figcaption className="mt-2 text-xs tracking-wide text-[#8a9bb0] uppercase">
                          {still.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
