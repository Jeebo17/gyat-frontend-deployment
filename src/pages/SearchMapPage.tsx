import ShinyText from '../components/effects/ShinyText';
import { Header, SearchBar } from '../components/index';
import { GymLayoutSearchProps } from '../types/api';
import { useNavigate } from 'react-router-dom';


const mockLayoutList: GymLayoutSearchProps[] = [
    { id: 69, name: "Main Bath Gym" },
    { id: 78, name: "Bob Test Layout" },
];


function SearchMapPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />

            <div className="relative flex flex-col items-center w-full py-2 sm:py-3 px-4 sm:px-6 gap-8">
                <ShinyText text="Search for a Gym Layout" className="text-3xl sm:text-4xl md:text-5xl" />

                <SearchBar searchData={mockLayoutList} onSelect={(item) => {
                    navigate(`/map/${item.id}`);
                }} />
            </div>


        </div>
    );
}

export default SearchMapPage;