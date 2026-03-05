import { request } from "./apiClient";
import type {
    GymComponentDTO,
    CreateComponentRequest,
    UpdateComponentRequest,
} from "../types/api";

/**
 * Service for managing individual gym components (equipment placed on the map).
 *
 * Endpoints covered:
 *   POST   /api/components
 *   PUT    /api/components/:id
 *   DELETE /api/components/:id
 */

// Place a new component on the layout.
export async function createComponent(
    data: CreateComponentRequest
): Promise<GymComponentDTO> {
    return request<GymComponentDTO>("/api/components", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Update a component's position, size, rotation, or info.
export async function updateComponent(
    id: number,
    data: UpdateComponentRequest
): Promise<GymComponentDTO> {
    return request<GymComponentDTO>(`/api/components/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// Remove a component from the layout.
export async function deleteComponent(id: number): Promise<void> {
    return request<void>(`/api/components/${id}`, { method: "DELETE" });
}