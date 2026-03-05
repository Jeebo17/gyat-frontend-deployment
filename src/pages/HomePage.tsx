import '../styles/App.scss';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Header, InteractiveMap } from '../components/index';
import Silk from '../backgrounds/Silk';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { getPreviewTiles } from "../services/tileService";
import cursor from '../assets/images/arrowhead-cursor.svg';

function HomePage() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { reducedMotion } = useSettings();

    return (
        <div className="min-h-screen text-text-primary transition-colors duration-300 select-none" style={{ cursor: `url(${cursor}) 12 12, auto` }}>
            <Header />

            <div className="absolute w-full h-full top-0 left-0 overflow-hidden -z-10">
                <Silk
                    speed={2}
                    scale={1}
                    color={theme === 'dark' ? '#48454d' : '#d7d1e6'}
                    noiseIntensity={1.5}
                    rotation={0}
                />
                <div className="absolute inset-0 bg-bg-primary opacity-40"></div>
            </div>
            
            <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-screen w-full px-4 sm:px-6 pt-20 pb-10 lg:pt-14 lg:pb-0 gap-8 lg:gap-0">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                            GYAT
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-text-primary font-medium mb-2">
                            The Gym App & Tracker
                        </p>
                        <p className="text-sm sm:text-base text-text-primary max-w-xl mx-auto mt-4">
                            Navigate your gym smarter. Find equipment, track availability, and optimise your workout experience.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
                        className="mt-8 sm:mt-10"
                    >
                        <button
                            onClick={() => navigate('/map')}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            Open Gym Map
                        </button>
                    </motion.div>
                </div>

                <div className="px-2 sm:px-6 w-full lg:w-auto">
                    <div className="mx-auto w-full max-w-6xl px-2 sm:px-4">
                        <div className="w-full aspect-[3/2] max-w-4xl mx-auto relative overflow-hidden">
                            <InteractiveMap editMode={false} previewMode={true} floorTiles={getPreviewTiles()} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;