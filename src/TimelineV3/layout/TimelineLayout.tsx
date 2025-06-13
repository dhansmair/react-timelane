import { PropsWithChildren, useRef } from "react";
import "./layout.scss";

export default function TimelineLayout({ children }: PropsWithChildren<{}>) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="timeline-layout"
      onWheel={(e) => {
        if (ref.current && (e.ctrlKey || e.shiftKey)) {
          ref.current.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }}
      ref={ref}
    >
      <div className="timeline-layout-inner">{children}</div>
    </div>
  );
}
function TimelineHeader({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-header">{children}</div>;
}

function TimelineBackground({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-background">{children}</div>;
}
function TimelineBody({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-body">{children}</div>;
}
function TimelineFooter({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-footer">{children}</div>;
}

interface TimelineAsideProps {
  side?: "left" | "right";
}

function TimelineAside({
  side = "left",
  children,
}: PropsWithChildren<TimelineAsideProps>) {
  return (
    <div
      className={`timeline-layout-aside ${
        side == "left"
          ? "timeline-layout-aside-left"
          : "timeline-layout-aside-right"
      }`}
    >
      {children}
    </div>
  );
}

interface TimelineCornerProps {
  corner?: "top left" | "top right" | "bottom left" | "bottom right";
}

function TimelineCorner({
  corner = "top left",
  children,
}: PropsWithChildren<TimelineCornerProps>) {
  let className = "";

  switch (corner) {
    case "top left":
      className = "timeline-layout-corner-top-left";
      break;
    case "top right":
      className = "timeline-layout-corner-top-right";
      break;
    case "bottom left":
      className = "timeline-layout-corner-bottom-left";
      break;
    case "bottom right":
      className = "timeline-layout-corner-bottom-right";
      break;
  }

  return (
    <div className={`timeline-layout-corner ${className}`}>{children}</div>
  );
}

TimelineLayout.Header = TimelineHeader;
TimelineLayout.Body = TimelineBody;
TimelineLayout.Background = TimelineBackground;
TimelineLayout.Footer = TimelineFooter;
TimelineLayout.Aside = TimelineAside;
TimelineLayout.Corner = TimelineCorner;
