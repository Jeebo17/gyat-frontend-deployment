import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoadingPage from '../LoadingPage';

vi.mock('../../components/effects/ShinyText', () => ({
    default: ({ text, className }: any) => <div data-testid="shiny-text" className={className}>{text}</div>,
}));

vi.mock('../../components/Header', () => ({
    default: () => <header data-testid="header">Header</header>,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('react-router', () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock('../../hooks/useAppSound', () => ({
    useAppSound: () => [vi.fn(), {}],
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ isLoggedIn: false, userName: '', isLoading: false, userId: null, email: '', role: '', login: vi.fn(), refreshAuth: vi.fn(), logout: vi.fn() }),
}));

vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => ({
        fontScale: 1, setFontScale: vi.fn(),
        reducedMotion: false, setReducedMotion: vi.fn(),
        highContrast: false, setHighContrast: vi.fn(),
        soundEnabled: true, setSoundEnabled: vi.fn(),
    }),
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

describe('LoadingPage', () => {
    it('renders the loading text', () => {
        render(<LoadingPage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders the header', () => {
        render(<LoadingPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('uses ShinyText component', () => {
        render(<LoadingPage />);
        expect(screen.getByTestId('shiny-text')).toBeInTheDocument();
    });
});
