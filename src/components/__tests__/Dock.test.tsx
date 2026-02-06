import { render, screen } from '@testing-library/react';
import Dock from '../Dock';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';


describe('Dock Component', () => {
    it('renders dock items', () => {
        render(
            <MemoryRouter>
                <Dock />
            </MemoryRouter>
        );
        const toolbar = screen.getByRole('toolbar', { name: /application dock/i });
        expect(toolbar).toBeInTheDocument();
    });

    it('renders the correct icons for the initial path', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Dock />
            </MemoryRouter>
        );
        expect(screen.getByTestId('io5-home')).toBeInTheDocument();
        expect(screen.getByTestId('io5-map-outline')).toBeInTheDocument();
        expect(screen.getByTestId('io5-settings-outline')).toBeInTheDocument();
    });

    it('has correct aria-label for accessibility', () => {
        render(
            <MemoryRouter>
                <Dock />
            </MemoryRouter>
        );
        const toolbar = screen.getByRole('toolbar', { name: /application dock/i });
        expect(toolbar).toHaveAttribute('aria-label', 'Application dock');
    });
});