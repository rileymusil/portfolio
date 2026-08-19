import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/organisms/PageBanner";
import { SessionGallery } from "@/components/organisms/SessionGallery";
import { MarketingLayout } from "@/components/templates/MarketingLayout";
import {
  getPhotoCategoryMeta,
  isPhotoCategory,
  PHOTO_CATEGORIES,
} from "@/lib/photography";
import { getPhotoSessions } from "@/lib/sanity/queries";

interface PhotographyCategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams(): Array<{ category: string }> {
  return PHOTO_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PhotographyCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isPhotoCategory(category)) {
    return { title: "Photography" };
  }
  const meta = getPhotoCategoryMeta(category);
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function PhotographyCategoryPage({
  params,
}: PhotographyCategoryPageProps) {
  const { category } = await params;
  if (!isPhotoCategory(category)) {
    notFound();
  }

  const meta = getPhotoCategoryMeta(category);
  // Fetched during the build so the covers are in the static HTML: the browser
  // can start them from the preload scanner instead of waiting on hydration.
  const sessions = await getPhotoSessions(category);

  return (
    <MarketingLayout>
      <PageBanner
        title={meta.title}
        subtitle={meta.description}
        backHref="/photography"
        backLabel="All photography"
      />
      <div className="mx-auto max-w-[1200px] px-5 py-10 md:py-16">
        <SessionGallery sessions={sessions} />
      </div>
    </MarketingLayout>
  );
}
