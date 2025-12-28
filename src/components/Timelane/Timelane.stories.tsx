import type { Meta, StoryObj } from "@storybook/react-vite";

import { Timelane as TL } from "./Timelane";
import { TimelaneHeader } from "../TimelaneHeader";
import { TimelaneBody } from "../TimelaneBody/TimelaneBody";
import { TimelaneBackground } from "../TimelaneBackground/TimelaneBackground";
import { TimelaneLane } from "../TimelaneLane/TimelaneLane";
import { Item, Lane } from "../../types";
import { TimelaneAllocation } from "../TimelaneAllocation/TimelaneAllocation";

const meta = {
  component: TL,
  tags: ["autodocs"],
  subcomponents: {
    TimelaneHeader,
    TimelaneBody,
    TimelaneBackground,
    TimelaneLane,
  },
} satisfies Meta<typeof TL>;

export default meta;
type Story = StoryObj<typeof meta>;

const lanes: Lane<string>[] = [
  {
    id: 0,
    capacity: 100,
    payload: "one",
  },
  {
    id: 1,
    capacity: 100,
    payload: "two",
  },
  {
    id: 2,
    capacity: 100,
    payload: "three",
  },
];

const items: Item[] = [
  {
    id: 0,
    laneId: 0,
    start: new Date(2025, 4, 1),
    end: new Date(2025, 4, 20),
    size: 50,
    offset: 0,
    payload: null,
  },
  {
    id: 1,
    laneId: 1,
    start: new Date(2025, 4, 1),
    end: new Date(2025, 4, 20),
    size: 50,
    offset: 0,
    payload: null,
  },
  {
    id: 2,
    laneId: 2,
    start: new Date(2025, 4, 1),
    end: new Date(2025, 4, 20),
    size: 50,
    offset: 0,
    payload: null,
  },
];

export const Primary: Story = {
  args: {
    start: new Date(2025, 4, 1),
    end: new Date(2025, 6, 1),
  },
  render: (args) => (
    <TL {...args}>
      <TL.Header />
      <TL.Body>
        {lanes.map(({ id, capacity }) => (
          <TL.Lane
            key={id}
            id={id}
            capacity={capacity}
            items={items.filter((item) => item.laneId === id)}
            renderItem={(item) => (
              <TimelaneAllocation
                name={`Allocation ${item.id}`}
                description={""}
              />
            )}
          />
        ))}
      </TL.Body>
      <TL.Background />
      <TL.Aside
        lanes={lanes}
        renderLaneHeader={(lane) => <div>{lane.id}</div>}
      />
      <TL.Layout.Corner />
    </TL>
  ),
};
