import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchBar } from '../SearchBar';
import type { TileSearchProps } from '../../types/tile';

const mockSearchData: TileSearchProps[] = [
    { id: 1, name: 'Treadmill', description: 'A running machine', floorName: 'Floor 1' },
    { id: 2, name: 'Bench Press', description: 'For chest exercises', floorName: 'Floor 1' },
    { id: 3, name: 'Rowing Machine', description: 'Full body workout', floorName: 'Floor 2' },
];

describe('SearchBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the search input', () => {
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        expect(input).toBeInTheDocument();
    });

    it('filters results based on name query', () => {
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Treadmill' } });
        expect(screen.getByText('Treadmill')).toBeInTheDocument();
        expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
    });

    it('filters results based on description query', () => {
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'chest' } });
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    it('shows "No results found" when there are no matches', () => {
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'nonexistent' } });
        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('shows no dropdown when query is empty', () => {
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: '' } });
        expect(screen.queryByText('Treadmill')).not.toBeInTheDocument();
        expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('calls onSelect when a result is clicked', () => {
        const onSelect = vi.fn();
        render(<SearchBar searchData={mockSearchData} onSelect={onSelect} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Treadmill' } });
        const result = screen.getByText('Treadmill');
        fireEvent.mouseDown(result.closest('li')!);
        expect(onSelect).toHaveBeenCalledWith(mockSearchData[0]);
    });

    it('updates input value when a result is selected', () => {
        render(<SearchBar searchData={mockSearchData} />);
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
                <SearchBar searchData={mockSearchData} />
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
        render(<SearchBar searchData={mockSearchData} />);
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
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'machine' } });
        expect(screen.getByText('Floor: Floor 2')).toBeInTheDocument();
    });

    it('displays item id for each result', () => {
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'Treadmill' } });
        expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('is case insensitive', () => {
        render(<SearchBar searchData={mockSearchData} />);
        const input = screen.getByPlaceholderText('Search for equipment...');
        fireEvent.change(input, { target: { value: 'treadmill' } });
        expect(screen.getByText('Treadmill')).toBeInTheDocument();
    });
});
