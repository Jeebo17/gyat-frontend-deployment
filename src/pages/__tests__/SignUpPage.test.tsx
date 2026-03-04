import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUpPage from '../SignUpPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, onClick, disabled, className, type, ...props }: any) => (
            <button onClick={onClick} disabled={disabled} className={className} type={type} {...props}>{children}</button>
        ),
    },
}));

vi.mock('../../components/Header', () => ({
    default: () => <header data-testid="header">Header</header>,
}));

const mockAuth = {
    isLoggedIn: false,
    isLoading: false,
    login: vi.fn(),
    userId: null,
    userName: '',
    email: '',
    role: '',
    refreshAuth: vi.fn(),
    logout: vi.fn(),
};

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => mockAuth,
}));

const mockRegisterManager = vi.fn();
vi.mock('../../services/authService', () => ({
    registerManager: (...args: any[]) => mockRegisterManager(...args),
}));

describe('SignUpPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.isLoggedIn = false;
        mockAuth.isLoading = false;
    });

    it('renders the sign up form', () => {
        render(<SignUpPage />);
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('renders the header', () => {
        render(<SignUpPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders sign in link', () => {
        render(<SignUpPage />);
        expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
        const signInButton = screen.getByText('Sign in');
        expect(signInButton).toBeInTheDocument();
    });

    it('navigates to /login when sign in is clicked', () => {
        render(<SignUpPage />);
        fireEvent.click(screen.getByText('Sign in'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('shows error when fields are empty', async () => {
        render(<SignUpPage />);
        const nameInput = screen.getByLabelText(/^name/i);
        fireEvent.change(nameInput, { target: { value: '  ' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText('Please complete all required fields.')).toBeInTheDocument();
        });
    });

    it('shows error when passwords do not match', async () => {
        render(<SignUpPage />);
        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password1' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password2' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
        });
    });

    it('shows error when password is too short', async () => {
        render(<SignUpPage />);
        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: '123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
        });
    });

    it('calls registerManager and navigates to login on success', async () => {
        mockRegisterManager.mockResolvedValue({});

        render(<SignUpPage />);
        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(mockRegisterManager).toHaveBeenCalledWith({
                username: 'John',
                email: 'john@test.com',
                password: 'password123',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
        });
    });

    it('shows error on registration failure', async () => {
        mockRegisterManager.mockRejectedValue(new Error('Email already in use'));

        render(<SignUpPage />);
        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText('Email already in use')).toBeInTheDocument();
        });
    });

    it('shows generic error for non-Error rejection', async () => {
        mockRegisterManager.mockRejectedValue('oops');

        render(<SignUpPage />);
        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText('Unable to create account. Please try again.')).toBeInTheDocument();
        });
    });

    it('redirects if already logged in', () => {
        mockAuth.isLoggedIn = true;
        render(<SignUpPage />);
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('disables submit button while submitting', async () => {
        mockRegisterManager.mockReturnValue(new Promise(() => {})); // never resolves

        render(<SignUpPage />);
        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /signing up/i })).toBeDisabled();
        });
    });
});
