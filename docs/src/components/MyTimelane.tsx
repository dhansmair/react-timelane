import { addDays, min } from "date-fns";
import { useState, type MouseEvent } from "react";
import {
  type AvailableSpace,
  type SwimlaneT,
  type CoreItem,
  type ItemId,
  type TimelaneSettings,
  TimelaneLayout,
  TimelaneHeader,
  TimelaneAside,
  TimelaneBackground,
  TimelaneBody,
  useScroll,
  TimelaneWrapper,
  CoreSwimlane,
} from "react-timelane";
import type Allocation from "../models/Allocation";
import type Resource from "../models/Resource";
import AllocationComponent from "./AllocationComponent";
import {
  DEFAULT_ALLOCATION_COLOR,
  DEFAULT_ALLOCATION_DESCRIPTION,
  DEFAULT_ALLOCATION_NAME,
} from "../constants";

const defaultSettings: TimelaneSettings = {
  showMonths: true,
  showWeeks: true,
  showDays: true,
  start: new Date(2025, 3, 1),
  end: new Date(2025, 6, 2),
  pixelsPerDay: 50,
  pixelsPerResource: 100,
  allowOverlaps: false,
  focusedDate: null,
};

interface MyTimelaneProps {
  resources: Resource[];
  allocations: Allocation[];
  focusedDay?: Date | null;
  setFocusedResource?: (resource: Resource | null) => void;
  setFocusedDay?: (day: Date | null) => void;
  onAllocationCreate?: (allocation: Allocation) => void;
  onAllocationUpdate?: (allocation: Allocation) => void;
  onAllocationDelete?: (allocation: Allocation) => void;
  onAllocationClick?: (allocation: Allocation, e: MouseEvent | null) => void;
  onAllocationContextMenu?: (allocation: Allocation, e: MouseEvent) => void;
  onAreaSearchClick: (area: Resource) => void;
  onAreaClick?: (area: Resource, e: MouseEvent) => void;
}

export default function MyTimelane(props: MyTimelaneProps) {
  return (
    <TimelaneWrapper {...defaultSettings}>
      <MyTimelaneContent {...props} />
    </TimelaneWrapper>
  );
}

interface MyTimelaneContentProps {
  resources: Resource[];
  allocations: Allocation[];
  focusedDay?: Date | null;
  setFocusedResource?: (resource: Resource | null) => void;
  setFocusedDay?: (day: Date | null) => void;
  onAllocationCreate?: (allocation: Allocation) => void;
  onAllocationUpdate?: (allocation: Allocation) => void;
  onAllocationDelete?: (allocation: Allocation) => void;
  onAllocationClick?: (allocation: Allocation, e: MouseEvent | null) => void;
  onAllocationContextMenu?: (allocation: Allocation, e: MouseEvent) => void;
  onAreaSearchClick: (area: Resource) => void;
  onAreaClick?: (area: Resource, e: MouseEvent) => void;
}

function MyTimelaneContent({
  resources,
  allocations,
  focusedDay,
  setFocusedDay,
  onAllocationCreate = () => {},
  onAllocationUpdate = () => {},
}: MyTimelaneContentProps) {
  function handleResourceDoubleClick(
    resource: Resource,
    when: Date,
    availableSpace: AvailableSpace | null
  ) {
    if (!availableSpace) return;

    const halfSize = Math.floor(resource.capacity / 2);
    const start: Date = when;
    const end: Date = min([availableSpace.end, addDays(start, 7)]);
    const offset: number = availableSpace.minOffset;
    const size: number = Math.min(
      availableSpace.maxOffset - availableSpace.minOffset,
      halfSize
    );

    const newAllocation: Allocation = {
      id: allocations.length + 1,
      name: DEFAULT_ALLOCATION_NAME,
      resourceId: resource.id,
      description: DEFAULT_ALLOCATION_DESCRIPTION,
      start: start,
      end: end,
      size: size,
      offset: offset,
      color: DEFAULT_ALLOCATION_COLOR,
    };

    onAllocationCreate(newAllocation);
  }

  const [selection, setSelection] = useState<ItemId[]>([]);

  const lanes: SwimlaneT[] = resources.map((resource) => ({
    id: resource.id,
    capacity: resource.capacity,
  }));

  const items: CoreItem<Allocation>[] = allocations.map((allocation) => ({
    id: allocation.id,
    swimlaneId: allocation.resourceId,
    start: allocation.start,
    end: allocation.end,
    size: allocation.size,
    offset: allocation.offset,
    payload: allocation,
  }));

  const { scrollTo } = useScroll();

  function handleItemUpdate(item: CoreItem<Allocation>) {
    console.log("item update", item);

    const updatedAllocation: Allocation = {
      ...item.payload,
      resourceId: item.swimlaneId,
      start: item.start,
      end: item.end,
      size: item.size,
      offset: item.offset,
    };

    onAllocationUpdate(updatedAllocation);
  }

  function handleLaneClick(lane: SwimlaneT, when: Date) {
    console.log("clicked", lane, when);
    scrollTo({ horz: when });
  }

  function handleLaneDoubleClick(
    lane: SwimlaneT,
    when: Date,
    availableSpace: AvailableSpace | null
  ) {
    console.log("double clicked", lane);

    const resource: Resource | undefined = resources.find(
      (a) => a.id === lane.id
    );

    if (resource !== undefined) {
      handleResourceDoubleClick(resource, when, availableSpace);
    }
  }

  return (
    <>
      <TimelaneHeader
        focusedDay={focusedDay}
        setFocusedDay={setFocusedDay}
        onDayClick={({ day }) => {
          console.log("day clicked", day);
        }}
        onMonthClick={({ firstDay }) => {
          console.log("month clicked", firstDay);
        }}
        onWeekClick={({ firstDay }) => {
          console.log("week clicked", firstDay);
        }}
      />
      <TimelaneBody
        onSelect={(selection) => {
          console.info(selection);
          setSelection(selection);
        }}
      >
        {lanes.map((lane) => (
          <CoreSwimlane
            key={lane.id}
            swimlane={lane}
            items={items.filter((item) => item.swimlaneId === lane.id)}
            onItemUpdate={handleItemUpdate}
            onClick={(when) => handleLaneClick(lane, when)}
            onDoubleClick={(when, availableSpace) =>
              handleLaneDoubleClick(lane, when, availableSpace)
            }
            renderItem={(item, isDragged) => (
              <AllocationComponent
                allocation={item.payload}
                isDragged={isDragged}
                isSelected={selection.includes(item.id)}
                onClick={() => {
                  scrollTo(item.id);
                }}
              />
            )}
          />
        ))}
      </TimelaneBody>
      <TimelaneBackground focusedDay={focusedDay} />
      <TimelaneAside
        swimlanes={lanes}
        onSwimlaneHeaderClick={(lane) => {
          scrollTo({ vert: lane.id });
        }}
        renderSwimlaneHeader={(lane) => <div>{lane.id}</div>}
      />
      <TimelaneLayout.Corner />
    </>
  );
}
