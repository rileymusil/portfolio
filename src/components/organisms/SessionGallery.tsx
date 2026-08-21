"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SessionCard } from "@/components/molecules/SessionCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PhotoSession } from "@/lib/sanity/types";

export const GALLERY_DIALOG_ANIMATION_MS = 200;

interface SessionGalleryProps {
  sessions: PhotoSession[];
}

function prefetchImage(url: string): void {
  const image = new window.Image();
  image.decoding = "async";
  image.src = url;
}

export function SessionGallery({ sessions }: SessionGalleryProps) {
  const [activeSession, setActiveSession] = useState<PhotoSession | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [thumbsReady, setThumbsReady] = useState(false);

  const photos = activeSession?.photos ?? [];
  const lightboxPhoto =
    lightboxIndex !== null && photos[lightboxIndex] ? photos[lightboxIndex] : null;
  const galleryOpen = Boolean(activeSession) && lightboxIndex === null;

  function closeLightbox(): void {
    setLightboxIndex(null);
  }

  function navigateLightbox(direction: number): void {
    if (lightboxIndex === null || photos.length === 0) {
      return;
    }
    setLightboxIndex((lightboxIndex + direction + photos.length) % photos.length);
  }

  useEffect(() => {
    if (!galleryOpen) {
      setThumbsReady(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setThumbsReady(true);
    }, GALLERY_DIALOG_ANIMATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [galleryOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (lightboxIndex === null) {
        return;
      }
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? current : (current - 1 + photos.length) % photos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? current : (current + 1) % photos.length,
        );
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, photos.length]);

  useEffect(() => {
    if (lightboxIndex === null || photos.length < 2) {
      return;
    }

    const next = photos[(lightboxIndex + 1) % photos.length];
    const previous = photos[(lightboxIndex - 1 + photos.length) % photos.length];
    if (next) {
      prefetchImage(next.fullUrl);
    }
    if (previous && previous !== next) {
      prefetchImage(previous.fullUrl);
    }
  }, [lightboxIndex, photos]);

  if (sessions.length === 0) {
    return (
      <p className="col-span-full py-12 text-center font-sans text-[#888]">
        No photos yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            title={session.title}
            coverUrl={session.cover.coverUrl}
            blurDataUrl={session.cover.lqip}
            photoCount={session.photos.length}
            onOpen={() => setActiveSession(session)}
          />
        ))}
      </div>

      <Dialog
        open={galleryOpen}
        onOpenChange={(open) => {
          if (!open) {
            setActiveSession(null);
          }
        }}
      >
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-[1.5rem]">
              {activeSession?.title}
            </DialogTitle>
            {activeSession?.description ? (
              <DialogDescription>{activeSession.description}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                Session gallery
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <button
                key={`${photo.thumbUrl}-${index}`}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="relative aspect-square overflow-hidden rounded-md bg-[#e8ecef]"
                aria-label={`${activeSession?.title} photo ${index + 1}`}
              >
                {thumbsReady ? (
                  <Image
                    src={photo.thumbUrl}
                    alt={photo.alt}
                    fill
                    decoding="async"
                    className="object-cover transition hover:scale-110"
                    sizes="150px"
                    placeholder={photo.lqip ? "blur" : "empty"}
                    blurDataURL={photo.lqip}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {lightboxPhoto ? (
        <div
          className="fixed inset-0 z-[9500] flex items-center justify-center bg-[rgba(10,14,18,0.97)]"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close photo viewer"
            onClick={closeLightbox}
          />
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-6 z-2 flex size-[42px] items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
          <div className="relative z-1 flex w-[92vw] max-w-[1400px] items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigateLightbox(-1)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#ddd] bg-white text-[#333] hover:bg-brand-mid hover:text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="relative max-h-[84vh] min-w-0 flex-1">
              <img
                src={lightboxPhoto.fullUrl}
                alt={lightboxPhoto.alt}
                decoding="async"
                className="mx-auto max-h-[84vh] max-w-full rounded-md object-contain shadow-2xl"
              />
            </div>
            <button
              type="button"
              onClick={() => navigateLightbox(1)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#ddd] bg-white text-[#333] hover:bg-brand-mid hover:text-white"
              aria-label="Next photo"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <p className="absolute bottom-6 font-sans text-white">
            {(lightboxIndex ?? 0) + 1} / {photos.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
