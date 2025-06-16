import { Rectangle } from "../../types";

interface OverlapIndicatorProps {
  overlap: Rectangle;
}

export default function OverlapIndicator({ overlap }: OverlapIndicatorProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${overlap.x}px`,
        top: `${overlap.y}px`,
        width: `${overlap.width - 1}px`,
        height: `${overlap.height - 1}px`,
        background: `rgba(255,0,0, 0.3)`,
        marginLeft: "1px",
        pointerEvents: "none",
      }}
    ></div>
  );
}
