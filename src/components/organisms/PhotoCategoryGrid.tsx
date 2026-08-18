import { CategoryCard } from "@/components/molecules/CategoryCard";
import { PHOTO_CATEGORIES, getPhotoCategoryMeta } from "@/lib/photography";

export function PhotoCategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {PHOTO_CATEGORIES.map((slug) => {
        const category = getPhotoCategoryMeta(slug);
        return (
          <CategoryCard
            key={slug}
            href={category.href}
            imageSrc={category.coverSrc}
            title={category.shortLabel}
            className="h-[300px] md:h-[535px]"
          />
        );
      })}
    </div>
  );
}
