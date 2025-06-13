import AllocationId from "./AllocationId";
import ResourceId from "./ResourceId";

type CoreItem<T = void> = {
    id: AllocationId;
    resourceId: ResourceId;
    start: Date;
    end: Date;
    size: number;
    offset: number;
    payload: T;
};

export default CoreItem;

export function isCoreItem(a: any): a is CoreItem {
    return (
        "id" in a &&
        "resourceId" in a &&
        "start" in a &&
        "end" in a &&
        "size" in a &&
        "offset" in a
    );
}
