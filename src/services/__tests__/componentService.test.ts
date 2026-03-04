import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createComponent, updateComponent, deleteComponent } from '../componentService';

describe('componentService', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('createComponent', () => {
        it('sends POST to /api/components', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 1, layoutId: 1, floorId: 1, xCoord: 0, yCoord: 0, width: 100, height: 100, rotation: 0 }),
            } as Response);

            const result = await createComponent({
                layoutId: 1,
                equipmentTypeId: 5,
                floorId: 1,
                xCoord: 10,
                yCoord: 20,
                width: 100,
                height: 100,
                rotation: 0,
            });

            expect(result.id).toBe(1);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/components');
            expect(call[1]?.method).toBe('POST');
        });
    });

    describe('updateComponent', () => {
        it('sends PUT to /api/components/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 5, layoutId: 1, floorId: 1, xCoord: 50, yCoord: 50, width: 200, height: 200, rotation: 90 }),
            } as Response);

            const result = await updateComponent(5, {
                xCoord: 50,
                yCoord: 50,
                width: 200,
                height: 200,
                rotation: 90,
            });

            expect(result.id).toBe(5);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/components/5');
            expect(call[1]?.method).toBe('PUT');
        });
    });

    describe('deleteComponent', () => {
        it('sends DELETE to /api/components/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 204,
            } as Response);

            await deleteComponent(5);

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/components/5');
            expect(call[1]?.method).toBe('DELETE');
        });
    });
});
