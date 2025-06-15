import {
  DragLocationHistory,
  ElementDragPayload,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { addDays, differenceInCalendarDays, setHours } from "date-fns";
import {
  CoreItem,
  Dimensions,
  Pixels,
  Position,
  Rectangle,
  SwimlaneT,
  TimeRange,
} from "../../types";

export function getDropTargetDimensions(
  swimlane: SwimlaneT,
  pixels: Pixels,
  range: TimeRange
): Dimensions {
  const width = getDropTargetWidth(swimlane, pixels, range);
  const height = getDropTargetHeight(swimlane, pixels);

  return { width, height };
}

export function getDropTargetHeight(
  swimlane: SwimlaneT,
  pixels: Pixels
): number {
  return pixels.pixelsPerResource;
}

export function getDropTargetWidth(
  swimlane: SwimlaneT,
  pixels: Pixels,
  range: TimeRange
): number {
  return Math.abs(
    (differenceInCalendarDays(range.end, range.start) + 1) * pixels.pixelsPerDay
  );
}

export function getAllocationRectangle<T>(
  item: CoreItem<T>,
  swimlane: SwimlaneT,
  range: TimeRange,
  pixels: Pixels
): Rectangle {
  const dimensions = getItemDimensions(item, swimlane, pixels);
  const position = getAllocationPosition(item, swimlane, range.start, pixels);

  return {
    ...dimensions,
    ...position,
  };
}

export function getItemDimensions<T>(
  item: CoreItem<T>,
  swimlane: SwimlaneT,
  pixels: Pixels
): Dimensions {
  const width =
    differenceInCalendarDays(item.end, item.start) * pixels.pixelsPerDay;

  const height = (item.size / swimlane.capacity) * pixels.pixelsPerResource;

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

export function getAllocationPosition<T>(
  item: CoreItem<T>,
  swimlane: SwimlaneT,
  start: Date,
  pixels: Pixels
): Position {
  const x = dateToPixel(item.start, start, pixels);
  const y = offsetToPixel(item.offset, swimlane.capacity, pixels);

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
  oldItem: CoreItem<T>,
  swimlane: SwimlaneT,
  dropPreviewRect: Rectangle,
  pixels: Pixels,
  range: TimeRange
): CoreItem<T> {
  // convert drop preview position to allocation
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
