import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = vi.fn();

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        isLoggedIn: true,
        isLoading: false,
        userName: 'admin',
        userId: 1,
        email: 'admin@test.com',
        role: 'admin',
        login: vi.fn(),
        logout: vi.fn(),
        refreshAuth: vi.fn(),
    }),
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

vi.mock('../../context/SettingsContext', () => ({
    useSettings: () => ({
        soundEnabled: true,
        fontScale: 1,
        setFontScale: vi.fn(),
        reducedMotion: false,
        setReducedMotion: vi.fn(),
        highContrast: false,
        setHighContrast: vi.fn(),
        setSoundEnabled: vi.fn(),
    }),
}));

vi.mock('use-sound', () => ({
    default: () => [vi.fn(), { stop: vi.fn() }],
}));

vi.mock('../../components/Header', () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../components/InteractiveMap', () => ({
    default: ({ floorTiles, floorLoading, floorLoadError, highlightedTileId }: any) => (
        <div data-testid="interactive-map">
            {floorLoading && <span>Loading...</span>}
            {floorLoadError && <span>Error: {floorLoadError}</span>}
            {floorTiles?.map((t: any) => (
                <span key={t.id} data-testid={`tile-${t.id}`}>{t.equipment?.name}</span>
            ))}
            {highlightedTileId && <span data-testid="highlighted">{highlightedTileId}</span>}
        </div>
    ),
}));

vi.mock('../../components/SearchBar', () => ({
    default: ({ onSelect }: any) => (
        <div data-testid="search-bar">
            <button onClick={() => onSelect({ id: 1, name: 'Test', floorName: 'Ground' })}>
                Select Item
            </button>
        </div>
    ),
}));

vi.mock('../../services/isAdmin', () => ({
    isAdminTEST: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../services/layoutService', () => ({
    getLayoutPublic: vi.fn().mockResolvedValue({
        id: 1,
        name: 'Test Layout',
        isPublic: true,
        floors: [
            { id: 10, layoutId: 1, name: 'Ground', levelOrder: 0, width: 800, height: 600 },
            { id: 20, layoutId: 1, name: 'First', levelOrder: 1, width: 800, height: 600 },
        ],
        components: [
            { id: 1, layoutId: 1, floorId: 10, xCoord: 0, yCoord: 0, width: 100, height: 100, rotation: 0, equipmentTypeId: 1 },
            { id: 2, layoutId: 1, floorId: 20, xCoord: 0, yCoord: 0, width: 100, height: 100, rotation: 0, equipmentTypeId: 2 },
        ],
        definitions: {
            1: { id: 1, name: 'Treadmill', brand: null, imageUrl: null, description: 'Running', safetyInfo: null, exercises: [] },
            2: { id: 2, name: 'Bench', brand: null, imageUrl: null, description: 'Press', safetyInfo: null, exercises: [] },
        },
    }),
}));

vi.mock('../../services/tileService', () => ({
    mapComponentToTile: (component: any, defs: any) => ({
        id: component.id,
        xCoord: component.xCoord,
        yCoord: component.yCoord,
        width: component.width,
        height: component.height,
        rotation: component.rotation,
        colour: 'red',
        equipment: { name: defs[component.equipmentTypeId]?.name || 'Unknown' },
    }),
}));

// Mock LoadingPage via pages index
vi.mock('../../pages', () => ({
    LoadingPage: () => <div data-testid="loading-page">Loading</div>,
}));

import MapPage from '../../pages/MapPage';

describe('MapPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders header after loading', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByTestId('header')).toBeTruthy();
        });
    });

    it('renders the interactive map', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByTestId('interactive-map')).toBeTruthy();
        });
    });

    it('renders the search bar', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByTestId('search-bar')).toBeTruthy();
        });
    });

    it('renders floor navigation buttons', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByLabelText('Previous floor')).toBeTruthy();
            expect(screen.getByLabelText('Next floor')).toBeTruthy();
        });
    });

    it('shows edit map button for admin users', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByText('Edit Map')).toBeTruthy();
        });
    });

    it('navigates to edit page when edit button is clicked', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByText('Edit Map')).toBeTruthy();
        });
        fireEvent.click(screen.getByText('Edit Map'));
        expect(mockNavigate).toHaveBeenCalledWith('/map/edit/69');
    });

    it('displays floor name', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByText('Ground')).toBeTruthy();
        });
    });

    it('can navigate between floors', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByText('Ground')).toBeTruthy();
        });
        fireEvent.click(screen.getByLabelText('Next floor'));
        await waitFor(() => {
            expect(screen.getByText('First')).toBeTruthy();
        });
    });

    it('disables previous floor button on first floor', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByLabelText('Previous floor')).toBeTruthy();
        });
        expect(screen.getByLabelText('Previous floor')).toBeDisabled();
    });

    // ---- New tests for MapPage coverage ----

    it('disables next floor button on last floor', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByText('Ground')).toBeTruthy();
        });
        // Go to last floor
        fireEvent.click(screen.getByLabelText('Next floor'));
        await waitFor(() => {
            expect(screen.getByText('First')).toBeTruthy();
        });
        expect(screen.getByLabelText('Next floor')).toBeDisabled();
    });

    it('handles search result selection', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByTestId('search-bar')).toBeTruthy();
        });
        // Click "Select Item" which triggers onSelect
        fireEvent.click(screen.getByText('Select Item'));
        // The search handler should set highlightedTileId
    });

    it('can navigate back after going to second floor', async () => {
        render(<MapPage />);
        await waitFor(() => {
            expect(screen.getByText('Ground')).toBeTruthy();
        });
        fireEvent.click(screen.getByLabelText('Next floor'));
        await waitFor(() => {
            expect(screen.getByText('First')).toBeTruthy();
        });
        fireEvent.click(screen.getByLabelText('Previous floor'));
        await waitFor(() => {
            expect(screen.getByText('Ground')).toBeTruthy();
        });
    });
});
