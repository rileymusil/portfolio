"use client";

import { useEffect, useState } from "react";
import { VideoProjectGrid } from "@/components/organisms/VideoProjectGrid";
import { getVideoProjects } from "@/lib/sanity/queries";
import type { VideoProject } from "@/lib/sanity/types";
import type { VideoCategory } from "@/lib/video";

interface LiveVideoProjectGridProps {
  category: VideoCategory;
}

export function LiveVideoProjectGrid({ category }: LiveVideoProjectGridProps) {
  const [projects, setProjects] = useState<VideoProject[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects(): Promise<void> {
      setError(null);
      setProjects(null);
      try {
        const nextProjects = await getVideoProjects(category);
        if (!cancelled) {
          setProjects(nextProjects);
        }
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Unknown error";
        console.error(`Failed to load ${category} video projects: ${message}`);
        if (!cancelled) {
          setError("Couldn't load these projects right now.");
        }
      }
    }

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (error) {
    return (
      <p role="alert" className="py-12 text-center font-sans text-[#8a9bb0]">
        {error}
      </p>
    );
  }

  if (projects === null) {
    return (
      <p role="status" className="py-12 text-center font-sans text-[#8a9bb0]">
        Loading projects…
      </p>
    );
  }

  if (!projects.length) {
    return (
      <p className="py-12 text-center font-sans text-[#8a9bb0]">
        No projects here yet — check back soon.
      </p>
    );
  }

  return <VideoProjectGrid projects={projects} />;
}
