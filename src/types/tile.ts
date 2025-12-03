import { EquipmentProps } from "./equipment";

export interface TileProps {
    id: number;
    equipment: EquipmentProps;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    colour: string;

    onUpdate?: (updates: Partial<TileProps>) => void;
    canHover?: boolean;
    onClick?: () => void;
    editMode?: boolean;
    scale?: number;
    gridSize?: number;
    snap?: (value: number) => number;
}