import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => ({
        reducedMotion: false,
        soundEnabled: true,
        fontScale: 1,
        setFontScale: vi.fn(),
        setReducedMotion: vi.fn(),
        highContrast: false,
        setHighContrast: vi.fn(),
        setSoundEnabled: vi.fn(),
    }),
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        isLoggedIn: true,
        isLoading: false,
        userName: 'testUser',
        userId: 1,
        email: 'test@test.com',
        role: 'manager',
        login: vi.fn(),
        logout: vi.fn(),
        refreshAuth: vi.fn(),
    }),
}));

vi.mock('use-sound', () => ({
    default: () => [vi.fn(), { stop: vi.fn() }],
}));

vi.mock('../../components/Header', () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../backgrounds/Silk', () => ({
    default: () => <div data-testid="silk">Silk</div>,
}));

vi.mock('../../components/InteractiveMap', () => ({
    default: () => <div data-testid="interactive-map">Map</div>,
}));

vi.mock('../../services/tileService', () => ({
    getPreviewTiles: () => [],
}));

const mockNavigate = vi.fn();

import HomePage from '../../pages/HomePage';

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the GYAT title', () => {
        render(<HomePage />);
        expect(screen.getByText('GYAT')).toBeTruthy();
    });

    it('renders the subtitle', () => {
        render(<HomePage />);
        expect(screen.getByText('The Gym App & Tracker')).toBeTruthy();
    });

    it('renders the description text', () => {
        render(<HomePage />);
        expect(screen.getByText(/Navigate your gym smarter/)).toBeTruthy();
    });

    it('renders the Search for a gym button', () => {
        render(<HomePage />);
        expect(screen.getByText('Search for a gym')).toBeTruthy();
    });

    it('navigates to /map/search when button is clicked', () => {
        render(<HomePage />);
        screen.getByText('Search for a gym').click();
        expect(mockNavigate).toHaveBeenCalledWith('/map/search');
    });

    it('renders the header component', () => {
        render(<HomePage />);
        expect(screen.getByTestId('header')).toBeTruthy();
    });

    it('renders the interactive map preview', () => {
        render(<HomePage />);
        expect(screen.getByTestId('interactive-map')).toBeTruthy();
    });

    it('renders the Silk background', () => {
        render(<HomePage />);
        expect(screen.getByTestId('silk')).toBeTruthy();
    });
});
