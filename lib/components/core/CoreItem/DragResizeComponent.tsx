import { PropsWithChildren, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getGrabPosition } from "../utils";
import { Resizable } from "re-resizable";
import { Position, Rectangle, Dimensions } from "../../../types";

interface DragResizeComponentProps {
  rectangle: Rectangle;
  boundingRectangle: Dimensions;
  data: Record<string, unknown>;
  onDragStart: (grabPosition: Position, relativeGrabPosition: Position) => void;
  onDrag: () => void;
  onDrop: () => void;
  onUpdate: (rectangle: Rectangle) => void;
  onResizeStart: () => void;
}

/**
 * takes care of pixel-level drag-and-drop and resizing.
 * will emit every event through event handlers.
 * @param param0 t
 * @returns
 */
export default function DragResizeComponent({
  rectangle,
  boundingRectangle,
  children,
  data,
  onDrag,
  onDragStart,
  onDrop,
  onUpdate,
  onResizeStart,
}: PropsWithChildren<DragResizeComponentProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [tmpRectangle, setTmpRectangle] = useState<Rectangle>(rectangle);

  useEffect(() => {
    setTmpRectangle(rectangle);
  }, [rectangle]);

  useEffect(() => {
    invariant(ref.current);
    invariant(handleRef.current);

    return draggable({
      element: ref.current,
      dragHandle: handleRef.current,
      onDragStart: ({ source, location }) => {
        const grabPos = getGrabPosition(source, location);
        onDragStart(grabPos.absolute, grabPos.relative);
      },
      onDrag: () => {
        onDrag();
      },

      onDrop: () => {
        onDrop();
      },
      getInitialData: () => ({ ...data }),
    });
  }, [data, onDrag, onDragStart, onDrop]);

  return (
    <div
      className="timeline-drag-item"
      ref={ref}
      style={{
        width: `${tmpRectangle.width}px`,
        height: `${tmpRectangle.height}px`,
        minWidth: `${tmpRectangle.width}px`,
        minHeight: `${tmpRectangle.height}px`,
        maxWidth: `${tmpRectangle.width}px`,
        maxHeight: `${tmpRectangle.height}px`,
        top: `${tmpRectangle.y}px`,
        left: `${tmpRectangle.x}px`,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Resizable
        enable={{
          right: true,
          left: true,
          top: true,
          bottom: true,
        }}
        handleClasses={{
          left: "timeline-core-drag-item-resize-handle timeline-core-drag-item-resize-handle-left",
          right:
            "timeline-core-drag-item-resize-handle timeline-core-drag-item-resize-handle-right",
        }}
        size={{
          width: tmpRectangle.width,
          height: tmpRectangle.height,
        }}
        onResizeStart={() => {
          onResizeStart();
        }}
        onResize={(e, direction, ref, d) => {
          setTmpRectangle((el) => {
            if (direction === "right") {
              return {
                ...el,
                width: rectangle.width + d.width,
              };
            } else if (direction === "left") {
              return {
                ...el,
                x: rectangle.x - d.width,
                width: rectangle.width + d.width,
              };
            } else if (direction === "bottom") {
              return {
                ...el,
                height: Math.min(
                  rectangle.height + d.height,
                  boundingRectangle.height - rectangle.y
                ),
              };
            } else if (direction === "top") {
              return {
                ...el,
                y: rectangle.y - d.height,
                height: rectangle.height + d.height,
              };
            } else {
              return el;
            }
          });
        }}
        onResizeStop={(_, direction, ref, d) => {
          let newRectangle = rectangle;
          if (direction === "right") {
            newRectangle = {
              ...rectangle,
              width: rectangle.width + d.width,
            };
          } else if (direction === "left") {
            newRectangle = {
              ...rectangle,
              x: rectangle.x - d.width,
              width: rectangle.width + d.width,
            };
          } else if (direction === "bottom") {
            newRectangle = {
              ...rectangle,
              height: Math.min(
                rectangle.height + d.height,
                boundingRectangle.height - rectangle.y
              ),
            };
          } else if (direction === "top") {
            newRectangle = {
              ...rectangle,
              y: rectangle.y - d.height,
              height: rectangle.height + d.height,
            };
          }

          onUpdate(newRectangle);
        }}
        style={{ overflow: "hidden" }}
      >
        <div className="timeline-drag-item-handle" ref={handleRef}>
          {children}
        </div>
      </Resizable>
    </div>
  );
}
