import { PropsWithChildren } from "react";
import { CoreSwimlane, TimelaneBody, TimelaneLayout } from "..";
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
Timelane.Lane = CoreSwimlane;
Timelane.Layout = TimelaneLayout;
