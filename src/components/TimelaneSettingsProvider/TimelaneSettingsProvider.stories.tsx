import type { Meta, StoryObj } from "@storybook/react-vite";

import { Timelane as TL } from "../Timelane/Timelane";
import { Item, Lane } from "../../types";
import { TimelaneSettingsProvider } from "./TimelaneSettingsProvider";
import { TimelaneAllocation } from "../TimelaneAllocation/TimelaneAllocation";

const meta = {
  component: TimelaneSettingsProvider,
  tags: ["autodocs"],
} satisfies Meta<typeof TimelaneSettingsProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const lanes: Lane[] = [
  {
    id: 0,
    capacity: 100,
  },
  {
    id: 1,
    capacity: 100,
  },
  {
    id: 2,
    capacity: 100,
  },
];

const items: Item<null>[] = [
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
    settings: {
      start: new Date(2025, 4, 1),
      end: new Date(2025, 4, 20),
      pixelsPerDay: 50,
      pixelsPerLane: 50,
      showDays: true,
      showMonths: true,
      showWeeks: true,
      allowOverlaps: true,
      focusedDate: null,
      enableItemDragging: false,
      enableItemResizing: false,
    },
  },
  render: (args) => (
    <TimelaneSettingsProvider settings={args.settings}>
      <TL pixelsPerDay={100}>
        <TL.Header />
        <TL.Body>
          {lanes.map(({ id, capacity }) => (
            <TL.Lane
              key={id}
              id={id}
              capacity={capacity}
              items={items.filter((item) => item.laneId === id)}
              renderItem={(item) => (
                <TimelaneAllocation name={`Allocation ${item.id}`} />
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
    </TimelaneSettingsProvider>
  ),
};
