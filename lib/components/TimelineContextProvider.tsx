import { PropsWithChildren, useEffect, useState } from "react";
import { TimelineSettings } from "../types/TimelineSettings";
import { TimelineContext } from "./TimelineContext";

interface TimelineContextProviderProps {
  settings: TimelineSettings;
}

export const TimelineContextProvider = ({
  settings: _settings,
  children,
}: PropsWithChildren<TimelineContextProviderProps>) => {
  const [settings, setSettings] = useState<TimelineSettings>(_settings);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, _settings }));
  }, [_settings]);

  return (
    <TimelineContext.Provider value={{ settings, setSettings }}>
      {children}
    </TimelineContext.Provider>
  );
};
