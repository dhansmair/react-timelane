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
  const style = {
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div className="timeline-drop-preview" style={style}>
      {children}
    </div>
  );
}
