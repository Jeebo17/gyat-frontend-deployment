import '../styles/App.scss';
import { LoadingPage } from '.';
import InteractiveMap from '../components/InteractiveMap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { isAdminTEST } from '../services/isAdmin';
import { GymFloorDTO } from '../types/api';
import { FaRegCaretSquareUp, FaRegCaretSquareDown } from 'react-icons/fa';

function MapPage() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [floor, setFloor] = useState<number>(0);
    const [floors, setFloors] = useState<GymFloorDTO[]>([]);
    const maxFloorIndex = floors.length > 0 ? floors.length - 1 : 0;
    const currentFloor = floors[Math.min(floor, maxFloorIndex)];

    useEffect(() => {
        if (floor > maxFloorIndex) {
            setFloor(maxFloorIndex);
        }
    }, [floor, maxFloorIndex]);


    useEffect(() => {
        const init = async () => {
            const admin = await isAdminTEST("test");
            setIsAdmin(admin);
            setLoading(false);
        };
        // small delay keeps the loading screen feeling intentional
        const timer = setTimeout(() => { init(); }, 300);
        return () => clearTimeout(timer);
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
                <span />

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
                    floor={floor}
                    onFloorsLoaded={setFloors}
                />
            </div>
        </div>
    );
}

export default MapPage;
