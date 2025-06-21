export default interface Allocation {
  id: number;
  resourceId: number;
  name: string;
  description: string;
  start: Date;
  end: Date;
  size: number;
  offset: number;
  color: string;
}
