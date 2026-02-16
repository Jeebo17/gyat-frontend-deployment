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

    // Fields the frontend uses but the backend does NOT yet return
    // TODO: Ask dan to implement
    // colour: string;           // Display colour for the tile (e.g. "red", "#ff0000")
    // videoUrl: string;         // URL to an equipment demo video (currently only on Exercise entity)
    // musclesTargeted: string[];// List of muscle names (currently only via Exercise → Muscle join)
    // benefits: string[];       // List of benefit descriptions (does not exist in backend at all)
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
