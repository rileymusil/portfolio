"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/atoms/Logo";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[100] flex items-center overflow-visible bg-white px-[5%] py-4 shadow-[0_2px_5px_rgba(0,0,0,0.05)] max-[680px]:relative">
      <Logo />
      <button
        type="button"
        className={cn(
          "z-[1100] ml-auto hidden shrink-0 cursor-pointer flex-col justify-center gap-[5px] border-0 bg-transparent p-1 max-[680px]:flex",
          open && "open",
        )}
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className={cn(
            "block h-[2px] w-6 rounded-[2px] bg-[#333] transition-all duration-300 ease-[ease]",
            open
              ? "[transform:translateY(7px)_rotate(45deg)]"
              : "[transform:none]",
          )}
        />
        <span
          className={cn(
            "block h-[2px] w-6 rounded-[2px] bg-[#333] transition-all duration-300 ease-[ease]",
            open ? "opacity-0" : "opacity-100",
          )}
        />
        <span
          className={cn(
            "block h-[2px] w-6 rounded-[2px] bg-[#333] transition-all duration-300 ease-[ease]",
            open
              ? "[transform:translateY(-7px)_rotate(-45deg)]"
              : "[transform:none]",
          )}
        />
      </button>
      <nav
        aria-label="Primary"
        className="min-[681px]:ml-auto max-[680px]:absolute max-[680px]:top-full max-[680px]:right-0 max-[680px]:left-0 max-[680px]:z-[999]"
      >
        <ul
          className={cn(
            "m-0 flex list-none gap-8 p-0",
            "max-[680px]:w-full max-[680px]:flex-col max-[680px]:gap-0 max-[680px]:bg-white max-[680px]:px-[5%] max-[680px]:py-2 max-[680px]:shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
            open ? "max-[680px]:flex" : "max-[680px]:hidden",
          )}
        >
          {navLinks.map((link) => (
            <li
              key={link.href}
              className="max-[680px]:border-b max-[680px]:border-[#f0f0f0] max-[680px]:last:border-b-0"
            >
              <Link
                href={link.href}
                className={cn(
                  "font-serif text-[0.9rem] tracking-[1px] text-[#333] uppercase no-underline transition hover:text-[#555]",
                  "max-[680px]:block max-[680px]:py-3",
                  pathname.startsWith(link.href) && "text-primary",
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
