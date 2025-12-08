import { render, screen } from '@testing-library/react';
import ToggleSwitch from '../ToggleSwitch';
import { describe, it, expect, vi } from 'vitest';

describe('ToggleSwitch', () => {
    it('renders a button', () => {
        render(<ToggleSwitch checked={false} onChange={vi.fn()} />);
        const input = screen.getByRole('checkbox');
        expect(input).toBeInTheDocument();
    });

    it('calls onChange with true when toggled from unchecked', () => {
        const onChange = vi.fn();
        render(<ToggleSwitch checked={false} onChange={onChange} />);
        const input = screen.getByRole('checkbox');
        input.click();
        expect(onChange).toHaveBeenCalledWith(true);
    })

    it('calls onChange with false when toggled from unchecked', () => {
        const onChange = vi.fn();
        render(<ToggleSwitch checked={true} onChange={onChange} />);
        const input = screen.getByRole('checkbox');
        input.click();
        expect(onChange).toHaveBeenCalledWith(false);
    })

    it('has correct checked state', () => {
        const { rerender } = render(<ToggleSwitch checked={false} onChange={vi.fn()} />);
        const input = screen.getByRole('checkbox') as HTMLInputElement;
        expect(input.checked).toBe(false);

        rerender(<ToggleSwitch checked={true} onChange={vi.fn()} />);
        const inputChecked = screen.getByRole('checkbox') as HTMLInputElement;
        expect(inputChecked.checked).toBe(true);
    });

    it('applies highlight class when highlight is true and checked', () => {
        const { container } = render(<ToggleSwitch checked={true} onChange={vi.fn()} highlight={true} />);
        const boxDiv = container.querySelector('.box');
        expect(boxDiv).toHaveClass('bg-accent-primary');
    });

    it('applies non-highlight class when highlight is false', () => {
        const { container } = render(<ToggleSwitch checked={true} onChange={vi.fn()} highlight={false} />);
        const boxDiv = container.querySelector('.box');
        expect(boxDiv).toHaveClass('bg-bg-tertiary');
    });

    it('does not apply highlight class when checked is false', () => {
        const { container } = render(<ToggleSwitch checked={false} onChange={vi.fn()} highlight={true} />);
        const boxDiv = container.querySelector('.box');
        expect(boxDiv).toHaveClass('bg-bg-tertiary');
    });

    it('has default highlight as true', () => {
        const { container } = render(<ToggleSwitch checked={true} onChange={vi.fn()} />);   
        const boxDiv = container.querySelector('.box');
        expect(boxDiv).toHaveClass('bg-accent-primary');
    });

    it('slider has correct position when checked', () => {
        const { container } = render(<ToggleSwitch checked={true} onChange={vi.fn()} />);
        const sliderDiv = container.querySelector('div.absolute');
        expect(sliderDiv).toHaveClass('translate-x-full');
    });

    it('slider has correct position when unchecked', () => {
        const { container } = render(<ToggleSwitch checked={false} onChange={vi.fn()} />);
        const sliderDiv = container.querySelector('div.absolute');
        expect(sliderDiv).not.toHaveClass('translate-x-full');
    });
});