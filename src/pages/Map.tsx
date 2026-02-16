import '../styles/App.scss';
import { LoadingPage } from '../pages';
import InteractiveMap from '../components/InteractiveMap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { isAdminTEST } from '../services/isAdmin';

function MapPage() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

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
        <div className="fixed inset-0 h-full w-full bg-bg-primary text-text-primary transition-colors duration-500 p-4 flex flex-col">

            <Header />

            {/* Admin-only edit button */}
            {isAdmin && (
                <div className="absolute top-20 right-8 z-30">
                    <button
                        onClick={() => navigate("/map/edit")}
                        className="px-4 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium shadow hover:opacity-90 transition-opacity"
                    >
                        Edit Map
                    </button>
                </div>
            )}

            <InteractiveMap />

        </div>
    );
}

export default MapPage;
