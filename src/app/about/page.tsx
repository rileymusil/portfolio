import type { Metadata } from "next";
import { AboutContent } from "@/components/organisms/AboutContent";
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
  /* Fetched at build so the page ships with real content; AboutContent then
     refreshes it in the browser, so published edits appear without a rebuild. */
  const about = await getAboutPage();

  return (
    <MarketingLayout>
      <AboutContent initial={about} />
    </MarketingLayout>
  );
}
