import CoreItem from "../types/CoreItem";
import DragResizeComponent from "./DragResizeComponent";
import CoreResource from "../types/CoreResource";
import {
  getDropTargetDimensions,
  getAllocationRectangle as getItemRectangle,
  getUpdatedAllocation as getUpdatedItem,
} from "../utils";
import { PropsWithChildren } from "react";
import TimeRange from "../types/TimeRange";
import Pixels from "../types/Pixels";
import Position from "../types/Position";
import Rectangle from "../types/Rectangle";

interface CoreItemComponentProps<T> {
  item: CoreItem<T>;
  resource: CoreResource;
  range: TimeRange;
  pixels: Pixels;
  onDragStart: (grabPosition: Position, relativeGrabPosition: Position) => void;
  onDrop: () => void;
  onDrag: () => void;
  onUpdate: (updatedItem: CoreItem<T>) => void;
  onResizeStart: () => void;
}

export default function CoreItemComponent<T>({
  resource,
  item,
  range,
  pixels,
  children,
  onDragStart,
  onDrag,
  onDrop,
  onUpdate,
  onResizeStart,
}: PropsWithChildren<CoreItemComponentProps<T>>) {
  const rectangle = getItemRectangle(item, resource, range, pixels);
  const boundingRectangle = getDropTargetDimensions(resource, pixels, range);

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
          resource,
          rectangle,
          pixels,
          range
        );

        onUpdate(updatedItem);
      }}
      onResizeStart={onResizeStart}
    >
      {children}
    </DragResizeComponent>
  );
}
