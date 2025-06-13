import Swimlane from "./core/types/Swimlane";

interface TimelineAsideProps {
  pixelsPerResource: number;
  swimlanes: Swimlane[];
  focusedArea?: Swimlane | null;
  setFocusedArea?: (area: Swimlane | null) => void;
  onAreaSearchClick: (area: Swimlane) => void;
}

export default function TimelineAside({
  swimlanes,
  pixelsPerResource,
  focusedArea,
  setFocusedArea = () => {},
  onAreaSearchClick,
}: TimelineAsideProps) {
  return (
    <div className="timeline-aside">
      {swimlanes &&
        swimlanes.map((swimlane, index) => (
          <div
            key={index}
            className={`timeline-aside-resource-label ${
              focusedArea && focusedArea.id === swimlane.id
                ? "timeline-aside-resource-label-focused"
                : ""
            }`}
            style={{ height: `${pixelsPerResource}px` }}
            onClick={(e) => {
              setFocusedArea(swimlane);
            }}
          >
            {swimlane.name}
            {/* <ResourceContextMenu
              area={area}
              onAreaSearchClick={onAreaSearchClick}
            /> */}
          </div>
        ))}
    </div>
  );
}
