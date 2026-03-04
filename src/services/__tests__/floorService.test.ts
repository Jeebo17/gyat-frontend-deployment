import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createFloor, updateFloor, deleteFloor } from '../floorService';

describe('floorService', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('createFloor', () => {
        it('sends POST to /api/layouts/:layoutId/floors', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 1, name: 'Ground Floor', levelOrder: 0 }),
            } as Response);

            const result = await createFloor(10, { name: 'Ground Floor', levelOrder: 0 });
            expect(result.id).toBe(1);
            expect(result.name).toBe('Ground Floor');

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/layouts/10/floors');
            expect(call[1]?.method).toBe('POST');
        });
    });

    describe('updateFloor', () => {
        it('sends PUT to /api/layouts/floors/:floorId', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 5, name: 'Updated Floor', levelOrder: 1 }),
            } as Response);

            const result = await updateFloor(5, { name: 'Updated Floor', levelOrder: 1 });
            expect(result.name).toBe('Updated Floor');

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/layouts/floors/5');
            expect(call[1]?.method).toBe('PUT');
        });
    });

    describe('deleteFloor', () => {
        it('sends DELETE to /api/layouts/floors/:floorId', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 204,
            } as Response);

            await deleteFloor(5);

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/layouts/floors/5');
            expect(call[1]?.method).toBe('DELETE');
        });
    });
});
