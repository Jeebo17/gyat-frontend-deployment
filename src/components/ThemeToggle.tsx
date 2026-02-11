import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';
import { motion } from "framer-motion";

interface ThemeToggleProps {
    header?: boolean;
}

export function ThemeToggle({ header = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="z-50">
      {header ? (
        <motion.button
          onClick={toggleTheme}
          className="p-2 text-text-primary"
          aria-label="Toggle theme"
          whileHover={{ rotate: [0, -20, 20, 0], scale: 1.1 }}
          transition={{ duration: 0.6 }}
          onHoverEnd={() => {}}
        >
          {theme === 'light' ? (
            <IoMoonOutline size={25} data-testid="io5-moon-outline" />
          ) : (
            <IoSunnyOutline size={25} data-testid="io5-sunny-outline" />
          )}
        </motion.button>
      ) : (
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary"
          aria-label="Toggle theme"
          whileHover={{ rotate: [0, -20, 20, 0], scale: 1.1 }}
          transition={{ duration: 0.6 }}
          onHoverEnd={() => {}}
        >
          {theme === 'light' ? (
            <IoMoonOutline size={30} data-testid="io5-moon-outline" />
          ) : (
            <IoSunnyOutline size={30} data-testid="io5-sunny-outline" />
          )}
        </motion.button>
      )}


    </div>
  );
}
