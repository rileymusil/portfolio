import type { Metadata } from "next";
import { PageBanner } from "@/components/organisms/PageBanner";
import { VideoProjectGrid } from "@/components/organisms/VideoProjectGrid";
import { MarketingLayout } from "@/components/templates/MarketingLayout";
import { narrativeProjects } from "@/lib/video-projects";

export const metadata: Metadata = {
  title: "Narrative Video",
  description: "Narrative films and story-driven projects by Riley Musil.",
};

export default function NarrativeVideoPage() {
  return (
    <MarketingLayout>
      <PageBanner
        title="Narrative Video"
        subtitle="Narrative films and story-driven projects."
        backHref="/video"
        backLabel="All video"
      />
      <div className="bg-brand-navy px-5 py-12 md:px-10 md:py-16">
        <VideoProjectGrid projects={narrativeProjects} />
      </div>
    </MarketingLayout>
  );
}
