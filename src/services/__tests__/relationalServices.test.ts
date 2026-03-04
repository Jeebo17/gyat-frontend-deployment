import { beforeEach, describe, expect, it, vi } from "vitest";
import { createExercise, getExerciseById, updateCustomExercise, upsertExerciseOverride } from "../exerciseService";
import { upsertEquipmentTypeOverride } from "../equipmentTypeService";

const mockJsonResponse = <T,>(data: T): Response =>
    ({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(data),
    } as unknown as Response);

describe("relational services", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
    });

    it("upsertEquipmentTypeOverride sends PUT /api/equipment-types/:id/override", async () => {
        fetchMock.mockResolvedValueOnce(
            mockJsonResponse({
                id: 12,
                name: "Updated Name",
                brand: null,
                imageUrl: null,
                description: "Updated Description",
                safetyInfo: null,
                global: false,
            })
        );

        await upsertEquipmentTypeOverride(12, {
            name: "Updated Name",
            description: "Updated Description",
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];
        expect(String(url)).toContain("/api/equipment-types/12/override");
        expect(options?.method).toBe("PUT");
        expect(options?.credentials).toBe("include");
        expect(options?.body).toBe(JSON.stringify({
            name: "Updated Name",
            description: "Updated Description",
        }));
    });

    it("upsertExerciseOverride sends PUT /api/exercises/:id/override", async () => {
        fetchMock.mockResolvedValueOnce(
            mockJsonResponse({
                id: 8,
                name: "Cable Row",
                description: null,
                videoUrl: "https://example.com/video",
                difficulty: null,
                equipmentTypeId: 3,
                equipmentTypeName: "Cable Machine",
                muscles: ["Back"],
            })
        );

        await upsertExerciseOverride(8, {
            name: "Cable Row",
            videoUrl: "https://example.com/video",
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];
        expect(String(url)).toContain("/api/exercises/8/override");
        expect(options?.method).toBe("PUT");
        expect(options?.credentials).toBe("include");
        expect(options?.body).toBe(JSON.stringify({
            name: "Cable Row",
            videoUrl: "https://example.com/video",
        }));
    });

    it("createExercise sends POST /api/exercises", async () => {
        fetchMock.mockResolvedValueOnce(
            mockJsonResponse({
                id: 99,
                name: "Incline Press",
                description: null,
                videoUrl: null,
                difficulty: null,
                equipmentTypeId: 4,
                equipmentTypeName: "Chest Press",
                muscles: [],
            })
        );

        await createExercise({
            equipmentTypeId: 4,
            name: "Incline Press",
            description: "",
            videoUrl: "",
            difficulty: "",
            muscleIds: [],
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];
        expect(String(url)).toContain("/api/exercises");
        expect(options?.method).toBe("POST");
        expect(options?.credentials).toBe("include");
        expect(options?.body).toBe(JSON.stringify({
            equipmentTypeId: 4,
            name: "Incline Press",
            description: "",
            videoUrl: "",
            difficulty: "",
            muscleIds: [],
        }));
    });

    it("getExerciseById sends GET /api/exercises/:id", async () => {
        fetchMock.mockResolvedValueOnce(
            mockJsonResponse({
                id: 14,
                name: "Lat Pulldown",
                description: null,
                videoUrl: null,
                difficulty: null,
                equipmentTypeId: 3,
                equipmentTypeName: "Cable Machine",
                muscles: ["Back"],
                global: true,
            })
        );

        await getExerciseById(14);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];
        expect(String(url)).toContain("/api/exercises/14");
        expect(options?.method).toBeUndefined();
        expect(options?.credentials).toBe("include");
    });

    it("updateCustomExercise sends PUT /api/exercises/:id", async () => {
        fetchMock.mockResolvedValueOnce(
            mockJsonResponse({
                id: 99,
                name: "Incline Press Updated",
                description: null,
                videoUrl: null,
                difficulty: null,
                equipmentTypeId: 4,
                equipmentTypeName: "Chest Press",
                muscles: [],
                global: false,
            })
        );

        await updateCustomExercise(99, {
            name: "Incline Press Updated",
            description: "Updated",
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];
        expect(String(url)).toContain("/api/exercises/99");
        expect(options?.method).toBe("PUT");
        expect(options?.credentials).toBe("include");
        expect(options?.body).toBe(JSON.stringify({
            name: "Incline Press Updated",
            description: "Updated",
        }));
    });
});
