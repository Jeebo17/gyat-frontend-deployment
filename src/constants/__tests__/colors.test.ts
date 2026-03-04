import { describe, it, expect } from 'vitest';
import { colors } from '../colors';
import type { Theme, ColorCategory } from '../colors';

describe('colors', () => {
    it('exports light theme colors', () => {
        expect(colors.light).toBeDefined();
        expect(colors.light.background.primary).toBe('#ffffff');
        expect(colors.light.text.primary).toBe('#1a1a1a');
        expect(colors.light.accent.primary).toBe('#0066cc');
    });

    it('exports dark theme colors', () => {
        expect(colors.dark).toBeDefined();
        expect(colors.dark.background.primary).toBe('#1a1a1a');
        expect(colors.dark.text.primary).toBe('#ffffff');
        expect(colors.dark.accent.primary).toBe('#4da6ff');
    });

    it('exports high contrast light theme', () => {
        expect(colors.lightHighContrast).toBeDefined();
        expect(colors.lightHighContrast.text.primary).toBe('#000000');
        expect(colors.lightHighContrast.background.primary).toBe('#ffffff');
    });

    it('exports high contrast dark theme', () => {
        expect(colors.darkHighContrast).toBeDefined();
        expect(colors.darkHighContrast.text.primary).toBe('#ffffff');
        expect(colors.darkHighContrast.background.primary).toBe('#000000');
    });

    it('has consistent structure across theme variants', () => {
        const categories: ColorCategory[] = ['background', 'text', 'accent', 'border', 'interactive'];
        
        for (const category of categories) {
            expect(colors.light[category]).toBeDefined();
            expect(colors.dark[category]).toBeDefined();
        }
    });

    it('Theme type allows light and dark', () => {
        const theme1: Theme = 'light';
        const theme2: Theme = 'dark';
        expect(theme1).toBe('light');
        expect(theme2).toBe('dark');
    });
});
