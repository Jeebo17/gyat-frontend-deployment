// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface ExerciseDTO {
    id: number;
    name: string;
    description: string | null;
    videoUrl: string | null;
    difficulty: string | null;
    equipmentTypeId: number;
    equipmentTypeName: string;
    muscles: string[];
}

export interface EquipmentDefinitionDTO {
    id: number;
    name: string;
    brand: string | null;
    imageUrl: string | null;
    description: string | null;
    safetyInfo: string | null;
    exercises: ExerciseDTO[];
}

export interface GymComponentDTO {
    id: number;
    layoutId: number;
    floorId: number;
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
    rotation: number;
    additionalInfo?: string | null;

    // Current backend key
    equipmentTypeId?: number;
    // Compatibility alias if backend exposes this key name
    equipmentId?: number;

    // Legacy fields (older payload shape)
    name?: string;
    brand?: string;
    imageUrl?: string;
    description?: string;
    safetyInfo?: string;
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
    definitions?: Partial<Record<number, EquipmentDefinitionDTO>>;
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

    // Fields the frontend needs to send but the backend does NOT yet accept
    // TODO: Ask dan to implement
    // colour: string;
}

export interface UpdateComponentRequest {
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
    rotation: number;
    additionalInfo?: string;

    // ── Fields the frontend needs to send but the backend does NOT yet accept ──
    // TODO: Ask dan to implement
    // colour: string;
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
