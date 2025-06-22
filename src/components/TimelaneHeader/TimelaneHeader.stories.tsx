import type { Meta, StoryObj } from "@storybook/react-vite";

import { Timelane } from "../Timelane/Timelane";
import { TimelaneHeader } from "../TimelaneHeader";
import { fn } from "storybook/test";

const meta = {
  component: TimelaneHeader,
  tags: ["autodocs"],
  subcomponents: {},
} satisfies Meta<typeof TimelaneHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onDayClick: fn(),
    onWeekClick: fn(),
    onMonthClick: fn(),
  },
  decorators: (Story) => (
    <Timelane
      start={new Date(2025, 4, 1)}
      end={new Date(2025, 6, 1)}
      pixelsPerDay={30}
    >
      <Story />
    </Timelane>
  ),
};
