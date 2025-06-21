import type { ResourceId } from "./ResourceId";

export default interface Resource {
  id: ResourceId;
  name: string;
  description: string;
  capacity: number;
}
