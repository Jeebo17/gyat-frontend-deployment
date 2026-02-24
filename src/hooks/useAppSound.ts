import useSound from 'use-sound';
import { useSettings } from '../context/SettingsContext';


// Drop-in wrapper around `useSound` that respects the global
// `soundEnabled` setting.  When sounds are disabled the returned
// `play` function is a no-op — no `if` checks needed at call sites.

export function useAppSound(src: string, options?: { volume?: number }) {
    const { soundEnabled } = useSettings();
    const [play, exposedData] = useSound(src, {
        ...options,
        volume: soundEnabled ? (options?.volume ?? 0.3) : 0,
        soundEnabled,          // use-sound's built-in gate
    });

    const safePlay = soundEnabled ? play : () => {};

    return [safePlay, exposedData] as const;
}
