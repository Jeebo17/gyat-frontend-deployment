import { LogoutButton } from '../components/LogoutButton';
import Header from '../components/Header';

function ProfilePage() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />
            <LogoutButton />       
        </div>
    );
}

export default ProfilePage;