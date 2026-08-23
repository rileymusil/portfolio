import type { Metadata } from "next";
import { LiveVideoProjectGrid } from "@/components/organisms/LiveVideoProjectGrid";
import { PageBanner } from "@/components/organisms/PageBanner";
import { MarketingLayout } from "@/components/templates/MarketingLayout";
import { getVideoCategoryMeta } from "@/lib/video";

const meta = getVideoCategoryMeta("narrative");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

export default function NarrativeVideoPage() {
  return (
    <MarketingLayout>
      <PageBanner
        title={meta.title}
        subtitle={meta.subtitle}
        backHref="/video"
        backLabel="All video"
      />
      <div className="bg-brand-navy px-5 py-12 md:px-10 md:py-16">
        <LiveVideoProjectGrid category="narrative" />
      </div>
    </MarketingLayout>
  );
}
