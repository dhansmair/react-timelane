import {
    DragLocationHistory,
    ElementDragPayload,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { addDays, differenceInCalendarDays, setHours } from "date-fns";
import CoreItem from "./types/CoreItem";
import CoreResource from "./types/CoreResource";
import Dimensions from "./types/Dimensions";
import Pixels from "./types/Pixels";
import Position from "./types/Position";
import Rectangle from "./types/Rectangle";
import TimeRange from "./types/TimeRange";

export function getDropTargetDimensions(
    resource: CoreResource,
    pixels: Pixels,
    range: TimeRange
): Dimensions {
    const width = getDropTargetWidth(resource, pixels, range);
    const height = getDropTargetHeight(resource, pixels);

    return { width, height };
}

export function getDropTargetHeight(
    resource: CoreResource,
    pixels: Pixels
): number {
    return pixels.pixelsPerResource;
}

export function getDropTargetWidth(
    resource: CoreResource,
    pixels: Pixels,
    range: TimeRange
): number {
    return Math.abs(
        differenceInCalendarDays(range.end, range.start) * pixels.pixelsPerDay
    );
}

export function getAllocationRectangle(
    allocation: CoreItem<any>,
    resource: CoreResource,
    range: TimeRange,
    pixels: Pixels
): Rectangle {
    const dimensions = getAllocationDimensions(allocation, resource, pixels);
    const position = getAllocationPosition(
        allocation,
        resource,
        range.start,
        pixels
    );

    return {
        ...dimensions,
        ...position,
    };
}

export function getAllocationDimensions(
    allocation: CoreItem,
    resource: CoreResource,
    pixels: Pixels
): Dimensions {
    const width =
        differenceInCalendarDays(allocation.end, allocation.start) *
        pixels.pixelsPerDay;

    const height =
        (allocation.size / resource.capacity) * pixels.pixelsPerResource;

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

export function getAllocationPosition(
    allocation: CoreItem,
    resource: CoreResource,
    start: Date,
    pixels: Pixels
): Position {
    const x = dateToPixel(allocation.start, start, pixels);
    const y = offsetToPixel(allocation.offset, resource.capacity, pixels);

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

export function getUpdatedAllocation<T>(
    oldAllocation: CoreItem<T>,
    resource: CoreResource,
    dropPreviewRect: Rectangle,
    pixels: Pixels,
    range: TimeRange
): CoreItem<T> {
    // convert drop preview position to allocation
    return {
        id: oldAllocation.id,
        resourceId: resource.id,

        start: setHours(
            addDays(
                range.start,
                Math.floor(dropPreviewRect.x / pixels.pixelsPerDay)
            ),
            12
        ),
        end: setHours(
            addDays(
                range.start,
                Math.floor(
                    (dropPreviewRect.x + dropPreviewRect.width) /
                        pixels.pixelsPerDay
                )
            ),
            12
        ),
        offset: Math.floor(
            (dropPreviewRect.y / pixels.pixelsPerResource) * resource.capacity
        ),
        size: Math.floor(
            (dropPreviewRect.height / pixels.pixelsPerResource) *
                resource.capacity
        ),
        payload: oldAllocation.payload,
    };
}
