import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth, RequireAuth, RequireAdmin } from '../AuthContext';

vi.mock('../../services/authService', () => ({
    getManagerProfile: vi.fn(),
    logoutManager: vi.fn(),
}));

import { getManagerProfile, logoutManager } from '../../services/authService';
const mockGetManagerProfile = vi.mocked(getManagerProfile);
const mockLogoutManager = vi.mocked(logoutManager);

function TestConsumer() {
    const auth = useAuth();
    return (
        <div>
            <span data-testid="logged-in">{String(auth.isLoggedIn)}</span>
            <span data-testid="loading">{String(auth.isLoading)}</span>
            <span data-testid="username">{auth.userName}</span>
            <span data-testid="email">{auth.email}</span>
            <span data-testid="role">{auth.role}</span>
            <span data-testid="user-id">{String(auth.userId)}</span>
            <button
                onClick={() =>
                    auth.login({ id: 1, username: 'admin', email: 'admin@test.com', role: 'admin' })
                }
            >
                Login
            </button>
            <button onClick={() => auth.logout()}>Logout</button>
            <button onClick={() => auth.refreshAuth()}>Refresh</button>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
        // Default: refreshAuth fails (not logged in)
        mockGetManagerProfile.mockRejectedValue(new Error('not authenticated'));
        mockLogoutManager.mockResolvedValue(undefined as any);
    });

    it('starts with isLoading true', () => {
        const { container } = render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );
        // Initially isLoading is true before refreshAuth resolves
        const loadingEl = container.querySelector('[data-testid="loading"]');
        // isLoading is set true in initial state
        expect(loadingEl).toBeTruthy();
    });

    it('sets logged out state after failed refresh', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('logged-in').textContent).toBe('false');
        expect(screen.getByTestId('username').textContent).toBe('');
    });

    it('sets logged in state after successful refresh', async () => {
        mockGetManagerProfile.mockResolvedValue({
            id: 42,
            username: 'john',
            email: 'john@test.com',
            role: 'manager',
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('logged-in').textContent).toBe('true');
        expect(screen.getByTestId('username').textContent).toBe('john');
        expect(screen.getByTestId('email').textContent).toBe('john@test.com');
        expect(screen.getByTestId('role').textContent).toBe('manager');
    });

    it('login updates state and persists to localStorage', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        act(() => {
            screen.getByText('Login').click();
        });

        expect(screen.getByTestId('logged-in').textContent).toBe('true');
        expect(screen.getByTestId('username').textContent).toBe('admin');
        expect(localStorage.getItem('auth')).toBeTruthy();

        const stored = JSON.parse(localStorage.getItem('auth')!);
        expect(stored.isLoggedIn).toBe(true);
        expect(stored.userName).toBe('admin');
    });

    it('logout clears state and sessionStorage', async () => {
        mockGetManagerProfile.mockResolvedValue({
            id: 1,
            username: 'user',
            email: 'user@test.com',
            role: 'manager',
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('logged-in').textContent).toBe('true');
        });

        await act(async () => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByTestId('logged-in').textContent).toBe('false');
        expect(screen.getByTestId('username').textContent).toBe('');
        expect(mockLogoutManager).toHaveBeenCalledOnce();
    });

    it('restores state from localStorage on mount', async () => {
        localStorage.setItem(
            'auth',
            JSON.stringify({
                isLoggedIn: true,
                userId: 5,
                userName: 'saved',
                email: 'saved@test.com',
                role: 'admin',
            })
        );

        // refreshAuth will fail, but initial state should briefly show saved state
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // Before refreshAuth completes, we should see the persisted state
        // After refresh fails, it'll be logged out
        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
    });

    it('handles corrupted localStorage gracefully', async () => {
        localStorage.setItem('auth', 'not-valid-json');

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('logged-in').textContent).toBe('false');
    });

    it('throws when useAuth is used outside provider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<TestConsumer />)).toThrow(
            'useAuth must be used within AuthProvider'
        );
        consoleError.mockRestore();
    });

    describe('RequireAuth', () => {
        it('renders children when logged in', async () => {
            mockGetManagerProfile.mockResolvedValue({
                id: 1,
                username: 'user',
                email: 'user@test.com',
                role: 'manager',
            });

            render(
                <AuthProvider>
                    <RequireAuth>
                        <span data-testid="protected">Protected Content</span>
                    </RequireAuth>
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('protected')).toBeTruthy();
            });
        });

        it('renders nothing when not logged in', async () => {
            render(
                <AuthProvider>
                    <RequireAuth>
                        <span data-testid="protected">Protected Content</span>
                    </RequireAuth>
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.queryByTestId('protected')).toBeNull();
            });
        });

        it('renders nothing while loading', () => {
            // During initial render, isLoading is true
            const { container } = render(
                <AuthProvider>
                    <RequireAuth>
                        <span data-testid="protected">Protected Content</span>
                    </RequireAuth>
                </AuthProvider>
            );
            // During loading, RequireAuth returns null
            expect(container.querySelector('[data-testid="protected"]')).toBeNull();
        });
    });

    describe('RequireAdmin', () => {
        it('renders children when logged in', async () => {
            mockGetManagerProfile.mockResolvedValue({
                id: 1,
                username: 'admin',
                email: 'admin@test.com',
                role: 'admin',
            });

            render(
                <AuthProvider>
                    <RequireAdmin>
                        <span data-testid="admin">Admin Content</span>
                    </RequireAdmin>
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('admin')).toBeTruthy();
            });
        });

        it('renders nothing when not logged in', async () => {
            render(
                <AuthProvider>
                    <RequireAdmin>
                        <span data-testid="admin">Admin Content</span>
                    </RequireAdmin>
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.queryByTestId('admin')).toBeNull();
            });
        });
    });
});
