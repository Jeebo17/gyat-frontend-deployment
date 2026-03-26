import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingEditTray from '../FloatingEditTray';
import type { TileData } from '../../types/tile';

const baseTile: TileData = {
    id: 1,
    xCoord: 10,
    yCoord: 20,
    width: 100,
    height: 60,
    rotation: 0,
    colour: 'EF4444',
    equipment: { name: 'Bench Press' },
    equipmentTypeId: 100,
};

const structuralTile: TileData = {
    ...baseTile,
    equipmentTypeId: 0, // Wall — structural (id < 50)
    equipment: { name: 'Wall' },
};

describe('FloatingEditTray', () => {
    it('returns null when tile is null', () => {
        const { container } = render(
            <FloatingEditTray
                tile={null}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
            />
        );
        expect(container.innerHTML).toBe('');
    });

    it('renders the tile name', () => {
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
            />
        );
        expect(screen.getByText('Bench Press')).toBeTruthy();
    });

    it('renders colour swatches for non-structural tiles', () => {
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
            />
        );
        // 10 colour buttons
        const colourButtons = screen.getAllByRole('button').filter(btn =>
            btn.style.backgroundColor !== ''
        );
        expect(colourButtons.length).toBe(10);
    });

    it('hides colour swatches and edit button for structural tiles', () => {
        render(
            <FloatingEditTray
                tile={structuralTile}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
            />
        );
        const colourButtons = screen.getAllByRole('button').filter(btn =>
            btn.style.backgroundColor !== ''
        );
        expect(colourButtons.length).toBe(0);
        expect(screen.queryByTitle('Edit information')).toBeNull();
    });

    it('calls onColourChange when a colour swatch is clicked', () => {
        const onColourChange = vi.fn();
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={onColourChange}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
            />
        );
        const swatches = screen.getAllByRole('button').filter(btn =>
            btn.style.backgroundColor !== ''
        );
        fireEvent.click(swatches[0]);
        expect(onColourChange).toHaveBeenCalledWith('EF4444');
    });

    it('calls onRotate when rotate button is clicked', () => {
        const onRotate = vi.fn();
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={vi.fn()}
                onRotate={onRotate}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
            />
        );
        fireEvent.click(screen.getByTitle('Swap width/height'));
        expect(onRotate).toHaveBeenCalledOnce();
    });

    it('calls onDelete when delete button is clicked', () => {
        const onDelete = vi.fn();
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={onDelete}
                onDeselect={vi.fn()}
            />
        );
        fireEvent.click(screen.getByTitle('Delete'));
        expect(onDelete).toHaveBeenCalledOnce();
    });

    it('calls onDeselect when deselect button is clicked', () => {
        const onDeselect = vi.fn();
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={onDeselect}
            />
        );
        fireEvent.click(screen.getByTitle('Deselect'));
        expect(onDeselect).toHaveBeenCalledOnce();
    });

    it('calls onEdit when edit button is clicked', () => {
        const onEdit = vi.fn();
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
                onEdit={onEdit}
            />
        );
        fireEvent.click(screen.getByTitle('Edit information'));
        expect(onEdit).toHaveBeenCalledOnce();
    });

    it('highlights the active colour swatch', () => {
        render(
            <FloatingEditTray
                tile={baseTile}
                onColourChange={vi.fn()}
                onRotate={vi.fn()}
                onDelete={vi.fn()}
                onDeselect={vi.fn()}
            />
        );
        const swatches = screen.getAllByRole('button').filter(btn =>
            btn.style.backgroundColor !== ''
        );
        // The first swatch is EF4444, which matches baseTile.colour
        expect(swatches[0].className).toContain('scale-110');
    });
});
