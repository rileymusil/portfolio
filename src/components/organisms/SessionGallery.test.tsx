import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, expect, test, vi } from "vitest";
import {
  GALLERY_DIALOG_ANIMATION_MS,
  SessionGallery,
} from "@/components/organisms/SessionGallery";
import type { PhotoSession } from "@/lib/sanity/types";

const session: PhotoSession = {
  id: "session-1",
  title: "Golden Hour",
  description: "Portraits at sunset.",
  category: "portraits",
  cover: {
    alt: "Cover",
    thumbUrl: "https://cdn.sanity.io/cover.jpg?w=400",
    coverUrl: "https://cdn.sanity.io/cover.jpg?w=900",
    fullUrl: "https://cdn.sanity.io/cover.jpg?w=1600",
  },
  photos: [
    {
      alt: "One",
      thumbUrl: "https://cdn.sanity.io/one.jpg?w=400",
      coverUrl: "https://cdn.sanity.io/one.jpg?w=900",
      fullUrl: "https://cdn.sanity.io/one.jpg?w=1600",
    },
    {
      alt: "Two",
      thumbUrl: "https://cdn.sanity.io/two.jpg?w=400",
      coverUrl: "https://cdn.sanity.io/two.jpg?w=900",
      fullUrl: "https://cdn.sanity.io/two.jpg?w=1600",
    },
  ],
};

afterEach(() => {
  vi.useRealTimers();
});

test("shows the cover immediately and waits to load gallery thumbs", () => {
  vi.useFakeTimers();
  render(<SessionGallery sessions={[session]} />);

  expect(screen.getByRole("img", { name: "Golden Hour" })).toHaveAttribute(
    "src",
    session.cover.coverUrl,
  );

  fireEvent.click(
    screen.getByRole("button", { name: /open golden hour gallery/i }),
  );

  expect(
    screen.getByRole("button", { name: /golden hour photo 1/i }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: "One" })).not.toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(GALLERY_DIALOG_ANIMATION_MS);
  });

  expect(screen.getByRole("img", { name: "One" })).toHaveAttribute(
    "src",
    session.photos[0]?.thumbUrl,
  );
});

test("opens the lightbox with the large photo, not the thumbnail", async () => {
  const user = userEvent.setup();
  render(<SessionGallery sessions={[session]} />);

  await user.click(
    screen.getByRole("button", { name: /open golden hour gallery/i }),
  );
  await user.click(screen.getByRole("button", { name: /golden hour photo 1/i }));

  expect(screen.getByRole("dialog", { name: /photo viewer/i })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "One" })).toHaveAttribute(
    "src",
    session.photos[0]?.fullUrl,
  );
});

test("keeps the session gallery open while a photo is viewed", async () => {
  const user = userEvent.setup();
  render(<SessionGallery sessions={[session]} />);

  await user.click(
    screen.getByRole("button", { name: /open golden hour gallery/i }),
  );
  await user.click(screen.getByRole("button", { name: /golden hour photo 1/i }));

  expect(screen.getByRole("dialog", { name: /photo viewer/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Golden Hour", hidden: true, level: 2 }),
  ).toBeInTheDocument();
});

test("closes the photo viewer from empty space without restarting the gallery", async () => {
  const user = userEvent.setup();
  render(<SessionGallery sessions={[session]} />);

  await user.click(
    screen.getByRole("button", { name: /open golden hour gallery/i }),
  );
  expect(await screen.findByRole("img", { name: "One" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /golden hour photo 1/i }));

  await user.click(screen.getByRole("button", { name: /close photo viewer/i }));

  expect(
    screen.queryByRole("dialog", { name: /photo viewer/i }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "Golden Hour" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "One" })).toHaveAttribute(
    "src",
    session.photos[0]?.thumbUrl,
  );
});

