import { useState } from "react";
import Timeline from "./components/Timeline";
import type Allocation from "./models/Allocation";
import useLocalStorage from "./hooks/useLocalStorage";
import { DEFAULT_ALLOCATIONS, DEFAULT_RESOURCES } from "./constants";
import { TimelineWrapper, type TimelineSettings } from "react-timelane";
import "react-timelane/style.css";
import "./App.css";

function App() {
  const [allocations, setAllocations] = useLocalStorage<Allocation[]>(
    "allocations",
    DEFAULT_ALLOCATIONS
  );

  const [focusedDay, setFocusedDay] = useState<Date | null>(null);

  const defaultSettings: TimelineSettings = {
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

  return (
    <>
      <h1>Timeline Demo</h1>
      <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
        <TimelineWrapper {...defaultSettings}>
          <Timeline
            resources={DEFAULT_RESOURCES}
            allocations={allocations}
            onAreaSearchClick={() => {}}
            onAllocationCreate={(newAllocation: Allocation) => {
              setAllocations((prev) => [...prev, newAllocation]);
            }}
            onAllocationUpdate={(updatedAllocation: Allocation) => {
              console.log("allocation update,", updatedAllocation);
              setAllocations((prev) =>
                prev.map((a) => {
                  return a.id === updatedAllocation.id ? updatedAllocation : a;
                })
              );
            }}
            focusedDay={focusedDay}
            setFocusedDay={setFocusedDay}
          />
        </TimelineWrapper>
      </div>
    </>
  );
}

export default App;
