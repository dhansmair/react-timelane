import { useContext } from "react";
import { TimelineSettingsContext } from "../components/TimelineSettingsContext";

export const useTimelineContext = () => {
  return useContext(TimelineSettingsContext);
};
