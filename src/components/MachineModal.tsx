import { useEffect, useMemo, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import type { TileData } from "../types/tile";
import type { EquipmentProps } from "../types/equipment";

interface MachineModalProps {
    tile: TileData;
    onClose: () => void;
    containerMode?: boolean;
    editMode?: boolean;
    onTileChange?: (equipmentUpdates: Partial<EquipmentProps>) => void;
    onExerciseIdsChange?: (exerciseIds: number[]) => void;
    onCreateExercise?: (name: string) => Promise<void> | void;
    creatingExercise?: boolean;
    onOutOfOrderChange?: (outOfOrder: boolean) => void;
    onSave?: () => Promise<void> | void;
    saving?: boolean;
    saveError?: string | null;
    saveSuccess?: string | null;
}

const parseMultilineList = (value: string): string[] => {
    return value
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);
};

function MachineModal({
    tile,
    onClose,
    containerMode = false,
    editMode = false,
    onTileChange,
    onExerciseIdsChange,
    onCreateExercise,
    creatingExercise = false,
    onOutOfOrderChange,
    onSave,
    saving = false,
    saveError = null,
    saveSuccess = null,
}: MachineModalProps) {
    const [previewMode, setPreviewMode] = useState(false);
    const [exerciseToAddId, setExerciseToAddId] = useState("");
    const [newExerciseName, setNewExerciseName] = useState("");
    const [createExerciseError, setCreateExerciseError] = useState<string | null>(null);
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
    const selectableExerciseOptions = (tile.exerciseOptions ?? [])
        .filter((exercise) => !selectedExerciseIdSet.has(exercise.id));

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

    const handleAddExercise = () => {
        const nextExerciseId = Number(exerciseToAddId);
        if (!Number.isFinite(nextExerciseId)) return;
        if (selectedExerciseIdSet.has(nextExerciseId)) return;

        onExerciseIdsChange?.([...selectedExerciseIds, nextExerciseId]);
    };

    const handleCreateExercise = async () => {
        const normalizedName = newExerciseName.trim();
        if (!normalizedName) {
            setCreateExerciseError("Exercise name cannot be empty.");
            return;
        }

        setCreateExerciseError(null);

        try {
            await onCreateExercise?.(normalizedName);
            setNewExerciseName("");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create exercise.";
            setCreateExerciseError(message);
        }
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

                <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2 flex-1 min-h-0 overflow-y-auto">
                    <div className="flex flex-col row-span-1 md:row-span-2 items-center justify-center bg-black/20 rounded-lg p-3 sm:p-4 min-h-0">
                        {/* Equipment image */}
                        <div className="bg-black/20 rounded-lg flex flex-col items-center justify-center w-full aspect-square flex-shrink-0 max-h-48 sm:max-h-none">
                            {tile.equipment.icon && (
                                <tile.equipment.icon className="w-12 h-12 sm:w-20 sm:h-20 mb-2 sm:mb-4 text-white" />
                            )}
                        </div>
                        {/* Equipment description */}
                        <div className="w-full mt-4 p-2 text-white overflow-y-auto flex-1 min-h-0 scrollbar-thumb-only">
                            <h3 className="text-xl mb-2 select-none font-semibold">Description</h3>
                            {showEditableFields ? (
                                <textarea
                                    className={textareaClasses}
                                    value={tile.equipment.description ?? ""}
                                    onChange={(e) => onTileChange?.({ description: e.target.value || undefined })}
                                    placeholder="Add a description..."
                                />
                            ) : (
                                <p className="select-none">{tile.equipment.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg p-3 sm:p-4 row-span-1 md:row-span-2 text-white bg-black/20 flex flex-col min-h-0">
                        {/* Benefits */}
                        <h3 className="text-xl mb-2 select-none font-semibold flex-shrink-0">List of exercises:</h3>
                        <div className="overflow-y-auto flex-1 min-h-0 scrollbar-thumb-only">
                            {showEditableFields ? (
                                <div className="space-y-3">
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
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <label htmlFor="machine-create-exercise-input" className="sr-only">Create exercise name</label>
                                        <input
                                            id="machine-create-exercise-input"
                                            className={inputClasses}
                                            value={newExerciseName}
                                            onChange={(event) => setNewExerciseName(event.target.value)}
                                            placeholder="New exercise name"
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            onClick={() => { void handleCreateExercise(); }}
                                            disabled={creatingExercise}
                                        >
                                            {creatingExercise ? "Creating..." : "Create Exercise"}
                                        </button>
                                    </div>
                                    {createExerciseError && (
                                        <p className="text-red-300 text-sm">{createExerciseError}</p>
                                    )}

                                    {selectedExercises.length === 0 ? (
                                        <p className="text-white/70 text-sm">No exercises selected.</p>
                                    ) : (
                                        <ul className="list-disc list-outside pl-5 space-y-2">
                                            {selectedExercises.map((exercise) => (
                                                <li key={exercise.id}>{exercise.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <ul className="list-disc list-outside pl-5 space-y-2">
                                    {tile.equipment.benefits?.map((benefit: string, idx: number) => (
                                        <li key={idx}>{benefit}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    
                    <div className="rounded-lg p-4 overflow-y-auto text-white bg-black/20 min-h-0 scrollbar-thumb-only">
                        {/* Muscles trained */}
                        <h3 className="text-xl mb-2 select-none font-semibold">Muscles trained</h3>
                        {showEditableFields ? (
                            <textarea
                                key={`muscles-${tile.id}`}
                                className={textareaClasses}
                                defaultValue={(tile.equipment.musclesTargeted ?? []).join("\n")}
                                onChange={(e) => onTileChange?.({ musclesTargeted: parseMultilineList(e.target.value) })}
                                placeholder={"One muscle group per line\nExample:\nBack\nBiceps"}
                            />
                        ) : (
                            <ul className="list-disc list-outside pl-5 space-y-2">
                                {tile.equipment.musclesTargeted?.map((muscle: string, idx: number) => (
                                    <li key={idx}>{muscle}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    <div className="rounded-lg p-4 overflow-y-auto text-white bg-black/20 min-h-0 scrollbar-thumb-only">
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
        </div>
    );
}

export default MachineModal;
