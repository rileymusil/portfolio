"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { site } from "@/lib/site";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) {
        return;
      }
      gsap.fromTo(
        ref.current.querySelectorAll("[data-hero-item]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-brand-mid px-8 py-24 text-center text-white"
    >
      <div data-hero-item>
        <Image
          src="/RileyMusilLOGO.png"
          alt={site.name}
          width={1080}
          height={1080}
          className="mx-auto mb-4 block h-auto w-4/5 max-w-[520px] invert"
          priority
        />
      </div>
      <h1 data-hero-item className="sr-only">
        {site.name}
      </h1>
      <h2
        data-hero-item
        className="mt-2.5 mb-5 font-serif text-[1.2rem] font-normal text-accent italic md:text-[1.8rem]"
      >
        {site.tagline}
      </h2>
      <p data-hero-item className="font-sans text-base font-normal">
        {site.subtitle}
      </p>
    </section>
  );
}
