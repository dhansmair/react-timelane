import { eachDayOfInterval, isSunday } from "date-fns";
import { dateToPixel } from "./core/utils";
import { TimelineSettings } from "./types/TimelineSettings";

interface TimelineBackgroundProps {
  settings: TimelineSettings;
  focusedDay?: Date | null;
  // setFocusedDay?: (day: Date | null) => void;
  // focusedSwimlane?: CoreSwimlaneT | null;
  // setFocusedSwimlane?: (swimlane: CoreSwimlaneT | null) => void;
}

export default function TimelineBackground({
  settings,
  focusedDay,
}: TimelineBackgroundProps) {
  return (
    <div className="timeline-background">
      <div className="timeline-background-inner">
        {focusedDay && (
          <div
            className="timeline-background-focused-day-position"
            style={{
              width: `${settings.pixelsPerDay}px`,
              marginLeft: `${
                dateToPixel(focusedDay, settings.start, settings) -
                settings.pixelsPerDay / 2
              }px`,
            }}
          ></div>
        )}

        {eachDayOfInterval(settings).map((day, index) => (
          <div
            key={index}
            className={`timeline-background-day-label ${
              isSunday(day) ? "timeline-background-day-label-sunday" : ""
            } `}
            style={{ width: `${settings.pixelsPerDay}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
