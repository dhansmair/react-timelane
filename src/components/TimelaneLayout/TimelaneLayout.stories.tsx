import type { Meta, StoryObj } from "@storybook/react-vite";
import { CSSProperties } from "react";

import {
  TimelaneLayout,
  TimelaneLayoutAside,
  TimelaneLayoutBackground,
  TimelaneLayoutBody,
  TimelaneLayoutCorner,
  TimelaneLayoutFooter,
  TimelaneLayoutHeader,
} from "./TimelaneLayout";

const meta = {
  component: TimelaneLayout,
  tags: ["autodocs"],
  subcomponents: {
    TimelaneLayoutHeader,
    TimelaneLayoutAside,
    TimelaneLayoutBody,
    TimelaneLayoutFooter,
    TimelaneLayoutBackground,
    TimelaneLayoutCorner,
  },
} satisfies Meta<typeof TimelaneLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const style: CSSProperties = {
  boxSizing: "border-box",
  padding: "20px",
  border: "1px solid lightgray",
  width: "100%",
  height: "100%",
  backgroundImage:
    "linear-gradient(45deg, #f0f0f0 25%, #ffffff 25%, #ffffff 50%, #f0f0f0 50%, #f0f0f0 75%, #ffffff 75%, #ffffff 100%)",
  backgroundSize: "56.57px 56.57px",
};

export const Primary: Story = {
  args: {},
  render: (args) => (
    <TimelaneLayout>
      <TimelaneLayout.Header>
        <div style={style}>header</div>
      </TimelaneLayout.Header>
      <TimelaneLayout.Aside>
        <div style={style}>aside</div>
      </TimelaneLayout.Aside>
      <TimelaneLayout.Aside side="right">
        <div style={style}>aside</div>
      </TimelaneLayout.Aside>
      <TimelaneLayout.Body>
        <div
          style={{
            ...style,
            width: "2000px",
            height: "1000px",
            border: "none",
          }}
        >
          body
        </div>
      </TimelaneLayout.Body>
      <TimelaneLayout.Footer>
        <div style={style}>footer</div>
      </TimelaneLayout.Footer>
      <TimelaneLayout.Corner corner="top left">
        <div style={{ padding: "20px" }}>corner</div>
      </TimelaneLayout.Corner>
      <TimelaneLayout.Corner corner="top right">
        <div style={{ padding: "20px" }}>corner</div>
      </TimelaneLayout.Corner>
      <TimelaneLayout.Corner corner="bottom left">
        <div style={{ padding: "20px" }}>corner</div>
      </TimelaneLayout.Corner>
      <TimelaneLayout.Corner corner="bottom right">
        <div style={{ padding: "20px" }}>corner</div>
      </TimelaneLayout.Corner>
    </TimelaneLayout>
  ),
  decorators: (Story) => (
    <div
      style={{
        width: "100%",
        height: "600px",
        position: "relative",
        border: "1px solid blue",
      }}
    >
      <Story />
    </div>
  ),
};
