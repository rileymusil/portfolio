import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    unoptimized: _unoptimized,
    sizes: _sizes,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string | { src: string };
    fill?: boolean;
    priority?: boolean;
    unoptimized?: boolean;
    sizes?: string;
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
  }) => {
    const resolved = typeof src === "string" ? src : src.src;
    return React.createElement("img", { src: resolved, alt, ...props });
  },
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
