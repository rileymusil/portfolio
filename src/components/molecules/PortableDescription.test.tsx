import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortableDescription } from "@/components/molecules/PortableDescription";

function paragraphWithLink(openInNewTab?: boolean) {
  return [
    {
      _type: "block",
      _key: "b1",
      style: "normal",
      markDefs: [
        {
          _type: "link",
          _key: "l1",
          href: "https://linktr.ee/probablyaves",
          ...(openInNewTab === undefined ? {} : { openInNewTab }),
        },
      ],
      children: [
        { _type: "span", _key: "s1", text: "Written by ", marks: [] },
        { _type: "span", _key: "s2", text: "Avery Evans", marks: ["l1"] },
      ],
    },
  ];
}

describe("PortableDescription", () => {
  it("renders link annotations as real anchors", () => {
    render(<PortableDescription value={paragraphWithLink(true)} />);

    const link = screen.getByRole("link", { name: "Avery Evans" });
    expect(link).toHaveAttribute("href", "https://linktr.ee/probablyaves");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps links in the same tab when the editor turns that off", () => {
    render(<PortableDescription value={paragraphWithLink(false)} />);

    const link = screen.getByRole("link", { name: "Avery Evans" });
    expect(link).not.toHaveAttribute("target");
  });

  it("renders emphasis decorators", () => {
    render(
      <PortableDescription
        value={[
          {
            _type: "block",
            _key: "b1",
            style: "normal",
            markDefs: [],
            children: [
              { _type: "span", _key: "s1", text: "Family Dinner", marks: ["em"] },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByText("Family Dinner").tagName).toBe("EM");
  });

  it("renders nothing when there is no description", () => {
    const { container } = render(<PortableDescription value={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
