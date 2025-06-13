export default interface Allocation {
  id: number;
  name: string;
  start: string;
  end: string;
  description: string;
  size: number;
  offset: number;
  color: string;
  type: string;
  resourceId: number;
}
