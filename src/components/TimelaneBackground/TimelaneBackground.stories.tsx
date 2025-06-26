import type { Meta, StoryObj } from "@storybook/react-vite";

import { Timelane } from "../Timelane/Timelane";
import { TimelaneBackground } from "./TimelaneBackground";
import { TimelaneBody } from "../TimelaneBody/TimelaneBody";
import { TimelaneLane } from "../TimelaneLane/TimelaneLane";

const meta = {
  component: TimelaneBackground,
  tags: ["autodocs"],
  subcomponents: {},
} satisfies Meta<typeof TimelaneBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  decorators: (Story) => (
    <Timelane
      start={new Date(2025, 4, 1)}
      end={new Date(2025, 6, 1)}
      pixelsPerDay={30}
    >
      <TimelaneBody>
        <TimelaneLane id={0} />
        <TimelaneLane id={1} />
      </TimelaneBody>
      <Story />
    </Timelane>
  ),
};
