import ShinyText from '../components/effects/ShinyText';
import { Header, SearchBar } from '../components/index';
import { GymLayoutSearchProps } from '../types/api';
import { useNavigate } from 'react-router-dom';
import { getAllPublicLayouts } from '../services/layoutService';
import { useEffect, useMemo, useState } from 'react';

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function SearchMapPage() {
    const navigate = useNavigate();
    const [layoutList, setLayoutList] = useState<GymLayoutSearchProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLayouts = async () => {
            try {
                setLoading(true);
                const layouts = await getAllPublicLayouts();
                setLayoutList(layouts.map(l => ({ id: l.id, name: l.name })));
            } catch (error) {
                console.error("Failed to fetch layouts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLayouts();
    }, []);

    const recommended = useMemo(() => shuffleArray(layoutList).slice(0, 6), [layoutList]);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            {/* Hero section */}
            <div className="relative flex flex-col items-center w-full pt-24 sm:pt-32 pb-10 px-4 sm:px-6">
                <ShinyText text="Discover Gym Layouts" className="text-3xl sm:text-4xl md:text-5xl font-bold" />
                <p className="mt-3 text-sm sm:text-base text-text-secondary max-w-md text-center">
                    Search for a gym layout to explore its equipment, exercises, and floor plans.
                </p>

                <div className="mt-8 w-full max-w-lg">
                    <SearchBar searchData={layoutList}
                        onSelect={(item) => { navigate(`/map/${item.id}`); }}
                        filterFn={(item, q) => {
                            const lower = q.toLowerCase();
                            return item.name.toLowerCase().includes(lower) || item.id.toString().toLowerCase().includes(lower);
                        }}
                        renderItem={(item) => (
                            <span>
                                <span className="font-medium">{item.name}</span>
                                <span className="font-light ml-1 text-xs text-text-secondary">#{item.id}</span>
                            </span>
                        )}
                        placeholder='Search for a gym...'
                    />
                </div>
            </div>

            {/* Recommended section */}
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-16">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-text-primary">
                    Recommended Gyms
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-32 rounded-xl bg-bg-secondary animate-pulse" />
                        ))}
                    </div>
                ) : recommended.length === 0 ? (
                    <p className="text-sm text-text-secondary">No gym layouts available yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommended.map((gym) => (
                            <button
                                key={gym.id}
                                onClick={() => navigate(`/map/${gym.id}`)}
                                className="group relative overflow-hidden rounded-xl border border-border-light bg-bg-secondary p-5 text-left transition-all duration-200 hover:border-accent-primary hover:shadow-lg hover:shadow-accent-primary/10 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-text-primary truncate group-hover:text-accent-primary transition-colors">
                                            {gym.name}
                                        </h3>
                                        <p className="mt-1 text-xs text-text-secondary">
                                            Layout #{gym.id}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 mt-0.5 text-text-secondary group-hover:text-accent-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                                    <span className="text-xs text-text-secondary">Available</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Browse all */}
                {!loading && layoutList.length > 6 && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Showing {recommended.length} of {layoutList.length} layouts. Use the search bar to find more.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchMapPage;