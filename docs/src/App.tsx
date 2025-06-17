import React from "react";
import { useState } from "react";
import MyTimelane from "./components/MyTimelane";
import type Allocation from "./models/Allocation";
import useLocalStorage from "./hooks/useLocalStorage";
import { DEFAULT_ALLOCATIONS, DEFAULT_RESOURCES } from "./constants";
import { Checkbox, Col, Flex, Input, Row } from "antd";
import { DatePicker } from "antd";
import type { InputNumberProps } from "antd";
import { InputNumber, Slider, Space } from "antd";
import dayjs from "dayjs";

import "@ant-design/v5-patch-for-react-19";

const { RangePicker } = DatePicker;

import "react-timelane/style.css";
import "./App.css";
import { TimelaneSettingsProvider } from "react-timelane";
import type { TimelaneSettings } from "react-timelane";

const { Search } = Input;

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

function App() {
  const [allocations, setAllocations] = useLocalStorage<Allocation[]>(
    "allocations",
    DEFAULT_ALLOCATIONS
  );

  const [settings, setSettings] = useState<TimelaneSettings>(defaultSettings);
  const [searchText, setSearchText] = useState<string | null>(null);

  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: "1200px",
      }}
    >
      <h1>Timelane Demo</h1>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div>
          <Flex justify="space-between">
            <div style={{ width: 200 }}></div>
            <RangePicker
              defaultValue={[dayjs(settings.start), dayjs(settings.end)]}
              onChange={(dates) => {
                if (dates === null) return;
                setSettings((prev) => ({
                  ...prev,
                  start: dates[0] ? dates[0].toDate() : prev.start,
                  end: dates[1] ? dates[1].toDate() : prev.end,
                }));
              }}
            />
            <Search
              placeholder="search item ID"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              style={{ width: 200 }}
            />
          </Flex>
        </div>
        <div style={{ height: "600px", border: "1px solid #ccc" }}>
          <TimelaneSettingsProvider settings={settings}>
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
                    return a.id === updatedAllocation.id
                      ? updatedAllocation
                      : a;
                  })
                );
              }}
              searchText={searchText}
            />
          </TimelaneSettingsProvider>
        </div>

        <div>
          <Row>
            <Col span={3}>Pixels per day:</Col>
            <Col span={9}>
              <IntegerStep
                min={20}
                max={500}
                inputValue={settings.pixelsPerDay}
                onChange={(newValue) => {
                  setSettings((prev) => ({
                    ...prev,
                    pixelsPerDay: newValue,
                  }));
                }}
              />
            </Col>
            <Col span={3}>Pixels per lane:</Col>
            <Col span={9}>
              <IntegerStep
                min={50}
                max={300}
                inputValue={settings.pixelsPerResource}
                onChange={(newValue) => {
                  setSettings((prev) => ({
                    ...prev,
                    pixelsPerResource: newValue,
                  }));
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Checkbox
                checked={settings.showMonths}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    showMonths: e.target.checked,
                  }))
                }
              >
                show months
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col>
              <Checkbox
                checked={settings.showWeeks}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    showWeeks: e.target.checked,
                  }))
                }
              >
                show weeks
              </Checkbox>
            </Col>
          </Row>

          <Row>
            <Col>
              <Checkbox
                checked={settings.showDays}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    showDays: e.target.checked,
                  }))
                }
              >
                show days
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col>
              <Checkbox
                checked={settings.allowOverlaps}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    allowOverlaps: e.target.checked,
                  }))
                }
              >
                allow overlaps
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Space>
    </main>
  );
}

export default App;

interface IntegerStepProps {
  min: number;
  max: number;
  inputValue: number;
  onChange: (x: number) => void;
}

const IntegerStep: React.FC<IntegerStepProps> = ({
  min,
  max,
  inputValue,
  onChange: _onChange,
}) => {
  // const [inputValue, setInputValue] = useState(value);

  const onChange: InputNumberProps["onChange"] = (newValue) => {
    // setInputValue(newValue as number);
    _onChange(newValue as number);
    //
  };

  return (
    <Row>
      <Col span={12}>
        <Slider
          min={min}
          max={max}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={min}
          max={max}
          style={{ margin: "0 16px" }}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};
