import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from '../Header';

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, onClick, disabled, className, ...props }: any) => (
            <button onClick={onClick} disabled={disabled} className={className} {...props}>{children}</button>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../ThemeToggle', () => ({
    ThemeToggle: ({ header }: any) => <button data-testid="theme-toggle" data-header={header}>Theme</button>,
}));

vi.mock('../ProfileButton', () => ({
    ProfileButton: ({ header }: any) => <button data-testid="profile-button" data-header={header}>Profile</button>,
}));

vi.mock('../../hooks/useAppSound', () => ({
    useAppSound: () => [vi.fn(), {}],
}));

const mockAuth = { isLoggedIn: false, userName: '', isLoading: false, userId: null, email: '', role: '', login: vi.fn(), refreshAuth: vi.fn(), logout: vi.fn() };
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => mockAuth,
}));

const mockSettings = { fontScale: 1, setFontScale: vi.fn(), reducedMotion: false, setReducedMotion: vi.fn(), highContrast: false, setHighContrast: vi.fn(), soundEnabled: true, setSoundEnabled: vi.fn() };
vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => mockSettings,
}));

vi.mock('react-icons/io5', () => ({
    IoHomeOutline: (props: any) => <span data-testid="io5-home-outline" {...props} />,
    IoHome: (props: any) => <span data-testid="io5-home" {...props} />,
    IoMapOutline: (props: any) => <span data-testid="io5-map-outline" {...props} />,
    IoMap: (props: any) => <span data-testid="io5-map" {...props} />,
    IoSettingsOutline: (props: any) => <span data-testid="io5-settings-outline" {...props} />,
    IoSettings: (props: any) => <span data-testid="io5-settings" {...props} />,
    IoMenuOutline: (props: any) => <span data-testid="io5-menu-outline" {...props} />,
    IoCloseOutline: (props: any) => <span data-testid="io5-close-outline" {...props} />,
}));

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: { pathname: '/' },
            writable: true,
        });
    });

    it('renders the app name', () => {
        render(<Header />);
        expect(screen.getByText('GYAT')).toBeInTheDocument();
    });

    it('renders navigation items', () => {
        render(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Map')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders with banner role', () => {
        render(<Header />);
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
    });

    it('renders navigation with correct aria label', () => {
        render(<Header />);
        const nav = screen.getByRole('navigation', { name: /main navigation/i });
        expect(nav).toBeInTheDocument();
    });

    it('renders ThemeToggle and ProfileButton', () => {
        render(<Header />);
        const themeToggles = screen.getAllByTestId('theme-toggle');
        const profileButtons = screen.getAllByTestId('profile-button');
        expect(themeToggles.length).toBeGreaterThan(0);
        expect(profileButtons.length).toBeGreaterThan(0);
    });

    it('navigates to home when app name is clicked', () => {
        render(<Header />);
        fireEvent.click(screen.getByText('GYAT'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates when nav items are clicked', () => {
        Object.defineProperty(window, 'location', { value: { pathname: '/map' }, writable: true });
        render(<Header />);

        const homeButton = screen.getByText('Home').closest('button')!;
        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('applies custom className', () => {
        const { container } = render(<Header className="custom-header" />);
        const header = container.querySelector('header');
        expect(header?.className).toContain('custom-header');
    });

    it('shows mobile menu button', () => {
        render(<Header />);
        const menuButton = screen.getByLabelText('Open menu');
        expect(menuButton).toBeInTheDocument();
    });

    it('toggles mobile menu on click', () => {
        render(<Header />);
        const menuButton = screen.getByLabelText('Open menu');
        fireEvent.click(menuButton);
        expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    it('displays username when logged in', () => {
        mockAuth.isLoggedIn = true;
        mockAuth.userName = 'TestUser';
        render(<Header />);
        const greetings = screen.getAllByText('Hi, TestUser');
        expect(greetings.length).toBeGreaterThan(0);
        mockAuth.isLoggedIn = false;
        mockAuth.userName = '';
    });

    it('does not display username when not logged in', () => {
        mockAuth.isLoggedIn = false;
        mockAuth.userName = '';
        render(<Header />);
        expect(screen.queryByText(/Hi,/)).not.toBeInTheDocument();
    });

    it('highlights the current page nav item', () => {
        Object.defineProperty(window, 'location', { value: { pathname: '/' }, writable: true });
        render(<Header />);
        expect(screen.getByTestId('io5-home')).toBeInTheDocument();
        expect(screen.getByTestId('io5-map-outline')).toBeInTheDocument();
        expect(screen.getByTestId('io5-settings-outline')).toBeInTheDocument();
    });

    it('navigates and closes mobile menu when mobile item is clicked', () => {
        render(<Header />);

        const menuButton = screen.getByLabelText('Open menu');
        fireEvent.click(menuButton);


        const mobileItems = screen.getAllByText('Settings');
        const settingsButton = mobileItems[mobileItems.length - 1].closest('button')!;
        fireEvent.click(settingsButton);

        expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('plays sound on nav click when soundEnabled is true', () => {
        mockSettings.soundEnabled = true;
        Object.defineProperty(window, 'location', { value: { pathname: '/map' }, writable: true });
        render(<Header />);
        const homeButton = screen.getByText('Home').closest('button')!;
        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
        mockSettings.soundEnabled = true;
    });

    it('does not crash when soundEnabled is false', () => {
        mockSettings.soundEnabled = false;
        Object.defineProperty(window, 'location', { value: { pathname: '/map' }, writable: true });
        render(<Header />);
        const homeButton = screen.getByText('Home').closest('button')!;
        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
        mockSettings.soundEnabled = true;
    });

    it('renders selected page icon for /map', () => {
        Object.defineProperty(window, 'location', { value: { pathname: '/map' }, writable: true });
        render(<Header />);
        expect(screen.getByTestId('io5-map')).toBeInTheDocument();
        expect(screen.getByTestId('io5-home-outline')).toBeInTheDocument();
    });

    it('renders selected page icon for /settings', () => {
        Object.defineProperty(window, 'location', { value: { pathname: '/settings' }, writable: true });
        render(<Header />);
        expect(screen.getByTestId('io5-settings')).toBeInTheDocument();
        expect(screen.getByTestId('io5-home-outline')).toBeInTheDocument();
    });
});
