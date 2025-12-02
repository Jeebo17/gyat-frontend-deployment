import { ThemeToggle } from '../components/ThemeToggle';
import '../styles/App.scss';
import Loading from '../components/Loading';
import InteractiveMap from '../components/InteractiveMap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import Dock from '../components/Dock';

function HomePage() {
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
                <div className="fixed top-4 right-4">
                <ThemeToggle />
                </div>

                <div className="flex items-center justify-center min-h-screen px-4">
                <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 p-8 pr-20">
        <ThemeToggle />

        <Dock
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
        />


        <div className="flex flex-row items-center gap-10 mb-8">
            <h1 className="text-3xl font-medium select-none">Interactive Gym Map</h1>
            
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
                <IoIosArrowBack className="inline-block"/>Home
            </div>
        </div>


        <InteractiveMap />

        </div>
    );
    }

    export default HomePage;
