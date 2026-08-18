import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "@/components/organisms/SiteHeader";

test("renders primary navigation links", () => {
  render(<SiteHeader />);

  expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /^video$/i })).toHaveAttribute(
    "href",
    "/video",
  );
  expect(screen.getByRole("link", { name: /photography/i })).toHaveAttribute(
    "href",
    "/photography",
  );
  expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
    "href",
    "/about",
  );
  expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
    "href",
    "/contact",
  );
});

test("pins the hamburger to the top-right of the header", () => {
  render(<SiteHeader />);

  expect(screen.getByRole("button", { name: /toggle navigation/i })).toHaveClass(
    "ml-auto",
  );
  expect(screen.getByRole("navigation", { name: /primary/i })).toHaveClass(
    "max-[680px]:absolute",
  );
});

test("toggles the mobile menu open and closed", async () => {
  const user = userEvent.setup();
  render(<SiteHeader />);

  const toggle = screen.getByRole("button", { name: /toggle navigation/i });
  expect(toggle).toHaveAttribute("aria-expanded", "false");

  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");

  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("animates hamburger bars into an X and shows the dropdown card", async () => {
  const user = userEvent.setup();
  const { container } = render(<SiteHeader />);

  const toggle = screen.getByRole("button", { name: /toggle navigation/i });
  const bars = toggle.querySelectorAll("span");
  const menu = container.querySelector("nav ul");

  expect(bars[0]).toHaveClass("[transform:none]");
  expect(menu).toHaveClass("max-[680px]:hidden");
  expect(menu).toHaveClass("max-[680px]:shadow-[0_4px_12px_rgba(0,0,0,0.1)]");

  await user.click(toggle);

  expect(bars[0]).toHaveClass("[transform:translateY(7px)_rotate(45deg)]");
  expect(bars[1]).toHaveClass("opacity-0");
  expect(bars[2]).toHaveClass("[transform:translateY(-7px)_rotate(-45deg)]");
  expect(menu).toHaveClass("max-[680px]:flex");
});
