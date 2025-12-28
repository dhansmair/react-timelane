import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimelaneAside } from "./TimelaneAside";
import { Timelane } from "../Timelane/Timelane";
import { TimelaneBody } from "../TimelaneBody/TimelaneBody";
import { TimelaneLane } from "../TimelaneLane/TimelaneLane";

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
    width: 50,
  },
  decorators: (Story) => (
    <Timelane>
      <TimelaneBody>
        <TimelaneLane id={0} />
      </TimelaneBody>
      <Story />
    </Timelane>
  ),
};

export const Secondary: Story = {
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
    width: 100,
    side: "right",
  },
  decorators: (Story) => (
    <Timelane>
      <TimelaneBody>
        <TimelaneLane id={0} />
      </TimelaneBody>
      <Story />
    </Timelane>
  ),
};
