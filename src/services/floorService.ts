import { request } from "./apiClient";
import type {
  GymFloorDTO,
  CreateFloorRequest,
  UpdateFloorRequest,
} from "../types/api";

/**
 * Service for managing floors within a gym layout.
 *
 * Endpoints covered:
 *   POST   /api/layouts/:layoutId/floors
 *   PUT    /api/layouts/floors/:floorId
 *   DELETE /api/layouts/floors/:floorId
 */

// Add a new floor to a layout.
export async function createFloor(
  layoutId: number,
  data: CreateFloorRequest
): Promise<GymFloorDTO> {
  return request<GymFloorDTO>(`/api/layouts/${layoutId}/floors`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update an existing floor (name / level order)
export async function updateFloor(
  floorId: number,
  data: UpdateFloorRequest
): Promise<GymFloorDTO> {
  return request<GymFloorDTO>(`/api/layouts/floors/${floorId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Delete a floor.
export async function deleteFloor(floorId: number): Promise<void> {
  return request<void>(`/api/layouts/floors/${floorId}`, {
    method: "DELETE",
  });
}
