import Tile from "./Tile";
import { TileProps } from "../types/tile";
import { useState, useRef, useEffect } from "react";
import MachineModal from '../components/MachineModal';
import ToggleSwitch from "./ToggleSwitch";
import { getFloorsTiles, getInitialTiles } from "../services/tileService";
import ZoomControls from "./ZoomControls";
import { useTheme } from "../context/ThemeContext";

import { isAdminTEST } from "../services/isAdmin";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 800;
const GRID_SIZE = 20;
const CELL_SIZE = 200; // spatial hash cell size (px)

const rectanglesOverlap = (a: TileProps, b: TileProps) => {
    const aRight = a.x + a.width;
    const aBottom = a.y + a.height;
    const bRight = b.x + b.width;
    const bBottom = b.y + b.height;

    // Edges touching are allowed; overlap requires positive shared area
    return a.x < bRight && aRight > b.x && a.y < bBottom && aBottom > b.y;
};

const getCellsForTile = (tile: TileProps, cellSize = CELL_SIZE) => {
    const cells: string[] = [];
    const startCol = Math.floor(tile.x / cellSize);
    const endCol = Math.floor((tile.x + tile.width) / cellSize);
    const startRow = Math.floor(tile.y / cellSize);
    const endRow = Math.floor((tile.y + tile.height) / cellSize);

    for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
            cells.push(`${col}:${row}`);
        }
    }
    return cells;
};

const buildSpatialIndex = (tiles: TileProps[]) => {
    const index = new Map<string, TileProps[]>();
    tiles.forEach(tile => {
        getCellsForTile(tile).forEach(cell => {
            if (!index.has(cell)) index.set(cell, []);
            index.get(cell)!.push(tile);
        });
    });
    return index;
};

function InteractiveMap() {
    const [selectedMachine, setSelectedMachine] = useState<TileProps | null>(null);
    const [editMode, setEditMode] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [floor, setFLoor] = useState<number>(0);
    const [tiles, setTiles] = useState<TileProps[]>(getInitialTiles());
    const spatialIndexRef = useRef<Map<string, TileProps[]>>(buildSpatialIndex(getInitialTiles()));
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [gridSize, setGridSize] = useState(GRID_SIZE);
    const [scale, setScale] = useState(1);
    const [autoScale, setAutoScale] = useState(true);

    const { theme } = useTheme();
    const floorButtonClasses = `w-7 h-7 rounded-md shadow flex items-center justify-center bg-text-primary transition duration-300 ${
        theme === "dark" ? "text-black" : "text-white"
    } disabled:opacity-50`;

    const [userIsAdmin, setUserIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const isAdmin = await isAdminTEST("test");
            setUserIsAdmin(isAdmin);
        }
        checkAdmin();
    }, []);

    useEffect(() => {
        setTiles(floor === 0 ? getInitialTiles() : getFloorsTiles(floor))
    }, [floor])

    useEffect(() => {
        setGridSize(snapToGrid ? GRID_SIZE : 1);
    }, [snapToGrid]);

    useEffect(() => {
        if (!autoScale) return; 
        const updateScale = () => {
            if (!containerRef.current) return;

            const container = containerRef.current.parentElement;
            if (!container) return;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scaleX = containerWidth / BASE_WIDTH;
            const scaleY = containerHeight / BASE_HEIGHT;
            const newScale = Math.min(scaleX, scaleY, 1);

            setScale(newScale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [autoScale]);

    const zoomIn = () => {
        setAutoScale(false);
        setScale(prev => Math.min(prev + 0.2, 3));
    };

    const zoomOut = () => {
        setAutoScale(false);
        setScale(prev => Math.max(prev - 0.2, 0.3));
    };

    const resetZoom = () => {
        setAutoScale(true);
    };

    const decrementFloor = () => setFLoor(prev => Math.max(0, prev - 1));
    const incrementFloor = () => setFLoor(prev => prev + 1);

    const snap = (value: number) => Math.round(value / gridSize) * gridSize;

    const updateTile = (id: number, updates: Partial<TileProps>) => {
        setTiles(prev => {
            const current = prev.find(t => t.id === id);
            if (!current) return prev;

            const candidate = { ...current, ...updates } as TileProps;

            const spatialIndex = spatialIndexRef.current;
            const visited = new Set<number>();
            let collision = false;

            getCellsForTile(candidate).some(cell => {
                const bucket = spatialIndex.get(cell);
                if (!bucket) return false;
                for (const tile of bucket) {
                    if (tile.id === id || visited.has(tile.id)) continue;
                    visited.add(tile.id);
                    if (rectanglesOverlap(candidate, tile)) {
                        collision = true;
                        return true;
                    }
                }
                return false;
            });

            if (collision) return prev;

            const nextTiles = prev.map(t => t.id === id ? candidate : t);
            spatialIndexRef.current = buildSpatialIndex(nextTiles);
            return nextTiles;
        });
    };

    return (
        <div className="relative overflow-visible w-full h-full justify-center items-center flex pt-2 mt-16">
            <div
                style={{
                    position: "absolute",
                    width: "min(95vw, " + BASE_WIDTH + "px)",
                    height: "min(95vh, " + BASE_HEIGHT + "px)",
                    backgroundColor: "transparent",
                }}

                
            >
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm select-none">Floor</span>
                        <button
                            type="button"
                            className={floorButtonClasses}
                            onClick={decrementFloor}
                            disabled={floor <= 0}
                            aria-label="Previous floor"
                        >
                            -
                        </button>
                        <span className="text-sm select-none w-6 text-center">{floor + 1}</span>
                        <button
                            type="button"
                            className={floorButtonClasses}
                            onClick={incrementFloor}
                            aria-label="Next floor"
                        >
                            +
                        </button>
                    </div>
                    {userIsAdmin && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {!editMode && <span className="text-sm select-none">Edit Mode</span>}
                                <ToggleSwitch checked={editMode} onChange={(checked) => { setEditMode(checked); setSnapToGrid(true); }} />
                            </div>
                            {editMode && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm select-none">Snap to grid</span>
                                    <ToggleSwitch checked={snapToGrid} onChange={setSnapToGrid} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ZoomControls
                    scale={scale}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onReset={resetZoom}
                />
            </div>
            
            {/* Map container */}
            <div
                ref={containerRef}
                className="relative bg-bg-secondary rounded-2xl overflow-auto shadow-lg transition-colors duration-500"
                style={{
                    width: BASE_WIDTH,
                    height: BASE_HEIGHT,
                    scrollbarColor: theme === 'dark' ? '#999999 transparent' : '#808080 transparent',
                    scrollbarWidth: 'thin'
                }}
            >

                {/* Internal map */}
                <div
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        width: BASE_WIDTH,
                        height: BASE_HEIGHT,
                        backgroundImage: `
                            linear-gradient(to right, var(--grid-line-color, rgba(255,255,255,0.07)) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--grid-line-color, rgba(255,255,255,0.07)) 1px, transparent 1px)
                        `,
                        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        borderRadius: "16px",
                    }}
                >
                    {/* Border */}
                    <div style={{
                        boxSizing: "border-box",
                        border: "4px inset var(--grid-line-color)",
                        borderRadius: "16px",
                        height: "100%",
                        width: "100%",
                    }}>
                        {tiles.map(tile => (
                            <Tile
                                key={tile.id}
                                {...tile}
                                scale={scale}
                                gridSize={gridSize}
                                snap={snap}
                                onUpdate={(updates) => editMode && tile.id !== undefined && updateTile(tile.id, updates)}
                                onClick={!editMode ? () => setSelectedMachine({ ...tile, onUpdate: () => {} }) : undefined}
                                editMode={editMode}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {selectedMachine && <MachineModal tile={selectedMachine} onClose={() => setSelectedMachine(null)} />}
        </div>
    );
}

export default InteractiveMap;
