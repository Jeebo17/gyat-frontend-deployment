/** Structural components have equipmentTypeId below this threshold. */
export const STRUCTURAL_ID_THRESHOLD = 50;

export const isStructuralTile = (equipmentTypeId: number | undefined): boolean =>
    equipmentTypeId !== undefined && equipmentTypeId < STRUCTURAL_ID_THRESHOLD;

export interface StructuralComponentDef {
    id: number;
    name: string;
    defaultWidth: number;
    defaultHeight: number;
    colour: string;
    /** If set, the thickness axis is locked to this value. */
    fixedThickness?: number;
    /** If true, both width and height are fully locked. */
    fixedSize?: boolean;
}

export const STRUCTURAL_COMPONENTS: StructuralComponentDef[] = [
    { id: 0, name: "Wall",      defaultWidth: 200, defaultHeight: 10, colour: "6B7280", fixedThickness: 10 },
    { id: 1, name: "Staircase", defaultWidth: 100, defaultHeight: 100, colour: "6B7280" },
    { id: 2, name: "Door",      defaultWidth: 100,  defaultHeight: 10,  colour: "22C55E", fixedThickness: 10 },
    { id: 3, name: "Window",    defaultWidth: 100, defaultHeight: 10,  colour: "38BDF8", fixedThickness: 10 },
    { id: 4, name: "Pillar",    defaultWidth: 40,  defaultHeight: 40,  colour: "9CA3AF", fixedSize: true },
];

export const getStructuralDef = (equipmentTypeId: number): StructuralComponentDef | undefined =>
    STRUCTURAL_COMPONENTS.find((c) => c.id === equipmentTypeId);
