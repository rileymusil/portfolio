import { render, screen } from "@testing-library/react";
import { PageBanner } from "@/components/organisms/PageBanner";

test("renders the page heading and optional back link", () => {
  render(
    <PageBanner
      title="Creative Photography"
      subtitle="Editorial and conceptual photography."
      backHref="/photography"
      backLabel="All photography"
    />,
  );

  expect(
    screen.getByRole("heading", { name: /creative photography/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /all photography/i })).toHaveAttribute(
    "href",
    "/photography",
  );
});

test("uses the original banner title size", () => {
  render(<PageBanner title="Photography Portfolio" />);

  expect(screen.getByRole("heading", { name: /photography portfolio/i })).toHaveClass(
    "min-[681px]:text-[3rem]",
  );
});
