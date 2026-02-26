import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MachineModal from '../MachineModal';
import { createMockTile } from '../../test/mockData';

vi.mock('react-icons/rx', () => ({
    RxCross2: (props: any) => <span data-testid="close-icon" {...props} />,
}));

describe('MachineModal', () => {
    const defaultTile = createMockTile({
        equipment: {
            name: 'Test Machine',
            description: 'Test description',
            musclesTargeted: ['Chest', 'Back'],
            benefits: ['Exercise A', 'Exercise B'],
        },
    });
    const onClose = vi.fn();

    it('renders the equipment name', () => {
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        expect(screen.getByText('Test Machine')).toBeInTheDocument();
    });

    it('renders the description', () => {
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders the muscles targeted', () => {
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        expect(screen.getByText('Chest')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders the benefits/exercises', () => {
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        expect(screen.getByText('Exercise A')).toBeInTheDocument();
        expect(screen.getByText('Exercise B')).toBeInTheDocument();
    });

    it('calls onClose when backdrop is clicked', () => {
        const { container } = render(<MachineModal tile={defaultTile} onClose={onClose} />);
        const backdrop = container.firstChild as HTMLElement;
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalled();
    });

    it('does not call onClose when modal content is clicked', () => {
        onClose.mockClear();
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        const title = screen.getByText('Test Machine');
        fireEvent.click(title);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when close button is clicked', () => {
        onClose.mockClear();
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        const closeButton = screen.getByTestId('close-icon').closest('button')!;
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });

    it('uses fixed position by default', () => {
        const { container } = render(<MachineModal tile={defaultTile} onClose={onClose} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('fixed');
    });

    it('uses absolute position in container mode', () => {
        const { container } = render(<MachineModal tile={defaultTile} onClose={onClose} containerMode={true} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('absolute');
    });

    it('renders video preview placeholder when no videoUrl', () => {
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        expect(screen.getByText('Video preview')).toBeInTheDocument();
    });

    it('renders iframe when videoUrl is provided', () => {
        const tileWithVideo = createMockTile({
            equipment: {
                name: 'Video Machine',
                videoUrl: 'https://example.com/video',
            },
        });
        render(<MachineModal tile={tileWithVideo} onClose={onClose} />);
        const iframe = document.querySelector('iframe');
        expect(iframe).toBeTruthy();
        expect(iframe?.getAttribute('src')).toBe('https://example.com/video');
    });

    it('renders section headings', () => {
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Muscles trained')).toBeInTheDocument();
        expect(screen.getByText('List of exercises:')).toBeInTheDocument();
        expect(screen.getByText('Video')).toBeInTheDocument();
    });

    it('renders an icon if the tile has one', () => {
        const tileWithIcon = createMockTile({
            equipment: {
                name: 'Icon Machine',
                icon: (props: any) => <span data-testid="equipment-icon" {...props} />,
            },
        });
        render(<MachineModal tile={tileWithIcon} onClose={onClose} />);
        expect(screen.getByTestId('equipment-icon')).toBeInTheDocument();
    });
});
