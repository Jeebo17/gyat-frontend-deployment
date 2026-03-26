import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DragAndDropMenu from '../DragAndDropMenu';

// Mock react-icons
vi.mock('react-icons/tb', () => ({ TbTreadmill: (p: any) => <span data-testid="icon-treadmill" {...p} /> }));
vi.mock('react-icons/md', () => ({
    MdElectricBolt: (p: any) => <span data-testid="icon-bolt" {...p} />,
    MdRowing: (p: any) => <span data-testid="icon-rowing" {...p} />,
}));
vi.mock('react-icons/gi', () => ({ GiWeightLiftingUp: (p: any) => <span data-testid="icon-weight" {...p} /> }));
vi.mock('react-icons/io5', () => ({ IoBarbell: (p: any) => <span data-testid="icon-barbell" {...p} /> }));
vi.mock('react-icons/gr', () => ({ GrYoga: (p: any) => <span data-testid="icon-yoga" {...p} /> }));

vi.mock('../../services/equipmentTypeService', () => ({
    getAllEquipmentTypes: vi.fn().mockResolvedValue([
        { id: 100, name: 'Treadmill', brand: null, imageUrl: null, description: null, safetyInfo: null, exercises: [] },
        { id: 101, name: 'Rowing Machine', brand: null, imageUrl: null, description: null, safetyInfo: null, exercises: [] },
        { id: 102, name: 'Racks', brand: null, imageUrl: null, description: null, safetyInfo: null, exercises: [] },
        { id: 103, name: 'Free Weights', brand: null, imageUrl: null, description: null, safetyInfo: null, exercises: [] },
        { id: 104, name: 'Resistance Machine', brand: null, imageUrl: null, description: null, safetyInfo: null, exercises: [] },
        { id: 105, name: 'Open Space', brand: null, imageUrl: null, description: null, safetyInfo: null, exercises: [] },
    ]),
}));

vi.mock('../../constants/structuralComponents', () => ({
    getStructuralDef: () => undefined,
    isStructuralTile: () => false,
}));

describe('DragAndDropMenu', () => {
    it('renders heading', async () => {
        render(<DragAndDropMenu />);
        expect(screen.getByText('Drag and drop')).toBeInTheDocument();
    });

    it('renders all equipment types from API', async () => {
        render(<DragAndDropMenu />);
        await waitFor(() => {
            expect(screen.getByText('Treadmill')).toBeInTheDocument();
        });
        expect(screen.getByText('Rowing Machine')).toBeInTheDocument();
        expect(screen.getByText('Racks')).toBeInTheDocument();
        expect(screen.getByText('Free Weights')).toBeInTheDocument();
        expect(screen.getByText('Resistance Machine')).toBeInTheDocument();
        expect(screen.getByText('Open Space')).toBeInTheDocument();
    });

    it('each template item is draggable', async () => {
        render(<DragAndDropMenu />);
        await waitFor(() => {
            expect(screen.getByText('Treadmill')).toBeInTheDocument();
        });
        const items = screen.getAllByText(/Treadmill|Rowing Machine|Racks|Free Weights|Resistance Machine|Open Space/);
        items.forEach(item => {
            const draggableEl = item.closest('[draggable]');
            expect(draggableEl).toBeTruthy();
            expect(draggableEl?.getAttribute('draggable')).toBe('true');
        });
    });

    it('sets dataTransfer on drag start', async () => {
        render(<DragAndDropMenu />);
        await waitFor(() => {
            expect(screen.getByText('Treadmill')).toBeInTheDocument();
        });
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
        expect(payload.equipment.name).toBe('Treadmill');
    });

    it('sets correct data for each template', async () => {
        render(<DragAndDropMenu />);
        await waitFor(() => {
            expect(screen.getByText('Treadmill')).toBeInTheDocument();
        });

        for (const name of ['Treadmill', 'Rowing Machine', 'Racks', 'Free Weights', 'Resistance Machine', 'Open Space']) {
            const el = screen.getByText(name).closest('[draggable]')!;
            const setData = vi.fn();
            fireEvent.dragStart(el, { dataTransfer: { setData, effectAllowed: '' } });
            const payload = JSON.parse(setData.mock.calls[0][1]);
            expect(payload.equipment.name).toBe(name);
        }
    });
});
