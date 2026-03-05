import ShinyText from '../components/effects/ShinyText';
import { Header, SearchBar } from '../components/index';
import { GymLayoutSearchProps } from '../types/api';
import { useNavigate } from 'react-router-dom';
import { getAllLayouts } from '../services/layoutService';
import { useEffect, useState } from 'react';

function SearchMapPage() {
    const navigate = useNavigate();
    const [layoutList, setLayoutList] = useState<GymLayoutSearchProps[]>([]);

    useEffect(() => {
        const fetchLayouts = async () => {
            try {
                const layouts = await getAllLayouts();
                setLayoutList(layouts.map(l => ({ id: l.id, name: l.name })));
            } catch (error) {
                console.error("Failed to fetch layouts:", error);
            }
        };
        fetchLayouts();
    }, []);


    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />

            <div className="relative flex flex-col items-center w-full py-2 sm:py-3 px-4 sm:px-6 gap-8">
                <ShinyText text="Search for a Gym Layout" className="text-3xl sm:text-4xl md:text-5xl" />

                <SearchBar searchData={layoutList} 
                    onSelect={(item) => { navigate(`/map/${item.id}`);}}
                    filterFn={(item, q) => {
                        const lower = q.toLowerCase();
                        return item.name.toLowerCase().includes(lower) || item.id.toString().toLowerCase().includes(lower);
                    }} 
                    renderItem={(item) => (
                        <span>
                            <span className="font-medium">{item.name}</span>
                            <span className="font-light ml-1 text-xs">#{item.id}</span>
                        </span>
                    )}
                    placeholder='Search for a gym...'
                />
            </div>


        </div>
    );
}

export default SearchMapPage;