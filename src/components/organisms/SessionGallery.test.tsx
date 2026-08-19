import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { SessionGallery } from "@/components/organisms/SessionGallery";
import type { PhotoSession } from "@/lib/sanity/types";

const session: PhotoSession = {
  id: "session-1",
  title: "Golden Hour",
  description: "Portraits at sunset.",
  category: "portraits",
  cover: {
    url: "https://cdn.sanity.io/images/abc/production/cover-6000x4000.jpg",
    alt: "Cover",
  },
  photos: [
    {
      url: "https://cdn.sanity.io/images/abc/production/one-6000x4000.jpg",
      alt: "One",
    },
  ],
};

test("renders a card per session from build-time data", () => {
  render(<SessionGallery sessions={[session]} />);

  expect(
    screen.getByRole("button", { name: /open golden hour gallery/i }),
  ).toBeInTheDocument();
});

// The Sanity URL rewriting itself is covered by image-loader.test.ts; next/image
// does not read next.config.ts under vitest, so the loader is not wired up here.
test("renders the cover straight from the session data", () => {
  render(<SessionGallery sessions={[session]} />);

  expect(screen.getByRole("img", { name: /golden hour/i })).toBeInTheDocument();
});

test("shows empty copy when a category has no sessions", () => {
  render(<SessionGallery sessions={[]} />);

  expect(screen.getByText(/no photos yet/i)).toBeInTheDocument();
});

test("the full-size viewer serves a compressed webp, not the original", async () => {
  const user = userEvent.setup();
  render(<SessionGallery sessions={[session]} />);

  await user.click(
    screen.getByRole("button", { name: /open golden hour gallery/i }),
  );
  await user.click(
    await screen.findByRole("button", { name: /golden hour photo 1/i }),
  );

  const viewer = await screen.findByRole("dialog", { name: /photo viewer/i });
  const full = within(viewer).getByRole("img", { name: /one/i });
  const src = new URL(full.getAttribute("src") ?? "");

  expect(src.searchParams.get("auto")).toBe("format");
  expect(src.searchParams.get("q")).toBe("85");
  expect(src.searchParams.get("w")).toBe("2048");
  expect(src.searchParams.get("fit")).toBe("max");
});
