import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { SkillTag } from "@/components/atoms/SkillTag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { skillGroups } from "@/lib/about";

export function SkillsGrid() {
  return (
    <FadeIn delay={0.1}>
      <section>
        <SectionLabel>Skills &amp; Tools</SectionLabel>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <Card
              key={group.title}
              className="rounded-[10px] border-0 border-t-[3px] border-t-brand-mid py-0 shadow-[0_3px_14px_rgba(0,0,0,0.07)]"
            >
              <CardHeader className="px-6 pt-6">
                <CardTitle className="font-serif text-[0.85rem] tracking-[1.2px] text-primary uppercase">
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5 px-6 pb-6">
                {group.tags.map((tag) => (
                  <SkillTag key={tag}>{tag}</SkillTag>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
