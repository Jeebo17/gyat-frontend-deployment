import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../components/InteractiveMap";
import Header from "../components/Header";
import { isAdminTEST } from "../services/isAdmin";
import { LoadingPage } from "../pages";

function EditMapPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Admin gate: redirect non-admins back to the map view
    useEffect(() => {
        const checkAdmin = async () => {
            const isAdmin = await isAdminTEST("test");
            if (!isAdmin) {
                navigate("/map", { replace: true });
            }
            setLoading(false);
        };
        checkAdmin();
    }, [navigate]);

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

            {/* Edit-mode toolbar */}
            <div className="absolute top-20 left-8 z-30 flex flex-row items-center gap-4">
                <span className="text-sm font-semibold select-none px-2 py-1 rounded bg-accent-primary text-white">
                    Edit Mode
                </span>
                <button
                    className="text-sm select-none underline hover:text-accent-primary transition-colors"
                    onClick={() => navigate("/map")}
                >
                    Back to View
                </button>
            </div>

            <InteractiveMap editMode={true} />
        </div>
    );
}

export default EditMapPage;
