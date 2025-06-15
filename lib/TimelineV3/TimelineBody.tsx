import { MouseEvent, ReactElement } from "react";
import CoreSwimlane from "./core/CoreSwimlane/CoreSwimlane";
import { AvailableSpace, CoreItem, SwimlaneT } from "./types";

interface TimelineBodyProps<T> {
  lanes: SwimlaneT[];
  items: CoreItem<T>[];
  renderItem?: (item: CoreItem<T>, isDragged: boolean) => ReactElement;
  onItemUpdate?: (item: CoreItem<T>) => void;
  onLaneClick?: (
    lane: SwimlaneT,
    when: Date,
    availableSpace: AvailableSpace | null,
    e: MouseEvent
  ) => void;
  onLaneDoubleClick?: (
    lane: SwimlaneT,
    when: Date,
    availableSpace: AvailableSpace | null,
    e: MouseEvent
  ) => void;
  onLaneContextMenu?: (lane: SwimlaneT, when: Date, e: MouseEvent) => void;
}

export function TimelineBody<T>({
  lanes,
  items,
  renderItem,
  onItemUpdate = () => undefined,
  onLaneClick = () => undefined,
  onLaneDoubleClick = () => undefined,
  onLaneContextMenu = () => undefined,
}: TimelineBodyProps<T>) {
  return (
    <div className="timeline-body">
      {lanes.map((lane) => (
        <CoreSwimlane<T>
          key={lane.id}
          swimlane={lane}
          items={items.filter((item) => item.swimlaneId === lane.id)}
          renderItem={renderItem}
          onItemUpdate={onItemUpdate}
          onClick={(when, availableSpace, e) =>
            onLaneClick(lane, when, availableSpace, e)
          }
          onDoubleClick={(when, availableSpace, e) =>
            onLaneDoubleClick(lane, when, availableSpace, e)
          }
          onContextMenu={(when, e) => onLaneContextMenu(lane, when, e)}
        />
      ))}
    </div>
  );
}
