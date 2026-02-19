import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../components/InteractiveMap";
import Header from "../components/Header";
import { isAdminTEST } from "../services/isAdmin";
import { LoadingPage } from "../pages";
import { DragAndDropMenu } from "../components/DragAndDropMenu";
import ToggleSwitch from "../components/ToggleSwitch";
import { FaRegCaretSquareUp, FaRegCaretSquareDown } from "react-icons/fa";
import type { GymFloorDTO } from "../types/api";

function EditMapPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [snapToGridState, setSnapToGridState] = useState(true);
    const [floor, setFloor] = useState<number>(0);
    const [floors, setFloors] = useState<GymFloorDTO[]>([]);
    const maxFloorIndex = floors.length > 0 ? floors.length - 1 : 0;
    const currentFloor = floors[Math.min(floor, maxFloorIndex)];

    useEffect(() => {
        if (floor > maxFloorIndex) {
            setFloor(maxFloorIndex);
        }
    }, [floor, maxFloorIndex]);

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

            <div className="flex flex-row flex-1 gap-4 mt-16 pt-2 overflow-hidden">
                <DragAndDropMenu />
                <div className="flex-1 min-w-0">

                    {/* Edit-mode toolbar */}
                    <div className="z-30 flex flex-row items-center gap-4 w-full justify-between">
                        <span className="flex flex-row items-center gap-4">
                            <p className="text-sm font-semibold select-none px-2 py-1 rounded bg-accent-primary text-white">
                                Edit Mode
                            </p>
                            <button
                                className="text-sm select-none underline hover:text-accent-primary transition-colors"
                                onClick={() => navigate("/map")}
                            >
                                Back to View
                            </button>
                        </span>

                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <button
                                type="button"
                                className="flex items-center justify-center text-text-primary disabled:opacity-50 flex-shrink-0"
                                onClick={() => setFloor(prev => Math.max(0, prev - 1))}
                                disabled={floor <= 0}
                                aria-label="Previous floor"
                            >
                                <FaRegCaretSquareDown size={30} />
                            </button>
                            <span className="select-none min-w-16 text-center flex-shrink-0">
                                {currentFloor?.name ?? `Floor ${floor + 1}`}
                            </span>
                            <button
                                type="button"
                                className="flex items-center justify-center text-text-primary disabled:opacity-50 flex-shrink-0"
                                onClick={() => setFloor(prev => Math.min(maxFloorIndex, prev + 1))}
                                disabled={floor >= maxFloorIndex}
                                aria-label="Next floor"
                            >
                                <FaRegCaretSquareUp size={30} />
                            </button>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <span className="text-sm select-none">Snap to grid</span>
                            <ToggleSwitch checked={snapToGridState} onChange={setSnapToGridState} />
                        </div>
                    </div>
                    
                    <InteractiveMap
                        editMode={true}
                        snapToGrid={snapToGridState}
                        floor={floor}
                        onFloorsLoaded={setFloors}
                    />
                </div>
            </div>
        </div>
    );
}

export default EditMapPage;
