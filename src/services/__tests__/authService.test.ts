import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loginManager, registerManager, getManagerProfile, logoutManager } from '../authService';

describe('authService', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('loginManager', () => {
        it('sends POST with login credentials', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 1, username: 'admin', email: 'a@b.com', role: 'admin', message: 'ok' }),
            } as Response);

            const result = await loginManager({ usernameOrEmail: 'admin', password: 'pass' });
            expect(result.id).toBe(1);
            expect(result.username).toBe('admin');

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/auth/login');
            expect(call[1]?.method).toBe('POST');
        });

        it('throws on login failure', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 401,
                text: () => Promise.resolve(JSON.stringify({ message: 'Bad credentials' })),
            } as Response);

            await expect(loginManager({ usernameOrEmail: 'bad', password: 'bad' })).rejects.toThrow('Bad credentials');
        });

        it('throws raw text when response is not JSON', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 500,
                text: () => Promise.resolve('Internal Server Error'),
            } as Response);

            await expect(loginManager({ usernameOrEmail: 'u', password: 'p' })).rejects.toThrow('Internal Server Error');
        });
    });

    describe('registerManager', () => {
        it('sends POST with register credentials', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 2, username: 'new', email: 'new@b.com', role: 'user', message: 'ok' }),
            } as Response);

            const result = await registerManager({ username: 'new', email: 'new@b.com', password: 'pass123' });
            expect(result.id).toBe(2);

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/auth/register');
            expect(call[1]?.method).toBe('POST');
        });

        it('throws on registration failure', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 409,
                text: () => Promise.resolve(JSON.stringify({ message: 'Email already exists' })),
            } as Response);

            await expect(registerManager({ username: 'u', email: 'e@e.com', password: 'p' })).rejects.toThrow('Email already exists');
        });
    });

    describe('getManagerProfile', () => {
        it('sends GET to profile endpoint', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 1, username: 'admin', email: 'a@b.com', role: 'admin' }),
            } as Response);

            const result = await getManagerProfile();
            expect(result.id).toBe(1);
            expect(result.username).toBe('admin');

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/api/profile');
        });

        it('throws when not authenticated', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 401,
                text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })),
            } as Response);

            await expect(getManagerProfile()).rejects.toThrow('Unauthorized');
        });
    });

    describe('logoutManager', () => {
        it('sends POST to logout endpoint', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: true,
                status: 200,
            } as Response);

            await logoutManager();

            const call = vi.mocked(globalThis.fetch).mock.calls[0];
            expect(call[0]).toContain('/logout');
            expect(call[1]?.method).toBe('POST');
            expect(call[1]?.credentials).toBe('include');
        });

        it('does not throw when fetch fails', async () => {
            vi.mocked(globalThis.fetch).mockRejectedValue(new Error('network'));

            await expect(logoutManager()).resolves.not.toThrow();
        });
    });

    describe('error parsing', () => {
        it('parses error field from JSON response', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 400,
                text: () => Promise.resolve(JSON.stringify({ error: 'Validation failed' })),
            } as Response);

            await expect(loginManager({ usernameOrEmail: 'u', password: 'p' })).rejects.toThrow('Validation failed');
        });

        it('returns fallback when body is empty', async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue({
                ok: false,
                status: 400,
                text: () => Promise.resolve(''),
            } as Response);

            await expect(loginManager({ usernameOrEmail: 'u', password: 'p' })).rejects.toThrow('Request failed (400)');
        });
    });
});
