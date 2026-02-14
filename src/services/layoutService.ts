import { request } from "./apiClient";
import type {
    GymLayoutDTO,
    CreateLayoutRequest,
    UpdateLayoutRequest,
} from "../types/api";

/**
 * Service for managing gym layouts.
 *
 * Endpoints covered:
 *   GET    /api/layouts/:id
 *   POST   /api/layouts
 *   PUT    /api/layouts/:id
 *   DELETE /api/layouts/:id
 */

// Fetch a single layout (including its floors & components).
export async function getLayout(id: number): Promise<GymLayoutDTO> {
    return request<GymLayoutDTO>(`/api/layouts/${id}`);
}

// Create a new layout.
export async function createLayout(
    data: CreateLayoutRequest
): Promise<GymLayoutDTO> {
    return request<GymLayoutDTO>("/api/layouts", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Update an existing layout (e.g. rename).
export async function updateLayout(
    id: number,
    data: UpdateLayoutRequest
): Promise<GymLayoutDTO> {
    return request<GymLayoutDTO>(`/api/layouts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// Delete a layout.
export async function deleteLayout(id: number): Promise<void> {
    return request<void>(`/api/layouts/${id}`, { method: "DELETE" });
}
