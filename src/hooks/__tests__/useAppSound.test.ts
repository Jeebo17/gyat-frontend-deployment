import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockPlay = vi.fn();
const mockUseSound = vi.fn(() => [mockPlay, { stop: vi.fn(), pause: vi.fn() }]);

vi.mock('use-sound', () => ({
    default: (...args: any[]) => mockUseSound(...args),
}));

vi.mock('../../context/SettingsContext', () => ({
    useSettings: vi.fn(),
}));

import { useSettings } from '../../context/SettingsContext';
import { useAppSound } from '../useAppSound';
const mockUseSettings = vi.mocked(useSettings);

describe('useAppSound', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseSound.mockReturnValue([mockPlay, { stop: vi.fn(), pause: vi.fn() }]);
    });

    it('returns play function and exposed data', () => {
        mockUseSettings.mockReturnValue({
            soundEnabled: true,
            fontScale: 1,
            setFontScale: vi.fn(),
            reducedMotion: false,
            setReducedMotion: vi.fn(),
            highContrast: false,
            setHighContrast: vi.fn(),
            setSoundEnabled: vi.fn(),
        });

        const { result } = renderHook(() => useAppSound('/test.mp3'));
        expect(result.current).toHaveLength(2);
        expect(typeof result.current[0]).toBe('function');
    });

    it('passes sound source and options to useSound', () => {
        mockUseSettings.mockReturnValue({
            soundEnabled: true,
            fontScale: 1,
            setFontScale: vi.fn(),
            reducedMotion: false,
            setReducedMotion: vi.fn(),
            highContrast: false,
            setHighContrast: vi.fn(),
            setSoundEnabled: vi.fn(),
        });

        renderHook(() => useAppSound('/click.mp3', { volume: 0.5 }));

        expect(mockUseSound).toHaveBeenCalledWith(
            '/click.mp3',
            expect.objectContaining({
                volume: 0.5,
                soundEnabled: true,
            })
        );
    });

    it('uses default volume of 0.3 when not specified', () => {
        mockUseSettings.mockReturnValue({
            soundEnabled: true,
            fontScale: 1,
            setFontScale: vi.fn(),
            reducedMotion: false,
            setReducedMotion: vi.fn(),
            highContrast: false,
            setHighContrast: vi.fn(),
            setSoundEnabled: vi.fn(),
        });

        renderHook(() => useAppSound('/click.mp3'));

        expect(mockUseSound).toHaveBeenCalledWith(
            '/click.mp3',
            expect.objectContaining({ volume: 0.3 })
        );
    });

    it('returns no-op play when sound is disabled', () => {
        mockUseSettings.mockReturnValue({
            soundEnabled: false,
            fontScale: 1,
            setFontScale: vi.fn(),
            reducedMotion: false,
            setReducedMotion: vi.fn(),
            highContrast: false,
            setHighContrast: vi.fn(),
            setSoundEnabled: vi.fn(),
        });

        const { result } = renderHook(() => useAppSound('/click.mp3'));
        const play = result.current[0];

        // Should be a no-op, not the real play
        play();
        expect(mockPlay).not.toHaveBeenCalled();
    });

    it('sets volume to 0 when sound is disabled', () => {
        mockUseSettings.mockReturnValue({
            soundEnabled: false,
            fontScale: 1,
            setFontScale: vi.fn(),
            reducedMotion: false,
            setReducedMotion: vi.fn(),
            highContrast: false,
            setHighContrast: vi.fn(),
            setSoundEnabled: vi.fn(),
        });

        renderHook(() => useAppSound('/click.mp3', { volume: 0.8 }));

        expect(mockUseSound).toHaveBeenCalledWith(
            '/click.mp3',
            expect.objectContaining({ volume: 0, soundEnabled: false })
        );
    });

    it('allows play when sound is enabled', () => {
        mockUseSettings.mockReturnValue({
            soundEnabled: true,
            fontScale: 1,
            setFontScale: vi.fn(),
            reducedMotion: false,
            setReducedMotion: vi.fn(),
            highContrast: false,
            setHighContrast: vi.fn(),
            setSoundEnabled: vi.fn(),
        });

        const { result } = renderHook(() => useAppSound('/click.mp3'));
        const play = result.current[0];
        play();
        expect(mockPlay).toHaveBeenCalledOnce();
    });
});
