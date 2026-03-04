import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

function TestConsumer() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
}

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark');
        // Default matchMedia to prefer light
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    });

    it('provides light theme by default', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme').textContent).toBe('light');
    });

    it('toggles from light to dark', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Toggle'));
        });
        expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('toggles from dark back to light', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Toggle'));
        });
        act(() => {
            fireEvent.click(screen.getByText('Toggle'));
        });
        expect(screen.getByTestId('theme').textContent).toBe('light');
    });

    it('persists theme to localStorage', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Toggle'));
        });
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('restores theme from localStorage', () => {
        localStorage.setItem('theme', 'dark');
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('adds dark class to document element for dark theme', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Toggle'));
        });
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class when switching to light', () => {
        localStorage.setItem('theme', 'dark');
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Toggle'));
        });
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('respects prefers-color-scheme dark media query', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }),
        });

        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('throws when useTheme is used outside provider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<TestConsumer />)).toThrow(
            'useTheme must be used within ThemeProvider'
        );
        consoleError.mockRestore();
    });
});
