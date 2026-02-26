import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TileInfoCard } from '../TileInfoCard';
import { createMockTile } from '../../test/mockData';

describe('TileInfoCard', () => {
    const defaultTile = createMockTile({
        xCoord: 100,
        yCoord: 100,
        width: 200,
        height: 100,
        equipment: {
            name: 'Test Equipment',
            description: 'Test description',
            benefits: ['Benefit A', 'Benefit B', 'Benefit C', 'Benefit D'],
        },
    });
    const onClose = vi.fn();

    it('renders the equipment name', () => {
        render(<TileInfoCard tile={defaultTile} mapWidth={1600} mapHeight={800} onClose={onClose} />);
        expect(screen.getByText('Test Equipment')).toBeInTheDocument();
    });

    it('renders the description', () => {
        render(<TileInfoCard tile={defaultTile} mapWidth={1600} mapHeight={800} onClose={onClose} />);
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders up to 3 benefits', () => {
        render(<TileInfoCard tile={defaultTile} mapWidth={1600} mapHeight={800} onClose={onClose} />);
        expect(screen.getByText('Benefit A, Benefit B, Benefit C')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        onClose.mockClear();
        render(<TileInfoCard tile={defaultTile} mapWidth={1600} mapHeight={800} onClose={onClose} />);
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });

    it('stops propagation on click', () => {
        const parentClick = vi.fn();
        render(
            <div onClick={parentClick}>
                <TileInfoCard tile={defaultTile} mapWidth={1600} mapHeight={800} onClose={onClose} />
            </div>
        );
        const card = screen.getByText('Test Equipment').closest('.absolute')!;
        fireEvent.click(card);
        expect(parentClick).not.toHaveBeenCalled();
    });

    it('positions the card to the right of the tile', () => {
        const { container } = render(
            <TileInfoCard tile={defaultTile} mapWidth={1600} mapHeight={800} onClose={onClose} />
        );
        const card = container.firstChild as HTMLElement;
        // Expected: tile.xCoord + tile.width + offset = 100 + 200 + 16 = 316
        expect(card.style.left).toBe('316px');
    });

    it('clamps position to not exceed map bounds', () => {
        const edgeTile = createMockTile({
            xCoord: 1400,
            yCoord: 700,
            width: 200,
            height: 100,
            equipment: { name: 'Edge Machine' },
        });
        const { container } = render(
            <TileInfoCard tile={edgeTile} mapWidth={1600} mapHeight={800} onClose={onClose} />
        );
        const card = container.firstChild as HTMLElement;
        // maxX = 1600 - 280 - 8 = 1312, so left should be clamped
        const left = parseInt(card.style.left);
        expect(left).toBeLessThanOrEqual(1312);
    });

    it('does not render description when not provided', () => {
        const noDescTile = createMockTile({
            equipment: { name: 'No Desc Machine' },
        });
        render(<TileInfoCard tile={noDescTile} mapWidth={1600} mapHeight={800} onClose={onClose} />);
        expect(screen.getByText('No Desc Machine')).toBeInTheDocument();
        // No description paragraph should be rendered
        expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });

    it('does not render benefits when not provided', () => {
        const noBenefitsTile = createMockTile({
            equipment: { name: 'No Benefits Machine' },
        });
        render(<TileInfoCard tile={noBenefitsTile} mapWidth={1600} mapHeight={800} onClose={onClose} />);
        expect(screen.queryByText('Exercises:')).not.toBeInTheDocument();
    });

    it('renders the close button with aria-label', () => {
        render(<TileInfoCard tile={defaultTile} mapWidth={1600} mapHeight={800} onClose={onClose} />);
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
});
