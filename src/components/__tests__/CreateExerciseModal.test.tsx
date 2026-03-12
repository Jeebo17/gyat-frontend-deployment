import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateExerciseModal from '../CreateExerciseModal';

const muscleOptions = [
    { id: 1, name: 'Chest' },
    { id: 2, name: 'Back' },
    { id: 3, name: 'Biceps' },
];

const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    tileName: 'Bench Press',
    tileEquipmentTypeId: 5,
};

describe('CreateExerciseModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when not open', () => {
        const { container } = render(
            <CreateExerciseModal {...defaultProps} isOpen={false} />
        );
        expect(container.innerHTML).toBe('');
    });

    it('renders the modal heading and linked machine name', () => {
        render(<CreateExerciseModal {...defaultProps} />);
        expect(screen.getByText('Create Exercise')).toBeTruthy();
        expect(screen.getByText('Bench Press')).toBeTruthy();
    });

    it('renders form fields for exercise info', () => {
        render(<CreateExerciseModal {...defaultProps} />);
        expect(screen.getByLabelText('Exercise name')).toBeTruthy();
        expect(screen.getByLabelText(/Description/)).toBeTruthy();
        expect(screen.getByLabelText(/Difficulty/)).toBeTruthy();
        expect(screen.getByLabelText(/Video URL/)).toBeTruthy();
    });

    it('shows equipment type id in linked machine section', () => {
        render(<CreateExerciseModal {...defaultProps} tileEquipmentTypeId={42} />);
        expect(screen.getByText('42')).toBeTruthy();
    });

    it('shows "Unknown" when equipmentTypeId is undefined', () => {
        render(<CreateExerciseModal {...defaultProps} tileEquipmentTypeId={undefined} />);
        expect(screen.getByText('Unknown')).toBeTruthy();
    });

    it('shows error when creating with empty name', async () => {
        render(<CreateExerciseModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Create'));
        await waitFor(() => {
            expect(screen.getByText('Exercise name cannot be empty.')).toBeTruthy();
        });
    });

    it('calls onCreateExercise with correct data on submit', async () => {
        const onCreateExercise = vi.fn().mockResolvedValue(undefined);
        render(
            <CreateExerciseModal
                {...defaultProps}
                onCreateExercise={onCreateExercise}
                muscleOptions={muscleOptions}
            />
        );

        fireEvent.change(screen.getByLabelText('Exercise name'), {
            target: { value: 'Incline Fly' },
        });
        fireEvent.change(screen.getByPlaceholderText('Exercise description...'), {
            target: { value: 'A cable exercise' },
        });
        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(onCreateExercise).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Incline Fly',
                    description: 'A cable exercise',
                    muscleIds: [],
                })
            );
        });
    });

    it('calls onClose after successful create', async () => {
        const onClose = vi.fn();
        const onCreateExercise = vi.fn().mockResolvedValue(undefined);
        render(
            <CreateExerciseModal
                {...defaultProps}
                onClose={onClose}
                onCreateExercise={onCreateExercise}
            />
        );

        fireEvent.change(screen.getByLabelText('Exercise name'), {
            target: { value: 'Test Exercise' },
        });
        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('shows error when onCreateExercise throws', async () => {
        const onCreateExercise = vi.fn().mockRejectedValue(new Error('Server error'));
        render(
            <CreateExerciseModal
                {...defaultProps}
                onCreateExercise={onCreateExercise}
            />
        );

        fireEvent.change(screen.getByLabelText('Exercise name'), {
            target: { value: 'Failing Exercise' },
        });
        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(screen.getByText('Server error')).toBeTruthy();
        });
    });

    it('shows Cancel and Create buttons', () => {
        render(<CreateExerciseModal {...defaultProps} />);
        expect(screen.getByText('Cancel')).toBeTruthy();
        expect(screen.getByText('Create')).toBeTruthy();
    });

    it('shows "Creating..." when creatingExercise is true', () => {
        render(<CreateExerciseModal {...defaultProps} creatingExercise={true} />);
        expect(screen.getByText('Creating...')).toBeTruthy();
    });

    it('disables cancel during creation', () => {
        render(<CreateExerciseModal {...defaultProps} creatingExercise={true} />);
        expect(screen.getByText('Cancel')).toBeDisabled();
    });

    it('renders muscle options in select dropdown', () => {
        render(
            <CreateExerciseModal
                {...defaultProps}
                muscleOptions={muscleOptions}
            />
        );
        expect(screen.getByText('Chest')).toBeTruthy();
        expect(screen.getByText('Back')).toBeTruthy();
    });

    it('adds a muscle when Add Muscle is clicked', () => {
        render(
            <CreateExerciseModal
                {...defaultProps}
                muscleOptions={muscleOptions}
            />
        );
        fireEvent.click(screen.getByText('Add Muscle'));
        // After adding, the muscle appears as a chip with a remove button
        const removeButton = screen.getByLabelText('Remove Chest');
        expect(removeButton).toBeTruthy();
    });

    it('removes a muscle when the remove button is clicked', () => {
        render(
            <CreateExerciseModal
                {...defaultProps}
                muscleOptions={muscleOptions}
            />
        );
        fireEvent.click(screen.getByText('Add Muscle'));
        expect(screen.getByLabelText('Remove Chest')).toBeTruthy();

        fireEvent.click(screen.getByLabelText('Remove Chest'));
        expect(screen.queryByLabelText('Remove Chest')).toBeNull();
    });

    it('shows loading state for muscles', () => {
        render(
            <CreateExerciseModal
                {...defaultProps}
                musclesLoading={true}
            />
        );
        expect(screen.getByText('Loading muscles...')).toBeTruthy();
        expect(screen.getByText('Loading muscle options...')).toBeTruthy();
    });

    it('shows muscle load error', () => {
        render(
            <CreateExerciseModal
                {...defaultProps}
                muscleLoadError="Network error"
            />
        );
        expect(screen.getByText(/Could not load muscles: Network error/)).toBeTruthy();
    });

    it('shows "No muscles selected" when none are added', () => {
        render(<CreateExerciseModal {...defaultProps} muscleOptions={muscleOptions} />);
        expect(screen.getByText('No muscles selected.')).toBeTruthy();
    });
});
