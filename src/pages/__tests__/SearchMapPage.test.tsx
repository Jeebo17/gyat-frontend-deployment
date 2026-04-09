import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SearchMapPage from '../SearchMapPage';

// Mock dependencies
vi.mock('../../components/effects/ShinyText', () => ({
    default: ({ text, className }: { text: string; className?: string }) => (
        <span className={className}>{text}</span>
    ),
}));

vi.mock('../../components/index', () => ({
    Header: () => <header data-testid="header">Header Mock</header>,
    SearchBar: ({ placeholder }: { placeholder?: string }) => (
        <input data-testid="search-bar" placeholder={placeholder} />
    ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../services/layoutService', () => ({
    getAllPublicLayouts: vi.fn(),
}));

import { getAllPublicLayouts } from '../../services/layoutService';

describe('SearchMapPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the heading and description', async () => {
        vi.mocked(getAllPublicLayouts).mockResolvedValue([]);

        render(<SearchMapPage />);

        expect(screen.getByText('Discover Gym Layouts')).toBeTruthy();
        expect(screen.getByText(/Search for a gym layout/)).toBeTruthy();
    });

    it('renders the search bar', async () => {
        vi.mocked(getAllPublicLayouts).mockResolvedValue([]);

        render(<SearchMapPage />);

        expect(screen.getByTestId('search-bar')).toBeTruthy();
    });

    it('renders the header', async () => {
        vi.mocked(getAllPublicLayouts).mockResolvedValue([]);

        render(<SearchMapPage />);

        expect(screen.getByTestId('header')).toBeTruthy();
    });

    it('shows loading skeletons while fetching', () => {
        vi.mocked(getAllPublicLayouts).mockImplementation(
            () => new Promise(() => {}) // never resolves
        );

        render(<SearchMapPage />);

        // Should show animated pulse placeholders
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBe(6);
    });

    it('displays gyms after loading sorted by id', async () => {
        vi.mocked(getAllPublicLayouts).mockResolvedValue([
            { id: 5, name: 'Iron Palace', managerId: 1, floors: [], components: [] },
            { id: 2, name: 'Gold Gym', managerId: 1, floors: [], components: [] },
            { id: 9, name: 'Peak Performance', managerId: 1, floors: [], components: [] },
        ]);

        render(<SearchMapPage />);

        await waitFor(() => {
            expect(screen.getByText('Gold Gym')).toBeTruthy();
            expect(screen.getByText('Iron Palace')).toBeTruthy();
            expect(screen.getByText('Peak Performance')).toBeTruthy();

            const headings = screen.getAllByRole('heading', { level: 3 });
            expect(headings.map((heading) => heading.textContent)).toEqual([
                'Gold Gym',
                'Iron Palace',
                'Peak Performance',
            ]);
        });
    });

    it('shows empty message when no layouts', async () => {
        vi.mocked(getAllPublicLayouts).mockResolvedValue([]);

        render(<SearchMapPage />);

        await waitFor(() => {
            expect(screen.getByText('No gym layouts available yet.')).toBeTruthy();
        });
    });

    it('renders All Gyms heading', async () => {
        vi.mocked(getAllPublicLayouts).mockResolvedValue([]);

        render(<SearchMapPage />);

        await waitFor(() => {
            expect(screen.getByText('All Gyms')).toBeTruthy();
        });
    });

    it('handles API errors gracefully', async () => {
        vi.mocked(getAllPublicLayouts).mockRejectedValue(new Error('Network error'));

        render(<SearchMapPage />);

        // Should show empty state (error is caught, empty list)
        await waitFor(() => {
            expect(screen.getByText('No gym layouts available yet.')).toBeTruthy();
        });
    });

    it('displays layout IDs for recommended gyms', async () => {
        vi.mocked(getAllPublicLayouts).mockResolvedValue([
            { id: 42, name: 'Test Gym', managerId: 1, floors: [], components: [] },
        ]);

        render(<SearchMapPage />);

        await waitFor(() => {
            expect(screen.getByText('Layout #42')).toBeTruthy();
        });
    });
});
