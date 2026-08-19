import Image from "next/image";
import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { aboutCopy } from "@/lib/about";
import { site } from "@/lib/site";

export function AboutIntro() {
  return (
    <FadeIn>
      <section>
        <SectionLabel>Who I Am</SectionLabel>
        <div className="grid items-start gap-12 md:grid-cols-[320px_1fr]">
          <div className="relative min-h-[380px] overflow-hidden rounded-[10px] bg-[#e8ecef] shadow-[0_8px_28px_rgba(0,0,0,0.1)]">
            <Image
              src="/AboutPageHeadshot.jpg"
              alt={site.name}
              fill
              className="object-cover"
              sizes="320px"
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-primary mb-2 font-serif text-[2rem]">
              {site.name}
            </h3>
            <span className="bg-brand-mid mb-6 inline-block rounded-full px-3.5 py-1 text-[0.78rem] tracking-[1.5px] text-white uppercase">
              {aboutCopy.role}
            </span>
            {aboutCopy.intro.map((paragraph) => (
              <p key={paragraph} className="mb-4 leading-[1.8] text-[#555]">
                {paragraph}
              </p>
            ))}
            <p className="text-primary mt-2 font-semibold">
              <a href={`mailto:${site.email}`} className="mr-4">
                {site.email}
              </a>
              <a href={site.phoneHref} className="mr-4">
                {site.phoneDisplay}
              </a>
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </p>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
