/**
 * Integration tests for route navigation and auth guards.
 * Verifies that protected routes redirect unauthenticated users,
 * and that navigation between pages works correctly through the real router.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('Route Navigation Integration', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    describe('Public Routes', () => {
        it('renders home page at /', async () => {
            vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/profile')) {
                    return new Response(null, { status: 401 });
                }
                // Mock preview tiles for HomePage
                if (urlStr.includes('/api/')) {
                    return new Response(JSON.stringify([]), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/');

            await waitFor(() => {
                expect(screen.getByText(/Search for a gym/i)).toBeTruthy();
            });
        });

        it('renders 404 page for unknown routes', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/nonexistent/route');

            await waitFor(() => {
                expect(screen.getByText(/404|not found|page not found/i)).toBeTruthy();
            });
        });

        it('renders settings page at /settings', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/settings');

            await waitFor(() => {
                expect(screen.getByText('Accessibility Settings')).toBeTruthy();
            });
        });

        it('renders login page at /login', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/login');

            await waitFor(() => {
                expect(screen.getByText('Welcome Back')).toBeTruthy();
            });
        });

        it('renders signup page at /signup', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/signup');

            await waitFor(() => {
                expect(screen.getByText('Create Account')).toBeTruthy();
            });
        });
    });

    describe('Auth Guards', () => {
        it('ProfilePage redirects unauthenticated users to login', async () => {
            vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/profile')) {
                    return new Response(null, { status: 401 });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/profile');

            // Should redirect to login page
            await waitFor(() => {
                expect(screen.getByText('Welcome Back')).toBeTruthy();
            });
        });

        it('EditMapPage redirects unauthenticated users to login', async () => {
            vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/profile')) {
                    return new Response(null, { status: 401 });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/map/edit/1');

            // Should redirect to login page
            await waitFor(() => {
                expect(screen.getByText('Welcome Back')).toBeTruthy();
            });
        });

        it('ProfilePage shows content for authenticated users', async () => {
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

            // Should show profile content
            await waitFor(() => {
                expect(screen.getByText(/testuser|profile/i)).toBeTruthy();
            });
        });
    });

    describe('Cross-page navigation consistency', () => {
        it('header renders on login page with navigation items', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/login');

            await waitFor(() => {
                expect(screen.getByText('Welcome Back')).toBeTruthy();
            });

            // Header should be visible with navigation
            expect(screen.getByText('Home')).toBeTruthy();
        });

        it('header renders on signup page with navigation items', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/signup');

            await waitFor(() => {
                expect(screen.getByText('Create Account')).toBeTruthy();
            });

            expect(screen.getByText('Home')).toBeTruthy();
        });
    });
});
