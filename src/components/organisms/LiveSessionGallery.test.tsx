import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { LiveSessionGallery } from "./LiveSessionGallery";
import { getPhotoSessions } from "@/lib/sanity/queries";

vi.mock("@/lib/sanity/queries", () => ({
  getPhotoSessions: vi.fn(),
}));

const mockedGetPhotoSessions = vi.mocked(getPhotoSessions);

const session = {
  id: "session-1",
  title: "Golden Hour",
  description: "Portraits at sunset.",
  category: "portraits" as const,
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
  ],
};

beforeEach(() => {
  mockedGetPhotoSessions.mockReset();
});

test("loads sessions from Sanity in the browser", async () => {
  mockedGetPhotoSessions.mockResolvedValue([session]);

  render(<LiveSessionGallery category="portraits" />);

  expect(screen.getByRole("status")).toHaveTextContent(/loading photos/i);
  expect(
    await screen.findByRole("button", { name: /open golden hour gallery/i }),
  ).toBeInTheDocument();
  expect(mockedGetPhotoSessions).toHaveBeenCalledWith("portraits");
});

test("shows empty copy after a live fetch with no sessions", async () => {
  mockedGetPhotoSessions.mockResolvedValue([]);

  render(<LiveSessionGallery category="event" />);

  expect(await screen.findByText(/no photos yet/i)).toBeInTheDocument();
});

test("shows an error if Sanity cannot be reached", async () => {
  mockedGetPhotoSessions.mockRejectedValue(new Error("network"));

  render(<LiveSessionGallery category="creative" />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    /couldn't load photos/i,
  );
});
