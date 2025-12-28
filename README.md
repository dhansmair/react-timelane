# react-timelane

A React/TypeScript library to build timelines / horizontally scrollable calendars with multiple lanes.

<img width="1145" alt="image" src="https://github.com/user-attachments/assets/a051f665-37ac-4292-9b85-7e1baa1bb84f" />

## Features

react-timelane has a particular focus on usability and comes with many neat features:

- item drag and drop
- item resizing
- jump (scroll) to point in time, lane or item
- item selection via mouse range

## Documentation

Docs and various demos are provided via Storybook: https://dhansmair.github.io/react-timelane

## Installation

```bash
npm install react-timelane
```

## Code Example

The following code example shows a basic custom Timelane, focusing on the component structure. See [docs/src/components/MyTimelane.tsx](https://github.com/dhansmair/react-timelane/blob/main/docs/src/components/MyTimelane.tsx) for the full example:

```typescript
import { addDays, min } from "date-fns";
import { useState, type MouseEvent } from "react";
import {
  type AvailableSpace,
  type Lane,
  type Item,
  type ItemId,
} from "react-timelane";
import type Allocation from "../models/Allocation";
import type Resource from "../models/Resource";
import AllocationComponent from "./AllocationComponent";

import { Timelane } from "react-timelane";

interface MyTimelaneProps {
  resources: Resource[];
  allocations: Allocation[];
  onAllocationCreate: (allocation: Allocation) => void;
  onAllocationUpdate: (allocation: Allocation) => void;
}

function MyTimelane({
  resources,
  allocations,
  onAllocationCreate,
  onAllocationUpdate,
}: MyTimelaneProps) {
  const [selection, setSelection] = useState<ItemId[]>([]);

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

  function handleItemUpdate(item: Item<Allocation>) {
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

  return (
    <Timelane>
      <Timelane.Header
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
      <Timelane.Body
        onSelect={(selection) => {
          setSelection(selection);
        }}
      >
        {lanes.map(({id, capacity}) => (
          <Timelane.Lane
            key={id}
            id={id}
            capacity={capacity}
            items={items.filter((item) => item.laneId === id)}
            onItemUpdate={handleItemUpdate}
            renderItem={(item, isDragged) => (
              <AllocationComponent
                allocation={item.payload}
                isDragged={isDragged}
                isSelected={selection.includes(item.id)}
              />
            )}
          />
        ))}
      </Timelane.Body>
      <Timelane.Background />
      <Timelane.Aside
        lanes={lanes}
        renderLaneHeader={(lane) => <div>{lane.id}</div>}
      />
      <Timelane.Layout.Corner />
    </Timelane.Container>
  );
}
```
