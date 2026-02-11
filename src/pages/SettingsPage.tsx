import ShinyText from '../components/effects/ShinyText';
import Header from '../components/Header';

function SettingsPage() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />

            <ShinyText 
                text="Settings Page" 
                disabled={false} 
                speed={2}
                className='custom-class text-4xl font-light select-none' 
            />
        </div>
    );
}

export default SettingsPage;