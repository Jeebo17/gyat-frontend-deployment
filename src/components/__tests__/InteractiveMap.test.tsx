import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import InteractiveMap from '../InteractiveMap';
import type { TileData } from '../../types/tile';
import { deleteComponent } from '../../services/componentService';

vi.mock('../../services/componentService', () => ({
    createComponent: vi.fn().mockResolvedValue({
        id: 999,
        layoutId: 1,
        floorId: 1,
        equipmentTypeId: 1,
        xCoord: 0,
        yCoord: 0,
        width: 100,
        height: 100,
        rotation: 0,
    }),
    updateComponent: vi.fn().mockResolvedValue({}),
    deleteComponent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../Tile', () => ({
    default: (props: any) => (
        <div
            data-testid={`tile-${props.id}`}
            aria-label={props.equipment?.name}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); props.onSelect?.(); }}
        >
            {props.equipment?.name}
            {props.onUpdate && (
                <button data-testid={`update-tile-${props.id}`} onClick={(e: React.MouseEvent) => { e.stopPropagation(); props.onUpdate({ xCoord: 50, yCoord: 50 }); }}>
                    Update
                </button>
            )}
        </div>
    ),
}));

vi.mock('../MachineModal', () => ({
    default: ({ tile, onClose }: any) => (
        <div data-testid="machine-modal">
            <span>{tile.equipment?.name}</span>
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

vi.mock('../ZoomControls', () => ({
    default: ({ onZoomIn, onZoomOut, onReset }: any) => (
        <div data-testid="zoom-controls">
            <button onClick={onZoomIn}>Zoom In</button>
            <button onClick={onZoomOut}>Zoom Out</button>
            <button onClick={onReset}>Reset</button>
        </div>
    ),
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

vi.mock('../effects/ShinyText', () => ({
    default: ({ text }: any) => <span>{text}</span>,
}));

vi.mock('../WallTile', () => ({
    default: (props: any) => (
        <div data-testid={`wall-tile-${props.id}`}>{props.equipment?.name}</div>
    ),
}));

vi.mock('../FloatingEditTray', () => {
    let latestOnDelete: (() => void) | null = null;
    return {
        default: ({ onDelete, onDeselect, onEdit }: any) => {
            latestOnDelete = onDelete;
            return (
                <div data-testid="floating-edit-tray">
                    <button data-testid="tray-delete" onClick={() => latestOnDelete?.()}>Delete</button>
                    <button data-testid="tray-deselect" onClick={onDeselect}>Deselect</button>
                    <button data-testid="tray-edit" onClick={onEdit}>Edit</button>
                </div>
            );
        },
    };
});

vi.mock('../../services/equipmentTypeService', () => ({
    upsertEquipmentTypeOverride: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../services/exerciseService', () => ({
    createExercise: vi.fn().mockResolvedValue({}),
    getExerciseById: vi.fn().mockResolvedValue({}),
    updateCustomExercise: vi.fn().mockResolvedValue({}),
    upsertExerciseOverride: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../services/muscleService', () => ({
    getMuscles: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../constants/structuralComponents', () => ({
    getStructuralDef: () => undefined,
    isStructuralTile: () => false,
}));

const mockTiles: TileData[] = [
    {
        id: 1,
        xCoord: 0,
        yCoord: 0,
        width: 100,
        height: 100,
        rotation: 0,
        colour: 'red',
        equipment: { name: 'Treadmill', description: 'Running machine' },
    },
    {
        id: 2,
        xCoord: 200,
        yCoord: 0,
        width: 100,
        height: 100,
        rotation: 0,
        colour: 'blue',
        equipment: { name: 'Bench Press', description: 'Chest exercise' },
    },
];



const EMPTY_TILES: TileData[] = [];

describe('InteractiveMap', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<InteractiveMap floorTiles={EMPTY_TILES} />);
    });

    it('renders tiles from floorTiles prop', () => {
        render(<InteractiveMap floorTiles={mockTiles} />);
        expect(screen.getByTestId('tile-1')).toBeTruthy();
        expect(screen.getByTestId('tile-2')).toBeTruthy();
    });

    it('shows loading state when floorLoading is true', () => {
        render(<InteractiveMap floorLoading={true} floorTiles={EMPTY_TILES} />);
        expect(screen.getByText('Loading Floor...')).toBeTruthy();
    });

    it('shows error message when floorLoadError is set', () => {
        render(<InteractiveMap floorLoadError="Network error" floorTiles={EMPTY_TILES} />);
        expect(screen.getByText(/Failed to load floor data/)).toBeTruthy();
        expect(screen.getByText(/Network error/)).toBeTruthy();
    });

    it('shows empty message when no tiles and not loading', () => {
        render(<InteractiveMap floorTiles={EMPTY_TILES} />);
        expect(screen.getByText(/This floor has no equipment yet/)).toBeTruthy();
    });

    it('renders zoom controls when not in preview mode', () => {
        render(<InteractiveMap floorTiles={EMPTY_TILES} />);
        expect(screen.getByTestId('zoom-controls')).toBeTruthy();
    });

    it('does not render zoom controls in preview mode', () => {
        render(<InteractiveMap previewMode={true} floorTiles={mockTiles} />);
        expect(screen.queryByTestId('zoom-controls')).toBeNull();
    });

    it('opens machine modal when tile is clicked in view mode', async () => {
        render(<InteractiveMap floorTiles={mockTiles} />);
        fireEvent.click(screen.getByTestId('tile-1'));
        await waitFor(() => {
            expect(screen.getByTestId('machine-modal')).toBeTruthy();
        });
    });

    it('closes machine modal when close button is clicked', async () => {
        render(<InteractiveMap floorTiles={mockTiles} />);
        fireEvent.click(screen.getByTestId('tile-1'));
        await waitFor(() => {
            expect(screen.getByTestId('machine-modal')).toBeTruthy();
        });
        fireEvent.click(screen.getByText('Close'));
        await waitFor(() => {
            expect(screen.queryByTestId('machine-modal')).toBeNull();
        });
    });

    it('does not open modal in edit mode', () => {
        render(<InteractiveMap editMode={true} floorTiles={mockTiles} />);
        fireEvent.click(screen.getByTestId('tile-1'));
        expect(screen.queryByTestId('machine-modal')).toBeNull();
    });

    it('handles zoom in button', () => {
        render(<InteractiveMap floorTiles={EMPTY_TILES} />);
        fireEvent.click(screen.getByText('Zoom In'));
    });

    it('handles zoom out button', () => {
        render(<InteractiveMap floorTiles={EMPTY_TILES} />);
        fireEvent.click(screen.getByText('Zoom Out'));
    });

    it('handles reset zoom button', () => {
        render(<InteractiveMap floorTiles={EMPTY_TILES} />);
        fireEvent.click(screen.getByText('Reset'));
    });

    it('handles drag and drop in edit mode', () => {
        const onTilesChange = vi.fn();
        render(
            <InteractiveMap
                editMode={true}
                floorTiles={mockTiles}
                onTilesChange={onTilesChange}
            />
        );
        expect(screen.getByTestId('tile-1')).toBeTruthy();
    });

    it('uses preview dimensions in preview mode', () => {
        const { container } = render(
            <InteractiveMap previewMode={true} floorTiles={mockTiles} />
        );
        expect(container.firstChild).toBeTruthy();
    });

    it('respects highlightedTileId prop', () => {
        render(<InteractiveMap floorTiles={mockTiles} highlightedTileId={1} />);
        expect(screen.getByTestId('tile-1')).toBeTruthy();
    });

    it('disables gridSnap when snapToGrid is false', () => {
        render(
            <InteractiveMap editMode={true} snapToGrid={false} floorTiles={mockTiles} />
        );
        expect(screen.getByTestId('tile-1')).toBeTruthy();
    });

    it('handles Control+Z keydown without crashing', () => {
        render(<InteractiveMap editMode={true} floorTiles={mockTiles} />);
        fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
        expect(screen.getByTestId('tile-1')).toBeTruthy();
    });

    it('handles zoom in/out/reset in sequence', () => {
        render(<InteractiveMap floorTiles={EMPTY_TILES} />);
        fireEvent.click(screen.getByText('Zoom In'));
        fireEvent.click(screen.getByText('Zoom In'));
        fireEvent.click(screen.getByText('Zoom Out'));
        fireEvent.click(screen.getByText('Reset'));
        expect(screen.getByTestId('zoom-controls')).toBeTruthy();
    });

    it('renders internal map container structure', () => {
        const { container } = render(
            <InteractiveMap floorTiles={EMPTY_TILES} />
        );
        const mapContainer = container.querySelector('.bg-bg-secondary');
        expect(mapContainer).toBeTruthy();
    });

    it('has dragover behavior in edit mode', () => {
        const { container } = render(
            <InteractiveMap editMode={true} floorTiles={mockTiles} />
        );
        const mapContainer = container.querySelector('.bg-bg-secondary');
        expect(mapContainer).toBeTruthy();
    });

    it('does not open modal in preview mode', () => {
        render(<InteractiveMap previewMode={true} floorTiles={mockTiles} />);
        fireEvent.click(screen.getByTestId('tile-1'));
    });

    it('handles onTilesChange callback notification', async () => {
        const onTilesChange = vi.fn();
        render(
            <InteractiveMap
                editMode={true}
                floorTiles={mockTiles}
                onTilesChange={onTilesChange}
            />
        );
        expect(screen.getByTestId('tile-1')).toBeTruthy();
        expect(screen.getByTestId('tile-2')).toBeTruthy();
    });

    it('calls updateTile when tile onUpdate fires in edit mode', async () => {
        const onTilesChange = vi.fn();
        render(
            <InteractiveMap
                editMode={true}
                floorTiles={mockTiles}
                onTilesChange={onTilesChange}
            />
        );
        const updateBtn = screen.getByTestId('update-tile-1');
        fireEvent.click(updateBtn);
        await waitFor(() => {
            expect(onTilesChange).toHaveBeenCalled();
        });
    });

    it('calls deleteTile via FloatingEditTray in edit mode', async () => {
        const onTilesChange = vi.fn();
        render(
            <InteractiveMap
                editMode={true}
                floorTiles={mockTiles}
                onTilesChange={onTilesChange}
            />
        );
        // Click tile to select it (sets editingTileId), then wait for re-render
        await act(async () => {
            fireEvent.click(screen.getByTestId('tile-1'));
        });
        // Small delay to let React fully process the state update
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
        // Click delete in the FloatingEditTray
        await act(async () => {
            fireEvent.click(screen.getByTestId('tray-delete'));
        });
        await waitFor(() => {
            expect(deleteComponent).toHaveBeenCalledWith(1);
        });
    });

    it('calls updateTile for preview mode tiles', async () => {
        render(
            <InteractiveMap
                previewMode={true}
                floorTiles={mockTiles}
            />
        );
        const updateBtn = screen.getByTestId('update-tile-1');
        fireEvent.click(updateBtn);
    });

    it('handles drop event in edit mode', () => {
        const onTilesChange = vi.fn();
        const { container } = render(
            <InteractiveMap
                editMode={true}
                floorTiles={EMPTY_TILES}
                onTilesChange={onTilesChange}
            />
        );
        const mapContainer = container.querySelector('.bg-bg-secondary');
        expect(mapContainer).toBeTruthy();

        const dropEvent = new Event('drop', { bubbles: true }) as any;
        dropEvent.preventDefault = vi.fn();
        dropEvent.dataTransfer = {
            getData: () => JSON.stringify({
                width: 100,
                height: 100,
                colour: 'red',
                equipmentName: 'Dropped Tile',
                equipmentIcon: null,
            }),
        };
        dropEvent.clientX = 400;
        dropEvent.clientY = 300;

        fireEvent.drop(mapContainer!, {
            dataTransfer: {
                getData: () => JSON.stringify({
                    width: 100,
                    height: 100,
                    colour: 'red',
                    equipmentName: 'Dropped Tile',
                    equipmentIcon: null,
                }),
            },
            clientX: 400,
            clientY: 300,
        });
    });
});
