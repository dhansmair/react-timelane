import { PropsWithChildren } from "react";
import TimelaneLayout from "./layout/TimelaneLayout";

interface TimelaneBodyProps {}

export function TimelaneBody({
  children,
}: PropsWithChildren<TimelaneBodyProps>) {
  return (
    <TimelaneLayout.Body>
      <div className="timelane-body">{children}</div>
    </TimelaneLayout.Body>
  );
}
