import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoHomeOutline, IoHome, IoMapOutline, IoMap, IoSettingsOutline, IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { ProfileButton } from './ProfileButton';

export type HeaderProps = {
    className?: string;
};

export default function Header({ className = '' }: HeaderProps) {
    const navigate = useNavigate();
    const selectedPage = window.location.pathname;

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
                className="flex items-center justify-between pl-8 pr-2 h-14 bg-bg-secondary"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-1">
                    <h1>
                        <span className="text-2xl text-text-primary mr-6">GYAT</span>
                    </h1>

                    {items.map((item, index) => (
                        <HeaderItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            onClick={item.onClick}
                            selected={selectedPage === item.path}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle header={true} />
                    <ProfileButton header={true} />
                </div>
            </nav>
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