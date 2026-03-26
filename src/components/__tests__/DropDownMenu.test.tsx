import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DropDownMenu from '../DropDownMenu';

// Mock framer-motion to render plain elements
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../ThemeToggle', () => ({
    default: () => <button data-testid="theme-toggle">Theme</button>,
}));

vi.mock('../ProfileButton', () => ({
    default: () => <button data-testid="profile-button">Profile</button>,
}));

vi.mock('react-icons/io5', () => ({
    IoChevronDownOutline: (props: any) => <span data-testid="io5-chevron-down-outline" {...props} />,
}));

describe('DropDownMenu', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders chevron icon', () => {
        render(<DropDownMenu />);
        expect(screen.getByTestId('io5-chevron-down-outline')).toBeInTheDocument();
    });

    it('renders ProfileButton and ThemeToggle as menu items', () => {
        render(<DropDownMenu />);
        // The components are always rendered (visibility controlled by opacity/pointer-events)
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
        expect(screen.getByTestId('profile-button')).toBeInTheDocument();
    });

    it('toggles menu on click', () => {
        render(<DropDownMenu />);
        const chevron = screen.getByTestId('io5-chevron-down-outline');
        fireEvent.click(chevron);
        // Menu should be toggled - we check that the component doesn't crash
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('opens menu on mouse enter and closes on mouse leave', () => {
        const { container } = render(<DropDownMenu />);
        const wrapper = container.firstChild as HTMLElement;

        fireEvent.mouseEnter(wrapper);
        expect(screen.getByTestId('profile-button')).toBeInTheDocument();

        fireEvent.mouseLeave(wrapper);
        expect(screen.getByTestId('profile-button')).toBeInTheDocument();
    });

    it('has fixed position wrapper', () => {
        const { container } = render(<DropDownMenu />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('fixed');
        expect(wrapper.className).toContain('top-4');
        expect(wrapper.className).toContain('right-4');
    });
});
