import { getBasePath } from "@/lib/static-export";

/* The custom domain in public/CNAME. Used when NEXT_PUBLIC_SITE_URL is unset so
   a local build still produces real canonical and Open Graph URLs. */
export const DEFAULT_SITE_ORIGIN = "https://rileymusil.com";

export function getSiteOrigin(
  env: Record<string, string | undefined> = process.env,
): string {
  const raw = (env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const origin = raw || DEFAULT_SITE_ORIGIN;
  return origin.replace(/\/+$/, "");
}

/* Absolute URL for a route, with the base path applied and a trailing slash to
   match next.config's `trailingSlash: true` — so the canonical we advertise is
   the URL the site actually serves. */
export function absoluteUrl(
  path: string,
  env: Record<string, string | undefined> = process.env,
): string {
  const basePath = getBasePath(env);
  const trimmed = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const suffix = trimmed ? `/${trimmed}/` : "/";
  return `${getSiteOrigin(env)}${basePath}${suffix}`;
}

/* Absolute URL for a file in public/ — no trailing slash, since it is a file. */
export function assetUrl(
  path: string,
  env: Record<string, string | undefined> = process.env,
): string {
  const basePath = getBasePath(env);
  const trimmed = path.replace(/^\/+/, "");
  return `${getSiteOrigin(env)}${basePath}/${trimmed}`;
}
