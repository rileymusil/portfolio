import { ContactBar } from "@/components/organisms/ContactBar";
import { DemoReel } from "@/components/organisms/DemoReel";
import { Hero } from "@/components/organisms/Hero";
import { Synopsis } from "@/components/organisms/Synopsis";
import { MarketingLayout } from "@/components/templates/MarketingLayout";

export default function Home() {
  return (
    <MarketingLayout>
      <Hero />
      <DemoReel />
      <Synopsis />
      <ContactBar />
    </MarketingLayout>
  );
}
