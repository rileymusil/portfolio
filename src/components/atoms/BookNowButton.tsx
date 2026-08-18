import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface BookNowButtonProps {
  className?: string;
}

export function BookNowButton({ className }: BookNowButtonProps) {
  return (
    <a
      href={site.bookNowUrl}
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 border-primary bg-white px-7 py-3 font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-lg",
        className,
      )}
    >
      Book Now
    </a>
  );
}
