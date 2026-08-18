import type { Metadata } from "next";
import { PageBanner } from "@/components/organisms/PageBanner";
import { VideoProjectGrid } from "@/components/organisms/VideoProjectGrid";
import { MarketingLayout } from "@/components/templates/MarketingLayout";
import { commercialProjects } from "@/lib/video-projects";

export const metadata: Metadata = {
  title: "Commercial Video",
  description: "Commercial and promotional video work by Riley Musil.",
};

export default function CommercialVideoPage() {
  return (
    <MarketingLayout>
      <PageBanner
        title="Commercial Video"
        subtitle="Commercial and promotional work."
        backHref="/video"
        backLabel="All video"
      />
      <div className="bg-brand-navy px-5 py-12 md:px-10 md:py-16">
        <VideoProjectGrid projects={commercialProjects} />
      </div>
    </MarketingLayout>
  );
}
