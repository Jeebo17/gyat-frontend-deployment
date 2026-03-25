// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface ExerciseDTO {
    id: number;
    name: string;
    description: string | null;
    videoUrl: string | null;
    difficulty: string | null;
    equipmentTypeId: number;
    equipmentTypeName: string;
    muscles: MuscleDTO[];
    global?: boolean;
}

export interface MuscleDTO {
    id: number;
    name: string;
}

export interface EquipmentTypeDTO {
    id: number;
    name: string;
    brand: string | null;
    imageUrl: string | null;
    description: string | null;
    safetyInfo: string | null;
    global: boolean;
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
    equipmentTypeId: number;
    floorId: number;
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
    rotation: number;
    additionalInfo?: string | null;
    outOfOrder?: boolean;
    colour?: string | null;

    // Compatibility alias if backend exposes this key name
    equipmentId?: number;
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

export interface GymLayoutSearchProps {
    id: number;
    name: string;
}



// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateComponentRequest {
    layoutId: number;
    equipmentTypeId: number;
    floorId: number;
    xCoord: number;
    yCoord: number;
    colour: string;
    width: number;
    height: number;
    rotation: number;
    additionalInfo?: string;
}

export interface UpdateComponentRequest {
    xCoord: number;
    yCoord: number;
    colour: string;
    width: number;
    height: number;
    rotation: number;
    outOfOrder: boolean;
    additionalInfo?: string;

    // ── Fields the frontend needs to send but the backend does NOT yet accept ──
    // TODO: Ask dan to implement
    // colour: string;
}

export interface UpdateEquipmentTypeRequest {
    name?: string;
    brand?: string;
    imageUrl?: string;
    description?: string;
    safetyInfo?: string;
    colour?: string;
}

export interface CreateExerciseRequest {
    name: string;
    description?: string | null;
    videoUrl?: string | null;
    difficulty?: string | null;
    muscleIds: number[];
    equipmentTypeId: number;
}

export interface UpdateExerciseOverrideRequest {
    name?: string;
    description?: string;
    videoUrl?: string;
    difficulty?: string;
}

export interface UpdateExerciseRequest {
    name?: string;
    description?: string;
    videoUrl?: string;
    difficulty?: string;
    muscleIds?: number[];
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

// ─── Auth DTOs ───────────────────────────────────────────────────────────────

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}

export interface AuthResponse {
    id: number | null;
    username: string | null;
    email: string | null;
    role: string | null;
    message: string;
}

export interface ManagerProfileResponse {
    id: number;
    username: string;
    email: string;
    role: string;
}
