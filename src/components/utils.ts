import {
  DragLocationHistory,
  ElementDragPayload,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { addDays, differenceInCalendarDays, setHours } from "date-fns";
import {
  Item,
  Dimensions,
  Pixels,
  Position,
  Rectangle,
  Lane,
  TimeRange,
} from "../types";
import { max, min } from "date-fns";
import {
  AvailableSpace,
  DateBounds,
  GrabInfo,
  Grid,
  OffsetBounds,
} from "../types";

export function getDropTargetDimensions(
  lane: Lane,
  pixels: Pixels,
  range: TimeRange
): Dimensions {
  const width = getDropTargetWidth(lane, pixels, range);
  const height = getDropTargetHeight(lane, pixels);

  return { width, height };
}

export function getDropTargetHeight(lane: Lane, pixels: Pixels): number {
  return pixels.pixelsPerResource;
}

export function getDropTargetWidth(
  lane: Lane,
  pixels: Pixels,
  range: TimeRange
): number {
  return Math.abs(
    (differenceInCalendarDays(range.end, range.start) + 1) * pixels.pixelsPerDay
  );
}

export function getItemRectangle<T>(
  item: Item<T>,
  lane: Lane,
  range: TimeRange,
  pixels: Pixels
): Rectangle {
  const dimensions = getItemDimensions(item, lane, pixels);
  const position = getItemPosition(item, lane, range.start, pixels);

  return {
    ...dimensions,
    ...position,
  };
}

export function getItemDimensions<T>(
  item: Item<T>,
  lane: Lane,
  pixels: Pixels
): Dimensions {
  const width =
    differenceInCalendarDays(item.end, item.start) * pixels.pixelsPerDay;

  const height = (item.size / lane.capacity) * pixels.pixelsPerResource;

  return { width, height };
}

export function dateToPixel(date: Date, start: Date, pixels: Pixels) {
  return (
    differenceInCalendarDays(date, start) * pixels.pixelsPerDay +
    pixels.pixelsPerDay / 2
  );
}

export function offsetToPixel(
  offset: number,
  capacity: number,
  pixels: Pixels
) {
  return (offset / capacity) * pixels.pixelsPerResource;
}

export function getItemPosition<T>(
  item: Item<T>,
  lane: Lane,
  start: Date,
  pixels: Pixels
): Position {
  const x = dateToPixel(item.start, start, pixels);
  const y = offsetToPixel(item.offset, lane.capacity, pixels);

  return { x, y };
}

export function getGrabPosition(
  source: ElementDragPayload,
  location: DragLocationHistory
) {
  const sourceRect = source.element.getBoundingClientRect();

  const grabPosition: Position = {
    x: sourceRect.x - location.initial.input.pageX,
    y: sourceRect.y - location.initial.input.pageY,
  };

  const relativeGrabPosition: Position = {
    x: grabPosition.x / sourceRect.width,
    y: grabPosition.y / sourceRect.height,
  };

  return {
    absolute: grabPosition,
    relative: relativeGrabPosition,
  };
}

export function getUpdatedItem<T>(
  oldItem: Item<T>,
  swimlane: Lane,
  dropPreviewRect: Rectangle,
  pixels: Pixels,
  range: TimeRange
): Item<T> {
  // convert drop preview position to item
  return {
    id: oldItem.id,
    swimlaneId: swimlane.id,

    start: setHours(
      addDays(range.start, Math.floor(dropPreviewRect.x / pixels.pixelsPerDay)),
      12
    ),
    end: setHours(
      addDays(
        range.start,
        Math.floor(
          (dropPreviewRect.x + dropPreviewRect.width) / pixels.pixelsPerDay
        )
      ),
      12
    ),
    offset: Math.floor(
      (dropPreviewRect.y / pixels.pixelsPerResource) * swimlane.capacity
    ),
    size: Math.floor(
      (dropPreviewRect.height / pixels.pixelsPerResource) * swimlane.capacity
    ),
    payload: oldItem.payload,
  };
}

export function getDropPreviewRectangle<S, T>(
  swimlane: Lane,
  items: Item<T>[],
  item: Item<S>,
  mousePosition: Position | null,
  grabInfo: GrabInfo,
  pixels: Pixels,
  grid: Grid,
  range: TimeRange,
  allowOverlaps: boolean
): Rectangle | null {
  if (mousePosition === null) {
    return null;
  }

  const dropTargetDimensions: Dimensions = getDropTargetDimensions(
    swimlane,
    pixels,
    range
  );

  const itemRectangles: Rectangle[] = items
    .filter((a) => a.id !== item.id)
    .map((a) => getItemRectangle(a, swimlane, range, pixels));

  let dropPreviewRectangle: Rectangle | null = null;

  dropPreviewRectangle = getRectangleUnderCursor(
    swimlane,
    item,
    grabInfo,
    pixels,
    mousePosition
  );

  dropPreviewRectangle = fitToGrid(dropPreviewRectangle, grid);

  dropPreviewRectangle = fitToDropTarget(
    dropPreviewRectangle,
    dropTargetDimensions
  );

  dropPreviewRectangle = getNearestDropDestinationWithoutOverlap(
    dropPreviewRectangle,
    itemRectangles,
    dropTargetDimensions,
    allowOverlaps
  );

  return dropPreviewRectangle;
}

/**
 * computes rectangle for DropPreview that is under the cursor, in pixel coordinates relative to the current DropTarget
 * @param dragData
 * @param swimlane
 * @param pixels
 * @param mousePosition
 * @returns
 */
function getRectangleUnderCursor<T>(
  swimlane: Lane,
  item: Item<T>,
  grabInfo: GrabInfo,
  pixels: Pixels,
  mousePosition: Position
): Rectangle {
  const { width, height } = getItemDimensions(item, swimlane, pixels);
  const x = mousePosition.x + width * grabInfo.relative.x;
  const y = mousePosition.y + height * grabInfo.relative.y;

  return {
    x,
    y,
    width,
    height,
  };
}

function fitToDropTarget(
  rect: Rectangle,
  dropTargetDimensions: Dimensions
): Rectangle {
  // adjust coordinates to always be in DropTarget rectangle

  const x = Math.max(
    0,
    Math.min(rect.x, dropTargetDimensions.width - rect.width)
  );
  const y = Math.max(
    0,
    Math.min(rect.y, dropTargetDimensions.height - rect.height)
  );

  return {
    ...rect,
    x,
    y,
  };
}

function fitToGrid(rect: Rectangle, grid: Grid | null | undefined): Rectangle {
  const destination = {
    ...rect,
  };

  if (grid && grid.x) {
    destination.x = roundToNearest(destination.x, grid.x, grid.offsetX || 0);
  }

  if (grid && grid.y) {
    destination.y = roundToNearest(destination.y, grid.y, grid.offsetY || 0);
  }

  return destination;
}

function roundToNearest(
  value: number,
  interval: number,
  offset: number
): number {
  return Math.max(
    offset,
    offset + Math.round((value - offset) / interval) * interval
  );
}

function getNearestDropDestinationWithoutOverlap(
  item: Rectangle,
  allItems: Rectangle[],
  targetDimensions: Dimensions,
  allowOverlaps: boolean
): Rectangle | null {
  const newItem: Rectangle = {
    ...item,
  };

  if (!allowOverlaps) {
    let isOverlapping = true;

    while (isOverlapping) {
      const firstOverlapping: Rectangle | undefined = allItems.find((other) => {
        return doOverlap(newItem, other);
      });

      if (firstOverlapping !== undefined) {
        // move the element below the one it overlaps with
        newItem.y = firstOverlapping.y + firstOverlapping.height;
      } else {
        isOverlapping = false;
      }
    }
  }

  if (!isWithinTargetDimensions(newItem, targetDimensions)) {
    return null;
  } else {
    return newItem;
  }
}

/**
 * Returns true if two rectangles (l1, r1) and (l2, r2) overlap
 * @param a
 * @param b
 * @returns
 */
export function doOverlap(a: Rectangle, b: Rectangle): boolean {
  if (a.x >= b.x + b.width || b.x >= a.x + a.width) {
    return false;
  }

  if (a.y >= b.y + b.height || b.y >= a.y + a.height) {
    return false;
  }

  return true;
}

export function getOverlap(a: Rectangle, b: Rectangle): Rectangle | null {
  // Calculate the coordinates of the overlapping region
  const overlapX1 = Math.max(a.x, b.x);
  const overlapY1 = Math.max(a.y, b.y);
  const overlapX2 = Math.min(a.x + a.width, b.x + b.width);
  const overlapY2 = Math.min(a.y + a.height, b.y + b.height);

  // Check if there is an overlap
  if (overlapX1 < overlapX2 && overlapY1 < overlapY2) {
    return {
      x: overlapX1,
      y: overlapY1,
      width: overlapX2 - overlapX1,
      height: overlapY2 - overlapY1,
    };
  } else {
    // No overlap
    return null;
  }
}

export function itemsDoOverlap<T>(a: Item<T>, b: Item<T>): boolean {
  if (
    a.start >= b.end ||
    b.start >= a.end ||
    a.offset >= b.offset + b.size ||
    b.offset >= a.offset + a.size
  ) {
    return false;
  }

  return true;
}

export function isWithinTargetDimensions(
  item: Rectangle,
  targetDimensions: Dimensions
): boolean {
  return (
    item.x >= 0 &&
    item.y >= 0 &&
    item.x + item.width <= targetDimensions.width &&
    item.y + item.height <= targetDimensions.height
  );
}

export function getAvailableSpace<T>(
  clickedDate: Date,
  clickedOffset: number,
  swimlane: Lane,
  items: Item<T>[],
  range: TimeRange
): AvailableSpace | null {
  const offsetBounds = getOffsetBounds(
    clickedDate,
    clickedOffset,
    swimlane.capacity,
    items
  );

  if (offsetBounds) {
    const dateBounds = getDateBounds(
      clickedDate,
      range.start,
      range.end,
      items,
      offsetBounds
    );

    if (dateBounds) {
      return {
        start: dateBounds.lower,
        end: dateBounds.upper,
        minOffset: offsetBounds.lower,
        maxOffset: offsetBounds.upper,
      };
    }
  }

  return null;
}

function getOffsetBounds<T>(
  clickedDate: Date,
  clickedOffset: number,
  maxUpperBound: number,
  items: Item<T>[]
): null | OffsetBounds {
  const allocationsAtDate: Item<T>[] = items.filter((a) => {
    return a.start <= clickedDate && a.end >= clickedDate;
  });

  // 1. check if there is an allocation at the place where the click occurred
  const allocationAtClick: Item<T> | undefined = allocationsAtDate.find(
    (a) => a.offset <= clickedOffset && a.offset + a.size >= clickedOffset
  );

  if (allocationAtClick) {
    return null;
  }
  // part remaining allocations by whether they are above or below the click
  const allocationsAboveClick = allocationsAtDate.filter((a) => {
    return a.offset + a.size <= clickedOffset;
  });

  const allocationsBelowClick = allocationsAtDate.filter((a) => {
    return a.offset >= clickedOffset;
  });

  // the minimum available space in offset coordinates is the
  // maximum (offset + size) of all allocations above
  const lowerOffsetBound =
    allocationsAboveClick.length > 0
      ? Math.max(...allocationsAboveClick.map((a) => a.offset + a.size))
      : 0;

  const upperOffsetBound =
    allocationsBelowClick.length > 0
      ? Math.min(...allocationsBelowClick.map((a) => a.offset))
      : maxUpperBound;

  return {
    lower: lowerOffsetBound,
    upper: upperOffsetBound,
  };
}

function getDateBounds<T>(
  clickedDate: Date,
  minLowerBound: Date,
  maxUpperBound: Date,
  items: Item<T>[],
  offsetBounds: OffsetBounds
): DateBounds | null {
  const dummyItem: Item<null> = {
    id: -1,
    swimlaneId: -1,
    start: minLowerBound,
    end: maxUpperBound,
    offset: offsetBounds.lower,
    size: offsetBounds.upper - offsetBounds.lower,
    payload: null,
  };

  const overlappingItems: Item<T>[] = items.filter((a) =>
    itemsDoOverlap(a, dummyItem)
  );

  if (overlappingItems.length === 0) {
    return {
      lower: minLowerBound,
      upper: maxUpperBound,
    };
  }

  const itemsBefore = overlappingItems.filter((a) => a.end <= clickedDate);

  const itemsAfter = overlappingItems.filter((a) => a.start >= clickedDate);

  // the minimum available space in offset coordinates is the
  // maximum (offset + size) of all allocations above
  const lowerDateBound =
    itemsBefore.length > 0 ? max(itemsBefore.map((a) => a.end)) : minLowerBound;
  const upperDateBound =
    itemsAfter.length > 0 ? min(itemsAfter.map((a) => a.start)) : maxUpperBound;

  return {
    lower: lowerDateBound,
    upper: upperDateBound,
  };
}
