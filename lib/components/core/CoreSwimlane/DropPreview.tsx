import { PropsWithChildren } from "react";

interface DropPreviewProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function DropPreview({
  x,
  y,
  width,
  height,
  children,
}: PropsWithChildren<DropPreviewProps>) {
  return (
    <div
      className="timeline-drop-preview"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  );
}
