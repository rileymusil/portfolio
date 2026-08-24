import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import type { AboutExperienceItem } from "@/lib/sanity/types";

interface ExperienceTimelineProps {
  items: AboutExperienceItem[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  if (!items.length) {
    return null;
  }

  return (
    <FadeIn delay={0.15}>
      <section>
        <SectionLabel>Experience</SectionLabel>
        <div className="flex flex-col">
          {items.map((item, index) => (
            <div
              key={`${item.role}-${item.organization}`}
              className="relative grid gap-4 pb-10 last:pb-0 md:grid-cols-[220px_1fr] md:gap-8"
            >
              {/* The dates column is 220px and the content starts after a 32px
                  gap. The marker and its line sit in the middle of that gutter
                  so a long date like "Sept 2023 – Present", which fills the
                  column to its right edge, can't run into the dot. */}
              <p className="pt-0.5 text-right text-[0.78rem] text-[#999] italic max-md:text-left md:pr-3">
                {item.dates}
              </p>
              {index < items.length - 1 ? (
                <span
                  className="absolute top-2 bottom-0 left-[235px] hidden w-px bg-[#ddd] md:block"
                  aria-hidden="true"
                />
              ) : null}
              <span
                className="absolute top-1.5 left-[230px] hidden size-3 rounded-full border-2 border-white bg-brand-mid shadow-[0_0_0_2px_#2c3e50] md:block"
                aria-hidden="true"
              />
              <div>
                <h4 className="font-serif text-[1.1rem] text-primary">{item.role}</h4>
                <p className="mb-2.5 text-[0.82rem] tracking-widest text-[#888] uppercase">
                  {item.organization}
                </p>
                <ul className="list-disc pl-4">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="mb-0.5 text-[0.9rem] leading-[1.7] text-[#555]">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
