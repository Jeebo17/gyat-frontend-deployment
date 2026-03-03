import { request } from "./apiClient";
import type { MuscleDTO } from "../types/api";

export async function getMuscles(): Promise<MuscleDTO[]> {
    return request<MuscleDTO[]>("/api/muscles");
}
