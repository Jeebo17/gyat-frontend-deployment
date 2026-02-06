import Tile from "./Tile";
import { TileProps } from "../types/tile";
import { useState, useRef, useEffect } from "react";
import MachineModal from '../components/MachineModal';
import ToggleSwitch from "./ToggleSwitch";
import { getInitialTiles } from "../services/tileService";
import ZoomControls from "./ZoomControls";
import { useTheme } from "../context/ThemeContext";

import { isAdminTEST } from "../services/isAdmin";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 800;
const GRID_SIZE = 20;

function InteractiveMap() {
    const [selectedMachine, setSelectedMachine] = useState<TileProps | null>(null);
    const [editMode, setEditMode] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tiles, setTiles] = useState<TileProps[]>(getInitialTiles());
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [gridSize, setGridSize] = useState(GRID_SIZE);
    const [scale, setScale] = useState(1);
    const [autoScale, setAutoScale] = useState(true);

    const { theme } = useTheme();

    const [userIsAdmin, setUserIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const isAdmin = await isAdminTEST("test");
            setUserIsAdmin(isAdmin);
        }
        checkAdmin();
    }, []);

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

    const snap = (value: number) => Math.round(value / gridSize) * gridSize;

    const updateTile = (id: number, updates: Partial<TileProps>) => {
        setTiles(prev =>
            prev.map(t => t.id === id ? { ...t, ...updates } : t)
        );
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
                {userIsAdmin && (
                    <>
                        <div className="absolute top-4 left-4 z-10 flex flex-row items-center gap-4">
                            <ToggleSwitch checked={editMode} onChange={(checked) => { setEditMode(checked); setSnapToGrid(true); }} />
                            {!editMode && <span className="text-sm select-none">Edit Mode</span>}
                        </div>

                        {editMode && 
                            <div className="absolute top-4 right-4 z-10 flex flex-row items-center gap-4">
                                <span className="text-sm select-none">Snap to grid</span>             
                                <ToggleSwitch checked={snapToGrid} onChange={setSnapToGrid} />
                            </div>
                        }
                    </>
                )}

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