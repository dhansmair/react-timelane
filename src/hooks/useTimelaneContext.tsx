import { useContext } from "react";
import { TimelaneSettingsContext } from "../components/TimelaneSettingsProvider/TimelaneSettingsContext";

export const useTimelaneContext = () => {
  return useContext(TimelaneSettingsContext);
};
