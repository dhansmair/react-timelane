import { addDays, min } from "date-fns";
import { useEffect, useState, type MouseEvent } from "react";
import {
  type AvailableSpace,
  type Lane,
  type Item,
  type ItemId,
  useScroll,
} from "react-timelane";
import type Allocation from "../models/Allocation";
import type Resource from "../models/Resource";
import AllocationComponent from "./AllocationComponent";
import {
  DEFAULT_ALLOCATION_COLOR,
  DEFAULT_ALLOCATION_DESCRIPTION,
  DEFAULT_ALLOCATION_NAME,
} from "../constants";

import { Timelane as TL } from "react-timelane";

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
  searchText: string | null;
}

export default function MyTimelane(props: MyTimelaneProps) {
  return <MyTimelaneContent {...props} />;
}

function MyTimelaneContent({
  resources,
  allocations,
  focusedDay,
  setFocusedDay,
  onAllocationCreate = () => {},
  onAllocationUpdate = () => {},
  searchText,
}: MyTimelaneProps) {
  const [selection, setSelection] = useState<ItemId[]>([]);
  const { scrollTo } = useScroll();

  useEffect(() => {
    if (searchText !== null) {
      const searchNumber = Number.parseInt(searchText);

      const searchedAllocation = allocations.find((a) => a.id === searchNumber);

      if (searchedAllocation) {
        scrollTo(searchNumber);
      }
    }
  }, [allocations, searchText, scrollTo]);

  const lanes: Lane[] = resources.map((resource) => ({
    id: resource.id,
    capacity: resource.capacity,
  }));

  const items: Item<Allocation>[] = allocations.map((allocation) => ({
    id: allocation.id,
    laneId: allocation.resourceId,
    start: allocation.start,
    end: allocation.end,
    size: allocation.size,
    offset: allocation.offset,
    payload: allocation,
  }));

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

  function handleItemUpdate(item: Item<Allocation>) {
    console.log("item update", item);

    const updatedAllocation: Allocation = {
      ...item.payload,
      resourceId: item.laneId,
      start: item.start,
      end: item.end,
      size: item.size,
      offset: item.offset,
    };

    onAllocationUpdate(updatedAllocation);
  }

  function handleLaneClick(lane: Lane, when: Date) {
    console.log("clicked", lane, when);
    scrollTo({ horz: when });
  }

  function handleLaneDoubleClick(
    lane: Lane,
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
    <TL.Container>
      <TL.Header
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
      <TL.Body
        onSelect={(selection) => {
          console.info(selection);
          setSelection(selection);
        }}
      >
        {lanes.map((lane) => (
          <TL.Lane
            key={lane.id}
            lane={lane}
            items={items.filter((item) => item.laneId === lane.id)}
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
      </TL.Body>
      <TL.Background focusedDay={focusedDay} />
      <TL.Aside
        lanes={lanes}
        onLaneHeaderClick={(lane) => {
          scrollTo({ vert: lane.id });
        }}
        renderLaneHeader={(lane) => <div>{lane.id}</div>}
      />
      <TL.Layout.Corner />
    </TL.Container>
  );
}
