import { useContext } from "react";
import { TimelaneSettingsContext } from "../components/TimelaneSettingsContext";

export const useTimelaneContext = () => {
  return useContext(TimelaneSettingsContext);
};
