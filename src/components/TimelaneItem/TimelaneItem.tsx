import DragResizeComponent from "./DragResizeComponent";
import {
  getDropTargetDimensions,
  getItemRectangle as getItemRectangle,
  getUpdatedItem as getUpdatedItem,
} from "../utils";
import { PropsWithChildren } from "react";
import { Item, Position, Rectangle, Lane, TimelaneSettings } from "../../types";

interface TimelaneItemProps<T> {
  item: Item<T>;
  lane: Lane;
  settings: TimelaneSettings;
  onDragStart: (grabPosition: Position, relativeGrabPosition: Position) => void;
  onDrop: () => void;
  onDrag: () => void;
  onUpdate: (updatedItem: Item<T>) => void;
  onResizeStart: () => void;
}

export default function TimelaneItem<T>({
  lane,
  item,
  settings,
  children,
  onDragStart,
  onDrag,
  onDrop,
  onUpdate,
  onResizeStart,
}: PropsWithChildren<TimelaneItemProps<T>>) {
  const rectangle = getItemRectangle(item, lane, settings, settings);
  const boundingRectangle = getDropTargetDimensions(lane, settings, settings);

  return (
    <DragResizeComponent<T>
      item={item}
      rectangle={rectangle}
      boundingRectangle={boundingRectangle}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onUpdate={(rectangle: Rectangle) => {
        const updatedItem: Item<T> = getUpdatedItem(
          item,
          lane,
          rectangle,
          settings,
          settings
        );

        onUpdate(updatedItem);
      }}
      onResizeStart={onResizeStart}
    >
      {children}
    </DragResizeComponent>
  );
}
