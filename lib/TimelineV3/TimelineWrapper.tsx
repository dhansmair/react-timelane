import { PropsWithChildren, useEffect } from "react";

import { SwimlaneT } from "./types";
import "./Timeline.scss";
import "./core/style.scss";

interface TimelineWrapperProps {
  focusedDay?: Date | null;
  focusedSwimlane?: SwimlaneT | null;
}

export default function TimelineWrapper({
  children,
  focusedDay,
  focusedSwimlane,
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

  return <div className="timeline-v3">{children}</div>;
}
