import { PropsWithChildren } from "react";
import { TimelaneLane } from "../TimelaneLane/TimelaneLane";
import { TimelaneBody } from "../TimelaneBody/TimelaneBody";
import { TimelaneLayout } from "../TimelaneLayout/TimelaneLayout";
import { TimelaneHeader } from "../TimelaneHeader/TimelaneHeader";
import { TimelaneBackground } from "../TimelaneBackground/TimelaneBackground";
import { TimelaneAside } from "../TimelaneAside/TimelaneAside";
import { TimelaneSettingsProvider } from "../TimelaneSettingsProvider/TimelaneSettingsProvider";
import { useTimelaneContext } from "../../hooks/useTimelaneContext";
import { EnableResizing } from "../../types";
import "./Timelane.scss";

export interface TimelaneProps {
  /**
   * start of the time range
   */
  start?: Date;
  /**
   * end of the time range
   */
  end?: Date;
  pixelsPerDay?: number;
  pixelsPerLane?: number;
  showMonths?: boolean;
  showWeeks?: boolean;
  showDays?: boolean;
  allowOverlaps?: boolean;
  enableItemResizing?: boolean | EnableResizing;
  enableItemDragging?: boolean;
}

/**
 * a component
 */
export function Timelane({
  start,
  end,
  pixelsPerDay,
  pixelsPerLane,
  showMonths,
  showWeeks,
  showDays,
  allowOverlaps,
  enableItemResizing,
  enableItemDragging,
  children,
}: PropsWithChildren<TimelaneProps>) {
  const { settings } = useTimelaneContext();

  return (
    <TimelaneSettingsProvider
      settings={{
        ...settings,
        start: start || settings.start,
        end: end || settings.end,
        pixelsPerDay: pixelsPerDay || settings.pixelsPerDay,
        pixelsPerLane: pixelsPerLane || settings.pixelsPerLane,
        showMonths: showMonths !== undefined ? showMonths : settings.showMonths,
        showWeeks: showWeeks !== undefined ? showWeeks : settings.showWeeks,
        showDays: showDays !== undefined ? showDays : settings.showDays,
        allowOverlaps:
          allowOverlaps !== undefined ? allowOverlaps : settings.allowOverlaps,
        enableItemDragging:
          enableItemDragging !== undefined
            ? enableItemDragging
            : settings.enableItemDragging,
        enableItemResizing:
          enableItemResizing !== undefined
            ? enableItemResizing
            : settings.enableItemResizing,
      }}
    >
      <div className="timelane">
        <TimelaneLayout>{children}</TimelaneLayout>
      </div>
    </TimelaneSettingsProvider>
  );
}

Timelane.Header = TimelaneHeader;
Timelane.Body = TimelaneBody;
Timelane.Background = TimelaneBackground;
Timelane.Aside = TimelaneAside;
Timelane.Lane = TimelaneLane;
Timelane.Layout = TimelaneLayout;
