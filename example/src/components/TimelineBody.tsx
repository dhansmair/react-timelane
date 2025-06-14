import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import TimelineAllocationV3 from "./TimelineAllocationV3";
import { doOverlap } from "react-timeline-calendar";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  type TimeRange,
  type Pixels,
  type AvailableSpace,
  type CoreItem,
  type CoreResource,
  type AllocationId,
  CoreSwimlane,
} from "react-timeline-calendar";
import "./core/style.scss";
import type Allocation from "../models/Allocation";
import type Area from "../models/Area";

interface TimelineBodyProps {
  range: TimeRange;
  allocations: Allocation[];
  selectedAllocationIds: AllocationId[];
  areas: Area[];
  pixels: Pixels;
  focusedArea?: Area | null;
  allowOverlaps: boolean;
  onAllocationClick?: (allocation: Allocation, e: MouseEvent) => void;
  onAllocationContextMenu?: (allocation: Allocation, e: MouseEvent) => void;
  onAllocationUpdate: (allocation: Allocation) => void;
  onAreaClick?: (area: Area, e: MouseEvent) => void;
  onAreaDoubleClick?: (
    area: Area,
    when: Date,
    availableSpace: AvailableSpace | null,
    e: MouseEvent
  ) => void;
  setSelectedAllocationIds: Dispatch<SetStateAction<AllocationId[]>>;
}

export default function TimelineBody({
  range,
  areas,
  allocations,
  selectedAllocationIds,
  pixels,
  focusedArea = null,
  allowOverlaps,
  onAllocationClick = () => {},
  onAllocationContextMenu = () => {},
  onAllocationUpdate,
  onAreaClick = () => {},
  onAreaDoubleClick = () => {},
  setSelectedAllocationIds,
}: TimelineBodyProps) {
  // callback to store a temporal click event listener
  // to prevent click events firing after 'mouse up' when selection mode was used.
  const callbackRef = useRef<EventListener | null>(null);

  function handleItemUpdate(item: CoreItem<Allocation>) {
    console.info("updated item", item);

    const newAllocation: Allocation = {
      ...item.payload,
      resourceId: item.swimlaneId,
      start: item.start.toISOString(),
      end: item.end.toISOString(),
      size: item.size,
      offset: item.offset,
    };

    onAllocationUpdate(newAllocation);
  }

  const [mouseDownPos, setMouseDownPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    return monitorForElements({
      onDragStart: (args) => {
        setSelectedAllocationIds([args.source.data.id as number]);
      },
    });
  }, []);

  function handleMouseDown(e: MouseEvent) {
    if (!e.shiftKey && !e.ctrlKey) {
      setSelectedAllocationIds([]);
    }
    setMouseDownPos({ x: e.clientX, y: e.clientY });
  }

  function handleMouseMove(e: MouseEvent) {
    if (mouseDownPos) {
      const selectedRect = {
        x: Math.min(e.clientX, mouseDownPos.x),
        y: Math.min(e.clientY, mouseDownPos.y),
        width: Math.abs(e.clientX - mouseDownPos.x),
        height: Math.abs(e.clientY - mouseDownPos.y),
      };

      const rect = e.currentTarget.getBoundingClientRect();
      setSelectionRect({
        ...selectedRect,
        x: selectedRect.x - rect.left,
        y: selectedRect.y - rect.top,
      });

      document.querySelectorAll(".timeline-drop-target").forEach((row) => {
        if (doOverlap(row.getBoundingClientRect(), selectedRect)) {
          row.querySelectorAll(".timeline-drag-item").forEach((item) => {
            if (doOverlap(item.getBoundingClientRect(), selectedRect)) {
              item.classList.add("timeline-drag-item-marked");
            } else {
              item.classList.remove("timeline-drag-item-marked");
            }
          });
        }
      });

      if (
        (selectedRect.width > 5 || selectedRect.height > 5) &&
        !callbackRef.current
      ) {
        callbackRef.current = captureClick;
        window.addEventListener("click", captureClick, true);
      }
    }
  }

  function handleMouseUp(e: MouseEvent) {
    if (mouseDownPos && selectionRect) {
      e.stopPropagation();
      const selectedRect = {
        x: Math.min(e.clientX, mouseDownPos.x),
        y: Math.min(e.clientY, mouseDownPos.y),
        width: Math.abs(e.clientX - mouseDownPos.x),
        height: Math.abs(e.clientY - mouseDownPos.y),
      };

      const ids: AllocationId[] = Array.from(
        document.querySelectorAll(".timeline-drop-target")
      )
        .filter((row) => doOverlap(row.getBoundingClientRect(), selectedRect))
        .map((row) => Array.from(row.querySelectorAll(".timeline-drag-item")))
        .flatMap((els) => els)
        .filter((item) => doOverlap(item.getBoundingClientRect(), selectedRect))
        .map((item) =>
          Number.parseInt(
            item.querySelector(".timeline-allocation")?.dataset.allocationId
          )
        );

      if (ids.length > 0) {
        if (e.shiftKey || e.ctrlKey) {
          setSelectedAllocationIds((prev) => {
            return Array.from(new Set([...prev, ...ids]));
          });
        } else {
          setSelectedAllocationIds(ids);
        }
      }

      document.querySelectorAll(".timeline-drag-item-marked").forEach((el) => {
        el.classList.remove("timeline-drag-item-marked");
      });
    }

    setMouseDownPos(null);
    setSelectionRect(null);

    if (callbackRef.current && callbackRef.current !== null) {
      requestAnimationFrame(() => {
        window.removeEventListener("click", callbackRef.current, true);
        callbackRef.current = null;
      });
    }
  }

  return (
    <div
      className="timeline-body"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {selectionRect && (
        <div
          id="mouse-selection-indicator"
          style={{
            border: "1px dashed blue",
            position: "absolute",

            top: `${selectionRect.y}px`,
            left: `${selectionRect.x}px`,
            width: `${selectionRect.width}px`,
            height: `${selectionRect.height}px`,
            zIndex: 1000000,
          }}
        ></div>
      )}
      {areas.map((area, index) => {
        const resource: CoreResource = {
          id: area.id,
          capacity: area.width * area.height,
        };

        const items: CoreItem<Allocation>[] = allocations
          .filter((a) => a.resourceId === area.id)
          .map((a: Allocation) => ({
            ...a,
            swimlaneId: a.resourceId,
            start: new Date(a.start),
            end: new Date(a.end),
            payload: a,
          }));

        return (
          <CoreSwimlane<Allocation>
            key={index}
            range={range}
            swimlane={resource}
            items={items}
            pixels={pixels}
            focused={focusedArea !== null && focusedArea.id === area.id}
            onItemUpdate={handleItemUpdate}
            onClick={(when, space, e) => {
              onAreaClick(area, e);
            }}
            allowOverlaps={allowOverlaps}
            onDoubleClick={(when, availableSpace, e) => {
              onAreaDoubleClick(area, when, availableSpace, e);
            }}
            onResizeStart={(allocation: Allocation) => {
              setSelectedAllocationIds([allocation.id]);
            }}
            renderItem={(item, isDragged) => {
              return (
                <TimelineAllocationV3
                  allocation={item.payload}
                  isSelected={
                    !!selectedAllocationIds.find((id) => id === item.payload.id)
                  }
                  isDragged={isDragged}
                  onClick={onAllocationClick}
                  onContextMenu={onAllocationContextMenu}
                />
              );
            }}
          />
        );
      })}
    </div>
  );
}

function captureClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}
