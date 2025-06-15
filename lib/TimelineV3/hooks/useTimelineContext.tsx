import { useContext } from "react";
import { TimelineContext } from "../TimelineContext";

export const useTimelineContext = () => {
  return useContext(TimelineContext);
};
