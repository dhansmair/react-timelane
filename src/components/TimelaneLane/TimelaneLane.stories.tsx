import type { Meta, StoryObj } from "@storybook/react-vite";

import { Timelane } from "../Timelane/Timelane";
import { TimelaneBody } from "../TimelaneBody/TimelaneBody";
import { TimelaneLane } from "../TimelaneLane/TimelaneLane";
import { TimelaneAllocation } from "../TimelaneAllocation/TimelaneAllocation";
import { fn } from "storybook/test";

const meta = {
  component: TimelaneLane,
  tags: ["autodocs"],
} satisfies Meta<typeof TimelaneLane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    lane: {
      id: 0,
      capacity: 100,
    },
    items: [
      {
        id: 0,
        laneId: 0,
        start: new Date(2025, 4, 5),
        end: new Date(2025, 4, 15),
        size: 50,
        offset: 0,
        payload: null,
      },
      {
        id: 1,
        laneId: 0,
        start: new Date(2025, 4, 16),
        end: new Date(2025, 4, 25),
        size: 100,
        offset: 0,
        payload: null,
      },
    ],
    onClick: fn(),
    onDoubleClick: fn(),
    onContextMenu: fn(),
    onItemUpdate: fn(),
  },
  parameters: {
    start: new Date(2025, 4, 1),
    end: new Date(2025, 5, 1),
  },
  render: (args) => (
    <TimelaneLane
      {...args}
      renderItem={(item) => (
        <TimelaneAllocation name={`Allocation ${item.id}`} description={""} />
      )}
    />
  ),
  decorators: (Story, { parameters }) => (
    <Timelane {...parameters}>
      <TimelaneBody>
        <Story />
      </TimelaneBody>
    </Timelane>
  ),
};
