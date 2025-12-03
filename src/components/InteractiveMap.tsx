import Tile from "./Tile";
import { TileProps } from "../types/tile";
import { useState, useRef, useEffect } from "react";
import MachineModal from '../components/MachineModal';
import ToggleSwitch from "./ToggleSwitch";
import { getInitialTiles } from "../services/tileService";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 800;
const GRID_SIZE = 20;

function InteractiveMap() {
    const [selectedMachine, setSelectedMachine] = useState<TileProps | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tiles, setTiles] = useState<TileProps[]>(getInitialTiles());
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [gridSize, setGridSize] = useState(GRID_SIZE);

    useEffect(() => {
        setGridSize(snapToGrid ? GRID_SIZE : 1);
    }, [snapToGrid]);

    useEffect(() => {
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
    }, []);

    const snap = (value: number) => Math.round(value / gridSize) * gridSize;

    const updateTile = (id: number, updates: Partial<TileProps>) => {
        setTiles(prev =>
            prev.map(t => t.id === id ? { ...t, ...updates } : t)
        );
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div
                ref={containerRef}
                className="relative bg-bg-secondary rounded-2xl overflow-hidden shadow-lg transition-colors duration-500"
                style={{
                    width: BASE_WIDTH,
                    height: BASE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    backgroundImage: `
                        linear-gradient(to right, var(--grid-line-color, rgba(255,255,255,0.07)) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-line-color, rgba(255,255,255,0.07)) 1px, transparent 1px)
                    `,
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
                }}
            >
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

            {selectedMachine && <MachineModal tile={selectedMachine} onClose={() => setSelectedMachine(null)} />}

        </div>
    );
}

export default InteractiveMap;