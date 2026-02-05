import '../styles/App.scss';
import SplitText from '../components/effects/SplitText';
import ElectricBorder from '../components/effects/ElectricBorder';
import Dock from '../components/Dock';
import SplashCursor from '../components/effects/SplashCursor'
import Silk from '../backgrounds/Silk';
import FloatingLines from '../backgrounds/FloatingLines';
import ColorBends from '../backgrounds/ColorBends';
import Iridescence from '../backgrounds/Iridescence';
import { useState, useEffect } from 'react';

import { useMemo } from 'react';

const backgrounds = [
    () => (
        <div></div>
    ),
    () => (
        <Silk
            speed={5}
            scale={1}
            color="#7B7481"
            noiseIntensity={1.5}
            rotation={0}
        />
    ),
    () => (
        <FloatingLines 
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[5, 7, 5]}
            lineDistance={[8, 6, 4]}
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
        />
    ),
    () => (
        <ColorBends
            colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
            rotation={0}
            speed={0.2}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={1}
            parallax={0.5}
            noise={0.1}
            transparent
        />
    ),
    () => (
        <Iridescence
            color={[0.5, 0.5, 0.5]}
            mouseReact={false}
            amplitude={0.1}
            speed={1.0}
        />
    )
];

function HomePage () {
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [enableSplashCursor, setEnableSplashCursor] = useState(false);

    useEffect(() => {
        setBackgroundIndex(0);
    }, []);

    const background = useMemo(() => {
        const BackgroundComponent = backgrounds[backgroundIndex];
        return <BackgroundComponent />;
    }, [backgroundIndex]);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary duration-300 items-center justify-center flex flex-col select-none">
            <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
                {background}
            </div>

            {enableSplashCursor && <SplashCursor />}

            <Dock
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
            />

            <div className="flex items-center justify-center px-4">
                <ElectricBorder
                    color="#7df9ff"
                    speed={1}
                    chaos={0.5}
                    thickness={2}
                    style={{ borderRadius: 16 }}
                >
                    <div className="w-full h-full p-10">
                        <SplitText
                            text="Welcome to the Gyat (The Gym App & Tracker!)"
                            className="text-4xl font-bold text-center"
                            delay={70}
                            duration={0.6}
                            ease="elastic.out(1, 0.3)"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                        />

                        <p style={{ margin: '6px 0 0', opacity: 0.8 }}>GYAT DAMN</p>
                    </div>
                </ElectricBorder>
            </div>

            <div className="absolute bottom-4 left-4 text-lg text-primary select-none opacity-50 cursor-pointer hover:opacity-75 transition-all" onClick={() => {
                const nextIndex = (backgroundIndex + 1) % backgrounds.length;
                setBackgroundIndex(nextIndex);
            }}>
                Change backgrounds
            </div>

            <div className="absolute bottom-4 right-4 text-lg text-primary select-none opacity-50 cursor-pointer hover:opacity-75 transition-all" onClick={() => {
                setEnableSplashCursor(!enableSplashCursor);
            }}>
                {enableSplashCursor ? "Disable" : "Enable"} Splash Cursor
            </div>

        </div>
    );
}

export default HomePage;