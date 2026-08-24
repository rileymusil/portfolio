"use client";

import { useEffect, useState } from "react";
import { AboutIntro } from "@/components/organisms/AboutIntro";
import { EducationCard } from "@/components/organisms/EducationCard";
import { ExperienceTimeline } from "@/components/organisms/ExperienceTimeline";
import { FieldPhotos } from "@/components/organisms/FieldPhotos";
import { PageBanner } from "@/components/organisms/PageBanner";
import { PersonalCards } from "@/components/organisms/PersonalCards";
import { SkillsGrid } from "@/components/organisms/SkillsGrid";
import { getAboutPage } from "@/lib/sanity/queries";
import type { AboutPage } from "@/lib/sanity/types";

interface AboutContentProps {
  initial: AboutPage;
}

/* The page is prerendered with `initial`, fetched from Sanity at build time, so
   the first paint is real content rather than a spinner and the meta
   description is filled in. Then it re-fetches here and swaps in anything
   published since that build — which is what removes the need for a rebuild
   (or a webhook to trigger one) after an edit. */
export function AboutContent({ initial }: AboutContentProps) {
  const [about, setAbout] = useState<AboutPage>(initial);

  useEffect(() => {
    let cancelled = false;

    async function refresh(): Promise<void> {
      try {
        const latest = await getAboutPage();
        /* Only re-render when something actually changed, so the usual case —
           the build is already current — costs nothing. */
        if (!cancelled && JSON.stringify(latest) !== JSON.stringify(initial)) {
          setAbout(latest);
        }
      } catch (caught) {
        /* The prerendered copy is already on screen and is still valid, so a
           failed refresh is not worth showing the visitor an error over. */
        const message =
          caught instanceof Error ? caught.message : "Unknown error";
        console.error(`Failed to refresh the About page: ${message}`);
      }
    }

    void refresh();

    return () => {
      cancelled = true;
    };
  }, [initial]);

  return (
    <>
      <PageBanner title={about.bannerTitle} subtitle={about.bannerSubtitle} />
      <div className="mx-auto flex max-w-[1100px] flex-col gap-16 px-[5%] py-12 md:gap-20 md:py-16">
        <AboutIntro
          headshot={about.headshot}
          role={about.role}
          intro={about.intro}
        />
        <SkillsGrid groups={about.skillGroups} />
        <ExperienceTimeline items={about.experience} />
        <FieldPhotos photos={about.fieldPhotos} />
        <EducationCard education={about.education} />
        <PersonalCards honors={about.honors} hobbies={about.hobbies} />
      </div>
    </>
  );
}
