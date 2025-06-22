import type { Meta, StoryObj } from "@storybook/react-vite";

import { FullExamplePage } from "./FullExamplePage";

const meta = {
  title: "Overview / Example",
  component: FullExamplePage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    // layout: "centered",
  },
  argTypes: {
    showDays: {
      control: {
        type: "boolean",
      },
    },
  },
} satisfies Meta<typeof FullExamplePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    start: new Date(2025, 4, 1),
    end: new Date(2025, 6, 1),
    pixelsPerDay: 50,
    pixelsPerLane: 80,
    showDays: true,
    showWeeks: true,
    showMonths: true,
    enableItemDragging: true,
    enableItemResizing: {
      top: true,
      left: true,
      bottom: true,
      right: true,
    },
  },
};
