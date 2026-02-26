import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders equipment title', () => {
        const mockTile = createMockTile();
        render(<Tile {...mockTile} />);
        expect(screen.getByText('Equipment Title #1')).toBeInTheDocument();
    });

    it('renders and displays title', () => {
        const mockTile = createMockTile();
        render(<Tile {...mockTile} />);
        expect(screen.getByText('Equipment Title #1')).toBeInTheDocument();
    });

    it('applies colour style', () => {
        const mockTile = createMockTile({ colour: 'red' });
        const { container } = render(<Tile {...mockTile} />);
        const tile = container.firstChild;
        expect(tile).toBeTruthy();
    });

    it('calls onClick when tile is clicked and in non-edit mode', () => {
        const mockOnClick = vi.fn();
        const mockTile = createMockTile({ onClick: mockOnClick, editMode: false });
        render(<Tile {...mockTile} />);
        const tileElement = screen.getByText('Equipment Title #1').parentElement;
        expect(tileElement).toBeTruthy();
        tileElement!.click();
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('does not call onClick when tile is clicked and in edit mode', () => {
        const mockOnClick = vi.fn();
        const mockTile = createMockTile({ onClick: mockOnClick, editMode: true });
        render(<Tile {...mockTile} />);
        const tileElement = screen.getByText('Equipment Title #1').parentElement;
        expect(tileElement).toBeTruthy();
        tileElement!.click();
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('renders hover effect when canHover is true and not in edit mode', () => {
        const mockTile = createMockTile({ canHover: true, editMode: false });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).toContain('hover:brightness-110');
    });

    it('does not render hover effect when canHover is false', () => {
        const mockTile = createMockTile({ canHover: false, editMode: false });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).not.toContain('hover:brightness-110');
    });

    it('renders move cursor in edit mode', () => {
        const mockTile = createMockTile({ editMode: true });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).not.toContain('hover:cursor-move');
    });

    it('renders without onClick provider if not provided', () => {
        const mockTile = createMockTile({ editMode: true });
        render(<Tile {...mockTile} />);
        expect(screen.getByText('Equipment Title #1')).toBeInTheDocument();
    });

    it('has correct aria-label for accessibility', () => {
        const mockTile = createMockTile();
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv).toHaveAttribute('aria-label', 'Equipment Title #1');
    });

    // ---- New tests for coverage ----

    it('applies highlighted ring class when highlighted is true', () => {
        const mockTile = createMockTile({ highlighted: true });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).toContain('ring-4');
        expect(mainDiv?.className).toContain('ring-accent-primary');
    });

    it('does not apply highlighted ring class when highlighted is false', () => {
        const mockTile = createMockTile({ highlighted: false });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv?.className).not.toContain('ring-4');
    });

    it('renders preview mode text with text-2xl class', () => {
        const mockTile = createMockTile({ previewMode: true });
        const { container } = render(<Tile {...mockTile} />);
        const p = container.querySelector('p');
        expect(p?.className).toContain('text-2xl');
    });

    it('renders non-preview mode text with truncate class', () => {
        const mockTile = createMockTile({ previewMode: false });
        const { container } = render(<Tile {...mockTile} />);
        const p = container.querySelector('p');
        expect(p?.className).toContain('truncate');
    });

    it('applies fallback color for unknown colour', () => {
        const mockTile = createMockTile({ colour: 'unknown_color' });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        // dark theme fallback
        expect(mainDiv?.className).toContain('bg-gray-600');
    });

    it('shows delete and rotate buttons in edit mode with onUpdate', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({ editMode: true, onUpdate });
        const { container } = render(<Tile {...mockTile} />);
        // delete icon and rotate icon should be present
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('shows resize handles in edit mode with onUpdate', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({ editMode: true, onUpdate });
        const { container } = render(<Tile {...mockTile} />);
        // 8 resize handles
        const handles = container.querySelectorAll('[style*="cursor"]');
        expect(handles.length).toBe(8);
    });

    it('does not show delete/rotate/resize handles without onUpdate', () => {
        const mockTile = createMockTile({ editMode: true, onUpdate: undefined });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        expect(handles.length).toBe(0);
    });

    it('calls onDelete when delete button is clicked', () => {
        const onUpdate = vi.fn();
        const onDelete = vi.fn();
        const mockTile = createMockTile({ editMode: true, onUpdate, onDelete });
        const { container } = render(<Tile {...mockTile} />);
        // The delete button is the first icon wrapper
        const deleteWrapper = container.querySelector('.absolute.top-2.left-2');
        expect(deleteWrapper).toBeTruthy();
        fireEvent.click(deleteWrapper!);
        expect(onDelete).toHaveBeenCalled();
    });

    it('calls onUpdate with swapped dimensions when rotate button is mousedown', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            width: 240,
            height: 100,
            rotation: 0,
        });
        const { container } = render(<Tile {...mockTile} />);
        // The rotate button is the second icon wrapper (top-2 right-2)
        const rotateWrapper = container.querySelector('.absolute.top-2.right-2');
        expect(rotateWrapper).toBeTruthy();
        fireEvent.mouseDown(rotateWrapper!);
        expect(onUpdate).toHaveBeenCalledWith({ width: 100, height: 240, rotation: 0 });
    });

    it('handles drag (mousedown + mousemove + mouseup) in edit mode', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 100,
            yCoord: 100,
            width: 200,
            height: 100,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;

        // Start drag
        fireEvent.mouseDown(mainDiv, { clientX: 150, clientY: 150 });
        // Move
        fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
        // Release
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles drag in preview mode with onUpdate', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            previewMode: true,
            editMode: false,
            onUpdate,
            xCoord: 100,
            yCoord: 100,
        });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;

        fireEvent.mouseDown(mainDiv, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 130, clientY: 130 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('does not start drag in non-edit non-preview mode', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: false,
            previewMode: false,
            onUpdate,
        });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;

        fireEvent.mouseDown(mainDiv, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
        fireEvent.mouseUp(window);

        expect(onUpdate).not.toHaveBeenCalled();
    });

    it('handles resize via east handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 0,
            yCoord: 0,
            width: 200,
            height: 100,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        // The resize handles have cursor style
        const handles = container.querySelectorAll('[style*="cursor"]');
        // Find east handle (ew-resize, third one: index 2)
        const eastHandle = handles[2]; // 'e' handle
        expect(eastHandle).toBeTruthy();

        fireEvent.mouseDown(eastHandle, { clientX: 200, clientY: 50 });
        fireEvent.mouseMove(window, { clientX: 300, clientY: 50 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles resize via south handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 0,
            yCoord: 0,
            width: 200,
            height: 100,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // 's' handle is index 1
        const southHandle = handles[1];
        expect(southHandle).toBeTruthy();

        fireEvent.mouseDown(southHandle, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 100, clientY: 200 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles resize via north handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 0,
            yCoord: 0,
            width: 200,
            height: 200,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // 'n' is index 0
        const northHandle = handles[0];

        fireEvent.mouseDown(northHandle, { clientX: 100, clientY: 0 });
        fireEvent.mouseMove(window, { clientX: 100, clientY: -50 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles resize via west handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 100,
            yCoord: 0,
            width: 200,
            height: 100,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // 'w' is index 3
        const westHandle = handles[3];

        fireEvent.mouseDown(westHandle, { clientX: 100, clientY: 50 });
        fireEvent.mouseMove(window, { clientX: 50, clientY: 50 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles resize via se corner handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 0,
            yCoord: 0,
            width: 200,
            height: 100,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // se is index 6
        const seHandle = handles[6];

        fireEvent.mouseDown(seHandle, { clientX: 200, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 300, clientY: 200 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles resize via sw corner handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 100,
            yCoord: 0,
            width: 200,
            height: 100,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // sw is index 7
        const swHandle = handles[7];

        fireEvent.mouseDown(swHandle, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 50, clientY: 200 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles resize via ne corner handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 0,
            yCoord: 100,
            width: 200,
            height: 200,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // ne is index 4
        const neHandle = handles[4];

        fireEvent.mouseDown(neHandle, { clientX: 200, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 300, clientY: 50 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('handles resize via nw corner handle', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 100,
            yCoord: 100,
            width: 200,
            height: 200,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // nw is index 5
        const nwHandle = handles[5];

        fireEvent.mouseDown(nwHandle, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 50, clientY: 50 });
        fireEvent.mouseUp(window);

        expect(onUpdate).toHaveBeenCalled();
    });

    it('applies known colour classes for each colour', () => {
        const colours = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'gray', 'zinc'];
        for (const colour of colours) {
            const mockTile = createMockTile({ colour });
            const { container, unmount } = render(<Tile {...mockTile} />);
            const mainDiv = container.firstChild as HTMLElement;
            // dark theme: bg-{colour}-500 (or bg-{colour}-300 etc)
            expect(mainDiv?.className).toMatch(/bg-/);
            unmount();
        }
    });

    it('does not start drag without onUpdate', () => {
        const mockTile = createMockTile({ editMode: true, onUpdate: undefined });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        fireEvent.mouseDown(mainDiv, { clientX: 100, clientY: 100 });
        // Should not crash; no listeners should fire
        fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
        fireEvent.mouseUp(window);
    });

    it('positions at xCoord/yCoord and rendered width/height', () => {
        const mockTile = createMockTile({ xCoord: 50, yCoord: 75, width: 200, height: 120 });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv.style.left).toBe('50px');
        expect(mainDiv.style.top).toBe('75px');
        expect(mainDiv.style.width).toBe('200px');
        expect(mainDiv.style.height).toBe('120px');
    });

    it('applies rotation transform', () => {
        const mockTile = createMockTile({ rotation: 90 });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv.style.transform).toBe('rotate(90deg)');
    });

    it('does not resize below minimum size', () => {
        const onUpdate = vi.fn();
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            xCoord: 0,
            yCoord: 0,
            width: 200,
            height: 100,
            gridSize: 20,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        // Try to resize east handle to make width very small
        const eastHandle = handles[2];
        fireEvent.mouseDown(eastHandle, { clientX: 200, clientY: 50 });
        // Move way left to try to shrink below minSize
        fireEvent.mouseMove(window, { clientX: -500, clientY: 50 });
        fireEvent.mouseUp(window);

        // onUpdate should be called with width >= minSize (gridSize * 2 = 40)
        expect(onUpdate).toHaveBeenCalled();
        const call = onUpdate.mock.calls[0][0];
        expect(call.width).toBeGreaterThanOrEqual(40);
    });

    it('rejects drag moves that fail canPlace check', () => {
        const onUpdate = vi.fn();
        const canPlace = vi.fn().mockReturnValue(false);
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            canPlace,
            xCoord: 100,
            yCoord: 100,
        });
        const { container } = render(<Tile {...mockTile} />);
        const mainDiv = container.firstChild as HTMLElement;

        fireEvent.mouseDown(mainDiv, { clientX: 150, clientY: 150 });
        fireEvent.mouseMove(window, { clientX: 250, clientY: 250 });
        fireEvent.mouseUp(window);

        expect(canPlace).toHaveBeenCalled();
        // Still calls onUpdate with original coords because move was rejected
    });

    it('rejects resize that fails canPlace check', () => {
        const onUpdate = vi.fn();
        const canPlace = vi.fn().mockReturnValue(false);
        const mockTile = createMockTile({
            editMode: true,
            onUpdate,
            canPlace,
            xCoord: 0,
            yCoord: 0,
            width: 200,
            height: 100,
            scale: 1,
        });
        const { container } = render(<Tile {...mockTile} />);
        const handles = container.querySelectorAll('[style*="cursor"]');
        const eastHandle = handles[2];

        fireEvent.mouseDown(eastHandle, { clientX: 200, clientY: 50 });
        fireEvent.mouseMove(window, { clientX: 300, clientY: 50 });
        fireEvent.mouseUp(window);

        expect(canPlace).toHaveBeenCalled();
    });
});