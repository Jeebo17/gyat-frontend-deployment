import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import type { ExerciseDTO } from "../types/api";

export interface ExerciseEditDraft {
    name: string;
    description?: string;
    videoUrl?: string;
    difficulty?: string;
}

interface ExerciseDetailsModalProps {
    exercise: { id?: number; name: string; details?: ExerciseDTO } | null;
    onClose: () => void;
    onLoadExercise?: (exerciseId: number) => Promise<ExerciseDTO>;
    onSaveExercise?: (exerciseId: number, draft: ExerciseEditDraft, useOverride: boolean) => Promise<void> | void;
    showEditableFields: boolean;
}

const INPUT_CLASSES = "w-full rounded-md border border-white/30 bg-black/30 px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent-primary";
const TEXTAREA_CLASSES = `${INPUT_CLASSES} resize-y min-h-[120px]`;

const normalizeOptionalString = (value: string): string | undefined => {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
};

const getEmbeddableVideoUrl = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
        const parsed = new URL(trimmed);
        const hostname = parsed.hostname.replace(/^www\./, "");

        if (hostname === "youtu.be") {
            const videoId = parsed.pathname.split("/").filter(Boolean)[0];
            return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : trimmed;
        }

        if (hostname === "youtube.com" || hostname.endsWith(".youtube.com")) {
            if (parsed.pathname.startsWith("/embed/")) {
                return trimmed;
            }

            let videoId = parsed.searchParams.get("v");
            if (!videoId && parsed.pathname.startsWith("/shorts/")) {
                videoId = parsed.pathname.split("/").filter(Boolean)[1];
            }

            return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : trimmed;
        }
    } catch {
        return trimmed;
    }

    return trimmed;
};

function ExerciseDetailsModal({
    exercise,
    onClose,
    onLoadExercise,
    onSaveExercise,
    showEditableFields,
}: ExerciseDetailsModalProps) {
    const [details, setDetails] = useState<ExerciseDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDifficulty, setEditDifficulty] = useState("");
    const [editVideoUrl, setEditVideoUrl] = useState("");

    useEffect(() => {
        if (!exercise) return;

        const initialDetails = exercise.details ?? null;
        setDetails(initialDetails);
        setLoading(false);
        setLoadError(null);
        setSaveError(null);
        setEditName(initialDetails?.name ?? exercise.name);
        setEditDescription(initialDetails?.description ?? "");
        setEditDifficulty(initialDetails?.difficulty ?? "");
        setEditVideoUrl(initialDetails?.videoUrl ?? "");

        if (typeof exercise.id !== "number" || !onLoadExercise) return;

        let active = true;
        const load = async () => {
            try {
                setLoading(true);
                const data = await onLoadExercise(exercise.id as number);
                setEditName(data.name ?? exercise.name);
                setEditDescription(data.description ?? "");
                setEditDifficulty(data.difficulty ?? "");
                setEditVideoUrl(data.videoUrl ?? "");
            } catch (err) {
                if (!active) return;
                setLoadError(err instanceof Error ? err.message : "Failed to load exercise details.");
            } finally {
                if (active) setLoading(false);
            }
        };

        void load();
        return () => { active = false; };
    }, [exercise, onLoadExercise]);

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    const handleSave = async () => {
        if (typeof exercise?.id !== "number") {
            setSaveError("This exercise cannot be edited.");
            return;
        }

        const normalizedName = editName.trim();
        if (!normalizedName) {
            setSaveError("Exercise name cannot be empty.");
            return;
        }

        const managerOwnsExercise = details?.global === false;
        const useOverride = !managerOwnsExercise;

        setSaveError(null);
        setSaving(true);

        try {
            await onSaveExercise?.(
                exercise.id,
                {
                    name: normalizedName,
                    description: normalizeOptionalString(editDescription),
                    difficulty: normalizeOptionalString(editDifficulty),
                    videoUrl: normalizeOptionalString(editVideoUrl),
                },
                useOverride
            );
            onClose();
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Failed to save exercise.");
        } finally {
            setSaving(false);
        }
    };

    if (!exercise) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto py-4 sm:py-6 cursor-pointer" onClick={e => { e.stopPropagation(); handleClose(); }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl w-[95%] sm:w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl max-h-[88vh] sm:max-h-[86vh] cursor-auto overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button aria-label="Close exercise details" className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white/70 hover:text-red-400 transition-colors duration-200 z-10 disabled:opacity-50" onClick={handleClose} disabled={saving}>
                    <RxCross2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <div className="flex-shrink-0 pr-12">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Exercise Details</h2>
                    <p className="mt-1 text-sm text-white/60">{showEditableFields ? "Edit exercise details." : "Read-only exercise view."}</p>
                </div>
                <div className="h-px bg-white/10 my-4 flex-shrink-0" />
                <div className="flex flex-col gap-4 sm:gap-5 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thumb-only">
                    <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10 shrink-0">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3">Overview</h3>
                        {loading ? (
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Loading exercise details...
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {showEditableFields ? (
                                    <div>
                                        <label htmlFor="edit-exercise-name" className="block text-sm font-medium text-white/70 mb-1">Exercise name</label>
                                        <input id="edit-exercise-name" className={INPUT_CLASSES} value={editName} onChange={e => setEditName(e.target.value)} />
                                    </div>
                                ) : (
                                    <div>
                                        <span className="block text-sm font-medium text-white/70 mb-1">Name</span>
                                        <p className="text-white">{details?.name ?? exercise?.name}</p>
                                    </div>
                                )}
                                {(showEditableFields || details?.description) && (
                                    <div>
                                        {showEditableFields ? (
                                            <>
                                                <label htmlFor="edit-exercise-description" className="block text-sm font-medium text-white/70 mb-1">Description</label>
                                                <textarea id="edit-exercise-description" className={TEXTAREA_CLASSES} value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Exercise description..." />
                                            </>
                                        ) : (
                                            <>
                                                <span className="block text-sm font-medium text-white/70 mb-1">Description</span>
                                                <p className="text-sm text-white/80 leading-relaxed">{details?.description}</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                {(showEditableFields || details?.difficulty) && (
                                    <div>
                                        {showEditableFields ? (
                                            <>
                                                <label htmlFor="edit-exercise-difficulty" className="block text-sm font-medium text-white/70 mb-1">Difficulty</label>
                                                <input id="edit-exercise-difficulty" className={INPUT_CLASSES} value={editDifficulty} onChange={e => setEditDifficulty(e.target.value)} placeholder="e.g. Beginner" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="block text-sm font-medium text-white/70 mb-1">Difficulty</span>
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">{details?.difficulty}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                                {showEditableFields && details && (
                                    <p className="text-xs text-white/50 bg-white/5 rounded-lg px-3 py-2 border border-white/10">{details.global ? "This is a preset exercise. Saving creates an override for your gym." : "You created this exercise. Saving updates it directly."}</p>
                                )}
                            </div>
                        )}
                        {loadError && (<p className="mt-3 text-sm text-red-300 bg-red-500/10 rounded-lg px-3 py-2 border border-red-400/20">Could not load exercise details: {loadError}</p>)}
                        {saveError && (<p className="mt-3 text-sm text-red-300 bg-red-500/10 rounded-lg px-3 py-2 border border-red-400/20">{saveError}</p>)}
                    </div>
                    <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10 shrink-0">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3">Muscles</h3>
                        {(details?.muscles ?? []).length === 0 ? (
                            <p className="text-sm text-white/50">No muscle data available.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {details?.muscles.map((muscle, idx) => (
                                    <span key={`${muscle}-${idx}`} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent-primary/20 text-accent-primary border border-accent-primary/30">{muscle.name}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="rounded-xl p-4 text-white bg-white/5 border border-white/10 shrink-0">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3">Video</h3>
                        {showEditableFields && (
                            <div className="mb-3">
                                <label htmlFor="edit-exercise-video-url" className="block text-sm font-medium text-white/70 mb-1">Video URL</label>
                                <input id="edit-exercise-video-url" className={INPUT_CLASSES} value={editVideoUrl} onChange={e => setEditVideoUrl(e.target.value)} placeholder="https://..." />
                            </div>
                        )}
                        <div className="w-full max-h-[42vh] bg-black/30 rounded-xl text-white aspect-video flex items-center justify-center overflow-hidden border border-white/10">
                            {(showEditableFields ? editVideoUrl : (details?.videoUrl ?? "")) ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={getEmbeddableVideoUrl(showEditableFields ? editVideoUrl : (details?.videoUrl ?? ""))}
                                    title={`Exercise video for ${exercise?.name}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="block rounded-xl"
                                />
                            ) : (
                                <span className="text-sm text-white/40">No video available</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="h-px bg-white/10 mt-4 mb-3 flex-shrink-0" />
                <div className="flex items-center justify-end gap-2 flex-shrink-0">
                    <button type="button" className="px-4 py-2 rounded-lg border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50" onClick={handleClose} disabled={saving}>{showEditableFields ? "Cancel" : "Close"}</button>
                    {showEditableFields && (
                        <button type="button" className="px-5 py-2 rounded-lg bg-accent-primary text-white text-sm font-semibold hover:bg-accent-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { void handleSave(); }} disabled={saving || loading || typeof exercise?.id !== "number"}>Save Exercise</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExerciseDetailsModal;
