import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WallTile from '../WallTile';

const baseProps = {
    id: 1,
    xCoord: 50,
    yCoord: 50,
    width: 200,
    height: 10,
    rotation: 0,
    colour: '6B7280',
    equipment: { name: 'Wall' },
    editMode: false,
};

describe('WallTile', () => {
    it('renders with correct position and dimensions', () => {
        render(<WallTile {...baseProps} />);
        const tile = screen.getByLabelText('Wall');
        expect(tile.style.left).toBe('50px');
        expect(tile.style.top).toBe('50px');
        expect(tile.style.width).toBe('200px');
        expect(tile.style.height).toBe('10px');
    });

    it('applies the correct background colour', () => {
        render(<WallTile {...baseProps} />);
        const tile = screen.getByLabelText('Wall');
        expect(tile.style.backgroundColor).toBe('rgb(107, 114, 128)');
    });

    it('shows label text on long horizontal walls', () => {
        render(<WallTile {...baseProps} width={200} />);
        expect(screen.getByText('Wall')).toBeTruthy();
    });

    it('hides label text on short walls', () => {
        render(<WallTile {...baseProps} width={30} height={10} />);
        expect(screen.queryByText('Wall')).toBeNull();
    });

    it('does not show edit controls when editMode is false', () => {
        render(<WallTile {...baseProps} />);
        expect(screen.queryByTitle('Delete')).toBeNull();
        expect(screen.queryByTitle('Swap orientation')).toBeNull();
    });

    it('shows delete and orientation controls in edit mode', () => {
        const onUpdate = vi.fn();
        const onDelete = vi.fn();
        render(
            <WallTile {...baseProps} editMode={true} onUpdate={onUpdate} onDelete={onDelete} />
        );
        // Delete icon is rendered via FaTrash (click handler exists)
        const trashArea = document.querySelector('.text-red-400');
        expect(trashArea).toBeTruthy();
        // Swap orientation button
        expect(screen.getByTitle('Swap orientation')).toBeTruthy();
    });

    it('calls onDelete when delete area is clicked', () => {
        const onDelete = vi.fn();
        render(
            <WallTile {...baseProps} editMode={true} onUpdate={vi.fn()} onDelete={onDelete} />
        );
        const trashArea = document.querySelector('.text-red-400')!.parentElement!;
        fireEvent.click(trashArea);
        expect(onDelete).toHaveBeenCalledOnce();
    });

    it('calls onUpdate to swap orientation', () => {
        const onUpdate = vi.fn();
        render(
            <WallTile {...baseProps} editMode={true} onUpdate={onUpdate} />
        );
        fireEvent.mouseDown(screen.getByTitle('Swap orientation'));
        // Should swap width and height
        expect(onUpdate).toHaveBeenCalledWith({ width: 10, height: 200 });
    });

    it('adds highlight ring when highlighted', () => {
        render(<WallTile {...baseProps} highlighted={true} />);
        const tile = screen.getByLabelText('Wall');
        expect(tile.className).toContain('ring-4');
    });

    it('shows vertical label when wall is vertical and long enough', () => {
        render(<WallTile {...baseProps} width={10} height={200} />);
        expect(screen.getByText('Wall')).toBeTruthy();
    });
});
