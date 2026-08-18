import type { Meta, StoryObj } from "@storybook/react";
import { PageBanner } from "@/components/organisms/PageBanner";

const meta = {
  title: "Organisms/PageBanner",
  component: PageBanner,
  tags: ["autodocs"],
  args: {
    title: "Photography Portfolio",
    subtitle: "Event coverage, portraits & creative work.",
  },
} satisfies Meta<typeof PageBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBackLink: Story = {
  args: {
    title: "Creative Photography",
    subtitle: "Editorial and conceptual photography.",
    backHref: "/photography",
    backLabel: "All photography",
  },
};
