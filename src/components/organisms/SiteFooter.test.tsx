import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/organisms/SiteFooter";

test("shows copyright and a Trashbox credit link", () => {
  render(<SiteFooter />);

  expect(screen.getByText(/© 2026 Riley Musil. All Rights Reserved./i)).toBeInTheDocument();
  const credit = screen.getByRole("link", { name: /trashbox/i });
  expect(credit).toHaveAttribute("href", "https://trashbox.io/");
});
