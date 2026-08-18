import { render, screen } from "@testing-library/react";
import { BookNowButton } from "@/components/atoms/BookNowButton";

test("points to the Square booking site", () => {
  render(<BookNowButton />);

  const link = screen.getByRole("link", { name: /book now/i });
  expect(link).toHaveAttribute("href", "http://rileymusil.square.site/");
});
