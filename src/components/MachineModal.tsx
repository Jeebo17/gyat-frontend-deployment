import { useEffect, useMemo, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ExerciseDetailsModal, { type ExerciseEditDraft } from "./ExerciseDetailsModal";
import CreateExerciseModal, { type CreateExerciseDraft } from "./CreateExerciseModal";
import type { TileData } from "../types/tile";
import type { EquipmentProps } from "../types/equipment";
import type { ExerciseDTO } from "../types/api";

export type { CreateExerciseDraft, ExerciseEditDraft };

const PRESET_COLOURS = [
    "EF4444", "F97316", "EAB308", "22C55E", "3B82F6",
    "A855F7", "EC4899", "14B8A6", "6B7280", "1E293B",
];

const ImagePreview = ({ url, name }: { url?: string; name: string }) => (
    <div className="w-full bg-black/30 rounded-xl text-white aspect-video flex items-center justify-center overflow-hidden border border-white/10">
        {url ? (
            <img src={url} alt={`Image for ${name}`} className="w-full h-full object-contain" />
        ) : (
            <div className="flex flex-col items-center gap-2 text-white/40">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span className="text-sm">Image preview</span>
            </div>
        )}
    </div>
);

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
    onColourChange?: (colour: string) => void;
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

function MachineModal({
    tile,
    onClose,
    containerMode = false,
    editMode = false,
    onTileChange,
    onColourChange,
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

    // Keep exercise dropdown in sync
    useEffect(() => {
        if (selectableExerciseOptions.length === 0) {
            if (exerciseToAddId) setExerciseToAddId("");
            return;
        }
        if (!selectableExerciseOptions.some((exercise) => String(exercise.id) === exerciseToAddId)) {
            setExerciseToAddId(String(selectableExerciseOptions[0].id));
        }
    }, [exerciseToAddId, selectableExerciseOptions]);

    const handleAddExercise = () => {
        const nextExerciseId = Number(exerciseToAddId);
        if (!Number.isFinite(nextExerciseId) || selectedExerciseIdSet.has(nextExerciseId)) return;
        onExerciseIdsChange?.([...selectedExerciseIds, nextExerciseId]);
    };

    const openExerciseModal = (exercise: { id?: number; name: string }) => {
        setSelectedExerciseForModal({ id: exercise.id, name: exercise.name });
    };

    const IconComponent = tile.equipment.icon;

    // show equipment info from db
    useEffect(() => {
        console.log("Tile data changed, updating modal state:", tile);
    }, [tile]);

    return (
        <div
            className={`${containerMode ? 'absolute' : 'fixed'} inset-0 flex items-center justify-center z-40 cursor-pointer ${showEditableFields ? '' : 'select-none'}`}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md select-none" />

            <div
                className="relative z-50 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl w-[95%] sm:w-11/12 md:w-4/5 lg:w-3/4 max-w-5xl h-[90%] sm:h-[85%] cursor-auto overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white/70 hover:text-red-400 transition-colors duration-200 z-10"
                    onClick={onClose}
                >
                    <RxCross2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>


                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 pr-12">
                    {IconComponent && (
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0 flex-row">
                        {showEditableFields ? (
                            <>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <label htmlFor="machine-name-input" className="sr-only">Equipment name</label>
                                        <input
                                            id="machine-name-input"
                                            className="w-full text-xl sm:text-2xl md:text-3xl font-bold bg-transparent border-b-2 border-white/30 focus:border-accent-primary text-white placeholder:text-white/40 outline-none pb-1 transition-colors"
                                            value={tile.equipment.name}
                                            onChange={(e) => onTileChange?.({ name: e.target.value })}
                                            placeholder="Equipment name"
                                        />
                                    </div>

                                    {/* Colour selector */}
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {PRESET_COLOURS.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                className={`w-7 h-7 rounded-full border-2 transition-all ${
                                                    tile.colour === c
                                                        ? "border-white scale-110 ring-2 ring-white/40"
                                                        : "border-white/20 hover:border-white/50"
                                                }`}
                                                style={{ backgroundColor: `#${c}` }}
                                                onClick={() => onColourChange?.(c)}
                                                title={`#${c}`}
                                            />
                                        ))}
                                        <div className="relative ml-1">
                                            <input
                                                id="machine-colour-input"
                                                type="color"
                                                className="absolute inset-0 w-7 h-7 opacity-0 cursor-pointer"
                                                value={tile.colour ? `#${tile.colour}` : "#ffffff"}
                                                onChange={(e) => onColourChange?.(e.target.value.replace('#', ''))}
                                                title="Custom colour"
                                            />
                                            <div
                                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center pointer-events-none ${
                                                    !PRESET_COLOURS.includes(tile.colour)
                                                        ? "border-white ring-2 ring-white/40"
                                                        : "border-white/20"
                                                }`}
                                                style={{ backgroundColor: tile.colour ? `#${tile.colour}` : "#ffffff" }}
                                            >
                                                <svg className="w-3.5 h-3.5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                                {tile.equipment.name}
                            </h1>
                        )}
                    </div>
                    {tile.outOfOrder && (
                        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-400/30">
                            Out of Order
                        </span>
                    )}
                </div>


                <div className="h-px bg-white/10 my-4 flex-shrink-0" />

                <div className={`grid ${showEditableFields ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4 sm:gap-5 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thumb-only`}>
                    <div className={`${showEditableFields ? '' : 'md:col-span-1'} flex flex-col gap-4 min-h-0`}>

                        {/* Description Card */}
                        <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-2">Description</h3>
                            {showEditableFields ? (
                                <>
                                    <label htmlFor="machine-description-input" className="sr-only">Equipment description</label>
                                    <textarea
                                        id="machine-description-input"
                                        className={textareaClasses}
                                        value={tile.equipment.description ?? ""}
                                        onChange={(e) => onTileChange?.({ description: e.target.value || undefined })}
                                        placeholder="Describe this equipment..."
                                    />
                                </>
                            ) : (
                                <p className="text-sm text-white/80 leading-relaxed">
                                    {tile.equipment.description || "No description available."}
                                </p>
                            )}
                        </div>

                        {/* Muscles Targeted Card */}
                        <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-2">Muscles trained</h3>
                            {(tile.equipment.musclesTargeted ?? []).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tile.equipment.musclesTargeted!.map((muscle, idx) => (
                                        <span
                                            key={`${muscle}-${idx}`}
                                            className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
                                        >
                                            {muscle}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-white/50">No muscles targeted listed.</p>
                            )}
                        </div>

                        {/* Exercises Card */}
                        <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10 flex flex-col">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3 flex-shrink-0">List of exercises:</h3>
                            <div className="flex flex-col">
                                {showEditableFields ? (
                                    <div className="space-y-3 flex flex-col">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <label htmlFor="machine-exercise-select" className="sr-only">Exercise selector</label>
                                            <select
                                                id="machine-exercise-select"
                                                className={`${inputClasses} pr-8 flex-1`}
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
                                                className="px-3 py-2 rounded-lg bg-accent-primary text-white text-sm font-semibold hover:bg-accent-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                onClick={handleAddExercise}
                                                disabled={!exerciseToAddId || selectableExerciseOptions.length === 0}
                                            >
                                                Add Exercise
                                            </button>
                                        </div>
                                        
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => setShowCreateExerciseModal(true)}
                                                disabled={creatingExercise}
                                            >
                                                Create Exercise
                                            </button>
                                        </div>

                                        {selectedExercises.length === 0 ? (
                                            <p className="text-white/50 text-sm">No exercises selected.</p>
                                        ) : (
                                            <ul className="space-y-1.5 overflow-y-auto min-h-0 flex-1 pr-1 scrollbar-thumb-only">
                                                {selectedExercises.map((exercise) => (
                                                    <li key={exercise.id}>
                                                        <button
                                                            type="button"
                                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white transition-all hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                                        <p className="text-white/50 text-sm">No exercises listed.</p>
                                    ) : (
                                        <ul className="space-y-1.5 overflow-y-auto min-h-0 flex-1 pr-1 scrollbar-thumb-only">
                                            {readOnlyExercises.map((exercise) => (
                                                <li key={exercise.key}>
                                                    <button
                                                        type="button"
                                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white transition-all hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary"
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

                        <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-2">Safety Info</h3>
                            {showEditableFields ? (
                                <>
                                    <label htmlFor="machine-safety-info-input" className="sr-only">Safety Info</label>
                                    <textarea
                                        id="machine-safety-info-input"
                                        className={textareaClasses}
                                        value={tile.equipment.safetyInfo ?? ""}
                                        onChange={(e) => onTileChange?.({ safetyInfo: e.target.value || undefined })}
                                        placeholder="Describe this equipment..."
                                    />
                                </>
                            ) : (
                                <p className="text-sm text-white/80 leading-relaxed">
                                    {tile.equipment.safetyInfo || "No safety information available."}
                                </p>
                            )}
                        </div>


                        {/* Stacked Image Card */}
                        {showEditableFields && (
                            <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10 flex flex-col">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3 flex-shrink-0">Image</h3>
                                <div className="mb-3">
                                    <label htmlFor="machine-image-url" className="sr-only">Image URL</label>
                                    <input
                                        id="machine-image-url"
                                        className={inputClasses}
                                        value={tile.equipment.imageUrl ?? ""}
                                        onChange={(e) => onTileChange?.({ imageUrl: e.target.value || undefined })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <ImagePreview url={tile.equipment.imageUrl} name={tile.equipment.name} />
                            </div>
                        )}
                    </div>

                    
                    {!showEditableFields && (
                        <div className="md:col-span-2 rounded-xl p-4 text-white bg-white/5 border border-white/10 flex flex-col">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3 flex-shrink-0">Image</h3>
                            <ImagePreview url={tile.equipment.imageUrl} name={tile.equipment.name} />
                        </div>
                    )}
                </div>

                {editMode && (
                    <>
                        <div className="h-px bg-white/10 mt-4 mb-3 flex-shrink-0" />
                        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                            <label htmlFor="machine-out-of-order" className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                                <input
                                    id="machine-out-of-order"
                                    type="checkbox"
                                    className="h-4 w-4 accent-accent-primary rounded"
                                    checked={Boolean(tile.outOfOrder)}
                                    onChange={(e) => onOutOfOrderChange?.(e.target.checked)}
                                />
                                Mark as out of order
                            </label>

                            <div className="flex-1 min-h-5 text-sm text-center">
                                {saveError && <p className="text-red-300">{saveError}</p>}
                                {!saveError && saveSuccess && <p className="text-green-300">{saveSuccess}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors"
                                    onClick={() => setPreviewMode((prev) => !prev)}
                                >
                                    {previewMode ? "Back to Edit" : "Preview"}
                                </button>
                                <button
                                    type="button"
                                    className="px-5 py-2 rounded-lg bg-accent-primary text-white text-sm font-semibold hover:bg-accent-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => { void onSave?.(); }}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ExerciseDetailsModal
                exercise={selectedExerciseForModal}
                onClose={() => setSelectedExerciseForModal(null)}
                onLoadExercise={onLoadExercise}
                onSaveExercise={onSaveExercise}
                showEditableFields={showEditableFields}
            />

            <CreateExerciseModal
                isOpen={showCreateExerciseModal}
                onClose={() => setShowCreateExerciseModal(false)}
                onCreateExercise={onCreateExercise}
                creatingExercise={creatingExercise}
                muscleOptions={muscleOptions}
                musclesLoading={musclesLoading}
                muscleLoadError={muscleLoadError}
                tileName={tile.equipment.name}
                tileEquipmentTypeId={tile.equipmentTypeId}
            />
        </div>
    );
}

export default MachineModal;
