import { PropsWithChildren } from "react";
import { TimelineSettingsProvider } from "./TimelineSettingsProvider";
import { SwimlaneT } from "../types";
import "./Timeline.scss";

interface TimelineWrapperProps {
  focusedDay?: Date | null;
  focusedSwimlane?: SwimlaneT | null;
  start?: Date;
  end?: Date;
  pixelsPerDay?: number;
  pixelsPerResource?: number;
  showMonths?: boolean;
  showWeeks?: boolean;
  showDays?: boolean;
  allowOverlaps?: boolean;
  focusedDate?: Date | null;
}

export default function TimelineWrapper({
  children,
  start = new Date(2025, 1, 1),
  end = new Date(2025, 5, 1),
  pixelsPerDay = 30,
  pixelsPerResource = 100,
  showMonths = true,
  showWeeks = true,
  showDays = true,
  allowOverlaps = true,
  focusedDate = null,
}: PropsWithChildren<TimelineWrapperProps>) {
  return (
    <div className="timeline">
      <TimelineSettingsProvider
        settings={{
          start,
          end,
          pixelsPerDay,
          pixelsPerResource,
          showDays,
          showMonths,
          showWeeks,
          allowOverlaps,
          focusedDate,
        }}
      >
        {children}
      </TimelineSettingsProvider>
    </div>
  );
}
