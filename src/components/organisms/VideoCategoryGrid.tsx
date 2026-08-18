import { CategoryCard } from "@/components/molecules/CategoryCard";

export function VideoCategoryGrid() {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-2">
      <CategoryCard
        href="/video/narrative"
        imageSrc="/Narrative.jpg"
        title="Narrative"
        className="mx-auto aspect-square w-full max-w-[520px]"
      />
      <CategoryCard
        href="/video/commercial"
        imageSrc="/Commercial.jpg"
        title="Commercial"
        className="mx-auto aspect-square w-full max-w-[520px]"
      />
    </div>
  );
}
