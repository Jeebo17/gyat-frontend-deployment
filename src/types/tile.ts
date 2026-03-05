import { EquipmentProps } from "./equipment";

export interface ExerciseOption {
    id: number;
    name: string;
}

export interface TileData {
     // Unique identifier for this tile.
     // Used for tracking state updates and rendering.
    id: number;

    // Equipment definition id used by backend dictionaries.
    equipmentTypeId?: number;
    // Exercise ids from relational definitions used for editing exercise overrides.
    exerciseIds?: number[];
    // Full set of selectable exercises for this equipment type.
    exerciseOptions?: ExerciseOption[];
    // Equipment maintenance status for component update payloads.
    outOfOrder?: boolean;

    //Data describing the equipment assigned to this tile.
    equipment: EquipmentProps;

    // Coordinates of the tile on the canvas grid (matches backend xCoord/yCoord).
    xCoord: number;
    yCoord: number;

    // Dimensions of the tile in grid in pixels
    width: number;
    height: number;

    // Rotation angle in degrees.
    rotation: number;

    // Display colour (e.g. CSS hex or rgb).
    colour: string;

    // Raw persisted metadata from backend component.additionalInfo.
    additionalInfo?: string;

    // Callback fired when this tile wants to update itself.
    // Receives only the fields that have changed.
    onUpdate?: (updates: Partial<TileData>) => void;

    // Returns true if the tile can be placed at the given updates (no collisions).
    canPlace?: (id: number, updates: Partial<TileData>) => boolean;

    // Whether hover highlighting should be enabled.
    canHover?: boolean;

    // Fired when the tile is clicked.
    onClick?: () => void;

    // Whether the tile is in edit mode.
    editMode?: boolean;

    // Scaling factor applied to tile measurements.
    scale?: number;

    // Grid size of the workspace into which the tile should snap.
    gridSize?: number;

    // Snapping function used to align values to the grid.
    // For example: snap(83) → 80.
    snap?: (value: number) => number;

    // Fired when the tile is deleted.
    onDelete?: () => void;

    // Whether the tile should be highlighted (e.g. for search).
    highlighted?: boolean;

    // Whether the tile is in preview mode
    previewMode?: boolean;
}

export interface TileTemplate {
    equipmentTypeId: number;
    equipment: EquipmentProps;
    width: number;
    height: number;
    colour: string;
    brand?: string;
}

export interface TileHistoryEntry {
    id: number;
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
    rotation: number;
    colour: string;
}

export interface TileSearchProps {
    id: number;
    name: string;
    description: string;
    floorName: string;
}
