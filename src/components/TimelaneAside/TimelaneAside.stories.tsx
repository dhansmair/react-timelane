import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimelaneAside } from "./TimelaneAside";
import { Timelane } from "../Timelane/Timelane";

const meta = {
  component: TimelaneAside,
  tags: ["autodocs"],
  subcomponents: {},
} satisfies Meta<typeof TimelaneAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    lanes: [
      {
        id: 0,
        capacity: 100,
      },
      {
        id: 1,
        capacity: 100,
      },
    ],
  },
  decorators: (Story) => (
    <Timelane>
      <Story />
    </Timelane>
  ),
};
