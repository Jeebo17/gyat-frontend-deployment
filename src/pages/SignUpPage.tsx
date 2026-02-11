import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';

function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('Signup attempt:', { name, email, password, confirmPassword });
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <Header />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-2xl bg-bg-secondary"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-text-secondary">Sign up to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-bg-tertiary text-text-primary border border-transparent focus:border-accent-primary focus:outline-none transition-colors"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-bg-tertiary text-text-primary border border-transparent focus:border-accent-primary focus:outline-none transition-colors"
                            placeholder="Enter your email"
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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-bg-tertiary text-text-primary border border-transparent focus:border-accent-primary focus:outline-none transition-colors"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-4 rounded-lg bg-accent-primary text-white font-medium hover:bg-accent-secondary transition-colors"
                    >
                        Sign Up
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-text-tertiary text-sm">
                    Already have an account?{' '}
                    <a href="#" className="text-accent-primary hover:underline">
                        Sign in
                    </a>
                </p>
            </motion.div>
        </div>
    );
}

export default SignUpPage;
