import { EquipmentProps } from '../types/equipment';
import { TileProps } from '../types/tile';

export const mockEquipment: EquipmentProps = {
    title: 'Equipment Title #1',
    description: 'Equipment Description #1',
    musclesTargeted: [
        'Muscle 1',
        'Muscle 2',
        'Muscle 3',
        'Muscle 4',
        'Muscle 5'
    ],
    benefits: [
        'Benefit 1',
        'Benefit 2',
        'Benefit 3',
        'Benefit 4',
        'Benefit 5'
    ],
};


export const mockTile: TileProps = {
    id: 1,
    equipment: mockEquipment,
    x: 20,
    y: 160,
    width: 240,
    height: 100,
    rotation: 0,
    colour: 'red',
};

export const mockTiles: TileProps[] = [
    mockTile,
    {
        ...mockTile,
        id: 2,
        x: 280,
        y: 160,
        colour: 'blue',
        equipment: {
            title: 'Equipment Title #2',
            description: 'Equipment Description #2',
            musclesTargeted: ['Muscle 2', 'Muscle 4'],
        },
    },
    {
        ...mockTile,
        id: 3,
        x: 20,
        y: 300,
        colour: 'green',
        equipment: {
            title: 'Equipment Title #3',
            description: 'Equipment Description #3',
            musclesTargeted: ['Muscle 1', 'Muscle 3', 'Muscle 5'],
        },
    },
];

export const createMockTile = (overrides: Partial<TileProps> = {}): TileProps => {
    return {
        ...mockTile,
        ...overrides,
    };
};

export const createMockEquipment = (overrides: Partial<EquipmentProps> = {}): EquipmentProps => {
    return {
        ...mockEquipment,
        ...overrides,
    };
};
