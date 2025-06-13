import TimelineV3 from "./components/TimelineV3";
import { type TimeRange, type Pixels } from "react-timeline-calendar";
import "./App.css";

function App() {
  const range: TimeRange = {
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 1),
  };
  const pixels: Pixels = {
    pixelsPerDay: 50,
    pixelsPerResource: 100,
  };

  return (
    <>
      <h1>Vite + React</h1>
      <TimelineV3
        range={range}
        pixels={pixels}
        areas={[]}
        allocations={[]}
        selectedAllocationIds={[]}
        onAreaSearchClick={() => {}}
        setSelectedAllocationIds={() => {}}
      />
    </>
  );
}

export default App;
