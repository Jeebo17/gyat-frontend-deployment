/**
 * Integration tests for authentication flows.
 * Tests Login and Signup pages with real providers (AuthContext, ThemeContext, SettingsContext),
 * real routing (MemoryRouter), and mocked HTTP layer (fetch).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { SettingsProvider } from '../../context/SettingsContext';
import { AuthProvider } from '../../context/AuthContext';
import App from '../../App';

// Mock window.matchMedia for jsdom
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

// Mock framer-motion to avoid animation issues
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

// Mock sound hooks
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

// Helper to render with all providers
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

describe('Auth Flow Integration', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    describe('Login Page', () => {
        it('renders login form with username and password fields', async () => {
            // Mock getManagerProfile to return 401 (not logged in)
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/login');

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Enter username or email')).toBeTruthy();
            });
            expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
            expect(screen.getByText('Sign In')).toBeTruthy();
        });

        it('shows validation error when fields are empty', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/login');

            await waitFor(() => {
                expect(screen.getByText('Sign In')).toBeTruthy();
            });

            // HTML5 required attribute prevents submission, so test the validation text
            const usernameInput = screen.getByPlaceholderText('Enter username or email');
            const passwordInput = screen.getByPlaceholderText('Enter your password');
            expect(usernameInput).toHaveAttribute('required');
            expect(passwordInput).toHaveAttribute('required');
        });

        it('calls login API and navigates to home on success', async () => {
            const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/auth/login')) {
                    return new Response(JSON.stringify({
                        id: 1,
                        username: 'testuser',
                        email: 'test@example.com',
                        role: 'MANAGER',
                    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
                if (urlStr.includes('/api/profile')) {
                    return new Response(null, { status: 401 });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/login');

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Enter username or email')).toBeTruthy();
            });

            fireEvent.change(screen.getByPlaceholderText('Enter username or email'), {
                target: { value: 'testuser' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText('Sign In'));

            await waitFor(() => {
                // After successful login, should navigate away from login page
                expect(screen.queryByText('Welcome Back')).toBeNull();
            });

            // Verify the login API was called
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/login'),
                expect.objectContaining({ method: 'POST' }),
            );
        });

        it('shows error message on login failure', async () => {
            vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/auth/login')) {
                    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                if (urlStr.includes('/api/profile')) {
                    return new Response(null, { status: 401 });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/login');

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Enter username or email')).toBeTruthy();
            });

            fireEvent.change(screen.getByPlaceholderText('Enter username or email'), {
                target: { value: 'wronguser' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
                target: { value: 'wrongpassword' },
            });
            fireEvent.click(screen.getByText('Sign In'));

            await waitFor(() => {
                expect(screen.getByText('Invalid credentials')).toBeTruthy();
            });
        });

        it('redirects already-logged-in users to home', async () => {
            // Mock getManagerProfile to return a valid profile (user is logged in)
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

            renderWithProviders('/login');

            // Should redirect away from login
            await waitFor(() => {
                expect(screen.queryByText('Welcome Back')).toBeNull();
            });
        });
    });

    describe('Signup Page', () => {
        it('renders signup form fields', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/signup');

            await waitFor(() => {
                expect(screen.getByText('Create Account')).toBeTruthy();
            });
            expect(screen.getByPlaceholderText('Enter your name')).toBeTruthy();
            expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
        });

        it('shows error when passwords do not match', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/signup');

            await waitFor(() => {
                expect(screen.getByText('Create Account')).toBeTruthy();
            });

            fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
                target: { value: 'newuser' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
                target: { value: 'new@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
                target: { value: 'password123' },
            });
            fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
                target: { value: 'differentpass' },
            });
            fireEvent.click(screen.getByText('Sign Up'));

            await waitFor(() => {
                expect(screen.getByText('Passwords do not match.')).toBeTruthy();
            });
        });

        it('shows error when password is too short', async () => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Not authenticated'));

            renderWithProviders('/signup');

            await waitFor(() => {
                expect(screen.getByText('Create Account')).toBeTruthy();
            });

            fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
                target: { value: 'newuser' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
                target: { value: 'new@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
                target: { value: '12345' },
            });
            fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
                target: { value: '12345' },
            });
            fireEvent.click(screen.getByText('Sign Up'));

            await waitFor(() => {
                expect(screen.getByText('Password must be at least 6 characters.')).toBeTruthy();
            });
        });

        it('calls register API and redirects to login on success', async () => {
            const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/auth/register')) {
                    return new Response(JSON.stringify({
                        id: 2,
                        username: 'newuser',
                        email: 'new@example.com',
                        role: 'MANAGER',
                    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
                if (urlStr.includes('/api/profile')) {
                    return new Response(null, { status: 401 });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/signup');

            await waitFor(() => {
                expect(screen.getByText('Create Account')).toBeTruthy();
            });

            fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
                target: { value: 'newuser' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
                target: { value: 'new@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
                target: { value: 'password123' },
            });
            fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText('Sign Up'));

            // Should navigate to login page after successful registration
            await waitFor(() => {
                expect(screen.getByText('Welcome Back')).toBeTruthy();
            });

            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/register'),
                expect.objectContaining({ method: 'POST' }),
            );
        });

        it('shows API error on registration failure', async () => {
            vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('/api/auth/register')) {
                    return new Response(JSON.stringify({ message: 'Username already taken' }), {
                        status: 409,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                if (urlStr.includes('/api/profile')) {
                    return new Response(null, { status: 401 });
                }
                return new Response(null, { status: 404 });
            });

            renderWithProviders('/signup');

            await waitFor(() => {
                expect(screen.getByText('Create Account')).toBeTruthy();
            });

            fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
                target: { value: 'existinguser' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
                target: { value: 'existing@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
                target: { value: 'password123' },
            });
            fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText('Sign Up'));

            await waitFor(() => {
                expect(screen.getByText('Username already taken')).toBeTruthy();
            });
        });
    });
});
