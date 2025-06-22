import { PropsWithChildren, useRef } from "react";
import "./layout.scss";

/**
 * The component `<TimelaneLayout>` is internally used to structure the timelane layout.
 * It provides regions for header, aside, body, footer and corner and ensures the
 * elements are sticky on their respective positions.
 * Child components should be used as `<TimelaneLayout.Header>`, `<TimelaneLayout.Aside>` and so on.
 *
 * The layout is mainly intended for internal use can still be be used to create
 * custom sticky components that integrate with react-timelane.
 */
export function TimelaneLayout({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="timelane-layout"
      onWheel={(e) => {
        if (ref.current && (e.ctrlKey || e.shiftKey)) {
          ref.current.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }}
      ref={ref}
    >
      <div className="timelane-layout-inner">{children}</div>
    </div>
  );
}

export function TimelaneLayoutHeader({ children }: PropsWithChildren) {
  return <div className="timelane-layout-header">{children}</div>;
}

export function TimelaneLayoutBackground({ children }: PropsWithChildren) {
  return <div className="timelane-layout-background">{children}</div>;
}

export function TimelaneLayoutBody({ children }: PropsWithChildren) {
  return <div className="timelane-layout-body">{children}</div>;
}

export function TimelaneLayoutFooter({ children }: PropsWithChildren) {
  return <div className="timelane-layout-footer">{children}</div>;
}

interface TimelaneLayoutAsideProps {
  side?: "left" | "right";
}

export function TimelaneLayoutAside({
  side = "left",
  children,
}: PropsWithChildren<TimelaneLayoutAsideProps>) {
  return (
    <div
      className={`timelane-layout-aside ${
        side == "left"
          ? "timelane-layout-aside-left"
          : "timelane-layout-aside-right"
      }`}
    >
      {children}
    </div>
  );
}

interface TimelaneLayoutCornerProps {
  corner?: "top left" | "top right" | "bottom left" | "bottom right";
}

export function TimelaneLayoutCorner({
  corner = "top left",
  children,
}: PropsWithChildren<TimelaneLayoutCornerProps>) {
  let className = "";

  switch (corner) {
    case "top left":
      className = "timelane-layout-corner-top-left";
      break;
    case "top right":
      className = "timelane-layout-corner-top-right";
      break;
    case "bottom left":
      className = "timelane-layout-corner-bottom-left";
      break;
    case "bottom right":
      className = "timelane-layout-corner-bottom-right";
      break;
  }

  return (
    <div className={`timelane-layout-corner ${className}`}>{children}</div>
  );
}

TimelaneLayout.Header = TimelaneLayoutHeader;
TimelaneLayout.Body = TimelaneLayoutBody;
TimelaneLayout.Background = TimelaneLayoutBackground;
TimelaneLayout.Footer = TimelaneLayoutFooter;
TimelaneLayout.Aside = TimelaneLayoutAside;
TimelaneLayout.Corner = TimelaneLayoutCorner;
