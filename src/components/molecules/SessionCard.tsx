import Image from "next/image";

interface SessionCardProps {
  title: string;
  coverUrl: string;
  photoCount: number;
  onOpen: () => void;
  blurDataUrl?: string;
}

export function SessionCard({
  title,
  coverUrl,
  photoCount,
  onOpen,
  blurDataUrl,
}: SessionCardProps) {
  const countLabel = `${photoCount} photo${photoCount === 1 ? "" : "s"}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${title} gallery`}
      className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-[10px] bg-[#e8ecef] text-left shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Image
        src={coverUrl}
        alt={title}
        fill
        decoding="async"
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
        placeholder={blurDataUrl ? "blur" : "empty"}
        blurDataURL={blurDataUrl}
      />
      <div className="absolute inset-x-0 bottom-0 translate-y-[44%] bg-linear-to-t from-brand-dark/95 via-brand-dark/60 to-transparent px-[1.1rem] pt-[1.1rem] pb-[0.9rem] text-white transition duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
        <h3 className="mb-1.5 font-serif text-[1.05rem] leading-snug font-bold">
          {title}
        </h3>
        <div className="flex items-center gap-2 font-sans text-[0.68rem] tracking-[1.5px] text-accent uppercase">
          <span className="inline-block h-px w-[18px] bg-brass" aria-hidden="true" />
          {countLabel}
        </div>
      </div>
    </button>
  );
}
