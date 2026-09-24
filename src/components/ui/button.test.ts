import { describe, expect, it } from "vitest";
import { buttonVariants } from "@/components/ui/button";

/* The outline variant once set a background without a foreground, so its label
   colour was inherited from whatever the button sat in. On the dark video modal
   that produced white icons on a white button. */
describe("buttonVariants", () => {
  it("pairs a foreground with a background on every variant that sets one", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
    ] as const;

    for (const variant of variants) {
      const classes = buttonVariants({ variant }).split(/\s+/);
      const hasBackground = classes.some((name) => /^bg-/.test(name));
      const hasForeground = classes.some((name) => /^text-/.test(name));
      expect(
        hasBackground && hasForeground,
        `${variant} sets a background but no text colour`,
      ).toBe(true);
    }
  });
});
