import { max, min } from "date-fns";
import AvailableSpace from "../types/AvailableSpace";
import CoreItem from "../types/CoreItem";
import CoreResource from "../types/CoreResource";
import Dimensions from "../types/Dimensions";
import {
  getAllocationDimensions,
  getAllocationRectangle,
  getDropTargetDimensions,
} from "../utils";
import DateBounds from "./types/DateBounds";
import OffsetBounds from "./types/OffsetBounds";
import Position from "../types/Position";
import GrabInfo from "../types/GrabInfo";
import Pixels from "../types/Pixels";
import Grid from "../types/Grid";
import TimeRange from "../types/TimeRange";
import Rectangle from "../types/Rectangle";

export function getDropPreviewRectangle(
  resource: CoreResource,
  allocations: CoreItem<any>[],
  allocation: CoreItem,
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
    resource,
    pixels,
    range
  );

  const allocationRectangles: Rectangle[] = allocations
    .filter((a) => a.id !== allocation.id)
    .map((a) => getAllocationRectangle(a, resource, range, pixels));

  let dropPreviewRectangle: Rectangle | null = null;

  dropPreviewRectangle = getRectangleUnderCursor(
    resource,
    allocation,
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
    allocationRectangles,
    dropTargetDimensions,
    allowOverlaps
  );

  return dropPreviewRectangle;
}

/**
 * computes rectangle for DropPreview that is under the cursor, in pixel coordinates relative to the current DropTarget
 * @param dragData
 * @param resource
 * @param pixels
 * @param mousePosition
 * @returns
 */
function getRectangleUnderCursor(
  resource: CoreResource,
  allocation: CoreItem,
  grabInfo: GrabInfo,
  pixels: Pixels,
  mousePosition: Position
): Rectangle {
  const { width, height } = getAllocationDimensions(
    allocation,
    resource,
    pixels
  );
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
  let destination = {
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
  let newItem: Rectangle = {
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
 * @param el1
 * @param el2
 * @returns
 */
export function doOverlap(el1: Rectangle, el2: Rectangle): boolean {
  if (el1.x >= el2.x + el2.width || el2.x >= el1.x + el1.width) {
    return false;
  }

  if (el1.y >= el2.y + el2.height || el2.y >= el1.y + el1.height) {
    return false;
  }

  return true;
}

export function getOverlap(
  rect1: Rectangle,
  rect2: Rectangle
): Rectangle | null {
  // Calculate the coordinates of the overlapping region
  const overlapX1 = Math.max(rect1.x, rect2.x);
  const overlapY1 = Math.max(rect1.y, rect2.y);
  const overlapX2 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  const overlapY2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

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

export function alloctionsDoOverlap(
  a: CoreItem<any>,
  b: CoreItem<any>
): boolean {
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

export function getAvailableSpace(
  clickedDate: Date,
  clickedOffset: number,
  resource: CoreResource,
  allocations: CoreItem<any>[],
  range: TimeRange
): AvailableSpace | null {
  const offsetBounds = getOffsetBounds(
    clickedDate,
    clickedOffset,
    resource.capacity,
    allocations
  );

  if (offsetBounds) {
    const dateBounds = getDateBounds(
      clickedDate,
      range.start,
      range.end,
      allocations,
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

function getOffsetBounds(
  clickedDate: Date,
  clickedOffset: number,
  maxUpperBound: number,
  allocations: CoreItem[]
): null | OffsetBounds {
  const allocationsAtDate: CoreItem[] = allocations.filter((a) => {
    return a.start <= clickedDate && a.end >= clickedDate;
  });

  // 1. check if there is an allocation at the place where the click occurred
  const allocationAtClick: CoreItem | undefined = allocationsAtDate.find(
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

function getDateBounds(
  clickedDate: Date,
  minLowerBound: Date,
  maxUpperBound: Date,
  allocations: CoreItem[],
  offsetBounds: OffsetBounds
): DateBounds | null {
  const dummyAllocation: CoreItem<null> = {
    id: -1,
    resourceId: -1,
    start: minLowerBound,
    end: maxUpperBound,
    offset: offsetBounds.lower,
    size: offsetBounds.upper - offsetBounds.lower,
    payload: null,
  };

  const overlappingAllocations: CoreItem[] = allocations.filter((a) =>
    alloctionsDoOverlap(a, dummyAllocation)
  );

  if (overlappingAllocations.length === 0) {
    return {
      lower: minLowerBound,
      upper: maxUpperBound,
    };
  }

  const allocationsBefore = overlappingAllocations.filter(
    (a) => a.end <= clickedDate
  );

  const allocationsAfter = overlappingAllocations.filter(
    (a) => a.start >= clickedDate
  );

  // the minimum available space in offset coordinates is the
  // maximum (offset + size) of all allocations above
  const lowerDateBound =
    allocationsBefore.length > 0
      ? max(allocationsBefore.map((a) => a.end))
      : minLowerBound;
  const upperDateBound =
    allocationsAfter.length > 0
      ? min(allocationsAfter.map((a) => a.start))
      : maxUpperBound;

  return {
    lower: lowerDateBound,
    upper: upperDateBound,
  };
}
