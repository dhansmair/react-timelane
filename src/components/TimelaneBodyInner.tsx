import { MouseEvent, ReactElement } from "react";
import { TimelaneLane } from "./TimelaneLane/TimelaneLane";
import { AvailableSpace, Item, Lane } from "../types";

interface TimelaneBodyInnerProps<T> {
  lanes: Lane[];
  items: Item<T>[];
  renderItem?: (item: Item<T>, isDragged: boolean) => ReactElement;
  onItemUpdate?: (item: Item<T>) => void;
  onLaneClick?: (
    lane: Lane,
    when: Date,
    availableSpace: AvailableSpace | null,
    e: MouseEvent
  ) => void;
  onLaneDoubleClick?: (
    lane: Lane,
    when: Date,
    availableSpace: AvailableSpace | null,
    e: MouseEvent
  ) => void;
  onLaneContextMenu?: (lane: Lane, when: Date, e: MouseEvent) => void;
}

/**
 * @deprecated The component should not be used
 */
export function TimelaneBodyInner<T>({
  lanes,
  items,
  renderItem,
  onItemUpdate = () => undefined,
  onLaneClick = () => undefined,
  onLaneDoubleClick = () => undefined,
  onLaneContextMenu = () => undefined,
}: TimelaneBodyInnerProps<T>) {
  return (
    <>
      {lanes.map((lane) => (
        <TimelaneLane<T>
          key={lane.id}
          lane={lane}
          items={items.filter((item) => item.laneId === lane.id)}
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
    </>
  );
}
