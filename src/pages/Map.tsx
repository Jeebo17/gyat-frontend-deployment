import '../styles/App.scss';
import Loading from '../components/Loading';
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
        <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 p-8 pr-20">

        <Dock
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
        />


        <div className="flex flex-row items-center gap-10 mb-8">
            <h1 className="text-3xl font-medium select-none">Interactive Gym Map</h1>
        </div>


        <InteractiveMap />

        </div>
    );
    }

    export default HomePage;
