import { createContext, Dispatch, SetStateAction } from "react";
import { TimelineSettings } from "../types/TimelineSettings";

const defaultTimelineSettings: TimelineSettings = {
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

export interface TimelineContextOuter {
  settings: TimelineSettings;
  setSettings: Dispatch<SetStateAction<TimelineSettings>>;
}

const defaultContext: TimelineContextOuter = {
  settings: defaultTimelineSettings,
  setSettings: () => undefined,
};

export const TimelineSettingsContext =
  createContext<TimelineContextOuter>(defaultContext);
