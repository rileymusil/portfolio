import type { Meta, StoryObj } from "@storybook/react";
import { CategoryCard } from "@/components/molecules/CategoryCard";

const meta = {
  title: "Molecules/CategoryCard",
  component: CategoryCard,
  tags: ["autodocs"],
  args: {
    href: "/photography/creative",
    imageSrc: "/CREATIVE.jpg",
    title: "Creative",
    className: "h-[420px] w-[320px]",
  },
} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
