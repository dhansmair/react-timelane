export interface TimelaneSettings {
  start: Date;
  end: Date;
  pixelsPerDay: number;
  pixelsPerResource: number;
  showMonths: boolean;
  showWeeks: boolean;
  showDays: boolean;
  allowOverlaps: boolean;
  focusedDate: Date | null;
}
