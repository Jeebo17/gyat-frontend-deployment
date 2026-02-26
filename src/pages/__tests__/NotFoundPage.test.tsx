import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from '../NotFoundPage';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../components/effects/FuzzyText', () => ({
    default: ({ children }: any) => <div data-testid="fuzzy-text">{children}</div>,
}));

describe('NotFoundPage', () => {
    it('renders 404 text', () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders the oops message', () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );
        expect(screen.getByText('oops page not found')).toBeInTheDocument();
    });

    it('renders a link to home', () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );
        const link = screen.getByText('Go to Home');
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', '/');
    });

    it('uses the FuzzyText component for 404', () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );
        expect(screen.getByTestId('fuzzy-text')).toBeInTheDocument();
    });
});
