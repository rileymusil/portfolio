import { CategoryCard } from "@/components/molecules/CategoryCard";
import { getVideoCategoryMeta, VIDEO_CATEGORIES } from "@/lib/video";

export function VideoCategoryGrid() {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-2">
      {VIDEO_CATEGORIES.map((category) => {
        const meta = getVideoCategoryMeta(category);
        return (
          <CategoryCard
            key={meta.slug}
            href={meta.href}
            imageSrc={meta.coverSrc}
            title={meta.shortLabel}
            className="mx-auto aspect-square w-full max-w-[520px]"
          />
        );
      })}
    </div>
  );
}
