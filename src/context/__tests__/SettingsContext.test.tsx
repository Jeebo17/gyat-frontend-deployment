import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../SettingsContext';

function TestConsumer() {
    const {
        fontScale,
        setFontScale,
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        soundEnabled,
        setSoundEnabled,
    } = useSettings();

    return (
        <div>
            <span data-testid="fontScale">{fontScale}</span>
            <span data-testid="reducedMotion">{String(reducedMotion)}</span>
            <span data-testid="highContrast">{String(highContrast)}</span>
            <span data-testid="soundEnabled">{String(soundEnabled)}</span>
            <button onClick={() => setFontScale(1.5)}>Set Font 1.5</button>
            <button onClick={() => setReducedMotion(true)}>Enable Motion</button>
            <button onClick={() => setHighContrast(true)}>Enable Contrast</button>
            <button onClick={() => setHighContrast(false)}>Disable Contrast</button>
            <button onClick={() => setSoundEnabled(false)}>Disable Sound</button>
        </div>
    );
}

describe('SettingsContext', () => {
    beforeEach(() => {
        document.documentElement.classList.remove('high-contrast');
        document.documentElement.style.fontSize = '';
    });

    it('provides default values', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );
        expect(screen.getByTestId('fontScale').textContent).toBe('1');
        expect(screen.getByTestId('reducedMotion').textContent).toBe('false');
        expect(screen.getByTestId('highContrast').textContent).toBe('false');
        expect(screen.getByTestId('soundEnabled').textContent).toBe('true');
    });

    it('updates fontScale', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Set Font 1.5'));
        });
        expect(screen.getByTestId('fontScale').textContent).toBe('1.5');
    });

    it('applies fontScale to root element fontSize', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Set Font 1.5'));
        });
        expect(document.documentElement.style.fontSize).toBe('150%');
    });

    it('updates reducedMotion', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Enable Motion'));
        });
        expect(screen.getByTestId('reducedMotion').textContent).toBe('true');
    });

    it('updates highContrast and adds class', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Enable Contrast'));
        });
        expect(screen.getByTestId('highContrast').textContent).toBe('true');
        expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    });

    it('removes high-contrast class when disabled', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Enable Contrast'));
        });
        expect(document.documentElement.classList.contains('high-contrast')).toBe(true);

        act(() => {
            fireEvent.click(screen.getByText('Disable Contrast'));
        });
        expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
    });

    it('updates soundEnabled', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );
        act(() => {
            fireEvent.click(screen.getByText('Disable Sound'));
        });
        expect(screen.getByTestId('soundEnabled').textContent).toBe('false');
    });

    it('throws when useSettings is used outside provider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<TestConsumer />)).toThrow(
            'useSettings must be used within SettingsProvider'
        );
        consoleError.mockRestore();
    });
});
