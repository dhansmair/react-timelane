import { MouseEvent, PropsWithChildren, ReactElement } from "react";
import { useTimelineContext } from "../hooks/useTimelineContext";
import { SwimlaneT } from "../types";

interface TimelineAsideProps {
  swimlanes: SwimlaneT[];
  focusedSwimlane?: SwimlaneT | null;
  setFocusedSwimlane?: (lane: SwimlaneT | null) => void;
  onSwimlaneHeaderClick?: (lane: SwimlaneT, e: MouseEvent) => void;
  onSwimlaneHeaderDoubleClick?: (lane: SwimlaneT, e: MouseEvent) => void;
  onSwimlaneHeaderContextMenu?: (lane: SwimlaneT, e: MouseEvent) => void;
  renderSwimlaneHeader?: (lane: SwimlaneT) => ReactElement;
}

export default function TimelineAside({
  swimlanes,
  focusedSwimlane,
  setFocusedSwimlane = () => undefined,
  onSwimlaneHeaderClick = () => undefined,
  onSwimlaneHeaderDoubleClick = () => undefined,
  onSwimlaneHeaderContextMenu = () => undefined,
  renderSwimlaneHeader = defaultRenderSwimlaneHeader,
}: TimelineAsideProps) {
  const { settings } = useTimelineContext();

  return (
    <div className="timeline-aside">
      {swimlanes &&
        swimlanes.map((lane) => (
          <SwimlaneHeader
            key={lane.id}
            height={settings.pixelsPerResource}
            isFocused={focusedSwimlane ? focusedSwimlane.id === lane.id : false}
            onClick={(e) => {
              setFocusedSwimlane(lane);
              onSwimlaneHeaderClick(lane, e);
            }}
            onDoubleClick={(e) => onSwimlaneHeaderDoubleClick(lane, e)}
            onContextMenu={(e) => onSwimlaneHeaderContextMenu(lane, e)}
          >
            {renderSwimlaneHeader(lane)}
          </SwimlaneHeader>
        ))}
    </div>
  );
}

interface SwimlaneHeaderProps {
  height: number;
  isFocused?: boolean;
  onClick?: (e: MouseEvent) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

function SwimlaneHeader({
  height,
  isFocused,
  onClick,
  onDoubleClick,
  onContextMenu,
  children,
}: PropsWithChildren<SwimlaneHeaderProps>) {
  return (
    <div
      className={`timeline-aside-swimlane-header ${
        isFocused ? "timeline-aside-swimlane-header-focused" : ""
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

function defaultRenderSwimlaneHeader(lane: SwimlaneT) {
  return <div>{lane.id}</div>;
}
