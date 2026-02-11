import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';
import { motion } from "framer-motion";
import { useState } from "react";
import useSound from 'use-sound';
import popSound from '../assets/sounds/pop.mp3';

interface ThemeToggleProps {
    header?: boolean;
}

export function ThemeToggle({ header = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [play] = useSound(popSound, { volume: 0.5 });

  return (
    <div className="z-50">
      {header ? (
        <button
          onClick={() => {
            play();
            toggleTheme();
          }}
          className="p-2 text-text-primary flex items-center"
          aria-label="Toggle theme"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
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
          }}
          className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary flex items-center"
          aria-label="Toggle theme"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
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
