/**
 * Configuration for structural / non-equipment tiles (equipmentTypeId < 50).
 * These tiles are non-interactable (no equipment modal) and have fixed visual properties.
 */

export interface StructuralTileConfig {
    /** Fixed display colour (hex without #). */
    colour: string;
    /** Default width when placing the tile. */
    defaultWidth: number;
    /** Default height when placing the tile. */
    defaultHeight: number;
    /** If set, this dimension cannot be resized. */
    fixedWidth?: number;
    /** If set, this dimension cannot be resized. */
    fixedHeight?: number;
}

export const STRUCTURAL_TILE_THRESHOLD = 50;

const STRUCTURAL_TILES: Record<number, StructuralTileConfig> = {
    // Wall — thin line, adjustable length only
    1: {
        colour: "6B7280",
        defaultWidth: 200,
        defaultHeight: 5,
        fixedHeight: 5,
    },
    // Staircase
    2: {
        colour: "78716C",
        defaultWidth: 120,
        defaultHeight: 80,
    },
};

export function isStructuralTile(equipmentTypeId: number | undefined): boolean {
    return equipmentTypeId !== undefined && equipmentTypeId < STRUCTURAL_TILE_THRESHOLD;
}

export function getStructuralConfig(equipmentTypeId: number | undefined): StructuralTileConfig | undefined {
    if (equipmentTypeId === undefined) return undefined;
    return STRUCTURAL_TILES[equipmentTypeId];
}
