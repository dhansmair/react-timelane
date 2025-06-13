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
import TimeRange from "./core/types/TimeRange";
import Pixels from "./core/types/Pixels";

interface TimelineHeaderProps {
  range: TimeRange;
  pixels: Pixels;
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;
  hideDays?: boolean;
  hideWeeks?: boolean;
  hideMonths?: boolean;
}

export default function TimelineHeader({
  range,
  pixels,
  focusedDay,
  setFocusedDay = () => {},
  hideDays = false,
  hideWeeks = false,
  hideMonths = false,
}: TimelineHeaderProps) {
  return (
    <div className="timeline-header">
      {!hideMonths && (
        <TimelineHeaderMonths
          range={range}
          pixels={pixels}
          setFocusedDay={setFocusedDay}
        />
      )}
      {!hideWeeks && (
        <TimelineHeaderWeeks
          range={range}
          pixels={pixels}
          setFocusedDay={setFocusedDay}
        />
      )}
      {!hideDays && (
        <TimelineHeaderDays
          range={range}
          pixels={pixels}
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
}

function TimelineHeaderMonths({
  range,
  pixels,
  setFocusedDay = () => {},
}: TimelineHeaderMonthsProps) {
  // const { t } = useTranslation();

  return (
    <div className="timeline-header-months">
      {eachMonthOfInterval(range).map((firstDayOfMonth, index) => {
        if (firstDayOfMonth < range.start) {
          firstDayOfMonth = range.start;
        }

        let lastDay = lastDayOfMonth(firstDayOfMonth);

        if (lastDay > range.end) {
          lastDay = range.end;
        }

        const numberOfDays =
          differenceInCalendarDays(lastDay, firstDayOfMonth) + 1;

        return (
          <div
            key={index}
            className="timeline-header-month-label"
            style={{
              width: `${pixels.pixelsPerDay * numberOfDays}px`,
            }}
            onClick={() => {
              setFocusedDay(firstDayOfMonth);
            }}
          >
            {numberOfDays > 4 ? (
              format(firstDayOfMonth, "mm/YYYY")
            ) : (
              // t("dateformat.month_year", { date: firstDayOfMonth })
              <></>
            )}
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
}

function TimelineHeaderWeeks({
  range,
  pixels,
  setFocusedDay = () => {},
}: TimelineHeaderWeeksProps) {
  // const { t } = useTranslation();

  return (
    <div className="timeline-header-weeks">
      {eachWeekOfInterval(range, { weekStartsOn: 1 }).map(
        (firstDayOfWeek, index) => {
          if (firstDayOfWeek < range.start) {
            firstDayOfWeek = range.start;
          }

          let lastDayOfWeek = isSunday(firstDayOfWeek)
            ? firstDayOfWeek
            : nextSunday(firstDayOfWeek);

          if (lastDayOfWeek > range.end) {
            lastDayOfWeek = range.end;
          }

          const numberOfDays =
            differenceInCalendarDays(lastDayOfWeek, firstDayOfWeek) + 1;

          return (
            <Tooltip
              key={index}
              arrow
              title={
                <div className="timeline-header-tooltip timeline-header-week-tooltip">
                  KW {format(firstDayOfWeek, "w")} (
                  {format(firstDayOfWeek, "mm-dd")} -{" "}
                  {format(lastDayOfWeek, "mm-dd")}
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
                  setFocusedDay(firstDayOfWeek);
                }}
              >
                {numberOfDays > 2 ? (
                  <>KW {format(firstDayOfWeek, "w")}</>
                ) : (
                  <></>
                )}
              </div>
            </Tooltip>
          );
        }
      )}
    </div>
  );
}

interface TimelineHeaderDaysProps {
  range: TimeRange;
  pixels: Pixels;
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;
}

function TimelineHeaderDays({
  range,
  pixels,
  focusedDay,
  setFocusedDay = () => {},
}: TimelineHeaderDaysProps) {
  // const { t } = useTranslation();
  return (
    <div className="timeline-header-days">
      {eachDayOfInterval(range).map((day, index) => (
        <Tooltip
          key={index}
          arrow
          title={
            <div className="timeline-header-tooltip timeline-header-day-tooltip">
              {format(day, "YYYY-mm-dd")}
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
            {format(day, "d")}
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
