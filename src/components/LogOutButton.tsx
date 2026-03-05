import { useState } from "react";
import { motion } from "framer-motion";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useAppSound } from '../hooks/useAppSound';
import popSound from "../assets/sounds/pop.mp3";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

interface LogoutButtonProps {
    header?: boolean;
}

export default function LogoutButton({ header = false }: LogoutButtonProps) {
    const navigate = useNavigate();
    const { isLoggedIn, isLoading, logout } = useAuth();
    const [isClicking, setIsClicking] = useState(false);
    const [play] = useAppSound(popSound, { volume: 0.3 });
    const { soundEnabled } = useSettings();

    if (isLoading || !isLoggedIn) {
        return null;
    }

    const handleClick = () => {
        if (soundEnabled) {
            play();
        }
        logout();
        navigate("/login");
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 400);
    };

    return (
        <div className="z-50">
            {header ? (
                <button
                    onClick={handleClick}
                    className="p-2 text-text-primary flex items-center"
                    aria-label="Log out"
                >
                    <motion.div
                        animate={isClicking ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <IoLogOutOutline size={26} data-testid="io5-log-out-outline" />
                    </motion.div>
                </button>
            ) : (
                <button
                    onClick={handleClick}
                    className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary flex items-center"
                    aria-label="Log out"
                >
                    <motion.div
                        animate={isClicking ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <IoLogOutOutline size={30} data-testid="io5-log-out-outline" />
                    </motion.div>
                </button>
            )}
        </div>
    );
}
