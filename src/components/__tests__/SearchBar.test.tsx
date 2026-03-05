import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchBar } from '../components/index';
import type { TileSearchProps } from '../../types/tile';

const mockSearchData: TileSearchProps[] = [
    { id: 1, name: 'Treadmill', description: 'A running machine', floorName: 'Floor 1' },
    { id: 2, name: 'Bench Press', description: 'For chest exercises', floorName: 'Floor 1' },
    { id: 3, name: 'Rowing Machine', description: 'Full body workout', floorName: 'Floor 2' },
];

const tileFilterFn = (item: TileSearchProps, query: string) => {
    const lower = query.toLowerCase();
    return item.name.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower);
};

const tileRenderItem = (item: TileSearchProps) => (
    <>
        <span>
            <span className="font-medium">{item.name}</span>
            <span className="font-light ml-1 text-xs">#{item.id}</span>
        </span>
        <span className="ml-2 text-xs opacity-60">Floor: {item.floorName}</span>
        <span className="ml-2 text-xs opacity-60">{item.description}</span>
    </>
);

describe('SearchBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the search input', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        expect(input).toBeInTheDocument();
    });

    it('filters results based on name query', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Treadmill' } });
        expect(screen.getByText('Treadmill')).toBeInTheDocument();
        expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
    });

    it('filters results based on description query', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." filterFn={tileFilterFn} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'chest' } });
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    it('shows "No results found" when there are no matches', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'nonexistent' } });
        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('shows no dropdown when query is empty', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: '' } });
        expect(screen.queryByText('Treadmill')).not.toBeInTheDocument();
        expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('calls onSelect when a result is clicked', () => {
        const onSelect = vi.fn();
        render(<SearchBar searchData={mockSearchData} onSelect={onSelect} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Treadmill' } });
        const result = screen.getByText('Treadmill');
        fireEvent.mouseDown(result.closest('li')!);
        expect(onSelect).toHaveBeenCalledWith(mockSearchData[0]);
    });

    it('updates input value when a result is selected', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Tread' } });
        const result = screen.getByText('Treadmill');
        fireEvent.mouseDown(result.closest('li')!);
        expect(input.value).toBe('Treadmill');
    });

    it('closes dropdown when clicking outside', () => {
        render(
            <div>
                <div data-testid="outside">Outside</div>
                <SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />
            </div>
        );
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Treadmill' } });
        expect(screen.getByText('Treadmill')).toBeInTheDocument();

        fireEvent.mouseDown(screen.getByTestId('outside'));
        // After clicking outside, dropdown should close
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('opens dropdown on input focus', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Tread' } });
        // Close it first
        fireEvent.mouseDown(document);
        // Refocus
        fireEvent.focus(input);
        // Should be visible again
        expect(screen.getByText('Treadmill')).toBeInTheDocument();
    });

    it('displays floor name for each result', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." filterFn={tileFilterFn} renderItem={tileRenderItem} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'machine' } });
        expect(screen.getByText('Floor: Floor 2')).toBeInTheDocument();
    });

    it('displays item id for each result', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." renderItem={tileRenderItem} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Treadmill' } });
        expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('is case insensitive', () => {
        render(<SearchBar searchData={mockSearchData} placeholder="Search for equipment..." />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'treadmill' } });
        expect(screen.getByText('Treadmill')).toBeInTheDocument();
    });

    it('uses default placeholder when none provided', () => {
        render(<SearchBar searchData={mockSearchData} />);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('works with minimal data types', () => {
        const simpleData = [
            { id: 1, name: 'Gym A' },
            { id: 2, name: 'Gym B' },
        ];
        render(<SearchBar searchData={simpleData} />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'Gym A' } });
        expect(screen.getByText('Gym A')).toBeInTheDocument();
        expect(screen.queryByText('Gym B')).not.toBeInTheDocument();
    });
});
