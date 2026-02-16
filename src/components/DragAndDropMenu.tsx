import { TbTreadmill } from "react-icons/tb";
import { MdElectricBolt, MdRowing } from "react-icons/md";
import { GiWeightLiftingUp } from "react-icons/gi";
import { IoBarbell } from "react-icons/io5";
import { GrYoga } from "react-icons/gr";
import { TileTemplate } from "../types/tile";

const templates: TileTemplate[] = [
    { equipment: { name: "Treadmill", icon: TbTreadmill }, width: 240, height: 100, colour: "red" },
    { equipment: { name: "Rowing Machine", icon: MdRowing }, width: 240, height: 100, colour: "blue" },
    { equipment: { name: "Racks", icon: GiWeightLiftingUp }, width: 240, height: 160, colour: "green" },
    { equipment: { name: "Free Weights", icon: IoBarbell }, width: 200, height: 200, colour: "purple" },
    { equipment: { name: "Resistance Machine", icon: MdElectricBolt }, width: 100, height: 100, colour: "yellow" },
    { equipment: { name: "Open Space", icon: GrYoga }, width: 300, height: 200, colour: "orange" },
];

/**
 * Serialisable subset written to dataTransfer (icons can't be serialised).
 * The map reconstructs the icon from the equipment name on drop.
 */
export interface DragTileData {
    equipmentName: string;
    equipmentIcon?: React.ComponentType<{ className?: string }>;
    width: number;
    height: number;
    colour: string;
}

export function DragAndDropMenu() {
    const handleDragStart = (e: React.DragEvent, template: TileTemplate) => {
        const data: DragTileData = {
            equipmentName: template.equipment.name,
            width: template.width,
            height: template.height,
            colour: template.colour,
            equipmentIcon: template.equipment.icon,
        };
        e.dataTransfer.setData("application/tile-template", JSON.stringify(data));
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <div className="w-64 shrink-0 h-full flex flex-col gap-2 bg-bg-secondary rounded-2xl shadow-lg z-50 p-4 overflow-y-auto">
            <h2 className="text-text-primary text-sm font-semibold select-none mb-2">Drag and drop</h2>
            {templates.map((template) => (
                <div
                    key={template.equipment.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, template)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-primary cursor-grab active:cursor-grabbing hover:brightness-110 transition select-none"
                >
                    {template.equipment.icon && <template.equipment.icon className="w-5 h-5 text-text-primary shrink-0" />}
                    <span className="text-sm text-text-primary truncate">{template.equipment.name}</span>
                </div>
            ))}
        </div>
    );
}