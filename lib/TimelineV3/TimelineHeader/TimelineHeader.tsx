import { MouseEvent, ReactElement } from "react";
import { MonthsHeader } from "./MonthsHeader";
import { WeeksHeader } from "./WeeksHeader";
import { DaysHeader } from "./DaysHeader";
import { useTimelineContext } from "../hooks/useTimelineContext";

interface TimelineHeaderProps {
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;

  renderMonthHeader?: (firstDay: Date, lastDay: Date) => ReactElement;
  renderWeekHeader?: (firstDay: Date, lastDay: Date) => ReactElement;
  renderDayHeader?: (day: Date) => ReactElement;

  onMonthClick?: (_: { firstDay: Date; lastDay: Date; e: MouseEvent }) => void;
  onWeekClick?: (_: { firstDay: Date; lastDay: Date; e: MouseEvent }) => void;
  onDayClick?: (_: { day: Date; e: MouseEvent }) => void;
}

export function TimelineHeader({
  focusedDay,
  setFocusedDay = () => {},
  renderMonthHeader,
  renderWeekHeader,
  renderDayHeader,
  onMonthClick,
  onDayClick,
  onWeekClick,
}: TimelineHeaderProps) {
  const { settings } = useTimelineContext();

  return (
    <div className="timeline-header">
      {settings.showMonths && (
        <MonthsHeader
          range={settings}
          pixels={settings}
          setFocusedDay={setFocusedDay}
          render={renderMonthHeader}
          onMonthClick={onMonthClick}
        />
      )}
      {settings.showWeeks && (
        <WeeksHeader
          range={settings}
          pixels={settings}
          setFocusedDay={setFocusedDay}
          render={renderWeekHeader}
          onWeekClick={onWeekClick}
        />
      )}
      {settings.showDays && (
        <DaysHeader
          range={settings}
          pixels={settings}
          focusedDay={focusedDay}
          setFocusedDay={setFocusedDay}
          render={renderDayHeader}
          onDayClick={onDayClick}
        />
      )}
    </div>
  );
}
