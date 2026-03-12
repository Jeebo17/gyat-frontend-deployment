import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { upsertEquipmentTypeOverride, updateCustomEquipmentType, getAllEquipmentTypes } from '../equipmentTypeService';

describe('equipmentTypeService', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('upsertEquipmentTypeOverride', () => {
        it('sends PUT to /api/equipment-types/:id/override', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 3, name: 'Bench Press Override' }),
            } as Response);

            const result = await upsertEquipmentTypeOverride(3, { name: 'Bench Press Override' });

            expect(result.id).toBe(3);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/equipment-types/3/override');
            expect(call[1]?.method).toBe('PUT');
        });

        it('throws on non-ok response', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 404,
                text: () => Promise.resolve('Not found'),
            } as Response);

            await expect(upsertEquipmentTypeOverride(99, { name: 'X' })).rejects.toThrow(/404/);
        });
    });

    describe('updateCustomEquipmentType', () => {
        it('sends PUT to /api/equipment-types/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 7, name: 'Cable Machine' }),
            } as Response);

            const result = await updateCustomEquipmentType(7, { name: 'Cable Machine' });

            expect(result.id).toBe(7);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/equipment-types/7');
            expect(call[1]?.method).toBe('PUT');
        });
    });

    describe('getAllEquipmentTypes', () => {
        it('sends GET to /api/equipment-types', async () => {
            const data = [{ id: 1, name: 'Treadmill' }, { id: 2, name: 'Dumbbells' }];
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(data),
            } as Response);

            const result = await getAllEquipmentTypes();

            expect(result).toEqual(data);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/equipment-types');
        });

        it('returns empty array when API returns empty', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve([]),
            } as Response);

            const result = await getAllEquipmentTypes();
            expect(result).toEqual([]);
        });
    });
});
