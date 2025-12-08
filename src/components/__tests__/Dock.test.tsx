import { getByLabelText, render, screen } from '@testing-library/react';
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

    // it('contains Home, Map, and Settings items', () => {
    //     render(
    //         <MemoryRouter>
    //             <Dock />
    //         </MemoryRouter>
    //     );
    //     expect(screen.getByLabelText('Home')).toBeInTheDocument();
    // });

    it('has correct aria-label for accessibility', () => {
        render(
            <MemoryRouter>
                <Dock />
            </MemoryRouter>
        );
        const toolbar = screen.getByRole('toolbar', { name: /application dock/i });
        expect(toolbar).toHaveAttribute('aria-label', 'Application dock');
    });

    // it('shows only Home as selected on root path', () => {
    //     render(
    //         <MemoryRouter initialEntries={["/"]}>
    //             <Dock />
    //         </MemoryRouter>
    //     );
    //     const homeIcon = screen.getByTestId('lucide-home');
    //     const mapIcon = screen.getByTestId('lucide-map-outline');
    //     const settingsIcon = screen.getByTestId('lucide-settings-outline');

    //     expect(homeIcon).toHaveAttribute('data-selected', 'true');
    //     expect(mapIcon).not.toHaveAttribute('data-selected', 'true');
    //     expect(settingsIcon).not.toHaveAttribute('data-selected', 'true');
    // });
});