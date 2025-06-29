import { PropsWithChildren, useEffect, useState } from "react";
import { dateToPixel, offsetToPixel, getAvailableSpace } from "../utils";
import { addDays, setHours } from "date-fns";
import {
  AvailableSpace,
  Item,
  Pixels,
  Rectangle,
  Lane,
  TimeRange,
} from "../../types";

interface AvailableSpaceIndicatorProps<T> {
  pixels: Pixels;
  range: TimeRange;
  lane: Lane;
  debug: boolean;
  items: Item<T>[];
}

/**
 * A component that displays the available space at the mouse cursor position.
 * The available space is a rectangle that does not overlap with it's surrounding items.
 * It is determined by some heuristics.
 *
 * Only used for debugging purposes.
 *
 * @param param0
 * @returns
 */
export default function AvailableSpaceIndicator<T>({
  pixels,
  range,
  lane,
  items,
  debug = false,
  children,
}: PropsWithChildren<AvailableSpaceIndicatorProps<T>>) {
  const [availableSpace, setAvailableSpace] = useState<AvailableSpace | null>(
    null
  );

  function getDate(e: React.MouseEvent) {
    const clientRect = e.currentTarget.getBoundingClientRect();
    return setHours(
      addDays(range.start, (e.clientX - clientRect.left) / pixels.pixelsPerDay),
      12
    );
  }

  function getOffset(e: React.MouseEvent) {
    const clientRect = e.currentTarget.getBoundingClientRect();
    const relativePxOffsetY = (e.pageY - clientRect.top) / clientRect.height;

    return relativePxOffsetY * lane.capacity;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
      onMouseMove={(e) => {
        if (!debug) return;

        const clickedDate = getDate(e);
        const clickedOffset = getOffset(e);

        const availableSpace: AvailableSpace | null = getAvailableSpace(
          clickedDate,
          clickedOffset,
          lane,
          items,
          range
        );

        setAvailableSpace(availableSpace);
      }}
      onMouseLeave={() => {
        if (!debug) return;
        setAvailableSpace(null);
      }}
    >
      {children}
      <AvailableSpaceIndicatorItem
        availableSpace={availableSpace}
        pixels={pixels}
        lane={lane}
        range={range}
      />
    </div>
  );
}

interface AvailableSpaceIndicatorItemProps {
  availableSpace: AvailableSpace | null;
  range: TimeRange;
  pixels: Pixels;
  lane: Lane;
}

function AvailableSpaceIndicatorItem({
  availableSpace,
  range,
  pixels,
  lane,
}: AvailableSpaceIndicatorItemProps) {
  const [hoverRect, setHoverRect] = useState<Rectangle | null>(null);

  useEffect(() => {
    if (!availableSpace) {
      setHoverRect(null);
      return;
    }

    const x = dateToPixel(availableSpace.start, range.start, pixels);

    const width = dateToPixel(availableSpace.end, range.start, pixels) - x;

    const y = offsetToPixel(availableSpace.minOffset, lane.capacity, pixels);
    const height =
      offsetToPixel(availableSpace.maxOffset, lane.capacity, pixels) - y;

    setHoverRect({
      x,
      y,
      width,
      height,
    });
  }, [availableSpace, pixels, range.start, lane.capacity]);

  return (
    <div
      style={
        hoverRect
          ? {
              position: "absolute",
              top: `${hoverRect.y}px`,
              left: `${hoverRect.x + 1}px`,
              width: `${hoverRect.width - 1}px`,
              height: `${hoverRect.height - 1}px`,
              background: "purple",
              opacity: 0.3,
            }
          : {}
      }
    ></div>
  );
}
