import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/atoms/Logo";

test("links the brand mark and name to the home page", () => {
  render(<Logo />);

  const link = screen.getByRole("link", { name: /riley musil/i });
  expect(link).toHaveAttribute("href", "/");
  const name = screen.getByText("Riley Musil");
  expect(name).toHaveClass("tracking-[0.5px]");
});
