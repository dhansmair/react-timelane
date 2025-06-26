import DropTarget from "./DropTarget";
import DropPreview from "./DropPreview";
import { format } from "date-fns";

import { MouseEvent, ReactElement, useState } from "react";
import { addDays, setHours } from "date-fns";
import {
  getItemRectangle,
  getDropTargetDimensions as getLaneDimensions,
  getUpdatedItem as getUpdatedItem,
  getAvailableSpace,
  getDropPreviewRectangle,
  getOverlap,
} from "../utils";
import TimelaneItem from "../TimelaneItem/TimelaneItem";
import OverlapIndicator from "./OverlapIndicator";

import {
  AvailableSpace,
  Item,
  Dimensions,
  GrabInfo,
  Grid,
  Position,
  Rectangle,
  isItem,
  LaneId,
  Lane,
} from "../../types";
import { useTimelaneContext } from "../../hooks/useTimelaneContext";

export interface TimelaneLaneProps<T> {
  id: LaneId;
  capacity?: number;
  items?: Item<T>[];
  focused?: boolean;
  onItemUpdate?: (item: Item<T>) => void;
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
  renderItem?: (item: Item<T>, isDragged: boolean) => ReactElement;
  onResizeStart?: (data: T) => void;
}

/**
 * `<TimelaneLane>` (or `<Timelane.Lane>`) is a container for items. It takes care of
 * rendering items, drop previews, and overlap indicators. It is also the drop target for DnD functionality.
 *
 * It must be a child component of `<TimelaneBody>`.
 */
export function TimelaneLane<T>({
  id,
  capacity = 100,
  items = [],
  focused = false,
  onItemUpdate = () => {},
  onMouseUp = () => {},
  onClick = () => {},
  onDoubleClick = () => {},
  onContextMenu = () => {},
  renderItem = defaultRenderItem,
  onResizeStart = () => {},
}: TimelaneLaneProps<T>) {
  const lane: Lane = { id, capacity };
  const { settings } = useTimelaneContext();

  const grid: Grid = {
    x: settings.pixelsPerDay,
    offsetX: settings.pixelsPerDay / 2,
  };

  const dimensions: Dimensions = getLaneDimensions(lane, settings, settings);

  const [draggedItem, setDraggedItem] = useState<Item<T> | null>(null);

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

    return relativePxOffsetY * capacity;
  }

  function handleDrag(mousePos: Position, grabInfo: GrabInfo, data: object) {
    if (!isItem(data)) return;

    const newDropPreviewRect: Rectangle | null = getDropPreviewRectangle(
      lane,
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

  function handleDrop(mousePos: Position, grabInfo: GrabInfo, data: Item<T>) {
    if (!isItem(data) || dropPreviewRect === null) return;

    const updatedItem: Item<T> = getUpdatedItem<T>(
      data,
      lane,
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
      lane,
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
    ...getItemRectangle(x, lane, settings, settings),
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
      id={`timelane-lane-${id}`}
      className={`timelane-lane ${focused ? "timelane-lane-focused" : ""}`}
      data-timelane-lane-id={id}
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
          <TimelaneItem<T>
            key={index}
            item={item}
            settings={settings}
            lane={lane}
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
          </TimelaneItem>
        ))}
        {dropPreviewRect && <DropPreview {...dropPreviewRect}></DropPreview>}

        {overlaps.map((overlap, index) => (
          <OverlapIndicator overlap={overlap} key={index} />
        ))}
      </DropTarget>
    </div>
  );
}

function defaultRenderItem<T>(item: Item<T>, isDragged: boolean): ReactElement {
  return (
    <div>
      {item.id} ({format(item.start, "yyyy-mm-dd")} -{" "}
      {format(item.end, "yyyy-mm-dd")}){isDragged ? "dragging" : ""}
    </div>
  );
}
