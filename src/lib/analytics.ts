/* GA4 measurement IDs look like G-XXXXXXXXXX. Checking the shape means a stray
   or half-pasted value leaves analytics off rather than injecting a script tag
   that silently does nothing. */
const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{4,}$/i;

export function getGaMeasurementId(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const raw = (env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();
  return MEASUREMENT_ID_PATTERN.test(raw) ? raw : null;
}

export function gaScriptUrl(measurementId: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
}

/* send_page_view is off because App Router navigations do not reload the page:
   gtag would only ever count the first one. AnalyticsRouteTracker sends every
   page_view instead, including the first, so there is no double count. */
export function gaInitScript(measurementId: string): string {
  return [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js', new Date());",
    `gtag('config', ${JSON.stringify(measurementId)}, { send_page_view: false });`,
  ].join("\n");
}
