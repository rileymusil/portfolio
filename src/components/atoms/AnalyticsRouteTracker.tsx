"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* The site is a static export with client-side navigation, so gtag's own
   page_view would only fire on a hard load. Sending one per pathname change
   keeps the report honest about which galleries people actually reach. */
export function AnalyticsRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") {
      return;
    }
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  return null;
}
