import { describe, expect, it } from "vitest";
import type { EquipmentDefinitionDTO, GymComponentDTO } from "../../types/api";
import { mapComponentToTile } from "../tileService";

describe("mapComponentToTile", () => {
    it("uses relational definition and exercises instead of additionalInfo modal overrides", () => {
        const component: GymComponentDTO = {
            id: 10,
            layoutId: 1,
            floorId: 2,
            xCoord: 100,
            yCoord: 200,
            width: 180,
            height: 120,
            rotation: 0,
            equipmentTypeId: 5,
            name: "Legacy Component Name",
            description: "Legacy component description",
            additionalInfo: JSON.stringify({
                notes: "Old free-text notes",
                modalOverrides: {
                    name: "Wrong Name",
                    description: "Wrong Description",
                    benefits: ["Wrong Benefit"],
                    musclesTargeted: ["Wrong Muscle"],
                    videoUrl: "https://wrong.example/video",
                },
            }),
        };

        const definitions: Partial<Record<number, EquipmentDefinitionDTO>> = {
            5: {
                id: 5,
                name: "Leg Press",
                brand: null,
                imageUrl: null,
                description: "Relational description",
                safetyInfo: null,
                exercises: [
                    {
                        id: 301,
                        name: "Seated Leg Press",
                        description: null,
                        videoUrl: "https://example.com/leg-press",
                        difficulty: null,
                        equipmentTypeId: 5,
                        equipmentTypeName: "Leg Press",
                        muscles: ["Quads", "Glutes"],
                    },
                    {
                        id: 302,
                        name: "Single-Leg Press",
                        description: null,
                        videoUrl: null,
                        difficulty: null,
                        equipmentTypeId: 5,
                        equipmentTypeName: "Leg Press",
                        muscles: ["Quads", "Hamstrings"],
                    },
                ],
            },
        };

        const tile = mapComponentToTile(component, definitions);

        expect(tile.equipment.name).toBe("Leg Press");
        expect(tile.equipment.description).toBe("Relational description");
        expect(tile.equipment.benefits).toEqual(["Seated Leg Press", "Single-Leg Press"]);
        expect(tile.equipment.musclesTargeted).toEqual(["Quads", "Glutes", "Hamstrings"]);
        expect(tile.equipment.videoUrl).toBe("https://example.com/leg-press");
    });

    it("falls back to component fields when no definition exists", () => {
        const component: GymComponentDTO = {
            id: 11,
            layoutId: 1,
            floorId: 2,
            xCoord: 10,
            yCoord: 20,
            width: 120,
            height: 80,
            rotation: 0,
            equipmentTypeId: 77,
            name: "Fallback Name",
            description: "Fallback Description",
            additionalInfo: JSON.stringify({
                modalOverrides: {
                    name: "Should Not Be Used",
                    description: "Should Not Be Used",
                },
            }),
        };

        const tile = mapComponentToTile(component, {});

        expect(tile.equipment.name).toBe("Fallback Name");
        expect(tile.equipment.description).toBe("Fallback Description");
        expect(tile.equipment.benefits).toEqual([]);
        expect(tile.equipment.musclesTargeted).toBeUndefined();
        expect(tile.equipment.videoUrl).toBeUndefined();
    });
});
