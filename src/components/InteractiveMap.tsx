import Tile from "./Tile";
import FloatingEditTray from "./FloatingEditTray.tsx";
import WallTile from "./WallTile";
import { TileData, TileHistoryEntry } from "../types/tile";
import { useState, useRef, useEffect, useCallback } from "react";
import { MachineModal } from '../components/index';
import { type CreateExerciseDraft }  from "../components/MachineModal";
import ZoomControls from "./ZoomControls";
import { useTheme } from "../context/ThemeContext";
import type { TileTemplate } from "../types/tile";
import ShinyText from "./effects/ShinyText";
import { updateComponent, createComponent, deleteComponent } from "../services/componentService";
import { upsertEquipmentTypeOverride } from "../services/equipmentTypeService";
import { createExercise, getExerciseById, updateCustomExercise, upsertExerciseOverride } from "../services/exerciseService";
import { getMuscles } from "../services/muscleService";
import { isStructuralTile, getStructuralDef } from "../constants/structuralComponents";
import type { ExerciseOption } from "../types/tile";
import type { ExerciseDTO, MuscleDTO, UpdateComponentRequest } from "../types/api";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 800;
const PREVIEW_BASE_WIDTH = 1200;
const PREVIEW_BASE_HEIGHT = 800;
const GRID_SIZE = 20;
const CELL_SIZE = 200; // spatial hash cell size (px)

const rectanglesOverlap = (a: TileData, b: TileData) => {
    const aRight = a.xCoord + a.width;
    const aBottom = a.yCoord + a.height;
    const bRight = b.xCoord + b.width;
    const bBottom = b.yCoord + b.height;

    return a.xCoord < bRight && aRight > b.xCoord && a.yCoord < bBottom && aBottom > b.yCoord;
};

const getCellsForTile = (tile: TileData, cellSize = CELL_SIZE) => {
    const cells: string[] = [];
    const startCol = Math.floor(tile.xCoord / cellSize);
    const endCol = Math.floor((tile.xCoord + tile.width) / cellSize);
    const startRow = Math.floor(tile.yCoord / cellSize);
    const endRow = Math.floor((tile.yCoord + tile.height) / cellSize);

    for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
            cells.push(`${col}:${row}`);
        }
    }
    return cells;
};

const buildSpatialIndex = (tiles: TileData[]) => {
    const index = new Map<string, TileData[]>();
    tiles.forEach(tile => {
        getCellsForTile(tile).forEach(cell => {
            if (!index.has(cell)) index.set(cell, []);
            index.get(cell)!.push(tile);
        });
    });
    return index;
};

const normalizeArray = (items?: string[]): string[] | undefined => {
    if (!items) return undefined;
    return items.map((item) => item.trim()).filter(Boolean);
};

const normalizeOptionalString = (value?: string): string | undefined => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
};

const resolveExerciseNames = (tile: TileData, exerciseIds: number[]): string[] => {
    const optionNameById = new Map((tile.exerciseOptions ?? []).map((exercise) => [exercise.id, exercise.name]));
    return exerciseIds.map((exerciseId, index) =>
        optionNameById.get(exerciseId) ?? tile.equipment.benefits?.[index] ?? `Exercise #${exerciseId}`
    );
};

const addExerciseOptionIfMissing = (options: ExerciseOption[] | undefined, nextOption: ExerciseOption): ExerciseOption[] => {
    const current = options ?? [];
    return current.some((option) => option.id === nextOption.id)
        ? current
        : [...current, nextOption];
};

const addExerciseIdIfMissing = (exerciseIds: number[] | undefined, nextExerciseId: number): number[] => {
    const current = exerciseIds ?? [];
    return current.includes(nextExerciseId) ? current : [...current, nextExerciseId];
};

const mergeUniqueStrings = (first: string[] | undefined, second: string[] | undefined): string[] | undefined => {
    const merged = Array.from(new Set([...(first ?? []), ...(second ?? [])].filter(Boolean)));
    return merged.length > 0 ? merged : undefined;
};

const applyExerciseResultToTile = (tile: TileData, exercise: ExerciseDTO): TileData => {
    const nextOptions = (tile.exerciseOptions ?? []).map((option) =>
        option.id === exercise.id
            ? { ...option, name: exercise.name }
            : option
    );
    const exerciseIds = tile.exerciseIds ?? [];
    const updatedTile = { ...tile, exerciseOptions: nextOptions };

    return {
        ...updatedTile,
        equipment: {
            ...updatedTile.equipment,
            benefits: resolveExerciseNames(updatedTile, exerciseIds),
            // imageUrl should not be set from exercise.videoUrl
        },
    };
};

/** Check if a candidate tile collides with any tile in the spatial index. */
const hasCollision = (candidate: TileData, spatialIndex: Map<string, TileData[]>, excludeId?: number): boolean => {
    const visited = new Set<number>();
    return getCellsForTile(candidate).some(cell => {
        const bucket = spatialIndex.get(cell);
        if (!bucket) return false;
        for (const tile of bucket) {
            if (tile.id === excludeId || visited.has(tile.id)) continue;
            visited.add(tile.id);
            if (rectanglesOverlap(candidate, tile)) return true;
        }
        return false;
    });
};

/** Build the API payload for saving a component's position/layout. */
const buildComponentPayload = (tile: TileData): UpdateComponentRequest => ({
    xCoord: tile.xCoord,
    yCoord: tile.yCoord,
    width: tile.width,
    height: tile.height,
    colour: tile.colour,
    rotation: tile.rotation,
    outOfOrder: tile.outOfOrder ?? false,
    additionalInfo: tile.additionalInfo,
});

interface InteractiveMapProps {
    editMode?: boolean;
    snapToGrid?: boolean;
    floorId?: number;
    floorTiles?: TileData[];
    floorLoading?: boolean;
    floorLoadError?: string | null;
    onTilesChange?: (tiles: TileData[]) => void;
    highlightedTileId?: number | null;
    previewMode?: boolean;
    layoutId?: number;
}

function InteractiveMap({
    editMode = false,
    snapToGrid = true,
    floorId,
    floorTiles = [],
    floorLoading = false,
    floorLoadError = null,
    onTilesChange,
    highlightedTileId = null,
    previewMode = false,
    layoutId = undefined,
}: InteractiveMapProps) {
    const [selectedMachine, setSelectedMachine] = useState<TileData | null>(null);
    const [editingTileId, setEditingTileId] = useState<number | null>(null);
    const [isSavingMachine, setIsSavingMachine] = useState(false);
    const [isCreatingExercise, setIsCreatingExercise] = useState(false);
    const [isLoadingMuscles, setIsLoadingMuscles] = useState(false);
    const [availableMuscles, setAvailableMuscles] = useState<MuscleDTO[]>([]);
    const [muscleLoadError, setMuscleLoadError] = useState<string | null>(null);
    const [machineSaveError, setMachineSaveError] = useState<string | null>(null);
    const [machineSaveSuccess, setMachineSaveSuccess] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tiles, setTilesRaw] = useState<TileData[]>([]);
    const pendingUserEditRef = useRef(false);
    const saveTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const onTilesChangeRef = useRef(onTilesChange);
    onTilesChangeRef.current = onTilesChange;

    // Sync tiles from parent when floor data changes
    useEffect(() => {
        setTilesRaw(floorTiles);
        // Immediately rebuild the spatial index so drag-and-drop collision
        // checks don't see phantom tiles from a previous floor.
        spatialIndexRef.current = buildSpatialIndex(floorTiles);
        const maxId = floorTiles.reduce((max, tile) => Math.max(max, tile.id), 0);
        nextIdRef.current = maxId + 1;
    }, [floorTiles]);

    // Notify parent of user-driven tile changes
    useEffect(() => {
        if (pendingUserEditRef.current) {
            pendingUserEditRef.current = false;
            onTilesChangeRef.current?.(tiles);
        }
    }, [tiles]);

    // Wrapped setTiles that marks changes as user-driven edits
    const setTiles = useCallback((action: TileData[] | ((prev: TileData[]) => TileData[])) => {
        pendingUserEditRef.current = true;
        setTilesRaw(action);
    }, []);

    const spatialIndexRef = useRef<Map<string, TileData[]>>(buildSpatialIndex([]));
    const [gridSize, setGridSize] = useState(GRID_SIZE);
    const mapWidth = previewMode ? PREVIEW_BASE_WIDTH : BASE_WIDTH;
    const mapHeight = previewMode ? PREVIEW_BASE_HEIGHT : BASE_HEIGHT;
    const [scale, setScale] = useState(1);
    const [autoScale, setAutoScale] = useState(true);
    const [, setHistory] = useState<TileHistoryEntry[]>([]);
    const nextIdRef = useRef(1);

    const { theme } = useTheme();

    useEffect(() => {
        setGridSize(snapToGrid ? GRID_SIZE : 1);
    }, [snapToGrid]);

    useEffect(() => {
        spatialIndexRef.current = buildSpatialIndex(tiles);
        const maxId = tiles.reduce((max, tile) => Math.max(max, tile.id), 0);
        nextIdRef.current = maxId + 1;
    }, [tiles]);


    useEffect(() => {
        if (!autoScale) return;
        const updateScale = () => {
            if (!containerRef.current) return;

            const container = containerRef.current.parentElement;
            if (!container) return;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scaleX = containerWidth / mapWidth;
            const scaleY = containerHeight / mapHeight;
            const newScale = Math.min(scaleX, scaleY, 1);

            setScale(newScale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [autoScale, mapHeight, mapWidth]);

    // Listen for Ctrl+Z / Cmd+Z to undo the last tile change
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                
                setHistory(prev => {
                    if (prev.length === 0) return prev;
                    const last = prev[prev.length - 1];
                    updateTile(last.id, {
                        xCoord: last.xCoord,
                        yCoord: last.yCoord,
                        width: last.width,
                        height: last.height,
                        rotation: last.rotation,
                        colour: last.colour,
                    });
                    return prev.slice(0, -1);
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const zoomIn = () => {
        setAutoScale(false);
        setScale(prev => Math.min(prev + 0.2, 3));
    };

    const zoomOut = () => {
        setAutoScale(false);
        setScale(prev => Math.max(prev - 0.2, 0.3));
    };

    const resetZoom = () => {
        setAutoScale(true);
    };

    /** Save a single tile's position to the backend (debounced per tile). */
    const saveComponentPosition = useCallback((tile: TileData) => {
        if (!editMode) return;
        const pending = saveTimersRef.current.get(tile.id);
        if (pending) clearTimeout(pending);
        const timeout = setTimeout(() => {
            saveTimersRef.current.delete(tile.id);
            updateComponent(tile.id, buildComponentPayload(tile)).catch((error) => {
                console.error(`Failed to save tile ${tile.id}:`, error);
            });
        }, 500);
        saveTimersRef.current.set(tile.id, timeout);
    }, [editMode]);

    const snap = (value: number) => Math.round(value / gridSize) * gridSize;

    const addTile = useCallback(async (template: TileTemplate, xCoord: number, yCoord: number) => {
        if (!layoutId || !floorId) {
            console.error("Cannot add tile: layoutId or floorId is missing.");
            return;
        }

        const tempId = nextIdRef.current;
        const structDef = getStructuralDef(template.equipmentTypeId);
        const tileWidth = structDef?.defaultWidth ?? template.width;
        const tileHeight = structDef?.defaultHeight ?? template.height;
        const tileColour = structDef?.colour ?? template.colour;
        const candidate: TileData = {
            id: tempId,
            equipmentTypeId: template.equipmentTypeId,
            xCoord: Math.max(0, Math.min(snap(xCoord), mapWidth - tileWidth)),
            yCoord: Math.max(0, Math.min(snap(yCoord), mapHeight - tileHeight)),
            width: tileWidth,
            height: tileHeight,
            rotation: 0,
            outOfOrder: false,
            colour: tileColour,
            equipment: {
                name: structDef?.name ?? template.equipment.name,
                brand: template.equipment.brand,
                icon: template.equipment.icon,
            },
        };

        // Check for collision BEFORE modifying state
        if (hasCollision(candidate, spatialIndexRef.current)) {
            console.warn("Cannot place tile — collides with existing tile:", candidate);
            return;
        }

        // Place the tile locally (optimistic update)
        nextIdRef.current += 1;
        setTiles(prev => {
            const next = [...prev, candidate];
            spatialIndexRef.current = buildSpatialIndex(next);
            return next;
        });

        // Persist to backend
        try {
            const created = await createComponent({
                layoutId,
                equipmentTypeId: template.equipmentTypeId ?? 0,
                floorId,
                xCoord: candidate.xCoord,
                yCoord: candidate.yCoord,
                width: candidate.width,
                height: candidate.height,
                rotation: candidate.rotation,
                additionalInfo: "",
                colour: candidate.colour,
            });

            // Sync the local tile ID with the backend-assigned ID
            setTiles(prev => {
                const next = prev.map(t => t.id === tempId ? { ...t, id: created.id } : t);
                spatialIndexRef.current = buildSpatialIndex(next);
                return next;
            });
            console.log("Component created successfully with ID:", created.id);
        } catch (error) {
            console.error("Failed to save tile to backend, removing local tile:", error);
            // Roll back the optimistic local placement
            setTiles(prev => {
                const next = prev.filter(t => t.id !== tempId);
                spatialIndexRef.current = buildSpatialIndex(next);
                return next;
            });
        }
    }, [snap, layoutId, floorId]);

    const canPlace = useCallback((id: number, updates: Partial<TileData>) => {
        const current = tiles.find(t => t.id === id);
        if (!current) return false;
        return !hasCollision({ ...current, ...updates } as TileData, spatialIndexRef.current, id);
    }, [tiles]);

    const updateTile = (id: number, updates: Partial<TileData>) => {
        setTiles(prev => {
            const current = prev.find(t => t.id === id);
            if (!current) return prev;
            const candidate = { ...current, ...updates } as TileData;
            if (hasCollision(candidate, spatialIndexRef.current, id)) return prev;
            const nextTiles = prev.map(t => t.id === id ? candidate : t);
            spatialIndexRef.current = buildSpatialIndex(nextTiles);
            saveComponentPosition(candidate);
            return nextTiles;
        });
    };

    const deleteTile = useCallback(async (id: number) => {
        const tileToDelete = tiles.find((tile) => tile.id === id);
        if (!tileToDelete) return;

        setMachineSaveError(null);
        setMachineSaveSuccess(null);

        try {
            await deleteComponent(id);

            setTiles(prev => {
                const next = prev.filter(t => t.id !== id);
                spatialIndexRef.current = buildSpatialIndex(next);
                return next;
            });

            setSelectedMachine((prev) => (prev?.id === id ? null : prev));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete machine.";
            setMachineSaveError(message);
        }
    }, [tiles, setTiles]);

    const closeMachineModal = () => {
        setSelectedMachine(null);
        setMachineSaveError(null);
        setMachineSaveSuccess(null);
    };

    useEffect(() => {
        if (!editMode || !selectedMachine) return;

        let active = true;
        const loadMuscles = async () => {
            try {
                setMuscleLoadError(null);
                setIsLoadingMuscles(true);
                const muscles = await getMuscles();
                if (!active) return;
                setAvailableMuscles(muscles);
                if (muscles.length === 0) {
                    setMuscleLoadError("No muscles were returned by the backend.");
                }
            } catch (error) {
                if (!active) return;
                setAvailableMuscles([]);
                const message = error instanceof Error ? error.message : "Failed to load muscles.";
                setMuscleLoadError(message);
            } finally {
                if (active) {
                    setIsLoadingMuscles(false);
                }
            }
        };

        void loadMuscles();
        return () => { active = false; };
    }, [editMode, selectedMachine]);

    const handleMachineSave = async () => {
        if (!selectedMachine) return;
        if (!selectedMachine.equipmentTypeId) {
            setMachineSaveError("This machine is not linked to a relational equipment type.");
            return;
        }

        setIsSavingMachine(true);
        setMachineSaveError(null);
        setMachineSaveSuccess(null);

        try {
            const equipmentTypeId = selectedMachine.equipmentTypeId;
            const normalizedName = normalizeOptionalString(selectedMachine.equipment.name);
            const normalizedDescription = normalizeOptionalString(selectedMachine.equipment.description);
            const normalizedBenefits = normalizeArray(
                resolveExerciseNames(selectedMachine, selectedMachine.exerciseIds ?? [])
            ) ?? [];
            const normalizedImageUrl = normalizeOptionalString(selectedMachine.equipment.imageUrl);
            const normalizedMuscles = normalizeArray(selectedMachine.equipment.musclesTargeted);
            const normalizedColour = selectedMachine.colour ? selectedMachine.colour.replace("#", "") : undefined;
            const selectedExerciseIds = selectedMachine.exerciseIds ?? [];

            if (!normalizedName) {
                throw new Error("Equipment name cannot be empty.");
            }

            await updateComponent(selectedMachine.id, buildComponentPayload(selectedMachine));

            await upsertEquipmentTypeOverride(equipmentTypeId, {
                name: normalizedName,
                description: normalizedDescription,
                imageUrl: normalizedImageUrl,
            });

            const overrideSaves = selectedExerciseIds.map((exerciseId, index) => {
                const payload = {
                    videoUrl: undefined,
                };
                const hasData = Object.values(payload).some((value) => value !== undefined);
                if (!hasData) return Promise.resolve(null);

                return upsertExerciseOverride(exerciseId, payload);
            });

            await Promise.all(overrideSaves);

            const nextExerciseIds = selectedExerciseIds;
            const updatedEquipment = {
                ...selectedMachine.equipment,
                name: normalizedName,
                description: normalizedDescription,
                benefits: normalizedBenefits,
                imageUrl: normalizedImageUrl,
                musclesTargeted: normalizedMuscles,
                colour: normalizedColour,
            };

            setTiles((prev) => prev.map((tile) => {
                if (tile.equipmentTypeId !== equipmentTypeId) return tile;

                return {
                    ...tile,
                    colour: tile.id === selectedMachine.id ? selectedMachine.colour : tile.colour,
                    outOfOrder: tile.id === selectedMachine.id ? (selectedMachine.outOfOrder ?? false) : tile.outOfOrder,
                    exerciseIds: nextExerciseIds,
                    equipment: {
                        ...tile.equipment,
                        ...updatedEquipment,
                    },
                };
            }));

            setSelectedMachine((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    colour: selectedMachine.colour,
                    outOfOrder: selectedMachine.outOfOrder ?? false,
                    exerciseIds: nextExerciseIds,
                    equipment: updatedEquipment,
                };
            });

            const savedMuscles = normalizedMuscles?.length ?? 0;
            setMachineSaveSuccess(
                savedMuscles > 0
                    ? "Component saved successfully. Targeting " + savedMuscles + " muscle" + (savedMuscles > 1 ? "s." : ".")
                    : "Component saved successfully."
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save machine details.";
            setMachineSaveError(message);
        } finally {
            setIsSavingMachine(false);
        }
    };

    const handleCreateExercise = async (exercise: CreateExerciseDraft) => {
        if (!selectedMachine) return;
        if (!selectedMachine.equipmentTypeId) {
            throw new Error("This machine is not linked to a relational equipment type.");
        }

        setIsCreatingExercise(true);
        setMachineSaveError(null);
        setMachineSaveSuccess(null);

        try {
            const created = await createExercise({
                equipmentTypeId: selectedMachine.equipmentTypeId,
                name: exercise.name,
                description: exercise.description ?? "",
                videoUrl: exercise.videoUrl ?? "",
                difficulty: exercise.difficulty ?? "",
                muscleIds: exercise.muscleIds,
            });

            const nextOption: ExerciseOption = { id: created.id, name: created.name };
            const nextExerciseIds = addExerciseIdIfMissing(selectedMachine.exerciseIds, created.id);
            const selectedMuscleNames = availableMuscles
                .filter((muscle) => exercise.muscleIds.includes(muscle.id))
                .map((muscle) => muscle.name);

            setTiles((prev) => prev.map((tile) => {
                if (tile.equipmentTypeId !== selectedMachine.equipmentTypeId) return tile;

                const nextOptions = addExerciseOptionIfMissing(tile.exerciseOptions, nextOption);
                const mergedMuscles = mergeUniqueStrings(tile.equipment.musclesTargeted, selectedMuscleNames);
                if (tile.id !== selectedMachine.id) {
                    return {
                        ...tile,
                        exerciseOptions: nextOptions,
                        equipment: {
                            ...tile.equipment,
                            musclesTargeted: mergedMuscles,
                        },
                    };
                }

                return {
                    ...tile,
                    exerciseOptions: nextOptions,
                    exerciseIds: nextExerciseIds,
                    equipment: {
                        ...tile.equipment,
                        benefits: resolveExerciseNames(
                            { ...tile, exerciseOptions: nextOptions, exerciseIds: nextExerciseIds },
                            nextExerciseIds
                        ),
                        musclesTargeted: mergedMuscles,
                        // Don't set imageUrl from exercise
                    },
                };
            }));

            setSelectedMachine((prev) => {
                if (!prev) return prev;

                const nextOptions = addExerciseOptionIfMissing(prev.exerciseOptions, nextOption);
                const updatedExerciseIds = addExerciseIdIfMissing(prev.exerciseIds, created.id);
                return {
                    ...prev,
                    exerciseOptions: nextOptions,
                    exerciseIds: updatedExerciseIds,
                    equipment: {
                        ...prev.equipment,
                        benefits: resolveExerciseNames(
                            { ...prev, exerciseOptions: nextOptions, exerciseIds: updatedExerciseIds },
                            updatedExerciseIds
                        ),
                        musclesTargeted: mergeUniqueStrings(prev.equipment.musclesTargeted, selectedMuscleNames),
                    },
                };
            });

            setMachineSaveSuccess("Exercise created and added to this machine.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create exercise.";
            setMachineSaveError(message);
            throw error;
        } finally {
            setIsCreatingExercise(false);
        }
    };

    const handleSaveExercise = async (
        exerciseId: number,
        exercise: {
            name: string;
            description?: string;
            videoUrl?: string;
            difficulty?: string;
        },
        useOverride: boolean
    ) => {
        if (!selectedMachine?.equipmentTypeId) {
            throw new Error("This machine is not linked to a relational equipment type.");
        }

        setMachineSaveError(null);
        setMachineSaveSuccess(null);

        const normalizedVideoUrl = exercise.videoUrl?.trim() === "" ? undefined : exercise.videoUrl;
        const saved = useOverride
            ? await upsertExerciseOverride(exerciseId, {
                name: exercise.name,
                description: exercise.description,
                videoUrl: normalizedVideoUrl,
                difficulty: exercise.difficulty,
            })
            : await updateCustomExercise(exerciseId, {
                name: exercise.name,
                description: exercise.description,
                videoUrl: normalizedVideoUrl,
                difficulty: exercise.difficulty,
            });

        const equipmentTypeId = selectedMachine.equipmentTypeId;

        setTiles((prev) => prev.map((tile) => {
            if (tile.equipmentTypeId !== equipmentTypeId) return tile;
            return applyExerciseResultToTile(tile, saved);
        }));

        setSelectedMachine((prev) => {
            if (!prev || prev.equipmentTypeId !== equipmentTypeId) return prev;
            return applyExerciseResultToTile(prev, saved);
        });

        setMachineSaveSuccess(useOverride ? "Exercise override saved." : "Exercise updated.");
    };


    const editingTile = editingTileId === null
        ? null
        : tiles.find((tile) => tile.id === editingTileId) ?? null;

    return (
        <div className="relative overflow-visible w-full h-full justify-center items-center flex pt-1 sm:pt-2">
            <div
                style={{
                    position: "absolute",
                    width: `min(100%, ${mapWidth}px)`,
                    height: `min(100%, ${mapHeight}px)`,
                    backgroundColor: "transparent",
                }}
            >
                {!previewMode && (
                    <ZoomControls
                        scale={scale}
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onReset={resetZoom}
                    />
                )}

            </div>

            {editMode && (
                <FloatingEditTray
                    tile={editingTile}
                    onColourChange={(colour: string) => {
                        if (!editingTile) return;
                        updateTile(editingTile.id, { colour });
                    }}
                    onRotate={() => {
                        if (!editingTile) return;
                        setHistory((prev) => {
                            const newHistory = [...prev, editingTile];
                            return newHistory.slice(-50);
                        });
                        updateTile(editingTile.id, {
                            width: editingTile.height,
                            height: editingTile.width,
                            rotation: editingTile.rotation,
                        });
                    }}
                    onDelete={() => {
                        if (!editingTile) return;
                        setHistory((prev) => {
                            const newHistory = [...prev, editingTile];
                            return newHistory.slice(-50);
                        });
                        setEditingTileId(null);
                        void deleteTile(editingTile.id);
                    }}
                    onDeselect={() => setEditingTileId(null)}
                />
            )}

            {/* Map container */}
            <div
                ref={containerRef}
                className={`relative bg-bg-secondary rounded-xl sm:rounded-2xl ${!previewMode ? 'overflow-auto' : 'overflow-hidden'} shadow-lg transition-colors duration-500 touch-pan-x touch-pan-y`}
                style={{
                    width: mapWidth,
                    height: mapHeight,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    scrollbarColor: theme === 'dark' ? '#999999 transparent' : '#808080 transparent',
                    scrollbarWidth: 'thin'
                }}
                onDragOver={editMode ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; } : undefined}
                onDrop={editMode ? (e) => {
                    e.preventDefault();
                    const raw = e.dataTransfer.getData("application/tile-template");
                    if (!raw) return;
                    const template: TileTemplate = JSON.parse(raw);
                    const rect = containerRef.current!.getBoundingClientRect();
                    // Account for scroll and scale so tile lands where the cursor is
                    const x = (e.clientX - rect.left + containerRef.current!.scrollLeft) / scale - template.width / 2;
                    const y = (e.clientY - rect.top + containerRef.current!.scrollTop) / scale - template.height / 2;
                    addTile(template, x, y);
                } : undefined}
            >

                {/* Internal map */}
                <div
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        width: mapWidth,
                        height: mapHeight,
                        backgroundImage: `
                            linear-gradient(to right, var(--grid-line-color, rgba(255,255,255,0.07)) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--grid-line-color, rgba(255,255,255,0.07)) 1px, transparent 1px)
                        `,
                        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                        backgroundPosition: "4px 4px",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        borderRadius: "16px",
                    }}
                    onClick={() => {
                        if (previewMode) setSelectedMachine(null);
                        if (editMode) setEditingTileId(null);
                    }}
                >
                    {/* Border */}
                    <div style={{
                        boxSizing: "border-box",
                        border: "4px inset var(--grid-line-color)",
                        borderRadius: "16px",
                        height: "100%",
                        width: "100%",
                        position: "relative",
                    }}>
                        {floorLoading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/15 text-text-primary text-sm">
                                <ShinyText 
                                    text="Loading Floor..." 
                                    disabled={false} 
                                    speed={2}
                                    className='custom-class text-2xl font-light select-none' 
                                />
                            </div>
                        )}

                        {!floorLoading && floorLoadError && (
                            <div className="absolute bottom-4 left-4 z-20 rounded-md bg-red-900/80 px-3 py-2 text-xs text-white">
                                Failed to load floor data. {floorLoadError}
                            </div>
                        )}

                        {!floorLoading && !floorLoadError && tiles.length === 0 && (
                            <div className="absolute top-4 left-4 z-20 rounded-md bg-bg-primary/70 px-3 py-2 text-xs text-text-primary">
                                This floor has no equipment yet.
                            </div>
                        )}

                        {tiles.map(tile => {
                            const structural = isStructuralTile(tile.equipmentTypeId);
                            const isWall = tile.equipmentTypeId === 0;

                            const tileUpdateHandler = (editMode || previewMode) ? (updates: Partial<TileData>) => {
                                setHistory(prev => {
                                    const newHistory = [...prev, tile];
                                    return newHistory.slice(-50);
                                });
                                if (tile.id !== undefined) {
                                    updateTile(tile.id, updates);
                                }
                            } : undefined;

                            const tileDeleteHandler = editMode ? () => {
                                setHistory(prev => {
                                    const newHistory = [...prev, tile];
                                    return newHistory.slice(-50);
                                });
                                void deleteTile(tile.id);
                            } : undefined;

                            const handleTileClick = () => {
                                if (editMode) {
                                    setEditingTileId(prev => prev === tile.id ? null : tile.id);
                                }
                                if (!structural && !previewMode) {
                                    setMachineSaveError(null);
                                    setMachineSaveSuccess(null);
                                    setSelectedMachine({ ...tile, onUpdate: () => {} });
                                }
                            };

                            if (isWall) {
                                return (
                                    <WallTile
                                        key={tile.id}
                                        {...tile}
                                        highlighted={highlightedTileId === tile.id || editingTileId === tile.id}
                                        scale={scale}
                                        gridSize={gridSize}
                                        snap={snap}
                                        canPlace={canPlace}
                                        onUpdate={tileUpdateHandler}
                                        editMode={editMode}
                                        onDelete={tileDeleteHandler}
                                    />
                                );
                            }

                            return (
                                <Tile
                                    key={tile.id}
                                    {...tile}
                                    highlighted={highlightedTileId === tile.id || editingTileId === tile.id}
                                    scale={scale}
                                    gridSize={gridSize}
                                    snap={snap}
                                    canPlace={canPlace}
                                    canHover={!structural}
                                    onUpdate={tileUpdateHandler}
                                    onClick={handleTileClick}
                                    editMode={editMode}
                                    previewMode={previewMode}
                                />
                            );
                        })}

                    </div>
                </div>
            </div>

            { selectedMachine && (
                <MachineModal
                    tile={selectedMachine}
                    onClose={closeMachineModal}
                    containerMode={previewMode}
                    editMode={editMode}
                    onTileChange={editMode ? (equipmentUpdates) => {
                        const updatedEquipment = { ...selectedMachine.equipment, ...equipmentUpdates };
                        setSelectedMachine({ ...selectedMachine, equipment: updatedEquipment });
                        setMachineSaveError(null);
                        setMachineSaveSuccess(null);
                    } : undefined}
                    onColourChange={editMode ? (colour) => {
                        setSelectedMachine({ ...selectedMachine, colour });
                        setTiles((prev) => prev.map((t) =>
                            t.id === selectedMachine.id ? { ...t, colour } : t
                        ));
                        setMachineSaveError(null);
                        setMachineSaveSuccess(null);
                    } : undefined}
                    onExerciseIdsChange={editMode ? (exerciseIds) => {
                        const exerciseNames = resolveExerciseNames(selectedMachine, exerciseIds);
                        setSelectedMachine({
                            ...selectedMachine,
                            exerciseIds,
                            equipment: {
                                ...selectedMachine.equipment,
                                benefits: exerciseNames,
                            },
                        });
                        setMachineSaveError(null);
                        setMachineSaveSuccess(null);
                    } : undefined}
                    onCreateExercise={editMode ? handleCreateExercise : undefined}
                    onLoadExercise={getExerciseById}
                    onSaveExercise={editMode ? handleSaveExercise : undefined}
                    creatingExercise={isCreatingExercise}
                    muscleOptions={availableMuscles}
                    musclesLoading={isLoadingMuscles}
                    muscleLoadError={muscleLoadError}
                    onSave={editMode ? handleMachineSave : undefined}
                    onOutOfOrderChange={editMode ? (outOfOrder) => {
                        setSelectedMachine({ ...selectedMachine, outOfOrder });
                        setMachineSaveError(null);
                        setMachineSaveSuccess(null);
                    } : undefined}
                    saving={isSavingMachine}
                    saveError={machineSaveError}
                    saveSuccess={machineSaveSuccess}
                />
            )}
        </div>
    );
}

export default InteractiveMap;
