import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { PropsWithChildren, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { getGrabPosition } from "../utils";
import { GrabInfo, Position } from "../../types";

interface DropTargetProps {
  onDragStart?: (mousePos: Position, grabInfo: GrabInfo, data: any) => void;
  onDrag?: (mousePos: Position, grabInfo: GrabInfo, data: any) => void;
  onDrop?: (mousePos: Position, grabInfo: GrabInfo, data: any) => void;
  onDragEnter?: (mousePos: Position, grabInfo: GrabInfo, data: any) => void;
  onDragLeave?: (grabInfo: GrabInfo, data: any) => void;
}

export default function DropTarget({
  children,
  onDragStart = () => {},
  onDrag = () => {},
  onDrop = () => {},
  onDragEnter = () => {},
  onDragLeave = () => {},
}: PropsWithChildren<DropTargetProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ drop: "drop" }),
      onDragStart: ({ source, location }) => {
        const relativeMousePos = getMousePositionRelativeToDropTarget(location);

        const grabPosition = getGrabPosition(source, location);

        onDragStart(relativeMousePos, grabPosition, source.data);
      },
      onDragEnter: ({ source, location }) => {
        const relativeMousePos = getMousePositionRelativeToDropTarget(location);

        const grabPosition = getGrabPosition(source, location);
        onDragEnter(relativeMousePos, grabPosition, source.data);
      },
      onDrag: ({ source, location }) => {
        const relativeMousePos = getMousePositionRelativeToDropTarget(location);

        const grabPosition = getGrabPosition(source, location);

        onDrag(relativeMousePos, grabPosition, source.data);
      },
      onDrop: ({ source, location }) => {
        const relativeMousePos = getMousePositionRelativeToDropTarget(location);

        const grabPosition = getGrabPosition(source, location);

        onDrop(relativeMousePos, grabPosition, source.data);
      },
      onDragLeave: ({ source, location }) => {
        const grabPosition = getGrabPosition(source, location);
        onDragLeave(grabPosition, source.data);
      },
    });
  }, [onDrag, onDragLeave, onDragStart, onDrop, onDragEnter]);
  return (
    <div className="timelane-drop-target" ref={ref}>
      {children}
    </div>
  );
}

function getMousePositionRelativeToDropTarget(
  location: DragLocationHistory
): Position {
  const targetRect =
    location.current.dropTargets[0].element.getBoundingClientRect();

  return {
    x: location.current.input.pageX - targetRect.x,
    y: location.current.input.pageY - targetRect.y,
  };
}
