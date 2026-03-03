import { request } from "./apiClient";
import type {
    CreateExerciseRequest,
    ExerciseDTO,
    UpdateExerciseOverrideRequest,
} from "../types/api";

export async function createExercise(
    data: CreateExerciseRequest
): Promise<ExerciseDTO> {
    return request<ExerciseDTO>("/api/exercises", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function upsertExerciseOverride(
    id: number,
    data: UpdateExerciseOverrideRequest
): Promise<ExerciseDTO> {
    return request<ExerciseDTO>(`/api/exercises/${id}/override`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}
