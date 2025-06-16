import { ItemId } from "./ItemId";
import { LaneId } from "./LaneId";

export type Item<T = void> = {
  id: ItemId;
  laneId: LaneId;
  start: Date;
  end: Date;
  size: number;
  offset: number;
  payload: T;
};

export function isItem(a: object): a is Item {
  return (
    "id" in a &&
    "laneId" in a &&
    "start" in a &&
    "end" in a &&
    "size" in a &&
    "offset" in a
  );
}
