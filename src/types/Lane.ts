import { LaneId } from "./LaneId";

export interface Lane<T = unknown> {
  id: LaneId;
  capacity: number;
  payload?: T;
}
