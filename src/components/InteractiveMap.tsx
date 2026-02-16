import Tile from "./Tile";
import { TileData, TileHistoryEntry } from "../types/tile";
import { useState, useRef, useEffect, useCallback } from "react";
import MachineModal from '../components/MachineModal';
import { getInitialTiles } from "../services/tileService";
import ZoomControls from "./ZoomControls";
import { useTheme } from "../context/ThemeContext";
import type { DragTileData } from "./DragAndDropMenu";

export const BASE_WIDTH = 1600;
export const BASE_HEIGHT = 800;
export const GRID_SIZE = 20;
const CELL_SIZE = 200; // spatial hash cell size (px)

const rectanglesOverlap = (a: TileData, b: TileData) => {
    const aRight = a.xCoord + a.width;
    const aBottom = a.yCoord + a.height;
    const bRight = b.xCoord + b.width;
    const bBottom = b.yCoord + b.height;

    return a.xCoord < bRight && aRight > b.xCoord && a.yCoord < bBottom && aBottom > b.yCoord;
};

const getCellsForTile = (tile: TileData, cellSize = CELL_SIZE) => {
    const cells: string[] = [];
    const startCol = Math.floor(tile.xCoord / cellSize);
    const endCol = Math.floor((tile.xCoord + tile.width) / cellSize);
    const startRow = Math.floor(tile.yCoord / cellSize);
    const endRow = Math.floor((tile.yCoord + tile.height) / cellSize);

    for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
            cells.push(`${col}:${row}`);
        }
    }
    return cells;
};

const buildSpatialIndex = (tiles: TileData[]) => {
    const index = new Map<string, TileData[]>();
    tiles.forEach(tile => {
        getCellsForTile(tile).forEach(cell => {
            if (!index.has(cell)) index.set(cell, []);
            index.get(cell)!.push(tile);
        });
    });
    return index;
};

interface InteractiveMapProps {
    editMode?: boolean;
    snapToGrid?: boolean;
}

function InteractiveMap({ editMode = false, snapToGrid = true }: InteractiveMapProps) {
    const [selectedMachine, setSelectedMachine] = useState<TileData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tiles, setTiles] = useState<TileData[]>(getInitialTiles());
    const spatialIndexRef = useRef<Map<string, TileData[]>>(buildSpatialIndex(getInitialTiles()));
    const [gridSize, setGridSize] = useState(GRID_SIZE);
    const [scale, setScale] = useState(1);
    const [autoScale, setAutoScale] = useState(true);
    const [history, setHistory] = useState<TileHistoryEntry[]>([]);

    const { theme } = useTheme();

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

    // Listen for Ctrl+Z / Cmd+Z to undo the last tile change
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                
                setHistory(prev => {
                    if (prev.length === 0) return prev;
                    const last = prev[prev.length - 1];
                    updateTile(last.id, {
                        xCoord: last.xCoord,
                        yCoord: last.yCoord,
                        width: last.width,
                        height: last.height,
                        rotation: last.rotation,
                        colour: last.colour,
                    });
                    return prev.slice(0, -1);
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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

    const snap = (value: number) => Math.round(value / gridSize) * gridSize;

    /** Generate the next unique tile id. */
    const nextIdRef = useRef(
        Math.max(...getInitialTiles().map(t => t.id)) + 1
    );

    /** Try to add a new tile at the given position; rejects on collision. */
    const addTile = useCallback((template: DragTileData, xCoord: number, yCoord: number) => {
        const snappedX = snap(xCoord);
        const snappedY = snap(yCoord);

        const candidate: TileData = {
            id: nextIdRef.current,
            xCoord: snappedX,
            yCoord: snappedY,
            width: template.width,
            height: template.height,
            rotation: 0,
            colour: template.colour,
            equipment: {
                name: template.equipmentName,
                icon: template.equipmentIcon,
            },
        };

        setTiles(prev => {
            // Collision check against existing tiles
            const spatialIndex = spatialIndexRef.current;
            const visited = new Set<number>();
            let collision = false;

            getCellsForTile(candidate).some(cell => {
                const bucket = spatialIndex.get(cell);
                if (!bucket) return false;
                for (const tile of bucket) {
                    if (visited.has(tile.id)) continue;
                    visited.add(tile.id);
                    if (rectanglesOverlap(candidate, tile)) {
                        collision = true;
                        return true;
                    }
                }
                return false;
            });

            if (collision) return prev;

            nextIdRef.current += 1;
            const next = [...prev, candidate];
            spatialIndexRef.current = buildSpatialIndex(next);
            return next;
        });
    }, [snap]);

    const updateTile = (id: number, updates: Partial<TileData>) => {
        setTiles(prev => {
            const current = prev.find(t => t.id === id);
            if (!current) return prev;

            const candidate = { ...current, ...updates } as TileData;

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
        <div className={`relative overflow-visible w-full h-full justify-center items-center flex pt-2 ${editMode ? '' : 'mt-16'}`}>
            <div
                style={{
                    position: "absolute",
                    width: "min(95vw, " + BASE_WIDTH + "px)",
                    height: "min(95vh, " + BASE_HEIGHT + "px)",
                    backgroundColor: "transparent",
                }}
            >
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
                onDragOver={editMode ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; } : undefined}
                onDrop={editMode ? (e) => {
                    e.preventDefault();
                    const raw = e.dataTransfer.getData("application/tile-template");
                    if (!raw) return;
                    const template: DragTileData = JSON.parse(raw);
                    const rect = containerRef.current!.getBoundingClientRect();
                    // Account for scroll and scale so tile lands where the cursor is
                    const x = (e.clientX - rect.left + containerRef.current!.scrollLeft) / scale - template.width / 2;
                    const y = (e.clientY - rect.top + containerRef.current!.scrollTop) / scale - template.height / 2;
                    addTile(template, x, y);
                } : undefined}
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
                                onUpdate={editMode ? (updates) => {
                                    setHistory(prev => [...prev, tile]);
                                    tile.id !== undefined && updateTile(tile.id, updates);
                                } : undefined}
                                onClick={!editMode ? () => setSelectedMachine({ ...tile, onUpdate: () => {} }) : undefined}
                                editMode={editMode}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {!editMode && selectedMachine && <MachineModal tile={selectedMachine} onClose={() => setSelectedMachine(null)} />}
        </div>
    );
}

export default InteractiveMap;
