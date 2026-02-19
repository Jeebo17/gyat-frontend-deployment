import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type AuthState = {
    isLoggedIn: boolean;
    userName: string;
};

type AuthContextValue = AuthState & {
    login: (userName: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(() => {
        const raw = localStorage.getItem('auth');

        if (!raw) {
            return { isLoggedIn: false, userName: '' };
        }

        try {
            const parsed = JSON.parse(raw);

            return {
                isLoggedIn: Boolean(parsed.isLoggedIn),
                userName: typeof parsed.userName === 'string' ? parsed.userName : ''
            };
        } catch {
            // Clear corrupted auth data
            localStorage.removeItem('auth');
            return { isLoggedIn: false, userName: '' };
        }
    });

    const value = useMemo<AuthContextValue>(() => ({
        ...state,
        login: (userName: string) => {
            const next = { isLoggedIn: true, userName };
            localStorage.setItem('auth', JSON.stringify(next));
            setState(next);
        },
        logout: () => {
            const next = { isLoggedIn: false, userName: '' };
            localStorage.removeItem('auth');
            setState(next);
            // Clear any sensitive data
            sessionStorage.clear();
        }
    }), [state]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <>{children}</> : null;
}

// TODO: Implement RequireAdmin with server-side role verification when API is available
// For now, admin role should only come from the backend
export function RequireAdmin({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth();
    // This should be replaced with a server-side check
    // Admin status must be determined server-side, never trusted from client
    return isLoggedIn ? <>{children}</> : null;
}