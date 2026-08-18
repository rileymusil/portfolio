import type { Metadata } from "next";
import { BookNowButton } from "@/components/atoms/BookNowButton";
import { PageBanner } from "@/components/organisms/PageBanner";
import { PhotoCategoryGrid } from "@/components/organisms/PhotoCategoryGrid";
import { MarketingLayout } from "@/components/templates/MarketingLayout";

export const metadata: Metadata = {
  title: "Photography",
  description: "Event coverage, portraits, and creative photography by Riley Musil.",
};

export default function PhotographyPage() {
  return (
    <MarketingLayout>
      <PageBanner
        title="Photography Portfolio"
        subtitle="Event coverage, portraits & creative work."
      />
      <div className="mx-auto mt-12 mb-20 max-w-[1400px] px-5">
        <PhotoCategoryGrid />
        <div className="mt-8 text-center">
          <BookNowButton />
        </div>
      </div>
    </MarketingLayout>
  );
}
