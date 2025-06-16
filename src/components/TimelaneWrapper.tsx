import { PropsWithChildren } from "react";
import { TimelaneSettingsProvider } from "./TimelaneSettingsProvider";
import { SwimlaneT } from "../types";
import "./Timelane.scss";
import { TimelaneLayout } from "..";

interface TimelaneWrapperProps {
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

/**
 * @deprecated The component should not be used
 */
export default function TimelaneWrapper({
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
}: PropsWithChildren<TimelaneWrapperProps>) {
  return (
    <div className="timelane">
      <TimelaneSettingsProvider
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
        <TimelaneLayout>{children}</TimelaneLayout>
      </TimelaneSettingsProvider>
    </div>
  );
}
