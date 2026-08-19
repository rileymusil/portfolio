import { render, screen } from "@testing-library/react";
import { CategoryCard } from "@/components/molecules/CategoryCard";

test("renders a linked category cover with overlay title", () => {
  render(
    <CategoryCard
      href="/photography/creative"
      imageSrc="/CREATIVE.jpg"
      title="Creative"
    />,
  );

  expect(screen.getByRole("link", { name: /creative/i })).toHaveAttribute(
    "href",
    "/photography/creative",
  );
  expect(screen.getByRole("img", { name: /creative/i })).toHaveAttribute(
    "src",
    "/CREATIVE.jpg",
  );
});

test("title is visible by default and only hidden on hover-capable pointers", () => {
  render(
    <CategoryCard
      href="/video/commercial"
      imageSrc="/Commercial.jpg"
      title="Commercial"
    />,
  );

  const overlay = screen.getByRole("heading", { name: /commercial/i })
    .parentElement as HTMLElement;

  // Touch devices get the title permanently, without the hover-only fade.
  expect(overlay).toHaveClass("opacity-100");
  expect(overlay).not.toHaveClass("opacity-0");
  expect(overlay.className).toContain("can-hover:opacity-0");
  expect(overlay.className).toContain("can-hover:group-hover:opacity-100");
});

test("title scales with the card so it stays inside narrow covers", () => {
  render(
    <CategoryCard
      href="/photography/portraits"
      imageSrc="/PORTRAITS.jpg"
      title="Portraits"
    />,
  );

  const heading = screen.getByRole("heading", { name: /portraits/i });
  expect(heading.className).toContain("text-[clamp(1.1rem,11cqi,3rem)]");
  expect(heading.className).toContain("break-words");
});
