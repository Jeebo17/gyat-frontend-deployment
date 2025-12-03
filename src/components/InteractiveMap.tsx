import Tile from "./Tile";
import { TileProps } from "./Tile";
import { useState, useRef, useEffect } from "react";
import { TbTreadmill } from "react-icons/tb";
import { MdElectricBolt, MdRowing } from "react-icons/md";
import { GiWeightLiftingUp  } from "react-icons/gi";
import { IoBarbell  } from "react-icons/io5";
import { GrYoga } from "react-icons/gr";
import MachineModal from '../components/MachineModal';
import ToggleSwitch from "./ToggleSwitch";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 800;
const GRID_SIZE = 20;

function InteractiveMap() {
    const [selectedMachine, setSelectedMachine] = useState<TileProps | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const [tiles, setTiles] = useState<TileProps[]>([
        { id: 1, x: 20, y: 160, width: 240, height: 100, rotation: 0, colour: "red", title: "Treadmill", icon: TbTreadmill },
        { id: 2, x: 20, y: 280, width: 240, height: 100, rotation: 0, colour: "red", title: "Treadmill", icon: TbTreadmill },
        { id: 3, x: 20, y: 400, width: 240, height: 100, rotation: 0, colour: "red", title: "Treadmill", icon: TbTreadmill },
        { id: 4, x: 20, y: 540, width: 240, height: 100, rotation: 0, colour: "blue", title: "Rowing Machine", icon: MdRowing },
        { id: 5, x: 20, y: 660, width: 240, height: 100, rotation: 0, colour: "blue", title: "Rowing Machine", icon: MdRowing },
        { id: 6, x: 400, y: 20, width: 240, height: 160, rotation: 0, colour: "green", title: "Racks", icon: GiWeightLiftingUp  },
        { id: 7, x: 700, y: 20, width: 240, height: 160, rotation: 0, colour: "green", title: "Racks", icon: GiWeightLiftingUp  },
        { id: 8, x: 1000, y: 20, width: 240, height: 160, rotation: 0, colour: "green", title: "Racks", icon: GiWeightLiftingUp  },
        { id: 9, x: 1140, y: 340, width: 550, height: 300, rotation: 90, colour: "purple", title: "Free Weights", icon: IoBarbell },
        { id: 10, x: 400, y: 500, width: 500, height: 280, rotation: 0, colour: "orange", title: "Open Space", icon: GrYoga },
        { id: 11, x: 600, y: 300, width: 200, height: 100, rotation: 0, colour: "yellow", title: "Resistance Machine", icon: MdElectricBolt },
        { id: 12, x: 800, y: 300, width: 200, height: 100, rotation: 90, colour: "yellow", title: "Resistance Machine", icon: MdElectricBolt },
        { id: 13, x: 950, y: 300, width: 200, height: 100, rotation: 90, colour: "yellow", title: "Resistance Machine", icon: MdElectricBolt },
        { id: 14, x: 1000, y: 760, width: 160, height: 40, rotation: 0, colour: "gray", title: "Entrance", canHover: false },
    ]);

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

    const snap = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

    const updateTile = (id: number, updates: Partial<TileProps>) => {
        setTiles(prev =>
            prev.map(t => t.id === id ? { ...t, ...updates } : t)
        );
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div
                ref={containerRef}
                className="relative bg-bg-secondary rounded-2xl overflow-hidden shadow-lg"
                style={{
                    width: BASE_WIDTH,
                    height: BASE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)
                    `,
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
                }}
            >
                <div className="absolute top-4 left-4 z-10">
                    <ToggleSwitch onClick={() => setEditMode(!editMode)} />
                </div>

                {tiles.map(tile => (
                    <Tile
                        key={tile.id}
                        {...tile}
                        scale={scale}
                        gridSize={GRID_SIZE}
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