import '../styles/App.scss';
import Loading from './Loading';
import InteractiveMap from '../components/InteractiveMap';
import { useState, useEffect } from 'react';
import Dock from '../components/Dock';

function HomePage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
                <Loading />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 h-full w-full bg-bg-primary text-text-primary transition-colors duration-500 p-4 flex flex-col">

            <Dock
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
            />

            <InteractiveMap />

        </div>
    );
    }

    export default HomePage;
