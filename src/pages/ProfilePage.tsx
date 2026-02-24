import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from '../components/LogOutButton';
import Header from '../components/Header';
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
    const navigate = useNavigate();
    const { isLoggedIn, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isLoading, isLoggedIn, navigate]);

    if (isLoading) {
        return null;
    }

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />
            <LogoutButton />       
        </div>
    );
}

export default ProfilePage;
