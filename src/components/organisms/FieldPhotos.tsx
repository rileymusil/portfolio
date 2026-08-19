import Image from "next/image";
import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { aboutCopy } from "@/lib/about";

export function FieldPhotos() {
  return (
    <FadeIn delay={0.2}>
      <section>
        <SectionLabel>In The Field</SectionLabel>
        <div className="grid gap-6 sm:grid-cols-3">
          {aboutCopy.fieldPhotos.map((photo) => (
            <div
              key={photo.src}
              className="relative min-h-[240px] overflow-hidden rounded-[10px] bg-[#e8ecef] shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
