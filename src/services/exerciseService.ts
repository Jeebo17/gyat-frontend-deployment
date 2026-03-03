import { request } from "./apiClient";
import type {
    CreateExerciseRequest,
    ExerciseDTO,
    UpdateExerciseRequest,
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

export async function getExerciseById(id: number): Promise<ExerciseDTO> {
    return request<ExerciseDTO>(`/api/exercises/${id}`);
}

export async function updateCustomExercise(
    id: number,
    data: UpdateExerciseRequest
): Promise<ExerciseDTO> {
    return request<ExerciseDTO>(`/api/exercises/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}
