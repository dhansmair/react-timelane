import { PropsWithChildren } from "react";
import { TimelaneLane } from "./TimelaneLane/TimelaneLane";
import { TimelaneBody } from "./TimelaneBody";
import { TimelaneLayout } from "./TimelaneLayout/TimelaneLayout";
import { TimelaneHeader } from "./TimelaneHeader/TimelaneHeader";
import { TimelaneBackground } from "./TimelaneBackground";
import { TimelaneAside } from "./TimelaneAside";
import "./Timelane.scss";

export function Timelane({ children }: PropsWithChildren) {
  return (
    <div className="timelane">
      <TimelaneLayout>{children}</TimelaneLayout>
    </div>
  );
}

Timelane.Container = Timelane;
Timelane.Header = TimelaneHeader;
Timelane.Body = TimelaneBody;
Timelane.Background = TimelaneBackground;
Timelane.Aside = TimelaneAside;
Timelane.Lane = TimelaneLane;
Timelane.Layout = TimelaneLayout;
