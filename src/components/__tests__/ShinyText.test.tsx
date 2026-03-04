import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ShinyText from '../effects/ShinyText';

describe('ShinyText', () => {
    it('renders the text', () => {
        const { getByText } = render(<ShinyText text="Hello World" />);
        expect(getByText('Hello World')).toBeInTheDocument();
    });

    it('applies animate-shine class when not disabled', () => {
        const { container } = render(<ShinyText text="Test" disabled={false} />);
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain('animate-shine');
    });

    it('does not apply animate-shine class when disabled', () => {
        const { container } = render(<ShinyText text="Test" disabled={true} />);
        const div = container.firstChild as HTMLElement;
        expect(div.className).not.toContain('animate-shine');
    });

    it('applies custom className', () => {
        const { container } = render(<ShinyText text="Test" className="custom-class" />);
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain('custom-class');
    });

    it('applies correct animation speed', () => {
        const { container } = render(<ShinyText text="Test" speed={3} />);
        const div = container.firstChild as HTMLElement;
        expect(div.style.animationDuration).toBe('3s');
    });

    it('uses default speed of 5s', () => {
        const { container } = render(<ShinyText text="Test" />);
        const div = container.firstChild as HTMLElement;
        expect(div.style.animationDuration).toBe('5s');
    });

    it('has background-clip text styling', () => {
        const { container } = render(<ShinyText text="Test" />);
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain('bg-clip-text');
    });
});
