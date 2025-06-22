import { PropsWithChildren, useEffect, useState } from "react";
import { TimelaneSettings } from "../../types/TimelaneSettings";
import { TimelaneSettingsContext } from "./TimelaneSettingsContext";

export interface TimelaneSettingsProviderProps {
  settings: TimelaneSettings;
}

/**
 * `<TimelaneSettingsProvider>` can be wrapped around a `<Timelane>` to provide
 * the settings context. Settings will be overwritten by any prop set on `<Timelane>` itself.
 *
 * It is needed when you want to use the `useScroll` hook outside of a Timelane component,
 * since `useScroll` requires access to the settings `start`, `end`, and `pixelsPerDay`.
 */
export function TimelaneSettingsProvider({
  settings: _settings,
  children,
}: PropsWithChildren<TimelaneSettingsProviderProps>) {
  const [settings, setSettings] = useState<TimelaneSettings>(_settings);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, ..._settings }));
  }, [_settings]);

  return (
    <TimelaneSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </TimelaneSettingsContext.Provider>
  );
}
