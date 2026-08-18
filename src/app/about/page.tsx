import type { Metadata } from "next";
import { AboutIntro } from "@/components/organisms/AboutIntro";
import { EducationCard } from "@/components/organisms/EducationCard";
import { ExperienceTimeline } from "@/components/organisms/ExperienceTimeline";
import { FieldPhotos } from "@/components/organisms/FieldPhotos";
import { PageBanner } from "@/components/organisms/PageBanner";
import { PersonalCards } from "@/components/organisms/PersonalCards";
import { SkillsGrid } from "@/components/organisms/SkillsGrid";
import { MarketingLayout } from "@/components/templates/MarketingLayout";
import { aboutCopy } from "@/lib/about";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.bannerSubtitle,
};

export default function AboutPage() {
  return (
    <MarketingLayout>
      <PageBanner title={aboutCopy.bannerTitle} subtitle={aboutCopy.bannerSubtitle} />
      <div className="mx-auto flex max-w-[1100px] flex-col gap-16 px-[5%] py-12 md:gap-20 md:py-16">
        <AboutIntro />
        <SkillsGrid />
        <ExperienceTimeline />
        <FieldPhotos />
        <EducationCard />
        <PersonalCards />
      </div>
    </MarketingLayout>
  );
}
