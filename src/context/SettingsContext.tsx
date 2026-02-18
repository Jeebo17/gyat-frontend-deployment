import { createContext, useContext, useState } from "react";


type Settings = {
  fontScale: number;
  setFontScale: (value: number) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
};

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontScale, setFontScale] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <SettingsContext.Provider
      value={{ fontScale, setFontScale, reducedMotion, setReducedMotion }}
    >
      <div style={{ fontSize: `${fontScale}rem` }}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
