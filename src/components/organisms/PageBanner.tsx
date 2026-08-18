import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function PageBanner({
  title,
  subtitle,
  backHref,
  backLabel,
  className,
}: PageBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-brand-mid px-8 pt-16 pb-12 text-center text-white",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_40px,rgba(255,255,255,0.02)_40px,rgba(255,255,255,0.02)_80px)]"
        aria-hidden="true"
      />
      <h1 className="relative mb-2 font-serif text-[2.2rem] leading-tight font-bold tracking-normal min-[681px]:text-[3rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="relative m-0 font-serif text-[1.1rem] text-accent italic">
          {subtitle}
        </p>
      ) : null}
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className="relative mt-4 inline-block rounded border-2 border-white px-6 py-2 text-sm text-white transition hover:bg-white hover:text-brand-mid"
        >
          {backLabel}
        </Link>
      ) : null}
    </div>
  );
}
