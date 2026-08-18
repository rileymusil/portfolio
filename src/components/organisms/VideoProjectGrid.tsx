"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VideoThumbCard } from "@/components/molecules/VideoThumbCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VideoProject } from "@/lib/video-projects";

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
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <div className="p-6 md:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm tracking-widest text-[#8a9bb0]">{project.number}</p>
                  <h2 id="video-modal-title" className="font-serif text-2xl">
                    {project.title}
                  </h2>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    aria-label="Previous project"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => navigate(1)}
                    aria-label="Next project"
                  >
                    <ChevronRight />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={close}
                    aria-label="Close"
                  >
                    <X />
                  </Button>
                </div>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
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
              <div
                className="space-y-3 text-sm leading-7 text-[#c5ced6] [&_a]:text-accent [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: project.descriptionHtml }}
              />
              {project.stills?.length ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.stills.map((still) => (
                    <figure key={still.src} className="overflow-hidden rounded-lg">
                      <Image
                        src={still.src}
                        alt={still.alt}
                        width={800}
                        height={500}
                        className="h-auto w-full object-cover"
                      />
                      <figcaption className="mt-2 text-xs tracking-wide text-[#8a9bb0] uppercase">
                        {still.caption}
                      </figcaption>
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
