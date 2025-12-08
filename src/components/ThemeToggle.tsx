import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon size={20} data-testid="lucide-moon" />
        ) : (
          <Sun size={20} data-testid="lucide-sun" />
        )}
      </button>
    </div>
  );
}
