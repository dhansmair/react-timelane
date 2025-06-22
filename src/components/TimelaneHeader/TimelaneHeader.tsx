import { MouseEvent, ReactElement } from "react";
import { MonthsHeader } from "./MonthsHeader";
import { WeeksHeader } from "./WeeksHeader";
import { DaysHeader } from "./DaysHeader";
import { useTimelaneContext } from "../../hooks/useTimelaneContext";
import { TimelaneLayout } from "../..";

export interface TimelaneHeaderProps {
  focusedDay?: Date | null;
  setFocusedDay?: (day: Date | null) => void;

  renderMonthHeader?: (firstDay: Date, lastDay: Date) => ReactElement;
  renderWeekHeader?: (firstDay: Date, lastDay: Date) => ReactElement;
  renderDayHeader?: (day: Date) => ReactElement;

  onMonthClick?: (_: { firstDay: Date; lastDay: Date; e: MouseEvent }) => void;
  onWeekClick?: (_: { firstDay: Date; lastDay: Date; e: MouseEvent }) => void;
  onDayClick?: (_: { day: Date; e: MouseEvent }) => void;
}

/**
 * The component `<TimelaneHeader>` renders labels for months, weeks and days.
 *
 * It must be a child component of `<Timelane>`.
 * Properties such as `start`, `end`, `pixelsPerDay` are retrieved from the
 * TimelaneContext, provided e.g. by the parent `<Timelane>` component.
 */
export function TimelaneHeader({
  focusedDay,
  setFocusedDay = () => {},
  renderMonthHeader,
  renderWeekHeader,
  renderDayHeader,
  onMonthClick,
  onDayClick,
  onWeekClick,
}: TimelaneHeaderProps) {
  const { settings } = useTimelaneContext();

  return (
    <TimelaneLayout.Header>
      <div className="timelane-header">
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
    </TimelaneLayout.Header>
  );
}
