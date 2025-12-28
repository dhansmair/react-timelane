import { MouseEvent, PropsWithChildren, ReactElement } from "react";
import { Lane } from "../../types";
import { TimelaneLayout } from "../TimelaneLayout/TimelaneLayout";
import { useTimelaneContext } from "../../hooks/useTimelaneContext";

export interface TimelaneAsideProps<T = unknown> {
  lanes: Lane<T>[];

  /**
   * the width in px
   */
  width?: number;

  side?: "left" | "right";

  /**
   * deprecated
   */
  focusedLane?: Lane<T> | null;

  /**
   * deprecated
   */
  setFocusedLane?: (lane: Lane<T> | null) => void;
  onLaneHeaderClick?: (lane: Lane<T>, e: MouseEvent) => void;
  onLaneHeaderDoubleClick?: (lane: Lane<T>, e: MouseEvent) => void;
  onLaneHeaderContextMenu?: (lane: Lane<T>, e: MouseEvent) => void;
  renderLaneHeader?: (lane: Lane<T>) => ReactElement;
}

/**
 * `<TimelaneAside>` renders lane headers. The lane header height is determined
 * by the setting `pixelsPerLane`. The lane header content can be customized using
 * the property `renderLaneHeader()`.
 *
 * It must be a child component of `<Timelane>`.
 */
export function TimelaneAside<T = unknown>({
  lanes,
  width = 100,
  side = "left",
  focusedLane,
  setFocusedLane = () => undefined,
  onLaneHeaderClick = () => undefined,
  onLaneHeaderDoubleClick = () => undefined,
  onLaneHeaderContextMenu = () => undefined,
  renderLaneHeader = defaultRenderLaneHeader,
}: TimelaneAsideProps<T>) {
  const { settings } = useTimelaneContext();

  return (
    <TimelaneLayout.Aside side={side}>
      <div className="timelane-aside" style={{ width: `${width}px` }}>
        {lanes &&
          lanes.map((lane) => (
            <LaneHeader
              key={lane.id}
              height={settings.pixelsPerLane}
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
      className={`timelane-aside-lane-header ${
        isFocused ? "timelane-aside-lane-header-focused" : ""
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

function defaultRenderLaneHeader(lane: Lane) {
  return <div>{lane.id}</div>;
}
