import { useState, useEffect, useRef } from "react";
import { FaTrash } from "react-icons/fa6";
import { TileData } from "../types/tile";

const WALL_THICKNESS = 10;
const HANDLE_SIZE = 14;

interface WallTileProps extends TileData {
    gridSize?: number;
    snap?: (v: number) => number;
}

export default function WallTile({
    id,
    equipment,
    xCoord,
    yCoord,
    width,
    height,
    colour,
    onUpdate,
    canPlace,
    editMode,
    snap = (v) => v,
    onDelete,
    highlighted = false,
}: WallTileProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [resizingEnd, setResizingEnd] = useState<"start" | "end" | null>(null);
    const dragStartRef = useRef({ x: 0, y: 0, tileX: 0, tileY: 0 });
    const resizeStartRef = useRef({ x: 0, y: 0, tileX: 0, tileY: 0, width: 0, height: 0 });
    const dragMovedRef = useRef(false);

    const [liveX, setLiveX] = useState(xCoord);
    const [liveY, setLiveY] = useState(yCoord);
    const [liveWidth, setLiveWidth] = useState(width);
    const [liveHeight, setLiveHeight] = useState(height);

    useEffect(() => {
        setLiveX(xCoord);
        setLiveY(yCoord);
        setLiveWidth(width);
        setLiveHeight(height);
    }, [xCoord, yCoord, width, height]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!editMode || !onUpdate) return;
        e.stopPropagation();
        dragMovedRef.current = false;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY, tileX: xCoord, tileY: yCoord };
    };

    const handleEndMouseDown = (end: "start" | "end", e: React.MouseEvent) => {
        if (!editMode || !onUpdate) return;
        e.stopPropagation();
        setResizingEnd(end);
        resizeStartRef.current = { x: e.clientX, y: e.clientY, tileX: xCoord, tileY: yCoord, width, height };
    };

    useEffect(() => {
        if (!isDragging && !resizingEnd) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const dx = e.clientX - dragStartRef.current.x;
                const dy = e.clientY - dragStartRef.current.y;
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMovedRef.current = true;

                const newX = snap(dragStartRef.current.tileX + dx);
                const newY = snap(dragStartRef.current.tileY + dy);

                if (canPlace && !canPlace(id, { xCoord: newX, yCoord: newY, width: liveWidth, height: liveHeight })) return;

                setLiveX(newX);
                setLiveY(newY);
            } else if (resizingEnd) {
                const start = resizeStartRef.current;
                const dx = e.clientX - start.x;
                const dy = e.clientY - start.y;
                const minLength = 20;

                const horiz = start.width >= start.height;

                let newX = start.tileX;
                let newY = start.tileY;
                let newW = start.width;
                let newH = start.height;

                if (horiz) {
                    if (resizingEnd === "end") {
                        newW = Math.max(minLength, snap(start.width + dx));
                    } else {
                        newW = Math.max(minLength, snap(start.width - dx));
                        newX = start.tileX + (start.width - newW);
                    }
                    newH = WALL_THICKNESS;
                } else {
                    if (resizingEnd === "end") {
                        newH = Math.max(minLength, snap(start.height + dy));
                    } else {
                        newH = Math.max(minLength, snap(start.height - dy));
                        newY = start.tileY + (start.height - newH);
                    }
                    newW = WALL_THICKNESS;
                }

                if (canPlace && !canPlace(id, { xCoord: newX, yCoord: newY, width: newW, height: newH })) return;

                setLiveX(newX);
                setLiveY(newY);
                setLiveWidth(newW);
                setLiveHeight(newH);
            }
        };

        const handleMouseUp = () => {
            if (onUpdate) {
                if (isDragging && (liveX !== xCoord || liveY !== yCoord)) {
                    onUpdate({ xCoord: liveX, yCoord: liveY });
                } else if (resizingEnd && (liveX !== xCoord || liveY !== yCoord || liveWidth !== width || liveHeight !== height)) {
                    onUpdate({ xCoord: liveX, yCoord: liveY, width: liveWidth, height: liveHeight });
                }
            }
            setIsDragging(false);
            setResizingEnd(null);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, resizingEnd, snap, onUpdate, canPlace, id, liveX, liveY, liveWidth, liveHeight, xCoord, yCoord, width, height]);

    const displayX = isDragging || resizingEnd ? liveX : xCoord;
    const displayY = isDragging || resizingEnd ? liveY : yCoord;
    const displayW = isDragging || resizingEnd ? liveWidth : width;
    const displayH = isDragging || resizingEnd ? liveHeight : height;
    const displayHoriz = displayW >= displayH;

    const handleSwapOrientation = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onUpdate) return;
        // Swap: horizontal → vertical or vice versa, keeping the longer axis as length
        onUpdate({ width: height, height: width });
    };

    return (
        <div
            className={`absolute select-none ${editMode ? "cursor-move" : ""} ${highlighted ? "ring-4 ring-accent-primary" : ""}`}
            style={{
                left: displayX,
                top: displayY,
                width: displayW,
                height: displayH,
                backgroundColor: `#${colour}`,
                borderRadius: 2,
            }}
            onMouseDown={handleMouseDown}
            aria-label={equipment.name}
        >
            {/* Label - only show if wall is long enough */}
            {((displayHoriz && displayW > 60) || (!displayHoriz && displayH > 60)) && (
                <span
                    className="absolute text-[9px] text-white/70 font-medium pointer-events-none whitespace-nowrap"
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) ${!displayHoriz ? "rotate(-90deg)" : ""}`,
                    }}
                >
                    {equipment.name}
                </span>
            )}

            {editMode && onUpdate && (
                <>
                    {/* Delete button */}
                    <div
                        className="absolute flex items-center justify-center cursor-pointer z-20"
                        style={{
                            top: displayHoriz ? -18 : "50%",
                            left: displayHoriz ? "50%" : -18,
                            transform: displayHoriz ? "translateX(-50%)" : "translateY(-50%)",
                        }}
                        onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                    >
                        <FaTrash className="w-3 h-3 text-red-400 hover:text-red-300" />
                    </div>

                    {/* Orientation swap button */}
                    <div
                        className="absolute flex items-center justify-center cursor-pointer z-20 w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 text-white text-[8px] font-bold"
                        style={{
                            top: displayHoriz ? -18 : "50%",
                            right: displayHoriz ? 4 : undefined,
                            left: displayHoriz ? undefined : -18,
                            transform: !displayHoriz ? "translateY(-50%)" : undefined,
                        }}
                        onMouseDown={handleSwapOrientation}
                        title="Swap orientation"
                    >
                        ↻
                    </div>

                    {/* Start handle */}
                    <div
                        className="absolute z-10 rounded-full bg-white border-2 border-gray-500 hover:border-blue-400 cursor-col-resize"
                        style={{
                            width: HANDLE_SIZE,
                            height: HANDLE_SIZE,
                            top: displayHoriz ? "50%" : -HANDLE_SIZE / 2,
                            left: displayHoriz ? -HANDLE_SIZE / 2 : "50%",
                            transform: displayHoriz ? "translateY(-50%)" : "translateX(-50%)",
                            cursor: displayHoriz ? "ew-resize" : "ns-resize",
                        }}
                        onMouseDown={(e) => handleEndMouseDown("start", e)}
                    />

                    {/* End handle */}
                    <div
                        className="absolute z-10 rounded-full bg-white border-2 border-gray-500 hover:border-blue-400"
                        style={{
                            width: HANDLE_SIZE,
                            height: HANDLE_SIZE,
                            bottom: displayHoriz ? undefined : -HANDLE_SIZE / 2,
                            top: displayHoriz ? "50%" : undefined,
                            right: displayHoriz ? -HANDLE_SIZE / 2 : undefined,
                            left: !displayHoriz ? "50%" : undefined,
                            transform: displayHoriz ? "translateY(-50%)" : "translateX(-50%)",
                            cursor: displayHoriz ? "ew-resize" : "ns-resize",
                        }}
                        onMouseDown={(e) => handleEndMouseDown("end", e)}
                    />
                </>
            )}
        </div>
    );
}
