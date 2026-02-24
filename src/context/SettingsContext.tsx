import { createContext, useContext, useState } from "react";
import { useEffect } from "react";


type Settings = {
  fontScale: number;
  setFontScale: (value: number) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
};

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontScale, setFontScale] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (highContrast) {
        document.documentElement.classList.add("high-contrast");
    } else {
        document.documentElement.classList.remove("high-contrast");
    }
    }, [highContrast]);

  // Apply fontScale to the root <html> element so all rem-based sizes
  // (including Tailwind classes like text-4xl) scale proportionally.
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontScale]);

  return (
    <SettingsContext.Provider
      value={{ fontScale, setFontScale, reducedMotion, setReducedMotion, highContrast, setHighContrast, soundEnabled, setSoundEnabled }}
    >
        {children}
    </SettingsContext.Provider>
  );

  
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};


