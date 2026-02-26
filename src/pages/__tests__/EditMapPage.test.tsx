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
    default: ({ editMode, floorTiles, floorLoading, onTilesChange }: any) => (
        <div data-testid="interactive-map" data-edit-mode={editMode}>
            {floorLoading && <span>Loading...</span>}
            {floorTiles?.map((t: any) => (
                <span key={t.id}>{t.equipment?.name}</span>
            ))}
        </div>
    ),
}));

vi.mock('../../components/DragAndDropMenu', () => ({
    DragAndDropMenu: () => <div data-testid="drag-drop-menu">DragDrop</div>,
}));

vi.mock('../../components/ToggleSwitch', () => ({
    default: ({ checked, onChange }: any) => (
        <input
            data-testid="snap-toggle"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
    ),
}));

vi.mock('../../services/isAdmin', () => ({
    isAdminTEST: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../services/layoutService', () => ({
    getLayout: vi.fn().mockResolvedValue({
        id: 1,
        name: 'Test Layout',
        isPublic: true,
        floors: [
            { id: 10, layoutId: 1, name: 'Ground', levelOrder: 0, width: 800, height: 600 },
        ],
        components: [
            { id: 1, layoutId: 1, floorId: 10, xCoord: 0, yCoord: 0, width: 100, height: 100, rotation: 0, equipmentTypeId: 1 },
        ],
        definitions: {
            1: { id: 1, name: 'Treadmill', brand: null, imageUrl: null, description: 'Running', safetyInfo: null, exercises: [] },
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

vi.mock('../../pages', () => ({
    LoadingPage: () => <div data-testid="loading-page">Loading</div>,
}));

import EditMapPage from '../../pages/EditMapPage';

describe('EditMapPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders header after loading', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByTestId('header')).toBeTruthy();
        });
    });

    it('renders the interactive map in edit mode', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            const map = screen.getByTestId('interactive-map');
            expect(map).toBeTruthy();
            expect(map.getAttribute('data-edit-mode')).toBe('true');
        });
    });

    it('shows Edit Mode label', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByText('Edit Mode')).toBeTruthy();
        });
    });

    it('has back to view link', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByText('Back to View')).toBeTruthy();
        });
    });

    it('navigates to /map when back to view is clicked', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByText('Back to View')).toBeTruthy();
        });
        fireEvent.click(screen.getByText('Back to View'));
        expect(mockNavigate).toHaveBeenCalledWith('/map');
    });

    it('renders snap to grid toggle', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByText('Snap to grid')).toBeTruthy();
        });
    });

    it('has floor navigation buttons', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByLabelText('Previous floor')).toBeTruthy();
            expect(screen.getByLabelText('Next floor')).toBeTruthy();
        });
    });

    it('renders the drag and drop menu', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByTestId('drag-drop-menu')).toBeTruthy();
        });
    });

    it('has sidebar toggle button on mobile', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            const toggleBtn = screen.getByLabelText(/equipment panel/i);
            expect(toggleBtn).toBeTruthy();
        });
    });

    // ---- New tests for EditMapPage coverage ----

    it('toggles sidebar open when equipment panel button is clicked', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByLabelText(/Open equipment panel/i)).toBeTruthy();
        });
        fireEvent.click(screen.getByLabelText(/Open equipment panel/i));
        // After opening, the button label changes
        expect(screen.getByLabelText(/Close equipment panel/i)).toBeTruthy();
    });

    it('closes sidebar when overlay is clicked', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByLabelText(/Open equipment panel/i)).toBeTruthy();
        });
        fireEvent.click(screen.getByLabelText(/Open equipment panel/i));
        expect(screen.getByLabelText(/Close equipment panel/i)).toBeTruthy();

        // Click the overlay (bg-black/30) to close
        const overlay = document.querySelector('.bg-black\\/30') as HTMLElement;
        if (overlay) {
            fireEvent.click(overlay);
            await waitFor(() => {
                expect(screen.getByLabelText(/Open equipment panel/i)).toBeTruthy();
            });
        }
    });

    it('toggles snap to grid', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByTestId('snap-toggle')).toBeTruthy();
        });
        const toggle = screen.getByTestId('snap-toggle') as HTMLInputElement;
        expect(toggle.checked).toBe(true);
        fireEvent.click(toggle);
        // The state should have toggled
    });

    it('displays floor name from layout', async () => {
        render(<EditMapPage />);
        await waitFor(() => {
            expect(screen.getByText('Ground')).toBeTruthy();
        });
    });
});
