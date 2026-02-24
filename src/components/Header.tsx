import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { IoHomeOutline, IoHome, IoMapOutline, IoMap, IoSettingsOutline, IoSettings, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { ProfileButton } from './ProfileButton';
import { useAppSound } from '../hooks/useAppSound';
import popSound from '../assets/sounds/pop.mp3';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export type HeaderProps = {
    className?: string;
};

export default function Header({ className = '' }: HeaderProps) {
    const navigate = useNavigate();
    const selectedPage = window.location.pathname;
    const [play] = useAppSound(popSound, { volume: 0.3 });
    const { isLoggedIn, userName } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { soundEnabled } = useSettings();

    const items = [
        {
            icon: selectedPage === "/" ? <IoHome data-testid="io5-home" /> : <IoHomeOutline data-testid="io5-home-outline" />,
            label: 'Home',
            path: '/',
            onClick: () => navigate("/")
        },
        {
            icon: selectedPage.endsWith("/map") ? <IoMap data-testid="io5-map" /> : <IoMapOutline data-testid="io5-map-outline" />,
            label: 'Map',
            path: '/map',
            onClick: () => navigate("/map")
        },
        {
            icon: selectedPage.endsWith("/settings") ? <IoSettings data-testid="io5-settings" /> : <IoSettingsOutline data-testid="io5-settings-outline" />,
            label: 'Settings',
            path: '/settings',
            onClick: () => navigate("/settings")
        },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-40 select-none ${className}`}
            role="banner"
        >
            <nav 
                className="flex items-center justify-between px-3 sm:pl-8 sm:pr-2 h-14 bg-bg-secondary"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-1">
                    <h1>
                        <span 
                            className="text-xl sm:text-2xl text-text-primary mr-2 sm:mr-6"
                            onClick={() => navigate("/")}
                        >GYAT</span>
                    </h1>

                    {/* Desktop nav items */}
                    <div className="hidden sm:flex items-center gap-1">
                        {items.map((item, index) => (
                            <HeaderItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => {
                                    if (soundEnabled) {
                                        play();
                                    }
                                    item.onClick();
                                }}
                                selected={selectedPage === item.path}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop rhs controls */}
                <div className="hidden sm:flex items-center gap-2">
                    {isLoggedIn && userName && (
                        <span className="text-sm text-text-secondary mr-2">Hi, {userName}</span>
                    )}
                    <ThemeToggle header={true} />
                    <ProfileButton header={true} />
                </div>

                {/* Mobile hamborgir button */}
                <button
                    className="sm:hidden p-2 text-text-primary"
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {mobileMenuOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
                </button>
            </nav>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="sm:hidden bg-bg-secondary border-t border-border-light overflow-hidden"
                    >
                        <div className="flex flex-col px-4 py-3 gap-1">
                            {items.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (soundEnabled) {
                                            play();
                                        }
                                        item.onClick();
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                                        selectedPage === item.path
                                            ? 'text-text-primary bg-bg-tertiary font-medium'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border-light">
                                <div className="flex items-center gap-2">
                                    {isLoggedIn && userName && (
                                        <span className="text-sm text-text-secondary">Hi, {userName}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <ThemeToggle header={true} />
                                    <ProfileButton header={true} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

type HeaderItemProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    selected: boolean;
};

function HeaderItem({ icon, label, selected, onClick }: HeaderItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
                relative flex items-center gap-2 px-4 h-14
                transition-colors duration-150
                ${selected 
                    ? 'text-text-primary cursor-default' 
                    : 'text-text-primary/60 hover:text-text-primary cursor-pointer'
                }
            `}
            disabled={selected}
            aria-current={selected ? 'page' : undefined}
        >
            {/* <motion.div 
                className="text-md"
                animate={isHovered && !selected ? { rotate: [0, -20, 20, 0] } : { rotate: 0 }}
                transition={{ duration: 0.6 }}
            >
                {icon}
            </motion.div> */}
            <span className="text-md font-light tracking-wide">
                {label}
            </span>
            {selected && (
                <motion.div
                    layoutId="headerIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}
        </motion.button>
    );
}