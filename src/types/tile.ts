import { EquipmentProps } from "./equipment";
export interface TileProps {
     // Unique identifier for this tile.
     // Used for tracking state updates and rendering.
    id: number;

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

    // Callback fired when this tile wants to update itself.
    // Receives only the fields that have changed.
    onUpdate?: (updates: Partial<TileProps>) => void;

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
}
