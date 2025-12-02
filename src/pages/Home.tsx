import { ThemeToggle } from '../components/ThemeToggle';
import '../styles/App.scss';
import { useNavigate } from 'react-router-dom';
import SplitText from '../components/SplitText';
import ElectricBorder from '../components/ElectricBorder';
import Dock from '../components/Dock';


function Home () {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary duration-300 items-center justify-center flex flex-col select-none">
            <ThemeToggle />

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
        </div>
    );
}

export default Home;