import type { TileData } from "../types/tile";

interface TileInfoCardProps {
    tile: TileData;
    mapWidth: number;
    mapHeight: number;
    onClose: () => void;
}

export function TileInfoCard({ tile, mapWidth, mapHeight, onClose }: TileInfoCardProps) {
    const cardWidth = 280;
    const cardHeight = 200;
    const offset = 16;

    const rawX = tile.xCoord + tile.width + offset;
    const rawY = tile.yCoord;

    const maxX = mapWidth - cardWidth - 8;
    const maxY = mapHeight - cardHeight - 8;

    const position = {
        left: Math.max(8, Math.min(rawX, maxX)),
        top: Math.max(8, Math.min(rawY, maxY)),
    };

    return (
        <div
            className="absolute z-30 w-[280px] rounded-xl border border-border-light bg-bg-tertiary/90 p-3 shadow-lg backdrop-blur"
            style={position}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-text-primary">
                    {tile.equipment.name}
                </h3>
                <button
                    className="text-text-secondary hover:text-text-primary"
                    onClick={onClose}
                    aria-label="Close"
                >
                    x
                </button>
            </div>
            {tile.equipment.description && (
                <p className="mt-2 text-xs text-text-secondary max-h-12 overflow-hidden">
                    {tile.equipment.description}
                </p>
            )}
            {tile.equipment.benefits && (
                <div className="mt-2 text-xs text-text-secondary">
                    <span className="font-semibold text-text-primary">Exercises:</span>{" "}
                    {tile.equipment.benefits.slice(0, 3).join(", ")}
                </div>
            )}
        </div>
    );
}
