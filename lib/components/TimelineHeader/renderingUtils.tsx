import { differenceInCalendarDays, format } from "date-fns";
import { ReactElement } from "react";

export function renderMonthHeader(firstDay: Date, lastDay: Date): ReactElement {
  const numberOfDays = differenceInCalendarDays(lastDay, firstDay) + 1;

  return <>{numberOfDays > 4 ? format(firstDay, "LLLL yyyy") : <></>}</>;
}

export function renderWeekHeader(firstDay: Date, lastDay: Date): ReactElement {
  const numberOfDays = differenceInCalendarDays(lastDay, firstDay) + 1;

  const title = `KW ${format(firstDay, "w")} (${format(
    firstDay,
    "MM-dd"
  )} - ${format(lastDay, "MM-dd")}`;

  return (
    <div title={title}>
      {numberOfDays > 2 ? <>KW {format(firstDay, "w")}</> : <></>}
    </div>
  );
  // return (
  //   <Tooltip
  //     arrow
  //     title={
  //       <div className="timeline-header-tooltip timeline-header-week-tooltip">
  //         KW {format(firstDay, "w")} ({format(firstDay, "MM-dd")} -{" "}
  //         {format(lastDay, "MM-dd")}
  //       </div>
  //     }
  //     disableInteractive
  //   >
  //     <div>{numberOfDays > 2 ? <>KW {format(firstDay, "w")}</> : <></>}</div>
  //   </Tooltip>
  // );
}

export function renderDayHeader(day: Date): ReactElement {
  const title = `${format(day, "yyyy-MM-dd")}`;

  return <div title={title}>{format(day, "d")}</div>;

  // return (
  //   <Tooltip
  //     arrow
  //     title={
  //       <div className="timeline-header-tooltip timeline-header-day-tooltip">
  //         {format(day, "yyyy-MM-dd")}
  //       </div>
  //     }
  //     disableInteractive
  //   >
  //     <div>{format(day, "d")}</div>
  //   </Tooltip>
  // );
}
