import { useEffect, useMemo, useState } from "react";
import { RxCross2 } from "react-icons/rx";

export interface CreateExerciseDraft {
    name: string;
    description?: string;
    videoUrl?: string;
    difficulty?: string;
    muscleIds: number[];
}

interface MuscleOption {
    id: number;
    name: string;
}

interface CreateExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateExercise?: (exercise: CreateExerciseDraft) => Promise<void> | void;
    creatingExercise?: boolean;
    muscleOptions?: MuscleOption[];
    musclesLoading?: boolean;
    muscleLoadError?: string | null;
    tileName: string;
    tileEquipmentTypeId?: number;
}

const INPUT_CLASSES = "w-full rounded-md border border-white/30 bg-black/30 px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent-primary";
const TEXTAREA_CLASSES = `${INPUT_CLASSES} resize-y min-h-[120px]`;

const normalizeOptionalString = (value: string): string | undefined => {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
};

function CreateExerciseModal({
    isOpen,
    onClose,
    onCreateExercise,
    creatingExercise = false,
    muscleOptions = [],
    musclesLoading = false,
    muscleLoadError = null,
    tileName,
    tileEquipmentTypeId,
}: CreateExerciseModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [muscleToAddId, setMuscleToAddId] = useState("");
    const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    const selectedMuscleIdSet = useMemo(() => new Set(selectedMuscleIds), [selectedMuscleIds]);
    const selectedMuscles = selectedMuscleIds
        .map((id) => muscleOptions.find((m) => m.id === id))
        .filter((m): m is MuscleOption => Boolean(m));
    const selectableMuscleOptions = muscleOptions.filter((m) => !selectedMuscleIdSet.has(m.id));

    useEffect(() => {
        if (selectableMuscleOptions.length === 0) {
            if (muscleToAddId) setMuscleToAddId("");
            return;
        }
        if (!selectableMuscleOptions.some((m) => String(m.id) === muscleToAddId)) {
            setMuscleToAddId(String(selectableMuscleOptions[0].id));
        }
    }, [muscleToAddId, selectableMuscleOptions]);

    useEffect(() => {
        if (isOpen) {
            setName("");
            setDescription("");
            setDifficulty("");
            setVideoUrl("");
            setSelectedMuscleIds([]);
            setMuscleToAddId("");
            setError(null);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (creatingExercise) return;
        onClose();
    };

    const handleAddMuscle = () => {
        const id = Number(muscleToAddId);
        if (!Number.isFinite(id) || selectedMuscleIdSet.has(id)) return;
        setSelectedMuscleIds((prev) => [...prev, id]);
    };

    const handleRemoveMuscle = (muscleId: number) => {
        setSelectedMuscleIds((prev) => prev.filter((id) => id !== muscleId));
    };

    const handleCreate = async () => {
        const normalizedName = name.trim();
        if (!normalizedName) {
            setError("Exercise name cannot be empty.");
            return;
        }
        setError(null);
        try {
            await onCreateExercise?.({
                name: normalizedName,
                description: normalizeOptionalString(description),
                difficulty: normalizeOptionalString(difficulty),
                videoUrl: normalizeOptionalString(videoUrl),
                muscleIds: selectedMuscleIds,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create exercise.");
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer" onClick={e => { e.stopPropagation(); handleClose(); }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl w-[95%] sm:w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl h-[88%] sm:h-4/5 cursor-auto overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white/70 hover:text-red-400 transition-colors duration-200 z-10 disabled:opacity-50" onClick={handleClose} disabled={creatingExercise}>
                    <RxCross2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <div className="flex-shrink-0 pr-12">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Create Exercise</h2>
                    <p className="mt-1 text-sm text-white/60">New exercise for <strong className="text-white/80">{tileName}</strong></p>
                </div>
                <div className="h-px bg-white/10 my-4 flex-shrink-0" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thumb-only">
                    <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10 min-h-0 overflow-y-auto scrollbar-thumb-only">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3">Exercise Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="create-exercise-name" className="block text-sm font-medium text-white/70 mb-1">Exercise name</label>
                                <input id="create-exercise-name" className={INPUT_CLASSES} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Incline Cable Fly" />
                            </div>
                            <div>
                                <label htmlFor="create-exercise-description" className="block text-sm font-medium text-white/70 mb-1">Description <span className="text-white/40">(optional)</span></label>
                                <textarea id="create-exercise-description" className={TEXTAREA_CLASSES} value={description} onChange={e => setDescription(e.target.value)} placeholder="Exercise description..." />
                            </div>
                            <div>
                                <label htmlFor="create-exercise-difficulty" className="block text-sm font-medium text-white/70 mb-1">Difficulty <span className="text-white/40">(optional)</span></label>
                                <input id="create-exercise-difficulty" className={INPUT_CLASSES} value={difficulty} onChange={e => setDifficulty(e.target.value)} placeholder="e.g. Beginner" />
                            </div>
                            <div>
                                <label htmlFor="create-exercise-video" className="block text-sm font-medium text-white/70 mb-1">Video URL <span className="text-white/40">(optional)</span></label>
                                <input id="create-exercise-video" className={INPUT_CLASSES} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 min-h-0">
                        <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10 min-h-0 overflow-y-auto scrollbar-thumb-only">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3">Muscles Trained</h3>
                            <div className="flex flex-col sm:flex-row gap-2 mb-3">
                                <label htmlFor="create-exercise-muscle-select" className="sr-only">Muscle selector</label>
                                <select id="create-exercise-muscle-select" className={`${INPUT_CLASSES} pr-8 flex-1`} value={muscleToAddId} onChange={e => setMuscleToAddId(e.target.value)} disabled={musclesLoading || Boolean(muscleLoadError) || selectableMuscleOptions.length === 0}>
                                    {musclesLoading ? (
                                        <option value="">Loading muscles...</option>
                                    ) : muscleLoadError ? (
                                        <option value="">Unable to load muscles</option>
                                    ) : selectableMuscleOptions.length === 0 ? (
                                        <option value="">{muscleOptions.length === 0 ? "No muscles available from backend" : "No additional muscles available"}</option>
                                    ) : (
                                        selectableMuscleOptions.map((muscle) => (
                                            <option key={muscle.id} value={String(muscle.id)}>{muscle.name}</option>
                                        ))
                                    )}
                                </select>
                                <button type="button" className="px-3 py-2 rounded-lg border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" onClick={handleAddMuscle} disabled={musclesLoading || Boolean(muscleLoadError) || !muscleToAddId || selectableMuscleOptions.length === 0}>Add Muscle</button>
                            </div>
                            {musclesLoading && (<p className="text-sm text-white/50">Loading muscle options...</p>)}
                            {muscleLoadError && (<p className="text-sm text-red-300 bg-red-500/10 rounded-lg px-3 py-2 border border-red-400/20">Could not load muscles: {muscleLoadError}</p>)}
                            <div className="mt-2">
                                {selectedMuscles.length === 0 ? (
                                    <p className="text-sm text-white/50">No muscles selected.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMuscles.map((muscle) => (
                                            <span key={muscle.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                                                {muscle.name}
                                                <button type="button" className="hover:text-red-300 transition-colors" onClick={() => handleRemoveMuscle(muscle.id)} aria-label={`Remove ${muscle.name}`}><RxCross2 className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3">Linked Machine</h3>
                            <div className="space-y-2 text-sm text-white/70">
                                <p><span className="text-white/50">Machine:</span> {tileName}</p>
                                <p><span className="text-white/50">Equipment type:</span> {tileEquipmentTypeId ?? "Unknown"}</p>
                                <p className="text-xs text-white/50 mt-2">This exercise will be created for your manager account.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-white/10 mt-4 mb-3 flex-shrink-0" />
                <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                    <div className="min-h-5 text-sm text-red-300 flex-1">
                        {error && (<span className="bg-red-500/10 rounded-lg px-3 py-1.5 border border-red-400/20 inline-block">{error}</span>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" className="px-4 py-2 rounded-lg border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleClose} disabled={creatingExercise}>Cancel</button>
                        <button type="button" className="px-5 py-2 rounded-lg bg-accent-primary text-white text-sm font-semibold hover:bg-accent-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { void handleCreate(); }} disabled={creatingExercise}>{creatingExercise ? "Creating..." : "Create"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateExerciseModal;
