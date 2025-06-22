import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimelaneBody } from "./TimelaneBody";
import { Timelane } from "../Timelane/Timelane";
import { TimelaneLane } from "../TimelaneLane/TimelaneLane";
import { fn } from "storybook/test";

const meta = {
  component: TimelaneBody,
  tags: ["autodocs"],
  subcomponents: {},
} satisfies Meta<typeof TimelaneBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onSelect: fn(),
  },
  decorators: (Story) => (
    <Timelane>
      <Story />
    </Timelane>
  ),
  render: (args) => (
    <TimelaneBody {...args}>
      <TimelaneLane lane={{ id: 0, capacity: 100 }} items={[]} />
      <TimelaneLane lane={{ id: 1, capacity: 100 }} items={[]} />
    </TimelaneBody>
  ),
};
