import { FaArrowRotateRight, FaTrash } from "react-icons/fa6";
import { isStructuralTile } from "../constants/structuralComponents";
import type { TileData } from "../types/tile";

const EDIT_TRAY_COLOURS = [
    "EF4444", "F97316", "EAB308", "22C55E", "3B82F6",
    "A855F7", "EC4899", "14B8A6", "6B7280", "1E293B",
];

interface FloatingEditTrayProps {
    tile: TileData | null;
    onColourChange: (colour: string) => void;
    onRotate: () => void;
    onDelete: () => void;
    onDeselect: () => void;
}

function FloatingEditTray({
    tile,
    onColourChange,
    onRotate,
    onDelete,
    onDeselect,
}: FloatingEditTrayProps) {
    if (!tile) return null;

    const structuralTile = isStructuralTile(tile.equipmentTypeId);

    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-xl bg-bg-primary/90 backdrop-blur-md border border-border-light shadow-lg px-3 py-2">
            <span className="text-xs text-text-primary font-medium mr-1 truncate max-w-[120px]">
                {tile.equipment.name}
            </span>

            {!structuralTile && (
                <div className="flex items-center gap-1 border-l border-border-light pl-2">
                    {EDIT_TRAY_COLOURS.map((colour) => (
                        <button
                            key={colour}
                            type="button"
                            className={`w-5 h-5 rounded-full border-2 transition-all ${
                                tile.colour === colour
                                    ? "border-white scale-110 ring-1 ring-white/40"
                                    : "border-white/20 hover:border-white/50"
                            }`}
                            style={{ backgroundColor: `#${colour}` }}
                            onClick={() => onColourChange(colour)}
                        />
                    ))}
                </div>
            )}

            <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-white/10 text-text-primary transition-colors border-l border-border-light pl-2"
                title="Swap width/height"
                onClick={onRotate}
            >
                <FaArrowRotateRight className="w-4 h-4" />
            </button>

            <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete"
                onClick={onDelete}
            >
                <FaTrash className="w-4 h-4" />
            </button>

            <button
                type="button"
                className="p-1 rounded-lg hover:bg-white/10 text-text-secondary transition-colors text-xs"
                title="Deselect"
                onClick={onDeselect}
            >
                x
            </button>
        </div>
    );
}

export default FloatingEditTray;