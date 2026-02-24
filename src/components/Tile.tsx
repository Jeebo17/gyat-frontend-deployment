import { useState, useEffect, useRef } from "react";
import { FaArrowRotateRight, FaTrash } from "react-icons/fa6";
import { TileData } from "../types/tile";
import { useTheme } from "../context/ThemeContext";


type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const colourClasses: Record<string, { light: string; dark: string }> = {
    red: { light: "bg-red-400", dark: "bg-red-500" },
    blue: { light: "bg-blue-400", dark: "bg-blue-500" },
    green: { light: "bg-green-400", dark: "bg-green-500" },
    yellow: { light: "bg-yellow-300", dark: "bg-yellow-500" },
    purple: { light: "bg-purple-400", dark: "bg-purple-500" },
    orange: { light: "bg-orange-400", dark: "bg-orange-500" },
    gray: { light: "bg-gray-300", dark: "bg-gray-500" },
    zinc: { light: "bg-zinc-300", dark: "bg-zinc-500" },
};

function Tile({
    id,
    equipment,
    xCoord,
    yCoord,
    width,
    height,
    rotation,
    colour,
    onUpdate,
    canPlace,
    canHover = true,
    onClick,
    editMode,
    dragOnly = false,
    scale = 1,
    gridSize = 20,
    snap = (v) => v,
    onDelete,
    highlighted = false,
}: TileData) {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<ResizeHandle | null>(null);
    const dragStartRef = useRef({ x: 0, y: 0, tileX: 0, tileY: 0 });
    const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, tileX: 0, tileY: 0 });
    
    // Track live position/size during drag for smooth visual feedback without parent updates
    const [liveX, setLiveX] = useState(xCoord);
    const [liveY, setLiveY] = useState(yCoord);
    const [liveWidth, setLiveWidth] = useState(width);
    const [liveHeight, setLiveHeight] = useState(height);

    // Sync live state when props change (e.g., when parent applies an update)
    useEffect(() => {
        setLiveX(xCoord);
        setLiveY(yCoord);
        setLiveWidth(width);
        setLiveHeight(height);
    }, [xCoord, yCoord, width, height]);
    
    const theme = useTheme();
    const colourClass = colourClasses[colour]
    ? theme.theme === 'light'
        ? colourClasses[colour].light
        : colourClasses[colour].dark
    : theme.theme === 'light'
        ? "bg-gray-300"
        : "bg-gray-600";

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((!editMode && !dragOnly) || !onUpdate) return;
        e.stopPropagation();

        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            tileX: xCoord,
            tileY: yCoord
        };
    };

    const handleResizeMouseDown = (handle: ResizeHandle, e: React.MouseEvent) => {
        if (!editMode || !onUpdate) return;
        e.stopPropagation();

        setIsResizing(handle);
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            width,
            height,
            tileX: xCoord,
            tileY: yCoord
        };
    };

    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = (e.clientX - dragStartRef.current.x) / scale;
                const deltaY = (e.clientY - dragStartRef.current.y) / scale;

                const newX = snap(dragStartRef.current.tileX + deltaX);
                const newY = snap(dragStartRef.current.tileY + deltaY);

                if (canPlace && !canPlace(id, { xCoord: newX, yCoord: newY, width: liveWidth, height: liveHeight })) {
                    return;
                }

                setLiveX(newX);
                setLiveY(newY);
            } else if (isResizing) {
                const deltaX = (e.clientX - resizeStartRef.current.x) / scale;
                const deltaY = (e.clientY - resizeStartRef.current.y) / scale;

                const start = resizeStartRef.current;
                let newX = start.tileX;
                let newY = start.tileY;
                let newWidth = start.width;
                let newHeight = start.height;

                const minSize = gridSize * 2;

                switch (isResizing) {
                    case 'e':
                        newWidth = Math.max(minSize, start.width + deltaX);
                        break;
                    case 'w':
                        newWidth = Math.max(minSize, start.width - deltaX);
                        newX = start.tileX + (start.width - newWidth);
                        break;
                    case 's':
                        newHeight = Math.max(minSize, start.height + deltaY);
                        break;
                    case 'n':
                        newHeight = Math.max(minSize, start.height - deltaY);
                        newY = start.tileY + (start.height - newHeight);
                        break;
                    case 'se':
                        newWidth = Math.max(minSize, start.width + deltaX);
                        newHeight = Math.max(minSize, start.height + deltaY);
                        break;
                    case 'sw':
                        newWidth = Math.max(minSize, start.width - deltaX);
                        newHeight = Math.max(minSize, start.height + deltaY);
                        newX = start.tileX + (start.width - newWidth);
                        break;
                    case 'ne':
                        newWidth = Math.max(minSize, start.width + deltaX);
                        newHeight = Math.max(minSize, start.height - deltaY);
                        newY = start.tileY + (start.height - newHeight);
                        break;
                    case 'nw':
                        newWidth = Math.max(minSize, start.width - deltaX);
                        newHeight = Math.max(minSize, start.height - deltaY);
                        newX = start.tileX + (start.width - newWidth);
                        newY = start.tileY + (start.height - newHeight);
                        break;
                }

                const snappedX = snap(newX);
                const snappedY = snap(newY);
                const snappedWidth = snap(newWidth);
                const snappedHeight = snap(newHeight);

                if (canPlace && !canPlace(id, { xCoord: snappedX, yCoord: snappedY, width: snappedWidth, height: snappedHeight })) {
                    return;
                }

                setLiveX(snappedX);
                setLiveY(snappedY);
                setLiveWidth(snappedWidth);
                setLiveHeight(snappedHeight);
            }
        };

        const handleMouseUp = () => {
            // Batch the update to parent only on mouse release
            if (onUpdate) {
                if (isDragging) {
                    onUpdate({ xCoord: liveX, yCoord: liveY });
                } else if (isResizing) {
                    onUpdate({
                        xCoord: liveX,
                        yCoord: liveY,
                        width: liveWidth,
                        height: liveHeight
                    });
                }
            }
            setIsDragging(false);
            setIsResizing(null);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizing, scale, snap, onUpdate, gridSize, liveX, liveY, liveWidth, liveHeight]);

    const resizeHandles: { handle: ResizeHandle; cursor: string; className: string }[] = [
        { handle: 'n', cursor: 'ns-resize', className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1' },
        { handle: 's', cursor: 'ns-resize', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full h-1' },
        { handle: 'e', cursor: 'ew-resize', className: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1 h-full' },
        { handle: 'w', cursor: 'ew-resize', className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full' },
        { handle: 'ne', cursor: 'nesw-resize', className: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2' },
        { handle: 'nw', cursor: 'nwse-resize', className: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2' },
        { handle: 'se', cursor: 'nwse-resize', className: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2' },
        { handle: 'sw', cursor: 'nesw-resize', className: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2 h-2' },
    ];

    return (
        <div
            className={`
                ${colourClass}
                p-4
                rounded-md
                flex
                items-center
                text-center
                justify-center
                absolute
                select-none
                ${(editMode || dragOnly) ? "cursor-move" : ""}
                ${canHover && !editMode ? "cursor-pointer hover:brightness-110 hover:border-2 border-text-primary" : ""}
                ${highlighted ? "ring-4 ring-accent-primary" : ""}
                ${theme.theme === 'dark' ? 'opacity-100' : 'brightness-90'}
            `}
            style={{
                left: isDragging || isResizing ? liveX : xCoord,
                top: isDragging || isResizing ? liveY : yCoord,
                width: isDragging || isResizing ? liveWidth : width,
                height: isDragging || isResizing ? liveHeight : height,
                transform: `rotate(${rotation}deg)`,
            }}
            onMouseDown={handleMouseDown}
            onClick={!editMode ? (e) => {
                if (isDragging || isResizing) return;
                e.stopPropagation();
                onClick?.();
            } : undefined}
            aria-label={equipment.name}
        >
            <p className="truncate">{equipment.name}</p>
            {equipment.icon && <equipment.icon className="absolute bottom-2 right-2 w-6 h-6 opacity-100" />}

            {editMode && onUpdate && (
                <div
                    className="absolute top-2 left-2 transform w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                    }}
                >
                    <FaTrash className="w-5 h-5 text-primary" />
                </div>
            )}

            {editMode && onUpdate && (
                <div
                    className="absolute top-2 right-2 transform w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        if (onUpdate) {
                            onUpdate({ width: height, height: width, rotation: rotation });
                            // onUpdate({ rotation: (rotation + 90) % 360 });
                        }
                    }}
                    >
                        <FaArrowRotateRight className="w-5 h-5 text-primary"/>
                </div>
            )}

            {editMode && onUpdate && resizeHandles.map(({ handle, cursor, className }) => (
                <div
                    key={handle}
                    className={`absolute ${className} bg-text-primary rounded-full z-10 hover:bg-blue-400 transition-colors`}
                    style={{ cursor }}
                    onMouseDown={(e) => handleResizeMouseDown(handle, e)}
                />
            ))}
        </div>
    );
}

export default Tile;
