import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { getManagerProfile, logoutManager } from "../services/authService";

type AuthIdentity = {
    id: number | null;
    username: string;
    email: string;
    role: string;
};

type AuthState = {
    isLoggedIn: boolean;
    isLoading: boolean;
    userId: number | null;
    userName: string;
    email: string;
    role: string;
};

type AuthContextValue = AuthState & {
    login: (identity: AuthIdentity) => void;
    refreshAuth: () => Promise<void>;
    logout: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "auth";

const LOGGED_OUT_STATE: Omit<AuthState, "isLoading"> = {
    isLoggedIn: false,
    userId: null,
    userName: "",
    email: "",
    role: "",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getPersistedState(): Omit<AuthState, "isLoading"> {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
        return LOGGED_OUT_STATE;
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            isLoggedIn: Boolean(parsed.isLoggedIn),
            userId: typeof parsed.userId === "number" ? parsed.userId : null,
            userName: typeof parsed.userName === "string" ? parsed.userName : "",
            email: typeof parsed.email === "string" ? parsed.email : "",
            role: typeof parsed.role === "string" ? parsed.role : "",
        };
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return LOGGED_OUT_STATE;
    }
}

function persistState(state: Omit<AuthState, "isLoading">) {
    if (!state.isLoggedIn) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(() => ({
        ...getPersistedState(),
        isLoading: true,
    }));

    const setAuthenticated = useCallback((identity: AuthIdentity) => {
        const next: Omit<AuthState, "isLoading"> = {
            isLoggedIn: true,
            userId: identity.id,
            userName: identity.username,
            email: identity.email,
            role: identity.role,
        };

        persistState(next);
        setState({ ...next, isLoading: false });
    }, []);

    const setLoggedOut = useCallback(() => {
        persistState(LOGGED_OUT_STATE);
        setState({ ...LOGGED_OUT_STATE, isLoading: false });
    }, []);

    const refreshAuth = useCallback(async () => {
        try {
            const profile = await getManagerProfile();
            setAuthenticated({
                id: profile.id,
                username: profile.username,
                email: profile.email,
                role: profile.role,
            });
        } catch {
            setLoggedOut();
        }
    }, [setAuthenticated, setLoggedOut]);

    useEffect(() => {
        void refreshAuth();
    }, [refreshAuth]);

    const value = useMemo<AuthContextValue>(() => ({
        ...state,
        login: (identity: AuthIdentity) => {
            setAuthenticated(identity);
        },
        refreshAuth,
        logout: async () => {
            await logoutManager();
            setLoggedOut();
            sessionStorage.clear();
        },
    }), [state, refreshAuth, setAuthenticated, setLoggedOut]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();
    if (isLoading) return null;
    return isLoggedIn ? <>{children}</> : null;
}

// TODO: Implement RequireAdmin with server-side role verification when API is available
// For now, admin role should only come from the backend
export function RequireAdmin({ children }: { children: ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();
    if (isLoading) return null;
    // This should be replaced with a server-side check
    // Admin status must be determined server-side, never trusted from client
    return isLoggedIn ? <>{children}</> : null;
}
