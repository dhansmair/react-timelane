import { PropsWithChildren, useEffect } from "react";
import { TimelineContextProvider } from "./TimelineContextProvider";
import { SwimlaneT } from "../types";
import "./Timeline.scss";
import "./core/style.scss";

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
  focusedDay,
  focusedSwimlane,
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
  useEffect(() => {
    const el: Element | null = document.querySelector(
      ".timeline-background-focused-day-position"
    );

    if (el) {
      el.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [focusedDay]);

  useEffect(() => {
    const el: Element | null = document.querySelector(".timeline-row-focused");

    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [focusedSwimlane]);

  return (
    <div className="timeline-v3">
      <TimelineContextProvider
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
      </TimelineContextProvider>
    </div>
  );
}
