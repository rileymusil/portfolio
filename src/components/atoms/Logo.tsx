import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 text-foreground no-underline min-[681px]:gap-[15px]",
        className,
      )}
    >
      <Image
        src="/MarkRM.png"
        alt="Riley Musil Logo"
        width={800}
        height={800}
        className="block size-[38px] object-contain min-[681px]:size-[50px]"
        priority
      />
      <span className="font-serif text-[1.05rem] leading-none font-bold tracking-[0.5px] min-[681px]:text-[1.4rem]">
        {site.name}
      </span>
    </Link>
  );
}
