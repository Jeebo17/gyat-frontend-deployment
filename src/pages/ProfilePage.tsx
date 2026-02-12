import ShinyText from '../components/effects/ShinyText';
import Header from '../components/Header';

function ProfilePage() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />

            <ShinyText 
                text="Profile Page" 
                disabled={false} 
                speed={2}
                className='custom-class text-4xl font-light select-none' 
            />
        </div>
    );
}

export default ProfilePage;