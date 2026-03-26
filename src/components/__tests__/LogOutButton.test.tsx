import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LogoutButton from '../LogOutButton';

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, style, ...props }: any) => <div style={style} {...props}>{children}</div>,
    },
}));

vi.mock('../../hooks/useAppSound', () => ({
    useAppSound: () => [vi.fn(), {}],
}));

const mockAuth = {
    isLoggedIn: true,
    isLoading: false,
    logout: vi.fn(),
    userId: 1,
    userName: 'Test',
    email: 'test@test.com',
    role: 'admin',
    login: vi.fn(),
    refreshAuth: vi.fn(),
};

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => mockAuth,
}));

vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => ({
        soundEnabled: true,
        fontScale: 1,
        setFontScale: vi.fn(),
        reducedMotion: false,
        setReducedMotion: vi.fn(),
        highContrast: false,
        setHighContrast: vi.fn(),
        setSoundEnabled: vi.fn(),
    }),
}));

vi.mock('react-icons/io5', () => ({
    IoLogOutOutline: (props: any) => <span data-testid="io5-log-out-outline" {...props} />,
}));

describe('LogoutButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.isLoggedIn = true;
        mockAuth.isLoading = false;
    });

    it('renders logout button when logged in', () => {
        render(<LogoutButton />);
        const button = screen.getByRole('button', { name: /log out/i });
        expect(button).toBeInTheDocument();
    });

    it('renders logout icon', () => {
        render(<LogoutButton />);
        expect(screen.getByTestId('io5-log-out-outline')).toBeInTheDocument();
    });

    it('calls logout and navigates to /login on click', () => {
        render(<LogoutButton />);
        const button = screen.getByRole('button', { name: /log out/i });
        fireEvent.click(button);
        expect(mockAuth.logout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('returns null when loading', () => {
        mockAuth.isLoading = true;
        const { container } = render(<LogoutButton />);
        expect(container.innerHTML).toBe('');
    });

    it('returns null when not logged in', () => {
        mockAuth.isLoggedIn = false;
        const { container } = render(<LogoutButton />);
        expect(container.innerHTML).toBe('');
    });

    it('renders header variant when header prop is true', () => {
        render(<LogoutButton header={true} />);
        const button = screen.getByRole('button', { name: /log out/i });
        expect(button.className).toContain('text-text-primary');
        expect(button.className).not.toContain('rounded-lg');
    });

    it('renders default variant when header prop is false', () => {
        render(<LogoutButton />);
        const button = screen.getByRole('button', { name: /log out/i });
        expect(button.className).toContain('rounded-lg');
    });

    it('has correct aria-label', () => {
        render(<LogoutButton />);
        const button = screen.getByRole('button', { name: /log out/i });
        expect(button).toHaveAttribute('aria-label', 'Log out');
    });
});
