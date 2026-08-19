import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] fill-white"
      aria-hidden="true"
    >
      <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] fill-white"
      aria-hidden="true"
    >
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] fill-white"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[15px] fill-current"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[15px] fill-current"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.756 0 8.333.014 7.053.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.81 2.257 6.09 2.243 6.513 2.243 9.757v4.486c0 3.244.014 3.667.072 4.947.059 1.278.353 2.451 1.32 3.418.967.967 2.14 1.261 3.418 1.32 1.28.058 1.703.072 4.947.072s3.667-.014 4.947-.072c1.278-.059 2.451-.353 3.418-1.32.967-.967 1.261-2.14 1.32-3.418.058-1.28.072-1.703.072-4.947V9.757c0-3.244-.014-3.667-.072-4.947-.059-1.278-.353-2.451-1.32-3.418C19.365.425 18.192.131 16.914.072 15.634.014 15.211 0 11.967 0H12zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

const socialButtonClass =
  "inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#ddd] px-5 py-[9px] font-serif text-[0.85rem] tracking-[0.5px] text-[#333] no-underline transition hover:-translate-y-0.5 hover:border-brand-mid hover:bg-brand-mid hover:text-white hover:shadow-[0_4px_14px_rgba(44,62,80,0.25)]";

export function ContactCard() {
  return (
    <div className="grid w-full max-w-[840px] min-w-0 overflow-hidden rounded-[14px] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_64px_rgba(0,0,0,0.16)] max-[620px]:grid-cols-1 min-[621px]:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="group bg-brand-mid relative min-h-[420px] min-w-0 overflow-hidden max-[620px]:min-h-[280px]">
        <Image
          src="/RileyHeadshot.jpg"
          alt={site.name}
          fill
          className="object-cover object-[center_top] transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 620px) 100vw, 350px"
          unoptimized
        />
        <div className="absolute inset-x-0 bottom-0 z-2 w-full bg-[linear-gradient(transparent,rgba(26,37,47,0.9))] px-6 pt-10 pb-6 text-white">
          <h3 className="mb-1 font-serif text-[1.3rem] leading-none font-bold tracking-normal">
            {site.name}
          </h3>
          <p className="text-accent m-0 text-[0.82rem] tracking-[1.2px] uppercase">
            Event Video & Photography
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-8 px-10 py-12 max-[680px]:px-6 max-[680px]:py-8">
        <div>
          <h2 className="text-brand-mid mb-1 font-serif text-[1.8rem] leading-tight font-bold tracking-normal">
            Let&apos;s Connect
          </h2>
          <p className="mb-0 text-[0.9rem] text-[#888] italic">
            Available for event coverage, portrait sessions & post-production.
          </p>
        </div>
        <div className="flex flex-col gap-[1.1rem]">
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-4 rounded-lg px-3.5 py-2.5 no-underline transition-colors hover:bg-[#f4f6f8]"
          >
            <span className="bg-brand-mid flex size-[42px] shrink-0 items-center justify-center rounded-[10px]">
              <MailIcon />
            </span>
            <span className="flex flex-col">
              <span className="mb-0.5 text-[0.72rem] tracking-[1px] text-[#aaa] uppercase">
                Email
              </span>
              <span className="text-[0.95rem] font-medium break-words text-[#333]">
                {site.email}
              </span>
            </span>
          </a>
          <a
            href={site.phoneHref}
            className="flex items-center gap-4 rounded-lg px-3.5 py-2.5 no-underline transition-colors hover:bg-[#f4f6f8]"
          >
            <span className="bg-brand-mid flex size-[42px] shrink-0 items-center justify-center rounded-[10px]">
              <PhoneIcon />
            </span>
            <span className="flex flex-col">
              <span className="mb-0.5 text-[0.72rem] tracking-[1px] text-[#aaa] uppercase">
                Phone
              </span>
              <span className="text-[0.95rem] font-medium text-[#333]">
                {site.phoneDisplay}
              </span>
            </span>
          </a>
          <div className="flex items-center gap-4 rounded-lg px-3.5 py-2.5">
            <span className="bg-brand-mid flex size-[42px] shrink-0 items-center justify-center rounded-[10px]">
              <PinIcon />
            </span>
            <span className="flex flex-col">
              <span className="mb-0.5 text-[0.72rem] tracking-[1px] text-[#aaa] uppercase">
                Based In
              </span>
              <span className="text-[0.95rem] font-medium text-[#333]">
                {site.location}
              </span>
            </span>
          </div>
        </div>
        <hr className="m-0 border-0 border-t border-[#eee]" />
        <div className="flex flex-wrap gap-3">
          <a
            href={site.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(socialButtonClass)}
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(socialButtonClass)}
          >
            <InstagramIcon />
            Instagram
          </a>
          <a href={site.bookNowUrl} className={cn(socialButtonClass)}>
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
