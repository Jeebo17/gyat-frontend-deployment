import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

export function ProfileButton() {
    const navigate = useNavigate();

    return (
        <div className="z-50">
        <button
            onClick={() => navigate('/login')}
            className="p-2 rounded-lg transition-colors bg-bg-secondary hover:bg-bg-tertiary text-text-primary"
            aria-label="Toggle theme"
        >
            <IoPersonCircleOutline size={30} data-testid="io5-person-circle-outline" />
        </button>
        </div>
    );
}
