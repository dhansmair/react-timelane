import { useContext } from "react";
import { TimelineContext } from "../components/TimelineContext";

export const useTimelineContext = () => {
  return useContext(TimelineContext);
};
