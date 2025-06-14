import { ItemId } from "./ItemId";
import { SwimlaneId } from "./SwimlaneId";

export type CoreItem<T = void> = {
  id: ItemId;
  swimlaneId: SwimlaneId;
  start: Date;
  end: Date;
  size: number;
  offset: number;
  payload: T;
};

export function isCoreItem(a: object): a is CoreItem {
  return (
    "id" in a &&
    "swimlaneId" in a &&
    "start" in a &&
    "end" in a &&
    "size" in a &&
    "offset" in a
  );
}
