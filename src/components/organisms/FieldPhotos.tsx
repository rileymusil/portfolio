import Image from "next/image";
import { FadeIn } from "@/components/atoms/FadeIn";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import type { AboutImage } from "@/lib/sanity/types";

interface FieldPhotosProps {
  photos: AboutImage[];
}

export function FieldPhotos({ photos }: FieldPhotosProps) {
  if (!photos.length) {
    return null;
  }

  return (
    <FadeIn delay={0.2}>
      <section>
        <SectionLabel>In The Field</SectionLabel>
        <div className="grid gap-6 sm:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.url}
              className="relative min-h-[240px] overflow-hidden rounded-[10px] bg-[#e8ecef] shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                {...(photo.lqip
                  ? { placeholder: "blur" as const, blurDataURL: photo.lqip }
                  : {})}
              />
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
