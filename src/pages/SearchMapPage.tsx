import ShinyText from '../components/effects/ShinyText';
import { Header, SearchBar } from '../components/index';
import { GymLayoutSearchProps } from '../types/api';


const mockLayoutList: GymLayoutSearchProps[] = [
    { id: 69, name: "Main Bath Gym" },
    { id: 78, name: "Bob Test Layout" },
];


function SearchMapPage() {


    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />

            <SearchBar searchData={mockLayoutList} onSelect={() => {}} />

        </div>
    );
}

export default SearchMapPage;