import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="z-50">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <IoMoonOutline size={30} data-testid="io5-moon-outline" />
        ) : (
          <IoSunnyOutline size={30} data-testid="io5-sunny-outline" />
        )}
      </button>
    </div>
  );
}
