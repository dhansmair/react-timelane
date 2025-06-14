import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { ItemId, Rectangle } from "./types";
import { doOverlap } from "./core/CoreSwimlane/utils";
import { MouseEvent } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

interface TimelineSelectionLayerProps {
  onSelect: (selection: number[]) => void;
}

export function TimelineSelectionLayer({
  children,
  onSelect,
}: PropsWithChildren<TimelineSelectionLayerProps>) {
  const [selectedItemIds, setSelectedItemIds] = useState<ItemId[]>([]);

  const callbackRef = useRef<EventListener | null>(null);

  const [mouseDownPos, setMouseDownPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    return monitorForElements({
      onDragStart: (args) => {
        setSelectedItemIds([args.source.data.id as number]);
      },
    });
  }, []);

  useEffect(() => {
    onSelect(selectedItemIds);
  }, [onSelect, selectedItemIds]);

  function handleMouseDown(e: MouseEvent) {
    if (!e.shiftKey && !e.ctrlKey) {
      setSelectedItemIds([]);
    }
    setMouseDownPos({ x: e.clientX, y: e.clientY });
  }

  function handleMouseMove(e: MouseEvent) {
    if (mouseDownPos) {
      const selectedRect = {
        x: Math.min(e.clientX, mouseDownPos.x),
        y: Math.min(e.clientY, mouseDownPos.y),
        width: Math.abs(e.clientX - mouseDownPos.x),
        height: Math.abs(e.clientY - mouseDownPos.y),
      };

      const rect = e.currentTarget.getBoundingClientRect();
      setSelectionRect({
        ...selectedRect,
        x: selectedRect.x - rect.left,
        y: selectedRect.y - rect.top,
      });

      document.querySelectorAll(".timeline-drop-target").forEach((row) => {
        if (doOverlap(row.getBoundingClientRect(), selectedRect)) {
          row.querySelectorAll(".timeline-drag-item").forEach((item) => {
            if (doOverlap(item.getBoundingClientRect(), selectedRect)) {
              item.classList.add("timeline-drag-item-marked");
            } else {
              item.classList.remove("timeline-drag-item-marked");
            }
          });
        }
      });

      if (
        (selectedRect.width > 5 || selectedRect.height > 5) &&
        !callbackRef.current
      ) {
        callbackRef.current = captureClick;
        window.addEventListener("click", captureClick, true);
      }
    }
  }

  function handleMouseUp(e: MouseEvent) {
    if (mouseDownPos && selectionRect) {
      e.stopPropagation();
      const selectedRect = {
        x: Math.min(e.clientX, mouseDownPos.x),
        y: Math.min(e.clientY, mouseDownPos.y),
        width: Math.abs(e.clientX - mouseDownPos.x),
        height: Math.abs(e.clientY - mouseDownPos.y),
      };

      const ids: ItemId[] = Array.from(
        document.querySelectorAll(".timeline-drop-target")
      )
        .filter((row) => doOverlap(row.getBoundingClientRect(), selectedRect))
        .map((row) => Array.from(row.querySelectorAll(".timeline-drag-item")))
        .flatMap((els) => els)
        .filter((item) => doOverlap(item.getBoundingClientRect(), selectedRect))
        .map((item) => {
          const el = item.querySelector(".timeline-allocation");
          if (el instanceof HTMLElement) {
            return Number.parseInt(el.dataset.allocationId || "-1");
          } else {
            return -1;
          }
        })
        .filter((id) => id > 0);

      if (ids.length > 0) {
        if (e.shiftKey || e.ctrlKey) {
          setSelectedItemIds((prev) => {
            return Array.from(new Set([...prev, ...ids]));
          });
        } else {
          setSelectedItemIds(ids);
        }
      }

      document.querySelectorAll(".timeline-drag-item-marked").forEach((el) => {
        el.classList.remove("timeline-drag-item-marked");
      });
    }

    setMouseDownPos(null);
    setSelectionRect(null);

    requestAnimationFrame(() => {
      if (callbackRef.current && callbackRef.current !== null) {
        window.removeEventListener("click", callbackRef.current, true);
        callbackRef.current = null;
      }
    });
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "relative",
      }}
    >
      {selectionRect && <MouseSelectionIndicator rect={selectionRect} />}
      {children}
    </div>
  );
}

const captureClick = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
};

interface MouseSelectionIndicatorProps {
  rect: Rectangle;
}

function MouseSelectionIndicator({ rect }: MouseSelectionIndicatorProps) {
  return (
    <div
      id="mouse-selection-indicator"
      style={{
        border: "1px dashed blue",
        position: "absolute",
        top: `${rect.y}px`,
        left: `${rect.x}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: 1000000,
      }}
    ></div>
  );
}
