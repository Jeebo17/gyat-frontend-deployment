import { useState, useEffect } from "react";

interface TileProps {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    colour: string;
    title: string;
    onDrag: (x: number, y: number) => void;
    icon?: React.ComponentType<{ className?: string }>;
    canHover?: boolean;
    onClick?: () => void;
    editMode: boolean;
}

const colourClasses: Record<string, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    zinc: "bg-zinc-500"
};

function Tile({ x, y, width, height, rotation, colour, title, onDrag, icon: Icon, canHover = true, onClick, editMode }: TileProps) {
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ dx: 0, dy: 0 });
    const colourClass = colourClasses[colour] || "bg-gray-500";

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setOffset({
            dx: e.clientX - x,
            dy: e.clientY - y
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            const newX = e.clientX - offset.dx;
            const newY = e.clientY - offset.dy;
            onDrag(newX, newY);
        };

        const handleMouseUp = () => setDragging(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, offset, onDrag]);

    return (
        <div
            className={`${colourClass} p-4 rounded-md flex items-center text-center justify-center absolute select-none ${editMode ? "cursor-move" : ""} ${canHover ? "hover:brightness-110 transition-all duration-75 hover:border-2 border-white" : ""}`}
            style={{ left: x, top: y, width, height, transform: `rotate(${rotation}deg)` }}
            onMouseDown={editMode ? handleMouseDown : undefined}
            onClick={onClick}
        >
            <p>{title}</p>
            {Icon && <Icon className="absolute bottom-2 right-2 w-6 h-6 opacity-100" />}
        </div>
    );
}

export default Tile;
export type { TileProps };
