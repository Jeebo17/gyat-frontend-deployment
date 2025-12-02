import Tile from "./Tile";
import { TileProps } from "./Tile";
import { useState } from "react";
import { TbTreadmill } from "react-icons/tb";
import { MdElectricBolt, MdRowing } from "react-icons/md";
import { GiWeightLiftingUp  } from "react-icons/gi";
import { IoBarbell  } from "react-icons/io5";
import { GrYoga } from "react-icons/gr";
import MachineModal from '../components/MachineModal';
import ToggleSwitch from "./ToggleSwitch";

function InteractiveMap() {
    const [selectedMachine, setSelectedMachine] = useState<TileProps | null>(null);
    const [editMode, setEditMode] = useState(false);
    
    const [tiles, setTiles] = useState([
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

        {id: 14, x: 1000, y: 760, width: 160, height: 40, rotation: 0, colour: "gray", title: "Entrance", canHover: false},
    ]);

    const snap = (value: number) => Math.round(value / 20) * 20;

    const updatePosition = (id: number, newX: number, newY: number) => {
        setTiles(prev =>
            prev.map(t =>
                t.id === id
                    ? { ...t, x: snap(newX), y: snap(newY) }
                    : t
            )
        );
    };


    return (
        <div 
            className="relative bg-bg-secondary p-8 rounded-2xl w-full h-[800px]"
            style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px"
            }}
        >

            <ToggleSwitch onClick={() => setEditMode(!editMode)} />

            {tiles.map(tile => (
            <Tile
                key={tile.id}
                {...tile}
                onDrag={(x: number, y: number) => editMode && updatePosition(tile.id, x, y)}
                onClick={!editMode ? () => setSelectedMachine({ ...tile, onDrag: (x: number, y: number) => updatePosition(tile.id, x, y) }) : undefined}
                editMode={editMode}
            />
            ))}

            {selectedMachine && <MachineModal tile={selectedMachine} onClose={() => setSelectedMachine(null)} />}
        </div>
    );
}
export default InteractiveMap;