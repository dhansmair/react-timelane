import { MouseEvent, ReactElement } from "react";
import { Pixels, TimeRange } from "../../types";
import {
  differenceInCalendarDays,
  eachWeekOfInterval,
  isSunday,
  nextSunday,
} from "date-fns";
import { renderWeekHeader } from "./renderingUtils";

interface WeeksHeaderProps {
  range: TimeRange;
  pixels: Pixels;
  setFocusedDay?: (day: Date | null) => void;
  render?: (firstDay: Date, lastDay: Date) => ReactElement;
  onWeekClick?: (params: {
    firstDay: Date;
    lastDay: Date;
    e: MouseEvent;
  }) => void;
}

export function WeeksHeader({
  range,
  pixels,
  setFocusedDay = () => {},
  render = renderWeekHeader,
  onWeekClick = () => undefined,
}: WeeksHeaderProps) {
  return (
    <div className="timeline-header-weeks">
      {eachWeekOfInterval(range, { weekStartsOn: 1 }).map((firstDay, index) => {
        if (firstDay < range.start) {
          firstDay = range.start;
        }

        let lastDay = isSunday(firstDay) ? firstDay : nextSunday(firstDay);

        if (lastDay > range.end) {
          lastDay = range.end;
        }

        const numberOfDays = differenceInCalendarDays(lastDay, firstDay) + 1;

        return (
          <div
            key={index}
            className="timeline-header-week-label"
            style={{
              width: `${pixels.pixelsPerDay * numberOfDays}px`,
            }}
            onClick={(e) => {
              onWeekClick({ firstDay, lastDay, e });
              setFocusedDay(firstDay);
            }}
          >
            {render(firstDay, lastDay)}
          </div>
        );
      })}
    </div>
  );
}
