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
