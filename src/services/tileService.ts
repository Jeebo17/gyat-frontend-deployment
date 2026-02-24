import { getLayout } from "./layoutService";
import type { EquipmentDefinitionDTO, GymComponentDTO, GymFloorDTO } from "../types/api";
import type { TileData } from "../types/tile";

const FALLBACK_COLOURS = ["red", "blue", "green", "yellow", "purple", "orange", "gray", "zinc"];

interface ComponentModalOverrides {
    name?: string;
    description?: string;
    benefits?: string[];
    musclesTargeted?: string[];
    videoUrl?: string;
}

interface ParsedAdditionalInfo {
    legacyText?: string;
    modalOverrides?: ComponentModalOverrides;
}

const getColourForEquipment = (equipmentTypeId: number): string => {
    const index = Math.abs(equipmentTypeId) % FALLBACK_COLOURS.length;
    return FALLBACK_COLOURS[index];
};

const resolveEquipmentTypeId = (component: GymComponentDTO): number => {
    if (typeof component.equipmentTypeId === "number") return component.equipmentTypeId;
    if (typeof component.equipmentId === "number") return component.equipmentId;
    return 0;
};

const normalizeOptionalString = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
};

const parseStringArray = (value: unknown): string[] | undefined => {
    if (!Array.isArray(value)) return undefined;
    return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
};

const parseAdditionalInfo = (raw: string | null | undefined): ParsedAdditionalInfo => {
    if (!raw || !raw.trim()) return {};

    try {
        const parsed = JSON.parse(raw) as {
            notes?: unknown;
            modalOverrides?: {
                name?: unknown;
                description?: unknown;
                benefits?: unknown;
                musclesTargeted?: unknown;
                videoUrl?: unknown;
            };
        };

        if (!parsed || typeof parsed !== "object") {
            return { legacyText: raw };
        }

        const overrides = parsed.modalOverrides;
        if (!overrides || typeof overrides !== "object") {
            return { legacyText: normalizeOptionalString(parsed.notes) ?? raw };
        }

        const modalOverrides: ComponentModalOverrides = {
            name: normalizeOptionalString(overrides.name),
            description: normalizeOptionalString(overrides.description),
            benefits: parseStringArray(overrides.benefits),
            musclesTargeted: parseStringArray(overrides.musclesTargeted),
            videoUrl: normalizeOptionalString(overrides.videoUrl),
        };

        const hasOverrides = Object.values(modalOverrides).some((value) => value !== undefined);

        return {
            legacyText: normalizeOptionalString(parsed.notes),
            modalOverrides: hasOverrides ? modalOverrides : undefined,
        };
    } catch {
        return { legacyText: raw };
    }
};

export const mapComponentToTile = (
    component: GymComponentDTO,
    definitions: Partial<Record<number, EquipmentDefinitionDTO>>
): TileData => {
    const equipmentTypeId = resolveEquipmentTypeId(component);
    const definition = definitions[equipmentTypeId];
    const exercises = definition?.exercises ?? [];
    const parsedAdditionalInfo = parseAdditionalInfo(component.additionalInfo);
    const modalOverrides = parsedAdditionalInfo.modalOverrides;

    const descriptionParts = [
        definition?.description?.trim() || component.description?.trim(),
        parsedAdditionalInfo.legacyText,
    ].filter((part): part is string => Boolean(part));

    const musclesTargeted = Array.from(
        new Set(
            exercises.flatMap((exercise) => exercise.muscles ?? [])
        )
    );

    const videoUrl = exercises.find((exercise) => exercise.videoUrl)?.videoUrl ?? undefined;

    return {
        id: component.id,
        equipmentTypeId,
        additionalInfo: component.additionalInfo ?? undefined,
        xCoord: component.xCoord,
        yCoord: component.yCoord,
        width: component.width,
        height: component.height,
        rotation: component.rotation,
        colour: getColourForEquipment(equipmentTypeId),
        equipment: {
            name: modalOverrides?.name || definition?.name || component.name || `Equipment #${equipmentTypeId}`,
            description: modalOverrides?.description ?? (descriptionParts.join("\n\n") || "No description provided."),
            benefits: modalOverrides?.benefits ?? exercises.map((exercise) => exercise.name),
            musclesTargeted: modalOverrides?.musclesTargeted ?? (musclesTargeted.length > 0 ? musclesTargeted : undefined),
            videoUrl: modalOverrides?.videoUrl ?? videoUrl,
        },
    };
};

export interface FloorTilesResult {
    floors: GymFloorDTO[];
    selectedFloor: GymFloorDTO | null;
    tiles: TileData[];
}

export async function getFloorTiles(
    layoutId: number,
    floorIndex: number
): Promise<FloorTilesResult> {
    const layout = await getLayout(layoutId);

    const floors = [...layout.floors].sort((a, b) => a.levelOrder - b.levelOrder);
    if (floors.length === 0) {
        return {
            floors,
            selectedFloor: null,
            tiles: [],
        };
    }

    const clampedIndex = Math.min(Math.max(floorIndex, 0), floors.length - 1);
    const selectedFloor = floors[clampedIndex];

    const definitions = layout.definitions ?? {};
    const tiles = layout.components
        .filter((component) => component.floorId === selectedFloor.id)
        .map((component) => mapComponentToTile(component, definitions));

    console.log("Mapped tiles:", tiles);

    return {
        floors,
        selectedFloor,
        tiles,
    };
}

export function getPreviewTiles(): TileData[] {
    return [
        {
            id: 1, xCoord: 20, yCoord: 160, width: 240, height: 100, rotation: 0, colour: "red",
            equipment: {
                name: "Treadmill",
                description: "A motorised belt for walking or running indoors.",
                benefits: ["Running", "Walking", "Interval sprints"],
                musclesTargeted: ["Quadriceps", "Hamstrings", "Calves", "Glutes"],
            },
        },
        {
            id: 2, xCoord: 20, yCoord: 280, width: 240, height: 100, rotation: 0, colour: "red",
            equipment: {
                name: "Treadmill",
                description: "A motorised belt for walking or running indoors.",
                benefits: ["Running", "Walking", "Interval sprints"],
                musclesTargeted: ["Quadriceps", "Hamstrings", "Calves", "Glutes"],
            },
        },
        {
            id: 3, xCoord: 20, yCoord: 400, width: 240, height: 100, rotation: 0, colour: "red",
            equipment: {
                name: "Treadmill",
                description: "A motorised belt for walking or running indoors.",
                benefits: ["Running", "Walking", "Interval sprints"],
                musclesTargeted: ["Quadriceps", "Hamstrings", "Calves", "Glutes"],
            },
        },
        {
            id: 4, xCoord: 20, yCoord: 540, width: 240, height: 100, rotation: 0, colour: "blue",
            equipment: {
                name: "Rowing Machine",
                description: "Simulates the action of watercraft rowing for a full-body workout.",
                benefits: ["Rowing", "HIIT intervals", "Endurance training"],
                musclesTargeted: ["Back", "Biceps", "Legs", "Core"],
            },
        },
        {
            id: 5, xCoord: 20, yCoord: 660, width: 240, height: 100, rotation: 0, colour: "blue",
            equipment: {
                name: "Rowing Machine",
                description: "Simulates the action of watercraft rowing for a full-body workout.",
                benefits: ["Rowing", "HIIT intervals", "Endurance training"],
                musclesTargeted: ["Back", "Biceps", "Legs", "Core"],
            },
        },
        {
            id: 6, xCoord: 300, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green",
            equipment: {
                name: "Racks",
                description: "Squat / power rack for barbell exercises.",
                benefits: ["Squats", "Bench press", "Overhead press", "Barbell rows"],
                musclesTargeted: ["Quadriceps", "Glutes", "Chest", "Shoulders", "Back"],
            },
        },
        {
            id: 7, xCoord: 600, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green",
            equipment: {
                name: "Racks",
                description: "Squat / power rack for barbell exercises.",
                benefits: ["Squats", "Bench press", "Overhead press", "Barbell rows"],
                musclesTargeted: ["Quadriceps", "Glutes", "Chest", "Shoulders", "Back"],
            },
        },
        {
            id: 9, xCoord: 950, yCoord: 50, width: 240, height: 430, rotation: 0, colour: "purple",
            equipment: {
                name: "Free Weights",
                description: "Dumbbells and barbells for strength training.",
                benefits: ["Bicep curls", "Shoulder press", "Deadlifts", "Lunges"],
                musclesTargeted: ["Biceps", "Triceps", "Shoulders", "Back", "Legs"],
            },
        },
        {
            id: 10, xCoord: 350, yCoord: 550, width: 500, height: 230, rotation: 0, colour: "orange",
            equipment: {
                name: "Open Space",
                description: "Open area for stretching, yoga, and bodyweight exercises.",
                benefits: ["Yoga", "Stretching", "Bodyweight exercises", "Warm-up"],
                musclesTargeted: ["Full body"],
            },
        },
        {
            id: 11, xCoord: 450, yCoord: 300, width: 250, height: 130, rotation: 0, colour: "yellow",
            equipment: {
                name: "Resistance Machine",
                description: "Cable or pin-loaded machine for targeted resistance exercises.",
                benefits: ["Lat pulldown", "Chest fly", "Leg extension", "Cable row"],
                musclesTargeted: ["Chest", "Back", "Shoulders", "Legs"],
            },
        },
        {
            id: 14, xCoord: 1000, yCoord: 750, width: 160, height: 20, rotation: 0, colour: "gray",
            equipment: { name: "Entrance" },
            canHover: false,
        },
    ];
}
