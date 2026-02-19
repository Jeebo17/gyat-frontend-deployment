import { getLayout } from "./layoutService";
import type { EquipmentDefinitionDTO, GymComponentDTO, GymFloorDTO } from "../types/api";
import type { TileData } from "../types/tile";

const FALLBACK_COLOURS = ["red", "blue", "green", "yellow", "purple", "orange", "gray", "zinc"];

const getColourForEquipment = (equipmentTypeId: number): string => {
    const index = Math.abs(equipmentTypeId) % FALLBACK_COLOURS.length;
    return FALLBACK_COLOURS[index];
};

const resolveEquipmentTypeId = (component: GymComponentDTO): number => {
    if (typeof component.equipmentTypeId === "number") return component.equipmentTypeId;
    if (typeof component.equipmentId === "number") return component.equipmentId;
    return 0;
};

const mapComponentToTile = (
    component: GymComponentDTO,
    definitions: Partial<Record<number, EquipmentDefinitionDTO>>
): TileData => {
    const equipmentTypeId = resolveEquipmentTypeId(component);
    const definition = definitions[equipmentTypeId];
    const exercises = definition?.exercises ?? [];

    const descriptionParts = [
        definition?.description?.trim() || component.description?.trim(),
        component.additionalInfo?.trim(),
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
        xCoord: component.xCoord,
        yCoord: component.yCoord,
        width: component.width,
        height: component.height,
        rotation: component.rotation,
        colour: getColourForEquipment(equipmentTypeId),
        equipment: {
            name: definition?.name || component.name || `Equipment #${equipmentTypeId}`,
            description: descriptionParts.join("\n\n") || "No description provided.",
            benefits: exercises.map((exercise) => exercise.name),
            musclesTargeted: musclesTargeted.length > 0 ? musclesTargeted : undefined,
            videoUrl,
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

// export function getInitialTiles(): TileData[] {
//     return [
//         { id: 1, xCoord: 20, yCoord: 160, width: 240, height: 100, rotation: 0, colour: "red", equipment: treadmillEquipment },
//         { id: 2, xCoord: 20, yCoord: 280, width: 240, height: 100, rotation: 0, colour: "red", equipment: { name: "Treadmill", icon: TbTreadmill } },
//         { id: 3, xCoord: 20, yCoord: 400, width: 240, height: 100, rotation: 0, colour: "red", equipment: { name: "Treadmill", icon: TbTreadmill } },
//         { id: 4, xCoord: 20, yCoord: 540, width: 240, height: 100, rotation: 0, colour: "blue", equipment: { name: "Rowing Machine", icon: MdRowing } },
//         { id: 5, xCoord: 20, yCoord: 660, width: 240, height: 100, rotation: 0, colour: "blue", equipment: { name: "Rowing Machine", icon: MdRowing } },
//         { id: 6, xCoord: 400, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { name: "Racks", icon: GiWeightLiftingUp  } },
//         { id: 7, xCoord: 700, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { name: "Racks", icon: GiWeightLiftingUp  } },
//         { id: 8, xCoord: 1000, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { name: "Racks", icon: GiWeightLiftingUp  } },
//         { id: 9, xCoord: 1140, yCoord: 340, width: 550, height: 300, rotation: 0, colour: "purple", equipment: { name: "Free Weights", icon: IoBarbell } },
//         { id: 10, xCoord: 400, yCoord: 500, width: 500, height: 280, rotation: 0, colour: "orange", equipment: { name: "Open Space", icon: GrYoga } },
//         { id: 11, xCoord: 600, yCoord: 300, width: 100, height: 100, rotation: 0, colour: "yellow", equipment: { name: "Resistance Machine", icon: MdElectricBolt } },
//         { id: 12, xCoord: 800, yCoord: 300, width: 100, height: 100, rotation: 0, colour: "yellow", equipment: { name: "Resistance Machine", icon: MdElectricBolt } },
//         { id: 13, xCoord: 950, yCoord: 300, width: 100, height: 100, rotation: 0, colour: "yellow", equipment: { name: "Resistance Machine", icon: MdElectricBolt } },
//         { id: 14, xCoord: 1000, yCoord: 760, width: 160, height: 40, rotation: 0, colour: "gray", equipment: { name: "Entrance", icon: undefined }, canHover: false },
//     ];
// }