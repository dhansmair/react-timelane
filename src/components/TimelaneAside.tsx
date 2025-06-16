import { MouseEvent, PropsWithChildren, ReactElement } from "react";
import { useTimelaneContext } from "../hooks/useTimelaneContext";
import { SwimlaneT } from "../types";
import { TimelaneLayout } from "..";

interface TimelaneAsideProps {
  lanes: SwimlaneT[];
  focusedLane?: SwimlaneT | null;
  setFocusedLane?: (lane: SwimlaneT | null) => void;
  onLaneHeaderClick?: (lane: SwimlaneT, e: MouseEvent) => void;
  onLaneHeaderDoubleClick?: (lane: SwimlaneT, e: MouseEvent) => void;
  onLaneHeaderContextMenu?: (lane: SwimlaneT, e: MouseEvent) => void;
  renderLaneHeader?: (lane: SwimlaneT) => ReactElement;
}

export default function TimelaneAside({
  lanes,
  focusedLane,
  setFocusedLane = () => undefined,
  onLaneHeaderClick = () => undefined,
  onLaneHeaderDoubleClick = () => undefined,
  onLaneHeaderContextMenu = () => undefined,
  renderLaneHeader = defaultRenderLaneHeader,
}: TimelaneAsideProps) {
  const { settings } = useTimelaneContext();

  return (
    <TimelaneLayout.Aside>
      <div className="timelane-aside">
        {lanes &&
          lanes.map((lane) => (
            <LaneHeader
              key={lane.id}
              height={settings.pixelsPerResource}
              isFocused={focusedLane ? focusedLane.id === lane.id : false}
              onClick={(e) => {
                setFocusedLane(lane);
                onLaneHeaderClick(lane, e);
              }}
              onDoubleClick={(e) => onLaneHeaderDoubleClick(lane, e)}
              onContextMenu={(e) => onLaneHeaderContextMenu(lane, e)}
            >
              {renderLaneHeader(lane)}
            </LaneHeader>
          ))}
      </div>
    </TimelaneLayout.Aside>
  );
}

interface LaneHeaderProps {
  height: number;
  isFocused?: boolean;
  onClick?: (e: MouseEvent) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

function LaneHeader({
  height,
  isFocused,
  onClick,
  onDoubleClick,
  onContextMenu,
  children,
}: PropsWithChildren<LaneHeaderProps>) {
  return (
    <div
      className={`timelane-aside-swimlane-header ${
        isFocused ? "timelane-aside-swimlane-header-focused" : ""
      }`}
      style={{ height: `${height}px` }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {children}
    </div>
  );
}

function defaultRenderLaneHeader(lane: SwimlaneT) {
  return <div>{lane.id}</div>;
}
