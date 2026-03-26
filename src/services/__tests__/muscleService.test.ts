import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getMuscles } from '../muscleService';

describe('muscleService', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('getMuscles', () => {
        it('sends GET to /api/muscles', async () => {
            const muscles = [
                { id: 1, name: 'Biceps' },
                { id: 2, name: 'Triceps' },
                { id: 3, name: 'Quadriceps' },
            ];
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(muscles),
            } as Response);

            const result = await getMuscles();

            expect(result).toEqual(muscles);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/muscles');
        });

        it('returns empty array when no muscles exist', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve([]),
            } as Response);

            const result = await getMuscles();
            expect(result).toEqual([]);
        });

        it('throws on server error', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: () => Promise.resolve('Internal server error'),
            } as Response);

            await expect(getMuscles()).rejects.toThrow(/500/);
        });
    });
});
