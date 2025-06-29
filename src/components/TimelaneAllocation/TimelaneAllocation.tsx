import { type MouseEvent, useRef } from "react";

const SCALE_THRESHOLD_IN_PX = 30;

export interface TimelaneAllocationProps {
  name: string;
  description?: string;
  isSelected?: boolean;
  onClick?: (e: MouseEvent) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

/**
 * `TimelaneAllocation` is a reference implementation to demonstrate how an item could be rendered.
 *
 * In the examples, it is passed to the `renderItem()` method of the `<TimelaneLane />` component.
 */
export function TimelaneAllocation({
  name,
  description = "",
  isSelected = false,
  onClick = () => undefined,
  onContextMenu = () => undefined,
}: TimelaneAllocationProps) {
  const ref = useRef<HTMLDivElement>(null);

  let scale = 1;

  if (ref.current) {
    const height = ref.current.getBoundingClientRect().height;

    if (height > 0 && height < SCALE_THRESHOLD_IN_PX) {
      scale = height / SCALE_THRESHOLD_IN_PX;
    }
  }

  return (
    <div
      className={`timelane-allocation ${
        isSelected ? "timelane-allocation-selected" : ""
      }`}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e);
      }}
      ref={ref}
      style={{
        background: "lightblue",
      }}
    >
      <div
        className="timelane-allocation-title"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: "small" }}>{description}</div>
    </div>
  );
}
