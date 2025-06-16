import { createContext, Dispatch, SetStateAction } from "react";
import { TimelaneSettings } from "../types/";

const defaultTimelaneSettings: TimelaneSettings = {
  start: new Date(2025, 1, 1),
  end: new Date(2025, 5, 1),
  pixelsPerDay: 30,
  pixelsPerResource: 100,
  showMonths: true,
  showWeeks: true,
  showDays: true,
  allowOverlaps: true,
  focusedDate: null,
};

export interface TimelaneContextOuter {
  settings: TimelaneSettings;
  setSettings: Dispatch<SetStateAction<TimelaneSettings>>;
}

const defaultContext: TimelaneContextOuter = {
  settings: defaultTimelaneSettings,
  setSettings: () => undefined,
};

export const TimelaneSettingsContext =
  createContext<TimelaneContextOuter>(defaultContext);
