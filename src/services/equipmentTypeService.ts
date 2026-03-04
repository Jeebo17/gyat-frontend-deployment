import { request } from "./apiClient";
import type { EquipmentTypeDTO, UpdateEquipmentTypeRequest } from "../types/api";

export async function upsertEquipmentTypeOverride(
    id: number,
    data: UpdateEquipmentTypeRequest
): Promise<EquipmentTypeDTO> {
    return request<EquipmentTypeDTO>(`/api/equipment-types/${id}/override`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updateCustomEquipmentType(
    id: number,
    data: UpdateEquipmentTypeRequest
): Promise<EquipmentTypeDTO> {
    return request<EquipmentTypeDTO>(`/api/equipment-types/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}
