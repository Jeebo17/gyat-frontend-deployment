import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { request, API_BASE_URL } from '../apiClient';

describe('apiClient', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it('makes GET request by default', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ data: 'test' }),
        } as Response);

        const result = await request('/api/test');
        expect(result).toEqual({ data: 'test' });
        expect(globalThis.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/api/test`,
            expect.objectContaining({
                credentials: 'include',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            })
        );
    });

    it('makes POST request with body', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ id: 1 }),
        } as Response);

        const result = await request('/api/test', {
            method: 'POST',
            body: JSON.stringify({ name: 'test' }),
        });

        expect(result).toEqual({ id: 1 });
        const call = vi.mocked(globalThis.fetch).mock.calls[0];
        expect(call[1]?.method).toBe('POST');
        expect(call[1]?.body).toBe(JSON.stringify({ name: 'test' }));
    });

    it('returns undefined for 204 No Content', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: true,
            status: 204,
            json: () => Promise.reject(new Error('no json')),
        } as Response);

        const result = await request('/api/test');
        expect(result).toBeUndefined();
    });

    it('throws error for non-ok response', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: false,
            status: 404,
            text: () => Promise.resolve('Not found'),
        } as Response);

        await expect(request('/api/missing')).rejects.toThrow(
            'API GET /api/missing failed (404): Not found'
        );
    });

    it('includes method name in error message', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: false,
            status: 500,
            text: () => Promise.resolve('Server error'),
        } as Response);

        await expect(request('/api/test', { method: 'DELETE' })).rejects.toThrow(
            'API DELETE /api/test failed (500): Server error'
        );
    });

    it('handles text() rejection gracefully', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: false,
            status: 500,
            text: () => Promise.reject(new Error('cannot read body')),
        } as Response);

        await expect(request('/api/test')).rejects.toThrow(
            'API GET /api/test failed (500): Unknown error'
        );
    });

    it('merges custom headers', async () => {
        vi.mocked(globalThis.fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
        } as Response);

        await request('/api/test', {
            headers: { 'X-Custom': 'value' },
        });

        const call = vi.mocked(globalThis.fetch).mock.calls[0];
        const headers = call[1]?.headers as Record<string, string>;
        expect(headers['Content-Type']).toBe('application/json');
        expect(headers['X-Custom']).toBe('value');
    });
});
