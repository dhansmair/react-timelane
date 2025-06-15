import DropTarget from "./DropTarget";
import DropPreview from "./DropPreview";
import { format } from "date-fns";

import { MouseEvent, ReactElement, useState } from "react";
import { addDays, setHours } from "date-fns";
import {
  getAllocationRectangle,
  getDropTargetDimensions as getSwimlaneDimensions,
  getUpdatedItem as getUpdatedItem,
} from "../utils";
import {
  getAvailableSpace,
  getDropPreviewRectangle,
  getOverlap,
} from "./utils";
import CoreItemComponent from "../CoreItem/CoreItemComponent";
import OverlapIndicator from "./OverlapIndicator";

import {
  AvailableSpace,
  CoreItem,
  Dimensions,
  GrabInfo,
  Grid,
  Position,
  Rectangle,
  SwimlaneT,
  isCoreItem,
} from "../../../types";
import { useTimelineContext } from "../../../hooks/useTimelineContext";

interface CoreSwimlaneProps<T> {
  swimlane: SwimlaneT;
  items: CoreItem<T>[];
  focused?: boolean;
  onItemUpdate?: (item: CoreItem<T>) => void;
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
  renderItem?: (item: CoreItem<T>, isDragged: boolean) => ReactElement;
  onResizeStart?: (data: T) => void;
}

export default function CoreSwimlane<T>({
  swimlane,
  items,
  focused = false,
  onItemUpdate = () => {},
  onMouseUp = () => {},
  onClick = () => {},
  onDoubleClick = () => {},
  onContextMenu = () => {},
  renderItem = defaultRenderItem,
  onResizeStart = () => {},
}: CoreSwimlaneProps<T>) {
  const { settings } = useTimelineContext();

  const grid: Grid = {
    x: settings.pixelsPerDay,
    offsetX: settings.pixelsPerDay / 2,
  };

  const dimensions: Dimensions = getSwimlaneDimensions(
    swimlane,
    settings,
    settings
  );

  const [draggedItem, setDraggedItem] = useState<CoreItem<T> | null>(null);

  const [dropPreviewRect, setDropPreviewRect] = useState<Rectangle | null>(
    null
  );

  function getMouseEventDate(e: React.MouseEvent) {
    const clientRect = e.currentTarget.getBoundingClientRect();
    return setHours(
      addDays(
        settings.start,
        (e.clientX - clientRect.left) / settings.pixelsPerDay
      ),
      12
    );
  }

  function getMouseEventOffset(e: React.MouseEvent) {
    const clientRect = e.currentTarget.getBoundingClientRect();
    const relativePxOffsetY = (e.pageY - clientRect.top) / clientRect.height;

    return relativePxOffsetY * swimlane.capacity;
  }

  function handleDrag(mousePos: Position, grabInfo: GrabInfo, data: object) {
    if (!isCoreItem(data)) return;

    const newDropPreviewRect: Rectangle | null = getDropPreviewRectangle(
      swimlane,
      items,
      data,
      mousePos,
      grabInfo,
      settings,
      grid,
      settings,
      settings.allowOverlaps
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
      swimlane,
      dropPreviewRect,
      settings,
      settings
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
      swimlane,
      items,
      settings
    );

    if (type == "single") {
      onClick(clickedDate, availableSpace, e);
    } else {
      onDoubleClick(clickedDate, availableSpace, e);
    }
  }

  const rects = items.map((x) => ({
    id: x.id,
    ...getAllocationRectangle(x, swimlane, settings, settings),
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
      id={`timeline-swimlane-${swimlane.id}`}
      className={`timeline-swimlane ${
        focused ? "timeline-swimlane-focused" : ""
      }`}
      data-timeline-swimlane-id={swimlane.id}
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
            settings={settings}
            swimlane={swimlane}
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

function defaultRenderItem<T>(
  item: CoreItem<T>,
  isDragged: boolean
): ReactElement {
  return (
    <div>
      {item.id} ({format(item.start, "yyyy-mm-dd")} -{" "}
      {format(item.end, "yyyy-mm-dd")}){isDragged ? "dragging" : ""}
    </div>
  );
}
