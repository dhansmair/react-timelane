import { MouseEvent, ReactElement } from "react";
import { Pixels, TimeRange } from "../../types";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { renderDayHeader } from "./renderingUtils";

export interface DaysHeaderProps {
  range: TimeRange;
  pixels: Pixels;
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;
  render?: (day: Date) => ReactElement;
  onDayClick?: (_: { day: Date; e: MouseEvent }) => void;
}

export function DaysHeader({
  range,
  pixels,
  focusedDay,
  setFocusedDay = () => {},
  render = renderDayHeader,
  onDayClick = () => undefined,
}: DaysHeaderProps) {
  return (
    <div className="timelane-header-days">
      {eachDayOfInterval(range).map((day, index) => (
        <div
          key={index}
          className={`timelane-header-day-label ${
            focusedDay && isSameDay(focusedDay, day)
              ? "timelane-header-day-label-focused"
              : ""
          }`}
          style={{ width: `${pixels.pixelsPerDay}px` }}
          onClick={(e) => {
            onDayClick({ day, e });
            setFocusedDay(day);
          }}
        >
          {render(day)}
        </div>
      ))}
    </div>
  );
}
