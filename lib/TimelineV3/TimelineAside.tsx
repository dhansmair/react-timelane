import { SwimlaneT } from "./types";

interface TimelineAsideProps {
  pixelsPerResource: number;
  swimlanes: SwimlaneT[];
  focusedSwimlane?: SwimlaneT | null;
  setFocusedSwimlane?: (lane: SwimlaneT | null) => void;
}

export default function TimelineAside({
  swimlanes,
  pixelsPerResource,
  focusedSwimlane,
  setFocusedSwimlane = () => {},
}: TimelineAsideProps) {
  return (
    <div className="timeline-aside">
      {swimlanes &&
        swimlanes.map((swimlane, index) => (
          <div
            key={index}
            className={`timeline-aside-resource-label ${
              focusedSwimlane && focusedSwimlane.id === swimlane.id
                ? "timeline-aside-resource-label-focused"
                : ""
            }`}
            style={{ height: `${pixelsPerResource}px` }}
            onClick={() => {
              setFocusedSwimlane(swimlane);
            }}
          >
            {swimlane.id}
          </div>
        ))}
    </div>
  );
}
