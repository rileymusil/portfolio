import type { Meta, StoryObj } from "@storybook/react";
import { BookNowButton } from "@/components/atoms/BookNowButton";

const meta = {
  title: "Atoms/BookNowButton",
  component: BookNowButton,
  tags: ["autodocs"],
} satisfies Meta<typeof BookNowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
