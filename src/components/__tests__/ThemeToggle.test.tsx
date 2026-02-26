import { render, screen } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { describe, it, expect, vi } from 'vitest';

vi.mock('use-sound', () => ({
    default: () => [vi.fn(), { stop: vi.fn(), pause: vi.fn() }],
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

vi.mock('../../context/ThemeContext', () => ({
    useTheme: vi.fn(),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ThemeToggle', () => {
    it('renders a button', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('shows moon icon when theme is light', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const moonIcon = screen.getByTestId('io5-moon-outline');
        expect(moonIcon).toBeInTheDocument();
    });

    it('shows sun icon when theme is dark', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'dark',
            toggleTheme: vi.fn(),
        });
        render(<ThemeToggle />);
        const sunIcon = screen.getByTestId('io5-sunny-outline');
        expect(sunIcon).toBeInTheDocument();
    });

    it('calls toggleTheme when button is clicked', async () => {
        const toggleThemeMock = vi.fn();
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: toggleThemeMock,
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        button.click();

        expect(toggleThemeMock).toHaveBeenCalled();
    });

    it('has correct aria-label for accessibility', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
    });

    it('has z-50 position styles', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button.parentElement).toHaveClass('z-50');
    });

    // ---- header variant tests ----
    it('renders header variant with header=true', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });
        render(<ThemeToggle header={true} />);
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
    });

    it('calls toggleTheme in header variant when clicked', () => {
        const toggleThemeMock = vi.fn();
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: toggleThemeMock,
        });
        render(<ThemeToggle header={true} />);
        screen.getByRole('button').click();
        expect(toggleThemeMock).toHaveBeenCalled();
    });

    it('shows moon icon in header variant for light theme', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });
        render(<ThemeToggle header={true} />);
        expect(screen.getByTestId('io5-moon-outline')).toBeInTheDocument();
    });

    it('shows sun icon in header variant for dark theme', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'dark',
            toggleTheme: vi.fn(),
        });
        render(<ThemeToggle header={true} />);
        expect(screen.getByTestId('io5-sunny-outline')).toBeInTheDocument();
    });
});
