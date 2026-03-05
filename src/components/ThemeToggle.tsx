import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';
import { motion } from "framer-motion";
import { useState } from "react";
import { useAppSound } from '../hooks/useAppSound';
import popSound from '../assets/sounds/pop.mp3';

interface ThemeToggleProps {
    header?: boolean;
}

export default function ThemeToggle({ header = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [isClicking, setIsClicking] = useState(false);
  const [play] = useAppSound(popSound, { volume: 0.3 });

  return (
    <div className="z-50">
      {header ? (
        <button
          onClick={() => {
            play();
            toggleTheme();
            setIsClicking(true);
            setTimeout(() => setIsClicking(false), 400);
          }}
          className="p-2 text-text-primary flex items-center"
          aria-label="Toggle theme"
        >
          <motion.div
            animate={isClicking ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {theme === 'light' ? (
              <IoMoonOutline size={25} data-testid="io5-moon-outline" />
            ) : (
              <IoSunnyOutline size={25} data-testid="io5-sunny-outline" />
            )}
          </motion.div>
        </button>
      ) : (
        <button
          onClick={() => {
            play();
            toggleTheme();
            setIsClicking(true);
            setTimeout(() => setIsClicking(false), 400);
          }}
          className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary flex items-center"
          aria-label="Toggle theme"
        >
          <motion.div
            animate={isClicking ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {theme === 'light' ? (
              <IoMoonOutline size={30} data-testid="io5-moon-outline" />
            ) : (
              <IoSunnyOutline size={30} data-testid="io5-sunny-outline" />
            )}
          </motion.div>
        </button>
      )}
    </div>
  );
}
