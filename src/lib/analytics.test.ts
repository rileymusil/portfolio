import { describe, expect, it } from "vitest";
import { gaInitScript, gaScriptUrl, getGaMeasurementId } from "@/lib/analytics";

describe("getGaMeasurementId", () => {
  it("returns null when the variable is unset, so analytics stays off", () => {
    expect(getGaMeasurementId({})).toBeNull();
  });

  it("returns null for a blank or half-pasted value", () => {
    expect(
      getGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "  " }),
    ).toBeNull();
    expect(
      getGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-" }),
    ).toBeNull();
  });

  it("rejects a Universal Analytics id, which GA4 cannot use", () => {
    expect(
      getGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "UA-12345-1" }),
    ).toBeNull();
  });

  it("accepts a GA4 id and trims surrounding whitespace", () => {
    expect(
      getGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: " G-ABC1234567 " }),
    ).toBe("G-ABC1234567");
  });
});

describe("gaScriptUrl", () => {
  it("points at the gtag loader for the given property", () => {
    expect(gaScriptUrl("G-ABC1234567")).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-ABC1234567",
    );
  });
});

describe("gaInitScript", () => {
  it("turns off gtag's own page_view so route changes are not double counted", () => {
    expect(gaInitScript("G-ABC1234567")).toContain("send_page_view: false");
  });

  it("embeds the id as a quoted string rather than raw interpolation", () => {
    expect(gaInitScript("G-ABC1234567")).toContain(
      "gtag('config', \"G-ABC1234567\"",
    );
  });
});
