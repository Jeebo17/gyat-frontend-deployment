import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExerciseDetailsModal from '../ExerciseDetailsModal';
import type { ExerciseDTO } from '../../types/api';

const exerciseDTO: ExerciseDTO = {
    id: 10,
    name: 'Bench Press',
    description: 'Flat bench press with barbell',
    videoUrl: 'https://example.com/video',
    difficulty: 'Intermediate',
    equipmentTypeId: 5,
    equipmentTypeName: 'Bench',
    muscles: [
        { id: 1, name: 'Chest' },
        { id: 2, name: 'Triceps' },
    ],
    global: true,
};

describe('ExerciseDetailsModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when exercise is null', () => {
        const { container } = render(
            <ExerciseDetailsModal
                exercise={null}
                onClose={vi.fn()}
                showEditableFields={false}
            />
        );
        expect(container.innerHTML).toBe('');
    });

    it('renders the modal heading', () => {
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                showEditableFields={false}
            />
        );
        expect(screen.getByText('Exercise Details')).toBeTruthy();
    });

    it('shows read-only view text when showEditableFields is false', () => {
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                showEditableFields={false}
            />
        );
        expect(screen.getByText('Read-only exercise view.')).toBeTruthy();
        expect(screen.getByText('Close')).toBeTruthy();
        expect(screen.queryByText('Save Exercise')).toBeNull();
    });

    it('shows edit text and save button when showEditableFields is true', () => {
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                showEditableFields={true}
            />
        );
        expect(screen.getByText('Edit exercise details.')).toBeTruthy();
        expect(screen.getByText('Cancel')).toBeTruthy();
        expect(screen.getByText('Save Exercise')).toBeTruthy();
    });

    it('loads exercise details via onLoadExercise', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue(exerciseDTO);
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        expect(screen.getByText('Loading exercise details...')).toBeTruthy();

        await waitFor(() => {
            expect(screen.getByText('Chest')).toBeTruthy();
            expect(screen.getByText('Triceps')).toBeTruthy();
        });

        expect(onLoadExercise).toHaveBeenCalledWith(10);
    });

    it('shows load error when onLoadExercise rejects', async () => {
        const onLoadExercise = vi.fn().mockRejectedValue(new Error('Network failure'));
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Could not load exercise details: Network failure/)).toBeTruthy();
        });
    });

    it('displays "No video available" when no video URL', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue({ ...exerciseDTO, videoUrl: null });
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('No video available')).toBeTruthy();
        });
    });

    it('rewrites YouTube watch URLs to embed URLs', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue({
            ...exerciseDTO,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        });

        const { container } = render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        await waitFor(() => {
            const iframe = container.querySelector('iframe');
            expect(iframe).toBeTruthy();
            expect(iframe?.getAttribute('src')).toContain('www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
        });
    });

    it('displays "No muscle data available." when muscles list is empty', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue({ ...exerciseDTO, muscles: [] });
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('No muscle data available.')).toBeTruthy();
        });
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={onClose}
                showEditableFields={false}
            />
        );

        fireEvent.click(screen.getByLabelText('Close exercise details'));
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not close when saving is in progress', async () => {
        const onClose = vi.fn();
        // Simulate a slow save
        const onSaveExercise = vi.fn().mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 200))
        );
        const onLoadExercise = vi.fn().mockResolvedValue(exerciseDTO);

        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={onClose}
                onLoadExercise={onLoadExercise}
                onSaveExercise={onSaveExercise}
                showEditableFields={true}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Chest')).toBeTruthy();
        });

        fireEvent.click(screen.getByText('Save Exercise'));

        // Try closing during save
        fireEvent.click(screen.getByLabelText('Close exercise details'));
        // onClose should NOT have been called because saving blocks close
        expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onSaveExercise with correct data', async () => {
        const onSaveExercise = vi.fn().mockResolvedValue(undefined);
        const onLoadExercise = vi.fn().mockResolvedValue(exerciseDTO);

        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                onSaveExercise={onSaveExercise}
                showEditableFields={true}
            />
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Bench Press')).toBeTruthy();
        });

        fireEvent.click(screen.getByText('Save Exercise'));

        await waitFor(() => {
            expect(onSaveExercise).toHaveBeenCalledWith(
                10,
                expect.objectContaining({ name: 'Bench Press' }),
                true // global exercise → useOverride = true
            );
        });
    });

    it('shows save error when onSaveExercise rejects', async () => {
        const onSaveExercise = vi.fn().mockRejectedValue(new Error('Save failed'));
        const onLoadExercise = vi.fn().mockResolvedValue(exerciseDTO);

        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                onSaveExercise={onSaveExercise}
                showEditableFields={true}
            />
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Bench Press')).toBeTruthy();
        });

        fireEvent.click(screen.getByText('Save Exercise'));

        await waitFor(() => {
            expect(screen.getByText('Save failed')).toBeTruthy();
        });
    });

    it('shows validation error for empty name on save', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue(exerciseDTO);

        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={true}
            />
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Bench Press')).toBeTruthy();
        });

        fireEvent.change(screen.getByDisplayValue('Bench Press'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Save Exercise'));

        await waitFor(() => {
            expect(screen.getByText('Exercise name cannot be empty.')).toBeTruthy();
        });
    });

    it('shows preset exercise message for global exercises', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue(exerciseDTO);

        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/preset exercise/i)).toBeTruthy();
        });
    });

    it('shows owner message for non-global exercises', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue({
            ...exerciseDTO,
            global: false,
        });

        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/You own this exercise/i)).toBeTruthy();
        });
    });

    it('displays read-only name when showEditableFields is false', async () => {
        const onLoadExercise = vi.fn().mockResolvedValue(exerciseDTO);
        render(
            <ExerciseDetailsModal
                exercise={{ id: 10, name: 'Bench Press' }}
                onClose={vi.fn()}
                onLoadExercise={onLoadExercise}
                showEditableFields={false}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Bench Press')).toBeTruthy();
        });
        // No input field for name in read-only mode
        expect(screen.queryByDisplayValue('Bench Press')).toBeNull();
    });
});
