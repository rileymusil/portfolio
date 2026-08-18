import { render, screen } from "@testing-library/react";
import { ContactCard } from "@/components/organisms/ContactCard";

test("shows contact details, a bold heading, and social icons", () => {
  render(<ContactCard />);

  const heading = screen.getByRole("heading", { name: /let's connect/i });
  expect(heading).toHaveClass("font-bold");
  expect(screen.getByRole("link", { name: /rileymusil2006@gmail.com/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /instagram/i })).toBeInTheDocument();
  expect(screen.queryByLabelText(/message/i)).not.toBeInTheDocument();
});
