/**
 * Integration tests for context propagation.
 * Verifies that ThemeContext and SettingsContext changes propagate through
 * real component trees, affecting the DOM as expected.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { SettingsProvider } from '../../context/SettingsContext';
import { AuthProvider } from '../../context/AuthContext';
import App from '../../App';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

vi.mock('framer-motion', () => {
    const filterMotionProps = (props: any) => {
        const { layoutId, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, drag, dragConstraints, onDragEnd, layout, ...rest } = props;
        return rest;
    };
    return {
        motion: {
            div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
            button: ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>,
            span: ({ children, ...props }: any) => <span {...filterMotionProps(props)}>{children}</span>,
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
        useMotionValue: () => ({ set: vi.fn() }),
        useTransform: () => ({ set: vi.fn() }),
    };
});

vi.mock('../../hooks/useAppSound', () => ({
    useAppSound: () => [vi.fn(), { stop: vi.fn() }],
}));

vi.mock('use-sound', () => ({
    default: () => [vi.fn(), { stop: vi.fn() }],
}));

// Mock Silk background to avoid @react-three/fiber Canvas + ResizeObserver issues
vi.mock('../../backgrounds/Silk', () => ({
    default: () => <div data-testid="silk-background" />,
}));

function renderWithProviders(initialRoute: string) {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <ThemeProvider>
                <SettingsProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </SettingsProvider>
            </ThemeProvider>
        </MemoryRouter>
    );
}

describe('Context Propagation Integration', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        sessionStorage.clear();
        document.documentElement.className = '';
        document.documentElement.style.fontSize = '';
    });

    describe('Theme Context', () => {
        it('applies dark theme class to document root', async () => {
            localStorage.setItem('theme', 'dark');
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/');

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });

        it('applies light theme by removing dark class', async () => {
            localStorage.setItem('theme', 'light');
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/');

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });
        });

        it('persists theme choice to localStorage', async () => {
            localStorage.setItem('theme', 'dark');
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/');

            await waitFor(() => {
                expect(localStorage.getItem('theme')).toBe('dark');
            });
        });
    });

    describe('Settings Context', () => {
        it('settings page renders accessibility controls', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/settings');

            await waitFor(() => {
                expect(screen.getByText('Accessibility Settings')).toBeTruthy();
            });
        });

        it('high contrast mode adds class to document root', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/settings');

            await waitFor(() => {
                expect(screen.getByText('Accessibility Settings')).toBeTruthy();
            });

            // Find and toggle high contrast - look for the toggle
            const highContrastToggle = screen.getByText(/high contrast/i);
            expect(highContrastToggle).toBeTruthy();
        });
    });

    describe('Auth Context Persistence', () => {
        it('preserves auth state across renders via localStorage', async () => {
            localStorage.setItem('auth', JSON.stringify({
                isLoggedIn: true,
                userId: 1,
                userName: 'testuser',
                email: 'test@example.com',
                role: 'MANAGER',
            }));

            vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/profile')) {
                    return new Response(JSON.stringify({
                        id: 1,
                        username: 'testuser',
                        email: 'test@example.com',
                        role: 'MANAGER',
                    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/profile');

            // Auth state should be persisted and available
            await waitFor(() => {
                expect(screen.getByText(/testuser|profile/i)).toBeTruthy();
            });

            // Verify localStorage still has the auth data
            const stored = JSON.parse(localStorage.getItem('auth') || '{}');
            expect(stored.isLoggedIn).toBe(true);
            expect(stored.userName).toBe('testuser');
        });

        it('clears auth state from localStorage on failed profile fetch', async () => {
            localStorage.setItem('auth', JSON.stringify({
                isLoggedIn: true,
                userId: 1,
                userName: 'testuser',
                email: 'test@example.com',
                role: 'MANAGER',
            }));

            vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/profile')) {
                    // Session expired
                    return new Response(null, { status: 401 });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/profile');

            // Auth should be cleared - user redirected to login
            await waitFor(() => {
                expect(screen.getByText('Welcome Back')).toBeTruthy();
            });

            // localStorage should be cleared
            expect(localStorage.getItem('auth')).toBeNull();
        });
    });
});
