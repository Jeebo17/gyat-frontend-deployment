import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/useAppSound', () => ({
    useAppSound: () => [vi.fn(), {}],
}));

vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => ({
        fontScale: 1, setFontScale: vi.fn(),
        reducedMotion: false, setReducedMotion: vi.fn(),
        highContrast: false, setHighContrast: vi.fn(),
        soundEnabled: true, setSoundEnabled: vi.fn(),
    }),
    SettingsProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        isLoggedIn: false, isLoading: false, userId: null, userName: '', email: '', role: '',
        login: vi.fn(), refreshAuth: vi.fn(), logout: vi.fn(),
    }),
    AuthProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
    ThemeProvider: ({ children }: any) => <>{children}</>,
}));

// Mock all page components to simple divs
vi.mock('../../pages', () => ({
    HomePage: () => <div data-testid="home-page">Home</div>,
    Map: () => <div data-testid="map-page">Map</div>,
    EditMapPage: () => <div data-testid="edit-map-page">EditMap</div>,
    SettingsPage: () => <div data-testid="settings-page">Settings</div>,
    LoginPage: () => <div data-testid="login-page">Login</div>,
    SignUpPage: () => <div data-testid="signup-page">SignUp</div>,
    NotFoundPage: () => <div data-testid="not-found-page">NotFound</div>,
    ProfilePage: () => <div data-testid="profile-page">Profile</div>,
}));

describe('App', () => {
    it('renders HomePage at /', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders MapPage at /map', () => {
        render(
            <MemoryRouter initialEntries={['/map']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('map-page')).toBeInTheDocument();
    });

    it('renders EditMapPage at /map/edit', () => {
        render(
            <MemoryRouter initialEntries={['/map/edit']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('edit-map-page')).toBeInTheDocument();
    });

    it('renders SettingsPage at /settings', () => {
        render(
            <MemoryRouter initialEntries={['/settings']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    });

    it('renders LoginPage at /login', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('renders SignUpPage at /signup', () => {
        render(
            <MemoryRouter initialEntries={['/signup']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('signup-page')).toBeInTheDocument();
    });

    it('renders ProfilePage at /profile', () => {
        render(
            <MemoryRouter initialEntries={['/profile']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    it('renders NotFoundPage for unknown routes', () => {
        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
});
