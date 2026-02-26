import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DragAndDropMenu } from '../DragAndDropMenu';

// Mock react-icons
vi.mock('react-icons/tb', () => ({ TbTreadmill: (p: any) => <span data-testid="icon-treadmill" {...p} /> }));
vi.mock('react-icons/md', () => ({
    MdElectricBolt: (p: any) => <span data-testid="icon-bolt" {...p} />,
    MdRowing: (p: any) => <span data-testid="icon-rowing" {...p} />,
}));
vi.mock('react-icons/gi', () => ({ GiWeightLiftingUp: (p: any) => <span data-testid="icon-weight" {...p} /> }));
vi.mock('react-icons/io5', () => ({ IoBarbell: (p: any) => <span data-testid="icon-barbell" {...p} /> }));
vi.mock('react-icons/gr', () => ({ GrYoga: (p: any) => <span data-testid="icon-yoga" {...p} /> }));

describe('DragAndDropMenu', () => {
    it('renders heading', () => {
        render(<DragAndDropMenu />);
        expect(screen.getByText('Drag and drop')).toBeInTheDocument();
    });

    it('renders all equipment compoenents', () => {
        render(<DragAndDropMenu />);
        expect(screen.getByText('Treadmill')).toBeInTheDocument();
        expect(screen.getByText('Rowing Machine')).toBeInTheDocument();
        expect(screen.getByText('Racks')).toBeInTheDocument();
        expect(screen.getByText('Free Weights')).toBeInTheDocument();
        expect(screen.getByText('Resistance Machine')).toBeInTheDocument();
        expect(screen.getByText('Open Space')).toBeInTheDocument();
    });

    it('each template item is draggable', () => {
        render(<DragAndDropMenu />);
        const items = screen.getAllByText(/Treadmill|Rowing Machine|Racks|Free Weights|Resistance Machine|Open Space/);
        items.forEach(item => {
            const draggableEl = item.closest('[draggable]');
            expect(draggableEl).toBeTruthy();
            expect(draggableEl?.getAttribute('draggable')).toBe('true');
        });
    });

    it('sets dataTransfer on drag start', () => {
        render(<DragAndDropMenu />);
        const treadmill = screen.getByText('Treadmill').closest('[draggable]')!;

        const setData = vi.fn();
        const dataTransfer = { setData, effectAllowed: '' };
        fireEvent.dragStart(treadmill, { dataTransfer });

        expect(setData).toHaveBeenCalledWith(
            'application/tile-template',
            expect.any(String)
        );
        expect(dataTransfer.effectAllowed).toBe('copy');

        const payload = JSON.parse(setData.mock.calls[0][1]);
        expect(payload.equipmentName).toBe('Treadmill');
        expect(payload.width).toBe(240);
        expect(payload.height).toBe(100);
        expect(payload.colour).toBe('red');
    });

    it('sets correct data for each template', () => {
        render(<DragAndDropMenu />);

        const expectedData = [
            { name: 'Treadmill', colour: 'red', width: 240, height: 100 },
            { name: 'Rowing Machine', colour: 'blue', width: 240, height: 100 },
            { name: 'Racks', colour: 'green', width: 240, height: 160 },
            { name: 'Free Weights', colour: 'purple', width: 200, height: 200 },
            { name: 'Resistance Machine', colour: 'yellow', width: 100, height: 100 },
            { name: 'Open Space', colour: 'orange', width: 300, height: 200 },
        ];

        expectedData.forEach(expected => {
            const el = screen.getByText(expected.name).closest('[draggable]')!;
            const setData = vi.fn();
            fireEvent.dragStart(el, { dataTransfer: { setData, effectAllowed: '' } });
            const payload = JSON.parse(setData.mock.calls[0][1]);
            expect(payload.equipmentName).toBe(expected.name);
            expect(payload.colour).toBe(expected.colour);
            expect(payload.width).toBe(expected.width);
            expect(payload.height).toBe(expected.height);
        });
    });

    it('renders icons for each template', () => {
        render(<DragAndDropMenu />);
        expect(screen.getByTestId('icon-treadmill')).toBeInTheDocument();
        expect(screen.getByTestId('icon-rowing')).toBeInTheDocument();
        expect(screen.getByTestId('icon-weight')).toBeInTheDocument();
        expect(screen.getByTestId('icon-barbell')).toBeInTheDocument();
        expect(screen.getByTestId('icon-bolt')).toBeInTheDocument();
        expect(screen.getByTestId('icon-yoga')).toBeInTheDocument();
    });
});
