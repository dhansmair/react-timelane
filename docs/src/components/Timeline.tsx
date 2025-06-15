import { addDays, min } from "date-fns";
import { useState, type MouseEvent } from "react";
import {
  type AvailableSpace,
  type SwimlaneT,
  type CoreItem,
  type ItemId,
  TimelineLayout,
  TimelineHeader,
  TimelineAside,
  TimelineBackground,
  TimelineBody,
  TimelineSelectionLayer,
  useScroll,
} from "react-timeline-calendar";
import type Allocation from "../models/Allocation";
import type Resource from "../models/Resource";
import AllocationComponent from "./AllocationComponent";
import {
  DEFAULT_ALLOCATION_COLOR,
  DEFAULT_ALLOCATION_DESCRIPTION,
  DEFAULT_ALLOCATION_NAME,
} from "../constants";

interface TimelineProps {
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

export default function Timeline({
  resources,
  allocations,
  focusedDay,
  setFocusedDay,
  onAllocationCreate = () => {},
  onAllocationUpdate = () => {},
}: TimelineProps) {
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

  return (
    <TimelineLayout>
      <TimelineLayout.Header>
        <TimelineHeader
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
      </TimelineLayout.Header>
      <TimelineLayout.Body>
        <TimelineSelectionLayer
          onSelect={(selection) => {
            console.info(selection);
            setSelection(selection);
          }}
        >
          <TimelineBody
            lanes={lanes}
            items={items}
            renderItem={(item, isDragged) => (
              <AllocationComponent
                allocation={item.payload}
                isDragged={isDragged}
                onClick={() => {
                  scrollTo(item.id);
                }}
                onContextMenu={() => {}}
                isSelected={selection.includes(item.id)}
              />
            )}
            onLaneClick={(lane, when) => {
              console.log("clicked", lane);
              scrollTo({ horz: when });
            }}
            onLaneDoubleClick={(lane, when, availableSpace) => {
              console.log("double clicked", lane);

              const resource: Resource | undefined = resources.find(
                (a) => a.id === lane.id
              );

              if (resource !== undefined) {
                handleResourceDoubleClick(resource, when, availableSpace);
              }
            }}
            onItemUpdate={(item) => {
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
            }}
          />
        </TimelineSelectionLayer>
      </TimelineLayout.Body>
      <TimelineLayout.Background>
        <TimelineBackground focusedDay={focusedDay} />
      </TimelineLayout.Background>
      <TimelineLayout.Aside>
        <TimelineAside
          swimlanes={lanes}
          onSwimlaneHeaderClick={(lane) => {
            scrollTo({ vert: lane.id });
          }}
          renderSwimlaneHeader={(lane) => <div>{lane.id}</div>}
        />
      </TimelineLayout.Aside>
      <TimelineLayout.Corner />
    </TimelineLayout>
  );
}
