import type { Metadata } from "next";
import { PageBanner } from "@/components/organisms/PageBanner";
import { VideoCategoryGrid } from "@/components/organisms/VideoCategoryGrid";
import { MarketingLayout } from "@/components/templates/MarketingLayout";

export const metadata: Metadata = {
  title: "Video",
  description: "Narrative and commercial video work by Riley Musil.",
};

export default function VideoPage() {
  return (
    <MarketingLayout>
      <PageBanner
        title="Video Portfolio"
        subtitle="Select a category to view projects."
      />
      <div className="mx-auto max-w-[1100px] px-5 py-12 md:py-20">
        <VideoCategoryGrid />
      </div>
    </MarketingLayout>
  );
}
