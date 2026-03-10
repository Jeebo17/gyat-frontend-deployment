import { TileTemplate } from "../types/tile";
import { getAllEquipmentTypes } from "../services/equipmentTypeService";
import { useEffect, useState } from "react";
import { getStructuralDef, isStructuralTile } from "../constants/structuralComponents";

export default function DragAndDropMenu() {
    const [equipmentTypes, setEquipmentTypes] = useState<TileTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function fetchEquipmentTypes() {
            setLoading(true);

            try {
                const types = await getAllEquipmentTypes();
                const templatesFromApi = types.map(type => {
                    const structDef = getStructuralDef(type.id);

                    return {
                        equipment: { name: structDef?.name ?? type.name, brand: type.brand ?? undefined },
                        width: structDef?.defaultWidth ?? 200,
                        height: structDef?.defaultHeight ?? 100,
                        colour: structDef?.colour ?? "EF4444",
                        equipmentTypeId: type.id,
                    };
                });
                setEquipmentTypes(templatesFromApi);
            }
            catch (error) {
                console.error("Failed to fetch equipment types:", error);
            }
            finally {
                setLoading(false);
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

            {loading ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-bg-primary animate-pulse" />
                    ))}
                </div>
            ) : (
                equipmentTypes.map((template) => {
                    const structural = isStructuralTile(template.equipmentTypeId);
                    return (
                        <div
                            key={template.equipmentTypeId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, template)}
                            className="flex gap-1 px-3 py-2 rounded-lg bg-bg-primary cursor-grab active:cursor-grabbing hover:brightness-110 transition select-none flex-col"
                        >
                            <div className="flex items-center gap-2">
                                {structural && (
                                    <span
                                        className="w-3 h-3 rounded-sm shrink-0"
                                        style={{ backgroundColor: `#${template.colour}` }}
                                    />
                                )}
                                <span className="text-sm text-text-primary truncate">{template.equipment.name}</span>
                            </div>
                            <span className="text-xs text-text-secondary truncate">
                                {!structural && template.equipment.brand}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
}