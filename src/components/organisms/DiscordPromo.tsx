import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Sits under the ContactCard on the contact page as its own tile, matching that
 * card's radius and shadow so the two read as one stack.
 */
export function DiscordPromo() {
  return (
    <section
      aria-labelledby="discord-promo-title"
      className="flex w-full max-w-[840px] min-w-0 flex-col items-center gap-5 rounded-[14px] bg-white px-8 py-7 text-center shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_64px_rgba(0,0,0,0.16)] max-[680px]:px-6 min-[621px]:flex-row min-[621px]:gap-6 min-[621px]:text-left"
    >
      <Image
        src="/HTXFilmmakersLounge.png"
        alt=""
        width={128}
        height={128}
        className="size-16 shrink-0 rounded-[14px] shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-sans text-[0.72rem] tracking-[1.5px] text-[#aaa] uppercase">
          Community
        </p>
        <h2
          id="discord-promo-title"
          className="text-brand-mid mb-1.5 font-serif text-[1.25rem] leading-tight font-bold tracking-normal"
        >
          {site.discordName}
        </h2>
        <p className="m-0 text-[0.9rem] leading-relaxed text-[#666]">
          A Discord I run for Houston filmmakers and creative professionals
          &mdash; meet local crew, share your work, and hear about paid gigs as
          they come up.
        </p>
      </div>
      <a
        href={site.discordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex shrink-0 items-center justify-center rounded-full border-2 bg-white px-6 py-2.5 font-semibold whitespace-nowrap transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Join the Discord
      </a>
    </section>
  );
}
