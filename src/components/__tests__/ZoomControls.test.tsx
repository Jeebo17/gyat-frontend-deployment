import { render, screen } from '@testing-library/react';
import ZoomControls from '../ZoomControls';
import { describe, it, expect, vi } from 'vitest';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: () => ({
            matches: false, 
            addListener: vi.fn(),
            removeListener: vi.fn(),
        })
    });
});

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
    ThemeProvider: ({ children }: any) => <div>{children}</div>
}));

describe('ZoomControls', () => {
    it ('renders zoom in, zoom out, and reset buttons', () => {
        render(
            <ZoomControls 
                scale={1}
                onZoomIn={() => {}}
                onZoomOut={() => {}}
                onReset={() => {}}
            />
        );  
        const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
        const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
        const resetButton = screen.getByRole('button', { name: /reset zoom/i });
        expect(zoomInButton).toBeInTheDocument();
        expect(zoomOutButton).toBeInTheDocument();
        expect(resetButton).toBeInTheDocument();
    });

    it('calls onZoomIn when zoom in button is clicked', () => {
        const mockOnZoomIn = vi.fn();
        render(
            <ZoomControls
                scale={1}
                onZoomIn={mockOnZoomIn}
                onZoomOut={() => {}}
                onReset={() => {}}
            />
        );

        const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
        zoomInButton.click();
        expect(mockOnZoomIn).toHaveBeenCalled();
    });

    it('calls onZoomOut when zoom out button is clicked', () => {
        const mockOnZoomOut = vi.fn();
        render(
            <ZoomControls
                scale={1}
                onZoomIn={() => {}}
                onZoomOut={mockOnZoomOut}
                onReset={() => {}}
            />
        );

        const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
        zoomOutButton.click();
        expect(mockOnZoomOut).toHaveBeenCalled();
    });

    it('calls onReset when reset button is clicked', () => {
        const mockOnReset = vi.fn();
        render(
            <ZoomControls
                scale={1}
                onZoomIn={() => {}}
                onZoomOut={() => {}}
                onReset={mockOnReset}
            />
        );

        const resetButton = screen.getByRole('button', { name: /reset zoom/i });
        resetButton.click();
        expect(mockOnReset).toHaveBeenCalled();
    });

    it('applies dark theme classes', () => {
        render(
            <ZoomControls scale={1} onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}} />
        );
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => expect(button).toHaveClass('text-black'));
    });

    it('has correct aria-label for accessibility', () => {
        render(
            <ZoomControls scale={1} onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}} />
        );
        const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
        const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
        const resetButton = screen.getByRole('button', { name: /reset zoom/i });
        expect(zoomInButton).toHaveAttribute('aria-label', 'Zoom in');
        expect(zoomOutButton).toHaveAttribute('aria-label', 'Zoom out');
        expect(resetButton).toHaveAttribute('aria-label', 'Reset zoom');
    });
});