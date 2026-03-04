import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileButton } from '../ProfileButton';

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
    isLoggedIn: false,
    isLoading: false,
    userId: null,
    userName: '',
    email: '',
    role: '',
    login: vi.fn(),
    refreshAuth: vi.fn(),
    logout: vi.fn(),
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
    IoPersonCircleOutline: (props: any) => <span data-testid="io5-person-circle-outline" {...props} />,
}));

describe('ProfileButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.isLoggedIn = false;
    });

    it('renders the profile button', () => {
        render(<ProfileButton />);
        const button = screen.getByRole('button', { name: /profile/i });
        expect(button).toBeInTheDocument();
    });

    it('renders the profile icon', () => {
        render(<ProfileButton />);
        expect(screen.getByTestId('io5-person-circle-outline')).toBeInTheDocument();
    });

    it('navigates to /login when not logged in', () => {
        mockAuth.isLoggedIn = false;
        render(<ProfileButton />);
        const button = screen.getByRole('button', { name: /profile/i });
        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('navigates to /profile when logged in', () => {
        mockAuth.isLoggedIn = true;
        render(<ProfileButton />);
        const button = screen.getByRole('button', { name: /profile/i });
        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('renders header variant when header prop is true', () => {
        render(<ProfileButton header={true} />);
        const button = screen.getByRole('button', { name: /profile/i });
        expect(button.className).toContain('text-text-primary');
        expect(button.className).not.toContain('rounded-lg');
    });

    it('renders default variant when header prop is false', () => {
        render(<ProfileButton />);
        const button = screen.getByRole('button', { name: /profile/i });
        expect(button.className).toContain('rounded-lg');
    });

    it('has correct aria-label', () => {
        render(<ProfileButton />);
        const button = screen.getByRole('button', { name: /profile/i });
        expect(button).toHaveAttribute('aria-label', 'Profile');
    });
});
