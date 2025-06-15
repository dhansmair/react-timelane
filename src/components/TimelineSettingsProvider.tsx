import { PropsWithChildren, useEffect, useState } from "react";
import { TimelineSettings } from "../types/TimelineSettings";
import { TimelineSettingsContext } from "./TimelineSettingsContext";

interface TimelineSettingsProviderProps {
  settings: TimelineSettings;
}

export const TimelineSettingsProvider = ({
  settings: _settings,
  children,
}: PropsWithChildren<TimelineSettingsProviderProps>) => {
  const [settings, setSettings] = useState<TimelineSettings>(_settings);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, _settings }));
  }, [_settings]);

  return (
    <TimelineSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </TimelineSettingsContext.Provider>
  );
};
