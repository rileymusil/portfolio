import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { aboutCopy } from "@/lib/about";

export function PersonalCards() {
  return (
    <FadeIn delay={0.3}>
      <section>
        <SectionLabel>Personal</SectionLabel>
        <div className="grid gap-8 md:grid-cols-2">
          <article className="rounded-[10px] bg-white px-8 py-7 shadow-[0_3px_14px_rgba(0,0,0,0.07)]">
            <h4 className="mb-4 border-b border-[#eee] pb-2.5 font-serif text-base tracking-widest text-primary uppercase">
              Honors &amp; Activities
            </h4>
            <ul className="list-disc pl-4">
              {aboutCopy.honors.map((item) => (
                <li key={item} className="mb-1 text-[0.9rem] leading-[1.7] text-[#555]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[10px] bg-white px-8 py-7 shadow-[0_3px_14px_rgba(0,0,0,0.07)]">
            <h4 className="mb-4 border-b border-[#eee] pb-2.5 font-serif text-base tracking-widest text-primary uppercase">
              Hobbies &amp; Interests
            </h4>
            <ul className="list-disc pl-4">
              {aboutCopy.hobbies.map((item) => (
                <li key={item} className="mb-1 text-[0.9rem] leading-[1.7] text-[#555]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </FadeIn>
  );
}
