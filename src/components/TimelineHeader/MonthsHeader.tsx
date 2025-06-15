import { MouseEvent, ReactElement } from "react";
import { Pixels, TimeRange } from "../../types";
import {
  differenceInCalendarDays,
  eachMonthOfInterval,
  lastDayOfMonth,
} from "date-fns";
import { renderMonthHeader } from "./renderingUtils";

interface MonthsHeaderProps {
  range: TimeRange;
  pixels: Pixels;
  setFocusedDay?: (day: Date | null) => void;
  render?: (firstDay: Date, lastDay: Date) => ReactElement;
  onMonthClick?: (params: {
    firstDay: Date;
    lastDay: Date;
    e: MouseEvent;
  }) => void;
}

export function MonthsHeader({
  range,
  pixels,
  setFocusedDay = () => {},
  render = renderMonthHeader,
  onMonthClick = () => undefined,
}: MonthsHeaderProps) {
  return (
    <div className="timeline-header-months">
      {eachMonthOfInterval(range).map((firstDay, index) => {
        if (firstDay < range.start) {
          firstDay = range.start;
        }

        let lastDay = lastDayOfMonth(firstDay);

        if (lastDay > range.end) {
          lastDay = range.end;
        }

        const numberOfDays = differenceInCalendarDays(lastDay, firstDay) + 1;

        return (
          <div
            key={index}
            className="timeline-header-month-label"
            style={{
              width: `${pixels.pixelsPerDay * numberOfDays}px`,
            }}
            onClick={(e) => {
              onMonthClick({ firstDay, lastDay, e });
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
