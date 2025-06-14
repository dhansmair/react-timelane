import { PropsWithChildren, useRef } from "react";
import "./layout.scss";

function TimelineLayout({ children }: PropsWithChildren<{}>) {
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
function TimelineLayoutHeader({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-header">{children}</div>;
}

function TimelineLayoutBackground({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-background">{children}</div>;
}
function TimelineLayoutBody({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-body">{children}</div>;
}
function TimelineLayoutFooter({ children }: PropsWithChildren<{}>) {
  return <div className="timeline-layout-footer">{children}</div>;
}

interface TimelineLayoutAsideProps {
  side?: "left" | "right";
}

function TimelineLayoutAside({
  side = "left",
  children,
}: PropsWithChildren<TimelineLayoutAsideProps>) {
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

interface TimelineLayoutCornerProps {
  corner?: "top left" | "top right" | "bottom left" | "bottom right";
}

function TimelineLayoutCorner({
  corner = "top left",
  children,
}: PropsWithChildren<TimelineLayoutCornerProps>) {
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

TimelineLayout.Header = TimelineLayoutHeader;
TimelineLayout.Body = TimelineLayoutBody;
TimelineLayout.Background = TimelineLayoutBackground;
TimelineLayout.Footer = TimelineLayoutFooter;
TimelineLayout.Aside = TimelineLayoutAside;
TimelineLayout.Corner = TimelineLayoutCorner;

export default TimelineLayout;
