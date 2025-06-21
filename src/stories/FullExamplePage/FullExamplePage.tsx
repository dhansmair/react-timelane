import { useState } from "react";
import { Meta } from "@storybook/addon-docs/blocks";
import { DEFAULT_ALLOCATIONS, DEFAULT_RESOURCES } from "../constants";
import Allocation from "../models/Allocation";
import { MyTimelane } from "./MyTimelane";
import { TimelaneProps } from "../../components/Timelane/Timelane";
import "./FullExamplePage.scss";

export interface FullExamplePageProps extends TimelaneProps {}

export function FullExamplePage(settings: FullExamplePageProps) {
  const [allocations, setAllocations] =
    useState<Allocation[]>(DEFAULT_ALLOCATIONS);

  function handleAllocationCreate(newAllocation: Allocation) {
    setAllocations((prev) => [...prev, newAllocation]);
  }

  function handleAllocationUpdate(updatedAllocation: Allocation) {
    setAllocations((prev) =>
      prev.map((a) => {
        return a.id === updatedAllocation.id ? updatedAllocation : a;
      })
    );
  }

  return (
    <div className="example-page">
      <main>
        <Meta title="Configure your project" />
        <h1>Timelane Example</h1>
        <div>
          <p>
            This example tries to demonstrate all features within one component.
          </p>
          <ul>
            <li>double click to create a new allocation</li>
            <li>drag and drop allocations</li>
            <li>resize allocations</li>
            <li>press "shift" when scrolling to scroll horizonally</li>
            <li>
              allocation selection: use the mouse to select all allocations
              within a range
            </li>
            <li>
              scroll: Click on an allocation; The timelane window will scroll to
              center that allocation.
            </li>
          </ul>
        </div>
        <div className="timelane-container">
          <MyTimelane
            resources={DEFAULT_RESOURCES}
            allocations={allocations}
            onAllocationCreate={handleAllocationCreate}
            onAllocationUpdate={handleAllocationUpdate}
            timelaneParameters={settings}
          />
        </div>
      </main>
    </div>
  );
}
