import type Allocation from "./models/Allocation";
import type Resource from "./models/Resource";

export const DEFAULT_ALLOCATION_COLOR = "#A7C7E7";
export const DEFAULT_ALLOCATION_DESCRIPTION = "empty description";
export const DEFAULT_ALLOCATION_NAME = "New Allocation";

export const DEFAULT_RESOURCES: Resource[] = [
  { id: 0, capacity: 100, name: "Area 1", description: "" },
  { id: 1, capacity: 100, name: "Area 2", description: "" },
  { id: 2, capacity: 100, name: "Area 3", description: "" },
  { id: 3, capacity: 100, name: "Area 4", description: "" },
  { id: 5, capacity: 100, name: "Area 5", description: "" },
  { id: 6, capacity: 100, name: "Area 6", description: "" },
  { id: 7, capacity: 100, name: "Area 7", description: "" },
  { id: 8, capacity: 100, name: "Area 8", description: "" },
];

export const DEFAULT_ALLOCATIONS: Allocation[] = [
  {
    id: 0,
    name: "Allocation 0",
    start: new Date(2025, 4, 1),
    end: new Date(2025, 4, 20),
    size: 50,
    offset: 0,
    color: DEFAULT_ALLOCATION_COLOR,
    description: "",
    resourceId: 0,
  },
  {
    id: 1,
    name: "Allocation 1",
    start: new Date(2025, 4, 10),
    end: new Date(2025, 4, 25),
    size: 50,
    offset: 50,
    color: DEFAULT_ALLOCATION_COLOR,
    description: "",
    resourceId: 1,
  },
];
