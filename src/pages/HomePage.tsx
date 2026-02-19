import '../styles/App.scss';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { IoMapOutline, IoFitnessOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import Header from '../components/Header';
import Silk from '../backgrounds/Silk';
import { useTheme } from '../context/ThemeContext';
import {useSettings } from '../context/SettingsContext';


function HomePage() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { reducedMotion } = useSettings();

    const features = [
        {
            icon: <IoMapOutline className="w-8 h-8" />,
            title: "Interactive Gym Map",
            description: "Navigate your gym with an interactive floor plan"
        },
        {
            icon: <IoFitnessOutline className="w-8 h-8" />,
            title: "Equipment Tracking",
            description: "Find and track gym machines in real-time"
        },
        {
            icon: <IoLocationOutline className="w-8 h-8" />,
            title: "Easy Location",
            description: "Quickly locate any equipment on the floor"
        },
        {
            icon: <IoTimeOutline className="w-8 h-8" />,
            title: "Availability Status",
            description: "Check machine availability before heading over"
        }
    ];

    return (
        <div className="min-h-screen text-text-primary transition-colors duration-300 select-none">
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
            
            <div className="relative flex flex-row items-center justify-center h-full w-full" style={{ minHeight: '100vh' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            GYAT
                        </h1>
                        <p className="text-xl md:text-2xl text-text-primary font-medium mb-2">
                            The Gym App & Tracker
                        </p>
                        <p className="text-text-primary max-w-xl mx-auto mt-4">
                            Navigate your gym smarter. Find equipment, track availability, and optimise your workout experience.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
                        className="mt-10"
                    >
                        <button
                            onClick={() => navigate('/map')}
                            className="px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            Open Gym Map
                        </button>
                    </motion.div>
                </div>

                <div className="px-6">
                    <div className="max-w-4xl mx-auto px-4">
                        <motion.div
                            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                            animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                                    animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                                    transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
                    
                                    className="p-6 bg-bg-secondary/50 backdrop-blur-lg rounded-2xl border-2 border-neutral-700/30 hover:border-neutral-600/50 transition-colors duration-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-bg-tertiary rounded-xl text-accent-primary">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-text-primary text-sm">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;