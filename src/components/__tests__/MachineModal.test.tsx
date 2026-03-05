
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MachineModal from '../MachineModal';
import { createMockTile } from '../../test/mockData';
import type { ComponentProps } from 'react';
import type { TileData } from '../../types/tile';

vi.mock('react-icons/rx', () => ({
    RxCross2: (props: any) => <span data-testid="close-icon" {...props} />,
}));

const defaultTile = createMockTile({
    equipment: {
        name: 'Test Machine',
        description: 'Test description',
        musclesTargeted: ['Chest', 'Back'],
        benefits: ['Exercise A', 'Exercise B'],
    },
});

const baseTile: TileData = {
    id: 11,
    equipmentTypeId: 7,
    exerciseIds: [101],
    exerciseOptions: [
        { id: 101, name: 'Lat Pulldown' },
        { id: 102, name: 'Seated Cable Row' },
    ],
    outOfOrder: false,
    equipment: {
        name: 'Cable Station',
        description: 'Multi-purpose cable machine',
        benefits: ['Lat Pulldown'],
        musclesTargeted: ['Back', 'Biceps'],
    },
    xCoord: 120,
    yCoord: 80,
    width: 220,
    height: 140,
    rotation: 0,
    colour: 'blue',
};

const renderModal = (overrides: Partial<ComponentProps<typeof MachineModal>> = {}) => {
    return render(
        <MachineModal
            tile={baseTile}
            onClose={vi.fn()}
            editMode={true}
            onTileChange={vi.fn()}
            onSave={vi.fn()}
            onOutOfOrderChange={vi.fn()}
            onExerciseIdsChange={vi.fn()}
            onCreateExercise={vi.fn()}
            {...overrides}
        />
    );
};

describe('MachineModal', () => {
    // Basic modal rendering tests
    it('renders the equipment name', () => {
        render(<MachineModal tile={defaultTile} onClose={vi.fn()} />);
        expect(screen.getByText('Test Machine')).toBeInTheDocument();
    });

    it('renders the description', () => {
        render(<MachineModal tile={defaultTile} onClose={vi.fn()} />);
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders the muscles targeted', () => {
        render(<MachineModal tile={defaultTile} onClose={vi.fn()} />);
        expect(screen.getByText('Chest')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders the benefits/exercises', () => {
        render(<MachineModal tile={defaultTile} onClose={vi.fn()} />);
        expect(screen.getByText('Exercise A')).toBeInTheDocument();
        expect(screen.getByText('Exercise B')).toBeInTheDocument();
    });

    it('calls onClose when backdrop is clicked', () => {
        const onClose = vi.fn();
        const { container } = render(<MachineModal tile={defaultTile} onClose={onClose} />);
        const backdrop = container.firstChild as HTMLElement;
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalled();
    });

    it('does not call onClose when modal content is clicked', () => {
        const onClose = vi.fn();
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        const title = screen.getByText('Test Machine');
        fireEvent.click(title);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(<MachineModal tile={defaultTile} onClose={onClose} />);
        const closeButton = screen.getByTestId('close-icon').closest('button')!;
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });

    it('uses fixed position by default', () => {
        const { container } = render(<MachineModal tile={defaultTile} onClose={vi.fn()} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('fixed');
    });

    it('uses absolute position in container mode', () => {
        const { container } = render(<MachineModal tile={defaultTile} onClose={vi.fn()} containerMode={true} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('absolute');
    });

    it('renders video preview placeholder when no videoUrl', () => {
        render(<MachineModal tile={defaultTile} onClose={vi.fn()} />);
        expect(screen.getByText('Video preview')).toBeInTheDocument();
    });

    it('renders iframe when videoUrl is provided', () => {
        const tileWithVideo = createMockTile({
            equipment: {
                name: 'Video Machine',
                videoUrl: 'https://example.com/video',
            },
        });
        render(<MachineModal tile={tileWithVideo} onClose={vi.fn()} />);
        const iframe = document.querySelector('iframe');
        expect(iframe).toBeTruthy();
        expect(iframe?.getAttribute('src')).toBe('https://example.com/video');
    });

    it('renders section headings', () => {
        render(<MachineModal tile={defaultTile} onClose={vi.fn()} />);
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
        render(<MachineModal tile={tileWithIcon} onClose={vi.fn()} />);
        expect(screen.getByTestId('equipment-icon')).toBeInTheDocument();
    });

    // Edit mode and exercise management tests
    it('adds a selected exercise from dropdown', async () => {
        const onExerciseIdsChange = vi.fn();
        renderModal({ onExerciseIdsChange });

        const select = screen.getByLabelText('Exercise selector');
        expect(select).toBeInTheDocument();

        await waitFor(() => {
            expect((select as HTMLSelectElement).value).toBe('102');
        });

        fireEvent.click(screen.getByRole('button', { name: 'Add Exercise' }));
        expect(onExerciseIdsChange).toHaveBeenCalledWith([101, 102]);
    });

    it('renders already selected exercises in edit mode', () => {
        renderModal();
        expect(screen.getByText('Lat Pulldown')).toBeInTheDocument();
    });

    it('opens editable exercise details when a listed exercise is clicked in edit mode', () => {
        renderModal();

        fireEvent.click(screen.getByRole('button', { name: 'Lat Pulldown' }));

        expect(screen.getByRole('heading', { name: 'Exercise Details' })).toBeInTheDocument();
        expect(screen.getByText('Edit exercise details.')).toBeInTheDocument();
        expect(screen.getByLabelText('Exercise name')).toHaveValue('Lat Pulldown');
        expect(screen.getByRole('button', { name: 'Save Exercise' })).toBeInTheDocument();
    });

    it('opens read-only exercise details when a listed exercise is clicked in non-edit mode', () => {
        renderModal({ editMode: false });

        fireEvent.click(screen.getByRole('button', { name: 'Lat Pulldown' }));

        expect(screen.getByRole('heading', { name: 'Exercise Details' })).toBeInTheDocument();
        expect(screen.getByText('Read-only exercise view.')).toBeInTheDocument();
        expect(screen.getAllByText('Lat Pulldown').length).toBeGreaterThan(0);
        expect(screen.queryByRole('button', { name: 'Save Exercise' })).not.toBeInTheDocument();
    });

    it('saves exercise edits as override for preset exercises', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue({
            id: 101,
            name: 'Lat Pulldown',
            description: 'Base description',
            videoUrl: 'https://example.com/base',
            difficulty: 'Intermediate',
            equipmentTypeId: 7,
            equipmentTypeName: 'Cable Station',
            muscles: ['Back'],
            global: true,
        });
        const onSaveExercise = vi.fn().mockResolvedValue(undefined);
        renderModal({ onLoadExercise, onSaveExercise });

        fireEvent.click(screen.getByRole('button', { name: 'Lat Pulldown' }));

        await waitFor(() => {
            expect(onLoadExercise).toHaveBeenCalledWith(101);
        });

        fireEvent.change(screen.getByLabelText('Exercise name'), {
            target: { value: 'Lat Pulldown (Override)' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Save Exercise' }));

        await waitFor(() => {
            expect(onSaveExercise).toHaveBeenCalledWith(
                101,
                expect.objectContaining({ name: 'Lat Pulldown (Override)' }),
                true
            );
        });
    });

    it('updates custom exercises directly when owned by manager', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue({
            id: 101,
            name: 'My Cable Row',
            description: 'Custom description',
            videoUrl: 'https://example.com/custom',
            difficulty: 'Beginner',
            equipmentTypeId: 7,
            equipmentTypeName: 'Cable Station',
            muscles: ['Back'],
            global: false,
        });
        const onSaveExercise = vi.fn().mockResolvedValue(undefined);
        renderModal({ onLoadExercise, onSaveExercise });

        fireEvent.click(screen.getByRole('button', { name: 'Lat Pulldown' }));

        await waitFor(() => {
            expect(onLoadExercise).toHaveBeenCalledWith(101);
        });

        fireEvent.change(screen.getByLabelText('Exercise name'), {
            target: { value: 'My Cable Row Updated' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Save Exercise' }));

        await waitFor(() => {
            expect(onSaveExercise).toHaveBeenCalledWith(
                101,
                expect.objectContaining({ name: 'My Cable Row Updated' }),
                false
            );
        });
    });

    it('toggles to preview mode in edit flow', () => {
        renderModal();

        fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

        expect(screen.getByText('Back to Edit')).toBeInTheDocument();
        expect(screen.queryByLabelText('Exercise selector')).not.toBeInTheDocument();
    });

    it('disables save button when saving', () => {
        renderModal({ saving: true });

        const saveButton = screen.getByRole('button', { name: 'Saving...' });
        expect(saveButton).toBeDisabled();
    });

    it('calls onCreateExercise with typed name', async () => {
        const onCreateExercise = vi.fn();
        renderModal({
            onCreateExercise,
            muscleOptions: [{ id: 1, name: 'Back' }],
        });

        fireEvent.click(screen.getByRole('button', { name: 'Create Exercise' }));
        expect(screen.getByRole('heading', { name: 'Create Exercise' })).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Exercise name'), {
            target: { value: 'Incline Cable Fly' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        await waitFor(() => {
            expect(onCreateExercise).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Incline Cable Fly' })
            );
        });
    });

    it('includes selected muscle ids in create payload', async () => {
        const onCreateExercise = vi.fn();
        renderModal({
            onCreateExercise,
            muscleOptions: [
                { id: 1, name: 'Back' },
                { id: 2, name: 'Biceps' },
            ],
        });

        fireEvent.click(screen.getByRole('button', { name: 'Create Exercise' }));
        fireEvent.change(screen.getByLabelText('Exercise name'), {
            target: { value: 'Single Arm Row' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Add Muscle' }));
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        await waitFor(() => {
            expect(onCreateExercise).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Single Arm Row', muscleIds: [1] })
            );
        });
    });

    it('shows loading state while muscle options are being fetched', () => {
        renderModal({
            muscleOptions: [{ id: 1, name: 'Back' }],
            musclesLoading: true,
        });

        fireEvent.click(screen.getByRole('button', { name: 'Create Exercise' }));

        expect(screen.getByText('Loading muscle options...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add Muscle' })).toBeDisabled();
    });

    it('disables create modal opener while creating', () => {
        renderModal({ creatingExercise: true });
        expect(screen.getByRole('button', { name: 'Create Exercise' })).toBeDisabled();
    });
});