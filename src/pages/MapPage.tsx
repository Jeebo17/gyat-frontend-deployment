import '../styles/App.scss';
import { LoadingPage } from '.';
import { EnhancedInteractiveMap, SearchBar, Header } from '../components/index';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminTEST } from '../services/isAdmin';
import type { GymFloorDTO, GymLayoutDTO } from '../types/api';
import { FaRegCaretSquareUp, FaRegCaretSquareDown } from 'react-icons/fa';
import { IoSearch, IoClose } from 'react-icons/io5';
import { getLayoutPublic } from "../services/layoutService";
import { mapComponentToTile } from "../services/tileService";
import type { TileSearchProps } from '../types/tile';
import { useAuth } from '../context/AuthContext';

const MAP_DESKTOP_MIN_WIDTH = 640;
const MAP_MIN_SCALE = 0.7;
const MAP_MAX_SCALE = 2;
const MAP_WHEEL_STEP = 0.03;
const MAP_PINCH_STEP = 3;

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
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(() =>
        typeof window === 'undefined' ? false : window.innerWidth < MAP_DESKTOP_MIN_WIDTH
    );
    const { isLoggedIn } = useAuth();
    const layoutId = Number(window.location.pathname.split("/").pop());
    const resolvedLayoutId = layoutId && layoutId > 0 ? layoutId : 69;

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
                const data = await getLayoutPublic(resolvedLayoutId);
                if (!active) return;
                setLayout(data);

                const definitions = data.definitions ?? {};
                const searchItems: TileSearchProps[] = data.components.map(component => {
                    const eqId = component.equipmentTypeId ?? component.equipmentId ?? 0;
                    const def = definitions[eqId];
                    return {
                        id: component.id,
                        name: def?.name || `Equipment #${eqId}`,
                        description: def?.description || "No description provided.",
                        floorName: data.floors.find(f => f.id === component.floorId)?.name || "Unknown Floor",
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
        const floorIdx = floors.findIndex(f => f.name === item.floorName);
        if (floorIdx >= 0 && floorIdx !== floor) {
            setFloor(floorIdx);
        }
        setHighlightedTileId(item.id);
        if (isMobileViewport) {
            setIsMobileSearchOpen(false);
        }
    }, [floor, floors, isMobileViewport]);

    useEffect(() => {
        const handleViewportChange = () => {
            const isMobile = window.innerWidth < MAP_DESKTOP_MIN_WIDTH;
            setIsMobileViewport(isMobile);
            if (!isMobile) {
                setIsMobileSearchOpen(false);
            }
        };

        handleViewportChange();
        window.addEventListener('resize', handleViewportChange);
        return () => window.removeEventListener('resize', handleViewportChange);
    }, []);

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

            <div className="mt-14 relative flex flex-col sm:flex-row items-stretch sm:items-center w-full py-2 sm:py-3 px-3 sm:px-4 flex-shrink-0 select-none gap-2 sm:gap-0">
                <div className="hidden sm:block w-full sm:w-auto">
                    <SearchBar<TileSearchProps>
                        searchData={searchData}
                        onSelect={handleSearchSelect}
                        placeholder="Search for equipment..."
                        containerClassName="sm:w-56"
                        filterFn={(item, q) => {
                            const lower = q.toLowerCase();
                            return item.name.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower);
                        }}
                        renderItem={(item) => (
                            <>
                                <span>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="font-light ml-1 text-xs">#{item.id}</span>
                                </span>
                                <span className="ml-2 text-xs opacity-60">Floor: {item.floorName}</span>
                                <span className="ml-2 text-xs opacity-60">{item.description}</span>
                            </>
                        )}
                    />
                </div>

                <div className="flex sm:hidden items-center gap-2 w-full">
                    {!isMobileSearchOpen && (
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary text-text-primary text-sm shadow"
                            onClick={() => setIsMobileSearchOpen(true)}
                            aria-label="Open search"
                        >
                            <IoSearch size={20} />  
                        </button>
                    )}

                    {isMobileSearchOpen && (
                        <>
                            <SearchBar<TileSearchProps>
                                searchData={searchData}
                                onSelect={handleSearchSelect}
                                placeholder="Search for equipment..."
                                containerClassName="flex-1 sm:w-56"
                                filterFn={(item, q) => {
                                    const lower = q.toLowerCase();
                                    return item.name.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower);
                                }}
                                renderItem={(item) => (
                                    <>
                                        <span>
                                            <span className="font-medium">{item.name}</span>
                                            <span className="font-light ml-1 text-xs">#{item.id}</span>
                                        </span>
                                        <span className="ml-2 text-xs opacity-60">Floor: {item.floorName}</span>
                                        <span className="ml-2 text-xs opacity-60">{item.description}</span>
                                    </>
                                )}
                            />
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-lg bg-bg-tertiary text-text-primary"
                                onClick={() => setIsMobileSearchOpen(false)}
                                aria-label="Close search"
                            >
                                <IoClose size={18} />
                            </button>
                        </>
                    )}

                    <div className={`${isMobileSearchOpen ? 'hidden' : 'flex'} absolute items-center gap-1 whitespace-nowrap ml-auto left-1/2 -translate-x-1/2`}>
                        <button
                            type="button"
                            className="flex items-center justify-center text-text-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                            onClick={() => setFloor(prev => Math.max(0, prev - 1))}
                            disabled={floor <= 0}
                            aria-label="Previous floor"
                        >
                            <FaRegCaretSquareDown size={28} className="sm:w-8 sm:h-8" />
                        </button>
                        <span className="select-none min-w-24 text-center flex-shrink-0 font-semibold text-sm">
                            {currentFloor?.name ?? `Floor ${floor + 1}`}
                        </span>
                        <button
                            type="button"
                            className="flex items-center justify-center text-text-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                            onClick={() => setFloor(prev => Math.min(maxFloorIndex, prev + 1))}
                            disabled={floor >= maxFloorIndex}
                            aria-label="Next floor"
                        >
                            <FaRegCaretSquareUp size={28} className="sm:w-8 sm:h-8" />
                        </button>
                    </div>
                </div>

                <div className={`${isMobileSearchOpen ? 'hidden' : 'flex'} min-w-0 items-center sm:ml-2 sm:mr-4`}>
                    <span className="inline-flex max-w-full px-2 items-center text-lg font-semibold text-text-primary sm:text-base truncate">
                        {layout?.name ?? `Loading layout...`}
                    </span>
                </div>

                {/* Floor buttons - centered on desktop */}
                <div className="hidden sm:flex sm:absolute sm:left-1/2 sm:-translate-x-1/2 items-center gap-3 whitespace-nowrap">
                    <button
                        type="button"
                        className="flex items-center justify-center text-text-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        onClick={() => setFloor(prev => Math.max(0, prev - 1))}
                        disabled={floor <= 0}
                        aria-label="Previous floor"
                    >
                        <FaRegCaretSquareDown size={28} className="sm:w-8 sm:h-8" />
                    </button>
                    <span className="select-none min-w-24 sm:min-w-32 text-center flex-shrink-0 font-semibold text-sm sm:text-base">
                        {currentFloor?.name ?? `Floor ${floor + 1}`}
                    </span>
                    <button
                        type="button"
                        className="flex items-center justify-center text-text-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        onClick={() => setFloor(prev => Math.min(maxFloorIndex, prev + 1))}
                        disabled={floor >= maxFloorIndex}
                        aria-label="Next floor"
                    >
                        <FaRegCaretSquareUp size={28} className="sm:w-8 sm:h-8" />
                    </button>
                </div>

                {/* Admin-only edit button */}
                {isAdmin && isLoggedIn && (
                    <button
                        onClick={() => navigate(`/map/edit/${resolvedLayoutId}`)}
                        className="hidden sm:inline-flex sm:ml-auto px-3 sm:px-4 py-2 rounded-lg bg-accent-primary text-white text-xs sm:text-sm font-medium shadow hover:opacity-90 transition-opacity flex-shrink-0 items-center gap-1"
                    >
                        Edit Map
                    </button>
                )}
            </div>

            {/* Map container */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <EnhancedInteractiveMap
                    floorTiles={tiles}
                    floorLoading={isLayoutLoading}
                    floorLoadError={layoutLoadError}
                    highlightedTileId={highlightedTileId}
                    desktopMinWidth={MAP_DESKTOP_MIN_WIDTH}
                    minScale={MAP_MIN_SCALE}
                    maxScale={MAP_MAX_SCALE}
                    wheelStep={MAP_WHEEL_STEP}
                    pinchStep={MAP_PINCH_STEP}
                />
            </div>
        </div>
    );
}

export default MapPage;
