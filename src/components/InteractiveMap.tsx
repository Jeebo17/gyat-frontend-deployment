import Tile from "./Tile";
import { TileData, TileHistoryEntry } from "../types/tile";
import { useState, useRef, useEffect, useCallback } from "react";
import MachineModal from '../components/MachineModal';
import ZoomControls from "./ZoomControls";
import { useTheme } from "../context/ThemeContext";
import type { DragTileData } from "./DragAndDropMenu";
import ShinyText from "./effects/ShinyText";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 800;
const PREVIEW_BASE_WIDTH = 1600;
const PREVIEW_BASE_HEIGHT = 800;
const GRID_SIZE = 20;
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
    floorTiles?: TileData[];
    floorLoading?: boolean;
    floorLoadError?: string | null;
    onTilesChange?: (tiles: TileData[]) => void;
    highlightedTileId?: number | null;
    previewMode?: boolean;
}

function InteractiveMap({
    editMode = false,
    snapToGrid = true,
    floorTiles = [],
    floorLoading = false,
    floorLoadError = null,
    onTilesChange,
    highlightedTileId = null,
    previewMode = false,
}: InteractiveMapProps) {
    const [selectedMachine, setSelectedMachine] = useState<TileData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tiles, setTilesRaw] = useState<TileData[]>([]);
    const pendingUserEditRef = useRef(false);
    const onTilesChangeRef = useRef(onTilesChange);
    onTilesChangeRef.current = onTilesChange;

    // Sync tiles from parent when floor data changes
    useEffect(() => {
        setTilesRaw(floorTiles);
    }, [floorTiles]);

    // Notify parent of user-driven tile changes
    useEffect(() => {
        if (pendingUserEditRef.current) {
            pendingUserEditRef.current = false;
            onTilesChangeRef.current?.(tiles);
        }
    }, [tiles]);

    // Wrapped setTiles that marks changes as user-driven edits
    const setTiles = useCallback((action: TileData[] | ((prev: TileData[]) => TileData[])) => {
        pendingUserEditRef.current = true;
        setTilesRaw(action);
    }, []);

    const spatialIndexRef = useRef<Map<string, TileData[]>>(buildSpatialIndex([]));
    const [gridSize, setGridSize] = useState(GRID_SIZE);
    const mapWidth = previewMode ? PREVIEW_BASE_WIDTH : BASE_WIDTH;
    const mapHeight = previewMode ? PREVIEW_BASE_HEIGHT : BASE_HEIGHT;
    const [scale, setScale] = useState(1);
    const [autoScale, setAutoScale] = useState(true);
    const [, setHistory] = useState<TileHistoryEntry[]>([]);
    const nextIdRef = useRef(1);

    const { theme } = useTheme();

    useEffect(() => {
        setGridSize(snapToGrid ? GRID_SIZE : 1);
    }, [snapToGrid]);

    useEffect(() => {
        spatialIndexRef.current = buildSpatialIndex(tiles);
        const maxId = tiles.reduce((max, tile) => Math.max(max, tile.id), 0);
        nextIdRef.current = maxId + 1;
    }, [tiles]);


    useEffect(() => {
        if (!autoScale) return;
        const updateScale = () => {
            if (!containerRef.current) return;

            const container = containerRef.current.parentElement;
            if (!container) return;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scaleX = containerWidth / mapWidth;
            const scaleY = containerHeight / mapHeight;
            const newScale = Math.min(scaleX, scaleY, 1);

            setScale(newScale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [autoScale, mapHeight, mapWidth]);

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

    const canPlace = useCallback((id: number, updates: Partial<TileData>) => {
        const current = tiles.find(t => t.id === id);
        if (!current) return false;

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

        return !collision;
    }, [tiles]);

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

    const deleteTile = (id: number) => {
        setTiles(prev => {
            const next = prev.filter(t => t.id !== id);
            spatialIndexRef.current = buildSpatialIndex(next);
            return next;
        });
    };

    return (
        <div className="relative overflow-visible w-full h-full justify-center items-center flex pt-1 sm:pt-2">
            <div
                style={{
                    position: "absolute",
                    width: `min(100%, ${mapWidth}px)`,
                    height: `min(100%, ${mapHeight}px)`,
                    backgroundColor: "transparent",
                }}
            >
                {!previewMode && (
                    <ZoomControls
                        scale={scale}
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onReset={resetZoom}
                    />
                )}

            </div>

            {/* Map container */}
            <div
                ref={containerRef}
                className="relative bg-bg-secondary rounded-xl sm:rounded-2xl overflow-auto shadow-lg transition-colors duration-500 touch-pan-x touch-pan-y"
                style={{
                    width: mapWidth,
                    height: mapHeight,
                    maxWidth: '100%',
                    maxHeight: '100%',
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
                        width: mapWidth,
                        height: mapHeight,
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
                    onClick={previewMode ? () => setSelectedMachine(null) : undefined}
                >
                    {/* Border */}
                    <div style={{
                        boxSizing: "border-box",
                        border: "4px inset var(--grid-line-color)",
                        borderRadius: "16px",
                        height: "100%",
                        width: "100%",
                        position: "relative",
                    }}>
                        {floorLoading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/15 text-text-primary text-sm">
                                <ShinyText 
                                    text="Loading Floor..." 
                                    disabled={false} 
                                    speed={2}
                                    className='custom-class text-2xl font-light select-none' 
                                />
                            </div>
                        )}

                        {!floorLoading && floorLoadError && (
                            <div className="absolute bottom-4 left-4 z-20 rounded-md bg-red-900/80 px-3 py-2 text-xs text-white">
                                Failed to load floor data. {floorLoadError}
                            </div>
                        )}

                        {!floorLoading && !floorLoadError && tiles.length === 0 && (
                            <div className="absolute top-4 left-4 z-20 rounded-md bg-bg-primary/70 px-3 py-2 text-xs text-text-primary">
                                This floor has no equipment yet.
                            </div>
                        )}

                        {tiles.map(tile => (
                            <Tile
                                key={tile.id}
                                {...tile}
                                highlighted={highlightedTileId === tile.id}
                                scale={scale}
                                gridSize={gridSize}
                                snap={snap}
                                canPlace={canPlace}
                                dragOnly={previewMode}
                                onUpdate={(editMode || previewMode) ? (updates) => {
                                    setHistory(prev => {
                                        const newHistory = [...prev, tile];
                                        return newHistory.slice(-50); // limit history to last 50 changes
                                    });
                                    tile.id !== undefined && updateTile(tile.id, updates);
                                } : undefined}
                                onClick={!editMode ? () => setSelectedMachine({ ...tile, onUpdate: () => {} }) : undefined}
                                editMode={editMode}
                                onDelete={editMode ? () => {
                                    setHistory(prev => {
                                        const newHistory = [...prev, tile];
                                        return newHistory.slice(-50);
                                    });
                                    deleteTile(tile.id);
                                } : undefined}
                            />
                        ))}

                    </div>
                </div>
            </div>

            {!editMode && selectedMachine && (
                <MachineModal
                    tile={selectedMachine}
                    onClose={() => setSelectedMachine(null)}
                    containerMode={previewMode}
                />
            )}
        </div>
    );
}

export default InteractiveMap;
