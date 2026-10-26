import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DiscordPromo } from "@/components/organisms/DiscordPromo";

test("invites visitors to the server by name", () => {
  render(<DiscordPromo />);

  expect(
    screen.getByRole("heading", { name: "HTX │ Filmmakers Lounge" }),
  ).toBeInTheDocument();
});

test("links out to the invite in a new tab, safely", () => {
  render(<DiscordPromo />);

  const join = screen.getByRole("link", { name: /join the discord/i });

  expect(join).toHaveAttribute("href", "https://discord.gg/Qa6n8Vwvp4");
  expect(join).toHaveAttribute("target", "_blank");
  expect(join).toHaveAttribute("rel", expect.stringContaining("noopener"));
});

test("the server icon is decorative, since the name sits beside it", () => {
  render(<DiscordPromo />);

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});
