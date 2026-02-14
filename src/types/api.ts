// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface GymComponentDTO {
    id: number;
    layoutId: number;
    floorId: number;
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
    rotation: number;
    equipmentTypeId: number;
    name: string;
    brand: string;
    imageUrl: string;
    description: string;
    safetyInfo: string;
    additionalInfo: string;
}

export interface GymFloorDTO {
    id: number;
    name: string;
    levelOrder: number;
}

export interface GymLayoutDTO {
    id: number;
    name: string;
    managerId: number;
    floors: GymFloorDTO[];
    components: GymComponentDTO[];
}

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateComponentRequest {
    layoutId: number;
    equipmentTypeId: number;
    floorId: number;
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
    rotation: number;
    additionalInfo?: string;
}

export interface UpdateComponentRequest {
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
    rotation: number;
    additionalInfo?: string;
}

export interface CreateLayoutRequest {
    name: string;
}

export interface UpdateLayoutRequest {
    name: string;
}

export interface CreateFloorRequest {
    name: string;
    levelOrder: number;
}

export interface UpdateFloorRequest {
    name: string;
    levelOrder: number;
}
