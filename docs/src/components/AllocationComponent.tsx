import { type MouseEvent, useRef } from "react";
import { format } from "date-fns";
import type Allocation from "../models/Allocation";
import { Tooltip } from "@mui/material";

const SCALE_THRESHOLD_IN_PX = 30;

interface AllocationComponentProps {
  allocation: Allocation;
  isSelected?: boolean;
  isDragged?: boolean;
  onClick: (allocation: Allocation, e: MouseEvent) => void;
  onContextMenu: (allocation: Allocation, e: MouseEvent) => void;
}
export default function AllocationComponent({
  allocation,
  isSelected = false,
  isDragged = false,
  onClick,
  onContextMenu,
}: AllocationComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  let scale = 1;

  if (ref.current) {
    const height = ref.current.getBoundingClientRect().height;

    if (height > 0 && height < SCALE_THRESHOLD_IN_PX) {
      scale = height / SCALE_THRESHOLD_IN_PX;
    }
  }

  return (
    <Tooltip
      arrow
      followCursor
      hidden={isDragged}
      title={
        <div
          style={{
            fontSize: "1.6em",
          }}
        >
          <div>
            {format(new Date(allocation.start), "yyyy-MM-dd")}
            &nbsp;-&nbsp;
            {format(new Date(allocation.end), "yyyy-MM-dd")}
          </div>
          <div>{allocation.description}</div>
        </div>
      }
    >
      <div
        className={`timelane-allocation ${
          isSelected ? "timelane-allocation-selected" : ""
        }`}
        onClick={(e) => onClick(allocation, e)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(allocation, e);
        }}
        ref={ref}
        style={{
          background: allocation.color,
        }}
        data-allocation-id={`${allocation.id}`}
      >
        <div
          className="timelane-allocation-title"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {allocation.name} (#{allocation.id})
        </div>
        <div style={{ fontSize: "small" }}>{allocation.description}</div>
      </div>
    </Tooltip>
  );
}
