import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createExercise, upsertExerciseOverride, getExerciseById, updateCustomExercise } from '../exerciseService';

describe('exerciseService', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('createExercise', () => {
        it('sends POST to /api/exercises', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 10, name: 'Bicep Curl' }),
            } as Response);

            const result = await createExercise({
                name: 'Bicep Curl',
                description: 'Curl the weight',
                difficulty: 3,
                videoUrl: '',
                equipmentTypeId: 5,
                muscleIds: [1, 2],
            });

            expect(result.id).toBe(10);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/exercises');
            expect(call[1]?.method).toBe('POST');
        });

        it('sends body as JSON', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 1 }),
            } as Response);

            await createExercise({
                name: 'Push Up',
                description: 'Push',
                difficulty: 1,
                videoUrl: '',
                equipmentTypeId: 1,
                muscleIds: [],
            });

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.name).toBe('Push Up');
        });
    });

    describe('upsertExerciseOverride', () => {
        it('sends PUT to /api/exercises/:id/override', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 5, name: 'Modified Curl' }),
            } as Response);

            const result = await upsertExerciseOverride(5, { name: 'Modified Curl' });

            expect(result.id).toBe(5);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/exercises/5/override');
            expect(call[1]?.method).toBe('PUT');
        });

        it('throws on failure', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: () => Promise.resolve('Server error'),
            } as Response);

            await expect(upsertExerciseOverride(5, { name: 'X' })).rejects.toThrow(/500/);
        });
    });

    describe('getExerciseById', () => {
        it('sends GET to /api/exercises/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 42, name: 'Deadlift' }),
            } as Response);

            const result = await getExerciseById(42);

            expect(result.name).toBe('Deadlift');
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/exercises/42');
        });

        it('throws when exercise not found', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 404,
                text: () => Promise.resolve('Not found'),
            } as Response);

            await expect(getExerciseById(999)).rejects.toThrow(/404/);
        });
    });

    describe('updateCustomExercise', () => {
        it('sends PUT to /api/exercises/:id', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 3, name: 'Updated Squat' }),
            } as Response);

            const result = await updateCustomExercise(3, { name: 'Updated Squat' });

            expect(result.id).toBe(3);
            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/exercises/3');
            expect(call[1]?.method).toBe('PUT');
        });
    });
});
