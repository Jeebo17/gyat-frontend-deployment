import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLayout, getLayoutPublic, createLayout, updateLayout, deleteLayout } from '../layoutService';

describe('layoutService', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    const mockLayout = {
        id: 1,
        name: 'Test Gym',
        managerId: 1,
        floors: [{ id: 1, name: 'Ground', levelOrder: 0 }],
        components: [],
    };

    describe('getLayout', () => {
        it('sends GET to /api/layouts/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockLayout),
            } as Response);

            const result = await getLayout(1);
            expect(result.id).toBe(1);
            expect(result.name).toBe('Test Gym');

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/layouts/1');
        });
    });

    describe('getLayoutPublic', () => {
        it('sends GET to /api/public/layouts/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockLayout),
            } as Response);

            const result = await getLayoutPublic(1);
            expect(result.id).toBe(1);

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/public/layouts/1');
        });
    });

    describe('createLayout', () => {
        it('sends POST to /api/layouts', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ ...mockLayout, id: 2 }),
            } as Response);

            const result = await createLayout({ name: 'New Gym' });
            expect(result.id).toBe(2);

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/layouts');
            expect(call[1]?.method).toBe('POST');
        });
    });

    describe('updateLayout', () => {
        it('sends PUT to /api/layouts/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ ...mockLayout, name: 'Renamed' }),
            } as Response);

            const result = await updateLayout(1, { name: 'Renamed' });
            expect(result.name).toBe('Renamed');

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/layouts/1');
            expect(call[1]?.method).toBe('PUT');
        });
    });

    describe('deleteLayout', () => {
        it('sends DELETE to /api/layouts/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 204,
            } as Response);

            await deleteLayout(1);

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/layouts/1');
            expect(call[1]?.method).toBe('DELETE');
        });
    });
});
