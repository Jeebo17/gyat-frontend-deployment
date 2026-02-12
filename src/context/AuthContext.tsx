import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type AuthState = {
    isLoggedIn: boolean;
    isAdmin: boolean;
    userName: string;
};

type AuthContextValue = AuthState & {
    login: (userName: string, isAdmin?: boolean) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(() => {
        const raw = localStorage.getItem('auth');

        if (!raw) {
            return { isLoggedIn: false, isAdmin: false, userName: '' };
        }

        try {
            const parsed = JSON.parse(raw);

            return {
                isLoggedIn: Boolean(parsed.isLoggedIn),
                isAdmin: Boolean(parsed.isAdmin),
                userName: typeof parsed.userName === 'string' ? parsed.userName : ''
            };
        } catch {
            return { isLoggedIn: false, isAdmin: false, userName: '' };
        }
    });

    const value = useMemo<AuthContextValue>(() => ({
        ...state,
        login: (userName: string, isAdmin = false) => {
        const next = { isLoggedIn: true, isAdmin, userName };
        localStorage.setItem('auth', JSON.stringify(next));
        setState(next);
        },
        logout: () => {
        const next = { isLoggedIn: false, isAdmin: false, userName: '' };
        localStorage.setItem('auth', JSON.stringify(next));
        setState(next);
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

export function RequireAdmin({ children }: { children: ReactNode }) {
    const { isLoggedIn, isAdmin } = useAuth();
    return isLoggedIn && isAdmin ? <>{children}</> : null;
}