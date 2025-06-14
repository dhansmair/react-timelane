import { Tooltip } from "@mui/material";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  nextSunday,
  isSameDay,
  isSunday,
  eachMonthOfInterval,
  lastDayOfMonth,
} from "date-fns";
import { Pixels, TimeRange } from "./types";
import { TimelineSettings } from "./types/TimelineSettings";
import { ReactElement } from "react";

interface TimelineHeaderProps {
  settings: TimelineSettings;
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;
}

export default function TimelineHeader({
  settings,
  focusedDay,
  setFocusedDay = () => {},
}: TimelineHeaderProps) {
  return (
    <div className="timeline-header">
      {settings.showMonths && (
        <TimelineHeaderMonths
          range={settings}
          pixels={settings}
          setFocusedDay={setFocusedDay}
        />
      )}
      {settings.showWeeks && (
        <TimelineHeaderWeeks
          range={settings}
          pixels={settings}
          setFocusedDay={setFocusedDay}
        />
      )}
      {settings.showDays && (
        <TimelineHeaderDays
          range={settings}
          pixels={settings}
          focusedDay={focusedDay}
          setFocusedDay={setFocusedDay}
        />
      )}
    </div>
  );
}

interface TimelineHeaderMonthsProps {
  range: TimeRange;
  pixels: Pixels;
  setFocusedDay?: (day: Date | null) => void;
  render?: (firstDay: Date, lastDay: Date) => ReactElement;
}

function TimelineHeaderMonths({
  range,
  pixels,
  setFocusedDay = () => {},
  render = defaultRenderMonthHeader,
}: TimelineHeaderMonthsProps) {
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
            onClick={() => {
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

interface TimelineHeaderWeeksProps {
  range: TimeRange;
  pixels: Pixels;
  setFocusedDay?: (day: Date | null) => void;
  render?: (firstDay: Date, lastDay: Date) => ReactElement;
}

function TimelineHeaderWeeks({
  range,
  pixels,
  setFocusedDay = () => {},
  render = defaultRenderWeekHeader,
}: TimelineHeaderWeeksProps) {
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
          <Tooltip
            key={index}
            arrow
            title={
              <div className="timeline-header-tooltip timeline-header-week-tooltip">
                KW {format(firstDay, "w")} ({format(firstDay, "MM-dd")} -{" "}
                {format(lastDay, "MM-dd")}
              </div>
            }
            disableInteractive
          >
            <div
              key={index}
              className="timeline-header-week-label"
              style={{
                width: `${pixels.pixelsPerDay * numberOfDays}px`,
              }}
              onClick={() => {
                setFocusedDay(firstDay);
              }}
            >
              {render(firstDay, lastDay)}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}

interface TimelineHeaderDaysProps {
  range: TimeRange;
  pixels: Pixels;
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;
  render?: (day: Date) => ReactElement;
}

function TimelineHeaderDays({
  range,
  pixels,
  focusedDay,
  setFocusedDay = () => {},
  render = defaultRenderDayHeader,
}: TimelineHeaderDaysProps) {
  return (
    <div className="timeline-header-days">
      {eachDayOfInterval(range).map((day, index) => (
        <Tooltip
          key={index}
          arrow
          title={
            <div className="timeline-header-tooltip timeline-header-day-tooltip">
              {format(day, "yyyy-MM-dd")}
            </div>
          }
          disableInteractive
        >
          <div
            className={`timeline-header-day-label ${
              focusedDay && isSameDay(focusedDay, day)
                ? "timeline-header-day-label-focused"
                : ""
            }`}
            style={{ width: `${pixels.pixelsPerDay}px` }}
            onClick={() => {
              setFocusedDay(day);
            }}
          >
            {render(day)}
          </div>
        </Tooltip>
      ))}
    </div>
  );
}

function defaultRenderMonthHeader(firstDay: Date, lastDay: Date): ReactElement {
  const numberOfDays = differenceInCalendarDays(lastDay, firstDay) + 1;

  return <>{numberOfDays > 4 ? format(firstDay, "LLLL yyyy") : <></>}</>;
}

function defaultRenderWeekHeader(firstDay: Date, lastDay: Date): ReactElement {
  const numberOfDays = differenceInCalendarDays(lastDay, firstDay) + 1;

  return <>{numberOfDays > 2 ? <>KW {format(firstDay, "w")}</> : <></>}</>;
}

function defaultRenderDayHeader(day: Date): ReactElement {
  return <>{format(day, "d")}</>;
}
