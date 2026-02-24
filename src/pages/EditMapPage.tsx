import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../components/InteractiveMap";
import Header from "../components/Header";
import { isAdminTEST } from "../services/isAdmin";
import { LoadingPage } from "../pages";
import { DragAndDropMenu } from "../components/DragAndDropMenu";
import ToggleSwitch from "../components/ToggleSwitch";
import { FaRegCaretSquareUp, FaRegCaretSquareDown } from "react-icons/fa";
import type { GymFloorDTO, GymLayoutDTO } from "../types/api";
import type { TileData } from "../types/tile";
import { getLayout } from "../services/layoutService";
import { mapComponentToTile } from "../services/tileService";
import { useAuth } from "../context/AuthContext";

function EditMapPage() {
    const navigate = useNavigate();
    const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isAuthLoading, isLoggedIn, navigate]);

    const [loading, setLoading] = useState(true);
    const [snapToGridState, setSnapToGridState] = useState(true);
    const [floor, setFloor] = useState<number>(0);
    const [layout, setLayout] = useState<GymLayoutDTO | null>(null);
    const [isLayoutLoading, setIsLayoutLoading] = useState(true);
    const [layoutLoadError, setLayoutLoadError] = useState<string | null>(null);
    const [tileOverrides, setTileOverrides] = useState<TileData[] | null>(null);

    //TEMP
    const layoutId = 50;
    const parsedLayoutId = Number(import.meta.env.VITE_LAYOUT_ID ?? "50");
    const DEFAULT_LAYOUT_ID = Number.isFinite(parsedLayoutId) && parsedLayoutId > 0 ? parsedLayoutId : 50;
    const resolvedLayoutId = layoutId && layoutId > 0 ? layoutId : DEFAULT_LAYOUT_ID;

    // Derive floors from the cached layout
    const floors = useMemo<GymFloorDTO[]>(() => {
        if (!layout) return [];
        return [...layout.floors].sort((a, b) => a.levelOrder - b.levelOrder);
    }, [layout]);

    const maxFloorIndex = floors.length > 0 ? floors.length - 1 : 0;
    const currentFloor = floors[Math.min(floor, maxFloorIndex)];

    // Derive tiles from layout, but allow local overrides from editing
    const tiles = useMemo(() => {
        if (tileOverrides) return tileOverrides;
        if (!layout || !currentFloor) return [];
        const definitions = layout.definitions ?? {};
        return layout.components
            .filter(c => c.floorId === currentFloor.id)
            .map(c => mapComponentToTile(c, definitions));
    }, [layout, currentFloor, tileOverrides]);

    useEffect(() => {
        if (floor > maxFloorIndex) {
            setFloor(maxFloorIndex);
        }
    }, [floor, maxFloorIndex]);

    // Reset local tile overrides when floor changes
    useEffect(() => {
        setTileOverrides(null);
    }, [floor]);

    // Fetch the full layout once (or re-fetch on refresh)
    useEffect(() => {
        let active = true;

        const loadLayout = async () => {
            setIsLayoutLoading(true);
            setLayoutLoadError(null);

            try {
                const data = await getLayout(resolvedLayoutId);
                if (!active) return;
                setLayout(data);
                setTileOverrides(null);
            } catch (error) {
                if (!active) return;
                setLayout(null);
                setLayoutLoadError(error instanceof Error ? error.message : "Failed to load layout.");
            } finally {
                if (active) setIsLayoutLoading(false);
            }
        };

        void loadLayout();
        return () => { active = false; };
    }, [resolvedLayoutId]);

    const handleTilesChange = useCallback((newTiles: TileData[]) => {
        setTileOverrides(newTiles);
    }, []);

    // Admin gate: redirect non-admins back to the map view
    useEffect(() => {
        const checkAdmin = async () => {
            const isAdmin = await isAdminTEST("test");
            if (!isAdmin) {
                navigate("/map", { replace: true });
            }
            setLoading(false);
        };
        checkAdmin();
    }, [navigate]);

    if (loading || isAuthLoading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
                <LoadingPage />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 h-full w-full bg-bg-primary text-text-primary transition-colors duration-500 p-4 flex flex-col">
            <Header />

            <div className="flex flex-row flex-1 gap-4 mt-16 pt-2 overflow-hidden">
                <DragAndDropMenu />
                <div className="flex-1 min-w-0">

                    {/* Edit-mode toolbar */}
                    <div className="z-30 relative flex flex-row items-center w-full">
                        <span className="flex flex-row items-center gap-4">
                            <p className="text-sm font-semibold select-none px-2 py-1 rounded bg-accent-primary text-white">
                                Edit Mode
                            </p>
                            <button
                                className="text-sm select-none underline hover:text-accent-primary transition-colors"
                                onClick={() => navigate("/map")}
                            >
                                Back to View
                            </button>
                        </span>

                        {/* Absolutely centered floor buttons */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap">
                            <button
                                type="button"
                                className="flex items-center justify-center text-text-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                onClick={() => setFloor(prev => Math.max(0, prev - 1))}
                                disabled={floor <= 0}
                                aria-label="Previous floor"
                            >
                                <FaRegCaretSquareDown size={32} />
                            </button>
                            <span className="select-none min-w-32 text-center flex-shrink-0 font-semibold">
                                {currentFloor?.name ?? `Floor ${floor + 1}`}
                            </span>
                            <button
                                type="button"
                                className="flex items-center justify-center text-text-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                onClick={() => setFloor(prev => Math.min(maxFloorIndex, prev + 1))}
                                disabled={floor >= maxFloorIndex}
                                aria-label="Next floor"
                            >
                                <FaRegCaretSquareUp size={32} />
                            </button>
                        </div>

                        <div className="ml-auto flex flex-row items-center gap-4">
                            <span className="text-sm select-none">Snap to grid</span>
                            <ToggleSwitch checked={snapToGridState} onChange={setSnapToGridState} />
                        </div>
                    </div>
                    
                    <InteractiveMap
                        editMode={true}
                        snapToGrid={snapToGridState}
                        floorTiles={tiles}
                        floorLoading={isLayoutLoading}
                        floorLoadError={layoutLoadError}
                        onTilesChange={handleTilesChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default EditMapPage;
