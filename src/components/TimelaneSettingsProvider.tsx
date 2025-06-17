import { PropsWithChildren, useEffect, useState } from "react";
import { TimelaneSettings } from "../types/TimelaneSettings";
import { TimelaneSettingsContext } from "./TimelaneSettingsContext";

interface TimelaneSettingsProviderProps {
  settings: TimelaneSettings;
}

export const TimelaneSettingsProvider = ({
  settings: _settings,
  children,
}: PropsWithChildren<TimelaneSettingsProviderProps>) => {
  const [settings, setSettings] = useState<TimelaneSettings>(_settings);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, ..._settings }));
  }, [_settings]);

  return (
    <TimelaneSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </TimelaneSettingsContext.Provider>
  );
};
