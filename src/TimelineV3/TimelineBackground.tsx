import { eachDayOfInterval, isSunday } from "date-fns";
import CoreResource from "./core/types/CoreResource";
import TimeRange from "./core/types/TimeRange";
import Pixels from "./core/types/Pixels";
import { dateToPixel } from "./core/utils";

interface TimelineBackgroundProps {
  range: TimeRange;
  pixels: Pixels;
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;
  focusedResource?: CoreResource | null;
  setFocusedResource?: (resource: CoreResource | null) => void;
}

export default function TimelineBackground({
  range,
  pixels,
  focusedDay,
}: TimelineBackgroundProps) {
  return (
    <div className="timeline-background">
      <div className="timeline-background-inner">
        {focusedDay && (
          <div
            className="timeline-background-focused-day-position"
            style={{
              width: `${pixels.pixelsPerDay}px`,
              marginLeft: `${
                dateToPixel(focusedDay, range.start, pixels) -
                pixels.pixelsPerDay / 2
              }px`,
            }}
          ></div>
        )}

        {eachDayOfInterval(range).map((day, index) => (
          <div
            key={index}
            className={`timeline-background-day-label ${
              isSunday(day) ? "timeline-background-day-label-sunday" : ""
            } `}
            style={{ width: `${pixels.pixelsPerDay}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
