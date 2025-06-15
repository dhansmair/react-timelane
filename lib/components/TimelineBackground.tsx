import { eachDayOfInterval, format, isSunday } from "date-fns";
import { dateToPixel } from "./core/utils";
import { useTimelineContext } from "../hooks/useTimelineContext";

interface TimelineBackgroundProps {
  focusedDay?: Date | null;
}

export default function TimelineBackground({
  focusedDay,
}: TimelineBackgroundProps) {
  const { settings } = useTimelineContext();

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

        <div
          id="timeline-background-date-anchor"
          style={{
            position: "absolute",
            top: 0,
            width: `1px`,
            height: "100%",
          }}
        ></div>

        {eachDayOfInterval(settings).map((day, index) => (
          <div
            key={index}
            className={`timeline-background-day-label ${
              isSunday(day) ? "timeline-background-day-label-sunday" : ""
            } `}
            style={{ width: `${settings.pixelsPerDay}px` }}
            data-day={format(day, "yyyy-MM-dd")}
          ></div>
        ))}
      </div>
    </div>
  );
}
