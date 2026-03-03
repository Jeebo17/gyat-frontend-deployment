import { useEffect, useMemo, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import type { TileData } from "../types/tile";
import type { EquipmentProps } from "../types/equipment";
import type { ExerciseDTO } from "../types/api";

export interface CreateExerciseDraft {
    name: string;
    description?: string;
    videoUrl?: string;
    difficulty?: string;
    muscleIds: number[];
}

export interface ExerciseEditDraft {
    name: string;
    description?: string;
    videoUrl?: string;
    difficulty?: string;
}

interface MuscleOption {
    id: number;
    name: string;
}

interface MachineModalProps {
    tile: TileData;
    onClose: () => void;
    containerMode?: boolean;
    editMode?: boolean;
    onTileChange?: (equipmentUpdates: Partial<EquipmentProps>) => void;
    onExerciseIdsChange?: (exerciseIds: number[]) => void;
    onCreateExercise?: (exercise: CreateExerciseDraft) => Promise<void> | void;
    onLoadExercise?: (exerciseId: number) => Promise<ExerciseDTO>;
    onSaveExercise?: (exerciseId: number, exercise: ExerciseEditDraft, useOverride: boolean) => Promise<void> | void;
    creatingExercise?: boolean;
    muscleOptions?: MuscleOption[];
    musclesLoading?: boolean;
    muscleLoadError?: string | null;
    onOutOfOrderChange?: (outOfOrder: boolean) => void;
    onSave?: () => Promise<void> | void;
    saving?: boolean;
    saveError?: string | null;
    saveSuccess?: string | null;
}

const normalizeOptionalString = (value: string): string | undefined => {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
};

function MachineModal({
    tile,
    onClose,
    containerMode = false,
    editMode = false,
    onTileChange,
    onExerciseIdsChange,
    onCreateExercise,
    onLoadExercise,
    onSaveExercise,
    creatingExercise = false,
    muscleOptions = [],
    musclesLoading = false,
    muscleLoadError = null,
    onOutOfOrderChange,
    onSave,
    saving = false,
    saveError = null,
    saveSuccess = null,
}: MachineModalProps) {
    const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<{ id?: number; name: string } | null>(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [exerciseToAddId, setExerciseToAddId] = useState("");
    const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState("");
    const [newExerciseDescription, setNewExerciseDescription] = useState("");
    const [newExerciseDifficulty, setNewExerciseDifficulty] = useState("");
    const [newExerciseVideoUrl, setNewExerciseVideoUrl] = useState("");
    const [muscleToAddId, setMuscleToAddId] = useState("");
    const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>([]);
    const [createExerciseError, setCreateExerciseError] = useState<string | null>(null);
    const [exerciseDetails, setExerciseDetails] = useState<ExerciseDTO | null>(null);
    const [exerciseDetailsLoading, setExerciseDetailsLoading] = useState(false);
    const [exerciseDetailsError, setExerciseDetailsError] = useState<string | null>(null);
    const [exerciseSaveError, setExerciseSaveError] = useState<string | null>(null);
    const [exerciseSaving, setExerciseSaving] = useState(false);
    const [editExerciseName, setEditExerciseName] = useState("");
    const [editExerciseDescription, setEditExerciseDescription] = useState("");
    const [editExerciseDifficulty, setEditExerciseDifficulty] = useState("");
    const [editExerciseVideoUrl, setEditExerciseVideoUrl] = useState("");
    const showEditableFields = editMode && !previewMode;
    const inputClasses = "w-full rounded-md border border-white/30 bg-black/30 px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent-primary";
    const textareaClasses = "w-full rounded-md border border-white/30 bg-black/30 px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent-primary resize-y min-h-[120px]";
    const selectedExerciseIds = tile.exerciseIds ?? [];
    const selectedExerciseIdSet = useMemo(() => new Set(selectedExerciseIds), [selectedExerciseIds]);
    const selectedBenefits = tile.equipment.benefits ?? [];
    const exerciseNameById = useMemo(
        () => new Map((tile.exerciseOptions ?? []).map((exercise) => [exercise.id, exercise.name])),
        [tile.exerciseOptions]
    );
    const selectedExercises = selectedExerciseIds.map((exerciseId, index) => ({
        id: exerciseId,
        name: exerciseNameById.get(exerciseId) ?? selectedBenefits[index] ?? `Exercise #${exerciseId}`,
    }));
    const readOnlyExercises = selectedExercises.length > 0
        ? selectedExercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            key: `selected-${exercise.id}`,
        }))
        : (tile.equipment.benefits ?? []).map((benefit, index) => ({
            id: undefined,
            name: benefit,
            key: `benefit-${index}`,
        }));
    const selectableExerciseOptions = (tile.exerciseOptions ?? [])
        .filter((exercise) => !selectedExerciseIdSet.has(exercise.id));
    const selectedMuscleIdSet = useMemo(() => new Set(selectedMuscleIds), [selectedMuscleIds]);
    const selectedMuscles = selectedMuscleIds
        .map((muscleId) => muscleOptions.find((muscle) => muscle.id === muscleId))
        .filter((muscle): muscle is MuscleOption => Boolean(muscle));
    const selectableMuscleOptions = muscleOptions.filter((muscle) => !selectedMuscleIdSet.has(muscle.id));

    useEffect(() => {
        if (selectableExerciseOptions.length === 0) {
            if (exerciseToAddId) {
                setExerciseToAddId("");
            }
            return;
        }

        const currentSelectedStillAvailable = selectableExerciseOptions
            .some((exercise) => String(exercise.id) === exerciseToAddId);

        if (!currentSelectedStillAvailable) {
            setExerciseToAddId(String(selectableExerciseOptions[0].id));
        }
    }, [exerciseToAddId, selectableExerciseOptions]);

    useEffect(() => {
        if (selectableMuscleOptions.length === 0) {
            if (muscleToAddId) {
                setMuscleToAddId("");
            }
            return;
        }

        const currentSelectedStillAvailable = selectableMuscleOptions
            .some((muscle) => String(muscle.id) === muscleToAddId);

        if (!currentSelectedStillAvailable) {
            setMuscleToAddId(String(selectableMuscleOptions[0].id));
        }
    }, [muscleToAddId, selectableMuscleOptions]);

    useEffect(() => {
        if (!selectedExerciseForModal) return;

        setExerciseDetails(null);
        setExerciseDetailsError(null);
        setExerciseSaveError(null);
        setEditExerciseName(selectedExerciseForModal.name);
        setEditExerciseDescription("");
        setEditExerciseDifficulty("");
        setEditExerciseVideoUrl("");

        if (typeof selectedExerciseForModal.id !== "number" || !onLoadExercise) return;

        let active = true;
        const loadExercise = async () => {
            try {
                setExerciseDetailsLoading(true);
                const details = await onLoadExercise(selectedExerciseForModal.id as number);
                if (!active) return;

                setExerciseDetails(details);
                setEditExerciseName(details.name ?? selectedExerciseForModal.name);
                setEditExerciseDescription(details.description ?? "");
                setEditExerciseDifficulty(details.difficulty ?? "");
                setEditExerciseVideoUrl(details.videoUrl ?? "");
            } catch (error) {
                if (!active) return;
                const message = error instanceof Error ? error.message : "Failed to load exercise details.";
                setExerciseDetailsError(message);
            } finally {
                if (active) {
                    setExerciseDetailsLoading(false);
                }
            }
        };

        void loadExercise();
        return () => {
            active = false;
        };
    }, [onLoadExercise, selectedExerciseForModal]);

    const handleAddExercise = () => {
        const nextExerciseId = Number(exerciseToAddId);
        if (!Number.isFinite(nextExerciseId)) return;
        if (selectedExerciseIdSet.has(nextExerciseId)) return;

        onExerciseIdsChange?.([...selectedExerciseIds, nextExerciseId]);
    };

    const openCreateExerciseModal = () => {
        setCreateExerciseError(null);
        setSelectedMuscleIds([]);
        setShowCreateExerciseModal(true);
    };

    const closeCreateExerciseModal = () => {
        if (creatingExercise) return;
        setShowCreateExerciseModal(false);
        setCreateExerciseError(null);
        setNewExerciseName("");
        setNewExerciseDescription("");
        setNewExerciseDifficulty("");
        setNewExerciseVideoUrl("");
        setSelectedMuscleIds([]);
        setMuscleToAddId("");
    };

    const handleAddMuscle = () => {
        const nextMuscleId = Number(muscleToAddId);
        if (!Number.isFinite(nextMuscleId)) return;
        if (selectedMuscleIdSet.has(nextMuscleId)) return;

        setSelectedMuscleIds((prev) => [...prev, nextMuscleId]);
    };

    const handleRemoveMuscle = (muscleId: number) => {
        setSelectedMuscleIds((prev) => prev.filter((id) => id !== muscleId));
    };

    const handleCreateExercise = async () => {
        const normalizedName = newExerciseName.trim();
        if (!normalizedName) {
            setCreateExerciseError("Exercise name cannot be empty.");
            return;
        }

        setCreateExerciseError(null);

        try {
            await onCreateExercise?.({
                name: normalizedName,
                description: normalizeOptionalString(newExerciseDescription),
                difficulty: normalizeOptionalString(newExerciseDifficulty),
                videoUrl: normalizeOptionalString(newExerciseVideoUrl),
                muscleIds: selectedMuscleIds,
            });
            closeCreateExerciseModal();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create exercise.";
            setCreateExerciseError(message);
        }
    };

    const handleSaveExercise = async () => {
        if (typeof selectedExerciseForModal?.id !== "number") {
            setExerciseSaveError("This exercise cannot be edited.");
            return;
        }

        const normalizedName = editExerciseName.trim();
        if (!normalizedName) {
            setExerciseSaveError("Exercise name cannot be empty.");
            return;
        }

        const managerOwnsExercise = exerciseDetails?.global === false;
        const useOverride = !managerOwnsExercise;

        setExerciseSaveError(null);
        setExerciseSaving(true);

        try {
            await onSaveExercise?.(
                selectedExerciseForModal.id,
                {
                    name: normalizedName,
                    description: normalizeOptionalString(editExerciseDescription),
                    difficulty: normalizeOptionalString(editExerciseDifficulty),
                    videoUrl: normalizeOptionalString(editExerciseVideoUrl),
                },
                useOverride
            );
            closeExerciseModal();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save exercise.";
            setExerciseSaveError(message);
        } finally {
            setExerciseSaving(false);
        }
    };

    const openExerciseModal = (exercise: { id?: number; name: string }) => {
        setExerciseSaveError(null);
        setExerciseDetailsError(null);
        setSelectedExerciseForModal({
            id: exercise.id,
            name: exercise.name,
        });
    };

    const closeExerciseModal = () => {
        if (exerciseSaving) return;
        setSelectedExerciseForModal(null);
        setExerciseDetails(null);
        setExerciseDetailsError(null);
        setExerciseSaveError(null);
    };

    return (
        <div className={`${containerMode ? 'absolute' : 'fixed'} inset-0 flex items-center justify-center z-40 cursor-pointer ${showEditableFields ? '' : 'select-none'}`} onClick={onClose}>
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm select-none"></div>

            <div
                className="relative z-50 backdrop-blur-2xl border-2 border-white/30 p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg w-[95%] sm:w-11/12 md:w-4/5 h-[90%] sm:h-4/5 cursor-auto overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-red-500 transition-all duration-200 z-10" onClick={onClose}>
                    <RxCross2 className="w-8 h-8 sm:w-12 sm:h-12"/>
                </button>

                {showEditableFields ? (
                    <div className="flex-shrink-0 pr-10">
                        <label htmlFor="machine-name-input" className="sr-only">Equipment name</label>
                        <input
                            id="machine-name-input"
                            className={inputClasses}
                            value={tile.equipment.name}
                            onChange={(e) => onTileChange?.({ name: e.target.value })}
                            placeholder="Equipment name"
                        />
                    </div>
                ) : (
                    <h1 className="text-xl sm:text-2xl md:text-3xl select-none text-white flex-shrink-0 pr-10">{tile.equipment.name}</h1>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 flex-1 min-h-0 overflow-y-auto">
                    <div className="rounded-lg p-3 sm:p-4 row-span-1 text-white bg-black/20 flex flex-col min-h-0">
                        {/* Benefits */}
                        <h3 className="text-xl mb-2 select-none font-semibold flex-shrink-0">List of exercises:</h3>
                        <div className="flex-1 min-h-0 flex flex-col">
                            {showEditableFields ? (
                                <div className="space-y-3 flex flex-col min-h-0 flex-1">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <label htmlFor="machine-exercise-select" className="sr-only">Exercise selector</label>
                                        <select
                                            id="machine-exercise-select"
                                            className={`${inputClasses} pr-8`}
                                            value={exerciseToAddId}
                                            onChange={(event) => setExerciseToAddId(event.target.value)}
                                            disabled={selectableExerciseOptions.length === 0}
                                        >
                                            {selectableExerciseOptions.length === 0 ? (
                                                <option value="">No additional exercises available</option>
                                            ) : (
                                                selectableExerciseOptions.map((exercise) => (
                                                    <option key={exercise.id} value={String(exercise.id)}>
                                                        {exercise.name}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded-md bg-accent-primary text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                            onClick={handleAddExercise}
                                            disabled={!exerciseToAddId || selectableExerciseOptions.length === 0}
                                        >
                                            Add Exercise
                                        </button>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            onClick={openCreateExerciseModal}
                                            disabled={creatingExercise}
                                        >
                                            Create Exercise
                                        </button>
                                    </div>

                                    {selectedExercises.length === 0 ? (
                                        <p className="text-white/70 text-sm">No exercises selected.</p>
                                    ) : (
                                        <ul className="space-y-2 overflow-y-auto min-h-0 flex-1 pr-1 scrollbar-thumb-only">
                                            {selectedExercises.map((exercise) => (
                                                <li key={exercise.id}>
                                                    <button
                                                        type="button"
                                                        className="w-full rounded-md border border-white/30 bg-black/30 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                                        onClick={() => openExerciseModal(exercise)}
                                                    >
                                                        {exercise.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                readOnlyExercises.length === 0 ? (
                                    <p className="text-white/70 text-sm">No exercises listed.</p>
                                ) : (
                                    <ul className="space-y-2 overflow-y-auto min-h-0 flex-1 pr-1 scrollbar-thumb-only">
                                        {readOnlyExercises.map((exercise) => (
                                            <li key={exercise.key}>
                                                <button
                                                    type="button"
                                                    className="w-full rounded-md border border-white/30 bg-black/30 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                                    onClick={() => openExerciseModal(exercise)}
                                                >
                                                    {exercise.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            )}
                        </div>
                    </div>
                    
                    <div className="rounded-lg p-4 text-white bg-black/20 min-h-0">
                        <h3 className="text-xl mb-2 select-none font-semibold">Video</h3>
                        {showEditableFields && (
                            <div className="mb-3">
                                <label htmlFor="machine-video-url" className="sr-only">Video URL</label>
                                <input
                                    id="machine-video-url"
                                    className={inputClasses}
                                    value={tile.equipment.videoUrl ?? ""}
                                    onChange={(e) => onTileChange?.({ videoUrl: e.target.value || undefined })}
                                    placeholder="https://..."
                                />
                            </div>
                        )}
                        <div className="w-full bg-gray-100 rounded-sm text-black aspect-video text-center justify-center flex items-center">
                            {tile.equipment.videoUrl ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={tile.equipment.videoUrl}
                                    title=""
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-sm"
                                ></iframe>
                            ) : (
                                <span className="text-xs">Video preview</span>
                            )}
                        </div>
                    </div>

                </div>

                {editMode && (
                    <div className="mt-3 flex items-center gap-3">
                        <div className="min-h-5 text-sm flex-1">
                            <label htmlFor="machine-out-of-order" className="mb-2 inline-flex items-center gap-2 text-white">
                                <input
                                    id="machine-out-of-order"
                                    type="checkbox"
                                    className="h-4 w-4 accent-accent-primary"
                                    checked={Boolean(tile.outOfOrder)}
                                    onChange={(e) => onOutOfOrderChange?.(e.target.checked)}
                                />
                                Mark as out of order
                            </label>
                            {saveError && <p className="text-red-300">{saveError}</p>}
                            {!saveError && saveSuccess && <p className="text-green-300">{saveSuccess}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
                                onClick={() => setPreviewMode(prev => !prev)}
                            >
                                {previewMode ? "Back to Edit" : "Preview"}
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md bg-accent-primary text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={() => { void onSave?.(); }}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {selectedExerciseForModal && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center cursor-pointer"
                    onClick={(event) => {
                        event.stopPropagation();
                        closeExerciseModal();
                    }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div
                        className="relative z-10 backdrop-blur-2xl border-2 border-white/30 p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg w-[95%] sm:w-11/12 md:w-4/5 h-[88%] sm:h-4/5 cursor-auto overflow-hidden flex flex-col"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            aria-label="Close exercise details"
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-red-500 transition-all duration-200 z-10 disabled:opacity-50"
                            onClick={closeExerciseModal}
                            disabled={exerciseSaving}
                        >
                            <RxCross2 className="w-8 h-8 sm:w-12 sm:h-12" />
                        </button>

                        <h2 className="text-xl sm:text-2xl md:text-3xl text-white flex-shrink-0 pr-10">Exercise Details</h2>
                        <p className="mt-2 text-sm text-white/80">
                            {showEditableFields ? "Edit exercise details." : "Read-only exercise view."}
                        </p>

                        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6 md:grid-cols-2 flex-1 min-h-0 overflow-y-auto">
                            <div className="rounded-lg p-4 text-white bg-black/20 min-h-0 overflow-y-auto scrollbar-thumb-only">
                                <h3 className="text-xl mb-2 font-semibold">Overview</h3>
                                {exerciseDetailsLoading ? (
                                    <p className="text-sm text-white/70">Loading exercise details...</p>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor="edit-exercise-name" className="block text-sm font-medium mb-1">Exercise name</label>
                                            {showEditableFields ? (
                                                <input
                                                    id="edit-exercise-name"
                                                    className={inputClasses}
                                                    value={editExerciseName}
                                                    onChange={(event) => setEditExerciseName(event.target.value)}
                                                />
                                            ) : (
                                                <p className="text-sm">{exerciseDetails?.name ?? selectedExerciseForModal.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="edit-exercise-description" className="block text-sm font-medium mb-1">Description</label>
                                            {showEditableFields ? (
                                                <textarea
                                                    id="edit-exercise-description"
                                                    className={textareaClasses}
                                                    value={editExerciseDescription}
                                                    onChange={(event) => setEditExerciseDescription(event.target.value)}
                                                    placeholder="Exercise description..."
                                                />
                                            ) : (
                                                <p className="text-sm text-white/80">{exerciseDetails?.description ?? "No description."}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="edit-exercise-difficulty" className="block text-sm font-medium mb-1">Difficulty</label>
                                            {showEditableFields ? (
                                                <input
                                                    id="edit-exercise-difficulty"
                                                    className={inputClasses}
                                                    value={editExerciseDifficulty}
                                                    onChange={(event) => setEditExerciseDifficulty(event.target.value)}
                                                    placeholder="e.g. Beginner"
                                                />
                                            ) : (
                                                <p className="text-sm text-white/80">{exerciseDetails?.difficulty ?? "Not specified."}</p>
                                            )}
                                        </div>
                                        {exerciseDetails && (
                                            <p className="text-xs text-white/70">
                                                {exerciseDetails.global
                                                    ? "Not manager-owned exercise: saving uses exercise override."
                                                    : "Manager-owned exercise: saving updates it directly."}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {exerciseDetailsError && (
                                    <p className="mt-3 text-sm text-red-300">
                                        Could not load exercise details: {exerciseDetailsError}
                                    </p>
                                )}
                                {exerciseSaveError && (
                                    <p className="mt-3 text-sm text-red-300">
                                        {exerciseSaveError}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg p-4 text-white bg-black/20 min-h-0 overflow-y-auto scrollbar-thumb-only">
                                <h3 className="text-xl mb-2 font-semibold">Video</h3>
                                {showEditableFields && (
                                    <div className="mb-3">
                                        <label htmlFor="edit-exercise-video-url" className="block text-sm font-medium mb-1">Video URL</label>
                                        <input
                                            id="edit-exercise-video-url"
                                            className={inputClasses}
                                            value={editExerciseVideoUrl}
                                            onChange={(event) => setEditExerciseVideoUrl(event.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                )}
                                <div className="w-full bg-gray-100 rounded-sm text-black aspect-video text-center justify-center flex items-center">
                                    {(showEditableFields ? editExerciseVideoUrl : (exerciseDetails?.videoUrl ?? "")) ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={showEditableFields ? editExerciseVideoUrl : (exerciseDetails?.videoUrl ?? "")}
                                            title={`Exercise video for ${selectedExerciseForModal.name}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="rounded-sm"
                                        ></iframe>
                                    ) : (
                                        <span className="text-xs">No video available</span>
                                    )}
                                </div>

                                <h3 className="text-xl mt-4 mb-2 font-semibold">Muscles</h3>
                                {(exerciseDetails?.muscles ?? []).length === 0 ? (
                                    <p className="text-sm text-white/70">No muscle data available.</p>
                                ) : (
                                    <ul className="list-disc list-outside pl-5 space-y-2 text-sm">
                                        {exerciseDetails?.muscles.map((muscle, idx) => (
                                            <li key={`${muscle}-${idx}`}>{muscle}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
                                onClick={closeExerciseModal}
                                disabled={exerciseSaving}
                            >
                                {showEditableFields ? "Cancel" : "Close"}
                            </button>
                            {showEditableFields && (
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-md bg-accent-primary text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => { void handleSaveExercise(); }}
                                    disabled={!onSaveExercise || exerciseSaving || exerciseDetailsLoading || typeof selectedExerciseForModal.id !== "number"}
                                >
                                    {exerciseSaving ? "Saving..." : "Save Exercise"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showCreateExerciseModal && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer"
                    onClick={(event) => {
                        event.stopPropagation();
                        closeCreateExerciseModal();
                    }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div
                        className="relative z-10 backdrop-blur-2xl border-2 border-white/30 p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg w-[95%] sm:w-11/12 md:w-4/5 h-[88%] sm:h-4/5 cursor-auto overflow-hidden flex flex-col"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-red-500 transition-all duration-200 z-10 disabled:opacity-50"
                            onClick={closeCreateExerciseModal}
                            disabled={creatingExercise}
                        >
                            <RxCross2 className="w-8 h-8 sm:w-12 sm:h-12" />
                        </button>

                        <h2 className="text-xl sm:text-2xl md:text-3xl text-white flex-shrink-0 pr-10">Create Exercise</h2>
                        <p className="mt-2 text-sm text-white/80">
                            This will create a manager-owned exercise linked to <strong>{tile.equipment.name}</strong>.
                        </p>

                        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6 md:grid-cols-2 flex-1 min-h-0 overflow-y-auto">
                            <div className="rounded-lg p-4 text-white bg-black/20 min-h-0 overflow-y-auto scrollbar-thumb-only">
                                <h3 className="text-xl mb-2 font-semibold">Linked Machine</h3>
                                <ul className="list-disc list-outside pl-5 space-y-2 text-sm">
                                    <li>Machine: {tile.equipment.name}</li>
                                    <li>Equipment type ID: {tile.equipmentTypeId ?? "Unknown"}</li>
                                    <li>Exercise will be created for your signed-in manager account.</li>
                                    <li>Selected muscles: {selectedMuscleIds.length}</li>
                                </ul>
                            </div>

                            <div className="rounded-lg p-4 text-white bg-black/20 min-h-0 overflow-y-auto scrollbar-thumb-only">
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="create-exercise-name" className="block text-sm font-medium mb-1">Exercise name</label>
                                        <input
                                            id="create-exercise-name"
                                            className={inputClasses}
                                            value={newExerciseName}
                                            onChange={(event) => setNewExerciseName(event.target.value)}
                                            placeholder="e.g. Incline Cable Fly"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="create-exercise-description" className="block text-sm font-medium mb-1">Description (optional)</label>
                                        <textarea
                                            id="create-exercise-description"
                                            className={textareaClasses}
                                            value={newExerciseDescription}
                                            onChange={(event) => setNewExerciseDescription(event.target.value)}
                                            placeholder="Exercise description..."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="create-exercise-difficulty" className="block text-sm font-medium mb-1">Difficulty (optional)</label>
                                        <input
                                            id="create-exercise-difficulty"
                                            className={inputClasses}
                                            value={newExerciseDifficulty}
                                            onChange={(event) => setNewExerciseDifficulty(event.target.value)}
                                            placeholder="e.g. Beginner"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="create-exercise-video" className="block text-sm font-medium mb-1">Video URL (optional)</label>
                                        <input
                                            id="create-exercise-video"
                                            className={inputClasses}
                                            value={newExerciseVideoUrl}
                                            onChange={(event) => setNewExerciseVideoUrl(event.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Muscles Trained</h4>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <label htmlFor="create-exercise-muscle-select" className="sr-only">Muscle selector</label>
                                            <select
                                                id="create-exercise-muscle-select"
                                                className={`${inputClasses} pr-8`}
                                                value={muscleToAddId}
                                                onChange={(event) => setMuscleToAddId(event.target.value)}
                                                disabled={musclesLoading || Boolean(muscleLoadError) || selectableMuscleOptions.length === 0}
                                            >
                                                {musclesLoading ? (
                                                    <option value="">Loading muscles...</option>
                                                ) : muscleLoadError ? (
                                                    <option value="">Unable to load muscles</option>
                                                ) : selectableMuscleOptions.length === 0 ? (
                                                    <option value="">
                                                        {muscleOptions.length === 0
                                                            ? "No muscles available from backend"
                                                            : "No additional muscles available"}
                                                    </option>
                                                ) : (
                                                    selectableMuscleOptions.map((muscle) => (
                                                        <option key={muscle.id} value={String(muscle.id)}>
                                                            {muscle.name}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                                onClick={handleAddMuscle}
                                                disabled={musclesLoading || Boolean(muscleLoadError) || !muscleToAddId || selectableMuscleOptions.length === 0}
                                            >
                                                Add Muscle
                                            </button>
                                        </div>
                                        {musclesLoading && (
                                            <p className="mt-2 text-sm text-white/70">
                                                Loading muscle options...
                                            </p>
                                        )}
                                        {muscleLoadError && (
                                            <p className="mt-2 text-sm text-red-300">
                                                Could not load muscles: {muscleLoadError}
                                            </p>
                                        )}
                                        <div className="mt-2">
                                            {selectedMuscles.length === 0 ? (
                                                <p className="text-sm text-white/70">No muscles selected.</p>
                                            ) : (
                                                <ul className="list-disc list-outside pl-5 space-y-1">
                                                    {selectedMuscles.map((muscle) => (
                                                        <li key={muscle.id} className="flex items-center justify-between gap-2">
                                                            <span>{muscle.name}</span>
                                                            <button
                                                                type="button"
                                                                className="rounded-md border border-white/30 px-2 py-0.5 text-xs hover:bg-white/10 transition-colors"
                                                                onClick={() => handleRemoveMuscle(muscle.id)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
                            <div className="min-h-5 text-sm text-red-300 flex-1">
                                {createExerciseError}
                            </div>
                            <div className="flex items-center gap-2 sm:justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={closeCreateExerciseModal}
                                    disabled={creatingExercise}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-md bg-accent-primary text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => { void handleCreateExercise(); }}
                                    disabled={creatingExercise}
                                >
                                    {creatingExercise ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MachineModal;
