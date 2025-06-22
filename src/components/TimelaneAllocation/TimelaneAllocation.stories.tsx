import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimelaneAllocation } from "./TimelaneAllocation";
import { fn } from "storybook/test";

const meta = {
  component: TimelaneAllocation,
  tags: ["autodocs"],
  subcomponents: {},
} satisfies Meta<typeof TimelaneAllocation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: "Sample Allocation",
    description: "Sample Allocation",
    onClick: fn(),
    onContextMenu: fn(),
  },
};
