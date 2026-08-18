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
        "group relative block overflow-hidden rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(0,0,0,0.2)]",
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={title}
        fill
        className={cn(
          "object-cover transition duration-500 group-hover:scale-105 group-hover:blur-[4px] group-hover:brightness-[0.4]",
          imageClassName,
        )}
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-500 group-hover:bg-black/50 group-hover:opacity-100">
        <h3 className="translate-y-5 px-2.5 text-center font-serif text-[2.2rem] font-bold tracking-[3px] text-white uppercase transition duration-500 group-hover:translate-y-0 md:text-5xl">
          {title}
        </h3>
      </div>
    </Link>
  );
}
