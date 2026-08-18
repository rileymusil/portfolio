"use client";

import { useEffect, useState } from "react";
import { SessionGallery } from "@/components/organisms/SessionGallery";
import type { PhotoCategory } from "@/lib/photography";
import { getPhotoSessions } from "@/lib/sanity/queries";
import type { PhotoSession } from "@/lib/sanity/types";

interface LiveSessionGalleryProps {
  category: PhotoCategory;
}

export function LiveSessionGallery({ category }: LiveSessionGalleryProps) {
  const [sessions, setSessions] = useState<PhotoSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSessions(): Promise<void> {
      setError(null);
      setSessions(null);
      try {
        const nextSessions = await getPhotoSessions(category);
        if (!cancelled) {
          setSessions(nextSessions);
        }
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Unknown error";
        console.error(`Failed to load ${category} sessions: ${message}`);
        if (!cancelled) {
          setError("Couldn't load photos right now.");
        }
      }
    }

    void loadSessions();

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (error) {
    return (
      <p role="alert" className="py-12 text-center font-sans text-[#888]">
        {error}
      </p>
    );
  }

  if (sessions === null) {
    return (
      <p role="status" className="py-12 text-center font-sans text-[#888]">
        Loading photos…
      </p>
    );
  }

  return <SessionGallery sessions={sessions} />;
}
