import type { Metadata } from "next";
import { LiveVideoProjectGrid } from "@/components/organisms/LiveVideoProjectGrid";
import { PageBanner } from "@/components/organisms/PageBanner";
import { MarketingLayout } from "@/components/templates/MarketingLayout";
import { pageMetadata } from "@/lib/metadata";
import { getVideoCategoryMeta } from "@/lib/video";

const meta = getVideoCategoryMeta("commercial");

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: meta.href,
});

export default function CommercialVideoPage() {
  return (
    <MarketingLayout>
      <PageBanner
        title={meta.title}
        subtitle={meta.subtitle}
        backHref="/video"
        backLabel="All video"
      />
      <div className="bg-brand-navy px-5 py-12 md:px-10 md:py-16">
        <LiveVideoProjectGrid category="commercial" />
      </div>
    </MarketingLayout>
  );
}
