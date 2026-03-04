import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePage from '../ProfilePage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../components/Header', () => ({
    default: () => <header data-testid="header">Header</header>,
}));

vi.mock('../../components/LogOutButton', () => ({
    LogoutButton: () => <button data-testid="logout-button">Logout</button>,
}));

vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../hooks/useAppSound', () => ({
    useAppSound: () => [vi.fn(), {}],
}));

const mockAuth = {
    isLoggedIn: true,
    isLoading: false,
    userId: 1,
    userName: 'Test',
    email: 'test@test.com',
    role: 'admin',
    login: vi.fn(),
    refreshAuth: vi.fn(),
    logout: vi.fn(),
};

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => mockAuth,
}));

vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => ({
        fontScale: 1, setFontScale: vi.fn(),
        reducedMotion: false, setReducedMotion: vi.fn(),
        highContrast: false, setHighContrast: vi.fn(),
        soundEnabled: true, setSoundEnabled: vi.fn(),
    }),
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.isLoggedIn = true;
        mockAuth.isLoading = false;
    });

    it('renders the header', () => {
        render(<ProfilePage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders the logout button when logged in', () => {
        render(<ProfilePage />);
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('redirects to /login when not logged in', () => {
        mockAuth.isLoggedIn = false;
        render(<ProfilePage />);
        expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('returns null while loading', () => {
        mockAuth.isLoading = true;
        const { container } = render(<ProfilePage />);
        expect(container.innerHTML).toBe('');
    });
});
