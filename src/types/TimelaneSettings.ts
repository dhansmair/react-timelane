import { EnableResizing } from "./EnableResizing";

export interface TimelaneSettings {
  start: Date;
  end: Date;
  pixelsPerDay: number;
  pixelsPerLane: number;
  showMonths: boolean;
  showWeeks: boolean;
  showDays: boolean;
  allowOverlaps: boolean;
  focusedDate: Date | null;
  enableItemResizing: boolean | EnableResizing;
  enableItemDragging: boolean;
}
