import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapComponentToTile, getPreviewTiles, getFloorTiles } from '../tileService';
import type { EquipmentDefinitionDTO } from '../../types/api';

vi.mock('../layoutService', () => ({
    getLayout: vi.fn(),
}));

import { getLayout } from '../layoutService';
const mockGetLayout = vi.mocked(getLayout);

describe('tileService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('mapComponentToTile', () => {
        const baseComponent = {
            id: 1,
            layoutId: 1,
            floorId: 1,
            xCoord: 100,
            yCoord: 200,
            width: 240,
            height: 100,
            rotation: 0,
            equipmentTypeId: 3,
        } as any;

        const definitions: Partial<Record<number, EquipmentDefinitionDTO>> = {
            3: {
                id: 3,
                name: 'Treadmill',
                brand: null,
                imageUrl: null,
                description: 'A running machine',
                safetyInfo: null,
                exercises: [
                    {
                        id: 1,
                        name: 'Running',
                        description: 'Cardio running',
                        videoUrl: 'https://example.com/video',
                        difficulty: 'Medium',
                        equipmentTypeId: 3,
                        equipmentTypeName: 'Treadmill',
                        muscles: ['Quadriceps', 'Calves'],
                    },
                    {
                        id: 2,
                        name: 'Walking',
                        description: 'Light walking',
                        videoUrl: null,
                        difficulty: 'Easy',
                        equipmentTypeId: 3,
                        equipmentTypeName: 'Treadmill',
                        muscles: ['Quadriceps', 'Glutes'],
                    },
                ],
            } as EquipmentDefinitionDTO,
        };

        it('maps component to tile with correct basic properties', () => {
            const tile = mapComponentToTile(baseComponent, definitions);
            expect(tile.id).toBe(1);
            expect(tile.xCoord).toBe(100);
            expect(tile.yCoord).toBe(200);
            expect(tile.width).toBe(240);
            expect(tile.height).toBe(100);
            expect(tile.rotation).toBe(0);
        });

        it('uses equipment name from definition', () => {
            const tile = mapComponentToTile(baseComponent, definitions);
            expect(tile.equipment.name).toBe('Treadmill');
        });

        it('uses equipment description from definition', () => {
            const tile = mapComponentToTile(baseComponent, definitions);
            expect(tile.equipment.description).toContain('A running machine');
        });

        it('maps exercises to benefits', () => {
            const tile = mapComponentToTile(baseComponent, definitions);
            expect(tile.equipment.benefits).toEqual(['Running', 'Walking']);
        });

        it('deduplicates muscles targeted', () => {
            const tile = mapComponentToTile(baseComponent, definitions);
            expect(tile.equipment.musclesTargeted).toEqual(['Quadriceps', 'Calves', 'Glutes']);
        });

        it('passes safetyInfo from definition', () => {
            const defs: Partial<Record<number, EquipmentDefinitionDTO>> = {
                3: { ...definitions[3]!, safetyInfo: 'Use a spotter' },
            };
            const tile = mapComponentToTile(baseComponent, defs);
            expect(tile.equipment.safetyInfo).toBe('Use a spotter');
        });

        it('passes imageUrl and brand from definition', () => {
            const defs: Partial<Record<number, EquipmentDefinitionDTO>> = {
                3: { ...definitions[3]!, imageUrl: 'https://example.com/img.png', brand: 'Rogue' },
            };
            const tile = mapComponentToTile(baseComponent, defs);
            expect(tile.equipment.imageUrl).toBe('https://example.com/img.png');
            expect(tile.equipment.brand).toBe('Rogue');
        });

        it('assigns colour based on equipment type id', () => {
            const tile = mapComponentToTile(baseComponent, definitions);
            expect(tile.colour).toBeTruthy();
            expect(typeof tile.colour).toBe('string');
        });

        it('handles missing definition gracefully', () => {
            const unknownComponent = { ...baseComponent, equipmentTypeId: 999 };
            const tile = mapComponentToTile(unknownComponent, definitions);
            expect(tile.equipment.name).toContain('Equipment #999');
            expect(tile.equipment.description).toBe('No description provided.');
        });

        it('uses equipmentId as fallback when equipmentTypeId is not a number', () => {
            const fallbackComponent = { ...baseComponent, equipmentTypeId: undefined, equipmentId: 3 };
            const tile = mapComponentToTile(fallbackComponent, definitions);
            expect(tile.equipment.name).toBe('Treadmill');
        });

        it('falls back to equipmentTypeId 0 when neither id is a number', () => {
            const noIdComponent = { ...baseComponent, equipmentTypeId: undefined, equipmentId: undefined };
            const tile = mapComponentToTile(noIdComponent, {});
            expect(tile.equipment.name).toBe('Equipment #0');
        });

        it('applies modalOverrides from additionalInfo JSON', () => {
            const comp = {
                ...baseComponent,
                additionalInfo: JSON.stringify({
                    notes: 'Near entrance',
                    modalOverrides: {
                        name: 'Override Name',
                        description: 'Override Desc',
                        benefits: ['Benefit A'],
                        musclesTargeted: ['Biceps', 'Triceps'],
                    },
                }),
            };
            const tile = mapComponentToTile(comp, definitions);
            expect(tile.equipment.name).toBe('Override Name');
            expect(tile.equipment.description).toBe('Override Desc');
            expect(tile.equipment.benefits).toEqual(['Benefit A']);
            expect(tile.equipment.musclesTargeted).toEqual(['Biceps', 'Triceps']);
        });

        it('ignores invalid additionalInfo JSON gracefully', () => {
            const comp = { ...baseComponent, additionalInfo: 'not-json' };
            const tile = mapComponentToTile(comp, definitions);
            expect(tile.equipment.name).toBe('Treadmill');
        });

        it('falls back to Equipment #id when no definition and no overrides', () => {
            const unknownComp = { ...baseComponent, equipmentTypeId: 999 };
            const tile = mapComponentToTile(unknownComp, {});
            expect(tile.equipment.name).toBe('Equipment #999');
            expect(tile.equipment.description).toBe('No description provided.');
        });

        it('handles empty exercises array', () => {
            const defs: Partial<Record<number, EquipmentDefinitionDTO>> = {
                3: {
                    id: 3,
                    name: 'Empty Machine',
                    brand: null,
                    imageUrl: null,
                    description: 'No exercises',
                    safetyInfo: null,
                    exercises: [],
                } as EquipmentDefinitionDTO,
            };
            const tile = mapComponentToTile(baseComponent, defs);
            expect(tile.equipment.benefits).toEqual([]);
            expect(tile.equipment.musclesTargeted).toBeUndefined();
        });

        it('assigns consistent colour for same equipment type', () => {
            const tile1 = mapComponentToTile({ ...baseComponent, id: 1 }, definitions);
            const tile2 = mapComponentToTile({ ...baseComponent, id: 2 }, definitions);
            expect(tile1.colour).toBe(tile2.colour);
        });

        it('stores equipmentTypeId on the tile', () => {
            const tile = mapComponentToTile(baseComponent, definitions);
            expect(tile.equipmentTypeId).toBe(3);
        });
    });

    describe('getFloorTiles', () => {
        it('returns floors, selectedFloor and mapped tiles', async () => {
            mockGetLayout.mockResolvedValue({
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
                    1: { id: 1, name: 'Bench', brand: null, imageUrl: null, description: 'A bench', safetyInfo: null, exercises: [] },
                },
            } as any);

            const result = await getFloorTiles(1, 0);
            expect(result.floors).toHaveLength(1);
            expect(result.selectedFloor?.id).toBe(10);
            expect(result.tiles).toHaveLength(1);
            expect(result.tiles[0].equipment.name).toBe('Bench');
        });

        it('returns empty when layout has no floors', async () => {
            mockGetLayout.mockResolvedValue({
                id: 1,
                name: 'Empty',
                isPublic: true,
                floors: [],
                components: [],
                definitions: {},
            } as any);

            const result = await getFloorTiles(1, 0);
            expect(result.floors).toHaveLength(0);
            expect(result.selectedFloor).toBeNull();
            expect(result.tiles).toHaveLength(0);
        });

        it('clamps floor index to valid range', async () => {
            mockGetLayout.mockResolvedValue({
                id: 1,
                name: 'Multi',
                isPublic: true,
                floors: [
                    { id: 10, layoutId: 1, name: 'Ground', levelOrder: 0, width: 800, height: 600 },
                    { id: 20, layoutId: 1, name: 'First', levelOrder: 1, width: 800, height: 600 },
                ],
                components: [],
                definitions: {},
            } as any);

            const result = await getFloorTiles(1, 99);
            expect(result.selectedFloor?.name).toBe('First');
        });

        it('sorts floors by levelOrder', async () => {
            mockGetLayout.mockResolvedValue({
                id: 1,
                name: 'Multi',
                isPublic: true,
                floors: [
                    { id: 20, layoutId: 1, name: 'First', levelOrder: 1, width: 800, height: 600 },
                    { id: 10, layoutId: 1, name: 'Ground', levelOrder: 0, width: 800, height: 600 },
                ],
                components: [],
                definitions: {},
            } as any);

            const result = await getFloorTiles(1, 0);
            expect(result.floors[0].name).toBe('Ground');
            expect(result.floors[1].name).toBe('First');
        });

        it('only includes tiles for the selected floor', async () => {
            mockGetLayout.mockResolvedValue({
                id: 1,
                name: 'Multi',
                isPublic: true,
                floors: [
                    { id: 10, layoutId: 1, name: 'Ground', levelOrder: 0, width: 800, height: 600 },
                    { id: 20, layoutId: 1, name: 'First', levelOrder: 1, width: 800, height: 600 },
                ],
                components: [
                    { id: 1, layoutId: 1, floorId: 10, xCoord: 0, yCoord: 0, width: 100, height: 100, rotation: 0, equipmentTypeId: 1 },
                    { id: 2, layoutId: 1, floorId: 20, xCoord: 0, yCoord: 0, width: 100, height: 100, rotation: 0, equipmentTypeId: 1 },
                ],
                definitions: {},
            } as any);

            const result = await getFloorTiles(1, 0);
            expect(result.tiles).toHaveLength(1);
            expect(result.tiles[0].id).toBe(1);
        });
    });

    describe('getPreviewTiles', () => {
        it('returns an array of tiles', () => {
            const tiles = getPreviewTiles();
            expect(Array.isArray(tiles)).toBe(true);
            expect(tiles.length).toBeGreaterThan(0);
        });

        it('each tile has required properties', () => {
            const tiles = getPreviewTiles();
            tiles.forEach(tile => {
                expect(tile).toHaveProperty('id');
                expect(tile).toHaveProperty('xCoord');
                expect(tile).toHaveProperty('yCoord');
                expect(tile).toHaveProperty('width');
                expect(tile).toHaveProperty('height');
                expect(tile).toHaveProperty('rotation');
                expect(tile).toHaveProperty('colour');
                expect(tile).toHaveProperty('equipment');
                expect(tile.equipment).toHaveProperty('name');
            });
        });

        it('tiles have unique IDs', () => {
            const tiles = getPreviewTiles();
            const ids = tiles.map(t => t.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it('contains expected equipment types', () => {
            const tiles = getPreviewTiles();
            const names = tiles.map(t => t.equipment.name);
            expect(names).toContain('Treadmill');
            expect(names).toContain('Rowing Machine');
            expect(names).toContain('Racks');
            expect(names).toContain('Free Weights');
            expect(names).toContain('Open Space');
            expect(names).toContain('Entrance');
        });

        it('entrance tile has canHover set to false', () => {
            const tiles = getPreviewTiles();
            const entrance = tiles.find(t => t.equipment.name === 'Entrance');
            expect(entrance?.canHover).toBe(false);
        });

        it('returns exactly 11 tiles', () => {
            const tiles = getPreviewTiles();
            expect(tiles).toHaveLength(11);
        });
    });
});
