import CoreItem, { isCoreItem } from "../types/CoreItem";
import DropTarget from "./DropTarget";
import CoreResource from "../types/CoreResource";
import DropPreview from "./DropPreview";

import { MouseEvent, ReactElement, useState } from "react";
import { addDays, setHours } from "date-fns";
import Pixels from "../types/Pixels";
import Position from "../types/Position";
import TimeRange from "../types/TimeRange";
import Grid from "../types/Grid";
import Rectangle from "../types/Rectangle";
import GrabInfo from "../types/GrabInfo";
import AvailableSpace from "../types/AvailableSpace";
import {
  getAllocationRectangle,
  getDropTargetDimensions as getSwimlaneDimensions,
  getUpdatedAllocation as getUpdatedItem,
} from "../utils";
import {
  getAvailableSpace,
  getDropPreviewRectangle,
  getOverlap,
} from "./utils";
import CoreItemComponent from "../CoreItem/CoreItemComponent";
import Dimensions from "../types/Dimensions";

interface CoreSwimlaneProps<T> {
  range: TimeRange;
  resource: CoreResource;
  items: CoreItem<T>[];
  pixels: Pixels;
  focused?: boolean;
  allowOverlaps: boolean;
  onItemUpdate: (item: CoreItem<T>) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onClick?: (
    when: Date,
    availableSpace: AvailableSpace | null,
    e: MouseEvent
  ) => void;
  onDoubleClick?: (
    when: Date,
    availableSpace: AvailableSpace | null,
    e: MouseEvent
  ) => void;
  onContextMenu?: (when: Date, e: MouseEvent) => void;
  renderItem: (item: CoreItem<T>, isDragged: boolean) => ReactElement;
  onResizeStart: (data: T) => void;
}

export default function CoreSwimlane<T>({
  range,
  resource,
  items,
  pixels,
  focused = false,
  allowOverlaps,
  onItemUpdate,
  onMouseUp = () => {},
  onClick = () => {},
  onDoubleClick = () => {},
  onContextMenu = () => {},
  renderItem,
  onResizeStart,
}: CoreSwimlaneProps<T>) {
  const grid: Grid = {
    x: pixels.pixelsPerDay,
    offsetX: pixels.pixelsPerDay / 2,
  };

  const dimensions: Dimensions = getSwimlaneDimensions(resource, pixels, range);

  const [draggedItem, setDraggedItem] = useState<CoreItem<T> | null>(null);

  const [dropPreviewRect, setDropPreviewRect] = useState<Rectangle | null>(
    null
  );

  function getMouseEventDate(e: React.MouseEvent) {
    const clientRect = e.currentTarget.getBoundingClientRect();
    return setHours(
      addDays(range.start, (e.clientX - clientRect.left) / pixels.pixelsPerDay),
      12
    );
  }

  function getMouseEventOffset(e: React.MouseEvent) {
    const clientRect = e.currentTarget.getBoundingClientRect();
    const relativePxOffsetY = (e.pageY - clientRect.top) / clientRect.height;

    return relativePxOffsetY * resource.capacity;
  }

  function handleDrag(mousePos: Position, grabInfo: GrabInfo, data: any) {
    if (!isCoreItem(data)) return;

    const newDropPreviewRect: Rectangle | null = getDropPreviewRectangle(
      resource,
      items,
      data,
      mousePos,
      grabInfo,
      pixels,
      grid,
      range,
      allowOverlaps
    );

    setDropPreviewRect(newDropPreviewRect);
  }

  function handleDrop(
    mousePos: Position,
    grabInfo: GrabInfo,
    data: CoreItem<T>
  ) {
    if (!isCoreItem(data) || dropPreviewRect === null) return;

    const updatedItem: CoreItem<T> = getUpdatedItem<T>(
      data,
      resource,
      dropPreviewRect,
      pixels,
      range
    );

    onItemUpdate(updatedItem);
    setDropPreviewRect(null);
  }

  function handleDragLeave() {
    setDropPreviewRect(null);
  }

  function handleClick(e: React.MouseEvent, type: "single" | "double") {
    const clickedDate = getMouseEventDate(e);
    const clickedOffset = getMouseEventOffset(e);

    const availableSpace: AvailableSpace | null = getAvailableSpace(
      clickedDate,
      clickedOffset,
      resource,
      items,
      range
    );

    if (type == "single") {
      onClick(clickedDate, availableSpace, e);
    } else {
      onDoubleClick(clickedDate, availableSpace, e);
    }
  }

  const rects = items.map((x) => ({
    id: x.id,
    ...getAllocationRectangle(x, resource, range, pixels),
  }));

  const overlaps: Rectangle[] = rects
    .flatMap((x) =>
      rects.map((y) => {
        if (x.id < y.id) {
          const overlap = getOverlap(x, y);
          return overlap;
        } else {
          return null;
        }
      })
    )
    .filter((x) => x !== null);

  return (
    <div
      className={`timeline-row ${focused ? "timeline-row-focused" : ""}`}
      style={dimensions}
      onMouseUp={onMouseUp}
      onClick={(e) => handleClick(e, "single")}
      onDoubleClick={(e) => handleClick(e, "double")}
      onContextMenu={(e) => {
        onContextMenu(getMouseEventDate(e), e);
      }}
    >
      <DropTarget
        onDrag={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {items.map((item, index) => (
          <CoreItemComponent<T>
            key={index}
            item={item}
            range={range}
            resource={resource}
            pixels={pixels}
            onDragStart={() => {
              setDraggedItem(item);
            }}
            onDrag={() => {}}
            onDrop={() => {
              setDraggedItem(null);
            }}
            onUpdate={onItemUpdate}
            onResizeStart={() => {
              onResizeStart(item.payload);
            }}
          >
            {renderItem(
              item,
              draggedItem !== null && draggedItem.id === item.id
            )}
          </CoreItemComponent>
        ))}
        {dropPreviewRect && <DropPreview {...dropPreviewRect}></DropPreview>}

        {overlaps.map((overlap, index) => (
          <OverlapIndicator overlap={overlap} key={index} />
        ))}
      </DropTarget>
    </div>
  );
}

function OverlapIndicator({ overlap }: { overlap: Rectangle }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${overlap.x}px`,
        top: `${overlap.y}px`,
        width: `${overlap.width - 1}px`,
        height: `${overlap.height - 1}px`,
        background: `rgba(255,0,0, 0.3)`,
        marginLeft: "1px",
        pointerEvents: "none",
      }}
    ></div>
  );
}
