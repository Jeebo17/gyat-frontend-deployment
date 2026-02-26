import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsPage from '../SettingsPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, onClick, className, ...props }: any) => (
            <button onClick={onClick} className={className} {...props}>{children}</button>
        ),
    },
}));

vi.mock('../../components/Header', () => ({
    default: () => <header data-testid="header">Header</header>,
}));

vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../hooks/useAppSound', () => ({
    useAppSound: () => [vi.fn(), {}],
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ isLoggedIn: false, userName: '', isLoading: false, userId: null, email: '', role: '', login: vi.fn(), refreshAuth: vi.fn(), logout: vi.fn() }),
}));

const mockSetFontScale = vi.fn();
const mockSetSoundEnabled = vi.fn();
const mockSetReducedMotion = vi.fn();
const mockSetHighContrast = vi.fn();

vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => ({
        fontScale: 1,
        setFontScale: mockSetFontScale,
        reducedMotion: false,
        setReducedMotion: mockSetReducedMotion,
        highContrast: false,
        setHighContrast: mockSetHighContrast,
        soundEnabled: true,
        setSoundEnabled: mockSetSoundEnabled,
    }),
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

describe('SettingsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the accessibility settings heading', () => {
        render(<SettingsPage />);
        expect(screen.getByText('Accessibility Settings')).toBeInTheDocument();
    });

    it('renders the header', () => {
        render(<SettingsPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders the font size slider', () => {
        render(<SettingsPage />);
        expect(screen.getByText(/Font Size:/)).toBeInTheDocument();
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
    });

    it('calls setFontScale when slider changes', () => {
        render(<SettingsPage />);
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '1.2' } });
        expect(mockSetFontScale).toHaveBeenCalledWith(1.2);
    });

    it('renders sound effects checkbox', () => {
        render(<SettingsPage />);
        expect(screen.getByText('Enable Sound Effects')).toBeInTheDocument();
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThanOrEqual(1);
    });

    it('calls setSoundEnabled when sound checkbox changes', () => {
        render(<SettingsPage />);
        const soundCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(soundCheckbox);
        expect(mockSetSoundEnabled).toHaveBeenCalled();
    });

    it('renders reduced motion checkbox', () => {
        render(<SettingsPage />);
        expect(screen.getByText('Reduced Animations')).toBeInTheDocument();
    });

    it('renders high contrast checkbox', () => {
        render(<SettingsPage />);
        expect(screen.getByText('High Contrast Mode')).toBeInTheDocument();
    });

    it('renders a back button', () => {
        render(<SettingsPage />);
        const backButton = screen.getByText('Back');
        expect(backButton).toBeInTheDocument();
    });

    it('navigates back when back button is clicked', () => {
        render(<SettingsPage />);
        fireEvent.click(screen.getByText('Back'));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('displays the current font scale percentage', () => {
        render(<SettingsPage />);
        expect(screen.getByText(/Font Size: 100%/)).toBeInTheDocument();
    });

    // ---- New tests for checkbox handlers (reduced motion & high contrast) ----

    it('calls setReducedMotion when reduced animations checkbox changes', () => {
        render(<SettingsPage />);
        const checkboxes = screen.getAllByRole('checkbox');
        // Order: Sound (0), Reduced Motion (1), High Contrast (2)
        const reducedMotionCheckbox = checkboxes[1];
        fireEvent.click(reducedMotionCheckbox);
        expect(mockSetReducedMotion).toHaveBeenCalled();
    });

    it('calls setHighContrast when high contrast checkbox changes', () => {
        render(<SettingsPage />);
        const checkboxes = screen.getAllByRole('checkbox');
        const highContrastCheckbox = checkboxes[2];
        fireEvent.click(highContrastCheckbox);
        expect(mockSetHighContrast).toHaveBeenCalled();
    });
});
