import { FC } from "react";
import { FaPlus, FaMinus, FaArrowRotateLeft } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";

interface ZoomControlsProps {
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
}

const ZoomControls: FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onReset }) => {
    const { theme } = useTheme();

    const buttonClasses = `p-2 rounded-lg shadow hover:bg-text-secondary transition duration-500 bg-text-primary ${
        theme === "dark" ? "text-black" : "text-white"
    }`;

    return (
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 sm:gap-2">
            <button 
                onClick={onZoomIn} 
                className={buttonClasses}
                aria-label="Zoom in"
            >
                <FaPlus size={25} />
            </button>
            <button 
                onClick={onZoomOut} 
                className={buttonClasses}
                aria-label="Zoom out"
            >
                <FaMinus size={25} />
            </button>
            <button 
                onClick={onReset} 
                className={buttonClasses}
                aria-label="Reset zoom"
            >
                <FaArrowRotateLeft size={25} />
            </button>
        </div>
    );
};

export default ZoomControls;
