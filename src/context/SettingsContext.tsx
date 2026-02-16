import { createContext, useContext, useState } from "react";

type Settings = {
  fontScale: number;
  setFontScale: (value: number) => void;
};

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontScale, setFontScale] = useState(1); 
  // 1 = normal size

  return (
    <SettingsContext.Provider value={{ fontScale, setFontScale }}>
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
