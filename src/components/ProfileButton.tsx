import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProfileButtonProps {
    header?: boolean;
}

export function ProfileButton({ header = false }: ProfileButtonProps) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="z-50">
            {header ? (
                <button
                    onClick={() => navigate('/login')}
                    className="p-2 text-text-primary flex items-center"
                    aria-label="Profile"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <motion.div
                        animate={isHovered ? { rotate: [0, -20, 20, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <IoPersonCircleOutline size={30} data-testid="io5-person-circle-outline" />
                    </motion.div>
                </button>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary flex items-center"
                    aria-label="Profile"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <motion.div
                        animate={isHovered ? { rotate: [0, -20, 20, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <IoPersonCircleOutline size={30} data-testid="io5-person-circle-outline" />
                    </motion.div>
                </button>
            )}
        </div>
    );
}
