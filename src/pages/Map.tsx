import '../styles/App.scss';
import { LoadingPage } from '../pages';
import InteractiveMap from '../components/InteractiveMap';
import { useState, useEffect } from 'react';
import Header from '../components/Header';

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
                <LoadingPage />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 h-full w-full bg-bg-primary text-text-primary transition-colors duration-500 p-4 flex flex-col">

            <Header />

            <InteractiveMap />

        </div>
    );
    }

    export default HomePage;
