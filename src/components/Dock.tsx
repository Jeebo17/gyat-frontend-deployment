import {
    motion,
    MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
    type SpringOptions,
    AnimatePresence
} from 'framer-motion';
import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { IoHomeOutline, IoHome, IoMapOutline, IoMap, IoSettingsOutline, IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router';

export type DockItemData = {
    icon: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
    className?: string;
};

export type DockProps = {
    className?: string;
    distance?: number;
    panelHeight?: number;
    baseItemSize?: number;
    dockHeight?: number;
    magnification?: number;
    spring?: SpringOptions;
};

type DockItemProps = {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    mouseX: MotionValue<number>;
    spring: SpringOptions;
    distance: number;
    baseItemSize: number;
    magnification: number;
    selected: boolean;
};

function DockItem({
    children,
    className = '',
    onClick,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
    selected,
}: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, val => {
        const rect = ref.current?.getBoundingClientRect() ?? {
        x: 0,
        width: baseItemSize
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
        ref={ref}
        style={{
            width: size,
            height: size,
            backdropFilter: 'blur(2px)',
            cursor: selected ? 'default' : 'pointer'
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-lg border-neutral-700 border-2 shadow-md ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        >
        {Children.map(children, child =>
            React.isValidElement(child)
            ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
            : child
        )}
        </motion.div>
    );
}

type DockLabelProps = {
    className?: string;
    children: React.ReactNode;
    isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) return;
        const unsubscribe = isHovered.on('change', latest => {
        setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 10 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`${className} absolute -bottom-5 left-1/2 w-fit whitespace-pre rounded-md px-2 py-0.5 text-sm font-semibold text-text-primary`}
                role="tooltip"
                style={{ x: '-50%' }}
                >
                {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

type DockIconProps = {
    className?: string;
    children: React.ReactNode;
    isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
    return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70, 
    distance = 200,
    panelHeight = 64,
    baseItemSize = 50
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const navigate = useNavigate();

    const selectedPage = window.location.pathname;

    const items = [
        {
            icon: selectedPage === "/" ? <IoHome data-testid="lucide-home" /> : <IoHomeOutline data-testid="lucide-home-outline" />,
            label: 'Home',
            path: '/',
            onClick: () => navigate("/")
        },
        {
            icon: selectedPage.endsWith("/map") ? <IoMap data-testid="lucide-map" /> : <IoMapOutline data-testid="lucide-map-outline" />,
            label: 'Map',
            path: '/map',
            onClick: () => navigate("/map")
        },
        {
            icon: selectedPage.endsWith("/settings") ? <IoSettings data-testid="lucide-settings" /> : <IoSettingsOutline data-testid="lucide-settings-outline" />,
            label: 'Settings',
            path: '/settings',
            onClick: () => navigate("/settings")
        },
    ];
    
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 select-none">
            <motion.div
                onMouseMove={({ pageX }) => {
                    mouseX.set(pageX);
                }}
                onMouseLeave={() => {
                    mouseX.set(Infinity);
                }}
                className={`${className} absolute left-1/2 transform -translate-x-1/2 flex items-start w-fit gap-4 rounded-2xl border-neutral-700 border-2 pt-2 px-2`}
                style={{ height: panelHeight }}
                role="toolbar"
                aria-label="Application dock"
            >
                {items.map((item, index) => (
                    <DockItem
                        key={index}
                        onClick={item.onClick}
                        mouseX={mouseX}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                        selected={selectedPage === item.path}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </motion.div>
        </div>
    );
}