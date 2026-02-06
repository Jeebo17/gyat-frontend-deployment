import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Tile from '../Tile';
import { createMockTile } from '../../test/mockData';

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

describe('Tile', () => {
    it('renders equipment title', () => {
        const mockTile = createMockTile();

        render(
            <Tile {...mockTile} />
        );

        expect(screen.getByText('Equipment Title #1')).toBeInTheDocument();
    });

    it('renders and displays title', () => {
        const mockTile = createMockTile();
        render(
            <Tile {...mockTile} />
        );

        expect(screen.getByText('Equipment Title #1')).toBeInTheDocument();
    })

    it('applies colour style', () => {
        const mockTile = createMockTile({ colour: 'red' });
        const { container } = render(
            <Tile {...mockTile} />
        );

        const tile = container.firstChild;
        expect(tile).toBeTruthy();
    })

    it('calls onClick when tile is clicked and in non-edit mode', () => {
        const mockOnClick = vi.fn();
        const mockTile = createMockTile({ onClick: mockOnClick, editMode: false });
        render(
            <Tile {...mockTile} /> 
        );

        const tileElement = screen.getByText('Equipment Title #1').parentElement;
        expect(tileElement).toBeTruthy();

        tileElement!.click();
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('does not call onClick when tile is clicked and in edit mode', () => {
        const mockOnClick = vi.fn();
        const mockTile = createMockTile({ onClick: mockOnClick, editMode: true });
        render(
            <Tile {...mockTile} />
        );

        const tileElement = screen.getByText('Equipment Title #1').parentElement;
        expect(tileElement).toBeTruthy();

        tileElement!.click();
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('renders hover effect when canHover is true and not in edit mode', () => {
        const mockTile = createMockTile({ canHover: true, editMode: false });
        const { container } = render(
            <Tile {...mockTile} />
        );

        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).toContain('hover:brightness-110');
    })

    it('does not render hover effect when canHover is false', () => {
        const mockTile = createMockTile({ canHover: false, editMode: false });
        const { container } = render(
            <Tile {...mockTile} />
        );
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).not.toContain('hover:brightness-110');
    })

    it('renders move cursor in edit mode', () => {
        const mockTile = createMockTile({ editMode: true });
        const { container } = render(
            <Tile {...mockTile} />
        );

        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).not.toContain('hover:cursor-move');
    });

    it('renders without onClick provider if not provided', () => {
        const mockTile = createMockTile({ editMode: true });
        render(
            <Tile {...mockTile} />
        );

        expect(screen.getByText('Equipment Title #1')).toBeInTheDocument();
    })

    it('has correct aria-label for accessibility', () => {
        const mockTile = createMockTile();
        const { container } = render(
            <Tile {...mockTile} />
        );
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv).toHaveAttribute('aria-label', 'Equipment Title #1');
    });

});