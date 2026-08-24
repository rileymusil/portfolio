import type { Metadata } from "next";
import { AboutIntro } from "@/components/organisms/AboutIntro";
import { EducationCard } from "@/components/organisms/EducationCard";
import { ExperienceTimeline } from "@/components/organisms/ExperienceTimeline";
import { FieldPhotos } from "@/components/organisms/FieldPhotos";
import { PageBanner } from "@/components/organisms/PageBanner";
import { PersonalCards } from "@/components/organisms/PersonalCards";
import { SkillsGrid } from "@/components/organisms/SkillsGrid";
import { MarketingLayout } from "@/components/templates/MarketingLayout";
import { getAboutPage } from "@/lib/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return {
    title: "About",
    description: about.bannerSubtitle,
  };
}

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <MarketingLayout>
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
    </MarketingLayout>
  );
}
