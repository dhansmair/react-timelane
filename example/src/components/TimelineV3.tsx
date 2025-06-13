import { addDays, min } from "date-fns";
import { type Dispatch, type MouseEvent, type SetStateAction } from "react";
import TimelineBody from "./TimelineBody";
import {
  type TimeRange,
  type Pixels,
  type AllocationId,
  type AvailableSpace,
  TimelineWrapper,
  TimelineLayout,
  TimelineHeader,
  TimelineAside,
  TimelineBackground,
} from "react-timeline-calendar";
import "./Timeline.scss";
import type Allocation from "../models/Allocation";
import type Area from "../models/Area";

const DEFAULT_ALLOCATION_COLOR = "blue";
const DEFAULT_ALLOCATION_DESCRIPTION = "empty description";
const DEFAULT_ALLOCATION_NAME = "new Allocation";
const DEFAULT_ALLOCATION_TYPE = "pots";

interface TimelineV3Props {
  range: TimeRange;
  pixels: Pixels;
  areas: Area[];
  allocations: Allocation[];
  selectedAllocationIds: AllocationId[];
  focusedArea?: Area | null;
  focusedDay?: Date | null;
  showMonths?: boolean;
  showWeeks?: boolean;
  showDays?: boolean;
  allowOverlaps?: boolean;
  setFocusedArea?: (area: Area | null) => void;
  setFocusedDay?: (day: Date | null) => void;
  onAllocationCreate?: (allocation: Allocation) => void;
  onAllocationUpdate?: (allocation: Allocation) => void;
  onAllocationDelete?: (allocation: Allocation) => void;
  onAllocationClick?: (allocation: Allocation, e: MouseEvent | null) => void;
  onAllocationContextMenu?: (allocation: Allocation, e: MouseEvent) => void;
  onAreaSearchClick: (area: Area) => void;
  onAreaClick?: (area: Area, e: MouseEvent) => void;
  setSelectedAllocationIds: Dispatch<SetStateAction<AllocationId[]>>;
}

export default function TimelineV3({
  range,
  pixels,
  areas,
  allocations,
  selectedAllocationIds,
  focusedDay,
  focusedArea,
  showMonths = true,
  showWeeks = true,
  showDays = false,
  allowOverlaps = false,
  setFocusedDay,
  setFocusedArea,
  onAllocationCreate = () => {},
  onAllocationUpdate = () => {},
  onAllocationClick = () => {},
  onAreaSearchClick,
  onAllocationContextMenu,
  onAreaClick = () => {},
  setSelectedAllocationIds,
}: TimelineV3Props) {
  function handleAreaDoubleClick(
    area: Area,
    when: Date,
    availableSpace: AvailableSpace | null
  ) {
    if (!availableSpace) return;

    const halfSize = Math.floor((area.width * area.height) / 2);
    const start: Date = when;
    const end: Date = min([availableSpace.end, addDays(start, 7)]);
    const offset: number = availableSpace.minOffset;
    const size: number = Math.min(
      availableSpace.maxOffset - availableSpace.minOffset,
      halfSize
    );

    const newAllocation: Allocation = {
      id: -1,
      name: DEFAULT_ALLOCATION_NAME,
      resourceId: area.id,
      description: DEFAULT_ALLOCATION_DESCRIPTION,
      start: start.toISOString(),
      offset: offset,
      end: end.toISOString(),
      size: size,
      color: DEFAULT_ALLOCATION_COLOR,
      type: DEFAULT_ALLOCATION_TYPE,
    };

    onAllocationCreate(newAllocation);
  }

  return (
    <TimelineWrapper focusedDay={focusedDay} focusedSwimlane={focusedArea}>
      <TimelineLayout>
        <TimelineLayout.Header>
          <TimelineHeader
            range={range}
            pixels={pixels}
            focusedDay={focusedDay}
            setFocusedDay={setFocusedDay}
            hideDays={!showDays}
            hideMonths={!showMonths}
            hideWeeks={!showWeeks}
          />
        </TimelineLayout.Header>
        <TimelineLayout.Body>
          <TimelineBody
            range={range}
            pixels={pixels}
            areas={areas}
            allocations={allocations}
            selectedAllocationIds={selectedAllocationIds}
            focusedArea={focusedArea}
            allowOverlaps={allowOverlaps}
            onAllocationUpdate={onAllocationUpdate}
            onAllocationClick={onAllocationClick}
            onAreaDoubleClick={handleAreaDoubleClick}
            onAllocationContextMenu={onAllocationContextMenu}
            onAreaClick={onAreaClick}
            setSelectedAllocationIds={setSelectedAllocationIds}
          ></TimelineBody>
        </TimelineLayout.Body>
        <TimelineLayout.Background>
          <TimelineBackground
            range={range}
            pixels={pixels}
            focusedDay={focusedDay}
            setFocusedDay={setFocusedDay}
          />
        </TimelineLayout.Background>
        <TimelineLayout.Aside>
          <TimelineAside
            swimlanes={areas}
            pixelsPerResource={pixels.pixelsPerResource}
            focusedArea={focusedArea}
            setFocusedArea={setFocusedArea}
            onAreaSearchClick={onAreaSearchClick}
          />
        </TimelineLayout.Aside>
        <TimelineLayout.Corner />
      </TimelineLayout>
    </TimelineWrapper>
  );
}
