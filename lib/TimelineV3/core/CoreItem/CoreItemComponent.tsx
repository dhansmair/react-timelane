import DragResizeComponent from "./DragResizeComponent";
import {
  getDropTargetDimensions,
  getAllocationRectangle as getItemRectangle,
  getUpdatedItem as getUpdatedItem,
} from "../utils";
import { PropsWithChildren } from "react";
import { CoreItem, Position, Rectangle, SwimlaneT } from "../../types";
import { TimelineSettings } from "../../types/TimelineSettings";

interface CoreItemComponentProps<T> {
  item: CoreItem<T>;
  swimlane: SwimlaneT;
  settings: TimelineSettings;
  onDragStart: (grabPosition: Position, relativeGrabPosition: Position) => void;
  onDrop: () => void;
  onDrag: () => void;
  onUpdate: (updatedItem: CoreItem<T>) => void;
  onResizeStart: () => void;
}

export default function CoreItemComponent<T>({
  swimlane,
  item,
  settings,
  children,
  onDragStart,
  onDrag,
  onDrop,
  onUpdate,
  onResizeStart,
}: PropsWithChildren<CoreItemComponentProps<T>>) {
  const rectangle = getItemRectangle(item, swimlane, settings, settings);
  const boundingRectangle = getDropTargetDimensions(
    swimlane,
    settings,
    settings
  );

  return (
    <DragResizeComponent
      rectangle={rectangle}
      boundingRectangle={boundingRectangle}
      data={item}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onUpdate={(rectangle: Rectangle) => {
        const updatedItem: CoreItem<T> = getUpdatedItem(
          item,
          swimlane,
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
