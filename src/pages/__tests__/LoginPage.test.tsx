import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../LoginPage';

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

const mockLogin = vi.fn();
const mockAuth = {
    isLoggedIn: false,
    isLoading: false,
    login: mockLogin,
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

const mockLoginManager = vi.fn();
vi.mock('../../services/authService', () => ({
    loginManager: (...args: any[]) => mockLoginManager(...args),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.isLoggedIn = false;
        mockAuth.isLoading = false;
    });

    it('renders the login form', () => {
        render(<LoginPage />);
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the header', () => {
        render(<LoginPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders sign up link', () => {
        render(<LoginPage />);
        expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('shows error for empty fields on submit', async () => {
        render(<LoginPage />);
        // The inputs are "required" in HTML, but let's test the JS validation
        // We need to fill in at least something then clear it
        const emailInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        
        fireEvent.change(emailInput, { target: { value: '  ' } });
        fireEvent.change(passwordInput, { target: { value: '  ' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials. Please try again.')).toBeInTheDocument();
        });
    });

    it('shows error for too-long password', async () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'a'.repeat(129) } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials. Please try again.')).toBeInTheDocument();
        });
    });

    it('calls loginManager and navigates on success', async () => {
        mockLoginManager.mockResolvedValue({
            id: 1,
            username: 'testuser',
            email: 'test@test.com',
            role: 'admin',
            message: 'ok',
        });

        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockLoginManager).toHaveBeenCalledWith({
                usernameOrEmail: 'testuser',
                password: 'password123',
            });
            expect(mockLogin).toHaveBeenCalledWith({
                id: 1,
                username: 'testuser',
                email: 'test@test.com',
                role: 'admin',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('shows error on login failure', async () => {
        mockLoginManager.mockRejectedValue(new Error('Auth failed'));

        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'user' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'bad' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Auth failed')).toBeInTheDocument();
        });
    });

    it('shows generic error for non-Error rejection', async () => {
        mockLoginManager.mockRejectedValue('something');

        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'user' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
        });
    });

    it('redirects if already logged in', () => {
        mockAuth.isLoggedIn = true;
        render(<LoginPage />);
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('disables submit button while loading', () => {
        mockAuth.isLoading = true;
        render(<LoginPage />);
        const btn = screen.getByRole('button', { name: /signing in/i });
        expect(btn).toBeDisabled();
    });

    it('shows error when server returns invalid response shape', async () => {
        mockLoginManager.mockResolvedValue({
            message: 'Bad credentials',
        });

        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'user' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Bad credentials')).toBeInTheDocument();
        });
    });
});
