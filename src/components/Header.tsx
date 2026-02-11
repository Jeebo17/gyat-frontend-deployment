import { motion } from 'framer-motion';
import { IoHomeOutline, IoHome, IoMapOutline, IoMap, IoSettingsOutline, IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { ThemeToggle } from './ThemeToggle';

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
                className="flex items-center px-8 h-14 border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/80"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-1">
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

                <ThemeToggle />
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
    return (
        <motion.button
            onClick={onClick}
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
            <span className="text-md">
                {icon}
            </span>
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