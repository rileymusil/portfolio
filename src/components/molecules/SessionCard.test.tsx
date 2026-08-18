import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SessionCard } from "@/components/molecules/SessionCard";

test("announces the session and photo count, then opens on activate", async () => {
  const user = userEvent.setup();
  const onOpen = vi.fn();

  render(
    <SessionCard
      title="Portrait Sessions"
      coverUrl="/portraits-cover.jpg"
      photoCount={12}
      onOpen={onOpen}
    />,
  );

  const card = screen.getByRole("button", {
    name: /open portrait sessions gallery/i,
  });
  expect(screen.getByText("12 photos")).toBeInTheDocument();
  await user.click(card);
  expect(onOpen).toHaveBeenCalledTimes(1);
});
