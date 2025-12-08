import { render, screen } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { describe, it, expect, vi } from 'vitest';

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
        const moonIcon = screen.getByTestId('lucide-moon');
        expect(moonIcon).toBeInTheDocument();
    });

    it('shows sun icon when theme is dark', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'dark',
            toggleTheme: vi.fn(),
        });
        render(<ThemeToggle />);
        const sunIcon = screen.getByTestId('lucide-sun');
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

    it('has correct aria-label', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
    });

    it('has fixed position styles', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button.parentElement).toHaveClass('fixed top-4 right-4 z-50');
    });
});
