import Script from "next/script";
import { AnalyticsRouteTracker } from "@/components/atoms/AnalyticsRouteTracker";
import { gaInitScript, gaScriptUrl, getGaMeasurementId } from "@/lib/analytics";

/* Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset, so local dev and
   preview builds do not report traffic into the production property. */
export function Analytics() {
  const measurementId = getGaMeasurementId();

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script src={gaScriptUrl(measurementId)} strategy="afterInteractive" />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        /* Built from a value matched against MEASUREMENT_ID_PATTERN and
           JSON-encoded, so nothing arbitrary reaches the page. */
        dangerouslySetInnerHTML={{ __html: gaInitScript(measurementId) }}
      />
      <AnalyticsRouteTracker />
    </>
  );
}
