import { eachDayOfInterval, format, isSunday } from "date-fns";
import { dateToPixel } from "./core/utils";
import { useTimelaneContext } from "../hooks/useTimelaneContext";

interface TimelaneBackgroundProps {
  focusedDay?: Date | null;
}

export default function TimelaneBackground({
  focusedDay,
}: TimelaneBackgroundProps) {
  const { settings } = useTimelaneContext();

  return (
    <div className="timelane-background">
      <div className="timelane-background-inner">
        {focusedDay && (
          <div
            className="timelane-background-focused-day-position"
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
          id="timelane-background-date-anchor"
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
            className={`timelane-background-day-label ${
              isSunday(day) ? "timelane-background-day-label-sunday" : ""
            } `}
            style={{ width: `${settings.pixelsPerDay}px` }}
            data-day={format(day, "yyyy-MM-dd")}
          ></div>
        ))}
      </div>
    </div>
  );
}
