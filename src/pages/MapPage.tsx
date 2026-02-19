import '../styles/App.scss';
import { LoadingPage } from '.';
import InteractiveMap from '../components/InteractiveMap';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { isAdminTEST } from '../services/isAdmin';
import type { GymFloorDTO, GymLayoutDTO } from '../types/api';
import { FaRegCaretSquareUp, FaRegCaretSquareDown } from 'react-icons/fa';
import { SearchBar } from '../components/SearchBar';
import { getLayout } from "../services/layoutService";
import { mapComponentToTile } from "../services/tileService";
import type { TileSearchProps } from '../types/tile';

const parsedLayoutId = Number(import.meta.env.VITE_LAYOUT_ID ?? "50");
const DEFAULT_LAYOUT_ID = Number.isFinite(parsedLayoutId) && parsedLayoutId > 0 ? parsedLayoutId : 50;

function MapPage() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [floor, setFloor] = useState<number>(0);
    const [layout, setLayout] = useState<GymLayoutDTO | null>(null);
    const [searchData, setSearchData] = useState<TileSearchProps[]>([]);
    const [highlightedTileId, setHighlightedTileId] = useState<number | null>(null);
    const [isLayoutLoading, setIsLayoutLoading] = useState(true);
    const [layoutLoadError, setLayoutLoadError] = useState<string | null>(null);
    const layoutId = null;
    const resolvedLayoutId = layoutId && layoutId > 0 ? layoutId : DEFAULT_LAYOUT_ID;

    // Derive floors and tiles from the cached layout
    const floors = useMemo<GymFloorDTO[]>(() => {
        if (!layout) return [];
        return [...layout.floors].sort((a, b) => a.levelOrder - b.levelOrder);
    }, [layout]);

    const maxFloorIndex = floors.length > 0 ? floors.length - 1 : 0;
    const currentFloor = floors[Math.min(floor, maxFloorIndex)];

    const tiles = useMemo(() => {
        if (!layout || !currentFloor) return [];
        const definitions = layout.definitions ?? {};
        return layout.components
            .filter(c => c.floorId === currentFloor.id)
            .map(c => mapComponentToTile(c, definitions));
    }, [layout, currentFloor]);

    useEffect(() => {
        if (floor > maxFloorIndex) {
            setFloor(maxFloorIndex);
        }
    }, [floor, maxFloorIndex]);

    // Fetch the full layout once
    useEffect(() => {
        let active = true;

        const loadLayout = async () => {
            setIsLayoutLoading(true);
            setLayoutLoadError(null);

            try {
                const data = await getLayout(resolvedLayoutId);
                if (!active) return;
                setLayout(data);

                const definitions = data.definitions ?? {};
                const searchItems: TileSearchProps[] = data.components.map(component => {
                    const eqId = component.equipmentTypeId ?? component.equipmentId ?? 0;
                    const def = definitions[eqId];
                    return {
                        id: component.id,
                        name: `${def?.name || component.name || "Unknown Equipment"} #${component.id}`,
                        description: def?.description || component.description || component.additionalInfo || "No description provided.",
                        floorId: component.floorId,
                    };
                });
                setSearchData(searchItems);
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

    // When a search result is selected, switch to its floor and highlight it
    const handleSearchSelect = useCallback((item: TileSearchProps) => {
        // Find which floor index this item belongs to
        const floorIdx = floors.findIndex(f => f.id === item.floorId);
        if (floorIdx >= 0 && floorIdx !== floor) {
            setFloor(floorIdx);
        }
        setHighlightedTileId(item.id);
    }, [floors, floor]);

    useEffect(() => {
        const init = async () => {
            const admin = await isAdminTEST("test");
            setIsAdmin(admin);
            setLoading(false);
        };
        void init();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
                <LoadingPage />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 h-full w-full bg-bg-primary text-text-primary transition-colors duration-500 flex flex-col">

            <Header />

            <div className="mt-16 flex flex-row items-center justify-between w-full py-3 px-4 gap-4 flex-shrink-0 select-none">
                <SearchBar searchData={searchData} onSelect={handleSearchSelect} />

                <div className="flex items-center gap-3 whitespace-nowrap">
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

                {/* Admin-only edit button */}
                {isAdmin && (
                    <button
                        onClick={() => navigate("/map/edit")}
                        className="px-4 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium shadow hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                        Edit Map
                    </button>
                )}
            </div>

            {/* Map container */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <InteractiveMap
                    floorTiles={tiles}
                    floorLoading={isLayoutLoading}
                    floorLoadError={layoutLoadError}
                    highlightedTileId={highlightedTileId}
                />
            </div>
        </div>
    );
}

export default MapPage;
