import { IoChevronDownOutline } from "react-icons/io5";
import { useState } from "react";
import { motion } from "framer-motion";

import { ThemeToggle } from "./ThemeToggle";
import { ProfileButton } from "./ProfileButton";

export function DropDownMenu() {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Profile', component: ProfileButton },
        { label: 'Theme', component: ThemeToggle },
    ];

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <div 
            className="fixed top-4 right-4 z-50"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
        >
            <div className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary">
                <motion.div
                    animate={{ rotate: menuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <IoChevronDownOutline size={30} data-testid="io5-chevron-down-outline" />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 pt-2 rounded-lg flex flex-col items-start gap-2"
                style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
            >
                {menuItems.map((item, index) => (
                    <motion.button
                        key={index}
                        onClick={() => {
                            setMenuOpen(false);
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        {item.component ? <item.component /> : item.label}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}
