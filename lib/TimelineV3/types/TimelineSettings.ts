import { Pixels } from "./Pixels";
import { TimeRange } from "./TimeRange";

export interface TimelineSettings extends Pixels, TimeRange {
  showMonths: boolean;
  showWeeks: boolean;
  showDays: boolean;
  allowOverlaps: boolean;
}
