import { useState } from "react";
import MyTimelane from "./components/MyTimelane";
import type Allocation from "./models/Allocation";
import useLocalStorage from "./hooks/useLocalStorage";
import { DEFAULT_ALLOCATIONS, DEFAULT_RESOURCES } from "./constants";
import "react-timelane/style.css";
import "./App.css";

function App() {
  const [allocations, setAllocations] = useLocalStorage<Allocation[]>(
    "allocations",
    DEFAULT_ALLOCATIONS
  );

  const [focusedDay, setFocusedDay] = useState<Date | null>(null);

  return (
    <>
      <h1>Timelane Demo</h1>
      <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
        <MyTimelane
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
      </div>
    </>
  );
}

export default App;
