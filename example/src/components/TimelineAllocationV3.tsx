import { type MouseEvent, useRef } from "react";
import { format } from "date-fns";
import type Allocation from "../models/Allocation";
import { Tooltip } from "@mui/material";

const SCALE_THRESHOLD_IN_PX = 30;

interface TimelineAllocationV3Props {
  allocation: Allocation;
  isSelected?: boolean;
  isDragged?: boolean;
  onClick: (allocation: Allocation, e: MouseEvent) => void;
  onContextMenu: (allocation: Allocation, e: MouseEvent) => void;
}
export default function TimelineAllocationV3({
  allocation,
  isSelected = false,
  isDragged = false,
  onClick,
  onContextMenu,
}: TimelineAllocationV3Props) {
  // const { t } = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  let scale = 1;

  if (ref.current) {
    const height = ref.current.getBoundingClientRect().height;

    if (height < SCALE_THRESHOLD_IN_PX) {
      scale = height / SCALE_THRESHOLD_IN_PX;
    }
  }

  const color = "blue";

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
            {format(new Date(allocation.start), "YYYY-mm-dd")}
            &nbsp;-&nbsp;
            {format(new Date(allocation.end), "YYYY-mm-dd")}
          </div>
          <div>{allocation.description}</div>
        </div>
      }
    >
      <div
        className={`timeline-allocation ${
          isSelected ? "timeline-allocation-selected" : ""
        }`}
        onClick={(e) => onClick(allocation, e)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(allocation, e);
        }}
        ref={ref}
        style={{
          background: color,
        }}
        data-allocation-id={`${allocation.id}`}
      >
        <div
          className="timeline-allocation-title"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {allocation.name}
        </div>
        <div style={{ fontSize: "small" }}>{allocation.description}</div>
      </div>
    </Tooltip>
  );
}
