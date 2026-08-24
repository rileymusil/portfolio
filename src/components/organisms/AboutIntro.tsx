import Image from "next/image";
import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { PortableDescription } from "@/components/molecules/PortableDescription";
import type { AboutPage } from "@/lib/sanity/types";
import { site } from "@/lib/site";

interface AboutIntroProps {
  headshot: AboutPage["headshot"];
  role: string;
  intro: AboutPage["intro"];
}

export function AboutIntro({ headshot, role, intro }: AboutIntroProps) {
  return (
    <FadeIn>
      <section>
        <SectionLabel>Who I Am</SectionLabel>
        <div className="grid items-start gap-12 md:grid-cols-[320px_1fr]">
          <div className="relative min-h-[380px] overflow-hidden rounded-[10px] bg-[#e8ecef] shadow-[0_8px_28px_rgba(0,0,0,0.1)]">
            <Image
              src={headshot.url}
              alt={headshot.alt || site.name}
              fill
              className="object-cover"
              sizes="320px"
              {...(headshot.lqip
                ? { placeholder: "blur" as const, blurDataURL: headshot.lqip }
                : {})}
            />
          </div>
          <div>
            <h3 className="mb-2 font-serif text-[2rem] text-primary">{site.name}</h3>
            {role ? (
              <span className="mb-6 inline-block rounded-full bg-brand-mid px-3.5 py-1 text-[0.78rem] tracking-[1.5px] text-white uppercase">
                {role}
              </span>
            ) : null}
            <PortableDescription
              value={intro}
              className="[&_a]:text-primary [&_a]:underline [&_p]:mb-4 [&_p]:leading-[1.8] [&_p]:text-[#555]"
            />
            <p className="mt-2 font-semibold text-primary">
              <a href={`mailto:${site.email}`} className="mr-4">
                {site.email}
              </a>
              <a href={site.phoneHref} className="mr-4">
                {site.phoneDisplay}
              </a>
              <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </p>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
