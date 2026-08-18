import type { Meta, StoryObj } from "@storybook/react";
import { SessionCard } from "@/components/molecules/SessionCard";

const meta = {
  title: "Molecules/SessionCard",
  component: SessionCard,
  tags: ["autodocs"],
  args: {
    title: "Portrait Sessions",
    coverUrl: "/PORTRAITS.jpg",
    photoCount: 12,
    onOpen: () => undefined,
  },
} satisfies Meta<typeof SessionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SinglePhoto: Story = {
  args: {
    photoCount: 1,
  },
};
