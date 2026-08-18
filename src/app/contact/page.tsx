import type { Metadata } from "next";
import { ContactCard } from "@/components/organisms/ContactCard";
import { PageBanner } from "@/components/organisms/PageBanner";
import { MarketingLayout } from "@/components/templates/MarketingLayout";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Riley Musil for event coverage, portraits, and post-production.",
};

export default function ContactPage() {
  return (
    <MarketingLayout>
      <PageBanner
        title="Get In Touch"
        subtitle="Let's work together on your next project."
      />
      <section className="flex flex-1 justify-center bg-[#f8f9fa] px-5 pt-16 pb-20">
        <ContactCard />
      </section>
    </MarketingLayout>
  );
}
