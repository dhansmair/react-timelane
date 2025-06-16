import { PropsWithChildren } from "react";
import { TimelaneLayout } from "./TimelaneLayout/TimelaneLayout";
import { TimelaneSelectionLayer } from "./TimelaneSelectionLayer";

interface TimelaneBodyProps {
  onSelect?: (selection: number[]) => void;
}

export function TimelaneBody({
  onSelect = () => undefined,
  children,
}: PropsWithChildren<TimelaneBodyProps>) {
  return (
    <TimelaneLayout.Body>
      <TimelaneSelectionLayer onSelect={onSelect}>
        <div className="timelane-body">{children}</div>
      </TimelaneSelectionLayer>
    </TimelaneLayout.Body>
  );
}
