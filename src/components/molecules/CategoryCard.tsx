import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  href: string;
  imageSrc: string;
  title: string;
  className?: string;
  imageClassName?: string;
}

export function CategoryCard({
  href,
  imageSrc,
  title,
  className,
  imageClassName,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group @container relative block overflow-hidden rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(0,0,0,0.2)]",
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={title}
        fill
        className={cn(
          "can-hover:group-hover:scale-105 can-hover:group-hover:blur-[4px] can-hover:group-hover:brightness-[0.4] object-cover transition duration-500",
          imageClassName,
        )}
        sizes="(max-width: 768px) 100vw, 33vw"
        unoptimized
      />
      {/* Touch devices keep the title permanently visible over a scrim; pointer
          devices start clean and reveal it on hover. */}
      <div className="can-hover:bg-black/0 can-hover:opacity-0 can-hover:group-hover:bg-black/50 can-hover:group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/45 opacity-100 transition duration-500">
        <h3 className="can-hover:translate-y-5 can-hover:drop-shadow-none can-hover:group-hover:translate-y-0 max-w-full px-4 text-center font-serif text-[clamp(1.1rem,11cqi,3rem)] leading-tight font-bold tracking-[0.08em] text-balance break-words text-white uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] transition duration-500">
          {title}
        </h3>
      </div>
    </Link>
  );
}
