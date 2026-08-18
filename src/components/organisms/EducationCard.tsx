import { GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { aboutCopy } from "@/lib/about";

export function EducationCard() {
  return (
    <FadeIn delay={0.25}>
      <section>
        <SectionLabel>Education</SectionLabel>
        <div className="flex items-center gap-8 rounded-[10px] bg-white px-10 py-8 shadow-[0_3px_14px_rgba(0,0,0,0.07)] max-md:flex-col max-md:text-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-mid text-white">
            <GraduationCap className="size-[30px]" aria-hidden="true" />
          </div>
          <div>
            <h4 className="mb-1 font-serif text-[1.2rem] text-primary">
              {aboutCopy.education.title}
            </h4>
            <p className="text-[0.9rem] text-[#666]">{aboutCopy.education.school}</p>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
