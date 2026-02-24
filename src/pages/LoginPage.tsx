import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { loginManager } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isLoggedIn, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        if (!isAuthLoading && isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isAuthLoading, isLoggedIn, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoading || isAuthLoading) return;
        setError("");

        if (!usernameOrEmail.trim() || !password.trim()) {
            setError("Invalid credentials. Please try again.");
            return;
        }

        if (password.length > 128) {
            setError("Invalid credentials. Please try again.");
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await loginManager({
                usernameOrEmail: usernameOrEmail.trim(),
                password,
            });

            if (
                typeof result.id !== "number" ||
                typeof result.username !== "string" ||
                typeof result.email !== "string" ||
                typeof result.role !== "string"
            ) {
                setError(result?.message || "Authentication failed. Please try again.");
                return;
            }

            setUsernameOrEmail("");
            setPassword("");
            login({
                id: result.id,
                username: result.username,
                email: result.email,
                role: result.role,
            });
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4 pt-16">
            <Header />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-bg-secondary"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-text-secondary">Please sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <div>
                        <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-text-secondary mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="usernameOrEmail"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-bg-tertiary text-text-primary border border-transparent focus:border-accent-primary focus:outline-none transition-colors"
                            placeholder="Enter username or email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-bg-tertiary text-text-primary border border-transparent focus:border-accent-primary focus:outline-none transition-colors"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading || isAuthLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        className="w-full py-3 px-4 rounded-lg bg-accent-primary text-white font-medium hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading || isAuthLoading ? "Signing in..." : "Sign In"}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-text-tertiary text-sm">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-accent-primary hover:underline">
                        Sign up
                    </a>
                </p>
            </motion.div>
        </div>
    );
}

export default LoginPage;
