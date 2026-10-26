import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/organisms/SiteFooter";

test("shows copyright and a Trashbox credit link", () => {
  render(<SiteFooter />);

  expect(
    screen.getByText(/© 2026 Riley Musil. All Rights Reserved./i),
  ).toBeInTheDocument();
  const credit = screen.getByRole("link", { name: /trashbox/i });
  expect(credit).toHaveAttribute("href", "https://trashbox.io/");
});

test("promotes the Discord server by name on every page", () => {
  render(<SiteFooter />);

  const discord = screen.getByRole("link", { name: "HTX │ Filmmakers Lounge" });
  expect(discord).toHaveAttribute("href", "https://discord.gg/Qa6n8Vwvp4");
  expect(discord).toHaveAttribute("target", "_blank");
});
