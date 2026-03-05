import { TileTemplate } from "../types/tile";
import { getAllEquipmentTypes } from "../services/equipmentTypeService";
import { useEffect, useState } from "react";

export function DragAndDropMenu() {
    const [equipmentTypes, setEquipmentTypes] = useState<TileTemplate[]>([]);
    
    useEffect(() => {
        async function fetchEquipmentTypes() {
            try {
                const types = await getAllEquipmentTypes();
                const templatesFromApi = types.map(type => ({
                    equipment: { name: type.name, brand: type.brand },
                    width: 200,
                    height: 100,
                    colour: "red",
                    equipmentTypeId: type.id,
                }));
                setEquipmentTypes(templatesFromApi);
            }
            catch (error) {
                console.error("Failed to fetch equipment types:", error);
            }
        }
        fetchEquipmentTypes();
    }, []);

    const handleDragStart = (e: React.DragEvent, template: TileTemplate) => {
        e.dataTransfer.setData("application/tile-template", JSON.stringify(template));
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <div className="w-48 md:w-64 shrink-0 h-full flex flex-col gap-2 bg-bg-secondary rounded-2xl shadow-lg z-50 p-3 md:p-4 overflow-y-auto">
            <h2 className="text-text-primary text-xs md:text-sm font-semibold select-none mb-2">Drag and drop</h2>
            {equipmentTypes.map((template) => (
                <div
                    key={template.equipmentTypeId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, template)}
                    className="flex gap-1 px-3 py-2 rounded-lg bg-bg-primary cursor-grab active:cursor-grabbing hover:brightness-110 transition select-none flex-col"
                >
                    <span className="text-sm text-text-primary truncate">{template.equipment.name}</span>
                    <span className="text-xs text-text-secondary truncate">{template.equipment.brand}</span>
                </div>
            ))}
        </div>
    );
}